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
	completionReviewToolName  = "submit_completion_review"
	completionReviewTimeout   = 8 * time.Second
	completionReviewMaxTokens = 512
	maxCompletionReviews      = 1
)

type completionReview struct {
	Delivery    string
	Missing     string
	Interaction string
}

func (review completionReview) needsContinuation() bool {
	return review.Delivery != "complete" || review.Interaction != ""
}

func shouldReviewCompletion(state *runState, result modelStepResult) bool {
	if state == nil || !state.completionReviewPending || state.completionReviews >= maxCompletionReviews {
		return false
	}
	if hasStructuredCompletionDelivery(state, result.Output) {
		return false
	}
	return true
}

func runtimeEventType(input map[string]any) string {
	event, _ := input["runtime_event"].(map[string]any)
	return strings.ToLower(strings.TrimSpace(botprotocol.AsText(event["type"])))
}

func hasStructuredCompletionDelivery(state *runState, output map[string]any) bool {
	if state == nil {
		return false
	}
	if state.documentID > 0 || hasDeliverableArtifacts(state.artifacts["artifacts"]) {
		return true
	}
	for _, key := range []string{"images", "videos", "audios", "files", "rich"} {
		if hasDeliverableArtifacts(state.artifacts[key]) {
			return true
		}
	}
	for _, key := range []string{"interaction", "document", "artifacts", "images", "videos", "audios", "files", "rich"} {
		if hasDeliverableArtifacts(output[key]) {
			return true
		}
	}
	return false
}

func (s Service) inspectCompletion(
	ctx context.Context,
	controller *runController,
	state *runState,
	result modelStepResult,
) (completionReview, error) {
	reviewExecution := state.execution
	reviewExecution.agent.MaxOutputTokens = completionReviewMaxTokens
	reviewExecution.agent.Temperature = 0
	// Completion review is runtime safety work. The provider cost remains in the
	// Energon log, but the user is not charged a second fixed ability invocation.
	reviewExecution.billing.Billable = false
	reviewExecution.billing.ChargeID = 0
	reviewInput := map[string]any{
		"goal":             compactModelValue(state.execution.input, 4000),
		"candidate_text":   completionCandidateText(state, result),
		"candidate_output": compactModelValue(result.Output, 4000),
		"runtime_state": map[string]any{
			"model_step":        state.modelStep,
			"tool_receipts":     len(state.toolReceipts),
			"knowledge_used":    state.knowledgeUsed,
			"document_id":       state.documentID,
			"awaiting_delivery": state.awaitingDelivery,
		},
	}
	reviewHistory := append([]any(nil), state.history...)
	if state.modelStep == 1 {
		reviewHistory = append(reviewHistory, userHistoryMessage(state.execution.input))
	}
	reviewCtx, cancel := operationContext(ctx, completionReviewTimeout)
	defer cancel()
	reviewResult, err := s.callModelRequestWithRole(
		reviewCtx,
		controller,
		reviewExecution,
		modelRolePrompt(state.execution.prompt),
		runtimeEventInput("completion_review", reviewInput),
		reviewHistory,
		[]any{completionReviewTool()},
		botprotocol.ForcedFunctionToolChoice(completionReviewToolName),
		false,
		"completion_review",
		state.completionReviews,
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
		review, resolveErr := resolveCompletionReview(
			strings.ToLower(strings.TrimSpace(botprotocol.AsText(arguments["delivery"]))),
			strings.TrimSpace(botprotocol.AsText(arguments["missing"])),
			strings.ToLower(strings.TrimSpace(botprotocol.AsText(arguments["interaction"]))),
		)
		return review, resolveErr
	}
	return completionReview{}, fmt.Errorf("模型未提交完成检查结果")
}

func completionCandidateText(state *runState, result modelStepResult) string {
	if state != nil && strings.TrimSpace(state.lastText) != "" {
		return compactModelString(state.lastText, 12000)
	}
	return compactModelString(result.Text, 12000)
}

func resolveCompletionReview(delivery string, missing string, interaction string) (completionReview, error) {
	if delivery != "complete" && delivery != "incomplete" {
		return completionReview{}, fmt.Errorf("完成检查交付状态无效")
	}
	switch interaction {
	case "", "none":
		interaction = ""
	case runtimeprovider.AskUserToolName, runtimeprovider.PresentSuggestionsToolName:
	default:
		return completionReview{}, fmt.Errorf("完成检查交互状态无效")
	}
	// ask_user blocks delivery; optional suggestions can only follow completed delivery.
	if interaction == runtimeprovider.AskUserToolName {
		delivery = "incomplete"
	}
	if delivery == "incomplete" && interaction == runtimeprovider.PresentSuggestionsToolName {
		interaction = ""
	}
	if delivery == "incomplete" && missing == "" {
		missing = "当前要求尚未完整交付"
	} else if delivery == "complete" {
		missing = ""
	}
	return completionReview{
		Delivery:    delivery,
		Missing:     missing,
		Interaction: interaction,
	}, nil
}

func completionReviewTool() map[string]any {
	return botprotocol.FunctionToolDefinition(
		completionReviewToolName,
		"分别判断候选响应是否已经交付当前要求，以及是否仍需要结构化用户交互。两个结论相互独立，只依据完整语义和结构化结果，不使用固定词语、句式或正文格式作为判断规则。",
		map[string]any{
			"type": "object",
			"properties": map[string]any{
				"delivery": map[string]any{
					"type":        "string",
					"description": "当前用户要求已实际交付为 complete；仍有未交付内容为 incomplete",
					"enum":        []any{"complete", "incomplete"},
				},
				"missing": map[string]any{
					"type": "string", "description": "incomplete 时说明尚未交付的具体内容；complete 时留空",
				},
				"interaction": map[string]any{
					"type":        "string",
					"description": "缺少完成任务所必需的用户信息时为 ask_user；任务已完成且候选响应提供可供用户选择的后续方向时为 present_suggestions；无需结构化交互时为 none",
					"enum":        []any{"none", runtimeprovider.AskUserToolName, runtimeprovider.PresentSuggestionsToolName},
				},
			},
			"required":             []any{"delivery", "missing", "interaction"},
			"additionalProperties": false,
		},
		false,
	)
}

func logCompletionReviewError(state *runState, err error) {
	if state == nil || err == nil {
		return
	}
	dlog.ErrorFields("agent_completion_review", "主模型完成检查失败，接受当前候选输出", dlog.Fields{
		"run_id": state.execution.runID, "request_id": state.execution.requestID, "error": err.Error(),
	})
}
