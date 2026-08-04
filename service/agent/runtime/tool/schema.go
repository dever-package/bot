package tool

import (
	"strings"

	energonservice "github.com/dever-package/bot/service/energon"
	energoninput "github.com/dever-package/bot/service/energon/input"
)

func powerParametersSchema(params []energonservice.PowerParam) map[string]any {
	properties := make(map[string]any, len(params))
	required := make([]any, 0)
	for _, param := range params {
		key := strings.TrimSpace(param.Key)
		if key == "" || strings.EqualFold(strings.TrimSpace(param.Type), "description") {
			continue
		}
		schema, hasDefault := powerParamSchema(param)
		properties[key] = schema
		if param.Required && !powerParamHasCondition(param) && !hasDefault {
			required = append(required, key)
		}
	}
	result := map[string]any{
		"type":                 "object",
		"properties":           properties,
		"additionalProperties": false,
	}
	if len(required) > 0 {
		result["required"] = required
	}
	return result
}

func powerParamSchema(param energonservice.PowerParam) (map[string]any, bool) {
	typeName := powerParamJSONType(param)
	schema := map[string]any{
		"type":        typeName,
		"description": powerParamDescription(param),
	}
	if typeName == "array" {
		schema["items"] = map[string]any{"type": powerParamItemType(param)}
	}
	if values := powerParamEnum(param); len(values) > 0 {
		if typeName == "array" {
			schema["items"].(map[string]any)["enum"] = values
		} else {
			schema["enum"] = values
		}
	}
	defaultValue, hasDefault := powerParamDefault(param)
	if hasDefault {
		schema["default"] = defaultValue
	}
	return schema, hasDefault
}

func powerParamDescription(param energonservice.PowerParam) string {
	parts := make([]string, 0, 3)
	if name := strings.TrimSpace(param.Name); name != "" {
		parts = append(parts, name)
	}
	if options := powerParamOptionDescription(param); options != "" {
		parts = append(parts, "可选值："+options)
	}
	if powerParamHasCondition(param) {
		condition := "仅当参数 " + strings.TrimSpace(param.ActiveWhenKey) + " 为 " + strings.TrimSpace(param.ActiveWhenValue) + " 时生效"
		if param.Required {
			condition += "，生效后必填"
		}
		parts = append(parts, condition)
	}
	return strings.Join(parts, "；")
}

func powerParamOptionDescription(param energonservice.PowerParam) string {
	result := make([]string, 0, len(param.Options))
	for _, option := range param.Options {
		value := strings.TrimSpace(option.NativeValue)
		if value == "" {
			value = strings.TrimSpace(option.Value)
		}
		if value == "" {
			continue
		}
		name := strings.TrimSpace(option.Name)
		if name != "" && !strings.EqualFold(name, value) {
			result = append(result, name+"（"+value+"）")
		}
	}
	return strings.Join(result, "、")
}

func powerParamDefault(param energonservice.PowerParam) (any, bool) {
	key := strings.TrimSpace(param.Key)
	if key == "" {
		return nil, false
	}
	values := energonservice.ApplyPowerParamDefaults(map[string]any{}, []energonservice.PowerParam{param})
	value, exists := values[key]
	if !exists || energoninput.IsMissing(value) {
		return nil, false
	}
	return value, true
}

func powerParamHasCondition(param energonservice.PowerParam) bool {
	return strings.TrimSpace(param.ActiveWhenKey) != "" && strings.TrimSpace(param.ActiveWhenValue) != ""
}

func powerParamJSONType(param energonservice.PowerParam) string {
	switch strings.ToLower(strings.TrimSpace(param.Type)) {
	case "switch", "bool", "boolean":
		return "boolean"
	case "multi_option", "files":
		return "array"
	}
	if strings.EqualFold(strings.TrimSpace(param.ValueType), "number") {
		return "number"
	}
	return "string"
}

func powerParamItemType(param energonservice.PowerParam) string {
	if strings.EqualFold(strings.TrimSpace(param.ValueType), "number") {
		return "number"
	}
	return "string"
}

func powerParamEnum(param energonservice.PowerParam) []any {
	if len(param.Options) == 0 {
		return nil
	}
	result := make([]any, 0, len(param.Options))
	for _, option := range param.Options {
		value := strings.TrimSpace(option.NativeValue)
		if value == "" {
			value = strings.TrimSpace(option.Value)
		}
		if value != "" {
			result = append(result, energoninput.ScalarByType(param.ValueType, value))
		}
	}
	return result
}
