package team

import (
	"context"
	"fmt"
	"strings"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
	runtimeloop "github.com/dever-package/bot/service/agent/runtime/loop"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func (s Service) executeAgentNode(
	ctx context.Context,
	run teammodel.Run,
	flowRun teammodel.FlowRun,
	team teammodel.Team,
	flow teammodel.Flow,
	node teammodel.FlowNode,
	config map[string]any,
	input map[string]any,
	executor resolvedNodeAgent,
) (map[string]any, string, uint64, error) {
	nodeRun := s.repo.FindNodeRunByNode(ctx, flowRun.ID, node.ID)
	if nodeRun == nil {
		return nil, teammodel.RunStatusFail, 0, fmt.Errorf("智能体节点运行记录不存在")
	}

	runContext, serverContext, err := restoreRunScope(ctx, run)
	if err != nil {
		return nil, teammodel.RunStatusFail, 0, err
	}
	contextKey := fmt.Sprintf("team:%d:flow:%d:node:%d:run:%d", team.ID, flow.ID, node.ID, run.ID)
	session, err := s.agent.EnsureSession(runContext, runtimeloop.AgentSessionRequest{
		AgentIdentity: fmt.Sprintf("%d", executor.AgentID),
		SessionID:     nodeRun.AgentSessionID,
		ContextKey:    contextKey,
		Title:         node.Name,
	})
	if err != nil {
		return nil, teammodel.RunStatusFail, 0, err
	}

	agentInput, err := teamAgentInput(
		agentNodeTask(config, input, node.Name),
		map[string]any{
			"team":  map[string]any{"id": team.ID, "name": team.Name},
			"flow":  map[string]any{"id": flow.ID, "name": flow.Name, "goal": flow.Goal},
			"node":  map[string]any{"id": node.ID, "key": node.NodeKey, "name": node.Name, "type": node.Type},
			"role":  roleInputPayload(executor.Role),
			"input": input,
		},
		jsonMap(nodeRun.Interaction),
		jsonMap(nodeRun.InteractionResponse),
	)
	if err != nil {
		return nil, teammodel.RunStatusFail, 0, err
	}

	requestID := strings.TrimSpace(nodeRun.ChildRequestID)
	agentRunID := nodeRun.AgentRunID
	if requestID == "" || len(jsonMap(nodeRun.InteractionResponse)) > 0 {
		billing := runBillingContext(run)
		billing.RunID = run.ID
		start := s.agent.RunChat(runContext, runtimeloop.ChatRequest{
			AgentIdentity: fmt.Sprintf("%d", executor.AgentID),
			SessionID:     session.ID,
			ContextKey:    contextKey,
			Input:         agentInput,
			Billing:       billing,
			Method:        "POST",
			Path:          "/bot/team/run",
			Server:        serverContext,
		})
		requestID = textValue(start["request_id"])
		if intValue(start["status"], botprotocol.ResponseStatusSuccess) != botprotocol.ResponseStatusSuccess {
			return nil, teammodel.RunStatusFail, 0, fmt.Errorf("%s", firstText(start["msg"], "智能体运行启动失败"))
		}
		if requestID == "" {
			return nil, teammodel.RunStatusFail, 0, fmt.Errorf("智能体运行请求ID为空")
		}
		agentRunID = agentRunIDFromPayload(start)
		s.repo.UpdateNodeRun(runContext, nodeRun.ID, map[string]any{
			"agent_session_id": session.ID,
			"agent_run_id":     agentRunID,
			"child_request_id": requestID,
		})
		nodeRun.AgentSessionID = session.ID
		nodeRun.AgentRunID = agentRunID
		nodeRun.ChildRequestID = requestID
	}

	result, err := s.agent.ObserveRun(runContext, runtimeloop.ObserveRunRequest{
		RequestID: requestID,
		Block:     time.Second,
		OnPayload: func(payload map[string]any) {
			if currentRunID := agentRunIDFromPayload(payload); currentRunID > 0 && agentRunID == 0 {
				agentRunID = currentRunID
				s.repo.UpdateNodeRun(context.WithoutCancel(runContext), nodeRun.ID, map[string]any{"agent_run_id": currentRunID})
			}
			s.forwardAgentNodeStream(context.WithoutCancel(runContext), run, flowRun, flow, node, nodeRun, agentRunID, payload)
		},
	})
	if result.RunID > 0 {
		agentRunID = result.RunID
	}
	if err != nil {
		return nil, teammodel.RunStatusFail, agentRunID, err
	}
	if interaction := agentNodeInteraction(result.Output); len(interaction) > 0 {
		s.repo.UpdateNodeRun(runContext, nodeRun.ID, map[string]any{
			"interaction":          jsonText(interaction),
			"interaction_response": "{}",
			"agent_run_id":         agentRunID,
		})
		return map[string]any{
			"interaction": interaction,
			"text":        firstText(result.Output["text"]),
			"pending":     true,
		}, teammodel.RunStatusWaiting, agentRunID, runWaitError{message: "等待用户反馈"}
	}
	s.repo.UpdateNodeRun(runContext, nodeRun.ID, map[string]any{
		"interaction":          "{}",
		"interaction_response": "{}",
		"agent_run_id":         agentRunID,
	})
	return map[string]any{
		"output":           result.Output,
		"agent_run_id":     agentRunID,
		"agent_session_id": session.ID,
		"role":             roleInputPayload(executor.Role),
	}, teammodel.RunStatusSuccess, agentRunID, nil
}

func agentNodeTask(config map[string]any, input map[string]any, fallback string) string {
	if task := firstText(config["goal"], config["task"], config["prompt"]); task != "" {
		return task
	}
	if task := firstText(input["task"], input["goal"], input["prompt"], input["text"]); task != "" {
		return task
	}
	return strings.TrimSpace(fallback)
}

func teamAgentInput(task string, workflowContext map[string]any, interaction map[string]any, response map[string]any) (map[string]any, error) {
	result := map[string]any{
		"text":             task,
		"workflow_context": workflowContext,
	}
	if len(response) == 0 {
		return result, nil
	}
	interactionID := textValue(interaction["id"])
	if interactionID == "" {
		return nil, fmt.Errorf("待恢复交互缺少标识")
	}
	result["content"] = map[string]any{
		"version": 1,
		"parts": []any{
			map[string]any{"type": "text", "text": task},
		},
		"interaction_response": map[string]any{
			"interaction_id": interactionID,
			"data":           response,
		},
	}
	return result, nil
}

func agentRunIDFromPayload(payload map[string]any) uint64 {
	return uint64Value(mapValue(mapValue(payload["output"])["meta"])["run_id"])
}
