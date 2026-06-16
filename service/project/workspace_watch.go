package project

import (
	"context"
	"strings"
	"time"

	teammodel "my/package/bot/model/team"
	workspacemodel "my/package/bot/model/workspace"
)

const (
	workspaceRunWatchAttempts = 300
	workspaceRunWatchInterval = time.Second
)

func (s WorkspaceService) watchWorkspaceApproval(ctx context.Context, projectID uint64, approvalID uint64) {
	if projectID == 0 || approvalID == 0 {
		return
	}
	nodeExecution := workspacemodel.NewNodeExecutionModel().Find(ctx, map[string]any{
		"project_id":  projectID,
		"approval_id": approvalID,
	})
	if nodeExecution == nil || nodeExecution.RunID == 0 {
		return
	}
	markWorkspaceApprovalNodeRunning(ctx, nodeExecution)
	s.watchWorkspaceRun(ctx, nodeExecution.RunID, approvalID)
}

func (s WorkspaceService) watchWorkspaceRun(ctx context.Context, runID uint64, submittedApprovalID uint64) {
	if runID == 0 {
		return
	}
	for attempt := 0; attempt < workspaceRunWatchAttempts; attempt++ {
		run := teammodel.NewRunModel().Find(ctx, map[string]any{"id": runID})
		if run == nil || !workspaceRunWatchShouldContinue(ctx, run, submittedApprovalID) {
			return
		}
		_, _ = withWorkspaceRunLock(ctx, run.ProjectID, run.ID, func() (struct{}, error) {
			if refreshed := teammodel.NewRunModel().Find(ctx, map[string]any{"id": run.ID}); refreshed != nil {
				s.refreshWorkspaceRun(ctx, refreshed)
			}
			return struct{}{}, nil
		})
		run = teammodel.NewRunModel().Find(ctx, map[string]any{"id": runID})
		if run == nil || !workspaceRunWatchShouldContinue(ctx, run, submittedApprovalID) {
			return
		}
		select {
		case <-ctx.Done():
			return
		case <-time.After(workspaceRunWatchInterval):
		}
	}
}

func markWorkspaceApprovalNodeRunning(ctx context.Context, nodeExecution *workspacemodel.NodeExecution) {
	if nodeExecution == nil || nodeExecution.RunID == 0 || strings.TrimSpace(nodeExecution.NodeKey) == "" {
		return
	}
	now := time.Now()
	workspacemodel.NewNodeExecutionModel().Update(ctx, map[string]any{"id": nodeExecution.ID}, map[string]any{
		"status":     teammodel.RunStatusRunning,
		"error":      "",
		"updated_at": now,
	})
	if nodeExecution.NodeRunID > 0 {
		markWorkspaceNodeRun(ctx, nodeExecution.NodeRunID, teammodel.RunStatusRunning, nil, nil, "", nodeExecution.AgentRunID)
	}
	updateWorkspaceExecutionStatus(ctx, nodeExecution.RunID, teammodel.RunStatusRunning, "")
	teammodel.NewRunModel().Update(ctx, map[string]any{"id": nodeExecution.RunID}, map[string]any{
		"status":     teammodel.RunStatusRunning,
		"error":      "",
		"updated_at": now,
	})
}

func workspaceRunWatchShouldContinue(ctx context.Context, run *teammodel.Run, submittedApprovalID uint64) bool {
	if run == nil {
		return false
	}
	switch strings.TrimSpace(run.Status) {
	case teammodel.RunStatusPending:
		return true
	case teammodel.RunStatusRunning:
		if workspaceHasActiveNodeExecution(ctx, run.ProjectID, run.ID) {
			return true
		}
		return workspaceRunNeedsMoreResults(ctx, run)
	case teammodel.RunStatusWaiting:
		if submittedApprovalID == 0 {
			return false
		}
		waitingNode := firstWorkspaceWaitingNode(workspaceNodeResults(ctx, run.ProjectID, run.ID))
		if waitingNode == nil {
			return true
		}
		approvalID := firstUint64(
			uint64Value(valueAtPath(waitingNode, "approval", "id")),
			uint64Value(waitingNode["approval_id"]),
		)
		return approvalID == 0 || approvalID == submittedApprovalID
	default:
		return false
	}
}

func workspaceRunNeedsMoreResults(ctx context.Context, run *teammodel.Run) bool {
	if run == nil {
		return false
	}
	input := mapValue(jsonValue(run.Input, map[string]any{}))
	if input == nil {
		return false
	}
	plan := mapValue(input["execution_plan"])
	if plan == nil {
		return false
	}
	return workspaceRunStatusFromNodeResults(plan, workspaceNodeResults(ctx, run.ProjectID, run.ID)) == teammodel.RunStatusRunning
}
