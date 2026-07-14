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
	runtimeinput "github.com/dever-package/bot/service/agent/runtime/input"
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
	parts := []string{strings.TrimSpace(base), strings.TrimSpace(mounted), strings.TrimSpace(`工具由系统通过原生 Function Calling 提供。需要工具时直接调用，不要在正文中伪造工具 JSON。
不需要工具时直接正常回答用户；没有工具调用的模型回复就是本轮最终答复。普通问候、闲聊和一般咨询必须自然回复，禁止调用 ask_user 询问用户想做什么。
尚有可自主执行的步骤时必须直接调用所需工具并继续，不得要求用户回复“继续”“开始”“确认”等内容来推进。
只有当用户已经提出明确的具体任务，并且任务缺少无法安全推断的必要参数、选择或素材时，才调用 ask_user；一次最多询问四个必要问题，仍有必要信息缺失时可在用户回答后的下一轮继续询问。
调用 ask_user 前，先用用户当前语言输出一句简短自然说明，解释为什么需要确认这些信息；不要在正文中重复表单问题和选项。
除具体名称、原始文案、详细补充等确实无法枚举的内容外，所有问题必须使用 option 或 multi_option，并给出 2-16 个简短选项和推荐值；主题、风格、用途、数量、比例不得使用自由输入。选项来自已绑定知识库的枚举、标签或目录时，先读取对应原文，并在 16 个上限内完整保留有效选项，不得只截取常用项。自由输入统一使用 textarea，禁止使用 input、number 或 switch；前端会自动提供自定义补充。
禁止在正文中列出任务问题、选项，或要求用户直接回复这些信息；如果准备等待用户回答，ask_user 是唯一允许的交互方式。
任何表示“需要确认、选择、提供或补充信息后才能继续”的正文，如果没有在同一轮调用 ask_user，都会被视为无效输出；不要只承诺稍后开始，也不要用普通问句结束任务。
能根据当前上下文安全推断或使用合理默认值时直接继续执行，不要为了非必要信息调用 ask_user。普通聊天和不要求用户回答的反问不受此限制。
当用户消息包含 interaction_response 时，它是对上一份表单的回答；直接结合其中的数据继续原任务，不要重复询问已经回答的内容。
任务完成时用 Markdown 完整回答用户；Markdown 标题必须独占一行，并在标题前后保留空行。仅当本轮完成了具体任务，并且结果自然产生了与本轮内容直接相关的后续操作时，才调用 present_suggestions 给出不超过 8 个建议，正文不得重复列出这些选项。没有明确后续操作时不要调用任何终止工具，直接完成回答。`)}
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		if part != "" {
			result = append(result, part)
		}
	}
	return strings.Join(result, "\n\n")
}
