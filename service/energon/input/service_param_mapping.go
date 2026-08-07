package input

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/shemic/dever/util"

	botmodel "github.com/dever-package/bot/model/energon"
)

type ServiceParamOptionMapping struct {
	OptionID    uint64
	NativeValue string
}

type ServiceParamComboMapping struct {
	ParamIDs []uint64
	Rows     []ServiceParamComboRow
}

type ServiceParamComboRow struct {
	Values      map[uint64]uint64
	NativeValue string
}

type serviceParamFileMappingSet struct {
	found       bool
	direct      bool
	attachments []any
}

const defaultServiceParamAttachmentOptionLimit = 50

// ServiceParamAttachmentOptionLimit keeps the mapping editor independent from
// one capability parameter's default capacity while retaining a bounded list.
func ServiceParamAttachmentOptionLimit(paramMaxFiles int) int {
	if paramMaxFiles > defaultServiceParamAttachmentOptionLimit {
		return paramMaxFiles
	}
	return defaultServiceParamAttachmentOptionLimit
}

func DecodeServiceParamAttachmentIndexes(value any) ([]int, error) {
	items := decodeMappingArray(value)
	if len(items) == 0 {
		items = List(ParseJSONValue(ValueText(value)))
	}
	if len(items) == 0 {
		return nil, fmt.Errorf("附件映射为空")
	}

	indexes := make([]int, 0, len(items))
	for _, item := range items {
		index := util.ToIntDefault(item, 0)
		if index < 1 {
			return nil, fmt.Errorf("附件映射序号必须从 1 开始")
		}
		indexes = append(indexes, index)
	}
	return indexes, nil
}

// AttachmentMappingCapacity returns the consecutive file coverage shared by
// one or more mappings. Sparse mappings can compose across provider fields.
func attachmentMappingCapacity(values ...any) (int, error) {
	covered := map[int]struct{}{}
	for _, value := range values {
		indexes, err := DecodeServiceParamAttachmentIndexes(value)
		if err != nil {
			return 0, err
		}
		for _, index := range indexes {
			covered[index] = struct{}{}
		}
	}

	for index := 1; index <= len(covered); index++ {
		if _, exists := covered[index]; !exists {
			return index - 1, nil
		}
	}
	return len(covered), nil
}

func collectServiceParamFileMappings(
	paramID uint64,
	condition *ServiceParamCondition,
	serviceParams []botmodel.ServiceParam,
) serviceParamFileMappingSet {
	result := serviceParamFileMappingSet{}
	for _, serviceParam := range serviceParams {
		if !IsActive(serviceParam.Status) || serviceParam.ParamID != paramID || !serviceParamAcceptsInput(serviceParam) {
			continue
		}
		if condition != nil && !sameServiceParamCondition(*condition, serviceParamCondition(serviceParam)) {
			continue
		}
		switch serviceParam.ParamRule {
		case paramRuleDirect, 0:
			result.found = true
			result.direct = true
		case paramRuleFileMap:
			result.found = true
			result.attachments = append(result.attachments, serviceParam.Mapping)
		}
	}
	return result
}

func sameServiceParamCondition(left ServiceParamCondition, right ServiceParamCondition) bool {
	return left.ParamID == right.ParamID && strings.EqualFold(
		strings.TrimSpace(left.Value),
		strings.TrimSpace(right.Value),
	)
}

func DecodeServiceParamOptionMappings(value any) []ServiceParamOptionMapping {
	raw := decodeMappingArray(value)
	if len(raw) == 0 {
		return nil
	}

	items := make([]ServiceParamOptionMapping, 0, len(raw))
	seen := map[uint64]struct{}{}
	for _, item := range raw {
		optionID := serviceParamOptionID(item)
		if optionID == 0 {
			continue
		}
		if _, exists := seen[optionID]; exists {
			continue
		}
		seen[optionID] = struct{}{}
		items = append(items, ServiceParamOptionMapping{
			OptionID:    optionID,
			NativeValue: serviceParamOptionNativeValue(item),
		})
	}
	return items
}

func serviceParamOptionID(value any) uint64 {
	row, ok := value.(map[string]any)
	if !ok {
		return util.ToUint64(value)
	}
	for _, field := range []string{"option_id", "param_option_id", "id"} {
		if id := util.ToUint64(row[field]); id > 0 {
			return id
		}
	}
	return 0
}

func serviceParamOptionNativeValue(value any) string {
	row, ok := value.(map[string]any)
	if !ok {
		return ""
	}
	for _, field := range []string{"native_value", "field_value", "mapped_value", "target_value"} {
		if raw, exists := row[field]; exists {
			return strings.TrimSpace(util.ToString(raw))
		}
	}
	return ""
}

