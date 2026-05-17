package input

import (
	"context"

	botmodel "my/package/bot/model/energon"
)

func NormalizeParamInput(
	ctx context.Context,
	repo Repository,
	powerID uint64,
	serviceID uint64,
	input map[string]any,
	params map[uint64]botmodel.Param,
) map[string]any {
	normalized := map[string]any{}
	normalizeParamInputKeys(ctx, repo, powerID, input, params, normalized)
	normalizeServiceParamInputKeys(ctx, repo, serviceID, input, params, normalized)
	for key, value := range input {
		if _, exists := normalized[key]; !exists {
			normalized[key] = value
		}
	}
	return normalized
}

func normalizeServiceParamInputKeys(
	ctx context.Context,
	repo Repository,
	serviceID uint64,
	input map[string]any,
	params map[uint64]botmodel.Param,
	normalized map[string]any,
) {
	if serviceID == 0 {
		return
	}
	for _, serviceParam := range repo.ServiceParamsByService(ctx, serviceID) {
		if !IsActive(serviceParam.Status) {
			continue
		}
		param, ok := params[serviceParam.ParamID]
		if !ok || !IsActive(param.Status) {
			continue
		}
		for _, key := range serviceParamInputKeys(serviceParam, param) {
			value, exists := input[key]
			if !exists {
				continue
			}
			normalized[key] = normalizeParamInputValue(ctx, param, value)
		}
	}
}

func normalizeParamInputKeys(
	ctx context.Context,
	repo Repository,
	powerID uint64,
	input map[string]any,
	params map[uint64]botmodel.Param,
	normalized map[string]any,
) {
	for _, powerParam := range repo.PowerParamsByPower(ctx, powerID) {
		param, ok := params[powerParam.ParamID]
		if !ok || !IsActive(param.Status) {
			continue
		}
		for _, key := range paramInputKeys(param) {
			value, exists := input[key]
			if !exists {
				continue
			}
			normalized[key] = normalizeParamInputValue(ctx, param, value)
		}
	}
}

func normalizeParamInputValue(ctx context.Context, param botmodel.Param, value any) any {
	switch NormalizeParamControlType(param.Type) {
	case "file", "files":
		return FileValue(ctx, value)
	case "switch":
		return SwitchByType(param.ValueType, value)
	case "multi_option":
		return ListByType(param.ValueType, List(value))
	default:
		return ScalarByType(param.ValueType, value)
	}
}

func parseDefaultParamValue(paramType string, valueType string, value string) any {
	switch NormalizeParamControlType(paramType) {
	case "switch":
		return SwitchByType(valueType, value)
	case "multi_option", "files":
		return ListByType(valueType, List(ParseJSONValue(value)))
	default:
		return ScalarByType(valueType, value)
	}
}
