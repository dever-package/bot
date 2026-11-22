package project

import (
	"context"
	"fmt"

	assetmodel "github.com/dever-package/bot/model/asset"
	botmodel "github.com/dever-package/bot/model/energon"
	teammodel "github.com/dever-package/bot/model/team"
	workspacemodel "github.com/dever-package/bot/model/workspace"
	assetservice "github.com/dever-package/bot/service/asset"
	energonservice "github.com/dever-package/bot/service/energon"
)

type StorySettingImageRequest struct {
	CanvasID  uint64
	NodeID    string
	AssetID   uint64
	VersionID uint64
	RequestID string
}

// A replacement is a material version bound to the current story definition,
// using the same asset path as generated setting images.
func (s WorkspaceService) ReplaceStorySettingImage(ctx context.Context, projectID uint64, req StorySettingImageRequest) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	row, err := requireProjectCanvas(ctx, projectID, req.CanvasID, 0)
	if err != nil {
		return nil, err
	}
	canvas := canvasPayload(*row)
	node := canvasNodeByID(req.NodeID, canvas)
	item := mapValue(node["storyboard_item"])
	storyID := textValue(item["source_node_id"])
	group := canvasStorySettingGroup(storyID, canvas)
	if group == nil || req.RequestID == "" {
		return nil, fmt.Errorf("请选择已保存的共用设定形象")
	}
	document, err := canvasStorySettingProductionDocument(ctx, projectID, canvasNodeByID(storyID, canvas), canvas)
	if err != nil {
		return nil, err
	}
	definition, err := canvasStorySettingDefinition(document, item)
	if err != nil {
		return nil, err
	}
	reference, err := s.project.asset.RequireCurrentReference(ctx, project.TeamID, req.AssetID, req.VersionID)
	if err != nil {
		return nil, err
	}
	if reference.Asset.Kind != assetmodel.KindImage || reference.Version.ID != req.VersionID {
		return nil, fmt.Errorf("替换素材必须是当前版本的图片")
	}
	return s.project.SaveAsset(ctx, projectID, SaveAssetRequest{
		CanvasID: req.CanvasID, AssetCateID: uint64Value(node["asset_cate_id"]),
		RequestID: req.RequestID, NodeKey: req.NodeID, Name: textValue(node["title"]),
		Kind: assetmodel.KindImage, Role: assetmodel.RoleMaterial, Content: reference.Content,
		Source: map[string]any{"story_setting": definition, "reference_asset_id": reference.Asset.ID, "reference_version_id": reference.Version.ID},
	})
}

const canvasSharedStorySettingExecutionKey = "shared_story_setting_execution_id"

func canvasStorySettingShareable(req CanvasRunRequest, node canvasRunNode) bool {
	return req.ExecutionScope == canvasExecutionScopeStoryboardFrame &&
		valueAtPath(node.StoryboardItem, canvasStoryboardProductionPreparedKey, "story_setting") != nil
}

func claimCanvasStorySettingAttempt(ctx context.Context, projectID uint64, req CanvasRunRequest, run *teammodel.Run, node canvasRunNode, nodeRunID uint64) (*workspacemodel.NodeExecution, error) {
	return withWorkspaceAssetLock(ctx, projectID, []string{"shared_image", fmt.Sprint(req.CanvasID), node.ID}, func() (*workspacemodel.NodeExecution, error) {
		previous := workspacemodel.NewNodeExecutionModel().Find(ctx, map[string]any{
			"project_id": projectID, "canvas_id": req.CanvasID, "node_key": node.ID, "run_id": map[string]any{"neq": run.ID},
			"or": []any{
				map[string]any{"child_request_id": map[string]any{"neq": ""}},
				map[string]any{"status": teammodel.RunStatusSuccess, "asset_id": map[string]any{"gt": 0}},
			},
		}, map[string]any{"order": "main.id desc"})
		if previous != nil && (previous.Status == teammodel.RunStatusRunning || previous.Status == teammodel.RunStatusSuccess) {
			savedNode := mapValue(valueAtPath(mapValue(jsonValue(previous.Input, map[string]any{})), "node"))
			if canvasStorySettingAttemptKey(savedNode) == canvasStorySettingAttemptKey(canvasRunNodeInput(node)) {
				return previous, nil
			}
		}
		trackWorkspaceNodeChildRun(ctx, projectID, run.ID, nodeRunID, node.ID, 0, canvasChildRequestID(req.RequestID, node.ID))
		return nil, nil
	})
}

