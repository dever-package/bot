package energon

import (
	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	botmodel "my/package/bot/model/energon"
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
