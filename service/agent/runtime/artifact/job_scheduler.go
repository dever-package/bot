package artifact

import (
	"context"
	"sync"
	"time"

	dlog "github.com/shemic/dever/log"

	runtimeasync "github.com/dever-package/bot/service/agent/runtime/async"
	runtimequeue "github.com/dever-package/bot/service/agent/runtime/queue"
)

const artifactJobConcurrency = 4

type jobBacklog struct {
	repository jobRepository
}

func (backlog jobBacklog) ListRunnable(ctx context.Context, limit int) ([]runtimequeue.Candidate, error) {
	rows := backlog.repository.listRunnable(ctx, time.Now(), limit)
	result := make([]runtimequeue.Candidate, 0, len(rows))
	for _, row := range rows {
		result = append(result, runtimequeue.Candidate{ID: row.ID})
	}
	return result, nil
}

var (
	jobDispatcherOnce sync.Once
	jobDispatcher     runtimequeue.Dispatcher
)

func StartJobScheduler() runtimequeue.Dispatcher {
	jobDispatcherOnce.Do(func() {
		jobDispatcher = runtimequeue.NewDatabaseDispatcher(
			jobBacklog{repository: jobRepository{}},
			newJobExecutor(),
			runtimequeue.Config{
				Name:         "agent_artifact",
				Concurrency:  artifactJobConcurrency,
				PollInterval: time.Second,
				OnPollError: func(err error) {
					dlog.ErrorFields("agent_artifact_dispatcher", "智能体素材任务队列轮询失败", dlog.Fields{"error": err.Error()})
				},
				OnExecutionError: func(lease runtimequeue.Lease, err error) {
					dlog.ErrorFields("agent_artifact_worker", "智能体素材任务执行失败", dlog.Fields{
						"job_id": lease.ID, "worker_id": lease.WorkerID, "error": err.Error(),
					})
				},
			},
		)
		runtimeasync.Start("智能体素材状态对账", runJobReconciler, func(err error) {
			dlog.ErrorFields("agent_artifact_reconcile", "智能体素材状态对账异常", dlog.Fields{"error": err.Error()})
		})
	})
	return jobDispatcher
}

func dispatchJob(jobID uint64) {
	dispatcher := StartJobScheduler()
	if dispatcher == nil {
		return
	}
	ctx, cancel := maintenanceContext()
	defer cancel()
	if err := dispatcher.Dispatch(ctx, jobID); err != nil {
		dlog.ErrorFields("agent_artifact_dispatch", "智能体素材任务投递失败，等待后台对账重试", dlog.Fields{
			"job_id": jobID,
			"error":  err.Error(),
		})
	}
}
