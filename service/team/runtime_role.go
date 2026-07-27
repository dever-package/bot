package team

import (
	"context"
	"fmt"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
	runtimeloop "github.com/dever-package/bot/service/agent/runtime/loop"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	"github.com/dever-package/bot/service/stream"
)

func (s Service) RunRole(ctx context.Context, req RunRequest) (map[string]any, error) {
	team, err := s.repo.FindTeam(ctx, req.TeamID)
	if err != nil {
		return nil, err
	}
	roleID := firstUint64(req.RoleID, uint64Value(req.Input["_role_id"]))
	if roleID == 0 {
		return nil, fmt.Errorf("角色不能为空")
	}
	release, err := s.runnableRelease(ctx, team, req.ReleaseID)
	if err != nil {
		return nil, err
	}
	graph, err := runtimeGraphFromRelease(*release)
	if err != nil {
		return nil, err
	}
	if _, ok := findDirectRunRole(graph.Roles, roleID); !ok {
		return nil, fmt.Errorf("只能直接运行沟通角色")
	}
	requestID := req.RequestID
	if requestID == "" {
		requestID = newRequestID()
	}
	runInput := cloneInput(req.Input)
	runInput["_mode"] = "role"
	runInput["_role_id"] = roleID
	attachRunBilling(runInput, req.Billing)
	now := time.Now()
	runRecord := map[string]any{
		"request_id": requestID,
		"project_id": req.ProjectID,
		"team_id":    team.ID,
		"release_id": release.ID,
		"input":      jsonText(runInput),
		"output":     "{}",
		"error":      "",
		"status":     teammodel.RunStatusRunning,
		"started_at": now,
		"created_at": now,
		"updated_at": now,
	}
	attachRunScope(ctx, runRecord)
	runID := s.repo.InsertRun(ctx, runRecord)
	if runID == 0 {
		return nil, fmt.Errorf("创建角色运行失败")
	}
	s.writeRunEvent(ctx, teammodel.Run{
		ID:        runID,
		RequestID: requestID,
		ProjectID: req.ProjectID,
		TeamID:    team.ID,
		ReleaseID: release.ID,
		Status:    teammodel.RunStatusRunning,
		StartedAt: now,
		CreatedAt: now,
	}, stream.EventRunStarted, map[string]any{
		"feature":    stream.FeatureTeam,
		"scope":      "run",
		"mode":       "role",
		"role_id":    roleID,
		"input":      runInput,
		"version":    release.Version,
		"started_at": now.Format(time.RFC3339Nano),
		"team": map[string]any{
			"id":   team.ID,
			"name": team.Name,
		},
	})
	s.runAsync(context.Background(), runID, func(ctx context.Context) {
		s.executeRoleRun(ctx, runID)
	})
	return map[string]any{
		"request_id": requestID,
		"run_id":     runID,
		"status":     teammodel.RunStatusRunning,
		"release_id": release.ID,
		"version":    release.Version,
		"role_id":    roleID,
	}, nil
}

func (s Service) executeRoleRun(ctx context.Context, runID uint64) {
	run := s.repo.FindRun(ctx, runID)
	if run == nil || run.Status == teammodel.RunStatusCanceled {
		return
	}
	graph, err := s.runtimeGraphForRun(ctx, *run)
	if err != nil {
		s.finishRun(ctx, run.ID, teammodel.RunStatusFail, nil, err)
		return
	}
	input := jsonMap(run.Input)
	roleID := uint64Value(input["_role_id"])
	role, ok := findDirectRunRole(graph.Roles, roleID)
	if !ok {
		s.finishRun(ctx, run.ID, teammodel.RunStatusFail, nil, fmt.Errorf("只能直接运行沟通角色"))
		return
	}
	status, output, err := s.executeStandaloneRole(ctx, *run, graph.Team, role, executionInput(input))
	s.finishRun(ctx, run.ID, status, output, err)
}

