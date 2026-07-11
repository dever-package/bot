package runtime

import (
	"context"
	"fmt"
	"strconv"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
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

func (repository) FindAgent(ctx context.Context, identity string) (agentmodel.Agent, error) {
	identity = strings.TrimSpace(identity)
	if identity == "" {
		return agentmodel.Agent{}, fmt.Errorf("智能体不能为空")
	}

	model := agentmodel.NewAgentModel()
	var row *agentmodel.Agent
	if id, err := strconv.ParseUint(identity, 10, 64); err == nil && id > 0 {
		row = model.Find(ctx, map[string]any{"id": id})
	}
	if row == nil {
		row = model.Find(ctx, map[string]any{"key": identity})
	}
	if row == nil {
		return agentmodel.Agent{}, fmt.Errorf("未找到智能体: %s", identity)
	}
	if row.Status != 1 {
		return agentmodel.Agent{}, fmt.Errorf("智能体已停用: %s", row.Name)
	}
	if row.LLMPowerID == 0 {
		return agentmodel.Agent{}, fmt.Errorf("智能体未配置 LLM 能力")
	}
	if strings.TrimSpace(row.Prompt) == "" {
		row.Prompt = agentmodel.BuiltinAgentPrompt(row.Key)
	}
	return *row, nil
}

func (repository) FindTextPower(ctx context.Context, id uint64) (energonmodel.Power, error) {
	row := energonmodel.NewPowerModel().Find(ctx, map[string]any{"id": id})
	if row == nil {
		return energonmodel.Power{}, fmt.Errorf("LLM 能力不存在")
	}
	if row.Status != 1 {
		return energonmodel.Power{}, fmt.Errorf("LLM 能力已停用: %s", row.Name)
	}
	if !strings.EqualFold(strings.TrimSpace(row.Kind), "text") {
		return energonmodel.Power{}, fmt.Errorf("LLM 能力必须是文本类型: %s", row.Name)
	}
	return *row, nil
}

func (repository) FindCategoryPrompt(ctx context.Context, categoryID uint64) string {
	if categoryID == 0 {
		return ""
	}
	row := agentmodel.NewAgentCateModel().Find(ctx, map[string]any{"id": categoryID})
	if row == nil {
		return ""
	}
	return strings.TrimSpace(row.Prompt)
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

func repositoryError(target *error) {
	if current := recover(); current != nil {
		*target = fmt.Errorf("保存智能体运行记录失败: %v", current)
	}
}
