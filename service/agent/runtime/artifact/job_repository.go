package artifact

import (
	"context"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const (
	artifactJobMaxAttempts       = 3
	artifactWritebackMaxAttempts = 6
	artifactJobLease             = 45 * time.Second
	artifactJobHeartbeat         = 10 * time.Second
)

type jobRepository struct{}

func (jobRepository) create(ctx context.Context, values map[string]any) (agentmodel.ArtifactJob, error) {
	id := uint64(agentmodel.NewArtifactJobModel().Insert(ctx, values))
	if id == 0 {
		return agentmodel.ArtifactJob{}, fmt.Errorf("创建素材任务失败")
	}
	row := agentmodel.NewArtifactJobModel().Find(ctx, map[string]any{"id": id})
	if row == nil {
		return agentmodel.ArtifactJob{}, fmt.Errorf("读取素材任务失败")
	}
	return *row, nil
}

func (jobRepository) find(ctx context.Context, id uint64) *agentmodel.ArtifactJob {
	if id == 0 {
		return nil
	}
	return agentmodel.NewArtifactJobModel().Find(ctx, map[string]any{"id": id})
}

func (jobRepository) byToolCall(ctx context.Context, runID uint64, toolCallID string) *agentmodel.ArtifactJob {
	toolCallID = strings.TrimSpace(toolCallID)
	if runID == 0 || toolCallID == "" {
		return nil
	}
	return agentmodel.NewArtifactJobModel().Find(ctx, map[string]any{"run_id": runID, "tool_call_id": toolCallID})
}

func (jobRepository) listRunnable(ctx context.Context, now time.Time, limit int) []agentmodel.ArtifactJob {
	if limit < 1 {
		return []agentmodel.ArtifactJob{}
	}
	expiredLease := map[string]any{"or": []any{
		map[string]any{"lease_expires_at": nil},
		map[string]any{"lease_expires_at": map[string]any{"lte": now}},
	}}
	rows := agentmodel.NewArtifactJobModel().Select(ctx, map[string]any{
		"available_at": map[string]any{"lte": now},
		"or": []any{
			map[string]any{"status": agentmodel.ArtifactJobStatusPending},
			map[string]any{"and": []any{
				map[string]any{"status": agentmodel.ArtifactJobStatusRunning},
				expiredLease,
			}},
		},
	}, map[string]any{"order": "main.available_at asc,main.id asc", "limit": limit})
	result := make([]agentmodel.ArtifactJob, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (jobRepository) listByBlocks(ctx context.Context, blockIDs []uint64, statuses []string) []agentmodel.ArtifactJob {
	if len(blockIDs) == 0 || len(statuses) == 0 {
		return []agentmodel.ArtifactJob{}
	}
	statusValues := make([]any, 0, len(statuses))
	for _, status := range statuses {
		statusValues = append(statusValues, status)
	}
	rows := agentmodel.NewArtifactJobModel().Select(ctx, map[string]any{
		"status":   statusValues,
		"block_id": blockIDs,
	}, map[string]any{"order": "main.id desc"})
	result := make([]agentmodel.ArtifactJob, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (jobRepository) reopen(ctx context.Context, row agentmodel.ArtifactJob, now time.Time) bool {
	if row.ID == 0 || (row.Status != agentmodel.ArtifactJobStatusSuccess && row.Status != agentmodel.ArtifactJobStatusFailed) {
		return false
	}
	return agentmodel.NewArtifactJobModel().Update(ctx, map[string]any{
		"id":      row.ID,
		"status":  row.Status,
		"version": row.Version,
	}, map[string]any{
		"status":           agentmodel.ArtifactJobStatusPending,
		"attempt":          0,
		"version":          row.Version + 1,
		"worker_id":        "",
		"available_at":     now,
		"lease_expires_at": nil,
		"heartbeat_at":     nil,
		"finished_at":      nil,
		"error":            "",
		"updated_at":       now,
	}) == 1
}

func (jobRepository) claim(ctx context.Context, row agentmodel.ArtifactJob, workerID string, now time.Time) bool {
	workerID = strings.TrimSpace(workerID)
	if row.ID == 0 || workerID == "" {
		return false
	}
	filters := map[string]any{
		"id":           row.ID,
		"version":      row.Version,
		"available_at": map[string]any{"lte": now},
	}
	if row.Status == agentmodel.ArtifactJobStatusPending {
		filters["status"] = agentmodel.ArtifactJobStatusPending
	} else {
		filters["status"] = agentmodel.ArtifactJobStatusRunning
		filters["or"] = []any{
			map[string]any{"lease_expires_at": nil},
			map[string]any{"lease_expires_at": map[string]any{"lte": now}},
		}
	}
	return agentmodel.NewArtifactJobModel().Update(ctx, filters, map[string]any{
		"status":           agentmodel.ArtifactJobStatusRunning,
		"worker_id":        workerID,
		"attempt":          row.Attempt + 1,
		"version":          row.Version + 1,
		"heartbeat_at":     now,
		"lease_expires_at": now.Add(artifactJobLease),
		"started_at":       now,
		"updated_at":       now,
	}) == 1
}

func (jobRepository) renew(ctx context.Context, id uint64, workerID string, now time.Time) bool {
	return agentmodel.NewArtifactJobModel().Update(ctx, map[string]any{
		"id":               id,
		"status":           agentmodel.ArtifactJobStatusRunning,
		"worker_id":        strings.TrimSpace(workerID),
		"lease_expires_at": map[string]any{"gt": now},
	}, map[string]any{
		"heartbeat_at":     now,
		"lease_expires_at": now.Add(artifactJobLease),
		"updated_at":       now,
	}) == 1
}

func (jobRepository) retry(ctx context.Context, row agentmodel.ArtifactJob, workerID string, message string) bool {
	delay := time.Duration(row.Attempt*row.Attempt) * 5 * time.Second
	if delay > time.Minute {
		delay = time.Minute
	}
	return jobRepository{}.retryAfter(ctx, row, workerID, message, delay)
}

func (jobRepository) retryWriteback(ctx context.Context, row agentmodel.ArtifactJob, workerID string, message string) bool {
	delay := time.Second
	for attempt := 1; attempt < row.Attempt && delay < time.Minute; attempt++ {
		delay *= 2
	}
	if delay > time.Minute {
		delay = time.Minute
	}
	return jobRepository{}.retryAfter(ctx, row, workerID, message, delay)
}

func (jobRepository) retryAfter(
	ctx context.Context,
	row agentmodel.ArtifactJob,
	workerID string,
	message string,
	delay time.Duration,
) bool {
	now := time.Now()
	return agentmodel.NewArtifactJobModel().Update(ctx, map[string]any{
		"id":        row.ID,
		"status":    agentmodel.ArtifactJobStatusRunning,
		"worker_id": strings.TrimSpace(workerID),
	}, map[string]any{
		"status":           agentmodel.ArtifactJobStatusPending,
		"worker_id":        "",
		"available_at":     now.Add(delay),
		"lease_expires_at": nil,
		"heartbeat_at":     nil,
		"error":            strings.TrimSpace(message),
		"updated_at":       now,
	}) == 1
}

func (jobRepository) finish(ctx context.Context, row agentmodel.ArtifactJob, workerID string, status string, message string) bool {
	now := time.Now()
	return agentmodel.NewArtifactJobModel().Update(ctx, map[string]any{
		"id":        row.ID,
		"status":    agentmodel.ArtifactJobStatusRunning,
		"worker_id": strings.TrimSpace(workerID),
	}, map[string]any{
		"status":           status,
		"worker_id":        "",
		"lease_expires_at": nil,
		"heartbeat_at":     nil,
		"error":            strings.TrimSpace(message),
		"finished_at":      now,
		"updated_at":       now,
	}) == 1
}
