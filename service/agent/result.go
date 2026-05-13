package agent

import "strings"

const (
	agentResultKindFinal = "final_result"
	agentResultKindTool  = "tool_result"
)

func extractAgentResult(text string) (string, map[string]any, bool) {
	return extractJSONFence(text, []string{"agent-result", "agent-output", "json"}, validAgentResult)
}

func validAgentResult(result map[string]any) bool {
	if len(result) == 0 {
		return false
	}
	kind := normalizeResultKind(firstText(result["kind"], result["type"], result["event"]))
	if kind == agentResultKindFinal || kind == agentResultKindTool {
		return true
	}
	if _, ok := result["suggestions"]; ok {
		return true
	}
	if _, ok := result["content"]; ok {
		return true
	}
	return strings.TrimSpace(firstText(result["text"])) != ""
}

func applyAgentResult(output map[string]any, result map[string]any, fallbackText string) map[string]any {
	next := cloneMap(output)
	kind := normalizeResultKind(firstText(result["kind"], result["type"], result["event"]))
	if kind == "" {
		kind = agentResultKindFinal
	}
	next["kind"] = kind
	next["event"] = "final"

	if content, exists := result["content"]; exists {
		next["content"] = content
	}
	if text := agentResultText(result); text != "" {
		next["text"] = text
	} else if strings.TrimSpace(fallbackText) != "" {
		next["text"] = strings.TrimSpace(fallbackText)
	}
	if suggestions := normalizeAgentSuggestions(result["suggestions"]); len(suggestions) > 0 {
		next["suggestions"] = suggestions
	}
	delete(next, "reasoning")
	return next
}

func normalizeAgentFinalOutput(output map[string]any, fallbackText string) map[string]any {
	next := cloneMap(output)
	if strings.TrimSpace(firstText(next["kind"], next["type"])) == "" {
		next["kind"] = agentResultKindFinal
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

func normalizeToolResultOutput(output map[string]any, _ string) map[string]any {
	next := cloneMap(output)
	next["kind"] = agentResultKindTool
	if strings.TrimSpace(firstText(next["event"])) == "" {
		next["event"] = "final"
	}
	delete(next, "reasoning")
	return next
}

func normalizeResultKind(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "tool", "tool_result", "call_power", "power_result":
		return agentResultKindTool
	case "final", "result", "final_result", "answer":
		return agentResultKindFinal
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
	return strings.TrimSpace(firstText(contentMap["text"], contentMap["markdown"], contentMap["html"]))
}

func normalizeAgentSuggestions(value any) []map[string]any {
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
