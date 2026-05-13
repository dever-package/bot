package input

import (
	"strings"

	botmodel "my/package/bot/model/energon"
)

const (
	paramRuleDirect      int16 = 1
	paramRuleOptionMap   int16 = 2
	paramRuleFileMap     int16 = 3
	paramRuleComboMap    int16 = 4
	paramRuleFixedMap    int16 = 5
	statusActive         int16 = 1
	powerParamShowAlways int16 = 1
	powerParamRequired   int16 = 1
	paramUsageMain       int16 = 1
	paramUsageToolbar    int16 = 2
	endpointParamModeAll       = "all"
	endpointParamModeAny       = "any"
)

func IsActive(status int16) bool {
	return status == statusActive
}

func NormalizeParamControlType(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "textarea", "text", "string":
		return "textarea"
	case "input", "number":
		return "input"
	case "switch", "bool", "boolean":
		return "switch"
	case "option", "multi_option", "file", "files", "hidden", "description":
		return strings.ToLower(strings.TrimSpace(value))
	default:
		return "input"
	}
}

func NormalizeParamValueType(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "number", "int", "integer", "float", "double":
		return "number"
	default:
		return "string"
	}
}

func NormalizeEndpointParamMode(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case endpointParamModeAny:
		return endpointParamModeAny
	default:
		return endpointParamModeAll
	}
}

func IsOptionParamType(paramType string) bool {
	switch NormalizeParamControlType(paramType) {
	case "option", "multi_option":
		return true
	default:
		return false
	}
}

func PowerParamRequiresInput(powerParam botmodel.PowerParam) bool {
	return normalizePowerParamRequired(int(powerParam.Status)) == powerParamRequired
}

func ShowPowerParamForSource(powerParam botmodel.PowerParam, serviceParamIDs map[uint64]bool) bool {
	if normalizePowerParamShow(int(powerParam.Show)) == powerParamShowAlways {
		return true
	}
	return serviceParamIDs[powerParam.ParamID]
}

func PickPowerParam(items []botmodel.PowerParam, used map[uint64]struct{}) (botmodel.PowerParam, bool) {
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

func normalizePowerParamRequired(value int) int16 {
	if int16(value) == 2 {
		return 2
	}
	return powerParamRequired
}

func normalizePowerParamShow(value int) int16 {
	if int16(value) == 2 {
		return 2
	}
	return powerParamShowAlways
}

func ParamRequiresInput(param botmodel.Param) bool {
	switch NormalizeParamControlType(param.Type) {
	case "hidden", "description":
		return false
	default:
		return true
	}
}
