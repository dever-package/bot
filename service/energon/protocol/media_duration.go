package protocol

import (
	"fmt"
	"math"
	"strconv"
	"strings"
)

// ExtractMediaDurationMS reads canonical milliseconds first, then provider
// duration fields whose unit is seconds.
func ExtractMediaDurationMS(value any) int64 {
	return extractMediaDurationMS(value, 0)
}

func extractMediaDurationMS(value any, depth int) int64 {
	if value == nil || depth > 6 {
		return 0
	}
	switch current := value.(type) {
	case Output:
		return extractMediaDurationMS(map[string]any(current), depth)
	case map[string]any:
		for _, key := range []string{"duration_ms", "durationMs"} {
			if duration := mediaDurationNumber(current[key], 1); duration > 0 {
				return duration
			}
		}
		if duration := mediaDurationNumber(current["duration"], 1000); duration > 0 {
			return duration
		}
		for _, key := range []string{
			"meta", "metadata", "attrs",
			"audio", "audios", "video", "videos", "media_files",
			"output", "result", "data", "content", "body", "value",
		} {
			if duration := extractMediaDurationMS(current[key], depth+1); duration > 0 {
				return duration
			}
		}
	case []any:
		for _, item := range current {
			if duration := extractMediaDurationMS(item, depth+1); duration > 0 {
				return duration
			}
		}
	case []map[string]any:
		for _, item := range current {
			if duration := extractMediaDurationMS(item, depth+1); duration > 0 {
				return duration
			}
		}
	}
	return 0
}

func mediaDurationNumber(value any, multiplier float64) int64 {
	raw := strings.TrimSpace(fmt.Sprint(value))
	if value == nil || raw == "" {
		return 0
	}
	number, err := strconv.ParseFloat(raw, 64)
	if err != nil || math.IsNaN(number) || math.IsInf(number, 0) || number <= 0 {
		return 0
	}
	return int64(math.Round(number * multiplier))
}
