package project

import (
	"context"
	"fmt"
	"strings"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
	workspacemodel "github.com/dever-package/bot/model/workspace"
)

type workspaceNodeExecution struct {
	ExecutionID    uint64
	ProjectID      uint64
	CanvasID       uint64
	AssetCateID    uint64
	RunID          uint64
	FlowRunID      uint64
	NodeRunID      uint64
	AgentRunID     uint64
	RequestID      string
	NodeKey        string
	NodeType       string
	FunctionKey    string
	Status         string
	Input          any
	Output         any
	Error          string
	AssetID        uint64
	VersionID      uint64
	ChildRunID     uint64
	ChildRequestID string
	ApprovalID     uint64
	StartedAt      time.Time
	FinishedAt     time.Time
}

func recordWorkspaceNodeExecution(ctx context.Context, execution workspaceNodeExecution) (err error) {
	nodeKey := strings.TrimSpace(execution.NodeKey)
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("写入画布节点执行记录失败 %s: %w", nodeKey, workspaceNodeExecutionPanicError(recovered))
		}
	}()
	if execution.ProjectID == 0 || execution.RunID == 0 || nodeKey == "" {
		return fmt.Errorf("画布节点执行记录参数不完整")
	}
	now := time.Now()
	status := normalizeWorkspaceExecutionStatus(execution.Status)
	record := map[string]any{
		"execution_id":     execution.ExecutionID,
		"project_id":       execution.ProjectID,
		"canvas_id":        execution.CanvasID,
		"asset_cate_id":    execution.AssetCateID,
		"run_id":           execution.RunID,
		"flow_run_id":      execution.FlowRunID,
		"node_run_id":      execution.NodeRunID,
		"agent_run_id":     execution.AgentRunID,
		"request_id":       strings.TrimSpace(execution.RequestID),
		"node_key":         nodeKey,
		"node_type":        strings.TrimSpace(execution.NodeType),
		"function_key":     strings.TrimSpace(execution.FunctionKey),
		"status":           status,
		"input":            jsonText(execution.Input, "{}"),
		"output":           jsonText(execution.Output, "{}"),
		"error":            strings.TrimSpace(execution.Error),
		"asset_id":         execution.AssetID,
		"version_id":       execution.VersionID,
		"child_run_id":     execution.ChildRunID,
		"child_request_id": strings.TrimSpace(execution.ChildRequestID),
		"approval_id":      execution.ApprovalID,
		"updated_at":       now,
	}
	if !execution.StartedAt.IsZero() {
		startedAt := execution.StartedAt
		record["started_at"] = &startedAt
	}
	if !execution.FinishedAt.IsZero() {
		finishedAt := execution.FinishedAt
		record["finished_at"] = &finishedAt
	}

	model := workspacemodel.NewNodeExecutionModel()
	row := model.Find(ctx, map[string]any{
		"run_id":   execution.RunID,
		"node_key": nodeKey,
	})
	if row == nil {
		record["created_at"] = now
		if execution.StartedAt.IsZero() && canvasRunStatusStarted(status) {
			startedAt := now
			record["started_at"] = &startedAt
		}
		inserted, insertErr := workspaceNodeExecutionMutation(func() int64 {
			return model.Insert(ctx, record)
		})
		if insertErr == nil && inserted > 0 {
			return nil
		}
		// Dever ORM reports constraint failures as panics. A concurrent writer may
		// have inserted the same run/node row, so resolve that race by reading it.
		row = model.Find(ctx, map[string]any{
			"run_id":   execution.RunID,
			"node_key": nodeKey,
		})
		if row == nil {
			if insertErr != nil {
				return fmt.Errorf("创建画布节点执行记录失败 %s: %w", nodeKey, insertErr)
			}
			return fmt.Errorf("创建画布节点执行记录失败: %s", nodeKey)
		}
		delete(record, "created_at")
	}
	filters := map[string]any{"id": row.ID}
	if status != teammodel.RunStatusCanceled {
		filters["status"] = map[string]any{"neq": teammodel.RunStatusCanceled}
	}
	affected, updateErr := workspaceNodeExecutionMutation(func() int64 {
		return model.Update(ctx, filters, record)
	})
	if updateErr != nil {
		return fmt.Errorf("更新画布节点执行记录失败 %s: %w", nodeKey, updateErr)
	}
	if affected == 1 {
		return nil
	}
	current := model.Find(ctx, map[string]any{"id": row.ID})
	if status != teammodel.RunStatusCanceled && current != nil && current.Status == teammodel.RunStatusCanceled {
		return nil
	}
	return fmt.Errorf("更新画布节点执行记录失败: %s", nodeKey)
}

