package project

import (
	"context"
	"fmt"
	"reflect"
	"strings"

	assetmodel "github.com/dever-package/bot/model/asset"
	assetservice "github.com/dever-package/bot/service/asset"
	energonservice "github.com/dever-package/bot/service/energon"
)

const canvasStoryboardProductionPreparedKey = "_production_prepared"

func prepareCanvasStoryboardProductionNode(
	ctx context.Context,
	projectID uint64,
	canvas map[string]any,
	node canvasRunNode,
) (canvasRunNode, error) {
	itemType := canvasStoryboardItemType(node)
	if !canvasStoryboardProductionItemType(itemType) {
		return node, nil
	}
	if boolValue(node.StoryboardItem[canvasStoryboardProductionPreparedKey]) {
		return node, nil
	}

	sourceNodeID := canvasStoryboardSourceNodeID(node)
	if sourceNodeID == "" {
		return node, fmt.Errorf("分镜制作节点缺少来源节点")
	}
	document, err := canvasStoryboardProductionDocument(ctx, projectID, sourceNodeID, canvas)
	if err != nil {
		return node, err
	}
	return prepareCanvasStoryboardProductionNodeFromDocument(node, document)
}

func canvasStoryboardProductionItemType(itemType string) bool {
	switch itemType {
	case "character", "scene", "prop", "shot_image", "shot":
		return true
	default:
		return false
	}
}

func canvasStoryboardProductionDocument(
	ctx context.Context,
	projectID uint64,
	sourceNodeID string,
	canvas map[string]any,
) (map[string]any, error) {
	source := canvasNodeByID(sourceNodeID, canvas)
	if source == nil {
		return nil, fmt.Errorf("分镜来源节点不存在")
	}
	document, ok := storyboardDocument(firstPresent(
		valueAtPath(source, "asset", "version", "content"),
		firstPresent(source["result_output"], source["resultOutput"]),
		valueAtPath(source, "result", "output"),
		valueAtPath(source, "result_ref", "output"),
	))
	if !ok {
		return nil, fmt.Errorf("分镜来源内容无效，请刷新画布后重试")
	}
	if storyboardStatus(document) != storyboardWorkflowConfirm {
		return nil, fmt.Errorf("分镜脚本尚未确认")
	}
	assetRef := mapValue(source["asset"])
	resultRef := mapValue(firstPresent(source["result_ref"], source["resultRef"]))
	assetID := firstUint64(uint64Value(assetRef["id"]), uint64Value(resultRef["asset_id"]), uint64Value(resultRef["assetId"]))
	assets := assetservice.NewService()
	asset := assets.FindProjectAsset(ctx, projectID, assetID)
	if asset == nil || asset.Status != assetmodel.StatusCurrent || asset.VersionID == 0 {
		return nil, fmt.Errorf("分镜资产不存在，请刷新画布后重试")
	}
	requestedVersionID := firstUint64(
		uint64Value(resultRef["version_id"]),
		uint64Value(resultRef["versionId"]),
		uint64Value(assetRef["version_id"]),
		uint64Value(valueAtPath(assetRef, "version", "id")),
	)
	if requestedVersionID > 0 && requestedVersionID != asset.VersionID {
		return nil, fmt.Errorf("分镜脚本已更新，请刷新画布后重试")
	}
	version := assets.FindVersion(ctx, asset.VersionID)
	if version == nil || version.AssetID != asset.ID {
		return nil, fmt.Errorf("分镜当前版本不存在，请刷新画布后重试")
	}
	current, ok := storyboardDocument(assetservice.VersionToMap(*version)["content"])
	if !ok || storyboardStatus(current) != storyboardWorkflowConfirm || !reflect.DeepEqual(document, current) {
		return nil, fmt.Errorf("分镜脚本已更新，请刷新画布后重试")
	}
	return document, nil
}

