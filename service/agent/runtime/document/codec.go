package document

import (
	"time"

	runtimejson "github.com/dever-package/bot/service/agent/runtime/internal/jsoncodec"
)

func encodeJSON(value any, fallback string) string {
	return runtimejson.Encode(value, fallback)
}

func decodeMap(value string) map[string]any {
	return runtimejson.DecodeMap(value)
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
