package project

import (
	"context"
	"fmt"
	"slices"
	"strings"

	energonmodel "github.com/dever-package/bot/model/energon"
	assetservice "github.com/dever-package/bot/service/asset"
	energoninput "github.com/dever-package/bot/service/energon/input"
	teamservice "github.com/dever-package/bot/service/team"
)

const (
	canvasExecutionScopeStoryboardFrame  = "storyboard_frame"
	canvasStoryboardFrameStartNodePrefix = "storyboard-frame-start:"
)

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
	document, err := canvasStoryboardProductionDocument(ctx, projectID, sourceNodeID, req.Canvas)
	if err != nil {
		return req, err
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

	resultSources := append([]canvasRunNode(nil), required...)
	for id := range canvasStoryboardSettingNodes(sourceNodeID, req.Canvas) {
		if member, exists := nodesByID[id]; exists {
			resultSources = append(resultSources, member)
		}
	}
	for _, candidate := range nodes {
		if candidate.OutputType == energonmodel.OutputTypeVideoCompose {
			resultSources = append(resultSources, candidate)
		}
		if canvasChapterFrameSourceAllowed(sourceNodeID, candidate, req.Canvas) {
			resultSources = append(resultSources, candidate)
		}
	}
	currentResults := canvasStoryboardCurrentResultIndex(ctx, projectID, resultSources, req.Canvas)
	shared := canvasStoryboardSettingNodes(sourceNodeID, req.Canvas)
	if document["type"] == energonmodel.OutputTypeSetting {
		for _, node := range required {
			shared[node.ID] = canvasNodeByID(node.ID, req.Canvas)
		}
	}
	for id, member := range shared {
		if !currentResults[id] {
			continue
		}
		item := mapValue(member["storyboard_item"])
		document, err := canvasStorySettingProductionDocument(ctx, projectID, canvasNodeByID(textValue(item["source_node_id"]), req.Canvas), req.Canvas)
		if err != nil {
			return req, err
		}
		expected, err := canvasStorySettingDefinition(document, item)
		if err != nil {
			return req, err
		}
		versionID := firstUint64(uint64Value(valueAtPath(member, "result_ref", "version_id")), uint64Value(valueAtPath(member, "asset", "version_id")))
		version := assetservice.NewService().FindVersion(ctx, versionID)
		currentResults[id] = version != nil && jsonText(valueAtPath(assetservice.VersionToMap(*version), "source", "story_setting"), "") == jsonText(expected, "")
	}
	required = canvasStoryboardFrameRequiredNodes(required, nodes, shared, currentResults)
	hasCurrentResult := func(nodeID string) bool { return currentResults[nodeID] }

	compositionID := ""
	for _, node := range required {
		if canvasStoryboardItemType(node) != "video_compose" {
			continue
		}
		compositionID = node.ID
		break
	}
	for _, candidate := range nodes {
		if candidate.OutputType != energonmodel.OutputTypeVideoCompose || canvasStoryboardSourceNodeID(candidate) != "" {
			continue
		}
		sources := canvasVideoCompositionSourceNodeIDs(candidate, req.Canvas)
		ready, follows := len(sources) > 0, false
		for _, id := range sources {
			follows = follows || id == compositionID
			ready = ready && (id == compositionID || currentResults[id])
		}
		if ready && follows {
			required = append(required, candidate)
		}
	}
	selected := selectCanvasStoryboardFrameNodes(required, currentResults)
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
		for _, sourceID := range canvasStoryboardFrameSourceIDs(node, req.Canvas) {
			source, exists := nodesByID[sourceID]
			if !exists {
				return req, fmt.Errorf("“%s”的前置素材节点不存在", canvasRunNodeTitle(node))
			}
			if node.OutputType != energonmodel.OutputTypeVideoCompose && !canvasStoryboardFrameSourceAllowed(sourceNodeID, source, req.Canvas) {
				return req, fmt.Errorf("“%s”不能引用其他分镜脚本的素材", canvasRunNodeTitle(node))
			}
			if !selected[sourceID] && !hasCurrentResult(sourceID) {
				return req, fmt.Errorf("请先生成前置素材“%s”", canvasRunNodeTitle(source))
			}
		}
	}
	preparedNodes, err := s.preflightCanvasStoryboardFrame(ctx, projectID, req, required, nodesByID, selected)
	if err != nil {
		return req, err
	}

	runtimeCanvas, err := canvasStoryboardFrameRuntimeCanvas(
		req.Canvas,
		sourceNodeID,
		required,
		selected,
		compositionID,
		preparedNodes,
	)
	if err != nil {
		return req, err
	}
	req.DisplayStartNodeID = sourceNodeID
	req.StartNodeID = canvasStoryboardFrameStartNodeID(sourceNodeID)
	req.SingleNode = false
	req.TargetNodeIDs = nil
	for _, node := range required {
		if selected[node.ID] {
			req.TargetNodeIDs = append(req.TargetNodeIDs, node.ID)
		}
	}
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
) (map[string]canvasRunNode, error) {
	preparedNodes := make(map[string]canvasRunNode)
	productionNodes := make([]canvasRunNode, 0, len(nodes))
	for _, node := range nodes {
		if !selected[node.ID] || node.Type != "power" || node.OutputType == energonmodel.OutputTypeVideoCompose {
			continue
		}
		if node.PowerID == 0 && node.PowerKey == "" {
			continue
		}
		productionNodes = append(productionNodes, node)
	}
	if len(productionNodes) == 0 {
		return preparedNodes, nil
	}

	documents := make(map[string]map[string]any)
	for _, node := range productionNodes {
		if !canvasStoryboardProductionItemType(canvasStoryboardItemType(node)) {
			continue
		}
		sourceNodeID := canvasStoryboardSourceNodeID(node)
		if sourceNodeID == "" {
			return nil, fmt.Errorf("“%s”预检失败：分镜制作节点缺少来源节点", canvasRunNodeTitle(node))
		}
		if _, exists := documents[sourceNodeID]; exists {
			continue
		}
		document, err := canvasStoryboardProductionDocument(ctx, projectID, sourceNodeID, req.Canvas)
		if err != nil {
			return nil, fmt.Errorf("“%s”预检失败：%w", canvasRunNodeTitle(node), err)
		}
		documents[sourceNodeID] = document
	}
	project, err := s.project.prepareCanvasPowerProject(ctx, projectID)
	if err != nil {
		return nil, fmt.Errorf("“%s”预检失败：%w", canvasRunNodeTitle(productionNodes[0]), err)
	}
	referenceCache := newCanvasStoryboardPreflightReferenceCache()
	// Missing shared images are scheduled in this same graph. Their saved
	// definitions are checked when the dependent shot actually executes.
	checkedSettings := map[string]bool{}
	for id := range selected {
		checkedSettings[id] = true
	}
	for _, node := range productionNodes {
		if err := validateCanvasStorySettingReferences(ctx, projectID, node, req.Canvas, checkedSettings); err != nil {
			return nil, fmt.Errorf("“%s”预检失败：%w", canvasRunNodeTitle(node), err)
		}
		if err := validateCanvasChapterDependency(ctx, projectID, node, req.Canvas); err != nil {
			return nil, err
		}
		if canvasStoryboardProductionItemType(canvasStoryboardItemType(node)) {
			prepared, err := prepareCanvasStoryboardSourceParams(
				ctx,
				node,
				documents[canvasStoryboardSourceNodeID(node)],
			)
			if err != nil {
				return nil, fmt.Errorf("“%s”预检失败：%w", canvasRunNodeTitle(node), err)
			}
			node = prepared
			preparedNodes[node.ID] = node
		}
		references, err := s.canvasStoryboardPreflightMediaReferences(ctx, projectID, node, nodesByID, referenceCache)
		if err != nil {
			return nil, fmt.Errorf("“%s”预检失败：%w", canvasRunNodeTitle(node), err)
		}
		input := mergeCanvasPromptInput(req.Input, nil, node.ComposerPrompt)
		if err := applyCanvasStoryboardReferenceInput(ctx, projectID, input, node); err != nil {
			return nil, fmt.Errorf("“%s”预检失败：%w", canvasRunNodeTitle(node), err)
		}
		params := cloneInput(node.ParamValues)
		if canvasContextText(input["prompt"]) != "" && canvasContextText(params["prompt"]) == "" {
			delete(params, "prompt")
		}
		sequence := canvasPowerImageSequenceForNode(node)
		if err := s.project.preflightCanvasPowerForProject(ctx, project, teamservice.CanvasPowerRunRequest{
			CanvasID:               req.CanvasID,
			FlowID:                 node.FlowID,
			AssetCateID:            firstUint64(node.AssetCateID, req.AssetCateID),
			NodeKey:                node.ID,
			NodeName:               node.Title,
			Kind:                   node.Kind,
			PowerID:                node.PowerID,
			PowerKey:               node.PowerKey,
			SourceTargetID:         node.SelectedTarget,
			SourceRequirements:     node.SourceRequirements,
			AllowedSourceTargetIDs: node.StoryboardVideoPlan.targets,
			ImageSequenceMode:      sequence.Mode,
			ImageSequenceMinImages: sequence.MinImages,
			ImageSequenceMaxImages: sequence.MaxImages,
			ImageSequenceFrames:    sequence.Frames,
			Input:                  input,
			Params:                 params,
			MediaReferences:        references,
		}); err != nil {
			return nil, fmt.Errorf("“%s”预检失败：%w", canvasRunNodeTitle(node), err)
		}
	}
	return preparedNodes, nil
}

