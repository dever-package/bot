package protocol

import (
	"fmt"
	"math"
	"strconv"
	"strings"
)

const (
	SetPromptOwnerKey                   = "prompt_owner"
	PromptOwnerAgentRuntime             = "agent_runtime"
	OptionImageSequenceMode             = "image_sequence_mode"
	OptionImageSequenceMinImages        = "image_sequence_min_images"
	OptionImageSequenceMaxImages        = "image_sequence_max_images"
	OptionImageSequenceFrames           = "image_sequence_frames"
	OptionImageSequenceMediaReferences  = "image_sequence_media_references"
	OptionMediaReferencePromptContent   = "media_reference_prompt_content"
	OptionImageSequenceFixedConstraints = "image_sequence_fixed_constraints"
	ImageSequenceModeAuto               = "auto"
	ImageSequenceModeSingle             = "single"
	ImageSequenceModeFrames             = "frames"
	ImageSequenceModeReferences         = "references"
)

type ImageSequenceRange struct {
	MinImages int
	MaxImages int
}

func NormalizeImageSequenceRange(options map[string]any, defaultMin int, defaultMax int) (ImageSequenceRange, error) {
	if defaultMin < 1 || defaultMax < defaultMin {
		return ImageSequenceRange{}, fmt.Errorf("图片序列默认数量范围无效")
	}
	result := ImageSequenceRange{MinImages: defaultMin, MaxImages: defaultMax}
	for key, target := range map[string]*int{
		OptionImageSequenceMinImages: &result.MinImages,
		OptionImageSequenceMaxImages: &result.MaxImages,
	} {
		value, exists := options[key]
		if !exists {
			continue
		}
		parsed, ok := imageSequenceOptionInteger(value)
		if !ok {
			return ImageSequenceRange{}, fmt.Errorf("图片序列数量必须是整数")
		}
		*target = parsed
	}
	if result.MinImages < defaultMin || result.MaxImages > defaultMax || result.MinImages > result.MaxImages {
		return ImageSequenceRange{}, fmt.Errorf("图片序列数量必须在 %d～%d 张之间", defaultMin, defaultMax)
	}
	return result, nil
}

func imageSequenceOptionInteger(value any) (int, bool) {
	number, err := strconv.ParseFloat(strings.TrimSpace(asText(value)), 64)
	if err != nil || math.IsNaN(number) || math.IsInf(number, 0) || math.Trunc(number) != number {
		return 0, false
	}
	return int(number), true
}

type RequestParts struct {
	Set     map[string]any
	Input   map[string]any
	History []any
	Options map[string]any
}

func NormalizeRequestParts(body map[string]any) RequestParts {
	return RequestParts{
		Set:     normalizeBodyMap(body, "set"),
		Input:   normalizeBodyMap(body, "input"),
		History: normalizeAnyList(body["history"]),
		Options: normalizeBodyMap(body, "options"),
	}
}

func normalizeRequestParts(body map[string]any) RequestParts {
	return NormalizeRequestParts(body)
}

func normalizeBodyMap(body map[string]any, key string) map[string]any {
	if body == nil {
		return map[string]any{}
	}
	if mapped := normalizeMap(body[key]); mapped != nil {
		return mapped
	}
	return map[string]any{}
}

func cloneBody(body map[string]any) map[string]any {
	result := make(map[string]any, len(body))
	for key, value := range body {
		result[key] = value
	}
	return result
}

func NormalizeRequestBody(body map[string]any) map[string]any {
	next := cloneBody(body)
	if next == nil {
		next = map[string]any{}
	}

	if strings.TrimSpace(asText(next["mode"])) == "" {
		next["mode"] = "normalize"
	}

	options := normalizeMap(next["options"])
	if options == nil {
		options = map[string]any{}
		next["options"] = options
	}
	if input := normalizeMap(next["input"]); input == nil {
		next["input"] = map[string]any{}
	}

	power := strings.TrimSpace(asText(next["power"]))
	if power != "" {
		next["power"] = power
	}

	protocol := strings.ToLower(strings.TrimSpace(asText(next["protocol"])))
	if protocol == "shemic" {
		if strings.TrimSpace(asText(next["name"])) == "" && power != "" {
			next["name"] = power
		}
		if strings.TrimSpace(asText(next["kind"])) == "" {
			next["kind"] = "llm.chat"
		}
		return next
	}

	if messages := BuildOpenAIMessages(next); len(messages) > 0 {
		next["messages"] = messages
	} else {
		delete(next, "messages")
	}
	for key, value := range options {
		if _, exists := next[key]; !exists {
			next[key] = value
		}
	}
	return next
}

func IsStreamEnabled(body map[string]any) bool {
	if body == nil {
		return false
	}
	options := normalizeMap(body["options"])
	return isTruthy(options["stream"])
}
