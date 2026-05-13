package input

import (
	"context"
	"sort"
	"strings"

	botmodel "my/package/bot/model/energon"
)

type TestParam struct {
	ID           uint64            `json:"id"`
	PowerParamID uint64            `json:"power_param_id"`
	Name         string            `json:"name"`
	Key          string            `json:"key"`
	Type         string            `json:"type"`
	Usage        int16             `json:"usage"`
	ValueType    string            `json:"value_type"`
	DefaultValue string            `json:"default_value"`
	Required     bool              `json:"required"`
	UploadRuleID uint64            `json:"upload_rule_id,omitempty"`
	MaxFiles     int               `json:"max_files,omitempty"`
	Sort         int               `json:"sort"`
	Options      []TestParamOption `json:"options,omitempty"`
}

type TestParamOption struct {
	ID          uint64 `json:"id"`
	Name        string `json:"name"`
	Value       string `json:"value"`
	NativeValue string `json:"native_value"`
	Sort        int    `json:"sort"`
}

type TestParamConfig struct {
	SourceRule       int16        `json:"source_rule"`
	SelectedTargetID uint64       `json:"selected_target_id"`
	Sources          []TestSource `json:"sources"`
	Params           []TestParam  `json:"params"`
}

type TestSource struct {
	ID           uint64 `json:"id"`
	TargetID     uint64 `json:"target_id"`
	ServiceID    uint64 `json:"service_id"`
	ServiceName  string `json:"service_name"`
	ProviderID   uint64 `json:"provider_id,omitempty"`
	ProviderName string `json:"provider_name,omitempty"`
	Name         string `json:"name"`
	Sort         int    `json:"sort"`
}

type testParamOptionFilter struct {
	restricted   bool
	unrestricted bool
	allowedIDs   map[uint64]struct{}
}

type testParamRowConfig struct {
	ID     uint64
	Name   string
	Key    string
	Sort   int
	Filter testParamOptionFilter
}

func BuildTestParams(ctx context.Context, repo Repository, powerID uint64, serviceID uint64) []TestParam {
	params := repo.ParamMap(ctx)
	serviceParamIDs := ActiveServiceParamIDs(ctx, repo, serviceID)
	optionFilters := testParamOptionFilters(ctx, repo, serviceID, params)
	powerParamsByParamID := map[uint64][]botmodel.PowerParam{}
	for _, powerParam := range repo.PowerParamsByPower(ctx, powerID) {
		param, ok := params[powerParam.ParamID]
		if !ok || !IsActive(param.Status) {
			continue
		}
		powerParamsByParamID[param.ID] = append(powerParamsByParamID[param.ID], powerParam)
	}

	rows := make([]TestParam, 0)
	usedPowerParams := map[uint64]struct{}{}
	serviceCoveredParams := map[uint64]struct{}{}
	if serviceID > 0 {
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
			serviceCoveredParams[param.ID] = struct{}{}
			rows = append(rows, buildTestParamRow(ctx, repo, param, powerParam, testParamRowConfig{
				ID:     serviceParam.ID,
				Name:   ServiceParamDisplayName(serviceParam, param),
				Key:    testParamInputKey(serviceParam, param),
				Sort:   testParamSort(powerParam.Sort, serviceParam.Sort),
				Filter: optionFilters[param.ID],
			}))
		}
	}

	seenDefaultParams := map[uint64]struct{}{}
	for _, powerParams := range powerParamsByParamID {
		for _, powerParam := range powerParams {
			if _, used := usedPowerParams[powerParam.ID]; used {
				continue
			}
			if !ShowPowerParamForSource(powerParam, serviceParamIDs) {
				continue
			}
			param, ok := params[powerParam.ParamID]
			if !ok || !IsActive(param.Status) {
				continue
			}
			if _, covered := serviceCoveredParams[param.ID]; covered {
				continue
			}
			if _, exists := seenDefaultParams[param.ID]; exists {
				continue
			}
			seenDefaultParams[param.ID] = struct{}{}

			rows = append(rows, buildTestParamRow(ctx, repo, param, powerParam, testParamRowConfig{
				ID:     param.ID,
				Name:   param.Name,
				Key:    param.Key,
				Sort:   powerParam.Sort,
				Filter: optionFilters[param.ID],
			}))
		}
	}

	sort.SliceStable(rows, func(i, j int) bool {
		if rows[i].Sort != rows[j].Sort {
			return rows[i].Sort < rows[j].Sort
		}
		return rows[i].ID < rows[j].ID
	})
	return rows
}

