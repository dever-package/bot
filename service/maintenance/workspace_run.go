package maintenance

import (
	"context"
	"time"

	projectservice "github.com/dever-package/bot/service/project"
	frontmodel "github.com/dever-package/front/model"
	frontcron "github.com/dever-package/front/service/cron"
)

const (
	workspaceRunRecoveryCronProvider = "bot.maintenance.RecoverWorkspaceRuns"
	workspaceRunRecoveryCronName     = "画布中断运行恢复"
	workspaceRunRecoveryCronSpec     = "*/15 * * * * *"
)

func init() {
	frontmodel.RegisterCronProvider(workspaceRunRecoveryCronProvider, workspaceRunRecoveryCronName)
	frontcron.RegisterProvider(workspaceRunRecoveryCronProvider, func(ctx context.Context, _ map[string]any) (any, error) {
		stats := projectservice.NewWorkspaceService().RecoverOrphanedCanvasRuns(ctx, time.Now(), 64)
		return map[string]any{
			"scanned":    stats.Scanned,
			"recovered":  stats.Recovered,
			"reconciled": stats.Reconciled,
			"run_at":     time.Now().Format(time.RFC3339),
		}, nil
	})
	frontcron.RegisterBootstrap(ensureWorkspaceRunRecoveryCron)
}

func ensureWorkspaceRunRecoveryCron(ctx context.Context) error {
	return ensureProviderCron(ctx, providerCronConfig{
		Provider:       workspaceRunRecoveryCronProvider,
		Name:           workspaceRunRecoveryCronName,
		Spec:           workspaceRunRecoveryCronSpec,
		TimeoutSeconds: 10,
	})
}
