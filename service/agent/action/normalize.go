package action

import (
	"encoding/json"
	"strings"

	frontstream "my/package/front/service/stream"
)

func normalizeMap(raw any) map[string]any {
	mapped, ok := raw.(map[string]any)
	if !ok || mapped == nil {
		return map[string]any{}
	}
	return mapped
}

func cloneMap(source map[string]any) map[string]any {
	if source == nil {
		return map[string]any{}
	}
	cloned := make(map[string]any, len(source))
	for key, item := range source {
		cloned[key] = item
	}
	return cloned
}

func firstText(values ...any) string {
	for _, value := range values {
		if text := strings.TrimSpace(frontstream.InputText(value)); text != "" {
			return text
		}
	}
	return ""
}

func firstPresent(source map[string]any, keys ...string) any {
	for _, key := range keys {
		if value, exists := source[key]; exists {
			return value
		}
	}
	return nil
}

func jsonText(raw any) string {
	content, err := json.Marshal(raw)
	if err != nil {
		return ""
	}
	return string(content)
}
