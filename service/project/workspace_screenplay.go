package project

import (
	"context"
	"encoding/json"
	"fmt"
	"reflect"

	assetmodel "github.com/dever-package/bot/model/asset"
	botmodel "github.com/dever-package/bot/model/energon"
	teammodel "github.com/dever-package/bot/model/team"
	assetservice "github.com/dever-package/bot/service/asset"
	energoninput "github.com/dever-package/bot/service/energon/input"
	"github.com/dever-package/bot/service/team/story"
)

const canvasScreenplayInputKey = "storyboard_screenplay"

// Only a single explicitly selected chapter starts the screenplay step.
func applyCanvasScreenplayInput(ctx context.Context, projectID uint64, input map[string]any, node canvasRunNode, canvas map[string]any, rewrite bool) error {
	delete(input, "_storyboard_action")
	delete(input, canvasScreenplayInputKey)
	delete(input, "storyboard_previous")
	if botmodel.NormalizeOutputType(node.OutputType) != botmodel.OutputTypeStoryboard {
		return nil
	}
	previous, err := canvasPreviousStoryboard(ctx, projectID, node.ID, canvas)
	if err != nil {
		return err
	}
	if previous != nil {
		input["storyboard_previous"] = previous
	}
	references, err := canvasStructuredPromptReferences(node.PromptContent)
	if err != nil {
		return err
	}
	var chapter *canvasPromptReference
	for i, reference := range references {
		if reference.ReferenceType != canvasReferenceTypeAsset || reference.ContentSelection == nil || reference.ContentSelection.Kind != "unit" {
			continue
		}
		if chapter != nil || len(reference.ContentSelection.IDs) != 1 {
			return fmt.Errorf("一个章节分镜请选择一章正文")
		}
		chapter = &references[i]
	}
	if chapter == nil {
		if previous != nil && input[botmodel.StoryboardMaterialsInputKey] == nil {
			input[botmodel.StoryboardMaterialsInputKey] = previous["materials"]
		}
		return nil
	}
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return err
	}
	assets := assetservice.NewService()
	workAsset := assets.FindProjectAsset(ctx, projectID, chapter.ReferenceID)
	if workAsset == nil {
		return fmt.Errorf("章节来源不存在")
	}
	root, err := assets.RequireWritingReference(ctx, project.TeamID, chapter.ReferenceID, workAsset.VersionID)
	if err != nil {
		return err
	}
	if root.Asset.ProjectID != projectID {
		return fmt.Errorf("章节来源不属于当前项目")
	}
	work, _ := assetservice.WritingDocument(root.Content)
	if textValue(work["type"]) != "story" {
		return fmt.Errorf("章节分镜来源必须是故事")
	}
	unit := writingUnitsByID(work)[chapter.ContentSelection.IDs[0]]
	if unit == nil {
		return fmt.Errorf("所选章节不存在")
	}
	body, err := assets.RequireWritingReference(ctx, project.TeamID, uint64Value(unit["asset_id"]), uint64Value(unit["version_id"]))
	if err != nil {
		return err
	}
	if !sameWritingCollection(root.Asset, body.Asset) {
		return fmt.Errorf("正文单元不属于引用作品")
	}
	document, ok := assetservice.WritingDocument(body.Content)
	if !ok || textValue(document["type"]) != "writing_unit" || textValue(document["unit_id"]) != textValue(unit["id"]) || textValue(document["profile"]) != "story" || textValue(document["body"]) == "" {
		return fmt.Errorf("所选章节正文尚未生成或目录不一致")
	}
	if previous != nil {
		previousWork := uint64Value(valueAtPath(previous, "chapter_source", "work_asset_id"))
		if previousWork > 0 && previousWork != root.Asset.ID {
			return fmt.Errorf("跨章接续必须来自同一部故事")
		}
	}
	if input[botmodel.StoryboardMaterialsInputKey] == nil {
		materials := []any{}
		for _, section := range canvasStorySettingSections {
			for _, raw := range sliceValue(mapValue(work["outline"])[section.section]) {
				entity := mapValue(raw)
				materials = append(materials, map[string]any{"id": entity["id"], "type": section.materialType, "name": entity["name"], "prompt": entity["description"]})
			}
		}
		input[botmodel.StoryboardMaterialsInputKey] = materials
	}
	source := map[string]any{"work_asset_id": root.Asset.ID, "work_version_id": root.Version.ID, "unit_id": unit["id"], "asset_id": body.Asset.ID, "version_id": body.Version.ID}
	context := map[string]any{"source": source, "title": unit["title"], "source_passages": story.SourcePassages(textValue(document["body"]))}
	if rewrite {
		input[canvasScreenplayInputKey] = context
		return nil
	}
	// Read the saved screenplay, never an editable client result_output.
	current, err := canvasSavedStoryboard(ctx, projectID, canvasNodeByID(node.ID, canvas), false)
	if err != nil {
		return err
	}
	if current != nil && mapValue(current["screenplay"]) != nil {
		script := mapValue(current["screenplay"])
		savedSource := cloneInput(mapValue(script["source"]))
		currentSource := cloneInput(source)
		delete(savedSource, "work_version_id")
		delete(currentSource, "work_version_id")
		if jsonText(savedSource, "") != jsonText(currentSource, "") || jsonText(script["source_passages"], "") != jsonText(context["source_passages"], "") {
			return fmt.Errorf("章节正文版本已变化，请重新生成剧本后再制作分镜")
		}
		if jsonText(current["previous_storyboard"], "") != jsonText(previous, "") {
			return fmt.Errorf("前章分镜或接线已变化，请重新生成剧本")
		}
		context["screenplay"] = script
	}
	input[canvasScreenplayInputKey] = context
	return nil
}

