package workbench

import (
	"context"
	"fmt"
	"sync"
	"time"

	dlog "github.com/shemic/dever/log"

	runtimequeue "github.com/dever-package/bot/service/agent/runtime/queue"
)

type webContentImportBacklog struct {
	repository webContentImportRepository
}

func (backlog webContentImportBacklog) ListRunnable(
	ctx context.Context,
	limit int,
) ([]runtimequeue.Candidate, error) {
	rows := backlog.repository.listRunnableTasks(ctx, time.Now(), limit)
	result := make([]runtimequeue.Candidate, 0, len(rows))
	for _, row := range rows {
		key := ""
		if row.AccountID > 0 {
			key = fmt.Sprintf("%s:%d", row.Platform, row.AccountID)
		}
		result = append(result, runtimequeue.Candidate{ID: row.ID, Key: key})
	}
	return result, nil
}

var (
	webContentImportDispatcherOnce sync.Once
	webContentImportDispatcher     runtimequeue.Dispatcher
)

func StartWebContentImportScheduler() runtimequeue.Dispatcher {
	webContentImportDispatcherOnce.Do(func() {
		webContentImportDispatcher = runtimequeue.NewDatabaseDispatcher(
			webContentImportBacklog{repository: webContentImportRepository{}},
			newWebContentImportExecutor(),
			runtimequeue.Config{
				Name:               "web_content_import",
				Concurrency:        2,
				PerKeyConcurrency:  1,
				CandidateScanLimit: 32,
				PollInterval:       time.Second,
				OnPollError: func(err error) {
					dlog.ErrorFields("web_content_import_dispatcher", "网页内容导入队列轮询失败", dlog.Fields{
						"error": err.Error(),
					})
				},
				OnExecutionError: func(lease runtimequeue.Lease, err error) {
					dlog.ErrorFields("web_content_import_worker", "网页内容导入任务执行失败", dlog.Fields{
						"task_id": lease.ID, "worker_id": lease.WorkerID, "error": err.Error(),
					})
				},
			},
		)
	})
	return webContentImportDispatcher
}

func dispatchWebContentImport(taskID uint64) {
	dispatcher := StartWebContentImportScheduler()
	if dispatcher == nil {
		return
	}
	ctx, cancel := webContentImportMaintenanceContext()
	defer cancel()
	if err := dispatcher.Dispatch(ctx, taskID); err != nil {
		dlog.ErrorFields("web_content_import_dispatch", "网页内容导入任务投递失败，等待持久队列重试", dlog.Fields{
			"task_id": taskID,
			"error":   err.Error(),
		})
	}
}
