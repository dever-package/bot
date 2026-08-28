package workbench

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"sync/atomic"
	"time"
	"unicode/utf8"

	dlog "github.com/shemic/dever/log"

	assetmodel "github.com/dever-package/bot/model/asset"
	runtimeasync "github.com/dever-package/bot/service/agent/runtime/async"
	runtimequeue "github.com/dever-package/bot/service/agent/runtime/queue"
	userservice "github.com/dever-package/user/service"
)

const webContentImportHeartbeatInterval = 10 * time.Second

type webContentImportExecutor struct {
	repository webContentImportRepository
	service    Service
}

type webContentImportHeartbeat struct {
	currentItem atomic.Uint64
	stop        context.CancelFunc
	done        <-chan struct{}
}

type webContentImportProgressReporter struct {
	repository webContentImportRepository
	taskID     uint64
	itemID     uint64
	workerID   string
	total      int
	completed  int

	mu           sync.Mutex
	lastStage    string
	lastProgress int
	lastUpdate   time.Time
}

func newWebContentImportExecutor() webContentImportExecutor {
	return webContentImportExecutor{
		repository: webContentImportRepository{},
		service:    NewService(),
	}
}

func (executor webContentImportExecutor) Execute(ctx context.Context, lease runtimequeue.Lease) error {
	candidate := executor.repository.findTask(ctx, lease.ID)
	if candidate == nil || assetmodel.IsImportTaskTerminal(candidate.Status) {
		return nil
	}
	if !executor.repository.claimTask(ctx, *candidate, lease.WorkerID, time.Now()) {
		return nil
	}
	task := executor.repository.findTask(ctx, lease.ID)
	if task == nil {
		return fmt.Errorf("网页内容导入任务不存在")
	}
	workerContext := userservice.WithActor(context.Background(), userservice.Actor{
		ID:     task.UserID,
		Type:   userservice.ActorTypeUser,
		UserID: task.UserID,
		Site:   userservice.TokenScopeUser,
		Scope:  userservice.TokenScopeUser,
	})
	workerContext, cancel := context.WithCancel(workerContext)
	heartbeat := executor.startHeartbeat(workerContext, task.ID, lease.WorkerID, cancel)
	err := executor.executeTask(workerContext, *task, lease.WorkerID, heartbeat)
	heartbeat.Stop()
	cancel()
	return err
}

func (executor webContentImportExecutor) executeTask(
	ctx context.Context,
	task assetmodel.ImportTask,
	workerID string,
	heartbeat *webContentImportHeartbeat,
) error {
	items := executor.repository.listTaskItems(ctx, task.ID)
	completed := 0
	for _, item := range items {
		if assetmodel.IsImportItemTerminal(item.Status) {
			completed++
			continue
		}
		if !executor.repository.claimItem(ctx, item, workerID, time.Now()) {
			continue
		}
		claimed := executor.repository.findItem(ctx, item.ID)
		if claimed == nil {
			return fmt.Errorf("网页内容导入明细不存在")
		}
		heartbeat.currentItem.Store(claimed.ID)
		reporter := &webContentImportProgressReporter{
			repository:   executor.repository,
			taskID:       task.ID,
			itemID:       claimed.ID,
			workerID:     workerID,
			total:        max(len(items), 1),
			completed:    completed,
			lastProgress: -1,
		}
		result, runErr := executor.executeItem(ctx, task, *claimed, workerID, reporter.Report)
		heartbeat.currentItem.Store(0)
		if ctx.Err() != nil {
			return fmt.Errorf("网页内容导入任务租约已失效: %w", ctx.Err())
		}
		finishCtx, finishCancel := webContentImportMaintenanceContext()
		if runErr != nil {
			finished := executor.repository.finishItem(
				finishCtx,
				*claimed,
				workerID,
				assetmodel.ImportItemStatusFailed,
				0,
				"{}",
				"[]",
				sanitizeWebContentImportError(runErr),
			)
			finishCancel()
			if !finished {
				return fmt.Errorf("保存网页内容导入失败状态失败: %w", runErr)
			}
		} else {
			finished := executor.repository.finishItem(
				finishCtx,
				*claimed,
				workerID,
				result.Status,
				result.AssetID,
				encodeImportJSON(result.Result, "{}"),
				encodeImportJSON(result.Warnings, "[]"),
				"",
			)
			finishCancel()
			if !finished {
				return fmt.Errorf("保存网页内容导入结果失败")
			}
		}
		completed++
	}

	finishCtx, finishCancel := webContentImportMaintenanceContext()
	defer finishCancel()
	summary := executor.repository.summarizeItems(finishCtx, task.ID)
	if summary.Total == 0 {
		summary.ErrorMessage = "导入任务没有可执行明细"
	}
	if summary.Finished < summary.Total {
		if !executor.repository.releaseTask(finishCtx, task.ID, workerID) {
			return fmt.Errorf("释放未完成的网页内容导入任务失败")
		}
		return nil
	}
	if !executor.repository.finishTask(finishCtx, task.ID, workerID, summary) {
		return fmt.Errorf("完成网页内容导入任务失败")
	}
	return nil
}

