package team

import (
	"context"
	"fmt"
	"strings"

	teammodel "github.com/dever-package/bot/model/team"
)

const (
	canvasAssistantReasonMissing          = "missing"
	canvasAssistantReasonAmbiguous        = "ambiguous"
	canvasAssistantReasonAgentUnavailable = "agent_unavailable"
)

func isCanvasAssistantRole(role teammodel.Role) bool {
	return role.RoleType == teammodel.RoleTypeChat &&
		isWorkbenchDialogueRole(role) &&
		normalizeEntryStatus(role.CreateStatus) == teammodel.StatusEnabled
}

func resolveCanvasAssistantRole(roles []teammodel.Role) (*teammodel.Role, string) {
	var selected *teammodel.Role
	for index := range roles {
		if !isCanvasAssistantRole(roles[index]) {
			continue
		}
		if selected != nil {
			return nil, canvasAssistantReasonAmbiguous
		}
		selected = &roles[index]
	}
	if selected == nil {
		return nil, canvasAssistantReasonMissing
	}
	return selected, ""
}

func isAssistantCallableFlow(flow teammodel.Flow) bool {
	return flow.Status == teammodel.StatusEnabled &&
		boolValue(jsonMap(flow.Config)["assistant_callable"])
}

func assistantCallableFlowOptions(graph runtimeGraph) []CanvasFlowOption {
	result := make([]CanvasFlowOption, 0, len(graph.Flows))
	for _, flow := range graph.Flows {
		if !isAssistantCallableFlow(flow) {
			continue
		}
		payload := flowPayloads([]teammodel.Flow{flow})[0]
		result = append(result, CanvasFlowOption{
			GraphFlow:          payload,
			OutputAssetCateIDs: canvasFlowOutputAssetCateIDs(graph.NodesByFlowID[flow.ID]),
		})
	}
	return result
}

func (s Service) AssistantCallableFlows(
	ctx context.Context,
	teamID uint64,
	releaseID uint64,
) ([]CanvasFlowOption, error) {
	_, graph, err := s.runtimeGraphByRelease(ctx, teamID, releaseID)
	if err != nil {
		return nil, err
	}
	return assistantCallableFlowOptions(graph), nil
}

func (s Service) RequireAssistantCallableFlow(
	ctx context.Context,
	teamID uint64,
	releaseID uint64,
	flowID uint64,
) (teammodel.Flow, error) {
	if flowID == 0 {
		return teammodel.Flow{}, fmt.Errorf("工作流不能为空")
	}
	_, graph, err := s.runtimeGraphByRelease(ctx, teamID, releaseID)
	if err != nil {
		return teammodel.Flow{}, err
	}
	flow := graph.findFlow(flowID)
	if flow.ID == 0 || !isAssistantCallableFlow(flow) {
		return teammodel.Flow{}, fmt.Errorf("当前工作流未开放给画布助手调用")
	}
	return flow, nil
}

func (s Service) ResolveCanvasAssistant(
	ctx context.Context,
	teamID uint64,
	releaseID uint64,
) (WorkbenchRoleBinding, error) {
	release, graph, err := s.runtimeGraphByRelease(ctx, teamID, releaseID)
	if err != nil {
		return WorkbenchRoleBinding{}, err
	}
	role, reason := resolveCanvasAssistantRole(graph.Roles)
	if reason != "" {
		return WorkbenchRoleBinding{}, canvasAssistantResolutionError(reason)
	}
	return s.workbenchRoleBinding(ctx, release.ID, graph, *role)
}

func (s Service) canvasAssistantPayload(
	ctx context.Context,
	releaseID uint64,
	graph runtimeGraph,
) map[string]any {
	role, reason := resolveCanvasAssistantRole(graph.Roles)
	if reason != "" {
		return unavailableCanvasAssistantPayload(reason)
	}
	binding, err := s.workbenchRoleBinding(ctx, releaseID, graph, *role)
	if err != nil {
		return unavailableCanvasAssistantPayload(canvasAssistantReasonAgentUnavailable)
	}
	return map[string]any{
		"available":       true,
		"reason":          "",
		"release_id":      binding.ReleaseID,
		"role_id":         binding.RoleID,
		"role_type":       binding.RoleType,
		"name":            binding.Name,
		"assignment":      binding.Assignment,
		"agent_id":        binding.AgentID,
		"agent_key":       binding.AgentKey,
		"opening_enabled": binding.OpeningEnabled,
	}
}

func unavailableCanvasAssistantPayload(reason string) map[string]any {
	return map[string]any{
		"available": false,
		"reason":    reason,
	}
}

func canvasAssistantResolutionError(reason string) error {
	switch reason {
	case canvasAssistantReasonAmbiguous:
		return fmt.Errorf("当前团队发布版本配置了多个画布沟通角色")
	case canvasAssistantReasonAgentUnavailable:
		return fmt.Errorf("当前画布沟通角色绑定的智能体不可用")
	default:
		return fmt.Errorf("当前团队发布版本未配置画布沟通角色")
	}
}

func (s Service) workbenchRoleBinding(
	ctx context.Context,
	releaseID uint64,
	graph runtimeGraph,
	role teammodel.Role,
) (WorkbenchRoleBinding, error) {
	agents := s.repo.ListAgentsByIDs(ctx, []uint64{role.AgentID})
	if len(agents) == 0 || strings.TrimSpace(agents[0].Key) == "" {
		return WorkbenchRoleBinding{}, canvasAssistantResolutionError(canvasAssistantReasonAgentUnavailable)
	}
	agent := agents[0]
	return WorkbenchRoleBinding{
		TeamID: graph.Team.ID, TeamName: graph.Team.Name, TeamDescription: graph.Team.Description,
		ReleaseID: releaseID, RoleID: role.ID, RoleType: role.RoleType,
		AgentID: agent.ID, AgentKey: agent.Key, LLMPowerID: agent.LLMPowerID,
		OpeningEnabled: agent.OpeningEnabled,
		ToolsEnabled:   normalizeEntryStatus(role.ToolStatus) == teammodel.StatusEnabled,
		Name:           role.Name, Assignment: role.Assignment, RuntimePrompt: roleRuntimePrompt(&role),
	}, nil
}