func (s Service) executeStandaloneRole(ctx context.Context, run teammodel.Run, team teammodel.Team, role teammodel.Role, input map[string]any) (string, map[string]any, error) {
	if role.AgentID == 0 {
		return teammodel.RunStatusFail, nil, fmt.Errorf("角色未绑定智能体")
	}
	runContext, serverContext, err := restoreRunScope(ctx, run)
	if err != nil {
		return teammodel.RunStatusFail, nil, err
	}
	contextKey := fmt.Sprintf("team:%d:role:%d:run:%d", team.ID, role.ID, run.ID)
	session, err := s.agent.EnsureSession(runContext, runtimeloop.AgentSessionRequest{
		AgentIdentity: fmt.Sprintf("%d", role.AgentID),
		SessionID:     run.AgentSessionID,
		ContextKey:    contextKey,
		Title:         role.Name,
	})
	if err != nil {
		return teammodel.RunStatusFail, nil, err
	}
	agentInput, err := teamAgentInput(
		agentNodeTask(map[string]any{}, input, role.Name),
		map[string]any{
			"team":  map[string]any{"id": team.ID, "name": team.Name},
			"role":  roleWorkflowContextPayload(&role),
			"input": input,
		},
		jsonMap(run.Interaction),
		jsonMap(run.InteractionResponse),
	)
	if err != nil {
		return teammodel.RunStatusFail, nil, err
	}
	billing := runBillingContext(run)
	billing.RunID = run.ID
	start := s.agent.RunChat(runContext, runtimeloop.ChatRequest{
		AgentIdentity: fmt.Sprintf("%d", role.AgentID),
		SessionID:     session.ID,
		ContextKey:    contextKey,
		Input:         agentInput,
		RuntimePrompt: roleRuntimePrompt(&role),
		Billing:       billing,
		Method:        "POST",
		Path:          "/bot/team/role/run",
		Server:        serverContext,
	})
	requestID := textValue(start["request_id"])
	if intValue(start["status"], botprotocol.ResponseStatusSuccess) != botprotocol.ResponseStatusSuccess {
		return teammodel.RunStatusFail, nil, fmt.Errorf("%s", firstText(start["msg"], "智能体运行启动失败"))
	}
	if requestID == "" {
		return teammodel.RunStatusFail, nil, fmt.Errorf("智能体运行请求ID为空")
	}
	agentRunID := agentRunIDFromPayload(start)
	s.repo.UpdateRun(runContext, run.ID, map[string]any{
		"agent_session_id": session.ID,
		"agent_run_id":     agentRunID,
		"child_request_id": requestID,
	})
	s.writeStandaloneRoleEvent(runContext, run, role, stream.EventNodeStarted, teammodel.RunStatusRunning, map[string]any{
		"agent_run_id":     agentRunID,
		"agent_request_id": requestID,
		"started_at":       time.Now().Format(time.RFC3339Nano),
	})
	result, err := s.agent.ObserveRun(runContext, runtimeloop.ObserveRunRequest{
		RequestID: requestID,
		Block:     time.Second,
		OnPayload: func(payload map[string]any) {
			if current := agentRunIDFromPayload(payload); current > 0 {
				agentRunID = current
			}
			if textValue(payload["type"]) == "result" {
				return
			}
			output := mapValue(payload["output"])
			if len(output) > 0 {
				s.writeStandaloneRoleEvent(context.WithoutCancel(runContext), run, role, stream.EventNodeOutput, teammodel.RunStatusRunning, map[string]any{
					"output":            output,
					"agent_run_id":      agentRunID,
					"agent_request_id":  requestID,
					"agent_stream_type": textValue(payload["type"]),
				})
			}
		},
	})
	if result.RunID > 0 {
		agentRunID = result.RunID
	}
	if err != nil {
		s.writeStandaloneRoleEvent(runContext, run, role, stream.EventNodeFinished, teammodel.RunStatusFail, map[string]any{
			"error":       err.Error(),
			"finished_at": time.Now().Format(time.RFC3339Nano),
		})
		return teammodel.RunStatusFail, nil, err
	}
	if interaction := agentNodeInteraction(result.Output); len(interaction) > 0 {
		s.repo.UpdateRun(runContext, run.ID, map[string]any{
			"interaction":          jsonText(interaction),
			"interaction_response": "{}",
			"agent_run_id":         agentRunID,
		})
		output := map[string]any{
			"interaction": interaction,
			"text":        firstText(result.Output["text"]),
			"pending":     true,
		}
		s.writeStandaloneRoleEvent(ctx, run, role, stream.EventWaiting, teammodel.RunStatusWaiting, map[string]any{
			"output": output,
		})
		return teammodel.RunStatusWaiting, output, runWaitError{message: "等待用户反馈"}
	}
	s.repo.UpdateRun(runContext, run.ID, map[string]any{
		"interaction":          "{}",
		"interaction_response": "{}",
		"agent_run_id":         agentRunID,
	})
	output := map[string]any{
		"output":           result.Output,
		"agent_run_id":     agentRunID,
		"agent_session_id": session.ID,
		"role":             roleInputPayload(&role),
	}
	s.writeStandaloneRoleEvent(ctx, run, role, stream.EventNodeFinished, teammodel.RunStatusSuccess, map[string]any{
		"output":       output,
		"agent_run_id": agentRunID,
		"finished_at":  time.Now().Format(time.RFC3339Nano),
	})
	return teammodel.RunStatusSuccess, output, nil
}

func (s Service) writeStandaloneRoleEvent(ctx context.Context, run teammodel.Run, role teammodel.Role, event string, status string, fields map[string]any) {
	if fields == nil {
		fields = map[string]any{}
	}
	fields["feature"] = stream.FeatureAgent
	fields["scope"] = "role"
	fields["node_key"] = fmt.Sprintf("role:%d", role.ID)
	fields["node_name"] = role.Name
	fields["node_type"] = teammodel.NodeTypeRole
	fields["role_id"] = role.ID
	fields["role_name"] = role.Name
	fields["role_type"] = role.RoleType
	fields["agent_id"] = role.AgentID
	fields["status"] = status
	s.writeRunEvent(ctx, run, event, fields)
}

func findRoleByID(roles []teammodel.Role, roleID uint64) (teammodel.Role, bool) {
	for _, role := range roles {
		if role.ID == roleID {
			return role, true
		}
	}
	return teammodel.Role{}, false
}

func findDirectRunRole(roles []teammodel.Role, roleID uint64) (teammodel.Role, bool) {
	role, ok := findRoleByID(roles, roleID)
	if !ok || role.RoleType != teammodel.RoleTypeChat {
		return teammodel.Role{}, false
	}
	return role, true
}
