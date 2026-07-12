package energon

import (
	"encoding/json"
	"fmt"
	"strings"
)

func sanitizeLogJSON(raw string) string {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return raw
	}
	var value any
	if err := json.Unmarshal([]byte(raw), &value); err != nil {
		return sanitizeLogString("", raw)
	}
	return encodeLogJSON(sanitizeLogValue(value, ""))
}

func sanitizeLogValue(value any, key string) any {
	switch current := value.(type) {
	case map[string]any:
		result := make(map[string]any, len(current))
		for childKey, childValue := range current {
			result[childKey] = sanitizeLogValue(childValue, childKey)
		}
		return result
	case map[string]string:
		result := make(map[string]string, len(current))
		for childKey, childValue := range current {
			result[childKey] = sanitizeLogString(childKey, childValue)
		}
		return result
	case []any:
		result := make([]any, len(current))
		for index, childValue := range current {
			result[index] = sanitizeLogValue(childValue, key)
		}
		return result
	case []string:
		result := make([]string, len(current))
		for index, childValue := range current {
			result[index] = sanitizeLogString(key, childValue)
		}
		return result
	case string:
		return sanitizeLogString(key, current)
	default:
		return value
	}
}

func sanitizeLogString(key string, value string) string {
	trimmed := strings.TrimSpace(value)
	lower := strings.ToLower(trimmed)
	if strings.HasPrefix(lower, "data:") {
		if comma := strings.Index(trimmed, ","); comma > 0 && strings.Contains(strings.ToLower(trimmed[:comma]), ";base64") {
			return trimmed[:comma+1] + fmt.Sprintf("[base64 omitted: %d chars]", len(trimmed)-comma-1)
		}
	}
	key = strings.ToLower(strings.TrimSpace(key))
	if len(trimmed) > 128 && (strings.Contains(key, "base64") || strings.Contains(key, "b64")) {
		return fmt.Sprintf("[base64 omitted: %d chars]", len(trimmed))
	}
	return value
}