func (s WorkspaceService) canvasStoryboardPreflightMediaReferences(
	ctx context.Context,
	projectID uint64,
	node canvasRunNode,
	nodesByID map[string]canvasRunNode,
	referenceCache *canvasStoryboardPreflightReferenceCache,
) ([]energoninput.MediaReference, error) {
	result := make([]energoninput.MediaReference, 0)
	used := map[string]bool{}
	nextID := uint64(1) << 63
	appendReference := func(referenceType string, kind string, referenceID uint64, usage string, required bool) {
		kind = strings.ToLower(strings.TrimSpace(kind))
		if kind != "image" && kind != "video" && kind != "audio" {
			return
		}
		if referenceID == 0 {
			referenceID = nextID
			nextID++
		}
		key := fmt.Sprintf("%s:%s:%d:%s", referenceType, kind, referenceID, strings.TrimSpace(usage))
		if used[key] {
			return
		}
		used[key] = true
		result = append(result, energoninput.MediaReference{
			ReferenceType: "preflight",
			ReferenceID:   referenceID,
			Kind:          kind,
			URL:           fmt.Sprintf("https://preflight.invalid/%s/%d.%s", referenceType, referenceID, kind),
			Usage:         strings.TrimSpace(usage),
			StrictUsage:   strings.TrimSpace(usage) != "",
			Required:      required,
		})
	}

	sourceAssetIDs := map[uint64]bool{}
	sourceNodeIDs := map[string]bool{}
	for _, sourceID := range canvasStringList(firstPresent(
		node.StoryboardItem["reference_node_ids"],
		node.StoryboardItem["referenceNodeIds"],
	)) {
		source, exists := nodesByID[sourceID]
		if !exists {
			return nil, fmt.Errorf("前置参考节点不存在: %s", sourceID)
		}
		sourceNodeIDs[sourceID] = true
		if source.AssetID > 0 {
			sourceAssetIDs[source.AssetID] = true
		}
		_, frameMediaItems := canvasStoryboardReferenceSelection(
			node.StoryboardItem,
			source.StoryboardItem,
		)
		if len(frameMediaItems) > 0 {
			for _, frame := range frameMediaItems {
				appendReference(
					canvasReferenceTypeAsset,
					source.Kind,
					source.AssetID,
					frame.Usage,
					true,
				)
			}
			continue
		}
		referenceCount := canvasStoryboardPreflightReferenceCount(source.StoryboardItem)
		for index := 0; index < referenceCount; index++ {
			referenceID := source.AssetID
			if referenceCount > 1 {
				referenceID = 0
			}
			appendReference(
				canvasReferenceTypeAsset,
				source.Kind,
				referenceID,
				canvasStoryboardReferenceUsage(canvasStoryboardItemType(node), source.StoryboardItem),
				true,
			)
		}
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
		if reference.Origin == "storyboard" && sourceNodeIDs[reference.OriginID] {
			continue
		}
		if reference.ReferenceType == canvasReferenceTypeAsset && sourceAssetIDs[reference.ReferenceID] {
			continue
		}
		resolvedReference, output, err := referenceCache.resolve(ctx, projectID, reference)
		if err != nil {
			label := strings.TrimSpace(reference.Label)
			if label == "" {
				label = fmt.Sprintf("%d", reference.ReferenceID)
			}
			return nil, fmt.Errorf("参考素材“%s”不可用: %w", label, err)
		}
		required := reference.Required ||
			(reference.ReferenceType == canvasReferenceTypeAsset && externalAssetIDs[reference.ReferenceID])
		if canvasMediaReferenceSelectionKey(reference) != "" {
			mediaReferences := energoninput.MediaReferencesFromContent(
				reference.ReferenceType,
				reference.ReferenceID,
				textValue(resolvedReference["kind"]),
				output,
				reference.Usage,
			)
			mediaReferences, err = energoninput.SelectMediaReferences(
				mediaReferences,
				canvasMediaReferenceSelection(reference),
			)
			if err != nil {
				return nil, fmt.Errorf("参考素材“%s”：%w", firstText(resolvedReference["name"], reference.Label), err)
			}
			for _, mediaReference := range mediaReferences {
				appendReference(
					reference.ReferenceType,
					mediaReference.Kind,
					reference.ReferenceID,
					mediaReference.Usage,
					required,
				)
			}
			continue
		}
		appendReference(
			reference.ReferenceType,
			textValue(resolvedReference["kind"]),
			reference.ReferenceID,
			reference.Usage,
			required,
		)
	}
	return result, requireCanvasStoryboardVideoFrames(node, result)
}

