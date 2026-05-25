package brain

import (
	"context"
	"fmt"
	"strings"
	"time"

	brainmodel "my/package/bot/model/brain"
	agentservice "my/package/bot/service/agent"
	assetservice "my/package/bot/service/asset"
)

func (s Service) executeNodeDAG(ctx context.Context, run brainmodel.Run, thinkRun brainmodel.ThinkRun, brain brainmodel.Brain, think brainmodel.Think, nodes []brainmodel.ThinkNode, edges []brainmodel.ThinkNodeEdge) (string, map[string]any, error) {
	nodeByID := map[uint64]brainmodel.ThinkNode{}
	incoming := map[uint64][]brainmodel.ThinkNodeEdge{}
	for _, node := range nodes {
		nodeByID[node.ID] = node
	}
	for _, edge := range edges {
		incoming[edge.ToNodeID] = append(incoming[edge.ToNodeID], edge)
	}
	completed := s.completedNodes(ctx, thinkRun.ID)
	skipped := map[uint64]bool{}
	for len(completed)+len(skipped) < len(nodes) {
		if s.runCanceled(ctx, run.ID) {
			return brainmodel.RunStatusCanceled, s.repo.ListBlackboard(ctx, thinkRun.ID), fmt.Errorf("运行已取消")
		}
		blackboard := s.repo.ListBlackboard(ctx, thinkRun.ID)
		ready := make([]brainmodel.ThinkNode, 0)
		for _, node := range nodes {
			if completed[node.ID] {
				continue
			}
			if skipped[node.ID] {
				continue
			}
			if nodeRun := s.repo.FindNodeRunByNode(ctx, thinkRun.ID, node.ID); nodeRun != nil && nodeRun.Status == brainmodel.RunStatusWaiting {
				return brainmodel.RunStatusWaiting, blackboard, runWaitError{message: "等待人工确认"}
			}
			if nodeReady(node.ID, incoming, completed, skipped, blackboard, nodeByID) {
				ready = append(ready, node)
			}
		}
		if len(ready) == 0 {
			marked := markSkippedNodes(nodes, incoming, completed, skipped, blackboard, nodeByID)
			if marked {
				continue
			}
			return brainmodel.RunStatusFail, blackboard, fmt.Errorf("节点 DAG 无可执行节点")
		}
		for _, node := range ready {
			status, err := s.executeNode(ctx, run, thinkRun, brain, think, node, incoming[node.ID], nodeByID)
			if status == brainmodel.RunStatusWaiting {
				return status, s.repo.ListBlackboard(ctx, thinkRun.ID), err
			}
			if err != nil {
				return status, s.repo.ListBlackboard(ctx, thinkRun.ID), err
			}
			completed[node.ID] = true
		}
	}
	return brainmodel.RunStatusSuccess, s.repo.ListBlackboard(ctx, thinkRun.ID), nil
}

func (s Service) completedNodes(ctx context.Context, thinkRunID uint64) map[uint64]bool {
	result := map[uint64]bool{}
	rows := brainmodel.NewNodeRunModel().Select(ctx, map[string]any{"think_run_id": thinkRunID})
	for _, row := range rows {
		if row != nil && row.Status == brainmodel.RunStatusSuccess {
			result[row.NodeID] = true
		}
	}
	return result
}

func nodeReady(nodeID uint64, incoming map[uint64][]brainmodel.ThinkNodeEdge, completed map[uint64]bool, skipped map[uint64]bool, blackboard map[string]any, nodeByID map[uint64]brainmodel.ThinkNode) bool {
	edges := incoming[nodeID]
	if len(edges) == 0 {
		return true
	}
	if nodeByID[nodeID].Type == brainmodel.NodeTypeMerge {
		hasCompletedInput := false
		for _, edge := range edges {
			if skipped[edge.FromNodeID] {
				continue
			}
			if !completed[edge.FromNodeID] {
				return false
			}
			if !edgeConditionPassed(edge.Condition, nodeByID[edge.FromNodeID], blackboard) {
				return false
			}
			hasCompletedInput = true
		}
		return hasCompletedInput
	}
	for _, edge := range edges {
		if skipped[edge.FromNodeID] {
			return false
		}
		if !completed[edge.FromNodeID] {
			return false
		}
		if !edgeConditionPassed(edge.Condition, nodeByID[edge.FromNodeID], blackboard) {
			return false
		}
	}
	return true
}

