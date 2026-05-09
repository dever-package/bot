package energon

import (
	"context"
	"encoding/json"
	"fmt"
	"net/url"
	"strconv"
	"strings"

	"github.com/shemic/dever/util"

	botmodel "my/package/bot/model/energon"
	botprotocol "my/package/bot/service/energon/protocol"
	uploadrepo "my/package/front/service/upload/repository"
)

func (s GatewayService) buildMappedInput(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
) (botprotocol.MappedInput, error) {
	labels := s.inputParamLabels(ctx, selected.Power.ID, selected.Service.ID)
	params := s.repo.ParamMap(ctx)
	input := s.normalizeParamInput(ctx, selected.Power.ID, selected.Service.ID, req.Input, params)
	mapped := botprotocol.NewMappedInput(input, labels)

	if err := s.validatePowerMainParams(ctx, selected.Power.ID, selected.Service.ID, input, params); err != nil {
		return mapped, err
	}

	serviceParams := s.repo.ServiceParamsByService(ctx, selected.Service.ID)
	if len(serviceParams) == 0 {
		return mapped, nil
	}

	requiredServiceParamIDs := s.requiredServiceParamIDs(ctx, selected.Power.ID, selected.Service.ID, params)
	comboConsumedParamIDs := collectComboConsumedParamIDs(serviceParams)
	for _, serviceParam := range serviceParams {
		if !isActive(serviceParam.Status) {
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
		if !isActive(param.Status) {
			return mapped, fmt.Errorf("服务参数“%s”绑定的内部参数“%s”已停用", serviceParam.Key, param.Name)
		}
		if normalizeParamControlType(param.Type) == "description" {
			continue
		}

		if serviceParam.ParamRule == paramRuleComboMap {
			nativeValue, mappedOK, err := s.mapComboServiceParamValue(ctx, serviceParam, input, params, serviceParams)
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
				ParamName: serviceParamDisplayName(serviceParam, param),
				ParamType: normalizeParamControlType(param.Type),
				NativeKey: serviceParam.Key,
				ParamRule: serviceParam.ParamRule,
				Value:     nativeValue,
			})
			continue
		}

		if comboConsumedParamIDs[serviceParam.ParamID] {
			continue
		}

		inputKey, value, exists := resolveServiceParamInputValue(input, serviceParam, param)
		if !exists {
			if requiredServiceParamIDs[serviceParam.ID] && paramRequiresInput(param) {
				return mapped, fmt.Errorf("缺少必填参数“%s”", serviceParamDisplayName(serviceParam, param))
			}
			continue
		}

		nativeValue, mappedOK, err := s.mapServiceParamValue(ctx, serviceParam, param, value)
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
			ParamName: serviceParamDisplayName(serviceParam, param),
			ParamType: normalizeParamControlType(param.Type),
			NativeKey: serviceParam.Key,
			ParamRule: serviceParam.ParamRule,
			Value:     nativeValue,
		})
	}
	applyPromptMappedParams(&mapped)

	return mapped, nil
}

func (s GatewayService) validatePowerMainParams(
	ctx context.Context,
	powerID uint64,
	serviceID uint64,
	input map[string]any,
	params map[uint64]botmodel.Param,
) error {
	serviceParamIDs := s.activeServiceParamIDs(ctx, serviceID)
	for _, powerParam := range s.repo.PowerParamsByPower(ctx, powerID) {
		if !powerParamRequiresInput(powerParam) {
			continue
		}
		param, ok := params[powerParam.ParamID]
		if !ok || !isActive(param.Status) || !paramRequiresInput(param) {
			continue
		}
		if serviceParamIDs[param.ID] {
			continue
		}
		if _, _, exists := resolveInputParamValue(input, param); !exists {
			return fmt.Errorf("缺少必填参数“%s”", param.Name)
		}
	}
	return nil
}

func (s GatewayService) inputParamLabels(ctx context.Context, powerID uint64, serviceID uint64) map[string]string {
	labels := map[string]string{}
	params := s.repo.ParamMap(ctx)

	for _, powerParam := range s.repo.PowerParamsByPower(ctx, powerID) {
		if param, ok := params[powerParam.ParamID]; ok {
			addInputParamLabels(labels, param)
		}
	}
	for _, serviceParam := range s.repo.ServiceParamsByService(ctx, serviceID) {
		if !isActive(serviceParam.Status) {
			continue
		}
		if param, ok := params[serviceParam.ParamID]; ok {
			addServiceParamInputLabels(labels, serviceParam, param)
		}
	}
	return labels
}

