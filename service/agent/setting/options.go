package setting

import (
	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
)

type OptionService struct{}

func (OptionService) ProviderLoadTextPowers(c *server.Context, _ []any) any {
	rows := energonmodel.NewPowerModel().SelectMap(c.Context(), map[string]any{
		"kind":        "text",
		"output_type": energonmodel.OutputTypeGeneral,
		"status":      1,
	}, map[string]any{
		"field": "main.id, main.name, main.key, main.kind, main.output_type",
		"order": "main.id asc",
	})
	if len(rows) == 0 {
		return []map[string]any{}
	}
	return rows
}

func (OptionService) ProviderLoadEmbeddingPowers(c *server.Context, _ []any) any {
	rows := energonmodel.NewPowerModel().SelectMap(c.Context(), map[string]any{
		"kind":   "embeddings",
		"status": 1,
	}, map[string]any{
		"field": "main.id, main.name, main.key, main.kind",
		"order": "main.id asc",
	})
	if len(rows) == 0 {
		return []map[string]any{}
	}
	return rows
}

func (OptionService) ProviderLoadKnowledgeParserServices(c *server.Context, _ []any) any {
	rows := agentmodel.NewKnowledgeParserServiceModel().SelectMap(c.Context(), map[string]any{
		"status": 1,
	}, map[string]any{
		"field": "main.id, main.name, main.provider, main.host",
		"order": "main.sort asc, main.id asc",
	})
	if len(rows) == 0 {
		return []map[string]any{}
	}
	return rows
}

func (OptionService) ProviderLoadAgentCates(c *server.Context, _ []any) any {
	ensureBaseAgentCates(c.Context())
	return loadAgentCateOptions(c, enabledCateFilter())
}

func (OptionService) ProviderLoadAllAgentCates(c *server.Context, _ []any) any {
	ensureBaseAgentCates(c.Context())
	return loadAgentCateOptions(c, map[string]any{})
}

func (OptionService) ProviderLoadKnowledgeCates(c *server.Context, _ []any) any {
	return loadCateOptions(agentmodel.NewKnowledgeCateModel().SelectMap(c.Context(), enabledCateFilter(), cateSelectOptions()))
}

func (OptionService) ProviderLoadSkillCates(c *server.Context, _ []any) any {
	return loadCateOptions(agentmodel.NewSkillCateModel().SelectMap(c.Context(), enabledCateFilter(), cateSelectOptions()))
}

func enabledCateFilter() map[string]any {
	return map[string]any{"status": 1}
}

func loadAgentCateOptions(c *server.Context, filters map[string]any) []map[string]any {
	return loadCateOptions(agentmodel.NewAgentCateModel().SelectMap(c.Context(), filters, cateSelectOptions()))
}

func cateSelectOptions() map[string]any {
	return map[string]any{
		"field": "main.id, main.name, main.status, main.sort",
		"order": "main.sort asc, main.id asc",
	}
}

func loadCateOptions(rows []map[string]any) []map[string]any {
	options := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		options = append(options, map[string]any{
			"id":     util.ToUint64(row["id"]),
			"value":  util.ToStringTrimmed(row["name"]),
			"name":   util.ToStringTrimmed(row["name"]),
			"status": util.ToIntDefault(row["status"], 0),
			"sort":   util.ToIntDefault(row["sort"], 0),
		})
	}
	return options
}
