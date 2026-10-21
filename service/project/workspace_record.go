package project

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	teammodel "github.com/dever-package/bot/model/team"
	workspacemodel "github.com/dever-package/bot/model/workspace"
	runtimescope "github.com/dever-package/bot/service/agent/runtime/scope"
)

const (
	workspaceCanvasRunMode       = "workspace_canvas"
	canvasExecutionScopeRecovery = "recovery"
	canvasExecutionScopeActive   = "active"
	canvasExecutionScopeHistory  = "history"
	workspaceExecutionListFields = "main.id,main.project_id,main.canvas_id,main.asset_cate_id,main.release_id,main.run_id,main.flow_run_id,main.request_id,main.start_node_id,main.single_node,main.status,main.executed,main.total,main.input,main.output,main.plan,main.error,main.updated_at,main.created_at"
)

func createWorkspaceRun(ctx context.Context, projectID uint64, teamID uint64, releaseID uint64, requestID string, req CanvasRunRequest, plan map[string]any) (*teammodel.Run, error) {
	requestID = normalizeWorkspaceRequestID(requestID)
	if requestID == "" {
		requestID = uuid.NewString()
	}
	now := time.Now()
	scope := runtimescope.FromContext(ctx)
	runID := uint64(teammodel.NewRunModel().Insert(ctx, map[string]any{
		"request_id": requestID,
		"actor_type": scope.ActorType,
		"actor_id":   scope.ActorID,
		"site_key":   scope.SiteKey,
		"project_id": projectID,
		"team_id":    teamID,
		"release_id": releaseID,
		"input": jsonText(map[string]any{
			"_mode":                  workspaceCanvasRunMode,
			"_canvas_id":             req.CanvasID,
			"_asset_cate_id":         req.AssetCateID,
			"_start_node_id":         strings.TrimSpace(req.StartNodeID),
			"_display_start_node_id": canvasRunDisplayStartNodeID(req),
			"_single_node":           req.SingleNode,
			"_target_node_ids":       append([]string(nil), req.TargetNodeIDs...),
			"_execution_scope":       strings.TrimSpace(req.ExecutionScope),
			"input":                  cloneInput(req.Input),
			"canvas":                 req.Canvas,
			"execution_plan":         plan,
		}, "{}"),
		"output":                 "{}",
		"error":                  "",
		"status":                 teammodel.RunStatusRunning,
		"execution_owner":        workspaceRunLockOwner,
		"execution_version":      1,
		"execution_heartbeat_at": now,
		"execution_expires_at":   now.Add(workspaceRunLeaseDuration),
		"started_at":             now,
		"created_at":             now,
		"updated_at":             now,
	}))
	if runID == 0 {
		return nil, fmt.Errorf("创建画布运行失败")
	}
	run := teammodel.NewRunModel().Find(ctx, map[string]any{"id": runID})
	if run == nil {
		return nil, fmt.Errorf("读取画布运行失败")
	}
	return run, nil
}

func normalizeWorkspaceRequestID(requestID string) string {
	requestID = strings.TrimSpace(requestID)
	if len(requestID) > 64 {
		return requestID[:64]
	}
	return requestID
}

func findWorkspaceRunByRequestID(ctx context.Context, projectID uint64, requestID string) *teammodel.Run {
	requestID = strings.TrimSpace(requestID)
	if projectID == 0 || requestID == "" {
		return nil
	}
	rows := teammodel.NewRunModel().Select(ctx, map[string]any{
		"project_id": projectID,
		"request_id": requestID,
	})
	for _, run := range rows {
		if isWorkspaceCanvasRun(run) {
			return run
		}
	}
	return nil
}

func findWorkspaceRunForStatus(ctx context.Context, projectID uint64, runID uint64, requestID string) *teammodel.Run {
	if projectID == 0 {
		return nil
	}
	if runID > 0 {
		run := teammodel.NewRunModel().Find(ctx, map[string]any{
			"id":         runID,
			"project_id": projectID,
		})
		if isWorkspaceCanvasRun(run) {
			return run
		}
		return nil
	}
	return findWorkspaceRunByRequestID(ctx, projectID, requestID)
}

