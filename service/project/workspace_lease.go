package project

import (
	"context"
	"strings"
	"sync"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
)

const (
	workspaceRunLeaseDuration     = 45 * time.Second
	workspaceRunHeartbeatInterval = 10 * time.Second
	workspaceLegacyRunStaleAfter  = 2 * time.Minute
	workspaceRunInterruptedError  = "服务重启导致任务中断，请重新执行"
)

func startWorkspaceRunLease(ctx context.Context, runID uint64) (context.Context, func(), bool) {
	if ctx == nil {
		ctx = context.Background()
	}
	leaseContext, cancel := context.WithCancel(ctx)
	if !claimWorkspaceRunLease(context.Background(), runID, time.Now()) {
		cancel()
		return leaseContext, func() {}, false
	}

	stop := make(chan struct{})
	done := make(chan struct{})
	go maintainWorkspaceRunLease(leaseContext, cancel, runID, stop, done)

	var once sync.Once
	return leaseContext, func() {
		once.Do(func() {
			close(stop)
			<-done
			cancel()
		})
	}, true
}

func maintainWorkspaceRunLease(
	ctx context.Context,
	cancel context.CancelFunc,
	runID uint64,
	stop <-chan struct{},
	done chan<- struct{},
) {
	defer close(done)
	ticker := time.NewTicker(workspaceRunHeartbeatInterval)
	defer ticker.Stop()
	for {
		select {
		case <-stop:
			return
		case <-ctx.Done():
			return
		case now := <-ticker.C:
			if renewWorkspaceRunLease(context.Background(), runID, now) {
				continue
			}
			cancel()
			return
		}
	}
}

func claimWorkspaceRunLease(ctx context.Context, runID uint64, now time.Time) bool {
	if runID == 0 {
		return false
	}
	run := teammodel.NewRunModel().Find(ctx, map[string]any{"id": runID})
	if !workspaceRunCanSyncProgress(run) {
		return false
	}
	if strings.TrimSpace(run.ExecutionOwner) == workspaceRunLockOwner &&
		run.ExecutionExpiresAt != nil && run.ExecutionExpiresAt.After(now) {
		return renewWorkspaceRunLease(ctx, runID, now)
	}
	if run.ExecutionExpiresAt != nil && run.ExecutionExpiresAt.After(now) {
		return false
	}
	return teammodel.NewRunModel().Update(ctx, map[string]any{
		"id":                run.ID,
		"status":            run.Status,
		"execution_version": run.ExecutionVersion,
		"or": []any{
			map[string]any{"execution_expires_at": nil},
			map[string]any{"execution_expires_at": map[string]any{"lte": now}},
		},
	}, map[string]any{
		"execution_owner":        workspaceRunLockOwner,
		"execution_version":      run.ExecutionVersion + 1,
		"execution_heartbeat_at": now,
		"execution_expires_at":   now.Add(workspaceRunLeaseDuration),
	}) == 1
}

func renewWorkspaceRunLease(ctx context.Context, runID uint64, now time.Time) bool {
	if runID == 0 {
		return false
	}
	renewed := teammodel.NewRunModel().Update(ctx, map[string]any{
		"id":                   runID,
		"status":               []string{teammodel.RunStatusPending, teammodel.RunStatusRunning},
		"execution_owner":      workspaceRunLockOwner,
		"execution_expires_at": map[string]any{"gt": now},
	}, map[string]any{
		"execution_heartbeat_at": now,
		"execution_expires_at":   now.Add(workspaceRunLeaseDuration),
	}) == 1
	if renewed {
		renewWorkspaceRunLock(ctx, runID, now)
	}
	return renewed
}

func workspaceRunLeaseAlive(run *teammodel.Run, now time.Time) bool {
	return workspaceRunCanSyncProgress(run) &&
		strings.TrimSpace(run.ExecutionOwner) != "" &&
		run.ExecutionExpiresAt != nil &&
		run.ExecutionExpiresAt.After(now)
}

func workspaceRunExecutionOrphaned(run *teammodel.Run, now time.Time) bool {
	if !workspaceRunCanSyncProgress(run) || workspaceRunLeaseAlive(run, now) {
		return false
	}
	if run.ExecutionExpiresAt != nil {
		return !run.ExecutionExpiresAt.After(now)
	}
	lastActiveAt := run.UpdatedAt
	if run.ExecutionHeartbeatAt != nil && run.ExecutionHeartbeatAt.After(lastActiveAt) {
		lastActiveAt = *run.ExecutionHeartbeatAt
	}
	if run.StartedAt.After(lastActiveAt) {
		lastActiveAt = run.StartedAt
	}
	if run.CreatedAt.After(lastActiveAt) {
		lastActiveAt = run.CreatedAt
	}
	return !lastActiveAt.IsZero() && !lastActiveAt.After(now.Add(-workspaceLegacyRunStaleAfter))
}