func prepareCanvasStoryboardProductionNodeFromDocument(
	node canvasRunNode,
	document map[string]any,
) (canvasRunNode, error) {
	node.StoryboardItem = cloneInput(node.StoryboardItem)
	itemType := canvasStoryboardItemType(node)
	generatedPrompt := strings.TrimSpace(firstText(
		node.StoryboardItem["generated_prompt"],
		node.StoryboardItem["generatedPrompt"],
	))
	editablePrompt := canvasStoryboardEditablePrompt(node, generatedPrompt)
	projection, err := energonservice.BuildStoryboardProductionPrompt(
		document,
		energonservice.StoryboardProductionPromptRequest{
			ItemType:       itemType,
			ItemID:         firstText(node.StoryboardItem["item_id"], node.StoryboardItem["itemId"]),
			ShotImageMode:  firstText(node.StoryboardItem["shot_image_mode"], node.StoryboardItem["shotImageMode"]),
			FrameRole:      firstText(node.StoryboardItem["frame_role"], node.StoryboardItem["frameRole"]),
			EditablePrompt: editablePrompt,
		},
	)
	if err != nil {
		return node, err
	}

	node.ComposerPrompt = projection.Prompt
	node.ImageSequenceFixedConstraints = append([]string(nil), projection.ImageSequenceFixedConstraints...)

	params := cloneInput(node.ParamValues)
	params["prompt"] = projection.Prompt
	if projection.AspectRatio != "" {
		params["aspectRatio"] = projection.AspectRatio
	}
	if projection.Duration > 0 {
		params["duration"] = projection.Duration
	}
	if itemType == "shot" {
		if projection.ReferenceMode == "" {
			delete(params, "referenceMode")
		} else {
			params["referenceMode"] = projection.ReferenceMode
		}
	}
	node.ParamValues = params

	if itemType == "shot_image" && projection.StartFramePrompt != "" && projection.EndFramePrompt != "" {
		node.StoryboardItem = withCanvasStoryboardFramePrompts(
			node.StoryboardItem,
			projection.StartFramePrompt,
			projection.EndFramePrompt,
		)
	}
	node.StoryboardItem[canvasStoryboardProductionPreparedKey] = true
	return node, nil
}

func canvasStoryboardEditablePrompt(node canvasRunNode, generatedPrompt string) string {
	prompt := strings.TrimSpace(node.ComposerPrompt)
	if prompt == generatedPrompt {
		return ""
	}
	if uint64Value(node.PromptContent["version"]) != 1 {
		return prompt
	}
	// 引用标签由共享编辑器自动插入，不代表用户改写了画面要求。
	var rendered, plain strings.Builder
	for _, raw := range sliceValue(node.PromptContent["parts"]) {
		part := mapValue(raw)
		switch textValue(part["type"]) {
		case "text":
			text, _ := part["text"].(string)
			rendered.WriteString(text)
			plain.WriteString(text)
		case "reference":
			label := textValue(part["label"])
			if !strings.HasPrefix(label, "@") {
				rendered.WriteString("@")
			}
			rendered.WriteString(label)
		}
	}
	if prompt == strings.TrimSpace(rendered.String()) && strings.TrimSpace(plain.String()) == generatedPrompt {
		return ""
	}
	return prompt
}

func withCanvasStoryboardFramePrompts(
	metadata map[string]any,
	startPrompt string,
	endPrompt string,
) map[string]any {
	frames := sliceValue(firstPresent(
		metadata["image_sequence_frames"],
		metadata["imageSequenceFrames"],
	))
	if len(frames) == 0 {
		return metadata
	}
	nextMetadata := cloneInput(metadata)
	nextFrames := make([]any, 0, len(frames))
	for index, raw := range frames {
		frame := cloneInput(mapValue(raw))
		switch index {
		case 0:
			frame["prompt"] = startPrompt
		case 1:
			frame["prompt"] = endPrompt
		}
		nextFrames = append(nextFrames, frame)
	}
	nextMetadata["image_sequence_frames"] = nextFrames
	delete(nextMetadata, "imageSequenceFrames")
	return nextMetadata
}