func workspaceNodeExecutionMutation(mutate func() int64) (affected int64, err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = workspaceNodeExecutionPanicError(recovered)
		}
	}()
	return mutate(), nil
}

func workspaceNodeExecutionPanicError(recovered any) error {
	if err, ok := recovered.(error); ok {
		return err
	}
	return fmt.Errorf("%v", recovered)
}

func trackWorkspaceNodeChildRun(
	ctx context.Context,
	projectID uint64,
	runID uint64,
	nodeRunID uint64,
	nodeKey string,
	childRunID uint64,
	childRequestID string,
) {
	nodeKey = strings.TrimSpace(nodeKey)
	childRequestID = strings.TrimSpace(childRequestID)
	if childRunID == 0 && childRequestID == "" {
		return
	}
	ctx = detachedWorkspaceContext(ctx)
	now := time.Now()
	executionFields := map[string]any{"updated_at": now}
	if childRunID > 0 {
		executionFields["child_run_id"] = childRunID
	}
	if childRequestID != "" {
		executionFields["child_request_id"] = childRequestID
	}
	activeStatuses := []string{
		teammodel.RunStatusPending,
		teammodel.RunStatusRunning,
		teammodel.RunStatusWaiting,
	}
	if nodeRunID > 0 && childRequestID != "" {
		teammodel.NewNodeRunModel().Update(ctx, map[string]any{
			"id":     nodeRunID,
			"status": activeStatuses,
		}, map[string]any{
			"child_request_id": childRequestID,
			"updated_at":       now,
		})
	}
	if projectID == 0 || runID == 0 || nodeKey == "" {
		return
	}
	workspacemodel.NewNodeExecutionModel().Update(ctx, map[string]any{
		"project_id": projectID,
		"run_id":     runID,
		"node_key":   nodeKey,
		"status":     activeStatuses,
	}, executionFields)
}

func workspaceNodeExecutions(ctx context.Context, projectID uint64, runID uint64) []map[string]any {
	rows := workspaceNodeExecutionRows(ctx, projectID, []uint64{runID})
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		result = append(result, workspaceNodeExecutionPayload(*row))
	}
	return result
}

func workspaceNodeResults(ctx context.Context, projectID uint64, runID uint64) []map[string]any {
	if projectID == 0 || runID == 0 {
		return []map[string]any{}
	}
	return workspaceNodeResultsByRunIDs(ctx, projectID, []uint64{runID})[runID]
}

func workspaceNodeResultsByRunIDs(ctx context.Context, projectID uint64, runIDs []uint64) map[uint64][]map[string]any {
	result := make(map[uint64][]map[string]any)
	runIDs = uniqueWorkspaceRunIDs(runIDs)
	if projectID == 0 || len(runIDs) == 0 {
		return result
	}
	for _, runID := range runIDs {
		result[runID] = []map[string]any{}
	}
	rows := workspaceNodeExecutionRows(ctx, projectID, runIDs)
	for _, row := range rows {
		if row == nil {
			continue
		}
		if nodeResult := workspaceNodeResultPayload(*row); nodeResult != nil {
			result[row.RunID] = append(result[row.RunID], nodeResult)
		}
	}
	return result
}

func workspaceNodeExecutionRows(ctx context.Context, projectID uint64, runIDs []uint64) []*workspacemodel.NodeExecution {
	runIDs = uniqueWorkspaceRunIDs(runIDs)
	if projectID == 0 || len(runIDs) == 0 {
		return nil
	}
	return workspacemodel.NewNodeExecutionModel().Select(ctx, map[string]any{
		"project_id": projectID,
		"run_id":     runIDs,
	}, map[string]any{
		"field": "main.id,main.execution_id,main.project_id,main.canvas_id,main.asset_cate_id,main.run_id,main.flow_run_id,main.node_run_id,main.agent_run_id,main.request_id,main.node_key,main.node_type,main.function_key,main.status,main.input,main.output,main.error,main.asset_id,main.version_id,main.child_run_id,main.child_request_id,main.approval_id,main.started_at,main.finished_at,main.created_at,main.updated_at",
		"order": "main.id asc",
	})
}

