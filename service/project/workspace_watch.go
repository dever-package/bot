package project

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
	workspacemodel "github.com/dever-package/bot/model/workspace"
	runtimescope "github.com/dever-package/bot/service/agent/runtime/scope"
	botstream "github.com/dever-package/bot/service/stream"
	frontstream "github.com/dever-package/front/service/stream"
)

const (
	workspaceRunWatchMinInterval  = time.Second
	workspaceRunWatchMaxInterval  = 5 * time.Second
	workspaceRunWatchEventStreams = 16
)

var workspaceRunWatchers sync.Map

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
	if workspaceRunCanceled(ctx, nodeExecution.RunID) || !markWorkspaceApprovalNodeRunning(ctx, nodeExecution) {
		return
	}
	s.watchWorkspaceRun(ctx, nodeExecution.RunID, approvalID)
}

func (s WorkspaceService) watchWorkspaceInteraction(ctx context.Context, projectID uint64, childRunID uint64) {
	if projectID == 0 || childRunID == 0 {
		return
	}
	nodeExecution := workspacemodel.NewNodeExecutionModel().Find(ctx, map[string]any{
		"project_id":   projectID,
		"child_run_id": childRunID,
	})
	if nodeExecution == nil || nodeExecution.RunID == 0 {
		return
	}
	if workspaceRunCanceled(ctx, nodeExecution.RunID) || !markWorkspaceApprovalNodeRunning(ctx, nodeExecution) {
		return
	}
	s.watchWorkspaceRun(ctx, nodeExecution.RunID, 0)
}

func (s WorkspaceService) watchWorkspaceRun(ctx context.Context, runID uint64, submittedApprovalID uint64) {
	s.watchWorkspaceRunWithRecovery(ctx, runID, submittedApprovalID, false)
}

func (s WorkspaceService) watchWorkspaceRunRecovery(ctx context.Context, runID uint64) {
	s.watchWorkspaceRunWithRecovery(ctx, runID, 0, true)
}

func (s WorkspaceService) watchWorkspaceRunWithRecovery(ctx context.Context, runID uint64, submittedApprovalID uint64, recovering bool) {
	if runID == 0 {
		return
	}
	if _, loaded := workspaceRunWatchers.LoadOrStore(runID, struct{}{}); loaded {
		return
	}
	defer workspaceRunWatchers.Delete(runID)

	leaseContext, stopLease, claimed := startWorkspaceRunLease(ctx, runID)
	if !claimed {
		return
	}
	defer stopLease()
	ctx = leaseContext
	// 恢复使用提交者的持久身份，Scope.Server 保留租约上下文及其取消信号。
	run := teammodel.NewRunModel().Find(ctx, map[string]any{"id": runID})
	if run == nil {
		return
	}
	serverContext, err := (runtimescope.Scope{ActorType: run.ActorType, ActorID: run.ActorID, SiteKey: run.SiteKey}).Server(ctx, nil)
	if err != nil {
		reportWorkspacePersistenceError(runID, err)
		return
	}
	if serverContext != nil {
		ctx = serverContext.Context()
	}
	pollInterval := workspaceRunWatchMinInterval
	eventCursors := map[string]string{}

	for {
		run := teammodel.NewRunModel().Find(ctx, map[string]any{"id": runID}, map[string]any{
			"field": "main.id,main.project_id,main.status",
		})
		if !workspaceRunStatusAllowsRefresh(run, submittedApprovalID) {
			return
		}
		refreshState := workspaceRunRefreshState{}
		var refreshedRun *teammodel.Run
		_, _ = withWorkspaceRunLock(ctx, run.ProjectID, run.ID, func() (struct{}, error) {
			refreshedRun = teammodel.NewRunModel().Find(ctx, map[string]any{"id": run.ID})
			if workspaceRunStatusAllowsRefresh(refreshedRun, submittedApprovalID) {
				refreshState = s.refreshWorkspaceRun(ctx, refreshedRun, recovering)
			}
			return struct{}{}, nil
		})
		if refreshedRun == nil || !workspaceRunWatchShouldContinue(ctx, refreshedRun, submittedApprovalID) {
			return
		}
		if refreshState.Changed {
			pollInterval = workspaceRunWatchMinInterval
		}
		if s.waitForWorkspaceRunActivity(ctx, refreshState.ChildRequestIDs, eventCursors, pollInterval) {
			pollInterval = workspaceRunWatchMinInterval
		} else {
			pollInterval = nextWorkspaceRunWatchInterval(pollInterval)
		}
	}
}

func workspaceRunStatusAllowsRefresh(run *teammodel.Run, submittedApprovalID uint64) bool {
	if run == nil {
		return false
	}
	switch strings.TrimSpace(run.Status) {
	case teammodel.RunStatusPending, teammodel.RunStatusRunning:
		return true
	case teammodel.RunStatusWaiting:
		return submittedApprovalID > 0
	default:
		return false
	}
}

