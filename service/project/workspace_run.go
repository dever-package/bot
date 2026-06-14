package project

import (
	"context"
	"fmt"
	"strings"

	teamservice "my/package/bot/service/team"
)

type CanvasRunRequest struct {
	ProjectID   uint64
	AssetCateID uint64
	StartNodeID string
	RequestID   string
	Canvas      map[string]any
	Input       map[string]any
}

type canvasRunNode struct {
	ID             string
	Type           string
	Title          string
	Kind           string
	AssetCateID    uint64
	FunctionKey    string
	FlowID         uint64
	PowerID        uint64
	PowerKey       string
	AgentID        uint64
	RoleID         uint64
	Asset          map[string]any
	ComposerPrompt string
	SelectedTarget uint64
	ParamValues    map[string]any
}

type canvasRunEdge struct {
	ID   string
	From string
	To   string
}

type canvasNodeResult struct {
	NodeKey string
	Payload map[string]any
}

func (s WorkspaceService) RunCanvas(ctx context.Context, req CanvasRunRequest) (map[string]any, error) {
	if req.ProjectID == 0 {
		return nil, fmt.Errorf("项目不能为空")
	}
	if strings.TrimSpace(req.StartNodeID) == "" {
		return nil, fmt.Errorf("开始节点不能为空")
	}
	project, err := requireProject(ctx, req.ProjectID)
	if err != nil {
		return nil, err
	}
	nodes, edges, err := parseCanvasRunGraph(req.Canvas)
	if err != nil {
		return nil, err
	}
	orderedNodes := orderedCanvasRunNodes(req.StartNodeID, nodes, edges)
	runnableNodes := filterRunnableCanvasNodes(orderedNodes)
	if len(runnableNodes) == 0 {
		return canvasRunSummary(req, "success", nil, nil, canvasRunPlan(orderedNodes, edges)), nil
	}

	results := make([]canvasNodeResult, 0, len(runnableNodes))
	status := "success"
	var lastPayload map[string]any
	for _, node := range runnableNodes {
		payload, runErr := s.runCanvasNode(ctx, project.ID, req, node, results)
		if payload == nil {
			payload = map[string]any{}
		}
		lastPayload = payload
		results = append(results, canvasNodeResult{
			NodeKey: node.ID,
			Payload: payload,
		})
		status = canvasRunStatus(payload)
		if runErr != nil {
			status = "fail"
			payload["error"] = runErr.Error()
			break
		}
		if canvasRunShouldStop(status) {
			break
		}
	}
	return canvasRunSummary(req, status, lastPayload, results, canvasRunPlan(orderedNodes, edges)), nil
}

func (s WorkspaceService) runCanvasNode(ctx context.Context, projectID uint64, req CanvasRunRequest, node canvasRunNode, results []canvasNodeResult) (map[string]any, error) {
	previousOutput := previousCanvasOutput(node.ID, results, req.Canvas)
	switch node.Type {
	case "asset":
		return canvasAssetRunPayload(req, node), nil
	case "power":
		return s.runCanvasPowerNode(ctx, projectID, req, node, previousOutput)
	case "agent":
		return s.runCanvasAgentNode(ctx, projectID, req, node, previousOutput)
	case "flow":
		return s.runCanvasFlowNode(ctx, projectID, req, node, previousOutput)
	case "function":
		return s.runCanvasFunctionNode(ctx, projectID, req, node, previousOutput)
	default:
		return nil, fmt.Errorf("节点类型不支持执行")
	}
}

