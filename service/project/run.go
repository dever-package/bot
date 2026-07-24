package project

import (
	"context"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	assetmodel "github.com/dever-package/bot/model/asset"
	projectmodel "github.com/dever-package/bot/model/project"
	runtimeloop "github.com/dever-package/bot/service/agent/runtime/loop"
	assetservice "github.com/dever-package/bot/service/asset"
	energoninput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	teamservice "github.com/dever-package/bot/service/team"
	frontstream "github.com/dever-package/front/service/stream"
)

type CanvasAgentRunRequest struct {
	FlowID          uint64
	AssetCateID     uint64
	NodeKey         string
	NodeName        string
	RoleID          uint64
	AgentID         uint64
	RequestID       string
	Input           map[string]any
	MediaReferences []energoninput.MediaReference
	History         []any
	OnStream        func(map[string]any)
	PersistResult   bool
}

func (s Service) RunCanvasPower(ctx context.Context, projectID uint64, req teamservice.CanvasPowerRunRequest) (map[string]any, error) {
	prepared, project, err := s.prepareProjectCanvasPower(ctx, projectID, req)
	if err != nil {
		return nil, err
	}
	prepared.Billing.Billable = true
	prepared.Billing.Scene = "project_power"
	prepared.Billing.UserID = project.UserID
	prepared.Billing.TeamID = project.TeamID
	prepared.Billing.ProjectID = project.ID
	return s.team.RunCanvasPower(ctx, prepared)
}

func (s Service) PreflightCanvasPower(ctx context.Context, projectID uint64, req teamservice.CanvasPowerRunRequest) error {
	prepared, _, err := s.prepareProjectCanvasPower(ctx, projectID, req)
	if err != nil {
		return err
	}
	return s.team.PreflightCanvasPower(ctx, prepared)
}

func (s Service) prepareProjectCanvasPower(ctx context.Context, projectID uint64, req teamservice.CanvasPowerRunRequest) (teamservice.CanvasPowerRunRequest, *projectmodel.Project, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return req, nil, err
	}
	project, err = s.SyncTeamRelease(ctx, project)
	if err != nil {
		return req, nil, err
	}
	req.ProjectID = project.ID
	req.BodyID = project.BodyID
	req.TeamID = project.TeamID
	req.ReleaseID = project.ReleaseID
	return req, project, nil
}

func (s Service) RunCanvasAgent(ctx context.Context, projectID uint64, req CanvasAgentRunRequest) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	project, err = s.SyncTeamRelease(ctx, project)
	if err != nil {
		return nil, err
	}
	if err := s.team.ValidateCanvasAgent(ctx, project.ReleaseID, req.RoleID, req.AgentID); err != nil {
		return nil, err
	}
	agent := agentmodel.NewAgentModel().Find(ctx, map[string]any{
		"id":     req.AgentID,
		"status": int16(1),
	})
	if agent == nil {
		return nil, fmt.Errorf("智能体不存在或未开启")
	}
	result, err := runtimeloop.NewService().RunInternal(ctx, runtimeloop.InternalRequest{
		AgentID:         req.AgentID,
		RequestID:       req.RequestID,
		Input:           cloneInput(req.Input),
		MediaReferences: req.MediaReferences,
		History:         req.History,
		Billing:         projectAgentBilling(project, project.TeamID),
		OnStream:        req.OnStream,
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
		ReleaseID:   project.ReleaseID,
		RequestID:   result.RequestID,
		NodeKey:     req.NodeKey,
		Name:        nodeName,
		Kind:        "text",
		Role:        assetmodel.RoleMaterial,
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
	req.Billing = projectAgentBilling(project, teamID)
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
	req.Billing = projectAgentBilling(project, teamID)
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
	req.Billing = projectAgentBilling(project, project.TeamID)
	return s.team.RunRole(ctx, req)
}

func projectAgentBilling(project *projectmodel.Project, teamID uint64) botprotocol.BillingContext {
	if project == nil {
		return botprotocol.BillingContext{}
	}
	return botprotocol.BillingContext{
		Billable:  true,
		Scene:     "agent_power",
		UserID:    project.UserID,
		TeamID:    teamID,
		ProjectID: project.ID,
	}
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

func (s Service) RunDetail(ctx context.Context, projectID uint64, runID uint64, requestID string) (map[string]any, error) {
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
	return s.team.ProjectRunDetail(ctx, projectID, runID, requestID)
}

func (s Service) WaitRunStatus(ctx context.Context, projectID uint64, runID uint64, requestID string, timeout time.Duration) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	return s.team.WaitProjectRunStatus(ctx, projectID, runID, requestID, timeout)
}

func (s Service) ReadStream(ctx context.Context, projectID uint64, requestID string, lastID string, count int64, block time.Duration) ([]frontstream.Entry, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	return s.team.ReadProjectStream(ctx, projectID, requestID, lastID, count, block)
}

func (s Service) StopRun(ctx context.Context, projectID uint64, runID uint64, requestID string) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	if run := findWorkspaceRunForStatus(ctx, projectID, runID, requestID); run != nil {
		return NewWorkspaceService().StopCanvasRun(ctx, run)
	}
	return s.team.StopProjectRun(ctx, projectID, runID, requestID)
}

func (s Service) SubmitApproval(ctx context.Context, projectID uint64, approvalID uint64, decision string, comment string, data map[string]any) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	if workspaceApprovalRunCanceled(ctx, projectID, approvalID) {
		return nil, fmt.Errorf("运行已取消，不能继续提交反馈")
	}
	result, err := s.team.SubmitProjectApproval(ctx, projectID, approvalID, decision, comment, data)
	if err != nil {
		return nil, err
	}
	go NewWorkspaceService().watchWorkspaceApproval(detachedWorkspaceContext(ctx), projectID, approvalID)
	return result, nil
}

func (s Service) SubmitInteraction(ctx context.Context, projectID uint64, nodeRunID uint64, interactionID string, data map[string]any) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	result, err := s.team.SubmitProjectInteraction(ctx, projectID, nodeRunID, interactionID, data)
	if err != nil {
		return nil, err
	}
	go NewWorkspaceService().watchWorkspaceInteraction(detachedWorkspaceContext(ctx), projectID, uint64Value(result["run_id"]))
	return result, nil
}

func (s Service) SubmitRunInteraction(ctx context.Context, projectID uint64, runID uint64, interactionID string, data map[string]any) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	result, err := s.team.SubmitProjectRunInteraction(ctx, projectID, runID, interactionID, data)
	if err != nil {
		return nil, err
	}
	go NewWorkspaceService().watchWorkspaceInteraction(detachedWorkspaceContext(ctx), projectID, uint64Value(result["run_id"]))
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
	return team.ID, release.ID, nil
}

func cloneInput(input map[string]any) map[string]any {
	result := map[string]any{}
	for key, value := range input {
		result[key] = value
	}
	return result
}
