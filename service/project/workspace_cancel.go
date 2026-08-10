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
	current := teammodel.NewRunModel().Find(ctx, map[string]any{
		"id":         run.ID,
		"project_id": run.ProjectID,
	})
	if current == nil {
		return nil, fmt.Errorf("运行不存在")
	}
	if !canvasRunStatusActive(current.Status) {
		if current.Status == teammodel.RunStatusCanceled {
			s.finishCanceledWorkspaceRun(ctx, current)
		}
		if execution := workspaceExecutionByRunID(ctx, current.ID); execution != nil {
			return workspaceExecutionPayload(
				ctx,
				s.syncWorkspaceExecutionRow(ctx, execution),
			), nil
		}
		return s.workspaceRunPayload(ctx, current.ProjectID, current), nil
	}
	run = current
	result, err := s.project.team.StopProjectRun(ctx, run.ProjectID, run.ID, run.RequestID)
	if err != nil {
		return nil, err
	}
	if canvasRunStatus(result) != teammodel.RunStatusCanceled {
		if execution := workspaceExecutionByRunID(ctx, run.ID); execution != nil {
			return workspaceExecutionPayload(
				ctx,
				s.syncWorkspaceExecutionRow(ctx, execution),
			), nil
		}
		return result, nil
	}

	s.finishCanceledWorkspaceRun(ctx, run)
	return result, nil
}

func (s WorkspaceService) StopAllCanvasRuns(ctx context.Context, projectID uint64) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	executions := workspacemodel.NewExecutionModel().Select(ctx, map[string]any{
		"project_id": project.ID,
		"status":     canvasRunActiveStatuses(),
	}, map[string]any{
		"order": "main.id desc",
	})
	parentRunIDs := workspaceExecutionRunIDs(executions)
	nodeExecutions := workspaceNodeExecutionRows(ctx, project.ID, parentRunIDs)
	nodeExecutionsByRunID := groupWorkspaceNodeExecutions(nodeExecutions)
	childReferences := activeWorkspaceChildRunReferences(nodeExecutions)
	childRuns := loadWorkspaceChildRuns(ctx, project.ID, childReferences)
	allRunIDs := append([]uint64(nil), parentRunIDs...)
	for _, reference := range childReferences {
		if childRun := childRuns.find(reference.ChildRunID, reference.ChildRequestID); childRun != nil {
			allRunIDs = append(allRunIDs, childRun.ID)
		}
	}
	stopResults := s.project.team.StopProjectRuns(ctx, project.ID, allRunIDs)
	items := make([]map[string]any, 0, len(executions))
	seenRunIDs := make(map[uint64]struct{}, len(executions))
	stoppedCount := 0
	failedCount := 0
	for _, execution := range executions {
		if execution == nil || execution.RunID == 0 {
			continue
		}
		if _, exists := seenRunIDs[execution.RunID]; exists {
			continue
		}
		seenRunIDs[execution.RunID] = struct{}{}
		item := map[string]any{
			"execution_id":  execution.ID,
			"run_id":        execution.RunID,
			"request_id":    strings.TrimSpace(execution.RequestID),
			"asset_cate_id": execution.AssetCateID,
			"status":        strings.TrimSpace(execution.Status),
		}
		stopResult, exists := stopResults[execution.RunID]
		if !exists || stopResult.Error != nil {
			item["error"] = "运行不存在"
			if stopResult.Error != nil {
				item["error"] = strings.TrimSpace(stopResult.Error.Error())
			}
			failedCount++
			items = append(items, item)
			continue
		}
		status := strings.TrimSpace(stopResult.Status)
		item["status"] = status
		if status == teammodel.RunStatusCanceled {
			s.finishCanceledWorkspaceRunWithRows(
				ctx,
				stopResult.Run,
				nodeExecutionsByRunID[execution.RunID],
				stopResult.NodeRuns,
				false,
			)
			stoppedCount++
		}
		items = append(items, item)
	}
	return map[string]any{
		"count":         len(items),
		"stopped_count": stoppedCount,
		"failed_count":  failedCount,
		"items":         items,
	}, nil
}

func groupWorkspaceNodeExecutions(rows []*workspacemodel.NodeExecution) map[uint64][]*workspacemodel.NodeExecution {
	result := make(map[uint64][]*workspacemodel.NodeExecution)
	for _, row := range rows {
		if row != nil && row.RunID > 0 {
			result[row.RunID] = append(result[row.RunID], row)
		}
	}
	return result
}

