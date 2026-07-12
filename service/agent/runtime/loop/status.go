package loop

import (
	"context"
	"strings"
)

func (s Service) Status(ctx context.Context, requestID string) (map[string]any, error) {
	requestID = strings.TrimSpace(requestID)
	if err := s.chat.RequireRunAccess(ctx, requestID); err != nil {
		return nil, err
	}
	return s.taskStatus(ctx, requestID)
}

func (s Service) TaskStatus(ctx context.Context, requestID string) (map[string]any, error) {
	return s.taskStatus(ctx, strings.TrimSpace(requestID))
}

func (s Service) taskStatus(ctx context.Context, requestID string) (map[string]any, error) {
	run, err := s.repository.FindRunByRequestID(ctx, requestID)
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"run": map[string]any{
			"id":          run.ID,
			"request_id":  run.RequestID,
			"status":      run.Status,
			"output":      decodeOutput(run.Output),
			"error":       run.Error,
			"started_at":  run.StartedAt,
			"finished_at": run.FinishedAt,
		},
	}, nil
}
