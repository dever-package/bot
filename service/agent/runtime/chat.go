package runtime

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimecontext "github.com/dever-package/bot/service/agent/runtime/context"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botstream "github.com/dever-package/bot/service/energon/stream"
	frontstream "github.com/dever-package/front/service/stream"
)

const (
	runStatusRunning  = "running"
	runStatusSuccess  = "success"
	runStatusFail     = "fail"
	runStatusCanceled = "canceled"

	stepStatusSuccess = "success"
	stepStatusFail    = "fail"
	stepStatusWarning = "warning"

	defaultChatTimeout = time.Hour
	streamReadBlock    = time.Second
)

type ChatRequest struct {
	AgentIdentity string
	SessionID     uint64
	ContextKey    string
	Input         string
	Method        string
	Host          string
	Path          string
	Headers       map[string]string
}

type Service struct {
	repository repository
	gateway    energonservice.GatewayService
	context    runtimecontext.Assembler
	compactor  runtimecontext.Compactor
}

func NewService() Service {
	gateway := energonservice.NewGatewayService()
	return Service{
		repository: newRepository(),
		gateway:    gateway,
		context:    runtimecontext.NewAssembler(),
		compactor:  runtimecontext.NewCompactor(gateway),
	}
}

func (s Service) Run(ctx context.Context, request ChatRequest) map[string]any {
	requestID := uuid.NewString()
	input := strings.TrimSpace(request.Input)
	if input == "" {
		return botprotocol.BuildErrorResponse(requestID, fmt.Errorf("请输入消息内容")).Payload()
	}

	agent, err := s.repository.FindAgent(ctx, request.AgentIdentity)
	if err != nil {
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	power, err := s.repository.FindTextPower(ctx, agent.LLMPowerID)
	if err != nil {
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	runTurn := RunTurnRequest{
		SessionID:  request.SessionID,
		AgentKey:   agent.Key,
		ContextKey: request.ContextKey,
		RequestID:  requestID,
		Input:      input,
	}
	session, err := requireRunSession(ctx, runTurn)
	if err != nil {
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	s.compactor.Compact(ctx, session.ID, power.Key, true)
	if refreshed := agentmodel.NewSessionModel().Find(ctx, map[string]any{"id": session.ID}); refreshed != nil {
		session = refreshed
	}
	assembled, err := s.context.Assemble(ctx, runtimecontext.AssembleRequest{
		Session:        *session,
		Agent:          agent,
		CategoryPrompt: s.repository.FindCategoryPrompt(ctx, agent.CateID),
		Input:          input,
	})
	if err != nil {
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	history := assembled.History
	prompt := assembled.Prompt
	startedAt := time.Now()
	err = s.BeginRunTurn(ctx, runTurn)
	if err != nil {
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	runID, err := s.repository.CreateRun(ctx, runRecord{
		RequestID:      requestID,
		AgentID:        agent.ID,
		SessionID:      session.ID,
		Input:          encodeJSON(map[string]any{"text": input}, "{}"),
		RuntimeContext: prompt,
		StartedAt:      startedAt,
	})
	if err != nil {
		s.completeRunTurn(requestID, runStatusFail, "", err.Error())
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}

	if err := s.repository.CreateStep(ctx, stepRecord{
		RunID:     runID,
		RequestID: requestID,
		Seq:       1,
		Type:      "input",
		Title:     "用户输入",
		Content:   input,
		Payload:   encodeJSON(map[string]any{"history_count": assembled.HistoryCount}, "{}"),
		Status:    stepStatusSuccess,
	}); err != nil {
		s.finishRun(runID, requestID, startedAt, runStatusFail, "", err.Error())
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}

	response := s.gateway.Request(ctx, energonservice.GatewayRequest{
		RequestID: requestID,
		Method:    request.Method,
		Host:      request.Host,
		Path:      request.Path,
		Headers:   request.Headers,
		Body:      buildGatewayBody(agent, power, prompt, input, history),
	})
	if response.Status == botprotocol.ResponseStatusFail {
		message := responseMessage(response.Payload(), "调用 LLM 能力失败")
		s.finishRun(runID, requestID, startedAt, runStatusFail, "", message)
		return response.Payload()
	}

	go s.collectRun(runID, requestID, startedAt, chatTimeout(agent.TimeoutSeconds))
	return response.Payload()
}

func (s Service) ReadStream(ctx context.Context, requestID string, lastID string, count int64, block time.Duration) ([]frontstream.Entry, error) {
	return s.gateway.ReadStream(ctx, requestID, lastID, count, block)
}

func (s Service) Stop(ctx context.Context, requestID string) map[string]any {
	requestID = strings.TrimSpace(requestID)
	if err := s.RequireRunAccess(ctx, requestID); err != nil {
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	return s.gateway.StopStream(ctx, requestID).Payload()
}

func (s Service) collectRun(runID uint64, requestID string, startedAt time.Time, timeout time.Duration) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	result := s.gateway.CollectStream(ctx, botstream.CollectOptions{
		RequestID:        requestID,
		InitialLastID:    "0-0",
		Block:            streamReadBlock,
		CollectDeltaText: true,
	})
	partialOutput := strings.TrimSpace(result.State.Text)
	if result.Err != nil {
		message := result.Err.Error()
		if result.Timeout || errors.Is(result.Err, context.DeadlineExceeded) || errors.Is(ctx.Err(), context.DeadlineExceeded) {
			_ = s.gateway.StopStream(context.Background(), requestID)
			message = "智能体运行超时"
		}
		s.finishRun(runID, requestID, startedAt, runStatusFail, partialOutput, message)
		return
	}

	output := botstream.FrameOutput(result.Frame)
	if botstream.OutputEvent(output) == "cancel" {
		s.finishRun(runID, requestID, startedAt, runStatusCanceled, partialOutput, "任务已取消")
		return
	}
	if int(frontstream.InputInt64(result.Frame["status"], 0)) == botprotocol.ResponseStatusFail {
		s.finishRun(runID, requestID, startedAt, runStatusFail, partialOutput, responseMessage(result.Frame, "LLM 能力调用失败"))
		return
	}

	finalOutput := strings.TrimSpace(botprotocol.AsText(output["text"]))
	if finalOutput == "" {
		finalOutput = partialOutput
	}
	if finalOutput == "" {
		s.finishRun(runID, requestID, startedAt, runStatusFail, "", "模型未返回可展示内容")
		return
	}
	s.finishRun(runID, requestID, startedAt, runStatusSuccess, finalOutput, "")
}

func (s Service) finishRun(runID uint64, requestID string, startedAt time.Time, status string, output string, message string) {
	finishedAt := time.Now()
	step := stepRecord{
		RunID:     runID,
		RequestID: requestID,
		Seq:       2,
		Type:      "final",
		Title:     "最终输出",
		Content:   output,
		Payload:   "{}",
		Status:    stepStatusSuccess,
	}
	if status != runStatusSuccess {
		step.Type = "error"
		step.Title = "运行失败"
		step.Content = strings.TrimSpace(message)
		step.Payload = encodeJSON(map[string]any{"partial_output": output}, "{}")
		step.Status = stepStatusFail
		if status == runStatusCanceled {
			step.Title = "运行已取消"
			step.Status = stepStatusWarning
		}
	}

	stepCount := 1
	if err := s.repository.CreateStep(context.Background(), step); err == nil {
		stepCount = 2
	} else if strings.TrimSpace(message) == "" {
		message = err.Error()
	}
	_ = s.repository.FinishRun(context.Background(), runID, runResult{
		Status:     status,
		Output:     output,
		Error:      strings.TrimSpace(message),
		StepCount:  stepCount,
		Latency:    finishedAt.Sub(startedAt).Milliseconds(),
		FinishedAt: finishedAt,
	})
	s.completeRunTurn(requestID, status, output, message)
}

func (s Service) completeRunTurn(requestID string, status string, output string, message string) {
	_ = s.CompleteRunTurn(context.Background(), RunTurnCompletion{
		RequestID: requestID,
		Status:    status,
		Text:      output,
		Output:    map[string]any{"text": output},
		Error:     message,
	})
}

func chatTimeout(seconds int) time.Duration {
	if seconds < 10 || seconds > 3600 {
		return defaultChatTimeout
	}
	return time.Duration(seconds) * time.Second
}

func responseMessage(payload map[string]any, fallback string) string {
	output := botstream.FrameOutput(payload)
	for _, value := range []any{payload["msg"], output["error"], output["text"]} {
		if message := strings.TrimSpace(botprotocol.AsText(value)); message != "" {
			return message
		}
	}
	return fallback
}
