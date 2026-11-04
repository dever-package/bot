package input

import (
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
)

const (
	paramRuleDirect      int16 = 1
	paramRuleOptionMap   int16 = 2
	paramRuleFileMap     int16 = 3
	paramRuleComboMap    int16 = 4
	paramRuleFixedMap    int16 = 5
	paramRuleObjectList        = botmodel.ServiceParamRuleObjectList
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

func serviceParamAcceptsInput(serviceParam botmodel.ServiceParam) bool {
	return serviceParam.ParamRule != paramRuleFixedMap
}

func NormalizeParamControlType(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "prompt":
		return "prompt"
	case "textarea", "text", "string":
		return "textarea"
	case "input", "number":
		return "input"
	case "switch", "bool", "boolean":
		return "switch"
	case botmodel.ParamTypeGroup:
		return botmodel.ParamTypeGroup
	case "option", "multi_option", "file", "files", "hidden", "description":
		return strings.ToLower(strings.TrimSpace(value))
	default:
		return "input"
	}
}

func IsPromptParamType(paramType string) bool {
	return NormalizeParamControlType(paramType) == "prompt"
}

func IsPromptParam(param botmodel.Param) bool {
	return IsPromptParamType(param.Type)
}

func NormalizeParamValueType(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "number", "int", "integer", "float", "double":
		return "number"
	default:
		return "string"
	}
}

func NormalizeParamPreviewType(value string) string {
	normalized := strings.ToLower(strings.TrimSpace(value))
	switch normalized {
	case "image", "audio", "video":
		return normalized
	default:
		return "none"
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

func IsFileParamType(paramType string) bool {
	switch NormalizeParamControlType(paramType) {
	case "file", "files":
		return true
	default:
		return false
	}
}

func PowerParamRequiresInput(powerParam botmodel.PowerParam) bool {
	return normalizePowerParamRequired(int(powerParam.Status)) == powerParamRequired
}

func ShowPowerParamForSource(powerParam botmodel.PowerParam, serviceParamIDs map[uint64]bool) bool {
	if serviceParamIDs == nil {
		return normalizePowerParamShow(int(powerParam.Show)) == powerParamShowAlways
	}
	return serviceParamIDs[powerParam.ParamID]
}

func PickPowerParam(items []botmodel.PowerParam, used map[[2]uint64]struct{}) (botmodel.PowerParam, bool) {
	if len(items) == 0 {
		return botmodel.PowerParam{}, false
	}
	for _, item := range items {
		key := [2]uint64{item.ID, item.ParamID}
		if _, exists := used[key]; exists {
			continue
		}
		used[key] = struct{}{}
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
