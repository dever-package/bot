package provider

import (
	"context"
	"fmt"
	"strings"
	"sync"

	"github.com/google/uuid"

	energonmodel "github.com/dever-package/bot/model/energon"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	mediaCountArgument = "__runtime_count"
	maxMediaCount      = 8
)

type mediaCountPlan struct {
	key       string
	promptKey string
}

type powerBatchResult struct {
	index  int
	output botprotocol.Output
	err    error
}

func buildMediaCountPlan(power energonmodel.Power, params []energonservice.PowerParam) mediaCountPlan {
	if !isMediaPower(power) {
		return mediaCountPlan{}
	}
	return mediaCountPlan{
		key:       mediaCountArgument,
		promptKey: mediaPromptParameterKey(params),
	}
}

func mediaPromptParameterKey(params []energonservice.PowerParam) string {
	for _, param := range params {
		if param.IsToolbar() || !strings.EqualFold(strings.TrimSpace(param.ValueType), "string") {
			continue
		}
		switch strings.ToLower(strings.TrimSpace(param.Type)) {
		case "text", "textarea", "input":
			return strings.TrimSpace(param.Key)
		}
	}
	return ""
}

func mediaToolParameters(parameters map[string]any, plan mediaCountPlan) map[string]any {
	if plan.key == "" {
		return parameters
	}
	result := clonePowerParameters(parameters)
	properties, _ := result["properties"].(map[string]any)
	properties[plan.key] = map[string]any{
		"type":        "integer",
		"description": "生成独立结果的数量。用户要求几个就填写几，范围 1-8；每个结果必须是单独的素材或文件，不能合并为一个结果。",
		"minimum":     1,
		"maximum":     maxMediaCount,
	}
	result["properties"] = properties
	result["required"] = appendRequiredParameter(result["required"], plan.key)
	return result
}

func clonePowerParameters(parameters map[string]any) map[string]any {
	result := make(map[string]any, len(parameters)+1)
	for key, value := range parameters {
		result[key] = value
	}
	properties := map[string]any{}
	if current, ok := parameters["properties"].(map[string]any); ok {
		for key, value := range current {
			properties[key] = value
		}
	}
	result["properties"] = properties
	return result
}

func appendRequiredParameter(value any, key string) []any {
	result := make([]any, 0)
	switch current := value.(type) {
	case []any:
		result = append(result, current...)
	case []string:
		for _, item := range current {
			result = append(result, item)
		}
	}
	for _, item := range result {
		if strings.TrimSpace(fmt.Sprint(item)) == key {
			return result
		}
	}
	return append(result, key)
}

func mediaExecutionCount(power energonmodel.Power, arguments map[string]any, plan mediaCountPlan) (int, error) {
	if plan.key == "" {
		return 1, nil
	}
	if _, exists := arguments[plan.key]; !exists {
		return 0, fmt.Errorf("%s生成参数 %s 不能为空", mediaPowerLabel(power), plan.key)
	}
	count := ArgumentInt(arguments, plan.key, 0)
	if count < 1 || count > maxMediaCount {
		return 0, fmt.Errorf("%s生成参数 %s 必须在 1-%d 之间", mediaPowerLabel(power), plan.key, maxMediaCount)
	}
	return count, nil
}

func mediaProviderArguments(arguments map[string]any, plan mediaCountPlan) map[string]any {
	result := make(map[string]any, len(arguments))
	for key, value := range arguments {
		if key == MediaReferencesArgument {
			continue
		}
		if plan.key != "" && key == plan.key {
			continue
		}
		result[key] = value
	}
	return result
}

func executeMediaPower(
	ctx context.Context,
	power energonmodel.Power,
	count int,
	promptKey string,
	requestID string,
	input map[string]any,
	targetID uint64,
	gateway energonservice.GatewayService,
	transport Transport,
	onOutput OutputHandler,
) (botprotocol.Output, error) {
	if count <= 1 {
		return executePower(ctx, requestID, power.Key, input, targetID, gateway, transport, onOutput)
	}

	batchCtx, cancel := context.WithCancel(ctx)
	defer cancel()
	results := make(chan powerBatchResult, count)
	serializedOutput := serializeOutputHandler(onOutput)
	for index := 0; index < count; index++ {
		go func(index int) {
			currentInput := mediaVariantInput(power, input, promptKey, index, count)
			output, err := executePower(batchCtx, uuid.NewString(), power.Key, currentInput, targetID, gateway, transport, serializedOutput)
			results <- powerBatchResult{index: index, output: output, err: err}
		}(index)
	}

	outputs := make([]botprotocol.Output, count)
	var firstErr error
	for index := 0; index < count; index++ {
		result := <-results
		if result.err != nil {
			if firstErr == nil {
				firstErr = result.err
				cancel()
			}
			continue
		}
		outputs[result.index] = result.output
	}
	if firstErr != nil {
		return nil, firstErr
	}
	return botprotocol.MergeStreamResult(outputs), nil
}

func serializeOutputHandler(handler OutputHandler) OutputHandler {
	if handler == nil {
		return nil
	}
	var mutex sync.Mutex
	return func(output map[string]any) error {
		mutex.Lock()
		defer mutex.Unlock()
		return handler(output)
	}
}

func mediaVariantInput(power energonmodel.Power, input map[string]any, promptKey string, index int, count int) map[string]any {
	result := make(map[string]any, len(input))
	for key, value := range input {
		result[key] = value
	}
	if promptKey == "" {
		return result
	}
	basePrompt := strings.TrimSpace(botprotocol.AsText(result[promptKey]))
	result[promptKey] = basePrompt + "\n\n" + mediaVariantInstruction(power, index, count)
	return result
}

func mediaVariantInstruction(power energonmodel.Power, index int, count int) string {
	prefix := fmt.Sprintf(
		"本次只生成第 %d/%d 个独立%s。与同批其他结果保持用户要求的主题、风格和格式一致，但内容细节需要有合理差异。",
		index+1,
		count,
		mediaPowerLabel(power),
	)
	switch normalizedMediaPowerKind(power) {
	case botprotocol.MediaTypeImage:
		return prefix + "画面只能是一张完整图片，禁止拼图、宫格、分镜、对比图或多联画。"
	case botprotocol.MediaTypeVideo:
		return prefix + "结果只能是一段完整视频，禁止分屏、视频合集或把多个版本拼接在同一视频中。"
	case botprotocol.MediaTypeAudio:
		return prefix + "结果只能是一段完整音频，禁止串烧、合集或把多个版本拼接在同一音频中。"
	case botprotocol.MediaTypeFile:
		return prefix + "结果只能是一个完整文件，禁止压缩包、文件合集或在同一文件中合并多个版本。"
	default:
		return prefix
	}
}

func isMediaPower(power energonmodel.Power) bool {
	switch normalizedMediaPowerKind(power) {
	case botprotocol.MediaTypeImage, botprotocol.MediaTypeVideo, botprotocol.MediaTypeAudio, botprotocol.MediaTypeFile:
		return true
	default:
		return false
	}
}

func normalizedMediaPowerKind(power energonmodel.Power) string {
	return strings.ToLower(strings.TrimSpace(power.Kind))
}

func mediaPowerLabel(power energonmodel.Power) string {
	return botprotocol.MediaOutputLabel(normalizedMediaPowerKind(power))
}
