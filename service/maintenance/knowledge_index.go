package maintenance

import (
	"context"
	"fmt"
	"time"

	"github.com/shemic/dever/util"

	knowledgeservice "github.com/dever-package/bot/service/agent/knowledge"
	frontmodel "github.com/dever-package/front/model"
	frontcron "github.com/dever-package/front/service/cron"
	"github.com/dever-package/front/service/cronexpr"
)

const (
	knowledgeIndexRecoveryCronProvider = "bot.maintenance.RecoverKnowledgeIndexes"
	knowledgeIndexRecoveryCronName     = "知识库中断索引恢复"
	knowledgeIndexRecoveryCronSpec     = "0 * * * * *"
)

func init() {
	frontmodel.RegisterCronProvider(knowledgeIndexRecoveryCronProvider, knowledgeIndexRecoveryCronName)
	frontcron.RegisterProvider(knowledgeIndexRecoveryCronProvider, func(ctx context.Context, _ map[string]any) (any, error) {
		return knowledgeservice.RecoverInterruptedIndexes(ctx), nil
	})
	frontcron.RegisterBootstrap(ensureKnowledgeIndexRecoveryCron)
}

func ensureKnowledgeIndexRecoveryCron(ctx context.Context) error {
	ctx = normalizeContext(ctx)
	cronModel := frontmodel.NewCronModel()
	if existing := cronModel.FindMap(ctx, map[string]any{"use": knowledgeIndexRecoveryCronProvider}); len(existing) > 0 {
		return nil
	}
	now := time.Now()
	nextRunAt, err := cronexpr.Next(knowledgeIndexRecoveryCronSpec, historyCleanupTimezone, now)
	if err != nil {
		return err
	}
	cronID := util.ToUint64(cronModel.Insert(ctx, map[string]any{
		"name":            knowledgeIndexRecoveryCronName,
		"status":          frontmodel.CronStatusEnabled,
		"spec":            knowledgeIndexRecoveryCronSpec,
		"schedule_mode":   frontmodel.CronScheduleCron,
		"schedule_config": `{"spec":"0 * * * * *"}`,
		"timezone":        historyCleanupTimezone,
		"kind":            frontmodel.CronKindProvider,
		"use":             knowledgeIndexRecoveryCronProvider,
		"payload_json":    "{}",
		"timeout_seconds": 30,
		"next_run_at":     nextRunAt,
		"created_at":      now,
		"updated_at":      now,
	}))
	if cronID == 0 {
		return fmt.Errorf("创建知识库索引恢复计划任务失败")
	}
	return nil
}