func canvasScreenplayRequestID(requestID, nodeID string) string {
	return canvasChildRequestID(requestID, nodeID+":screenplay")
}

// Both stages use the existing durable power runner. Recovery reopens the
// same screenplay receipt before continuing rather than submitting it again.
func (s WorkspaceService) runCanvasChapterScreenplay(ctx context.Context, projectID uint64, req CanvasRunRequest, run *teammodel.Run, node canvasRunNode, nodeRunID uint64, input, params map[string]any, references []energoninput.MediaReference) (map[string]any, error) {
	chapter := mapValue(input[canvasScreenplayInputKey])
	if chapter == nil || chapter["screenplay"] != nil {
		return nil, nil
	}
	result, err := s.runCanvasPowerRequest(ctx, projectID, req, run, node, nodeRunID, canvasScreenplayRequestID(req.RequestID, node.ID), input, params, references, nil)
	if err != nil || canvasRunStatus(result) != teammodel.RunStatusSuccess {
		return result, err
	}
	// Save the intermediate version under its own request ID. Final shots
	// use the normal ID so saving them cannot resolve to the draft receipt.
	stageRequest := req
	stageRequest.RequestID = canvasScreenplayRequestID(req.RequestID, node.ID)
	result, err = s.saveWorkspaceCanvasMaterial(ctx, projectID, stageRequest, run, node, nodeRunID, result)
	if err != nil {
		return result, err
	}
	document, ok := storyboardDocument(result["output"])
	if !ok || mapValue(document["screenplay"]) == nil {
		return result, fmt.Errorf("章节剧本结果缺少场次")
	}
	chapter["screenplay"] = document["screenplay"]
	return result, nil
}

