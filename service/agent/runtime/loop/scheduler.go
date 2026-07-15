package loop

import (
	"context"
	"errors"
	"sync"
	"time"

	dlog "github.com/shemic/dever/log"

	runtimequeue "github.com/dever-package/bot/service/agent/runtime/queue"
)

const (
	runtimeWorkerConcurrency = 4
	runtimePollInterval      = time.Second
	runtimeEnqueueFallback   = 30 * time.Second
	runtimeLeaseDuration     = 45 * time.Second
	runtimeHeartbeatInterval = 10 * time.Second
)

type RunLease struct {
	RunID    uint64
	WorkerID string
}

type RunExecutor interface {
	ExecuteRun(context.Context, RunLease) error
}

type RunCandidate struct {
	RunID uint64
}

type RunBacklog interface {
	ListRunnable(context.Context, int) ([]RunCandidate, error)
}

type RunDispatcher interface {
	Dispatch(context.Context, uint64) error
	Cancel(context.Context, uint64) error
}

type RunDispatcherFactory func(RunExecutor, RunBacklog) RunDispatcher

type databaseBacklog struct {
	repository repository
}

func NewRunBacklog() RunBacklog {
	return databaseBacklog{repository: newRepository()}
}

func (backlog databaseBacklog) ListRunnable(ctx context.Context, limit int) ([]RunCandidate, error) {
	rows, err := backlog.repository.ListRunnable(ctx, time.Now(), limit)
	if err != nil {
		return nil, err
	}
	result := make([]RunCandidate, 0, len(rows))
	for _, row := range rows {
		result = append(result, RunCandidate{RunID: row.ID})
	}
	return result, nil
}

type queueBacklogAdapter struct {
	backlog RunBacklog
}

func (adapter queueBacklogAdapter) ListRunnable(ctx context.Context, limit int) ([]runtimequeue.Candidate, error) {
	rows, err := adapter.backlog.ListRunnable(ctx, limit)
	if err != nil {
		return nil, err
	}
	result := make([]runtimequeue.Candidate, 0, len(rows))
	for _, row := range rows {
		result = append(result, runtimequeue.Candidate{ID: row.RunID})
	}
	return result, nil
}

type queueExecutorAdapter struct {
	executor RunExecutor
}

func (adapter queueExecutorAdapter) Execute(ctx context.Context, lease runtimequeue.Lease) error {
	return adapter.executor.ExecuteRun(ctx, RunLease{RunID: lease.ID, WorkerID: lease.WorkerID})
}

var (
	defaultDispatcherOnce sync.Once
	defaultDispatcher     RunDispatcher
)

func defaultRunDispatcher(executor RunExecutor, backlog RunBacklog) RunDispatcher {
	defaultDispatcherOnce.Do(func() {
		defaultDispatcher = runtimequeue.NewDatabaseDispatcher(
			queueBacklogAdapter{backlog: backlog},
			queueExecutorAdapter{executor: executor},
			runtimequeue.Config{
				Name:         "agent_run",
				Concurrency:  runtimeWorkerConcurrency,
				PollInterval: runtimePollInterval,
				ShouldIgnore: func(err error) bool {
					return errors.Is(err, errRunLeaseLost)
				},
				OnPollError: func(err error) {
					dlog.ErrorFields("agent_runtime_dispatcher", "智能体运行队列轮询失败", dlog.Fields{"error": err.Error()})
				},
				OnExecutionError: func(lease runtimequeue.Lease, err error) {
					dlog.ErrorFields("agent_runtime_worker", "智能体后台运行失败", dlog.Fields{
						"run_id": lease.ID, "worker_id": lease.WorkerID, "error": err.Error(),
					})
				},
			},
		)
	})
	return defaultDispatcher
}

func logDispatchDeliveryError(runID uint64, err error) {
	if err == nil {
		return
	}
	dlog.ErrorFields("agent_runtime_dispatch", "智能体运行投递失败，等待后台对账重试", dlog.Fields{
		"run_id": runID,
		"error":  err.Error(),
	})
}
