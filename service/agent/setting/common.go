package setting

import (
	"strings"

	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
	frontaction "my/package/front/service/action"
)

const (
	defaultAgentSettingPackID = agentmodel.DefaultSettingPackID
	defaultAgentSkillPackID   = agentmodel.DefaultSkillPackID
	defaultAgentCateID        = uint64(1)
	defaultSkillCateID        = agentmodel.DefaultSkillCateID
	defaultAgentSettingType   = "identity"
	defaultAgentStatus        = int16(1)
	defaultAgentSort          = 100
	defaultAgentTemperature   = 0.7
	defaultAgentTimeout       = 300
	defaultAgentMaxAutoSteps  = 0
)

type AgentHook struct{}

func cloneAgentRecord(params []any) map[string]any {
	if len(params) == 0 || params[0] == nil {
		return map[string]any{}
	}
	if row, ok := params[0].(map[string]any); ok {
		return util.CloneMap(row)
	}
	return map[string]any{}
}

func trimStringField(record map[string]any, field string, partial bool) {
	if !shouldNormalizeField(record, field, partial) {
		return
	}
	record[field] = util.ToStringTrimmed(record[field])
}

func defaultInt16Field(record map[string]any, field string, fallback int16, partial bool) {
	if !shouldNormalizeField(record, field, partial) {
		return
	}
	if util.ToIntDefault(record[field], 0) <= 0 {
		record[field] = fallback
	}
}

func defaultIntField(record map[string]any, field string, fallback int, partial bool) {
	if !shouldNormalizeField(record, field, partial) {
		return
	}
	if util.ToIntDefault(record[field], 0) <= 0 {
		record[field] = fallback
	}
}

func shouldNormalizeField(record map[string]any, field string, partial bool) bool {
	if !partial {
		return true
	}
	_, exists := record[field]
	return exists
}

func isPartialAgentRecord(record map[string]any) bool {
	switch value := record["_partial"].(type) {
	case bool:
		return value
	case string:
		normalized := strings.ToLower(strings.TrimSpace(value))
		return normalized == "1" || normalized == "true" || normalized == "yes"
	case int:
		return value != 0
	case int64:
		return value != 0
	case float64:
		return value != 0
	default:
		return false
	}
}

func normalizePositiveInt(value any, fallback int) int {
	result := util.ToIntDefault(value, fallback)
	if result <= 0 {
		return fallback
	}
	return result
}

func normalizeNonNegativeInt(value any, fallback int) int {
	result := util.ToIntDefault(value, fallback)
	if result < 0 {
		return fallback
	}
	return result
}

func normalizePackItemRows(value any, idField string) []any {
	rawItems := normalizeAgentChildRows(value)
	if len(rawItems) == 0 {
		return []any{}
	}

	items := make([]any, 0, len(rawItems))
	seen := map[uint64]bool{}
	for index, row := range rawItems {
		itemID := util.ToUint64(row[idField])
		if itemID == 0 || seen[itemID] {
			continue
		}
		seen[itemID] = true
		next := util.CloneMap(row)
		next[idField] = itemID
		if util.ToIntDefault(next["status"], 0) <= 0 {
			next["status"] = defaultAgentStatus
		}
		if util.ToIntDefault(next["sort"], 0) <= 0 {
			next["sort"] = index + 1
		}
		items = append(items, next)
	}
	return items
}

func normalizeAgentChildRows(value any) []map[string]any {
	if items, ok := value.([]map[string]any); ok {
		return items
	}
	rawItems, ok := value.([]any)
	if !ok {
		return nil
	}

	rows := make([]map[string]any, 0, len(rawItems))
	for _, item := range rawItems {
		row, ok := item.(map[string]any)
		if !ok || len(row) == 0 {
			continue
		}
		rows = append(rows, row)
	}
	return rows
}

func panicAgentField(field string, message string) {
	panic(frontaction.NewFieldError(field, message))
}
