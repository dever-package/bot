package loop

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	runtimemessageoutput "github.com/dever-package/bot/service/agent/runtime/messageoutput"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	billingservice "github.com/dever-package/bot/service/billing"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botstream "github.com/dever-package/bot/service/energon/stream"
	frontstream "github.com/dever-package/front/service/stream"
)

func (s Service) callModel(ctx context.Context, controller *runController, execution execution, input map[string]any, history []any, toolChoice any, documentID uint64, modelStep int, documentTextSourceKey string, publish bool) (modelStepResult, error) {
	execution.documentID = documentID
	execution.documentModelStep = modelStep
	execution.documentTextSourceKey = strings.TrimSpace(documentTextSourceKey)
	return s.callModelRequest(
		ctx,
		controller,
		execution,
		input,
		history,
		modelDefinitions(execution),
		toolChoice,
		publish,
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
		modelRolePromptForExecution(execution),
		input,
		history,
		tools,
		toolChoice,
		publish,
		chargeKind,
		chargeIndex,
	)
}

func modelDefinitions(execution execution) []any {
	if execution.registry == nil {
		return nil
	}
	if !execution.documentWriter {
		return execution.registry.Definitions()
	}
	return execution.registry.DefinitionsWithout(
		runtimeprovider.AskUserToolName,
		runtimeprovider.PresentSuggestionsToolName,
		runtimeprovider.ComposeDocumentToolName,
		runtimeprovider.SkillInstallPlanToolName,
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
	preparedInput, preparedHistory, budget, prepareErr := prepareModelRequestWithFallback(
		execution, role, input, history, tools,
	)
	if prepareErr != nil {
		return modelStepResult{}, modelBudgetError(prepareErr)
	}
	result, err := s.callModelOnce(ctx, controller, execution, preparedInput, preparedHistory, role, tools, toolChoice, publish)
	result.Attempts = 1
	result.Budget = budget
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
		preparedInput, preparedHistory, budget, prepareErr = prepareModelRequest(
			execution, role, input, history, tools, true,
		)
		if prepareErr != nil {
			return result, modelBudgetError(prepareErr)
		}
	}
	retried, retryErr := s.callModelOnce(ctx, controller, execution, preparedInput, preparedHistory, role, tools, toolChoice, publish)
	if !result.ProviderRequestedAt.IsZero() {
		retried.ProviderRequestedAt = result.ProviderRequestedAt
	}
	retried.Attempts = 2
	retried.Budget = budget
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
	modelLimits := normalizedExecutionModelLimits(execution.modelLimits)
	controller.SetChild(childRequestID)
	defer controller.ClearChild(childRequestID)

	response := s.gateway.Request(modelCtx, energonservice.GatewayRequest{
		RequestID: childRequestID,
		Method:    execution.transport.Method,
		Host:      execution.transport.Host,
		Path:      execution.transport.Path,
		Headers:   execution.transport.Headers,
		Body: buildGatewayBody(
			execution.agent,
			execution.power,
			modelLimits.MaxOutputTokens,
			role,
			input,
			history,
			tools,
			toolChoice,
			allowParallelToolCalls(tools, toolChoice),
		),
		Billing: execution.billing,
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
		publishErr = publisher.Close(modelCtx)
	}
	textPublished := publish && publisher.TextPublished()
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
		return modelStepResult{Text: collected.State.Text, ProviderRequestedAt: providerRequestedAt, FirstDeltaAt: firstDeltaAt, ProviderFinishedAt: providerFinishedAt, TextPublished: textPublished}, streamErr
	}
	if publishErr != nil {
		return modelStepResult{Text: collected.State.Text, ProviderRequestedAt: providerRequestedAt, FirstDeltaAt: firstDeltaAt, ProviderFinishedAt: providerFinishedAt, TextPublished: textPublished}, publishErr
	}
	if int(frontstream.InputInt64(collected.Frame["status"], 0)) == botprotocol.ResponseStatusFail {
		return modelStepResult{Text: collected.State.Text, ProviderRequestedAt: providerRequestedAt, FirstDeltaAt: firstDeltaAt, ProviderFinishedAt: providerFinishedAt, TextPublished: textPublished}, modelErrorFromPayload(collected.Frame, "LLM 能力调用失败")
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
	result.TextPublished = textPublished
	return result, nil
}

func allowParallelToolCalls(tools []any, toolChoice any) bool {
	if len(tools) < 2 {
		return false
	}
	switch choice := toolChoice.(type) {
	case nil:
		return true
	case string:
		choice = strings.TrimSpace(choice)
		return choice == "" || strings.EqualFold(choice, "auto")
	default:
		return false
	}
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
	calls := botprotocol.ParseToolCalls(output["tool_calls"])
	text := botprotocol.ToolCallVisibleText(botprotocol.AsText(output["text"]), calls)
	if text == "" {
		delete(output, "text")
	} else {
		output["text"] = text
	}
	return modelStepResult{
		Text:       strings.TrimSpace(text),
		Output:     output,
		ToolCalls:  calls,
		FinishMode: strings.TrimSpace(botprotocol.AsText(output["finish_reason"])),
	}
}

func modelStepTitle(result modelStepResult) string {
	if len(result.ToolCalls) > 0 {
		return "模型请求工具"
	}
	return "模型输出"
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