func workspaceNodeExecutionsByKey(rows []*workspacemodel.NodeExecution) map[string]*workspacemodel.NodeExecution {
	result := make(map[string]*workspacemodel.NodeExecution, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		if nodeKey := strings.TrimSpace(row.NodeKey); nodeKey != "" {
			result[nodeKey] = row
		}
	}
	return result
}

func workspaceNodeResultsFromRows(rows []*workspacemodel.NodeExecution) []map[string]any {
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		if nodeResult := workspaceNodeResultPayload(*row); nodeResult != nil {
			result = append(result, nodeResult)
		}
	}
	return result
}

func workspaceHasActiveNodeExecution(ctx context.Context, projectID uint64, runID uint64) bool {
	if projectID == 0 || runID == 0 {
		return false
	}
	return workspacemodel.NewNodeExecutionModel().Find(ctx, map[string]any{
		"project_id": projectID,
		"run_id":     runID,
		"status": []string{
			teammodel.RunStatusRunning,
			teammodel.RunStatusPending,
		},
	}) != nil
}

func workspaceNodeExecutionByNode(ctx context.Context, projectID uint64, runID uint64, nodeKey string) *workspacemodel.NodeExecution {
	nodeKey = strings.TrimSpace(nodeKey)
	if projectID == 0 || runID == 0 || nodeKey == "" {
		return nil
	}
	return workspacemodel.NewNodeExecutionModel().Find(ctx, map[string]any{
		"project_id": projectID,
		"run_id":     runID,
		"node_key":   nodeKey,
	})
}

func workspaceNodeExecutionChildRunID(ctx context.Context, projectID uint64, runID uint64, nodeKey string) uint64 {
	return workspaceNodeExecutionChildRunIDFromRow(runID, workspaceNodeExecutionByNode(ctx, projectID, runID, nodeKey))
}

func workspaceNodeExecutionChildRunIDFromRow(runID uint64, row *workspacemodel.NodeExecution) uint64 {
	if row == nil {
		return 0
	}
	if row.ChildRunID > 0 {
		return row.ChildRunID
	}
	output := mapValue(jsonValue(row.Output, map[string]any{}))
	return workspaceChildRunID(runID, output)
}

func workspaceNodeExecutionPayload(row workspacemodel.NodeExecution) map[string]any {
	return map[string]any{
		"id":               row.ID,
		"execution_id":     row.ExecutionID,
		"canvas_id":        row.CanvasID,
		"project_id":       row.ProjectID,
		"asset_cate_id":    row.AssetCateID,
		"run_id":           row.RunID,
		"flow_run_id":      row.FlowRunID,
		"node_run_id":      row.NodeRunID,
		"agent_run_id":     row.AgentRunID,
		"request_id":       strings.TrimSpace(row.RequestID),
		"node_key":         strings.TrimSpace(row.NodeKey),
		"node_type":        strings.TrimSpace(row.NodeType),
		"function_key":     strings.TrimSpace(row.FunctionKey),
		"status":           strings.TrimSpace(row.Status),
		"output":           jsonValue(row.Output, map[string]any{}),
		"error":            strings.TrimSpace(row.Error),
		"asset_id":         row.AssetID,
		"version_id":       row.VersionID,
		"child_run_id":     row.ChildRunID,
		"child_request_id": strings.TrimSpace(row.ChildRequestID),
		"approval_id":      row.ApprovalID,
		"started_at":       row.StartedAt,
		"finished_at":      row.FinishedAt,
		"created_at":       row.CreatedAt,
		"updated_at":       row.UpdatedAt,
	}
}

