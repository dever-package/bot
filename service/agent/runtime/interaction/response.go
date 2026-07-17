package interaction

import (
	"encoding/json"
	"fmt"
	"strings"
)

func ResolveResponse(output any, interactionID string, data map[string]any) (bool, error) {
	interactionID = strings.TrimSpace(interactionID)
	if interactionID == "" {
		return false, fmt.Errorf("交互ID不能为空")
	}
	mapped := mapValue(output)
	current, ok := mapped["interaction"].(map[string]any)
	if !ok || strings.TrimSpace(textValue(current["id"])) != interactionID {
		return false, fmt.Errorf("交互已失效，请重新提交当前需求")
	}
	fields, ok := current["fields"].([]any)
	if !ok {
		if typed, typedOK := current["fields"].([]map[string]any); typedOK {
			fields = make([]any, 0, len(typed))
			for _, field := range typed {
				fields = append(fields, field)
			}
		}
	}
	if err := validateResponse(fields, data); err != nil {
		return false, err
	}
	knowledgeUsed, _ := mapped["knowledge_used"].(bool)
	return knowledgeUsed, nil
}

func validateResponse(fields []any, data map[string]any) error {
	if len(fields) == 0 {
		return fmt.Errorf("交互字段为空")
	}
	if data == nil {
		return fmt.Errorf("交互回答不能为空")
	}
	for _, item := range fields {
		field, ok := item.(map[string]any)
		if !ok {
			return fmt.Errorf("交互字段格式无效")
		}
		key := strings.TrimSpace(textValue(field["key"]))
		if key == "" {
			return fmt.Errorf("交互字段缺少 key")
		}
		if !hasValue(data[key]) {
			name := strings.TrimSpace(textValue(field["name"]))
			if name == "" {
				name = key
			}
			return fmt.Errorf("请补充必填信息：%s", name)
		}
	}
	return nil
}

func mapValue(value any) map[string]any {
	if raw, ok := value.(string); ok {
		var decoded map[string]any
		if json.Unmarshal([]byte(strings.TrimSpace(raw)), &decoded) == nil {
			return decoded
		}
		return nil
	}
	mapped, _ := value.(map[string]any)
	return mapped
}

func hasValue(value any) bool {
	switch current := value.(type) {
	case nil:
		return false
	case string:
		return strings.TrimSpace(current) != ""
	case []any:
		return len(current) > 0
	case []string:
		return len(current) > 0
	case map[string]any:
		return len(current) > 0
	default:
		return true
	}
}

func textValue(value any) string {
	if value == nil {
		return ""
	}
	return fmt.Sprint(value)
}
