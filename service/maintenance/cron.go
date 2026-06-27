package maintenance

import (
	"context"
	"fmt"
	"time"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	frontmodel "github.com/dever-package/front/model"
	frontcron "github.com/dever-package/front/service/cron"
	"github.com/dever-package/front/service/cronexpr"
)

const (
	HistoryCleanupCronProvider = "bot.maintenance.CronService.CleanupHistory"
	historyCleanupCronName     = "Bot 历史数据清理"
	historyCleanupTimezone     = "Asia/Shanghai"
	historyCleanupSpec         = "0 0 3 * * *"
	defaultRetentionDays       = 7
)

func init() {
	frontmodel.RegisterCronProvider(HistoryCleanupCronProvider, historyCleanupCronName)
	frontcron.RegisterProvider(HistoryCleanupCronProvider, func(ctx context.Context, payload map[string]any) (any, error) {
		return CleanupHistory(ctx, payload)
	})
	frontcron.RegisterBootstrap(EnsureHistoryCleanupCron)
}

type CronService struct{}

func (CronService) ProviderCleanupHistory(c *server.Context, params []any) any {
	result, err := CleanupHistory(cronContext(c, params), cronPayload(params))
	if err != nil {
		panic(err)
	}
	return result
}

func EnsureHistoryCleanupCron(ctx context.Context) error {
	ctx = normalizeContext(ctx)
	cronModel := frontmodel.NewCronModel()
	if existing := cronModel.FindMap(ctx, map[string]any{"use": HistoryCleanupCronProvider}); len(existing) > 0 {
		return nil
	}

	now := time.Now()
	nextRunAt, err := cronexpr.Next(historyCleanupSpec, historyCleanupTimezone, now)
	if err != nil {
		return err
	}

	cronID := util.ToUint64(cronModel.Insert(ctx, map[string]any{
		"name":            historyCleanupCronName,
		"status":          frontmodel.CronStatusEnabled,
		"spec":            historyCleanupSpec,
		"schedule_mode":   frontmodel.CronScheduleDaily,
		"schedule_config": `{"time":"03:00"}`,
		"timezone":        historyCleanupTimezone,
		"kind":            frontmodel.CronKindProvider,
		"use":             HistoryCleanupCronProvider,
		"payload_json":    "{}",
		"timeout_seconds": 300,
		"next_run_at":     nextRunAt,
		"created_at":      now,
		"updated_at":      now,
	}))
	if cronID == 0 {
		return fmt.Errorf("创建 Bot 历史数据清理计划任务失败")
	}

	frontmodel.NewCronParamModel().Insert(ctx, map[string]any{
		"cron_id":     cronID,
		"param_key":   "retention_days",
		"param_value": fmt.Sprintf("%d", defaultRetentionDays),
		"status":      frontmodel.CronStatusEnabled,
		"sort":        10,
		"created_at":  now,
		"updated_at":  now,
	})

	payloadJSON, err := frontmodel.BuildCronPayloadJSON(ctx, cronID)
	if err != nil {
		return err
	}
	cronModel.Update(ctx, map[string]any{"id": cronID}, map[string]any{
		"payload_json": payloadJSON,
		"updated_at":   now,
	})
	return nil
}

func CleanupHistory(ctx context.Context, payload map[string]any) (result map[string]any, err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("%v", recovered)
		}
	}()

	ctx = normalizeContext(ctx)
	retentionDays := retentionDaysFromPayload(payload)
	cutoff := time.Now().AddDate(0, 0, -retentionDays)
	deleted := map[string]int64{
		"bot_agent_step":  agentmodel.NewStepModel().Delete(ctx, map[string]any{"created_at": map[string]any{"lt": cutoff}}),
		"bot_agent_run":   agentmodel.NewRunModel().Delete(ctx, map[string]any{"created_at": map[string]any{"lt": cutoff}}),
		"bot_energon_log": energonmodel.NewLogModel().Delete(ctx, map[string]any{"created_at": map[string]any{"lt": cutoff}}),
	}

	return map[string]any{
		"retention_days": retentionDays,
		"cutoff":         cutoff.Format(time.RFC3339),
		"deleted":        deleted,
	}, nil
}

func retentionDaysFromPayload(payload map[string]any) int {
	days := util.ToIntDefault(payload["retention_days"], defaultRetentionDays)
	if days < 1 {
		return defaultRetentionDays
	}
	if days > 365 {
		return 365
	}
	return days
}

func cronContext(c *server.Context, params []any) context.Context {
	if c != nil {
		return c.Context()
	}
	for _, item := range params {
		if ctx, ok := item.(context.Context); ok && ctx != nil {
			return ctx
		}
	}
	return context.Background()
}

func cronPayload(params []any) map[string]any {
	for _, item := range params {
		if row, ok := item.(map[string]any); ok && row != nil {
			return util.CloneMap(row)
		}
	}
	return map[string]any{}
}

func normalizeContext(ctx context.Context) context.Context {
	if ctx != nil {
		return ctx
	}
	return context.Background()
}
