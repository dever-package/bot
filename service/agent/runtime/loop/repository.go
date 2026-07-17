package loop

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/shemic/dever/orm"

	agentmodel "github.com/dever-package/bot/model/agent"
)

var errRunLeaseLost = errors.New("智能体运行租约已失效")

type repository struct{}

type runRecord struct {
	RequestID      string
	AgentID        uint64
	SessionID      uint64
	Input          string
	RuntimeContext string
	Snapshot       string
	Checkpoint     string
	StartedAt      time.Time
}

type stepRecord struct {
	RunID     uint64
	RequestID string
	Seq       int
	Type      string
	Title     string
	Content   string
	Payload   string
	Status    string
}

type runResult struct {
	Status     string
	Output     string
	Error      string
	StepCount  int
	Latency    int64
	FinishedAt time.Time
}

func newRepository() repository {
	return repository{}
}

func (repository) CreateRun(ctx context.Context, record runRecord, initialStep stepRecord) (id uint64, err error) {
	defer repositoryError(&err)
	now := record.StartedAt
	if now.IsZero() {
		now = time.Now()
	}
	err = orm.Transaction(ctx, func(tx context.Context) error {
		id = uint64(agentmodel.NewRunModel().Insert(tx, map[string]any{
			"request_id":       record.RequestID,
			"agent_id":         record.AgentID,
			"session_id":       record.SessionID,
			"input":            record.Input,
			"skills":           "[]",
			"runtime_context":  record.RuntimeContext,
			"snapshot":         record.Snapshot,
			"checkpoint":       record.Checkpoint,
			"output":           "",
			"error":            "",
			"status":           runStatusPending,
			"worker_id":        "",
			"cancel_requested": false,
			"attempt":          0,
			"version":          1,
			"step_count":       1,
			"latency":          0,
			"available_at":     now.Add(runtimeEnqueueFallback),
			"started_at":       now,
			"created_at":       now,
		}))
		if id == 0 {
			return fmt.Errorf("创建智能体运行记录失败")
		}
		initialStep.RunID = id
		initialStep.RequestID = record.RequestID
		return createStep(tx, initialStep)
	})
	return id, err
}

func (repository) EnqueueRun(ctx context.Context, runID uint64, now time.Time) (queued bool, err error) {
	defer repositoryError(&err)
	affected := agentmodel.NewRunModel().Update(ctx, map[string]any{
		"id":     runID,
		"status": runStatusPending,
	}, map[string]any{
		"available_at": now,
	})
	return affected == 1, nil
}

func createStep(ctx context.Context, record stepRecord) error {
	id := uint64(agentmodel.NewStepModel().Insert(ctx, map[string]any{
		"run_id":     record.RunID,
		"request_id": record.RequestID,
		"seq":        record.Seq,
		"type":       record.Type,
		"title":      record.Title,
		"content":    record.Content,
		"payload":    record.Payload,
		"status":     record.Status,
		"created_at": time.Now(),
	}))
	if id == 0 {
		return fmt.Errorf("创建智能体运行步骤失败")
	}
	return nil
}

// CommitStep atomically records a completed step and its resume checkpoint.
// The worker lease is part of the update condition, so an expired worker cannot
// commit stale tool results after another worker has reclaimed the run.
func (repository) CommitStep(
	ctx context.Context,
	record stepRecord,
	checkpoint string,
	skills []string,
	workerID string,
	leaseUntil time.Time,
) (err error) {
	if record.RunID == 0 || strings.TrimSpace(workerID) == "" {
		return errRunLeaseLost
	}
	defer repositoryError(&err)
	return orm.Transaction(ctx, func(tx context.Context) error {
		if err := createStep(tx, record); err != nil {
			return err
		}
		affected := agentmodel.NewRunModel().Update(tx, map[string]any{
			"id":               record.RunID,
			"status":           runStatusRunning,
			"worker_id":        workerID,
			"cancel_requested": false,
			"lease_expires_at": map[string]any{"gt": time.Now()},
		}, map[string]any{
			"checkpoint":       checkpoint,
			"skills":           encodeJSON(skills, "[]"),
			"step_count":       record.Seq,
			"heartbeat_at":     time.Now(),
			"lease_expires_at": leaseUntil,
		})
		if affected == 0 {
			return errRunLeaseLost
		}
		return nil
	})
}

