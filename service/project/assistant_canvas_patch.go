package project

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
)

const maxAssistantCanvasPatchOperations = 64

var assistantCanvasFunctionKeys = map[string]struct{}{
	"start":   {},
	"import":  {},
	"save":    {},
	"display": {},
}

type assistantCanvasCatalog struct {
	roles  map[uint64]uint64
	powers map[uint64]string
	flows  map[uint64]string
}

type assistantCanvasPatch struct {
	AddNodes      []map[string]any `json:"add_nodes"`
	UpdateNodes   []map[string]any `json:"update_nodes"`
	RemoveNodeIDs []string         `json:"remove_node_ids"`
	AddEdges      []map[string]any `json:"add_edges"`
	UpdateEdges   []map[string]any `json:"update_edges"`
	RemoveEdgeIDs []string         `json:"remove_edge_ids"`
	Viewport      map[string]any   `json:"viewport"`
}

type assistantCanvasPatchSummary struct {
	AddedNodes   int `json:"added_nodes"`
	UpdatedNodes int `json:"updated_nodes"`
	RemovedNodes int `json:"removed_nodes"`
	AddedEdges   int `json:"added_edges"`
	UpdatedEdges int `json:"updated_edges"`
	RemovedEdges int `json:"removed_edges"`
}

func newAssistantCanvasCatalog(config map[string]any) (assistantCanvasCatalog, error) {
	catalog := assistantCanvasCatalog{
		roles:  map[uint64]uint64{},
		powers: map[uint64]string{},
		flows:  map[uint64]string{},
	}
	roles, err := assistantCanvasCatalogRows(config["roles"])
	if err != nil {
		return assistantCanvasCatalog{}, fmt.Errorf("读取画布角色目录失败: %w", err)
	}
	for _, role := range roles {
		if !assistantCanvasCatalogEnabled(role["status"]) ||
			!assistantCanvasCatalogEnabled(role["create_status"]) {
			continue
		}
		if roleID := uint64Value(role["id"]); roleID > 0 {
			catalog.roles[roleID] = uint64Value(role["agent_id"])
		}
	}
	powers, err := assistantCanvasCatalogRows(config["powers"])
	if err != nil {
		return assistantCanvasCatalog{}, fmt.Errorf("读取画布能力目录失败: %w", err)
	}
	for _, power := range powers {
		if !assistantCanvasCatalogEnabled(power["create_status"]) {
			continue
		}
		if powerID := uint64Value(power["id"]); powerID > 0 {
			catalog.powers[powerID] = strings.TrimSpace(textValue(power["key"]))
		}
	}
	flows, err := assistantCanvasCatalogRows(config["flows"])
	if err != nil {
		return assistantCanvasCatalog{}, fmt.Errorf("读取画布流程目录失败: %w", err)
	}
	for _, flow := range flows {
		if !assistantCanvasCatalogEnabled(flow["status"]) {
			continue
		}
		if flowID := uint64Value(flow["id"]); flowID > 0 {
			catalog.flows[flowID] = strings.TrimSpace(textValue(flow["key"]))
		}
	}
	return catalog, nil
}

func assistantCanvasCatalogRows(value any) ([]map[string]any, error) {
	if value == nil {
		return nil, nil
	}
	raw, err := json.Marshal(value)
	if err != nil {
		return nil, err
	}
	var rows []map[string]any
	if err = json.Unmarshal(raw, &rows); err != nil {
		return nil, err
	}
	return rows, nil
}

func assistantCanvasCatalogEnabled(value any) bool {
	return uint64Value(value) != 2
}

func validateAssistantCanvasReferences(
	canvas map[string]any,
	catalog assistantCanvasCatalog,
) error {
	for _, raw := range sliceValue(canvas["nodes"]) {
		node := mapValue(raw)
		label := firstText(node["title"], node["id"])
		switch strings.TrimSpace(textValue(node["type"])) {
		case "agent":
			role := mapValue(node["role"])
			roleID := uint64Value(role["id"])
			agentID := uint64Value(role["agent_id"])
			expectedAgentID, exists := catalog.roles[roleID]
			if !exists || expectedAgentID == 0 {
				return fmt.Errorf("节点“%s”引用的团队角色不可用于画布", label)
			}
			if agentID != expectedAgentID {
				return fmt.Errorf("节点“%s”的智能体与团队角色不匹配", label)
			}
		case "power":
			power := mapValue(node["power"])
			powerID := uint64Value(power["id"])
			expectedKey, exists := catalog.powers[powerID]
			if !exists || expectedKey == "" {
				return fmt.Errorf("节点“%s”引用的能力不可用于画布", label)
			}
			if strings.TrimSpace(textValue(power["key"])) != expectedKey {
				return fmt.Errorf("节点“%s”的能力标识与发布目录不匹配", label)
			}
		case "flow":
			flow := mapValue(node["flow"])
			flowID := uint64Value(flow["id"])
			expectedKey, exists := catalog.flows[flowID]
			if !exists || expectedKey == "" {
				return fmt.Errorf("节点“%s”引用的流程不在当前发布版本", label)
			}
			if strings.TrimSpace(textValue(flow["key"])) != expectedKey {
				return fmt.Errorf("节点“%s”的流程标识与发布目录不匹配", label)
			}
		case "function":
			key := strings.TrimSpace(textValue(mapValue(node["function_option"])["key"]))
			if _, exists := assistantCanvasFunctionKeys[key]; !exists {
				return fmt.Errorf("节点“%s”引用了不支持的画布功能", label)
			}
		}
	}
	return nil
}