func activeWorkspaceChildRunReferences(rows []*workspacemodel.NodeExecution) []workspacePendingNode {
	result := make([]workspacePendingNode, 0, len(rows))
	for _, row := range rows {
		if row == nil || !canvasRunStatusActive(row.Status) {
			continue
		}
		childRunID := workspaceNodeExecutionChildRunIDFromRow(row.RunID, row)
		childRequestID := strings.TrimSpace(row.ChildRequestID)
		if childRunID == 0 && childRequestID == "" {
			continue
		}
		result = append(result, workspacePendingNode{
			Execution:      row,
			ChildRunID:     childRunID,
			ChildRequestID: childRequestID,
		})
	}
	return result
}

func (s WorkspaceService) finishCanceledWorkspaceRun(ctx context.Context, run *teammodel.Run) {
	if run == nil {
		return
	}
	s.finishCanceledWorkspaceRunWithRows(
		ctx,
		run,
		workspaceNodeExecutionRows(ctx, run.ProjectID, []uint64{run.ID}),
		teamNodeRuns(ctx, run.ID),
		true,
	)
}

func (s WorkspaceService) finishCanceledWorkspaceRunWithRows(
	ctx context.Context,
	run *teammodel.Run,
	nodeExecutions []*workspacemodel.NodeExecution,
	nodeRuns []teammodel.NodeRun,
	stopChildRuns bool,
) {
	if run == nil {
		return
	}
	s.finishWorkspaceActiveNodes(
		ctx,
		run,
		teammodel.RunStatusCanceled,
		"",
		nodeExecutions,
		nodeRuns,
		stopChildRuns,
	)
	finishWorkspaceFlowRun(ctx, workspaceFlowRunID(ctx, run.ID), teammodel.RunStatusCanceled, map[string]any{
		"run_id":     run.ID,
		"request_id": run.RequestID,
		"status":     teammodel.RunStatusCanceled,
	}, "")
	updateWorkspaceExecutionStatus(ctx, run.ID, teammodel.RunStatusCanceled, "")
}

func (s WorkspaceService) finishWorkspaceActiveNodes(
	ctx context.Context,
	run *teammodel.Run,
	status string,
	errorText string,
	nodeExecutions []*workspacemodel.NodeExecution,
	nodeRuns []teammodel.NodeRun,
	stopChildRuns bool,
) {
	if run == nil {
		return
	}
	now := time.Now()
	markedNodeRunIDs := make(map[uint64]struct{}, len(nodeExecutions))
	for _, execution := range nodeExecutions {
		if execution == nil || !canvasRunStatusActive(execution.Status) {
			continue
		}
		if stopChildRuns {
			childRunID := workspaceNodeExecutionChildRunIDFromRow(run.ID, execution)
			childRequestID := strings.TrimSpace(execution.ChildRequestID)
			if childRunID != run.ID && (childRunID > 0 || childRequestID != "") {
				_, _ = s.project.team.StopProjectRun(
					ctx,
					run.ProjectID,
					childRunID,
					childRequestID,
				)
			}
		}
		workspacemodel.NewNodeExecutionModel().Update(ctx, map[string]any{"id": execution.ID}, map[string]any{
			"status":      status,
			"error":       strings.TrimSpace(errorText),
			"finished_at": now,
			"updated_at":  now,
		})
		markWorkspaceNodeRun(ctx, execution.NodeRunID, status, nil, nil, errorText, execution.AgentRunID)
		if execution.NodeRunID > 0 {
			markedNodeRunIDs[execution.NodeRunID] = struct{}{}
		}
	}

	for _, nodeRun := range nodeRuns {
		if _, marked := markedNodeRunIDs[nodeRun.ID]; !marked && canvasRunStatusActive(nodeRun.Status) {
			markWorkspaceNodeRun(ctx, nodeRun.ID, status, nil, nil, errorText, nodeRun.AgentRunID)
		}
	}
}

func teamNodeRuns(ctx context.Context, runID uint64) []teammodel.NodeRun {
	rows := teammodel.NewNodeRunModel().Select(ctx, map[string]any{"run_id": runID})
	result := make([]teammodel.NodeRun, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func canvasRunStatusActive(status string) bool {
	switch strings.TrimSpace(status) {
	case teammodel.RunStatusPending, teammodel.RunStatusRunning, teammodel.RunStatusWaiting:
		return true
	default:
		return false
	}
}

func canvasRunActiveStatuses() []string {
	return []string{
		teammodel.RunStatusPending,
		teammodel.RunStatusRunning,
		teammodel.RunStatusWaiting,
	}
}

func workspaceRunCanceled(ctx context.Context, runID uint64) bool {
	if runID == 0 {
		return false
	}
	ctx = detachedWorkspaceContext(ctx)
	run := teammodel.NewRunModel().Find(ctx, map[string]any{"id": runID})
	return run != nil && strings.TrimSpace(run.Status) == teammodel.RunStatusCanceled
}
