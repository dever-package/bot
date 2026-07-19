package maintenance

import (
	"context"

	installservice "github.com/dever-package/bot/service/agent/skill/install"
	frontcron "github.com/dever-package/front/service/cron"
)

func init() {
	frontcron.RegisterBootstrap(startSkillInstallScheduler)
}

func startSkillInstallScheduler(ctx context.Context) error {
	installservice.RecoverInterruptedInstalls(ctx)
	installservice.StartInstallScheduler()
	return nil
}
