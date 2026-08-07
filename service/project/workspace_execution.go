package project

import (
	"context"
	"strings"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
	workspacemodel "github.com/dever-package/bot/model/workspace"
)

type workspaceExecutionCreate struct {
	ProjectID   uint64
	AssetCateID uint64
	TeamID      uint64
	ReleaseID   uint64
	RunID       uint64
	FlowRunID   uint64
	RequestID   string
	StartNodeID string
	SingleNode  bool
	Status      string
	Input       any
	Plan        any
	Total       int
}

func createWorkspaceExecution(ctx context.Context, input workspaceExecutionCreate) uint64 {
	if input.ProjectID == 0 || input.RunID == 0 || strings.TrimSpace(input.RequestID) == "" {
		return 0
	}
	now := time.Now()
	status := normalizeWorkspaceExecutionStatus(input.Status)
	if status == "" {
		status = teammodel.RunStatusPending
	}
	record := map[string]any{
		"project_id":    input.ProjectID,
		"asset_cate_id": input.AssetCateID,
		"team_id":       input.TeamID,
		"release_id":    input.ReleaseID,
		"run_id":        input.RunID,
		"flow_run_id":   input.FlowRunID,
		"request_id":    strings.TrimSpace(input.RequestID),
		"start_node_id": strings.TrimSpace(input.StartNodeID),
		"single_node":   boolInt16(input.SingleNode),
		"status":        status,
		"executed":      0,
		"total":         input.Total,
		"input":         jsonText(input.Input, "{}"),
		"output":        "{}",
		"plan":          jsonText(input.Plan, "{}"),
		"error":         "",
		"started_at":    &now,
		"created_at":    now,
		"updated_at":    now,
	}
	return uint64(workspacemodel.NewExecutionModel().Insert(ctx, record))
}

func workspaceExecutionByRunID(ctx context.Context, runID uint64) *workspacemodel.Execution {
	if runID == 0 {
		return nil
	}
	return workspacemodel.NewExecutionModel().Find(ctx, map[string]any{"run_id": runID})
}

func workspaceExecutionByRequestID(ctx context.Context, projectID uint64, requestID string) *workspacemodel.Execution {
	requestID = strings.TrimSpace(requestID)
	if projectID == 0 || requestID == "" {
		return nil
	}
	return workspacemodel.NewExecutionModel().Find(ctx, map[string]any{
		"project_id": projectID,
		"request_id": requestID,
	})
}

func (s WorkspaceService) activeSingleNodeExecution(
	ctx context.Context,
	projectID uint64,
	assetCateID uint64,
	startNodeID string,
) *workspacemodel.Execution {
	startNodeID = strings.TrimSpace(startNodeID)
	if projectID == 0 || startNodeID == "" {
		return nil
	}
	filter := map[string]any{
		"project_id":    projectID,
		"start_node_id": startNodeID,
		"single_node":   int16(1),
		"status": []string{
			teammodel.RunStatusPending,
			teammodel.RunStatusRunning,
			teammodel.RunStatusWaiting,
		},
	}
	if assetCateID > 0 {
		filter["asset_cate_id"] = assetCateID
	}
	for _, execution := range workspacemodel.NewExecutionModel().Select(ctx, filter, map[string]any{
		"order": "main.id desc",
	}) {
		execution = s.syncWorkspaceExecutionRow(ctx, execution)
		if execution != nil && canvasRunStatusActive(execution.Status) {
			return execution
		}
	}
	return nil
}

func workspaceExecutionIDByRunID(ctx context.Context, runID uint64) uint64 {
	if row := workspaceExecutionByRunID(ctx, runID); row != nil {
		return row.ID
	}
	return 0
}

func finishWorkspaceExecution(ctx context.Context, runID uint64, status string, output map[string]any, errorText string) {
	row := workspaceExecutionByRunID(ctx, runID)
	if row == nil {
		return
	}
	status = normalizeWorkspaceExecutionStatus(status)
	if status == "" {
		status = teammodel.RunStatusSuccess
	}
	now := time.Now()
	record := map[string]any{
		"status":     status,
		"executed":   intValue(output["executed"]),
		"output":     jsonText(output, "{}"),
		"error":      strings.TrimSpace(errorText),
		"updated_at": now,
	}
	if total := intValue(output["total"]); total > 0 {
		record["total"] = total
	}
	if status != teammodel.RunStatusRunning && status != teammodel.RunStatusPending && status != teammodel.RunStatusWaiting {
		record["finished_at"] = now
	}
	filters := map[string]any{"id": row.ID}
	if status != teammodel.RunStatusCanceled {
		filters["status"] = map[string]any{"neq": teammodel.RunStatusCanceled}
	}
	workspacemodel.NewExecutionModel().Update(ctx, filters, record)
}

func updateWorkspaceExecutionStatus(ctx context.Context, runID uint64, status string, errorText string) {
	row := workspaceExecutionByRunID(ctx, runID)
	if row == nil {
		return
	}
	status = normalizeWorkspaceExecutionStatus(status)
	now := time.Now()
	record := map[string]any{
		"status":     status,
		"error":      strings.TrimSpace(errorText),
		"updated_at": now,
	}
	if status != teammodel.RunStatusRunning && status != teammodel.RunStatusPending && status != teammodel.RunStatusWaiting {
		record["finished_at"] = now
	}
	filters := map[string]any{"id": row.ID}
	if status != teammodel.RunStatusCanceled {
		filters["status"] = map[string]any{"neq": teammodel.RunStatusCanceled}
	}
	workspacemodel.NewExecutionModel().Update(ctx, filters, record)
}