func (s GatewayService) requiredServiceParamIDs(
	ctx context.Context,
	powerID uint64,
	serviceID uint64,
	params map[uint64]botmodel.Param,
) map[uint64]bool {
	result := map[uint64]bool{}
	if serviceID == 0 {
		return result
	}

	serviceParamIDs := s.activeServiceParamIDs(ctx, serviceID)
	powerParamsByParamID := map[uint64][]botmodel.PowerParam{}
	for _, powerParam := range s.repo.PowerParamsByPower(ctx, powerID) {
		if _, ok := params[powerParam.ParamID]; !ok {
			continue
		}
		powerParamsByParamID[powerParam.ParamID] = append(powerParamsByParamID[powerParam.ParamID], powerParam)
	}

	usedPowerParams := map[uint64]struct{}{}
	for _, serviceParam := range s.repo.ServiceParamsByService(ctx, serviceID) {
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
		result[serviceParam.ID] = powerParamRequiresInput(powerParam)
	}
	return result
}

func addInputParamLabels(labels map[string]string, param botmodel.Param) {
	name := strings.TrimSpace(param.Name)
	if name == "" {
		return
	}
	if key := strings.TrimSpace(param.Key); key != "" {
		labels[key] = name
	}
	labels[name] = name
}

func addServiceParamInputLabels(labels map[string]string, serviceParam botmodel.ServiceParam, param botmodel.Param) {
	name := serviceParamDisplayName(serviceParam, param)
	if name == "" {
		return
	}
	if key := serviceParamInputKey(serviceParam); key != "" {
		labels[key] = name
	}
	if key := strings.TrimSpace(serviceParam.Name); key != "" {
		labels[key] = name
	}
}

func serviceParamInputKey(serviceParam botmodel.ServiceParam) string {
	if serviceParam.ID == 0 {
		return ""
	}
	return fmt.Sprintf("%s%d", botprotocol.InternalServiceParamInputPrefix, serviceParam.ID)
}

func serviceParamInputKeys(serviceParam botmodel.ServiceParam, param botmodel.Param) []string {
	return inputLookupKeys(
		serviceParamInputKey(serviceParam),
		serviceParam.Name,
		param.Key,
		param.Name,
	)
}

func paramInputKeys(param botmodel.Param) []string {
	return inputLookupKeys(param.Key, param.Name)
}

func inputLookupKeys(values ...string) []string {
	keys := make([]string, 0, len(values))
	seen := map[string]struct{}{}
	for _, value := range values {
		key := strings.TrimSpace(value)
		if key == "" {
			continue
		}
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		keys = append(keys, key)
	}
	return keys
}

func serviceParamDisplayName(serviceParam botmodel.ServiceParam, param botmodel.Param) string {
	if name := strings.TrimSpace(serviceParam.Name); name != "" {
		return name
	}
	return strings.TrimSpace(param.Name)
}

func resolveServiceParamInputValue(input map[string]any, serviceParam botmodel.ServiceParam, param botmodel.Param) (string, any, bool) {
	for _, key := range serviceParamInputKeys(serviceParam, param) {
		value, exists := input[key]
		if exists && !isMissingInputValue(value) {
			return key, value, true
		}
	}

	if defaultValue := strings.TrimSpace(param.DefaultValue); defaultValue != "" {
		key := serviceParamInputKey(serviceParam)
		if key == "" {
			key = strings.TrimSpace(param.Key)
		}
		if key == "" {
			key = strings.TrimSpace(param.Name)
		}
		return key, parseDefaultParamValue(param.Type, param.ValueType, defaultValue), true
	}

	return "", nil, false
}

func resolveInputParamValue(input map[string]any, param botmodel.Param) (string, any, bool) {
	for _, key := range paramInputKeys(param) {
		value, exists := input[key]
		if exists && !isMissingInputValue(value) {
			return key, value, true
		}
	}

	if defaultValue := strings.TrimSpace(param.DefaultValue); defaultValue != "" {
		key := strings.TrimSpace(param.Key)
		if key == "" {
			key = strings.TrimSpace(param.Name)
		}
		return key, parseDefaultParamValue(param.Type, param.ValueType, defaultValue), true
	}

	return "", nil, false
}

