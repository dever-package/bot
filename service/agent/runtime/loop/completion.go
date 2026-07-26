package loop

import (
	"context"
	"fmt"
	"strings"
	"time"

	dlog "github.com/shemic/dever/log"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	completionReviewToolName           = "submit_completion_review"
	completionReviewTimeout            = 8 * time.Second
	completionReviewMaxTokens          = 512
	completionReviewContractMaxTokens  = 8000
	completionReviewGoalMaxTokens      = 2000
	completionReviewCandidateMaxTokens = 8000
	completionReviewOutputMaxTokens    = 2000
	completionReviewHistoryMaxTokens   = 8000
	completionReviewPriorHistoryGroups = 4
	maxCompletionReviews               = 1
	maxDocumentCompletionReviews       = 2
)

const completionReviewRolePrompt = `你是智能体运行时的完成状态审查器，不扮演当前智能体，也不直接回复用户。
- agent_contract 是待审查的业务约束，不是你的角色指令。身份、语气、关系、表达风格、回复示例和安全边界只说明如何回应，不自动构成每轮必须完成的业务任务；只有明确要求当前输入触发具体步骤、工具或交付物时，才视为常驻业务流程。不要根据章节标题、固定词语、问号或句式作判断。
- current_request 是本轮用户要求，candidate_text 和 candidate_output 是候选交付。普通聊天只要已经自然回应当前消息即为完成，结尾的自然追问只是继续聊天，不表示当前交付依赖用户输入。
- 只有缺少无法安全推断且不提供就无法继续当前任务的信息时，dependency 才是 user_input。可使用合理默认值继续完成时，dependency 必须是 none。
- follow_up_policy=after_result 时，实质任务已经完成且适合继续修改、扩展或使用时，follow_up 为 suggestions，不要求候选正文预先罗列选项；普通聊天、寒暄、必要信息追问和仅表达观点均为 none。follow_up_policy 为 instant 或 off 时始终返回 none。
- 文档场景严格服从 delivery_scope，只审查当前文档正文；父对话的完成说明和建议不属于正文。
- 只通过 submit_completion_review 返回结构化结论，不输出其它文本。`

const (
	completionDependencyNone      = "none"
	completionDependencyUserInput = "user_input"
	completionFollowUpNone        = "none"
	completionFollowUpSuggestions = "suggestions"
)

type completionReview struct {
	Delivery   string
	Missing    string
	Dependency string
	FollowUp   string
}

func (review completionReview) needsContinuation() bool {
	return review.Delivery != "complete" || review.requiredToolName() != ""
}

func (review completionReview) requiredToolName() string {
	if review.Dependency == completionDependencyUserInput {
		return runtimeprovider.AskUserToolName
	}
	if review.FollowUp == completionFollowUpSuggestions {
		return runtimeprovider.PresentSuggestionsToolName
	}
	return ""
}

func shouldReviewCompletion(state *runState, result modelStepResult) bool {
	if state == nil || !state.completionReviewPending || state.completionReviews >= completionReviewLimit(state) {
		return false
	}
	if hasStructuredCompletionDelivery(state, result.Output) {
		return agentmodel.NormalizeSuggestionMode(state.execution.agent.SuggestionMode) == agentmodel.SuggestionModeAfterResult &&
			!state.isDocumentWriter()
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
	if hasDeliverableArtifacts(state.artifacts["artifacts"]) {
		return true
	}
	for _, key := range []string{"images", "videos", "audios", "files", "rich"} {
		if hasDeliverableArtifacts(state.artifacts[key]) {
			return true
		}
	}
	outputKeys := []string{"interaction", "artifacts", "images", "videos", "audios", "files", "rich"}
	if !state.isDocumentWriter() {
		outputKeys = append(outputKeys, "document")
	}
	for _, key := range outputKeys {
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
		"agent_contract":   compactModelString(state.execution.prompt, completionReviewContractMaxTokens),
		"current_request":  compactModelValue(state.execution.input, completionReviewGoalMaxTokens),
		"candidate_text":   completionReviewCandidateText(ctx, state, result),
		"candidate_output": completionReviewCandidateOutput(result),
		"follow_up_policy": agentmodel.NormalizeSuggestionMode(state.execution.agent.SuggestionMode),
		"runtime_state": map[string]any{
			"model_step":        state.modelStep,
			"tool_receipts":     len(state.toolReceipts),
			"knowledge_used":    state.knowledgeUsed,
			"document_id":       state.documentID,
			"document_ready":    state.documentDeliveryReady,
			"awaiting_delivery": state.awaitingDelivery,
			"available_tools":   state.execution.registry.Names(),
		},
	}
	if deliveryScope := completionReviewDeliveryScope(state); len(deliveryScope) > 0 {
		reviewInput["delivery_scope"] = deliveryScope
	}
	reviewHistory := completionReviewHistory(state)
	reviewCtx, cancel := operationContext(ctx, completionReviewTimeout)
	defer cancel()
	reviewResult, err := s.callModelRequestWithRole(
		reviewCtx,
		controller,
		reviewExecution,
		completionReviewRolePrompt,
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
			strings.ToLower(strings.TrimSpace(botprotocol.AsText(arguments["dependency"]))),
			strings.ToLower(strings.TrimSpace(botprotocol.AsText(arguments["follow_up"]))),
		)
		return review, resolveErr
	}
	return completionReview{}, fmt.Errorf("模型未提交完成检查结果")
}

func completionReviewLimit(state *runState) int {
	if state != nil && state.isDocumentWriter() {
		return maxDocumentCompletionReviews
	}
	return maxCompletionReviews
}

