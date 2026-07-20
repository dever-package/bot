package maintenance

import (
	"context"
	"fmt"
	"time"

	"github.com/shemic/dever/util"

	billingservice "github.com/dever-package/bot/service/billing"
	frontmodel "github.com/dever-package/front/model"
	frontcron "github.com/dever-package/front/service/cron"
	"github.com/dever-package/front/service/cronexpr"
	userservice "github.com/dever-package/user/service"
)

const (
	billingRecoveryCronProvider = "bot.maintenance.RecoverBilling"
	billingRecoveryCronName     = "能力计费与积分预占恢复"
	billingRecoveryCronSpec     = "0 * * * * *"
)

func init() {
	frontmodel.RegisterCronProvider(billingRecoveryCronProvider, billingRecoveryCronName)
	frontcron.RegisterProvider(billingRecoveryCronProvider, func(ctx context.Context, _ map[string]any) (any, error) {
		now := time.Now()
		stats, err := billingservice.ReconcilePowerCharges(ctx, now, 200)
		return map[string]any{
			"charges":       stats,
			"expired_holds": userservice.ExpirePointHolds(ctx, now),
			"run_at":        now.Format(time.RFC3339),
		}, err
	})
	frontcron.RegisterBootstrap(ensureBillingRecoveryCron)
}

func ensureBillingRecoveryCron(ctx context.Context) error {
	ctx = normalizeContext(ctx)
	cronModel := frontmodel.NewCronModel()
	if existing := cronModel.FindMap(ctx, map[string]any{"use": billingRecoveryCronProvider}); len(existing) > 0 {
		return nil
	}
	now := time.Now()
	nextRunAt, err := cronexpr.Next(billingRecoveryCronSpec, historyCleanupTimezone, now)
	if err != nil {
		return err
	}
	cronID := util.ToUint64(cronModel.Insert(ctx, map[string]any{
		"name":            billingRecoveryCronName,
		"status":          frontmodel.CronStatusEnabled,
		"spec":            billingRecoveryCronSpec,
		"schedule_mode":   frontmodel.CronScheduleCron,
		"schedule_config": `{"spec":"0 * * * * *"}`,
		"timezone":        historyCleanupTimezone,
		"kind":            frontmodel.CronKindProvider,
		"use":             billingRecoveryCronProvider,
		"payload_json":    "{}",
		"timeout_seconds": 60,
		"next_run_at":     nextRunAt,
		"created_at":      now,
		"updated_at":      now,
	}))
	if cronID == 0 {
		return fmt.Errorf("创建能力计费恢复计划任务失败")
	}
	return nil
}
