package energon

import (
	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	botmodel "my/package/bot/model/energon"
	botinput "my/package/bot/service/energon/input"
)

const defaultMaxFiles = 5

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
		maxFiles = util.ToIntDefault(row["max_files"], defaultMaxFiles)
		if maxFiles <= 0 {
			maxFiles = defaultMaxFiles
		}
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
