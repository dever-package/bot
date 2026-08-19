package team

import (
	"context"
	"encoding/json"
	"fmt"
	"sort"
	"strings"

	"github.com/shemic/dever/orm"

	energonmodel "github.com/dever-package/bot/model/energon"
	teammodel "github.com/dever-package/bot/model/team"
)

type workspaceGraphState struct {
	team      teammodel.Team
	flows     []teammodel.Flow
	flowEdges []teammodel.FlowEdge
	rows      flowGraphRows
}

func (s Service) Workspace(ctx context.Context, teamID uint64) (map[string]any, error) {
	graph, err := s.loadWorkspaceGraph(ctx, teamID)
	if err != nil {
		return nil, err
	}
	teamID = graph.team.ID
	roles := s.repo.ListRoles(ctx, teamID, true)
	assetCates := s.repo.ListAssetCates(ctx, teamID, true)
	teamPowers := s.repo.ListTeamPowers(ctx, teamID, true)
	powers := s.teamPowerOptions(ctx, teamPowers)
	result := graph.payload()
	result["asset_cates"] = assetCatePayloads(assetCates)
	result["team_powers"] = teamPowerPayloads(teamPowers)
	result["roles"] = rolePayloads(roles)
	result["agents"] = s.repo.ListAgents(ctx)
	result["agent_cates"] = s.repo.ListAgentCates(ctx)
	result["knowledge_cates"] = s.repo.ListKnowledgeCates(ctx)
	result["knowledge_bases"] = s.repo.ListKnowledgeBases(ctx)
	result["teams"] = s.publishedTeamOptions(ctx)
	result["powers"] = powers
	result["power_kinds"] = powerKindOptions(powers)
	result["output_types"] = energonmodel.OutputTypeSpecs()
	result["role_types"] = roleTypes()
	result["node_types"] = nodeTypes()
	result["edge_conditions"] = edgeConditions()
	return result, nil
}

func (s Service) SaveFlowGraph(ctx context.Context, teamID uint64, body map[string]any) (map[string]any, error) {
	if err := orm.Transaction(ctx, func(tx context.Context) error {
		if _, err := s.ensureTeamEditable(tx, teamID); err != nil {
			return err
		}
		_, err := s.syncFlowGraph(tx, teamID, body)
		return err
	}); err != nil {
		return nil, err
	}
	return s.graphMutationPayload(ctx, teamID, boolValue(firstPresent(body, "compact_response", "compactResponse")))
}

func (s Service) SaveFlowNodeGraph(ctx context.Context, teamID uint64, flowID uint64, body map[string]any) (map[string]any, error) {
	savedTeamID := teamID
	if err := orm.Transaction(ctx, func(tx context.Context) error {
		flow, team, err := s.resolveNodeGraphTarget(tx, teamID, flowID, body)
		if err != nil {
			return err
		}
		savedTeamID = team.ID
		payloads := s.normalizeGraphFlowNodeNames(tx, team, parseGraphFlowNodes(body["nodes"]))
		nodes, err := s.repo.SyncFlowNodes(tx, team.ID, flow.ID, payloads)
		if err != nil {
			return err
		}
		edges, err := resolveFlowNodeEdges(parseGraphFlowNodeEdges(body["edges"]), nodes)
		if err != nil {
			return err
		}
		return s.repo.SyncFlowNodeEdges(tx, team.ID, flow.ID, edges)
	}); err != nil {
		return nil, err
	}
	return s.graphMutationPayload(ctx, savedTeamID, boolValue(firstPresent(body, "compact_response", "compactResponse")))
}

func (s Service) PublishTeam(ctx context.Context, teamID uint64, compactResponse bool) (map[string]any, error) {
	if err := orm.Transaction(ctx, func(tx context.Context) error {
		team, err := s.repo.FindTeam(tx, teamID)
		if err != nil {
			return err
		}
		snapshot, err := s.buildTeamReleaseSnapshot(tx, team)
		if err != nil {
			return err
		}
		payload, err := json.Marshal(snapshot)
		if err != nil {
			return fmt.Errorf("生成发布快照失败: %w", err)
		}
		version := team.ReleaseVersion + 1
		releaseID := s.repo.InsertTeamRelease(tx, map[string]any{
			"team_id":  team.ID,
			"version":  version,
			"snapshot": string(payload),
			"status":   teammodel.TeamReleaseStatusCurrent,
		})
		if releaseID == 0 {
			return fmt.Errorf("创建发布版本失败")
		}
		if err := s.repo.UpdateTeamChecked(tx, team.ID, map[string]any{
			"publish_status":     teammodel.TeamPublishStatusPublished,
			"current_release_id": releaseID,
			"release_version":    version,
		}); err != nil {
			return err
		}
		return s.repo.ArchiveOtherTeamReleasesChecked(tx, team.ID, releaseID)
	}); err != nil {
		return nil, err
	}
	return s.graphMutationPayload(ctx, teamID, compactResponse)
}

