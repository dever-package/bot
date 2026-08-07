package maintenance

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/shemic/dever/util"

	frontmodel "github.com/dever-package/front/model"
	"github.com/dever-package/front/service/cronexpr"
)

type providerCronConfig struct {
	Provider       string
	Name           string
	Spec           string
	TimeoutSeconds int
}

func ensureProviderCron(ctx context.Context, config providerCronConfig) error {
	ctx = normalizeContext(ctx)
	cronModel := frontmodel.NewCronModel()
	if existing := cronModel.FindMap(ctx, map[string]any{"use": config.Provider}); len(existing) > 0 {
		return nil
	}

	now := time.Now()
	nextRunAt, err := cronexpr.Next(config.Spec, historyCleanupTimezone, now)
	if err != nil {
		return err
	}
	scheduleConfig, err := json.Marshal(map[string]string{"spec": config.Spec})
	if err != nil {
		return err
	}
	cronID := util.ToUint64(cronModel.Insert(ctx, map[string]any{
		"name":            config.Name,
		"status":          frontmodel.CronStatusEnabled,
		"spec":            config.Spec,
		"schedule_mode":   frontmodel.CronScheduleCron,
		"schedule_config": string(scheduleConfig),
		"timezone":        historyCleanupTimezone,
		"kind":            frontmodel.CronKindProvider,
		"use":             config.Provider,
		"payload_json":    "{}",
		"timeout_seconds": config.TimeoutSeconds,
		"next_run_at":     nextRunAt,
		"created_at":      now,
		"updated_at":      now,
	}))
	if cronID == 0 {
		return fmt.Errorf("创建%s计划任务失败", config.Name)
	}
	return nil
}
