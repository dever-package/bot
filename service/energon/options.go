package energon

import (
	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	botmodel "github.com/dever-package/bot/model/energon"
	botinput "github.com/dever-package/bot/service/energon/input"
	frontmeta "github.com/dever-package/front/service/meta"
)

type ParamOptionService struct{}

func (ParamOptionService) ProviderLoadParamOptions(c *server.Context, _ []any) any {
	rows := botmodel.NewParamModel().SelectMap(c.Context(), map[string]any{}, map[string]any{
		"field": "main.id, main.name",
		"order": "main.sort asc, main.id asc",
	})
	options := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		options = append(options, map[string]any{
			"id":    util.ToUint64(row["id"]),
			"value": util.ToString(row["name"]),
		})
	}
	return options
}

func (ParamOptionService) ProviderLoadServiceParamRuleOptions(c *server.Context, _ []any) any {
	return loadEnergonModelFieldOptions(c, "bot.energon.NewServiceParamModel", "param_rule")
}

func (ParamOptionService) ProviderLoadServiceParamFileValueFormatOptions(c *server.Context, _ []any) any {
	return loadEnergonModelFieldOptions(c, "bot.energon.NewServiceParamModel", "file_value_format")
}

func (ParamOptionService) ProviderLoadServiceEndpointParamModeOptions(c *server.Context, _ []any) any {
	return loadEnergonModelFieldOptions(c, "bot.energon.NewServiceEndpointModel", "param_mode")
}

func (ParamOptionService) ProviderLoadServiceParamConditionOptions(c *server.Context, params []any) any {
	kind, parentID := botinput.ParseServiceParamConditionParent(serviceOptionParentValue(params))
	switch kind {
	case "category":
		return loadServiceParamConditionParams(c, parentID)
	case "param":
		return loadServiceParamConditionValues(c, parentID)
	default:
		return loadServiceParamConditionCategories(c)
	}
}

func loadEnergonModelFieldOptions(c *server.Context, modelName string, field string) any {
	options := frontmeta.ResolveModelOptions(c.Context(), modelName)
	if rows, exists := options[field]; exists {
		return rows
	}
	return []map[string]any{}
}

func (ParamOptionService) ProviderLoadFileIndexOptions(c *server.Context, params []any) any {
	paramID := serviceOptionParentID(params)
	if paramID == 0 {
		return []map[string]any{}
	}

	row := botmodel.NewParamModel().FindMap(c.Context(), map[string]any{"id": paramID})
	if len(row) == 0 {
		return []map[string]any{}
	}

	paramType := botinput.NormalizeParamControlType(util.ToStringTrimmed(row["type"]))
	maxFiles := 0
	switch paramType {
	case "file":
		maxFiles = 1
	case "files":
		maxFiles = botinput.ServiceParamAttachmentOptionLimit(util.ToIntDefault(row["max_files"], 0))
	default:
		return []map[string]any{}
	}

	options := make([]map[string]any, 0, maxFiles)
	for index := 1; index <= maxFiles; index++ {
		options = append(options, map[string]any{
			"id":    index,
			"value": "第 " + util.ToString(index) + " 个文件",
		})
	}
	return options
}

func loadServiceParamConditionCategories(c *server.Context) []map[string]any {
	categoryIDs := map[uint64]bool{}
	for _, row := range serviceParamConditionParamRows(c) {
		if cateID := util.ToUint64(row["cate_id"]); cateID > 0 {
			categoryIDs[cateID] = true
		}
	}

	rows := botmodel.NewParamCateModel().SelectMap(c.Context(), map[string]any{"status": 1}, map[string]any{
		"order": "sort asc,id asc",
	})
	options := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		cateID := util.ToUint64(row["id"])
		if !categoryIDs[cateID] {
			continue
		}
		options = append(options, map[string]any{
			"id":    botinput.ServiceParamConditionCateOptionID(cateID),
			"value": util.ToStringTrimmed(row["name"]),
			"leaf":  false,
		})
	}
	return options
}

func loadServiceParamConditionParams(c *server.Context, cateID uint64) []map[string]any {
	options := []map[string]any{}
	for _, row := range serviceParamConditionParamRows(c) {
		if util.ToUint64(row["cate_id"]) != cateID {
			continue
		}
		paramID := util.ToUint64(row["id"])
		options = append(options, map[string]any{
			"id":    botinput.ServiceParamConditionParamOptionID(paramID),
			"value": util.ToStringTrimmed(row["name"]),
			"leaf":  false,
		})
	}
	return options
}

func loadServiceParamConditionValues(c *server.Context, paramID uint64) []map[string]any {
	rows := botmodel.NewParamOptionModel().SelectMap(c.Context(), map[string]any{"param_id": paramID}, map[string]any{
		"order": "sort asc,id asc",
	})
	options := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		value := util.ToStringTrimmed(row["value"])
		if value == "" {
			continue
		}
		options = append(options, map[string]any{
			"id":    value,
			"value": util.FirstNonEmpty(util.ToStringTrimmed(row["name"]), value),
			"leaf":  true,
		})
	}
	return options
}

func serviceParamConditionParamRows(c *server.Context) []map[string]any {
	optionParamIDs := map[uint64]bool{}
	for _, row := range botmodel.NewParamOptionModel().SelectMap(c.Context(), map[string]any{}) {
		if paramID := util.ToUint64(row["param_id"]); paramID > 0 {
			optionParamIDs[paramID] = true
		}
	}

	rows := botmodel.NewParamModel().SelectMap(c.Context(), map[string]any{"status": 1}, map[string]any{
		"order": "sort asc,id asc",
	})
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		paramID := util.ToUint64(row["id"])
		if !optionParamIDs[paramID] || botinput.NormalizeParamControlType(util.ToStringTrimmed(row["type"])) != "option" {
			continue
		}
		result = append(result, row)
	}
	return result
}

func serviceOptionParentID(params []any) uint64 {
	if len(params) == 0 {
		return 0
	}
	payload, ok := params[0].(map[string]any)
	if !ok {
		return 0
	}
	return util.ToUint64(payload["parent_id"])
}

func serviceOptionParentValue(params []any) any {
	if len(params) == 0 {
		return nil
	}
	payload, ok := params[0].(map[string]any)
	if !ok {
		return nil
	}
	return payload["parent_id"]
}