func (s WorkspaceService) runCanvasPowerNode(ctx context.Context, projectID uint64, req CanvasRunRequest, node canvasRunNode, previousOutput any) (map[string]any, error) {
	if node.PowerID == 0 && node.PowerKey == "" {
		return nil, fmt.Errorf("能力节点未配置能力")
	}
	input := mergeCanvasInput(req.Input, previousOutput, node.ComposerPrompt)
	result, err := s.project.RunCanvasPower(ctx, projectID, teamservice.CanvasPowerRunRequest{
		FlowID:         node.FlowID,
		AssetCateID:    firstUint64(node.AssetCateID, req.AssetCateID),
		NodeKey:        node.ID,
		NodeName:       node.Title,
		Kind:           node.Kind,
		PowerID:        node.PowerID,
		PowerKey:       node.PowerKey,
		SourceTargetID: node.SelectedTarget,
		RequestID:      req.RequestID,
		Input:          input,
		Params:         node.ParamValues,
	})
	return canvasNodeRunPayload(req, node, result), err
}

func (s WorkspaceService) runCanvasAgentNode(ctx context.Context, projectID uint64, req CanvasRunRequest, node canvasRunNode, previousOutput any) (map[string]any, error) {
	if node.AgentID == 0 {
		return nil, fmt.Errorf("智能体节点未配置智能体")
	}
	input := mergeCanvasInput(req.Input, previousOutput, node.ComposerPrompt)
	if node.RoleID > 0 {
		input["role_id"] = node.RoleID
	}
	result, err := s.project.RunCanvasAgent(ctx, projectID, CanvasAgentRunRequest{
		FlowID:      node.FlowID,
		AssetCateID: firstUint64(node.AssetCateID, req.AssetCateID),
		NodeKey:     node.ID,
		NodeName:    node.Title,
		AgentID:     node.AgentID,
		RequestID:   req.RequestID,
		Input:       input,
	})
	return canvasNodeRunPayload(req, node, result), err
}

func (s WorkspaceService) runCanvasFlowNode(ctx context.Context, projectID uint64, req CanvasRunRequest, node canvasRunNode, previousOutput any) (map[string]any, error) {
	if node.FlowID == 0 {
		return nil, fmt.Errorf("流程节点未配置流程")
	}
	result, err := s.project.RunFlow(ctx, projectID, teamservice.RunRequest{
		FlowID:    node.FlowID,
		RequestID: req.RequestID,
		Input:     mergeCanvasInput(req.Input, previousOutput, node.ComposerPrompt),
		Mode:      "flow",
	})
	return canvasNodeRunPayload(req, node, result), err
}

func (s WorkspaceService) runCanvasFunctionNode(ctx context.Context, projectID uint64, req CanvasRunRequest, node canvasRunNode, previousOutput any) (map[string]any, error) {
	switch node.FunctionKey {
	case "display":
		if previousOutput == nil {
			return nil, fmt.Errorf("展示节点没有可展示的上游结果")
		}
		return canvasNodeRunPayload(req, node, map[string]any{
			"status": "success",
			"output": previousOutput,
			"result": map[string]any{"output": previousOutput},
		}), nil
	case "save":
		if previousOutput == nil {
			return nil, fmt.Errorf("保存节点没有可保存的上游结果")
		}
		name := strings.TrimSpace(node.Title)
		if name == "" {
			name = "画布结果"
		}
		result, err := s.project.SaveAsset(ctx, projectID, SaveAssetRequest{
			AssetCateID: firstUint64(node.AssetCateID, req.AssetCateID),
			RequestID:   req.RequestID,
			NodeKey:     node.ID,
			Source: map[string]any{
				"source_request_id": req.RequestID,
				"source_node_key":   node.ID,
				"source_node_type":  node.Type,
				"source_status":     "success",
			},
			Name:    name,
			Kind:    firstText(node.Kind, "mixed"),
			Role:    "content",
			Content: previousOutput,
		})
		if err != nil {
			return nil, err
		}
		asset := mapValue(result["asset"])
		return canvasNodeRunPayload(req, node, map[string]any{
			"status":  "success",
			"output":  firstPresent(valueAtPath(asset, "version", "content"), previousOutput),
			"asset":   asset,
			"version": mapValue(asset["version"]),
			"result": map[string]any{
				"output": firstPresent(valueAtPath(asset, "version", "content"), previousOutput),
				"asset":  asset,
			},
		}), nil
	default:
		return nil, fmt.Errorf("当前功能节点不支持自动执行")
	}
}