func markSkippedNodes(nodes []brainmodel.ThinkNode, incoming map[uint64][]brainmodel.ThinkNodeEdge, completed map[uint64]bool, skipped map[uint64]bool, blackboard map[string]any, nodeByID map[uint64]brainmodel.ThinkNode) bool {
	marked := false
	for _, node := range nodes {
		if completed[node.ID] || skipped[node.ID] {
			continue
		}
		edges := incoming[node.ID]
		if len(edges) == 0 {
			continue
		}
		resolved := true
		for _, edge := range edges {
			if !completed[edge.FromNodeID] && !skipped[edge.FromNodeID] {
				resolved = false
				break
			}
		}
		if resolved && !nodeReady(node.ID, incoming, completed, skipped, blackboard, nodeByID) {
			skipped[node.ID] = true
			marked = true
		}
	}
	return marked
}

func edgeConditionPassed(condition string, fromNode brainmodel.ThinkNode, blackboard map[string]any) bool {
	condition = strings.ToLower(strings.TrimSpace(condition))
	if condition == "" || condition == "always" || condition == "completed" || condition == "success" {
		return true
	}
	output := nodeOutput(fromNode, blackboard)
	switch condition {
	case "passed":
		return boolValue(output["passed"])
	case "failed":
		value, exists := output["passed"]
		return exists && !boolValue(value)
	case "approved":
		return strings.EqualFold(textValue(output["decision"]), "approved")
	case "rejected":
		return strings.EqualFold(textValue(output["decision"]), "rejected")
	default:
		return true
	}
}

func nodeOutput(node brainmodel.ThinkNode, blackboard map[string]any) map[string]any {
	config := jsonMap(node.Config)
	key := firstText(config["output_key"], node.NodeKey)
	if value, ok := blackboard[key]; ok {
		return mapValue(value)
	}
	if value, ok := blackboard[node.NodeKey]; ok {
		return mapValue(value)
	}
	return map[string]any{}
}

func (s Service) executeNode(ctx context.Context, run brainmodel.Run, thinkRun brainmodel.ThinkRun, brain brainmodel.Brain, think brainmodel.Think, node brainmodel.ThinkNode, incoming []brainmodel.ThinkNodeEdge, nodeByID map[uint64]brainmodel.ThinkNode) (string, error) {
	blackboard := s.repo.ListBlackboard(ctx, thinkRun.ID)
	config := jsonMap(node.Config)
	input := nodeInput(config, blackboard, incoming, nodeByID)
	nodeRunID := s.repo.FindOrCreateNodeRun(ctx, run, thinkRun, node, input)
	nodeRun := s.repo.FindNodeRun(ctx, nodeRunID)
	if nodeRun == nil {
		return brainmodel.RunStatusFail, fmt.Errorf("创建节点运行失败")
	}
	startedAt := time.Now()
	s.repo.UpdateNodeRun(ctx, nodeRun.ID, map[string]any{
		"status":     brainmodel.RunStatusRunning,
		"input":      jsonText(input),
		"started_at": startedAt,
	})

	output, status, agentRunID, err := s.runNodeByType(ctx, run, thinkRun, brain, think, node, config, input, blackboard, incoming, nodeByID)
	record := map[string]any{
		"status":       status,
		"output":       jsonText(output),
		"agent_run_id": agentRunID,
	}
	if status != brainmodel.RunStatusWaiting {
		record["finished_at"] = time.Now()
	}
	if err != nil {
		record["error"] = err.Error()
	}
	s.repo.UpdateNodeRun(ctx, nodeRun.ID, record)
	if status == brainmodel.RunStatusSuccess {
		key := firstText(config["output_key"], node.NodeKey)
		s.writeBlackboard(ctx, run, thinkRun, key, output, "node", nodeRun.ID)
		s.repo.InsertMessage(ctx, map[string]any{
			"run_id":       run.ID,
			"think_run_id": thinkRun.ID,
			"node_run_id":  nodeRun.ID,
			"brain_id":     brain.ID,
			"think_id":     think.ID,
			"node_id":      node.ID,
			"type":         "artifact",
			"role":         node.Type,
			"content":      jsonText(output),
		})
	}
	return status, err
}

