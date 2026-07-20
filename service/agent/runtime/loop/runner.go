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
	runtimeconfig "github.com/dever-package/bot/service/agent/runtime/config"
	runtimemessageoutput "github.com/dever-package/bot/service/agent/runtime/messageoutput"
	runtimescope "github.com/dever-package/bot/service/agent/runtime/scope"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	billingservice "github.com/dever-package/bot/service/billing"
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
	priorKnowledgeUsed bool
	snapshotHistoryLen int
	snapshotMediaLen   int
	scope              runtimescope.Scope
	billing            botprotocol.BillingContext
	scopedContext      context.Context
	checkpoint         runCheckpoint
}

type modelTransport struct {
	Method  string
	Host    string
	Path    string
	Headers map[string]string
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

type modelCallError struct {
	code    string
	message string
}

func (err modelCallError) Error() string {
	return err.message
}

func (err modelCallError) ErrorCode() string {
	return err.code
}

type toolStepResult struct {
	result      runtimeprovider.Result
	err         error
	receiptable bool
	blockRetry  bool
	content     string
	typeKey     string
	title       string
	status      string
	payload     map[string]any
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
			maxSteps := stepLimits.current(state.awaitingDelivery)
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
	requiredToolName := strings.TrimSpace(state.requiredToolName)
	toolChoice := any("auto")
	if requiredToolName != "" {
		toolChoice = botprotocol.ForcedFunctionToolChoice(requiredToolName)
	}
	result, err := s.callModel(ctx, controller, state.execution, state.input, state.history, toolChoice, state.modelStep)
	calls := normalizeToolCallIDs(result.ToolCalls)
	result.ToolCalls = calls
	state.AppendVisibleText(result.Text)
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
	state.requiredToolName = ""
	if requiredToolName != "" && !hasToolCall(calls, requiredToolName) {
		s.finish(state, finishOutcome{
			status: runStatusFail, text: state.lastText,
			message:    fmt.Sprintf("模型未调用完成当前任务所需的工具: %s", requiredToolName),
			stepType:   "error",
			stepTitle:  "必要工具未调用",
			stepStatus: stepStatusFail,
		})
		return false
	}

	if len(calls) == 0 {
		return s.finishModelOutput(ctx, controller, state, result, stepLimits)
	}
	if shouldReviewPresentSuggestions(state, calls) {
		accepted, keepRunning := s.reviewPresentSuggestions(ctx, controller, state, result)
		if !accepted {
			return keepRunning
		}
	}

	maxSteps := stepLimits.withDelivery
	if state.modelStep >= maxSteps && !endsWithTerminalToolCall(calls) {
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
	state.pendingModelText = strings.TrimSpace(result.Text)
	state.deliveryContinuations = 0
	return s.commitRuntimeStep(state, "model", modelStepTitle(result), result.Text, map[string]any{
		"finish_reason": result.FinishMode,
		"tool_calls":    botprotocol.ToolCallsValue(calls),
		"timing":        modelTiming(state.execution, state.modelStep, result),
	}, stepStatusSuccess)
}

func (s Service) finishModelOutput(
	ctx context.Context,
	controller *runController,
	state *runState,
	result modelStepResult,
	stepLimits modelStepLimits,
) bool {
	if isLengthLimitedFinish(result.FinishMode) {
		return s.continueLengthLimitedOutput(state, result, stepLimits)
	}
	if state.execution.agent.KnowledgeCateID > 0 && !state.knowledgeUsed {
		return s.continueMissingKnowledge(state, result, stepLimits)
	}
	if state.awaitingDelivery && !modelStepHasDelivery(state, result) {
		return s.continueMissingDelivery(state, result, stepLimits)
	}
	queuedArtifactDelivery := hasQueuedArtifactDelivery(state)
	if shouldReviewCompletion(state) {
		review, err := s.inspectCompletion(ctx, controller, state, result)
		if ctx.Err() != nil {
			s.finishContext(controller, state)
			return false
		}
		if err != nil {
			logCompletionReviewError(state, err)
			if queuedArtifactDelivery {
				return s.finishImplicitModelOutput(state, result)
			}
			state.completionReviews++
			if state.completionReviews >= maxCompletionReviews {
				s.finish(state, finishOutcome{
					status: runStatusFail, text: state.lastText,
					message:    "模型完成检查连续失败",
					stepType:   "error",
					stepTitle:  "完成检查失败",
					stepStatus: stepStatusFail,
				})
				return false
			}
			state.awaitingDelivery = true
			return s.continueModelOutput(
				state,
				result,
				completionContinuationInput("", ""),
				"completion_continuation_fallback",
				stepStatusWarning,
			)
		} else if review.Status == "continue" {
			// 异步素材成功入队即完成本轮交付；显式交互仍按审查结果继续执行。
			if queuedArtifactDelivery && review.NextTool == "" {
				return s.finishImplicitModelOutput(state, result)
			}
			state.completionReviews++
			state.requiredToolName = review.NextTool
			if review.NextTool == "" {
				if state.completionReviews >= maxCompletionReviews {
					s.finish(state, finishOutcome{
						status: runStatusFail, text: state.lastText,
						message:    "模型连续未完成当前任务",
						stepType:   "error",
						stepTitle:  "任务未完成",
						stepStatus: stepStatusFail,
					})
					return false
				}
				state.awaitingDelivery = true
			}
			return s.continueModelOutput(
				state,
				result,
				completionContinuationInput(review.NextAction, review.NextTool),
				"completion_continuation",
				stepStatusWarning,
			)
		}
	}
	return s.finishImplicitModelOutput(state, result)
}

func (s Service) finishImplicitModelOutput(state *runState, result modelStepResult) bool {
	text := strings.TrimSpace(state.lastText)
	output := map[string]any(result.Output)
	if output == nil {
		output = map[string]any{}
	}
	if !modelStepHasDelivery(state, result) {
		s.finish(state, finishOutcome{
			status: runStatusFail, message: "模型未返回可展示内容",
			stepType: "error", stepTitle: "模型输出为空", stepStatus: stepStatusFail,
		})
		return false
	}
	appendModelHistory(state, result.Text)
	output["event"] = "final"
	output["text"] = text
	output["completion_mode"] = "implicit"
	output["knowledge_used"] = state.knowledgeUsed
	state.awaitingDelivery = false
	state.deliveryContinuations = 0
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

const maxKnowledgeContinuations = 1

func (s Service) continueMissingKnowledge(state *runState, result modelStepResult, stepLimits modelStepLimits) bool {
	maxSteps := stepLimits.current(state.awaitingDelivery)
	if state.modelStep >= maxSteps || state.knowledgeContinuations >= maxKnowledgeContinuations {
		s.finish(state, finishOutcome{
			status: runStatusFail, text: state.lastText,
			message:  "模型未按要求读取绑定知识库",
			stepType: "error", stepTitle: "缺少知识依据", stepStatus: stepStatusFail,
		})
		return false
	}
	state.knowledgeContinuations++
	return s.continueModelOutput(
		state, result, knowledgeContinuationInput(), "knowledge_required", stepStatusWarning,
	)
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
	maxSteps := stepLimits.current(state.awaitingDelivery)
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
	return s.continueModelOutput(
		state, result, lengthContinuationInput(), "length_continuation", stepStatusSuccess,
	)
}

func (s Service) continueModelOutput(state *runState, result modelStepResult, input map[string]any, protocol string, status string) bool {
	currentStep := state.modelStep
	appendModelHistory(state, result.Text)
	state.phase = runPhaseModel
	state.modelStep++
	state.input = input
	return s.commitRuntimeStep(state, "model", modelStepTitle(result), result.Text, map[string]any{
		"finish_reason": result.FinishMode,
		"timing":        modelTiming(state.execution, currentStep, result),
		"protocol":      protocol,
	}, status)
}

func appendModelHistory(state *runState, text string) {
	if state == nil {
		return
	}
	if state.modelStep == 1 {
		state.history = append(state.history, userHistoryMessage(state.execution.input))
	}
	if text = strings.TrimSpace(text); text != "" {
		state.history = append(state.history, assistantHistoryMessage(text))
	}
}

func hasToolCall(calls []botprotocol.ToolCall, name string) bool {
	for _, call := range calls {
		if strings.EqualFold(strings.TrimSpace(call.Name), strings.TrimSpace(name)) {
			return true
		}
	}
	return false
}

func hasDisplayableOutcome(state *runState, output map[string]any) bool {
	if state == nil {
		return false
	}
	if state.documentID > 0 {
		return true
	}
	if hasDeliverableArtifacts(state.artifacts["artifacts"]) || hasDeliverableArtifacts(output["artifacts"]) {
		return true
	}
	for _, key := range []string{"images", "videos", "audios", "files", "rich", "content"} {
		if runtimemessageoutput.HasValue(state.artifacts[key]) {
			return true
		}
	}
	for _, key := range []string{"interaction", "document", "images", "videos", "audios", "files", "rich", "content"} {
		if runtimemessageoutput.HasValue(output[key]) {
			return true
		}
	}
	return false
}

func hasDeliverableArtifacts(value any) bool {
	artifacts := artifactValues(value)
	if len(artifacts) == 0 {
		return runtimemessageoutput.HasValue(value)
	}
	for _, artifact := range artifacts {
		switch strings.ToLower(strings.TrimSpace(botprotocol.AsText(artifact["status"]))) {
		case "failed", "fail", "canceled", "cancelled":
			continue
		default:
			return true
		}
	}
	return false
}

func modelStepHasDelivery(state *runState, result modelStepResult) bool {
	return strings.TrimSpace(result.Text) != "" || hasDisplayableOutcome(state, result.Output)
}

const maxDeliveryContinuations = 1

func (s Service) continueMissingDelivery(state *runState, result modelStepResult, stepLimits modelStepLimits) bool {
	currentStep := state.modelStep
	if currentStep >= stepLimits.withDelivery || state.deliveryContinuations >= maxDeliveryContinuations {
		s.finish(state, finishOutcome{
			status: runStatusFail, text: state.lastText,
			message:    "工具执行后未交付最终结果",
			stepType:   "error",
			stepTitle:  "缺少最终交付",
			stepStatus: stepStatusWarning,
		})
		return false
	}
	state.deliveryContinuations++
	return s.continueModelOutput(
		state,
		result,
		deliveryContinuationInput(),
		"delivery_continuation",
		stepStatusWarning,
	)
}

func endsWithTerminalToolCall(calls []botprotocol.ToolCall) bool {
	if len(calls) == 0 {
		return false
	}
	return isTerminalToolName(calls[len(calls)-1].Name)
}

func (s Service) runToolStep(ctx context.Context, controller *runController, state *runState) bool {
	if state.pendingIndex < 0 || state.pendingIndex >= len(state.pendingTools) {
		state.continueAfterTools()
		return true
	}
	call := state.pendingTools[state.pendingIndex]
	completed, interrupted := s.executeToolStep(ctx, controller, state, call)
	if interrupted {
		s.finishContext(controller, state)
		return false
	}

	definition, _ := state.execution.registry.Definition(call.Name)
	state.AbsorbToolOutput(completed.result.Content, definition)
	state.recordToolReceipt(call, definition, completed)
	if completed.err != nil && isTerminalToolName(call.Name) {
		state.requiredToolName = call.Name
	}
	if completed.err == nil && strings.EqualFold(strings.TrimSpace(definition.Kind), "knowledge") {
		if !state.knowledgeUsed && state.knowledgeContinuations > 0 {
			s.resetVisibleOutput(ctx, state)
		}
		state.knowledgeUsed = true
	}
	if completed.err == nil && call.Name == "load_skill" {
		if arguments, parseErr := botprotocol.ToolCallArguments(call); parseErr == nil {
			state.AddLoadedSkill(agentmodel.LoadedSkillRef{
				Key:         botprotocol.AsText(arguments["key"]),
				ContentHash: toolResultText(completed.result.Content, "content_hash"),
			})
		}
	}
	state.history = append(state.history, toolHistoryMessage(call, completed.content))
	state.pendingIndex++

	terminal := completed.result.Terminal
	if terminal {
		text := terminalResultText(state.lastText, completed)
		output := completed.result.Output()
		output["text"] = text
		output["completion_mode"] = call.Name
		output["knowledge_used"] = state.knowledgeUsed
		status := runStatusSuccess
		message := ""
		if completed.err != nil {
			status = runStatusFail
			message = completed.err.Error()
		}
		state.MarkFinal(status, text, output, message)
	} else if state.pendingIndex >= len(state.pendingTools) {
		if state.continueAfterTools() {
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
	if current != "" {
		return current
	}
	return strings.TrimSpace(completed.result.Text)
}

func (s Service) executeToolStep(ctx context.Context, controller *runController, state *runState, call botprotocol.ToolCall) (toolStepResult, bool) {
	definition, _ := state.execution.registry.Definition(call.Name)
	if validationErr := validateTerminalCall(state, call); validationErr != nil {
		return toolStepResult{
			err:     validationErr,
			content: toolErrorContent(validationErr.Error()),
			typeKey: "control",
			title:   "终态工具调用无效",
			status:  stepStatusWarning,
			payload: map[string]any{
				"tool_call": firstToolCallValue(call),
				"error":     validationErr.Error(),
			},
		}, false
	}
	if reused, ok := state.reusableToolStep(call, definition); ok {
		return reused, false
	}
	if repeated, ok := state.repeatedFailureStep(call); ok {
		return repeated, false
	}
	if strings.EqualFold(strings.TrimSpace(call.Name), runtimeprovider.ComposeDocumentToolName) {
		return s.executeComposeDocumentStep(ctx, state, call), false
	}
	if shouldEnqueueArtifact(state.execution, definition) {
		return s.enqueueMessageArtifact(ctx, state, call, definition), false
	}
	if definition.Execution.PreventDuplicateRecovery {
		arguments, parseErr := botprotocol.ToolCallArguments(call)
		if parseErr != nil {
			return buildToolStepResult(state.execution.registry, call, definition, runtimeprovider.Result{}, parseErr), false
		}
		if validationErr := state.execution.registry.ValidateArguments(call.Name, arguments); validationErr != nil {
			return buildToolStepResult(state.execution.registry, call, definition, runtimeprovider.Result{}, validationErr), false
		}
		if state.consumeInterruptedToolExecution(call) {
			err := fmt.Errorf("该工具上次执行结果未能确认，为避免重复执行，本轮不再自动重放: %s", call.Name)
			return toolStepResult{
				err: err, receiptable: true, blockRetry: true,
				content: toolErrorContent(err.Error()),
				typeKey: "tool", title: "阻止重复工具执行", status: stepStatusWarning,
				payload: map[string]any{"tool_call": firstToolCallValue(call), "error": err.Error(), "recovery_blocked": true},
			}, false
		}
		if err := state.markToolExecution(call); err != nil {
			if errors.Is(err, errRunLeaseLost) {
				controller.Stop("lease_lost")
				return toolStepResult{}, true
			}
			return buildToolStepResult(state.execution.registry, call, definition, runtimeprovider.Result{}, err), false
		}
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
		toolCtx, cancel := operationContext(ctx, definition.RequestTimeout(toolRequestTimeout))
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
			state.AbsorbToolOutput(toolResult.Content, definition)
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

	result := buildToolStepResult(state.execution.registry, call, definition, toolResult, toolErr)
	if definition.Execution.PreventDuplicateRecovery {
		state.activeToolExecution = nil
	}
	if streamActivity {
		state.RecordToolActivity(toolFinishedOutput(call, definition, toolResult, toolErr))
		_ = s.writeToolFinished(ctx, state.execution, call, definition, toolResult, toolErr)
	}
	return result, false
}

func buildToolStepResult(
	registry *runtimetool.Registry,
	call botprotocol.ToolCall,
	definition runtimeprovider.Definition,
	toolResult runtimeprovider.Result,
	toolErr error,
) toolStepResult {
	result := toolStepResult{
		result:      toolResult,
		err:         toolErr,
		receiptable: true,
		typeKey:     "tool",
		title:       "工具调用: " + call.Name,
		status:      stepStatusSuccess,
		payload:     map[string]any{"tool_call": firstToolCallValue(call)},
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
		if len(toolResult.Tools) > 0 && registry != nil {
			result.payload["added_tools"] = registry.Names()
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
	return result
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

func (s Service) callModel(ctx context.Context, controller *runController, execution execution, input map[string]any, history []any, toolChoice any, modelStep int) (modelStepResult, error) {
	return s.callModelRequest(
		ctx,
		controller,
		execution,
		input,
		history,
		execution.registry.Definitions(),
		toolChoice,
		true,
		"model",
		modelStep,
	)
}

func (s Service) callModelRequest(
	ctx context.Context,
	controller *runController,
	execution execution,
	input map[string]any,
	history []any,
	tools []any,
	toolChoice any,
	publish bool,
	chargeKind string,
	chargeIndex int,
) (modelStepResult, error) {
	return s.callModelRequestWithRole(
		ctx,
		controller,
		execution,
		modelRolePrompt(execution.prompt),
		input,
		history,
		tools,
		toolChoice,
		publish,
		chargeKind,
		chargeIndex,
	)
}

func (s Service) callModelRequestWithRole(
	ctx context.Context,
	controller *runController,
	execution execution,
	role string,
	input map[string]any,
	history []any,
	tools []any,
	toolChoice any,
	publish bool,
	chargeKind string,
	chargeIndex int,
) (modelStepResult, error) {
	parentKey := strings.TrimSpace(execution.billing.BusinessKey)
	if parentKey == "" {
		parentKey = execution.requestID
	}
	businessKey := modelPowerChargeBusinessKey(parentKey, execution.runID, chargeKind, chargeIndex)
	billing := execution.billing
	billing.BusinessKey = businessKey
	return billingservice.Execute(ctx, billingservice.PowerExecutionRequest{
		Prepare: billingservice.PreparePowerChargeRequest{
			Billing:   billing,
			RequestID: businessKey,
			PowerID:   execution.power.ID,
			PowerName: execution.power.Name,
		},
		RunID: execution.runID,
	}, func(ctx context.Context, charged botprotocol.BillingContext) (modelStepResult, error) {
		execution.billing = charged
		return s.callModelRequestAttempts(ctx, controller, execution, role, input, history, tools, toolChoice, publish)
	})
}

func (s Service) callModelRequestAttempts(
	ctx context.Context,
	controller *runController,
	execution execution,
	role string,
	input map[string]any,
	history []any,
	tools []any,
	toolChoice any,
	publish bool,
) (modelStepResult, error) {
	preparedInput := compactModelInput(input, false)
	preparedHistory := compactModelHistory(role, preparedInput, history, tools, false)
	result, err := s.callModelOnce(ctx, controller, execution, preparedInput, preparedHistory, role, tools, toolChoice, publish)
	result.Attempts = 1
	if ctx.Err() != nil {
		return result, err
	}
	if err != nil && !isContextOverflowError(err) {
		return result, err
	}
	if err == nil && !shouldRetryEmptyModelResult(result) {
		return result, nil
	}
	if isContextOverflowError(err) {
		preparedInput = compactModelInput(input, true)
		preparedHistory = compactModelHistory(role, preparedInput, history, tools, true)
	}
	retried, retryErr := s.callModelOnce(ctx, controller, execution, preparedInput, preparedHistory, role, tools, toolChoice, publish)
	if !result.ProviderRequestedAt.IsZero() {
		retried.ProviderRequestedAt = result.ProviderRequestedAt
	}
	retried.Attempts = 2
	return retried, retryErr
}

func modelPowerChargeBusinessKey(parent string, runID uint64, kind string, index int) string {
	value := fmt.Sprintf("agent-model:%s:%d:%s:%d", strings.TrimSpace(parent), runID, strings.TrimSpace(kind), index)
	return uuid.NewSHA1(uuid.NameSpaceOID, []byte(value)).String()
}

func isContextOverflowError(err error) bool {
	var coded interface{ ErrorCode() string }
	return errors.As(err, &coded) && strings.EqualFold(strings.TrimSpace(coded.ErrorCode()), "context_overflow")
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

func (s Service) callModelOnce(
	ctx context.Context,
	controller *runController,
	execution execution,
	input map[string]any,
	history []any,
	role string,
	tools []any,
	toolChoice any,
	publish bool,
) (modelStepResult, error) {
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
		Body:      buildGatewayBody(execution.agent, execution.power, role, input, history, tools, toolChoice, false),
		Billing:   execution.billing,
	})
	payload := response.Payload()
	if int(frontstream.InputInt64(payload["status"], 0)) == botprotocol.ResponseStatusFail {
		return modelStepResult{ProviderRequestedAt: providerRequestedAt, ProviderFinishedAt: time.Now()}, modelErrorFromPayload(payload, "调用 LLM 能力失败")
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
			if firstDeltaAt.IsZero() && (botstream.OutputEvent(output) == "" || botstream.OutputEvent(output) == "delta") && botprotocol.AsText(output["text"]) != "" {
				firstDeltaAt = time.Now()
			}
			if !publish {
				return nil
			}
			return publisher.Write(ctx, output)
		},
	})
	providerFinishedAt := time.Now()
	var publishErr error
	if publish {
		publishErr = publisher.Flush(modelCtx)
	}
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
		return modelStepResult{Text: collected.State.Text, ProviderRequestedAt: providerRequestedAt, FirstDeltaAt: firstDeltaAt, ProviderFinishedAt: providerFinishedAt}, modelErrorFromPayload(collected.Frame, "LLM 能力调用失败")
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

func modelErrorFromPayload(payload map[string]any, fallback string) error {
	output := botprotocol.ExtractOutput(payload)
	return modelCallError{
		code:    strings.TrimSpace(botprotocol.AsText(output["error_code"])),
		message: responseMessage(payload, fallback),
	}
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
	standard     int
	withDelivery int
}

func (limits modelStepLimits) current(awaitingDelivery bool) int {
	if awaitingDelivery {
		return limits.withDelivery
	}
	return limits.standard
}

func loadModelStepLimits(ctx context.Context, agent agentmodel.Agent) modelStepLimits {
	config := runtimeconfig.Load(ctx)
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
	withDelivery := standard
	if withDelivery < hard {
		withDelivery++
	}
	return modelStepLimits{standard: standard, withDelivery: withDelivery}
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
