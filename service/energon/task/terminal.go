package task

import (
	"context"
	"fmt"

	botprovider "github.com/dever-package/bot/service/energon/provider"
)

type terminalHookKey struct{}

func WithTerminalHook(ctx context.Context, hook func(context.Context) error) context.Context {
	return context.WithValue(ctx, terminalHookKey{}, hook)
}

func recordRemoteTerminal(ctx context.Context, id string, resp *botprovider.Response, failure string) error {
	receiptCtx := context.WithoutCancel(ctx)
	if store := Store(ctx); store != nil {
		cp, err := store.Load(receiptCtx, id)
		if err != nil {
			return err
		}
		if cp == nil {
			return fmt.Errorf("远端终态缺少原调用回执")
		}
		cp.RemoteResponse = &botprovider.Response{StatusCode: resp.StatusCode, Headers: map[string]string{"Content-Type": resp.Headers["Content-Type"]}, Body: resp.Body}
		cp.RemoteFailure = failure
		if _, err := store.Save(receiptCtx, ExecutionChange{Checkpoint: *cp, FactsOnly: true}); err != nil {
			return err
		}
	}
	if hook, ok := ctx.Value(terminalHookKey{}).(func(context.Context) error); ok {
		return hook(receiptCtx)
	}
	return nil
}
