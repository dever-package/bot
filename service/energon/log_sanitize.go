package energon

import (
	"encoding/base64"
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
	if len(trimmed) > 128 && (strings.Contains(key, "base64") || strings.Contains(key, "b64") || looksLikeRawBase64LogValue(trimmed)) {
		return fmt.Sprintf("[base64 omitted: %d chars]", len(trimmed))
	}
	return value
}

func looksLikeRawBase64LogValue(value string) bool {
	value = strings.TrimSpace(value)
	if len(value) > 4096 {
		value = value[:4096]
	}
	value = strings.NewReplacer("\n", "", "\r", "", "\t", "").Replace(value)
	if len(value) < 128 || strings.Contains(value, " ") || strings.Contains(value, "://") || strings.HasPrefix(value, "/") {
		return false
	}
	for _, current := range value {
		if (current >= 'a' && current <= 'z') || (current >= 'A' && current <= 'Z') || (current >= '0' && current <= '9') || current == '+' || current == '/' || current == '=' {
			continue
		}
		return false
	}
	prefixLength := len(value)
	if prefixLength > 1024 {
		prefixLength = 1024
	}
	prefixLength -= prefixLength % 4
	if prefixLength == 0 {
		return false
	}
	_, err := base64.StdEncoding.DecodeString(value[:prefixLength])
	return err == nil
}
