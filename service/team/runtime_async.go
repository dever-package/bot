package team

import (
	"context"
	"fmt"

	teammodel "github.com/dever-package/bot/model/team"
)

func (s Service) runAsync(ctx context.Context, runID uint64, execute func(context.Context)) {
	if ctx == nil {
		ctx = context.Background()
	}
	go func() {
		defer func() {
			if recovered := recover(); recovered != nil {
				s.finishRun(context.Background(), runID, teammodel.RunStatusFail, nil, runtimePanicError(recovered))
			}
		}()
		execute(ctx)
	}()
}

func runtimePanicError(recovered any) error {
	if err, ok := recovered.(error); ok {
		return fmt.Errorf("运行异常: %w", err)
	}
	return fmt.Errorf("运行异常: %v", recovered)
}
