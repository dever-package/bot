package agentcontext

import (
	"encoding/json"
	"fmt"
	"strings"

	agentskill "github.com/dever-package/bot/service/agent/skill"
)

func primaryInputText(input map[string]any) string {
	return agentskill.PrimaryInputText(input)
}

func firstText(values ...any) string {
	return agentskill.FirstText(values...)
}

func jsonText(value any) string {
	return agentskill.JSONText(value)
}

func normalizeMap(value any) map[string]any {
	return agentskill.NormalizeMap(value)
}

func cloneMap(value map[string]any) map[string]any {
	if len(value) == 0 {
		return map[string]any{}
	}
	raw, err := json.Marshal(value)
	if err != nil {
		next := make(map[string]any, len(value))
		for key, item := range value {
			next[key] = item
		}
		return next
	}
	var next map[string]any
	if err := json.Unmarshal(raw, &next); err != nil {
		next = make(map[string]any, len(value))
		for key, item := range value {
			next[key] = item
		}
	}
	return next
}

func normalizeSlice(value any) []any {
	switch current := value.(type) {
	case []any:
		return current
	default:
		raw, err := json.Marshal(current)
		if err != nil {
			return nil
		}
		var result []any
		if err := json.Unmarshal(raw, &result); err != nil {
			return nil
		}
		return result
	}
}

func promptJSON(value any) string {
	raw, err := json.Marshal(value)
	if err != nil {
		return strings.TrimSpace(fmt.Sprint(value))
	}
	return strings.TrimSpace(string(raw))
}

func truncateText(text string, maxRunes int) string {
	text = strings.TrimSpace(text)
	if maxRunes <= 0 {
		return text
	}
	runes := []rune(text)
	if len(runes) <= maxRunes {
		return text
	}
	return strings.TrimSpace(string(runes[:maxRunes])) + "..."
}

func containsAnyText(text string, terms ...string) bool {
	text = strings.ToLower(strings.TrimSpace(text))
	if text == "" {
		return false
	}
	for _, term := range terms {
		term = strings.ToLower(strings.TrimSpace(term))
		if term != "" && strings.Contains(text, term) {
			return true
		}
	}
	return false
}

func uniqueNonEmpty(values []string) []string {
	seen := map[string]struct{}{}
	result := make([]string, 0, len(values))
	for _, value := range values {
		value = strings.TrimSpace(value)
		if value == "" {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
}
