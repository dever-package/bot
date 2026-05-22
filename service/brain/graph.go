package brain

import (
	"context"
	"encoding/json"
	"fmt"
	"sort"
	"strings"

	brainmodel "my/package/bot/model/brain"
)

func (s Service) Workspace(ctx context.Context, brainID uint64) (map[string]any, error) {
	brain, err := s.repo.FindBrain(ctx, brainID)
	if err != nil {
		return nil, err
	}
	thinks := s.repo.ListThinks(ctx, brainID, true)
	thinkEdges := s.repo.ListThinkEdges(ctx, brainID, true)
	flowNodesByThink := map[string]any{}
	flowEdgesByThink := map[string]any{}
	createPowersByThink := map[string]any{}
	for _, think := range thinks {
		if normalizeThinkType(think.Type) == brainmodel.ThinkTypeCreate {
			createPowersByThink[think.Key] = createPowerPayloads(s.repo.ListThinkCreatePowers(ctx, think.ID, true))
			continue
		}
		nodes := s.repo.ListFlowNodes(ctx, think.ID, true)
		edges := s.repo.ListFlowNodeEdges(ctx, think.ID, true)
		flowNodesByThink[think.Key] = flowNodePayloads(nodes)
		flowEdgesByThink[think.Key] = flowNodeEdgePayloads(nodes, edges)
	}
	powers := s.repo.ListPowers(ctx)
	return map[string]any{
		"brain":                  brainWorkspacePayload(brain),
		"thinks":                 thinkPayloads(thinks),
		"think_edges":            thinkEdgePayloads(thinks, thinkEdges),
		"flow_nodes_by_think":    flowNodesByThink,
		"flow_edges_by_think":    flowEdgesByThink,
		"nodes_by_think":         flowNodesByThink,
		"edges_by_think":         flowEdgesByThink,
		"create_powers_by_think": createPowersByThink,
		"agents":                 s.repo.ListAgents(ctx),
		"agent_cates":            s.repo.ListAgentCates(ctx),
		"powers":                 powers,
		"power_kinds":            powerKindOptions(powers),
		"node_types":             nodeTypes(),
		"edge_conditions":        edgeConditions(),
	}, nil
}

func (s Service) SaveThinkGraph(ctx context.Context, brainID uint64, body map[string]any) (map[string]any, error) {
	if _, err := s.ensureBrainEditable(ctx, brainID); err != nil {
		return nil, err
	}
	payloads := parseGraphThinks(body["thinks"])
	keepThinkKeys := map[string]bool{}
	thinkByKey := map[string]brainmodel.Think{}
	for index, payload := range payloads {
		if payload.Sort == 0 {
			payload.Sort = (index + 1) * 10
		}
		row, err := s.repo.UpsertThink(ctx, brainID, payload)
		if err != nil {
			return nil, err
		}
		keepThinkKeys[row.Key] = true
		thinkByKey[row.Key] = row
	}
	s.repo.DisableMissingThinks(ctx, brainID, keepThinkKeys)

	edgePayloads := parseGraphThinkEdges(body["edges"])
	keepEdgeKeys := map[string]bool{}
	for index, payload := range edgePayloads {
		from := thinkByKey[payload.FromKey]
		to := thinkByKey[payload.ToKey]
		if from.ID == 0 {
			from = findThinkByID(thinkByKey, payload.FromThinkID)
		}
		if to.ID == 0 {
			to = findThinkByID(thinkByKey, payload.ToThinkID)
		}
		if from.ID == 0 || to.ID == 0 {
			return nil, fmt.Errorf("思维关系引用不存在")
		}
		if payload.Sort == 0 {
			payload.Sort = (index + 1) * 10
		}
		if err := s.repo.UpsertThinkEdge(ctx, brainID, from.ID, to.ID, payload); err != nil {
			return nil, err
		}
		keepEdgeKeys[edgeKey(from.ID, to.ID)] = true
	}
	s.repo.DisableMissingThinkEdges(ctx, brainID, keepEdgeKeys)

	return s.Workspace(ctx, brainID)
}