func (s GatewayService) mapServiceParamValue(
	ctx context.Context,
	serviceParam botmodel.ServiceParam,
	param botmodel.Param,
	value any,
) (any, bool, error) {
	value = s.normalizeParamInputValue(ctx, param, value)

	switch serviceParam.ParamRule {
	case paramRuleDirect, 0:
		if isOptionParamType(param.Type) {
			return s.mapDirectOptionParamValue(ctx, serviceParam, param, value)
		}
		return value, true, nil
	case paramRuleOptionMap:
		return s.mapOptionParamValue(ctx, serviceParam, param, value)
	case paramRuleFileMap:
		return mapFileParamValue(serviceParam, param, value)
	default:
		return nil, false, fmt.Errorf("服务参数“%s”的映射规则不支持", serviceParam.Key)
	}
}

func (s GatewayService) normalizeParamInput(
	ctx context.Context,
	powerID uint64,
	serviceID uint64,
	input map[string]any,
	params map[uint64]botmodel.Param,
) map[string]any {
	normalized := map[string]any{}
	for key, value := range input {
		normalized[key] = value
	}

	for _, powerParam := range s.repo.PowerParamsByPower(ctx, powerID) {
		param, ok := params[powerParam.ParamID]
		if !ok {
			continue
		}
		s.normalizeParamInputKeys(ctx, normalized, param)
	}
	for _, serviceParam := range s.repo.ServiceParamsByService(ctx, serviceID) {
		if !isActive(serviceParam.Status) {
			continue
		}
		param, ok := params[serviceParam.ParamID]
		if !ok {
			continue
		}
		s.normalizeServiceParamInputKeys(ctx, normalized, serviceParam, param)
	}
	return normalized
}

func (s GatewayService) normalizeServiceParamInputKeys(ctx context.Context, input map[string]any, serviceParam botmodel.ServiceParam, param botmodel.Param) {
	for _, key := range serviceParamInputKeys(serviceParam, param) {
		if value, exists := input[key]; exists && !isMissingInputValue(value) {
			input[key] = s.normalizeParamInputValue(ctx, param, value)
		}
	}
}

func (s GatewayService) normalizeParamInputKeys(ctx context.Context, input map[string]any, param botmodel.Param) {
	for _, key := range paramInputKeys(param) {
		if value, exists := input[key]; exists && !isMissingInputValue(value) {
			input[key] = s.normalizeParamInputValue(ctx, param, value)
		}
	}
}

func (s GatewayService) normalizeParamInputValue(ctx context.Context, param botmodel.Param, value any) any {
	switch normalizeParamControlType(param.Type) {
	case "file", "files":
		return s.normalizeFileParamValue(ctx, value)
	case "switch":
		return convertSwitchValueByType(param.ValueType, value)
	case "multi_option":
		return convertParamListValue(param, value)
	default:
		return convertParamScalarValue(param, value)
	}
}

func (s GatewayService) normalizeFileParamValue(ctx context.Context, value any) any {
	switch current := value.(type) {
	case nil:
		return value
	case string:
		if parsed := parseJSONInputValue(current); parsed != nil {
			return s.normalizeFileParamValue(ctx, parsed)
		}
		return s.normalizeFileParamString(ctx, current)
	case []string:
		result := make([]string, 0, len(current))
		for _, item := range current {
			if normalized := s.normalizeFileParamString(ctx, item); normalized != "" {
				result = append(result, normalized)
			}
		}
		return result
	case []any:
		result := make([]string, 0, len(current))
		for _, item := range current {
			values := normalizeStringInputList(s.normalizeFileParamValue(ctx, item))
			for _, normalized := range values {
				if normalized != "" {
					result = append(result, normalized)
				}
			}
		}
		return result
	case map[string]any:
		return s.normalizeFileParamString(ctx, fileURLFromInputMap(current))
	default:
		return s.normalizeFileParamString(ctx, inputValueText(current))
	}
}

