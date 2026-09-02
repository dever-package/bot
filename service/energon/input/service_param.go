package input

import (
	"context"
	"fmt"
	"strings"

	"github.com/shemic/dever/util"

	botmodel "github.com/dever-package/bot/model/energon"
)

func mapServiceParamValue(
	ctx context.Context,
	repo Repository,
	serviceParam botmodel.ServiceParam,
	param botmodel.Param,
	value any,
) (any, bool, error) {
	switch serviceParam.ParamRule {
	case paramRuleOptionMap:
		return mapOptionParamValue(ctx, repo, serviceParam, param, value)
	case paramRuleFileMap:
		return mapAttachmentParamValue(value, serviceParam.Mapping)
	case paramRuleDirect, 0:
		return mapDirectOptionParamValue(ctx, repo, serviceParam, param, value)
	default:
		return value, true, nil
	}
}

func mapDirectOptionParamValue(
	ctx context.Context,
	repo Repository,
	serviceParam botmodel.ServiceParam,
	param botmodel.Param,
	value any,
) (any, bool, error) {
	if !IsOptionParamType(param.Type) {
		return value, true, nil
	}

	if NormalizeParamControlType(param.Type) == "multi_option" {
		items := List(value)
		result := make([]any, 0, len(items))
		for _, item := range items {
			option, ok := matchParamOption(ctx, repo, param.ID, item)
			if !ok {
				return nil, false, fmt.Errorf("参数“%s”的选项“%s”不存在", ServiceParamDisplayName(serviceParam, param), ValueText(item))
			}
			result = append(result, ScalarByType(param.ValueType, option.Value))
		}
		return result, len(result) > 0, nil
	}

	option, ok := matchParamOption(ctx, repo, param.ID, value)
	if !ok {
		return nil, false, fmt.Errorf("参数“%s”的选项“%s”不存在", ServiceParamDisplayName(serviceParam, param), ValueText(value))
	}
	return ScalarByType(param.ValueType, option.Value), true, nil
}

func mapOptionParamValue(
	ctx context.Context,
	repo Repository,
	serviceParam botmodel.ServiceParam,
	param botmodel.Param,
	value any,
) (any, bool, error) {
	mappings := DecodeServiceParamOptionMappings(serviceParam.Mapping)
	if len(mappings) == 0 {
		return nil, false, fmt.Errorf("服务参数“%s”的选项映射为空", serviceParam.Key)
	}

	selectedOptions, err := selectedParamOptions(ctx, repo, param, value)
	if err != nil {
		return nil, false, err
	}
	if len(selectedOptions) == 0 {
		return nil, false, nil
	}

	nativeByOptionID := map[uint64]string{}
	for _, mapping := range mappings {
		nativeByOptionID[mapping.OptionID] = mapping.NativeValue
	}
	if NormalizeParamControlType(param.Type) == "multi_option" {
		result := make([]any, 0, len(selectedOptions))
		for _, option := range selectedOptions {
			nativeValue, ok := nativeByOptionID[option.ID]
			if !ok {
				return nil, false, fmt.Errorf("服务参数“%s”的选项映射缺少选项ID %d", serviceParam.Key, option.ID)
			}
			result = append(result, ScalarByType(param.ValueType, resolveOptionNativeValue(nativeValue, option.Value)))
		}
		return result, len(result) > 0, nil
	}

	selectedOption := selectedOptions[0]
	nativeValue, ok := nativeByOptionID[selectedOption.ID]
	if !ok {
		return nil, false, fmt.Errorf("服务参数“%s”的选项映射缺少选项ID %d", serviceParam.Key, selectedOption.ID)
	}
	return ScalarByType(param.ValueType, resolveOptionNativeValue(nativeValue, selectedOption.Value)), true, nil
}

func mapComboServiceParamValue(
	ctx context.Context,
	repo Repository,
	serviceParam botmodel.ServiceParam,
	input map[string]any,
	params map[uint64]botmodel.Param,
	serviceParams []botmodel.ServiceParam,
) (any, bool, error) {
	mapping := DecodeServiceParamComboMapping(serviceParam.Mapping)
	if len(mapping.ParamIDs) == 0 || len(mapping.Rows) == 0 {
		return nil, false, fmt.Errorf("服务参数“%s”的组合映射为空", serviceParam.Key)
	}

	selected := map[uint64]uint64{}
	for _, paramID := range mapping.ParamIDs {
		param, ok := params[paramID]
		if !ok || !IsActive(param.Status) {
			return nil, false, fmt.Errorf("服务参数“%s”的组合映射绑定的参数不存在或已停用", serviceParam.Key)
		}

		inputKey, value, exists := resolveComboParamInputValue(input, paramID, param, serviceParams)
		if !exists {
			if ParamRequiresInput(param) {
				return nil, false, fmt.Errorf("服务参数“%s”的组合映射缺少参数“%s”", serviceParam.Key, ServiceParamDisplayName(botmodel.ServiceParam{Key: inputKey}, param))
			}
			return nil, false, nil
		}

		option, ok := matchParamOption(ctx, repo, param.ID, value)
		if !ok {
			return nil, false, fmt.Errorf("服务参数“%s”的组合映射参数“%s”选项不存在", serviceParam.Key, ServiceParamDisplayName(botmodel.ServiceParam{Key: inputKey}, param))
		}
		selected[paramID] = option.ID
	}

	for _, row := range mapping.Rows {
		if comboMappingRowMatches(row, selected) {
			return row.NativeValue, true, nil
		}
	}
	return nil, false, fmt.Errorf("服务参数“%s”的组合映射没有匹配当前参数组合", serviceParam.Key)
}