func buildTestParamRow(
	ctx context.Context,
	repo Repository,
	param botmodel.Param,
	powerParam botmodel.PowerParam,
	config testParamRowConfig,
) TestParam {
	row := TestParam{
		ID:           config.ID,
		PowerParamID: powerParam.ID,
		Name:         testParamName(param, config.Name),
		Key:          strings.TrimSpace(config.Key),
		Type:         NormalizeParamControlType(param.Type),
		Usage:        normalizeParamUsage(param.Usage),
		ValueType:    NormalizeParamValueType(param.ValueType),
		DefaultValue: strings.TrimSpace(param.DefaultValue),
		Required:     PowerParamRequiresInput(powerParam),
		UploadRuleID: param.UploadRuleID,
		MaxFiles:     param.MaxFiles,
		Sort:         config.Sort,
	}
	if IsOptionParamType(row.Type) {
		row.Options = testParamOptions(ctx, repo, param.ID, config.Filter)
	}
	return row
}

func testParamOptionFilters(
	ctx context.Context,
	repo Repository,
	serviceID uint64,
	params map[uint64]botmodel.Param,
) map[uint64]testParamOptionFilter {
	result := map[uint64]testParamOptionFilter{}
	if serviceID == 0 {
		return result
	}
	for _, serviceParam := range repo.ServiceParamsByService(ctx, serviceID) {
		if !IsActive(serviceParam.Status) {
			continue
		}

		if serviceParam.ParamRule == paramRuleComboMap {
			for _, row := range DecodeServiceParamComboMapping(serviceParam.Mapping).Rows {
				for paramID, optionID := range row.Values {
					if _, ok := params[paramID]; !ok || optionID == 0 {
						continue
					}
					comboFilter := result[paramID]
					comboFilter.restricted = true
					if comboFilter.allowedIDs == nil {
						comboFilter.allowedIDs = map[uint64]struct{}{}
					}
					comboFilter.allowedIDs[optionID] = struct{}{}
					result[paramID] = comboFilter
				}
			}
			continue
		}

		param, ok := params[serviceParam.ParamID]
		if !ok || !IsOptionParamType(param.Type) {
			continue
		}

		filter := result[serviceParam.ParamID]
		switch serviceParam.ParamRule {
		case paramRuleOptionMap:
			filter.restricted = true
			if filter.allowedIDs == nil {
				filter.allowedIDs = map[uint64]struct{}{}
			}
			for _, mapping := range DecodeServiceParamOptionMappings(serviceParam.Mapping) {
				filter.allowedIDs[mapping.OptionID] = struct{}{}
			}
		case paramRuleDirect, 0:
			filter.unrestricted = true
		}
		result[serviceParam.ParamID] = filter
	}
	return result
}

func testParamOptions(
	ctx context.Context,
	repo Repository,
	paramID uint64,
	filter testParamOptionFilter,
) []TestParamOption {
	options := repo.ParamOptionsByParam(ctx, paramID)
	if len(options) == 0 {
		return nil
	}

	rows := make([]TestParamOption, 0, len(options))
	for _, option := range options {
		if filter.restricted && !filter.unrestricted {
			if _, ok := filter.allowedIDs[option.ID]; !ok {
				continue
			}
		}
		rows = append(rows, TestParamOption{
			ID:          option.ID,
			Name:        option.Name,
			Value:       optionLabel(option),
			NativeValue: option.Value,
			Sort:        option.Sort,
		})
	}
	sort.SliceStable(rows, func(i, j int) bool {
		if rows[i].Sort != rows[j].Sort {
			return rows[i].Sort < rows[j].Sort
		}
		return rows[i].ID < rows[j].ID
	})
	return rows
}

func testParamSort(powerSort int, serviceSort int) int {
	if serviceSort > 0 {
		return serviceSort
	}
	return powerSort
}

func normalizeParamUsage(value int16) int16 {
	if value == paramUsageToolbar {
		return paramUsageToolbar
	}
	return paramUsageMain
}

func testParamName(param botmodel.Param, serviceParamName string) string {
	if name := strings.TrimSpace(serviceParamName); name != "" {
		return name
	}
	return param.Name
}

func testParamInputKey(serviceParam botmodel.ServiceParam, param botmodel.Param) string {
	if serviceParam.ParamRule == paramRuleComboMap {
		return strings.TrimSpace(param.Key)
	}
	return ServiceParamInputKey(serviceParam)
}

func optionLabel(option botmodel.ParamOption) string {
	if name := strings.TrimSpace(option.Name); name != "" {
		return name
	}
	return strings.TrimSpace(option.Value)
}
