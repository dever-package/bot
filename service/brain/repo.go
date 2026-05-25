package brain

import (
	"context"
	"fmt"
	"hash/fnv"
	"sort"
	"strings"
	"time"

	agentmodel "my/package/bot/model/agent"
	brainmodel "my/package/bot/model/brain"
	energonmodel "my/package/bot/model/energon"
)

type Repo struct{}

func NewRepo() Repo {
	return Repo{}
}

func (Repo) FindBrain(ctx context.Context, id uint64) (brainmodel.Brain, error) {
	if id == 0 {
		return brainmodel.Brain{}, fmt.Errorf("大脑不能为空")
	}
	row := brainmodel.NewBrainModel().Find(ctx, map[string]any{"id": id})
	if row == nil {
		return brainmodel.Brain{}, fmt.Errorf("大脑不存在")
	}
	if row.Status != brainmodel.StatusEnabled {
		return brainmodel.Brain{}, fmt.Errorf("大脑已停用: %s", row.Name)
	}
	return *row, nil
}

func (Repo) UpdateBrain(ctx context.Context, id uint64, record map[string]any) {
	if id == 0 || len(record) == 0 {
		return
	}
	brainmodel.NewBrainModel().Update(ctx, map[string]any{"id": id}, record)
}

func (Repo) FindThink(ctx context.Context, id uint64) (brainmodel.Think, error) {
	if id == 0 {
		return brainmodel.Think{}, fmt.Errorf("思维不能为空")
	}
	row := brainmodel.NewThinkModel().Find(ctx, map[string]any{"id": id})
	if row == nil {
		return brainmodel.Think{}, fmt.Errorf("思维不存在")
	}
	if row.Status != brainmodel.StatusEnabled {
		return brainmodel.Think{}, fmt.Errorf("思维已停用: %s", row.Name)
	}
	return *row, nil
}

