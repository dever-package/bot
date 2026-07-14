package hook

import (
	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	botmodel "github.com/dever-package/bot/model/energon"
	botinput "github.com/dever-package/bot/service/energon/input"
)

type ParamHook struct{}

func (ParamHook) ProviderBeforeSaveParam(c *server.Context, params []any) any {
	record := cloneEnergonRecord(params)
	if len(record) == 0 {
		return record
	}
	paramID := util.ToUint64(record["id"])

	record["name"] = util.ToStringTrimmed(record["name"])
	record["key"] = util.ToStringTrimmed(record["key"])
	record["default_value"] = util.ToStringTrimmed(record["default_value"])
	paramType := botinput.NormalizeParamControlType(util.ToStringTrimmed(record["type"]))
	record["type"] = paramType
	record["value_type"] = botinput.NormalizeParamValueType(util.ToStringTrimmed(record["value_type"]))
	ensureDefaultCategory(record)

	usage := int16(util.ToIntDefault(record["usage"], int(paramUsageMain)))
	if usage != paramUsageMain && usage != paramUsageToolbar {
		usage = paramUsageMain
	}
	record["usage"] = usage

	if util.ToIntDefault(record["sort"], 0) <= 0 {
		record["sort"] = defaultRecordSort
	}
	if util.ToIntDefault(record["status"], 0) <= 0 {
		record["status"] = defaultRecordStatus
	}

	switch paramType {
	case "file":
		if util.ToUint64(record["upload_rule_id"]) == 0 {
			record["upload_rule_id"] = defaultUploadRuleID
		}
		record["max_files"] = 0
		record["options"] = []any{}
	case "files":
		if util.ToUint64(record["upload_rule_id"]) == 0 {
			record["upload_rule_id"] = defaultUploadRuleID
		}
		maxFiles := util.ToIntDefault(record["max_files"], 0)
		if maxFiles <= 0 {
			maxFiles = defaultMaxFiles
		}
		record["max_files"] = maxFiles
		record["options"] = []any{}
	case "option", "multi_option":
		record["upload_rule_id"] = 0
		record["max_files"] = 0
		record["options"] = normalizeParamOptionRows(c, paramID, record["options"])
	case "hidden":
		if record["default_value"] == "" {
			panicParamField("form.default_value", "隐藏框必须填写默认值")
		}
		record["upload_rule_id"] = 0
		record["max_files"] = 0
		record["options"] = []any{}
	case "description":
		record["upload_rule_id"] = 0
		record["max_files"] = 0
		record["options"] = []any{}
	default:
		record["upload_rule_id"] = 0
		record["max_files"] = 0
		record["options"] = []any{}
	}

	return record
}

func (ParamHook) ProviderBeforeDeleteParam(c *server.Context, params []any) any {
	record := cloneEnergonRecord(params)
	paramIDs := collectDeleteIDs(record)
	if len(paramIDs) == 0 {
		return record
	}

	filters := map[string]any{"param_id": uint64IDsToAny(paramIDs)}
	botmodel.NewServiceParamModel().Delete(c.Context(), filters)
	botmodel.NewPowerParamModel().Delete(c.Context(), filters)
	return record
}

func normalizeParamOptionRows(c *server.Context, paramID uint64, value any) []any {
	rawItems := normalizeChildRecordRows(value)
	if len(rawItems) == 0 {
		return []any{}
	}

	items := make([]map[string]any, 0, len(rawItems))
	naturalRows := make([]naturalKeyedChildRow, 0, len(rawItems))
	seenValues := make(map[string]struct{}, len(rawItems))
	existingIDs := existingParamOptionIDsByValue(c, paramID)
	for _, row := range rawItems {
		name := util.ToStringTrimmed(row["name"])
		optionValue := util.ToStringTrimmed(row["value"])
		if name == "" && optionValue == "" {
			continue
		}
		if optionValue == "" {
			panicParamField("form.options", "选项值不能为空")
		}
		if _, exists := seenValues[optionValue]; exists {
			panicParamField("form.options", "选项值不能重复："+optionValue)
		}
		seenValues[optionValue] = struct{}{}
		if name == "" {
			name = optionValue
		}

		next := util.CloneMap(row)
		next["name"] = name
		next["value"] = optionValue
		if util.ToIntDefault(next["sort"], 0) <= 0 {
			next["sort"] = defaultRecordSort
		}
		items = append(items, next)
		naturalRows = append(naturalRows, naturalKeyedChildRow{
			row:        next,
			naturalKey: optionValue,
			originalID: util.ToUint64(row["id"]),
		})
	}
	assignNaturalKeyedChildIDs(naturalRows, existingIDs)
	return anyChildRows(items)
}

func existingParamOptionIDsByValue(c *server.Context, paramID uint64) map[string]uint64 {
	if paramID == 0 {
		return nil
	}

	rows := botmodel.NewParamOptionModel().SelectMap(c.Context(), map[string]any{
		"param_id": paramID,
	})
	result := make(map[string]uint64, len(rows))
	for _, row := range rows {
		id := util.ToUint64(row["id"])
		optionValue := util.ToStringTrimmed(row["value"])
		if id > 0 {
			result[optionValue] = id
		}
	}
	return result
}
