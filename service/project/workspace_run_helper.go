package project

import (
	"context"
	"fmt"
	"strings"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
)

func createWorkspaceCanvasRuns(
	ctx context.Context,
	projectID uint64,
	teamID uint64,
	runID uint64,
	requestID string,
	req CanvasRunRequest,
	plan canvasExecutionPlan,
) (uint64, map[string]uint64, error) {
	now := time.Now()
	flowRunID := uint64(teammodel.NewFlowRunModel().Insert(ctx, map[string]any{
		"run_id":     runID,
		"request_id": requestID,
		"project_id": projectID,
		"team_id":    teamID,
		"flow_id":    0,
		"input": jsonText(map[string]any{
			"_mode":          workspaceCanvasRunMode,
			"_asset_cate_id": req.AssetCateID,
			"_start_node_id": strings.TrimSpace(req.StartNodeID),
			"_single_node":   req.SingleNode,
			"input":          cloneInput(req.Input),
			"execution_plan": canvasRunPlan(plan),
		}, "{}"),
		"output":     "{}",
		"error":      "",
		"status":     teammodel.RunStatusRunning,
		"started_at": now,
		"created_at": now,
		"updated_at": now,
	}))
	if flowRunID == 0 {
		return 0, nil, fmt.Errorf("创建画布流程运行失败")
	}

	nodeRuns := map[string]uint64{}
	model := teammodel.NewNodeRunModel()
	for _, node := range canvasRunTrackedNodes(plan) {
		nodeRunID := uint64(model.Insert(ctx, map[string]any{
			"run_id":       runID,
			"flow_run_id":  flowRunID,
			"request_id":   requestID,
			"project_id":   projectID,
			"team_id":      teamID,
			"flow_id":      0,
			"node_id":      stableCanvasNodeID(node.ID),
			"node_key":     node.ID,
			"node_type":    node.Type,
			"input":        jsonText(canvasRunNodeInput(node), "{}"),
			"output":       "{}",
			"error":        "",
			"status":       workspaceInitialNodeRunStatus(req, plan, node),
			"agent_run_id": 0,
			"created_at":   now,
			"updated_at":   now,
		}))
		if nodeRunID == 0 {
			return flowRunID, nodeRuns, fmt.Errorf("创建节点运行失败: %s", canvasRunNodeTitle(node))
		}
		nodeRuns[node.ID] = nodeRunID
	}
	return flowRunID, nodeRuns, nil
}

func workspaceFlowRunID(ctx context.Context, runID uint64) uint64 {
	if runID == 0 {
		return 0
	}
	if row := teammodel.NewFlowRunModel().Find(ctx, map[string]any{"run_id": runID}); row != nil {
		return row.ID
	}
	return 0
}

func workspaceNodeRunIDMap(ctx context.Context, runID uint64) map[string]uint64 {
	result := map[string]uint64{}
	if runID == 0 {
		return result
	}
	for _, row := range teammodel.NewNodeRunModel().Select(ctx, map[string]any{"run_id": runID}) {
		if row == nil || strings.TrimSpace(row.NodeKey) == "" {
			continue
		}
		result[strings.TrimSpace(row.NodeKey)] = row.ID
	}
	return result
}

func workspaceNodeRunPayloads(ctx context.Context, runID uint64) []map[string]any {
	if runID == 0 {
		return []map[string]any{}
	}
	rows := teammodel.NewNodeRunModel().Select(ctx, map[string]any{"run_id": runID})
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		result = append(result, map[string]any{
			"node_run_id":  row.ID,
			"node_id":      row.NodeID,
			"node_key":     strings.TrimSpace(row.NodeKey),
			"node_type":    strings.TrimSpace(row.NodeType),
			"status":       strings.TrimSpace(row.Status),
			"agent_run_id": row.AgentRunID,
		})
	}
	return result
}

