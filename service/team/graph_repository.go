package team

import (
	"context"
	"fmt"
	"sort"
	"strings"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
)

type flowGraphRows struct {
	nodesByFlowID     map[uint64][]teammodel.FlowNode
	nodeEdgesByFlowID map[uint64][]teammodel.FlowNodeEdge
}

type graphEdgeSync struct {
	fromID    uint64
	toID      uint64
	condition string
	status    int16
	sort      int
}

func (Repo) ListFlowGraphRows(ctx context.Context, flowIDs []uint64, enabledOnly bool) flowGraphRows {
	result := flowGraphRows{
		nodesByFlowID:     map[uint64][]teammodel.FlowNode{},
		nodeEdgesByFlowID: map[uint64][]teammodel.FlowNodeEdge{},
	}
	values := uint64FilterValues(flowIDs)
	if len(values) == 0 {
		return result
	}
	filter := map[string]any{"flow_id": values}
	if enabledOnly {
		filter["status"] = teammodel.StatusEnabled
	}
	for _, row := range teammodel.NewFlowNodeModel().Select(ctx, filter) {
		if row != nil {
			result.nodesByFlowID[row.FlowID] = append(result.nodesByFlowID[row.FlowID], *row)
		}
	}
	for _, row := range teammodel.NewFlowNodeEdgeModel().Select(ctx, filter) {
		if row != nil {
			result.nodeEdgesByFlowID[row.FlowID] = append(result.nodeEdgesByFlowID[row.FlowID], *row)
		}
	}
	for flowID := range result.nodesByFlowID {
		sortFlowNodes(result.nodesByFlowID[flowID])
	}
	for flowID := range result.nodeEdgesByFlowID {
		sortFlowNodeEdges(result.nodeEdgesByFlowID[flowID])
	}
	return result
}

func (Repo) SyncFlows(ctx context.Context, teamID uint64, payloads []GraphFlow) ([]teammodel.Flow, error) {
	model := teammodel.NewFlowModel()
	existing := collectFlows(model.Select(ctx, map[string]any{"team_id": teamID}))
	byKey := make(map[string]teammodel.Flow, len(existing))
	byID := make(map[uint64]teammodel.Flow, len(existing))
	for _, row := range existing {
		byKey[row.Key] = row
		byID[row.ID] = row
	}

	seenKeys := make(map[string]struct{}, len(payloads))
	matchedIDs := make(map[uint64]struct{}, len(payloads))
	result := make([]teammodel.Flow, 0, len(payloads))
	for index, payload := range payloads {
		key := normalizeKey("flow", payload.Key)
		if _, exists := seenKeys[key]; exists {
			return nil, fmt.Errorf("工作流标识重复: %s", key)
		}
		seenKeys[key] = struct{}{}
		if payload.Sort == 0 {
			payload.Sort = (index + 1) * 10
		}
		payload.Key = key
		record := flowRecord(teamID, payload)

		row, foundByKey := byKey[key]
		rowByID, foundByID := byID[payload.ID]
		if foundByKey && foundByID && row.ID != rowByID.ID {
			return nil, fmt.Errorf("工作流标识已被占用: %s", key)
		}
		if !foundByKey && foundByID {
			row = rowByID
			foundByKey = true
		}
		if foundByKey {
			if _, duplicated := matchedIDs[row.ID]; duplicated {
				return nil, fmt.Errorf("工作流重复提交: %s", key)
			}
			if flowNeedsUpdate(row, record) {
				if model.Update(ctx, map[string]any{"id": row.ID}, record) != 1 {
					return nil, fmt.Errorf("更新工作流失败: %s", key)
				}
			}
			row = applyFlowRecord(row, record)
			matchedIDs[row.ID] = struct{}{}
			result = append(result, row)
			continue
		}

		record["created_at"] = time.Now()
		id := uint64(model.Insert(ctx, record))
		if id == 0 {
			return nil, fmt.Errorf("创建工作流失败: %s", key)
		}
		row = applyFlowRecord(teammodel.Flow{ID: id}, record)
		matchedIDs[id] = struct{}{}
		result = append(result, row)
	}
	if err := disableMissingFlows(ctx, model, existing, matchedIDs); err != nil {
		return nil, err
	}
	sortFlows(result)
	return result, nil
}