func (s WorkspaceService) waitForWorkspaceRunActivity(
	ctx context.Context,
	requestIDs []string,
	cursors map[string]string,
	timeout time.Duration,
) bool {
	if timeout <= 0 {
		timeout = workspaceRunWatchMinInterval
	}
	requestIDs = uniqueWorkspaceRequestIDs(requestIDs)
	if len(requestIDs) > workspaceRunWatchEventStreams {
		requestIDs = requestIDs[:workspaceRunWatchEventStreams]
	}
	deadline := time.Now().Add(timeout)
	if len(requestIDs) == 0 {
		waitForWorkspaceRunDeadline(ctx, deadline)
		return false
	}

	newCursors := make([]frontstream.ReadCursor, 0, len(requestIDs))
	for _, requestID := range requestIDs {
		if _, exists := cursors[requestID]; exists {
			continue
		}
		cursors[requestID] = "0-0"
		newCursors = append(newCursors, frontstream.ReadCursor{RequestID: requestID, LastID: "0-0"})
	}
	if len(newCursors) > 0 {
		// A negative block duration makes XREAD non-blocking. Existing entries
		// only establish the cursor; the database refresh above already handled
		// their state.
		if entries, err := s.streams.ReadMany(ctx, newCursors, 2000, -time.Nanosecond); err == nil {
			updateWorkspaceRunEventCursors(cursors, entries)
		}
	}

	remaining := time.Until(deadline)
	if remaining < time.Millisecond {
		return false
	}
	entries, err := s.streams.ReadMany(ctx, workspaceRunReadCursors(requestIDs, cursors), 100, remaining)
	if err != nil {
		waitForWorkspaceRunDeadline(ctx, deadline)
		return false
	}
	return updateWorkspaceRunEventCursors(cursors, entries)
}

func workspaceRunReadCursors(requestIDs []string, cursors map[string]string) []frontstream.ReadCursor {
	result := make([]frontstream.ReadCursor, 0, len(requestIDs))
	for _, requestID := range requestIDs {
		result = append(result, frontstream.ReadCursor{
			RequestID: requestID,
			LastID:    cursors[requestID],
		})
	}
	return result
}

func updateWorkspaceRunEventCursors(cursors map[string]string, entries []frontstream.ReadEntry) bool {
	signaled := false
	for _, entry := range entries {
		if entry.ID != "" {
			cursors[entry.RequestID] = entry.ID
		}
		if workspaceRunEventSignalsRefresh(entry.Payload) {
			signaled = true
		}
	}
	return signaled
}

func workspaceRunEventSignalsRefresh(payload map[string]any) bool {
	if strings.EqualFold(textValue(payload["type"]), botstream.EventTypeResult) {
		return true
	}
	output := mapValue(payload["output"])
	switch textValue(output["event"]) {
	case botstream.EventRunFinished, botstream.EventWaiting, botstream.EventCancel:
		return true
	}
	switch firstText(output["run_status"], output["status"]) {
	case teammodel.RunStatusWaiting, teammodel.RunStatusSuccess, teammodel.RunStatusFail, teammodel.RunStatusCanceled:
		return true
	default:
		return false
	}
}

func waitForWorkspaceRunDeadline(ctx context.Context, deadline time.Time) {
	wait := time.Until(deadline)
	if wait <= 0 {
		return
	}
	timer := time.NewTimer(wait)
	defer timer.Stop()
	select {
	case <-ctx.Done():
		return
	case <-timer.C:
		return
	}
}

func nextWorkspaceRunWatchInterval(current time.Duration) time.Duration {
	if current < workspaceRunWatchMinInterval {
		return workspaceRunWatchMinInterval
	}
	next := current * 2
	if next > workspaceRunWatchMaxInterval {
		return workspaceRunWatchMaxInterval
	}
	return next
}

func markWorkspaceApprovalNodeRunning(ctx context.Context, nodeExecution *workspacemodel.NodeExecution) bool {
	if nodeExecution == nil || nodeExecution.RunID == 0 || strings.TrimSpace(nodeExecution.NodeKey) == "" {
		return false
	}
	err := workspaceRecordTransaction(ctx, func(tx context.Context) error {
		run := lockWorkspaceRun(tx, nodeExecution.RunID)
		if run == nil || !canvasRunStatusActive(run.Status) {
			return fmt.Errorf("画布运行已结束")
		}
		current := workspacemodel.NewNodeExecutionModel().Find(tx, map[string]any{"id": nodeExecution.ID, "run_id": run.ID})
		if current == nil || !canvasRunStatusActive(current.Status) {
			return fmt.Errorf("画布节点已结束")
		}
		now := time.Now()
		if teammodel.NewRunModel().Update(tx, map[string]any{"id": run.ID, "status": run.Status}, map[string]any{"status": teammodel.RunStatusRunning, "error": "", "updated_at": now}) != 1 {
			return fmt.Errorf("唤醒画布运行失败")
		}
		if current.NodeRunID > 0 {
			nodeRun := teammodel.NewNodeRunModel().Find(tx, map[string]any{"id": current.NodeRunID, "run_id": run.ID})
			if err := writeWorkspaceNodeRun(tx, nodeRun, teammodel.RunStatusRunning, nil, nil, "", current.AgentRunID); err != nil {
				return err
			}
		}
		if workspacemodel.NewNodeExecutionModel().Update(tx, map[string]any{"id": current.ID, "status": canvasRunActiveStatuses()}, map[string]any{"status": teammodel.RunStatusRunning, "error": "", "updated_at": now}) != 1 {
			return fmt.Errorf("唤醒画布节点失败")
		}
		run.Status, run.Error, run.UpdatedAt = teammodel.RunStatusRunning, "", now
		return persistWorkspaceRunProjections(tx, run)
	})
	reportWorkspacePersistenceError(nodeExecution.RunID, err)
	return err == nil
}

func workspaceApprovalRunCanceled(ctx context.Context, projectID uint64, approvalID uint64) bool {
	if projectID == 0 || approvalID == 0 {
		return false
	}
	nodeExecution := workspacemodel.NewNodeExecutionModel().Find(ctx, map[string]any{
		"project_id":  projectID,
		"approval_id": approvalID,
	})
	return nodeExecution != nil && workspaceRunCanceled(ctx, nodeExecution.RunID)
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
