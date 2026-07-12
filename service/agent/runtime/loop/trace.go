package loop

import (
	"context"

	agentmodel "github.com/dever-package/bot/model/agent"
)

func (s Service) RunTraces(ctx context.Context, runIDs []uint64) []map[string]any {
	runs := s.repository.ListRuns(ctx, runIDs)
	stepsByRun := s.repository.ListStepsByRun(ctx, runIDs)
	result := make([]map[string]any, 0, len(runs))
	for _, run := range runs {
		trace := runTrace(run, stepsByRun[run.ID])
		if entries, err := s.ReadStream(ctx, run.RequestID, "", 100, 0); err == nil {
			trace["stream"] = entries
		}
		result = append(result, trace)
	}
	return result
}

func runTrace(run agentmodel.Run, steps []agentmodel.Step) map[string]any {
	return map[string]any{
		"id":              run.ID,
		"request_id":      run.RequestID,
		"agent_id":        run.AgentID,
		"input":           decodeJSON(run.Input),
		"skills":          decodeJSON(run.Skills),
		"runtime_context": run.RuntimeContext,
		"output":          decodeOutput(run.Output),
		"error":           run.Error,
		"status":          run.Status,
		"step_count":      run.StepCount,
		"latency":         run.Latency,
		"started_at":      run.StartedAt,
		"finished_at":     run.FinishedAt,
		"created_at":      run.CreatedAt,
		"steps":           stepTraces(steps),
	}
}

func stepTraces(steps []agentmodel.Step) []map[string]any {
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
			"payload":    decodeJSON(step.Payload),
			"status":     step.Status,
			"created_at": step.CreatedAt,
		})
	}
	return result
}
