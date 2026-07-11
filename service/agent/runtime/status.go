package runtime

import (
	"context"
	"strings"
)

func (s Service) Status(ctx context.Context, requestID string) (map[string]any, error) {
	requestID = strings.TrimSpace(requestID)
	if err := s.RequireRunAccess(ctx, requestID); err != nil {
		return nil, err
	}
	run, err := s.repository.FindRunByRequestID(ctx, requestID)
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"run": map[string]any{
			"id":          run.ID,
			"request_id":  run.RequestID,
			"status":      run.Status,
			"output":      map[string]any{"text": run.Output},
			"error":       run.Error,
			"started_at":  run.StartedAt,
			"finished_at": run.FinishedAt,
		},
	}, nil
}
