package project

import (
	"context"
	"fmt"
	"strings"

	assetservice "github.com/dever-package/bot/service/asset"
	energoninput "github.com/dever-package/bot/service/energon/input"
	teamservice "github.com/dever-package/bot/service/team"
)

const canvasExecutionScopeStoryboardFrame = "storyboard_frame"

func (s WorkspaceService) prepareCanvasExecutionScope(ctx context.Context, projectID uint64, req CanvasRunRequest) (CanvasRunRequest, error) {
	scope := strings.ToLower(strings.TrimSpace(req.ExecutionScope))
	if scope == "" {
		return req, nil
	}
	if scope != canvasExecutionScopeStoryboardFrame {
		return req, fmt.Errorf("不支持的画布执行范围")
	}
	req.ExecutionScope = scope
	return s.prepareCanvasStoryboardFrameRun(ctx, projectID, req)
}

func (s WorkspaceService) prepareCanvasStoryboardFrameRun(ctx context.Context, projectID uint64, req CanvasRunRequest) (CanvasRunRequest, error) {
	sourceNodeID := strings.TrimSpace(req.StartNodeID)
	nodes, _, err := parseCanvasRunGraph(req.Canvas)
	if err != nil {
		return req, err
	}
	nodesByID := canvasRunNodeMap(nodes)
	if _, exists := nodesByID[sourceNodeID]; !exists {
		return req, fmt.Errorf("分镜脚本节点不存在")
	}

	required := make([]canvasRunNode, 0)
	for _, node := range nodes {
		if canvasStoryboardSourceNodeID(node) != sourceNodeID || canvasStoryboardItemOptional(node) {
			continue
		}
		required = append(required, node)
	}
	if len(required) == 0 {
		return req, fmt.Errorf("当前分镜脚本尚未生成制作组")
	}

	currentResults := make(map[string]bool, len(required))
	hasCurrentResult := func(nodeID string) bool {
		if current, exists := currentResults[nodeID]; exists {
			return current
		}
		current := canvasStoryboardNodeHasCurrentResult(ctx, projectID, nodeID, req.Canvas)
		currentResults[nodeID] = current
		return current
	}
	selected := make(map[string]bool, len(required))
	for _, node := range required {
		if canvasStoryboardItemStale(node) || !hasCurrentResult(node.ID) {
			selected[node.ID] = true
		}
	}
	propagateCanvasStoryboardFrameSelection(required, selected)

	compositionID := ""
	for _, node := range required {
		if canvasStoryboardItemType(node) != "video_compose" {
			continue
		}
		compositionID = node.ID
		if len(selected) > 0 {
			selected[node.ID] = true
		}
		break
	}
	if len(selected) == 0 {
		return req, fmt.Errorf("制作区已完成，无需重复执行")
	}

	for _, node := range required {
		if !selected[node.ID] {
			continue
		}
		if !isRunnableCanvasNode(node) {
			return req, fmt.Errorf("“%s”未配置可用能力", canvasRunNodeTitle(node))
		}
		for _, sourceID := range canvasStoryboardSourceIDs(node) {
			source, exists := nodesByID[sourceID]
			if !exists {
				return req, fmt.Errorf("“%s”的前置素材节点不存在", canvasRunNodeTitle(node))
			}
			if sourceNode := canvasStoryboardSourceNodeID(source); sourceNode != "" && sourceNode != sourceNodeID {
				return req, fmt.Errorf("“%s”不能引用其他分镜脚本的素材", canvasRunNodeTitle(node))
			}
			if !selected[sourceID] && !hasCurrentResult(sourceID) {
				return req, fmt.Errorf("请先生成前置素材“%s”", canvasRunNodeTitle(source))
			}
		}
	}
	if err := s.preflightCanvasStoryboardFrame(ctx, projectID, req, required, nodesByID, selected); err != nil {
		return req, err
	}

	runtimeCanvas, err := canvasStoryboardFrameRuntimeCanvas(
		req.Canvas,
		sourceNodeID,
		required,
		selected,
		compositionID,
	)
	if err != nil {
		return req, err
	}
	req.DisplayStartNodeID = sourceNodeID
	req.StartNodeID = canvasStoryboardFrameStartNodeID(sourceNodeID)
	req.SingleNode = false
	req.Canvas = runtimeCanvas
	return req, nil
}

