package agent

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	agentprompt "my/package/bot/service/agent/prompt"
	frontstream "my/package/front/service/stream"
)

type InternalRunRequest struct {
	AgentKey     string
	RequestID    string
	Method       string
	Host         string
	Path         string
	Headers      map[string]string
	Input        map[string]any
	History      []any
	Options      map[string]any
	OnRunCreated func(runID uint64, requestID string)
}

type InternalRunResult struct {
	Output    map[string]any
	Summary   string
	RequestID string
	RunID     uint64
}

func (s Service) RunInternal(ctx context.Context, req InternalRunRequest) (InternalRunResult, error) {
	agent, err := s.repo.FindAgent(ctx, req.AgentKey)
	if err != nil {
		return InternalRunResult{}, err
	}
	power, err := s.repo.FindPower(ctx, agent.LLMPowerID)
	if err != nil {
		return InternalRunResult{}, err
	}

	input := normalizeInput(req.Input)
	if len(input) == 0 || strings.TrimSpace(primaryInputText(input)) == "" {
		return InternalRunResult{}, fmt.Errorf("内部智能体输入不能为空")
	}
	requestID := strings.TrimSpace(req.RequestID)
	if requestID == "" {
		requestID = uuid.NewString()
	}
	now := time.Now()
	runID := s.repo.InsertRun(ctx, map[string]any{
		"request_id": requestID,
		"agent_id":   agent.ID,
		"agent_key":  agent.Key,
		"input": jsonText(map[string]any{
			"input":   input,
			"history": req.History,
		}),
		"skills":          "[]",
		"runtime_context": "",
		"output":          "",
		"error":           "",
		"status":          runStatusRunning,
		"step_count":      0,
		"latency":         0,
		"started_at":      now,
		"created_at":      now,
	})
	if runID == 0 {
		return InternalRunResult{}, fmt.Errorf("创建内部智能体运行记录失败")
	}
	if req.OnRunCreated != nil {
		req.OnRunCreated(runID, requestID)
	}
	_ = s.writePayload(ctx, requestID, frontstream.ResponsePayload(requestID, "stream", map[string]any{
		"event": "start",
		"text":  "智能体运行已开始",
		"meta": map[string]any{
			"agent":      agent.Key,
			"run_id":     runID,
			"internal":   true,
			"started_at": now.Format(time.RFC3339Nano),
		},
	}, "", 1))

	exec := runExecution{
		Request: RunRequest{
			Method:  req.Method,
			Host:    req.Host,
			Path:    req.Path,
			Headers: req.Headers,
			Body:    map[string]any{"input": input},
		},
		Parsed: parsedRunRequest{
			AgentIdentity: req.AgentKey,
			Input:         input,
			History:       req.History,
			Options:       req.Options,
		},
		Agent:     agent,
		Power:     power,
		RunID:     runID,
		RequestID: requestID,
		StartedAt: now,
	}
	tracker := runTracker{repo: s.repo, runID: runID, requestID: requestID}
	tracker.Step(ctx, "input", "内部输入", primaryInputText(input), map[string]any{"input": input}, stepStatusSuccess)

	runtimePrompt := agentprompt.BuildRuntimePrompt(agentprompt.RuntimeInput{
		PublicSettings: s.repo.ListActivePublicSettings(ctx, agent.SettingPackID),
		AgentSettings:  s.repo.ListActiveAgentSettings(ctx, agent.ID),
		Knowledge:      s.repo.ListActiveAgentKnowledge(ctx, agent.ID),
		History:        req.History,
	})
	s.repo.UpdateRun(ctx, runID, map[string]any{"runtime_context": runtimePrompt})

	turn := s.collectAgentTurn(ctx, exec, runtimePrompt, req.History, 1, 1, "")
	tracker.Step(ctx, "llm_turn", "内部规划", turn.Text, map[string]any{
		"kind":    turn.Kind,
		"text":    turn.Text,
		"output":  turn.Output,
		"message": turn.Message,
	}, turnStepStatus(turn))
	if turn.Kind != agentTurnFinal {
		message := firstText(turn.Message, "内部智能体未返回最终结果")
		s.finishRun(ctx, exec, runStatusFail, turn.Output, turn.Text, message, tracker.seq)
		_ = s.writeErrorResult(ctx, requestID, message)
		return InternalRunResult{}, fmt.Errorf("%s", message)
	}

	output := turn.Output
	summary := strings.TrimSpace(firstText(turn.Text, runOutputText(output, "")))
	s.finishRun(ctx, exec, runStatusSuccess, output, summary, "", tracker.seq)
	_ = s.writeSuccessResult(ctx, requestID, output)
	return InternalRunResult{
		Output:    output,
		Summary:   summary,
		RequestID: requestID,
		RunID:     runID,
	}, nil
}
