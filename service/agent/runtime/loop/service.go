package loop

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/shemic/dever/server"

	runtimechat "github.com/dever-package/bot/service/agent/runtime/chat"
	runtimecontext "github.com/dever-package/bot/service/agent/runtime/context"
	runtimereference "github.com/dever-package/bot/service/agent/runtime/reference"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	agentskill "github.com/dever-package/bot/service/agent/skill"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
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
	Input         map[string]any
	Method        string
	Host          string
	Path          string
	Headers       map[string]string
	Server        *server.Context
}

type Service struct {
	repository repository
	gateway    energonservice.GatewayService
	context    runtimecontext.Assembler
	chat       runtimechat.Service
	streams    frontstream.Service
	runs       *runRegistry
}

func NewService() Service {
	gateway := energonservice.NewGatewayService()
	return Service{
		repository: newRepository(),
		gateway:    gateway,
		context:    runtimecontext.NewAssembler(),
		chat:       runtimechat.NewServiceWithGateway(gateway),
		streams:    frontstream.New(runtimeStreamNamespace),
		runs:       newRunRegistry(),
	}
}

func (s Service) RunChat(ctx context.Context, request ChatRequest) map[string]any {
	requestID := uuid.NewString()
	input := agentskill.CloneMap(request.Input)
	parsedInput, err := runtimereference.ParseInput(input)
	if err != nil {
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	inputText := parsedInput.Text

	agent, err := runtimecontext.ResolveAgent(ctx, request.AgentIdentity)
	if err != nil {
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	power, err := runtimecontext.ResolveTextPower(ctx, agent.LLMPowerID)
	if err != nil {
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	runTurn := runtimechat.RunTurnRequest{
		SessionID:  request.SessionID,
		AgentKey:   agent.Key,
		ContextKey: request.ContextKey,
		RequestID:  requestID,
		Input:      inputText,
		Content:    parsedInput.Content.Value(),
	}
	session, err := s.chat.RequireRunSession(ctx, runTurn)
	if err != nil {
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	resolvedReferences, err := runtimereference.NewRequestResolver(request.Server).Resolve(ctx, *session, parsedInput.References)
	if err != nil {
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	assembled, err := s.context.Assemble(ctx, runtimecontext.AssembleRequest{
		Session:         *session,
		Agent:           agent,
		CategoryPrompt:  runtimecontext.CategoryPrompt(ctx, agent.CateID),
		Input:           inputText,
		ReferencePrompt: resolvedReferences.Prompt,
	})
	if err != nil {
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	turn, err := s.chat.BeginRunTurn(ctx, runTurn)
	if err != nil {
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	boundUploads, err := bindInputUploads(ctx, *session, turn.UserMessageID, resolvedReferences.Media)
	if err != nil {
		_ = s.chat.CompleteRunTurn(ctx, runtimechat.RunTurnCompletion{
			RequestID: requestID, Status: runStatusFail, Error: err.Error(),
		})
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	toolReferences := attachBoundUploads(mediaReferences(resolvedReferences.Media), boundUploads)
	toolReferences = withActiveSeriesReference(ctx, *session, toolReferences)
	mounted, err := runtimetool.Mount(ctx, runtimetool.MountRequest{
		Agent:      agent,
		Gateway:    s.gateway,
		References: toolReferences,
		Method:     request.Method,
		Host:       request.Host,
		Path:       request.Path,
		Headers:    request.Headers,
		Server:     request.Server,
	})
	if err != nil {
		_ = s.chat.CompleteRunTurn(ctx, runtimechat.RunTurnCompletion{
			RequestID: requestID, Status: runStatusFail, Error: err.Error(),
		})
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	prompt := joinRuntimePrompt(assembled.Prompt, mounted.Prompt)
	modelInput := runtimereference.ModelInput(input, parsedInput)
	execution, err := s.createExecution(ctx, requestID, executionSpec{
		Agent:              agent,
		Power:              power,
		SessionID:          session.ID,
		UserMessageID:      turn.UserMessageID,
		AssistantMessageID: turn.AssistantMessageID,
		Prompt:             prompt,
		Input:              modelInput,
		RecordInput:        input,
		InputText:          inputText,
		History:            assembled.History,
		Registry:           mounted.Registry,
		Warnings:           mounted.Warnings,
		Transport: modelTransport{
			Method: request.Method, Host: request.Host, Path: request.Path, Headers: request.Headers,
		},
		PersistChat:     true,
		MediaReferences: toolReferences,
		Cleanup:         mounted.Close,
	})
	if err != nil {
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	controller := s.runs.Start(requestID, context.Background(), chatTimeout(agent.TimeoutSeconds))
	startPayload, err := s.startExecutionStream(ctx, execution)
	if err != nil {
		controller.Stop("fail")
		s.runs.Remove(requestID)
		s.failExecutionStart(execution, err)
		execution.close()
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	go s.run(controller, execution)
	return startPayload
}

func (s Service) ReadStream(ctx context.Context, requestID string, lastID string, count int64, block time.Duration) ([]frontstream.Entry, error) {
	return s.streams.Read(ctx, requestID, lastID, count, block)
}

func (s Service) Stop(ctx context.Context, requestID string) map[string]any {
	requestID = strings.TrimSpace(requestID)
	if err := s.chat.RequireRunAccess(ctx, requestID); err != nil {
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	return s.stopTask(requestID)
}

func (s Service) StopTask(requestID string) map[string]any {
	return s.stopTask(strings.TrimSpace(requestID))
}

func (s Service) stopTask(requestID string) map[string]any {
	controller := s.runs.Find(requestID)
	if controller == nil {
		return botprotocol.BuildErrorResponse(requestID, fmt.Errorf("当前运行已结束或不在本实例执行")).Payload()
	}
	childRequestID := controller.Stop("canceled")
	if childRequestID != "" {
		_ = s.gateway.StopStream(context.Background(), childRequestID)
	}
	return botprotocol.BuildSuccessResponse(requestID, botprotocol.Output{
		"event": "cancel",
		"text":  "已停止生成",
	}).Payload()
}

func chatTimeout(seconds int) time.Duration {
	if seconds < 10 || seconds > 3600 {
		return defaultChatTimeout
	}
	return time.Duration(seconds) * time.Second
}

func joinRuntimePrompt(base string, mounted string) string {
	parts := []string{strings.TrimSpace(base), strings.TrimSpace(mounted), strings.TrimSpace(`工具由系统通过原生 Function Calling 提供。需要工具时直接调用，不要在正文中伪造工具 JSON。缺少继续执行所必需的信息时调用 ask_user；任务完成后直接用 Markdown 回答用户。`)}
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		if part != "" {
			result = append(result, part)
		}
	}
	return strings.Join(result, "\n\n")
}
