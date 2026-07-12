package loop

import (
	"encoding/json"
	"strings"
)

func encodeJSON(value any, fallback string) string {
	if value == nil {
		return fallback
	}
	encoded, err := json.Marshal(value)
	if err != nil {
		return fallback
	}
	return string(encoded)
}

func decodeOutput(value string) map[string]any {
	value = strings.TrimSpace(value)
	if value == "" {
		return map[string]any{}
	}
	result := map[string]any{}
	if err := json.Unmarshal([]byte(value), &result); err == nil {
		return result
	}
	return map[string]any{"text": value}
}

func decodeJSON(value string) any {
	value = strings.TrimSpace(value)
	if value == "" {
		return ""
	}
	var result any
	if err := json.Unmarshal([]byte(value), &result); err != nil {
		return value
	}
	return result
}
