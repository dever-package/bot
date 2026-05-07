package energon

import (
	"context"
	"fmt"
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

func (s GatewayService) TestParams(ctx context.Context, powerKey string) ([]TestParam, error) {
	config, err := s.TestParamConfig(ctx, powerKey, 0)
	if err != nil {
		return nil, err
	}
	return config.Params, nil
}

func (s GatewayService) TestParamConfig(ctx context.Context, powerKey string, targetID uint64) (TestParamConfig, error) {
	powerKey = strings.TrimSpace(powerKey)
	if powerKey == "" {
		return TestParamConfig{}, fmt.Errorf("能力不能为空")
	}

	power, ok := s.repo.PowerByName(ctx, powerKey)
	if !ok {
		return TestParamConfig{}, fmt.Errorf("未匹配到能力: %s", powerKey)
	}

	sourceRule := normalizePowerSourceRule(int(power.SourceRule))
	if sourceRule != powerSourceRulePick {
		targetID = 0
	}
	sources, selectedTargetID := s.testSources(ctx, power, targetID)
	params := s.testParamsForTarget(ctx, power.ID, selectedTargetID)
	return TestParamConfig{
		SourceRule:       sourceRule,
		SelectedTargetID: selectedTargetID,
		Sources:          sources,
		Params:           params,
	}, nil
}

func (s GatewayService) testParamsForTarget(ctx context.Context, powerID uint64, targetID uint64) []TestParam {
	params := s.repo.ParamMap(ctx)
	targetServiceID := uint64(0)
	if targetID > 0 {
		if target, ok := s.repo.FindPowerTarget(ctx, targetID); ok && target.PowerID == powerID && isActive(target.Status) {
			targetServiceID = target.ServiceID
		}
	}
	serviceParamIDs := s.activeServiceParamIDs(ctx, targetServiceID)
	optionFilters := s.testParamOptionFilters(ctx, targetServiceID, params)
	powerParamsByParamID := map[uint64][]botmodel.PowerParam{}
	for _, powerParam := range s.repo.PowerParamsByPower(ctx, powerID) {
		param, ok := params[powerParam.ParamID]
		if !ok || !isActive(param.Status) {
			continue
		}
		powerParamsByParamID[param.ID] = append(powerParamsByParamID[param.ID], powerParam)
	}

	rows := make([]TestParam, 0)
	usedPowerParams := map[uint64]struct{}{}
	serviceCoveredParams := map[uint64]struct{}{}
	if targetServiceID > 0 {
		for _, serviceParam := range s.repo.ServiceParamsByService(ctx, targetServiceID) {
			if !isActive(serviceParam.Status) {
				continue
			}
			param, ok := params[serviceParam.ParamID]
			if !ok || !isActive(param.Status) {
				continue
			}
			powerParam, ok := pickTestPowerParam(powerParamsByParamID[param.ID], usedPowerParams)
			if !ok || !showTestParamForSource(powerParam, serviceParamIDs) {
				continue
			}
			serviceCoveredParams[param.ID] = struct{}{}
			rows = append(rows, s.buildTestParamRow(ctx, param, powerParam, testParamRowConfig{
				ID:     serviceParam.ID,
				Name:   serviceParamDisplayName(serviceParam, param),
				Key:    serviceParamInputKey(serviceParam),
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
			if !showTestParamForSource(powerParam, serviceParamIDs) {
				continue
			}
			param, ok := params[powerParam.ParamID]
			if !ok || !isActive(param.Status) {
				continue
			}
			if _, covered := serviceCoveredParams[param.ID]; covered {
				continue
			}
			if _, exists := seenDefaultParams[param.ID]; exists {
				continue
			}
			seenDefaultParams[param.ID] = struct{}{}

			rows = append(rows, s.buildTestParamRow(ctx, param, powerParam, testParamRowConfig{
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

type testParamRowConfig struct {
	ID     uint64
	Name   string
	Key    string
	Sort   int
	Filter testParamOptionFilter
}

func (s GatewayService) buildTestParamRow(
	ctx context.Context,
	param botmodel.Param,
	powerParam botmodel.PowerParam,
	config testParamRowConfig,
) TestParam {
	row := TestParam{
		ID:           config.ID,
		PowerParamID: powerParam.ID,
		Name:         testParamName(param, config.Name),
		Key:          strings.TrimSpace(config.Key),
		Type:         normalizeParamControlType(param.Type),
		Usage:        normalizeParamUsage(param.Usage),
		ValueType:    normalizeParamValueType(param.ValueType),
		DefaultValue: strings.TrimSpace(param.DefaultValue),
		Required:     powerParamRequiresInput(powerParam),
		UploadRuleID: param.UploadRuleID,
		MaxFiles:     param.MaxFiles,
		Sort:         config.Sort,
	}
	if isOptionParamType(row.Type) {
		row.Options = s.testParamOptions(ctx, param.ID, config.Filter)
	}
	return row
}

func powerParamRequiresInput(powerParam botmodel.PowerParam) bool {
	return normalizePowerParamRequired(int(powerParam.Status)) == powerParamRequired
}

func pickTestPowerParam(items []botmodel.PowerParam, used map[uint64]struct{}) (botmodel.PowerParam, bool) {
	if len(items) == 0 {
		return botmodel.PowerParam{}, false
	}
	for _, item := range items {
		if _, exists := used[item.ID]; exists {
			continue
		}
		used[item.ID] = struct{}{}
		return item, true
	}
	return items[0], true
}

func testParamSort(powerSort int, serviceSort int) int {
	if serviceSort > 0 {
		return serviceSort
	}
	return powerSort
}

func (s GatewayService) testSources(ctx context.Context, power botmodel.Power, selectedTargetID uint64) ([]TestSource, uint64) {
	targets := s.dispatcher.OrderPowerTargets(s.repo.ListTargetsByPower(ctx, power.ID))
	sources := make([]TestSource, 0, len(targets))
	firstTargetID := uint64(0)
	selectedExists := false

	for _, target := range targets {
		if !isActive(target.Status) {
			continue
		}
		service, ok := s.repo.FindService(ctx, target.ServiceID)
		if !ok || !isActive(service.Status) {
			continue
		}
		provider, _ := s.repo.FindProvider(ctx, service.ProviderID)
		source := TestSource{
			ID:           target.ID,
			TargetID:     target.ID,
			ServiceID:    service.ID,
			ServiceName:  service.Name,
			ProviderID:   provider.ID,
			ProviderName: provider.Name,
			Name:         testSourceName(provider.Name, service.Name),
			Sort:         target.Sort,
		}
		sources = append(sources, source)
		if firstTargetID == 0 {
			firstTargetID = target.ID
		}
		if selectedTargetID > 0 && selectedTargetID == target.ID {
			selectedExists = true
		}
	}

	if selectedTargetID > 0 && selectedExists {
		return sources, selectedTargetID
	}
	return sources, firstTargetID
}

func testSourceName(providerName string, serviceName string) string {
	serviceName = strings.TrimSpace(serviceName)
	providerName = strings.TrimSpace(providerName)
	if providerName == "" {
		return serviceName
	}
	if serviceName == "" || serviceName == providerName {
		return providerName
	}
	return providerName + " / " + serviceName
}

func (s GatewayService) activeServiceParamIDs(ctx context.Context, serviceID uint64) map[uint64]bool {
	if serviceID == 0 {
		return nil
	}
	result := map[uint64]bool{}
	for _, serviceParam := range s.repo.ServiceParamsByService(ctx, serviceID) {
		if !isActive(serviceParam.Status) {
			continue
		}
		if serviceParam.ParamID > 0 {
			result[serviceParam.ParamID] = true
		}
		if serviceParam.ParamRule == paramRuleComboMap {
			for _, paramID := range decodeServiceParamComboMapping(serviceParam.Mapping).ParamIDs {
				if paramID > 0 {
					result[paramID] = true
				}
			}
		}
	}
	return result
}

func showTestParamForSource(powerParam botmodel.PowerParam, serviceParamIDs map[uint64]bool) bool {
	if normalizePowerParamShow(int(powerParam.Show)) == powerParamShowAlways {
		return true
	}
	return serviceParamIDs[powerParam.ParamID]
}

func (s GatewayService) testParamOptionFilters(
	ctx context.Context,
	serviceID uint64,
	params map[uint64]botmodel.Param,
) map[uint64]testParamOptionFilter {
	result := map[uint64]testParamOptionFilter{}
	if serviceID == 0 {
		return result
	}
	for _, serviceParam := range s.repo.ServiceParamsByService(ctx, serviceID) {
		if !isActive(serviceParam.Status) {
			continue
		}

		if serviceParam.ParamRule == paramRuleComboMap {
			for _, row := range decodeServiceParamComboMapping(serviceParam.Mapping).Rows {
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
		if !ok || !isOptionParamType(param.Type) {
			continue
		}

		filter := result[serviceParam.ParamID]
		switch serviceParam.ParamRule {
		case paramRuleOptionMap:
			filter.restricted = true
			if filter.allowedIDs == nil {
				filter.allowedIDs = map[uint64]struct{}{}
			}
			for _, mapping := range decodeServiceParamOptionMappings(serviceParam.Mapping) {
				filter.allowedIDs[mapping.OptionID] = struct{}{}
			}
		case paramRuleDirect, 0:
			filter.unrestricted = true
		}
		result[serviceParam.ParamID] = filter
	}
	return result
}

func (s GatewayService) testParamOptions(
	ctx context.Context,
	paramID uint64,
	filter testParamOptionFilter,
) []TestParamOption {
	options := s.repo.ParamOptionsByParam(ctx, paramID)
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

func isOptionParamType(paramType string) bool {
	switch normalizeParamControlType(paramType) {
	case "option", "multi_option":
		return true
	default:
		return false
	}
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

func optionLabel(option botmodel.ParamOption) string {
	if name := strings.TrimSpace(option.Name); name != "" {
		return name
	}
	return strings.TrimSpace(option.Value)
}
