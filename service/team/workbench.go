package team

import (
	"context"
	"fmt"
	"strings"

	teammodel "github.com/dever-package/bot/model/team"
	energonservice "github.com/dever-package/bot/service/energon"
)

type WorkbenchPowerBinding struct {
	TeamID      uint64
	TeamName    string
	ReleaseID   uint64
	TeamPowerID uint64
	Power       PowerOption
	Name        string
}

type WorkbenchRoleBinding struct {
	TeamID          uint64
	TeamName        string
	TeamDescription string
	ReleaseID       uint64
	RoleID          uint64
	RoleType        string
	AgentID         uint64
	AgentKey        string
	LLMPowerID      uint64
	OpeningEnabled  bool
	Name            string
	Assignment      string
	RuntimePrompt   string
}

type WorkbenchExecutablePower struct {
	TeamPowerID uint64      `json:"team_power_id"`
	Power       PowerOption `json:"power"`
}

type WorkbenchDialogueConfig struct {
	ModelPower            PowerOption                  `json:"model_power"`
	ModelSourceRule       int16                        `json:"model_source_rule"`
	ModelSources          []energonservice.PowerSource `json:"model_sources"`
	SelectedModelTargetID uint64                       `json:"selected_model_target_id"`
	Tools                 []WorkbenchExecutablePower   `json:"tools"`
}

func (s Service) WorkbenchCatalog(ctx context.Context, teamID uint64) (map[string]any, error) {
	teams, releases := s.teamListRows(ctx)
	teamID = selectedWorkbenchTeamID(teamID, teams)
	if teamID == 0 {
		return map[string]any{
			"teams":           teams,
			"team":            map[string]any{},
			"release":         map[string]any{},
			"powers":          []map[string]any{},
			"power_cates":     s.repo.ListPowerCates(ctx),
			"roles":           []map[string]any{},
			"asset_cates":     []GraphAssetCate{},
			"project_enabled": false,
		}, nil
	}
	release, exists := releases[teamID]
	if !exists {
		return nil, fmt.Errorf("团队尚未发布，不能运行")
	}
	graph, err := runtimeGraphFromRelease(release)
	if err != nil {
		return nil, err
	}
	availableTools := s.workbenchAvailableTools(ctx, graph)
	powers := make([]map[string]any, 0, len(availableTools))
	for _, tool := range availableTools {
		power := tool.Power
		powers = append(powers, map[string]any{
			"id":          tool.TeamPowerID,
			"power_id":    power.ID,
			"cate_id":     power.CateID,
			"name":        power.Name,
			"key":         power.Key,
			"icon":        power.Icon,
			"description": power.Description,
			"kind":        power.Kind,
			"output_type": power.OutputType,
			"output":      power.Output,
		})
	}
	agentIDs := make([]uint64, 0, len(graph.Roles))
	for _, role := range graph.Roles {
		if isWorkbenchDialogueRole(role) {
			agentIDs = append(agentIDs, role.AgentID)
		}
	}
	agents := make(map[uint64]AgentOption, len(agentIDs))
	for _, agent := range s.repo.ListAgentsByIDs(ctx, agentIDs) {
		agents[agent.ID] = agent
	}
	roles := make([]map[string]any, 0, len(graph.Roles))
	for _, role := range graph.Roles {
		if !isWorkbenchDialogueRole(role) {
			continue
		}
		agent, exists := agents[role.AgentID]
		if !exists || strings.TrimSpace(agent.Key) == "" {
			continue
		}
		roles = append(roles, map[string]any{
			"id":              role.ID,
			"name":            role.Name,
			"role_type":       role.RoleType,
			"assignment":      role.Assignment,
			"agent_id":        agent.ID,
			"agent_key":       agent.Key,
			"agent_name":      agent.Name,
			"opening_enabled": agent.OpeningEnabled,
		})
	}
	return map[string]any{
		"teams": teams,
		"team": map[string]any{
			"id":          graph.Team.ID,
			"name":        graph.Team.Name,
			"description": strings.TrimSpace(graph.Team.Description),
		},
		"release": map[string]any{
			"id":      release.ID,
			"version": release.Version,
		},
		"powers":          powers,
		"power_cates":     s.repo.ListPowerCates(ctx),
		"roles":           roles,
		"asset_cates":     workbenchAssetCateValues(graph.AssetCates),
		"project_enabled": normalizeEntryStatus(graph.Team.ProjectEnabled) == teammodel.StatusEnabled,
	}, nil
}

