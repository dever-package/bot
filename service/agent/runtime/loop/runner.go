package loop

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	runtimeartifact "github.com/dever-package/bot/service/agent/runtime/artifact"
	runtimeconfig "github.com/dever-package/bot/service/agent/runtime/config"
	runtimemessageoutput "github.com/dever-package/bot/service/agent/runtime/messageoutput"
	runtimescope "github.com/dever-package/bot/service/agent/runtime/scope"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botstream "github.com/dever-package/bot/service/energon/stream"
	frontstream "github.com/dever-package/front/service/stream"
)

type execution struct {
	runID              uint64
	version            int
	workerID           string
	requestID          string
	requestedAt        time.Time
	startedAt          time.Time
	claimedAt          time.Time
	agent              agentmodel.Agent
	power              energonmodel.Power
	sessionID          uint64
	userMessageID      uint64
	assistantMessageID uint64
	prompt             string
	input              map[string]any
	history            []any
	registry           *runtimetool.Registry
	transport          modelTransport
	persistChat        bool
	onStream           func(map[string]any)
	completion         chan runCompletion
	cleanup            func()
	mediaReferences    []runtimeprovider.MediaReference
	scope              runtimescope.Scope
	scopedContext      context.Context
	checkpoint         runCheckpoint
}

type modelTransport struct {
	Method  string
	Host    string
	Path    string
	Headers map[string]string
}

type modelCallConfig struct {
	Role              string
	Tools             []any
	ToolChoice        any
	ParallelToolCalls bool
	Publish           bool
}

func (execution execution) close() {
	if execution.cleanup != nil {
		execution.cleanup()
	}
}

type modelStepResult struct {
	Text                string
	Output              botprotocol.Output
	ToolCalls           []botprotocol.ToolCall
	FinishMode          string
	ProviderRequestedAt time.Time
	FirstDeltaAt        time.Time
	ProviderFinishedAt  time.Time
	Attempts            int
}

type toolStepResult struct {
	result  runtimeprovider.Result
	err     error
	content string
	typeKey string
	title   string
	status  string
	payload map[string]any
}

func (s Service) run(controller *runController, execution execution) {
	state := newRunState(execution)
	defer s.runs.Remove(execution.requestID)
	defer controller.cancel()
	defer execution.close()
	defer func() {
		if recovered := recover(); recovered != nil && controller.StopReason() != "lease_lost" {
			s.finish(&state, finishOutcome{
				status: runStatusFail, text: state.lastText, message: fmt.Sprintf("智能体运行异常: %v", recovered),
				stepType: "error", stepTitle: "运行异常", stepStatus: stepStatusFail,
			})
		}
	}()

	ctx := state.execution.scopedContext
	if ctx == nil {
		ctx = controller.Context()
	}
	stepLimits := loadModelStepLimits(ctx, execution.agent)
	for {
		if ctx.Err() != nil {
			s.finishContext(controller, &state)
			return
		}
		switch state.phase {
		case runPhaseFinal:
			s.finishCheckpoint(&state)
			return
		case runPhaseTool:
			if !s.runToolStep(ctx, controller, &state) {
				return
			}
		case runPhaseModel:
			maxSteps := stepLimits.forDocument(state.documentID > 0)
			if state.modelStep > maxSteps {
				s.finish(&state, finishOutcome{
					status: runStatusFail, text: state.lastText,
					message:  fmt.Sprintf("智能体达到最大步骤数 %d", maxSteps),
					stepType: "error", stepTitle: "达到最大步骤", stepStatus: stepStatusFail,
				})
				return
			}
			if !s.runModelStep(ctx, controller, &state, stepLimits) {
				return
			}
		default:
			s.finish(&state, finishOutcome{
				status: runStatusFail, text: state.lastText, message: "智能体运行检查点无效",
				stepType: "error", stepTitle: "恢复失败", stepStatus: stepStatusFail,
			})
			return
		}
	}
}

