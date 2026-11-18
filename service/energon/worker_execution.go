package energon

import (
	"context"
	"fmt"

	runtimeasync "github.com/dever-package/bot/service/agent/runtime/async"
	bottask "github.com/dever-package/bot/service/energon/task"
	"github.com/dever-package/bot/service/worker"
)

// Maintenance callers also enter the tracked worker lifetime. This covers
// synchronous gateway calls made outside a durable dispatcher, such as chat
// titles and memory extraction, while keeping their existing result contract.
func (s GatewayService) executeInWorker(ctx context.Context, raw GatewayRequest) (*GatewayResponse, error) {
	type result struct {
		response *GatewayResponse
		err      error
	}
	done := make(chan result, 1)
	if !worker.Go(ctx, func(jobCtx context.Context) {
		if !bottask.DetachedExecution(ctx) {
			var cancel context.CancelFunc
			jobCtx, cancel = context.WithCancel(jobCtx)
			stop := context.AfterFunc(ctx, cancel)
			defer stop()
			defer cancel()
		}
		var response *GatewayResponse
		err := runtimeasync.Run("来源调用", func() error {
			var err error
			response, err = s.Handle(jobCtx, raw)
			return err
		})
		done <- result{response: response, err: err}
	}) {
		return nil, &bottask.ExecutionHandoff{Cause: fmt.Errorf("Worker 正在排空，原调用等待接管")}
	}
	select {
	case result := <-done:
		return result.response, result.err
	case <-ctx.Done():
		return nil, &bottask.ExecutionHandoff{Cause: ctx.Err()}
	}
}