func canvasRunNodeMap(nodes []canvasRunNode) map[string]canvasRunNode {
	result := make(map[string]canvasRunNode, len(nodes))
	for _, node := range nodes {
		if strings.TrimSpace(node.ID) == "" {
			continue
		}
		result[node.ID] = node
	}
	return result
}

func workspaceInitialNodeRunStatus(req CanvasRunRequest, plan canvasExecutionPlan, node canvasRunNode) string {
	if !req.SingleNode && node.ID == plan.Start.ID && isCanvasStartNode(node) {
		return teammodel.RunStatusSuccess
	}
	return teammodel.RunStatusPending
}

func finishWorkspaceFlowRun(ctx context.Context, flowRunID uint64, status string, output map[string]any, errorText string) {
	if flowRunID == 0 {
		return
	}
	if strings.TrimSpace(status) == "" {
		status = teammodel.RunStatusSuccess
	}
	now := time.Now()
	record := map[string]any{
		"status":     status,
		"output":     jsonText(output, "{}"),
		"error":      strings.TrimSpace(errorText),
		"updated_at": now,
	}
	if status != teammodel.RunStatusRunning && status != teammodel.RunStatusPending && status != teammodel.RunStatusWaiting {
		record["finished_at"] = now
	}
	teammodel.NewFlowRunModel().Update(ctx, map[string]any{"id": flowRunID}, record)
}

func markWorkspaceNodeRun(ctx context.Context, nodeRunID uint64, status string, input any, output any, errorText string, agentRunID uint64) {
	if nodeRunID == 0 {
		return
	}
	status = normalizeWorkspaceExecutionStatus(status)
	now := time.Now()
	record := map[string]any{
		"status":     status,
		"error":      strings.TrimSpace(errorText),
		"updated_at": now,
	}
	if input != nil {
		record["input"] = jsonText(input, "{}")
	}
	if output != nil {
		record["output"] = jsonText(output, "{}")
	}
	if agentRunID > 0 {
		record["agent_run_id"] = agentRunID
	}
	if canvasRunStatusStarted(status) {
		record["started_at"] = now
	}
	if canvasRunStatusFinished(status) {
		record["finished_at"] = now
	}
	teammodel.NewNodeRunModel().Update(ctx, map[string]any{"id": nodeRunID}, record)
}

func canvasRunNodeInput(node canvasRunNode) map[string]any {
	return map[string]any{
		"node_key":         node.ID,
		"node_type":        node.Type,
		"title":            node.Title,
		"kind":             node.Kind,
		"function_key":     node.FunctionKey,
		"asset_cate_id":    node.AssetCateID,
		"flow_id":          node.FlowID,
		"power_id":         node.PowerID,
		"power_key":        node.PowerKey,
		"power_kind":       node.PowerKind,
		"agent_id":         node.AgentID,
		"role_id":          node.RoleID,
		"asset_id":         node.AssetID,
		"asset_version_id": node.AssetVersionID,
		"persists_result":  node.PersistsResult,
	}
}

func canvasRunNodeTitle(node canvasRunNode) string {
	if strings.TrimSpace(node.Title) != "" {
		return strings.TrimSpace(node.Title)
	}
	if strings.TrimSpace(node.FunctionKey) != "" {
		return strings.TrimSpace(node.FunctionKey)
	}
	return strings.TrimSpace(node.ID)
}

func canvasRunTrackedNodes(plan canvasExecutionPlan) []canvasRunNode {
	result := make([]canvasRunNode, 0, len(plan.Nodes)+1)
	seen := map[string]bool{}
	if strings.TrimSpace(plan.Start.ID) != "" && !isCanvasStartNode(plan.Start) {
		result = append(result, plan.Start)
		seen[plan.Start.ID] = true
	}
	for _, node := range plan.Nodes {
		if strings.TrimSpace(node.ID) == "" || seen[node.ID] {
			continue
		}
		result = append(result, node)
		seen[node.ID] = true
	}
	return result
}

func canvasRunStatusStarted(status string) bool {
	return status == teammodel.RunStatusRunning ||
		status == teammodel.RunStatusWaiting ||
		canvasRunStatusFinished(status)
}