func decodeAssistantCanvasPatch(value any) (assistantCanvasPatch, error) {
	raw, err := json.Marshal(value)
	if err != nil {
		return assistantCanvasPatch{}, fmt.Errorf("画布补丁格式错误: %w", err)
	}
	var patch assistantCanvasPatch
	if err = json.Unmarshal(raw, &patch); err != nil {
		return assistantCanvasPatch{}, fmt.Errorf("画布补丁格式错误: %w", err)
	}
	if patch.operationCount() == 0 && len(patch.Viewport) == 0 {
		return assistantCanvasPatch{}, fmt.Errorf("画布补丁不能为空")
	}
	if patch.operationCount() > maxAssistantCanvasPatchOperations {
		return assistantCanvasPatch{}, fmt.Errorf("单次最多修改 %d 个画布对象", maxAssistantCanvasPatchOperations)
	}
	return patch, nil
}

func (patch assistantCanvasPatch) operationCount() int {
	return len(patch.AddNodes) + len(patch.UpdateNodes) + len(patch.RemoveNodeIDs) +
		len(patch.AddEdges) + len(patch.UpdateEdges) + len(patch.RemoveEdgeIDs)
}

func applyAssistantCanvasPatch(
	current map[string]any,
	patch assistantCanvasPatch,
) (map[string]any, assistantCanvasPatchSummary, error) {
	base, err := assistantPersistedCanvasMap(current)
	if err != nil {
		return nil, assistantCanvasPatchSummary{}, err
	}
	if patch.operationCount() > maxAssistantCanvasPatchOperations {
		return nil, assistantCanvasPatchSummary{}, fmt.Errorf("单次最多修改 %d 个画布对象", maxAssistantCanvasPatchOperations)
	}

	nodes, summary, err := applyAssistantNodePatch(base, patch)
	if err != nil {
		return nil, assistantCanvasPatchSummary{}, err
	}
	edges, edgeSummary, err := applyAssistantEdgePatch(base, patch, nodes)
	if err != nil {
		return nil, assistantCanvasPatchSummary{}, err
	}
	summary.AddedEdges = edgeSummary.AddedEdges
	summary.UpdatedEdges = edgeSummary.UpdatedEdges
	summary.RemovedEdges = edgeSummary.RemovedEdges

	next := map[string]any{
		"asset_cate_id": base["asset_cate_id"],
		"next_node_no":  base["next_node_no"],
		"nodes":         nodeValues(nodes, assistantObjectOrder(base["_node_order"])),
		"edges":         edgeValues(edges, assistantObjectOrder(base["_edge_order"])),
		"viewport":      base["viewport"],
	}
	if len(patch.Viewport) > 0 {
		next["viewport"] = cloneCanvasObject(patch.Viewport)
	}
	clean, err := sanitizeCanvasPayload(uint64Value(base["asset_cate_id"]), next)
	if err != nil {
		return nil, assistantCanvasPatchSummary{}, err
	}
	return persistedCanvasMap(clean), summary, nil
}

func assistantPersistedCanvasMap(canvas map[string]any) (map[string]any, error) {
	input := map[string]any{
		"asset_cate_id": canvas["asset_cate_id"],
		"next_node_no":  canvas["next_node_no"],
		"nodes":         sliceValue(canvas["nodes"]),
		"edges":         sliceValue(canvas["edges"]),
		"viewport":      mapValue(canvas["viewport"]),
	}
	clean, err := sanitizeCanvasPayload(uint64Value(canvas["asset_cate_id"]), input)
	if err != nil {
		return nil, err
	}
	return persistedCanvasMap(clean), nil
}

func persistedCanvasMap(canvas persistedCanvas) map[string]any {
	return map[string]any{
		"asset_cate_id": canvas.AssetCateID,
		"next_node_no":  canvas.NextNodeNo,
		"nodes":         canvas.Nodes,
		"edges":         canvas.Edges,
		"viewport":      canvas.Viewport,
	}
}

