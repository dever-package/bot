package agent

import (
	"math"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
	energonmodel "my/package/bot/model/energon"
	frontaction "my/package/front/service/action"
)

const (
	defaultAgentSettingPackID = agentmodel.DefaultSettingPackID
	defaultAgentCateID        = uint64(1)
	defaultAgentSettingType   = "identity"
	defaultAgentStatus        = int16(1)
	defaultAgentSort          = 100
	defaultAgentTemperature   = 0.7
	defaultAgentTimeout       = 300
)

type AgentHook struct{}

func (AgentHook) ProviderBeforeSaveAgent(c *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	if len(record) == 0 {
		return record
	}

	record["name"] = util.ToStringTrimmed(record["name"])
	record["key"] = util.ToStringTrimmed(record["key"])
	record["description"] = util.ToStringTrimmed(record["description"])
	if util.ToUint64(record["cate_id"]) == 0 {
		record["cate_id"] = defaultAgentCateID
	}
	if util.ToUint64(record["setting_pack_id"]) == 0 {
		record["setting_pack_id"] = defaultAgentSettingPackID
	}
	defaultInt16Field(record, "status", defaultAgentStatus, false)
	defaultIntField(record, "sort", defaultAgentSort, false)
	record["temperature"] = normalizeAgentTemperature(record["temperature"])
	record["timeout_seconds"] = normalizePositiveInt(record["timeout_seconds"], defaultAgentTimeout)

	validateAgentLLMPower(c, util.ToUint64(record["llm_power_id"]))
	return record
}

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

func (AgentHook) ProviderBeforeSaveSettingPack(c *server.Context, params []any) any {
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

func (AgentHook) ProviderBeforeSaveSettingPackItem(c *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialAgentRecord(record)
	if !partial && util.ToUint64(record["pack_id"]) == 0 {
		panicAgentField("form.pack_id", "方案不能为空。")
	}
	if !partial && util.ToUint64(record["setting_id"]) == 0 {
		panicAgentField("form.setting_id", "通用规则不能为空。")
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

func (AgentHook) ProviderBeforeSaveAgentKnowledge(_ *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialAgentRecord(record)

	if !partial && util.ToUint64(record["agent_id"]) == 0 {
		panicAgentField("form.agent_id", "智能体不能为空。")
	}
	trimStringField(record, "name", partial)
	trimStringField(record, "type", partial)
	trimStringField(record, "load_mode", partial)
	trimStringField(record, "description", partial)
	trimStringField(record, "content", partial)
	if shouldNormalizeField(record, "type", partial) {
		record["type"] = normalizeAgentKnowledgeType(util.ToStringTrimmed(record["type"]))
	}
	if shouldNormalizeField(record, "load_mode", partial) {
		record["load_mode"] = normalizeSettingLoadMode(util.ToStringTrimmed(record["load_mode"]))
	}
	if !partial && util.ToStringTrimmed(record["name"]) == "" {
		panicAgentField("form.name", "资料名称不能为空。")
	}
	if !partial && util.ToStringTrimmed(record["content"]) == "" {
		panicAgentField("form.content", "资料正文不能为空。")
	}
	defaultInt16Field(record, "status", defaultAgentStatus, partial)
	defaultIntField(record, "sort", defaultAgentSort, partial)
	return record
}

func cloneAgentRecord(params []any) map[string]any {
	if len(params) == 0 || params[0] == nil {
		return map[string]any{}
	}
	if row, ok := params[0].(map[string]any); ok {
		return util.CloneMap(row)
	}
	return map[string]any{}
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

func normalizeAgentTemperature(value any) float64 {
	temperature, ok := util.ParseFloat64(value)
	if !ok {
		temperature = defaultAgentTemperature
	}
	temperature = math.Round(temperature*100) / 100
	if temperature < 0 {
		panicAgentField("form.temperature", "温度不能小于 0。")
	}
	if temperature > 2 {
		panicAgentField("form.temperature", "温度不能大于 2。")
	}
	return temperature
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

func validateAgentLLMPower(c *server.Context, powerID uint64) {
	if powerID == 0 {
		panicAgentField("form.llm_power_id", "LLM能力不能为空。")
	}
	row := energonmodel.NewPowerModel().Find(c.Context(), map[string]any{"id": powerID})
	if row == nil {
		panicAgentField("form.llm_power_id", "LLM能力不存在。")
	}
	if row.Status != 1 {
		panicAgentField("form.llm_power_id", "LLM能力已停用。")
	}
	if strings.ToLower(strings.TrimSpace(row.Kind)) != "text" {
		panicAgentField("form.llm_power_id", "LLM能力只能选择文本类型能力。")
	}
}

func agentSettingTypeLabel(settingType string) string {
	switch normalizeAgentSettingType(settingType) {
	case "identity":
		return "身份"
	case "responsibility":
		return "职责"
	case "behavior":
		return "风格"
	case "workflow":
		return "执行流程"
	case "guardrail":
		return "边界"
	case "output":
		return "输出格式"
	case "example":
		return "示例样本"
	case "tool":
		return "能力规则"
	case "other":
		return "补充说明"
	default:
		return ""
	}
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

func normalizeAgentKnowledgeType(knowledgeType string) string {
	switch strings.ToLower(strings.TrimSpace(knowledgeType)) {
	case "background":
		return "background"
	case "document", "doc":
		return "document"
	case "glossary", "term", "terms", "vocabulary":
		return "glossary"
	case "example", "sample":
		return "example"
	case "constraint", "boundary":
		return "document"
	case "state", "status", "record":
		return "state"
	case "other":
		return "other"
	default:
		return "document"
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
	rawItems := normalizeAgentChildRows(value)
	if len(rawItems) == 0 {
		return []any{}
	}

	items := make([]any, 0, len(rawItems))
	seenSetting := map[uint64]bool{}
	for index, row := range rawItems {
		settingID := util.ToUint64(row["setting_id"])
		if settingID == 0 || seenSetting[settingID] {
			continue
		}
		seenSetting[settingID] = true
		next := util.CloneMap(row)
		next["setting_id"] = settingID
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