func (s Service) runModelStep(ctx context.Context, controller *runController, state *runState, stepLimits modelStepLimits) bool {
	result, err := s.callModel(ctx, controller, state.execution, state.input, state.history, state.documentID > 0, "auto")
	calls := normalizeToolCallIDs(result.ToolCalls)
	calls = documentStepToolCalls(state.documentID, calls)
	result.ToolCalls = calls
	hasVisibleText := state.AppendVisibleText(result.Text)
	if err != nil {
		if ctx.Err() != nil {
			s.finishContext(controller, state)
			return false
		}
		s.finish(state, finishOutcome{
			status: runStatusFail, text: state.lastText, message: err.Error(),
			stepType: "error", stepTitle: "模型调用失败", stepStatus: stepStatusFail,
		})
		return false
	}

	if err := s.prepareDocumentModelStep(ctx, state, result); err != nil {
		s.finish(state, finishOutcome{
			status: runStatusFail, text: state.lastText, message: err.Error(),
			stepType: "error", stepTitle: "保存图文内容失败", stepStatus: stepStatusFail,
		})
		return false
	}
	if len(calls) == 0 {
		return s.finishModelOutput(state, result, stepLimits)
	}

	maxSteps := stepLimits.forDocument(state.documentID > 0)
	if state.modelStep >= maxSteps && !terminalToolCalls(state.execution.registry, calls, state.documentID > 0) {
		state.MarkFinal(runStatusFail, state.lastText, nil, fmt.Sprintf("智能体达到最大步骤数 %d", maxSteps))
		if !s.commitFinalRuntimeStep(state, "model", modelStepTitle(result), result.Text, map[string]any{
			"finish_reason": result.FinishMode,
			"tool_calls":    botprotocol.ToolCallsValue(calls),
			"timing":        modelTiming(state.execution, state.modelStep, result),
		}, stepStatusSuccess) {
			return false
		}
		s.finishCheckpoint(state)
		return false
	}

	if state.modelStep == 1 {
		state.history = append(state.history, userHistoryMessage(state.execution.input))
	}
	state.history = append(state.history, assistantToolHistoryMessage(result.Text, calls))
	state.phase = runPhaseTool
	state.pendingTools = calls
	state.pendingIndex = 0
	state.pendingVisible = hasVisibleText
	return s.commitRuntimeStep(state, "model", modelStepTitle(result), result.Text, map[string]any{
		"finish_reason": result.FinishMode,
		"tool_calls":    botprotocol.ToolCallsValue(calls),
		"timing":        modelTiming(state.execution, state.modelStep, result),
	}, stepStatusSuccess)
}

func (s Service) finishModelOutput(state *runState, result modelStepResult, stepLimits modelStepLimits) bool {
	if isLengthLimitedFinish(result.FinishMode) {
		return s.continueLengthLimitedOutput(state, result, stepLimits)
	}
	text := strings.TrimSpace(state.lastText)
	output := map[string]any(result.Output)
	if output == nil {
		output = map[string]any{}
	}
	if text == "" && !hasDisplayableOutcome(state, output) {
		s.finish(state, finishOutcome{
			status: runStatusFail, message: "模型未返回可展示内容",
			stepType: "error", stepTitle: "模型输出为空", stepStatus: stepStatusFail,
		})
		return false
	}
	output["event"] = "final"
	output["text"] = text
	output["completion_mode"] = "implicit"
	output["knowledge_used"] = state.knowledgeUsed
	state.MarkFinal(runStatusSuccess, text, output, "")
	if !s.commitFinalRuntimeStep(state, "model", modelStepTitle(result), result.Text, map[string]any{
		"finish_reason": result.FinishMode,
		"timing":        modelTiming(state.execution, state.modelStep, result),
	}, stepStatusSuccess) {
		return false
	}
	s.finishCheckpoint(state)
	return false
}

func isLengthLimitedFinish(value string) bool {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "length", "max_tokens", "max_output_tokens":
		return true
	default:
		return false
	}
}

