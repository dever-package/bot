package provider

import (
	"context"
	"fmt"
	"strings"

	"github.com/google/uuid"

	energonmodel "github.com/dever-package/bot/model/energon"
	runtimetokenbudget "github.com/dever-package/bot/service/agent/runtime/tokenbudget"
	billingservice "github.com/dever-package/bot/service/billing"
	energonservice "github.com/dever-package/bot/service/energon"
	energoninput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type Transport struct {
	Method  string
	Host    string
	Path    string
	Headers map[string]string
}

func PowerTool(power energonmodel.Power, config energonservice.PowerParamConfig, parameters map[string]any, fixedArguments map[string]any, gateway energonservice.GatewayService, transport Transport, references []MediaReference, referenceScope ReferenceScope, billing botprotocol.BillingContext) Tool {
	name := FunctionName("power_", power.Key)
	countPlan := buildMediaCountPlan(power, config.Params)
	seriesPlan := buildMediaSeriesPlan(power, config.Params, references)
	promptKey := mediaPromptParameterKey(config.Params)
	toolReferences := supportedMediaReferences(references, config.Params)
	referenceStore := newMediaReferenceStore(toolReferences)
	promptReferenceDescription := ""
	if len(referenceScope.promptTexts) > 0 && promptKey != "" {
		promptReferenceDescription = "。本轮已选择提示词素材；素材原文是生成主题，prompt 只填写扩写和细化要求，不得替换素材主题。"
	}
	prepareArguments := func(arguments map[string]any) map[string]any {
		prepared := mergeFixedPowerArguments(arguments, fixedArguments)
		prepared = ApplyPromptReferences(prepared, promptKey, referenceScope)
		return NormalizeMediaReferenceSelections(
			prepared,
			references,
			referenceScope,
		)
	}
	prepareCall := func(arguments map[string]any) (int, map[string]any, error) {
		currentReferences := referenceStore.Snapshot()
		if err := validateMediaArtifactTitle(power, arguments); err != nil {
			return 0, nil, err
		}
		count, err := mediaExecutionCount(power, arguments, countPlan)
		if err != nil {
			return 0, nil, err
		}
		if energonmodel.IsLipSyncPower(power) && count != 1 {
			return 0, nil, fmt.Errorf("口型同步每次只能生成一个结果")
		}
		arguments, err = seriesPlan.apply(arguments)
		if err != nil {
			return 0, nil, err
		}
		currentReferences = seriesPlan.referencesFor(arguments, currentReferences)
		arguments, _, err = ApplyMediaReferences(arguments, config.Params, currentReferences)
		if err != nil {
			return 0, nil, err
		}
		input, err := preparePowerInput(mediaProviderArguments(arguments, countPlan), config.Params)
		if err != nil {
			return 0, nil, err
		}
		input = appendLipSyncContinuationInput(power, input, arguments)
		return count, input, nil
	}
	currentDefinition := func() Definition {
		currentReferences := referenceStore.Snapshot()
		toolParameters := MediaReferencesParameters(parameters, currentReferences, config.Params)
		toolParameters = omitFixedPowerParameters(toolParameters, fixedArguments)
		toolParameters = mediaToolParameters(toolParameters, countPlan)
		toolParameters = mediaSeriesParameters(toolParameters, seriesPlan)
		toolParameters = appendLipSyncContinuationParameters(power, toolParameters)
		return Definition{
			Name:                  name,
			Title:                 strings.TrimSpace(power.Name),
			Kind:                  strings.TrimSpace(power.Kind),
			Description:           powerToolDescription(power) + promptReferenceDescription + MediaReferencesDescription(currentReferences) + seriesPlan.description(),
			Parameters:            toolParameters,
			ActivityParameterKeys: powerActivityParameterKeys(config.Params),
			ActivityCountKey:      countPlan.key,
			ActivityPromptKey:     countPlan.promptKey,
			Execution:             ExecutionPolicy{PreventDuplicateRecovery: true},
		}
	}
	return Tool{
		Definition:        currentDefinition(),
		ResolveDefinition: currentDefinition,
		AddMediaReferences: func(values []MediaReference) {
			referenceStore.Add(supportedMediaReferences(values, config.Params))
		},
		PrepareArguments: func(arguments map[string]any) (map[string]any, error) {
			return prepareArguments(arguments), nil
		},
		ValidateArguments: func(arguments map[string]any) error {
			_, _, err := prepareCall(arguments)
			return err
		},
		Handle: func(ctx context.Context, call Call) (Result, error) {
			count, input, err := prepareCall(call.Arguments)
			if err != nil {
				return Result{}, err
			}
			history, err := preparePowerConversationHistory(
				ctx,
				power,
				input,
				call.History,
				config.SelectedTargetID,
				gateway,
			)
			if err != nil {
				return Result{}, err
			}
			output, err := executeMediaPower(
				ctx,
				power,
				count,
				countPlan.promptKey,
				call.RequestID,
				input,
				history,
				config.SelectedTargetID,
				gateway,
				transport,
				billing,
				call.OnOutput,
			)
			if err != nil {
				return Result{}, err
			}
			if interaction := powerOutputInteraction(output); len(interaction) > 0 {
				return Result{
					Text:        "能力“" + strings.TrimSpace(power.Name) + "”需要选择目标角色",
					Content:     map[string]any(output),
					Interaction: interaction,
					Terminal:    true,
				}, nil
			}
			return Result{
				Text:    "能力“" + strings.TrimSpace(power.Name) + "”调用完成",
				Content: map[string]any(output),
			}, nil
		},
	}
}

func omitFixedPowerParameters(parameters map[string]any, fixed map[string]any) map[string]any {
	if len(fixed) == 0 {
		return parameters
	}
	result := clonePowerParameters(parameters)
	properties, _ := result["properties"].(map[string]any)
	for key := range fixed {
		delete(properties, key)
	}
	result["properties"] = properties
	if required, ok := result["required"].([]any); ok {
		filtered := required[:0]
		for _, value := range required {
			if _, exists := fixed[strings.TrimSpace(fmt.Sprint(value))]; !exists {
				filtered = append(filtered, value)
			}
		}
		if len(filtered) == 0 {
			delete(result, "required")
		} else {
			result["required"] = filtered
		}
	}
	return result
}

func mergeFixedPowerArguments(arguments map[string]any, fixed map[string]any) map[string]any {
	result := make(map[string]any, len(arguments)+len(fixed))
	for key, value := range arguments {
		result[key] = value
	}
	for key, value := range fixed {
		result[key] = value
	}
	return result
}

func appendLipSyncContinuationParameters(power energonmodel.Power, parameters map[string]any) map[string]any {
	if !energonmodel.IsLipSyncPower(power) {
		return parameters
	}
	result := clonePowerParameters(parameters)
	properties, _ := result["properties"].(map[string]any)
	properties["session_id"] = map[string]any{
		"type":        "string",
		"description": "仅在角色选择交互返回 session_id 后填写；首次调用必须省略",
	}
	properties["face_id"] = map[string]any{
		"type":        "string",
		"description": "仅在角色选择交互返回 face_id 后填写；首次调用必须省略",
	}
	result["properties"] = properties
	return result
}

func appendLipSyncContinuationInput(power energonmodel.Power, input map[string]any, arguments map[string]any) map[string]any {
	if !energonmodel.IsLipSyncPower(power) {
		return input
	}
	for _, key := range []string{"session_id", "face_id"} {
		if value, exists := arguments[key]; exists && !botprotocol.IsEmptyProtocolValue(value) {
			input[key] = value
		}
	}
	return input
}

func powerOutputInteraction(output botprotocol.Output) map[string]any {
	interaction, _ := output["interaction"].(map[string]any)
	if strings.TrimSpace(botprotocol.AsText(interaction["id"])) == "" {
		return nil
	}
	return interaction
}

func powerActivityParameterKeys(params []energonservice.PowerParam) []string {
	result := make([]string, 0, len(params))
	for _, param := range params {
		key := strings.TrimSpace(param.Key)
		if !param.IsToolbar() || key == "" {
			continue
		}
		result = append(result, key)
	}
	return result
}

func preparePowerInput(arguments map[string]any, params []energonservice.PowerParam) (map[string]any, error) {
	input, missing := energonservice.PreparePowerParamInput(arguments, params)
	if len(missing) > 0 {
		return nil, fmt.Errorf("缺少必填参数: %s", strings.Join(missing, "、"))
	}
	if err := energoninput.ValidatePowerParamValues(params, input); err != nil {
		return nil, err
	}
	return input, nil
}

func executePower(
	ctx context.Context,
	requestID string,
	power energonmodel.Power,
	input map[string]any,
	history []any,
	targetID uint64,
	gateway energonservice.GatewayService,
	transport Transport,
	billing botprotocol.BillingContext,
	onOutput OutputHandler,
) (output botprotocol.Output, resultErr error) {
	billing.BusinessKey = powerChargeBusinessKey(billing.BusinessKey, requestID)
	body := map[string]any{
		"power": power.Key,
		"input": input,
		"options": map[string]any{
			"stream": true,
		},
	}
	if len(history) > 0 && energonmodel.NormalizePowerKind(power.Kind) == "text" {
		body["history"] = append([]any(nil), history...)
	}
	if targetID > 0 {
		body["source_target_id"] = targetID
	}
	return billingservice.ExecutePower(ctx, billingservice.PowerExecutionRequest{
		Prepare: billingservice.PreparePowerChargeRequest{
			Billing:       billing,
			RequestID:     requestID,
			PowerID:       power.ID,
			PowerName:     power.Name,
			PowerTargetID: targetID,
		},
		RunID: billing.RunID,
	}, func(ctx context.Context, charged botprotocol.BillingContext) (botprotocol.Output, error) {
		result, err := gateway.Invoke(ctx, energonservice.GatewayRequest{
			RequestID: requestID,
			Method:    transport.Method,
			Host:      transport.Host,
			Path:      transport.Path,
			Headers:   transport.Headers,
			Body:      body,
			Billing:   charged,
		}, energonservice.InvokeOptions{
			OnOutput: func(_ context.Context, current botprotocol.Output) error {
				if onOutput == nil || botprotocol.HasMediaOutput(current) && !botprotocol.IsStreamingAudioOutput(current) {
					return nil
				}
				return onOutput(map[string]any(current))
			},
		})
		return result.Output, err
	})
}

const textPowerProtocolReserveTokens = 512

func preparePowerConversationHistory(
	ctx context.Context,
	power energonmodel.Power,
	input map[string]any,
	history []any,
	targetID uint64,
	gateway energonservice.GatewayService,
) ([]any, error) {
	if energonmodel.NormalizePowerKind(power.Kind) != "text" || len(history) == 0 {
		return nil, nil
	}
	limits, err := gateway.ResolveModelLimitsForTarget(ctx, power.Key, targetID)
	if err != nil {
		return nil, err
	}
	requiredTokens := runtimetokenbudget.Estimate(power.Prompt) +
		runtimetokenbudget.Estimate(input) + textPowerProtocolReserveTokens
	budget, err := runtimetokenbudget.Resolve(
		limits.ContextWindowTokens,
		limits.ContextWindowTokens,
		limits.MaxOutputTokens,
		requiredTokens,
	)
	if err != nil {
		return nil, fmt.Errorf("文本工具上下文预算无效: %w", err)
	}
	return runtimetokenbudget.FitHistory(
		append([]any(nil), history...),
		budget.MaxInputTokens-requiredTokens,
	)
}

func powerChargeBusinessKey(parent string, requestID string) string {
	value := "agent-power:" + strings.TrimSpace(parent) + ":" + strings.TrimSpace(requestID)
	return uuid.NewSHA1(uuid.NameSpaceOID, []byte(value)).String()
}

func powerToolDescription(power energonmodel.Power) string {
	description := "使用已挂载能力“" + strings.TrimSpace(power.Name) + "”"
	if isMediaPower(power) {
		return description + "生成" + mediaPowerLabel(power) + "。"
	}
	if kind := strings.TrimSpace(power.Kind); kind != "" {
		return description + "执行" + kind + "任务。"
	}
	return description + "完成任务。"
}
