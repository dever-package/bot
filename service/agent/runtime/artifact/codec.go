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

var generatedFileKeys = []string{
	"media_files",
	"images", "image",
	"videos", "video",
	"audios", "audio",
	"files", "file",
}

// generatedFiles accepts the normalized media_files contract and the native
// media fields used by individual capabilities. Only persisted upload records
// are returned; URLs and base64 values are never treated as durable files.
func generatedFiles(output map[string]any) []map[string]any {
	result := make([]map[string]any, 0)
	seen := map[uint64]struct{}{}
	collectGeneratedFiles(output, 0, false, seen, &result)
	return result
}

// generatedOutputMap normalizes named map types and nested protocol values
// through JSON once, so every capability result enters the same persistence
// path regardless of its concrete Go map type.
func generatedOutputMap(value any) map[string]any {
	if value == nil {
		return map[string]any{}
	}
	if current, ok := value.(map[string]any); ok {
		encoded, err := json.Marshal(current)
		if err == nil {
			decoded := map[string]any{}
			if json.Unmarshal(encoded, &decoded) == nil {
				return decoded
			}
		}
		return current
	}
	encoded, err := json.Marshal(value)
	if err != nil {
		return map[string]any{}
	}
	result := map[string]any{}
	if json.Unmarshal(encoded, &result) != nil {
		return map[string]any{}
	}
	return result
}

func collectGeneratedFiles(value any, depth int, mediaField bool, seen map[uint64]struct{}, result *[]map[string]any) {
	if value == nil || depth > 4 {
		return
	}
	switch current := value.(type) {
	case map[string]any:
		if mediaField {
			fileID := uint64Value(firstValue(current, "file_id", "id"))
			if fileID > 0 {
				if _, exists := seen[fileID]; !exists {
					seen[fileID] = struct{}{}
					*result = append(*result, current)
				}
				return
			}
		}
		for _, key := range generatedFileKeys {
			collectGeneratedFiles(current[key], depth+1, true, seen, result)
		}
		for _, key := range []string{"output", "result", "data", "content"} {
			collectGeneratedFiles(current[key], depth+1, mediaField, seen, result)
		}
	case []map[string]any:
		for _, item := range current {
			collectGeneratedFiles(item, depth+1, mediaField, seen, result)
		}
	case []any:
		for _, item := range current {
			collectGeneratedFiles(item, depth+1, mediaField, seen, result)
		}
	}
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
