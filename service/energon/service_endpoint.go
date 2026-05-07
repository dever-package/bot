package energon

import (
	"context"
	"fmt"
	"sort"
	"strings"

	botmodel "my/package/bot/model/energon"
	botprotocol "my/package/bot/service/energon/protocol"
)

func (s GatewayService) applyServiceEndpoint(
	ctx context.Context,
	selected selectedTarget,
	mapped botprotocol.MappedInput,
) (selectedTarget, error) {
	endpoint, ok := s.selectServiceEndpoint(ctx, selected.Service.ID, mapped)
	if !ok {
		return selectedTarget{}, missingServiceEndpointError(selected.Service)
	}
	if api := strings.TrimSpace(endpoint.Api); api != "" {
		selected.ServiceAPI = api
	}
	if strings.TrimSpace(selected.ServiceAPI) == "" {
		return selectedTarget{}, missingServiceEndpointError(selected.Service)
	}
	return selected, nil
}

func (s GatewayService) selectServiceEndpoint(
	ctx context.Context,
	serviceID uint64,
	mapped botprotocol.MappedInput,
) (botmodel.ServiceEndpoint, bool) {
	endpoints := activeServiceEndpoints(s.repo.ServiceEndpointsByService(ctx, serviceID))
	if len(endpoints) == 0 {
		return botmodel.ServiceEndpoint{}, false
	}

	paramMap := s.repo.ParamMap(ctx)
	defaults := make([]botmodel.ServiceEndpoint, 0, 1)
	for _, endpoint := range endpoints {
		paramIDs := decodeEndpointParamIDs(endpoint.ParamIds)
		if len(paramIDs) == 0 {
			defaults = append(defaults, endpoint)
			continue
		}
		if endpointParamsMatch(mapped, paramMap, paramIDs, endpoint.ParamMode) {
			return endpoint, true
		}
	}

	if len(defaults) > 0 {
		return defaults[0], true
	}
	return botmodel.ServiceEndpoint{}, false
}

func missingServiceEndpointError(service botmodel.Service) error {
	return fmt.Errorf("来源服务“%s”没有可用服务接口", service.Name)
}

func decodeEndpointParamIDs(value string) []uint64 {
	raw := decodeMappingArray(value)
	result := make([]uint64, 0, len(raw))
	seen := map[uint64]struct{}{}
	for _, item := range raw {
		paramID := endpointParamID(item)
		if paramID == 0 {
			continue
		}
		if _, exists := seen[paramID]; exists {
			continue
		}
		seen[paramID] = struct{}{}
		result = append(result, paramID)
	}
	return result
}

func activeServiceEndpoints(rows []botmodel.ServiceEndpoint) []botmodel.ServiceEndpoint {
	result := make([]botmodel.ServiceEndpoint, 0, len(rows))
	for _, row := range rows {
		if isActive(row.Status) {
			result = append(result, row)
		}
	}
	sort.SliceStable(result, func(i, j int) bool {
		if result[i].Sort == result[j].Sort {
			return result[i].ID < result[j].ID
		}
		return result[i].Sort < result[j].Sort
	})
	return result
}

func endpointParamsMatch(
	mapped botprotocol.MappedInput,
	params map[uint64]botmodel.Param,
	paramIDs []uint64,
	paramMode string,
) bool {
	if len(paramIDs) == 0 {
		return true
	}

	switch normalizeEndpointParamMode(paramMode) {
	case endpointParamModeAny:
		for _, paramID := range paramIDs {
			if endpointParamHasValue(mapped, params, paramID) {
				return true
			}
		}
		return false
	default:
		for _, paramID := range paramIDs {
			if !endpointParamHasValue(mapped, params, paramID) {
				return false
			}
		}
		return true
	}
}

func endpointParamHasValue(
	mapped botprotocol.MappedInput,
	params map[uint64]botmodel.Param,
	paramID uint64,
) bool {
	for _, item := range mapped.Params {
		if item.ParamID == paramID && !isMissingInputValue(item.Value) {
			return true
		}
	}

	param, ok := params[paramID]
	if !ok {
		return false
	}
	_, _, exists := resolveInputParamValue(mapped.Original, param)
	return exists
}