func (s WorkspaceService) workspaceRunPayload(ctx context.Context, projectID uint64, run *teammodel.Run) map[string]any {
	if run == nil {
		return map[string]any{}
	}
	output := jsonValue(run.Output, map[string]any{})
	payload := mapValue(output)
	if payload == nil {
		payload = map[string]any{}
	}
	payload["run_id"] = run.ID
	payload["request_id"] = strings.TrimSpace(run.RequestID)
	payload["release_id"] = run.ReleaseID
	payload["status"] = strings.TrimSpace(run.Status)
	payload["error"] = strings.TrimSpace(run.Error)
	input := mapValue(jsonValue(run.Input, map[string]any{}))
	if input != nil {
		if plan := mapValue(input["execution_plan"]); plan != nil {
			payload["execution_plan"] = plan
		}
		payload["asset_cate_id"] = uint64Value(input["_asset_cate_id"])
		payload["canvas_id"] = uint64Value(input["_canvas_id"])
		payload["start_node_id"] = workspaceRunDisplayStartNodeID(input)
		payload["execution_scope"] = strings.TrimSpace(textValue(input["_execution_scope"]))
	}
	nodeResults := workspaceNodeResults(ctx, projectID, run.ID)
	payload["node_results"] = nodeResults
	payload["node_runs"] = workspaceNodeRunPayloads(ctx, run.ID)
	payload["pending_node"] = firstWorkspaceWaitingNode(nodeResults)
	return payload
}

type CanvasExecutionQuery struct {
	ProjectID   uint64
	CanvasID    uint64
	AssetCateID uint64
	Status      string
	Scope       string
	RunIDs      string
	BeforeID    uint64
	Limit       int
	SummaryOnly bool
}

func (s WorkspaceService) CanvasExecutionList(ctx context.Context, query CanvasExecutionQuery) (map[string]any, error) {
	project, err := requireProject(ctx, query.ProjectID)
	if err != nil {
		return nil, err
	}
	filter := map[string]any{"project_id": project.ID}
	scope := normalizeCanvasExecutionScope(query.Scope)
	if query.CanvasID > 0 {
		canvas, canvasErr := requireProjectCanvasWithFields(ctx, project.ID, query.CanvasID, query.AssetCateID, canvasSummaryFields)
		if canvasErr != nil {
			return nil, canvasErr
		}
		filter["canvas_id"] = canvas.ID
	}
	if query.AssetCateID > 0 {
		filter["asset_cate_id"] = query.AssetCateID
	}
	runIDs := normalizeCanvasExecutionRunIDs(query.RunIDs)
	if strings.TrimSpace(query.Status) != "" {
		filter["status"] = strings.TrimSpace(query.Status)
	} else if scope == canvasExecutionScopeActive && len(runIDs) == 0 {
		filter["status"] = canvasRunActiveStatuses()
	}
	if scope != canvasExecutionScopeHistory && len(runIDs) > 0 {
		filter["run_id"] = runIDs
	}
	if query.BeforeID > 0 {
		filter["id"] = map[string]any{"lt": query.BeforeID}
	}
	limit := query.Limit
	if limit <= 0 || limit > 50 {
		limit = 20
	}
	queryLimit := limit
	queryLimit++
	rows := workspacemodel.NewExecutionModel().Select(ctx, filter, map[string]any{
		"field": workspaceExecutionListFields,
		"order": "main.id desc",
		"limit": queryLimit,
	})
	hasMore := len(rows) > limit
	if hasMore {
		rows = rows[:limit]
	}
	selected := make([]*workspacemodel.Execution, 0, len(rows))
	for _, row := range projectWorkspaceExecutions(ctx, rows) {
		if row == nil {
			continue
		}
		if strings.TrimSpace(query.Status) != "" && strings.TrimSpace(row.Status) != strings.TrimSpace(query.Status) {
			continue
		}
		if scope == canvasExecutionScopeActive && len(runIDs) == 0 && !canvasRunStatusActive(row.Status) {
			continue
		}
		selected = append(selected, row)
	}

	includeDetails := scope != canvasExecutionScopeHistory && !query.SummaryOnly
	resultsByRunID := map[uint64][]map[string]any{}
	nodeRunsByRunID := map[uint64][]map[string]any{}
	if includeDetails {
		runIDs := workspaceExecutionRunIDs(selected)
		resultsByRunID = workspaceNodeResultsByRunIDs(ctx, project.ID, runIDs)
		nodeRunsByRunID = workspaceNodeRunPayloadsByRunIDs(ctx, runIDs)
	}
	items := make([]map[string]any, 0, len(selected))
	var beforeID uint64
	for _, row := range rows {
		if row != nil {
			beforeID = row.ID
		}
	}
	for _, row := range selected {
		var nodeResults []map[string]any
		if includeDetails {
			nodeResults = workspaceProjectedNodeResults(row, resultsByRunID[row.RunID])
		}
		items = append(items, workspaceExecutionListPayload(
			row,
			nodeResults,
			nodeRunsByRunID[row.RunID],
			includeDetails,
		))
	}
	return map[string]any{
		"count":     len(items),
		"items":     items,
		"has_more":  hasMore,
		"before_id": beforeID,
	}, nil
}

