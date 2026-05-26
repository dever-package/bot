package team

import (
	"context"
	"fmt"
	"strings"
	"sync/atomic"
	"time"

	memorymodel "my/package/bot/model/memory"
	teammodel "my/package/bot/model/team"
	agentservice "my/package/bot/service/agent"
	assetservice "my/package/bot/service/asset"
	memoryservice "my/package/bot/service/memory"
	"my/package/bot/service/stream"
)

type resolvedNodeAgent struct {
	AgentID uint64
	Role    *teammodel.Role
}

func (s Service) executeNodeDAG(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, team teammodel.Team, roles []teammodel.Role, flow teammodel.Flow, nodes []teammodel.FlowNode, edges []teammodel.FlowNodeEdge) (string, map[string]any, error) {
	nodeByID := map[uint64]teammodel.FlowNode{}
	incoming := map[uint64][]teammodel.FlowNodeEdge{}
	for _, node := range nodes {
		nodeByID[node.ID] = node
	}
	for _, edge := range edges {
		incoming[edge.ToNodeID] = append(incoming[edge.ToNodeID], edge)
	}
	completed := s.completedNodes(ctx, flowRun.ID)
	skipped := map[uint64]bool{}
	for len(completed)+len(skipped) < len(nodes) {
		if s.runCanceled(ctx, run.ID) {
			return teammodel.RunStatusCanceled, s.repo.ListBlackboard(ctx, flowRun.ID), fmt.Errorf("运行已取消")
		}
		blackboard := s.repo.ListBlackboard(ctx, flowRun.ID)
		ready := make([]teammodel.FlowNode, 0)
		for _, node := range nodes {
			if completed[node.ID] {
				continue
			}
			if skipped[node.ID] {
				continue
			}
			if nodeRun := s.repo.FindNodeRunByNode(ctx, flowRun.ID, node.ID); nodeRun != nil && nodeRun.Status == teammodel.RunStatusWaiting {
				return teammodel.RunStatusWaiting, blackboard, runWaitError{message: "等待人工确认"}
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
			return teammodel.RunStatusFail, blackboard, fmt.Errorf("节点 DAG 无可执行节点")
		}
		for _, node := range ready {
			s.writeEdgeActiveEvents(ctx, run, flowRun, flow, node, incoming[node.ID], nodeByID)
			status, err := s.executeNode(ctx, run, flowRun, team, roles, flow, node, incoming[node.ID], nodeByID)
			if status == teammodel.RunStatusWaiting {
				return status, s.repo.ListBlackboard(ctx, flowRun.ID), err
			}
			if err != nil {
				return status, s.repo.ListBlackboard(ctx, flowRun.ID), err
			}
			completed[node.ID] = true
		}
	}
	return teammodel.RunStatusSuccess, s.repo.ListBlackboard(ctx, flowRun.ID), nil
}

func (s Service) completedNodes(ctx context.Context, flowRunID uint64) map[uint64]bool {
	result := map[uint64]bool{}
	rows := teammodel.NewNodeRunModel().Select(ctx, map[string]any{"flow_run_id": flowRunID})
	for _, row := range rows {
		if row != nil && row.Status == teammodel.RunStatusSuccess {
			result[row.NodeID] = true
		}
	}
	return result
}

func nodeReady(nodeID uint64, incoming map[uint64][]teammodel.FlowNodeEdge, completed map[uint64]bool, skipped map[uint64]bool, blackboard map[string]any, nodeByID map[uint64]teammodel.FlowNode) bool {
	edges := incoming[nodeID]
	if len(edges) == 0 {
		return true
	}
	if nodeByID[nodeID].Type == teammodel.NodeTypeMerge {
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

func markSkippedNodes(nodes []teammodel.FlowNode, incoming map[uint64][]teammodel.FlowNodeEdge, completed map[uint64]bool, skipped map[uint64]bool, blackboard map[string]any, nodeByID map[uint64]teammodel.FlowNode) bool {
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

func edgeConditionPassed(condition string, fromNode teammodel.FlowNode, blackboard map[string]any) bool {
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

func nodeOutput(node teammodel.FlowNode, blackboard map[string]any) map[string]any {
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

func (s Service) executeNode(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, team teammodel.Team, roles []teammodel.Role, flow teammodel.Flow, node teammodel.FlowNode, incoming []teammodel.FlowNodeEdge, nodeByID map[uint64]teammodel.FlowNode) (string, error) {
	blackboard := s.repo.ListBlackboard(ctx, flowRun.ID)
	config := jsonMap(node.Config)
	input := nodeInput(config, blackboard, incoming, nodeByID)
	attachNodeInteractionFeedback(input, blackboard, node)
	nodeRunID := s.repo.FindOrCreateNodeRun(ctx, run, flowRun, node, input)
	nodeRun := s.repo.FindNodeRun(ctx, nodeRunID)
	if nodeRun == nil {
		return teammodel.RunStatusFail, fmt.Errorf("创建节点运行失败")
	}
	startedAt := time.Now()
	s.repo.UpdateNodeRun(ctx, nodeRun.ID, map[string]any{
		"status":     teammodel.RunStatusRunning,
		"input":      jsonText(input),
		"started_at": startedAt,
	})
	nodeRun.Status = teammodel.RunStatusRunning
	s.writeNodeEvent(ctx, run, flowRun, flow, node, *nodeRun, stream.EventNodeStarted, map[string]any{
		"input":      input,
		"started_at": startedAt.Format(time.RFC3339Nano),
	})

	output, status, agentRunID, err := s.runNodeByType(ctx, run, flowRun, team, roles, flow, node, config, input, blackboard, incoming, nodeByID)
	finishedAt := time.Now()
	record := map[string]any{
		"status":       status,
		"output":       jsonText(output),
		"agent_run_id": agentRunID,
	}
	if status != teammodel.RunStatusWaiting {
		record["finished_at"] = finishedAt
	}
	if err != nil {
		record["error"] = err.Error()
	}
	s.repo.UpdateNodeRun(ctx, nodeRun.ID, record)
	nodeRun.Status = status
	nodeRun.AgentRunID = agentRunID
	if status == teammodel.RunStatusSuccess {
		s.writeNodeEvent(ctx, run, flowRun, flow, node, *nodeRun, stream.EventNodeOutput, map[string]any{
			"output": output,
		})
	}
	event := stream.EventNodeFinished
	if status == teammodel.RunStatusWaiting {
		event = stream.EventWaiting
	}
	fields := map[string]any{
		"output":       output,
		"agent_run_id": agentRunID,
		"error":        errorText(err),
	}
	if status != teammodel.RunStatusWaiting {
		fields["finished_at"] = finishedAt.Format(time.RFC3339Nano)
	}
	s.writeNodeEvent(ctx, run, flowRun, flow, node, *nodeRun, event, fields)
	if status == teammodel.RunStatusSuccess {
		key := firstText(config["output_key"], node.NodeKey)
		s.writeBlackboard(ctx, run, flowRun, key, output, "node", nodeRun.ID)
		s.repo.InsertMessage(ctx, map[string]any{
			"run_id":      run.ID,
			"flow_run_id": flowRun.ID,
			"node_run_id": nodeRun.ID,
			"team_id":     team.ID,
			"flow_id":     flow.ID,
			"node_id":     node.ID,
			"type":        "artifact",
			"role":        node.Type,
			"content":     jsonText(output),
		})
	}
	return status, err
}

func nodeInput(config map[string]any, blackboard map[string]any, incoming []teammodel.FlowNodeEdge, nodeByID map[uint64]teammodel.FlowNode) map[string]any {
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

func attachNodeInteractionFeedback(input map[string]any, blackboard map[string]any, node teammodel.FlowNode) {
	feedback, exists := blackboard[nodeInteractionFeedbackKey(node.NodeKey, node.ID)]
	if !exists {
		return
	}
	input["user_feedback"] = feedback
}

func nodeInteractionFeedbackKey(nodeKey string, nodeID uint64) string {
	key := strings.TrimSpace(nodeKey)
	if key == "" {
		key = fmt.Sprintf("node_%d", nodeID)
	}
	return key + "_feedback"
}

func (s Service) runNodeByType(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, team teammodel.Team, roles []teammodel.Role, flow teammodel.Flow, node teammodel.FlowNode, config map[string]any, input map[string]any, blackboard map[string]any, incoming []teammodel.FlowNodeEdge, nodeByID map[uint64]teammodel.FlowNode) (map[string]any, string, uint64, error) {
	switch node.Type {
	case teammodel.NodeTypeAgent, teammodel.NodeTypeRole:
		return s.runAgentNode(ctx, run, flowRun, team, roles, flow, node, config, input)
	case teammodel.NodeTypePower:
		return s.waitPowerNode(ctx, run, flowRun, team, flow, node, config, input)
	case teammodel.NodeTypeTeam:
		return s.runSubTeamNode(ctx, run, flowRun, team, flow, node, config, input)
	case teammodel.NodeTypeCondition:
		return runConditionNode(config, input), teammodel.RunStatusSuccess, 0, nil
	case teammodel.NodeTypeMerge:
		return map[string]any{"merged": input}, teammodel.RunStatusSuccess, 0, nil
	case teammodel.NodeTypeHumanApproval:
		return s.waitHumanNode(ctx, run, flowRun, team, flow, node, config, input)
	case teammodel.NodeTypeSave:
		return s.runSaveNode(ctx, run, flowRun, team, flow, node, blackboard, incoming, nodeByID)
	default:
		return nil, teammodel.RunStatusFail, 0, fmt.Errorf("不支持的节点类型: %s", node.Type)
	}
}

func (s Service) runAgentNode(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, team teammodel.Team, roles []teammodel.Role, flow teammodel.Flow, node teammodel.FlowNode, config map[string]any, input map[string]any) (map[string]any, string, uint64, error) {
	executor, err := s.resolveNodeAgent(ctx, team.ID, roles, node, config)
	if err != nil {
		return nil, teammodel.RunStatusFail, 0, err
	}
	goal := firstText(config["goal"], config["task"], node.Name)
	prompt := buildAgentPrompt(team, flow, node, executor, goal, input)
	nodeRunID := s.currentNodeRunID(ctx, flowRun.ID, node.ID)
	nodeRun := s.repo.FindNodeRun(ctx, nodeRunID)
	var agentRunID atomic.Uint64
	result, err := s.agent.RunInternal(ctx, agentservice.InternalRunRequest{
		AgentID:   executor.AgentID,
		RequestID: newRequestID(),
		Method:    "POST",
		Path:      "/bot/team/run",
		Input: map[string]any{
			"text":       prompt,
			"task":       goal,
			"goal":       goal,
			"team":       team.Name,
			"flow":       flow.Name,
			"node":       node.Name,
			"role":       roleInputPayload(executor.Role),
			"blackboard": input,
		},
		Options: map[string]any{
			"full_runtime": true,
			"stream":       true,
		},
		OnRunCreated: func(createdAgentRunID uint64, requestID string) {
			if nodeRunID == 0 {
				return
			}
			if createdAgentRunID > 0 {
				agentRunID.Store(createdAgentRunID)
			}
			s.repo.UpdateNodeRun(context.Background(), nodeRunID, map[string]any{
				"agent_run_id": createdAgentRunID,
			})
		},
		OnStream: func(payload map[string]any) {
			s.forwardAgentNodeStream(context.Background(), run, flowRun, flow, node, nodeRun, agentRunID.Load(), payload)
		},
	})
	if err != nil {
		return nil, teammodel.RunStatusFail, 0, err
	}
	if interaction := agentNodeInteraction(result.Output); len(interaction) > 0 {
		approvalID := s.insertAgentInteractionApproval(ctx, run, flowRun, team, flow, node, nodeRunID, input, result.Output, interaction)
		return map[string]any{
			"approval_id": approvalID,
			"interaction": interaction,
			"text":        firstText(result.Summary, result.Output["text"]),
			"pending":     true,
		}, teammodel.RunStatusWaiting, result.RunID, runWaitError{message: "等待用户反馈"}
	}
	return map[string]any{
		"summary":      result.Summary,
		"output":       result.Output,
		"agent_run_id": result.RunID,
		"role":         roleInputPayload(executor.Role),
	}, teammodel.RunStatusSuccess, result.RunID, nil
}

func (s Service) forwardAgentNodeStream(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, flow teammodel.Flow, node teammodel.FlowNode, nodeRun *teammodel.NodeRun, agentRunID uint64, payload map[string]any) {
	if nodeRun == nil || len(payload) == 0 {
		return
	}
	if textValue(payload["type"]) == "result" {
		return
	}
	output := mapValue(payload["output"])
	if len(output) == 0 {
		return
	}
	fields := map[string]any{
		"output":            output,
		"agent_run_id":      agentRunID,
		"agent_request_id":  textValue(payload["request_id"]),
		"agent_stream_type": textValue(payload["type"]),
	}
	if textValue(payload["msg"]) != "" && intValue(payload["status"], 1) == 2 {
		fields["error"] = textValue(payload["msg"])
	}
	s.writeNodeEvent(ctx, run, flowRun, flow, node, *nodeRun, stream.EventNodeOutput, fields)
}

func agentNodeInteraction(output map[string]any) map[string]any {
	if len(output) == 0 {
		return nil
	}
	if !strings.EqualFold(textValue(output["event"]), "interaction") {
		return nil
	}
	interaction := mapValue(output["interaction"])
	if textValue(interaction["type"]) == "" {
		return nil
	}
	return interaction
}

func (s Service) insertAgentInteractionApproval(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, team teammodel.Team, flow teammodel.Flow, node teammodel.FlowNode, nodeRunID uint64, input map[string]any, output map[string]any, interaction map[string]any) uint64 {
	return s.repo.InsertApproval(ctx, map[string]any{
		"run_id":      run.ID,
		"flow_run_id": flowRun.ID,
		"node_run_id": nodeRunID,
		"team_id":     team.ID,
		"flow_id":     flow.ID,
		"node_id":     node.ID,
		"title":       firstText(interaction["title"], node.Name),
		"content": jsonText(map[string]any{
			"kind":        "agent_interaction",
			"input":       input,
			"output":      output,
			"interaction": interaction,
		}),
		"comment":  "",
		"decision": "pending",
		"status":   teammodel.RunStatusPending,
	})
}

func (s Service) resolveNodeAgent(ctx context.Context, teamID uint64, roles []teammodel.Role, node teammodel.FlowNode, config map[string]any) (resolvedNodeAgent, error) {
	if node.Type == teammodel.NodeTypeAgent && node.AgentID > 0 {
		return resolvedNodeAgent{AgentID: node.AgentID}, nil
	}
	roleID := firstUint64(node.RoleID, uint64Value(config["role_id"]), uint64Value(config["roleId"]))
	roleKey := firstText(node.RoleKey, config["role_key"], config["roleKey"])
	roleType := firstText(config["role_type"], config["roleType"])
	roleTeamID := firstUint64(uint64Value(config["role_team_id"]), uint64Value(config["roleTeamId"]), teamID)
	runtimeRoles := roles
	if roleTeamID != teamID {
		runtimeRoles = nil
	}
	role, ok := s.resolveTeamRole(ctx, roleTeamID, runtimeRoles, roleID, roleKey, roleType, node.Type == teammodel.NodeTypeRole)
	if !ok {
		if node.AgentID > 0 {
			return resolvedNodeAgent{AgentID: node.AgentID}, nil
		}
		if node.Type == teammodel.NodeTypeRole {
			return resolvedNodeAgent{}, fmt.Errorf("角色节点未绑定可用角色: %s", node.Name)
		}
		return resolvedNodeAgent{}, fmt.Errorf("节点未绑定智能体或角色: %s", node.Name)
	}
	if role.AgentID == 0 {
		return resolvedNodeAgent{}, fmt.Errorf("角色未绑定智能体: %s", role.Name)
	}
	return resolvedNodeAgent{
		AgentID: role.AgentID,
		Role:    role,
	}, nil
}

func (s Service) resolveTeamRole(ctx context.Context, teamID uint64, roles []teammodel.Role, roleID uint64, roleKey string, roleType string, allowDefault bool) (*teammodel.Role, bool) {
	if role, ok := findRuntimeRole(roles, roleID, roleKey, roleType, allowDefault); ok {
		return role, true
	}
	if len(roles) > 0 {
		return nil, false
	}
	if role, ok := s.repo.FindRole(ctx, teamID, roleID, roleKey); ok {
		return role, true
	}
	if strings.TrimSpace(roleType) != "" {
		return s.repo.FindDefaultRole(ctx, teamID, roleType)
	}
	if allowDefault {
		return s.repo.FindDefaultRole(ctx, teamID, teammodel.RoleTypeWorker)
	}
	return nil, false
}

func findRuntimeRole(roles []teammodel.Role, roleID uint64, roleKey string, roleType string, allowDefault bool) (*teammodel.Role, bool) {
	if len(roles) == 0 {
		return nil, false
	}
	roleKey = strings.TrimSpace(roleKey)
	for index := range roles {
		role := &roles[index]
		if role.Status != teammodel.StatusEnabled {
			continue
		}
		if roleID > 0 && role.ID == roleID {
			return role, true
		}
		if roleKey != "" && role.RoleKey == roleKey {
			return role, true
		}
	}
	hasRoleType := strings.TrimSpace(roleType) != ""
	if !hasRoleType && !allowDefault {
		return nil, false
	}
	roleType = normalizeRoleType(roleType)
	var first *teammodel.Role
	for index := range roles {
		role := &roles[index]
		if role.Status != teammodel.StatusEnabled || role.RoleType != roleType {
			continue
		}
		if roleSortBefore(role, first) {
			first = role
		}
	}
	return first, first != nil
}

func buildAgentPrompt(team teammodel.Team, flow teammodel.Flow, node teammodel.FlowNode, executor resolvedNodeAgent, goal string, input map[string]any) string {
	parts := []string{
		"你正在作为 Team 编排中的一个智能体节点执行任务。",
		fmt.Sprintf("团队：%s", team.Name),
	}
	appendPromptText(&parts, "团队说明", team.Description)
	parts = append(parts, fmt.Sprintf("当前工作流：%s", flow.Name))
	appendPromptText(&parts, "工作流目标", flow.Goal)
	parts = append(parts, fmt.Sprintf("当前节点：%s", node.Name))
	if executor.Role != nil {
		parts = append(parts, fmt.Sprintf("当前角色：%s（%s / %s）", executor.Role.Name, executor.Role.RoleType, executor.Role.RoleKey))
		appendPromptText(&parts, "角色职责", executor.Role.Assignment)
	}
	appendPromptText(&parts, "节点目标", goal)
	parts = append(
		parts,
		"请严格基于输入黑板执行当前节点任务，输出清晰、可被下游节点继续使用的结果。",
		"用户交互规则：如果节点目标或输入要求用户选择、确认、补充信息、补充素材或给出反馈，或者当前信息不足以可靠执行，必须按 agent-interaction 协议发起表单交互，不能替用户做决定；用户提交后会以 user_feedback 写回输入黑板，你必须基于 user_feedback 继续完成当前节点。能枚举选项时优先使用 option 或 multi_option，缺少图片、视频、音频、文件等素材时使用 file 或 files。只有信息足够且不需要用户决策时，才输出最终结果。",
		fmt.Sprintf("输入黑板：%s", jsonText(input)),
	)
	return strings.Join(parts, "\n\n")
}

func roleInputPayload(role *teammodel.Role) map[string]any {
	if role == nil {
		return map[string]any{}
	}
	return map[string]any{
		"id":         role.ID,
		"type":       role.RoleType,
		"key":        role.RoleKey,
		"name":       role.Name,
		"agent_id":   role.AgentID,
		"assignment": role.Assignment,
	}
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

func (s Service) waitHumanNode(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, team teammodel.Team, flow teammodel.Flow, node teammodel.FlowNode, config map[string]any, input map[string]any) (map[string]any, string, uint64, error) {
	nodeRun := s.repo.FindNodeRunByNode(ctx, flowRun.ID, node.ID)
	if nodeRun == nil {
		return nil, teammodel.RunStatusFail, 0, fmt.Errorf("人工节点运行记录不存在")
	}
	if approval := s.repo.FindPendingApprovalByNodeRun(ctx, nodeRun.ID); approval != nil {
		return map[string]any{"approval_id": approval.ID, "pending": true}, teammodel.RunStatusWaiting, 0, runWaitError{message: "等待人工确认"}
	}
	sourceKey := firstText(config["source_key"], config["body_key"])
	content := input
	if sourceKey != "" {
		content = map[string]any{sourceKey: input[sourceKey]}
	}
	title := firstText(config["title"], node.Name)
	approvalID := s.repo.InsertApproval(ctx, map[string]any{
		"run_id":      run.ID,
		"flow_run_id": flowRun.ID,
		"node_run_id": nodeRun.ID,
		"team_id":     team.ID,
		"flow_id":     flow.ID,
		"node_id":     node.ID,
		"title":       title,
		"content":     jsonText(content),
		"comment":     "",
		"decision":    "pending",
		"status":      teammodel.RunStatusPending,
	})
	return map[string]any{"approval_id": approvalID, "pending": true}, teammodel.RunStatusWaiting, 0, runWaitError{message: "等待人工确认"}
}

func (s Service) waitPowerNode(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, team teammodel.Team, flow teammodel.Flow, node teammodel.FlowNode, config map[string]any, input map[string]any) (map[string]any, string, uint64, error) {
	nodeRun := s.repo.FindNodeRunByNode(ctx, flowRun.ID, node.ID)
	if nodeRun == nil {
		return nil, teammodel.RunStatusFail, 0, fmt.Errorf("能力节点运行记录不存在")
	}
	if approval := s.repo.FindPendingApprovalByNodeRun(ctx, nodeRun.ID); approval != nil {
		return map[string]any{"approval_id": approval.ID, "pending": true}, teammodel.RunStatusWaiting, 0, runWaitError{message: "等待能力参数"}
	}
	powerKey := firstText(config["power_key"], config["power"])
	if powerKey == "" && node.PowerID > 0 {
		if power, ok := s.repo.FindPowerOption(ctx, node.PowerID, ""); ok {
			powerKey = power.Key
		}
	}
	if powerKey == "" {
		return nil, teammodel.RunStatusFail, 0, fmt.Errorf("能力节点未绑定能力: %s", node.Name)
	}
	interaction := map[string]any{
		"id":          fmt.Sprintf("team-power-%d", node.ID),
		"type":        "power_params",
		"title":       node.Name,
		"description": "补充能力参数后继续执行流程。",
		"power":       powerKey,
		"values":      input,
	}
	approvalID := s.repo.InsertApproval(ctx, map[string]any{
		"run_id":      run.ID,
		"flow_run_id": flowRun.ID,
		"node_run_id": nodeRun.ID,
		"team_id":     team.ID,
		"flow_id":     flow.ID,
		"node_id":     node.ID,
		"title":       node.Name,
		"content": jsonText(map[string]any{
			"kind":        "power",
			"power":       powerKey,
			"input":       input,
			"interaction": interaction,
		}),
		"comment":  "",
		"decision": "pending",
		"status":   teammodel.RunStatusPending,
	})
	return map[string]any{
		"approval_id": approvalID,
		"interaction": interaction,
		"pending":     true,
	}, teammodel.RunStatusWaiting, 0, runWaitError{message: "等待能力参数"}
}

func (s Service) runSubTeamNode(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, team teammodel.Team, flow teammodel.Flow, node teammodel.FlowNode, config map[string]any, input map[string]any) (map[string]any, string, uint64, error) {
	targetTeamID := firstUint64(node.SubTeamID, uint64Value(config["sub_team_id"]), run.TeamID)
	if targetTeamID == 0 {
		return nil, teammodel.RunStatusFail, 0, fmt.Errorf("团队节点未绑定团队: %s", node.Name)
	}
	subFlowID := firstUint64(uint64Value(config["sub_flow_id"]), uint64Value(config["flow_id"]))
	releaseID := uint64Value(config["release_id"])
	result, status, err := s.executeSubTeamWorkflow(ctx, run, flow, targetTeamID, subFlowID, releaseID, input)
	if err != nil {
		return result, status, 0, err
	}
	return result, status, 0, nil
}

func (s Service) executeSubTeamWorkflow(ctx context.Context, run teammodel.Run, currentFlow teammodel.Flow, targetTeamID uint64, subFlowID uint64, releaseID uint64, input map[string]any) (map[string]any, string, error) {
	graph, err := s.subTeamRuntimeGraph(ctx, run, targetTeamID, releaseID)
	if err != nil {
		return nil, teammodel.RunStatusFail, err
	}
	if subFlowID == 0 && targetTeamID == run.TeamID {
		return nil, teammodel.RunStatusFail, fmt.Errorf("团队节点未选择工作流，不能递归执行当前团队")
	}
	if subFlowID > 0 {
		subFlow := graph.findFlow(subFlowID)
		if subFlow.ID == 0 {
			return nil, teammodel.RunStatusFail, fmt.Errorf("团队工作流不存在或未发布")
		}
		if targetTeamID == run.TeamID && subFlow.ID == currentFlow.ID {
			return nil, teammodel.RunStatusFail, fmt.Errorf("团队节点不能执行当前工作流本身")
		}
		status, output, err := s.executeFlowWithGraph(
			ctx,
			run,
			graph.Team,
			graph.Roles,
			subFlow,
			input,
			graph.NodesByFlowID[subFlow.ID],
			graph.NodeEdgesByFlowID[subFlow.ID],
		)
		finalOutput := subFlowTerminalOutput(
			graph.NodesByFlowID[subFlow.ID],
			graph.NodeEdgesByFlowID[subFlow.ID],
			output,
		)
		return subTeamWorkflowOutput(graph.Team.ID, subFlow.ID, subFlow.Name, finalOutput, output), status, err
	}
	status, output, err := s.executeFlowDAG(ctx, run, graph, input)
	return subTeamWorkflowOutput(graph.Team.ID, 0, "", output, output), status, err
}

func (s Service) subTeamRuntimeGraph(ctx context.Context, run teammodel.Run, targetTeamID uint64, releaseID uint64) (runtimeGraph, error) {
	targetTeam, err := s.repo.FindTeam(ctx, targetTeamID)
	if err != nil {
		return runtimeGraph{}, err
	}
	if releaseID > 0 {
		release, releaseErr := s.runnableRelease(ctx, targetTeam, releaseID)
		if releaseErr != nil {
			return runtimeGraph{}, releaseErr
		}
		return runtimeGraphFromRelease(*release)
	}
	if run.ReleaseID == 0 {
		return s.currentRuntimeGraph(ctx, targetTeam), nil
	}
	if targetTeamID == run.TeamID {
		return s.runtimeGraphForRun(ctx, run)
	}
	release, releaseErr := s.runnableRelease(ctx, targetTeam, 0)
	if releaseErr != nil {
		return runtimeGraph{}, releaseErr
	}
	return runtimeGraphFromRelease(*release)
}

func subFlowTerminalOutput(nodes []teammodel.FlowNode, edges []teammodel.FlowNodeEdge, blackboard map[string]any) map[string]any {
	if len(nodes) == 0 || len(blackboard) == 0 {
		return blackboard
	}
	outgoing := map[uint64]bool{}
	for _, edge := range edges {
		outgoing[edge.FromNodeID] = true
	}
	terminalNodes := make([]teammodel.FlowNode, 0)
	for _, node := range nodes {
		if !outgoing[node.ID] {
			terminalNodes = append(terminalNodes, node)
		}
	}
	if len(terminalNodes) == 0 {
		return blackboard
	}
	if len(terminalNodes) == 1 {
		if output := nodeOutput(terminalNodes[0], blackboard); len(output) > 0 {
			return output
		}
		return blackboard
	}
	result := map[string]any{}
	for _, node := range terminalNodes {
		output := nodeOutput(node, blackboard)
		if len(output) == 0 {
			continue
		}
		result[firstText(node.Name, node.NodeKey)] = output
	}
	if len(result) == 0 {
		return blackboard
	}
	return result
}

func subTeamWorkflowOutput(teamID uint64, flowID uint64, flowName string, output map[string]any, blackboard map[string]any) map[string]any {
	return map[string]any{
		"team_id":    teamID,
		"flow_id":    flowID,
		"flow_name":  flowName,
		"output":     output,
		"blackboard": blackboard,
	}
}

func (s Service) runSaveNode(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, team teammodel.Team, flow teammodel.Flow, node teammodel.FlowNode, blackboard map[string]any, incoming []teammodel.FlowNodeEdge, nodeByID map[uint64]teammodel.FlowNode) (map[string]any, string, uint64, error) {
	body, err := singleIncomingNodeOutput("保存", incoming, nodeByID, blackboard)
	if err != nil {
		return nil, teammodel.RunStatusFail, 0, err
	}
	assetName := firstText(valueAtPath(body, "title"), flow.Name)
	nodeRunID := s.currentNodeRunID(ctx, flowRun.ID, node.ID)
	if isDebugRun(run) {
		return debugSaveOutput(assetName, firstText(valueAtPath(body, "kind"), "mixed"), body), teammodel.RunStatusSuccess, 0, nil
	}
	asset, version, err := s.asset.SaveVersion(ctx, assetservice.SaveVersionRequest{
		ProjectID: run.ProjectID,
		TeamID:    team.ID,
		FlowID:    flow.ID,
		RunID:     run.ID,
		NodeRunID: nodeRunID,
		ReleaseID: run.ReleaseID,
		Name:      assetName,
		Kind:      firstText(valueAtPath(body, "kind"), "mixed"),
		Content:   body,
	})
	if err != nil {
		return nil, teammodel.RunStatusFail, 0, err
	}
	memoryTitle := fmt.Sprintf("%s 记忆", node.Name)
	memoryID := s.memory.Save(ctx, memoryservice.SaveRequest{
		OwnerType:  memorymodel.OwnerTypeTeam,
		OwnerID:    team.ID,
		ProjectID:  run.ProjectID,
		TeamID:     team.ID,
		FlowID:     flow.ID,
		RunID:      run.ID,
		NodeRunID:  nodeRunID,
		AssetID:    asset.ID,
		VersionID:  version.ID,
		Kind:       "episodic",
		Title:      memoryTitle,
		Content:    jsonText(body),
		Tags:       "[]",
		Importance: 50,
	})
	return map[string]any{
		"asset_id":   asset.ID,
		"version_id": version.ID,
		"memory_id":  memoryID,
	}, teammodel.RunStatusSuccess, 0, nil
}

func isDebugRun(run teammodel.Run) bool {
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

func singleIncomingNodeOutput(label string, incoming []teammodel.FlowNodeEdge, nodeByID map[uint64]teammodel.FlowNode, blackboard map[string]any) (map[string]any, error) {
	if len(incoming) != 1 {
		return nil, fmt.Errorf("%s节点需要且只需要一个上游节点", label)
	}
	fromNode := nodeByID[incoming[0].FromNodeID]
	if fromNode.ID == 0 {
		return nil, fmt.Errorf("%s节点的上游节点不存在", label)
	}
	return nodeOutput(fromNode, blackboard), nil
}

func (s Service) writeBlackboard(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, key string, value any, sourceKind string, sourceID uint64) {
	key = strings.TrimSpace(key)
	if key == "" {
		return
	}
	s.repo.UpsertBlackboard(ctx, map[string]any{
		"run_id":      run.ID,
		"flow_run_id": flowRun.ID,
		"team_id":     run.TeamID,
		"flow_id":     flowRun.FlowID,
		"key":         key,
		"value":       jsonText(value),
		"source_kind": sourceKind,
		"source_id":   sourceID,
	})
}

func (s Service) currentNodeRunID(ctx context.Context, flowRunID uint64, nodeID uint64) uint64 {
	if row := s.repo.FindNodeRunByNode(ctx, flowRunID, nodeID); row != nil {
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

func firstUint64(values ...uint64) uint64 {
	for _, value := range values {
		if value > 0 {
			return value
		}
	}
	return 0
}
