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
	MediaArtifactTitleArgument = "__runtime_artifact_title"
	mediaCountArgument         = "__runtime_count"
	MaxMediaExecutionCount     = 8
	mediaArtifactTitleMaxRunes = 16
)

type mediaCountPlan struct {
	key       string
	promptKey string
	maximum   int
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
		maximum:   mediaCountLimit(power),
	}
}

func mediaCountLimit(power energonmodel.Power) int {
	if energonmodel.IsLipSyncPower(power) {
		return 1
	}
	return MaxMediaExecutionCount
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
	properties[MediaArtifactTitleArgument] = map[string]any{
		"type":        "string",
		"description": "本次生成素材的简短中文标题，要求6到16个汉字，不含序号、扩展名或解释",
	}
	properties[plan.key] = map[string]any{
		"type":        "integer",
		"description": "生成独立结果的数量；未填写时默认生成 1 个",
		"minimum":     1,
		"maximum":     plan.maximum,
		"default":     1,
	}
	result["properties"] = properties
	result["required"] = appendRequiredParameter(result["required"], MediaArtifactTitleArgument)
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
	return "。当前会话已有成功图片；延续或修改已有画面时选择 continue，系统自动参考最近成功图片。本次 prompt 只描述用户要求改变的内容，不得自行重设主体外貌、服装或物品；未要求改变的细节沿用参考图。明确开始无关的新主题时选择 new。本轮用户提供的图片优先。"
}

func (plan mediaSeriesPlan) applyPrompt(arguments map[string]any) (map[string]any, error) {
	if plan.promptKey == "" {
		return nil, fmt.Errorf("当前图片能力无法延续系列风格")
	}
	result := cloneArguments(arguments)
	currentPrompt := strings.TrimSpace(botprotocol.AsText(result[plan.promptKey]))
	profilePrompt := strings.TrimSpace(botprotocol.AsText(plan.current.SeriesProfile[plan.promptKey]))
	if profilePrompt == "" {
		profilePrompt = strings.TrimSpace(botprotocol.AsText(plan.current.SeriesProfile["prompt"]))
	}
	result[plan.promptKey] = continueSeriesPrompt(currentPrompt, profilePrompt)
	return result, nil
}

func continueSeriesPrompt(current string, profile string) string {
	current = strings.TrimSpace(current)
	profile = strings.TrimSpace(profile)
	if current == "" || profile == "" || current == profile {
		return current
	}
	addition := "\n\n上一张图片的文字基准（未要求改变的主体和视觉特征沿用；明确修改的部分以本次要求为准）：\n" + profile
	if strings.HasSuffix(current, addition) {
		return current
	}
	return current + addition
}

func imageContinuationPrompt(prompt string, hasReferenceImage bool) string {
	baseline := "以上一张图片的文字基准为依据"
	if hasReferenceImage {
		baseline = "以本次实际输入的参考图为视觉基准，不能只借用其风格"
	}
	return strings.TrimSpace(prompt) + "\n\n连续画面要求：" + baseline + "。仅改变本次明确要求的部分；其余主体身份、面貌、发型、服装款式与颜色、配饰、物品外形及相对尺寸保持一致，不自行换装或增添物品。用户明确要求更换的要素按本次要求修改。"
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

func appendRequiredParameter(value any, keys ...string) []any {
	result := make([]any, 0)
	switch current := value.(type) {
	case []any:
		result = append(result, current...)
	case []string:
		for _, item := range current {
			result = append(result, item)
		}
	}
	for _, key := range keys {
		exists := false
		for _, item := range result {
			if strings.TrimSpace(fmt.Sprint(item)) == key {
				exists = true
				break
			}
		}
		if !exists {
			result = append(result, key)
		}
	}
	return result
}

func mediaExecutionCount(power energonmodel.Power, arguments map[string]any, plan mediaCountPlan) (int, error) {
	if plan.key == "" {
		return 1, nil
	}
	value, exists := arguments[plan.key]
	if !exists || energoninput.IsMissing(value) {
		return 1, nil
	}
	count := ArgumentInt(arguments, plan.key, 0)
	if count < 1 || count > plan.maximum {
		return 0, fmt.Errorf("%s生成参数 %s 必须在 1-%d 之间", mediaPowerLabel(power), plan.key, plan.maximum)
	}
	return count, nil
}

func MediaArtifactTitle(arguments map[string]any) string {
	return energonservice.NormalizeShortTitle(
		botprotocol.AsText(arguments[MediaArtifactTitleArgument]),
		mediaArtifactTitleMaxRunes,
	)
}

func validateMediaArtifactTitle(power energonmodel.Power, arguments map[string]any) error {
	if !isMediaPower(power) || MediaArtifactTitle(arguments) != "" {
		return nil
	}
	return fmt.Errorf("%s生成参数 %s 不能为空", mediaPowerLabel(power), MediaArtifactTitleArgument)
}

func mediaProviderArguments(arguments map[string]any, plan mediaCountPlan) map[string]any {
	result := make(map[string]any, len(arguments))
	for key, value := range arguments {
		if key == MediaReferencesArgument || key == MediaReferencePlanArgument || key == MediaSourceTargetArgument || key == MediaPreviousImageArgument || key == MediaSeriesModeArgument || key == MediaArtifactTitleArgument {
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
	history []any,
	targetID uint64,
	gateway energonservice.GatewayService,
	transport Transport,
	billing botprotocol.BillingContext,
	onOutput OutputHandler,
) (botprotocol.Output, error) {
	if count <= 1 {
		return executePower(ctx, requestID, power, input, history, targetID, gateway, transport, billing, onOutput)
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
			childRequestID := uuid.NewSHA1(
				uuid.NameSpaceOID,
				[]byte(fmt.Sprintf("media:%s:%d", requestID, currentIndex)),
			).String()
			output, err := executePower(batchCtx, childRequestID, power, currentInput, history, targetID, gateway, transport, billing, serializedOutput)
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
		return fmt.Sprintf("本次只生成第 %d/%d 张独立图片。若要求中列出了逐张安排，只执行对应序号的画面；否则仅在允许的动作、视角或构图上变化。各张共用的主体身份、外貌、服装和物品保持一致，除非本次明确要求改变。画面只能是一张完整图片，禁止拼图、宫格、分镜、对比图或多联画。", index+1, count)
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