func canvasSharedStorySettingResult(owner *workspacemodel.NodeExecution) (map[string]any, error) {
	if owner == nil {
		return nil, fmt.Errorf("共用设定的原执行记录不存在")
	}
	switch owner.Status {
	case teammodel.RunStatusRunning, teammodel.RunStatusPending, teammodel.RunStatusWaiting:
		return map[string]any{"status": teammodel.RunStatusRunning, canvasSharedStorySettingExecutionKey: owner.ID}, nil
	case teammodel.RunStatusSuccess:
		result := firstCanvasNodeResult(mapValue(jsonValue(owner.Output, map[string]any{})))
		if owner.AssetID == 0 || owner.VersionID == 0 || mapValue(result["asset"]) == nil {
			return nil, fmt.Errorf("共用设定未保存可用图片")
		}
		return map[string]any{"status": teammodel.RunStatusSuccess, "asset": result["asset"], "version": result["version"], "output": result["output"]}, nil
	default:
		return nil, fmt.Errorf("共用设定生成未完成：%s", firstText(owner.Error, owner.Status))
	}
}

func canvasStorySettingAttemptKey(node map[string]any) string {
	return jsonText(map[string]any{
		"definition": valueAtPath(node, "storyboard_item", canvasStoryboardProductionPreparedKey, "story_setting"),
		"prompt":     node["composer_prompt"], "params": node["param_values"],
		"power_id": node["power_id"], "power_key": node["power_key"], "target_id": node["selected_target_id"],
	}, "")
}

var canvasStorySettingSections = []struct{ section, materialType string }{
	{"characters", "character"},
	{"locations", "scene"},
	{"props", "prop"},
}

// A setting power owns shared characters, scenes and props for connected storyboards.
func canvasStorySettingGroup(storyNodeID string, canvas map[string]any) map[string]any {
	node := canvasNodeByID(storyNodeID, canvas)
	if botmodel.NormalizeOutputType(textValue(node["output_type"])) == botmodel.OutputTypeSetting {
		return node
	}
	return nil
}

func canvasStoryboardSettingNodes(nodeID string, canvas map[string]any) map[string]map[string]any {
	members := map[string]map[string]any{}
	for _, edge := range logicalUpstreamCanvasEdges(nodeID, canvas) {
		group := canvasStorySettingGroup(edge.From, canvas)
		if group == nil {
			continue
		}
		storyNodeID := textValue(group["id"])
		for _, raw := range sliceValue(canvas["nodes"]) {
			member := mapValue(raw)
			item := mapValue(member["storyboard_item"])
			if textValue(item["source_node_id"]) != storyNodeID {
				continue
			}
			kind := textValue(item["item_type"])
			if kind != "character" && kind != "scene" && kind != "prop" {
				continue
			}
			members[textValue(member["id"])] = member
		}
	}
	return members
}

func applyCanvasStorySettingInput(ctx context.Context, projectID uint64, input map[string]any, node canvasRunNode, canvas map[string]any) error {
	if botmodel.NormalizeOutputType(node.OutputType) != botmodel.OutputTypeStoryboard {
		return nil
	}
	members := canvasStoryboardSettingNodes(node.ID, canvas)
	settingID := ""
	for _, edge := range logicalUpstreamCanvasEdges(node.ID, canvas) {
		if group := canvasStorySettingGroup(edge.From, canvas); group != nil {
			id := textValue(group["id"])
			if settingID != "" && settingID != id {
				return fmt.Errorf("一个分镜只能连接一个共用设定，请将素材放在同一个设定节点中")
			}
			settingID = id
		}
	}
	if settingID != "" && len(members) == 0 {
		return fmt.Errorf("请先生成共用设定")
	}
	if len(members) == 0 {
		return nil
	}
	materials := []any{}
	documents := map[string]map[string]any{}
	// Preserve canvas order rather than map iteration order in model input.
	for _, raw := range sliceValue(canvas["nodes"]) {
		member := members[textValue(mapValue(raw)["id"])]
		if member == nil {
			continue
		}
		item := mapValue(member["storyboard_item"])
		storyID := textValue(item["source_node_id"])
		document := documents[storyID]
		if document == nil {
			var err error
			document, err = canvasStorySettingProductionDocument(ctx, projectID, canvasNodeByID(storyID, canvas), canvas)
			if err != nil {
				return err
			}
			documents[storyID] = document
		}
		definition, err := canvasStorySettingDefinition(document, item)
		if err != nil {
			return err
		}
		for _, raw := range sliceValue(document["materials"]) {
			material := mapValue(raw)
			if material["id"] == definition["id"] && textValue(material["voice"]) != "" {
				definition["voice"] = material["voice"]
			}
		}
		materials = append(materials, definition)
	}
	input[botmodel.StoryboardMaterialsInputKey] = materials
	return nil
}