func nodeInput(config map[string]any, blackboard map[string]any, incoming []brainmodel.ThinkNodeEdge, nodeByID map[uint64]brainmodel.ThinkNode) map[string]any {
	keys := stringSlice(config["input_keys"])
	result := map[string]any{}
	if len(keys) == 0 {
		for key, value := range blackboard {
			result[key] = value
		}
	} else {
		for _, key := range keys {
			if value, exists := blackboard[key]; exists {
				result[key] = value
			}
		}
	}
	for _, edge := range incoming {
		output := nodeOutput(nodeByID[edge.FromNodeID], blackboard)
		fromNode := nodeByID[edge.FromNodeID]
		if fromNode.NodeKey != "" {
			result[fromNode.NodeKey] = output
		}
		result[fmt.Sprintf("node_%d", edge.FromNodeID)] = output
	}
	return result
}

func (s Service) runNodeByType(ctx context.Context, run brainmodel.Run, thinkRun brainmodel.ThinkRun, brain brainmodel.Brain, think brainmodel.Think, node brainmodel.ThinkNode, config map[string]any, input map[string]any, blackboard map[string]any, incoming []brainmodel.ThinkNodeEdge, nodeByID map[uint64]brainmodel.ThinkNode) (map[string]any, string, uint64, error) {
	switch node.Type {
	case brainmodel.NodeTypeAgent:
		return s.runAgentNode(ctx, run, thinkRun, brain, think, node, config, input)
	case brainmodel.NodeTypePower:
		return s.waitPowerNode(ctx, run, thinkRun, brain, think, node, config, input)
	case brainmodel.NodeTypeBrain:
		return s.runSubBrainNode(ctx, run, thinkRun, brain, think, node, config, input)
	case brainmodel.NodeTypeCondition:
		return runConditionNode(config, input), brainmodel.RunStatusSuccess, 0, nil
	case brainmodel.NodeTypeMerge:
		return map[string]any{"merged": input}, brainmodel.RunStatusSuccess, 0, nil
	case brainmodel.NodeTypeHumanApproval:
		return s.waitHumanNode(ctx, run, thinkRun, brain, think, node, config, input)
	case brainmodel.NodeTypeSave:
		return s.runSaveNode(ctx, run, thinkRun, brain, think, node, blackboard, incoming, nodeByID)
	default:
		return nil, brainmodel.RunStatusFail, 0, fmt.Errorf("不支持的节点类型: %s", node.Type)
	}
}

func (s Service) runAgentNode(ctx context.Context, run brainmodel.Run, thinkRun brainmodel.ThinkRun, brain brainmodel.Brain, think brainmodel.Think, node brainmodel.ThinkNode, config map[string]any, input map[string]any) (map[string]any, string, uint64, error) {
	if node.AgentID == 0 {
		return nil, brainmodel.RunStatusFail, 0, fmt.Errorf("节点未绑定智能体: %s", node.Name)
	}
	task := firstText(config["task"], node.Name)
	prompt := buildAgentPrompt(brain, think, node, task, input)
	nodeRunID := s.currentNodeRunID(ctx, thinkRun.ID, node.ID)
	result, err := s.agent.RunInternal(ctx, agentservice.InternalRunRequest{
		AgentKey:  fmt.Sprintf("%d", node.AgentID),
		RequestID: newRequestID(),
		Method:    "POST",
		Path:      "/bot/brain/run",
		Input: map[string]any{
			"text":       prompt,
			"task":       task,
			"brain":      brain.Name,
			"think":      think.Name,
			"node":       node.Name,
			"blackboard": input,
		},
		Options: map[string]any{},
		OnRunCreated: func(agentRunID uint64, requestID string) {
			if nodeRunID == 0 {
				return
			}
			s.repo.UpdateNodeRun(context.Background(), nodeRunID, map[string]any{
				"agent_run_id": agentRunID,
			})
		},
	})
	if err != nil {
		return nil, brainmodel.RunStatusFail, 0, err
	}
	return map[string]any{
		"summary":      result.Summary,
		"output":       result.Output,
		"agent_run_id": result.RunID,
	}, brainmodel.RunStatusSuccess, result.RunID, nil
}

