package loop

import (
	"context"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/shemic/dever/server"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	runtimeartifact "github.com/dever-package/bot/service/agent/runtime/artifact"
	runtimeasync "github.com/dever-package/bot/service/agent/runtime/async"
	runtimechat "github.com/dever-package/bot/service/agent/runtime/chat"
	runtimecontext "github.com/dever-package/bot/service/agent/runtime/context"
	runtimeinput "github.com/dever-package/bot/service/agent/runtime/input"
	runtimequeue "github.com/dever-package/bot/service/agent/runtime/queue"
	runtimereference "github.com/dever-package/bot/service/agent/runtime/reference"
	runtimescope "github.com/dever-package/bot/service/agent/runtime/scope"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	agentskill "github.com/dever-package/bot/service/agent/skill"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	frontstream "github.com/dever-package/front/service/stream"
)

const (
	runStatusPending  = "pending"
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
	dispatcher runtimequeue.Dispatcher
}

func NewService() Service {
	service := newService()
	service.dispatcher = defaultRunDispatcher(service, newRunBacklog())
	return service
}

func newService() Service {
	gateway := energonservice.NewGatewayService()
	runtimeartifact.StartJobScheduler()
	return Service{
		repository: newRepository(),
		gateway:    gateway,
		context:    runtimecontext.NewAssembler(),
		chat:       runtimechat.NewServiceWithGateway(gateway),
		streams:    StreamStore(),
		runs:       newRunRegistry(),
	}
}