func (s Service) EditTeamDraft(ctx context.Context, teamID uint64, compactResponse bool) (map[string]any, error) {
	team, err := s.repo.FindTeam(ctx, teamID)
	if err != nil {
		return nil, err
	}
	if normalizeTeamPublishStatus(team.PublishStatus) == teammodel.TeamPublishStatusPublished {
		if err := s.repo.UpdateTeamChecked(ctx, team.ID, map[string]any{
			"publish_status": teammodel.TeamPublishStatusEditing,
		}); err != nil {
			return nil, err
		}
	}
	return s.graphMutationPayload(ctx, team.ID, compactResponse)
}

func (s Service) ensureTeamEditable(ctx context.Context, teamID uint64) (teammodel.Team, error) {
	team, err := s.repo.FindTeam(ctx, teamID)
	if err != nil {
		return teammodel.Team{}, err
	}
	if normalizeTeamPublishStatus(team.PublishStatus) == teammodel.TeamPublishStatusPublished {
		return teammodel.Team{}, fmt.Errorf("团队已发布，请先进入编辑草稿后再修改")
	}
	return team, nil
}

func (s Service) buildTeamReleaseSnapshot(ctx context.Context, team teammodel.Team) (TeamReleaseSnapshot, error) {
	assetCates := s.repo.ListAssetCates(ctx, team.ID, true)
	teamPowers := s.repo.ListTeamPowers(ctx, team.ID, true)
	roles := s.repo.ListRoles(ctx, team.ID, true)
	graph := s.loadTeamGraphState(ctx, team)
	if issues := validateFlowGraph(graph.flows, graph.flowEdges); len(issues) > 0 {
		return TeamReleaseSnapshot{}, fmt.Errorf("发布前请先修正工作流图: %s", strings.Join(issues, "；"))
	}
	nodesByFlow := map[string][]GraphFlowNode{}
	nodeEdgesByFlow := map[string][]GraphFlowNodeEdge{}
	for _, flow := range graph.flows {
		nodes := graph.rows.nodesByFlowID[flow.ID]
		edges := graph.rows.nodeEdgesByFlowID[flow.ID]
		if issues := validateFlowNodeGraph(nodes, edges); len(issues) > 0 {
			return TeamReleaseSnapshot{}, fmt.Errorf("发布前请先修正工作流「%s」的节点图: %s", flow.Name, strings.Join(issues, "；"))
		}
		if issues := validatePowerNodeScope(nodes, teamPowers); len(issues) > 0 {
			return TeamReleaseSnapshot{}, fmt.Errorf("发布前请先修正工作流「%s」的能力节点: %s", flow.Name, strings.Join(issues, "；"))
		}
		nodesByFlow[flow.Key] = flowNodePayloads(nodes)
		nodeEdgesByFlow[flow.Key] = flowNodeEdgePayloads(nodes, edges)
	}
	return TeamReleaseSnapshot{
		Team:            teamReleasePayload(team),
		AssetCates:      assetCatePayloads(assetCates),
		TeamPowers:      teamPowerPayloads(teamPowers),
		Roles:           rolePayloads(roles),
		Flows:           flowPayloads(graph.flows),
		FlowEdges:       flowEdgePayloads(graph.flows, graph.flowEdges),
		NodesByFlow:     nodesByFlow,
		NodeEdgesByFlow: nodeEdgesByFlow,
	}, nil
}

func (s Service) loadWorkspaceGraph(ctx context.Context, teamID uint64) (workspaceGraphState, error) {
	team, err := s.repo.FindTeam(ctx, teamID)
	if err != nil {
		return workspaceGraphState{}, err
	}
	return s.loadTeamGraphState(ctx, team), nil
}

func (s Service) loadTeamGraphState(ctx context.Context, team teammodel.Team) workspaceGraphState {
	flows := s.repo.ListFlows(ctx, team.ID, true)
	flowIDs := make([]uint64, 0, len(flows))
	for _, flow := range flows {
		flowIDs = append(flowIDs, flow.ID)
	}
	return workspaceGraphState{
		team:      team,
		flows:     flows,
		flowEdges: s.repo.ListFlowEdges(ctx, team.ID, true),
		rows:      s.repo.ListFlowGraphRows(ctx, flowIDs, true),
	}
}

func (s Service) workspaceGraphPayload(ctx context.Context, teamID uint64) (map[string]any, error) {
	graph, err := s.loadWorkspaceGraph(ctx, teamID)
	if err != nil {
		return nil, err
	}
	return graph.payload(), nil
}

func (s Service) graphMutationPayload(ctx context.Context, teamID uint64, compact bool) (map[string]any, error) {
	if compact {
		return s.workspaceGraphPayload(ctx, teamID)
	}
	return s.Workspace(ctx, teamID)
}