func (Repo) ListThinks(ctx context.Context, brainID uint64, enabledOnly bool) []brainmodel.Think {
	filter := map[string]any{"brain_id": brainID}
	if enabledOnly {
		filter["status"] = brainmodel.StatusEnabled
	}
	rows := brainmodel.NewThinkModel().Select(ctx, filter)
	result := make([]brainmodel.Think, 0, len(rows))
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

func (Repo) ListThinksByIDs(ctx context.Context, ids []uint64) []brainmodel.Think {
	values := uint64FilterValues(ids)
	if len(values) == 0 {
		return []brainmodel.Think{}
	}
	rows := brainmodel.NewThinkModel().Select(ctx, map[string]any{"id": values})
	result := make([]brainmodel.Think, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (Repo) ListThinkNodesByIDs(ctx context.Context, ids []uint64) []brainmodel.ThinkNode {
	values := uint64FilterValues(ids)
	if len(values) == 0 {
		return []brainmodel.ThinkNode{}
	}
	rows := brainmodel.NewThinkNodeModel().Select(ctx, map[string]any{"id": values})
	result := make([]brainmodel.ThinkNode, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (Repo) ListEnabledBrains(ctx context.Context) []brainmodel.Brain {
	rows := brainmodel.NewBrainModel().Select(ctx, map[string]any{
		"status": brainmodel.StatusEnabled,
	})
	result := make([]brainmodel.Brain, 0, len(rows))
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

func (Repo) ListThinkEdges(ctx context.Context, brainID uint64, enabledOnly bool) []brainmodel.ThinkEdge {
	filter := map[string]any{"brain_id": brainID}
	if enabledOnly {
		filter["status"] = brainmodel.StatusEnabled
	}
	rows := brainmodel.NewThinkEdgeModel().Select(ctx, filter)
	result := make([]brainmodel.ThinkEdge, 0, len(rows))
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

func (Repo) ListThinkNodes(ctx context.Context, thinkID uint64, enabledOnly bool) []brainmodel.ThinkNode {
	filter := map[string]any{"think_id": thinkID}
	if enabledOnly {
		filter["status"] = brainmodel.StatusEnabled
	}
	rows := brainmodel.NewThinkNodeModel().Select(ctx, filter)
	result := make([]brainmodel.ThinkNode, 0, len(rows))
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

func (Repo) ListThinkNodeEdges(ctx context.Context, thinkID uint64, enabledOnly bool) []brainmodel.ThinkNodeEdge {
	filter := map[string]any{"think_id": thinkID}
	if enabledOnly {
		filter["status"] = brainmodel.StatusEnabled
	}
	rows := brainmodel.NewThinkNodeEdgeModel().Select(ctx, filter)
	result := make([]brainmodel.ThinkNodeEdge, 0, len(rows))
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
		"status": brainmodel.StatusEnabled,
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
		"status": brainmodel.StatusEnabled,
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

func (Repo) UpdateThinkConfig(ctx context.Context, thinkID uint64, config map[string]any) {
	if thinkID == 0 {
		return
	}
	brainmodel.NewThinkModel().Update(ctx, map[string]any{"id": thinkID}, map[string]any{
		"config": jsonText(config),
	})
}

func (Repo) UpsertThink(ctx context.Context, brainID uint64, payload GraphThink) (brainmodel.Think, error) {
	key := normalizeKey("think", payload.Key)
	name := strings.TrimSpace(payload.Name)
	if name == "" {
		name = key
	}
	model := brainmodel.NewThinkModel()
	row := model.Find(ctx, map[string]any{"brain_id": brainID, "key": key})
	now := time.Now()
	record := map[string]any{
		"brain_id": brainID,
		"name":     name,
		"key":      key,
		"goal":     strings.TrimSpace(payload.Goal),
		"position": jsonText(payload.Position),
		"config":   jsonText(payload.Config),
		"status":   normalizedStatus(payload.Status),
		"sort":     payload.Sort,
	}
	if row == nil && payload.ID > 0 {
		row = model.Find(ctx, map[string]any{"id": payload.ID, "brain_id": brainID})
	}
	if row == nil {
		record["created_at"] = now
		id := uint64(model.Insert(ctx, record))
		if id == 0 {
			return brainmodel.Think{}, fmt.Errorf("创建思维失败")
		}
		created := model.Find(ctx, map[string]any{"id": id})
		if created == nil {
			return brainmodel.Think{}, fmt.Errorf("读取新思维失败")
		}
		return *created, nil
	}
	model.Update(ctx, map[string]any{"id": row.ID}, record)
	updated := model.Find(ctx, map[string]any{"id": row.ID})
	if updated == nil {
		return brainmodel.Think{}, fmt.Errorf("读取思维失败")
	}
	return *updated, nil
}

func (Repo) UpsertThinkEdge(ctx context.Context, brainID uint64, fromID uint64, toID uint64, payload GraphThinkEdge) error {
	if fromID == 0 || toID == 0 || fromID == toID {
		return nil
	}
	model := brainmodel.NewThinkEdgeModel()
	row := model.Find(ctx, map[string]any{
		"brain_id":      brainID,
		"from_think_id": fromID,
		"to_think_id":   toID,
	})
	now := time.Now()
	condition := strings.TrimSpace(payload.Condition)
	if condition == "" {
		condition = "completed"
	}
	record := map[string]any{
		"brain_id":      brainID,
		"from_think_id": fromID,
		"to_think_id":   toID,
		"condition":     condition,
		"status":        normalizedStatus(payload.Status),
		"sort":          payload.Sort,
	}
	if row == nil {
		record["created_at"] = now
		if uint64(model.Insert(ctx, record)) == 0 {
			return fmt.Errorf("创建思维关系失败")
		}
		return nil
	}
	model.Update(ctx, map[string]any{"id": row.ID}, record)
	return nil
}

func (Repo) UpsertThinkNode(ctx context.Context, brainID uint64, thinkID uint64, payload GraphThinkNode) (brainmodel.ThinkNode, error) {
	key := normalizeKey("node", payload.NodeKey)
	name := strings.TrimSpace(payload.Name)
	if name == "" {
		name = key
	}
	nodeType := strings.TrimSpace(payload.Type)
	if nodeType == "" {
		nodeType = brainmodel.NodeTypeAgent
	}
	model := brainmodel.NewThinkNodeModel()
	row := model.Find(ctx, map[string]any{"think_id": thinkID, "node_key": key})
	now := time.Now()
	record := map[string]any{
		"brain_id":     brainID,
		"think_id":     thinkID,
		"node_key":     key,
		"name":         name,
		"type":         nodeType,
		"agent_id":     payload.AgentID,
		"power_id":     payload.PowerID,
		"sub_brain_id": payload.SubBrainID,
		"config":       jsonText(payload.Config),
		"position":     jsonText(payload.Position),
		"status":       normalizedStatus(payload.Status),
		"sort":         payload.Sort,
	}
	if row == nil && payload.ID > 0 {
		row = model.Find(ctx, map[string]any{"id": payload.ID, "think_id": thinkID})
	}
	if row == nil {
		record["created_at"] = now
		id := uint64(model.Insert(ctx, record))
		if id == 0 {
			return brainmodel.ThinkNode{}, fmt.Errorf("创建节点失败")
		}
		created := model.Find(ctx, map[string]any{"id": id})
		if created == nil {
			return brainmodel.ThinkNode{}, fmt.Errorf("读取新节点失败")
		}
		return *created, nil
	}
	model.Update(ctx, map[string]any{"id": row.ID}, record)
	updated := model.Find(ctx, map[string]any{"id": row.ID})
	if updated == nil {
		return brainmodel.ThinkNode{}, fmt.Errorf("读取节点失败")
	}
	return *updated, nil
}

func (Repo) UpsertThinkNodeEdge(ctx context.Context, brainID uint64, thinkID uint64, fromID uint64, toID uint64, payload GraphThinkNodeEdge) error {
	if fromID == 0 || toID == 0 || fromID == toID {
		return nil
	}
	model := brainmodel.NewThinkNodeEdgeModel()
	row := model.Find(ctx, map[string]any{
		"think_id":     thinkID,
		"from_node_id": fromID,
		"to_node_id":   toID,
	})
	now := time.Now()
	condition := strings.TrimSpace(payload.Condition)
	if condition == "" {
		condition = "always"
	}
	record := map[string]any{
		"brain_id":     brainID,
		"think_id":     thinkID,
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

func (Repo) DisableMissingThinks(ctx context.Context, brainID uint64, keepKeys map[string]bool) {
	model := brainmodel.NewThinkModel()
	for _, row := range model.Select(ctx, map[string]any{"brain_id": brainID}) {
		if row == nil || keepKeys[row.Key] {
			continue
		}
		model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{
			"status": brainmodel.StatusDisabled,
		})
	}
}

func (Repo) DisableMissingThinkEdges(ctx context.Context, brainID uint64, keep map[string]bool) {
	model := brainmodel.NewThinkEdgeModel()
	for _, row := range model.Select(ctx, map[string]any{"brain_id": brainID}) {
		if row == nil {
			continue
		}
		key := edgeKey(row.FromThinkID, row.ToThinkID)
		if keep[key] {
			continue
		}
		model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{
			"status": brainmodel.StatusDisabled,
		})
	}
}

func (Repo) DisableMissingThinkNodes(ctx context.Context, thinkID uint64, keepKeys map[string]bool) {
	model := brainmodel.NewThinkNodeModel()
	for _, row := range model.Select(ctx, map[string]any{"think_id": thinkID}) {
		if row == nil || keepKeys[row.NodeKey] {
			continue
		}
		model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{
			"status": brainmodel.StatusDisabled,
		})
	}
}

func (Repo) DisableMissingThinkNodeEdges(ctx context.Context, thinkID uint64, keep map[string]bool) {
	model := brainmodel.NewThinkNodeEdgeModel()
	for _, row := range model.Select(ctx, map[string]any{"think_id": thinkID}) {
		if row == nil {
			continue
		}
		key := edgeKey(row.FromNodeID, row.ToNodeID)
		if keep[key] {
			continue
		}
		model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{
			"status": brainmodel.StatusDisabled,
		})
	}
}

func normalizedStatus(status int16) int16 {
	if status == brainmodel.StatusDisabled {
		return brainmodel.StatusDisabled
	}
	return brainmodel.StatusEnabled
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
	return uint64(brainmodel.NewRunModel().Insert(ctx, record))
}

func (Repo) InsertBrainRelease(ctx context.Context, record map[string]any) uint64 {
	record["created_at"] = time.Now()
	return uint64(brainmodel.NewBrainReleaseModel().Insert(ctx, record))
}

func (Repo) FindBrainRelease(ctx context.Context, id uint64) *brainmodel.BrainRelease {
	if id == 0 {
		return nil
	}
	return brainmodel.NewBrainReleaseModel().Find(ctx, map[string]any{"id": id})
}

func (Repo) FindCurrentBrainRelease(ctx context.Context, brainID uint64) *brainmodel.BrainRelease {
	if brainID == 0 {
		return nil
	}
	return brainmodel.NewBrainReleaseModel().Find(ctx, map[string]any{
		"brain_id": brainID,
		"status":   brainmodel.BrainReleaseStatusCurrent,
	})
}

func (Repo) ArchiveOtherBrainReleases(ctx context.Context, brainID uint64, keepID uint64) {
	if brainID == 0 || keepID == 0 {
		return
	}
	model := brainmodel.NewBrainReleaseModel()
	rows := model.Select(ctx, map[string]any{
		"brain_id": brainID,
		"status":   brainmodel.BrainReleaseStatusCurrent,
	})
	for _, row := range rows {
		if row == nil || row.ID == keepID {
			continue
		}
		model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{
			"status": brainmodel.BrainReleaseStatusArchive,
		})
	}
}

func (Repo) FindRun(ctx context.Context, id uint64) *brainmodel.Run {
	if id == 0 {
		return nil
	}
	return brainmodel.NewRunModel().Find(ctx, map[string]any{"id": id})
}

func (Repo) FindRunInProject(ctx context.Context, id uint64, projectID uint64) *brainmodel.Run {
	if id == 0 || projectID == 0 {
		return nil
	}
	return brainmodel.NewRunModel().Find(ctx, map[string]any{
		"id":         id,
		"project_id": projectID,
	})
}

func (Repo) FindRunByRequestID(ctx context.Context, requestID string) *brainmodel.Run {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return nil
	}
	return brainmodel.NewRunModel().Find(ctx, map[string]any{"request_id": requestID})
}

func (Repo) FindRunByRequestIDInProject(ctx context.Context, requestID string, projectID uint64) *brainmodel.Run {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" || projectID == 0 {
		return nil
	}
	return brainmodel.NewRunModel().Find(ctx, map[string]any{
		"request_id": requestID,
		"project_id": projectID,
	})
}

func (Repo) UpdateRun(ctx context.Context, id uint64, record map[string]any) {
	if id == 0 || len(record) == 0 {
		return
	}
	record["updated_at"] = time.Now()
	brainmodel.NewRunModel().Update(ctx, map[string]any{"id": id}, record)
}

func (Repo) FindOrCreateThinkRun(ctx context.Context, run brainmodel.Run, think brainmodel.Think, input map[string]any) uint64 {
	model := brainmodel.NewThinkRunModel()
	row := model.Find(ctx, map[string]any{"run_id": run.ID, "think_id": think.ID})
	if row != nil {
		return row.ID
	}
	now := time.Now()
	return uint64(model.Insert(ctx, map[string]any{
		"run_id":     run.ID,
		"request_id": run.RequestID,
		"project_id": run.ProjectID,
		"brain_id":   run.BrainID,
		"think_id":   think.ID,
		"input":      jsonText(input),
		"output":     "{}",
		"error":      "",
		"status":     brainmodel.RunStatusPending,
		"created_at": now,
		"updated_at": now,
	}))
}

func (Repo) FindThinkRun(ctx context.Context, id uint64) *brainmodel.ThinkRun {
	if id == 0 {
		return nil
	}
	return brainmodel.NewThinkRunModel().Find(ctx, map[string]any{"id": id})
}

func (Repo) ListThinkRuns(ctx context.Context, runID uint64) []brainmodel.ThinkRun {
	rows := brainmodel.NewThinkRunModel().Select(ctx, map[string]any{"run_id": runID})
	result := make([]brainmodel.ThinkRun, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (Repo) UpdateThinkRun(ctx context.Context, id uint64, record map[string]any) {
	if id == 0 || len(record) == 0 {
		return
	}
	record["updated_at"] = time.Now()
	brainmodel.NewThinkRunModel().Update(ctx, map[string]any{"id": id}, record)
}

func (Repo) FindOrCreateNodeRun(ctx context.Context, run brainmodel.Run, thinkRun brainmodel.ThinkRun, node brainmodel.ThinkNode, input map[string]any) uint64 {
	model := brainmodel.NewNodeRunModel()
	row := model.Find(ctx, map[string]any{"think_run_id": thinkRun.ID, "node_id": node.ID})
	if row != nil {
		return row.ID
	}
	now := time.Now()
	return uint64(model.Insert(ctx, map[string]any{
		"run_id":       run.ID,
		"think_run_id": thinkRun.ID,
		"request_id":   run.RequestID,
		"project_id":   run.ProjectID,
		"brain_id":     run.BrainID,
		"think_id":     node.ThinkID,
		"node_id":      node.ID,
		"node_key":     node.NodeKey,
		"node_type":    node.Type,
		"input":        jsonText(input),
		"output":       "{}",
		"error":        "",
		"status":       brainmodel.RunStatusPending,
		"agent_run_id": 0,
		"created_at":   now,
		"updated_at":   now,
	}))
}

func (Repo) FindOrCreateDynamicNodeRun(ctx context.Context, run brainmodel.Run, thinkRun brainmodel.ThinkRun, think brainmodel.Think, nodeID uint64, nodeKey string, nodeName string, nodeType string, input map[string]any) uint64 {
	if nodeID == 0 {
		nodeID = stableNodeID(nodeKey)
	}
	model := brainmodel.NewNodeRunModel()
	row := model.Find(ctx, map[string]any{"think_run_id": thinkRun.ID, "node_id": nodeID})
	if row != nil {
		return row.ID
	}
	now := time.Now()
	return uint64(model.Insert(ctx, map[string]any{
		"run_id":       run.ID,
		"think_run_id": thinkRun.ID,
		"request_id":   run.RequestID,
		"project_id":   run.ProjectID,
		"brain_id":     run.BrainID,
		"think_id":     think.ID,
		"node_id":      nodeID,
		"node_key":     strings.TrimSpace(nodeKey),
		"node_type":    strings.TrimSpace(nodeType),
		"input":        jsonText(input),
		"output":       "{}",
		"error":        "",
		"status":       brainmodel.RunStatusPending,
		"agent_run_id": 0,
		"created_at":   now,
		"updated_at":   now,
	}))
}

func (Repo) FindNodeRun(ctx context.Context, id uint64) *brainmodel.NodeRun {
	if id == 0 {
		return nil
	}
	return brainmodel.NewNodeRunModel().Find(ctx, map[string]any{"id": id})
}

func (Repo) FindNodeRunByNode(ctx context.Context, thinkRunID uint64, nodeID uint64) *brainmodel.NodeRun {
	if thinkRunID == 0 || nodeID == 0 {
		return nil
	}
	return brainmodel.NewNodeRunModel().Find(ctx, map[string]any{
		"think_run_id": thinkRunID,
		"node_id":      nodeID,
	})
}

func (Repo) ListNodeRuns(ctx context.Context, runID uint64) []brainmodel.NodeRun {
	rows := brainmodel.NewNodeRunModel().Select(ctx, map[string]any{"run_id": runID})
	result := make([]brainmodel.NodeRun, 0, len(rows))
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
	brainmodel.NewNodeRunModel().Update(ctx, map[string]any{"id": id}, record)
}

func (Repo) UpsertBlackboard(ctx context.Context, record map[string]any) {
	thinkRunID := uint64Value(record["think_run_id"])
	key := strings.TrimSpace(textValue(record["key"]))
	if thinkRunID == 0 || key == "" {
		return
	}
	model := brainmodel.NewBlackboardModel()
	row := model.Find(ctx, map[string]any{"think_run_id": thinkRunID, "key": key})
	record["updated_at"] = time.Now()
	if row == nil {
		record["created_at"] = time.Now()
		model.Insert(ctx, record)
		return
	}
	model.Update(ctx, map[string]any{"id": row.ID}, record)
}

func (Repo) ListBlackboard(ctx context.Context, thinkRunID uint64) map[string]any {
	rows := brainmodel.NewBlackboardModel().Select(ctx, map[string]any{"think_run_id": thinkRunID})
	result := map[string]any{}
	for _, row := range rows {
		if row != nil {
			result[row.Key] = jsonValue(row.Value)
		}
	}
	return result
}

func (Repo) ListBlackboardRows(ctx context.Context, runID uint64) []brainmodel.Blackboard {
	rows := brainmodel.NewBlackboardModel().Select(ctx, map[string]any{"run_id": runID})
	result := make([]brainmodel.Blackboard, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (Repo) InsertMessage(ctx context.Context, record map[string]any) {
	record["created_at"] = time.Now()
	brainmodel.NewMessageModel().Insert(ctx, record)
}

func (Repo) ListMessages(ctx context.Context, runID uint64) []brainmodel.Message {
	rows := brainmodel.NewMessageModel().Select(ctx, map[string]any{"run_id": runID})
	result := make([]brainmodel.Message, 0, len(rows))
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
	return uint64(brainmodel.NewApprovalModel().Insert(ctx, record))
}

func (Repo) FindApproval(ctx context.Context, id uint64) *brainmodel.Approval {
	if id == 0 {
		return nil
	}
	return brainmodel.NewApprovalModel().Find(ctx, map[string]any{"id": id})
}

func (Repo) FindPendingApprovalByNodeRun(ctx context.Context, nodeRunID uint64) *brainmodel.Approval {
	if nodeRunID == 0 {
		return nil
	}
	return brainmodel.NewApprovalModel().Find(ctx, map[string]any{
		"node_run_id": nodeRunID,
		"status":      brainmodel.RunStatusPending,
	})
}

func (Repo) ListApprovals(ctx context.Context, runID uint64) []brainmodel.Approval {
	rows := brainmodel.NewApprovalModel().Select(ctx, map[string]any{"run_id": runID})
	result := make([]brainmodel.Approval, 0, len(rows))
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
	brainmodel.NewApprovalModel().Update(ctx, map[string]any{"id": id}, record)
}

func (Repo) InsertMemory(ctx context.Context, record map[string]any) uint64 {
	record["created_at"] = time.Now()
	return uint64(brainmodel.NewMemoryModel().Insert(ctx, record))
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
