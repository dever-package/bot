package provider

import (
	"encoding/json"
	"fmt"
	"strings"

	energonmodel "github.com/dever-package/bot/model/energon"
	energonservice "github.com/dever-package/bot/service/energon"
	energoninput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	// The prepared plan is server-owned and persisted with asynchronous jobs.
	MediaReferencePlanArgument = "__runtime_reference_plan"
	MediaPreviousImageArgument = "__runtime_image_source"
)

// Remove model-authored identities and URLs before merging trusted form values.
func modelPowerArguments(arguments map[string]any, params []energonservice.PowerParam) map[string]any {
	result := cloneArguments(arguments)
	delete(result, MediaReferencesArgument)
	delete(result, MediaReferencePlanArgument)
	delete(result, MediaSourceTargetArgument)
	for _, param := range params {
		if energoninput.IsFileParamType(param.Type) {
			delete(result, param.Key)
		}
	}
	return result
}

func modelPowerParameters(parameters map[string]any, params []energonservice.PowerParam) map[string]any {
	hidden := map[string]any{MediaReferencesArgument: nil, MediaReferencePlanArgument: nil, MediaSourceTargetArgument: nil}
	for _, param := range params {
		if energoninput.IsFileParamType(param.Type) {
			hidden[param.Key] = nil
		}
	}
	return omitFixedPowerParameters(parameters, hidden)
}

func currentMediaReferences(references []MediaReference) []MediaReference {
	result := make([]MediaReference, 0, len(references))
	for _, reference := range references {
		if !reference.Historical {
			result = append(result, reference)
		}
	}
	return result
}

func hasImageReference(references []MediaReference) bool {
	for _, reference := range references {
		if reference.Kind == botprotocol.MediaTypeImage {
			return true
		}
	}
	return false
}

func videoReferenceParameters(power energonmodel.Power, parameters map[string]any, params []energonservice.PowerParam, references []MediaReference) map[string]any {
	_, previous := activeSeriesReference(references)
	if normalizedMediaPowerKind(power) != botprotocol.MediaTypeVideo || !previous || len(mediaReferenceParams(params, botprotocol.MediaTypeImage)) == 0 || hasImageReference(currentMediaReferences(references)) {
		return parameters
	}
	result := clonePowerParameters(parameters)
	properties := result["properties"].(map[string]any)
	properties[MediaPreviousImageArgument] = map[string]any{
		"type": "string", "enum": []any{"previous", "none"},
		"description": "用户要求将上一张图片制作成视频时选 previous；独立的新视频选 none。系统自动提供对应图片，无需填写图片地址。",
	}
	result["required"] = appendRequiredParameter(result["required"], MediaPreviousImageArgument)
	return result
}

func selectedMediaPlanReferences(arguments map[string]any, available []MediaReference) ([]MediaReference, error) {
	selected, err := SelectedMediaReferences(arguments, available)
	if err != nil {
		return nil, err
	}
	if len(selected) == 0 {
		selected = currentMediaReferences(available)
		for index := range selected {
			// 用户附件的用途属于智能体输入，目标能力重新决定接收参数。
			// 专用工具表单的显式绑定走上面的 SelectedMediaReferences。
			selected[index].ParameterKey = ""
		}
	}
	return selected, nil
}