func (s WorkspaceService) preflightCanvasStoryboardFrame(
	ctx context.Context,
	projectID uint64,
	req CanvasRunRequest,
	nodes []canvasRunNode,
	nodesByID map[string]canvasRunNode,
	selected map[string]bool,
) error {
	for _, node := range nodes {
		if !selected[node.ID] || node.Type != "power" || canvasStoryboardItemType(node) == "video_compose" {
			continue
		}
		if node.PowerID == 0 && node.PowerKey == "" {
			continue
		}
		references, err := s.canvasStoryboardPreflightMediaReferences(ctx, projectID, node, nodesByID)
		if err != nil {
			return fmt.Errorf("“%s”预检失败：%w", canvasRunNodeTitle(node), err)
		}
		input := mergeCanvasPromptInput(req.Input, nil, node.ComposerPrompt)
		applyCanvasStoryboardReferenceInput(input, node)
		params := cloneInput(node.ParamValues)
		if canvasContextText(input["prompt"]) != "" && canvasContextText(params["prompt"]) == "" {
			delete(params, "prompt")
		}
		if err := s.project.PreflightCanvasPower(ctx, projectID, teamservice.CanvasPowerRunRequest{
			FlowID:          node.FlowID,
			AssetCateID:     firstUint64(node.AssetCateID, req.AssetCateID),
			NodeKey:         node.ID,
			NodeName:        node.Title,
			Kind:            node.Kind,
			PowerID:         node.PowerID,
			PowerKey:        node.PowerKey,
			SourceTargetID:  node.SelectedTarget,
			Input:           input,
			Params:          params,
			MediaReferences: references,
		}); err != nil {
			return fmt.Errorf("“%s”预检失败：%w", canvasRunNodeTitle(node), err)
		}
	}
	return nil
}

func (s WorkspaceService) canvasStoryboardPreflightMediaReferences(
	ctx context.Context,
	projectID uint64,
	node canvasRunNode,
	nodesByID map[string]canvasRunNode,
) ([]energoninput.MediaReference, error) {
	result := make([]energoninput.MediaReference, 0)
	used := map[string]bool{}
	nextID := uint64(1) << 63
	appendReference := func(kind string, referenceID uint64, usage string, required bool) {
		kind = strings.ToLower(strings.TrimSpace(kind))
		if kind != "image" && kind != "video" && kind != "audio" {
			return
		}
		if referenceID == 0 {
			referenceID = nextID
			nextID++
		}
		key := fmt.Sprintf("%s:%d:%s", kind, referenceID, strings.TrimSpace(usage))
		if used[key] {
			return
		}
		used[key] = true
		result = append(result, energoninput.MediaReference{
			ReferenceType: "preflight",
			ReferenceID:   referenceID,
			Kind:          kind,
			URL:           fmt.Sprintf("https://preflight.invalid/%d.%s", referenceID, kind),
			Usage:         strings.TrimSpace(usage),
			StrictUsage:   strings.TrimSpace(usage) != "",
			Required:      required,
		})
	}

	for _, sourceID := range canvasStringList(firstPresent(
		node.StoryboardItem["reference_node_ids"],
		node.StoryboardItem["referenceNodeIds"],
	)) {
		source, exists := nodesByID[sourceID]
		if !exists {
			return nil, fmt.Errorf("前置参考节点不存在: %s", sourceID)
		}
		appendReference(
			source.Kind,
			source.AssetID,
			canvasStoryboardReferenceUsage(canvasStoryboardItemType(node), canvasStoryboardItemType(source)),
			true,
		)
	}
	externalAssetIDs := map[uint64]bool{}
	for _, value := range sliceValue(firstPresent(
		node.StoryboardItem["external_reference_asset_ids"],
		node.StoryboardItem["externalReferenceAssetIds"],
	)) {
		if assetID := uint64Value(value); assetID > 0 {
			externalAssetIDs[assetID] = true
		}
	}
	promptReferences, err := canvasStructuredPromptReferences(node.PromptContent)
	if err != nil {
		return nil, err
	}
	for _, reference := range canvasPromptBoundReferences(promptReferences) {
		asset, _, err := resolveCanvasReferenceAsset(ctx, projectID, reference)
		if err != nil {
			label := strings.TrimSpace(reference.Label)
			if label == "" {
				label = fmt.Sprintf("%d", reference.AssetID)
			}
			return nil, fmt.Errorf("参考资产“%s”不可用: %w", label, err)
		}
		appendReference(
			textValue(asset["kind"]),
			reference.AssetID,
			reference.Usage,
			reference.Required || externalAssetIDs[reference.AssetID],
		)
	}
	if canvasStoryboardItemType(node) == "shot" && firstText(
		node.StoryboardItem["continuity_anchor"],
		node.StoryboardItem["continuityAnchor"],
	) != "" {
		appendReference("image", 0, canvasMediaUsageFirstFrame, true)
	}
	return result, nil
}