func (s Service) continueLengthLimitedOutput(state *runState, result modelStepResult, stepLimits modelStepLimits) bool {
	currentStep := state.modelStep
	maxSteps := stepLimits.forDocument(state.documentID > 0)
	if currentStep >= maxSteps {
		message := fmt.Sprintf("模型输出因长度限制仍未完成，已达到最大步骤数 %d", maxSteps)
		output := map[string]any(result.Output)
		if output == nil {
			output = map[string]any{}
		}
		output["text"] = strings.TrimSpace(state.lastText)
		state.MarkFinal(runStatusFail, state.lastText, output, message)
		if !s.commitFinalRuntimeStep(state, "model", modelStepTitle(result), result.Text, map[string]any{
			"finish_reason": result.FinishMode,
			"timing":        modelTiming(state.execution, currentStep, result),
			"protocol":      "length_limit_reached",
		}, stepStatusSuccess) {
			return false
		}
		s.finishCheckpoint(state)
		return false
	}
	if currentStep == 1 {
		state.history = append(state.history, userHistoryMessage(state.execution.input))
	}
	state.history = append(state.history, assistantHistoryMessage(result.Text))
	state.phase = runPhaseModel
	state.modelStep++
	state.input = lengthContinuationInput(state.documentID)
	return s.commitRuntimeStep(state, "model", modelStepTitle(result), result.Text, map[string]any{
		"finish_reason": result.FinishMode,
		"timing":        modelTiming(state.execution, currentStep, result),
		"protocol":      "length_continuation",
	}, stepStatusSuccess)
}

func hasDisplayableOutcome(state *runState, output map[string]any) bool {
	if state == nil {
		return false
	}
	if state.documentID > 0 || len(state.artifacts) > 0 || len(state.activities) > 0 {
		return true
	}
	for _, key := range []string{"interaction", "document", "artifacts", "images", "videos", "audios", "files", "rich", "content"} {
		if runtimemessageoutput.HasValue(output[key]) {
			return true
		}
	}
	return false
}

func terminalToolCalls(registry *runtimetool.Registry, calls []botprotocol.ToolCall, documentMode bool) bool {
	if registry == nil || len(calls) == 0 {
		return false
	}
	terminalFound := false
	for _, call := range calls {
		definition, exists := registry.Definition(call.Name)
		if !exists {
			return false
		}
		switch strings.ToLower(strings.TrimSpace(definition.Kind)) {
		case "control", "interaction", "presentation":
			terminalFound = true
		default:
			if !documentMode || !runtimeartifact.IsSupportedKind(definition.Kind) {
				return false
			}
		}
	}
	return terminalFound
}

func (s Service) runToolStep(ctx context.Context, controller *runController, state *runState) bool {
	if state.pendingIndex < 0 || state.pendingIndex >= len(state.pendingTools) {
		state.phase = runPhaseModel
		state.modelStep++
		state.input = nextModelInput(state.documentID)
		state.pendingTools = nil
		state.pendingIndex = 0
		state.pendingVisible = false
		return true
	}
	call := state.pendingTools[state.pendingIndex]
	completed, interrupted := s.executeToolStep(ctx, controller, state, call)
	if interrupted {
		s.finishContext(controller, state)
		return false
	}

	state.AbsorbToolOutput(completed.result.Content)
	definition, _ := state.execution.registry.Definition(call.Name)
	if completed.err == nil && strings.EqualFold(strings.TrimSpace(definition.Kind), "knowledge") {
		state.knowledgeUsed = true
	}
	if completed.err == nil && call.Name == "load_skill" {
		if arguments, parseErr := botprotocol.ToolCallArguments(call); parseErr == nil {
			state.AddLoadedSkill(botprotocol.AsText(arguments["key"]))
		}
	}
	state.history = append(state.history, toolHistoryMessage(call, completed.content))
	state.pendingIndex++

	terminal := completed.err == nil && completed.result.Terminal
	if terminal {
		text := terminalResultText(state.lastText, completed)
		output := completed.result.Output()
		output["text"] = text
		output["completion_mode"] = call.Name
		output["knowledge_used"] = state.knowledgeUsed
		state.MarkFinal(runStatusSuccess, text, output, "")
	} else if state.pendingIndex >= len(state.pendingTools) {
		visible := state.pendingVisible
		state.phase = runPhaseModel
		state.modelStep++
		state.input = nextModelInput(state.documentID)
		state.pendingTools = nil
		state.pendingIndex = 0
		state.pendingVisible = false
		if visible {
			_ = s.writeExecutionOutput(ctx, state.execution, map[string]any{"event": "delta", "text": "\n\n"})
		}
	}
	commit := s.commitRuntimeStep
	if terminal {
		commit = s.commitFinalRuntimeStep
	}
	if !commit(state, completed.typeKey, completed.title, toolStepContent(completed.result.Text, completed.err), completed.payload, completed.status) {
		return false
	}
	if terminal {
		s.finishCheckpoint(state)
		return false
	}
	return true
}