func (Repo) SyncFlowEdges(ctx context.Context, teamID uint64, payloads []graphEdgeSync) error {
	model := teammodel.NewFlowEdgeModel()
	existing := collectFlowEdges(model.Select(ctx, map[string]any{"team_id": teamID}))
	byKey := make(map[string]teammodel.FlowEdge, len(existing))
	for _, row := range existing {
		byKey[edgeKey(row.FromFlowID, row.ToFlowID)] = row
	}
	keep := make(map[string]struct{}, len(payloads))
	for _, payload := range payloads {
		if payload.fromID == 0 || payload.toID == 0 || payload.fromID == payload.toID {
			continue
		}
		key := edgeKey(payload.fromID, payload.toID)
		if _, duplicated := keep[key]; duplicated {
			return fmt.Errorf("工作流关系重复")
		}
		keep[key] = struct{}{}
		record := flowEdgeRecord(teamID, payload)
		row, exists := byKey[key]
		if !exists {
			record["created_at"] = time.Now()
			if uint64(model.Insert(ctx, record)) == 0 {
				return fmt.Errorf("创建工作流关系失败")
			}
			continue
		}
		if flowEdgeNeedsUpdate(row, record) && model.Update(ctx, map[string]any{"id": row.ID}, record) != 1 {
			return fmt.Errorf("更新工作流关系失败")
		}
	}
	return disableMissingFlowEdges(ctx, model, existing, keep)
}

func (Repo) SyncFlowNodes(ctx context.Context, teamID uint64, flowID uint64, payloads []GraphFlowNode) ([]teammodel.FlowNode, error) {
	model := teammodel.NewFlowNodeModel()
	existing := collectFlowNodes(model.Select(ctx, map[string]any{"flow_id": flowID}))
	byKey := make(map[string]teammodel.FlowNode, len(existing))
	byID := make(map[uint64]teammodel.FlowNode, len(existing))
	for _, row := range existing {
		byKey[row.NodeKey] = row
		byID[row.ID] = row
	}

	seenKeys := make(map[string]struct{}, len(payloads))
	matchedIDs := make(map[uint64]struct{}, len(payloads))
	result := make([]teammodel.FlowNode, 0, len(payloads))
	for index, payload := range payloads {
		key := normalizeKey("node", payload.NodeKey)
		if _, exists := seenKeys[key]; exists {
			return nil, fmt.Errorf("节点标识重复: %s", key)
		}
		seenKeys[key] = struct{}{}
		if payload.Sort == 0 {
			payload.Sort = (index + 1) * 10
		}
		payload.NodeKey = key
		record := flowNodeRecord(teamID, flowID, payload)

		row, foundByKey := byKey[key]
		rowByID, foundByID := byID[payload.ID]
		if foundByKey && foundByID && row.ID != rowByID.ID {
			return nil, fmt.Errorf("节点标识已被占用: %s", key)
		}
		if !foundByKey && foundByID {
			row = rowByID
			foundByKey = true
		}
		if foundByKey {
			if _, duplicated := matchedIDs[row.ID]; duplicated {
				return nil, fmt.Errorf("节点重复提交: %s", key)
			}
			if flowNodeNeedsUpdate(row, record) {
				if model.Update(ctx, map[string]any{"id": row.ID}, record) != 1 {
					return nil, fmt.Errorf("更新节点失败: %s", key)
				}
			}
			row = applyFlowNodeRecord(row, record)
			matchedIDs[row.ID] = struct{}{}
			result = append(result, row)
			continue
		}

		record["created_at"] = time.Now()
		id := uint64(model.Insert(ctx, record))
		if id == 0 {
			return nil, fmt.Errorf("创建节点失败: %s", key)
		}
		row = applyFlowNodeRecord(teammodel.FlowNode{ID: id}, record)
		matchedIDs[id] = struct{}{}
		result = append(result, row)
	}
	if err := disableMissingFlowNodes(ctx, model, existing, matchedIDs); err != nil {
		return nil, err
	}
	sortFlowNodes(result)
	return result, nil
}

func (Repo) SyncFlowNodeEdges(ctx context.Context, teamID uint64, flowID uint64, payloads []graphEdgeSync) error {
	model := teammodel.NewFlowNodeEdgeModel()
	existing := collectFlowNodeEdges(model.Select(ctx, map[string]any{"flow_id": flowID}))
	byKey := make(map[string]teammodel.FlowNodeEdge, len(existing))
	for _, row := range existing {
		byKey[edgeKey(row.FromNodeID, row.ToNodeID)] = row
	}
	keep := make(map[string]struct{}, len(payloads))
	for _, payload := range payloads {
		if payload.fromID == 0 || payload.toID == 0 || payload.fromID == payload.toID {
			continue
		}
		key := edgeKey(payload.fromID, payload.toID)
		if _, duplicated := keep[key]; duplicated {
			return fmt.Errorf("节点关系重复")
		}
		keep[key] = struct{}{}
		record := flowNodeEdgeRecord(teamID, flowID, payload)
		row, exists := byKey[key]
		if !exists {
			record["created_at"] = time.Now()
			if uint64(model.Insert(ctx, record)) == 0 {
				return fmt.Errorf("创建节点关系失败")
			}
			continue
		}
		if flowNodeEdgeNeedsUpdate(row, record) && model.Update(ctx, map[string]any{"id": row.ID}, record) != 1 {
			return fmt.Errorf("更新节点关系失败")
		}
	}
	return disableMissingFlowNodeEdges(ctx, model, existing, keep)
}

