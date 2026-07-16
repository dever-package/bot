package artifact

import (
	"context"
	"time"

	runtimeasync "github.com/dever-package/bot/service/agent/runtime/async"
)

const (
	artifactMaintenanceTimeout = 10 * time.Second
	artifactReconcileTimeout   = 30 * time.Second
	artifactExecutionTimeout   = 15 * time.Minute
)

func maintenanceContext() (context.Context, context.CancelFunc) {
	return runtimeasync.Detached(artifactMaintenanceTimeout)
}

func reconcileContext() (context.Context, context.CancelFunc) {
	return runtimeasync.Detached(artifactReconcileTimeout)
}

func executionContext(parent context.Context) (context.Context, context.CancelFunc) {
	if parent == nil {
		return runtimeasync.Detached(artifactExecutionTimeout)
	}
	return context.WithTimeout(parent, artifactExecutionTimeout)
}
