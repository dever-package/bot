package loop

import (
	"context"
	"time"

	runtimeasync "github.com/dever-package/bot/service/agent/runtime/async"
)

const (
	modelRequestTimeout       = 15 * time.Minute
	modelStreamIdleTimeout    = 90 * time.Second
	toolRequestTimeout        = 15 * time.Minute
	toolMountTimeout          = 2 * time.Minute
	runtimeMaintenanceTimeout = 10 * time.Second
	runtimeStopTimeout        = 5 * time.Second
)

func operationContext(parent context.Context, timeout time.Duration) (context.Context, context.CancelFunc) {
	if parent == nil {
		parent = context.Background()
	}
	return context.WithTimeout(parent, timeout)
}

func maintenanceContext() (context.Context, context.CancelFunc) {
	return runtimeasync.Detached(runtimeMaintenanceTimeout)
}

func stopContext() (context.Context, context.CancelFunc) {
	return runtimeasync.Detached(runtimeStopTimeout)
}

func preparationTiming(requestedAt time.Time, startedAt time.Time) map[string]any {
	return map[string]any{
		"requested_at":   requestedAt,
		"run_created_at": startedAt,
		"prepare_ms":     durationMilliseconds(requestedAt, startedAt),
	}
}

func modelTiming(execution execution, modelStep int, result modelStepResult) map[string]any {
	timing := map[string]any{
		"model_step":            modelStep,
		"attempts":              result.Attempts,
		"requested_at":          execution.requestedAt,
		"run_created_at":        execution.startedAt,
		"claimed_at":            execution.claimedAt,
		"provider_requested_at": result.ProviderRequestedAt,
		"first_delta_at":        result.FirstDeltaAt,
		"provider_finished_at":  result.ProviderFinishedAt,
		"prepare_ms":            durationMilliseconds(execution.requestedAt, execution.startedAt),
		"queue_ms":              durationMilliseconds(execution.startedAt, execution.claimedAt),
		"provider_ttft_ms":      durationMilliseconds(result.ProviderRequestedAt, result.FirstDeltaAt),
		"provider_total_ms":     durationMilliseconds(result.ProviderRequestedAt, result.ProviderFinishedAt),
	}
	if modelStep == 1 {
		timing["total_ttft_ms"] = durationMilliseconds(execution.requestedAt, result.FirstDeltaAt)
	}
	return timing
}

func durationMilliseconds(start time.Time, end time.Time) int64 {
	if start.IsZero() || end.IsZero() || end.Before(start) {
		return 0
	}
	return end.Sub(start).Milliseconds()
}
