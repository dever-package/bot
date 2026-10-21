package project

import (
	"context"
	"fmt"
	"strings"
	"sync"
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
	Failed     int `json:"failed"`
}

// Keep a bounded cursor so healthy early rows cannot hide expired later runs.
var workspaceRecoveryScan = struct {
	sync.Mutex
	afterID uint64
}{}

// RecoverOrphanedCanvasRuns schedules expired canvas runs for lease-protected recovery.
// It only scans the active execution index; status/detail list APIs remain pure reads.
func (s WorkspaceService) RecoverOrphanedCanvasRuns(ctx context.Context, now time.Time, limit int) WorkspaceRecoveryStats {
	if ctx == nil {
		ctx = context.Background()
	}
	if now.IsZero() {
		now = time.Now()
	}
	limit = normalizeWorkspaceRecoveryLimit(limit)
	workspaceRecoveryScan.Lock()
	defer workspaceRecoveryScan.Unlock()
	filter := map[string]any{"status": []string{teammodel.RunStatusPending, teammodel.RunStatusRunning}}
	if workspaceRecoveryScan.afterID > 0 {
		filter["id"] = map[string]any{"gt": workspaceRecoveryScan.afterID}
	}
	options := map[string]any{"field": "main.id,main.run_id,main.project_id,main.total", "order": "main.id asc", "limit": limit}
	executions := workspacemodel.NewExecutionModel().Select(ctx, filter, options)
	if len(executions) == 0 && workspaceRecoveryScan.afterID > 0 {
		workspaceRecoveryScan.afterID = 0
		delete(filter, "id")
		executions = workspacemodel.NewExecutionModel().Select(ctx, filter, options)
	}
	for _, execution := range executions {
		if execution != nil && execution.ID > workspaceRecoveryScan.afterID {
			workspaceRecoveryScan.afterID = execution.ID
		}
	}
	if len(executions) < limit {
		workspaceRecoveryScan.afterID = 0
	}
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
		reconciled, err := reconcileWorkspaceRecoveryExecutionResult(ctx, execution, run)
		if err != nil {
			stats.Failed++
			reportWorkspacePersistenceError(execution.RunID, err)
			continue
		}
		if reconciled {
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

func reconcileWorkspaceRecoveryExecutionResult(ctx context.Context, execution *workspacemodel.Execution, run *teammodel.Run) (bool, error) {
	if execution == nil {
		return false, nil
	}
	if run == nil || !isWorkspaceCanvasRun(run) {
		err := workspaceRecordTransaction(ctx, func(tx context.Context) error {
			if workspacemodel.NewExecutionModel().Update(tx, map[string]any{"id": execution.ID, "run_id": execution.RunID, "status": []string{teammodel.RunStatusPending, teammodel.RunStatusRunning}}, map[string]any{"status": teammodel.RunStatusFail, "error": "画布运行记录不存在，请重新执行", "finished_at": time.Now(), "updated_at": time.Now()}) != 1 {
				return fmt.Errorf("修复画布执行失败")
			}
			return nil
		})
		return true, err
	}
	switch strings.TrimSpace(run.Status) {
	case teammodel.RunStatusWaiting, teammodel.RunStatusSuccess, teammodel.RunStatusFail, teammodel.RunStatusCanceled:
		// Re-read under the Run lock; a stale scan snapshot cannot undo cancellation.
		return true, workspaceRecordTransaction(ctx, func(tx context.Context) error {
			current := lockWorkspaceRun(tx, run.ID)
			if current == nil {
				return fmt.Errorf("画布运行不存在")
			}
			return persistWorkspaceRunProjections(tx, current)
		})
	default:
		return false, nil
	}
}