func (s GatewayService) normalizeFileParamString(ctx context.Context, value string) string {
	value = strings.TrimSpace(value)
	if value == "" {
		return ""
	}

	if fileID := uploadFileIDFromOpenURL(value); fileID > 0 {
		if publicURL := uploadFilePublicURL(ctx, fileID); publicURL != "" {
			return publicURL
		}
	}
	return value
}

func fileURLFromInputMap(value map[string]any) string {
	for _, key := range []string{"url", "thumbnail", "download", "open_url"} {
		if text := strings.TrimSpace(inputValueText(value[key])); text != "" {
			return text
		}
	}
	if id := util.ToUint64(value["id"]); id > 0 {
		return fmt.Sprintf("/front/upload/open?id=%d", id)
	}
	return strings.TrimSpace(inputValueText(value["path"]))
}

func parseJSONInputValue(value string) any {
	value = strings.TrimSpace(value)
	if value == "" || (!strings.HasPrefix(value, "[") && !strings.HasPrefix(value, "{")) {
		return nil
	}
	var parsed any
	if err := json.Unmarshal([]byte(value), &parsed); err != nil {
		return nil
	}
	return parsed
}

func uploadFileIDFromOpenURL(value string) uint64 {
	value = strings.TrimSpace(value)
	if value == "" {
		return 0
	}

	parsed, err := url.Parse(value)
	if err != nil {
		return 0
	}
	if strings.TrimRight(parsed.Path, "/") != "/front/upload/open" {
		return 0
	}
	return util.ToUint64(parsed.Query().Get("id"))
}

func uploadFilePublicURL(ctx context.Context, fileID uint64) string {
	file, err := uploadrepo.FindUploadFile(ctx, fileID)
	if err != nil {
		return ""
	}

	payload := uploadrepo.BuildUploadFilePayload(file)
	for _, key := range []string{"url", "thumbnail", "download", "open_url"} {
		if publicURL := strings.TrimSpace(inputValueText(payload[key])); isChannelReadableFileURL(publicURL) {
			return publicURL
		}
	}
	return ""
}

func isChannelReadableFileURL(value string) bool {
	value = strings.TrimSpace(value)
	return strings.HasPrefix(value, "http://") ||
		strings.HasPrefix(value, "https://") ||
		strings.HasPrefix(value, "data:")
}

func (s GatewayService) mapDirectOptionParamValue(
	ctx context.Context,
	serviceParam botmodel.ServiceParam,
	param botmodel.Param,
	value any,
) (any, bool, error) {
	options := s.repo.ParamOptionsByParam(ctx, param.ID)
	if len(options) == 0 {
		return nil, false, fmt.Errorf("服务参数“%s”的内部参数“%s”没有可用选项", serviceParam.Key, param.Name)
	}

	selected := make([]string, 0)
	for _, raw := range normalizeInputList(value) {
		option, ok := matchParamOption(options, raw)
		if !ok {
			return nil, false, fmt.Errorf("参数“%s”的选项“%s”不存在", param.Name, inputValueText(raw))
		}
		selected = append(selected, option.Value)
	}

	if len(selected) == 0 {
		return nil, false, nil
	}
	if normalizeParamControlType(param.Type) == "multi_option" {
		return convertParamListValue(param, selected), true, nil
	}
	return convertParamScalarValue(param, selected[0]), true, nil
}

func (s GatewayService) mapOptionParamValue(
	ctx context.Context,
	serviceParam botmodel.ServiceParam,
	param botmodel.Param,
	value any,
) (any, bool, error) {
	optionMappings := decodeServiceParamOptionMappings(serviceParam.Mapping)
	allowed := make(map[uint64]string, len(optionMappings))
	for _, item := range optionMappings {
		allowed[item.OptionID] = item.NativeValue
	}

	options := s.repo.ParamOptionsByParam(ctx, param.ID)
	if len(options) == 0 {
		return nil, false, fmt.Errorf("服务参数“%s”的内部参数“%s”没有可用选项", serviceParam.Key, param.Name)
	}

	selected := make([]string, 0)
	for _, raw := range normalizeInputList(value) {
		option, ok := matchParamOption(options, raw)
		if !ok {
			return nil, false, fmt.Errorf("参数“%s”的选项“%s”不存在", param.Name, inputValueText(raw))
		}
		nativeValue, allowedOK := allowed[option.ID]
		if len(allowed) > 0 && !allowedOK {
			continue
		}
		if strings.TrimSpace(nativeValue) == "" {
			nativeValue = option.Value
		}
		selected = append(selected, nativeValue)
	}

	if len(selected) == 0 {
		return nil, false, nil
	}
	if normalizeParamControlType(param.Type) == "multi_option" {
		return convertParamListValue(param, selected), true, nil
	}
	return convertParamScalarValue(param, selected[0]), true, nil
}