func buildAgentPrompt(brain brainmodel.Brain, think brainmodel.Think, node brainmodel.ThinkNode, task string, input map[string]any) string {
	parts := []string{
		"你正在作为 Brain 编排中的一个智能体节点执行任务。",
		fmt.Sprintf("大脑：%s", brain.Name),
	}
	appendPromptText(&parts, "大脑人格", brain.Persona)
	appendPromptText(&parts, "大脑目标", brain.Goal)
	parts = append(parts, fmt.Sprintf("当前思维：%s", think.Name))
	appendPromptText(&parts, "思维目标", think.Goal)
	parts = append(parts, fmt.Sprintf("当前节点：%s", node.Name))
	appendPromptText(&parts, "节点任务", task)
	parts = append(
		parts,
		"请严格基于输入黑板执行当前节点任务，输出清晰、可被下游节点继续使用的结果。",
		fmt.Sprintf("输入黑板：%s", jsonText(input)),
	)
	return strings.Join(parts, "\n\n")
}

func appendPromptText(parts *[]string, label string, value string) {
	text := strings.TrimSpace(value)
	if text == "" {
		return
	}
	*parts = append(*parts, fmt.Sprintf("%s：%s", label, text))
}

func runConditionNode(config map[string]any, input map[string]any) map[string]any {
	sourceKey := firstText(config["source_key"], config["input_key"])
	operator := strings.ToLower(firstText(config["operator"], "exists"))
	expected := config["value"]
	var actual any = input
	if sourceKey != "" {
		actual = input[sourceKey]
	}
	passed := false
	switch operator {
	case "exists":
		passed = actual != nil && textValue(actual) != ""
	case "equals":
		passed = textValue(actual) == textValue(expected)
	case "not_equals":
		passed = textValue(actual) != textValue(expected)
	case "contains":
		passed = strings.Contains(textValue(actual), textValue(expected))
	case "approved":
		passed = strings.EqualFold(textValue(actual), "approved")
	case "rejected":
		passed = strings.EqualFold(textValue(actual), "rejected")
	case "truthy", "passed":
		passed = boolValue(actual)
	case "falsy", "failed":
		passed = !boolValue(actual)
	default:
		passed = actual != nil
	}
	return map[string]any{
		"passed":   passed,
		"operator": operator,
		"actual":   actual,
		"expected": expected,
	}
}

func (s Service) waitHumanNode(ctx context.Context, run brainmodel.Run, thinkRun brainmodel.ThinkRun, brain brainmodel.Brain, think brainmodel.Think, node brainmodel.ThinkNode, config map[string]any, input map[string]any) (map[string]any, string, uint64, error) {
	nodeRun := s.repo.FindNodeRunByNode(ctx, thinkRun.ID, node.ID)
	if nodeRun == nil {
		return nil, brainmodel.RunStatusFail, 0, fmt.Errorf("人工节点运行记录不存在")
	}
	if approval := s.repo.FindPendingApprovalByNodeRun(ctx, nodeRun.ID); approval != nil {
		return map[string]any{"approval_id": approval.ID, "pending": true}, brainmodel.RunStatusWaiting, 0, runWaitError{message: "等待人工确认"}
	}
	sourceKey := firstText(config["source_key"], config["body_key"])
	content := input
	if sourceKey != "" {
		content = map[string]any{sourceKey: input[sourceKey]}
	}
	title := firstText(config["title"], node.Name)
	approvalID := s.repo.InsertApproval(ctx, map[string]any{
		"run_id":       run.ID,
		"think_run_id": thinkRun.ID,
		"node_run_id":  nodeRun.ID,
		"brain_id":     brain.ID,
		"think_id":     think.ID,
		"node_id":      node.ID,
		"title":        title,
		"content":      jsonText(content),
		"comment":      "",
		"decision":     "pending",
		"status":       brainmodel.RunStatusPending,
	})
	return map[string]any{"approval_id": approvalID, "pending": true}, brainmodel.RunStatusWaiting, 0, runWaitError{message: "等待人工确认"}
}

