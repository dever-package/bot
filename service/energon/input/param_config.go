package input

import (
	"context"
	"fmt"
	"sort"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
)

type PowerParam struct {
	ID              uint64             `json:"id"`
	PowerParamID    uint64             `json:"power_param_id"`
	ParamID         uint64             `json:"-"`
	ParamKey        string             `json:"-"`
	Name            string             `json:"name"`
	Key             string             `json:"key"`
	Icon            string             `json:"icon,omitempty"`
	Type            string             `json:"type"`
	PreviewType     string             `json:"preview_type,omitempty"`
	Usage           int16              `json:"usage"`
	ValueType       string             `json:"value_type"`
	DefaultValue    string             `json:"default_value"`
	ActiveWhenKey   string             `json:"active_when_key,omitempty"`
	ActiveWhenValue string             `json:"active_when_value,omitempty"`
	Required        bool               `json:"required"`
	UploadRuleID    uint64             `json:"upload_rule_id,omitempty"`
	MaxFiles        int                `json:"max_files,omitempty"`
	AcceptedKinds   []string           `json:"accepted_kinds,omitempty"`
	AssetKinds      []string           `json:"asset_kinds,omitempty"`
	Sort            int                `json:"sort"`
	Options         []PowerParamOption `json:"options,omitempty"`
}

type PowerParamOption struct {
	ID          uint64 `json:"id"`
	Name        string `json:"name"`
	Value       string `json:"value"`
	NativeValue string `json:"native_value"`
	PreviewURL  string `json:"preview_url,omitempty"`
	Sort        int    `json:"sort"`
}

type PowerParamConfig struct {
	SourceRule       int16         `json:"source_rule"`
	SelectedTargetID uint64        `json:"selected_target_id"`
	Sources          []PowerSource `json:"sources"`
	Params           []PowerParam  `json:"params"`
}

type PowerSource struct {
	ID           uint64 `json:"id"`
	TargetID     uint64 `json:"target_id"`
	ServiceID    uint64 `json:"service_id"`
	ServiceName  string `json:"service_name"`
	ProviderID   uint64 `json:"provider_id,omitempty"`
	ProviderName string `json:"provider_name,omitempty"`
	Name         string `json:"name"`
	Sort         int    `json:"sort"`
}

func (param PowerParam) IsToolbar() bool {
	return param.Usage == paramUsageToolbar
}

type powerParamOptionFilter struct {
	restricted             bool
	unrestricted           bool
	allowedIDs             map[uint64]struct{}
	conditionRestricted    bool
	conditionAllowedValues map[string]struct{}
}

type powerParamRow struct {
	ID                uint64
	Name              string
	Key               string
	Sort              int
	ActiveWhenParamID uint64
	ActiveWhenValue   string
	MaxFiles          *int
	Filter            powerParamOptionFilter
}