type canvasStoryboardPreflightReferenceResult struct {
	reference map[string]any
	output    any
	err       error
}

type canvasStoryboardPreflightReferenceCache struct {
	results map[string]canvasStoryboardPreflightReferenceResult
}

func newCanvasStoryboardPreflightReferenceCache() *canvasStoryboardPreflightReferenceCache {
	return &canvasStoryboardPreflightReferenceCache{
		results: map[string]canvasStoryboardPreflightReferenceResult{},
	}
}

func (cache *canvasStoryboardPreflightReferenceCache) resolve(
	ctx context.Context,
	projectID uint64,
	reference canvasPromptReference,
) (map[string]any, any, error) {
	key := fmt.Sprintf("%s:%d:%d", reference.ReferenceType, reference.ReferenceID, reference.VersionID)
	if cached, exists := cache.results[key]; exists {
		return cached.reference, cached.output, cached.err
	}
	resolved, output, err := resolveCanvasReference(ctx, projectID, reference)
	cache.results[key] = canvasStoryboardPreflightReferenceResult{
		reference: resolved,
		output:    output,
		err:       err,
	}
	return resolved, output, err
}

func canvasStoryboardPreflightReferenceCount(sourceMetadata map[string]any) int {
	if canvasStoryboardShotImageMode(sourceMetadata) == energonmodel.StoryboardShotImageReferences {
		return energonmodel.StoryboardShotReferencesMaxImages
	}
	return 1
}

