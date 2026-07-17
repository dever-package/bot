package provider

import (
	"context"
	"fmt"
	"strings"
	"sync"

	"github.com/google/uuid"

	energonmodel "github.com/dever-package/bot/model/energon"
	runtimeasync "github.com/dever-package/bot/service/agent/runtime/async"
	energonservice "github.com/dever-package/bot/service/energon"
	energoninput "github.com/dever-package/bot/service/energon/input"
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

type mediaSeriesPlan struct {
	current           MediaReference
	promptKey         string
	referenceParamKey string
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

func buildMediaSeriesPlan(power energonmodel.Power, params []energonservice.PowerParam, references []MediaReference) mediaSeriesPlan {
	if normalizedMediaPowerKind(power) != botprotocol.MediaTypeImage {
		return mediaSeriesPlan{}
	}
	current, exists := activeSeriesReference(references)
	if !exists {
		return mediaSeriesPlan{}
	}
	plan := mediaSeriesPlan{
		current:   current,
		promptKey: mediaPromptParameterKey(params),
	}
	if strings.TrimSpace(current.URL) != "" {
		referenceParams := mediaReferenceParams(params, botprotocol.MediaTypeImage)
		if len(referenceParams) > 0 {
			plan.referenceParamKey = strings.TrimSpace(referenceParams[0].Key)
		}
	}
	return plan
}

func mediaPromptParameterKey(params []energonservice.PowerParam) string {
	for _, param := range params {
		if !energoninput.IsPromptParamType(param.Type) {
			continue
		}
		if key := strings.TrimSpace(param.Key); key != "" {
			return key
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
		"description": "生成独立结果的数量",
		"minimum":     1,
		"maximum":     maxMediaCount,
	}
	result["properties"] = properties
	result["required"] = appendRequiredParameter(result["required"], plan.key)
	return result
}

func mediaSeriesParameters(parameters map[string]any, plan mediaSeriesPlan) map[string]any {
	if !plan.available() {
		return parameters
	}
	result := clonePowerParameters(parameters)
	properties, _ := result["properties"].(map[string]any)
	properties[MediaSeriesModeArgument] = map[string]any{
		"type":        "string",
		"description": "延续当前图片系列时选择 continue；开始无关的新图片主题时选择 new",
		"enum":        []any{MediaSeriesModeContinue, MediaSeriesModeNew},
	}
	result["properties"] = properties
	result["required"] = appendRequiredParameter(result["required"], MediaSeriesModeArgument)
	return result
}

func (plan mediaSeriesPlan) available() bool {
	return plan.current.ActiveSeries && plan.current.SeriesID > 0 && plan.current.ArtifactID > 0
}

func (plan mediaSeriesPlan) description() string {
	if !plan.available() {
		return ""
	}
	return "。当前会话已有图片系列；用户要求延续、修改或补充上一组时，系列模式必须选择 continue；开始无关的新图片主题时选择 new。"
}

func (plan mediaSeriesPlan) apply(arguments map[string]any) (map[string]any, error) {
	if !plan.available() {
		return arguments, nil
	}
	mode := mediaSeriesMode(arguments)
	switch mode {
	case MediaSeriesModeNew:
		if requestedMediaReference(arguments, plan.current) {
			return nil, fmt.Errorf("新图片系列不能同时引用当前系列主素材")
		}
		return arguments, nil
	case MediaSeriesModeContinue:
		result := cloneArguments(arguments)
		if plan.referenceParamKey != "" {
			result[MediaReferencesArgument] = appendMediaReferenceSelection(
				result[MediaReferencesArgument],
				plan.current,
				plan.referenceParamKey,
			)
			return result, nil
		}
		if plan.promptKey == "" {
			return nil, fmt.Errorf("当前图片能力无法延续系列风格")
		}
		currentPrompt := strings.TrimSpace(botprotocol.AsText(result[plan.promptKey]))
		profilePrompt := strings.TrimSpace(botprotocol.AsText(plan.current.SeriesProfile[plan.promptKey]))
		if profilePrompt == "" {
			profilePrompt = strings.TrimSpace(botprotocol.AsText(plan.current.SeriesProfile["prompt"]))
		}
		result[plan.promptKey] = continueSeriesPrompt(currentPrompt, profilePrompt)
		return result, nil
	default:
		return nil, fmt.Errorf("已有图片系列时必须选择 series mode: continue 或 new")
	}
}

func requestedMediaReference(arguments map[string]any, target MediaReference) bool {
	for _, item := range mapListArgument(arguments[MediaReferencesArgument]) {
		if strings.EqualFold(strings.TrimSpace(textValue(item["ref_type"])), target.ReferenceType) &&
			ArgumentUint64(item, "ref_id") == target.ReferenceID {
			return true
		}
	}
	return false
}

func appendMediaReferenceSelection(value any, reference MediaReference, parameterKey string) []map[string]any {
	items := append([]map[string]any(nil), mapListArgument(value)...)
	for _, item := range items {
		if strings.EqualFold(strings.TrimSpace(textValue(item["ref_type"])), reference.ReferenceType) &&
			ArgumentUint64(item, "ref_id") == reference.ReferenceID &&
			strings.TrimSpace(textValue(item["param_key"])) == parameterKey {
			return items
		}
	}
	return append(items, map[string]any{
		"ref_type":  reference.ReferenceType,
		"ref_id":    reference.ReferenceID,
		"param_key": parameterKey,
	})
}

func continueSeriesPrompt(current string, profile string) string {
	current = strings.TrimSpace(current)
	profile = strings.TrimSpace(profile)
	if current == "" || profile == "" || current == profile {
		return current
	}
	return current + "\n\n系列视觉基准（只继承风格、色彩、光线、质感和构图语言，场景与内容以本次要求为准）：\n" + profile
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
		if key == MediaReferencesArgument || key == MediaSeriesModeArgument {
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
	serializedOutput := serializeOutputHandler(onOutput)
	outputs := make([]botprotocol.Output, count)
	var resultMutex sync.Mutex
	var firstErr error
	var group runtimeasync.Group
	for index := 0; index < count; index++ {
		currentIndex := index
		group.Go("并行生成素材", func() error {
			currentInput := mediaVariantInput(power, input, promptKey, currentIndex, count)
			output, err := executePower(batchCtx, uuid.NewString(), power.Key, currentInput, targetID, gateway, transport, serializedOutput)
			if err != nil {
				resultMutex.Lock()
				if firstErr == nil {
					firstErr = err
					cancel()
				}
				resultMutex.Unlock()
				return err
			}
			outputs[currentIndex] = output
			return nil
		})
	}
	if err := group.Wait(); firstErr == nil {
		firstErr = err
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
