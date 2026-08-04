package input

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/shemic/dever/util"

	botmodel "github.com/dever-package/bot/model/energon"
)

const (
	serviceParamConditionCatePrefix  = "cate:"
	serviceParamConditionParamPrefix = "param:"
)

type ServiceParamCondition struct {
	ParamID uint64
	Value   string
}

type ServiceParamConditionPath struct {
	CateID  uint64
	ParamID uint64
	Value   string
}

func EncodeServiceParamConditionPath(cateID uint64, paramID uint64, value string) []any {
	value = strings.TrimSpace(value)
	if cateID == 0 || paramID == 0 || value == "" {
		return []any{}
	}
	return []any{
		ServiceParamConditionCateOptionID(cateID),
		ServiceParamConditionParamOptionID(paramID),
		value,
	}
}

func DecodeServiceParamConditionPath(value any) (ServiceParamConditionPath, error) {
	items := List(value)
	if len(items) == 0 {
		return ServiceParamConditionPath{}, nil
	}
	if len(items) != 3 {
		return ServiceParamConditionPath{}, fmt.Errorf("生效参数必须完整选择分类、参数名和参数值")
	}

	cateID, cateOK := parseServiceParamConditionOptionID(ValueText(items[0]), serviceParamConditionCatePrefix)
	paramID, paramOK := parseServiceParamConditionOptionID(ValueText(items[1]), serviceParamConditionParamPrefix)
	expectedValue := strings.TrimSpace(ValueText(items[2]))
	if !cateOK || !paramOK || expectedValue == "" {
		return ServiceParamConditionPath{}, fmt.Errorf("生效参数选择无效，请重新选择")
	}
	return ServiceParamConditionPath{
		CateID:  cateID,
		ParamID: paramID,
		Value:   expectedValue,
	}, nil
}

func ServiceParamConditionCateOptionID(cateID uint64) string {
	return serviceParamConditionCatePrefix + strconv.FormatUint(cateID, 10)
}

func ServiceParamConditionParamOptionID(paramID uint64) string {
	return serviceParamConditionParamPrefix + strconv.FormatUint(paramID, 10)
}

func ParseServiceParamConditionParent(value any) (kind string, id uint64) {
	text := strings.TrimSpace(util.ToString(value))
	if parsed, ok := parseServiceParamConditionOptionID(text, serviceParamConditionCatePrefix); ok {
		return "category", parsed
	}
	if parsed, ok := parseServiceParamConditionOptionID(text, serviceParamConditionParamPrefix); ok {
		return "param", parsed
	}
	return "", 0
}

func EffectiveServiceParamCondition(serviceParam botmodel.ServiceParam, serviceParams []botmodel.ServiceParam) ServiceParamCondition {
	if condition := serviceParamCondition(serviceParam); condition.ParamID > 0 {
		return condition
	}
	if serviceParam.ParamRule != paramRuleFixedMap || serviceParam.ParamID == 0 {
		return ServiceParamCondition{}
	}
	return CommonServiceParamCondition(serviceParam.ParamID, serviceParams)
}

func CommonServiceParamCondition(paramID uint64, serviceParams []botmodel.ServiceParam) ServiceParamCondition {
	var common ServiceParamCondition
	found := false
	for _, candidate := range serviceParams {
		if !IsActive(candidate.Status) || candidate.ParamID != paramID || !serviceParamAcceptsInput(candidate) {
			continue
		}
		condition := serviceParamCondition(candidate)
		if !found {
			common = condition
			found = true
			continue
		}
		if common.ParamID != condition.ParamID || !strings.EqualFold(common.Value, condition.Value) {
			return ServiceParamCondition{}
		}
	}
	if !found {
		return ServiceParamCondition{}
	}
	return common
}

func ServiceParamConditionMatches(condition ServiceParamCondition, input map[string]any, params map[uint64]botmodel.Param) bool {
	condition.Value = strings.TrimSpace(condition.Value)
	if condition.ParamID == 0 || condition.Value == "" {
		return true
	}
	controller, exists := params[condition.ParamID]
	if !exists || !IsActive(controller.Status) {
		return false
	}
	_, value, exists := ResolveParamValue(input, controller)
	if !exists || IsMissing(value) {
		defaultValue := strings.TrimSpace(controller.DefaultValue)
		if defaultValue == "" {
			return false
		}
		value = ScalarByType(controller.ValueType, ParseJSONValue(defaultValue))
	}
	return strings.EqualFold(
		strings.TrimSpace(ValueText(value)),
		condition.Value,
	)
}

func ServiceParamConditionControllerIDs(serviceParams []botmodel.ServiceParam) map[uint64]bool {
	result := map[uint64]bool{}
	for _, serviceParam := range serviceParams {
		if !IsActive(serviceParam.Status) || serviceParam.ActiveWhenParamID == 0 {
			continue
		}
		result[serviceParam.ActiveWhenParamID] = true
	}
	return result
}

func serviceParamCondition(serviceParam botmodel.ServiceParam) ServiceParamCondition {
	value := strings.TrimSpace(serviceParam.ActiveWhenValue)
	if serviceParam.ActiveWhenParamID == 0 || value == "" {
		return ServiceParamCondition{}
	}
	return ServiceParamCondition{
		ParamID: serviceParam.ActiveWhenParamID,
		Value:   value,
	}
}

func parseServiceParamConditionOptionID(value string, prefix string) (uint64, bool) {
	value = strings.TrimSpace(value)
	if !strings.HasPrefix(value, prefix) {
		return 0, false
	}
	id, err := strconv.ParseUint(strings.TrimSpace(strings.TrimPrefix(value, prefix)), 10, 64)
	return id, err == nil && id > 0
}