func selectCanvasStoryboardFrameNodes(nodes []canvasRunNode, currentResults map[string]bool) map[string]bool {
	selected := make(map[string]bool, len(nodes))
	for _, node := range nodes {
		if !currentResults[node.ID] {
			selected[node.ID] = true
		}
	}
	return selected
}

func canvasStoryboardFrameRequiredNodes(required, nodes []canvasRunNode, shared map[string]map[string]any, current map[string]bool) []canvasRunNode {
	needed := map[string]bool{}
	for _, node := range required {
		if current[node.ID] {
			continue
		}
		for _, id := range canvasStoryboardSourceIDs(node) {
			if shared[id] != nil && !current[id] {
				needed[id] = true
			}
		}
	}
	for _, node := range nodes {
		if needed[node.ID] {
			required = append(required, node)
		}
	}
	return required
}

func canvasStoryboardFrameSourceIDs(node canvasRunNode, canvas map[string]any) []string {
	if node.OutputType == energonmodel.OutputTypeVideoCompose && canvasStoryboardSourceNodeID(node) == "" {
		return canvasVideoCompositionSourceNodeIDs(node, canvas)
	}
	return canvasStoryboardSourceIDs(node)
}

func canvasStoryboardFrameRuntimeCanvas(
	canvas map[string]any,
	sourceNodeID string,
	required []canvasRunNode,
	selected map[string]bool,
	compositionID string,
	preparedNodes map[string]canvasRunNode,
) (map[string]any, error) {
	runtimeCanvas := cloneCanvasObject(canvas)

	runtimeNodes := make([]any, 0, len(sliceValue(canvas["nodes"]))+1)
	for _, raw := range sliceValue(canvas["nodes"]) {
		row := cloneInput(mapValue(raw))
		if prepared, exists := preparedNodes[textValue(row["id"])]; exists {
			composerDraft := cloneInput(mapValue(row["composer_draft"]))
			composerDraft["prompt"] = prepared.ComposerPrompt
			composerDraft["param_values"] = cloneInput(prepared.ParamValues)
			row["composer_draft"] = composerDraft
			row["storyboard_item"] = cloneInput(prepared.StoryboardItem)
			delete(row, "storyboardItem")
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
			"key":   canvasFunctionStart,
			"label": "开始",
		},
	})

	requiredByID := canvasRunNodeMap(required)
	edges := make([]any, 0, len(selected)*3)
	seen := map[string]bool{}
	incoming := map[string]bool{}
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
		source, target := requiredByID[from], requiredByID[to]
		fromBoundary, toBoundary := from, to
		if source.GroupID != target.GroupID {
			if source.GroupID != "" {
				fromBoundary = source.GroupID
			}
			if target.GroupID != "" {
				toBoundary = target.GroupID
			}
		}
		edges = append(edges, map[string]any{
			"id":           fmt.Sprintf("storyboard-frame-edge-%d", len(edges)+1),
			"from":         fromBoundary,
			"to":           toBoundary,
			"logical_from": from,
			"logical_to":   to,
			"purpose":      canvasEdgePurposeDependency,
		})
	}
	for _, target := range required {
		if !selected[target.ID] {
			continue
		}
		for _, sourceID := range canvasStoryboardFrameSourceIDs(target, canvas) {
			if !selected[sourceID] {
				continue
			}
			appendEdge(sourceID, target.ID)
			incoming[target.ID] = true
		}
	}
	if selected[compositionID] {
		for _, source := range required {
			if !selected[source.ID] || source.ID == compositionID {
				continue
			}
			if source.OutputType == energonmodel.OutputTypeVideoCompose && canvasStoryboardSourceNodeID(source) == "" {
				continue
			}
			appendEdge(source.ID, compositionID)
			incoming[compositionID] = true
		}
	}
	for _, node := range required {
		if selected[node.ID] && !incoming[node.ID] {
			appendEdge(startNodeID, node.ID)
		}
	}
	if len(edges) == 0 {
		return nil, fmt.Errorf("制作区没有可执行节点")
	}
	// Keep source relationships for execution-time provenance checks, outside the runnable frame.
	for _, raw := range sliceValue(canvas["edges"]) {
		edge := mapValue(raw)
		if firstText(edge["logical_to"], edge["to"]) == sourceNodeID {
			edges = append(edges, raw)
		} else if target := requiredByID[firstText(edge["logical_to"], edge["to"])]; target.OutputType == energonmodel.OutputTypeVideoCompose && canvasStoryboardSourceNodeID(target) == "" {
			// Retain clip source edge IDs for reference resolution without
			// scheduling already completed chapters again.
			reference := cloneInput(edge)
			reference["execution_mode"] = "manual"
			edges = append(edges, reference)
		}
	}
	runtimeCanvas["nodes"] = runtimeNodes
	runtimeCanvas["edges"] = edges
	return runtimeCanvas, nil
}

