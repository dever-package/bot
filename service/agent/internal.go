package agent

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	agentaction "github.com/dever-package/bot/service/agent/action"
	agentknowledge "github.com/dever-package/bot/service/agent/knowledge"
	agentprompt "github.com/dever-package/bot/service/agent/prompt"
	frontstream "github.com/dever-package/front/service/stream"
)

type InternalRunRequest struct {
	AgentID      uint64
	RequestID    string
	Method       string
	Host         string
	Path         string
	Headers      map[string]string
	Input        map[string]any
	History      []any
	Options      map[string]any
	OnRunCreated func(runID uint64, requestID string)
	OnStream     func(payload map[string]any)
}

type InternalRunResult struct {
	Output    map[string]any
	Summary   string
	RequestID string
	RunID     uint64
}

func (s Service) RunInternal(ctx context.Context, req InternalRunRequest) (InternalRunResult, error) {
	agent, err := s.repo.FindAgent(ctx, fmt.Sprintf("%d", req.AgentID))
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
	identity := agentIdentity(agent)
	runID := s.repo.InsertRun(ctx, map[string]any{
		"request_id": requestID,
		"agent_id":   agent.ID,
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
	fullRuntime := internalFullRuntimeEnabled(req.Options)
	runtimeOptions := internalRuntimeOptions(req.Options)
	_ = s.writePayload(ctx, requestID, frontstream.ResponsePayload(requestID, "stream", map[string]any{
		"event": "start",
		"text":  "智能体运行已开始",
		"meta": map[string]any{
			"agent":      identity,
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
			AgentIdentity: identity,
			Input:         input,
			History:       req.History,
			Options:       runtimeOptions,
		},
		Agent:     agent,
		Power:     power,
		RunID:     runID,
		RequestID: requestID,
		StartedAt: now,
	}
	stopForward := s.forwardInternalStream(ctx, requestID, req.OnStream)
	defer stopForward()
	if fullRuntime {
		s.execute(exec)
		return s.internalRunResult(ctx, runID, requestID)
	}
	tracker := runTracker{repo: s.repo, runID: runID, requestID: requestID}
	tracker.Step(ctx, "input", "内部输入", primaryInputText(input), map[string]any{"input": input}, stepStatusSuccess)

	knowledgeBases := agentknowledge.NewService().AgentKnowledgeBases(ctx, agent.ID)
	runtimePrompt := agentprompt.BuildRuntimePrompt(agentprompt.RuntimeInput{
		PublicSettings: s.repo.ListActivePublicSettings(ctx, agent.SettingPackID),
		AgentSettings:  s.repo.ListActiveAgentSettings(ctx, agent.ID),
		KnowledgeBases: promptKnowledgeBases(knowledgeBases),
		History:        req.History,
	})
	s.repo.UpdateRun(ctx, runID, map[string]any{"runtime_context": runtimePrompt})
	tracker.Step(ctx, "knowledge", "知识库工具", runtimePrompt, map[string]any{
		"knowledge_bases": len(knowledgeBases),
		"knowledge_mode":  "agentic_tools",
	}, stepStatusSuccess)

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

func (s Service) forwardInternalStream(ctx context.Context, requestID string, forward func(map[string]any)) func() {
	if forward == nil || strings.TrimSpace(requestID) == "" {
		return func() {}
	}
	streamCtx, cancel := context.WithCancel(context.Background())
	done := make(chan struct{})
	go func() {
		defer close(done)
		lastID := "0-0"
		for {
			entries, err := s.ReadStream(streamCtx, requestID, lastID, 100, time.Duration(defaultAgentStreamBlockMs)*time.Millisecond)
			for _, entry := range entries {
				if strings.TrimSpace(entry.ID) != "" {
					lastID = entry.ID
				}
				if entry.Payload != nil {
					forward(entry.Payload)
				}
			}
			if err != nil {
				if streamCtx.Err() != nil {
					return
				}
				continue
			}
			select {
			case <-streamCtx.Done():
				return
			default:
			}
		}
	}()
	return func() {
		cancel()
		select {
		case <-done:
		case <-time.After(2 * time.Second):
		case <-ctx.Done():
		}
	}
}

func internalFullRuntimeEnabled(options map[string]any) bool {
	if options == nil {
		return false
	}
	for _, key := range []string{"full_runtime", "fullRuntime", "runtime"} {
		if enabled, ok := boolOption(options[key]); ok {
			return enabled
		}
	}
	return false
}

func internalRuntimeOptions(options map[string]any) map[string]any {
	if len(options) == 0 {
		return map[string]any{}
	}
	result := make(map[string]any, len(options))
	for key, value := range options {
		switch key {
		case "full_runtime", "fullRuntime", "runtime":
			continue
		default:
			result[key] = value
		}
	}
	return result
}

func boolOption(value any) (bool, bool) {
	switch current := value.(type) {
	case bool:
		return current, true
	case int:
		return current != 0, true
	case int64:
		return current != 0, true
	case float64:
		return current != 0, true
	case string:
		text := strings.ToLower(strings.TrimSpace(current))
		switch text {
		case "1", "true", "yes", "on":
			return true, true
		case "0", "false", "no", "off":
			return false, true
		}
	}
	return false, false
}

func (s Service) internalRunResult(ctx context.Context, runID uint64, requestID string) (InternalRunResult, error) {
	rows := s.repo.ListRuns(ctx, []uint64{runID})
	if len(rows) == 0 {
		return InternalRunResult{}, fmt.Errorf("内部智能体运行记录不存在")
	}
	run := rows[0]
	output := internalRunOutput(run.Output)
	summary := strings.TrimSpace(agentaction.SummaryText(output))
	if run.Status != runStatusSuccess {
		message := strings.TrimSpace(firstText(run.Error, summary, "内部智能体运行失败"))
		return InternalRunResult{}, fmt.Errorf("%s", message)
	}
	return InternalRunResult{
		Output:    output,
		Summary:   summary,
		RequestID: requestID,
		RunID:     runID,
	}, nil
}

func internalRunOutput(raw string) map[string]any {
	value := jsonAny(raw)
	if row, ok := value.(map[string]any); ok {
		return row
	}
	if text := strings.TrimSpace(frontstream.InputText(value)); text != "" {
		return map[string]any{"text": text}
	}
	if value != nil {
		return map[string]any{"value": value}
	}
	return map[string]any{}
}