func workspaceNodeResultPayload(row workspacemodel.NodeExecution) map[string]any {
	status := strings.TrimSpace(row.Status)
	if status == "" || status == teammodel.RunStatusRunning || status == teammodel.RunStatusPending {
		return nil
	}
	output := mapValue(jsonValue(row.Output, map[string]any{}))
	if output == nil {
		output = map[string]any{}
	}
	nodeRun := firstCanvasNodeResult(output)
	result := map[string]any{
		"execution_id":     row.ExecutionID,
		"node_key":         strings.TrimSpace(row.NodeKey),
		"node_type":        strings.TrimSpace(row.NodeType),
		"function_key":     strings.TrimSpace(row.FunctionKey),
		"node_run_id":      firstUint64(row.NodeRunID, uint64Value(nodeRun["node_run_id"])),
		"run_id":           firstUint64(row.RunID, uint64Value(nodeRun["run_id"]), uint64Value(output["run_id"]), uint64Value(valueAtPath(nodeRun, "result", "run_id"))),
		"request_id":       firstText(row.RequestID, nodeRun["request_id"], output["request_id"], valueAtPath(nodeRun, "result", "request_id")),
		"flow_run_id":      firstUint64(row.FlowRunID, uint64Value(nodeRun["flow_run_id"]), uint64Value(output["flow_run_id"]), uint64Value(valueAtPath(nodeRun, "result", "flow_run_id"))),
		"release_id":       firstUint64(uint64Value(nodeRun["release_id"]), uint64Value(output["release_id"]), uint64Value(valueAtPath(nodeRun, "result", "release_id"))),
		"child_run_id":     firstUint64(row.ChildRunID, uint64Value(nodeRun["child_run_id"]), uint64Value(output["child_run_id"]), uint64Value(valueAtPath(nodeRun, "result", "child_run_id"))),
		"child_request_id": firstText(row.ChildRequestID, nodeRun["child_request_id"], output["child_request_id"], valueAtPath(nodeRun, "result", "child_request_id")),
		"status":           status,
		"error":            strings.TrimSpace(row.Error),
		"output":           firstPresent(nodeRun["output"], output["output"], output),
		"asset":            firstPresent(nodeRun["asset"], output["asset"]),
		"version":          firstPresent(nodeRun["version"], valueAtPath(output, "asset", "version"), output["version"]),
		"result":           firstPresent(nodeRun["result"], output),
		"persists_result":  boolValue(firstPresent(nodeRun["persists_result"], row.AssetID > 0 || row.VersionID > 0 || mapValue(output["asset"]) != nil || mapValue(output["version"]) != nil)),
		"agent_run_id":     firstUint64(row.AgentRunID, uint64Value(nodeRun["agent_run_id"])),
	}
	if timing := workspaceNodeRunTimingPayload(row.StartedAt, row.FinishedAt); timing != nil {
		result["run_timing"] = timing
	}
	assignCanvasNodeResultAssetRefs(result, output)
	if row.AssetID > 0 {
		result["asset_id"] = row.AssetID
	}
	if row.VersionID > 0 {
		result["version_id"] = row.VersionID
	}
	if approval := workspaceNodeResultApproval(row, nodeRun, output); approval != nil {
		result["approval"] = approval
	}
	if interaction := workspaceNodeResultInteraction(nodeRun, output); interaction != nil {
		result["interaction"] = interaction
	}
	if textValue(result["node_key"]) == "" {
		return nil
	}
	return result
}

func workspaceNodeRunTimingPayload(startedAt *time.Time, finishedAt *time.Time) map[string]any {
	if startedAt == nil || startedAt.IsZero() {
		return nil
	}
	result := map[string]any{"started_at": startedAt}
	if finishedAt != nil && !finishedAt.IsZero() {
		result["finished_at"] = finishedAt
	}
	return result
}

func workspaceNodeResultInteraction(nodeRun map[string]any, output map[string]any) map[string]any {
	if interaction := canvasPayloadInteraction(nodeRun); interaction != nil {
		return interaction
	}
	return canvasPayloadInteraction(output)
}