func canvasRunStatusFinished(status string) bool {
	return status == teammodel.RunStatusSuccess ||
		status == teammodel.RunStatusFail ||
		status == teammodel.RunStatusCanceled
}

func isCanvasStartNode(node canvasRunNode) bool {
	return node.Type == "function" && node.FunctionKey == "start"
}

func canvasRunNodePersistsResult(nodeType string, functionKey string) bool {
	switch nodeType {
	case "asset", "power", "agent", "flow":
		return true
	case "function":
		return functionKey == "save"
	default:
		return false
	}
}

func stableCanvasNodeID(key string) uint64 {
	hash := fnv64a(strings.TrimSpace(key))
	value := hash & 0x7fffffffffffffff
	if value == 0 {
		return 1
	}
	return value
}

func fnv64a(text string) uint64 {
	var hash uint64 = 14695981039346656037
	for i := 0; i < len(text); i++ {
		hash ^= uint64(text[i])
		hash *= 1099511628211
	}
	return hash
}

func parentRunID(run *teammodel.Run) uint64 {
	if run == nil {
		return 0
	}
	return run.ID
}

func parentReleaseID(run *teammodel.Run) uint64 {
	if run == nil {
		return 0
	}
	return run.ReleaseID
}

func parentRequestID(run *teammodel.Run) string {
	if run == nil {
		return ""
	}
	return strings.TrimSpace(run.RequestID)
}

func validateCanvasRunGraph(nodes map[string]canvasRunNode, edges []canvasRunEdge) error {
	if len(nodes) == 0 {
		return fmt.Errorf("画布没有节点")
	}
	outgoing := map[string][]string{}
	for _, edge := range edges {
		if strings.TrimSpace(edge.From) == "" || strings.TrimSpace(edge.To) == "" {
			return fmt.Errorf("画布连线缺少端点")
		}
		if edge.From == edge.To {
			return fmt.Errorf("画布连线不能连接自身")
		}
		if _, ok := nodes[edge.From]; !ok {
			return fmt.Errorf("画布连线上游节点不存在")
		}
		if _, ok := nodes[edge.To]; !ok {
			return fmt.Errorf("画布连线下游节点不存在")
		}
		outgoing[edge.From] = append(outgoing[edge.From], edge.To)
	}
	if canvasRunGraphHasCycle(nodes, outgoing) {
		return fmt.Errorf("画布连线存在循环，当前只允许 DAG")
	}
	return nil
}

func validateCanvasExecutionPlan(plan canvasExecutionPlan) error {
	for _, node := range plan.Nodes {
		if node.Type == "function" && node.FunctionKey == "save" && len(plan.Incoming[node.ID]) != 1 {
			return fmt.Errorf("保存节点 %s 需要且只需要一个执行结果上游节点", canvasRunNodeTitle(node))
		}
		if node.Type == "function" && node.FunctionKey == "display" && len(plan.Incoming[node.ID]) != 1 {
			return fmt.Errorf("展示节点 %s 需要且只需要一个执行结果上游节点", canvasRunNodeTitle(node))
		}
	}
	return nil
}

func buildCanvasRunExecutionPlan(
	startNodeID string,
	nodes map[string]canvasRunNode,
	edges []canvasRunEdge,
	singleNode bool,
) canvasExecutionPlan {
	if singleNode {
		return buildSingleCanvasNodeExecutionPlan(startNodeID, nodes)
	}
	return buildCanvasExecutionPlan(startNodeID, nodes, edges)
}

func buildSingleCanvasNodeExecutionPlan(nodeID string, nodes map[string]canvasRunNode) canvasExecutionPlan {
	node := nodes[nodeID]
	plan := canvasExecutionPlan{
		Start:    node,
		Nodes:    []canvasRunNode{},
		Edges:    []canvasRunEdge{},
		Incoming: map[string][]string{},
		Outgoing: map[string][]string{},
		Order:    []string{},
	}
	if strings.TrimSpace(node.ID) != "" {
		plan.Nodes = append(plan.Nodes, node)
		plan.Order = append(plan.Order, node.ID)
	}
	return plan
}

