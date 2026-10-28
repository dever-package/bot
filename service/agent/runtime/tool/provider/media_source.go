package provider

import (
	"fmt"
	"strings"

	energonmodel "github.com/dever-package/bot/model/energon"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const MediaSourceTargetArgument = "__runtime_source_target_id"

// 来源合同由当前挂载请求读取；引用选择仍由同一媒体计划负责。
type PowerTargetAccess struct {
	Config   func(uint64) (energonservice.PowerParamConfig, error)
	Validate func(uint64, map[string]any) error
}

func prepareMediaSource(
	power energonmodel.Power,
	config energonservice.PowerParamConfig,
	prepareArguments func([]energonservice.PowerParam) map[string]any,
	references []MediaReference,
	targets PowerTargetAccess,
) (map[string]any, error) {
	arguments := prepareArguments(config.Params)
	kind := normalizedMediaPowerKind(power)
	if config.SelectedTargetID > 0 || kind != botprotocol.MediaTypeImage && kind != botprotocol.MediaTypeVideo {
		return prepareMediaReferencePlan(power, arguments, config.Params, references)
	}
	selected, err := selectedMediaPlanReferences(arguments, references)
	if err != nil {
		return nil, err
	}
	series := buildMediaSeriesPlan(power, config.Params, references)
	continuesImage := series.available() && mediaSeriesMode(arguments) == MediaSeriesModeContinue
	continuesVideo := kind == botprotocol.MediaTypeVideo && strings.TrimSpace(textValue(arguments[MediaPreviousImageArgument])) == "previous"
	if !hasImageReference(selected) && !continuesImage && !continuesVideo {
		return prepareMediaReferencePlan(power, arguments, config.Params, references)
	}
	if targets.Config == nil || targets.Validate == nil {
		return nil, fmt.Errorf("%s来源合同未配置", mediaPowerLabel(power))
	}
	var reasons []string
	for _, source := range config.Sources {
		prepared, err := prepareMediaSourceCandidate(power, source.TargetID, prepareArguments, references, targets)
		if err != nil {
			reasons = append(reasons, source.Name+"："+err.Error())
			continue
		}
		prepared[MediaSourceTargetArgument] = source.TargetID
		return prepared, nil
	}
	return nil, fmt.Errorf("当前没有可接收参考图片的来源：%s", strings.Join(reasons, "；"))
}

func prepareMediaSourceCandidate(power energonmodel.Power, targetID uint64, prepareArguments func([]energonservice.PowerParam) map[string]any, references []MediaReference, targets PowerTargetAccess) (map[string]any, error) {
	config, err := targets.Config(targetID)
	if err != nil {
		return nil, err
	}
	// 无图片输入的来源不能用文字回退冒充图生图；绑定键只从本来源合同选择。
	if len(mediaReferenceParams(config.Params, botprotocol.MediaTypeImage)) == 0 {
		return nil, fmt.Errorf("不支持图片输入")
	}
	prepared, err := prepareMediaReferencePlan(power, prepareArguments(config.Params), config.Params, references)
	if err != nil {
		return nil, err
	}
	bound, err := preparedMediaReferences(prepared)
	if err != nil {
		return nil, err
	}
	hasBoundImage := false
	for _, reference := range bound {
		hasBoundImage = hasBoundImage || reference.Kind == botprotocol.MediaTypeImage && reference.ParameterKey != ""
	}
	if !hasBoundImage {
		return nil, fmt.Errorf("当前参数未启用图片输入")
	}
	input, err := preparePowerInput(mediaProviderArguments(prepared, buildMediaCountPlan(power, config.Params)), config.Params)
	if err != nil {
		return nil, err
	}
	for key, value := range input {
		prepared[key] = value
	}
	if err := targets.Validate(targetID, mediaProviderArguments(prepared, buildMediaCountPlan(power, config.Params))); err != nil {
		return nil, err
	}
	return prepared, nil
}