func parseCanvasRunGraph(canvas map[string]any) ([]canvasRunNode, []canvasRunEdge, error) {
	nodesRaw, _ := canvas["nodes"].([]any)
	edgesRaw, _ := canvas["edges"].([]any)
	nodes := make([]canvasRunNode, 0, len(nodesRaw))
	for _, raw := range nodesRaw {
		row := mapValue(raw)
		node := canvasRunNode{
			ID:             textValue(row["id"]),
			Type:           textValue(row["type"]),
			Title:          textValue(row["title"]),
			Kind:           textValue(row["kind"]),
			AssetCateID:    uint64Value(row["asset_cate_id"]),
			FunctionKey:    textValue(valueAtPath(row, "function_option", "key")),
			FlowID:         uint64Value(valueAtPath(row, "flow", "id")),
			PowerID:        uint64Value(valueAtPath(row, "power", "id")),
			PowerKey:       textValue(valueAtPath(row, "power", "key")),
			AgentID:        uint64Value(valueAtPath(row, "role", "agent_id")),
			RoleID:         uint64Value(valueAtPath(row, "role", "id")),
			Asset:          mapValue(row["asset"]),
			ComposerPrompt: textValue(valueAtPath(row, "composer_draft", "prompt")),
			SelectedTarget: uint64Value(valueAtPath(row, "composer_draft", "selected_target_id")),
			ParamValues:    mapValue(valueAtPath(row, "composer_draft", "param_values")),
		}
		if node.ID == "" || node.Type == "" {
			return nil, nil, fmt.Errorf("画布节点格式错误")
		}
		nodes = append(nodes, node)
	}
	edges := make([]canvasRunEdge, 0, len(edgesRaw))
	for _, raw := range edgesRaw {
		row := mapValue(raw)
		edge := canvasRunEdge{
			ID:   textValue(row["id"]),
			From: textValue(firstPresent(row["from"], row["source"])),
			To:   textValue(firstPresent(row["to"], row["target"])),
		}
		if edge.From != "" && edge.To != "" {
			edges = append(edges, edge)
		}
	}
	return nodes, edges, nil
}

func orderedCanvasRunNodes(startNodeID string, nodes []canvasRunNode, edges []canvasRunEdge) []canvasRunNode {
	nodeMap := make(map[string]canvasRunNode, len(nodes))
	for _, node := range nodes {
		nodeMap[node.ID] = node
	}
	outgoing := make(map[string][]string, len(edges))
	for _, edge := range edges {
		outgoing[edge.From] = append(outgoing[edge.From], edge.To)
	}
	visited := map[string]bool{startNodeID: true}
	ordered := []canvasRunNode{}
	if node, ok := nodeMap[startNodeID]; ok {
		ordered = append(ordered, node)
	}
	var visit func(string)
	visit = func(nodeID string) {
		for _, targetID := range outgoing[nodeID] {
			if visited[targetID] {
				continue
			}
			visited[targetID] = true
			if node, ok := nodeMap[targetID]; ok {
				ordered = append(ordered, node)
				if !canvasNodeStopsRun(node) {
					visit(targetID)
				}
			}
		}
	}
	if startNode, ok := nodeMap[startNodeID]; ok && canvasNodeStopsRun(startNode) {
		return ordered
	}
	visit(startNodeID)
	return ordered
}

func filterRunnableCanvasNodes(nodes []canvasRunNode) []canvasRunNode {
	result := make([]canvasRunNode, 0, len(nodes))
	for _, node := range nodes {
		if isRunnableCanvasNode(node) {
			result = append(result, node)
		}
	}
	return result
}

func isRunnableCanvasNode(node canvasRunNode) bool {
	switch node.Type {
	case "asset", "power", "agent", "flow":
		return true
	case "function":
		return node.FunctionKey == "save" || node.FunctionKey == "display"
	default:
		return false
	}
}

