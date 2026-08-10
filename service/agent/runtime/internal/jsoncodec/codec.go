package jsoncodec

import (
	"encoding/json"
	"strings"
)

func Encode(value any, fallback string) string {
	if value == nil {
		return fallback
	}
	encoded, err := json.Marshal(value)
	if err != nil {
		return fallback
	}
	return string(encoded)
}

func DecodeMap(value string) map[string]any {
	result := map[string]any{}
	if strings.TrimSpace(value) == "" {
		return result
	}
	_ = json.Unmarshal([]byte(value), &result)
	return result
}
