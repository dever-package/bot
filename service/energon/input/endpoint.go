package input

import (
	"context"
	"sort"

	"github.com/shemic/dever/util"

	botmodel "my/package/bot/model/energon"
	botprotocol "my/package/bot/service/energon/protocol"
)

func SelectEndpoint(
	ctx context.Context,
	repo Repository,
	serviceID uint64,
	mapped botprotocol.MappedInput,
) (botmodel.ServiceEndpoint, bool) {
	endpoints := activeServiceEndpoints(repo.ServiceEndpointsByService(ctx, serviceID))
	if len(endpoints) == 0 {
		return botmodel.ServiceEndpoint{}, false
	}

	paramMap := repo.ParamMap(ctx)
	defaults := make([]botmodel.ServiceEndpoint, 0, 1)
	for _, endpoint := range endpoints {
		paramIDs := DecodeEndpointParamIDs(endpoint.ParamIds)
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

func DecodeEndpointParamIDs(value string) []uint64 {
	raw := decodeMappingArray(value)
	result := make([]uint64, 0, len(raw))
	seen := map[uint64]struct{}{}
	for _, item := range raw {
		paramID := EndpointParamID(item)
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

func EndpointParamID(value any) uint64 {
	if row, ok := value.(map[string]any); ok {
		return util.ToUint64(row["param_id"])
	}
	return util.ToUint64(value)
}

func activeServiceEndpoints(rows []botmodel.ServiceEndpoint) []botmodel.ServiceEndpoint {
	result := make([]botmodel.ServiceEndpoint, 0, len(rows))
	for _, row := range rows {
		if IsActive(row.Status) {
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

	switch NormalizeEndpointParamMode(paramMode) {
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
		if item.ParamID == paramID && !IsMissing(item.Value) {
			return true
		}
	}

	param, ok := params[paramID]
	if !ok {
		return false
	}
	_, _, exists := ResolveParamValue(mapped.Original, param)
	return exists
}
