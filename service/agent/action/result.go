package action

import (
	"strings"

	botprotocol "my/package/bot/service/energon/protocol"
)

const (
	KindFinal = "final_result"
	KindTool  = "tool_result"
)

func ExtractAgentResult(text string) (string, map[string]any, bool) {
	return extractJSONFence(text, []string{"agent-result", "agent-output"}, validAgentResult)
}

func validAgentResult(result map[string]any) bool {
	if len(result) == 0 {
		return false
	}
	kind := normalizeResultKind(firstText(result["kind"], result["type"], result["event"]))
	if kind == KindFinal || kind == KindTool {
		return true
	}
	if _, ok := result["suggestions"]; ok {
		return true
	}
	if _, ok := result["content"]; ok {
		return true
	}
	if hasResultOutputField(result) || hasResultOutputField(normalizeMap(result["content"])) {
		return true
	}
	return strings.TrimSpace(firstText(result["text"])) != ""
}

func ApplyAgentResult(output map[string]any, result map[string]any, fallbackText string) map[string]any {
	next := cloneMap(output)
	kind := normalizeResultKind(firstText(result["kind"], result["type"], result["event"]))
	if kind == "" {
		kind = KindFinal
	}
	next["kind"] = kind
	next["event"] = "final"

	if content, exists := result["content"]; exists {
		next["content"] = content
	}
	contentMap := normalizeMap(result["content"])
	copyResultOutputFields(next, contentMap)
	copyResultOutputFields(next, result)
	if text := agentResultText(result); text != "" {
		next["text"] = text
	} else if strings.TrimSpace(fallbackText) != "" {
		next["text"] = strings.TrimSpace(fallbackText)
	}
	if suggestions := NormalizeSuggestions(result["suggestions"]); len(suggestions) > 0 {
		next["suggestions"] = suggestions
	}
	delete(next, "reasoning")
	return next
}

var resultMediaKeys = []string{"images", "videos", "audios", "files"}

func hasResultOutputField(source map[string]any) bool {
	if len(source) == 0 {
		return false
	}
	for _, key := range []string{"title", "rich", "json", "value"} {
		if resultFieldHasValue(source[key]) {
			return true
		}
	}
	for _, key := range resultMediaKeys {
		if len(botprotocol.NormalizeStringList(source[key])) > 0 {
			return true
		}
	}
	return false
}

func copyResultOutputFields(target map[string]any, source map[string]any) {
	if len(source) == 0 {
		return
	}
	for _, key := range []string{"title", "rich", "json"} {
		copyResultValue(target, source, key)
	}
	if !resultFieldHasValue(target["rich"]) {
		if rich := normalizeMap(source["value"]); len(rich) > 0 {
			target["rich"] = rich
		}
	}
	for _, key := range resultMediaKeys {
		copyResultMedia(target, source, key)
	}
}

func copyResultValue(target map[string]any, source map[string]any, key string) {
	value, exists := source[key]
	if !exists || !resultFieldHasValue(value) || resultFieldHasValue(target[key]) {
		return
	}
	target[key] = value
}

func copyResultMedia(target map[string]any, source map[string]any, key string) {
	if len(botprotocol.NormalizeStringList(target[key])) > 0 {
		return
	}
	if values := botprotocol.NormalizeStringList(source[key]); len(values) > 0 {
		target[key] = values
	}
}

func resultFieldHasValue(value any) bool {
	switch current := value.(type) {
	case nil:
		return false
	case string:
		return strings.TrimSpace(current) != ""
	case []any:
		return len(current) > 0
	case []string:
		return len(current) > 0
	case map[string]any:
		return len(current) > 0
	default:
		return true
	}
}

func NormalizeAgentFinalOutput(output map[string]any, fallbackText string) map[string]any {
	next := cloneMap(output)
	if strings.TrimSpace(firstText(next["kind"], next["type"])) == "" {
		next["kind"] = KindFinal
	}
	if strings.TrimSpace(firstText(next["event"])) == "" {
		next["event"] = "final"
	}
	if strings.TrimSpace(firstText(next["text"])) == "" && strings.TrimSpace(fallbackText) != "" {
		next["text"] = strings.TrimSpace(fallbackText)
	}
	delete(next, "reasoning")
	return next
}

func NormalizeToolResultOutput(output map[string]any, _ string) map[string]any {
	next := cloneMap(output)
	next["kind"] = KindTool
	if strings.TrimSpace(firstText(next["event"])) == "" {
		next["event"] = "final"
	}
	delete(next, "reasoning")
	return next
}

func normalizeResultKind(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "tool", "tool_result", "call_power", "power_result":
		return KindTool
	case "final", "result", "final_result", "answer":
		return KindFinal
	default:
		return strings.ToLower(strings.TrimSpace(value))
	}
}

func agentResultText(result map[string]any) string {
	if text := strings.TrimSpace(firstText(result["text"])); text != "" {
		return text
	}
	content := result["content"]
	contentMap := normalizeMap(content)
	if len(contentMap) == 0 {
		return strings.TrimSpace(firstText(content))
	}
	return strings.TrimSpace(firstText(contentMap["text"]))
}

func NormalizeSuggestions(value any) []map[string]any {
	switch values := value.(type) {
	case []any:
		result := make([]map[string]any, 0, len(values))
		for _, item := range values {
			if suggestion := normalizeAgentSuggestion(item); len(suggestion) > 0 {
				result = append(result, suggestion)
			}
		}
		return result
	case []map[string]any:
		result := make([]map[string]any, 0, len(values))
		for _, item := range values {
			if suggestion := normalizeAgentSuggestion(item); len(suggestion) > 0 {
				result = append(result, suggestion)
			}
		}
		return result
	default:
		if text := strings.TrimSpace(firstText(value)); text != "" {
			return []map[string]any{{"label": text, "prompt": text}}
		}
		return nil
	}
}

func normalizeAgentSuggestion(value any) map[string]any {
	mapped := normalizeMap(value)
	if len(mapped) == 0 {
		if text := strings.TrimSpace(firstText(value)); text != "" {
			return map[string]any{"label": text, "prompt": text}
		}
		return nil
	}
	label := strings.TrimSpace(firstText(mapped["label"], mapped["name"], mapped["title"]))
	prompt := strings.TrimSpace(firstText(mapped["prompt"], mapped["text"], mapped["value"], mapped["input"]))
	if label == "" {
		label = prompt
	}
	if prompt == "" {
		prompt = label
	}
	if label == "" || prompt == "" {
		return nil
	}
	return map[string]any{
		"label":  label,
		"prompt": prompt,
	}
}