func propagateCanvasStoryboardFrameSelection(nodes []canvasRunNode, selected map[string]bool) {
	changed := true
	for changed {
		changed = false
		for _, node := range nodes {
			if selected[node.ID] || canvasStoryboardItemType(node) == "video_compose" {
				continue
			}
			for _, sourceID := range canvasStoryboardSourceIDs(node) {
				if !selected[sourceID] {
					continue
				}
				selected[node.ID] = true
				changed = true
				break
			}
		}
	}
}

func canvasStoryboardFrameRuntimeCanvas(
	canvas map[string]any,
	sourceNodeID string,
	required []canvasRunNode,
	selected map[string]bool,
	compositionID string,
) (map[string]any, error) {
	runtimeCanvas := cloneCanvasObject(canvas)
	scriptGroupIDs := map[string]bool{}
	for _, raw := range sliceValue(canvas["nodes"]) {
		row := mapValue(raw)
		group := mapValue(row["group"])
		if textValue(group["origin"]) == "script" && firstText(group["source_node_id"], group["sourceNodeId"]) == sourceNodeID {
			scriptGroupIDs[textValue(row["id"])] = true
		}
	}

	runtimeNodes := make([]any, 0, len(sliceValue(canvas["nodes"]))+1)
	for _, raw := range sliceValue(canvas["nodes"]) {
		row := cloneInput(mapValue(raw))
		if groupID := textValue(firstPresent(row["group_id"], row["groupId"])); scriptGroupIDs[groupID] && !selected[textValue(row["id"])] {
			delete(row, "group_id")
			delete(row, "groupId")
		}
		runtimeNodes = append(runtimeNodes, row)
	}
	startNodeID := canvasStoryboardFrameStartNodeID(sourceNodeID)
	runtimeNodes = append(runtimeNodes, map[string]any{
		"id":          startNodeID,
		"type":        "function",
		"title":       "分镜制作区",
		"subtitle":    "按依赖层级并行执行",
		"description": "",
		"x":           0,
		"y":           0,
		"width":       1,
		"height":      1,
		"function_option": map[string]any{
			"key":   "start",
			"label": "开始",
		},
	})

	requiredByID := canvasRunNodeMap(required)
	edges := make([]any, 0, len(selected)*3)
	seen := map[string]bool{}
	unitIncoming := map[string]bool{}
	selectedUnits := map[string]bool{}
	appendEdge := func(from string, to string) {
		from = strings.TrimSpace(from)
		to = strings.TrimSpace(to)
		if from == "" || to == "" || from == to {
			return
		}
		key := from + "\x00" + to
		if seen[key] {
			return
		}
		seen[key] = true
		edges = append(edges, map[string]any{
			"id":   fmt.Sprintf("storyboard-frame-edge-%d", len(edges)+1),
			"from": from,
			"to":   to,
		})
	}
	unitID := func(node canvasRunNode) string {
		if node.GroupID != "" {
			return node.GroupID
		}
		return node.ID
	}

	selectedUnitOrder := make([]string, 0, len(selected))
	for _, node := range required {
		if !selected[node.ID] {
			continue
		}
		currentUnitID := unitID(node)
		if !selectedUnits[currentUnitID] {
			selectedUnitOrder = append(selectedUnitOrder, currentUnitID)
		}
		selectedUnits[currentUnitID] = true
	}
	for _, target := range required {
		if !selected[target.ID] {
			continue
		}
		targetUnitID := unitID(target)
		for _, sourceID := range canvasStoryboardSourceIDs(target) {
			if !selected[sourceID] {
				continue
			}
			source := requiredByID[sourceID]
			sourceUnitID := unitID(source)
			if sourceUnitID == targetUnitID {
				appendEdge(source.ID, target.ID)
				continue
			}
			appendEdge(sourceUnitID, targetUnitID)
			unitIncoming[targetUnitID] = true
		}
	}
	if selected[compositionID] {
		composition := requiredByID[compositionID]
		compositionUnitID := unitID(composition)
		for _, sourceUnitID := range selectedUnitOrder {
			if sourceUnitID == compositionUnitID {
				continue
			}
			appendEdge(sourceUnitID, compositionUnitID)
			unitIncoming[compositionUnitID] = true
		}
	}
	for _, currentUnitID := range selectedUnitOrder {
		if !unitIncoming[currentUnitID] {
			appendEdge(startNodeID, currentUnitID)
		}
	}
	if len(edges) == 0 {
		return nil, fmt.Errorf("制作区没有可执行节点")
	}
	runtimeCanvas["nodes"] = runtimeNodes
	runtimeCanvas["edges"] = edges
	return runtimeCanvas, nil
}