func (graph workspaceGraphState) payload() map[string]any {
	nodesByFlow := map[string][]GraphFlowNode{}
	nodeEdgesByFlow := map[string][]GraphFlowNodeEdge{}
	for _, flow := range graph.flows {
		nodes := graph.rows.nodesByFlowID[flow.ID]
		nodesByFlow[flow.Key] = flowNodePayloads(nodes)
		nodeEdgesByFlow[flow.Key] = flowNodeEdgePayloads(nodes, graph.rows.nodeEdgesByFlowID[flow.ID])
	}
	return map[string]any{
		"team":               teamWorkspacePayload(graph.team),
		"flows":              flowPayloads(graph.flows),
		"flow_edges":         flowEdgePayloads(graph.flows, graph.flowEdges),
		"nodes_by_flow":      nodesByFlow,
		"node_edges_by_flow": nodeEdgesByFlow,
	}
}

func (s Service) syncFlowGraph(ctx context.Context, teamID uint64, body map[string]any) ([]teammodel.Flow, error) {
	flows, err := s.repo.SyncFlows(ctx, teamID, parseGraphFlows(body["flows"]))
	if err != nil {
		return nil, err
	}
	rawEdges := body["edges"]
	if value, exists := body["flow_edges"]; exists {
		rawEdges = value
	}
	edges, err := resolveFlowEdges(parseGraphFlowEdges(rawEdges), flows)
	if err != nil {
		return nil, err
	}
	if err := s.repo.SyncFlowEdges(ctx, teamID, edges); err != nil {
		return nil, err
	}
	return flows, nil
}

func (s Service) resolveNodeGraphTarget(ctx context.Context, teamID uint64, flowID uint64, body map[string]any) (teammodel.Flow, teammodel.Team, error) {
	if _, includesFlowGraph := body["flows"]; includesFlowGraph {
		team, err := s.ensureTeamEditable(ctx, teamID)
		if err != nil {
			return teammodel.Flow{}, teammodel.Team{}, err
		}
		flows, err := s.syncFlowGraph(ctx, team.ID, body)
		if err != nil {
			return teammodel.Flow{}, teammodel.Team{}, err
		}
		flow := findFlow(flows, flowID, textValue(body["flow_key"]))
		if flow.ID == 0 {
			return teammodel.Flow{}, teammodel.Team{}, fmt.Errorf("节点所属工作流不存在")
		}
		return flow, team, nil
	}

	flow, err := s.repo.FindFlow(ctx, flowID)
	if err != nil {
		return teammodel.Flow{}, teammodel.Team{}, err
	}
	if teamID > 0 && flow.TeamID != teamID {
		return teammodel.Flow{}, teammodel.Team{}, fmt.Errorf("工作流不属于当前团队")
	}
	team, err := s.ensureTeamEditable(ctx, flow.TeamID)
	return flow, team, err
}

func resolveFlowEdges(payloads []GraphFlowEdge, flows []teammodel.Flow) ([]graphEdgeSync, error) {
	byKey := make(map[string]teammodel.Flow, len(flows))
	byID := make(map[uint64]teammodel.Flow, len(flows))
	for _, flow := range flows {
		byKey[flow.Key] = flow
		byID[flow.ID] = flow
	}
	result := make([]graphEdgeSync, 0, len(payloads))
	for index, payload := range payloads {
		from := byKey[strings.TrimSpace(payload.FromKey)]
		to := byKey[strings.TrimSpace(payload.ToKey)]
		if from.ID == 0 {
			from = byID[payload.FromFlowID]
		}
		if to.ID == 0 {
			to = byID[payload.ToFlowID]
		}
		if from.ID == 0 || to.ID == 0 {
			return nil, fmt.Errorf("工作流关系引用不存在")
		}
		sortValue := payload.Sort
		if sortValue == 0 {
			sortValue = (index + 1) * 10
		}
		result = append(result, graphEdgeSync{
			fromID: from.ID, toID: to.ID, condition: payload.Condition,
			status: payload.Status, sort: sortValue,
		})
	}
	return result, nil
}

func resolveFlowNodeEdges(payloads []GraphFlowNodeEdge, nodes []teammodel.FlowNode) ([]graphEdgeSync, error) {
	byKey := make(map[string]teammodel.FlowNode, len(nodes))
	byID := make(map[uint64]teammodel.FlowNode, len(nodes))
	for _, node := range nodes {
		byKey[node.NodeKey] = node
		byID[node.ID] = node
	}
	result := make([]graphEdgeSync, 0, len(payloads))
	for index, payload := range payloads {
		from := byKey[strings.TrimSpace(payload.FromKey)]
		to := byKey[strings.TrimSpace(payload.ToKey)]
		if from.ID == 0 {
			from = byID[payload.FromNodeID]
		}
		if to.ID == 0 {
			to = byID[payload.ToNodeID]
		}
		if from.ID == 0 || to.ID == 0 {
			return nil, fmt.Errorf("节点关系引用不存在")
		}
		sortValue := payload.Sort
		if sortValue == 0 {
			sortValue = (index + 1) * 10
		}
		result = append(result, graphEdgeSync{
			fromID: from.ID, toID: to.ID, condition: payload.Condition,
			status: payload.Status, sort: sortValue,
		})
	}
	return result, nil
}

