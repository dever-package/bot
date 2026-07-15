package loop

import (
	"context"
	"fmt"
	"strings"

	"github.com/google/uuid"
	"github.com/shemic/dever/server"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimecontext "github.com/dever-package/bot/service/agent/runtime/context"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	agentskill "github.com/dever-package/bot/service/agent/skill"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type TaskRequest struct {
	AgentIdentity string
	SessionID     uint64
	Input         map[string]any
	History       []any
	Method        string
	Host          string
	Path          string
	Headers       map[string]string
	Server        *server.Context
}

type statelessRequest struct {
	TaskRequest
	RequestID string
	OnStream  func(map[string]any)
}

func (s Service) RunTask(ctx context.Context, request TaskRequest) map[string]any {
	requestID := uuid.NewString()
	execution, err := s.prepareStatelessExecution(ctx, statelessRequest{
		TaskRequest: request,
		RequestID:   requestID,
	})
	if err != nil {
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	startPayload, err := s.startExecutionStream(ctx, execution)
	if err != nil {
		s.failExecutionStart(execution, err)
		execution.close()
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	if err := s.enqueueExecution(ctx, execution); err != nil {
		s.failExecutionStart(execution, err)
		execution.close()
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	execution.close()
	return startPayload
}

func (s Service) prepareStatelessExecution(ctx context.Context, request statelessRequest) (execution, error) {
	requestID := strings.TrimSpace(request.RequestID)
	if requestID == "" {
		requestID = uuid.NewString()
	}
	input := agentskill.CloneMap(request.Input)
	delete(input, "assistant_session_id")
	delete(input, "assistantSessionId")
	delete(input, "memory_enabled")
	delete(input, "memoryEnabled")
	inputText := agentskill.PrimaryInputText(input)
	if inputText == "" {
		return execution{}, fmt.Errorf("请输入任务内容")
	}
	agent, err := runtimecontext.ResolveAgent(ctx, request.AgentIdentity)
	if err != nil {
		return execution{}, err
	}
	power, err := runtimecontext.ResolveTextPower(ctx, agent.LLMPowerID)
	if err != nil {
		return execution{}, err
	}
	assembled, err := s.assembleTaskContext(ctx, request, agent, inputText)
	if err != nil {
		return execution{}, err
	}
	mounted, err := runtimetool.Mount(ctx, runtimetool.MountRequest{
		Agent:   agent,
		Gateway: s.gateway,
		Method:  request.Method,
		Host:    request.Host,
		Path:    request.Path,
		Headers: request.Headers,
		Server:  request.Server,
	})
	if err != nil {
		return execution{}, err
	}
	prompt := joinRuntimePrompt(assembled.Prompt, mounted.Prompt)
	return s.createExecution(ctx, requestID, executionSpec{
		Agent:     agent,
		Power:     power,
		Prompt:    prompt,
		Input:     input,
		InputText: inputText,
		History:   assembled.History,
		Registry:  mounted.Registry,
		Warnings:  mounted.Warnings,
		Cleanup:   mounted.Close,
		Transport: modelTransport{
			Method:  request.Method,
			Host:    request.Host,
			Path:    request.Path,
			Headers: request.Headers,
		},
		OnStream: request.OnStream,
	})
}

func (s Service) assembleTaskContext(ctx context.Context, request statelessRequest, agent agentmodel.Agent, inputText string) (runtimecontext.Result, error) {
	if request.SessionID == 0 {
		return s.context.AssembleInternal(runtimecontext.InternalAssembleRequest{
			Agent:          agent,
			CategoryPrompt: runtimecontext.CategoryPrompt(ctx, agent.CateID),
			History:        request.History,
		}), nil
	}
	session, err := s.chat.RequireAgentSession(ctx, request.SessionID, agent.Key)
	if err != nil {
		return runtimecontext.Result{}, err
	}
	result, err := s.context.Assemble(ctx, runtimecontext.AssembleRequest{
		Session:        *session,
		Agent:          agent,
		CategoryPrompt: runtimecontext.CategoryPrompt(ctx, agent.CateID),
		Input:          inputText,
	})
	if err != nil {
		return runtimecontext.Result{}, err
	}
	result.History = withoutCurrentUserMessage(result.History, inputText)
	result.HistoryCount = len(result.History)
	return result, nil
}

func withoutCurrentUserMessage(history []any, inputText string) []any {
	if len(history) == 0 {
		return history
	}
	message, ok := history[len(history)-1].(map[string]any)
	if !ok || strings.TrimSpace(fmt.Sprint(message["role"])) != "user" {
		return history
	}
	text := strings.TrimSpace(fmt.Sprint(message["text"]))
	if text == "" {
		text = strings.TrimSpace(fmt.Sprint(message["content"]))
	}
	if text != strings.TrimSpace(inputText) {
		return history
	}
	return append([]any(nil), history[:len(history)-1]...)
}
