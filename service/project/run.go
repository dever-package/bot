package project

import (
	"context"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	projectmodel "github.com/dever-package/bot/model/project"
	agentservice "github.com/dever-package/bot/service/agent"
	assetservice "github.com/dever-package/bot/service/asset"
	bodyservice "github.com/dever-package/bot/service/body"
	teamservice "github.com/dever-package/bot/service/team"
	frontstream "github.com/dever-package/front/service/stream"
)

type CanvasAgentRunRequest struct {
	FlowID        uint64
	AssetCateID   uint64
	NodeKey       string
	NodeName      string
	AgentID       uint64
	RequestID     string
	Input         map[string]any
	PersistResult bool
}

func (s Service) RunCanvasPower(ctx context.Context, projectID uint64, req teamservice.CanvasPowerRunRequest) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	project, err = s.SyncTeamRelease(ctx, project)
	if err != nil {
		return nil, err
	}
	if err := requireBodyPower(ctx, s.body, project.BodyID, req.PowerID); err != nil {
		return nil, err
	}
	req.ProjectID = project.ID
	req.BodyID = project.BodyID
	req.TeamID = project.TeamID
	req.ReleaseID = project.ReleaseID
	return s.team.RunCanvasPower(ctx, req)
}

func (s Service) RunCanvasAgent(ctx context.Context, projectID uint64, req CanvasAgentRunRequest) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	if err := requireBodyAgent(ctx, s.body, project.BodyID, req.AgentID); err != nil {
		return nil, err
	}
	agent := agentmodel.NewAgentModel().Find(ctx, map[string]any{
		"id":     req.AgentID,
		"status": int16(1),
	})
	if agent == nil {
		return nil, fmt.Errorf("智能体不存在或未开启")
	}
	result, err := agentservice.NewService().RunInternal(ctx, agentservice.InternalRunRequest{
		AgentID:   req.AgentID,
		RequestID: req.RequestID,
		Input:     cloneInput(req.Input),
		Options:   map[string]any{"full_runtime": false},
	})
	if err != nil {
		return map[string]any{
			"run_id":     result.RunID,
			"request_id": result.RequestID,
			"status":     "fail",
			"output":     result.Output,
		}, err
	}

	nodeName := strings.TrimSpace(req.NodeName)
	if nodeName == "" {
		nodeName = strings.TrimSpace(agent.Name)
	}
	if nodeName == "" {
		nodeName = "智能体运行结果"
	}
	if !req.PersistResult {
		return map[string]any{
			"run_id":     result.RunID,
			"request_id": result.RequestID,
			"status":     "success",
			"output":     result.Output,
		}, nil
	}

	asset, version, err := s.asset.SaveVersion(ctx, assetservice.SaveVersionRequest{
		ProjectID:   project.ID,
		BodyID:      project.BodyID,
		TeamID:      project.TeamID,
		FlowID:      req.FlowID,
		AssetCateID: req.AssetCateID,
		RunID:       result.RunID,
		RequestID:   result.RequestID,
		NodeKey:     req.NodeKey,
		Name:        nodeName,
		Kind:        "text",
		Content:     result.Output,
	})
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"run_id":     result.RunID,
		"request_id": result.RequestID,
		"status":     "success",
		"output":     result.Output,
		"asset":      assetservice.AssetToMap(*asset),
		"version":    assetservice.VersionToMap(*version),
	}, nil
}

func (s Service) RunFlow(ctx context.Context, projectID uint64, req teamservice.RunRequest) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	project, err = s.SyncTeamRelease(ctx, project)
	if err != nil {
		return nil, err
	}
	teamID, releaseID, err := s.resolveRunTeam(ctx, project, req.TeamID, req.ReleaseID)
	if err != nil {
		return nil, err
	}
	req.ProjectID = project.ID
	req.TeamID = teamID
	req.ReleaseID = releaseID
	return s.team.RunFlow(ctx, req)
}

func (s Service) RunTeam(ctx context.Context, projectID uint64, req teamservice.RunRequest) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	project, err = s.SyncTeamRelease(ctx, project)
	if err != nil {
		return nil, err
	}
	teamID, releaseID, err := s.resolveRunTeam(ctx, project, req.TeamID, req.ReleaseID)
	if err != nil {
		return nil, err
	}
	req.ProjectID = project.ID
	req.TeamID = teamID
	req.ReleaseID = releaseID
	return s.team.RunTeam(ctx, req)
}

func (s Service) RunRole(ctx context.Context, projectID uint64, req teamservice.RunRequest) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	project, err = s.SyncTeamRelease(ctx, project)
	if err != nil {
		return nil, err
	}
	if project.TeamID == 0 {
		return nil, fmt.Errorf("当前项目未绑定团队")
	}
	req.ProjectID = project.ID
	req.TeamID = project.TeamID
	req.ReleaseID = project.ReleaseID
	return s.team.RunRole(ctx, req)
}