func findFlow(flows []teammodel.Flow, id uint64, key string) teammodel.Flow {
	key = strings.TrimSpace(key)
	for _, flow := range flows {
		if key != "" && flow.Key == key {
			return flow
		}
	}
	for _, flow := range flows {
		if id > 0 && flow.ID == id {
			return flow
		}
	}
	return teammodel.Flow{}
}

func teamWorkspacePayload(team teammodel.Team) map[string]any {
	publishStatus := normalizeTeamPublishStatus(team.PublishStatus)
	return map[string]any{
		"id":                 team.ID,
		"cate_id":            team.CateID,
		"material_pack_id":   team.MaterialPackID,
		"name":               team.Name,
		"description":        team.Description,
		"config":             jsonMap(team.Config),
		"project_enabled":    normalizeEntryStatus(team.ProjectEnabled),
		"status":             team.Status,
		"publish_status":     publishStatus,
		"current_release_id": team.CurrentReleaseID,
		"release_version":    team.ReleaseVersion,
		"readonly":           publishStatus == teammodel.TeamPublishStatusPublished,
		"sort":               team.Sort,
	}
}

func teamReleasePayload(team teammodel.Team) GraphTeam {
	return GraphTeam{
		ID:             team.ID,
		CateID:         team.CateID,
		MaterialPackID: team.MaterialPackID,
		Name:           team.Name,
		Description:    team.Description,
		Config:         jsonMap(team.Config),
		ProjectEnabled: normalizeEntryStatus(team.ProjectEnabled),
		Status:         team.Status,
		Sort:           team.Sort,
	}
}

func rolePayloads(roles []teammodel.Role) []GraphRole {
	result := make([]GraphRole, 0, len(roles))
	for _, role := range roles {
		result = append(result, GraphRole{
			ID:           role.ID,
			TeamID:       role.TeamID,
			RoleType:     role.RoleType,
			RoleKey:      role.RoleKey,
			Name:         role.Name,
			AgentID:      role.AgentID,
			Assignment:   role.Assignment,
			Config:       jsonMap(role.Config),
			ChatStatus:   normalizeEntryStatus(role.ChatStatus),
			ToolStatus:   normalizeEntryStatus(role.ToolStatus),
			CreateStatus: normalizeEntryStatus(role.CreateStatus),
			Status:       role.Status,
			Sort:         role.Sort,
		})
	}
	return result
}

func assetCatePayloads(rows []teammodel.AssetCate) []GraphAssetCate {
	result := make([]GraphAssetCate, 0, len(rows))
	for _, row := range rows {
		result = append(result, GraphAssetCate{
			ID:          row.ID,
			TeamID:      row.TeamID,
			Name:        row.Name,
			Kind:        teammodel.NormalizeAssetCateKind(row.Kind),
			Cardinality: teammodel.NormalizeAssetCateCardinality(row.Cardinality),
			Status:      row.Status,
			Sort:        row.Sort,
		})
	}
	return result
}

func teamPowerPayloads(rows []teammodel.TeamPower) []GraphTeamPower {
	result := make([]GraphTeamPower, 0, len(rows))
	for _, row := range rows {
		result = append(result, GraphTeamPower{
			ID:           row.ID,
			TeamID:       row.TeamID,
			PowerID:      row.PowerID,
			Config:       jsonMap(row.Config),
			HomeStatus:   normalizeEntryStatus(row.HomeStatus),
			CreateStatus: normalizeEntryStatus(row.CreateStatus),
			Status:       row.Status,
			Sort:         row.Sort,
		})
	}
	return result
}

func normalizeTeamPowerHomeStatus(value int16) int16 {
	return normalizeEntryStatus(value)
}

func normalizeEntryStatus(value int16) int16 {
	if value == teammodel.StatusDisabled {
		return teammodel.StatusDisabled
	}
	return teammodel.StatusEnabled
}

func scopedPowerOptions(powers []PowerOption, teamPowers []teammodel.TeamPower) []PowerOption {
	if len(teamPowers) == 0 {
		return powers
	}
	byID := make(map[uint64]PowerOption, len(powers))
	for _, power := range powers {
		byID[power.ID] = power
	}
	result := make([]PowerOption, 0, len(teamPowers))
	for _, teamPower := range teamPowers {
		if power, exists := byID[teamPower.PowerID]; exists {
			power.CreateStatus = normalizeEntryStatus(teamPower.CreateStatus)
			result = append(result, power)
		}
	}
	return result
}