// Read the saved power result, not editable material cards from the canvas.
func canvasStorySettingProductionDocument(ctx context.Context, projectID uint64, source map[string]any, canvas map[string]any) (map[string]any, error) {
	if canvasStorySettingGroup(textValue(source["id"]), canvas) == nil {
		return nil, fmt.Errorf("共用设定节点不存在")
	}
	assets := assetservice.NewService()
	assetID := firstUint64(uint64Value(valueAtPath(source, "result_ref", "asset_id")), uint64Value(valueAtPath(source, "asset", "id")))
	asset := assets.FindProjectAsset(ctx, projectID, assetID)
	if asset == nil || asset.Status != assetmodel.StatusCurrent {
		return nil, fmt.Errorf("请先生成共用设定")
	}
	version := assets.FindVersion(ctx, asset.VersionID)
	if version == nil || version.AssetID != asset.ID {
		return nil, fmt.Errorf("设定当前版本不存在")
	}
	requested := firstUint64(uint64Value(valueAtPath(source, "result_ref", "version_id")), uint64Value(valueAtPath(source, "asset", "version_id")))
	if requested != version.ID {
		return nil, fmt.Errorf("共用设定已更新，请刷新画布")
	}
	document, ok := findWorkspaceDocument(assetservice.VersionToMap(*version)["content"], botmodel.OutputTypeSetting, storyboardWrapperKeys[:])
	if !ok {
		return nil, fmt.Errorf("设定内容格式无效")
	}
	document, err := energonservice.NormalizeSettingDocument(document)
	if err != nil {
		return nil, err
	}
	document["style_prompt_input"] = document["style_prompt"]
	return document, nil
}

func canvasStorySettingDefinition(document, item map[string]any) (map[string]any, error) {
	for _, raw := range sliceValue(document["materials"]) {
		material := mapValue(raw)
		if textValue(material["id"]) != textValue(item["item_id"]) {
			continue
		}
		if textValue(material["type"]) != textValue(item["item_type"]) || textValue(material["prompt"]) != textValue(item["generated_prompt"]) {
			return nil, fmt.Errorf("共用设定已更新，请更新设定后再制作")
		}
		return map[string]any{
			"id": material["id"], "type": material["type"],
			"name": material["name"], "prompt": material["prompt"],
			"visual_mode": textValue(document["visual_mode"]), "style_prompt": textValue(document["style_prompt"]),
			"aspect_ratio":       textValue(document["aspect_ratio"]),
			"style_prompt_input": textValue(document["style_prompt_input"]),
		}, nil
	}
	return nil, fmt.Errorf("共用设定条目已移除，请更新分镜引用")
}

func validateCanvasStoryboardSettings(ctx context.Context, projectID uint64, nodeID string, board, canvas map[string]any) error {
	documents := map[string]map[string]any{}
	for _, member := range canvasStoryboardSettingNodes(nodeID, canvas) {
		item := mapValue(member["storyboard_item"])
		storyID := textValue(item["source_node_id"])
		document := documents[storyID]
		if document == nil {
			var err error
			document, err = canvasStorySettingProductionDocument(ctx, projectID, canvasNodeByID(storyID, canvas), canvas)
			if err != nil {
				return err
			}
			documents[storyID] = document
			for _, key := range []string{"visual_mode", "style_prompt", "aspect_ratio"} {
				if board[key] != document[key] {
					return fmt.Errorf("全片画风或画幅已更新，请先重做分镜；已有视频保留")
				}
			}
		}
		definition, err := canvasStorySettingDefinition(document, item)
		if err != nil {
			return err
		}
		for _, raw := range sliceValue(board["materials"]) {
			material := mapValue(raw)
			if material["id"] != definition["id"] {
				continue
			}
			if material["name"] != definition["name"] || material["prompt"] != definition["prompt"] || material["type"] != definition["type"] {
				return fmt.Errorf("共用设定“%s”已更新，请先重做分镜；已有视频保留", definition["name"])
			}
		}
	}
	return nil
}

