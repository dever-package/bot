package loop

import (
	"context"
	"fmt"
	"strings"
	"time"

	dlog "github.com/shemic/dever/log"

	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	completionReviewToolName = "submit_completion_review"
	maxCompletionReviews     = 2
	completionReviewTimeout  = 20 * time.Second
)

type completionReview struct {
	Delivery   string
	Status     string
	NextAction string
	NextTool   string
}

type completionReviewDecision struct {
	Delivery    string
	Interaction string
}

func shouldReviewCompletion(state *runState) bool {
	if state == nil || state.completionReviews >= maxCompletionReviews {
		return false
	}
	if state.awaitingDelivery {
		return true
	}
	return state.modelStep == 1 && runtimeEventType(state.execution.input) == "interaction_resumed"
}

func shouldReviewPresentSuggestions(state *runState, calls []botprotocol.ToolCall) bool {
	if !shouldReviewCompletion(state) || len(calls) == 0 {
		return false
	}
	return strings.EqualFold(
		strings.TrimSpace(calls[len(calls)-1].Name),
		runtimeprovider.PresentSuggestionsToolName,
	)
}

func hasQueuedArtifactDelivery(state *runState) bool {
	if state == nil {
		return false
	}
	for _, artifact := range artifactValues(state.artifacts["artifacts"]) {
		if strings.EqualFold(strings.TrimSpace(botprotocol.AsText(artifact["status"])), "generating") {
			return true
		}
	}
	return false
}

func runtimeEventType(input map[string]any) string {
	event, _ := input["runtime_event"].(map[string]any)
	return strings.ToLower(strings.TrimSpace(botprotocol.AsText(event["type"])))
}

func (s Service) inspectCompletion(
	ctx context.Context,
	controller *runController,
	state *runState,
	result modelStepResult,
) (completionReview, error) {
	reviewHistory := append([]any(nil), state.history...)
	if state.modelStep == 1 {
		reviewHistory = append(reviewHistory, userHistoryMessage(state.execution.input))
	}
	reviewCtx, cancel := operationContext(ctx, completionReviewTimeout)
	defer cancel()
	reviewResult, err := s.callModelRequestWithRole(
		reviewCtx,
		controller,
		state.execution,
		modelRolePrompt(""),
		runtimeEventInput("completion_review", map[string]any{
			"candidate_text":   strings.TrimSpace(result.Text),
			"candidate_output": result.Output,
		}),
		reviewHistory,
		[]any{completionReviewTool()},
		botprotocol.ForcedFunctionToolChoice(completionReviewToolName),
		false,
		"completion_review",
		state.completionReviews+1,
	)
	if err != nil {
		return completionReview{}, err
	}
	for _, call := range reviewResult.ToolCalls {
		if !strings.EqualFold(strings.TrimSpace(call.Name), completionReviewToolName) {
			continue
		}
		arguments, parseErr := botprotocol.ToolCallArguments(call)
		if parseErr != nil {
			return completionReview{}, parseErr
		}
		decision := completionReviewDecision{
			Delivery:    strings.ToLower(strings.TrimSpace(botprotocol.AsText(arguments["delivery"]))),
			Interaction: strings.ToLower(strings.TrimSpace(botprotocol.AsText(arguments["interaction"]))),
		}
		return resolveCompletionReview(decision)
	}
	return completionReview{}, fmt.Errorf("模型未提交完成检查结果")
}

func resolveCompletionReview(decision completionReviewDecision) (completionReview, error) {
	if decision.Delivery != "complete" && decision.Delivery != "incomplete" {
		return completionReview{}, fmt.Errorf("完成检查交付状态无效")
	}
	switch decision.Interaction {
	case runtimeprovider.AskUserToolName:
		return completionReview{
			Delivery:   decision.Delivery,
			Status:     "continue",
			NextAction: "收集候选响应要求用户提供的必要信息",
			NextTool:   runtimeprovider.AskUserToolName,
		}, nil
	case runtimeprovider.PresentSuggestionsToolName, "none":
	default:
		return completionReview{}, fmt.Errorf("完成检查交互状态无效")
	}
	// Optional suggestions cannot replace the delivery promised by the current task.
	if decision.Delivery == "incomplete" {
		return completionReview{
			Delivery:   decision.Delivery,
			Status:     "continue",
			NextAction: "继续完成候选响应中尚未交付的任务",
		}, nil
	}
	switch decision.Interaction {
	case runtimeprovider.PresentSuggestionsToolName:
		return completionReview{
			Delivery:   decision.Delivery,
			Status:     "continue",
			NextAction: "将候选响应中的可选下一步转为可点击建议",
			NextTool:   runtimeprovider.PresentSuggestionsToolName,
		}, nil
	case "none":
		return completionReview{Delivery: decision.Delivery, Status: "complete"}, nil
	}
	return completionReview{}, fmt.Errorf("完成检查交互状态无效")
}

func (s Service) reviewPresentSuggestions(
	ctx context.Context,
	controller *runController,
	state *runState,
	result modelStepResult,
) (bool, bool) {
	if hasQueuedArtifactDelivery(state) {
		return true, true
	}
	review, err := s.inspectCompletion(ctx, controller, state, result)
	if ctx.Err() != nil {
		s.finishContext(controller, state)
		return false, false
	}
	if err != nil {
		logCompletionReviewError(state, err)
		review = completionReview{
			Delivery:   "incomplete",
			Status:     "continue",
			NextAction: "继续完成当前任务",
		}
	}
	if review.Delivery == "complete" && review.NextTool != runtimeprovider.AskUserToolName {
		return true, true
	}
	state.completionReviews++
	if state.completionReviews >= maxCompletionReviews {
		s.finish(state, finishOutcome{
			status: runStatusFail, text: state.lastText,
			message:    "模型连续未完成当前任务",
			stepType:   "error",
			stepTitle:  "任务未完成",
			stepStatus: stepStatusFail,
		})
		return false, false
	}
	state.requiredToolName = review.NextTool
	state.awaitingDelivery = review.NextTool == ""
	return false, s.continueModelOutput(
		state,
		result,
		completionContinuationInput(review.NextAction, review.NextTool),
		"completion_terminal_rejected",
		stepStatusWarning,
	)
}

func completionReviewTool() map[string]any {
	return botprotocol.FunctionToolDefinition(
		completionReviewToolName,
		"只审查 runtime_event.candidate_text。分别判断交付和交互，二者互不覆盖。",
		map[string]any{
			"type": "object",
			"properties": map[string]any{
				"delivery": map[string]any{
					"type":        "string",
					"description": "当前要求已实际交付为 complete；仅有计划、预告、进度或未兑现承诺为 incomplete",
					"enum":        []any{"complete", "incomplete"},
				},
				"interaction": map[string]any{
					"type":        "string",
					"description": "正文要求用户补充、确认、选择或上传必要信息为 ask_user；正文提供可选下一步、选项列表、询问是否继续或表示愿意后可继续为 present_suggestions；确实没有用户交互才为 none",
					"enum":        []any{"none", runtimeprovider.AskUserToolName, runtimeprovider.PresentSuggestionsToolName},
				},
			},
			"required":             []any{"delivery", "interaction"},
			"additionalProperties": false,
		},
		false,
	)
}

func logCompletionReviewError(state *runState, err error) {
	if state == nil || err == nil {
		return
	}
	dlog.ErrorFields("agent_completion_review", "主模型完成检查失败，执行一次保守续跑", dlog.Fields{
		"run_id":     state.execution.runID,
		"request_id": state.execution.requestID,
		"error":      err.Error(),
	})
}