func ServiceParamOptionMappingIDs(items []ServiceParamOptionMapping) []uint64 {
	ids := make([]uint64, 0, len(items))
	for _, item := range items {
		if item.OptionID > 0 {
			ids = append(ids, item.OptionID)
		}
	}
	return ids
}

func ServiceParamOptionMappingRows(items []ServiceParamOptionMapping) []map[string]any {
	rows := make([]map[string]any, 0, len(items))
	for _, item := range items {
		if item.OptionID == 0 {
			continue
		}
		rows = append(rows, map[string]any{
			"option_id":    item.OptionID,
			"native_value": strings.TrimSpace(item.NativeValue),
		})
	}
	return rows
}

func DecodeServiceParamComboMapping(value any) ServiceParamComboMapping {
	raw := DecodeMappingObject(value)
	params := NormalizeUint64List(raw["params"])
	rawRows := decodeMappingArray(raw["rows"])

	rows := make([]ServiceParamComboRow, 0, len(rawRows))
	for _, item := range rawRows {
		row := serviceParamComboMappingRow(item)
		if len(row.Values) > 0 {
			rows = append(rows, row)
		}
	}

	return ServiceParamComboMapping{
		ParamIDs: params,
		Rows:     rows,
	}
}

func serviceParamComboMappingRow(value any) ServiceParamComboRow {
	raw, _ := value.(map[string]any)
	if raw == nil {
		return ServiceParamComboRow{}
	}

	values := map[uint64]uint64{}
	if valueMap, ok := raw["values"].(map[string]any); ok {
		for paramID, optionID := range valueMap {
			if id := util.ToUint64(paramID); id > 0 {
				values[id] = util.ToUint64(optionID)
			}
		}
	}
	if valueMap, ok := raw["values"].(map[uint64]uint64); ok {
		for paramID, optionID := range valueMap {
			if paramID > 0 {
				values[paramID] = optionID
			}
		}
	}

	return ServiceParamComboRow{
		Values:      values,
		NativeValue: serviceParamOptionNativeValue(raw),
	}
}

func ServiceParamComboMappingPayload(mapping ServiceParamComboMapping) map[string]any {
	rows := make([]map[string]any, 0, len(mapping.Rows))
	for _, row := range mapping.Rows {
		values := map[string]any{}
		for _, paramID := range mapping.ParamIDs {
			if optionID := row.Values[paramID]; optionID > 0 {
				values[util.ToString(paramID)] = optionID
			}
		}
		rows = append(rows, map[string]any{
			"values":       values,
			"native_value": strings.TrimSpace(row.NativeValue),
		})
	}

	return map[string]any{
		"params": mapping.ParamIDs,
		"rows":   rows,
	}
}

func decodeMappingArray(value any) []any {
	switch current := value.(type) {
	case []any:
		return current
	case []map[string]any:
		result := make([]any, 0, len(current))
		for _, item := range current {
			if item != nil {
				result = append(result, item)
			}
		}
		return result
	case []uint64:
		result := make([]any, 0, len(current))
		for _, item := range current {
			result = append(result, item)
		}
		return result
	case []int:
		result := make([]any, 0, len(current))
		for _, item := range current {
			result = append(result, item)
		}
		return result
	case string:
		trimmed := strings.TrimSpace(current)
		if trimmed == "" {
			return nil
		}
		var result []any
		if err := json.Unmarshal([]byte(trimmed), &result); err == nil {
			return result
		}
		return []any{trimmed}
	default:
		if current == nil {
			return nil
		}
		return []any{current}
	}
}

func DecodeMappingObject(value any) map[string]any {
	switch current := value.(type) {
	case map[string]any:
		return current
	case string:
		trimmed := strings.TrimSpace(current)
		if trimmed == "" {
			return map[string]any{}
		}
		var result map[string]any
		if err := json.Unmarshal([]byte(trimmed), &result); err == nil && result != nil {
			return result
		}
	}
	return map[string]any{}
}

func NormalizeUint64List(value any) []uint64 {
	raw := decodeMappingArray(value)
	result := make([]uint64, 0, len(raw))
	seen := map[uint64]struct{}{}
	for _, item := range raw {
		id := util.ToUint64(item)
		if id == 0 {
			continue
		}
		if _, exists := seen[id]; exists {
			continue
		}
		seen[id] = struct{}{}
		result = append(result, id)
	}
	return result
}
