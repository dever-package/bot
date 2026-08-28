package maintenance

import (
	"context"

	workbenchservice "github.com/dever-package/bot/service/workbench"
	frontcron "github.com/dever-package/front/service/cron"
)

func init() {
	frontcron.RegisterBootstrap(startWebContentImportScheduler)
}

func startWebContentImportScheduler(_ context.Context) error {
	workbenchservice.StartWebContentImportScheduler()
	return nil
}