func canvasStoryboardCurrentResultIndex(
	ctx context.Context,
	projectID uint64,
	nodes []canvasRunNode,
	canvas map[string]any,
) map[string]bool {
	rawNodes := make(map[string]map[string]any, len(nodes))
	assetIDs := make([]uint64, 0, len(nodes)*2)
	for _, raw := range sliceValue(canvas["nodes"]) {
		node := mapValue(raw)
		nodeID := textValue(node["id"])
		if nodeID == "" {
			continue
		}
		rawNodes[nodeID] = node
	}
	for _, node := range nodes {
		raw := rawNodes[node.ID]
		if raw == nil || assetservice.HasContent(firstPresent(raw["result_output"], raw["resultOutput"], valueAtPath(raw, "result", "output"))) {
			continue
		}
		resultRef := mapValue(firstPresent(raw["result_ref"], raw["resultRef"]))
		if assetID := firstUint64(uint64Value(resultRef["asset_id"]), uint64Value(resultRef["assetId"])); assetID > 0 {
			assetIDs = append(assetIDs, assetID)
		}
		if assetID := uint64Value(valueAtPath(raw, "asset", "id")); assetID > 0 {
			assetIDs = append(assetIDs, assetID)
		}
	}
	hydratedAssets := []map[string]any{}
	if len(assetIDs) > 0 {
		hydratedAssets = assetservice.NewService().CanvasReferences(ctx, projectID, 0, 0, assetIDs, nil)
	}
	assetsByID := make(map[uint64]map[string]any, len(hydratedAssets))
	for _, asset := range hydratedAssets {
		if assetID := uint64Value(asset["id"]); assetID > 0 {
			assetsByID[assetID] = asset
		}
	}

	result := make(map[string]bool, len(nodes))
	for _, node := range nodes {
		raw := rawNodes[node.ID]
		if raw == nil {
			continue
		}
		if canvasStoryboardResultFitsPlan(node, firstPresent(raw["result_output"], raw["resultOutput"], valueAtPath(raw, "result", "output"))) {
			result[node.ID] = true
			continue
		}
		resultRef := mapValue(firstPresent(raw["result_ref"], raw["resultRef"]))
		resultAssetID := firstUint64(uint64Value(resultRef["asset_id"]), uint64Value(resultRef["assetId"]))
		if canvasStoryboardResultFitsPlan(node, valueAtPath(assetsByID[resultAssetID], "version", "content")) {
			result[node.ID] = true
			continue
		}
		asset := mapValue(raw["asset"])
		if canvasStoryboardResultFitsPlan(node, valueAtPath(asset, "version", "content")) ||
			canvasStoryboardResultFitsPlan(node, valueAtPath(assetsByID[uint64Value(asset["id"])], "version", "content")) {
			result[node.ID] = true
		}
	}
	return result
}

