package loop

import (
	"context"
	"errors"
	"sync"
	"time"

	dlog "github.com/shemic/dever/log"

	runtimeconfig "github.com/dever-package/bot/service/agent/runtime/config"
	runtimequeue "github.com/dever-package/bot/service/agent/runtime/queue"
)

const (
	runtimePollInterval      = time.Second
	runtimeEnqueueFallback   = 30 * time.Second
	runtimeLeaseDuration     = 45 * time.Second
	runtimeHeartbeatInterval = 10 * time.Second
)

type databaseBacklog struct {
	repository repository
}

func newRunBacklog() databaseBacklog {
	return databaseBacklog{repository: newRepository()}
}

func (backlog databaseBacklog) ListRunnable(ctx context.Context, limit int) ([]runtimequeue.Candidate, error) {
	rows, err := backlog.repository.ListRunnable(ctx, time.Now(), limit)
	if err != nil {
		return nil, err
	}
	result := make([]runtimequeue.Candidate, 0, len(rows))
	for _, row := range rows {
		result = append(result, runtimequeue.Candidate{ID: row.ID})
	}
	return result, nil
}

var (
	defaultDispatcherOnce sync.Once
	defaultDispatcher     runtimequeue.Dispatcher
)

func defaultRunDispatcher(executor runtimequeue.Executor, backlog runtimequeue.Backlog) runtimequeue.Dispatcher {
	defaultDispatcherOnce.Do(func() {
		defaultDispatcher = runtimequeue.NewDatabaseDispatcher(
			backlog,
			executor,
			runtimequeue.Config{
				Name:         "agent_run",
				Concurrency:  runWorkerConcurrency(),
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

func runWorkerConcurrency() int {
	ctx, cancel := maintenanceContext()
	defer cancel()
	return runtimeconfig.Load(ctx).RunWorkerConcurrency
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
