package knowledge

import (
	"context"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const (
	knowledgeIndexLeaseDuration = 45 * time.Second
	knowledgeIndexHeartbeat     = 10 * time.Second
)

type knowledgeIndexRun struct {
	baseID   uint64
	workerID string
	ctx      context.Context
	cancel   context.CancelFunc
	done     chan struct{}
	once     sync.Once
}

func newKnowledgeIndexRun(baseID uint64, workerID string) *knowledgeIndexRun {
	ctx, cancel := context.WithCancel(context.Background())
	run := &knowledgeIndexRun{
		baseID:   baseID,
		workerID: strings.TrimSpace(workerID),
		ctx:      ctx,
		cancel:   cancel,
		done:     make(chan struct{}),
	}
	go heartbeatKnowledgeIndexLease(ctx, baseID, run.workerID, run.done, cancel)
	return run
}

func (r *knowledgeIndexRun) finish(status string, message string) {
	if r == nil {
		return
	}
	r.once.Do(func() {
		close(r.done)
		r.cancel()
		finishKnowledgeIndexLease(context.Background(), r.baseID, r.workerID, status, message)
	})
}

func claimKnowledgeIndexLease(ctx context.Context, baseID uint64) (string, bool) {
	if baseID == 0 {
		return "", false
	}
	now := time.Now()
	workerID := "knowledge:" + uuid.NewString()
	updated := agentmodel.NewKnowledgeBaseModel().Update(ctx, map[string]any{
		"id": baseID,
		"or": []any{
			map[string]any{"index_lease_expires_at": nil},
			map[string]any{"index_lease_expires_at": map[string]any{"lte": now}},
		},
	}, map[string]any{
		"index_status":           agentmodel.KnowledgeIndexStatusRunning,
		"index_worker_id":        workerID,
		"index_lease_expires_at": now.Add(knowledgeIndexLeaseDuration),
		"index_heartbeat_at":     now,
		"error_message":          "",
	})
	if updated == 0 {
		return "", false
	}
	recoverInterruptedKnowledgeIndex(ctx, baseID)
	return workerID, true
}

func activeKnowledgeIndexLease(ctx context.Context, baseID uint64) bool {
	if baseID == 0 {
		return false
	}
	row := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{
		"id":                     baseID,
		"index_worker_id":        map[string]any{"neq": ""},
		"index_lease_expires_at": map[string]any{"gt": time.Now()},
	})
	return row != nil
}

func renewKnowledgeIndexLease(ctx context.Context, baseID uint64, workerID string) bool {
	workerID = strings.TrimSpace(workerID)
	if baseID == 0 || workerID == "" {
		return false
	}
	now := time.Now()
	return agentmodel.NewKnowledgeBaseModel().Update(ctx, map[string]any{
		"id":                     baseID,
		"index_worker_id":        workerID,
		"index_lease_expires_at": map[string]any{"gt": now},
	}, map[string]any{
		"index_lease_expires_at": now.Add(knowledgeIndexLeaseDuration),
		"index_heartbeat_at":     now,
	}) == 1
}

func heartbeatKnowledgeIndexLease(ctx context.Context, baseID uint64, workerID string, done <-chan struct{}, cancel context.CancelFunc) {
	ticker := time.NewTicker(knowledgeIndexHeartbeat)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case <-done:
			return
		case <-ticker.C:
			if !renewKnowledgeIndexLease(context.Background(), baseID, workerID) {
				cancel()
				return
			}
		}
	}
}

func finishKnowledgeIndexLease(ctx context.Context, baseID uint64, workerID string, status string, message string) bool {
	workerID = strings.TrimSpace(workerID)
	if baseID == 0 || workerID == "" {
		return false
	}
	values := knowledgeBaseStatsValues(ctx, baseID, status, message, false)
	values["index_worker_id"] = ""
	values["index_lease_expires_at"] = nil
	values["index_heartbeat_at"] = nil
	return agentmodel.NewKnowledgeBaseModel().Update(ctx, map[string]any{
		"id":              baseID,
		"index_worker_id": workerID,
	}, values) == 1
}
