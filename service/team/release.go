package team

import (
	"context"
	"encoding/json"
	"fmt"

	teammodel "github.com/dever-package/bot/model/team"
)

type runtimeGraph struct {
	Team              teammodel.Team
	AssetCates        []teammodel.AssetCate
	TeamPowers        []teammodel.TeamPower
	Roles             []teammodel.Role
	Flows             []teammodel.Flow
	FlowEdges         []teammodel.FlowEdge
	NodesByFlowID     map[uint64][]teammodel.FlowNode
	NodeEdgesByFlowID map[uint64][]teammodel.FlowNodeEdge
}

func (s Service) runnableTeamRelease(ctx context.Context, team teammodel.Team) (*teammodel.TeamRelease, error) {
	if release := s.currentTeamRelease(ctx, team); release != nil {
		return release, nil
	}
	return nil, fmt.Errorf("团队尚未发布，不能运行")
}

func (s Service) currentTeamRelease(ctx context.Context, team teammodel.Team) *teammodel.TeamRelease {
	if team.CurrentReleaseID > 0 {
		if release := s.repo.FindTeamRelease(ctx, team.CurrentReleaseID); release != nil {
			if release.Status == teammodel.TeamReleaseStatusCurrent {
				return release
			}
		}
	}
	if release := s.repo.FindCurrentTeamRelease(ctx, team.ID); release != nil {
		return release
	}
	return nil
}

func (s Service) runnableRelease(ctx context.Context, team teammodel.Team, releaseID uint64) (*teammodel.TeamRelease, error) {
	if releaseID == 0 {
		return s.runnableTeamRelease(ctx, team)
	}
	release := s.repo.FindTeamRelease(ctx, releaseID)
	if release == nil {
		return nil, fmt.Errorf("发布版本不存在")
	}
	if release.TeamID != team.ID {
		return nil, fmt.Errorf("发布版本不属于当前团队")
	}
	if release.Status != teammodel.TeamReleaseStatusCurrent && release.Status != teammodel.TeamReleaseStatusArchive {
		return nil, fmt.Errorf("发布版本不可运行")
	}
	return release, nil
}

func (s Service) runtimeGraphForRun(ctx context.Context, run teammodel.Run) (runtimeGraph, error) {
	if run.ReleaseID > 0 {
		release := s.repo.FindTeamRelease(ctx, run.ReleaseID)
		if release == nil {
			return runtimeGraph{}, fmt.Errorf("运行绑定的发布版本不存在")
		}
		return runtimeGraphFromRelease(*release)
	}
	team, err := s.repo.FindTeam(ctx, run.TeamID)
	if err != nil {
		return runtimeGraph{}, err
	}
	return s.currentRuntimeGraph(ctx, team), nil
}

func (s Service) currentRuntimeGraph(ctx context.Context, team teammodel.Team) runtimeGraph {
	flows := s.repo.ListFlows(ctx, team.ID, true)
	graph := runtimeGraph{
		Team:              team,
		AssetCates:        s.repo.ListAssetCates(ctx, team.ID, true),
		TeamPowers:        s.repo.ListTeamPowers(ctx, team.ID, true),
		Roles:             s.repo.ListRoles(ctx, team.ID, true),
		Flows:             flows,
		FlowEdges:         s.repo.ListFlowEdges(ctx, team.ID, true),
		NodesByFlowID:     map[uint64][]teammodel.FlowNode{},
		NodeEdgesByFlowID: map[uint64][]teammodel.FlowNodeEdge{},
	}
	for _, flow := range flows {
		graph.NodesByFlowID[flow.ID] = s.repo.ListFlowNodes(ctx, flow.ID, true)
		graph.NodeEdgesByFlowID[flow.ID] = s.repo.ListFlowNodeEdges(ctx, flow.ID, true)
	}
	return graph
}

func runtimeGraphFromRelease(release teammodel.TeamRelease) (runtimeGraph, error) {
	snapshot, err := releaseSnapshotFromText(release.Snapshot)
	if err != nil {
		return runtimeGraph{}, err
	}
	graph := runtimeGraph{
		Team:              graphTeamToModel(snapshot.Team),
		AssetCates:        make([]teammodel.AssetCate, 0, len(snapshot.AssetCates)),
		TeamPowers:        make([]teammodel.TeamPower, 0, len(snapshot.TeamPowers)),
		Roles:             make([]teammodel.Role, 0, len(snapshot.Roles)),
		Flows:             make([]teammodel.Flow, 0, len(snapshot.Flows)),
		FlowEdges:         make([]teammodel.FlowEdge, 0, len(snapshot.FlowEdges)),
		NodesByFlowID:     map[uint64][]teammodel.FlowNode{},
		NodeEdgesByFlowID: map[uint64][]teammodel.FlowNodeEdge{},
	}
	for _, payload := range snapshot.AssetCates {
		graph.AssetCates = append(graph.AssetCates, graphAssetCateToModel(graph.Team.ID, payload))
	}
	for _, payload := range snapshot.TeamPowers {
		graph.TeamPowers = append(graph.TeamPowers, graphTeamPowerToModel(graph.Team.ID, payload))
	}
	for _, payload := range snapshot.Roles {
		graph.Roles = append(graph.Roles, graphRoleToModel(graph.Team.ID, payload))
	}
	for _, payload := range snapshot.Flows {
		graph.Flows = append(graph.Flows, graphFlowToModel(graph.Team.ID, payload))
	}
	flowByKey := map[string]teammodel.Flow{}
	for _, flow := range graph.Flows {
		flowByKey[flow.Key] = flow
	}
	for _, payload := range snapshot.FlowEdges {
		graph.FlowEdges = append(graph.FlowEdges, graphFlowEdgeToModel(graph.Team.ID, payload))
	}
	for flowKey, payloads := range snapshot.NodesByFlow {
		flow := flowByKey[flowKey]
		if flow.ID == 0 {
			continue
		}
		nodes := make([]teammodel.FlowNode, 0, len(payloads))
		for _, payload := range payloads {
			nodes = append(nodes, graphFlowNodeToModel(graph.Team.ID, flow.ID, payload))
		}
		graph.NodesByFlowID[flow.ID] = nodes
	}
	for flowKey, payloads := range snapshot.NodeEdgesByFlow {
		flow := flowByKey[flowKey]
		if flow.ID == 0 {
			continue
		}
		edges := make([]teammodel.FlowNodeEdge, 0, len(payloads))
		for _, payload := range payloads {
			edges = append(edges, graphFlowNodeEdgeToModel(graph.Team.ID, flow.ID, payload))
		}
		graph.NodeEdgesByFlowID[flow.ID] = edges
	}
	return graph, nil
}