func (s Service) waitPowerNode(ctx context.Context, run brainmodel.Run, thinkRun brainmodel.ThinkRun, brain brainmodel.Brain, think brainmodel.Think, node brainmodel.ThinkNode, config map[string]any, input map[string]any) (map[string]any, string, uint64, error) {
	nodeRun := s.repo.FindNodeRunByNode(ctx, thinkRun.ID, node.ID)
	if nodeRun == nil {
		return nil, brainmodel.RunStatusFail, 0, fmt.Errorf("能力节点运行记录不存在")
	}
	if approval := s.repo.FindPendingApprovalByNodeRun(ctx, nodeRun.ID); approval != nil {
		return map[string]any{"approval_id": approval.ID, "pending": true}, brainmodel.RunStatusWaiting, 0, runWaitError{message: "等待能力参数"}
	}
	powerKey := firstText(config["power_key"], config["power"])
	if powerKey == "" && node.PowerID > 0 {
		if power, ok := s.repo.FindPowerOption(ctx, node.PowerID, ""); ok {
			powerKey = power.Key
		}
	}
	if powerKey == "" {
		return nil, brainmodel.RunStatusFail, 0, fmt.Errorf("能力节点未绑定能力: %s", node.Name)
	}
	interaction := map[string]any{
		"id":          fmt.Sprintf("brain-power-%d", node.ID),
		"type":        "power_params",
		"title":       node.Name,
		"description": "补充能力参数后继续执行流程。",
		"power":       powerKey,
		"values":      input,
	}
	approvalID := s.repo.InsertApproval(ctx, map[string]any{
		"run_id":       run.ID,
		"think_run_id": thinkRun.ID,
		"node_run_id":  nodeRun.ID,
		"brain_id":     brain.ID,
		"think_id":     think.ID,
		"node_id":      node.ID,
		"title":        node.Name,
		"content": jsonText(map[string]any{
			"kind":        "power",
			"power":       powerKey,
			"input":       input,
			"interaction": interaction,
		}),
		"comment":  "",
		"decision": "pending",
		"status":   brainmodel.RunStatusPending,
	})
	return map[string]any{
		"approval_id": approvalID,
		"interaction": interaction,
		"pending":     true,
	}, brainmodel.RunStatusWaiting, 0, runWaitError{message: "等待能力参数"}
}

func (s Service) runSubBrainNode(ctx context.Context, run brainmodel.Run, thinkRun brainmodel.ThinkRun, brain brainmodel.Brain, think brainmodel.Think, node brainmodel.ThinkNode, config map[string]any, input map[string]any) (map[string]any, string, uint64, error) {
	if node.SubBrainID == 0 {
		return nil, brainmodel.RunStatusFail, 0, fmt.Errorf("大脑节点未绑定大脑: %s", node.Name)
	}
	request := RunRequest{
		BrainID:   node.SubBrainID,
		ProjectID: run.ProjectID,
		Input:     input,
		Mode:      "sub_brain",
	}
	if releaseID := uint64Value(config["release_id"]); releaseID > 0 {
		request.ReleaseID = releaseID
	}
	result, err := s.RunBrain(ctx, request)
	if err != nil {
		return nil, brainmodel.RunStatusFail, 0, err
	}
	return map[string]any{
		"brain_id": node.SubBrainID,
		"result":   result,
	}, brainmodel.RunStatusSuccess, 0, nil
}

