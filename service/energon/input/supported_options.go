package input

import (
	"context"
	"sort"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
)

// BuildSupportedOptionsForService returns canonical option values backed by
// explicit service mappings. Direct mappings do not imply support for every
// option that may later be added to the shared capability parameter.
func BuildSupportedOptionsForService(
	ctx context.Context,
	repo Repository,
	serviceID uint64,
) map[string][]string {
	allowedOptionIDs := map[uint64]map[uint64]struct{}{}
	for _, serviceParam := range repo.ServiceParamsByService(ctx, serviceID) {
		if !IsActive(serviceParam.Status) {
			continue
		}
		switch serviceParam.ParamRule {
		case paramRuleOptionMap:
			for _, mapping := range DecodeServiceParamOptionMappings(serviceParam.Mapping) {
				addSupportedOptionID(allowedOptionIDs, serviceParam.ParamID, mapping.OptionID)
			}
		case paramRuleComboMap:
			for _, row := range DecodeServiceParamComboMapping(serviceParam.Mapping).Rows {
				for paramID, optionID := range row.Values {
					addSupportedOptionID(allowedOptionIDs, paramID, optionID)
				}
			}
		}
	}

	result := map[string][]string{}
	params := repo.ParamMap(ctx)
	for paramID, optionIDs := range allowedOptionIDs {
		param, exists := params[paramID]
		key := strings.TrimSpace(param.Key)
		if !exists || !IsActive(param.Status) || key == "" {
			continue
		}
		options := append([]botmodel.ParamOption(nil), repo.ParamOptionsByParam(ctx, paramID)...)
		sort.SliceStable(options, func(i, j int) bool {
			if options[i].Sort != options[j].Sort {
				return options[i].Sort < options[j].Sort
			}
			return options[i].ID < options[j].ID
		})
		seenValues := map[string]struct{}{}
		for _, option := range options {
			if _, supported := optionIDs[option.ID]; !supported {
				continue
			}
			value := strings.TrimSpace(option.Value)
			if value == "" {
				continue
			}
			if _, seen := seenValues[value]; seen {
				continue
			}
			seenValues[value] = struct{}{}
			result[key] = append(result[key], value)
		}
	}
	return result
}

func SupportsAllOptionValues(
	supported map[string][]string,
	key string,
	required []string,
) bool {
	requiredValues := normalizedOptionValueSet(required)
	if len(requiredValues) == 0 {
		return true
	}
	supportedValues := normalizedOptionValueSet(supported[strings.TrimSpace(key)])
	for value := range requiredValues {
		if _, exists := supportedValues[value]; !exists {
			return false
		}
	}
	return true
}

func addSupportedOptionID(target map[uint64]map[uint64]struct{}, paramID uint64, optionID uint64) {
	if paramID == 0 || optionID == 0 {
		return
	}
	if target[paramID] == nil {
		target[paramID] = map[uint64]struct{}{}
	}
	target[paramID][optionID] = struct{}{}
}

func normalizedOptionValueSet(values []string) map[string]struct{} {
	result := make(map[string]struct{}, len(values))
	for _, value := range values {
		value = strings.TrimSpace(value)
		if value != "" {
			result[value] = struct{}{}
		}
	}
	return result
}
