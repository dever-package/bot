package interaction

import (
	"fmt"
	"strings"

	runtimemessageoutput "github.com/dever-package/bot/service/agent/runtime/messageoutput"
)

// ValidateResponse validates submitted values against a persisted interaction.
// Fields are required by default; providers may explicitly mark optional fields.
func ValidateResponse(interaction map[string]any, data map[string]any) error {
	fields, err := interactionFields(interaction["fields"])
	if err != nil {
		return err
	}
	if len(fields) == 0 {
		return fmt.Errorf("交互字段为空")
	}
	for _, field := range fields {
		key := strings.TrimSpace(fieldText(field["key"]))
		if key == "" {
			return fmt.Errorf("交互字段缺少 key")
		}
		if !fieldRequired(field) || runtimemessageoutput.HasValue(data[key]) {
			continue
		}
		name := firstFieldText(field["name"], field["label"], field["title"], key)
		return fmt.Errorf("请补充必填信息：%s", name)
	}
	return nil
}

func interactionFields(value any) ([]map[string]any, error) {
	switch fields := value.(type) {
	case []map[string]any:
		return fields, nil
	case []any:
		result := make([]map[string]any, 0, len(fields))
		for _, value := range fields {
			field, ok := value.(map[string]any)
			if !ok {
				return nil, fmt.Errorf("交互字段格式无效")
			}
			result = append(result, field)
		}
		return result, nil
	default:
		return nil, fmt.Errorf("交互字段格式无效")
	}
}

func fieldRequired(field map[string]any) bool {
	value, exists := field["required"]
	if !exists {
		return true
	}
	switch strings.ToLower(strings.TrimSpace(fieldText(value))) {
	case "0", "false", "no", "off", "optional", "否", "可选":
		return false
	default:
		return true
	}
}

func firstFieldText(values ...any) string {
	for _, value := range values {
		if text := strings.TrimSpace(fieldText(value)); text != "" {
			return text
		}
	}
	return ""
}

func fieldText(value any) string {
	if value == nil {
		return ""
	}
	return fmt.Sprint(value)
}
