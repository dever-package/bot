package brain

import (
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	brainmodel "my/package/bot/model/brain"
	frontaction "my/package/front/service/action"
)

const (
	defaultBrainCateID = brainmodel.DefaultBrainCateID
	defaultBrainStatus = brainmodel.StatusEnabled
	defaultBrainSort   = 100
)

type BrainHook struct{}

func (BrainHook) ProviderBeforeSaveBrain(_ *server.Context, params []any) any {
	record := cloneBrainRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialBrainRecord(record)

	trimBrainStringField(record, "name", partial)
	trimBrainStringField(record, "key", partial)
	trimBrainStringField(record, "description", partial)
	trimBrainStringField(record, "persona", partial)
	trimBrainStringField(record, "goal", partial)
	trimBrainStringField(record, "config", partial)
	if !partial && record["name"] == "" {
		panicBrainField("form.name", "大脑名称不能为空。")
	}
	if !partial && record["key"] == "" {
		panicBrainField("form.key", "大脑标识不能为空。")
	}
	if shouldNormalizeBrainField(record, "cate_id", partial) && util.ToUint64(record["cate_id"]) == 0 {
		record["cate_id"] = defaultBrainCateID
	}
	if shouldNormalizeBrainField(record, "config", partial) && record["config"] == "" {
		record["config"] = "{}"
	}
	defaultBrainInt16Field(record, "status", defaultBrainStatus, partial)
	defaultBrainIntField(record, "sort", defaultBrainSort, partial)
	return record
}

func (BrainHook) ProviderBeforeSaveBrainCate(_ *server.Context, params []any) any {
	record := cloneBrainRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialBrainRecord(record)
	trimBrainStringField(record, "name", partial)
	if !partial && record["name"] == "" {
		panicBrainField("form.name", "分类名称不能为空。")
	}
	defaultBrainIntField(record, "sort", defaultBrainSort, partial)
	return record
}

func cloneBrainRecord(params []any) map[string]any {
	if len(params) == 0 || params[0] == nil {
		return map[string]any{}
	}
	if row, ok := params[0].(map[string]any); ok {
		return util.CloneMap(row)
	}
	return map[string]any{}
}

func trimBrainStringField(record map[string]any, field string, partial bool) {
	if !shouldNormalizeBrainField(record, field, partial) {
		return
	}
	record[field] = util.ToStringTrimmed(record[field])
}

func defaultBrainInt16Field(record map[string]any, field string, fallback int16, partial bool) {
	if !shouldNormalizeBrainField(record, field, partial) {
		return
	}
	if util.ToIntDefault(record[field], 0) <= 0 {
		record[field] = fallback
	}
}

func defaultBrainIntField(record map[string]any, field string, fallback int, partial bool) {
	if !shouldNormalizeBrainField(record, field, partial) {
		return
	}
	if util.ToIntDefault(record[field], 0) <= 0 {
		record[field] = fallback
	}
}

func shouldNormalizeBrainField(record map[string]any, field string, partial bool) bool {
	if !partial {
		return true
	}
	_, exists := record[field]
	return exists
}

func isPartialBrainRecord(record map[string]any) bool {
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

func panicBrainField(field string, message string) {
	panic(frontaction.NewFieldError(field, message))
}