func (repository) CommitCheckpoint(
	ctx context.Context,
	runID uint64,
	checkpoint string,
	skills []string,
	workerID string,
	leaseUntil time.Time,
) (err error) {
	if runID == 0 || strings.TrimSpace(workerID) == "" {
		return errRunLeaseLost
	}
	defer repositoryError(&err)
	affected := agentmodel.NewRunModel().Update(ctx, map[string]any{
		"id":               runID,
		"status":           runStatusRunning,
		"worker_id":        workerID,
		"cancel_requested": false,
		"lease_expires_at": map[string]any{"gt": time.Now()},
	}, map[string]any{
		"checkpoint":       checkpoint,
		"skills":           encodeJSON(skills, "[]"),
		"heartbeat_at":     time.Now(),
		"lease_expires_at": leaseUntil,
	})
	if affected == 0 {
		return errRunLeaseLost
	}
	return nil
}

func (repository) ListRunnable(ctx context.Context, now time.Time, limit int) (rows []agentmodel.Run, err error) {
	defer repositoryError(&err)
	if limit < 1 {
		return []agentmodel.Run{}, nil
	}
	expiredLease := map[string]any{"or": []any{
		map[string]any{"lease_expires_at": nil},
		map[string]any{"lease_expires_at": map[string]any{"lte": now}},
	}}
	runningWithoutLease := map[string]any{"and": []any{
		map[string]any{"status": runStatusRunning},
		expiredLease,
	}}
	values := agentmodel.NewRunModel().Select(ctx, map[string]any{
		"cancel_requested": false,
		"available_at":     map[string]any{"lte": now},
		"or": []any{
			map[string]any{"status": runStatusPending},
			runningWithoutLease,
		},
	}, map[string]any{"order": "main.available_at asc,main.id asc", "limit": limit})
	result := make([]agentmodel.Run, 0, len(values))
	for _, row := range values {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result, nil
}

func (repository) ClaimRun(ctx context.Context, row agentmodel.Run, workerID string, now time.Time, leaseUntil time.Time) (claimed bool, err error) {
	workerID = strings.TrimSpace(workerID)
	if row.ID == 0 || workerID == "" {
		return false, nil
	}
	defer repositoryError(&err)
	filters := map[string]any{
		"id":               row.ID,
		"version":          row.Version,
		"cancel_requested": false,
		"available_at":     map[string]any{"lte": now},
	}
	if row.Status == runStatusPending {
		filters["status"] = runStatusPending
	} else {
		filters["status"] = runStatusRunning
		filters["or"] = []any{
			map[string]any{"lease_expires_at": nil},
			map[string]any{"lease_expires_at": map[string]any{"lte": now}},
		}
	}
	affected := agentmodel.NewRunModel().Update(ctx, filters, map[string]any{
		"status":           runStatusRunning,
		"worker_id":        workerID,
		"attempt":          row.Attempt + 1,
		"version":          row.Version + 1,
		"heartbeat_at":     now,
		"lease_expires_at": leaseUntil,
	})
	return affected == 1, nil
}

func (repository) StartDirectRun(ctx context.Context, runID uint64, workerID string, now time.Time, leaseUntil time.Time) (started bool, err error) {
	defer repositoryError(&err)
	affected := agentmodel.NewRunModel().Update(ctx, map[string]any{
		"id":               runID,
		"status":           runStatusPending,
		"cancel_requested": false,
	}, map[string]any{
		"status":           runStatusRunning,
		"worker_id":        strings.TrimSpace(workerID),
		"attempt":          1,
		"version":          2,
		"heartbeat_at":     now,
		"lease_expires_at": leaseUntil,
	})
	return affected == 1, nil
}

func (repository) RenewLease(ctx context.Context, runID uint64, workerID string, now time.Time, leaseUntil time.Time) (renewed bool, err error) {
	defer repositoryError(&err)
	affected := agentmodel.NewRunModel().Update(ctx, map[string]any{
		"id":               runID,
		"status":           runStatusRunning,
		"worker_id":        strings.TrimSpace(workerID),
		"cancel_requested": false,
		"lease_expires_at": map[string]any{"gt": now},
	}, map[string]any{
		"heartbeat_at":     now,
		"lease_expires_at": leaseUntil,
	})
	return affected == 1, nil
}

func (repository) FinishRun(ctx context.Context, runID uint64, workerID string, result runResult) (finished bool, err error) {
	if runID == 0 {
		return false, fmt.Errorf("智能体运行记录不能为空")
	}
	defer repositoryError(&err)
	filters := map[string]any{"id": runID}
	if strings.TrimSpace(workerID) != "" {
		filters["status"] = runStatusRunning
		filters["worker_id"] = strings.TrimSpace(workerID)
		filters["cancel_requested"] = false
		filters["lease_expires_at"] = map[string]any{"gt": time.Now()}
	} else {
		filters["status"] = runStatusPending
		filters["cancel_requested"] = false
	}
	affected := agentmodel.NewRunModel().Update(ctx, filters, map[string]any{
		"status":           result.Status,
		"output":           result.Output,
		"error":            result.Error,
		"step_count":       result.StepCount,
		"latency":          result.Latency,
		"worker_id":        "",
		"cancel_requested": false,
		"lease_expires_at": nil,
		"finished_at":      result.FinishedAt,
	})
	return affected == 1, nil
}

func (repo repository) RequestCancel(ctx context.Context, requestID string) (row agentmodel.Run, changed bool, err error) {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return agentmodel.Run{}, false, fmt.Errorf("运行请求ID不能为空")
	}
	for attempt := 0; attempt < 3; attempt++ {
		current, findErr := repo.FindRunByRequestID(ctx, requestID)
		if findErr != nil {
			return agentmodel.Run{}, false, findErr
		}
		if isTerminalRunStatus(current.Status) {
			return current, false, nil
		}
		now := time.Now()
		values := map[string]any{
			"cancel_requested": true,
			"version":          current.Version + 1,
			"status":           runStatusCanceled,
			"output":           encodeJSON(map[string]any{"event": "cancel", "text": "已停止生成"}, "{}"),
			"error":            "任务已取消",
			"worker_id":        "",
			"lease_expires_at": nil,
			"finished_at":      now,
		}
		var affected int64
		func() {
			defer repositoryError(&err)
			affected = agentmodel.NewRunModel().Update(ctx, map[string]any{
				"id":      current.ID,
				"version": current.Version,
				"status":  current.Status,
			}, values)
		}()
		if err != nil {
			return agentmodel.Run{}, false, err
		}
		if affected == 1 {
			updated, readErr := repo.FindRunByID(ctx, current.ID)
			return updated, true, readErr
		}
	}
	return agentmodel.Run{}, false, fmt.Errorf("取消智能体运行失败，请重试")
}