func workspaceNodeResultApproval(row workspacemodel.NodeExecution, nodeRun map[string]any, output map[string]any) map[string]any {
	for _, raw := range []any{
		nodeRun["approval"],
		valueAtPath(nodeRun, "result", "approval"),
		output["approval"],
		valueAtPath(output, "result", "approval"),
		valueAtPath(output, "pending_node", "approval"),
	} {
		if approval := mapValue(raw); approval != nil {
			return approval
		}
	}
	approvalID := firstUint64(
		row.ApprovalID,
		uint64Value(nodeRun["approval_id"]),
		uint64Value(valueAtPath(nodeRun, "result", "approval_id")),
		uint64Value(output["approval_id"]),
		uint64Value(valueAtPath(output, "result", "approval_id")),
		uint64Value(valueAtPath(output, "pending_node", "approval_id")),
	)
	if approvalID > 0 {
		return map[string]any{"id": approvalID}
	}
	return nil
}

func firstWorkspaceWaitingNode(results []map[string]any) map[string]any {
	for _, result := range results {
		if textValue(result["status"]) == teammodel.RunStatusWaiting {
			return result
		}
	}
	return nil
}

func boolValue(raw any) bool {
	switch value := raw.(type) {
	case bool:
		return value
	case int:
		return value != 0
	case int16:
		return value != 0
	case int64:
		return value != 0
	case uint64:
		return value != 0
	case float64:
		return value != 0
	case string:
		switch strings.ToLower(strings.TrimSpace(value)) {
		case "1", "true", "yes", "on":
			return true
		}
	}
	return false
}

func normalizeWorkspaceExecutionStatus(status string) string {
	switch strings.TrimSpace(status) {
	case teammodel.RunStatusPending, teammodel.RunStatusRunning, teammodel.RunStatusSuccess, teammodel.RunStatusFail, teammodel.RunStatusWaiting:
		return strings.TrimSpace(status)
	case teammodel.RunStatusCanceled:
		return teammodel.RunStatusCanceled
	default:
		return teammodel.RunStatusSuccess
	}
}

func nodeExecutionAssetRefs(payload map[string]any) (uint64, uint64) {
	nodeResult := firstCanvasNodeResult(payload)
	asset := mapValue(firstPresent(
		payload["asset"],
		valueAtPath(payload, "result", "asset"),
		nodeResult["asset"],
		valueAtPath(nodeResult, "result", "asset"),
	))
	version := mapValue(firstPresent(
		payload["version"],
		valueAtPath(payload, "asset", "version"),
		valueAtPath(payload, "result", "version"),
		nodeResult["version"],
		valueAtPath(nodeResult, "asset", "version"),
		valueAtPath(nodeResult, "result", "version"),
	))
	return firstUint64(
			uint64Value(asset["id"]),
			uint64Value(valueAtPath(payload, "asset", "id")),
			uint64Value(valueAtPath(payload, "result", "asset", "id")),
			uint64Value(valueAtPath(nodeResult, "asset", "id")),
			uint64Value(valueAtPath(nodeResult, "result", "asset", "id")),
			uint64Value(payload["asset_id"]),
			uint64Value(valueAtPath(payload, "result", "asset_id")),
			uint64Value(nodeResult["asset_id"]),
		),
		firstUint64(
			uint64Value(version["id"]),
			uint64Value(asset["version_id"]),
			uint64Value(valueAtPath(asset, "version", "id")),
			uint64Value(valueAtPath(payload, "version", "id")),
			uint64Value(valueAtPath(payload, "result", "version", "id")),
			uint64Value(valueAtPath(nodeResult, "version", "id")),
			uint64Value(valueAtPath(nodeResult, "asset", "version", "id")),
			uint64Value(valueAtPath(nodeResult, "asset", "version_id")),
			uint64Value(valueAtPath(nodeResult, "result", "version", "id")),
			uint64Value(payload["version_id"]),
			uint64Value(valueAtPath(payload, "result", "version_id")),
			uint64Value(nodeResult["version_id"]),
		)
}

func assignCanvasNodeResultAssetRefs(result map[string]any, payload map[string]any) {
	if result == nil {
		return
	}
	assetID, versionID := nodeExecutionAssetRefs(payload)
	if assetID > 0 {
		result["asset_id"] = assetID
	}
	if versionID > 0 {
		result["version_id"] = versionID
	}
}