func (s Service) RunChat(ctx context.Context, request ChatRequest) map[string]any {
	requestedAt := time.Now()
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
	runtimetool.WarmMountAsync(runtimetool.MountRequest{
		Agent:          agent,
		Gateway:        s.gateway,
		PreparationKey: requestID,
	})
	baseRunTurn := runtimechat.RunTurnRequest{
		SessionID:  request.SessionID,
		AgentKey:   agent.Key,
		ContextKey: request.ContextKey,
		RequestID:  requestID,
		Input:      inputText,
	}
	if response := parsedInput.Content.InteractionResponse; response != nil {
		baseRunTurn.InteractionID = response.InteractionID
		baseRunTurn.InteractionData = response.Data
	}
	var (
		normalizedParams map[string]any
		power            energonmodel.Power
		session          *agentmodel.Session
		prepareGroup     runtimeasync.Group
	)
	prepareGroup.Go("规范化智能体参数", func() (currentErr error) {
		normalizedParams, currentErr = runtimeinput.Normalize(ctx, agent.ID, parsedInput.Params, parsedInput.References)
		return currentErr
	})
	prepareGroup.Go("读取文本模型能力", func() (currentErr error) {
		power, currentErr = runtimecontext.ResolveTextPower(ctx, agent.LLMPowerID)
		return currentErr
	})
	prepareGroup.Go("读取智能体会话", func() (currentErr error) {
		session, currentErr = s.chat.RequireRunSession(ctx, baseRunTurn)
		return currentErr
	})
	if prepareErr := prepareGroup.Wait(); prepareErr != nil {
		return botprotocol.BuildErrorResponse(requestID, prepareErr).Payload()
	}
	parsedInput.Params = normalizedParams
	parsedInput.Content.Params = normalizedParams
	runTurn := baseRunTurn
	runTurn.Content = parsedInput.Content.Value()

	var (
		resolvedReferences runtimereference.Result
		assembled          runtimecontext.Result
		contextGroup       runtimeasync.Group
	)
	contextGroup.Go("解析输入引用", func() (currentErr error) {
		resolvedReferences, currentErr = runtimereference.NewRequestResolver(request.Server).Resolve(ctx, *session, parsedInput.References)
		return currentErr
	})
	contextGroup.Go("组装模型上下文", func() (currentErr error) {
		assembled, currentErr = s.context.Assemble(ctx, runtimecontext.AssembleRequest{
			Session:       *session,
			Agent:         agent,
			Input:         inputText,
			IncludeMemory: agent.MemoryEnabled,
		})
		return currentErr
	})
	if prepareErr := contextGroup.Wait(); prepareErr != nil {
		return botprotocol.BuildErrorResponse(requestID, prepareErr).Payload()
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
	modelInput := runtimereference.ModelInput(input, parsedInput, resolvedReferences.Context)
	if len(assembled.Context) > 0 {
		modelInput["runtime_context"] = assembled.Context
	}
	if turn.InteractionResumed {
		modelInput["runtime_event"] = map[string]any{
			"type": "interaction_resumed",
		}
	}
	execution, err := s.createExecution(ctx, requestID, executionSpec{
		Agent:              agent,
		Power:              power,
		SessionID:          session.ID,
		AssistantMessageID: turn.AssistantMessageID,
		Prompt:             assembled.Prompt,
		Input:              modelInput,
		RecordInput:        input,
		InputText:          inputText,
		History:            assembled.History,
		Transport: modelTransport{
			Method: request.Method, Host: request.Host, Path: request.Path, Headers: request.Headers,
		},
		PersistChat:        true,
		MediaReferences:    toolReferences,
		Scope:              runtimescope.FromSession(ctx, *session),
		RequestedAt:        requestedAt,
		PriorKnowledgeUsed: turn.PriorKnowledgeUsed,
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
	cancelCtx, cancel := maintenanceContext()
	row, canceled, err := s.cancelRunAndChat(cancelCtx, requestID)
	cancel()
	if err != nil {
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	if !canceled {
		event := "final"
		text := "当前运行已结束"
		if row.Status == runStatusCanceled {
			event = "cancel"
			text = "已停止生成"
		}
		return botprotocol.BuildSuccessResponse(requestID, botprotocol.Output{
			"event": event,
			"text":  text,
		}).Payload()
	}
	if controller := s.runs.Find(requestID); controller != nil {
		childRequestID := controller.Stop("canceled")
		if childRequestID != "" {
			stopCtx, stopCancel := stopContext()
			_ = s.gateway.StopStream(stopCtx, childRequestID)
			stopCancel()
		}
	}
	if s.dispatcher != nil {
		dispatchCtx, dispatchCancel := stopContext()
		_ = s.dispatcher.Cancel(dispatchCtx, row.ID)
		dispatchCancel()
	}
	execution := execution{runID: row.ID, version: row.Version, requestID: requestID}
	resultCtx, resultCancel := maintenanceContext()
	_ = s.writeExecutionResult(resultCtx, execution, map[string]any{
		"event": "cancel", "text": "已停止生成",
	}, "", botprotocol.ResponseStatusSuccess)
	resultCancel()
	return botprotocol.BuildSuccessResponse(requestID, botprotocol.Output{
		"event": "cancel",
		"text":  "已停止生成",
	}).Payload()
}

func (s Service) cancelRunAndChat(ctx context.Context, requestID string) (
	row agentmodel.Run,
	canceled bool,
	err error,
) {
	canceled, err = s.commitRunTerminal(ctx, runtimechat.RunTurnCompletion{
		RequestID: requestID,
		Status:    runStatusCanceled,
		Text:      "已停止生成",
		Output:    map[string]any{"event": "cancel", "text": "已停止生成"},
		Error:     "任务已取消",
	}, func(tx context.Context) (bool, bool, error) {
		var currentErr error
		row, canceled, currentErr = s.repository.RequestCancel(tx, requestID)
		return canceled, row.SessionID > 0, currentErr
	})
	return row, canceled, err
}

func chatTimeout(seconds int) time.Duration {
	if seconds < 10 || seconds > 3600 {
		return defaultChatTimeout
	}
	return time.Duration(seconds) * time.Second
}

func remainingChatTimeout(startedAt time.Time, seconds int) time.Duration {
	total := chatTimeout(seconds)
	if startedAt.IsZero() {
		return total
	}
	elapsed := time.Since(startedAt)
	if elapsed <= 0 {
		return total
	}
	remaining := total - elapsed
	if remaining <= 0 {
		return time.Millisecond
	}
	return remaining
}