func (s Service) ResolveProjectRelease(ctx context.Context, teamID uint64) (PublishedTeamBinding, error) {
	release, graph, err := s.runtimeGraphByRelease(ctx, teamID, 0)
	if err != nil {
		return PublishedTeamBinding{}, err
	}
	enabled := normalizeEntryStatus(graph.Team.ProjectEnabled) == teammodel.StatusEnabled
	if !enabled {
		return PublishedTeamBinding{}, fmt.Errorf("当前团队未启用项目")
	}
	return PublishedTeamBinding{TeamID: graph.Team.ID, ReleaseID: release.ID}, nil
}

func (s Service) WorkbenchPowerForm(ctx context.Context, teamID uint64, teamPowerID uint64, targetID uint64) (map[string]any, error) {
	binding, err := s.ResolveWorkbenchPower(ctx, teamID, teamPowerID)
	if err != nil {
		return nil, err
	}
	result, err := s.CanvasPowerForm(ctx, binding.ReleaseID, 0, binding.Power.ID, "", targetID)
	if err != nil {
		return nil, err
	}
	result["team_power_id"] = binding.TeamPowerID
	return result, nil
}

func (s Service) ResolveWorkbenchPower(ctx context.Context, teamID uint64, teamPowerID uint64) (WorkbenchPowerBinding, error) {
	release, graph, err := s.runtimeGraphByRelease(ctx, teamID, 0)
	if err != nil {
		return WorkbenchPowerBinding{}, err
	}
	return s.workbenchPowerBinding(ctx, release.ID, graph, teamPowerID)
}

func (s Service) ResolveWorkbenchRole(ctx context.Context, teamID uint64, roleID uint64) (WorkbenchRoleBinding, error) {
	release, graph, err := s.runtimeGraphByRelease(ctx, teamID, 0)
	if err != nil {
		return WorkbenchRoleBinding{}, err
	}
	for _, role := range graph.Roles {
		if role.ID != roleID || !isWorkbenchDialogueRole(role) {
			continue
		}
		agents := s.repo.ListAgentsByIDs(ctx, []uint64{role.AgentID})
		if len(agents) == 0 || strings.TrimSpace(agents[0].Key) == "" {
			return WorkbenchRoleBinding{}, fmt.Errorf("当前角色绑定的智能体不可用")
		}
		agent := agents[0]
		return WorkbenchRoleBinding{
			TeamID: graph.Team.ID, TeamName: graph.Team.Name, TeamDescription: graph.Team.Description,
			ReleaseID: release.ID, RoleID: role.ID, RoleType: role.RoleType,
			AgentID: agent.ID, AgentKey: agent.Key, LLMPowerID: agent.LLMPowerID,
			OpeningEnabled: agent.OpeningEnabled,
			Name:           role.Name, Assignment: role.Assignment, RuntimePrompt: roleRuntimePrompt(&role),
		}, nil
	}
	return WorkbenchRoleBinding{}, fmt.Errorf("当前团队发布版本中不存在该对话角色")
}

func (s Service) WorkbenchDialogueConfig(ctx context.Context, binding WorkbenchRoleBinding) (WorkbenchDialogueConfig, error) {
	modelPower, exists := s.repo.FindPowerOption(ctx, binding.LLMPowerID, "")
	if !exists || !strings.EqualFold(strings.TrimSpace(modelPower.Kind), "text") {
		return WorkbenchDialogueConfig{}, fmt.Errorf("当前角色的文本模型能力不可用")
	}
	modelSources, err := s.gateway.AvailablePowerSources(ctx, modelPower.Key)
	if err != nil {
		return WorkbenchDialogueConfig{}, err
	}
	if len(modelSources) == 0 {
		return WorkbenchDialogueConfig{}, fmt.Errorf("当前角色的文本模型没有可用来源")
	}
	_, graph, err := s.runtimeGraphByRelease(ctx, binding.TeamID, binding.ReleaseID)
	if err != nil {
		return WorkbenchDialogueConfig{}, err
	}
	tools := s.workbenchAvailableTools(ctx, graph)
	return workbenchDialogueConfig(modelPower, modelSources, tools), nil
}

