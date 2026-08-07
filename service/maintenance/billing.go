package maintenance

import (
	"context"
	"time"

	billingservice "github.com/dever-package/bot/service/billing"
	frontmodel "github.com/dever-package/front/model"
	frontcron "github.com/dever-package/front/service/cron"
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
	return ensureProviderCron(ctx, providerCronConfig{
		Provider:       billingRecoveryCronProvider,
		Name:           billingRecoveryCronName,
		Spec:           billingRecoveryCronSpec,
		TimeoutSeconds: 60,
	})
}
