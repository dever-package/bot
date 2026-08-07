package project

import (
	"context"
	"strings"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
	workspacemodel "github.com/dever-package/bot/model/workspace"
)

const (
	defaultWorkspaceRecoveryLimit = 64
	maxWorkspaceRecoveryLimit     = 256
)

type WorkspaceRecoveryStats struct {
	Scanned    int `json:"scanned"`
	Recovered  int `json:"recovered"`
	Reconciled int `json:"reconciled"`
}

// RecoverOrphanedCanvasRuns schedules expired canvas runs for lease-protected recovery.
// It only reads the active execution index; status/detail list APIs remain pure reads.
func (s WorkspaceService) RecoverOrphanedCanvasRuns(ctx context.Context, now time.Time, limit int) WorkspaceRecoveryStats {
	if ctx == nil {
		ctx = context.Background()
	}
	if now.IsZero() {
		now = time.Now()
	}
	limit = normalizeWorkspaceRecoveryLimit(limit)
	executions := workspacemodel.NewExecutionModel().Select(ctx, map[string]any{
		"status": []string{teammodel.RunStatusPending, teammodel.RunStatusRunning},
	}, map[string]any{
		"order":    "main.updated_at asc, main.id asc",
		"page":     1,
		"pageSize": limit,
	})
	stats := WorkspaceRecoveryStats{Scanned: len(executions)}
	if len(executions) == 0 {
		return stats
	}

	runIDs := make([]uint64, 0, len(executions))
	for _, execution := range executions {
		if execution != nil && execution.RunID > 0 {
			runIDs = append(runIDs, execution.RunID)
		}
	}
	runsByID := workspaceRecoveryRunsByID(ctx, uniqueWorkspaceRunIDs(runIDs))
	for _, execution := range executions {
		if execution == nil || execution.RunID == 0 {
			continue
		}
		run := runsByID[execution.RunID]
		if reconcileWorkspaceRecoveryExecution(ctx, execution, run) {
			stats.Reconciled++
			continue
		}
		if !isWorkspaceCanvasRun(run) || !workspaceRunExecutionOrphaned(run, now) {
			continue
		}
		stats.Recovered++
		go s.watchWorkspaceRunRecovery(detachedWorkspaceContext(ctx), run.ID)
	}
	return stats
}

func normalizeWorkspaceRecoveryLimit(limit int) int {
	if limit < 1 {
		return defaultWorkspaceRecoveryLimit
	}
	if limit > maxWorkspaceRecoveryLimit {
		return maxWorkspaceRecoveryLimit
	}
	return limit
}

func workspaceRecoveryRunsByID(ctx context.Context, runIDs []uint64) map[uint64]*teammodel.Run {
	result := make(map[uint64]*teammodel.Run, len(runIDs))
	if len(runIDs) == 0 {
		return result
	}
	for _, run := range teammodel.NewRunModel().Select(ctx, map[string]any{"id": runIDs}) {
		if run != nil {
			result[run.ID] = run
		}
	}
	return result
}

func reconcileWorkspaceRecoveryExecution(ctx context.Context, execution *workspacemodel.Execution, run *teammodel.Run) bool {
	if execution == nil {
		return false
	}
	if run == nil || !isWorkspaceCanvasRun(run) {
		updateWorkspaceExecutionStatus(ctx, execution.RunID, teammodel.RunStatusFail, "画布运行记录不存在，请重新执行")
		return true
	}
	switch strings.TrimSpace(run.Status) {
	case teammodel.RunStatusWaiting:
		updateWorkspaceExecutionStatus(ctx, run.ID, teammodel.RunStatusWaiting, strings.TrimSpace(run.Error))
		return true
	case teammodel.RunStatusSuccess, teammodel.RunStatusFail, teammodel.RunStatusCanceled:
		output := mapValue(jsonValue(run.Output, map[string]any{}))
		if output == nil {
			output = map[string]any{}
		}
		if intValue(output["executed"]) == 0 {
			output["executed"] = len(workspaceNodeResults(ctx, execution.ProjectID, run.ID))
		}
		if intValue(output["total"]) == 0 {
			output["total"] = execution.Total
		}
		finishWorkspaceExecution(ctx, run.ID, run.Status, output, strings.TrimSpace(run.Error))
		return true
	default:
		return false
	}
}
