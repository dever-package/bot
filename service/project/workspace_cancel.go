package project

import (
	"context"
	"fmt"
	"strings"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
	workspacemodel "github.com/dever-package/bot/model/workspace"
)

func (s WorkspaceService) StopCanvasRun(ctx context.Context, run *teammodel.Run) (map[string]any, error) {
	if run == nil || run.ProjectID == 0 || run.ID == 0 {
		return nil, fmt.Errorf("运行不存在")
	}
	result, err := s.project.team.StopProjectRun(ctx, run.ProjectID, run.ID, run.RequestID)
	if err != nil {
		return nil, err
	}

	s.finishWorkspaceActiveNodes(ctx, run, teammodel.RunStatusCanceled, "")
	finishWorkspaceFlowRun(ctx, workspaceFlowRunID(ctx, run.ID), teammodel.RunStatusCanceled, map[string]any{
		"run_id":     run.ID,
		"request_id": run.RequestID,
		"status":     teammodel.RunStatusCanceled,
	}, "")
	updateWorkspaceExecutionStatus(ctx, run.ID, teammodel.RunStatusCanceled, "")
	return result, nil
}

func (s WorkspaceService) finishWorkspaceActiveNodes(ctx context.Context, run *teammodel.Run, status string, errorText string) {
	if run == nil {
		return
	}
	now := time.Now()
	nodeExecutions := workspacemodel.NewNodeExecutionModel().Select(ctx, map[string]any{
		"project_id": run.ProjectID,
		"run_id":     run.ID,
	})
	for _, execution := range nodeExecutions {
		if execution == nil || !canvasRunStatusActive(execution.Status) {
			continue
		}
		childRunID := workspaceNodeExecutionChildRunID(ctx, run.ProjectID, run.ID, execution.NodeKey)
		childRequestID := strings.TrimSpace(execution.ChildRequestID)
		if childRunID != run.ID && (childRunID > 0 || childRequestID != "") {
			_, _ = s.project.team.StopProjectRun(
				ctx,
				run.ProjectID,
				childRunID,
				childRequestID,
			)
		}
		workspacemodel.NewNodeExecutionModel().Update(ctx, map[string]any{"id": execution.ID}, map[string]any{
			"status":      status,
			"error":       strings.TrimSpace(errorText),
			"finished_at": now,
			"updated_at":  now,
		})
		markWorkspaceNodeRun(ctx, execution.NodeRunID, status, nil, nil, errorText, execution.AgentRunID)
	}

	for _, nodeRun := range teammodel.NewNodeRunModel().Select(ctx, map[string]any{"run_id": run.ID}) {
		if nodeRun != nil && canvasRunStatusActive(nodeRun.Status) {
			markWorkspaceNodeRun(ctx, nodeRun.ID, status, nil, nil, errorText, nodeRun.AgentRunID)
		}
	}
}

func canvasRunStatusActive(status string) bool {
	switch strings.TrimSpace(status) {
	case teammodel.RunStatusPending, teammodel.RunStatusRunning, teammodel.RunStatusWaiting:
		return true
	default:
		return false
	}
}

func workspaceRunCanceled(ctx context.Context, runID uint64) bool {
	if runID == 0 {
		return false
	}
	run := teammodel.NewRunModel().Find(ctx, map[string]any{"id": runID})
	return run != nil && strings.TrimSpace(run.Status) == teammodel.RunStatusCanceled
}
