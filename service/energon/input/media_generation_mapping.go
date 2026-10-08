package input

import (
	"context"
	"sort"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func compileMappedMediaGenerationPrompt(mapped *botprotocol.MappedInput, fileValues map[int]any, target Target, context *botprotocol.MediaReferencePromptContext) {
	if context == nil || (target.Kind != "image" && target.Kind != "video") {
		return
	}
	references := MediaReferencesFromPromptMetadata(context.References)
	inputs := mappedMediaInputReferences(mapped.Params, fileValues, target.MediaParams, references)
	compile := func(prompt string) string {
		return CompileMediaGenerationPrompt(prompt, target.Kind, inputs, context)
	}
	for index, param := range mapped.Params {
		if !param.IsPrompt() {
			continue
		}
		mapped.Params[index].Value = compileMediaPromptValue(param.Value, compile)
		for _, key := range append(param.InputKeys(), param.ParamKey) {
			if value, exists := mapped.Original[key]; exists {
				if original, ok := value.(string); ok && original == param.Value {
					mapped.Original[key] = compile(original)
				}
			}
		}
	}
	if prompt, exists := mapped.Original["prompt"]; exists {
		mapped.Original["prompt"] = compileMediaPromptValue(prompt, compile)
	}
}

func compileMediaPromptValue(value any, compile func(string) string) any {
	switch current := value.(type) {
	case string:
		return compile(current)
	case map[string]any:
		result := cloneMediaReferenceValues(current)
		for _, key := range []string{"prompt", "text", "content", "input"} {
			if text, ok := current[key].(string); ok {
				result[key] = compile(text)
			}
		}
		return result
	default:
		return value
	}
}

// 把原始文件值投影为引用标记，复用 NativeBody 的数组位置、区间和覆盖语义。
// 此投影仅用于排号，不会传给上游或修改真实映射值。
func mappedMediaInputReferences(mapped []botprotocol.MappedParam, fileValues map[int]any, mediaParams []PowerParam, references []MediaReference) []MediaReference {
	projected := append([]botprotocol.MappedParam(nil), mapped...)
	order := 0
	for index, param := range projected {
		value, exists := fileValues[index]
		if !exists {
			continue
		}
		mediaParam := PowerParam{Key: param.ParamKey, Type: param.ParamType}
		for _, configured := range mediaParams {
			if configured.ParamID == param.ParamID {
				mediaParam.AcceptedKinds = configured.AcceptedKinds
				break
			}
		}
		markers := []any{}
		for _, url := range StringList(value) {
			reference := MediaReference{URL: url}
			if matched := mediaInputReferences([]string{url}, mediaParam, references); len(matched) > 0 {
				reference = matched[0]
			}
			markers = append(markers, mappedMediaReference{Reference: reference, Order: order})
			order++
		}
		switch value.(type) {
		case []string, []any:
			projected[index].Value = markers
		default:
			if len(markers) > 0 {
				projected[index].Value = markers[0]
			}
		}
	}
	body := (botprotocol.MappedInput{Params: projected}).NativeBody()
	ordered := nativeMediaReferenceOrder(body)
	result := make([]MediaReference, 0, len(ordered))
	for _, marker := range ordered {
		result = append(result, marker.Reference)
	}
	return result
}

type mappedMediaReference struct {
	Reference MediaReference
	Order     int
}

func nativeMediaReferenceOrder(value any) []mappedMediaReference {
	switch current := value.(type) {
	case mappedMediaReference:
		return []mappedMediaReference{current}
	case []any:
		var result []mappedMediaReference
		for _, item := range current {
			result = append(result, nativeMediaReferenceOrder(item)...)
		}
		return result
	case map[string]any:
		type group struct {
			references []mappedMediaReference
			order      int
		}
		groups := []group{}
		for _, item := range current {
			references := nativeMediaReferenceOrder(item)
			if len(references) == 0 {
				continue
			}
			order := references[0].Order
			for _, reference := range references {
				if reference.Order < order {
					order = reference.Order
				}
			}
			groups = append(groups, group{references: references, order: order})
		}
		sort.Slice(groups, func(i, j int) bool { return groups[i].order < groups[j].order })
		var result []mappedMediaReference
		for _, group := range groups {
			result = append(result, group.references...)
		}
		return result
	default:
		return nil
	}
}

// 仅为已经绑定媒体的生成请求准备缺失提示词，随后仍执行原有必填和容量校验。
func prepareMediaGenerationPromptInput(ctx context.Context, repo Repository, req *botprotocol.ShemicRequest, target Target, values map[string]any, params map[uint64]botmodel.Param) map[string]any {
	if req.MediaReferencePrompt == nil || (target.Kind != "image" && target.Kind != "video") {
		return values
	}
	mediaValues, mediaParams := NormalizeImageSequenceMediaInput(ctx, repo, target, values, target.MediaParams)
	references := MediaReferencesFromPromptMetadata(req.MediaReferencePrompt.References)
	if len(imageSequenceInputReferences(mediaValues, mediaParams, references)) == 0 {
		return values
	}
	prompt := botprotocol.AsText(values["prompt"])
	if mediaReferencePromptBody(prompt) == "" {
		prompt = mediaGenerationInstruction(target.Kind)
	}
	result := cloneMediaReferenceValues(values)
	for paramID, keys := range mediaPromptInputKeys(ctx, repo, target, params) {
		populated := false
		for _, key := range keys {
			if value, exists := result[key]; exists && !IsMissing(value) {
				populated = true
				break
			}
		}
		if populated {
			continue
		}
		for _, key := range keys {
			if _, exists := result[key]; exists {
				result[key] = prompt
			}
		}
		if key := strings.TrimSpace(params[paramID].Key); key != "" {
			result[key] = prompt
		}
	}
	return result
}
