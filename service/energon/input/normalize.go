package input

import (
	"context"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
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
			if value, tracked := normalized[key]; tracked && !IsMissing(value) {
				continue
			}
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
	powerParams := repo.PowerParamsByPower(ctx, powerID)
	configuredKeys := map[string]struct{}{}
	for _, powerParam := range powerParams {
		param, ok := params[powerParam.ParamID]
		if !ok || !IsActive(param.Status) {
			continue
		}
		if key := strings.ToLower(strings.TrimSpace(param.Key)); key != "" {
			configuredKeys[key] = struct{}{}
		}
	}

	for _, powerParam := range powerParams {
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
		normalizeParamInputAlias(ctx, input, param, configuredKeys, normalized)
	}
}

func normalizeParamInputAlias(
	ctx context.Context,
	input map[string]any,
	param botmodel.Param,
	configuredKeys map[string]struct{},
	normalized map[string]any,
) {
	if !IsFileParamType(param.Type) {
		return
	}
	key := strings.TrimSpace(param.Key)
	alias := paramInputAlias(key)
	if key == "" || alias == "" {
		return
	}
	if _, configured := configuredKeys[strings.ToLower(alias)]; configured {
		return
	}
	if exactValue, exactExists := input[key]; exactExists && !IsMissing(exactValue) {
		if _, aliasExists := input[alias]; aliasExists {
			normalized[alias] = nil
		}
		return
	}
	value, exists := input[alias]
	if !exists || IsMissing(value) {
		return
	}
	normalized[key] = normalizeParamInputValue(ctx, param, value)
	// The alias is an input spelling, not an additional provider field.
	normalized[alias] = nil
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