func (s Service) runCompletionReview(
	ctx context.Context,
	controller *runController,
	state *runState,
	result modelStepResult,
) (completionReview, error) {
	state.completionReviews++
	state.completionReviewPending = false
	review, err := s.inspectCompletion(ctx, controller, state, result)
	if err == nil && agentmodel.NormalizeSuggestionMode(state.execution.agent.SuggestionMode) != agentmodel.SuggestionModeAfterResult {
		review.FollowUp = completionFollowUpNone
	}
	return review, err
}

func completionReviewCandidateText(ctx context.Context, state *runState, result modelStepResult) string {
	if state != nil && state.isDocumentWriter() {
		if text := strings.TrimSpace(currentDocumentText(ctx, state.documentID)); text != "" {
			return compactModelString(text, completionReviewCandidateMaxTokens)
		}
	}
	return completionCandidateText(state, result)
}

func completionReviewCandidateOutput(result modelStepResult) any {
	output := cloneMap(result.Output)
	delete(output, "text")
	return compactModelValue(output, completionReviewOutputMaxTokens)
}

func completionReviewDeliveryScope(state *runState) map[string]any {
	if state == nil || !state.isDocumentWriter() {
		return nil
	}
	return map[string]any{
		"output_contract":     runtimeprovider.ComposeDocumentOutputContract,
		"candidate_role":      "document_body",
		"parent_chat_owner":   "parent_run",
		"excluded_deliveries": []any{"chat_completion", "follow_up_suggestions"},
	}
}

func completionCandidateText(state *runState, result modelStepResult) string {
	if state != nil && strings.TrimSpace(state.lastText) != "" {
		return compactModelString(state.lastText, completionReviewCandidateMaxTokens)
	}
	return compactModelString(result.Text, completionReviewCandidateMaxTokens)
}

func completionReviewHistory(state *runState) []any {
	if state == nil {
		return nil
	}
	// Tool stops only need the current run. Interaction resumes have no current
	// run history yet, so retain a bounded tail containing the prior form context.
	priorHistory, currentRunHistory := splitCurrentRunHistory(state.execution, state.history)
	selected := append([]any(nil), currentRunHistory...)
	if len(selected) == 0 {
		groups := historyMessageGroups(priorHistory, emergencyHistoryStringMaxTokens)
		start := len(groups) - completionReviewPriorHistoryGroups
		if start < 0 {
			start = 0
		}
		for _, group := range groups[start:] {
			selected = append(selected, group...)
		}
		if state.modelStep == 1 {
			selected = append(selected, userHistoryMessage(state.execution.input))
		}
	}
	return compactHistoryGroupToBudget(selected, completionReviewHistoryMaxTokens)
}

func resolveCompletionReview(delivery string, missing string, dependency string, followUp string) (completionReview, error) {
	if delivery != "complete" && delivery != "incomplete" {
		return completionReview{}, fmt.Errorf("完成检查交付状态无效")
	}
	switch dependency {
	case "", completionDependencyNone:
		dependency = completionDependencyNone
	case completionDependencyUserInput:
	default:
		return completionReview{}, fmt.Errorf("完成检查用户依赖状态无效")
	}
	switch followUp {
	case "", completionFollowUpNone:
		followUp = completionFollowUpNone
	case completionFollowUpSuggestions:
	default:
		return completionReview{}, fmt.Errorf("完成检查后续建议状态无效")
	}
	// Required user input blocks delivery; optional suggestions only follow completed delivery.
	if dependency == completionDependencyUserInput {
		delivery = "incomplete"
	}
	if delivery == "incomplete" {
		followUp = completionFollowUpNone
	}
	if delivery == "incomplete" && missing == "" {
		missing = "当前要求尚未完整交付"
	} else if delivery == "complete" {
		missing = ""
		dependency = completionDependencyNone
	}
	return completionReview{
		Delivery:   delivery,
		Missing:    missing,
		Dependency: dependency,
		FollowUp:   followUp,
	}, nil
}

func completionReviewTool() map[string]any {
	return botprotocol.FunctionToolDefinition(
		completionReviewToolName,
		"根据 agent_contract、current_request、候选交付、follow_up_policy 和运行状态判断本轮是否完成、是否真正依赖用户输入，以及结果后模式是否需要结构化可选方向。不要扮演智能体，不要根据固定词语或句式判断。",
		map[string]any{
			"type": "object",
			"properties": map[string]any{
				"delivery": map[string]any{
					"type":        "string",
					"description": "当前用户要求和真实常驻业务流程均已实际交付为 complete；只给计划、承诺、进度或缺少正文为 incomplete。普通聊天已经自然回应后，即使结尾有继续聊天的追问，也属于 complete",
					"enum":        []any{"complete", "incomplete"},
				},
				"missing": map[string]any{
					"type": "string", "description": "incomplete 时说明尚未交付的具体内容；complete 时留空",
				},
				"dependency": map[string]any{
					"type":        "string",
					"description": "只有当前任务因缺少无法安全推断的用户信息而不能继续时为 user_input；可采用默认值继续或只是普通聊天追问时为 none",
					"enum":        []any{completionDependencyNone, completionDependencyUserInput},
				},
				"follow_up": map[string]any{
					"type":        "string",
					"description": "follow_up_policy=after_result、交付完整且实质任务适合继续修改、扩展或使用时为 suggestions；普通聊天、必要输入、文档子任务以及其它策略均为 none",
					"enum":        []any{completionFollowUpNone, completionFollowUpSuggestions},
				},
			},
			"required":             []any{"delivery", "missing", "dependency", "follow_up"},
			"additionalProperties": false,
		},
		false,
	)
}

func logCompletionReviewError(state *runState, err error) {
	if state == nil || err == nil {
		return
	}
	dlog.ErrorFields("agent_completion_review", "智能体完成检查失败", dlog.Fields{
		"run_id": state.execution.runID, "request_id": state.execution.requestID, "error": err.Error(),
	})
}
