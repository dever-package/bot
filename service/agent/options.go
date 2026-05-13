package agent

import (
	"sort"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
	energonmodel "my/package/bot/model/energon"
)

type OptionService struct{}

func (OptionService) ProviderLoadTextPowers(c *server.Context, _ []any) any {
	rows := energonmodel.NewPowerModel().SelectMap(c.Context(), map[string]any{
		"kind":   "text",
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

func (OptionService) ProviderLoadAgentSettings(c *server.Context, params []any) any {
	agentID := optionParentID(params)
	if agentID == 0 {
		return []map[string]any{}
	}

	rows := agentmodel.NewAgentSettingModel().SelectMap(c.Context(), map[string]any{
		"agent_id": agentID,
	}, map[string]any{
		"field": "main.id, main.agent_id, main.type, main.load_mode, main.description, main.content, main.status",
		"order": "main.id asc",
	})
	options := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		content := util.ToStringTrimmed(row["content"])
		settingType := util.ToStringTrimmed(row["type"])

		options = append(options, map[string]any{
			"id":          util.ToUint64(row["id"]),
			"agent_id":    util.ToUint64(row["agent_id"]),
			"type":        settingType,
			"load_mode":   util.ToStringTrimmed(row["load_mode"]),
			"description": util.ToStringTrimmed(row["description"]),
			"status":      util.ToIntDefault(row["status"], 0),
			"content":     content,
		})
	}
	sort.SliceStable(options, func(i, j int) bool {
		return lessAgentSettingOrder(
			util.ToStringTrimmed(options[i]["type"]),
			util.ToUint64(options[i]["id"]),
			util.ToStringTrimmed(options[j]["type"]),
			util.ToUint64(options[j]["id"]),
		)
	})
	return options
}

func (OptionService) ProviderLoadAgentSettingTypes(_ *server.Context, _ []any) any {
	return agentmodel.AgentSettingTypeOptions()
}

func (OptionService) ProviderLoadSettingLoadModes(_ *server.Context, _ []any) any {
	return agentmodel.SettingLoadModeOptions()
}

func (OptionService) ProviderLoadSettingCates(c *server.Context, _ []any) any {
	rows := agentmodel.NewSettingCateModel().SelectMap(c.Context(), map[string]any{}, map[string]any{
		"field": "main.id, main.name, main.status, main.sort",
		"order": "main.sort asc, main.id asc",
	})
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

func (OptionService) ProviderLoadAgentKnowledgeTypes(_ *server.Context, _ []any) any {
	return agentmodel.AgentKnowledgeTypeOptions()
}

func optionParentID(params []any) uint64 {
	if len(params) == 0 {
		return 0
	}
	payload, ok := params[0].(map[string]any)
	if !ok {
		return 0
	}
	id := util.ToUint64(payload["parent_id"])
	if id == 0 {
		id = util.ToUint64(payload["parentId"])
	}
	return id
}
