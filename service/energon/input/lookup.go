package input

import (
	"fmt"
	"strings"

	botmodel "my/package/bot/model/energon"
)

func addInputParamLabels(labels map[string]string, param botmodel.Param) {
	for _, key := range paramInputKeys(param) {
		if key != "" {
			labels[key] = strings.TrimSpace(param.Name)
		}
	}
}

func addServiceParamInputLabels(labels map[string]string, serviceParam botmodel.ServiceParam, param botmodel.Param) {
	name := ServiceParamDisplayName(serviceParam, param)
	for _, key := range serviceParamInputKeys(serviceParam, param) {
		if key != "" {
			labels[key] = name
		}
	}
}

func ServiceParamDisplayName(serviceParam botmodel.ServiceParam, param botmodel.Param) string {
	if name := strings.TrimSpace(serviceParam.Name); name != "" {
		return name
	}
	if name := strings.TrimSpace(param.Name); name != "" {
		return name
	}
	if key := strings.TrimSpace(serviceParam.Key); key != "" {
		return key
	}
	return strings.TrimSpace(param.Key)
}

func ServiceParamInputKey(serviceParam botmodel.ServiceParam) string {
	if key := strings.TrimSpace(serviceParam.Key); key != "" {
		return key
	}
	return fmt.Sprintf("service_param_%d", serviceParam.ID)
}

func serviceParamInputKeys(serviceParam botmodel.ServiceParam, param botmodel.Param) []string {
	keys := []string{}
	if isPromptParam(serviceParam, param) {
		for _, key := range promptInputAliases() {
			keys = appendUniqueInputKey(keys, key)
		}
	}
	keys = appendUniqueInputKey(keys, ServiceParamInputKey(serviceParam))
	keys = appendUniqueInputKey(keys, strings.TrimSpace(serviceParam.Name))
	for _, key := range paramInputKeys(param) {
		keys = appendUniqueInputKey(keys, key)
	}
	return keys
}

func paramInputKeys(param botmodel.Param) []string {
	keys := []string{}
	keys = appendUniqueInputKey(keys, strings.TrimSpace(param.Key))
	keys = appendUniqueInputKey(keys, strings.TrimSpace(param.Name))
	if param.ID > 0 {
		keys = appendUniqueInputKey(keys, fmt.Sprintf("param_%d", param.ID))
	}
	for _, key := range paramInputAliases(param) {
		keys = appendUniqueInputKey(keys, key)
	}
	return keys
}

func paramInputAliases(param botmodel.Param) []string {
	if isPromptParam(botmodel.ServiceParam{}, param) {
		return promptInputAliases()
	}
	switch strings.TrimSpace(param.Key) {
	case "aspectRatio":
		return []string{"ratio", "aspect_ratio"}
	}
	switch strings.TrimSpace(param.Name) {
	case "比例":
		return []string{"ratio", "aspect_ratio"}
	case "分辨率":
		return []string{"resolution"}
	default:
		return nil
	}
}

func isPromptParam(serviceParam botmodel.ServiceParam, param botmodel.Param) bool {
	for _, value := range []string{param.Key, param.Name, serviceParam.Name} {
		text := strings.ToLower(strings.TrimSpace(value))
		switch text {
		case "prompt", "text", "content", "input":
			return true
		}
		if strings.Contains(text, "prompt") || strings.Contains(text, "提示词") || strings.Contains(text, "提示语") {
			return true
		}
	}
	return false
}

func promptInputAliases() []string {
	return []string{"prompt", "text", "message", "content", "input"}
}

func resolveServiceParamInputValue(
	input map[string]any,
	serviceParam botmodel.ServiceParam,
	param botmodel.Param,
) (string, any, bool) {
	for _, key := range serviceParamInputKeys(serviceParam, param) {
		if value, ok := input[key]; ok && !IsMissing(value) {
			return key, value, true
		}
	}
	if defaultValue := strings.TrimSpace(param.DefaultValue); defaultValue != "" {
		return ServiceParamInputKey(serviceParam), parseDefaultParamValue(param.Type, param.ValueType, defaultValue), true
	}
	return ServiceParamInputKey(serviceParam), nil, false
}

func ResolveParamValue(input map[string]any, param botmodel.Param) (string, any, bool) {
	for _, key := range paramInputKeys(param) {
		if value, ok := input[key]; ok && !IsMissing(value) {
			return key, value, true
		}
	}
	if defaultValue := strings.TrimSpace(param.DefaultValue); defaultValue != "" {
		return strings.TrimSpace(param.Key), parseDefaultParamValue(param.Type, param.ValueType, defaultValue), true
	}
	return strings.TrimSpace(param.Key), nil, false
}