func applyAssistantNodePatch(
	base map[string]any,
	patch assistantCanvasPatch,
) (map[string]map[string]any, assistantCanvasPatchSummary, error) {
	nodes, order, err := indexedAssistantCanvasObjects(sliceValue(base["nodes"]), "节点")
	if err != nil {
		return nil, assistantCanvasPatchSummary{}, err
	}
	summary := assistantCanvasPatchSummary{}
	removed := normalizedAssistantIDs(patch.RemoveNodeIDs)
	for nodeID := range removed {
		if _, exists := nodes[nodeID]; !exists {
			return nil, summary, fmt.Errorf("要删除的节点不存在: %s", nodeID)
		}
		delete(nodes, nodeID)
		summary.RemovedNodes++
	}
	for _, update := range patch.UpdateNodes {
		nodeID := strings.TrimSpace(textValue(update["id"]))
		current, exists := nodes[nodeID]
		if !exists {
			return nil, summary, fmt.Errorf("要更新的节点不存在: %s", nodeID)
		}
		if _, conflict := removed[nodeID]; conflict {
			return nil, summary, fmt.Errorf("节点不能同时更新和删除: %s", nodeID)
		}
		nodes[nodeID] = mergeAssistantCanvasObject(current, update)
		summary.UpdatedNodes++
	}
	nextNodeNo := int(uint64Value(base["next_node_no"]))
	if nextNodeNo < 1 {
		nextNodeNo = 1
	}
	for _, addition := range patch.AddNodes {
		nodeID := strings.TrimSpace(textValue(addition["id"]))
		if nodeID == "" {
			return nil, summary, fmt.Errorf("新增节点缺少 id")
		}
		if _, exists := nodes[nodeID]; exists {
			return nil, summary, fmt.Errorf("新增节点 id 已存在: %s", nodeID)
		}
		node := cloneCanvasObject(addition)
		if uint64Value(node["node_no"]) == 0 {
			node["node_no"] = nextNodeNo
			nextNodeNo++
		}
		nodes[nodeID] = node
		order = append(order, nodeID)
		summary.AddedNodes++
	}
	base["next_node_no"] = nextNodeNo
	base["_node_order"] = order
	return nodes, summary, nil
}

func applyAssistantEdgePatch(
	base map[string]any,
	patch assistantCanvasPatch,
	nodes map[string]map[string]any,
) (map[string]map[string]any, assistantCanvasPatchSummary, error) {
	edges, order, err := indexedAssistantCanvasObjects(sliceValue(base["edges"]), "连线")
	if err != nil {
		return nil, assistantCanvasPatchSummary{}, err
	}
	summary := assistantCanvasPatchSummary{}
	removed := normalizedAssistantIDs(patch.RemoveEdgeIDs)
	for edgeID := range removed {
		if _, exists := edges[edgeID]; !exists {
			return nil, summary, fmt.Errorf("要删除的连线不存在: %s", edgeID)
		}
		delete(edges, edgeID)
		summary.RemovedEdges++
	}
	for edgeID, edge := range edges {
		if !assistantEdgeEndpointsExist(edge, nodes) {
			delete(edges, edgeID)
			summary.RemovedEdges++
		}
	}
	for _, update := range patch.UpdateEdges {
		edgeID := strings.TrimSpace(textValue(update["id"]))
		current, exists := edges[edgeID]
		if !exists {
			return nil, summary, fmt.Errorf("要更新的连线不存在: %s", edgeID)
		}
		if _, conflict := removed[edgeID]; conflict {
			return nil, summary, fmt.Errorf("连线不能同时更新和删除: %s", edgeID)
		}
		next := mergeAssistantCanvasObject(current, update)
		if !assistantEdgeEndpointsExist(next, nodes) {
			return nil, summary, fmt.Errorf("连线端点不存在: %s", edgeID)
		}
		edges[edgeID] = next
		summary.UpdatedEdges++
	}
	for _, addition := range patch.AddEdges {
		edgeID := strings.TrimSpace(textValue(addition["id"]))
		if edgeID == "" {
			return nil, summary, fmt.Errorf("新增连线缺少 id")
		}
		if _, exists := edges[edgeID]; exists {
			return nil, summary, fmt.Errorf("新增连线 id 已存在: %s", edgeID)
		}
		edge := cloneCanvasObject(addition)
		if !assistantEdgeEndpointsExist(edge, nodes) {
			return nil, summary, fmt.Errorf("连线端点不存在: %s", edgeID)
		}
		edges[edgeID] = edge
		order = append(order, edgeID)
		summary.AddedEdges++
	}
	base["_edge_order"] = order
	return edges, summary, nil
}

