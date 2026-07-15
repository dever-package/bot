package loop

import (
	"context"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/shemic/dever/server"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeartifact "github.com/dever-package/bot/service/agent/runtime/artifact"
	runtimechat "github.com/dever-package/bot/service/agent/runtime/chat"
	runtimecontext "github.com/dever-package/bot/service/agent/runtime/context"
	runtimeinput "github.com/dever-package/bot/service/agent/runtime/input"
	runtimereference "github.com/dever-package/bot/service/agent/runtime/reference"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
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
	dispatcher RunDispatcher
}

func NewService() Service {
	return NewServiceWithDispatcherFactory(defaultRunDispatcher)
}

// NewServiceWithDispatcherFactory gives an adapter both stable runtime
// contracts it needs: the executor activity and the durable backlog used for
// startup reconciliation. Passing nil keeps the built-in database scheduler.
func NewServiceWithDispatcherFactory(factory RunDispatcherFactory) Service {
	service := newService()
	if factory == nil {
		factory = defaultRunDispatcher
	}
	service.dispatcher = factory(service, NewRunBacklog())
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
	parsedInput.Params, err = runtimeinput.Normalize(ctx, agent.ID, parsedInput.Params, parsedInput.References)
	if err != nil {
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	parsedInput.Content.Params = parsedInput.Params
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
		Session:        *session,
		Agent:          agent,
		CategoryPrompt: runtimecontext.CategoryPrompt(ctx, agent.CateID),
		Input:          inputText,
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
		Agent:          agent,
		Gateway:        s.gateway,
		References:     toolReferences,
		EnableDocument: true,
		Method:         request.Method,
		Host:           request.Host,
		Path:           request.Path,
		Headers:        request.Headers,
		Server:         request.Server,
	})
	if err != nil {
		_ = s.chat.CompleteRunTurn(ctx, runtimechat.RunTurnCompletion{
			RequestID: requestID, Status: runStatusFail, Error: err.Error(),
		})
		return botprotocol.BuildErrorResponse(requestID, err).Payload()
	}
	prompt := joinRuntimePrompt(assembled.Prompt, mounted.Prompt)
	modelInput := runtimereference.ModelInput(input, parsedInput, resolvedReferences.Prompt)
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
	row, canceled, err := s.cancelRunAndChat(context.Background(), requestID)
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
			_ = s.gateway.StopStream(context.Background(), childRequestID)
		}
	}
	if s.dispatcher != nil {
		_ = s.dispatcher.Cancel(context.Background(), row.ID)
	}
	execution := execution{runID: row.ID, version: row.Version, requestID: requestID}
	_ = s.writeExecutionResult(context.Background(), execution, map[string]any{
		"event": "cancel", "text": "已停止生成",
	}, "", botprotocol.ResponseStatusSuccess)
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

func joinRuntimePrompt(base string, mounted string) string {
	parts := []string{strings.TrimSpace(base), strings.TrimSpace(mounted), strings.TrimSpace(`工具由系统通过原生 Function Calling 提供。需要工具时直接调用，不要在正文中伪造工具 JSON。
普通问候、闲聊和一般咨询必须自然回复，禁止调用 ask_user 询问用户想做什么；能够直接回答时完整输出正文，本轮没有工具调用即表示回答结束。
尚有可自主执行的步骤时必须直接调用所需工具并继续，不得要求用户回复“继续”“开始”“确认”等内容来推进。
只有当用户已经提出明确的具体任务，并且任务缺少无法安全推断的必要参数、选择或素材时，才调用 ask_user；一次最多询问四个必要问题，仍有必要信息缺失时可在用户回答后的下一轮继续询问。
调用 ask_user 前，先用用户当前语言输出一句简短自然说明，解释为什么需要确认这些信息；不要在正文中重复表单问题和选项。
除具体名称、原始文案、详细补充等确实无法枚举的内容外，所有问题必须使用 option 或 multi_option，并给出 2-16 个简短选项和推荐值；主题、风格、用途、数量、比例不得使用自由输入。选项来自已绑定知识库的枚举、标签或目录时，先读取对应原文，并在 16 个上限内完整保留有效选项，不得只截取常用项。自由输入统一使用 textarea，禁止使用 input、number 或 switch；前端会自动提供自定义补充。
禁止在正文中列出任务问题、选项，或要求用户直接回复这些信息；如果准备等待用户回答，ask_user 是唯一允许的交互方式。
任何表示“需要确认、选择、提供或补充信息后才能继续”的正文，如果没有在同一轮调用 ask_user，都会被视为无效输出；不要只承诺稍后开始，也不要用普通问句结束任务。
能根据当前上下文安全推断或使用合理默认值时直接继续执行，不要为了非必要信息调用 ask_user。普通聊天和不要求用户回答的反问不受此限制。
当用户消息包含 interaction_response 时，它是对上一份表单的回答；直接结合其中的数据继续原任务，不要重复询问已经回答的内容。
任务完成时用 Markdown 完整回答用户；Markdown 标题必须独占一行，并在标题前后保留空行。`) + "\n" + runtimeprovider.PresentSuggestionsDecisionRule + `
如果最终答复准备给出多个可继续选择的后续动作，必须在同一轮调用 present_suggestions：用 message 提供自然引导语，用 items 提供按钮，不得把这些动作只写成 Markdown 列表后直接结束。正文只保留已经完成的结果，不得重复按钮选项。没有明确选择项时不要调用 present_suggestions；已经完整回答且没有交互或待执行步骤时直接结束正文。`}
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		if part != "" {
			result = append(result, part)
		}
	}
	return strings.Join(result, "\n\n")
}
