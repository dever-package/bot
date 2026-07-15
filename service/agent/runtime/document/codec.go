package document

import (
	"encoding/json"
	"strings"
	"time"
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

func decodeMap(value string) map[string]any {
	result := map[string]any{}
	if strings.TrimSpace(value) == "" {
		return result
	}
	_ = json.Unmarshal([]byte(value), &result)
	return result
}

func timeText(value time.Time) string {
	if value.IsZero() {
		return ""
	}
	return value.Format(time.RFC3339)
}

func optionalTimeText(value *time.Time) string {
	if value == nil {
		return ""
	}
	return timeText(*value)
}