func releaseSnapshotFromText(text string) (TeamReleaseSnapshot, error) {
	var snapshot TeamReleaseSnapshot
	if err := json.Unmarshal([]byte(text), &snapshot); err != nil {
		return TeamReleaseSnapshot{}, fmt.Errorf("读取发布快照失败: %w", err)
	}
	if snapshot.Team.ID == 0 {
		return TeamReleaseSnapshot{}, fmt.Errorf("发布快照缺少团队信息")
	}
	return snapshot, nil
}

func graphTeamToModel(payload GraphTeam) teammodel.Team {
	return teammodel.Team{
		ID:          payload.ID,
		CateID:      payload.CateID,
		Name:        payload.Name,
		Description: payload.Description,
		Config:      jsonText(payload.Config),
		Status:      payload.Status,
		Sort:        payload.Sort,
	}
}

func graphRoleToModel(teamID uint64, payload GraphRole) teammodel.Role {
	return teammodel.Role{
		ID:          payload.ID,
		TeamID:      teamID,
		RoleType:    payload.RoleType,
		RoleKey:     payload.RoleKey,
		Name:        payload.Name,
		AgentID:     payload.AgentID,
		AssetCateID: payload.AssetCateID,
		Assignment:  payload.Assignment,
		Config:      jsonText(payload.Config),
		Status:      payload.Status,
		Sort:        payload.Sort,
	}
}

func graphAssetCateToModel(teamID uint64, payload GraphAssetCate) teammodel.AssetCate {
	return teammodel.AssetCate{
		ID:          payload.ID,
		TeamID:      teamID,
		Name:        payload.Name,
		Kind:        teammodel.NormalizeAssetCateKind(payload.Kind),
		Cardinality: teammodel.NormalizeAssetCateCardinality(payload.Cardinality),
		Status:      payload.Status,
		Sort:        payload.Sort,
	}
}

func graphTeamPowerToModel(teamID uint64, payload GraphTeamPower) teammodel.TeamPower {
	return teammodel.TeamPower{
		ID:      payload.ID,
		TeamID:  teamID,
		PowerID: payload.PowerID,
		Config:  jsonText(payload.Config),
		Status:  payload.Status,
		Sort:    payload.Sort,
	}
}

func graphFlowToModel(teamID uint64, payload GraphFlow) teammodel.Flow {
	return teammodel.Flow{
		ID:       payload.ID,
		TeamID:   teamID,
		Name:     payload.Name,
		Key:      payload.Key,
		Goal:     payload.Goal,
		Position: jsonText(payload.Position),
		Config:   jsonText(payload.Config),
		Status:   payload.Status,
		Sort:     payload.Sort,
	}
}

func graphFlowEdgeToModel(teamID uint64, payload GraphFlowEdge) teammodel.FlowEdge {
	return teammodel.FlowEdge{
		ID:         payload.ID,
		TeamID:     teamID,
		FromFlowID: payload.FromFlowID,
		ToFlowID:   payload.ToFlowID,
		Condition:  payload.Condition,
		Status:     payload.Status,
		Sort:       payload.Sort,
	}
}

func graphFlowNodeToModel(teamID uint64, flowID uint64, payload GraphFlowNode) teammodel.FlowNode {
	return teammodel.FlowNode{
		ID:          payload.ID,
		TeamID:      teamID,
		FlowID:      flowID,
		NodeKey:     payload.NodeKey,
		Name:        payload.Name,
		Type:        payload.Type,
		RoleID:      payload.RoleID,
		RoleKey:     payload.RoleKey,
		AgentID:     payload.AgentID,
		PowerID:     payload.PowerID,
		SubTeamID:   payload.SubTeamID,
		AssetCateID: payload.AssetCateID,
		Config:      jsonText(payload.Config),
		Position:    jsonText(payload.Position),
		Status:      payload.Status,
		Sort:        payload.Sort,
	}
}

func graphFlowNodeEdgeToModel(teamID uint64, flowID uint64, payload GraphFlowNodeEdge) teammodel.FlowNodeEdge {
	return teammodel.FlowNodeEdge{
		ID:         payload.ID,
		TeamID:     teamID,
		FlowID:     flowID,
		FromNodeID: payload.FromNodeID,
		ToNodeID:   payload.ToNodeID,
		Condition:  payload.Condition,
		Status:     payload.Status,
		Sort:       payload.Sort,
	}
}

func (graph runtimeGraph) findFlow(id uint64) teammodel.Flow {
	for _, flow := range graph.Flows {
		if flow.ID == id {
			return flow
		}
	}
	return teammodel.Flow{}
}
