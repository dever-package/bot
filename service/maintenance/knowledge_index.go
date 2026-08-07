package maintenance

import (
	"context"

	knowledgeservice "github.com/dever-package/bot/service/agent/knowledge"
	frontmodel "github.com/dever-package/front/model"
	frontcron "github.com/dever-package/front/service/cron"
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
	return ensureProviderCron(ctx, providerCronConfig{
		Provider:       knowledgeIndexRecoveryCronProvider,
		Name:           knowledgeIndexRecoveryCronName,
		Spec:           knowledgeIndexRecoveryCronSpec,
		TimeoutSeconds: 30,
	})
}