func resolveComboParamInputValue(
	input map[string]any,
	paramID uint64,
	param botmodel.Param,
	serviceParams []botmodel.ServiceParam,
) (string, any, bool) {
	for _, serviceParam := range serviceParams {
		if !IsActive(serviceParam.Status) || serviceParam.ParamID != paramID || serviceParam.ParamRule == paramRuleComboMap {
			continue
		}
		if key, value, exists := resolveServiceParamInputValue(input, serviceParam, param); exists {
			return key, value, true
		}
	}
	return ResolveParamValue(input, param)
}

func selectedParamOptions(ctx context.Context, repo Repository, param botmodel.Param, value any) ([]botmodel.ParamOption, error) {
	values := List(value)
	if len(values) == 0 {
		return nil, nil
	}

	options := make([]botmodel.ParamOption, 0, len(values))
	for _, item := range values {
		option, ok := matchParamOption(ctx, repo, param.ID, item)
		if !ok {
			return nil, fmt.Errorf("参数“%s”的选项“%s”不存在", param.Name, ValueText(item))
		}
		options = append(options, option)
	}
	return options, nil
}

func comboMappingRowMatches(row ServiceParamComboRow, selected map[uint64]uint64) bool {
	if len(row.Values) == 0 {
		return false
	}
	for paramID, optionID := range row.Values {
		if selected[paramID] != optionID {
			return false
		}
	}
	return true
}

func collectComboConsumedParamIDs(serviceParams []botmodel.ServiceParam) map[uint64]bool {
	result := map[uint64]bool{}
	for _, serviceParam := range serviceParams {
		if !IsActive(serviceParam.Status) || serviceParam.ParamRule != paramRuleComboMap {
			continue
		}
		for _, paramID := range DecodeServiceParamComboMapping(serviceParam.Mapping).ParamIDs {
			result[paramID] = true
		}
	}
	return result
}

func comboInputKey(mapping string, params map[uint64]botmodel.Param, serviceParams []botmodel.ServiceParam) string {
	combo := DecodeServiceParamComboMapping(mapping)
	keys := make([]string, 0, len(combo.ParamIDs))
	for _, paramID := range combo.ParamIDs {
		if param, ok := params[paramID]; ok {
			key := strings.TrimSpace(param.Key)
			for _, serviceParam := range serviceParams {
				if serviceParam.ParamID == paramID && serviceParam.ParamRule != paramRuleComboMap {
					key = ServiceParamInputKey(serviceParam)
					break
				}
			}
			keys = appendUniqueInputKey(keys, key)
		}
	}
	return strings.Join(keys, "+")
}

func appendUniqueInputKey(keys []string, key string) []string {
	key = strings.TrimSpace(key)
	if key == "" {
		return keys
	}
	for _, exists := range keys {
		if exists == key {
			return keys
		}
	}
	return append(keys, key)
}

func mapAttachmentParamValue(value any, mapping string) (any, bool, error) {
	items := StringList(value)
	if len(items) == 0 {
		return nil, false, nil
	}

	indexes, err := DecodeServiceParamAttachmentIndexes(mapping)
	if err != nil {
		return nil, false, err
	}

	selected := make([]string, 0, len(indexes))
	for _, index := range indexes {
		if index > len(items) {
			continue
		}
		selected = append(selected, items[index-1])
	}
	if len(selected) == 0 {
		return nil, false, nil
	}
	if len(indexes) == 1 {
		return selected[0], true, nil
	}
	return selected, true, nil
}

func matchParamOption(ctx context.Context, repo Repository, paramID uint64, value any) (botmodel.ParamOption, bool) {
	if paramID == 0 || IsMissing(value) {
		return botmodel.ParamOption{}, false
	}
	targetID := util.ToUint64(value)
	targetText := strings.TrimSpace(ValueText(value))
	options := repo.ParamOptionsByParam(ctx, paramID)
	for _, option := range options {
		if strings.EqualFold(strings.TrimSpace(option.Value), targetText) {
			return option, true
		}
	}
	for _, option := range options {
		if strings.EqualFold(strings.TrimSpace(option.Name), targetText) {
			return option, true
		}
	}
	for _, option := range options {
		if targetID > 0 && option.ID == targetID {
			return option, true
		}
	}
	return botmodel.ParamOption{}, false
}