func (s Service) SaveFlowGraph(ctx context.Context, thinkID uint64, body map[string]any) (map[string]any, error) {
	think, err := s.repo.FindThink(ctx, thinkID)
	if err != nil {
		return nil, err
	}
	if _, err := s.ensureBrainEditable(ctx, think.BrainID); err != nil {
		return nil, err
	}
	if normalizeThinkType(think.Type) != brainmodel.ThinkTypeFlow {
		return nil, fmt.Errorf("创作不使用流程节点")
	}
	payloads := parseGraphFlowNodes(body["nodes"])
	keepNodeKeys := map[string]bool{}
	nodeByKey := map[string]brainmodel.ThinkFlowNode{}
	for index, payload := range payloads {
		if payload.Sort == 0 {
			payload.Sort = (index + 1) * 10
		}
		row, err := s.repo.UpsertFlowNode(ctx, think.BrainID, think.ID, payload)
		if err != nil {
			return nil, err
		}
		keepNodeKeys[row.NodeKey] = true
		nodeByKey[row.NodeKey] = row
	}
	s.repo.DisableMissingFlowNodes(ctx, think.ID, keepNodeKeys)

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
		if err := s.repo.UpsertFlowNodeEdge(ctx, think.BrainID, think.ID, from.ID, to.ID, payload); err != nil {
			return nil, err
		}
		keepEdgeKeys[edgeKey(from.ID, to.ID)] = true
	}
	s.repo.DisableMissingFlowNodeEdges(ctx, think.ID, keepEdgeKeys)

	return s.Workspace(ctx, think.BrainID)
}

func (s Service) SaveCreateConfig(ctx context.Context, thinkID uint64, body map[string]any) (map[string]any, error) {
	think, err := s.repo.FindThink(ctx, thinkID)
	if err != nil {
		return nil, err
	}
	if _, err := s.ensureBrainEditable(ctx, think.BrainID); err != nil {
		return nil, err
	}
	if normalizeThinkType(think.Type) != brainmodel.ThinkTypeCreate {
		return nil, fmt.Errorf("流程不使用创作能力配置")
	}
	config := jsonMap(think.Config)
	for key, value := range mapValue(body["config"]) {
		config[key] = value
	}
	for _, key := range []string{"default_agent_id", "defaultAgentId", "agent_id", "agentId"} {
		if _, exists := body[key]; exists {
			config["default_agent_id"] = uint64Value(body[key])
			break
		}
	}
	s.repo.UpdateThinkConfig(ctx, think.ID, config)
	powerPayloads := parseGraphThinkCreatePowers(firstPresent(body, "create_powers", "powers"))
	if err := s.repo.ReplaceThinkCreatePowers(ctx, think.BrainID, think.ID, powerPayloads); err != nil {
		return nil, err
	}
	return s.Workspace(ctx, think.BrainID)
}

func (s Service) PublishBrain(ctx context.Context, brainID uint64) (map[string]any, error) {
	brain, err := s.repo.FindBrain(ctx, brainID)
	if err != nil {
		return nil, err
	}
	if normalizeBrainPublishStatus(brain.PublishStatus) == brainmodel.BrainPublishStatusPublished {
		return nil, fmt.Errorf("大脑已发布，请先进入编辑草稿后再重新发布")
	}
	snapshot, err := s.buildBrainReleaseSnapshot(ctx, brain)
	if err != nil {
		return nil, err
	}
	payload, err := json.Marshal(snapshot)
	if err != nil {
		return nil, fmt.Errorf("生成发布快照失败: %w", err)
	}
	version := brain.ReleaseVersion + 1
	releaseID := s.repo.InsertBrainRelease(ctx, map[string]any{
		"brain_id": brain.ID,
		"version":  version,
		"snapshot": string(payload),
		"status":   brainmodel.BrainReleaseStatusCurrent,
	})
	if releaseID == 0 {
		return nil, fmt.Errorf("创建发布版本失败")
	}
	s.repo.UpdateBrain(ctx, brain.ID, map[string]any{
		"publish_status":     brainmodel.BrainPublishStatusPublished,
		"current_release_id": releaseID,
		"release_version":    version,
	})
	s.repo.ArchiveOtherBrainReleases(ctx, brain.ID, releaseID)
	return s.Workspace(ctx, brain.ID)
}

func (s Service) EditBrainDraft(ctx context.Context, brainID uint64) (map[string]any, error) {
	brain, err := s.repo.FindBrain(ctx, brainID)
	if err != nil {
		return nil, err
	}
	if normalizeBrainPublishStatus(brain.PublishStatus) == brainmodel.BrainPublishStatusPublished {
		s.repo.UpdateBrain(ctx, brain.ID, map[string]any{
			"publish_status": brainmodel.BrainPublishStatusEditing,
		})
	}
	return s.Workspace(ctx, brain.ID)
}