func (s Service) teamPowerOptions(ctx context.Context, teamPowers []teammodel.TeamPower) []PowerOption {
	if len(teamPowers) == 0 {
		return s.repo.ListPowers(ctx)
	}
	ids := make([]uint64, 0, len(teamPowers))
	for _, teamPower := range teamPowers {
		ids = append(ids, teamPower.PowerID)
	}
	return scopedPowerOptions(s.repo.ListPowersByIDs(ctx, ids), teamPowers)
}

func powerAllowedByScope(teamPowers []teammodel.TeamPower, powerID uint64) bool {
	if len(teamPowers) == 0 {
		return true
	}
	if powerID == 0 {
		return false
	}
	for _, teamPower := range teamPowers {
		if teamPower.PowerID == powerID {
			return true
		}
	}
	return false
}

func flowPayloads(flows []teammodel.Flow) []GraphFlow {
	result := make([]GraphFlow, 0, len(flows))
	for _, flow := range flows {
		result = append(result, GraphFlow{
			ID:       flow.ID,
			Name:     flow.Name,
			Key:      flow.Key,
			Goal:     flow.Goal,
			Position: jsonMap(flow.Position),
			Config:   jsonMap(flow.Config),
			Status:   flow.Status,
			Sort:     flow.Sort,
		})
	}
	return result
}

func flowEdgePayloads(flows []teammodel.Flow, edges []teammodel.FlowEdge) []GraphFlowEdge {
	flowByID := map[uint64]teammodel.Flow{}
	for _, flow := range flows {
		flowByID[flow.ID] = flow
	}
	result := make([]GraphFlowEdge, 0, len(edges))
	for _, edge := range edges {
		from := flowByID[edge.FromFlowID]
		to := flowByID[edge.ToFlowID]
		result = append(result, GraphFlowEdge{
			ID:         edge.ID,
			FromFlowID: edge.FromFlowID,
			ToFlowID:   edge.ToFlowID,
			FromKey:    from.Key,
			ToKey:      to.Key,
			Condition:  edge.Condition,
			Status:     edge.Status,
			Sort:       edge.Sort,
		})
	}
	return result
}

func flowNodePayloads(nodes []teammodel.FlowNode) []GraphFlowNode {
	result := make([]GraphFlowNode, 0, len(nodes))
	for _, node := range nodes {
		result = append(result, GraphFlowNode{
			ID:          node.ID,
			NodeKey:     node.NodeKey,
			Name:        node.Name,
			Type:        node.Type,
			RoleID:      node.RoleID,
			RoleKey:     node.RoleKey,
			AgentID:     node.AgentID,
			PowerID:     node.PowerID,
			SubTeamID:   node.SubTeamID,
			AssetCateID: node.AssetCateID,
			Config:      jsonMap(node.Config),
			Position:    jsonMap(node.Position),
			Status:      node.Status,
			Sort:        node.Sort,
		})
	}
	return result
}

func flowNodeEdgePayloads(nodes []teammodel.FlowNode, edges []teammodel.FlowNodeEdge) []GraphFlowNodeEdge {
	nodeByID := map[uint64]teammodel.FlowNode{}
	for _, node := range nodes {
		nodeByID[node.ID] = node
	}
	result := make([]GraphFlowNodeEdge, 0, len(edges))
	for _, edge := range edges {
		from := nodeByID[edge.FromNodeID]
		to := nodeByID[edge.ToNodeID]
		result = append(result, GraphFlowNodeEdge{
			ID:         edge.ID,
			FromNodeID: edge.FromNodeID,
			ToNodeID:   edge.ToNodeID,
			FromKey:    from.NodeKey,
			ToKey:      to.NodeKey,
			Condition:  edge.Condition,
			Status:     edge.Status,
			Sort:       edge.Sort,
		})
	}
	return result
}

func nodeTypes() []map[string]any {
	return []map[string]any{
		{"id": teammodel.NodeTypeAgent, "value": "智能体"},
		{"id": teammodel.NodeTypeRole, "value": "团队角色"},
		{"id": teammodel.NodeTypePower, "value": "能力"},
		{"id": teammodel.NodeTypeTeam, "value": "团队工作流"},
		{"id": teammodel.NodeTypeContext, "value": "上下文"},
		{"id": teammodel.NodeTypeKnowledge, "value": "知识库"},
		{"id": teammodel.NodeTypeCondition, "value": "条件"},
		{"id": teammodel.NodeTypeMerge, "value": "合并"},
		{"id": teammodel.NodeTypeHumanApproval, "value": "人工确认"},
		{"id": teammodel.NodeTypeSave, "value": "保存"},
	}
}

