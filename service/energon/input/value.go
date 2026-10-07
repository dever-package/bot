package input

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"net/url"
	"strconv"
	"strings"

	"github.com/shemic/dever/util"

	uploadrepo "github.com/dever-package/front/service/upload/repository"
)

const (
	maxExactFloat64Integer = 1<<53 - 1
	maxExactFloat32Integer = 1<<24 - 1
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

func ParseJSONValue(value string, preserveNumbers ...bool) any {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return ""
	}

	var result any
	if err := decodeJSONValue(trimmed, &result, preserveNumbers); err == nil {
		return result
	}
	return trimmed
}

func ScalarByType(valueType string, value any, preserveNumbers ...bool) any {
	text := strings.TrimSpace(ValueText(value))
	if NormalizeValueType(valueType) != "number" {
		return text
	}
	if text == "" {
		return nil
	}
	if numberPreservationEnabled(preserveNumbers) {
		number, err := ExactNumber(value)
		if err != nil {
			return value
		}
		return number
	}
	number, err := strconv.ParseFloat(text, 64)
	if err != nil {
		return text
	}
	return number
}

func ListByType(valueType string, items []any, preserveNumbers ...bool) []any {
	result := make([]any, 0, len(items))
	for _, item := range items {
		if IsMissing(item) {
			continue
		}
		result = append(result, ScalarByType(valueType, item, preserveNumbers...))
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

func NormalizeFixedValueType(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "bool", "boolean":
		return "boolean"
	case "number", "int", "integer", "float", "double":
		return "number"
	case "json", "object", "array":
		return "json"
	default:
		return "string"
	}
}

func FixedValueByType(valueType string, value any, preserveNumbers ...bool) (any, error) {
	text := strings.TrimSpace(ValueText(value))
	switch NormalizeFixedValueType(valueType) {
	case "boolean":
		parsed, ok := ParseBoolValue(text)
		if !ok {
			return nil, fmt.Errorf("布尔固定值必须是 true/false")
		}
		return parsed, nil
	case "number":
		if numberPreservationEnabled(preserveNumbers) {
			number, err := ExactNumber(value)
			if err != nil {
				return nil, fmt.Errorf("数字固定值格式不正确：%w", err)
			}
			return number, nil
		}
		number, err := strconv.ParseFloat(text, 64)
		if err != nil {
			return nil, fmt.Errorf("数字固定值格式不正确")
		}
		return number, nil
	case "json":
		var result any
		if err := decodeJSONValue(text, &result, preserveNumbers); err != nil {
			return nil, fmt.Errorf("JSON 固定值格式不正确")
		}
		return result, nil
	default:
		return text, nil
	}
}

func ExactNumber(value any) (json.Number, error) {
	switch number := value.(type) {
	case float64:
		if math.Abs(number) > maxExactFloat64Integer {
			return "", fmt.Errorf("大数值不能使用浮点输入，请用文本传入数值以保留精度")
		}
	case float32:
		if math.Abs(float64(number)) > maxExactFloat32Integer {
			return "", fmt.Errorf("大数值不能使用浮点输入，请用文本传入数值以保留精度")
		}
	}
	text, isText := value.(string)
	if !isText {
		encoded, err := json.Marshal(value)
		if err != nil {
			return "", fmt.Errorf("需要有效的 JSON 数值")
		}
		text = string(encoded)
	}
	decoder := json.NewDecoder(strings.NewReader(text))
	decoder.UseNumber()
	var parsed any
	if err := decoder.Decode(&parsed); err != nil || !json.Valid([]byte(text)) {
		return "", fmt.Errorf("需要有效的 JSON 数值")
	}
	number, ok := parsed.(json.Number)
	if !ok {
		return "", fmt.Errorf("需要数值")
	}
	return number, nil
}

func decodeJSONValue(text string, result *any, preserveNumbers []bool) error {
	if !numberPreservationEnabled(preserveNumbers) {
		return json.Unmarshal([]byte(text), result)
	}
	if !json.Valid([]byte(text)) {
		return fmt.Errorf("JSON 格式不正确")
	}
	decoder := json.NewDecoder(strings.NewReader(text))
	decoder.UseNumber()
	return decoder.Decode(result)
}

func numberPreservationEnabled(options []bool) bool {
	return len(options) > 0 && options[0]
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

func ParseBoolValue(value string) (bool, bool) {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "1", "true", "yes", "on", "enable", "enabled", "开启", "启用":
		return true, true
	case "0", "false", "no", "off", "disable", "disabled", "关闭", "停用", "禁用":
		return false, true
	default:
		return false, false
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