func (s Service) ensureBrainEditable(ctx context.Context, brainID uint64) (brainmodel.Brain, error) {
	brain, err := s.repo.FindBrain(ctx, brainID)
	if err != nil {
		return brainmodel.Brain{}, err
	}
	if normalizeBrainPublishStatus(brain.PublishStatus) == brainmodel.BrainPublishStatusPublished {
		return brainmodel.Brain{}, fmt.Errorf("大脑已发布，请先进入编辑草稿后再修改")
	}
	return brain, nil
}

func (s Service) buildBrainReleaseSnapshot(ctx context.Context, brain brainmodel.Brain) (BrainReleaseSnapshot, error) {
	thinks := s.repo.ListThinks(ctx, brain.ID, true)
	thinkEdges := s.repo.ListThinkEdges(ctx, brain.ID, true)
	if issues := validateThinkGraph(thinks, thinkEdges); len(issues) > 0 {
		return BrainReleaseSnapshot{}, fmt.Errorf("发布前请先修正思维图: %s", strings.Join(issues, "；"))
	}
	flowNodesByThink := map[string][]GraphFlowNode{}
	flowEdgesByThink := map[string][]GraphFlowNodeEdge{}
	createPowersByThink := map[string][]GraphThinkCreatePower{}
	for _, think := range thinks {
		if normalizeThinkType(think.Type) == brainmodel.ThinkTypeCreate {
			createPowersByThink[think.Key] = createPowerPayloads(s.repo.ListThinkCreatePowers(ctx, think.ID, true))
			continue
		}
		nodes := s.repo.ListFlowNodes(ctx, think.ID, true)
		edges := s.repo.ListFlowNodeEdges(ctx, think.ID, true)
		if issues := validateFlowGraph(nodes, edges); len(issues) > 0 {
			return BrainReleaseSnapshot{}, fmt.Errorf("发布前请先修正思维「%s」的流程图: %s", think.Name, strings.Join(issues, "；"))
		}
		flowNodesByThink[think.Key] = flowNodePayloads(nodes)
		flowEdgesByThink[think.Key] = flowNodeEdgePayloads(nodes, edges)
	}
	return BrainReleaseSnapshot{
		Brain:               brainReleasePayload(brain),
		Thinks:              thinkPayloads(thinks),
		ThinkEdges:          thinkEdgePayloads(thinks, thinkEdges),
		FlowNodesByThink:    flowNodesByThink,
		FlowEdgesByThink:    flowEdgesByThink,
		CreatePowersByThink: createPowersByThink,
	}, nil
}

func brainWorkspacePayload(brain brainmodel.Brain) map[string]any {
	publishStatus := normalizeBrainPublishStatus(brain.PublishStatus)
	return map[string]any{
		"id":                 brain.ID,
		"name":               brain.Name,
		"key":                brain.Key,
		"description":        brain.Description,
		"persona":            brain.Persona,
		"goal":               brain.Goal,
		"config":             jsonMap(brain.Config),
		"status":             brain.Status,
		"publish_status":     publishStatus,
		"current_release_id": brain.CurrentReleaseID,
		"release_version":    brain.ReleaseVersion,
		"readonly":           publishStatus == brainmodel.BrainPublishStatusPublished,
		"sort":               brain.Sort,
	}
}

func brainReleasePayload(brain brainmodel.Brain) GraphBrain {
	return GraphBrain{
		ID:          brain.ID,
		Name:        brain.Name,
		Key:         brain.Key,
		Description: brain.Description,
		Persona:     brain.Persona,
		Goal:        brain.Goal,
		Config:      jsonMap(brain.Config),
		Status:      brain.Status,
		Sort:        brain.Sort,
	}
}

func thinkPayloads(thinks []brainmodel.Think) []GraphThink {
	result := make([]GraphThink, 0, len(thinks))
	for _, think := range thinks {
		result = append(result, GraphThink{
			ID:           think.ID,
			Name:         think.Name,
			Key:          think.Key,
			Type:         normalizeThinkType(think.Type),
			Goal:         think.Goal,
			InputSchema:  jsonMap(think.InputSchema),
			OutputSchema: jsonMap(think.OutputSchema),
			Position:     jsonMap(think.Position),
			Config:       jsonMap(think.Config),
			Status:       think.Status,
			Sort:         think.Sort,
		})
	}
	return result
}

