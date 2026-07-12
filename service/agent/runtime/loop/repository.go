package loop

import (
	"context"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

type repository struct{}

type runRecord struct {
	RequestID      string
	AgentID        uint64
	SessionID      uint64
	Input          string
	RuntimeContext string
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

func (repository) CreateRun(ctx context.Context, record runRecord) (id uint64, err error) {
	defer repositoryError(&err)
	id = uint64(agentmodel.NewRunModel().Insert(ctx, map[string]any{
		"request_id":      record.RequestID,
		"agent_id":        record.AgentID,
		"session_id":      record.SessionID,
		"input":           record.Input,
		"skills":          "[]",
		"runtime_context": record.RuntimeContext,
		"output":          "",
		"error":           "",
		"status":          runStatusRunning,
		"step_count":      0,
		"latency":         0,
		"started_at":      record.StartedAt,
		"created_at":      record.StartedAt,
	}))
	if id == 0 {
		return 0, fmt.Errorf("创建智能体运行记录失败")
	}
	return id, nil
}

func (repository) CreateStep(ctx context.Context, record stepRecord) (err error) {
	defer repositoryError(&err)
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

func (repository) FinishRun(ctx context.Context, runID uint64, result runResult) (err error) {
	if runID == 0 {
		return fmt.Errorf("智能体运行记录不能为空")
	}
	defer repositoryError(&err)
	agentmodel.NewRunModel().Update(ctx, map[string]any{"id": runID}, map[string]any{
		"status":      result.Status,
		"output":      result.Output,
		"error":       result.Error,
		"step_count":  result.StepCount,
		"latency":     result.Latency,
		"finished_at": result.FinishedAt,
	})
	return nil
}

func (repository) UpdateRunSkills(ctx context.Context, runID uint64, skills []string) (err error) {
	if runID == 0 {
		return fmt.Errorf("智能体运行记录不能为空")
	}
	defer repositoryError(&err)
	agentmodel.NewRunModel().Update(ctx, map[string]any{"id": runID}, map[string]any{
		"skills": encodeJSON(skills, "[]"),
	})
	return nil
}

func (repository) FindRunByRequestID(ctx context.Context, requestID string) (agentmodel.Run, error) {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return agentmodel.Run{}, fmt.Errorf("运行请求ID不能为空")
	}
	row := agentmodel.NewRunModel().Find(ctx, map[string]any{"request_id": requestID})
	if row == nil {
		return agentmodel.Run{}, fmt.Errorf("智能体运行不存在")
	}
	return *row, nil
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
