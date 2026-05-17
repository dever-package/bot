package hook

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	botmodel "my/package/bot/model/energon"
	botinput "my/package/bot/service/energon/input"
)

func normalizeServiceParamMapping(c *server.Context, paramRow map[string]any, rule int16, value any) string {
	paramType := botinput.NormalizeParamControlType(util.ToStringTrimmed(paramRow["type"]))
	switch rule {
	case paramRuleDirect:
		return ""
	case paramRuleOptionMap:
		if paramType != "option" && paramType != "multi_option" {
			panicServiceParamField("选项映射只支持单选或多选参数")
		}
		mappings := botinput.DecodeServiceParamOptionMappings(value)
		if len(mappings) == 0 {
			panicServiceParamField("选项映射必须选择至少一个参数选项")
		}
		optionIDs := botinput.ServiceParamOptionMappingIDs(mappings)
		if !paramOptionsExist(c, util.ToUint64(paramRow["id"]), optionIDs) {
			panicServiceParamField("选项映射包含无效的参数选项")
		}
		return mustJSONString(botinput.ServiceParamOptionMappingRows(mappings))
	case paramRuleFileMap:
		if paramType != "file" && paramType != "files" {
			panicServiceParamField("附件映射只支持单文件或多文件参数")
		}
		indexes := normalizeIntArray(value)
		if len(indexes) == 0 {
			panicServiceParamField("附件映射必须选择至少一个文件序号")
		}
		maxIndex := 1
		if paramType == "files" {
			maxIndex = util.ToIntDefault(paramRow["max_files"], 0)
			if maxIndex <= 0 {
				maxIndex = defaultMaxFiles
			}
		}
		for _, index := range indexes {
			if index < 1 || index > maxIndex {
				panicServiceParamField(fmt.Sprintf("附件映射序号必须在 1 到 %d 之间", maxIndex))
			}
		}
		return mustJSONString(indexes)
	case paramRuleComboMap:
		return mustJSONString(normalizeServiceParamComboMapping(c, value))
	case paramRuleFixedMap:
		return normalizeFixedServiceParamMapping(value)
	default:
		panicServiceParamField("未知的服务参数映射规则")
	}
	return ""
}

func serviceParamMappingInput(paramID uint64, rule int16, row map[string]any) any {
	value := row["mapping"]
	if rule != paramRuleComboMap {
		return value
	}

	extraParamIDs := normalizeComboParamIDs(row)
	if len(extraParamIDs) == 0 {
		return value
	}

	mapping := botinput.DecodeMappingObject(value)
	mapping["params"] = append([]uint64{paramID}, extraParamIDs...)
	return mapping
}

func normalizeComboParamIDs(row map[string]any) []uint64 {
	if ids := botinput.NormalizeUint64List(row["combo_param_ids"]); len(ids) > 0 {
		return ids
	}

	rows := decodeMappingArray(row["combo_params"])
	result := make([]uint64, 0, len(rows))
	seen := map[uint64]struct{}{}
	for _, item := range rows {
		paramID := serviceParamComboParamID(item)
		if paramID == 0 {
			continue
		}
		if _, exists := seen[paramID]; exists {
			continue
		}
		seen[paramID] = struct{}{}
		result = append(result, paramID)
	}
	return result
}

func serviceParamComboParamID(value any) uint64 {
	if row, ok := value.(map[string]any); ok {
		return util.ToUint64(row["param_id"])
	}
	return util.ToUint64(value)
}

func normalizeFixedServiceParamMapping(value any) string {
	text := util.ToStringTrimmed(value)
	if text == "" {
		panicServiceParamField("固定值映射必须填写字段值")
	}
	return text
}

func normalizeServiceParamComboMapping(c *server.Context, value any) map[string]any {
	mapping := botinput.DecodeServiceParamComboMapping(value)
	if len(mapping.ParamIDs) < 2 {
		panicServiceParamField("组合映射必须包含主参数和至少一个参与参数")
	}

	validateComboMappingParams(c, mapping.ParamIDs)

	if len(mapping.Rows) == 0 {
		panicServiceParamField("组合映射必须配置至少一条字段值")
	}

	seenRows := map[string]struct{}{}
	optionIDsByParam := map[uint64][]uint64{}
	seenOptionIDsByParam := map[uint64]map[uint64]struct{}{}
	for _, row := range mapping.Rows {
		if strings.TrimSpace(row.NativeValue) == "" {
			panicServiceParamField("组合映射的字段值不能为空")
		}
		signature := make([]string, 0, len(mapping.ParamIDs))
		for _, paramID := range mapping.ParamIDs {
			optionID := row.Values[paramID]
			if optionID == 0 {
				panicServiceParamField("组合映射每一行都必须选择所有参与参数的选项")
			}
			optionIDsByParam[paramID], seenOptionIDsByParam[paramID] = appendUniqueUint64(
				optionIDsByParam[paramID],
				seenOptionIDsByParam[paramID],
				optionID,
			)
			signature = append(signature, util.ToString(optionID))
		}
		key := strings.Join(signature, "|")
		if _, exists := seenRows[key]; exists {
			panicServiceParamField("组合映射不能重复配置相同的参数组合")
		}
		seenRows[key] = struct{}{}
	}

	for paramID, optionIDs := range optionIDsByParam {
		if !paramOptionsExist(c, paramID, optionIDs) {
			panicServiceParamField("组合映射包含无效的参数选项")
		}
	}

	return botinput.ServiceParamComboMappingPayload(mapping)
}

func validateComboMappingParams(c *server.Context, paramIDs []uint64) {
	for _, paramID := range paramIDs {
		paramRow := botmodel.NewParamModel().FindMap(c.Context(), map[string]any{"id": paramID})
		if len(paramRow) == 0 {
			panicServiceParamField("组合映射选择的参与参数不存在")
		}
		if !botinput.IsOptionParamType(util.ToStringTrimmed(paramRow["type"])) {
			panicServiceParamField("组合映射的参与参数只支持单选或多选参数")
		}
	}
}

func appendUniqueUint64(items []uint64, seen map[uint64]struct{}, value uint64) ([]uint64, map[uint64]struct{}) {
	if value == 0 {
		return items, seen
	}
	if seen == nil {
		seen = map[uint64]struct{}{}
	}
	if _, exists := seen[value]; exists {
		return items, seen
	}
	seen[value] = struct{}{}
	return append(items, value), seen
}

func paramOptionsExist(c *server.Context, paramID uint64, optionIDs []uint64) bool {
	if paramID == 0 || len(optionIDs) == 0 {
		return false
	}

	filterIDs := make([]any, 0, len(optionIDs))
	for _, id := range optionIDs {
		filterIDs = append(filterIDs, id)
	}
	rows := botmodel.NewParamOptionModel().SelectMap(c.Context(), map[string]any{
		"param_id": paramID,
		"id":       filterIDs,
	})
	return len(rows) == len(optionIDs)
}

func normalizeIntArray(value any) []int {
	raw := decodeMappingArray(value)
	result := make([]int, 0, len(raw))
	seen := map[int]struct{}{}
	for _, item := range raw {
		index := util.ToIntDefault(item, 0)
		if index <= 0 {
			continue
		}
		if _, exists := seen[index]; exists {
			continue
		}
		seen[index] = struct{}{}
		result = append(result, index)
	}
	return result
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
