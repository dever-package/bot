package input

import (
	"strings"

	botprotocol "my/package/bot/service/energon/protocol"
)

func applyPromptMappedParams(mapped *botprotocol.MappedInput) {
	if mapped == nil || len(mapped.Params) == 0 {
		return
	}

	prompt := mapped.PrimaryPrompt()
	if strings.TrimSpace(prompt) == "" {
		return
	}

	for index := range mapped.Params {
		if !isPromptMappedParam(mapped.Params[index]) {
			continue
		}
		value, ok := promptMappedParamInput(prompt, mapped.Params[index].Value)
		if !ok {
			continue
		}
		mapped.Params[index].Value = value
	}
}

func promptMappedParamInput(prompt string, value any) (any, bool) {
	switch current := value.(type) {
	case string:
		if strings.TrimSpace(current) == "" {
			return prompt, true
		}
		return current, false
	case map[string]any:
		next := map[string]any{}
		for key, item := range current {
			next[key] = item
		}
		for _, key := range []string{"prompt", "text", "content", "input"} {
			if existing, ok := next[key]; ok && !isMissingInputValue(existing) {
				return current, false
			}
			if _, ok := next[key]; ok {
				next[key] = prompt
				return next, true
			}
		}
		next["prompt"] = prompt
		return next, true
	default:
		if isMissingInputValue(current) {
			return prompt, true
		}
		return current, false
	}
}

func isPromptMappedParam(param botprotocol.MappedParam) bool {
	key := strings.ToLower(lastNativeKeySegment(param.NativeKey))
	switch key {
	case "prompt", "text", "content", "input":
		return true
	default:
		return false
	}
}

func lastNativeKeySegment(key string) string {
	key = strings.TrimSpace(key)
	if key == "" {
		return ""
	}
	parts := strings.Split(key, ".")
	return strings.TrimSpace(parts[len(parts)-1])
}