func (s Service) runSaveNode(ctx context.Context, run brainmodel.Run, thinkRun brainmodel.ThinkRun, brain brainmodel.Brain, think brainmodel.Think, node brainmodel.ThinkNode, blackboard map[string]any, incoming []brainmodel.ThinkNodeEdge, nodeByID map[uint64]brainmodel.ThinkNode) (map[string]any, string, uint64, error) {
	body, err := singleIncomingNodeOutput("保存", incoming, nodeByID, blackboard)
	if err != nil {
		return nil, brainmodel.RunStatusFail, 0, err
	}
	assetName := firstText(valueAtPath(body, "title"), think.Name)
	nodeRunID := s.currentNodeRunID(ctx, thinkRun.ID, node.ID)
	if isDebugRun(run) {
		return debugSaveOutput(assetName, firstText(valueAtPath(body, "kind"), "mixed"), body), brainmodel.RunStatusSuccess, 0, nil
	}
	asset, version, err := s.asset.SaveVersion(ctx, assetservice.SaveVersionRequest{
		ProjectID: run.ProjectID,
		BrainID:   brain.ID,
		ThinkID:   think.ID,
		RunID:     run.ID,
		NodeRunID: nodeRunID,
		ReleaseID: run.ReleaseID,
		Name:      assetName,
		Kind:      firstText(valueAtPath(body, "kind"), "mixed"),
		Content:   body,
	})
	if err != nil {
		return nil, brainmodel.RunStatusFail, 0, err
	}
	memoryTitle := fmt.Sprintf("%s 记忆", node.Name)
	memoryID := s.repo.InsertMemory(ctx, map[string]any{
		"project_id":  run.ProjectID,
		"brain_id":    brain.ID,
		"think_id":    think.ID,
		"run_id":      run.ID,
		"node_run_id": nodeRunID,
		"asset_id":    asset.ID,
		"version_id":  version.ID,
		"kind":        "episodic",
		"title":       memoryTitle,
		"content":     jsonText(body),
		"tags":        "[]",
		"importance":  50,
		"status":      brainmodel.StatusEnabled,
	})
	return map[string]any{
		"asset_id":   asset.ID,
		"version_id": version.ID,
		"memory_id":  memoryID,
	}, brainmodel.RunStatusSuccess, 0, nil
}

func isDebugRun(run brainmodel.Run) bool {
	mode := strings.ToLower(strings.TrimSpace(textValue(jsonMap(run.Input)["_mode"])))
	return strings.HasPrefix(mode, "debug_")
}

func debugSaveOutput(name string, kind string, body map[string]any) map[string]any {
	output := make(map[string]any, len(body)+1)
	for key, value := range body {
		output[key] = value
	}
	output["_debug_asset"] = map[string]any{
		"name": name,
		"kind": kind,
	}
	return output
}

func singleIncomingNodeOutput(label string, incoming []brainmodel.ThinkNodeEdge, nodeByID map[uint64]brainmodel.ThinkNode, blackboard map[string]any) (map[string]any, error) {
	if len(incoming) != 1 {
		return nil, fmt.Errorf("%s节点需要且只需要一个上游节点", label)
	}
	fromNode := nodeByID[incoming[0].FromNodeID]
	if fromNode.ID == 0 {
		return nil, fmt.Errorf("%s节点的上游节点不存在", label)
	}
	return nodeOutput(fromNode, blackboard), nil
}

func (s Service) writeBlackboard(ctx context.Context, run brainmodel.Run, thinkRun brainmodel.ThinkRun, key string, value any, sourceKind string, sourceID uint64) {
	key = strings.TrimSpace(key)
	if key == "" {
		return
	}
	s.repo.UpsertBlackboard(ctx, map[string]any{
		"run_id":       run.ID,
		"think_run_id": thinkRun.ID,
		"brain_id":     run.BrainID,
		"think_id":     thinkRun.ThinkID,
		"key":          key,
		"value":        jsonText(value),
		"source_kind":  sourceKind,
		"source_id":    sourceID,
	})
}

func (s Service) currentNodeRunID(ctx context.Context, thinkRunID uint64, nodeID uint64) uint64 {
	if row := s.repo.FindNodeRunByNode(ctx, thinkRunID, nodeID); row != nil {
		return row.ID
	}
	return 0
}

func valueAtPath(raw any, key string) any {
	row := mapValue(raw)
	if len(row) == 0 {
		return nil
	}
	return row[key]
}
