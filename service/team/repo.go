package team

import (
	"context"
	"fmt"
	"hash/fnv"
	"sort"
	"strings"
	"time"

	agentmodel "my/package/bot/model/agent"
	energonmodel "my/package/bot/model/energon"
	teammodel "my/package/bot/model/team"
)

type Repo struct{}

func NewRepo() Repo {
	return Repo{}
}

func (Repo) FindTeam(ctx context.Context, id uint64) (teammodel.Team, error) {
	if id == 0 {
		return teammodel.Team{}, fmt.Errorf("团队不能为空")
	}
	row := teammodel.NewTeamModel().Find(ctx, map[string]any{"id": id})
	if row == nil {
		return teammodel.Team{}, fmt.Errorf("团队不存在")
	}
	if row.Status != teammodel.StatusEnabled {
		return teammodel.Team{}, fmt.Errorf("团队已停用: %s", row.Name)
	}
	return *row, nil
}

func (Repo) UpdateTeam(ctx context.Context, id uint64, record map[string]any) {
	if id == 0 || len(record) == 0 {
		return
	}
	teammodel.NewTeamModel().Update(ctx, map[string]any{"id": id}, record)
}

func (Repo) FindFlow(ctx context.Context, id uint64) (teammodel.Flow, error) {
	if id == 0 {
		return teammodel.Flow{}, fmt.Errorf("工作流不能为空")
	}
	row := teammodel.NewFlowModel().Find(ctx, map[string]any{"id": id})
	if row == nil {
		return teammodel.Flow{}, fmt.Errorf("工作流不存在")
	}
	if row.Status != teammodel.StatusEnabled {
		return teammodel.Flow{}, fmt.Errorf("工作流已停用: %s", row.Name)
	}
	return *row, nil
}

