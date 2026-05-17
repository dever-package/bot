package setting

import (
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
)

func (AgentHook) ProviderBeforeSaveAgentSetting(_ *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialAgentRecord(record)

	if !partial && util.ToUint64(record["agent_id"]) == 0 {
		panicAgentField("form.agent_id", "智能体不能为空。")
	}
	trimStringField(record, "type", partial)
	trimStringField(record, "content", partial)
	if shouldNormalizeField(record, "type", partial) {
		record["type"] = normalizeAgentSettingType(util.ToStringTrimmed(record["type"]))
	}
	trimStringField(record, "load_mode", partial)
	trimStringField(record, "description", partial)
	if shouldNormalizeField(record, "load_mode", partial) {
		record["load_mode"] = normalizeSettingLoadMode(util.ToStringTrimmed(record["load_mode"]))
	}
	if !partial && util.ToStringTrimmed(record["content"]) == "" {
		panicAgentField("form.content", "智能体设定不能为空。")
	}
	defaultInt16Field(record, "status", defaultAgentStatus, partial)
	return record
}

func (AgentHook) ProviderBeforeSaveSettingPack(_ *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialAgentRecord(record)

	trimStringField(record, "name", partial)
	trimStringField(record, "description", partial)
	if !partial && record["name"] == "" {
		panicAgentField("form.name", "方案名称不能为空。")
	}
	defaultInt16Field(record, "status", defaultAgentStatus, partial)
	defaultIntField(record, "sort", defaultAgentSort, partial)
	if rawItems, exists := record["items"]; exists {
		record["items"] = normalizeSettingPackItemRows(rawItems)
	}
	return record
}

func (AgentHook) ProviderBeforeSaveSettingPackItem(_ *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialAgentRecord(record)
	if !partial && util.ToUint64(record["pack_id"]) == 0 {
		panicAgentField("form.pack_id", "方案不能为空。")
	}
	if !partial && util.ToUint64(record["setting_id"]) == 0 {
		panicAgentField("form.setting_id", "规则不能为空。")
	}
	defaultInt16Field(record, "status", defaultAgentStatus, partial)
	defaultIntField(record, "sort", defaultAgentSort, partial)
	return record
}

func (AgentHook) ProviderAfterSaveSetting(c *server.Context, params []any) any {
	payload := cloneAgentRecord(params)
	if len(payload) == 0 {
		return nil
	}

	packID := settingPackIDFromSavePayload(payload)
	settingID := settingIDFromSavePayload(payload)
	if settingID == 0 || packID == 0 {
		return nil
	}

	ensureSettingInPack(c, packID, settingID)
	return nil
}

func settingPackIDFromSavePayload(payload map[string]any) uint64 {
	for _, key := range []string{"payload", "data"} {
		record, ok := payload[key].(map[string]any)
		if !ok {
			continue
		}
		if packID := util.ToUint64(record["pack_id"]); packID > 0 {
			return packID
		}
		if packID := util.ToUint64(record["packId"]); packID > 0 {
			return packID
		}
	}
	return util.ToUint64(payload["pack_id"])
}

func settingIDFromSavePayload(payload map[string]any) uint64 {
	if settingID := util.ToUint64(payload["id"]); settingID > 0 {
		return settingID
	}
	for _, key := range []string{"result", "data"} {
		record, ok := payload[key].(map[string]any)
		if !ok {
			continue
		}
		if settingID := util.ToUint64(record["id"]); settingID > 0 {
			return settingID
		}
	}
	return 0
}

func ensureSettingInPack(c *server.Context, packID uint64, settingID uint64) {
	model := agentmodel.NewSettingPackItemModel()
	existing := model.Find(c.Context(), map[string]any{
		"pack_id":    packID,
		"setting_id": settingID,
	})
	if existing != nil {
		if existing.Status != defaultAgentStatus {
			model.Update(c.Context(), map[string]any{"id": existing.ID}, map[string]any{
				"status": defaultAgentStatus,
			})
		}
		return
	}

	model.Insert(c.Context(), map[string]any{
		"pack_id":    packID,
		"setting_id": settingID,
		"status":     defaultAgentStatus,
		"sort":       nextSettingPackItemSort(c, packID),
	})
}

func nextSettingPackItemSort(c *server.Context, packID uint64) int {
	rows := agentmodel.NewSettingPackItemModel().Select(c.Context(), map[string]any{
		"pack_id": packID,
	})
	maxSort := 0
	for _, row := range rows {
		if row == nil || row.Sort <= maxSort {
			continue
		}
		maxSort = row.Sort
	}
	if maxSort <= 0 {
		return defaultAgentSort
	}
	return maxSort + 10
}

func normalizeAgentSettingType(settingType string) string {
	switch strings.ToLower(strings.TrimSpace(settingType)) {
	case "identity", "persona", "role":
		return "identity"
	case "responsibility", "duty", "scope":
		return "responsibility"
	case "behavior", "style":
		return "behavior"
	case "workflow", "task":
		return "workflow"
	case "guardrail", "boundary":
		return "guardrail"
	case "output":
		return "output"
	case "example":
		return "example"
	case "tool":
		return "tool"
	case "other":
		return "other"
	default:
		return defaultAgentSettingType
	}
}

func normalizeSettingLoadMode(loadMode string) string {
	switch strings.ToLower(strings.TrimSpace(loadMode)) {
	case "always", "discover", "manual":
		return strings.ToLower(strings.TrimSpace(loadMode))
	default:
		return "always"
	}
}

func normalizeSettingPackItemRows(value any) []any {
	return normalizePackItemRows(value, "setting_id")
}
