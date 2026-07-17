package provider

import (
	"context"
	"fmt"
	"strings"
	"time"

	energonmodel "github.com/dever-package/bot/model/energon"
	energonservice "github.com/dever-package/bot/service/energon"
	energoninput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botstream "github.com/dever-package/bot/service/energon/stream"
	frontstream "github.com/dever-package/front/service/stream"
)

type Transport struct {
	Method  string
	Host    string
	Path    string
	Headers map[string]string
}

func PowerTool(power energonmodel.Power, config energonservice.PowerParamConfig, parameters map[string]any, gateway energonservice.GatewayService, transport Transport, references []MediaReference) Tool {
	name := FunctionName("power_", power.Key)
	countPlan := buildMediaCountPlan(power, config.Params)
	seriesPlan := buildMediaSeriesPlan(power, config.Params, references)
	toolReferences := references
	if !isMediaPower(power) {
		toolReferences = nil
	} else {
		toolReferences = supportedMediaReferences(references, config.Params)
	}
	referenceStore := newMediaReferenceStore(toolReferences)
	prepareCall := func(arguments map[string]any) (int, map[string]any, error) {
		currentReferences := referenceStore.Snapshot()
		count, err := mediaExecutionCount(power, arguments, countPlan)
		if err != nil {
			return 0, nil, err
		}
		arguments, err = seriesPlan.apply(arguments)
		if err != nil {
			return 0, nil, err
		}
		arguments, _, err = ApplyMediaReferences(arguments, config.Params, currentReferences)
		if err != nil {
			return 0, nil, err
		}
		input, err := preparePowerInput(mediaProviderArguments(arguments, countPlan), config.Params)
		if err != nil {
			return 0, nil, err
		}
		return count, input, nil
	}
	currentDefinition := func() Definition {
		currentReferences := referenceStore.Snapshot()
		toolParameters := MediaReferencesParameters(parameters, currentReferences, config.Params)
		toolParameters = mediaToolParameters(toolParameters, countPlan)
		toolParameters = mediaSeriesParameters(toolParameters, seriesPlan)
		return Definition{
			Name:                  name,
			Title:                 strings.TrimSpace(power.Name),
			Kind:                  strings.TrimSpace(power.Kind),
			Description:           powerToolDescription(power) + MediaReferencesDescription(currentReferences) + seriesPlan.description(),
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
		ValidateArguments: func(arguments map[string]any) error {
			_, _, err := prepareCall(arguments)
			return err
		},
		Handle: func(ctx context.Context, call Call) (Result, error) {
			count, input, err := prepareCall(call.Arguments)
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
				config.SelectedTargetID,
				gateway,
				transport,
				call.OnOutput,
			)
			if err != nil {
				return Result{}, err
			}
			return Result{
				Text:    "能力“" + strings.TrimSpace(power.Name) + "”调用完成",
				Content: map[string]any(output),
			}, nil
		},
	}
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
	input := energonservice.ApplyPowerParamDefaults(
		energonservice.NormalizePowerParamInput(arguments, params),
		params,
	)
	missing := make([]string, 0)
	for _, param := range params {
		if !param.Required || !energoninput.IsMissing(input[param.Key]) {
			continue
		}
		name := strings.TrimSpace(param.Name)
		if name == "" {
			name = strings.TrimSpace(param.Key)
		}
		missing = append(missing, name)
	}
	if len(missing) > 0 {
		return nil, fmt.Errorf("缺少必填参数: %s", strings.Join(missing, "、"))
	}
	return input, nil
}

func executePower(ctx context.Context, requestID string, powerKey string, input map[string]any, targetID uint64, gateway energonservice.GatewayService, transport Transport, onOutput OutputHandler) (botprotocol.Output, error) {
	body := map[string]any{
		"power": powerKey,
		"input": input,
		"options": map[string]any{
			"stream": true,
		},
	}
	if targetID > 0 {
		body["source_target_id"] = targetID
	}
	response := gateway.Request(ctx, energonservice.GatewayRequest{
		RequestID: requestID,
		Method:    transport.Method,
		Host:      transport.Host,
		Path:      transport.Path,
		Headers:   transport.Headers,
		Body:      body,
	})
	payload := response.Payload()
	if int(frontstream.InputInt64(payload["status"], 0)) == botprotocol.ResponseStatusFail {
		return nil, fmt.Errorf("%s", powerErrorMessage(payload, "能力调用失败"))
	}
	if botstream.FrameType(payload) == botprotocol.ResponseTypeResult {
		return botstream.FrameOutput(payload), nil
	}

	collected := gateway.CollectStream(ctx, botstream.CollectOptions{
		RequestID:      requestID,
		InitialLastID:  "0-0",
		Block:          time.Second,
		CollectOutputs: true,
		OnOutput: func(_ context.Context, output botprotocol.Output) error {
			if onOutput == nil {
				return nil
			}
			if botprotocol.HasMediaOutput(output) {
				return nil
			}
			return onOutput(map[string]any(output))
		},
	})
	if collected.Err != nil {
		return nil, collected.Err
	}
	if int(frontstream.InputInt64(collected.Frame["status"], 0)) == botprotocol.ResponseStatusFail {
		return nil, fmt.Errorf("%s", powerErrorMessage(collected.Frame, "能力调用失败"))
	}
	output := botprotocol.MergeStreamFinal(
		collected.State.Outputs,
		botstream.FrameOutput(collected.Frame),
	)
	return output, nil
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

func powerErrorMessage(payload map[string]any, fallback string) string {
	output := botstream.FrameOutput(payload)
	for _, value := range []any{payload["msg"], output["error"], output["text"]} {
		if text := strings.TrimSpace(botprotocol.AsText(value)); text != "" {
			return text
		}
	}
	return fallback
}
