package artifact

import (
	"encoding/json"
	"strings"

	"github.com/shemic/dever/util"
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

func decodeIDs(value string) []uint64 {
	result := []uint64{}
	if strings.TrimSpace(value) == "" {
		return result
	}
	_ = json.Unmarshal([]byte(value), &result)
	return uniqueIDs(result)
}

func mapList(value any) []map[string]any {
	items, ok := value.([]any)
	if !ok {
		if typed, currentOK := value.([]map[string]any); currentOK {
			return typed
		}
		if typed, currentOK := value.(map[string]any); currentOK {
			return []map[string]any{typed}
		}
		return nil
	}
	result := make([]map[string]any, 0, len(items))
	for _, item := range items {
		if current, currentOK := item.(map[string]any); currentOK {
			result = append(result, current)
		}
	}
	return result
}

func uniqueIDs(values []uint64) []uint64 {
	seen := make(map[uint64]struct{}, len(values))
	result := make([]uint64, 0, len(values))
	for _, value := range values {
		if value == 0 {
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

func uint64Value(value any) uint64 {
	return util.ToUint64(value)
}

func textValue(value any) string {
	return strings.TrimSpace(util.ToString(value))
}