func BuildPowerParams(ctx context.Context, repo Repository, powerID uint64, serviceID uint64) []PowerParam {
	params := repo.ParamMap(ctx)
	serviceParams := repo.ServiceParamsByService(ctx, serviceID)
	serviceParamIDs := ActiveServiceParamIDs(ctx, repo, serviceID)
	optionFilters := powerParamOptionFilters(ctx, repo, serviceID, params)
	applyServiceParamConditionOptionFilters(
		optionFilters,
		serviceParams,
	)
	powerParamsByParamID := map[uint64][]botmodel.PowerParam{}
	for _, powerParam := range repo.PowerParamsByPower(ctx, powerID) {
		param, ok := params[powerParam.ParamID]
		if !ok || !IsActive(param.Status) {
			continue
		}
		powerParamsByParamID[param.ID] = append(powerParamsByParamID[param.ID], powerParam)
	}

	rows := make([]PowerParam, 0)
	usedPowerParams := map[uint64]struct{}{}
	serviceCoveredParams := map[uint64]struct{}{}
	if serviceID > 0 {
		for _, serviceParam := range serviceParams {
			if !IsActive(serviceParam.Status) || !serviceParamAcceptsInput(serviceParam) {
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
			condition := CommonServiceParamCondition(param.ID, serviceParams)
			maxFiles := serviceParamFileCapacity(param, serviceParam, serviceParams)
			serviceCoveredParams[param.ID] = struct{}{}
			rows = append(rows, buildPowerParamRow(ctx, repo, params, param, powerParam, powerParamRow{
				ID:                serviceParam.ID,
				Name:              ServiceParamDisplayName(serviceParam, param),
				Key:               powerParamInputKey(serviceParam, param, len(powerParamsByParamID[param.ID]) == 1),
				Sort:              powerParamSort(powerParam.Sort, serviceParam.Sort),
				ActiveWhenParamID: condition.ParamID,
				ActiveWhenValue:   condition.Value,
				MaxFiles:          &maxFiles,
				Filter:            optionFilters[param.ID],
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

			rows = append(rows, buildPowerParamRow(ctx, repo, params, param, powerParam, powerParamRow{
				ID:     param.ID,
				Name:   param.Name,
				Key:    param.Key,
				Sort:   powerParam.Sort,
				Filter: optionFilters[param.ID],
			}))
		}
	}

	sortPowerParams(rows)
	return rows
}

// BuildPowerParamsForServices returns the union used by automatic and headless
// source selection. A capability parameter is presented once even when several
// services map it, while source-specific options are merged.
func BuildPowerParamsForServices(
	ctx context.Context,
	repo Repository,
	powerID uint64,
	serviceIDs []uint64,
) []PowerParam {
	serviceIDs = uniqueServiceIDs(serviceIDs)
	if len(serviceIDs) == 0 {
		return BuildPowerParams(ctx, repo, powerID, 0)
	}

	powerParamSorts := map[uint64]int{}
	for _, powerParam := range repo.PowerParamsByPower(ctx, powerID) {
		powerParamSorts[powerParam.ID] = powerParam.Sort
	}

	rows := make([]PowerParam, 0)
	rowIndexes := map[uint64]int{}
	rowServiceCounts := map[uint64]int{}
	for _, serviceID := range serviceIDs {
		seenInService := map[uint64]struct{}{}
		for _, row := range BuildPowerParams(ctx, repo, powerID, serviceID) {
			if configuredSort, exists := powerParamSorts[row.PowerParamID]; exists {
				row.Sort = configuredSort
			}
			if _, counted := seenInService[row.PowerParamID]; !counted {
				seenInService[row.PowerParamID] = struct{}{}
				rowServiceCounts[row.PowerParamID]++
			}
			if index, exists := rowIndexes[row.PowerParamID]; exists {
				rows[index].Options = mergePowerParamOptions(rows[index].Options, row.Options)
				if row.MaxFiles > rows[index].MaxFiles {
					rows[index].MaxFiles = row.MaxFiles
				}
				mergePowerParamCondition(&rows[index], row)
				continue
			}
			rowIndexes[row.PowerParamID] = len(rows)
			rows = append(rows, row)
		}
	}
	for index := range rows {
		if rowServiceCounts[rows[index].PowerParamID] < len(serviceIDs) {
			rows[index].Required = false
		}
	}

	sortPowerParams(rows)
	return rows
}

func mergePowerParamCondition(current *PowerParam, incoming PowerParam) {
	if current == nil {
		return
	}
	if strings.EqualFold(strings.TrimSpace(current.ActiveWhenKey), strings.TrimSpace(incoming.ActiveWhenKey)) &&
		strings.EqualFold(strings.TrimSpace(current.ActiveWhenValue), strings.TrimSpace(incoming.ActiveWhenValue)) {
		return
	}
	current.ActiveWhenKey = ""
	current.ActiveWhenValue = ""
}

func serviceParamFileCapacity(
	param botmodel.Param,
	serviceParam botmodel.ServiceParam,
	serviceParams []botmodel.ServiceParam,
) int {
	controlType := NormalizeParamControlType(param.Type)
	if controlType == "file" {
		return 1
	}
	if controlType != "files" {
		return param.MaxFiles
	}

	condition := serviceParamCondition(serviceParam)
	mappings := collectServiceParamFileMappings(param.ID, &condition, serviceParams)
	capacity := 0
	if mappings.direct {
		capacity = param.MaxFiles
	}
	if len(mappings.attachments) > 0 {
		mappedCapacity, err := attachmentMappingCapacity(mappings.attachments...)
		if err != nil {
			return 0
		}
		if mappedCapacity > capacity {
			capacity = mappedCapacity
		}
	}
	if mappings.found {
		return capacity
	}
	return param.MaxFiles
}

func uniqueServiceIDs(values []uint64) []uint64 {
	result := make([]uint64, 0, len(values))
	seen := map[uint64]struct{}{}
	for _, value := range values {
		if value == 0 {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
}

func mergePowerParamOptions(current []PowerParamOption, incoming []PowerParamOption) []PowerParamOption {
	result := append([]PowerParamOption(nil), current...)
	seen := make(map[uint64]struct{}, len(result)+len(incoming))
	for _, option := range result {
		seen[option.ID] = struct{}{}
	}
	for _, option := range incoming {
		if _, exists := seen[option.ID]; exists {
			continue
		}
		seen[option.ID] = struct{}{}
		result = append(result, option)
	}
	// Inputs are already ordered within each service. Keeping append order makes
	// the highest-priority source's options drive the automatic default.
	return result
}

func sortPowerParams(rows []PowerParam) {
	sort.SliceStable(rows, func(i, j int) bool {
		if rows[i].Sort != rows[j].Sort {
			return rows[i].Sort < rows[j].Sort
		}
		return rows[i].ID < rows[j].ID
	})
}

func buildPowerParamRow(
	ctx context.Context,
	repo Repository,
	params map[uint64]botmodel.Param,
	param botmodel.Param,
	powerParam botmodel.PowerParam,
	config powerParamRow,
) PowerParam {
	maxFiles := param.MaxFiles
	if config.MaxFiles != nil {
		maxFiles = *config.MaxFiles
	}
	row := PowerParam{
		ID:              config.ID,
		PowerParamID:    powerParam.ID,
		ParamID:         param.ID,
		ParamKey:        strings.TrimSpace(param.Key),
		Name:            powerParamName(param, config.Name),
		Key:             strings.TrimSpace(config.Key),
		Icon:            strings.TrimSpace(param.Icon),
		Type:            NormalizeParamControlType(param.Type),
		PreviewType:     NormalizeParamPreviewType(param.PreviewType),
		Usage:           normalizeParamUsage(param.Usage),
		ValueType:       NormalizeParamValueType(param.ValueType),
		DefaultValue:    strings.TrimSpace(param.DefaultValue),
		ActiveWhenValue: strings.TrimSpace(config.ActiveWhenValue),
		Required:        PowerParamRequiresInput(powerParam),
		UploadRuleID:    param.UploadRuleID,
		MaxFiles:        maxFiles,
		AssetKinds:      PromptAssetKinds(param),
		Sort:            config.Sort,
	}
	if controller, ok := params[config.ActiveWhenParamID]; ok {
		row.ActiveWhenKey = strings.TrimSpace(controller.Key)
	}
	if IsOptionParamType(row.Type) {
		row.Options = powerParamOptions(ctx, repo, param.ID, config.Filter)
	}
	return row
}

func PromptAssetKinds(param botmodel.Param) []string {
	if !IsPromptParamType(param.Type) {
		return nil
	}
	return []string{"text", "image", "audio", "video", "richtext", "file"}
}

func powerParamOptionFilters(
	ctx context.Context,
	repo Repository,
	serviceID uint64,
	params map[uint64]botmodel.Param,
) map[uint64]powerParamOptionFilter {
	result := map[uint64]powerParamOptionFilter{}
	if serviceID == 0 {
		return result
	}
	for _, serviceParam := range repo.ServiceParamsByService(ctx, serviceID) {
		if !IsActive(serviceParam.Status) || !serviceParamAcceptsInput(serviceParam) {
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

func applyServiceParamConditionOptionFilters(
	filters map[uint64]powerParamOptionFilter,
	serviceParams []botmodel.ServiceParam,
) {
	for _, serviceParam := range serviceParams {
		if !IsActive(serviceParam.Status) || serviceParam.ActiveWhenParamID == 0 || strings.TrimSpace(serviceParam.ActiveWhenValue) == "" {
			continue
		}
		filter := filters[serviceParam.ActiveWhenParamID]
		if filter.restricted || filter.unrestricted {
			continue
		}
		filter.conditionRestricted = true
		if filter.conditionAllowedValues == nil {
			filter.conditionAllowedValues = map[string]struct{}{}
		}
		filter.conditionAllowedValues[strings.TrimSpace(serviceParam.ActiveWhenValue)] = struct{}{}
		filters[serviceParam.ActiveWhenParamID] = filter
	}
}

func powerParamOptions(
	ctx context.Context,
	repo Repository,
	paramID uint64,
	filter powerParamOptionFilter,
) []PowerParamOption {
	options := repo.ParamOptionsByParam(ctx, paramID)
	if len(options) == 0 {
		return nil
	}

	rows := make([]PowerParamOption, 0, len(options))
	for _, option := range options {
		if filter.restricted && !filter.unrestricted {
			if _, ok := filter.allowedIDs[option.ID]; !ok {
				continue
			}
		}
		if filter.conditionRestricted {
			if _, ok := filter.conditionAllowedValues[strings.TrimSpace(option.Value)]; !ok {
				continue
			}
		}
		rows = append(rows, PowerParamOption{
			ID:          option.ID,
			Name:        option.Name,
			Value:       optionLabel(option),
			NativeValue: option.Value,
			PreviewURL:  strings.TrimSpace(option.PreviewURL),
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

func BuildParamOptions(ctx context.Context, repo Repository, paramID uint64) []PowerParamOption {
	return powerParamOptions(ctx, repo, paramID, powerParamOptionFilter{})
}

func NormalizePowerParamInput(input map[string]any, params []PowerParam) map[string]any {
	result := map[string]any{}
	configuredKeys := map[string]struct{}{}
	for _, param := range params {
		if key := strings.ToLower(strings.TrimSpace(param.Key)); key != "" {
			configuredKeys[key] = struct{}{}
		}
	}
	for _, param := range params {
		key := strings.TrimSpace(param.Key)
		if key == "" {
			continue
		}
		value, ok := powerParamInputValue(input, param, configuredKeys)
		if ok {
			result[key] = normalizePowerParamValue(param, value)
		}
	}
	return result
}

func ApplyPowerParamDefaults(values map[string]any, params []PowerParam) map[string]any {
	result := make(map[string]any, len(values)+len(params))
	for key, value := range values {
		result[key] = value
	}
	for _, param := range params {
		key := strings.TrimSpace(param.Key)
		if key == "" {
			continue
		}
		if current, exists := result[key]; exists {
			result[key] = normalizePowerParamValue(param, current)
			continue
		}
		if value, ok := powerParamDefaultValue(param); ok {
			result[key] = value
		}
	}
	return result
}

func powerParamDefaultValue(param PowerParam) (any, bool) {
	raw := strings.TrimSpace(param.DefaultValue)
	paramType := NormalizeParamControlType(param.Type)
	if IsOptionParamType(param.Type) && len(param.Options) > 0 {
		if option, ok := resolvePowerParamOption(param.Options, raw); ok {
			raw = powerParamOptionNativeValue(option)
		} else {
			raw = powerParamOptionNativeValue(param.Options[0])
		}
	}
	if raw != "" {
		return normalizePowerParamValue(param, ParseJSONValue(raw)), true
	}
	switch paramType {
	case "switch", "multi_option", "files":
		return parseDefaultParamValue(param.Type, param.ValueType, raw), true
	default:
		return nil, false
	}
}

func normalizePowerParamValue(param PowerParam, value any) any {
	switch NormalizeParamControlType(param.Type) {
	case "switch":
		return SwitchByType(param.ValueType, value)
	case "multi_option":
		items := List(value)
		for index, item := range items {
			items[index] = powerParamOptionValue(param, item)
		}
		return ListByType(param.ValueType, items)
	case "files":
		return ListByType(param.ValueType, List(value))
	default:
		return ScalarByType(param.ValueType, powerParamOptionValue(param, value))
	}
}

func powerParamOptionValue(param PowerParam, value any) any {
	text := strings.TrimSpace(ValueText(value))
	if text == "" || len(param.Options) == 0 {
		return value
	}
	if option, ok := resolvePowerParamOption(param.Options, text); ok {
		return powerParamOptionNativeValue(option)
	}
	return value
}

func resolvePowerParamOption(options []PowerParamOption, value any) (PowerParamOption, bool) {
	text := strings.TrimSpace(ValueText(value))
	if text == "" {
		return PowerParamOption{}, false
	}
	for _, option := range options {
		if strings.EqualFold(text, strings.TrimSpace(option.NativeValue)) {
			return option, true
		}
	}
	for _, option := range options {
		if strings.EqualFold(text, strings.TrimSpace(option.Value)) {
			return option, true
		}
	}
	for _, option := range options {
		if strings.EqualFold(text, strings.TrimSpace(option.Name)) {
			return option, true
		}
	}
	for _, option := range options {
		if text == fmt.Sprintf("%d", option.ID) {
			return option, true
		}
	}
	return PowerParamOption{}, false
}

func FilterActivePowerParams(params []PowerParam, values map[string]any) []PowerParam {
	result := make([]PowerParam, 0, len(params))
	for _, param := range params {
		if powerParamConditionMatches(param, params, values) {
			result = append(result, param)
		}
	}
	return result
}

func FilterInactivePowerParamValues(params []PowerParam, values map[string]any) map[string]any {
	result := make(map[string]any, len(values))
	for key, value := range values {
		result[key] = value
	}
	activeParamIDs := activePowerParamIDs(params, values)
	configuredKeys := powerParamConfiguredKeys(params)
	for _, param := range params {
		if activeParamIDs[param.ParamID] {
			continue
		}
		deletePowerParamValues(result, param, configuredKeys)
	}
	return result
}

// powerParamActivation returns the capability parameters configured for a
// source and the subset enabled by the current controller values.
func powerParamActivation(params []PowerParam, values map[string]any) (map[uint64]bool, map[uint64]bool) {
	configured := make(map[uint64]bool, len(params))
	for _, param := range params {
		if param.ParamID > 0 {
			configured[param.ParamID] = true
		}
	}
	return configured, activePowerParamIDs(params, values)
}

// removeUnmappedConditionValues keeps UI-only controller parameters out of
// provider-native request bodies unless a service explicitly maps them.
func removeUnmappedConditionValues(
	powerParams []PowerParam,
	values map[string]any,
	mappedParamIDs map[uint64]bool,
	conditionControllerIDs map[uint64]bool,
	params map[uint64]botmodel.Param,
) map[string]any {
	result := make(map[string]any, len(values))
	for key, value := range values {
		result[key] = value
	}
	configuredKeys := powerParamConfiguredKeys(powerParams)
	for _, param := range powerParams {
		if !conditionControllerIDs[param.ParamID] || mappedParamIDs[param.ParamID] {
			continue
		}
		deletePowerParamValues(result, param, configuredKeys)
	}
	for paramID := range conditionControllerIDs {
		if mappedParamIDs[paramID] {
			continue
		}
		param, exists := params[paramID]
		if !exists {
			continue
		}
		delete(result, strings.TrimSpace(param.Key))
		delete(result, fmt.Sprintf("param_%d", paramID))
	}
	return result
}

func activePowerParamIDs(params []PowerParam, values map[string]any) map[uint64]bool {
	result := make(map[uint64]bool, len(params))
	for _, param := range params {
		if param.ParamID > 0 && powerParamConditionMatches(param, params, values) {
			result[param.ParamID] = true
		}
	}
	return result
}

func powerParamConfiguredKeys(params []PowerParam) map[string]bool {
	result := make(map[string]bool, len(params)*2)
	for _, param := range params {
		for _, key := range []string{param.Key, param.ParamKey} {
			if key = strings.ToLower(strings.TrimSpace(key)); key != "" {
				result[key] = true
			}
		}
	}
	return result
}

func deletePowerParamValues(values map[string]any, param PowerParam, configuredKeys map[string]bool) {
	keys := []string{strings.TrimSpace(param.Key), strings.TrimSpace(param.ParamKey)}
	if param.ParamID > 0 {
		keys = append(keys, fmt.Sprintf("param_%d", param.ParamID))
	}
	for _, key := range keys {
		delete(values, key)
		alias := paramInputAlias(key)
		if alias != "" && !configuredKeys[strings.ToLower(alias)] {
			delete(values, alias)
		}
	}
}

func ValidatePowerParamValues(params []PowerParam, values map[string]any) error {
	for _, param := range FilterActivePowerParams(params, values) {
		if !IsOptionParamType(param.Type) || len(param.Options) == 0 {
			continue
		}
		value, exists := values[strings.TrimSpace(param.Key)]
		if !exists || IsMissing(value) {
			continue
		}
		items := []any{value}
		if NormalizeParamControlType(param.Type) == "multi_option" {
			items = List(value)
		}
		for _, item := range items {
			if _, ok := resolvePowerParamOption(param.Options, item); !ok {
				return fmt.Errorf("参数“%s”不支持选项“%s”", param.Name, ValueText(item))
			}
		}
	}
	return nil
}

func powerParamConditionMatches(param PowerParam, params []PowerParam, values map[string]any) bool {
	conditionKey := strings.TrimSpace(param.ActiveWhenKey)
	conditionValue := strings.TrimSpace(param.ActiveWhenValue)
	if conditionKey == "" || conditionValue == "" {
		return true
	}
	for _, controller := range params {
		if !strings.EqualFold(strings.TrimSpace(controller.Key), conditionKey) {
			continue
		}
		value, exists := values[controller.Key]
		if !exists || IsMissing(value) {
			value, exists = powerParamDefaultValue(controller)
		}
		if !exists {
			return false
		}
		actual := normalizePowerParamValue(controller, value)
		expected := normalizePowerParamValue(controller, conditionValue)
		return strings.EqualFold(strings.TrimSpace(ValueText(actual)), strings.TrimSpace(ValueText(expected)))
	}
	return false
}

func powerParamOptionNativeValue(option PowerParamOption) string {
	if value := strings.TrimSpace(option.NativeValue); value != "" {
		return value
	}
	return strings.TrimSpace(option.Value)
}

func powerParamInputValue(input map[string]any, param PowerParam, configuredKeys map[string]struct{}) (any, bool) {
	for _, key := range powerParamLookupKeys(param, configuredKeys) {
		if value, exists := input[key]; exists && !IsMissing(value) {
			return value, true
		}
	}
	return nil, false
}

func powerParamLookupKeys(param PowerParam, configuredKeys map[string]struct{}) []string {
	keys := make([]string, 0, 1)
	key := strings.TrimSpace(param.Key)
	keys = appendUniqueInputKey(keys, key)
	alias := paramInputAlias(key)
	if _, configured := configuredKeys[strings.ToLower(alias)]; alias != "" && !configured {
		keys = appendUniqueInputKey(keys, alias)
	}
	return keys
}

func powerParamSort(powerSort int, serviceSort int) int {
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

func powerParamName(param botmodel.Param, serviceParamName string) string {
	if name := strings.TrimSpace(serviceParamName); name != "" {
		return name
	}
	return param.Name
}

func powerParamInputKey(serviceParam botmodel.ServiceParam, param botmodel.Param, useCanonicalKey bool) string {
	if useCanonicalKey || IsPromptParam(param) || serviceParam.ParamRule == paramRuleComboMap {
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
