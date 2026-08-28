package project

import (
	"context"
	"fmt"
	"strings"

	teammodel "github.com/dever-package/bot/model/team"
	teamservice "github.com/dever-package/bot/service/team"
)

type WorkspaceAssistantBinding struct {
	ProjectID   uint64
	CanvasID    uint64
	AssetCateID uint64
	BodyID      uint64
	TeamID      uint64
	ReleaseID   uint64
	Role        teamservice.WorkbenchRoleBinding
	ContextKey  string
}

func (s Service) AssistantFlows(
	ctx context.Context,
	projectID uint64,
) ([]teamservice.CanvasFlowOption, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	project, err = s.currentTeamRelease(ctx, project)
	if err != nil {
		return nil, err
	}
	return s.team.AssistantCallableFlows(ctx, project.TeamID, project.ReleaseID)
}

func (s Service) RequireAssistantFlow(
	ctx context.Context,
	projectID uint64,
	flowID uint64,
) (teammodel.Flow, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return teammodel.Flow{}, err
	}
	project, err = s.currentTeamRelease(ctx, project)
	if err != nil {
		return teammodel.Flow{}, err
	}
	return s.team.RequireAssistantCallableFlow(
		ctx,
		project.TeamID,
		project.ReleaseID,
		flowID,
	)
}

func (s Service) RunAssistantFlow(
	ctx context.Context,
	projectID uint64,
	flowID uint64,
	input map[string]any,
) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	project, err = s.currentTeamRelease(ctx, project)
	if err != nil {
		return nil, err
	}
	if _, err = s.team.RequireAssistantCallableFlow(
		ctx,
		project.TeamID,
		project.ReleaseID,
		flowID,
	); err != nil {
		return nil, err
	}
	return s.RunFlow(ctx, project.ID, teamservice.RunRequest{
		TeamID:    project.TeamID,
		ReleaseID: project.ReleaseID,
		FlowID:    flowID,
		Input:     cloneInput(input),
		Mode:      "flow",
	})
}

func assistantFlowTaskPayload(flow teammodel.Flow, result map[string]any) map[string]any {
	return map[string]any{
		"kind":       "team_flow",
		"title":      strings.TrimSpace(flow.Name),
		"flow_id":    flow.ID,
		"run_id":     uint64Value(result["run_id"]),
		"request_id": textValue(result["request_id"]),
		"status":     textValue(result["status"]),
	}
}

func (s WorkspaceService) ResolveAssistant(
	ctx context.Context,
	projectID uint64,
	canvasID uint64,
	assetCateID uint64,
) (WorkspaceAssistantBinding, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return WorkspaceAssistantBinding{}, err
	}
	project, err = s.project.currentTeamRelease(ctx, project)
	if err != nil {
		return WorkspaceAssistantBinding{}, err
	}
	canvas, err := requireProjectCanvas(ctx, project.ID, canvasID, assetCateID)
	if err != nil {
		return WorkspaceAssistantBinding{}, err
	}
	role, err := s.project.team.ResolveCanvasAssistant(ctx, project.TeamID, project.ReleaseID)
	if err != nil {
		return WorkspaceAssistantBinding{}, err
	}
	role.RuntimePrompt = workspaceAssistantPrompt(role.RuntimePrompt, project.Name)
	return WorkspaceAssistantBinding{
		ProjectID:   project.ID,
		CanvasID:    canvas.ID,
		AssetCateID: canvas.AssetCateID,
		BodyID:      project.BodyID,
		TeamID:      project.TeamID,
		ReleaseID:   project.ReleaseID,
		Role:        role,
		ContextKey: WorkspaceAssistantContextKey(
			project.ID,
			canvas.ID,
			project.TeamID,
			role.RoleID,
		),
	}, nil
}

func WorkspaceAssistantContextKey(projectID uint64, canvasID uint64, teamID uint64, roleID uint64) string {
	return fmt.Sprintf("project-canvas:%d:canvas:%d:team:%d:role:%d", projectID, canvasID, teamID, roleID)
}

func workspaceAssistantPrompt(rolePrompt string, projectName string) string {
	parts := make([]string, 0, 2)
	if rolePrompt = strings.TrimSpace(rolePrompt); rolePrompt != "" {
		parts = append(parts, rolePrompt)
	}
	parts = append(parts, fmt.Sprintf(`你当前在项目画布“%s”中协助创作。
- 普通问答直接回答，不要为了展示流程而启动团队工作流。
- 需要了解画布时先读取当前画布；不要假装已经看到、修改或运行画布。
- 任何画布修改、画布执行或团队流程启动都必须先生成预览并等待用户明确确认。
- 复杂任务只调用当前项目允许画布助手使用的已发布团队流程，不自行虚构角色或流程。`, strings.TrimSpace(projectName)))
	return strings.Join(parts, "\n\n")
}

func (s Service) assistantCanvasCatalog(
	ctx context.Context,
	projectID uint64,
) (assistantCanvasCatalog, error) {
	config, err := s.CanvasConfig(ctx, projectID, 0)
	if err != nil {
		return assistantCanvasCatalog{}, err
	}
	return newAssistantCanvasCatalog(config)
}