func roleTypes() []map[string]any {
	return []map[string]any{
		{"id": teammodel.RoleTypeWorker, "value": "执行"},
		{"id": teammodel.RoleTypeChat, "value": "沟通"},
		{"id": teammodel.RoleTypePlanner, "value": "规划"},
		{"id": teammodel.RoleTypeReviewer, "value": "审核"},
	}
}

func edgeConditions() []map[string]any {
	return []map[string]any{
		{"id": "always", "value": "总是"},
		{"id": "completed", "value": "完成"},
		{"id": "passed", "value": "通过"},
		{"id": "failed", "value": "不通过"},
		{"id": "approved", "value": "确认"},
		{"id": "rejected", "value": "驳回"},
	}
}

func parseGraphFlows(raw any) []GraphFlow {
	rows := sliceMapValue(raw)
	result := make([]GraphFlow, 0, len(rows))
	for _, row := range rows {
		result = append(result, GraphFlow{
			ID:       uint64Value(row["id"]),
			Name:     textValue(row["name"]),
			Key:      normalizeKey("flow", row["key"]),
			Goal:     textValue(row["goal"]),
			Position: mapValue(row["position"]),
			Config:   mapValue(row["config"]),
			Status:   int16Value(row["status"], teammodel.StatusEnabled),
			Sort:     intValue(row["sort"], 100),
		})
	}
	return result
}

func normalizeTeamPublishStatus(raw any) string {
	switch strings.ToLower(textValue(raw)) {
	case teammodel.TeamPublishStatusPublished, "已发布", "发布":
		return teammodel.TeamPublishStatusPublished
	case teammodel.TeamPublishStatusEditing, "编辑草稿", "editing_draft":
		return teammodel.TeamPublishStatusEditing
	default:
		return teammodel.TeamPublishStatusDraft
	}
}

func parseGraphFlowEdges(raw any) []GraphFlowEdge {
	rows := sliceMapValue(raw)
	result := make([]GraphFlowEdge, 0, len(rows))
	for _, row := range rows {
		result = append(result, GraphFlowEdge{
			ID:         uint64Value(row["id"]),
			FromFlowID: uint64Value(row["from_flow_id"]),
			ToFlowID:   uint64Value(row["to_flow_id"]),
			FromKey:    textValue(row["from_key"]),
			ToKey:      textValue(row["to_key"]),
			Condition:  firstText(row["condition"], "completed"),
			Status:     int16Value(row["status"], teammodel.StatusEnabled),
			Sort:       intValue(row["sort"], 100),
		})
	}
	return result
}

func parseGraphFlowNodes(raw any) []GraphFlowNode {
	rows := sliceMapValue(raw)
	result := make([]GraphFlowNode, 0, len(rows))
	for _, row := range rows {
		result = append(result, GraphFlowNode{
			ID:          uint64Value(row["id"]),
			NodeKey:     normalizeKey("node", row["node_key"]),
			Name:        textValue(row["name"]),
			Type:        firstText(row["type"], teammodel.NodeTypeAgent),
			RoleID:      uint64Value(firstPresent(row, "role_id", "roleId")),
			RoleKey:     textValue(firstPresent(row, "role_key", "roleKey")),
			AgentID:     uint64Value(firstPresent(row, "agent_id", "agentId")),
			PowerID:     uint64Value(firstPresent(row, "power_id", "powerId")),
			SubTeamID:   uint64Value(firstPresent(row, "sub_team_id", "subTeamId")),
			AssetCateID: uint64Value(firstPresent(row, "asset_cate_id", "assetCateId")),
			Config:      mapValue(row["config"]),
			Position:    mapValue(row["position"]),
			Status:      int16Value(row["status"], teammodel.StatusEnabled),
			Sort:        intValue(row["sort"], 100),
		})
	}
	return result
}

type graphFlowNodeNameLookup struct {
	currentTeamID  uint64
	assetCates     map[uint64]string
	agents         map[uint64]string
	knowledgeBases map[uint64]string
	roles          map[uint64]string
	powers         map[uint64]string
	teams          map[uint64]graphTeamNameLookup
}

type graphTeamNameLookup struct {
	name  string
	flows map[uint64]string
}

func (s Service) normalizeGraphFlowNodeNames(ctx context.Context, team teammodel.Team, nodes []GraphFlowNode) []GraphFlowNode {
	if len(nodes) == 0 {
		return nodes
	}
	lookupNodes := make([]GraphFlowNode, 0, len(nodes))
	for _, node := range nodes {
		if isDefaultGraphFlowNodeName(node.Name) {
			lookupNodes = append(lookupNodes, node)
		}
	}
	if len(lookupNodes) == 0 {
		return nodes
	}
	lookup := s.graphFlowNodeNameLookup(ctx, team, lookupNodes)
	result := make([]GraphFlowNode, 0, len(nodes))
	for _, node := range nodes {
		if isDefaultGraphFlowNodeName(node.Name) {
			if name := deriveGraphFlowNodeName(node, lookup); name != "" {
				node.Name = name
			}
		}
		result = append(result, node)
	}
	return result
}

