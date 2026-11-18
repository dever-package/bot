package worker

import (
	"context"
	"log/slog"
	"time"

	runtimeasync "github.com/dever-package/bot/service/agent/runtime/async"
)

// Poll owns periodic database reconciliation in the worker process.
func Poll(name string, interval time.Duration, reconcile func(context.Context) error) {
	Register(name, func(ctx context.Context) {
		ticker := time.NewTicker(interval)
		defer ticker.Stop()
		for {
			if err := runtimeasync.Run(name, func() error { return reconcile(ctx) }); err != nil && ctx.Err() == nil {
				slog.Error("Worker 对账失败", "task", name, "error", err)
			}
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
			}
		}
	})
}
