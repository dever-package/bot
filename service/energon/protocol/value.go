package protocol

import (
	"encoding/json"
	"fmt"
	"strings"
)

func normalizeMap(value any) map[string]any {
	if mapped, ok := value.(map[string]any); ok {
		return mapped
	}
	return nil
}

func NormalizeMap(value any) map[string]any {
	return normalizeMap(value)
}

func normalizeAnyList(value any) []any {
	switch current := value.(type) {
	case nil:
		return nil
	case []any:
		return current
	case []map[string]any:
		result := make([]any, 0, len(current))
		for _, item := range current {
			result = append(result, item)
		}
		return result
	case []string:
		result := make([]any, 0, len(current))
		for _, item := range current {
			result = append(result, item)
		}
		return result
	default:
		return []any{current}
	}
}

func NormalizeAnyList(value any) []any {
	return normalizeAnyList(value)
}

func normalizeStringList(value any) []string {
	items := normalizeAnyList(value)
	result := make([]string, 0, len(items))
	for _, item := range items {
		text := strings.TrimSpace(asText(item))
		if text != "" {
			result = append(result, text)
		}
	}
	return result
}

func NormalizeStringList(value any) []string {
	return normalizeStringList(value)
}

func isEmptyContent(value any) bool {
	if value == nil {
		return true
	}
	if text, ok := value.(string); ok {
		return strings.TrimSpace(text) == ""
	}
	if items, ok := value.([]any); ok {
		return len(items) == 0
	}
	return false
}

func isTruthy(value any) bool {
	switch current := value.(type) {
	case bool:
		return current
	case string:
		switch strings.ToLower(strings.TrimSpace(current)) {
		case "1", "true", "yes", "y", "on":
			return true
		default:
			return false
		}
	case int:
		return current != 0
	case int64:
		return current != 0
	case float64:
		return current != 0
	default:
		return false
	}
}

func firstText(values ...any) string {
	for _, value := range values {
		if text := strings.TrimSpace(asText(value)); text != "" {
			return text
		}
	}
	return ""
}

func asText(value any) string {
	switch current := value.(type) {
	case string:
		return current
	case fmt.Stringer:
		return current.String()
	default:
		if current == nil {
			return ""
		}
		raw, err := json.Marshal(current)
		if err == nil {
			return string(raw)
		}
		return fmt.Sprint(current)
	}
}

func AsText(value any) string {
	return asText(value)
}
