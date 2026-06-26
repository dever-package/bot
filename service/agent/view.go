package agent

import (
	"context"
	"encoding/json"

	agentmodel "github.com/dever-package/bot/model/agent"
)

func (s Service) RunTraces(ctx context.Context, runIDs []uint64) []map[string]any {
	runIDs = uniqueUint64(runIDs)
	if len(runIDs) == 0 {
		return []map[string]any{}
	}

	runs := s.repo.ListRuns(ctx, runIDs)
	stepsByRun := s.repo.ListStepsByRun(ctx, runIDs)
	result := make([]map[string]any, 0, len(runs))
	for _, run := range runs {
		trace := agentRunTraceToMap(run, stepsByRun[run.ID])
		if entries, err := s.ReadStream(ctx, run.RequestID, "", 100, 0); err == nil {
			trace["stream"] = entries
		}
		result = append(result, trace)
	}
	return result
}

func (s Service) RunStatus(ctx context.Context, requestID string) (map[string]any, error) {
	run, err := s.repo.FindRunByRequestID(ctx, requestID)
	if err != nil {
		return nil, err
	}
	trace := agentRunTraceToMap(run, s.repo.ListStepsByRun(ctx, []uint64{run.ID})[run.ID])
	if entries, err := s.ReadStream(ctx, run.RequestID, "", 100, 0); err == nil {
		trace["stream"] = entries
	}
	return map[string]any{
		"run": trace,
	}, nil
}

func uniqueUint64(values []uint64) []uint64 {
	seen := map[uint64]struct{}{}
	result := make([]uint64, 0, len(values))
	for _, value := range values {
		if value == 0 {
			continue
		}
		if _, ok := seen[value]; ok {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
}

func agentRunTraceToMap(run agentmodel.Run, steps []agentmodel.Step) map[string]any {
	return map[string]any{
		"id":              run.ID,
		"request_id":      run.RequestID,
		"agent_id":        run.AgentID,
		"input":           jsonAny(run.Input),
		"skills":          jsonAny(run.Skills),
		"runtime_context": run.RuntimeContext,
		"output":          jsonAny(run.Output),
		"error":           run.Error,
		"status":          run.Status,
		"step_count":      run.StepCount,
		"latency":         run.Latency,
		"started_at":      run.StartedAt,
		"finished_at":     run.FinishedAt,
		"created_at":      run.CreatedAt,
		"steps":           agentStepsToMaps(steps),
	}
}

func agentStepsToMaps(steps []agentmodel.Step) []map[string]any {
	result := make([]map[string]any, 0, len(steps))
	for _, step := range steps {
		result = append(result, map[string]any{
			"id":         step.ID,
			"run_id":     step.RunID,
			"request_id": step.RequestID,
			"seq":        step.Seq,
			"type":       step.Type,
			"title":      step.Title,
			"content":    step.Content,
			"payload":    jsonAny(step.Payload),
			"status":     step.Status,
			"created_at": step.CreatedAt,
		})
	}
	return result
}

func jsonAny(text string) any {
	var value any
	if err := json.Unmarshal([]byte(text), &value); err != nil {
		return text
	}
	return value
}