func (s Service) RunStatus(ctx context.Context, projectID uint64, runID uint64, requestID string) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	workspace := NewWorkspaceService()
	if run := workspace.SyncCanvasRunProgress(ctx, projectID, runID, requestID); run != nil {
		if execution := workspaceExecutionByRunID(ctx, run.ID); execution != nil {
			return workspaceExecutionPayload(ctx, execution), nil
		}
		return workspace.workspaceRunPayload(ctx, projectID, run), nil
	}
	return s.team.ProjectRunStatus(ctx, projectID, runID, requestID)
}

func (s Service) ReadStream(ctx context.Context, projectID uint64, requestID string, lastID string, count int64, block time.Duration) ([]frontstream.Entry, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	NewWorkspaceService().SyncCanvasRunProgress(ctx, projectID, 0, requestID)
	return s.team.ReadProjectStream(ctx, projectID, requestID, lastID, count, block)
}

func (s Service) StopRun(ctx context.Context, projectID uint64, runID uint64, requestID string) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	return s.team.StopProjectRun(ctx, projectID, runID, requestID)
}

func (s Service) SubmitApproval(ctx context.Context, projectID uint64, approvalID uint64, decision string, comment string, data map[string]any) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	result, err := s.team.SubmitProjectApproval(ctx, projectID, approvalID, decision, comment, data)
	if err != nil {
		return nil, err
	}
	go NewWorkspaceService().watchWorkspaceApproval(detachedWorkspaceContext(ctx), projectID, approvalID)
	return result, nil
}

func (s Service) resolveRunTeam(ctx context.Context, project *projectmodel.Project, teamID uint64, releaseID uint64) (uint64, uint64, error) {
	if teamID == 0 && releaseID == 0 {
		if project.TeamID == 0 {
			return 0, 0, fmt.Errorf("当前项目未绑定团队")
		}
		return project.TeamID, project.ReleaseID, nil
	}
	team, release, err := resolvePublishedTeamRelease(ctx, teamID, releaseID)
	if err != nil {
		return 0, 0, err
	}
	if err := requireBodyTeam(ctx, s.body, project.BodyID, team.ID); err != nil {
		return 0, 0, err
	}
	return team.ID, release.ID, nil
}

func requireBodyPower(ctx context.Context, body bodyservice.Service, bodyID uint64, powerID uint64) error {
	allowed, restricted := body.AllowedPowerIDs(ctx, bodyID)
	if !restricted {
		return nil
	}
	if powerID == 0 || !allowed[powerID] {
		return fmt.Errorf("当前画布不允许使用该能力")
	}
	return nil
}

func requireBodyAgent(ctx context.Context, body bodyservice.Service, bodyID uint64, agentID uint64) error {
	allowed, restricted := body.AllowedAgentIDs(ctx, bodyID)
	if !restricted {
		return nil
	}
	if agentID == 0 || !allowed[agentID] {
		return fmt.Errorf("当前画布不允许使用该智能体")
	}
	return nil
}

func requireBodyTeam(ctx context.Context, body bodyservice.Service, bodyID uint64, teamID uint64) error {
	allowed, restricted := body.AllowedTeamIDs(ctx, bodyID)
	if !restricted {
		return nil
	}
	if teamID == 0 || !allowed[teamID] {
		return fmt.Errorf("当前画布不允许使用该团队")
	}
	return nil
}

func applyBodyLimits(ctx context.Context, body bodyservice.Service, bodyID uint64, config map[string]any) {
	powerOrder, restricted := body.AllowedPowerOrder(ctx, bodyID)
	if restricted {
		if powers, ok := config["powers"].([]teamservice.PowerOption); ok {
			config["powers"] = orderOptions(powers, powerOrder, func(option teamservice.PowerOption) uint64 { return option.ID })
		}
	}

	agentOrder, restrictedAgents := body.AllowedAgentOrder(ctx, bodyID)
	if restrictedAgents {
		if agents, ok := config["agents"].([]teamservice.AgentOption); ok {
			config["agents"] = orderOptions(agents, agentOrder, func(option teamservice.AgentOption) uint64 { return option.ID })
		}
	}

	teamOrder, restrictedTeams := body.AllowedTeamOrder(ctx, bodyID)
	if restrictedTeams {
		if teams, ok := config["teams"].([]teamservice.TeamOption); ok {
			config["teams"] = orderOptions(teams, teamOrder, func(option teamservice.TeamOption) uint64 { return option.ID })
		}
	}
}

func orderOptions[T any](options []T, order []uint64, id func(T) uint64) []T {
	byID := make(map[uint64]T, len(options))
	for _, option := range options {
		byID[id(option)] = option
	}
	result := make([]T, 0, len(order))
	for _, id := range order {
		if option, ok := byID[id]; ok {
			result = append(result, option)
		}
	}
	return result
}

func cloneInput(input map[string]any) map[string]any {
	result := map[string]any{}
	for key, value := range input {
		result[key] = value
	}
	return result
}