func canvasNodeStopsRun(node canvasRunNode) bool {
	return node.Type == "function" && (node.FunctionKey == "save" || node.FunctionKey == "display")
}

func previousCanvasOutput(nodeID string, results []canvasNodeResult, canvas map[string]any) any {
	upstream := upstreamCanvasNodeIDs(nodeID, canvas)
	if len(upstream) == 0 {
		return lastCanvasOutput(results, "")
	}
	outputs := make([]any, 0, len(upstream))
	for _, upstreamID := range upstream {
		if output := lastCanvasOutput(results, upstreamID); output != nil {
			outputs = append(outputs, output)
		}
	}
	if len(outputs) == 0 {
		return lastCanvasOutput(results, "")
	}
	if len(outputs) == 1 {
		return outputs[0]
	}
	return map[string]any{"sources": outputs}
}

func upstreamCanvasNodeIDs(nodeID string, canvas map[string]any) []string {
	edgesRaw, _ := canvas["edges"].([]any)
	result := []string{}
	for _, raw := range edgesRaw {
		row := mapValue(raw)
		to := textValue(firstPresent(row["to"], row["target"]))
		if to != nodeID {
			continue
		}
		if from := textValue(firstPresent(row["from"], row["source"])); from != "" {
			result = append(result, from)
		}
	}
	return result
}

func lastCanvasOutput(results []canvasNodeResult, nodeID string) any {
	for index := len(results) - 1; index >= 0; index-- {
		result := results[index]
		if nodeID != "" && result.NodeKey != nodeID {
			continue
		}
		if output := firstPresent(result.Payload["output"], valueAtPath(result.Payload, "result", "output"), valueAtPath(result.Payload, "asset", "version", "content")); output != nil {
			return output
		}
	}
	return nil
}

func mergeCanvasInput(base map[string]any, previousOutput any, prompt string) map[string]any {
	input := cloneInput(base)
	if previousOutput != nil {
		input["previous_output"] = previousOutput
	}
	if strings.TrimSpace(prompt) != "" {
		input["prompt"] = strings.TrimSpace(prompt)
		input["text"] = strings.TrimSpace(prompt)
	}
	return input
}

func canvasAssetRunPayload(req CanvasRunRequest, node canvasRunNode) map[string]any {
	output := firstPresent(valueAtPath(node.Asset, "version", "content"), node.Asset)
	return canvasNodeRunPayload(req, node, map[string]any{
		"status": "success",
		"output": output,
		"asset":  node.Asset,
		"result": map[string]any{"output": output},
	})
}

func canvasNodeRunPayload(req CanvasRunRequest, node canvasRunNode, payload map[string]any) map[string]any {
	if payload == nil {
		payload = map[string]any{}
	}
	output := firstPresent(payload["output"], valueAtPath(payload, "result", "output"), valueAtPath(payload, "asset", "version", "content"), payload)
	status := canvasRunStatus(payload)
	result := map[string]any{
		"run_id":      uint64Value(payload["run_id"]),
		"request_id":  firstText(payload["request_id"], req.RequestID),
		"flow_run_id": uint64Value(payload["flow_run_id"]),
		"release_id":  uint64Value(firstPresent(payload["release_id"], valueAtPath(payload, "version", "release_id"))),
		"status":      status,
		"executed":    1,
		"output":      payload,
		"node_results": []map[string]any{
			{
				"node_key":        node.ID,
				"node_type":       node.Type,
				"node_run_id":     uint64Value(firstPresent(payload["node_run_id"], valueAtPath(payload, "version", "node_run_id"))),
				"status":          status,
				"output":          output,
				"asset":           payload["asset"],
				"version":         firstPresent(payload["version"], valueAtPath(payload, "asset", "version")),
				"result":          mergeMap(payload, map[string]any{"output": output}),
				"persists_result": mapValue(payload["asset"]) != nil || mapValue(payload["version"]) != nil,
				"agent_run_id":    uint64Value(payload["agent_run_id"]),
			},
		},
	}
	return result
}

