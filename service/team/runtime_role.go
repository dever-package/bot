package team

import (
	"context"
	"fmt"
	"time"

	teammodel "my/package/bot/model/team"
	agentservice "my/package/bot/service/agent"
	"my/package/bot/service/stream"
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
	now := time.Now()
	runID := s.repo.InsertRun(ctx, map[string]any{
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
	})
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
	go s.executeRoleRun(context.Background(), runID)
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
	flow := teammodel.Flow{Name: "角色"}
	node := teammodel.FlowNode{
		Name:        role.Name,
		Type:        teammodel.NodeTypeRole,
		RoleID:      role.ID,
		RoleKey:     role.RoleKey,
		AgentID:     role.AgentID,
		AssetCateID: role.AssetCateID,
	}
	executor := resolvedNodeAgent{AgentID: role.AgentID, Role: &role}
	goal := firstText(input["goal"], input["task"], input["prompt"], role.Name)
	prompt := buildAgentPrompt(team, flow, node, executor, goal, input)
	result, err := s.agent.RunInternal(ctx, agentservice.InternalRunRequest{
		AgentID:   role.AgentID,
		RequestID: newRequestID(),
		Method:    "POST",
		Path:      "/bot/team/role/run",
		Input: map[string]any{
			"text":       prompt,
			"task":       goal,
			"goal":       goal,
			"team":       team.Name,
			"role":       roleInputPayload(&role),
			"blackboard": input,
		},
		Options: map[string]any{
			"full_runtime": true,
			"stream":       true,
		},
		OnRunCreated: func(agentRunID uint64, requestID string) {
			s.writeStandaloneRoleEvent(context.Background(), run, role, stream.EventNodeStarted, teammodel.RunStatusRunning, map[string]any{
				"agent_run_id":     agentRunID,
				"agent_request_id": requestID,
				"started_at":       time.Now().Format(time.RFC3339Nano),
			})
		},
		OnStream: func(payload map[string]any) {
			if textValue(payload["type"]) == "result" {
				return
			}
			output := mapValue(payload["output"])
			if len(output) == 0 {
				return
			}
			s.writeStandaloneRoleEvent(context.Background(), run, role, stream.EventNodeOutput, teammodel.RunStatusRunning, map[string]any{
				"output":            output,
				"agent_request_id":  textValue(payload["request_id"]),
				"agent_stream_type": textValue(payload["type"]),
			})
		},
	})
	if err != nil {
		s.writeStandaloneRoleEvent(ctx, run, role, stream.EventNodeFinished, teammodel.RunStatusFail, map[string]any{
			"error":       err.Error(),
			"finished_at": time.Now().Format(time.RFC3339Nano),
		})
		return teammodel.RunStatusFail, nil, err
	}
	if interaction := agentNodeInteraction(result.Output); len(interaction) > 0 {
		approvalID := s.insertRoleInteractionApproval(ctx, run, team, role, input, result.Output, interaction)
		output := map[string]any{
			"approval_id": approvalID,
			"interaction": interaction,
			"text":        firstText(result.Summary, result.Output["text"]),
			"pending":     true,
		}
		s.writeStandaloneRoleEvent(ctx, run, role, stream.EventWaiting, teammodel.RunStatusWaiting, map[string]any{
			"output": output,
			"error":  "等待用户反馈",
		})
		return teammodel.RunStatusWaiting, output, runWaitError{message: "等待用户反馈"}
	}
	output := map[string]any{
		"summary":      result.Summary,
		"output":       result.Output,
		"agent_run_id": result.RunID,
		"role":         roleInputPayload(&role),
	}
	s.writeStandaloneRoleEvent(ctx, run, role, stream.EventNodeFinished, teammodel.RunStatusSuccess, map[string]any{
		"output":       output,
		"agent_run_id": result.RunID,
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
	fields["asset_cate_id"] = role.AssetCateID
	fields["status"] = status
	s.writeRunEvent(ctx, run, event, fields)
}

func (s Service) insertRoleInteractionApproval(ctx context.Context, run teammodel.Run, team teammodel.Team, role teammodel.Role, input map[string]any, output map[string]any, interaction map[string]any) uint64 {
	return s.repo.InsertApproval(ctx, map[string]any{
		"run_id":  run.ID,
		"team_id": team.ID,
		"title":   firstText(interaction["title"], role.Name),
		"content": jsonText(map[string]any{
			"kind":        "role_interaction",
			"input":       input,
			"output":      output,
			"interaction": interaction,
			"role":        roleInputPayload(&role),
		}),
		"comment":  "",
		"decision": "pending",
		"status":   teammodel.RunStatusPending,
	})
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
