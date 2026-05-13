package input

import (
	"context"
	"encoding/json"
	"fmt"
	"net/url"
	"strconv"
	"strings"

	"github.com/shemic/dever/util"

	uploadrepo "my/package/front/service/upload/repository"
)

func FileValue(ctx context.Context, value any) any {
	switch current := value.(type) {
	case []any:
		items := make([]any, 0, len(current))
		for _, item := range current {
			normalized := FileValue(ctx, item)
			if !IsMissing(normalized) {
				items = append(items, normalized)
			}
		}
		return items
	case []string:
		items := make([]any, 0, len(current))
		for _, item := range current {
			if url := FileString(ctx, item); url != "" {
				items = append(items, url)
			}
		}
		return items
	case map[string]any:
		if url := fileURLFromMap(ctx, current); url != "" {
			return url
		}
		return current
	case string:
		return FileString(ctx, current)
	default:
		return value
	}
}

func FileString(ctx context.Context, value string) string {
	text := strings.TrimSpace(value)
	if text == "" || IsChannelReadableFileURL(text) {
		return text
	}
	if id := uploadFileIDFromOpenURL(text); id > 0 {
		if publicURL := uploadFilePublicURL(ctx, id); publicURL != "" {
			return publicURL
		}
	}
	return text
}

func ParseJSONValue(value string) any {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return ""
	}

	var result any
	if err := json.Unmarshal([]byte(trimmed), &result); err == nil {
		return result
	}
	return trimmed
}

func ScalarByType(valueType string, value any) any {
	text := strings.TrimSpace(ValueText(value))
	if NormalizeValueType(valueType) != "number" {
		return text
	}
	if text == "" {
		return nil
	}
	number, err := strconv.ParseFloat(text, 64)
	if err != nil {
		return text
	}
	return number
}

func ListByType(valueType string, items []any) []any {
	result := make([]any, 0, len(items))
	for _, item := range items {
		if IsMissing(item) {
			continue
		}
		result = append(result, ScalarByType(valueType, item))
	}
	return result
}

func SwitchByType(valueType string, value any) any {
	checked := BoolValue(value)
	if NormalizeValueType(valueType) == "string" {
		return strconv.FormatBool(checked)
	}
	return checked
}

func BoolValue(value any) bool {
	switch current := value.(type) {
	case bool:
		return current
	case string:
		return IsTruthyText(current)
	case int:
		return current != 0
	case int8:
		return current != 0
	case int16:
		return current != 0
	case int32:
		return current != 0
	case int64:
		return current != 0
	case uint:
		return current != 0
	case uint8:
		return current != 0
	case uint16:
		return current != 0
	case uint32:
		return current != 0
	case uint64:
		return current != 0
	case float32:
		return current != 0
	case float64:
		return current != 0
	default:
		return IsTruthyText(util.ToString(value))
	}
}

func List(value any) []any {
	switch current := value.(type) {
	case []any:
		return current
	case []string:
		result := make([]any, 0, len(current))
		for _, item := range current {
			result = append(result, item)
		}
		return result
	case string:
		trimmed := strings.TrimSpace(current)
		if trimmed == "" {
			return nil
		}
		var values []any
		if err := json.Unmarshal([]byte(trimmed), &values); err == nil {
			return values
		}
		return []any{trimmed}
	default:
		if IsMissing(value) {
			return nil
		}
		return []any{value}
	}
}

func StringList(value any) []string {
	items := List(value)
	result := make([]string, 0, len(items))
	for _, item := range items {
		text := strings.TrimSpace(ValueText(item))
		if text != "" {
			result = append(result, text)
		}
	}
	return result
}

func IsMissing(value any) bool {
	switch current := value.(type) {
	case nil:
		return true
	case string:
		return strings.TrimSpace(current) == ""
	case []any:
		return len(current) == 0
	case []string:
		return len(current) == 0
	default:
		return false
	}
}

func IsTruthyText(value string) bool {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "1", "true", "yes", "on", "enable", "enabled", "开启", "启用":
		return true
	default:
		return false
	}
}

func ValueText(value any) string {
	switch current := value.(type) {
	case string:
		return current
	case fmt.Stringer:
		return current.String()
	default:
		return util.ToString(value)
	}
}

func NormalizeValueType(value string) string {
	return NormalizeParamValueType(value)
}

func fileURLFromMap(ctx context.Context, value map[string]any) string {
	for _, field := range []string{"url", "src", "path", "download", "open_url"} {
		if raw := strings.TrimSpace(util.ToString(value[field])); raw != "" {
			return FileString(ctx, raw)
		}
	}
	if id := util.ToUint64(value["id"]); id > 0 {
		return uploadFilePublicURL(ctx, id)
	}
	return ""
}

func uploadFileIDFromOpenURL(value string) uint64 {
	parsed, err := url.Parse(strings.TrimSpace(value))
	if err != nil {
		return 0
	}
	if !strings.Contains(strings.TrimSpace(parsed.Path), "/front/upload/open") {
		return 0
	}
	return util.ToUint64(parsed.Query().Get("id"))
}

func uploadFilePublicURL(ctx context.Context, fileID uint64) string {
	file, err := uploadrepo.FindUploadFile(ctx, fileID)
	if err != nil {
		return ""
	}
	payload := uploadrepo.BuildUploadFilePayload(file)
	return strings.TrimSpace(util.ToString(payload["url"]))
}

func IsChannelReadableFileURL(value string) bool {
	text := strings.TrimSpace(value)
	if text == "" {
		return false
	}
	if strings.HasPrefix(text, "http://") || strings.HasPrefix(text, "https://") {
		return true
	}
	if strings.HasPrefix(text, "data:") {
		return true
	}
	return strings.HasPrefix(text, "file://")
}
