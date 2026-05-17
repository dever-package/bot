package hook

import (
	"encoding/json"

	"github.com/shemic/dever/util"

	frontaction "my/package/front/service/action"
)

const (
	paramRuleDirect      int16  = 1
	paramRuleOptionMap   int16  = 2
	paramRuleFileMap     int16  = 3
	paramRuleComboMap    int16  = 4
	paramRuleFixedMap    int16  = 5
	defaultRecordStatus  int16  = 1
	defaultRecordSort           = 100
	defaultCategoryID    uint64 = 1
	paramUsageMain       int16  = 1
	paramUsageToolbar    int16  = 2
	powerParamShowAlways int16  = 1
	powerParamShowSource int16  = 2
	powerParamRequired   int16  = 1
	powerParamOptional   int16  = 2
	powerSourceRuleFirst int16  = 1
	powerSourceRulePick  int16  = 2
	defaultMaxFiles             = 5
	defaultUploadRuleID  uint64 = 1
	endpointParamModeAll        = "all"
	endpointParamModeAny        = "any"
)

func isActive(status int16) bool {
	return status == defaultRecordStatus
}

func ensureDefaultCategory(record map[string]any) {
	if util.ToUint64(record["cate_id"]) == 0 {
		record["cate_id"] = defaultCategoryID
	}
}

type naturalKeyedChildRow struct {
	row        map[string]any
	naturalKey string
	originalID uint64
}

func assignNaturalKeyedChildIDs(rows []naturalKeyedChildRow, existingIDs map[string]uint64) {
	if len(rows) == 0 {
		return
	}

	// Relation 保存会先 upsert 再删除旧子记录；自然键复用原 ID 可避免唯一键短暂冲突。
	usedIDs := map[uint64]struct{}{}
	pendingRows := make([]naturalKeyedChildRow, 0, len(rows))
	for _, row := range rows {
		if id := existingIDs[row.naturalKey]; id > 0 {
			row.row["id"] = id
			usedIDs[id] = struct{}{}
			continue
		}
		pendingRows = append(pendingRows, row)
	}

	for _, row := range pendingRows {
		if row.originalID > 0 {
			if _, used := usedIDs[row.originalID]; !used {
				row.row["id"] = row.originalID
				usedIDs[row.originalID] = struct{}{}
				continue
			}
		}

		delete(row.row, "id")
	}
}

func anyChildRows(rows []map[string]any) []any {
	result := make([]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, row)
	}
	return result
}

func normalizeChildRecordRows(value any) []map[string]any {
	switch rows := value.(type) {
	case []map[string]any:
		result := make([]map[string]any, 0, len(rows))
		for _, row := range rows {
			if row != nil {
				result = append(result, row)
			}
		}
		return result
	case []any:
		result := make([]map[string]any, 0, len(rows))
		for _, item := range rows {
			if row, ok := item.(map[string]any); ok && row != nil {
				result = append(result, row)
			}
		}
		return result
	default:
		return nil
	}
}

func mustJSONString(value any) string {
	encoded, err := json.Marshal(value)
	if err != nil {
		panic(err.Error())
	}
	return string(encoded)
}

func cloneEnergonRecord(params []any) map[string]any {
	if len(params) == 0 {
		return map[string]any{}
	}
	record, _ := params[0].(map[string]any)
	if record == nil {
		return map[string]any{}
	}
	return util.CloneMap(record)
}

func panicParamField(field string, message string) {
	panic(frontaction.NewFieldError(field, message))
}

func panicServiceParamField(message string) {
	panicParamField("form.params", message)
}

func panicServiceEndpointField(message string) {
	panicParamField("form.endpoints", message)
}

func panicPowerTargetField(message string) {
	panicParamField("form.targets", message)
}

func panicPowerParamField(message string) {
	panicParamField("form.params", message)
}
