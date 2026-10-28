package project

import (
	"context"
	"fmt"
	"reflect"
	"strings"

	assetmodel "github.com/dever-package/bot/model/asset"
	botmodel "github.com/dever-package/bot/model/energon"
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
	if prepared := mapValue(node.StoryboardItem[canvasStoryboardProductionPreparedKey]); prepared != nil {
		node.ImageSequenceFixedConstraints = canvasStringList(prepared["image_sequence_fixed_constraints"])
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
	if itemType == "shot" {
		if err := validateCanvasStoryboardSharedFrameMetadata(node.StoryboardItem, document); err != nil {
			return node, err
		}
	}
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
	// 预检画布会再次解析，恢复和单独执行也必须保留同一份内部投影。
	constraints := make([]any, len(node.ImageSequenceFixedConstraints))
	for index, constraint := range node.ImageSequenceFixedConstraints {
		constraints[index] = constraint
	}
	node.StoryboardItem[canvasStoryboardProductionPreparedKey] = map[string]any{
		"image_sequence_fixed_constraints": constraints,
	}
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

// A shared endpoint is authorized by the confirmed source, never by a mutable canvas label.
func validateCanvasStoryboardSharedFrameMetadata(metadata, document map[string]any) error {
	itemID := firstText(metadata["item_id"], metadata["itemId"])
	for _, value := range sliceValue(document["shots"]) {
		shot := mapValue(value)
		if storyboardText(shot["id"]) != itemID {
			continue
		}
		mode := storyboardText(shot["shot_image_mode"])
		metadataMode := firstText(metadata["shot_image_mode"], metadata["shotImageMode"])
		sharedID := firstText(metadata["shared_end_shot_id"], metadata["sharedEndShotId"])
		if mode != botmodel.StoryboardShotImageNextFirst && metadataMode != botmodel.StoryboardShotImageNextFirst && sharedID == "" {
			return nil
		}
		if mode != metadataMode || sharedID != storyboardText(shot["shared_end_shot_id"]) || sharedID == "" {
			return fmt.Errorf("共享结束画面配置已更新，请刷新分镜制作节点")
		}
		if shotID := firstText(metadata["shot_id"], metadata["shotId"]); shotID != "" && shotID != itemID {
			return fmt.Errorf("共享结束画面的镜头标识不匹配，请刷新分镜制作节点")
		}
		return energonservice.ValidateStoryboardSharedFrames(document)
	}
	return nil // The production projection reports an unknown item.
}

func validateCanvasStoryboardSharedFrameSources(target map[string]any, sources []map[string]any) error {
	sharedID := firstText(target["shared_end_shot_id"], target["sharedEndShotId"])
	if sharedID == "" {
		return nil
	}
	ownID := firstText(target["shot_id"], target["shotId"], target["item_id"], target["itemId"])
	owner := firstText(target["source_node_id"], target["sourceNodeId"])
	seen := map[string]bool{}
	for _, source := range sources {
		itemID := firstText(source["item_id"], source["itemId"])
		id := firstText(source["shot_id"], source["shotId"], itemID)
		sourceOwner := firstText(source["source_node_id"], source["sourceNodeId"])
		if firstText(source["item_type"], source["itemType"]) != "shot_image" || owner == "" || sourceOwner != owner || itemID != id || (id != ownID && id != sharedID) || seen[id] {
			return fmt.Errorf("共享结束画面来源不匹配，请刷新分镜制作节点")
		}
		if _, found := canvasStoryboardPreferredFrameItem(canvasStoryboardFrameMediaItems(source), canvasMediaUsageFirstFrame); !found {
			return fmt.Errorf("共享结束画面来源缺少首帧")
		}
		seen[id] = true
	}
	if !seen[ownID] || !seen[sharedID] || ownID == sharedID {
		return fmt.Errorf("共享结束画面必须引用本镜和相邻下一镜的首帧")
	}
	return nil
}
