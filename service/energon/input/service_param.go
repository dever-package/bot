package input

import (
	"context"
	"fmt"
	"strings"

	"github.com/shemic/dever/util"

	botmodel "my/package/bot/model/energon"
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
		return mapFileParamValue(value), true, nil
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
		items := normalizeInputList(value)
		result := make([]any, 0, len(items))
		for _, item := range items {
			option, ok := matchParamOption(ctx, repo, param.ID, item)
			if !ok {
				return nil, false, fmt.Errorf("参数“%s”的选项“%s”不存在", ServiceParamDisplayName(serviceParam, param), inputValueText(item))
			}
			result = append(result, option.Value)
		}
		return result, len(result) > 0, nil
	}

	option, ok := matchParamOption(ctx, repo, param.ID, value)
	if !ok {
		return nil, false, fmt.Errorf("参数“%s”的选项“%s”不存在", ServiceParamDisplayName(serviceParam, param), inputValueText(value))
	}
	return option.Value, true, nil
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

	selectedIDs, err := selectedParamOptionIDs(ctx, repo, param, value)
	if err != nil {
		return nil, false, err
	}
	if len(selectedIDs) == 0 {
		return nil, false, nil
	}

	nativeByOptionID := map[uint64]string{}
	for _, mapping := range mappings {
		nativeByOptionID[mapping.OptionID] = mapping.NativeValue
	}
	if NormalizeParamControlType(param.Type) == "multi_option" {
		result := make([]any, 0, len(selectedIDs))
		for _, optionID := range selectedIDs {
			nativeValue, ok := nativeByOptionID[optionID]
			if !ok {
				return nil, false, fmt.Errorf("服务参数“%s”的选项映射缺少选项ID %d", serviceParam.Key, optionID)
			}
			result = append(result, nativeValue)
		}
		return result, len(result) > 0, nil
	}

	nativeValue, ok := nativeByOptionID[selectedIDs[0]]
	if !ok {
		return nil, false, fmt.Errorf("服务参数“%s”的选项映射缺少选项ID %d", serviceParam.Key, selectedIDs[0])
	}
	return nativeValue, true, nil
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

func selectedParamOptionIDs(ctx context.Context, repo Repository, param botmodel.Param, value any) ([]uint64, error) {
	values := normalizeInputList(value)
	if len(values) == 0 {
		return nil, nil
	}

	ids := make([]uint64, 0, len(values))
	for _, item := range values {
		option, ok := matchParamOption(ctx, repo, param.ID, item)
		if !ok {
			return nil, fmt.Errorf("参数“%s”的选项“%s”不存在", param.Name, inputValueText(item))
		}
		ids = append(ids, option.ID)
	}
	return ids, nil
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

func mapFileParamValue(value any) any {
	items := normalizeStringInputList(value)
	if len(items) == 0 {
		return value
	}
	if len(items) == 1 {
		return items[0]
	}
	return items
}

func matchParamOption(ctx context.Context, repo Repository, paramID uint64, value any) (botmodel.ParamOption, bool) {
	if paramID == 0 || isMissingInputValue(value) {
		return botmodel.ParamOption{}, false
	}
	targetID := util.ToUint64(value)
	targetText := strings.TrimSpace(inputValueText(value))
	for _, option := range repo.ParamOptionsByParam(ctx, paramID) {
		if targetID > 0 && option.ID == targetID {
			return option, true
		}
		if strings.EqualFold(strings.TrimSpace(option.Value), targetText) {
			return option, true
		}
		if strings.EqualFold(strings.TrimSpace(option.Name), targetText) {
			return option, true
		}
	}
	return botmodel.ParamOption{}, false
}