func terminalResultText(current string, completed toolStepResult) string {
	current = strings.TrimSpace(current)
	message := strings.TrimSpace(completed.result.Text)
	if current == "" {
		return message
	}
	if message == "" || strings.HasSuffix(current, message) {
		return current
	}
	return current
}

func (s Service) executeToolStep(ctx context.Context, controller *runController, state *runState, call botprotocol.ToolCall) (toolStepResult, bool) {
	definition, _ := state.execution.registry.Definition(call.Name)
	if validationErr := validateFinishResponseCall(state, call); validationErr != nil {
		return toolStepResult{
			err:     validationErr,
			content: toolErrorContent(validationErr.Error()),
			typeKey: "control",
			title:   "完成度检查未通过",
			status:  stepStatusWarning,
			payload: map[string]any{
				"tool_call": firstToolCallValue(call),
				"error":     validationErr.Error(),
			},
		}, false
	}
	if state.documentID > 0 && runtimeartifact.IsSupportedKind(definition.Kind) {
		return s.scheduleDocumentArtifact(ctx, state, call, definition), false
	}
	streamActivity := shouldStreamToolActivity(definition)
	artifactBatch, toolErr := s.beginToolArtifactBatch(ctx, state.execution, call, definition, 0, 0)
	startedOutput := artifactBatch.startedOutput(ctx)
	if streamActivity {
		state.RecordToolActivity(toolStartedOutput(call, definition, startedOutput))
		_ = s.writeToolStarted(ctx, state.execution, call, definition, startedOutput)
	}

	childRequestID := deterministicToolRequestID(state.execution.requestID, call)
	toolResult, recovered := artifactBatch.recoveredResult(ctx)
	if toolErr == nil && !recovered {
		toolCtx, cancel := operationContext(ctx, toolRequestTimeout)
		controller.SetChild(childRequestID)
		toolResult, toolErr = state.execution.registry.Execute(toolCtx, call, childRequestID, func(output map[string]any) error {
			if !streamActivity {
				return nil
			}
			return s.writeToolProgress(toolCtx, state.execution, call, definition, output)
		})
		controller.ClearChild(childRequestID)
		if toolErr == nil && ctx.Err() == nil && toolCtx.Err() != nil {
			toolErr = fmt.Errorf("工具调用超时: %s", call.Name)
		}
		cancel()
	}
	if ctx.Err() != nil {
		if controller.StopReason() == "canceled" {
			cancelErr := fmt.Errorf("生成已停止")
			cancelCtx, cancel := maintenanceContext()
			toolResult.Content = artifactBatch.fail(cancelCtx, cancelErr.Error())
			state.AbsorbToolOutput(toolResult.Content)
			if streamActivity {
				state.RecordToolActivity(toolFinishedOutput(call, definition, toolResult, cancelErr))
				_ = s.writeToolFinished(cancelCtx, state.execution, call, definition, toolResult, cancelErr)
			}
			cancel()
		}
		return toolStepResult{}, true
	}

	if toolErr != nil {
		toolResult.Content = artifactBatch.fail(ctx, toolErr.Error())
	} else {
		if !recovered {
			toolResult, toolErr = artifactBatch.complete(ctx, toolResult)
			if toolErr != nil {
				toolResult.Content = artifactBatch.fail(ctx, toolErr.Error())
			}
		}
		if toolErr == nil {
			generated := toolResultMediaReferences(toolResult.Content)
			state.execution.mediaReferences = appendMediaReferences(state.execution.mediaReferences, generated)
			state.execution.registry.AddMediaReferences(generated)
		}
	}

	result := toolStepResult{
		result:  toolResult,
		err:     toolErr,
		typeKey: "tool",
		title:   "工具调用: " + call.Name,
		status:  stepStatusSuccess,
		payload: map[string]any{"tool_call": firstToolCallValue(call)},
	}
	if toolErr != nil {
		result.content = toolErrorContent(toolFailureText(definition, toolErr))
		result.status = stepStatusWarning
		result.payload["error"] = toolErr.Error()
		if toolResult.Content != nil {
			result.payload["output"] = toolResult.Content
		}
	} else {
		result.content = toolResult.ModelContent()
		result.payload["output"] = toolResult.Output()
		if len(toolResult.Tools) > 0 {
			result.payload["added_tools"] = state.execution.registry.Names()
		}
		if len(toolResult.Interaction) > 0 {
			result.typeKey = "interaction"
			result.title = "等待用户输入"
		} else if strings.EqualFold(strings.TrimSpace(definition.Kind), "presentation") {
			result.typeKey = "presentation"
			result.title = "展示后续建议"
		} else if toolResult.Terminal {
			result.typeKey = "control"
			result.title = "任务完成"
		}
	}
	if streamActivity {
		state.RecordToolActivity(toolFinishedOutput(call, definition, toolResult, toolErr))
		_ = s.writeToolFinished(ctx, state.execution, call, definition, toolResult, toolErr)
	}
	return result, false
}