func (s Service) graphFlowNodeNameLookup(ctx context.Context, team teammodel.Team, nodes []GraphFlowNode) graphFlowNodeNameLookup {
	lookup := graphFlowNodeNameLookup{
		currentTeamID:  team.ID,
		assetCates:     map[uint64]string{},
		agents:         map[uint64]string{},
		knowledgeBases: map[uint64]string{},
		roles:          map[uint64]string{},
		powers:         map[uint64]string{},
		teams:          map[uint64]graphTeamNameLookup{},
	}
	agentIDs := make([]uint64, 0, len(nodes))
	knowledgeBaseIDs := make([]uint64, 0, len(nodes))
	powerIDs := make([]uint64, 0, len(nodes))
	needsAssetCates := false
	needsRoles := false
	needsCurrentTeamFlows := false
	for _, node := range nodes {
		agentIDs = append(agentIDs, firstUint64(node.AgentID, uint64Value(node.Config["agent_id"])))
		knowledgeBaseIDs = append(knowledgeBaseIDs, uint64Value(node.Config["knowledge_base_id"]))
		powerIDs = append(powerIDs, firstUint64(node.PowerID, uint64Value(node.Config["power_id"])))
		switch strings.TrimSpace(node.Type) {
		case teammodel.NodeTypeContext, teammodel.NodeTypeSave:
			needsAssetCates = true
		case teammodel.NodeTypeRole:
			needsRoles = true
		case teammodel.NodeTypeTeam:
			needsCurrentTeamFlows = true
		}
	}
	if needsAssetCates {
		for _, cate := range s.repo.ListAssetCates(ctx, team.ID, true) {
			lookup.assetCates[cate.ID] = strings.TrimSpace(cate.Name)
		}
	}
	for _, agent := range s.repo.ListAgentsByIDs(ctx, agentIDs) {
		lookup.agents[agent.ID] = strings.TrimSpace(agent.Name)
	}
	for _, base := range s.repo.ListKnowledgeBasesByIDs(ctx, knowledgeBaseIDs) {
		lookup.knowledgeBases[base.ID] = strings.TrimSpace(base.Name)
	}
	for _, power := range s.repo.ListPowersByIDs(ctx, powerIDs) {
		lookup.powers[power.ID] = strings.TrimSpace(power.Name)
	}
	currentTeam := graphTeamNameLookup{
		name:  strings.TrimSpace(team.Name),
		flows: map[uint64]string{},
	}
	if needsCurrentTeamFlows {
		for _, flow := range s.repo.ListFlows(ctx, team.ID, true) {
			currentTeam.flows[flow.ID] = strings.TrimSpace(flow.Name)
		}
	}
	lookup.teams[team.ID] = currentTeam
	if needsRoles {
		for _, role := range s.repo.ListRoles(ctx, team.ID, true) {
			lookup.roles[role.ID] = strings.TrimSpace(role.Name)
		}
	}
	if !needsPublishedTeamNameLookup(nodes, team.ID) {
		return lookup
	}
	for _, option := range s.publishedTeamOptions(ctx) {
		teamLookup := graphTeamNameLookup{
			name:  strings.TrimSpace(option.Name),
			flows: map[uint64]string{},
		}
		if existing, ok := lookup.teams[option.ID]; ok {
			if existing.name != "" {
				teamLookup.name = existing.name
			}
			for flowID, flowName := range existing.flows {
				teamLookup.flows[flowID] = flowName
			}
		}
		for _, flow := range option.Flows {
			if _, exists := teamLookup.flows[flow.ID]; !exists {
				teamLookup.flows[flow.ID] = strings.TrimSpace(flow.Name)
			}
		}
		lookup.teams[option.ID] = teamLookup
		for _, role := range option.Roles {
			if _, exists := lookup.roles[role.ID]; !exists {
				lookup.roles[role.ID] = strings.TrimSpace(role.Name)
			}
		}
	}
	return lookup
}

func needsPublishedTeamNameLookup(nodes []GraphFlowNode, currentTeamID uint64) bool {
	for _, node := range nodes {
		switch strings.TrimSpace(node.Type) {
		case teammodel.NodeTypeRole:
			teamID := uint64Value(node.Config["role_team_id"])
			if teamID > 0 && teamID != currentTeamID {
				return true
			}
		case teammodel.NodeTypeTeam:
			teamID := firstUint64(node.SubTeamID, uint64Value(node.Config["sub_team_id"]))
			if teamID > 0 && teamID != currentTeamID {
				return true
			}
		}
	}
	return false
}

