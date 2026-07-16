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
		properties[key] = powerParamSchema(param)
		if param.Required {
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

func powerParamSchema(param energonservice.PowerParam) map[string]any {
	typeName := powerParamJSONType(param)
	schema := map[string]any{
		"type":        typeName,
		"description": strings.TrimSpace(param.Name),
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
	return schema
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