func thinkEdgePayloads(thinks []brainmodel.Think, edges []brainmodel.ThinkEdge) []GraphThinkEdge {
	thinkByID := map[uint64]brainmodel.Think{}
	for _, think := range thinks {
		thinkByID[think.ID] = think
	}
	result := make([]GraphThinkEdge, 0, len(edges))
	for _, edge := range edges {
		from := thinkByID[edge.FromThinkID]
		to := thinkByID[edge.ToThinkID]
		result = append(result, GraphThinkEdge{
			ID:           edge.ID,
			FromThinkID:  edge.FromThinkID,
			ToThinkID:    edge.ToThinkID,
			FromKey:      from.Key,
			ToKey:        to.Key,
			Condition:    edge.Condition,
			InputMapping: jsonMap(edge.InputMapping),
			Config:       jsonMap(edge.Config),
			Status:       edge.Status,
			Sort:         edge.Sort,
		})
	}
	return result
}

func flowNodePayloads(nodes []brainmodel.ThinkFlowNode) []GraphFlowNode {
	result := make([]GraphFlowNode, 0, len(nodes))
	for _, node := range nodes {
		result = append(result, GraphFlowNode{
			ID:       node.ID,
			NodeKey:  node.NodeKey,
			Name:     node.Name,
			Type:     node.Type,
			AgentID:  node.AgentID,
			Config:   jsonMap(node.Config),
			Position: jsonMap(node.Position),
			Status:   node.Status,
			Sort:     node.Sort,
		})
	}
	return result
}

func flowNodeEdgePayloads(nodes []brainmodel.ThinkFlowNode, edges []brainmodel.ThinkFlowNodeEdge) []GraphFlowNodeEdge {
	nodeByID := map[uint64]brainmodel.ThinkFlowNode{}
	for _, node := range nodes {
		nodeByID[node.ID] = node
	}
	result := make([]GraphFlowNodeEdge, 0, len(edges))
	for _, edge := range edges {
		from := nodeByID[edge.FromNodeID]
		to := nodeByID[edge.ToNodeID]
		result = append(result, GraphFlowNodeEdge{
			ID:           edge.ID,
			FromNodeID:   edge.FromNodeID,
			ToNodeID:     edge.ToNodeID,
			FromKey:      from.NodeKey,
			ToKey:        to.NodeKey,
			Condition:    edge.Condition,
			InputMapping: jsonMap(edge.InputMapping),
			Config:       jsonMap(edge.Config),
			Status:       edge.Status,
			Sort:         edge.Sort,
		})
	}
	return result
}

func createPowerPayloads(powers []brainmodel.ThinkCreatePower) []GraphThinkCreatePower {
	result := make([]GraphThinkCreatePower, 0, len(powers))
	for _, power := range powers {
		result = append(result, GraphThinkCreatePower{
			ID:      power.ID,
			Kind:    power.Kind,
			PowerID: power.PowerID,
			Status:  power.Status,
			Sort:    power.Sort,
		})
	}
	return result
}