func canvasStoryboardNodeHasCurrentResult(ctx context.Context, projectID uint64, nodeID string, canvas map[string]any) bool {
	node := canvasNodeByID(nodeID, canvas)
	if node == nil {
		return false
	}
	if assetservice.HasContent(firstPresent(node["result_output"], node["resultOutput"], valueAtPath(node, "result", "output"))) {
		return true
	}
	resultRef := mapValue(firstPresent(node["result_ref"], node["resultRef"]))
	if assetID := firstUint64(uint64Value(resultRef["asset_id"]), uint64Value(resultRef["assetId"])); assetID > 0 {
		asset := hydrateCanvasAsset(ctx, projectID, map[string]any{
			"id":         assetID,
			"version_id": firstUint64(uint64Value(resultRef["version_id"]), uint64Value(resultRef["versionId"])),
		})
		if assetservice.HasContent(valueAtPath(asset, "version", "content")) {
			return true
		}
	}
	asset := hydrateCanvasAsset(ctx, projectID, mapValue(node["asset"]))
	return assetservice.HasContent(valueAtPath(asset, "version", "content"))
}

func canvasStoryboardSourceNodeID(node canvasRunNode) string {
	return firstText(node.StoryboardItem["source_node_id"], node.StoryboardItem["sourceNodeId"])
}

func canvasStoryboardItemType(node canvasRunNode) string {
	return firstText(node.StoryboardItem["item_type"], node.StoryboardItem["itemType"])
}

func canvasStoryboardItemOptional(node canvasRunNode) bool {
	return boolValue(node.StoryboardItem["optional"])
}

func canvasStoryboardItemStale(node canvasRunNode) bool {
	return boolValue(node.StoryboardItem["stale"])
}

func canvasStoryboardSourceIDs(node canvasRunNode) []string {
	result := make([]string, 0)
	seen := map[string]bool{}
	for _, value := range []any{
		firstPresent(node.StoryboardItem["dependency_node_ids"], node.StoryboardItem["dependencyNodeIds"]),
		firstPresent(node.StoryboardItem["reference_node_ids"], node.StoryboardItem["referenceNodeIds"]),
	} {
		for _, nodeID := range canvasStringList(value) {
			if seen[nodeID] {
				continue
			}
			seen[nodeID] = true
			result = append(result, nodeID)
		}
	}
	return result
}

func canvasRunnableNodeDependencyIDs(
	req CanvasRunRequest,
	plan canvasExecutionPlan,
	node canvasRunNode,
) []string {
	if req.ExecutionScope != canvasExecutionScopeStoryboardFrame || canvasStoryboardItemType(node) == "video_compose" {
		return plan.Incoming[node.ID]
	}
	return canvasStoryboardSourceIDs(node)
}

func interleaveCanvasStoryboardReadyNodes(nodes []canvasRunNode) []canvasRunNode {
	if len(nodes) < 2 {
		return nodes
	}
	groupOrder := make([]string, 0)
	groups := make(map[string][]canvasRunNode)
	for _, node := range nodes {
		groupID := strings.TrimSpace(node.GroupID)
		if groupID == "" {
			groupID = "node:" + node.ID
		}
		if _, exists := groups[groupID]; !exists {
			groupOrder = append(groupOrder, groupID)
		}
		groups[groupID] = append(groups[groupID], node)
	}

	result := make([]canvasRunNode, 0, len(nodes))
	for index := 0; len(result) < len(nodes); index++ {
		for _, groupID := range groupOrder {
			members := groups[groupID]
			if index < len(members) {
				result = append(result, members[index])
			}
		}
	}
	return result
}

func canvasStoryboardFrameStartNodeID(sourceNodeID string) string {
	return "storyboard-frame-start:" + strings.TrimSpace(sourceNodeID)
}

func canvasRunDisplayStartNodeID(req CanvasRunRequest) string {
	return firstText(req.DisplayStartNodeID, req.StartNodeID)
}

func workspaceRunDisplayStartNodeID(input map[string]any) string {
	return firstText(input["_display_start_node_id"], input["_start_node_id"])
}
