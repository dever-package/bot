package install

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"

	dlog "github.com/shemic/dever/log"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimequeue "github.com/dever-package/bot/service/agent/runtime/queue"
)

const (
	installWorkerCount = 2
	installScanLimit   = 64
)

type installBacklog struct{}

func (installBacklog) ListRunnable(ctx context.Context, limit int) ([]runtimequeue.Candidate, error) {
	if limit <= 0 {
		return []runtimequeue.Candidate{}, nil
	}
	RecoverInterruptedInstalls(ctx)
	rows := agentmodel.NewSkillInstallModel().Select(ctx, map[string]any{
		"status": agentmodel.SkillInstallStatusPending,
	}, map[string]any{"order": "main.created_at asc,main.id asc", "limit": limit})
	result := make([]runtimequeue.Candidate, 0, limit)
	for _, row := range rows {
		if row == nil || row.ID == 0 {
			continue
		}
		key := strings.TrimSpace(row.RequestID)
		if row.TargetSkillID > 0 {
			key = fmt.Sprintf("skill:%d", row.TargetSkillID)
		}
		result = append(result, runtimequeue.Candidate{ID: row.ID, Key: key})
	}
	return result, nil
}

type installExecutor struct {
	service Service
}

func (executor installExecutor) Execute(ctx context.Context, lease runtimequeue.Lease) error {
	row := agentmodel.NewSkillInstallModel().Find(ctx, map[string]any{"id": lease.ID})
	if row == nil || row.Status != agentmodel.SkillInstallStatusPending {
		return nil
	}
	execution := installExecutionFromRow(row)
	started, err := beginInstall(row.ID)
	if err != nil {
		executor.service.fail(execution, err)
		return nil
	}
	if !started {
		return nil
	}
	runCtx, cancel := context.WithTimeout(ctx, skillInstallTimeout)
	defer cancel()
	stopWatch := watchInstallCancellation(runCtx, row.ID, cancel)
	defer stopWatch()
	executor.service.execute(runCtx, execution)
	return nil
}

func installExecutionFromRow(row *agentmodel.SkillInstall) *skillInstallExecution {
	if row == nil {
		return nil
	}
	startedAt := row.CreatedAt
	if row.StartedAt != nil {
		startedAt = *row.StartedAt
	}
	execution := &skillInstallExecution{
		ID:            row.ID,
		RequestID:     strings.TrimSpace(row.RequestID),
		Input:         strings.TrimSpace(row.InstallInput),
		CateID:        row.CateID,
		TargetPackID:  row.TargetPackID,
		AutoAddToPack: row.AutoAddToPack == 1,
		TargetSkillID: row.TargetSkillID,
		StartedAt:     startedAt,
	}
	if logText := strings.TrimSpace(row.Log); logText != "" {
		execution.Log.WriteString(logText)
		execution.Log.WriteString("\n")
	}
	return execution
}

func watchInstallCancellation(ctx context.Context, installID uint64, cancel context.CancelFunc) func() {
	done := make(chan struct{})
	go func() {
		ticker := time.NewTicker(500 * time.Millisecond)
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-done:
				return
			case <-ticker.C:
				checkCtx, checkCancel := context.WithTimeout(context.Background(), 2*time.Second)
				row := agentmodel.NewSkillInstallModel().Find(checkCtx, map[string]any{"id": installID})
				checkCancel()
				if row != nil && (row.Status == agentmodel.SkillInstallStatusCanceled || isFinalInstallStatus(row.Status)) {
					cancel()
					return
				}
			}
		}
	}()
	return func() { close(done) }
}

var (
	installDispatcherOnce sync.Once
	installDispatcher     runtimequeue.Dispatcher
)

func StartInstallScheduler() runtimequeue.Dispatcher {
	installDispatcherOnce.Do(func() {
		installDispatcher = runtimequeue.NewDatabaseDispatcher(
			installBacklog{},
			installExecutor{service: NewService()},
			runtimequeue.Config{
				Name:               "skill_install",
				Concurrency:        installWorkerCount,
				PerKeyConcurrency:  1,
				CandidateScanLimit: installScanLimit,
				PollInterval:       time.Second,
				OnPollError: func(err error) {
					dlog.ErrorFields("skill_install_dispatcher", "技能安装队列轮询失败", dlog.Fields{"error": err.Error()})
				},
				OnExecutionError: func(lease runtimequeue.Lease, err error) {
					dlog.ErrorFields("skill_install_worker", "技能安装后台执行失败", dlog.Fields{
						"install_id": lease.ID, "worker_id": lease.WorkerID, "error": err.Error(),
					})
				},
			},
		)
	})
	return installDispatcher
}

func wakeInstallScheduler(ctx context.Context) error {
	dispatcher := StartInstallScheduler()
	if dispatcher == nil {
		return fmt.Errorf("技能安装调度器不可用")
	}
	// 由数据库待办查询补齐任务串行键，避免快速通道只携带 ID 时
	// 绕过同一目标技能的并发限制。
	return dispatcher.Dispatch(ctx, 0)
}

func cancelInstall(ctx context.Context, installID uint64) {
	if dispatcher := StartInstallScheduler(); dispatcher != nil {
		_ = dispatcher.Cancel(ctx, installID)
	}
}

func beginInstall(id uint64) (started bool, err error) {
	if id == 0 {
		return false, nil
	}
	defer func() {
		if recovered := recover(); recovered != nil {
			started = false
			err = fmt.Errorf("启动技能安装任务失败: %v", recovered)
		}
	}()
	ctx, cancel := context.WithTimeout(context.Background(), skillInstallFinalizeTimeout)
	defer cancel()
	started = agentmodel.NewSkillInstallModel().Update(ctx, map[string]any{
		"id": id, "status": agentmodel.SkillInstallStatusPending,
	}, map[string]any{
		"status": agentmodel.SkillInstallStatusInstalling, "started_at": time.Now(),
	}) > 0
	return started, nil
}
