package project

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	teammodel "my/package/bot/model/team"
	workspacemodel "my/package/bot/model/workspace"
)

const workspaceCanvasRunMode = "workspace_canvas"

func createWorkspaceRun(ctx context.Context, projectID uint64, teamID uint64, releaseID uint64, requestID string, req CanvasRunRequest, plan map[string]any) (*teammodel.Run, error) {
	requestID = normalizeWorkspaceRequestID(requestID)
	if requestID == "" {
		requestID = uuid.NewString()
	}
	now := time.Now()
	runID := uint64(teammodel.NewRunModel().Insert(ctx, map[string]any{
		"request_id": requestID,
		"project_id": projectID,
		"team_id":    teamID,
		"release_id": releaseID,
		"input": jsonText(map[string]any{
			"_mode":          workspaceCanvasRunMode,
			"_asset_cate_id": req.AssetCateID,
			"_start_node_id": strings.TrimSpace(req.StartNodeID),
			"_single_node":   req.SingleNode,
			"input":          cloneInput(req.Input),
			"canvas":         req.Canvas,
			"execution_plan": plan,
		}, "{}"),
		"output":     "{}",
		"error":      "",
		"status":     teammodel.RunStatusRunning,
		"started_at": now,
		"created_at": now,
		"updated_at": now,
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
	input := mapValue(jsonValue(run.Input, map[string]any{}))
	if input != nil {
		if plan := mapValue(input["execution_plan"]); plan != nil {
			payload["execution_plan"] = plan
		}
		payload["asset_cate_id"] = uint64Value(input["_asset_cate_id"])
		payload["start_node_id"] = strings.TrimSpace(textValue(input["_start_node_id"]))
	}
	nodeResults := workspaceNodeResults(ctx, projectID, run.ID)
	payload["node_results"] = nodeResults
	payload["node_runs"] = workspaceNodeRunPayloads(ctx, run.ID)
	payload["pending_node"] = firstWorkspaceWaitingNode(nodeResults)
	return payload
}

type CanvasExecutionQuery struct {
	ProjectID   uint64
	AssetCateID uint64
	Status      string
	Limit       int
}

func (s WorkspaceService) CanvasExecutionList(ctx context.Context, query CanvasExecutionQuery) (map[string]any, error) {
	project, err := requireProject(ctx, query.ProjectID)
	if err != nil {
		return nil, err
	}
	filter := map[string]any{"project_id": project.ID}
	if query.AssetCateID > 0 {
		filter["asset_cate_id"] = query.AssetCateID
	}
	if strings.TrimSpace(query.Status) != "" {
		filter["status"] = strings.TrimSpace(query.Status)
	}
	limit := query.Limit
	if limit <= 0 || limit > 50 {
		limit = 20
	}
	rows := workspacemodel.NewExecutionModel().Select(ctx, filter, map[string]any{
		"order": "main.id desc",
		"limit": limit,
	})
	items := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		items = append(items, workspaceExecutionListPayload(ctx, row))
	}
	return map[string]any{
		"count": len(items),
		"items": items,
	}, nil
}

func (s WorkspaceService) CanvasExecution(ctx context.Context, projectID uint64, executionID uint64, runID uint64, requestID string) (map[string]any, error) {
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
	return workspaceExecutionPayload(ctx, execution), nil
}

func (s WorkspaceService) CanvasNodeResults(ctx context.Context, projectID uint64, executionID uint64, runID uint64, requestID string) (map[string]any, error) {
	execution, err := s.canvasExecutionRow(ctx, projectID, executionID, runID, requestID)
	if err != nil {
		return nil, err
	}
	return workspaceNodeResultsPayload(ctx, execution.ProjectID, execution.RunID), nil
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

func finishWorkspaceRun(ctx context.Context, runID uint64, status string, output map[string]any, errorText string) {
	if runID == 0 {
		return
	}
	if strings.TrimSpace(status) == "" {
		status = teammodel.RunStatusSuccess
	}
	record := map[string]any{
		"status":     status,
		"output":     jsonText(output, "{}"),
		"error":      strings.TrimSpace(errorText),
		"updated_at": time.Now(),
	}
	if status != teammodel.RunStatusRunning && status != teammodel.RunStatusPending && status != teammodel.RunStatusWaiting {
		record["finished_at"] = time.Now()
	}
	teammodel.NewRunModel().Update(ctx, map[string]any{"id": runID}, record)
	finishWorkspaceExecution(ctx, runID, status, output, errorText)
}

func isWorkspaceCanvasRun(run *teammodel.Run) bool {
	if run == nil {
		return false
	}
	input := mapValue(jsonValue(run.Input, map[string]any{}))
	return textValue(input["_mode"]) == workspaceCanvasRunMode
}