func (s GatewayService) mapComboServiceParamValue(
	ctx context.Context,
	serviceParam botmodel.ServiceParam,
	input map[string]any,
	params map[uint64]botmodel.Param,
	serviceParams []botmodel.ServiceParam,
) (any, bool, error) {
	mapping := decodeServiceParamComboMapping(serviceParam.Mapping)
	if len(mapping.ParamIDs) == 0 || len(mapping.Rows) == 0 {
		return nil, false, fmt.Errorf("服务参数“%s”的组合映射未配置", serviceParam.Key)
	}

	selectedOptions := map[uint64]map[uint64]bool{}
	for _, paramID := range mapping.ParamIDs {
		param, ok := params[paramID]
		if !ok || !isActive(param.Status) {
			return nil, false, fmt.Errorf("服务参数“%s”的组合映射参与参数不存在或已停用", serviceParam.Key)
		}

		_, value, exists := resolveComboParamInputValue(input, param, serviceParams)
		if !exists {
			return nil, false, fmt.Errorf("服务参数“%s”的组合映射缺少参数“%s”", serviceParam.Key, param.Name)
		}

		optionIDs, err := s.selectedParamOptionIDs(ctx, param, s.normalizeParamInputValue(ctx, param, value))
		if err != nil {
			return nil, false, err
		}
		if len(optionIDs) == 0 {
			return nil, false, fmt.Errorf("服务参数“%s”的组合映射参数“%s”未选择有效选项", serviceParam.Key, param.Name)
		}
		selectedOptions[paramID] = optionIDs
	}

	for _, row := range mapping.Rows {
		if comboMappingRowMatches(mapping.ParamIDs, row, selectedOptions) {
			if strings.TrimSpace(row.NativeValue) == "" {
				return nil, false, nil
			}
			return row.NativeValue, true, nil
		}
	}

	return nil, false, fmt.Errorf("服务参数“%s”的组合映射未匹配到字段值", serviceParam.Key)
}

func resolveComboParamInputValue(input map[string]any, param botmodel.Param, serviceParams []botmodel.ServiceParam) (string, any, bool) {
	if key, value, exists := resolveInputParamValue(input, param); exists {
		return key, value, exists
	}

	for _, serviceParam := range serviceParams {
		if !isActive(serviceParam.Status) || serviceParam.ParamID != param.ID {
			continue
		}
		if key, value, exists := resolveServiceParamInputValue(input, serviceParam, param); exists {
			return key, value, exists
		}
	}

	return "", nil, false
}

func (s GatewayService) selectedParamOptionIDs(ctx context.Context, param botmodel.Param, value any) (map[uint64]bool, error) {
	options := s.repo.ParamOptionsByParam(ctx, param.ID)
	if len(options) == 0 {
		return nil, fmt.Errorf("参数“%s”没有可用选项", param.Name)
	}

	result := map[uint64]bool{}
	for _, raw := range normalizeInputList(value) {
		option, ok := matchParamOption(options, raw)
		if !ok {
			return nil, fmt.Errorf("参数“%s”的选项“%s”不存在", param.Name, inputValueText(raw))
		}
		result[option.ID] = true
	}
	return result, nil
}

func comboMappingRowMatches(
	paramIDs []uint64,
	row serviceParamComboRow,
	selectedOptions map[uint64]map[uint64]bool,
) bool {
	for _, paramID := range paramIDs {
		optionID := row.Values[paramID]
		if optionID == 0 || !selectedOptions[paramID][optionID] {
			return false
		}
	}
	return true
}

func collectComboConsumedParamIDs(serviceParams []botmodel.ServiceParam) map[uint64]bool {
	result := map[uint64]bool{}
	for _, serviceParam := range serviceParams {
		if !isActive(serviceParam.Status) || serviceParam.ParamRule != paramRuleComboMap {
			continue
		}
		for _, paramID := range decodeServiceParamComboMapping(serviceParam.Mapping).ParamIDs {
			if paramID > 0 {
				result[paramID] = true
			}
		}
	}
	return result
}

