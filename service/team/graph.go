package team

import (
	"context"
	"encoding/json"
	"fmt"
	"sort"
	"strings"

	teammodel "my/package/bot/model/team"
)

func (s Service) Workspace(ctx context.Context, teamID uint64) (map[string]any, error) {
	team, err := s.repo.FindTeam(ctx, teamID)
	if err != nil {
		return nil, err
	}
	flows := s.repo.ListFlows(ctx, teamID, true)
	flowEdges := s.repo.ListFlowEdges(ctx, teamID, true)
	nodesByFlow := map[string]any{}
	nodeEdgesByFlow := map[string]any{}
	for _, flow := range flows {
		nodes := s.repo.ListFlowNodes(ctx, flow.ID, true)
		edges := s.repo.ListFlowNodeEdges(ctx, flow.ID, true)
		nodesByFlow[flow.Key] = flowNodePayloads(nodes)
		nodeEdgesByFlow[flow.Key] = flowNodeEdgePayloads(nodes, edges)
	}
	roles := s.repo.ListRoles(ctx, teamID, true)
	assetCates := s.repo.ListAssetCates(ctx, teamID, true)
	powers := s.repo.ListPowers(ctx)
	return map[string]any{
		"team":               teamWorkspacePayload(team),
		"asset_cates":        assetCatePayloads(assetCates),
		"roles":              rolePayloads(roles),
		"flows":              flowPayloads(flows),
		"flow_edges":         flowEdgePayloads(flows, flowEdges),
		"nodes_by_flow":      nodesByFlow,
		"node_edges_by_flow": nodeEdgesByFlow,
		"agents":             s.repo.ListAgents(ctx),
		"agent_cates":        s.repo.ListAgentCates(ctx),
		"teams":              s.publishedTeamOptions(ctx),
		"powers":             powers,
		"power_kinds":        powerKindOptions(powers),
		"role_types":         roleTypes(),
		"node_types":         nodeTypes(),
		"edge_conditions":    edgeConditions(),
	}, nil
}

func (s Service) SaveFlowGraph(ctx context.Context, teamID uint64, body map[string]any) (map[string]any, error) {
	if _, err := s.ensureTeamEditable(ctx, teamID); err != nil {
		return nil, err
	}
	payloads := parseGraphFlows(body["flows"])
	keepFlowKeys := map[string]bool{}
	flowByKey := map[string]teammodel.Flow{}
	for index, payload := range payloads {
		if payload.Sort == 0 {
			payload.Sort = (index + 1) * 10
		}
		row, err := s.repo.UpsertFlow(ctx, teamID, payload)
		if err != nil {
			return nil, err
		}
		keepFlowKeys[row.Key] = true
		flowByKey[row.Key] = row
	}
	s.repo.DisableMissingFlows(ctx, teamID, keepFlowKeys)

	edgePayloads := parseGraphFlowEdges(body["edges"])
	keepEdgeKeys := map[string]bool{}
	for index, payload := range edgePayloads {
		from := flowByKey[payload.FromKey]
		to := flowByKey[payload.ToKey]
		if from.ID == 0 {
			from = findFlowByID(flowByKey, payload.FromFlowID)
		}
		if to.ID == 0 {
			to = findFlowByID(flowByKey, payload.ToFlowID)
		}
		if from.ID == 0 || to.ID == 0 {
			return nil, fmt.Errorf("工作流关系引用不存在")
		}
		if payload.Sort == 0 {
			payload.Sort = (index + 1) * 10
		}
		if err := s.repo.UpsertFlowEdge(ctx, teamID, from.ID, to.ID, payload); err != nil {
			return nil, err
		}
		keepEdgeKeys[edgeKey(from.ID, to.ID)] = true
	}
	s.repo.DisableMissingFlowEdges(ctx, teamID, keepEdgeKeys)

	return s.Workspace(ctx, teamID)
}

