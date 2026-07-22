package loop

import (
	"context"
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeconfig "github.com/dever-package/bot/service/agent/runtime/config"
	runtimemessageoutput "github.com/dever-package/bot/service/agent/runtime/messageoutput"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func (s Service) runModelStep(ctx context.Context, controller *runController, state *runState, stepLimits modelStepLimits) bool {
	requiredToolName := strings.TrimSpace(state.requiredToolName)
	toolChoice := any("auto")
	if requiredToolName != "" {
		toolChoice = botprotocol.ForcedFunctionToolChoice(requiredToolName)
	}
	result, err := s.callModel(ctx, controller, state.execution, state.input, state.history, toolChoice, state.documentID, state.modelStep)
	calls := normalizeToolCallIDs(result.ToolCalls)
	result.ToolCalls = calls
	if state.documentID == 0 {
		state.AppendVisibleText(result.Text)
	} else if !result.TextPublished && strings.TrimSpace(result.Text) != "" {
		if persistErr := s.persistSynchronousDocumentText(ctx, state, result.Text); persistErr != nil && err == nil {
			err = persistErr
		}
	}
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
	state.lengthContinuations = 0
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
	state.lengthContinuations = 0
	if state.documentID > 0 && !documentHasText(ctx, state.documentID) {
		return s.continueMissingDelivery(state, result, stepLimits)
	}
	if state.awaitingDelivery && !modelStepHasDelivery(state, result) {
		return s.continueMissingDelivery(state, result, stepLimits)
	}
	if shouldReviewCompletion(state, result) {
		state.completionReviews++
		state.completionReviewPending = false
		review, err := s.inspectCompletion(ctx, controller, state, result)
		if ctx.Err() != nil {
			s.finishContext(controller, state)
			return false
		}
		if err != nil {
			logCompletionReviewError(state, err)
			return s.finishImplicitModelOutput(state, result)
		}
		if review.needsContinuation() {
			state.requiredToolName = review.Interaction
			state.awaitingDelivery = true
			return s.continueModelOutput(
				state,
				result,
				completionContinuationInput(review.Missing, review.Interaction),
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
	state.lengthContinuations = 0
	state.completionReviewPending = false
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

const maxLengthContinuations = 2

func (s Service) continueLengthLimitedOutput(state *runState, result modelStepResult, stepLimits modelStepLimits) bool {
	currentStep := state.modelStep
	maxSteps := stepLimits.withDelivery
	if currentStep >= maxSteps || state.lengthContinuations >= maxLengthContinuations {
		message := fmt.Sprintf("模型输出因长度限制仍未完成，已达到自动续写上限 %d", maxLengthContinuations)
		if currentStep >= maxSteps {
			message = fmt.Sprintf("模型输出因长度限制仍未完成，已达到最大步骤数 %d", maxSteps)
		}
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
	state.lengthContinuations++
	state.awaitingDelivery = true
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
	return modelStepLimits{standard: standard, withDelivery: hard}
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