func normalizeCanvasExecutionRunIDs(raw string) []uint64 {
	parts := strings.Split(raw, ",")
	runIDs := make([]uint64, 0, len(parts))
	for _, part := range parts {
		if runID := uint64Value(strings.TrimSpace(part)); runID > 0 {
			runIDs = append(runIDs, runID)
		}
	}
	return uniqueWorkspaceRunIDs(runIDs)
}

func normalizeCanvasExecutionScope(scope string) string {
	switch strings.ToLower(strings.TrimSpace(scope)) {
	case canvasExecutionScopeActive:
		return canvasExecutionScopeActive
	case canvasExecutionScopeHistory:
		return canvasExecutionScopeHistory
	default:
		return canvasExecutionScopeRecovery
	}
}

func (s WorkspaceService) CanvasExecution(ctx context.Context, projectID uint64, executionID uint64, runID uint64, requestID string) (map[string]any, error) {
	execution, err := s.canvasExecutionRow(ctx, projectID, executionID, runID, requestID)
	if err != nil {
		return nil, err
	}
	execution = s.workspaceExecutionWithRunState(ctx, execution)
	return workspaceExecutionPayload(ctx, execution), nil
}

func (s WorkspaceService) CanvasNodeResults(ctx context.Context, projectID uint64, executionID uint64, runID uint64, requestID string) (map[string]any, error) {
	execution, err := s.canvasExecutionRow(ctx, projectID, executionID, runID, requestID)
	if err != nil {
		return nil, err
	}
	execution = s.workspaceExecutionWithRunState(ctx, execution)
	payload := workspaceNodeResultsPayload(ctx, execution.ProjectID, execution.RunID)
	results := workspaceProjectedNodeResults(execution, workspaceNodeResultMaps(payload["items"]))
	payload["items"], payload["count"] = results, len(results)
	return payload, nil
}

func (s WorkspaceService) canvasExecutionRow(ctx context.Context, projectID uint64, executionID uint64, runID uint64, requestID string) (*workspacemodel.Execution, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	var execution *workspacemodel.Execution
	if executionID > 0 {
		execution = workspacemodel.NewExecutionModel().Find(ctx, map[string]any{
			"id":         executionID,
			"project_id": project.ID,
		})
	} else if runID > 0 {
		execution = workspacemodel.NewExecutionModel().Find(ctx, map[string]any{
			"run_id":     runID,
			"project_id": project.ID,
		})
	} else {
		execution = workspaceExecutionByRequestID(ctx, project.ID, requestID)
	}
	if execution == nil {
		return nil, fmt.Errorf("画布执行不存在")
	}
	return execution, nil
}

func (s WorkspaceService) workspaceExecutionWithRunState(ctx context.Context, execution *workspacemodel.Execution) *workspacemodel.Execution {
	if execution == nil || execution.RunID == 0 {
		return execution
	}
	projected := projectWorkspaceExecutions(ctx, []*workspacemodel.Execution{execution})
	return projected[0]
}

func isWorkspaceCanvasRun(run *teammodel.Run) bool {
	if run == nil {
		return false
	}
	input := mapValue(jsonValue(run.Input, map[string]any{}))
	return textValue(input["_mode"]) == workspaceCanvasRunMode
}