func comboInputKey(mappingValue string, params map[uint64]botmodel.Param, serviceParams []botmodel.ServiceParam) string {
	mapping := decodeServiceParamComboMapping(mappingValue)
	keys := make([]string, 0, len(mapping.ParamIDs))
	seen := map[string]struct{}{}
	for _, paramID := range mapping.ParamIDs {
		for _, serviceParam := range serviceParams {
			if !isActive(serviceParam.Status) || serviceParam.ParamID != paramID {
				continue
			}
			keys = appendUniqueInputKey(keys, seen, serviceParamInputKey(serviceParam))
			keys = appendUniqueInputKey(keys, seen, serviceParam.Name)
		}

		param, ok := params[paramID]
		if !ok {
			continue
		}
		keys = appendUniqueInputKey(keys, seen, param.Key)
		keys = appendUniqueInputKey(keys, seen, param.Name)
	}
	return strings.Join(keys, ",")
}

func appendUniqueInputKey(keys []string, seen map[string]struct{}, value string) []string {
	key := strings.TrimSpace(value)
	if key == "" {
		return keys
	}
	if _, exists := seen[key]; exists {
		return keys
	}
	seen[key] = struct{}{}
	return append(keys, key)
}

func mapFileParamValue(serviceParam botmodel.ServiceParam, param botmodel.Param, value any) (any, bool, error) {
	files := normalizeStringInputList(value)
	if len(files) == 0 {
		return nil, false, nil
	}

	indexes := normalizeIntArray(serviceParam.Mapping)
	if len(indexes) == 0 {
		indexes = []int{1}
	}

	selected := make([]string, 0, len(indexes))
	for _, index := range indexes {
		if index <= 0 || index > len(files) {
			return nil, false, fmt.Errorf("服务参数“%s”的附件序号 %d 超出参数“%s”的文件数量", serviceParam.Key, index, param.Name)
		}
		selected = append(selected, files[index-1])
	}
	if len(selected) == 0 {
		return nil, false, nil
	}
	if len(selected) == 1 {
		return selected[0], true, nil
	}
	return selected, true, nil
}

func matchParamOption(options []botmodel.ParamOption, value any) (botmodel.ParamOption, bool) {
	valueText := strings.TrimSpace(inputValueText(value))
	valueID := util.ToUint64(value)
	for _, option := range options {
		if valueID > 0 && option.ID == valueID {
			return option, true
		}
		if valueText != "" && (option.Value == valueText || option.Name == valueText) {
			return option, true
		}
	}
	return botmodel.ParamOption{}, false
}

func paramRequiresInput(param botmodel.Param) bool {
	if normalizeParamControlType(param.Type) == "description" {
		return false
	}
	return true
}

func convertParamScalarValue(param botmodel.Param, value any) any {
	return convertScalarValueByType(normalizeParamValueType(param.ValueType), value)
}

func convertParamListValue(param botmodel.Param, value any) []any {
	return convertListValueByType(normalizeParamValueType(param.ValueType), normalizeInputList(value))
}

func convertListValueByType(valueType string, items []any) []any {
	result := make([]any, 0, len(items))
	for _, item := range items {
		if isMissingInputValue(item) {
			continue
		}
		result = append(result, convertScalarValueByType(valueType, item))
	}
	return result
}

func convertScalarValueByType(valueType string, value any) any {
	text := strings.TrimSpace(inputValueText(value))
	switch normalizeParamValueType(valueType) {
	case "number":
		if parsed, err := strconv.ParseFloat(text, 64); err == nil {
			return parsed
		}
	}
	return text
}

func convertSwitchValueByType(valueType string, value any) any {
	checked := convertBoolValue(value)
	if normalizeParamValueType(valueType) == "string" {
		return strconv.FormatBool(checked)
	}
	return checked
}

func convertBoolValue(value any) bool {
	switch current := value.(type) {
	case bool:
		return current
	case int, int8, int16, int32, int64:
		return util.ToIntDefault(current, 0) != 0
	case uint, uint8, uint16, uint32, uint64:
		return util.ToUint64(current) != 0
	case float32:
		return current != 0
	case float64:
		return current != 0
	default:
		return isTruthyText(inputValueText(value))
	}
}

