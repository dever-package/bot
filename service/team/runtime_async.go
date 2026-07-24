package team

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	teammodel "github.com/dever-package/bot/model/team"
)

const (
	teamRunLeaseDuration     = 45 * time.Second
	teamRunHeartbeatInterval = 10 * time.Second
	teamRunClaimInterval     = 100 * time.Millisecond
	teamRunLegacyStaleAfter  = 2 * time.Minute
)

type runExecutionContextKey struct{}

func (s Service) runAsync(ctx context.Context, runID uint64, execute func(context.Context)) {
	go func() {
		asyncContext := context.Background()
		if ctx != nil {
			asyncContext = context.WithoutCancel(ctx)
		}
		owner := "team:" + uuid.NewString()
		if !s.waitForRunExecution(asyncContext, runID, owner) {
			return
		}
		defer s.repo.ReleaseRunExecution(context.Background(), runID, owner)

		run := s.repo.FindRun(asyncContext, runID)
		if run == nil {
			return
		}
		restored, _, err := restoreRunScope(asyncContext, *run)
		if err != nil {
			s.finishRun(withRunExecutionOwner(asyncContext, owner), runID, teammodel.RunStatusFail, nil, err)
			return
		}
		asyncContext, cancel := context.WithCancel(withRunExecutionOwner(restored, owner))
		stopHeartbeat := make(chan struct{})
		heartbeatDone := make(chan struct{})
		go s.maintainRunExecutionLease(asyncContext, cancel, runID, owner, stopHeartbeat, heartbeatDone)
		defer func() {
			close(stopHeartbeat)
			<-heartbeatDone
			cancel()
		}()
		defer func() {
			if recovered := recover(); recovered != nil {
				s.finishRun(asyncContext, runID, teammodel.RunStatusFail, nil, runtimePanicError(recovered))
			}
		}()
		execute(asyncContext)
	}()
}

func (s Service) waitForRunExecution(ctx context.Context, runID uint64, owner string) bool {
	for {
		now := time.Now()
		run, claimed := s.repo.ClaimRunExecution(ctx, runID, owner, now, now.Add(teamRunLeaseDuration))
		if claimed {
			return true
		}
		if run == nil || teamRunTerminal(run.Status) {
			return false
		}
		select {
		case <-ctx.Done():
			return false
		case <-time.After(teamRunClaimInterval):
		}
	}
}

func (s Service) maintainRunExecutionLease(
	ctx context.Context,
	cancel context.CancelFunc,
	runID uint64,
	owner string,
	stop <-chan struct{},
	done chan<- struct{},
) {
	defer close(done)
	ticker := time.NewTicker(teamRunHeartbeatInterval)
	defer ticker.Stop()
	for {
		select {
		case <-stop:
			return
		case <-ctx.Done():
			return
		case now := <-ticker.C:
			if s.repo.RenewRunExecution(context.Background(), runID, owner, now, now.Add(teamRunLeaseDuration)) {
				continue
			}
			cancel()
			return
		}
	}
}

func withRunExecutionOwner(ctx context.Context, owner string) context.Context {
	return context.WithValue(ctx, runExecutionContextKey{}, strings.TrimSpace(owner))
}

func runExecutionOwner(ctx context.Context) string {
	if ctx == nil {
		return ""
	}
	owner, _ := ctx.Value(runExecutionContextKey{}).(string)
	return strings.TrimSpace(owner)
}

func applyRunExecutionFilter(ctx context.Context, filters map[string]any) {
	if owner := runExecutionOwner(ctx); owner != "" {
		filters["execution_owner"] = owner
		filters["execution_expires_at"] = map[string]any{"gt": time.Now()}
	}
}

func teamRunTerminal(status string) bool {
	switch strings.TrimSpace(status) {
	case teammodel.RunStatusSuccess, teammodel.RunStatusFail, teammodel.RunStatusCanceled:
		return true
	default:
		return false
	}
}

func (s Service) recoverRunExecution(run *teammodel.Run) {
	if !teamRunExecutionOrphaned(run, time.Now()) {
		return
	}
	// Status reads also reconcile work left behind by a replaced server process.
	s.continueRunExecution(context.Background(), *run, nil)
}

func teamRunExecutionOrphaned(run *teammodel.Run, now time.Time) bool {
	if run == nil {
		return false
	}
	switch strings.TrimSpace(run.Status) {
	case teammodel.RunStatusPending, teammodel.RunStatusRunning:
	default:
		return false
	}
	if run.ExecutionExpiresAt != nil {
		return !run.ExecutionExpiresAt.After(now)
	}
	if strings.TrimSpace(run.ExecutionOwner) != "" {
		return true
	}
	lastActiveAt := run.UpdatedAt
	if run.ExecutionHeartbeatAt != nil && run.ExecutionHeartbeatAt.After(lastActiveAt) {
		lastActiveAt = *run.ExecutionHeartbeatAt
	}
	if run.StartedAt.After(lastActiveAt) {
		lastActiveAt = run.StartedAt
	}
	return !lastActiveAt.IsZero() && !lastActiveAt.After(now.Add(-teamRunLegacyStaleAfter))
}

func runtimePanicError(recovered any) error {
	if err, ok := recovered.(error); ok {
		return fmt.Errorf("运行异常: %w", err)
	}
	return fmt.Errorf("运行异常: %v", recovered)
}