func (Repo) ListFlows(ctx context.Context, teamID uint64, enabledOnly bool) []teammodel.Flow {
	filter := map[string]any{"team_id": teamID}
	if enabledOnly {
		filter["status"] = teammodel.StatusEnabled
	}
	rows := teammodel.NewFlowModel().Select(ctx, filter)
	result := make([]teammodel.Flow, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	sort.SliceStable(result, func(i, j int) bool {
		if result[i].Sort == result[j].Sort {
			return result[i].ID < result[j].ID
		}
		return result[i].Sort < result[j].Sort
	})
	return result
}

func (Repo) ListFlowsByIDs(ctx context.Context, ids []uint64) []teammodel.Flow {
	values := uint64FilterValues(ids)
	if len(values) == 0 {
		return []teammodel.Flow{}
	}
	rows := teammodel.NewFlowModel().Select(ctx, map[string]any{"id": values})
	result := make([]teammodel.Flow, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (Repo) ListFlowNodesByIDs(ctx context.Context, ids []uint64) []teammodel.FlowNode {
	values := uint64FilterValues(ids)
	if len(values) == 0 {
		return []teammodel.FlowNode{}
	}
	rows := teammodel.NewFlowNodeModel().Select(ctx, map[string]any{"id": values})
	result := make([]teammodel.FlowNode, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (Repo) ListEnabledTeams(ctx context.Context) []teammodel.Team {
	rows := teammodel.NewTeamModel().Select(ctx, map[string]any{
		"status": teammodel.StatusEnabled,
	})
	result := make([]teammodel.Team, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		result = append(result, *row)
	}
	sort.SliceStable(result, func(i, j int) bool {
		if result[i].Sort == result[j].Sort {
			return result[i].ID < result[j].ID
		}
		return result[i].Sort < result[j].Sort
	})
	return result
}

func (Repo) ListRoles(ctx context.Context, teamID uint64, enabledOnly bool) []teammodel.Role {
	filter := map[string]any{"team_id": teamID}
	if enabledOnly {
		filter["status"] = teammodel.StatusEnabled
	}
	rows := teammodel.NewRoleModel().Select(ctx, filter)
	result := make([]teammodel.Role, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	sort.SliceStable(result, func(i, j int) bool {
		if result[i].RoleType == result[j].RoleType {
			if result[i].Sort == result[j].Sort {
				return result[i].ID < result[j].ID
			}
			return result[i].Sort < result[j].Sort
		}
		return roleTypeOrder(result[i].RoleType) < roleTypeOrder(result[j].RoleType)
	})
	return result
}

func (Repo) ListAssetCates(ctx context.Context, teamID uint64, enabledOnly bool) []teammodel.AssetCate {
	filter := map[string]any{"team_id": teamID}
	if enabledOnly {
		filter["status"] = teammodel.StatusEnabled
	}
	rows := teammodel.NewAssetCateModel().Select(ctx, filter)
	result := make([]teammodel.AssetCate, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	sort.SliceStable(result, func(i, j int) bool {
		if result[i].Sort == result[j].Sort {
			return result[i].ID < result[j].ID
		}
		return result[i].Sort < result[j].Sort
	})
	return result
}

func (Repo) FindRole(ctx context.Context, teamID uint64, roleID uint64, roleKey string) (*teammodel.Role, bool) {
	if teamID == 0 {
		return nil, false
	}
	model := teammodel.NewRoleModel()
	var row *teammodel.Role
	if roleID > 0 {
		row = model.Find(ctx, map[string]any{
			"id":      roleID,
			"team_id": teamID,
		})
	}
	roleKey = strings.TrimSpace(roleKey)
	if row == nil && roleKey != "" {
		row = model.Find(ctx, map[string]any{
			"team_id":  teamID,
			"role_key": roleKey,
		})
	}
	if row == nil || row.Status != teammodel.StatusEnabled {
		return nil, false
	}
	return row, true
}

func (Repo) FindDefaultRole(ctx context.Context, teamID uint64, roleType string) (*teammodel.Role, bool) {
	if teamID == 0 {
		return nil, false
	}
	roleType = normalizeRoleType(roleType)
	roles := teammodel.NewRoleModel().Select(ctx, map[string]any{
		"team_id":   teamID,
		"role_type": roleType,
		"status":    teammodel.StatusEnabled,
	})
	var first *teammodel.Role
	for _, role := range roles {
		if role == nil || role.Status != teammodel.StatusEnabled {
			continue
		}
		if roleSortBefore(role, first) {
			first = role
		}
	}
	if first == nil {
		return nil, false
	}
	return first, true
}

func (Repo) ListFlowEdges(ctx context.Context, teamID uint64, enabledOnly bool) []teammodel.FlowEdge {
	filter := map[string]any{"team_id": teamID}
	if enabledOnly {
		filter["status"] = teammodel.StatusEnabled
	}
	rows := teammodel.NewFlowEdgeModel().Select(ctx, filter)
	result := make([]teammodel.FlowEdge, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	sort.SliceStable(result, func(i, j int) bool {
		if result[i].Sort == result[j].Sort {
			return result[i].ID < result[j].ID
		}
		return result[i].Sort < result[j].Sort
	})
	return result
}

func (Repo) ListFlowNodes(ctx context.Context, flowID uint64, enabledOnly bool) []teammodel.FlowNode {
	filter := map[string]any{"flow_id": flowID}
	if enabledOnly {
		filter["status"] = teammodel.StatusEnabled
	}
	rows := teammodel.NewFlowNodeModel().Select(ctx, filter)
	result := make([]teammodel.FlowNode, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	sort.SliceStable(result, func(i, j int) bool {
		if result[i].Sort == result[j].Sort {
			return result[i].ID < result[j].ID
		}
		return result[i].Sort < result[j].Sort
	})
	return result
}

func (Repo) ListFlowNodeEdges(ctx context.Context, flowID uint64, enabledOnly bool) []teammodel.FlowNodeEdge {
	filter := map[string]any{"flow_id": flowID}
	if enabledOnly {
		filter["status"] = teammodel.StatusEnabled
	}
	rows := teammodel.NewFlowNodeEdgeModel().Select(ctx, filter)
	result := make([]teammodel.FlowNodeEdge, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	sort.SliceStable(result, func(i, j int) bool {
		if result[i].Sort == result[j].Sort {
			return result[i].ID < result[j].ID
		}
		return result[i].Sort < result[j].Sort
	})
	return result
}

func (Repo) ListAgents(ctx context.Context) []AgentOption {
	rows := agentmodel.NewAgentModel().Select(ctx, map[string]any{
		"status": teammodel.StatusEnabled,
	})
	result := make([]AgentOption, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		result = append(result, AgentOption{
			ID:     row.ID,
			CateID: row.CateID,
			Name:   strings.TrimSpace(row.Name),
			Key:    strings.TrimSpace(row.Key),
		})
	}
	sort.SliceStable(result, func(i, j int) bool {
		if result[i].CateID == result[j].CateID {
			return result[i].ID < result[j].ID
		}
		return result[i].CateID < result[j].CateID
	})
	return result
}

func (Repo) ListAgentCates(ctx context.Context) []AgentCateOption {
	rows := agentmodel.NewAgentCateModel().Select(ctx, map[string]any{})
	result := make([]AgentCateOption, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		result = append(result, AgentCateOption{
			ID:    row.ID,
			Value: strings.TrimSpace(row.Name),
		})
	}
	sort.SliceStable(result, func(i, j int) bool {
		return result[i].ID < result[j].ID
	})
	return result
}

func (Repo) ListPowers(ctx context.Context) []PowerOption {
	rows := energonmodel.NewPowerModel().Select(ctx, map[string]any{
		"status": teammodel.StatusEnabled,
	})
	result := make([]PowerOption, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		result = append(result, PowerOption{
			ID:     row.ID,
			CateID: row.CateID,
			Name:   strings.TrimSpace(row.Name),
			Key:    strings.TrimSpace(row.Key),
			Icon:   strings.TrimSpace(row.Icon),
			Kind:   strings.TrimSpace(row.Kind),
		})
	}
	sort.SliceStable(result, func(i, j int) bool {
		if result[i].Kind == result[j].Kind {
			return result[i].ID < result[j].ID
		}
		return result[i].Kind < result[j].Kind
	})
	return result
}

func (r Repo) FindPowerOption(ctx context.Context, powerID uint64, powerKey string) (PowerOption, bool) {
	powerKey = strings.TrimSpace(powerKey)
	for _, row := range r.ListPowers(ctx) {
		if powerID > 0 && row.ID == powerID {
			return row, true
		}
		if powerKey != "" && row.Key == powerKey {
			return row, true
		}
	}
	return PowerOption{}, false
}

func (Repo) UpdateFlowConfig(ctx context.Context, flowID uint64, config map[string]any) {
	if flowID == 0 {
		return
	}
	teammodel.NewFlowModel().Update(ctx, map[string]any{"id": flowID}, map[string]any{
		"config": jsonText(config),
	})
}

func (Repo) UpsertFlow(ctx context.Context, teamID uint64, payload GraphFlow) (teammodel.Flow, error) {
	key := normalizeKey("flow", payload.Key)
	name := strings.TrimSpace(payload.Name)
	if name == "" {
		name = key
	}
	model := teammodel.NewFlowModel()
	row := model.Find(ctx, map[string]any{"team_id": teamID, "key": key})
	now := time.Now()
	record := map[string]any{
		"team_id":  teamID,
		"name":     name,
		"key":      key,
		"goal":     strings.TrimSpace(payload.Goal),
		"position": jsonText(payload.Position),
		"config":   jsonText(payload.Config),
		"status":   normalizedStatus(payload.Status),
		"sort":     payload.Sort,
	}
	if row == nil && payload.ID > 0 {
		row = model.Find(ctx, map[string]any{"id": payload.ID, "team_id": teamID})
	}
	if row == nil {
		record["created_at"] = now
		id := uint64(model.Insert(ctx, record))
		if id == 0 {
			return teammodel.Flow{}, fmt.Errorf("创建工作流失败")
		}
		created := model.Find(ctx, map[string]any{"id": id})
		if created == nil {
			return teammodel.Flow{}, fmt.Errorf("读取新工作流失败")
		}
		return *created, nil
	}
	model.Update(ctx, map[string]any{"id": row.ID}, record)
	updated := model.Find(ctx, map[string]any{"id": row.ID})
	if updated == nil {
		return teammodel.Flow{}, fmt.Errorf("读取工作流失败")
	}
	return *updated, nil
}

func (Repo) UpsertFlowEdge(ctx context.Context, teamID uint64, fromID uint64, toID uint64, payload GraphFlowEdge) error {
	if fromID == 0 || toID == 0 || fromID == toID {
		return nil
	}
	model := teammodel.NewFlowEdgeModel()
	row := model.Find(ctx, map[string]any{
		"team_id":      teamID,
		"from_flow_id": fromID,
		"to_flow_id":   toID,
	})
	now := time.Now()
	condition := strings.TrimSpace(payload.Condition)
	if condition == "" {
		condition = "completed"
	}
	record := map[string]any{
		"team_id":      teamID,
		"from_flow_id": fromID,
		"to_flow_id":   toID,
		"condition":    condition,
		"status":       normalizedStatus(payload.Status),
		"sort":         payload.Sort,
	}
	if row == nil {
		record["created_at"] = now
		if uint64(model.Insert(ctx, record)) == 0 {
			return fmt.Errorf("创建工作流关系失败")
		}
		return nil
	}
	model.Update(ctx, map[string]any{"id": row.ID}, record)
	return nil
}

func (Repo) UpsertFlowNode(ctx context.Context, teamID uint64, flowID uint64, payload GraphFlowNode) (teammodel.FlowNode, error) {
	key := normalizeKey("node", payload.NodeKey)
	name := strings.TrimSpace(payload.Name)
	if name == "" {
		name = key
	}
	nodeType := strings.TrimSpace(payload.Type)
	if nodeType == "" {
		nodeType = teammodel.NodeTypeAgent
	}
	model := teammodel.NewFlowNodeModel()
	row := model.Find(ctx, map[string]any{"flow_id": flowID, "node_key": key})
	now := time.Now()
	record := map[string]any{
		"team_id":       teamID,
		"flow_id":       flowID,
		"node_key":      key,
		"name":          name,
		"type":          nodeType,
		"role_id":       payload.RoleID,
		"role_key":      strings.TrimSpace(payload.RoleKey),
		"agent_id":      payload.AgentID,
		"power_id":      payload.PowerID,
		"sub_team_id":   payload.SubTeamID,
		"asset_cate_id": payload.AssetCateID,
		"config":        jsonText(payload.Config),
		"position":      jsonText(payload.Position),
		"status":        normalizedStatus(payload.Status),
		"sort":          payload.Sort,
	}
	if row == nil && payload.ID > 0 {
		row = model.Find(ctx, map[string]any{"id": payload.ID, "flow_id": flowID})
	}
	if row == nil {
		record["created_at"] = now
		id := uint64(model.Insert(ctx, record))
		if id == 0 {
			return teammodel.FlowNode{}, fmt.Errorf("创建节点失败")
		}
		created := model.Find(ctx, map[string]any{"id": id})
		if created == nil {
			return teammodel.FlowNode{}, fmt.Errorf("读取新节点失败")
		}
		return *created, nil
	}
	model.Update(ctx, map[string]any{"id": row.ID}, record)
	updated := model.Find(ctx, map[string]any{"id": row.ID})
	if updated == nil {
		return teammodel.FlowNode{}, fmt.Errorf("读取节点失败")
	}
	return *updated, nil
}

func (Repo) UpsertFlowNodeEdge(ctx context.Context, teamID uint64, flowID uint64, fromID uint64, toID uint64, payload GraphFlowNodeEdge) error {
	if fromID == 0 || toID == 0 || fromID == toID {
		return nil
	}
	model := teammodel.NewFlowNodeEdgeModel()
	row := model.Find(ctx, map[string]any{
		"flow_id":      flowID,
		"from_node_id": fromID,
		"to_node_id":   toID,
	})
	now := time.Now()
	condition := strings.TrimSpace(payload.Condition)
	if condition == "" {
		condition = "always"
	}
	record := map[string]any{
		"team_id":      teamID,
		"flow_id":      flowID,
		"from_node_id": fromID,
		"to_node_id":   toID,
		"condition":    condition,
		"status":       normalizedStatus(payload.Status),
		"sort":         payload.Sort,
	}
	if row == nil {
		record["created_at"] = now
		if uint64(model.Insert(ctx, record)) == 0 {
			return fmt.Errorf("创建节点关系失败")
		}
		return nil
	}
	model.Update(ctx, map[string]any{"id": row.ID}, record)
	return nil
}

func (Repo) DisableMissingFlows(ctx context.Context, teamID uint64, keepKeys map[string]bool) {
	model := teammodel.NewFlowModel()
	for _, row := range model.Select(ctx, map[string]any{"team_id": teamID}) {
		if row == nil || keepKeys[row.Key] {
			continue
		}
		model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{
			"status": teammodel.StatusDisabled,
		})
	}
}

func (Repo) DisableMissingFlowEdges(ctx context.Context, teamID uint64, keep map[string]bool) {
	model := teammodel.NewFlowEdgeModel()
	for _, row := range model.Select(ctx, map[string]any{"team_id": teamID}) {
		if row == nil {
			continue
		}
		key := edgeKey(row.FromFlowID, row.ToFlowID)
		if keep[key] {
			continue
		}
		model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{
			"status": teammodel.StatusDisabled,
		})
	}
}

func (Repo) DisableMissingFlowNodes(ctx context.Context, flowID uint64, keepKeys map[string]bool) {
	model := teammodel.NewFlowNodeModel()
	for _, row := range model.Select(ctx, map[string]any{"flow_id": flowID}) {
		if row == nil || keepKeys[row.NodeKey] {
			continue
		}
		model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{
			"status": teammodel.StatusDisabled,
		})
	}
}

func (Repo) DisableMissingFlowNodeEdges(ctx context.Context, flowID uint64, keep map[string]bool) {
	model := teammodel.NewFlowNodeEdgeModel()
	for _, row := range model.Select(ctx, map[string]any{"flow_id": flowID}) {
		if row == nil {
			continue
		}
		key := edgeKey(row.FromNodeID, row.ToNodeID)
		if keep[key] {
			continue
		}
		model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{
			"status": teammodel.StatusDisabled,
		})
	}
}

func normalizedStatus(status int16) int16 {
	if status == teammodel.StatusDisabled {
		return teammodel.StatusDisabled
	}
	return teammodel.StatusEnabled
}

func edgeKey(fromID uint64, toID uint64) string {
	return fmt.Sprintf("%d:%d", fromID, toID)
}

func stableNodeID(key string) uint64 {
	key = strings.TrimSpace(key)
	if key == "" {
		return uint64(time.Now().UnixNano())
	}
	hash := fnv.New64a()
	_, _ = hash.Write([]byte(key))
	value := hash.Sum64() & ((uint64(1) << 63) - 1)
	if value == 0 {
		return 1
	}
	return value
}

func (Repo) InsertRun(ctx context.Context, record map[string]any) uint64 {
	return uint64(teammodel.NewRunModel().Insert(ctx, record))
}

func (Repo) InsertTeamRelease(ctx context.Context, record map[string]any) uint64 {
	record["created_at"] = time.Now()
	return uint64(teammodel.NewTeamReleaseModel().Insert(ctx, record))
}

func (Repo) FindTeamRelease(ctx context.Context, id uint64) *teammodel.TeamRelease {
	if id == 0 {
		return nil
	}
	return teammodel.NewTeamReleaseModel().Find(ctx, map[string]any{"id": id})
}

func (Repo) FindCurrentTeamRelease(ctx context.Context, teamID uint64) *teammodel.TeamRelease {
	if teamID == 0 {
		return nil
	}
	return teammodel.NewTeamReleaseModel().Find(ctx, map[string]any{
		"team_id": teamID,
		"status":  teammodel.TeamReleaseStatusCurrent,
	})
}

func (Repo) ArchiveOtherTeamReleases(ctx context.Context, teamID uint64, keepID uint64) {
	if teamID == 0 || keepID == 0 {
		return
	}
	model := teammodel.NewTeamReleaseModel()
	rows := model.Select(ctx, map[string]any{
		"team_id": teamID,
		"status":  teammodel.TeamReleaseStatusCurrent,
	})
	for _, row := range rows {
		if row == nil || row.ID == keepID {
			continue
		}
		model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{
			"status": teammodel.TeamReleaseStatusArchive,
		})
	}
}

func (Repo) FindRun(ctx context.Context, id uint64) *teammodel.Run {
	if id == 0 {
		return nil
	}
	return teammodel.NewRunModel().Find(ctx, map[string]any{"id": id})
}

func (Repo) FindRunInProject(ctx context.Context, id uint64, projectID uint64) *teammodel.Run {
	if id == 0 || projectID == 0 {
		return nil
	}
	return teammodel.NewRunModel().Find(ctx, map[string]any{
		"id":         id,
		"project_id": projectID,
	})
}

func (Repo) FindRunByRequestID(ctx context.Context, requestID string) *teammodel.Run {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return nil
	}
	return teammodel.NewRunModel().Find(ctx, map[string]any{"request_id": requestID})
}

func (Repo) FindRunByRequestIDInProject(ctx context.Context, requestID string, projectID uint64) *teammodel.Run {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" || projectID == 0 {
		return nil
	}
	return teammodel.NewRunModel().Find(ctx, map[string]any{
		"request_id": requestID,
		"project_id": projectID,
	})
}

func (Repo) UpdateRun(ctx context.Context, id uint64, record map[string]any) {
	if id == 0 || len(record) == 0 {
		return
	}
	record["updated_at"] = time.Now()
	teammodel.NewRunModel().Update(ctx, map[string]any{"id": id}, record)
}

func (Repo) FindOrCreateFlowRun(ctx context.Context, run teammodel.Run, flow teammodel.Flow, input map[string]any) uint64 {
	model := teammodel.NewFlowRunModel()
	row := model.Find(ctx, map[string]any{"run_id": run.ID, "flow_id": flow.ID})
	if row != nil {
		return row.ID
	}
	now := time.Now()
	return uint64(model.Insert(ctx, map[string]any{
		"run_id":     run.ID,
		"request_id": run.RequestID,
		"project_id": run.ProjectID,
		"team_id":    run.TeamID,
		"flow_id":    flow.ID,
		"input":      jsonText(input),
		"output":     "{}",
		"error":      "",
		"status":     teammodel.RunStatusPending,
		"created_at": now,
		"updated_at": now,
	}))
}

func (Repo) FindFlowRun(ctx context.Context, id uint64) *teammodel.FlowRun {
	if id == 0 {
		return nil
	}
	return teammodel.NewFlowRunModel().Find(ctx, map[string]any{"id": id})
}

func (Repo) ListFlowRuns(ctx context.Context, runID uint64) []teammodel.FlowRun {
	rows := teammodel.NewFlowRunModel().Select(ctx, map[string]any{"run_id": runID})
	result := make([]teammodel.FlowRun, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (Repo) UpdateFlowRun(ctx context.Context, id uint64, record map[string]any) {
	if id == 0 || len(record) == 0 {
		return
	}
	record["updated_at"] = time.Now()
	teammodel.NewFlowRunModel().Update(ctx, map[string]any{"id": id}, record)
}

func (Repo) FindOrCreateNodeRun(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, node teammodel.FlowNode, input map[string]any) uint64 {
	model := teammodel.NewNodeRunModel()
	row := model.Find(ctx, map[string]any{"flow_run_id": flowRun.ID, "node_id": node.ID})
	if row != nil {
		return row.ID
	}
	now := time.Now()
	return uint64(model.Insert(ctx, map[string]any{
		"run_id":       run.ID,
		"flow_run_id":  flowRun.ID,
		"request_id":   run.RequestID,
		"project_id":   run.ProjectID,
		"team_id":      run.TeamID,
		"flow_id":      node.FlowID,
		"node_id":      node.ID,
		"node_key":     node.NodeKey,
		"node_type":    node.Type,
		"input":        jsonText(input),
		"output":       "{}",
		"error":        "",
		"status":       teammodel.RunStatusPending,
		"agent_run_id": 0,
		"created_at":   now,
		"updated_at":   now,
	}))
}

func (Repo) FindOrCreateDynamicNodeRun(ctx context.Context, run teammodel.Run, flowRun teammodel.FlowRun, flow teammodel.Flow, nodeID uint64, nodeKey string, nodeName string, nodeType string, input map[string]any) uint64 {
	if nodeID == 0 {
		nodeID = stableNodeID(nodeKey)
	}
	model := teammodel.NewNodeRunModel()
	row := model.Find(ctx, map[string]any{"flow_run_id": flowRun.ID, "node_id": nodeID})
	if row != nil {
		return row.ID
	}
	now := time.Now()
	return uint64(model.Insert(ctx, map[string]any{
		"run_id":       run.ID,
		"flow_run_id":  flowRun.ID,
		"request_id":   run.RequestID,
		"project_id":   run.ProjectID,
		"team_id":      run.TeamID,
		"flow_id":      flow.ID,
		"node_id":      nodeID,
		"node_key":     strings.TrimSpace(nodeKey),
		"node_type":    strings.TrimSpace(nodeType),
		"input":        jsonText(input),
		"output":       "{}",
		"error":        "",
		"status":       teammodel.RunStatusPending,
		"agent_run_id": 0,
		"created_at":   now,
		"updated_at":   now,
	}))
}

func (Repo) FindNodeRun(ctx context.Context, id uint64) *teammodel.NodeRun {
	if id == 0 {
		return nil
	}
	return teammodel.NewNodeRunModel().Find(ctx, map[string]any{"id": id})
}

func (Repo) FindNodeRunByNode(ctx context.Context, flowRunID uint64, nodeID uint64) *teammodel.NodeRun {
	if flowRunID == 0 || nodeID == 0 {
		return nil
	}
	return teammodel.NewNodeRunModel().Find(ctx, map[string]any{
		"flow_run_id": flowRunID,
		"node_id":     nodeID,
	})
}

func (Repo) ListNodeRuns(ctx context.Context, runID uint64) []teammodel.NodeRun {
	rows := teammodel.NewNodeRunModel().Select(ctx, map[string]any{"run_id": runID})
	result := make([]teammodel.NodeRun, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (Repo) UpdateNodeRun(ctx context.Context, id uint64, record map[string]any) {
	if id == 0 || len(record) == 0 {
		return
	}
	record["updated_at"] = time.Now()
	teammodel.NewNodeRunModel().Update(ctx, map[string]any{"id": id}, record)
}

func (Repo) UpsertBlackboard(ctx context.Context, record map[string]any) {
	flowRunID := uint64Value(record["flow_run_id"])
	key := strings.TrimSpace(textValue(record["key"]))
	if flowRunID == 0 || key == "" {
		return
	}
	model := teammodel.NewBlackboardModel()
	row := model.Find(ctx, map[string]any{"flow_run_id": flowRunID, "key": key})
	record["updated_at"] = time.Now()
	if row == nil {
		record["created_at"] = time.Now()
		model.Insert(ctx, record)
		return
	}
	model.Update(ctx, map[string]any{"id": row.ID}, record)
}

func (Repo) ListBlackboard(ctx context.Context, flowRunID uint64) map[string]any {
	rows := teammodel.NewBlackboardModel().Select(ctx, map[string]any{"flow_run_id": flowRunID})
	result := map[string]any{}
	for _, row := range rows {
		if row != nil {
			result[row.Key] = jsonValue(row.Value)
		}
	}
	return result
}

func (Repo) ListBlackboardRows(ctx context.Context, runID uint64) []teammodel.Blackboard {
	rows := teammodel.NewBlackboardModel().Select(ctx, map[string]any{"run_id": runID})
	result := make([]teammodel.Blackboard, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (Repo) InsertMessage(ctx context.Context, record map[string]any) {
	record["created_at"] = time.Now()
	teammodel.NewMessageModel().Insert(ctx, record)
}

func (Repo) ListMessages(ctx context.Context, runID uint64) []teammodel.Message {
	rows := teammodel.NewMessageModel().Select(ctx, map[string]any{"run_id": runID})
	result := make([]teammodel.Message, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (Repo) InsertApproval(ctx context.Context, record map[string]any) uint64 {
	now := time.Now()
	record["created_at"] = now
	record["updated_at"] = now
	return uint64(teammodel.NewApprovalModel().Insert(ctx, record))
}

func (Repo) FindApproval(ctx context.Context, id uint64) *teammodel.Approval {
	if id == 0 {
		return nil
	}
	return teammodel.NewApprovalModel().Find(ctx, map[string]any{"id": id})
}

func (Repo) FindPendingApprovalByNodeRun(ctx context.Context, nodeRunID uint64) *teammodel.Approval {
	if nodeRunID == 0 {
		return nil
	}
	return teammodel.NewApprovalModel().Find(ctx, map[string]any{
		"node_run_id": nodeRunID,
		"status":      teammodel.RunStatusPending,
	})
}

func (Repo) ListApprovals(ctx context.Context, runID uint64) []teammodel.Approval {
	rows := teammodel.NewApprovalModel().Select(ctx, map[string]any{"run_id": runID})
	result := make([]teammodel.Approval, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (Repo) UpdateApproval(ctx context.Context, id uint64, record map[string]any) {
	if id == 0 || len(record) == 0 {
		return
	}
	record["updated_at"] = time.Now()
	teammodel.NewApprovalModel().Update(ctx, map[string]any{"id": id}, record)
}

func uint64FilterValues(ids []uint64) []any {
	seen := map[uint64]struct{}{}
	values := make([]any, 0, len(ids))
	for _, id := range ids {
		if id == 0 {
			continue
		}
		if _, ok := seen[id]; ok {
			continue
		}
		seen[id] = struct{}{}
		values = append(values, id)
	}
	return values
}

func normalizeRoleType(roleType string) string {
	roleType = strings.ToLower(strings.TrimSpace(roleType))
	switch roleType {
	case teammodel.RoleTypeChat,
		teammodel.RoleTypePlanner,
		teammodel.RoleTypeWorker,
		teammodel.RoleTypeReviewer:
		return roleType
	default:
		return teammodel.RoleTypeWorker
	}
}

func roleTypeOrder(roleType string) int {
	switch normalizeRoleType(roleType) {
	case teammodel.RoleTypeChat:
		return 10
	case teammodel.RoleTypePlanner:
		return 20
	case teammodel.RoleTypeWorker:
		return 30
	case teammodel.RoleTypeReviewer:
		return 40
	default:
		return 100
	}
}

func roleSortBefore(candidate *teammodel.Role, current *teammodel.Role) bool {
	if candidate == nil {
		return false
	}
	if current == nil {
		return true
	}
	if candidate.Sort == current.Sort {
		return candidate.ID < current.ID
	}
	return candidate.Sort < current.Sort
}
