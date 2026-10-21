package energon

import (
	"fmt"
	"math"
	"slices"
	"strings"
)

// 校验写作合同自身使用的 schema 子集；字段与嵌套形状不再另维护一份名单。
func validateWritingOutputValue(value any, schema map[string]any, path string) error {
	switch schema["type"] {
	case "object":
		object, ok := value.(map[string]any)
		if !ok {
			return fmt.Errorf("%s 必须为对象", path)
		}
		properties := schema["properties"].(map[string]any)
		required := schema["required"].([]string)
		missing, extra := []string{}, []string{}
		for _, field := range required {
			if _, exists := object[field]; !exists {
				missing = append(missing, field)
			}
		}
		for field := range object {
			if _, exists := properties[field]; !exists {
				extra = append(extra, field)
			}
		}
		if len(missing)+len(extra) > 0 {
			slices.Sort(missing)
			slices.Sort(extra)
			return fmt.Errorf("%s 字段不匹配；缺失字段 [%s]；额外字段 [%s]", path, strings.Join(missing, ", "), strings.Join(extra, ", "))
		}
		for _, field := range required {
			if err := validateWritingOutputValue(object[field], properties[field].(map[string]any), path+"."+field); err != nil {
				return err
			}
		}
	case "array":
		rows, ok := value.([]any)
		if !ok {
			return fmt.Errorf("%s 必须为列表", path)
		}
		if maximum, bounded := schema["maxItems"].(int); bounded && len(rows) > maximum {
			return fmt.Errorf("%s 超过列表上限 %d", path, maximum)
		}
		for index, row := range rows {
			if err := validateWritingOutputValue(row, schema["items"].(map[string]any), fmt.Sprintf("%s[%d]", path, index)); err != nil {
				return err
			}
		}
	case "integer", "number":
		number, ok := value.(float64)
		if !ok {
			switch n := value.(type) {
			case int:
				number = float64(n)
				ok = true
			case int64:
				number = float64(n)
				ok = true
			}
		}
		if !ok || math.IsNaN(number) || math.IsInf(number, 0) || schema["type"] == "integer" && number != math.Trunc(number) {
			return fmt.Errorf("%s 必须为有效数字", path)
		}
		if minimum, ok := schema["minimum"].(int); ok && number < float64(minimum) {
			return fmt.Errorf("%s 低于允许范围", path)
		}
		if maximum, ok := schema["maximum"].(int); ok && number > float64(maximum) {
			return fmt.Errorf("%s 超过允许范围", path)
		}
	case "string":
		text, ok := value.(string)
		if !ok {
			return fmt.Errorf("%s 必须为文字", path)
		}
		if allowed, exists := schema["enum"].([]string); exists && !slices.Contains(allowed, text) {
			return fmt.Errorf("%s 必须为 %s", path, strings.Join(allowed, "/"))
		}
	}
	return nil
}