func (s Service) SaveFlowNodeGraph(ctx context.Context, flowID uint64, body map[string]any) (map[string]any, error) {
	flow, err := s.repo.FindFlow(ctx, flowID)
	if err != nil {
		return nil, err
	}
	team, err := s.ensureTeamEditable(ctx, flow.TeamID)
	if err != nil {
		return nil, err
	}
	payloads := parseGraphFlowNodes(body["nodes"])
	payloads = s.normalizeGraphFlowNodeNames(ctx, team, payloads)
	keepNodeKeys := map[string]bool{}
	nodeByKey := map[string]teammodel.FlowNode{}
	for index, payload := range payloads {
		if payload.Sort == 0 {
			payload.Sort = (index + 1) * 10
		}
		row, err := s.repo.UpsertFlowNode(ctx, flow.TeamID, flow.ID, payload)
		if err != nil {
			return nil, err
		}
		keepNodeKeys[row.NodeKey] = true
		nodeByKey[row.NodeKey] = row
	}
	s.repo.DisableMissingFlowNodes(ctx, flow.ID, keepNodeKeys)

	edgePayloads := parseGraphFlowNodeEdges(body["edges"])
	keepEdgeKeys := map[string]bool{}
	for index, payload := range edgePayloads {
		from := nodeByKey[payload.FromKey]
		to := nodeByKey[payload.ToKey]
		if from.ID == 0 {
			from = findFlowNodeByID(nodeByKey, payload.FromNodeID)
		}
		if to.ID == 0 {
			to = findFlowNodeByID(nodeByKey, payload.ToNodeID)
		}
		if from.ID == 0 || to.ID == 0 {
			return nil, fmt.Errorf("节点关系引用不存在")
		}
		if payload.Sort == 0 {
			payload.Sort = (index + 1) * 10
		}
		if err := s.repo.UpsertFlowNodeEdge(ctx, flow.TeamID, flow.ID, from.ID, to.ID, payload); err != nil {
			return nil, err
		}
		keepEdgeKeys[edgeKey(from.ID, to.ID)] = true
	}
	s.repo.DisableMissingFlowNodeEdges(ctx, flow.ID, keepEdgeKeys)

	return s.Workspace(ctx, flow.TeamID)
}

func (s Service) PublishTeam(ctx context.Context, teamID uint64) (map[string]any, error) {
	team, err := s.repo.FindTeam(ctx, teamID)
	if err != nil {
		return nil, err
	}
	snapshot, err := s.buildTeamReleaseSnapshot(ctx, team)
	if err != nil {
		return nil, err
	}
	payload, err := json.Marshal(snapshot)
	if err != nil {
		return nil, fmt.Errorf("生成发布快照失败: %w", err)
	}
	version := team.ReleaseVersion + 1
	releaseID := s.repo.InsertTeamRelease(ctx, map[string]any{
		"team_id":  team.ID,
		"version":  version,
		"snapshot": string(payload),
		"status":   teammodel.TeamReleaseStatusCurrent,
	})
	if releaseID == 0 {
		return nil, fmt.Errorf("创建发布版本失败")
	}
	s.repo.UpdateTeam(ctx, team.ID, map[string]any{
		"publish_status":     teammodel.TeamPublishStatusPublished,
		"current_release_id": releaseID,
		"release_version":    version,
	})
	s.repo.ArchiveOtherTeamReleases(ctx, team.ID, releaseID)
	return s.Workspace(ctx, team.ID)
}

func (s Service) EditTeamDraft(ctx context.Context, teamID uint64) (map[string]any, error) {
	team, err := s.repo.FindTeam(ctx, teamID)
	if err != nil {
		return nil, err
	}
	if normalizeTeamPublishStatus(team.PublishStatus) == teammodel.TeamPublishStatusPublished {
		s.repo.UpdateTeam(ctx, team.ID, map[string]any{
			"publish_status": teammodel.TeamPublishStatusEditing,
		})
	}
	return s.Workspace(ctx, team.ID)
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
	roles := s.repo.ListRoles(ctx, team.ID, true)
	if issues := validateTeamRoles(roles); len(issues) > 0 {
		return TeamReleaseSnapshot{}, fmt.Errorf("发布前请先修正团队角色: %s", strings.Join(issues, "；"))
	}
	flows := s.repo.ListFlows(ctx, team.ID, true)
	flowEdges := s.repo.ListFlowEdges(ctx, team.ID, true)
	if issues := validateFlowGraph(flows, flowEdges); len(issues) > 0 {
		return TeamReleaseSnapshot{}, fmt.Errorf("发布前请先修正工作流图: %s", strings.Join(issues, "；"))
	}
	nodesByFlow := map[string][]GraphFlowNode{}
	nodeEdgesByFlow := map[string][]GraphFlowNodeEdge{}
	for _, flow := range flows {
		nodes := s.repo.ListFlowNodes(ctx, flow.ID, true)
		edges := s.repo.ListFlowNodeEdges(ctx, flow.ID, true)
		if issues := validateFlowNodeGraph(nodes, edges); len(issues) > 0 {
			return TeamReleaseSnapshot{}, fmt.Errorf("发布前请先修正工作流「%s」的节点图: %s", flow.Name, strings.Join(issues, "；"))
		}
		nodesByFlow[flow.Key] = flowNodePayloads(nodes)
		nodeEdgesByFlow[flow.Key] = flowNodeEdgePayloads(nodes, edges)
	}
	return TeamReleaseSnapshot{
		Team:            teamReleasePayload(team),
		AssetCates:      assetCatePayloads(assetCates),
		Roles:           rolePayloads(roles),
		Flows:           flowPayloads(flows),
		FlowEdges:       flowEdgePayloads(flows, flowEdges),
		NodesByFlow:     nodesByFlow,
		NodeEdgesByFlow: nodeEdgesByFlow,
	}, nil
}