func canvasStoryboardResultFitsPlan(node canvasRunNode, output any) bool {
	if canvasStoryboardItemType(node) == "shot_image" && canvasStoryboardShotImageMode(node.StoryboardItem) == energonmodel.StoryboardShotImageFirstLast {
		return len(canvasMediaURLs(output, "image")) >= energonmodel.StoryboardShotFramePairImages
	}
	return assetservice.HasContent(output)
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
	if plan.Start.GroupOrigin != "script" &&
		(req.ExecutionScope != canvasExecutionScopeStoryboardFrame || node.OutputType == energonmodel.OutputTypeVideoCompose) {
		return plan.Incoming[node.ID]
	}
	// Include both scheduling dependencies and explicit media references.
	dependencies := slices.Clone(plan.Incoming[node.ID])
	for _, sourceID := range canvasStoryboardSourceIDs(node) {
		if !slices.Contains(dependencies, sourceID) {
			dependencies = append(dependencies, sourceID)
		}
	}
	return dependencies
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
	return canvasStoryboardFrameStartNodePrefix + strings.TrimSpace(sourceNodeID)
}

func canvasRunDisplayStartNodeID(req CanvasRunRequest) string {
	return firstText(req.DisplayStartNodeID, req.StartNodeID)
}

func workspaceRunDisplayStartNodeID(input map[string]any) string {
	return firstText(input["_display_start_node_id"], input["_start_node_id"])
}