func parseDefaultParamValue(paramType string, valueType string, value string) any {
	switch normalizeParamControlType(paramType) {
	case "switch":
		return convertSwitchValueByType(valueType, value)
	case "multi_option", "files":
		if parsed := parseJSONInputValue(value); parsed != nil {
			return convertListValueByType(normalizeParamValueType(valueType), normalizeInputList(parsed))
		}
		return convertListValueByType(normalizeParamValueType(valueType), []any{value})
	default:
		return convertScalarValueByType(normalizeParamValueType(valueType), value)
	}
}

func normalizeInputList(value any) []any {
	switch current := value.(type) {
	case nil:
		return nil
	case []any:
		return current
	case []string:
		result := make([]any, 0, len(current))
		for _, item := range current {
			result = append(result, item)
		}
		return result
	default:
		return []any{current}
	}
}

func normalizeStringInputList(value any) []string {
	items := normalizeInputList(value)
	result := make([]string, 0, len(items))
	for _, item := range items {
		if text := strings.TrimSpace(inputValueText(item)); text != "" {
			result = append(result, text)
		}
	}
	return result
}

func isMissingInputValue(value any) bool {
	switch current := value.(type) {
	case nil:
		return true
	case string:
		return strings.TrimSpace(current) == ""
	case []any:
		return len(current) == 0
	case []string:
		return len(current) == 0
	default:
		return false
	}
}

func isFileParamType(paramType string) bool {
	switch normalizeParamControlType(paramType) {
	case "file", "files":
		return true
	default:
		return false
	}
}

func isTruthyText(value string) bool {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "1", "true", "yes", "y", "on", "是", "启用":
		return true
	default:
		return false
	}
}

func inputValueText(value any) string {
	if value == nil {
		return ""
	}
	if text, ok := value.(string); ok {
		return text
	}
	raw, err := json.Marshal(value)
	if err == nil {
		return string(raw)
	}
	return fmt.Sprint(value)
}

func applyPromptMappedParams(mapped *botprotocol.MappedInput) {
	if mapped == nil || len(mapped.Params) == 0 {
		return
	}

	excluded := map[string]bool{}
	for _, param := range mapped.Params {
		if isPromptMappedParam(param) {
			continue
		}
		for _, key := range param.InputKeys() {
			excluded[key] = true
		}
	}

	for index, param := range mapped.Params {
		if !isPromptMappedParam(param) {
			continue
		}
		prompt := botprotocol.BuildPromptContent(
			promptMappedParamInput(*mapped, param, excluded),
			mapped.PromptOptions("用户输入"),
		)
		mapped.Params[index].Value = prompt.TextWithMediaReferences(botprotocol.MediaReferenceOptions{
			Images: true,
			Videos: true,
			Audios: true,
			Files:  true,
		})
	}
}

func promptMappedParamInput(mapped botprotocol.MappedInput, param botprotocol.MappedParam, excluded map[string]bool) map[string]any {
	input := mapped.PromptInput(excluded)
	if !isMissingInputValue(input["text"]) {
		return input
	}

	if value, ok := mappedParamOriginalValue(mapped, param); ok {
		input["text"] = value
		return input
	}
	if !isMissingInputValue(param.Value) {
		input["text"] = param.Value
	}
	return input
}

func mappedParamOriginalValue(mapped botprotocol.MappedInput, param botprotocol.MappedParam) (any, bool) {
	for _, key := range param.InputKeys() {
		value, exists := mapped.Original[key]
		if exists && !isMissingInputValue(value) {
			return value, true
		}
	}
	return nil, false
}

func isPromptMappedParam(param botprotocol.MappedParam) bool {
	if strings.TrimSpace(param.ParamKey) != "text" && !param.HasInputKey("text") {
		return false
	}
	switch lastNativeKeySegment(param.NativeKey) {
	case "prompt", "prompt_text", "text", "query", "input", "content":
		return true
	default:
		return false
	}
}

func lastNativeKeySegment(key string) string {
	parts := strings.Split(strings.ToLower(strings.TrimSpace(key)), ".")
	for index := len(parts) - 1; index >= 0; index-- {
		if part := strings.TrimSpace(parts[index]); part != "" {
			return part
		}
	}
	return ""
}