func (repository) FindRunByID(ctx context.Context, runID uint64) (row agentmodel.Run, err error) {
	if runID == 0 {
		return agentmodel.Run{}, fmt.Errorf("智能体运行ID不能为空")
	}
	defer repositoryError(&err)
	current := agentmodel.NewRunModel().Find(ctx, map[string]any{"id": runID})
	if current == nil {
		return agentmodel.Run{}, fmt.Errorf("智能体运行不存在")
	}
	return *current, nil
}

func (repository) FindRunByRequestID(ctx context.Context, requestID string) (row agentmodel.Run, err error) {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return agentmodel.Run{}, fmt.Errorf("运行请求ID不能为空")
	}
	defer repositoryError(&err)
	current := agentmodel.NewRunModel().Find(ctx, map[string]any{"request_id": requestID})
	if current == nil {
		return agentmodel.Run{}, fmt.Errorf("智能体运行不存在")
	}
	return *current, nil
}

func (repository) ListRuns(ctx context.Context, runIDs []uint64) []agentmodel.Run {
	values := uniqueIDValues(runIDs)
	if len(values) == 0 {
		return []agentmodel.Run{}
	}
	rows := agentmodel.NewRunModel().Select(ctx, map[string]any{"id": values})
	result := make([]agentmodel.Run, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (repository) ListStepsByRun(ctx context.Context, runIDs []uint64) map[uint64][]agentmodel.Step {
	result := map[uint64][]agentmodel.Step{}
	values := uniqueIDValues(runIDs)
	if len(values) == 0 {
		return result
	}
	rows := agentmodel.NewStepModel().Select(ctx, map[string]any{"run_id": values})
	for _, row := range rows {
		if row != nil {
			result[row.RunID] = append(result[row.RunID], *row)
		}
	}
	return result
}

func isTerminalRunStatus(status string) bool {
	switch strings.TrimSpace(status) {
	case runStatusSuccess, runStatusFail, runStatusCanceled:
		return true
	default:
		return false
	}
}

func uniqueIDValues(ids []uint64) []any {
	seen := make(map[uint64]struct{}, len(ids))
	values := make([]any, 0, len(ids))
	for _, id := range ids {
		if id == 0 {
			continue
		}
		if _, exists := seen[id]; exists {
			continue
		}
		seen[id] = struct{}{}
		values = append(values, id)
	}
	return values
}

func repositoryError(target *error) {
	if current := recover(); current != nil {
		*target = fmt.Errorf("保存智能体运行记录失败: %v", current)
	}
}
