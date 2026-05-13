package input

import (
	"context"
	"fmt"
	"strings"

	botmodel "my/package/bot/model/energon"
	botprotocol "my/package/bot/service/energon/protocol"
)

func BuildMapped(
	ctx context.Context,
	repo Repository,
	req *botprotocol.ShemicRequest,
	target Target,
) (botprotocol.MappedInput, error) {
	labels := inputParamLabels(ctx, repo, target.PowerID, target.ServiceID)
	params := repo.ParamMap(ctx)
	normalized := NormalizeParamInput(ctx, repo, target.PowerID, target.ServiceID, req.Input, params)
	mapped := botprotocol.NewMappedInput(normalized, labels)

	if err := validatePowerMainParams(ctx, repo, target.PowerID, target.ServiceID, normalized, params); err != nil {
		return mapped, err
	}

	serviceParams := repo.ServiceParamsByService(ctx, target.ServiceID)
	if len(serviceParams) == 0 {
		return mapped, nil
	}

	requiredServiceParamIDs := requiredServiceParamIDs(ctx, repo, target.PowerID, target.ServiceID, params)
	comboConsumedParamIDs := collectComboConsumedParamIDs(serviceParams)
	for _, serviceParam := range serviceParams {
		if !IsActive(serviceParam.Status) {
			continue
		}
		if serviceParam.ParamRule == paramRuleFixedMap {
			mapped.Params = append(mapped.Params, botprotocol.MappedParam{
				ParamID:   0,
				ParamKey:  "",
				InputKey:  "",
				ParamName: strings.TrimSpace(serviceParam.Name),
				ParamType: "fixed",
				NativeKey: serviceParam.Key,
				ParamRule: serviceParam.ParamRule,
				Value:     serviceParam.Mapping,
			})
			continue
		}

		param, ok := params[serviceParam.ParamID]
		if !ok {
			return mapped, fmt.Errorf("服务参数“%s”绑定的内部参数不存在", serviceParam.Key)
		}
		if !IsActive(param.Status) {
			return mapped, fmt.Errorf("服务参数“%s”绑定的内部参数“%s”已停用", serviceParam.Key, param.Name)
		}
		if NormalizeParamControlType(param.Type) == "description" {
			continue
		}

		if serviceParam.ParamRule == paramRuleComboMap {
			nativeValue, mappedOK, err := mapComboServiceParamValue(ctx, repo, serviceParam, normalized, params, serviceParams)
			if err != nil {
				return mapped, err
			}
			if !mappedOK {
				continue
			}
			mapped.Params = append(mapped.Params, botprotocol.MappedParam{
				ParamID:   param.ID,
				ParamKey:  strings.TrimSpace(param.Key),
				InputKey:  comboInputKey(serviceParam.Mapping, params, serviceParams),
				ParamName: ServiceParamDisplayName(serviceParam, param),
				ParamType: NormalizeParamControlType(param.Type),
				NativeKey: serviceParam.Key,
				ParamRule: serviceParam.ParamRule,
				Value:     nativeValue,
			})
			continue
		}

		if comboConsumedParamIDs[serviceParam.ParamID] {
			continue
		}

		inputKey, value, exists := resolveServiceParamInputValue(normalized, serviceParam, param)
		if !exists {
			if requiredServiceParamIDs[serviceParam.ID] && ParamRequiresInput(param) {
				return mapped, fmt.Errorf("缺少必填参数“%s”", ServiceParamDisplayName(serviceParam, param))
			}
			continue
		}

		nativeValue, mappedOK, err := mapServiceParamValue(ctx, repo, serviceParam, param, value)
		if err != nil {
			return mapped, err
		}
		if !mappedOK {
			continue
		}

		mapped.Params = append(mapped.Params, botprotocol.MappedParam{
			ParamID:   param.ID,
			ParamKey:  strings.TrimSpace(param.Key),
			InputKey:  inputKey,
			ParamName: ServiceParamDisplayName(serviceParam, param),
			ParamType: NormalizeParamControlType(param.Type),
			NativeKey: serviceParam.Key,
			ParamRule: serviceParam.ParamRule,
			Value:     nativeValue,
		})
	}
	applyPromptMappedParams(&mapped)

	return mapped, nil
}