func workspaceExecutionPayload(ctx context.Context, execution *workspacemodel.Execution) map[string]any {
	if execution == nil {
		return map[string]any{}
	}
	output := mapValue(jsonValue(execution.Output, map[string]any{}))
	if output == nil {
		output = map[string]any{}
	}
	payload := cloneInput(output)
	payload["execution_id"] = execution.ID
	payload["run_id"] = execution.RunID
	payload["flow_run_id"] = execution.FlowRunID
	payload["request_id"] = strings.TrimSpace(execution.RequestID)
	payload["release_id"] = execution.ReleaseID
	payload["asset_cate_id"] = execution.AssetCateID
	payload["start_node_id"] = strings.TrimSpace(execution.StartNodeID)
	payload["single_node"] = execution.SingleNode == 1
	payload["status"] = strings.TrimSpace(execution.Status)
	payload["error"] = strings.TrimSpace(execution.Error)
	payload["executed"] = execution.Executed
	payload["total"] = execution.Total
	payload["updated_at"] = execution.UpdatedAt
	payload["created_at"] = execution.CreatedAt
	if plan := mapValue(jsonValue(execution.Plan, map[string]any{})); plan != nil {
		payload["execution_plan"] = plan
	}
	nodeResults := workspaceNodeResults(ctx, execution.ProjectID, execution.RunID)
	payload["node_results"] = nodeResults
	payload["node_executions"] = workspaceNodeExecutions(ctx, execution.ProjectID, execution.RunID)
	payload["node_runs"] = workspaceNodeRunPayloads(ctx, execution.RunID)
	payload["pending_node"] = firstWorkspaceWaitingNode(nodeResults)
	return payload
}

func workspaceExecutionListPayload(
	execution *workspacemodel.Execution,
	nodeResults []map[string]any,
	nodeRuns []map[string]any,
	includeDetails bool,
) map[string]any {
	if execution == nil {
		return map[string]any{}
	}
	payload := map[string]any{
		"execution_id":  execution.ID,
		"run_id":        execution.RunID,
		"flow_run_id":   execution.FlowRunID,
		"request_id":    strings.TrimSpace(execution.RequestID),
		"release_id":    execution.ReleaseID,
		"asset_cate_id": execution.AssetCateID,
		"start_node_id": strings.TrimSpace(execution.StartNodeID),
		"single_node":   execution.SingleNode == 1,
		"status":        strings.TrimSpace(execution.Status),
		"error":         strings.TrimSpace(execution.Error),
		"executed":      execution.Executed,
		"total":         execution.Total,
		"updated_at":    execution.UpdatedAt,
		"created_at":    execution.CreatedAt,
		"title":         workspaceExecutionTitle(execution),
	}
	if includeDetails {
		if plan := mapValue(jsonValue(execution.Plan, map[string]any{})); plan != nil {
			payload["execution_plan"] = plan
		}
		payload["pending_node"] = firstWorkspaceWaitingNode(nodeResults)
		payload["node_results"] = nodeResults
		payload["node_runs"] = nodeRuns
	}
	return payload
}

func workspaceExecutionTitle(execution *workspacemodel.Execution) string {
	if execution == nil {
		return ""
	}
	plan := mapValue(jsonValue(execution.Plan, map[string]any{}))
	for _, raw := range sliceValue(plan["nodes"]) {
		node := mapValue(raw)
		if textValue(node["id"]) != strings.TrimSpace(execution.StartNodeID) {
			continue
		}
		if title := textValue(node["title"]); title != "" {
			return title
		}
	}
	if execution.SingleNode == 1 {
		return "节点运行"
	}
	return "画布运行"
}

func workspaceExecutionRunIDs(rows []*workspacemodel.Execution) []uint64 {
	runIDs := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil && row.RunID > 0 {
			runIDs = append(runIDs, row.RunID)
		}
	}
	return uniqueWorkspaceRunIDs(runIDs)
}

func uniqueWorkspaceRunIDs(runIDs []uint64) []uint64 {
	result := make([]uint64, 0, len(runIDs))
	seen := make(map[uint64]struct{}, len(runIDs))
	for _, runID := range runIDs {
		if runID == 0 {
			continue
		}
		if _, exists := seen[runID]; exists {
			continue
		}
		seen[runID] = struct{}{}
		result = append(result, runID)
	}
	return result
}

func workspaceNodeResultsPayload(ctx context.Context, projectID uint64, runID uint64) map[string]any {
	nodeResults := workspaceNodeResults(ctx, projectID, runID)
	return map[string]any{
		"count":      len(nodeResults),
		"items":      nodeResults,
		"executions": workspaceNodeExecutions(ctx, projectID, runID),
	}
}

func boolInt16(value bool) int16 {
	if value {
		return 1
	}
	return 0
}

func intValue(raw any) int {
	value := uint64Value(raw)
	if value == 0 {
		return 0
	}
	return int(value)
}