func buildCanvasExecutionPlan(startNodeID string, nodes map[string]canvasRunNode, edges []canvasRunEdge) canvasExecutionPlan {
	outgoing := map[string][]string{}
	for _, edge := range edges {
		outgoing[edge.From] = append(outgoing[edge.From], edge.To)
	}
	plan := canvasExecutionPlan{
		Start:    nodes[startNodeID],
		Nodes:    []canvasRunNode{},
		Edges:    []canvasRunEdge{},
		Incoming: map[string][]string{},
		Outgoing: map[string][]string{},
		Order:    []string{},
	}
	reachable, discovered := canvasReachableExecutionNodes(startNodeID, nodes, outgoing)
	for _, edge := range edges {
		if !reachable[edge.To] {
			continue
		}
		if edge.From == startNodeID || reachable[edge.From] {
			plan.Edges = append(plan.Edges, edge)
		}
		if reachable[edge.From] {
			plan.Incoming[edge.To] = append(plan.Incoming[edge.To], edge.From)
			plan.Outgoing[edge.From] = append(plan.Outgoing[edge.From], edge.To)
		}
	}
	plan.Order = canvasTopologicalExecutionOrder(discovered, plan.Incoming, plan.Outgoing)
	for _, nodeID := range plan.Order {
		if node, ok := nodes[nodeID]; ok {
			plan.Nodes = append(plan.Nodes, node)
		}
	}
	return plan
}

func canvasReachableExecutionNodes(
	startNodeID string,
	nodes map[string]canvasRunNode,
	outgoing map[string][]string,
) (map[string]bool, []string) {
	reachable := map[string]bool{}
	discovered := []string{}
	var visit func(string)
	visit = func(nodeID string) {
		for _, targetID := range outgoing[nodeID] {
			if reachable[targetID] {
				continue
			}
			node, ok := nodes[targetID]
			if !ok {
				continue
			}
			reachable[targetID] = true
			discovered = append(discovered, targetID)
			if canvasNodeStopsRun(node) {
				continue
			}
			visit(targetID)
		}
	}
	visit(startNodeID)
	return reachable, discovered
}

func canvasTopologicalExecutionOrder(
	discovered []string,
	incoming map[string][]string,
	outgoing map[string][]string,
) []string {
	discoveredSet := map[string]bool{}
	indegree := map[string]int{}
	for _, nodeID := range discovered {
		discoveredSet[nodeID] = true
		indegree[nodeID] = len(incoming[nodeID])
	}
	queue := make([]string, 0, len(discovered))
	for _, nodeID := range discovered {
		if indegree[nodeID] == 0 {
			queue = append(queue, nodeID)
		}
	}
	order := make([]string, 0, len(discovered))
	queued := 0
	for queued < len(queue) {
		nodeID := queue[queued]
		queued++
		order = append(order, nodeID)
		for _, targetID := range outgoing[nodeID] {
			if !discoveredSet[targetID] {
				continue
			}
			indegree[targetID]--
			if indegree[targetID] == 0 {
				queue = append(queue, targetID)
			}
		}
	}
	if len(order) == len(discovered) {
		return order
	}
	return discovered
}

func canvasRunGraphHasCycle(nodes map[string]canvasRunNode, outgoing map[string][]string) bool {
	visiting := map[string]bool{}
	visited := map[string]bool{}
	var visit func(string) bool
	visit = func(nodeID string) bool {
		if visiting[nodeID] {
			return true
		}
		if visited[nodeID] {
			return false
		}
		visiting[nodeID] = true
		for _, nextID := range outgoing[nodeID] {
			if visit(nextID) {
				return true
			}
		}
		visiting[nodeID] = false
		visited[nodeID] = true
		return false
	}
	for nodeID := range nodes {
		if visit(nodeID) {
			return true
		}
	}
	return false
}