func canvasRunSummary(req CanvasRunRequest, status string, last map[string]any, results []canvasNodeResult, plan map[string]any) map[string]any {
	nodeResults := make([]any, 0, len(results))
	for _, result := range results {
		for _, item := range sliceValue(result.Payload["node_results"]) {
			nodeResults = append(nodeResults, item)
		}
	}
	if last == nil {
		last = map[string]any{}
	}
	return map[string]any{
		"run_id":         uint64Value(last["run_id"]),
		"request_id":     firstText(last["request_id"], req.RequestID),
		"flow_run_id":    uint64Value(last["flow_run_id"]),
		"release_id":     uint64Value(last["release_id"]),
		"status":         firstText(status, "success"),
		"executed":       len(nodeResults),
		"output":         firstPresent(last["output"], last),
		"node_results":   nodeResults,
		"execution_plan": plan,
	}
}

func canvasRunPlan(nodes []canvasRunNode, edges []canvasRunEdge) map[string]any {
	planNodes := make([]map[string]any, 0, len(nodes))
	order := make([]string, 0, len(nodes))
	for _, node := range nodes {
		planNodes = append(planNodes, map[string]any{
			"id":              node.ID,
			"type":            node.Type,
			"title":           node.Title,
			"function_key":    node.FunctionKey,
			"asset_cate_id":   node.AssetCateID,
			"persists_result": len(node.Asset) > 0,
			"stops_flow":      canvasNodeStopsRun(node),
		})
		order = append(order, node.ID)
	}
	planEdges := make([]map[string]any, 0, len(edges))
	for _, edge := range edges {
		planEdges = append(planEdges, map[string]any{
			"id":     edge.ID,
			"source": edge.From,
			"target": edge.To,
		})
	}
	return map[string]any{
		"nodes": planNodes,
		"edges": planEdges,
		"order": order,
	}
}

func canvasRunStatus(payload map[string]any) string {
	status := textValue(payload["status"])
	if status == "" {
		return "success"
	}
	return status
}

func canvasRunShouldStop(status string) bool {
	switch status {
	case "fail", "running", "pending", "waiting":
		return true
	default:
		return false
	}
}

func mapValue(raw any) map[string]any {
	row, ok := raw.(map[string]any)
	if !ok || row == nil {
		return nil
	}
	return row
}

func sliceValue(raw any) []any {
	switch items := raw.(type) {
	case []any:
		return items
	case []map[string]any:
		result := make([]any, 0, len(items))
		for _, item := range items {
			result = append(result, item)
		}
		return result
	default:
		return nil
	}
}

func textValue(raw any) string {
	if raw == nil {
		return ""
	}
	text := strings.TrimSpace(fmt.Sprint(raw))
	if text == "<nil>" {
		return ""
	}
	return text
}

func uint64Value(raw any) uint64 {
	switch value := raw.(type) {
	case uint64:
		return value
	case uint:
		return uint64(value)
	case uint32:
		return uint64(value)
	case int:
		if value > 0 {
			return uint64(value)
		}
	case int64:
		if value > 0 {
			return uint64(value)
		}
	case float64:
		if value > 0 {
			return uint64(value)
		}
	case string:
		var parsed uint64
		_, _ = fmt.Sscan(strings.TrimSpace(value), &parsed)
		return parsed
	}
	return 0
}

func firstPresent(values ...any) any {
	for _, value := range values {
		if value != nil {
			return value
		}
	}
	return nil
}

func firstText(values ...any) string {
	for _, value := range values {
		if text := textValue(value); text != "" && text != "<nil>" {
			return text
		}
	}
	return ""
}

func valueAtPath(raw any, path ...string) any {
	current := raw
	for _, key := range path {
		row := mapValue(current)
		if row == nil {
			return nil
		}
		current = row[key]
	}
	return current
}

func mergeMap(base map[string]any, patch map[string]any) map[string]any {
	result := map[string]any{}
	for key, value := range base {
		result[key] = value
	}
	for key, value := range patch {
		result[key] = value
	}
	return result
}
