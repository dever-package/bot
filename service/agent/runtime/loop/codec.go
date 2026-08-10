package loop

import (
	"encoding/json"
	"strings"

	runtimejson "github.com/dever-package/bot/service/agent/runtime/internal/jsoncodec"
)

func encodeJSON(value any, fallback string) string {
	return runtimejson.Encode(value, fallback)
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