func (executor webContentImportExecutor) executeItem(
	ctx context.Context,
	task assetmodel.ImportTask,
	item assetmodel.ImportItem,
	workerID string,
	progress webContentImportProgressFunc,
) (webContentImportItemResult, error) {
	progress("parsing", "正在解析内容", 5)
	resolved, err := resolveWebContentImport(ctx, task, item)
	if task.Platform != assetmodel.ImportTaskPlatformMixed {
		if !executor.repository.updateSelection(
			ctx,
			task.ID,
			workerID,
			resolved.ProviderID,
			resolved.AccountID,
		) {
			return webContentImportItemResult{}, fmt.Errorf("保存内容来源账号失败")
		}
	}
	if err != nil {
		return webContentImportItemResult{}, err
	}
	progress("parsed", "内容解析完成", 25)
	if !executor.repository.updateItemResolution(ctx, item, workerID, resolved) {
		return webContentImportItemResult{}, fmt.Errorf("保存网页内容解析结果失败")
	}
	return executor.service.saveResolvedWebContentImport(ctx, task, item, resolved, progress)
}

func (executor webContentImportExecutor) startHeartbeat(
	ctx context.Context,
	taskID uint64,
	workerID string,
	cancelWorker context.CancelFunc,
) *webContentImportHeartbeat {
	heartbeatContext, stop := context.WithCancel(ctx)
	done := make(chan struct{})
	heartbeat := &webContentImportHeartbeat{stop: stop, done: done}
	runtimeasync.Start("网页内容导入任务心跳", func() {
		defer close(done)
		ticker := time.NewTicker(webContentImportHeartbeatInterval)
		defer ticker.Stop()
		for {
			select {
			case <-heartbeatContext.Done():
				return
			case now := <-ticker.C:
				renewCtx, renewCancel := webContentImportMaintenanceContext()
				taskRenewed := executor.repository.renewTask(renewCtx, taskID, workerID, now)
				itemID := heartbeat.currentItem.Load()
				itemRenewed := itemID == 0 || executor.repository.renewItem(renewCtx, itemID, workerID, now)
				renewCancel()
				if !taskRenewed || !itemRenewed {
					cancelWorker()
					return
				}
			}
		}
	}, func(err error) {
		cancelWorker()
		dlog.ErrorFields("web_content_import_heartbeat", "网页内容导入任务心跳异常", dlog.Fields{
			"task_id": taskID, "worker_id": workerID, "error": err.Error(),
		})
	})
	return heartbeat
}

func (heartbeat *webContentImportHeartbeat) Stop() {
	if heartbeat == nil {
		return
	}
	heartbeat.stop()
	<-heartbeat.done
}

func (reporter *webContentImportProgressReporter) Report(stage string, message string, progress int) {
	if reporter == nil {
		return
	}
	stage = strings.TrimSpace(stage)
	message = strings.TrimSpace(message)
	progress = clampImportProgress(progress)
	now := time.Now()
	reporter.mu.Lock()
	if progress < reporter.lastProgress {
		reporter.mu.Unlock()
		return
	}
	if stage == reporter.lastStage && progress == reporter.lastProgress && now.Sub(reporter.lastUpdate) < time.Second {
		reporter.mu.Unlock()
		return
	}
	if stage == reporter.lastStage && progress < 100 && now.Sub(reporter.lastUpdate) < 500*time.Millisecond {
		reporter.mu.Unlock()
		return
	}
	reporter.lastStage = stage
	reporter.lastProgress = progress
	reporter.lastUpdate = now
	taskProgress := (reporter.completed*100 + progress) / max(reporter.total, 1)
	reporter.mu.Unlock()

	progressCtx, progressCancel := webContentImportMaintenanceContext()
	defer progressCancel()
	reporter.repository.updateProgress(
		progressCtx,
		reporter.taskID,
		reporter.itemID,
		reporter.workerID,
		stage,
		message,
		progress,
		taskProgress,
	)
}

func sanitizeWebContentImportError(err error) string {
	if err == nil {
		return ""
	}
	message := strings.TrimSpace(err.Error())
	if utf8.RuneCountInString(message) <= 2000 {
		return message
	}
	runes := []rune(message)
	return string(runes[:2000])
}

func webContentImportMaintenanceContext() (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), 10*time.Second)
}