func indexedAssistantCanvasObjects(
	values []any,
	label string,
) (map[string]map[string]any, []string, error) {
	result := make(map[string]map[string]any, len(values))
	order := make([]string, 0, len(values))
	for _, value := range values {
		row := mapValue(value)
		id := strings.TrimSpace(textValue(row["id"]))
		if id == "" {
			return nil, nil, fmt.Errorf("%s缺少 id", label)
		}
		if _, exists := result[id]; exists {
			return nil, nil, fmt.Errorf("%s id 重复: %s", label, id)
		}
		result[id] = cloneCanvasObject(row)
		order = append(order, id)
	}
	return result, order, nil
}

func nodeValues(nodes map[string]map[string]any, order []string) []any {
	return orderedAssistantCanvasValues(nodes, order)
}

func edgeValues(edges map[string]map[string]any, order []string) []any {
	return orderedAssistantCanvasValues(edges, order)
}

func orderedAssistantCanvasValues(values map[string]map[string]any, order []string) []any {
	keys := make([]string, 0, len(values))
	seen := make(map[string]struct{}, len(values))
	for _, key := range order {
		if _, exists := values[key]; !exists {
			continue
		}
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		keys = append(keys, key)
	}
	remaining := make([]string, 0, len(values)-len(keys))
	for key := range values {
		if _, exists := seen[key]; !exists {
			remaining = append(remaining, key)
		}
	}
	sort.Strings(remaining)
	keys = append(keys, remaining...)
	result := make([]any, 0, len(keys))
	for _, key := range keys {
		result = append(result, values[key])
	}
	return result
}

func assistantObjectOrder(value any) []string {
	items, _ := value.([]string)
	return append([]string(nil), items...)
}

func (s WorkspaceService) applyAssistantCanvasPatch(
	ctx context.Context,
	projectID uint64,
	assetCateID uint64,
	expectedRevision string,
	patch assistantCanvasPatch,
) (map[string]any, assistantCanvasPatchSummary, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, assistantCanvasPatchSummary{}, err
	}
	type patchResult struct {
		Canvas  map[string]any
		Summary assistantCanvasPatchSummary
	}
	result, err := withWorkspaceAssetLock(ctx, project.ID, []string{
		"canvas",
		fmt.Sprintf("%d", assetCateID),
	}, func() (patchResult, error) {
		current := s.projectCanvas(ctx, project.ID, assetCateID)
		if revision := assistantCanvasRevision(current); revision != strings.TrimSpace(expectedRevision) {
			return patchResult{}, fmt.Errorf("画布已发生变化，请重新预览后确认")
		}
		next, summary, applyErr := applyAssistantCanvasPatch(current, patch)
		if applyErr != nil {
			return patchResult{}, applyErr
		}
		catalog, catalogErr := s.project.assistantCanvasCatalog(ctx, project.ID)
		if catalogErr != nil {
			return patchResult{}, catalogErr
		}
		if catalogErr = validateAssistantCanvasReferences(next, catalog); catalogErr != nil {
			return patchResult{}, catalogErr
		}
		clean, sanitizeErr := sanitizeCanvasPayload(assetCateID, next)
		if sanitizeErr != nil {
			return patchResult{}, sanitizeErr
		}
		saved, saveErr := s.saveCanvas(ctx, project.ID, clean)
		if saveErr != nil {
			return patchResult{}, saveErr
		}
		next["updated_at"] = saved["updated_at"]
		return patchResult{Canvas: next, Summary: summary}, nil
	})
	if err != nil {
		return nil, assistantCanvasPatchSummary{}, err
	}
	return result.Canvas, result.Summary, nil
}

func mergeAssistantCanvasObject(current map[string]any, patch map[string]any) map[string]any {
	result := cloneCanvasObject(current)
	for key, value := range patch {
		if strings.TrimSpace(key) != "" {
			result[key] = value
		}
	}
	result["id"] = current["id"]
	return result
}

func normalizedAssistantIDs(values []string) map[string]struct{} {
	result := make(map[string]struct{}, len(values))
	for _, value := range values {
		if value = strings.TrimSpace(value); value != "" {
			result[value] = struct{}{}
		}
	}
	return result
}

func assistantEdgeEndpointsExist(edge map[string]any, nodes map[string]map[string]any) bool {
	from := strings.TrimSpace(textValue(edge["from"]))
	to := strings.TrimSpace(textValue(edge["to"]))
	if from == "" || to == "" {
		return false
	}
	_, fromExists := nodes[from]
	_, toExists := nodes[to]
	return fromExists && toExists
}

func assistantCanvasRevision(canvas map[string]any) string {
	base, err := assistantPersistedCanvasMap(canvas)
	if err != nil {
		return "invalid"
	}
	raw, err := json.Marshal(base)
	if err != nil {
		return "invalid"
	}
	sum := sha256.Sum256(raw)
	return hex.EncodeToString(sum[:12])
}