func flowRecord(teamID uint64, payload GraphFlow) map[string]any {
	name := strings.TrimSpace(payload.Name)
	if name == "" {
		name = payload.Key
	}
	return map[string]any{
		"team_id":  teamID,
		"name":     name,
		"key":      payload.Key,
		"goal":     strings.TrimSpace(payload.Goal),
		"position": jsonText(payload.Position),
		"config":   jsonText(payload.Config),
		"status":   normalizedStatus(payload.Status),
		"sort":     payload.Sort,
	}
}

func flowNeedsUpdate(row teammodel.Flow, record map[string]any) bool {
	return row.TeamID != record["team_id"] || row.Name != record["name"] || row.Key != record["key"] || row.Goal != record["goal"] ||
		row.Position != record["position"] || row.Config != record["config"] || row.Status != record["status"] || row.Sort != record["sort"]
}

func applyFlowRecord(row teammodel.Flow, record map[string]any) teammodel.Flow {
	row.TeamID = record["team_id"].(uint64)
	row.Name = record["name"].(string)
	row.Key = record["key"].(string)
	row.Goal = record["goal"].(string)
	row.Position = record["position"].(string)
	row.Config = record["config"].(string)
	row.Status = record["status"].(int16)
	row.Sort = record["sort"].(int)
	return row
}

func flowEdgeRecord(teamID uint64, payload graphEdgeSync) map[string]any {
	condition := strings.TrimSpace(payload.condition)
	if condition == "" {
		condition = "completed"
	}
	return map[string]any{
		"team_id":      teamID,
		"from_flow_id": payload.fromID,
		"to_flow_id":   payload.toID,
		"condition":    condition,
		"status":       normalizedStatus(payload.status),
		"sort":         payload.sort,
	}
}

func flowEdgeNeedsUpdate(row teammodel.FlowEdge, record map[string]any) bool {
	return row.TeamID != record["team_id"] || row.FromFlowID != record["from_flow_id"] || row.ToFlowID != record["to_flow_id"] ||
		row.Condition != record["condition"] || row.Status != record["status"] || row.Sort != record["sort"]
}