func validateFinishResponseCall(state *runState, call botprotocol.ToolCall) error {
	if state == nil || !strings.EqualFold(strings.TrimSpace(call.Name), runtimeprovider.FinishResponseToolName) {
		return nil
	}
	arguments, err := botprotocol.ToolCallArguments(call)
	if err != nil {
		return err
	}
	knowledgeRequired, _ := arguments["knowledge_required"].(bool)
	if knowledgeRequired && !state.knowledgeUsed {
		return fmt.Errorf("智能体设定要求读取知识库，但本轮还没有成功调用知识工具；请先读取知识库后继续完成任务")
	}
	return nil
}

func (s Service) commitRuntimeStep(state *runState, stepType string, title string, content string, payload any, status string) bool {
	return s.commitRuntimeStepState(state, false, stepType, title, content, payload, status)
}

func (s Service) commitFinalRuntimeStep(state *runState, stepType string, title string, content string, payload any, status string) bool {
	return s.commitRuntimeStepState(state, true, stepType, title, content, payload, status)
}

func (s Service) commitRuntimeStepState(
	state *runState,
	final bool,
	stepType string,
	title string,
	content string,
	payload any,
	status string,
) bool {
	if final {
		state.finalCommitted = true
	}
	if err := state.Step(stepType, title, content, payload, status); err != nil {
		if final {
			state.finalCommitted = false
		}
		if errors.Is(err, errRunLeaseLost) {
			return false
		}
		s.finish(state, finishOutcome{
			status: runStatusFail, text: state.lastText, message: err.Error(),
			stepType: "error", stepTitle: "保存运行步骤失败", stepStatus: stepStatusFail,
		})
		return false
	}
	return true
}

func (s Service) callModel(ctx context.Context, controller *runController, execution execution, input map[string]any, history []any, documentMode bool, toolChoice string) (modelStepResult, error) {
	tools := execution.registry.Definitions()
	return s.callModelWithConfig(ctx, controller, execution, input, history, modelCallConfig{
		Role:              modelRolePrompt(execution.prompt, len(tools) > 0, documentMode),
		Tools:             tools,
		ToolChoice:        toolChoice,
		ParallelToolCalls: documentMode,
		Publish:           true,
	})
}

func (s Service) callModelWithConfig(ctx context.Context, controller *runController, execution execution, input map[string]any, history []any, config modelCallConfig) (modelStepResult, error) {
	result, err := s.callModelOnce(ctx, controller, execution, input, history, config)
	result.Attempts = 1
	if err != nil || ctx.Err() != nil || !shouldRetryEmptyModelResult(result) {
		return result, err
	}

	retried, retryErr := s.callModelOnce(ctx, controller, execution, input, history, config)
	if !result.ProviderRequestedAt.IsZero() {
		retried.ProviderRequestedAt = result.ProviderRequestedAt
	}
	retried.Attempts = 2
	return retried, retryErr
}