func deriveGraphFlowNodeName(node GraphFlowNode, lookup graphFlowNodeNameLookup) string {
	config := node.Config
	switch strings.TrimSpace(node.Type) {
	case teammodel.NodeTypeContext:
		if name := lookup.assetCates[nodeAssetCateID(node)]; name != "" {
			return "读取：" + name
		}
		return "读取上下文"
	case teammodel.NodeTypeKnowledge:
		if name := lookup.knowledgeBases[uint64Value(config["knowledge_base_id"])]; name != "" {
			return "知识库：" + name
		}
		return "知识库"
	case teammodel.NodeTypeSave:
		if name := lookup.assetCates[nodeAssetCateID(node)]; name != "" {
			return "保存：" + name
		}
		return "保存结果"
	case teammodel.NodeTypeAgent:
		if name := lookup.agents[firstUint64(node.AgentID, uint64Value(config["agent_id"]))]; name != "" {
			return name
		}
		return "智能体"
	case teammodel.NodeTypeRole:
		if name := lookup.roles[firstUint64(node.RoleID, uint64Value(config["role_id"]))]; name != "" {
			return name
		}
		return "团队角色"
	case teammodel.NodeTypePower:
		if name := lookup.powers[firstUint64(node.PowerID, uint64Value(config["power_id"]))]; name != "" {
			return name
		}
		return "能力"
	case teammodel.NodeTypeTeam:
		teamID := firstUint64(node.SubTeamID, uint64Value(config["sub_team_id"]), lookup.currentTeamID)
		flowID := firstUint64(uint64Value(config["sub_flow_id"]), uint64Value(config["flow_id"]))
		teamLookup := lookup.teams[teamID]
		flowName := strings.TrimSpace(teamLookup.flows[flowID])
		if teamLookup.name != "" && flowName != "" {
			return teamLookup.name + " / " + flowName
		}
		if teamLookup.name != "" {
			return teamLookup.name
		}
		return "团队工作流"
	case teammodel.NodeTypeCondition:
		return "条件判断"
	case teammodel.NodeTypeMerge:
		return "合并结果"
	case teammodel.NodeTypeHumanApproval:
		return "人工确认"
	default:
		return strings.TrimSpace(node.Type)
	}
}

func nodeAssetCateID(node GraphFlowNode) uint64 {
	return firstUint64(node.AssetCateID, uint64Value(node.Config["asset_cate_id"]))
}

func firstUint64(values ...uint64) uint64 {
	for _, value := range values {
		if value > 0 {
			return value
		}
	}
	return 0
}

func isDefaultGraphFlowNodeName(name string) bool {
	name = strings.TrimSpace(name)
	if name == "" || name == "节点" {
		return true
	}
	if !strings.HasPrefix(name, "节点") {
		return false
	}
	suffix := strings.TrimPrefix(name, "节点")
	if suffix == "" {
		return false
	}
	for _, char := range suffix {
		if char < '0' || char > '9' {
			return false
		}
	}
	return true
}

func parseGraphFlowNodeEdges(raw any) []GraphFlowNodeEdge {
	rows := sliceMapValue(raw)
	result := make([]GraphFlowNodeEdge, 0, len(rows))
	for _, row := range rows {
		result = append(result, GraphFlowNodeEdge{
			ID:         uint64Value(row["id"]),
			FromNodeID: uint64Value(row["from_node_id"]),
			ToNodeID:   uint64Value(row["to_node_id"]),
			FromKey:    textValue(row["from_key"]),
			ToKey:      textValue(row["to_key"]),
			Condition:  firstText(row["condition"], "always"),
			Status:     int16Value(row["status"], teammodel.StatusEnabled),
			Sort:       intValue(row["sort"], 100),
		})
	}
	return result
}

func powerKindOptions(powers []PowerOption) []PowerKindOption {
	labels := map[string]string{
		"text":       "文本",
		"storyboard": "分镜脚本",
		"image":      "图片",
		"video":      "视频",
		"audio":      "音频",
		"role":       "角色",
		"multi":      "多模态",
		"embeddings": "向量",
		"workflow":   "工作流",
	}
	order := []string{"text", "storyboard", "image", "video", "audio", "role", "multi", "embeddings", "workflow"}
	seen := map[string]bool{}
	for _, power := range powers {
		if power.Kind != "" {
			seen[power.Kind] = true
		}
	}
	result := make([]PowerKindOption, 0, len(seen))
	for _, kind := range order {
		if !seen[kind] {
			continue
		}
		result = append(result, PowerKindOption{ID: kind, Value: labels[kind]})
		delete(seen, kind)
	}
	extra := make([]string, 0, len(seen))
	for kind := range seen {
		extra = append(extra, kind)
	}
	sort.Strings(extra)
	for _, kind := range extra {
		result = append(result, PowerKindOption{ID: kind, Value: kind})
	}
	return result
}

func firstPresent(row map[string]any, keys ...string) any {
	for _, key := range keys {
		if value, exists := row[key]; exists {
			return value
		}
	}
	return nil
}