func canvasStoryboardFrameSourceAllowed(storyboardID string, source canvasRunNode, canvas map[string]any) bool {
	owner := canvasStoryboardSourceNodeID(source)
	return owner == "" || owner == storyboardID || canvasStoryboardSettingNodes(storyboardID, canvas)[source.ID] != nil || canvasChapterFrameSourceAllowed(storyboardID, source, canvas)
}

func canvasStorySettingResultDefinition(ctx context.Context, projectID, runID uint64, node canvasRunNode, canvas map[string]any) (any, error) {
	definition := valueAtPath(node.StoryboardItem, canvasStoryboardProductionPreparedKey, "story_setting")
	if definition != nil || canvasStorySettingGroup(canvasStoryboardSourceNodeID(node), canvas) == nil {
		return definition, nil
	}
	// The normal path already holds the prepared definition. Only a recovered
	// child result needs to read its original execution snapshot.
	execution := workspacemodel.NewNodeExecutionModel().Find(ctx, map[string]any{
		"project_id": projectID, "run_id": runID, "node_key": node.ID,
	})
	if execution != nil {
		definition = valueAtPath(mapValue(jsonValue(execution.Input, map[string]any{})), "node", "storyboard_item", canvasStoryboardProductionPreparedKey, "story_setting")
	}
	if definition == nil {
		return nil, fmt.Errorf("共用形象缺少生成时的设定记录，请重新生成")
	}
	return definition, nil
}

func validateCanvasStorySettingReferences(ctx context.Context, projectID uint64, node canvasRunNode, canvas map[string]any, checked map[string]bool, completed ...[]canvasNodeResult) error {
	members := canvasStoryboardSettingNodes(canvasStoryboardSourceNodeID(node), canvas)
	for _, id := range canvasStoryboardSourceIDs(node) {
		member := members[id]
		if member == nil || checked[id] {
			continue
		}
		item := mapValue(member["storyboard_item"])
		document, err := canvasStorySettingProductionDocument(ctx, projectID, canvasNodeByID(textValue(item["source_node_id"]), canvas), canvas)
		if err != nil {
			return err
		}
		expected, err := canvasStorySettingDefinition(document, item)
		if err != nil {
			return err
		}
		assets := assetservice.NewService()
		if len(completed) > 0 {
			if result := lastCanvasNodeResult(completed[0], id); len(result) > 0 && canvasRunStatus(result) == "success" {
				member = cloneInput(member)
				member["asset"] = result["asset"]
				member["result_ref"] = map[string]any{"asset_id": valueAtPath(result, "asset", "id"), "version_id": valueAtPath(result, "version", "id")}
			}
		}
		asset := assets.FindProjectAsset(ctx, projectID, firstUint64(uint64Value(valueAtPath(member, "result_ref", "asset_id")), uint64Value(valueAtPath(member, "asset", "id"))))
		if asset == nil || asset.Status != assetmodel.StatusCurrent {
			return fmt.Errorf("请先生成共用形象“%s”", member["title"])
		}
		versionID := firstUint64(uint64Value(valueAtPath(member, "result_ref", "version_id")), uint64Value(valueAtPath(member, "asset", "version_id")))
		version := assets.FindVersion(ctx, versionID)
		if version == nil || version.AssetID != asset.ID {
			return fmt.Errorf("共用形象版本无效，请刷新画布")
		}
		saved := mapValue(valueAtPath(assetservice.VersionToMap(*version), "source", "story_setting"))
		for key, value := range expected {
			if jsonText(saved[key], "") != jsonText(value, "") {
				return fmt.Errorf("共用设定“%s”已更新，请先更新形象；旧图和已有视频仍保留", member["title"])
			}
		}
		if checked != nil {
			checked[id] = true
		}
	}
	return nil
}

// 设定能力只接收映射后的输入，previous_output 不会进入模型；把引用的上游正文/大纲显式交给设定。
func applyCanvasSettingSourceInput(input map[string]any, node canvasRunNode, previousOutput any) {
	if botmodel.NormalizeOutputType(node.OutputType) != botmodel.OutputTypeSetting {
		return
	}
	if text := canvasContextText(previousOutput); text != "" {
		input[botmodel.SettingSourceInputKey] = text
	}
}
