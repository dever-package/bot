package selection

import (
	"fmt"
	"strings"

	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	energonservice "github.com/dever-package/bot/service/energon"
	energoninput "github.com/dever-package/bot/service/energon/input"
)

// ResolveModel validates a model target against the currently available
// sources. Automatic source rules deliberately return target 0.
func ResolveModel(
	sourceRule int16,
	sources []energonservice.PowerSource,
	selectedTargetID uint64,
	requestedTargetID uint64,
) (uint64, string, error) {
	if !energonservice.IsManualPowerSourceRule(sourceRule) {
		return 0, "自动选择", nil
	}
	targetID := requestedTargetID
	if targetID == 0 {
		targetID = selectedTargetID
	}
	for _, source := range sources {
		if source.TargetID != targetID {
			continue
		}
		name := strings.TrimSpace(source.Name)
		if name == "" {
			name = strings.TrimSpace(source.ServiceName)
		}
		return targetID, name, nil
	}
	return 0, "", fmt.Errorf("所选模型来源不存在或不可用")
}

// PrepareToolArguments converts the visible parameter form and composer
// references into the fixed arguments of one selected Power tool.
func PrepareToolArguments(
	params []energoninput.PowerParam,
	source map[string]any,
	content map[string]any,
) (map[string]any, map[string]any, error) {
	configured := cloneMap(source)
	for _, param := range params {
		if energoninput.IsFileParamType(param.Type) {
			delete(configured, paramInputKey(param))
		}
	}
	configured = configuredParamInput(params, configured)
	configured = energonservice.ApplyPowerParamDefaults(configured, params)
	configured = energoninput.FilterInactivePowerParamValues(params, configured)
	mediaSelections := mediaSelections(content, params)
	fixedParams := make([]energoninput.PowerParam, 0, len(params))
	fixedParamKeys := make(map[string]struct{}, len(params))
	for _, param := range params {
		if energoninput.IsPromptParamType(param.Type) || energoninput.IsFileParamType(param.Type) {
			continue
		}
		fixedParams = append(fixedParams, param)
		fixedParamKeys[paramInputKey(param)] = struct{}{}
	}
	normalizedValues, missing := energonservice.PreparePowerParamInput(configured, fixedParams)
	if len(missing) > 0 {
		return nil, nil, fmt.Errorf("缺少必填参数: %s", strings.Join(missing, "、"))
	}
	if err := energoninput.ValidatePowerParamValues(fixedParams, normalizedValues); err != nil {
		return nil, nil, err
	}
	values := make(map[string]any, len(normalizedValues)+1)
	for key, value := range normalizedValues {
		if _, fixed := fixedParamKeys[key]; fixed {
			values[key] = value
		}
	}
	if len(mediaSelections) > 0 {
		values[runtimeprovider.MediaReferencesArgument] = mediaSelections
	}
	for _, param := range energoninput.FilterActivePowerParams(params, values) {
		key := paramInputKey(param)
		if energoninput.IsFileParamType(param.Type) && param.Required && !mediaParamSelected(mediaSelections, key) {
			name := strings.TrimSpace(param.Name)
			if name == "" {
				name = key
			}
			return nil, nil, fmt.Errorf("缺少必填参数: %s", name)
		}
	}
	return values, VisibleToolArguments(params, values), nil
}

func FixedParameterKeys(arguments map[string]any) []string {
	result := make([]string, 0, len(arguments))
	for key := range arguments {
		result = append(result, key)
	}
	return result
}

func configuredParamInput(params []energoninput.PowerParam, source map[string]any) map[string]any {
	result := make(map[string]any, len(params))
	for _, param := range params {
		key := paramInputKey(param)
		if key == "" {
			continue
		}
		if value, exists := source[key]; exists {
			result[key] = value
		}
	}
	return result
}

// VisibleToolArguments returns the fixed form values safe to persist in message metadata.
func VisibleToolArguments(params []energoninput.PowerParam, values map[string]any) map[string]any {
	result := map[string]any{}
	for _, param := range energoninput.FilterActivePowerParams(params, values) {
		controlType := energoninput.NormalizeParamControlType(param.Type)
		if energoninput.IsPromptParamType(param.Type) || energoninput.IsFileParamType(param.Type) ||
			controlType == "hidden" || controlType == "description" {
			continue
		}
		key := paramInputKey(param)
		if value, exists := values[key]; key != "" && exists {
			result[key] = value
		}
	}
	return result
}

func mediaSelections(content map[string]any, params []energoninput.PowerParam) []map[string]any {
	fileKeys := make(map[string]struct{})
	for _, param := range params {
		if key := paramInputKey(param); key != "" && energoninput.IsFileParamType(param.Type) {
			fileKeys[key] = struct{}{}
		}
	}
	result := make([]map[string]any, 0)
	for _, rawPart := range listValue(content["parts"]) {
		part := recordValue(rawPart)
		usage := textValue(part["usage"])
		if _, exists := fileKeys[usage]; !exists {
			continue
		}
		refType := textValue(part["ref_type"])
		refID := uint64Value(part["ref_id"])
		if refID == 0 ||
			(refType != "asset" && refType != "material" && refType != "upload_file" && refType != "artifact") {
			continue
		}
		result = append(result, map[string]any{
			"ref_type":  refType,
			"ref_id":    refID,
			"param_key": usage,
		})
	}
	return result
}

func mediaParamSelected(selections []map[string]any, key string) bool {
	for _, current := range selections {
		if textValue(current["param_key"]) == strings.TrimSpace(key) {
			return true
		}
	}
	return false
}

func paramInputKey(param energoninput.PowerParam) string {
	if key := strings.TrimSpace(param.Key); key != "" {
		return key
	}
	if name := strings.TrimSpace(param.Name); name != "" {
		return name
	}
	if param.ID > 0 {
		return fmt.Sprint(param.ID)
	}
	return ""
}

func recordValue(value any) map[string]any {
	row, _ := value.(map[string]any)
	return row
}

func listValue(value any) []any {
	rows, _ := value.([]any)
	return rows
}

func cloneMap(value map[string]any) map[string]any {
	result := make(map[string]any, len(value))
	for key, current := range value {
		result[key] = current
	}
	return result
}

func textValue(value any) string {
	if value == nil {
		return ""
	}
	return strings.TrimSpace(fmt.Sprint(value))
}

func uint64Value(value any) uint64 {
	switch current := value.(type) {
	case uint64:
		return current
	case uint:
		return uint64(current)
	case int:
		if current > 0 {
			return uint64(current)
		}
	case int64:
		if current > 0 {
			return uint64(current)
		}
	case float64:
		if current > 0 {
			return uint64(current)
		}
	}
	return 0
}
