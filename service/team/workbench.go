package team

import (
	"context"
	"fmt"
	"strings"

	teammodel "github.com/dever-package/bot/model/team"
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
	Name            string
	Assignment      string
}

func (s Service) WorkbenchCatalog(ctx context.Context, teamID uint64) (map[string]any, error) {
	teamsPayload, err := s.TeamList(ctx)
	if err != nil {
		return nil, err
	}
	teamID = selectedWorkbenchTeamID(teamID, teamsPayload)
	if teamID == 0 {
		return map[string]any{
			"teams":           teamsPayload["items"],
			"team":            map[string]any{},
			"release":         map[string]any{},
			"powers":          []map[string]any{},
			"roles":           []map[string]any{},
			"asset_cates":     []GraphAssetCate{},
			"project_enabled": false,
		}, nil
	}
	release, graph, err := s.runtimeGraphByRelease(ctx, teamID, 0)
	if err != nil {
		return nil, err
	}
	powers := make([]map[string]any, 0, len(graph.TeamPowers))
	for _, teamPower := range graph.TeamPowers {
		if normalizeTeamPowerHomeStatus(teamPower.HomeStatus) != teammodel.StatusEnabled {
			continue
		}
		binding, currentErr := s.workbenchPowerBinding(ctx, release.ID, graph, teamPower.ID)
		if currentErr != nil {
			continue
		}
		powers = append(powers, map[string]any{
			"id":          binding.TeamPowerID,
			"power_id":    binding.Power.ID,
			"name":        binding.Name,
			"key":         binding.Power.Key,
			"icon":        binding.Power.Icon,
			"kind":        binding.Power.Kind,
			"output_type": binding.Power.OutputType,
			"output":      binding.Power.Output,
		})
	}
	agents := make(map[uint64]AgentOption)
	for _, agent := range s.repo.ListAgents(ctx) {
		agents[agent.ID] = agent
	}
	roles := make([]map[string]any, 0, len(graph.Roles))
	for _, role := range graph.Roles {
		if role.Status != teammodel.StatusEnabled {
			continue
		}
		agent, exists := agents[role.AgentID]
		if !exists || strings.TrimSpace(agent.Key) == "" {
			continue
		}
		roles = append(roles, map[string]any{
			"id":         role.ID,
			"name":       role.Name,
			"role_type":  role.RoleType,
			"assignment": role.Assignment,
			"agent_id":   agent.ID,
			"agent_key":  agent.Key,
			"agent_name": agent.Name,
		})
	}
	return map[string]any{
		"teams": teamsPayload["items"],
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
		"roles":           roles,
		"asset_cates":     workbenchAssetCateValues(graph.AssetCates),
		"project_enabled": normalizeProjectEnabled(graph.Team.ProjectEnabled) == teammodel.StatusEnabled,
	}, nil
}

func (s Service) ResolveProjectRelease(ctx context.Context, teamID uint64) (PublishedTeamBinding, error) {
	release, graph, err := s.runtimeGraphByRelease(ctx, teamID, 0)
	if err != nil {
		return PublishedTeamBinding{}, err
	}
	enabled := normalizeProjectEnabled(graph.Team.ProjectEnabled) == teammodel.StatusEnabled
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
	agents := make(map[uint64]AgentOption)
	for _, agent := range s.repo.ListAgents(ctx) {
		agents[agent.ID] = agent
	}
	for _, role := range graph.Roles {
		if role.ID != roleID || role.Status != teammodel.StatusEnabled {
			continue
		}
		agent, agentExists := agents[role.AgentID]
		if !agentExists || strings.TrimSpace(agent.Key) == "" {
			return WorkbenchRoleBinding{}, fmt.Errorf("当前角色绑定的智能体不可用")
		}
		return WorkbenchRoleBinding{
			TeamID: graph.Team.ID, TeamName: graph.Team.Name, TeamDescription: graph.Team.Description,
			ReleaseID: release.ID, RoleID: role.ID, RoleType: role.RoleType,
			AgentID: agent.ID, AgentKey: agent.Key, Name: role.Name, Assignment: role.Assignment,
		}, nil
	}
	return WorkbenchRoleBinding{}, fmt.Errorf("当前团队发布版本中不存在该角色")
}

func (s Service) workbenchPowerBinding(ctx context.Context, releaseID uint64, graph runtimeGraph, teamPowerID uint64) (WorkbenchPowerBinding, error) {
	for _, teamPower := range graph.TeamPowers {
		if teamPower.ID != teamPowerID ||
			teamPower.Status != teammodel.StatusEnabled ||
			normalizeTeamPowerHomeStatus(teamPower.HomeStatus) != teammodel.StatusEnabled {
			continue
		}
		power, exists := s.repo.FindPowerOption(ctx, teamPower.PowerID, "")
		if !exists {
			return WorkbenchPowerBinding{}, fmt.Errorf("当前团队能力不可用")
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

func selectedWorkbenchTeamID(requested uint64, payload map[string]any) uint64 {
	rows, _ := payload["items"].([]map[string]any)
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
