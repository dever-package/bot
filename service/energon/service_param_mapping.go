package energon

import (
	"encoding/json"
	"strings"

	"github.com/shemic/dever/util"
)

type serviceParamOptionMapping struct {
	OptionID    uint64
	NativeValue string
}

type serviceParamComboMapping struct {
	ParamIDs []uint64
	Rows     []serviceParamComboRow
}

type serviceParamComboRow struct {
	Values      map[uint64]uint64
	NativeValue string
}

func decodeServiceParamOptionMappings(value any) []serviceParamOptionMapping {
	raw := decodeMappingArray(value)
	if len(raw) == 0 {
		return nil
	}

	items := make([]serviceParamOptionMapping, 0, len(raw))
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
		items = append(items, serviceParamOptionMapping{
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

func serviceParamOptionMappingIDs(items []serviceParamOptionMapping) []uint64 {
	ids := make([]uint64, 0, len(items))
	for _, item := range items {
		if item.OptionID > 0 {
			ids = append(ids, item.OptionID)
		}
	}
	return ids
}

func serviceParamOptionMappingRows(items []serviceParamOptionMapping) []map[string]any {
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

func decodeServiceParamComboMapping(value any) serviceParamComboMapping {
	raw := decodeMappingObject(value)
	params := normalizeUint64List(raw["params"])
	rawRows := decodeMappingArray(raw["rows"])

	rows := make([]serviceParamComboRow, 0, len(rawRows))
	for _, item := range rawRows {
		row := serviceParamComboMappingRow(item)
		if len(row.Values) > 0 {
			rows = append(rows, row)
		}
	}

	return serviceParamComboMapping{
		ParamIDs: params,
		Rows:     rows,
	}
}

func serviceParamComboMappingRow(value any) serviceParamComboRow {
	raw, _ := value.(map[string]any)
	if raw == nil {
		return serviceParamComboRow{}
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

	return serviceParamComboRow{
		Values:      values,
		NativeValue: serviceParamOptionNativeValue(raw),
	}
}

func serviceParamComboMappingPayload(mapping serviceParamComboMapping) map[string]any {
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

func decodeMappingObject(value any) map[string]any {
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

func normalizeUint64List(value any) []uint64 {
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