func teamWorkspacePayload(team teammodel.Team) map[string]any {
	publishStatus := normalizeTeamPublishStatus(team.PublishStatus)
	return map[string]any{
		"id":                 team.ID,
		"cate_id":            team.CateID,
		"name":               team.Name,
		"description":        team.Description,
		"config":             jsonMap(team.Config),
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
		ID:          team.ID,
		CateID:      team.CateID,
		Name:        team.Name,
		Description: team.Description,
		Config:      jsonMap(team.Config),
		Status:      team.Status,
		Sort:        team.Sort,
	}
}

func rolePayloads(roles []teammodel.Role) []GraphRole {
	result := make([]GraphRole, 0, len(roles))
	for _, role := range roles {
		result = append(result, GraphRole{
			ID:          role.ID,
			TeamID:      role.TeamID,
			RoleType:    role.RoleType,
			RoleKey:     role.RoleKey,
			Name:        role.Name,
			AgentID:     role.AgentID,
			AssetCateID: role.AssetCateID,
			Assignment:  role.Assignment,
			Config:      jsonMap(role.Config),
			Status:      role.Status,
			Sort:        role.Sort,
		})
	}
	return result
}

func assetCatePayloads(rows []teammodel.AssetCate) []GraphAssetCate {
	result := make([]GraphAssetCate, 0, len(rows))
	for _, row := range rows {
		result = append(result, GraphAssetCate{
			ID:     row.ID,
			TeamID: row.TeamID,
			Name:   row.Name,
			Status: row.Status,
			Sort:   row.Sort,
		})
	}
	return result
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
		{"id": teammodel.NodeTypeCondition, "value": "条件"},
		{"id": teammodel.NodeTypeMerge, "value": "合并"},
		{"id": teammodel.NodeTypeHumanApproval, "value": "人工确认"},
		{"id": teammodel.NodeTypeSave, "value": "保存"},
	}
}

func roleTypes() []map[string]any {
	return []map[string]any{
		{"id": teammodel.RoleTypeChat, "value": "沟通"},
		{"id": teammodel.RoleTypePlanner, "value": "规划"},
		{"id": teammodel.RoleTypeWorker, "value": "执行"},
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
	currentTeamID uint64
	assetCates    map[uint64]string
	agents        map[uint64]string
	roles         map[uint64]string
	powers        map[uint64]string
	teams         map[uint64]graphTeamNameLookup
}

type graphTeamNameLookup struct {
	name  string
	flows map[uint64]string
}

func (s Service) normalizeGraphFlowNodeNames(ctx context.Context, team teammodel.Team, nodes []GraphFlowNode) []GraphFlowNode {
	if len(nodes) == 0 {
		return nodes
	}
	lookup := s.graphFlowNodeNameLookup(ctx, team, nodes)
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
		currentTeamID: team.ID,
		assetCates:    map[uint64]string{},
		agents:        map[uint64]string{},
		roles:         map[uint64]string{},
		powers:        map[uint64]string{},
		teams:         map[uint64]graphTeamNameLookup{},
	}
	for _, cate := range s.repo.ListAssetCates(ctx, team.ID, true) {
		lookup.assetCates[cate.ID] = strings.TrimSpace(cate.Name)
	}
	for _, agent := range s.repo.ListAgents(ctx) {
		lookup.agents[agent.ID] = strings.TrimSpace(agent.Name)
	}
	for _, power := range s.repo.ListPowers(ctx) {
		lookup.powers[power.ID] = strings.TrimSpace(power.Name)
	}
	currentTeam := graphTeamNameLookup{
		name:  strings.TrimSpace(team.Name),
		flows: map[uint64]string{},
	}
	for _, flow := range s.repo.ListFlows(ctx, team.ID, true) {
		currentTeam.flows[flow.ID] = strings.TrimSpace(flow.Name)
	}
	lookup.teams[team.ID] = currentTeam
	for _, role := range s.repo.ListRoles(ctx, team.ID, true) {
		lookup.roles[role.ID] = strings.TrimSpace(role.Name)
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
		"image":      "图片",
		"video":      "视频",
		"audio":      "音频",
		"role":       "角色",
		"multi":      "多模态",
		"embeddings": "向量",
		"workflow":   "工作流",
	}
	order := []string{"text", "image", "video", "audio", "role", "multi", "embeddings", "workflow"}
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

func findFlowByID(flows map[string]teammodel.Flow, id uint64) teammodel.Flow {
	for _, flow := range flows {
		if flow.ID == id {
			return flow
		}
	}
	return teammodel.Flow{}
}

func findFlowNodeByID(nodes map[string]teammodel.FlowNode, id uint64) teammodel.FlowNode {
	for _, node := range nodes {
		if node.ID == id {
			return node
		}
	}
	return teammodel.FlowNode{}
}