// Plan once at the untrusted tool boundary. Validation, provider execution and
// artifact lineage all consume this prepared result without selecting again.
func prepareMediaReferencePlan(power energonmodel.Power, arguments map[string]any, params []energonservice.PowerParam, available []MediaReference) (map[string]any, error) {
	selected, err := selectedMediaPlanReferences(arguments, available)
	if err != nil {
		return nil, err
	}
	activeParams := energoninput.FilterActivePowerParams(params, arguments)
	var promptSource *MediaReference
	switch normalizedMediaPowerKind(power) {
	case botprotocol.MediaTypeImage:
		series := buildMediaSeriesPlan(power, activeParams, available)
		if !series.available() {
			delete(arguments, MediaSeriesModeArgument)
			break
		}
		mode := mediaSeriesMode(arguments)
		if mode != MediaSeriesModeContinue && mode != MediaSeriesModeNew {
			return nil, fmt.Errorf("请选择延续当前图片或开始新主题")
		}
		if mode == MediaSeriesModeContinue && !hasImageReference(selected) {
			if series.referenceParamKey != "" {
				reference := series.current
				reference.ParameterKey = series.referenceParamKey
				selected = append(selected, reference)
			} else {
				arguments, err = series.applyPrompt(arguments)
				if err != nil {
					return nil, err
				}
				promptSource = &series.current
			}
		}
	case botprotocol.MediaTypeVideo:
		previous, hasPrevious := activeSeriesReference(available)
		needsPreviousChoice := !hasImageReference(selected) && hasPrevious && len(mediaReferenceParams(activeParams, botprotocol.MediaTypeImage)) > 0
		if !needsPreviousChoice {
			delete(arguments, MediaPreviousImageArgument)
		} else {
			choice := strings.TrimSpace(textValue(arguments[MediaPreviousImageArgument]))
			switch choice {
			case "previous":
				selected = append(selected, previous)
			case "none":
			default:
				return nil, fmt.Errorf("请选择使用上一张图片或生成独立视频")
			}
		}
		selected = assignVideoImageUsage(selected, activeParams)
	default:
		delete(arguments, MediaSeriesModeArgument)
		delete(arguments, MediaPreviousImageArgument)
	}
	// The canonical binder owns compatibility, cardinality and URL projection.
	prepared := cloneArguments(arguments)
	delete(prepared, MediaReferencesArgument)
	bound, sources, err := ApplyMediaReferences(prepared, activeParams, selected)
	if err != nil {
		return nil, err
	}
	if kind := normalizedMediaPowerKind(power); kind == botprotocol.MediaTypeVideo || kind == botprotocol.MediaTypeImage {
		for _, reference := range selected {
			if reference.Kind != botprotocol.MediaTypeImage {
				continue
			}
			found := false
			for _, source := range sources {
				found = found || mediaReferenceItemKey(source) == mediaReferenceItemKey(reference)
			}
			if !found {
				return nil, fmt.Errorf("当前%s参考方式无法接收全部图片，请使用支持这些图片数量的参考方式", mediaPowerLabel(power))
			}
		}
	}
	if promptSource != nil {
		sources = append(sources, *promptSource)
	}
	if normalizedMediaPowerKind(power) == botprotocol.MediaTypeImage && mediaSeriesMode(bound) == MediaSeriesModeContinue && hasImageReference(sources) {
		if promptKey := mediaPromptParameterKey(activeParams); promptKey != "" {
			bound[promptKey] = imageContinuationPrompt(botprotocol.AsText(bound[promptKey]), promptSource == nil)
		}
	}
	bound[MediaReferencePlanArgument] = uniqueLogicalMediaReferences(sources)
	return bound, nil
}

// firstFrame/lastFrame/images are configured protocol keys, never labels or
// provider-specific fields. Explicit usage from the user form always wins.
func assignVideoImageUsage(references []MediaReference, params []energonservice.PowerParam) []MediaReference {
	imageParams := mediaReferenceParams(params, botprotocol.MediaTypeImage)
	keys := make(map[string]bool, len(imageParams))
	for _, param := range imageParams {
		keys[param.Key] = true
	}
	result := append([]MediaReference(nil), references...)
	frameIndex := 0
	for index, reference := range result {
		if reference.Kind != botprotocol.MediaTypeImage {
			continue
		}
		if reference.ParameterKey == "" {
			switch {
			case keys["firstFrame"] && frameIndex == 0:
				result[index].ParameterKey = "firstFrame"
			case keys["lastFrame"] && frameIndex == 1:
				result[index].ParameterKey = "lastFrame"
			case keys["images"]:
				result[index].ParameterKey = "images"
			}
		}
		frameIndex++
	}
	return result
}

// Decode only a server-prepared plan; model input is stripped before this key
// is written. JSON decoding also supports persisted job snapshots.
func preparedMediaReferences(arguments map[string]any) ([]MediaReference, error) {
	value, exists := arguments[MediaReferencePlanArgument]
	if !exists {
		return nil, nil
	}
	if references, ok := value.([]MediaReference); ok {
		return append([]MediaReference(nil), references...), nil
	}
	raw, err := json.Marshal(value)
	if err != nil {
		return nil, err
	}
	var references []MediaReference
	if err := json.Unmarshal(raw, &references); err != nil {
		return nil, fmt.Errorf("素材引用计划无效: %w", err)
	}
	return references, nil
}
