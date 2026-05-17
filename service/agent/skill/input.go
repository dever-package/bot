package skill

import (
	"encoding/json"
	"strings"

	frontstream "my/package/front/service/stream"
)

func NormalizeInput(raw any) map[string]any {
	if mapped := NormalizeMap(raw); len(mapped) > 0 {
		return mapped
	}
	text := strings.TrimSpace(frontstream.InputText(raw))
	if text == "" {
		return map[string]any{}
	}
	return map[string]any{"text": text}
}

func NormalizeMap(raw any) map[string]any {
	mapped, ok := raw.(map[string]any)
	if !ok || mapped == nil {
		return map[string]any{}
	}
	return mapped
}

func CloneMap(source map[string]any) map[string]any {
	if source == nil {
		return map[string]any{}
	}
	cloned := make(map[string]any, len(source))
	for key, item := range source {
		cloned[key] = item
	}
	return cloned
}

func FirstText(values ...any) string {
	for _, value := range values {
		if text := strings.TrimSpace(frontstream.InputText(value)); text != "" {
			return text
		}
	}
	return ""
}

func PrimaryInputText(input map[string]any) string {
	if input == nil {
		return ""
	}
	if text := strings.TrimSpace(frontstream.InputText(input["text"])); text != "" {
		return text
	}
	if text := strings.TrimSpace(frontstream.InputText(input["prompt"])); text != "" {
		return text
	}
	if text := strings.TrimSpace(frontstream.InputText(input["message"])); text != "" {
		return text
	}
	return strings.TrimSpace(JSONText(input))
}

func FirstPresent(source map[string]any, keys ...string) any {
	for _, key := range keys {
		if value, exists := source[key]; exists {
			return value
		}
	}
	return nil
}

func FirstPresentOK(source map[string]any, keys ...string) (any, bool) {
	for _, key := range keys {
		if value, exists := source[key]; exists {
			return value, true
		}
	}
	return nil, false
}

func JSONText(raw any) string {
	content, err := json.Marshal(raw)
	if err != nil {
		return ""
	}
	return string(content)
}

func HeaderValue(headers map[string]string, key string) string {
	if headers == nil {
		return ""
	}
	if value := strings.TrimSpace(headers[key]); value != "" {
		return value
	}
	for currentKey, value := range headers {
		if strings.EqualFold(currentKey, key) {
			return strings.TrimSpace(value)
		}
	}
	return ""
}

func BoolInt16(enabled bool) int16 {
	if enabled {
		return 1
	}
	return 2
}

func Truthy(raw any) bool {
	switch value := raw.(type) {
	case bool:
		return value
	case int:
		return value != 0
	case int64:
		return value != 0
	case float64:
		return value != 0
	default:
		switch strings.ToLower(strings.TrimSpace(frontstream.InputText(raw))) {
		case "1", "true", "yes", "y", "on", "开启", "是":
			return true
		default:
			return false
		}
	}
}