func flowNodeRecord(teamID uint64, flowID uint64, payload GraphFlowNode) map[string]any {
	name := strings.TrimSpace(payload.Name)
	if name == "" {
		name = payload.NodeKey
	}
	nodeType := strings.TrimSpace(payload.Type)
	if nodeType == "" {
		nodeType = teammodel.NodeTypeAgent
	}
	return map[string]any{
		"team_id":       teamID,
		"flow_id":       flowID,
		"node_key":      payload.NodeKey,
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
}

func flowNodeNeedsUpdate(row teammodel.FlowNode, record map[string]any) bool {
	return row.TeamID != record["team_id"] || row.FlowID != record["flow_id"] || row.NodeKey != record["node_key"] ||
		row.Name != record["name"] || row.Type != record["type"] ||
		row.RoleID != record["role_id"] || row.RoleKey != record["role_key"] || row.AgentID != record["agent_id"] ||
		row.PowerID != record["power_id"] || row.SubTeamID != record["sub_team_id"] || row.AssetCateID != record["asset_cate_id"] ||
		row.Config != record["config"] || row.Position != record["position"] || row.Status != record["status"] || row.Sort != record["sort"]
}

func applyFlowNodeRecord(row teammodel.FlowNode, record map[string]any) teammodel.FlowNode {
	row.TeamID = record["team_id"].(uint64)
	row.FlowID = record["flow_id"].(uint64)
	row.NodeKey = record["node_key"].(string)
	row.Name = record["name"].(string)
	row.Type = record["type"].(string)
	row.RoleID = record["role_id"].(uint64)
	row.RoleKey = record["role_key"].(string)
	row.AgentID = record["agent_id"].(uint64)
	row.PowerID = record["power_id"].(uint64)
	row.SubTeamID = record["sub_team_id"].(uint64)
	row.AssetCateID = record["asset_cate_id"].(uint64)
	row.Config = record["config"].(string)
	row.Position = record["position"].(string)
	row.Status = record["status"].(int16)
	row.Sort = record["sort"].(int)
	return row
}

func flowNodeEdgeRecord(teamID uint64, flowID uint64, payload graphEdgeSync) map[string]any {
	condition := strings.TrimSpace(payload.condition)
	if condition == "" {
		condition = "always"
	}
	return map[string]any{
		"team_id":      teamID,
		"flow_id":      flowID,
		"from_node_id": payload.fromID,
		"to_node_id":   payload.toID,
		"condition":    condition,
		"status":       normalizedStatus(payload.status),
		"sort":         payload.sort,
	}
}

func flowNodeEdgeNeedsUpdate(row teammodel.FlowNodeEdge, record map[string]any) bool {
	return row.TeamID != record["team_id"] || row.FlowID != record["flow_id"] ||
		row.FromNodeID != record["from_node_id"] || row.ToNodeID != record["to_node_id"] ||
		row.Condition != record["condition"] || row.Status != record["status"] || row.Sort != record["sort"]
}

func disableMissingFlows(ctx context.Context, model interface {
	Update(context.Context, any, map[string]any, ...bool) int64
}, existing []teammodel.Flow, matched map[uint64]struct{}) error {
	ids := make([]uint64, 0)
	for _, row := range existing {
		if row.Status != teammodel.StatusEnabled {
			continue
		}
		if _, keep := matched[row.ID]; !keep {
			ids = append(ids, row.ID)
		}
	}
	return disableRows(ctx, model.Update, ids, "停用工作流失败")
}

func disableMissingFlowEdges(ctx context.Context, model interface {
	Update(context.Context, any, map[string]any, ...bool) int64
}, existing []teammodel.FlowEdge, keep map[string]struct{}) error {
	ids := make([]uint64, 0)
	for _, row := range existing {
		if row.Status != teammodel.StatusEnabled {
			continue
		}
		if _, exists := keep[edgeKey(row.FromFlowID, row.ToFlowID)]; !exists {
			ids = append(ids, row.ID)
		}
	}
	return disableRows(ctx, model.Update, ids, "停用工作流关系失败")
}

func disableMissingFlowNodes(ctx context.Context, model interface {
	Update(context.Context, any, map[string]any, ...bool) int64
}, existing []teammodel.FlowNode, matched map[uint64]struct{}) error {
	ids := make([]uint64, 0)
	for _, row := range existing {
		if row.Status != teammodel.StatusEnabled {
			continue
		}
		if _, keep := matched[row.ID]; !keep {
			ids = append(ids, row.ID)
		}
	}
	return disableRows(ctx, model.Update, ids, "停用节点失败")
}

func disableMissingFlowNodeEdges(ctx context.Context, model interface {
	Update(context.Context, any, map[string]any, ...bool) int64
}, existing []teammodel.FlowNodeEdge, keep map[string]struct{}) error {
	ids := make([]uint64, 0)
	for _, row := range existing {
		if row.Status != teammodel.StatusEnabled {
			continue
		}
		if _, exists := keep[edgeKey(row.FromNodeID, row.ToNodeID)]; !exists {
			ids = append(ids, row.ID)
		}
	}
	return disableRows(ctx, model.Update, ids, "停用节点关系失败")
}

func disableRows(
	ctx context.Context,
	update func(context.Context, any, map[string]any, ...bool) int64,
	ids []uint64,
	errorMessage string,
) error {
	values := uint64FilterValues(ids)
	if len(values) == 0 {
		return nil
	}
	if affected := update(ctx, map[string]any{"id": values}, map[string]any{"status": teammodel.StatusDisabled}); affected != int64(len(values)) {
		return fmt.Errorf("%s", errorMessage)
	}
	return nil
}

func collectFlows(rows []*teammodel.Flow) []teammodel.Flow {
	result := make([]teammodel.Flow, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func collectFlowEdges(rows []*teammodel.FlowEdge) []teammodel.FlowEdge {
	result := make([]teammodel.FlowEdge, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func collectFlowNodes(rows []*teammodel.FlowNode) []teammodel.FlowNode {
	result := make([]teammodel.FlowNode, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func collectFlowNodeEdges(rows []*teammodel.FlowNodeEdge) []teammodel.FlowNodeEdge {
	result := make([]teammodel.FlowNodeEdge, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func sortFlows(rows []teammodel.Flow) {
	sort.SliceStable(rows, func(i, j int) bool {
		if rows[i].Sort == rows[j].Sort {
			return rows[i].ID < rows[j].ID
		}
		return rows[i].Sort < rows[j].Sort
	})
}

func sortFlowNodes(rows []teammodel.FlowNode) {
	sort.SliceStable(rows, func(i, j int) bool {
		if rows[i].Sort == rows[j].Sort {
			return rows[i].ID < rows[j].ID
		}
		return rows[i].Sort < rows[j].Sort
	})
}

func sortFlowNodeEdges(rows []teammodel.FlowNodeEdge) {
	sort.SliceStable(rows, func(i, j int) bool {
		if rows[i].Sort == rows[j].Sort {
			return rows[i].ID < rows[j].ID
		}
		return rows[i].Sort < rows[j].Sort
	})
}