func validatePowerMainParams(
	ctx context.Context,
	repo Repository,
	powerID uint64,
	serviceID uint64,
	input map[string]any,
	params map[uint64]botmodel.Param,
) error {
	serviceParamIDs := ActiveServiceParamIDs(ctx, repo, serviceID)
	for _, powerParam := range repo.PowerParamsByPower(ctx, powerID) {
		if !PowerParamRequiresInput(powerParam) {
			continue
		}
		param, ok := params[powerParam.ParamID]
		if !ok || !IsActive(param.Status) || !ParamRequiresInput(param) {
			continue
		}
		if serviceParamIDs[param.ID] {
			continue
		}
		if _, _, exists := ResolveParamValue(input, param); !exists {
			return fmt.Errorf("缺少必填参数“%s”", param.Name)
		}
	}
	return nil
}

func inputParamLabels(ctx context.Context, repo Repository, powerID uint64, serviceID uint64) map[string]string {
	labels := map[string]string{}
	params := repo.ParamMap(ctx)

	for _, powerParam := range repo.PowerParamsByPower(ctx, powerID) {
		if param, ok := params[powerParam.ParamID]; ok {
			addInputParamLabels(labels, param)
		}
	}
	for _, serviceParam := range repo.ServiceParamsByService(ctx, serviceID) {
		if !IsActive(serviceParam.Status) {
			continue
		}
		if param, ok := params[serviceParam.ParamID]; ok {
			addServiceParamInputLabels(labels, serviceParam, param)
		}
	}
	return labels
}

func requiredServiceParamIDs(
	ctx context.Context,
	repo Repository,
	powerID uint64,
	serviceID uint64,
	params map[uint64]botmodel.Param,
) map[uint64]bool {
	result := map[uint64]bool{}
	if serviceID == 0 {
		return result
	}

	serviceParamIDs := ActiveServiceParamIDs(ctx, repo, serviceID)
	powerParamsByParamID := map[uint64][]botmodel.PowerParam{}
	for _, powerParam := range repo.PowerParamsByPower(ctx, powerID) {
		if _, ok := params[powerParam.ParamID]; !ok {
			continue
		}
		powerParamsByParamID[powerParam.ParamID] = append(powerParamsByParamID[powerParam.ParamID], powerParam)
	}

	usedPowerParams := map[uint64]struct{}{}
	for _, serviceParam := range repo.ServiceParamsByService(ctx, serviceID) {
		if !IsActive(serviceParam.Status) {
			continue
		}
		param, ok := params[serviceParam.ParamID]
		if !ok || !IsActive(param.Status) {
			continue
		}
		powerParam, ok := PickPowerParam(powerParamsByParamID[param.ID], usedPowerParams)
		if !ok || !ShowPowerParamForSource(powerParam, serviceParamIDs) {
			continue
		}
		result[serviceParam.ID] = PowerParamRequiresInput(powerParam)
	}
	return result
}

func ActiveServiceParamIDs(ctx context.Context, repo Repository, serviceID uint64) map[uint64]bool {
	if serviceID == 0 {
		return nil
	}
	result := map[uint64]bool{}
	for _, serviceParam := range repo.ServiceParamsByService(ctx, serviceID) {
		if !IsActive(serviceParam.Status) {
			continue
		}
		if serviceParam.ParamID > 0 {
			result[serviceParam.ParamID] = true
		}
		if serviceParam.ParamRule == paramRuleComboMap {
			for _, paramID := range DecodeServiceParamComboMapping(serviceParam.Mapping).ParamIDs {
				if paramID > 0 {
					result[paramID] = true
				}
			}
		}
	}
	return result
}
