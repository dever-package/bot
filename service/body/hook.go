package body

import (
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	frontaction "my/package/front/service/action"
)

const (
	defaultStatus = int16(1)
	defaultSort   = 100
)

type CanvasHook struct{}

func (CanvasHook) ProviderBeforeSaveCanvas(c *server.Context, params []any) any {
	record := cloneBodyRecord(params)
	if len(record) == 0 {
		return record
	}

	partial := isPartialBodyRecord(record)
	trimBodyStringField(record, "name", partial)
	trimBodyStringField(record, "config", partial)
	if !partial && record["name"] == "" {
		panicBodyField("form.name", "画布名称不能为空。")
	}
	if shouldNormalizeBodyField(record, "config", partial) && record["config"] == "" {
		record["config"] = "{}"
	}
	defaultBodyInt16Field(record, "status", defaultStatus, partial)
	defaultBodyIntField(record, "sort", defaultSort, partial)
	return record
}

func cloneBodyRecord(params []any) map[string]any {
	if len(params) == 0 || params[0] == nil {
		return map[string]any{}
	}
	if row, ok := params[0].(map[string]any); ok {
		return util.CloneMap(row)
	}
	return map[string]any{}
}

func trimBodyStringField(record map[string]any, field string, partial bool) {
	if !shouldNormalizeBodyField(record, field, partial) {
		return
	}
	record[field] = util.ToStringTrimmed(record[field])
}

func defaultBodyInt16Field(record map[string]any, field string, fallback int16, partial bool) {
	if !shouldNormalizeBodyField(record, field, partial) {
		return
	}
	if util.ToIntDefault(record[field], 0) <= 0 {
		record[field] = fallback
	}
}

func defaultBodyIntField(record map[string]any, field string, fallback int, partial bool) {
	if !shouldNormalizeBodyField(record, field, partial) {
		return
	}
	if util.ToIntDefault(record[field], 0) <= 0 {
		record[field] = fallback
	}
}

func shouldNormalizeBodyField(record map[string]any, field string, partial bool) bool {
	if !partial {
		return true
	}
	_, exists := record[field]
	return exists
}

func isPartialBodyRecord(record map[string]any) bool {
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

func panicBodyField(field string, message string) {
	panic(frontaction.NewFieldError(field, message))
}