func shouldRetryEmptyModelResult(result modelStepResult) bool {
	if !isEmptyModelStepResult(result) {
		return false
	}
	if result.ProviderRequestedAt.IsZero() || result.ProviderFinishedAt.IsZero() {
		return true
	}
	// Only retry transport-like empty responses. Repeating a model request that
	// already waited for the provider doubles perceived latency without adding
	// useful recovery value.
	return result.ProviderFinishedAt.Sub(result.ProviderRequestedAt) <= 2*time.Second
}

func (s Service) callModelOnce(ctx context.Context, controller *runController, execution execution, input map[string]any, history []any, config modelCallConfig) (modelStepResult, error) {
	modelCtx, cancel := operationContext(ctx, modelRequestTimeout)
	defer cancel()
	providerRequestedAt := time.Now()
	childRequestID := uuid.NewString()
	controller.SetChild(childRequestID)
	defer controller.ClearChild(childRequestID)

	response := s.gateway.Request(modelCtx, energonservice.GatewayRequest{
		RequestID: childRequestID,
		Method:    execution.transport.Method,
		Host:      execution.transport.Host,
		Path:      execution.transport.Path,
		Headers:   execution.transport.Headers,
		Body:      buildGatewayBody(execution.agent, execution.power, config.Role, input, history, config.Tools, config.ToolChoice, config.ParallelToolCalls),
	})
	payload := response.Payload()
	if int(frontstream.InputInt64(payload["status"], 0)) == botprotocol.ResponseStatusFail {
		return modelStepResult{ProviderRequestedAt: providerRequestedAt, ProviderFinishedAt: time.Now()}, fmt.Errorf("%s", responseMessage(payload, "调用 LLM 能力失败"))
	}
	if botstream.FrameType(payload) == botprotocol.ResponseTypeResult {
		finishedAt := time.Now()
		result := modelResultFromOutput(botstream.FrameOutput(payload))
		result.ProviderRequestedAt = providerRequestedAt
		result.ProviderFinishedAt = finishedAt
		if result.Text != "" {
			result.FirstDeltaAt = finishedAt
		}
		return result, nil
	}

	firstDeltaAt := time.Time{}
	publisher := newModelStreamPublisher(s, execution)
	collected := s.gateway.CollectStream(modelCtx, botstream.CollectOptions{
		RequestID:        childRequestID,
		InitialLastID:    "0-0",
		Block:            streamReadBlock,
		ReadCount:        64,
		IdleTimeout:      modelStreamIdleTimeout,
		CollectDeltaText: true,
		CollectOutputs:   true,
		OnOutput: func(ctx context.Context, output botprotocol.Output) error {
			if !config.Publish {
				return nil
			}
			if firstDeltaAt.IsZero() && (botstream.OutputEvent(output) == "" || botstream.OutputEvent(output) == "delta") && botprotocol.AsText(output["text"]) != "" {
				firstDeltaAt = time.Now()
			}
			return publisher.Write(ctx, output)
		},
	})
	providerFinishedAt := time.Now()
	publishErr := publisher.Flush(modelCtx)
	if collected.Err != nil {
		stopCtx, stopCancel := stopContext()
		_ = s.gateway.StopStream(stopCtx, childRequestID)
		stopCancel()
		streamErr := collected.Err
		if errors.Is(streamErr, botstream.ErrIdleTimeout) {
			streamErr = fmt.Errorf("模型流连续 %d 秒没有返回新内容", int(modelStreamIdleTimeout.Seconds()))
		} else if ctx.Err() == nil && errors.Is(modelCtx.Err(), context.DeadlineExceeded) {
			streamErr = fmt.Errorf("单次模型调用超过 %d 分钟", int(modelRequestTimeout.Minutes()))
		}
		return modelStepResult{Text: collected.State.Text, ProviderRequestedAt: providerRequestedAt, FirstDeltaAt: firstDeltaAt, ProviderFinishedAt: providerFinishedAt}, streamErr
	}
	if publishErr != nil {
		return modelStepResult{Text: collected.State.Text, ProviderRequestedAt: providerRequestedAt, FirstDeltaAt: firstDeltaAt, ProviderFinishedAt: providerFinishedAt}, publishErr
	}
	if int(frontstream.InputInt64(collected.Frame["status"], 0)) == botprotocol.ResponseStatusFail {
		return modelStepResult{Text: collected.State.Text, ProviderRequestedAt: providerRequestedAt, FirstDeltaAt: firstDeltaAt, ProviderFinishedAt: providerFinishedAt}, fmt.Errorf("%s", responseMessage(collected.Frame, "LLM 能力调用失败"))
	}
	output := botprotocol.MergeStreamFinal(
		collected.State.Outputs,
		botstream.FrameOutput(collected.Frame),
	)
	result := modelResultFromOutput(output)
	if strings.TrimSpace(result.Text) == "" {
		result.Text = collected.State.Text
	}
	result.ProviderRequestedAt = providerRequestedAt
	result.FirstDeltaAt = firstDeltaAt
	result.ProviderFinishedAt = providerFinishedAt
	return result, nil
}