func workbenchDialogueConfig(
	modelPower PowerOption,
	modelSources []energonservice.PowerSource,
	tools []WorkbenchExecutablePower,
) WorkbenchDialogueConfig {
	selectedTargetID := uint64(0)
	if energonservice.IsManualPowerSourceRule(modelPower.SourceRule) && len(modelSources) > 0 {
		selectedTargetID = modelSources[0].TargetID
	}
	return WorkbenchDialogueConfig{
		ModelPower: modelPower, ModelSourceRule: modelPower.SourceRule, ModelSources: modelSources,
		SelectedModelTargetID: selectedTargetID, Tools: tools,
	}
}

func isWorkbenchDialogueRole(role teammodel.Role) bool {
	return role.Status == teammodel.StatusEnabled &&
		normalizeEntryStatus(role.ChatStatus) == teammodel.StatusEnabled
}

func isWorkbenchPowerAvailable(teamPower teammodel.TeamPower) bool {
	return teamPower.Status == teammodel.StatusEnabled &&
		normalizeTeamPowerHomeStatus(teamPower.HomeStatus) == teammodel.StatusEnabled
}

func (s Service) workbenchAvailableTools(ctx context.Context, graph runtimeGraph) []WorkbenchExecutablePower {
	powerIDs := make([]uint64, 0, len(graph.TeamPowers))
	for _, teamPower := range graph.TeamPowers {
		if isWorkbenchPowerAvailable(teamPower) {
			powerIDs = append(powerIDs, teamPower.PowerID)
		}
	}
	powerByID := make(map[uint64]PowerOption, len(powerIDs))
	for _, power := range s.repo.ListPowersByIDs(ctx, powerIDs) {
		powerByID[power.ID] = power
	}
	candidateIDs := make([]uint64, 0, len(powerByID))
	for _, power := range powerByID {
		if isWorkbenchToolPower(power) {
			candidateIDs = append(candidateIDs, power.ID)
		}
	}
	available := s.gateway.AvailablePowerIDs(ctx, candidateIDs)
	result := make([]WorkbenchExecutablePower, 0, len(graph.TeamPowers))
	for _, teamPower := range graph.TeamPowers {
		power, exists := powerByID[teamPower.PowerID]
		if !isWorkbenchPowerAvailable(teamPower) || !exists || !isWorkbenchToolPower(power) {
			continue
		}
		if _, exists = available[power.ID]; !exists {
			continue
		}
		result = append(result, WorkbenchExecutablePower{TeamPowerID: teamPower.ID, Power: power})
	}
	return result
}

func isWorkbenchToolPower(power PowerOption) bool {
	return power.ID > 0 && !strings.EqualFold(strings.TrimSpace(power.Kind), "embeddings")
}

func (s Service) workbenchPowerBinding(ctx context.Context, releaseID uint64, graph runtimeGraph, teamPowerID uint64) (WorkbenchPowerBinding, error) {
	for _, teamPower := range graph.TeamPowers {
		if teamPower.ID != teamPowerID || !isWorkbenchPowerAvailable(teamPower) {
			continue
		}
		power, exists := s.repo.FindPowerOption(ctx, teamPower.PowerID, "")
		if !exists || !isWorkbenchToolPower(power) {
			return WorkbenchPowerBinding{}, fmt.Errorf("当前团队能力不可用")
		}
		if _, available := s.gateway.AvailablePowerIDs(ctx, []uint64{power.ID})[power.ID]; !available {
			return WorkbenchPowerBinding{}, fmt.Errorf("当前团队能力没有可用来源")
		}
		return WorkbenchPowerBinding{
			TeamID: graph.Team.ID, TeamName: graph.Team.Name,
			ReleaseID: releaseID, TeamPowerID: teamPower.ID,
			Power: power,
			Name:  power.Name,
		}, nil
	}
	return WorkbenchPowerBinding{}, fmt.Errorf("当前团队发布版本中不存在该能力")
}

func selectedWorkbenchTeamID(requested uint64, rows []map[string]any) uint64 {
	for _, row := range rows {
		id := uint64Value(row["id"])
		if id == requested {
			return id
		}
	}
	if len(rows) > 0 {
		return uint64Value(rows[0]["id"])
	}
	return 0
}

func workbenchAssetCateValues(rows []teammodel.AssetCate) []GraphAssetCate {
	result := make([]GraphAssetCate, 0, len(rows))
	for _, row := range assetCatePayloads(rows) {
		if row.Status == teammodel.StatusEnabled {
			result = append(result, row)
		}
	}
	return result
}