func nodeTypes() []map[string]any {
	return []map[string]any{
		{"id": brainmodel.NodeTypeAgent, "value": "智能体"},
		{"id": brainmodel.NodeTypePower, "value": "能力"},
		{"id": brainmodel.NodeTypeCondition, "value": "条件"},
		{"id": brainmodel.NodeTypeMerge, "value": "合并"},
		{"id": brainmodel.NodeTypeHumanApproval, "value": "人工确认"},
		{"id": brainmodel.NodeTypeSave, "value": "保存"},
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

func parseGraphThinks(raw any) []GraphThink {
	rows := sliceMapValue(raw)
	result := make([]GraphThink, 0, len(rows))
	for _, row := range rows {
		result = append(result, GraphThink{
			ID:           uint64Value(row["id"]),
			Name:         textValue(row["name"]),
			Key:          normalizeKey("think", row["key"]),
			Type:         normalizeThinkType(row["type"]),
			Goal:         textValue(row["goal"]),
			InputSchema:  mapValue(row["input_schema"]),
			OutputSchema: mapValue(row["output_schema"]),
			Position:     mapValue(row["position"]),
			Config:       mapValue(row["config"]),
			Status:       int16Value(row["status"], brainmodel.StatusEnabled),
			Sort:         intValue(row["sort"], 100),
		})
	}
	return result
}

func normalizeThinkType(raw any) string {
	switch strings.ToLower(textValue(raw)) {
	case brainmodel.ThinkTypeCreate, "创作", "free_create", "自由创作":
		return brainmodel.ThinkTypeCreate
	default:
		return brainmodel.ThinkTypeFlow
	}
}

func normalizeBrainPublishStatus(raw any) string {
	switch strings.ToLower(textValue(raw)) {
	case brainmodel.BrainPublishStatusPublished, "已发布", "发布":
		return brainmodel.BrainPublishStatusPublished
	case brainmodel.BrainPublishStatusEditing, "编辑草稿", "editing_draft":
		return brainmodel.BrainPublishStatusEditing
	default:
		return brainmodel.BrainPublishStatusDraft
	}
}

func parseGraphThinkEdges(raw any) []GraphThinkEdge {
	rows := sliceMapValue(raw)
	result := make([]GraphThinkEdge, 0, len(rows))
	for _, row := range rows {
		result = append(result, GraphThinkEdge{
			ID:           uint64Value(row["id"]),
			FromThinkID:  uint64Value(row["from_think_id"]),
			ToThinkID:    uint64Value(row["to_think_id"]),
			FromKey:      textValue(row["from_key"]),
			ToKey:        textValue(row["to_key"]),
			Condition:    firstText(row["condition"], "completed"),
			InputMapping: mapValue(row["input_mapping"]),
			Config:       mapValue(row["config"]),
			Status:       int16Value(row["status"], brainmodel.StatusEnabled),
			Sort:         intValue(row["sort"], 100),
		})
	}
	return result
}

func parseGraphFlowNodes(raw any) []GraphFlowNode {
	rows := sliceMapValue(raw)
	result := make([]GraphFlowNode, 0, len(rows))
	for _, row := range rows {
		result = append(result, GraphFlowNode{
			ID:       uint64Value(row["id"]),
			NodeKey:  normalizeKey("node", row["node_key"]),
			Name:     textValue(row["name"]),
			Type:     firstText(row["type"], brainmodel.NodeTypeAgent),
			AgentID:  uint64Value(row["agent_id"]),
			Config:   mapValue(row["config"]),
			Position: mapValue(row["position"]),
			Status:   int16Value(row["status"], brainmodel.StatusEnabled),
			Sort:     intValue(row["sort"], 100),
		})
	}
	return result
}

func parseGraphFlowNodeEdges(raw any) []GraphFlowNodeEdge {
	rows := sliceMapValue(raw)
	result := make([]GraphFlowNodeEdge, 0, len(rows))
	for _, row := range rows {
		result = append(result, GraphFlowNodeEdge{
			ID:           uint64Value(row["id"]),
			FromNodeID:   uint64Value(row["from_node_id"]),
			ToNodeID:     uint64Value(row["to_node_id"]),
			FromKey:      textValue(row["from_key"]),
			ToKey:        textValue(row["to_key"]),
			Condition:    firstText(row["condition"], "always"),
			InputMapping: mapValue(row["input_mapping"]),
			Config:       mapValue(row["config"]),
			Status:       int16Value(row["status"], brainmodel.StatusEnabled),
			Sort:         intValue(row["sort"], 100),
		})
	}
	return result
}

func parseGraphThinkCreatePowers(raw any) []GraphThinkCreatePower {
	rows := sliceMapValue(raw)
	result := make([]GraphThinkCreatePower, 0, len(rows))
	for _, row := range rows {
		result = append(result, GraphThinkCreatePower{
			ID:      uint64Value(row["id"]),
			Kind:    textValue(row["kind"]),
			PowerID: uint64Value(firstPresent(row, "power_id", "powerId", "id")),
			Status:  int16Value(row["status"], brainmodel.StatusEnabled),
			Sort:    intValue(row["sort"], 100),
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

func findThinkByID(thinks map[string]brainmodel.Think, id uint64) brainmodel.Think {
	for _, think := range thinks {
		if think.ID == id {
			return think
		}
	}
	return brainmodel.Think{}
}

func findFlowNodeByID(nodes map[string]brainmodel.ThinkFlowNode, id uint64) brainmodel.ThinkFlowNode {
	for _, node := range nodes {
		if node.ID == id {
			return node
		}
	}
	return brainmodel.ThinkFlowNode{}
}