func isEmptyModelStepResult(result modelStepResult) bool {
	if strings.TrimSpace(result.Text) != "" || len(result.ToolCalls) > 0 {
		return false
	}
	for _, key := range []string{
		"interaction", "document", "artifacts",
		"images", "videos", "audios", "files",
		"rich", "content",
	} {
		if runtimemessageoutput.HasValue(result.Output[key]) {
			return false
		}
	}
	return true
}

func modelResultFromOutput(output botprotocol.Output) modelStepResult {
	return modelStepResult{
		Text:       strings.TrimSpace(botprotocol.AsText(output["text"])),
		Output:     output,
		ToolCalls:  botprotocol.ParseToolCalls(output["tool_calls"]),
		FinishMode: strings.TrimSpace(botprotocol.AsText(output["finish_reason"])),
	}
}

func modelStepTitle(result modelStepResult) string {
	if len(result.ToolCalls) > 0 {
		return "模型请求工具"
	}
	return "模型输出"
}

func toolStepContent(text string, err error) string {
	if err != nil {
		return err.Error()
	}
	return strings.TrimSpace(text)
}

func firstToolCallValue(call botprotocol.ToolCall) any {
	values := botprotocol.ToolCallsValue([]botprotocol.ToolCall{call})
	if len(values) == 0 {
		return map[string]any{}
	}
	return values[0]
}

type modelStepLimits struct {
	standard int
	hard     int
}

func (limits modelStepLimits) forDocument(document bool) int {
	if document {
		return limits.hard
	}
	return limits.standard
}

func loadModelStepLimits(ctx context.Context, agent agentmodel.Agent) modelStepLimits {
	config := agentmodel.DefaultRuntimeConfig()
	if row := agentmodel.NewRuntimeConfigModel().Find(ctx, map[string]any{"id": agentmodel.DefaultRuntimeConfigID}); row != nil {
		config = runtimeconfig.WithDefaults(*row)
	}
	hard := config.HardMaxAutoSteps
	if hard <= 0 {
		hard = 1
	}
	standard := agent.MaxAutoSteps
	if standard <= 0 {
		standard = config.DefaultMaxAutoSteps
	}
	if standard <= 0 {
		standard = 1
	}
	if standard > hard {
		standard = hard
	}
	return modelStepLimits{standard: standard, hard: hard}
}

func (s Service) finishContext(controller *runController, state *runState) {
	if controller.StopReason() == "lease_lost" {
		return
	}
	if controller.StopReason() == "canceled" {
		s.finish(state, finishOutcome{
			status: runStatusCanceled, text: state.lastText, message: "任务已取消",
			stepType: "error", stepTitle: "运行已取消", stepStatus: stepStatusWarning,
		})
		return
	}
	s.finish(state, finishOutcome{
		status: runStatusFail, text: state.lastText, message: "智能体运行超时",
		stepType: "error", stepTitle: "运行超时", stepStatus: stepStatusFail,
	})
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