func canvasSavedStoryboard(ctx context.Context, projectID uint64, node map[string]any, required bool) (map[string]any, error) {
	id := firstUint64(uint64Value(valueAtPath(node, "asset", "id")), uint64Value(valueAtPath(node, "result_ref", "asset_id")))
	if id == 0 && !required {
		return nil, nil
	}
	assets := assetservice.NewService()
	asset := assets.FindProjectAsset(ctx, projectID, id)
	if asset == nil || asset.Status != assetmodel.StatusCurrent {
		return nil, fmt.Errorf("分镜来源不存在，请刷新画布")
	}
	versionID := firstUint64(uint64Value(valueAtPath(node, "result_ref", "version_id")), uint64Value(valueAtPath(node, "asset", "version_id")), uint64Value(valueAtPath(node, "asset", "version", "id")))
	if versionID != asset.VersionID {
		return nil, fmt.Errorf("分镜来源版本已更新，请刷新画布")
	}
	version := assets.FindVersion(ctx, versionID)
	if version == nil || version.AssetID != asset.ID {
		return nil, fmt.Errorf("分镜来源版本不存在")
	}
	document, ok := storyboardDocument(assetservice.VersionToMap(*version)["content"])
	if !ok {
		return nil, fmt.Errorf("来源不是分镜脚本")
	}
	return document, nil
}

func canvasPreviousStoryboard(ctx context.Context, projectID uint64, nodeID string, canvas map[string]any) (map[string]any, error) {
	var previous map[string]any
	for _, edge := range logicalUpstreamCanvasEdges(nodeID, canvas) {
		source := canvasNodeByID(edge.From, canvas)
		if firstText(source["output_type"], valueAtPath(source, "power", "output_type")) != botmodel.OutputTypeStoryboard {
			continue
		}
		if previous != nil {
			return nil, fmt.Errorf("跨章接续只能连接一个前章分镜")
		}
		document, err := canvasSavedStoryboard(ctx, projectID, source, true)
		if err != nil {
			return nil, err
		}
		shots := sliceValue(document["shots"])
		if storyboardStatus(document) != storyboardWorkflowConfirm || len(shots) == 0 {
			return nil, fmt.Errorf("请先完成并确认前章分镜")
		}
		previous = map[string]any{"node_id": edge.From, "asset_id": firstUint64(uint64Value(valueAtPath(source, "asset", "id")), uint64Value(valueAtPath(source, "result_ref", "asset_id"))), "version_id": firstUint64(uint64Value(valueAtPath(source, "result_ref", "version_id")), uint64Value(valueAtPath(source, "asset", "version_id")), uint64Value(valueAtPath(source, "asset", "version", "id"))), "shot": shots[len(shots)-1], "materials": document["materials"], "chapter_source": valueAtPath(document, "screenplay", "source")}
		parts := sliceValue(valueAtPath(document, "screenplay", "parts"))
		index := int(uint64Value(mapValue(previous["shot"])["scene_index"]))
		if index > 0 && index <= len(parts) {
			previous["scene"] = mapValue(parts[index-1])["scene"]
		}
	}
	return previous, nil
}

func validateCanvasScreenplay(document map[string]any) error {
	script := mapValue(document["screenplay"])
	raw, err := json.Marshal(script)
	if err != nil {
		return err
	}
	var content struct {
		SourcePassages []story.SourcePassage `json:"source_passages"`
	}
	if err = json.Unmarshal(raw, &content); err != nil {
		return err
	}
	parts, err := story.DecodeScreenplay(raw, content.SourcePassages)
	if err != nil {
		return err
	}
	types := map[string]string{}
	for _, raw := range sliceValue(document["materials"]) {
		material := mapValue(raw)
		types[textValue(material["id"])] = textValue(material["type"])
	}
	return story.ValidateScriptStates(parts, types, mapValue(document["previous_storyboard"]) != nil)
}

