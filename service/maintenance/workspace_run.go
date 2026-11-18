package maintenance

import (
	"context"
	projectservice "github.com/dever-package/bot/service/project"
	teamservice "github.com/dever-package/bot/service/team"
	"github.com/dever-package/bot/service/worker"
	"time"
)

func StartRunRecovery() {
	worker.Poll("画布与团队运行", time.Second, func(ctx context.Context) error {
		projectservice.NewWorkspaceService().RecoverOrphanedCanvasRuns(ctx, time.Now(), 64)
		teamservice.NewService().RecoverOrphanedRuns(ctx, time.Now(), 64)
		return nil
	})
}