func editableCanvasScreenplay(current, incoming map[string]any) error {
	if !reflect.DeepEqual(current["chapter_boundary"], incoming["chapter_boundary"]) {
		return fmt.Errorf("不能修改跨章接续记录")
	}
	original, next := mapValue(current["screenplay"]), mapValue(incoming["screenplay"])
	if original == nil {
		if next != nil {
			return fmt.Errorf("不能自行添加剧本来源")
		}
		return nil
	}
	if next == nil {
		return fmt.Errorf("不能删除章节剧本")
	}
	// Provenance and calculated state remain server-owned; the editor changes scene text only.
	copyNext := cloneInput(next)
	copyNext["parts"] = original["parts"]
	if !reflect.DeepEqual(copyNext, original) || !reflect.DeepEqual(current["previous_storyboard"], incoming["previous_storyboard"]) {
		return fmt.Errorf("不能修改剧本来源或接续记录")
	}
	oldParts, newParts := sliceValue(original["parts"]), sliceValue(next["parts"])
	if len(oldParts) != len(newParts) {
		return fmt.Errorf("不能更改场次原文范围")
	}
	for i, raw := range newParts {
		part := cloneInput(mapValue(raw))
		old := mapValue(oldParts[i])
		part["description"] = old["description"]
		if !reflect.DeepEqual(part, old) {
			return fmt.Errorf("只能编辑场次剧本文字")
		}
	}
	if len(sliceValue(incoming["shots"])) == 0 {
		return validateCanvasScreenplay(incoming)
	}
	if !reflect.DeepEqual(original, next) {
		return fmt.Errorf("已有分镜，不能直接改写剧本依据")
	}
	return nil
}

func canvasChapterFrameSourceAllowed(storyboardID string, source canvasRunNode, canvas map[string]any) bool {
	node := canvasNodeByID(storyboardID, canvas)
	document, ok := storyboardDocument(firstPresent(valueAtPath(node, "asset", "version", "content"), node["result_output"]))
	if !ok {
		return false
	}
	boundary := mapValue(document["chapter_boundary"])
	return boundary != nil && canvasStoryboardItemType(source) == "shot" && canvasStoryboardSourceNodeID(source) == textValue(boundary["node_id"]) && firstText(source.StoryboardItem["item_id"], source.StoryboardItem["itemId"]) == textValue(boundary["shot_id"])
}

// Recheck the graph and both saved versions before using another chapter's video.
func validateCanvasChapterDependency(ctx context.Context, projectID uint64, node canvasRunNode, canvas map[string]any) error {
	if kind := canvasStoryboardItemType(node); kind != "shot" && kind != "shot_image" {
		return nil
	}
	sourceID := canvasStoryboardSourceNodeID(node)
	if sourceID == "" {
		return nil
	}
	document, err := canvasSavedStoryboard(ctx, projectID, canvasNodeByID(sourceID, canvas), true)
	if err != nil {
		return err
	}
	boundary := mapValue(document["chapter_boundary"])
	if boundary == nil {
		return nil
	}
	previous, err := canvasPreviousStoryboard(ctx, projectID, sourceID, canvas)
	if err != nil {
		return err
	}
	if jsonText(previous, "") != jsonText(document["previous_storyboard"], "") {
		return fmt.Errorf("前章分镜已改变，请重新生成本章分镜后接续")
	}
	shots := sliceValue(document["shots"])
	if len(shots) == 0 {
		return fmt.Errorf("本章缺少镜头")
	}
	first := mapValue(shots[0])
	if firstText(node.StoryboardItem["item_id"], node.StoryboardItem["itemId"]) != textValue(first["id"]) {
		return nil
	}
	kind, connection := canvasStoryboardItemType(node), textValue(boundary["connection"])
	if (connection == "continue" && kind != "shot") || (connection == "match" && kind != "shot_image") {
		return nil
	}
	id, has, err := canvasStoryboardContinuationDependencyID(node)
	if err != nil {
		return err
	}
	if !has {
		return fmt.Errorf("跨章首镜缺少前章视频依赖，请刷新制作节点")
	}
	dependency := canvasNodeByID(id, canvas)
	metadata := mapValue(dependency["storyboard_item"])
	if textValue(metadata["source_node_id"]) != textValue(boundary["node_id"]) || textValue(metadata["item_type"]) != "shot" || textValue(metadata["item_id"]) != textValue(boundary["shot_id"]) {
		return fmt.Errorf("跨章首镜只能引用已连接前章的最后一个视频")
	}
	return nil
}
