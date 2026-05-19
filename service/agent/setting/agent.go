package setting

import (
	"context"
	"math"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
	energonmodel "my/package/bot/model/energon"
)

func (AgentHook) ProviderBeforeSaveAgent(c *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialAgentRecord(record)

	trimStringField(record, "name", partial)
	trimStringField(record, "key", partial)
	trimStringField(record, "description", partial)
	if shouldNormalizeField(record, "kind", partial) {
		record["kind"] = normalizeAgentKind(util.ToStringTrimmed(record["kind"]))
	}
	if shouldNormalizeField(record, "cate_id", partial) && util.ToUint64(record["cate_id"]) == 0 {
		record["cate_id"] = defaultAgentCateID
	}
	normalizeAgentCate(c.Context(), record, partial)
	if shouldNormalizeField(record, "setting_pack_id", partial) && util.ToUint64(record["setting_pack_id"]) == 0 {
		record["setting_pack_id"] = defaultAgentSettingPackID
	}
	if shouldNormalizeField(record, "skill_pack_id", partial) && util.ToUint64(record["skill_pack_id"]) == 0 {
		record["skill_pack_id"] = defaultAgentSkillPackID
	}
	defaultInt16Field(record, "status", defaultAgentStatus, partial)
	defaultIntField(record, "sort", defaultAgentSort, partial)
	if shouldNormalizeField(record, "temperature", partial) {
		record["temperature"] = normalizeAgentTemperature(record["temperature"])
	}
	if shouldNormalizeField(record, "timeout_seconds", partial) {
		record["timeout_seconds"] = normalizePositiveInt(record["timeout_seconds"], defaultAgentTimeout)
	}
	if shouldNormalizeField(record, "max_auto_steps", partial) {
		record["max_auto_steps"] = normalizeNonNegativeInt(record["max_auto_steps"], defaultAgentMaxAutoSteps)
	}

	if shouldNormalizeField(record, "llm_power_id", partial) {
		validateAgentLLMPower(c, util.ToUint64(record["llm_power_id"]))
	}
	return record
}

func (AgentHook) ProviderBeforeSaveAgentCate(_ *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	id := util.ToUint64(record["id"])
	switch id {
	case agentmodel.DefaultAgentCateID:
		return map[string]any{"id": id, "name": "默认分类", "sort": 100}
	case agentmodel.SystemAgentCateID:
		return map[string]any{"id": id, "name": "系统内置", "sort": 110}
	default:
		panic("智能体分类为系统固定项，不能新增或修改。")
	}
}

func ensureFixedAgentCates(ctx context.Context) {
	// Seeds 只在建表时写入；这里兼容已存在的旧“助理/系统内置”分类。
	agentModel := agentmodel.NewAgentModel()
	agentModel.Update(ctx, map[string]any{"id": []any{agentmodel.FrontAssistantAgentID, agentmodel.SkillInstallerAgentID}}, map[string]any{
		"kind":    agentmodel.AgentKindInternal,
		"cate_id": agentmodel.SystemAgentCateID,
	})
	agentModel.Update(ctx, map[string]any{"kind": agentmodel.AgentKindInternal}, map[string]any{
		"cate_id": agentmodel.SystemAgentCateID,
	})
	agentModel.Update(ctx, map[string]any{"cate_id": map[string]any{"not in": fixedAgentCateIDs()}}, map[string]any{
		"cate_id": agentmodel.DefaultAgentCateID,
	})
	agentmodel.NewAgentCateModel().Delete(ctx, map[string]any{"id": map[string]any{"not in": fixedAgentCateIDs()}})
	saveFixedAgentCate(ctx, agentmodel.DefaultAgentCateID, "默认分类", 100)
	saveFixedAgentCate(ctx, agentmodel.SystemAgentCateID, "系统内置", 110)
}

func saveFixedAgentCate(ctx context.Context, id uint64, name string, sort int) {
	model := agentmodel.NewAgentCateModel()
	row := map[string]any{"name": name, "sort": sort}
	if model.Update(ctx, map[string]any{"id": id}, row) > 0 {
		return
	}
	row["id"] = id
	model.Insert(ctx, row)
}

func (AgentHook) ProviderBeforeDeleteAgent(c *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	agentIDs := normalizeAgentUint64List(record["id"])
	if len(agentIDs) == 0 {
		return record
	}

	agents := agentmodel.NewAgentModel().Select(c.Context(), map[string]any{"id": uint64IDsToAny(agentIDs)})
	for _, item := range agents {
		if isBuiltinAgent(item.ID) || normalizeAgentKind(item.Kind) == agentmodel.AgentKindInternal {
			panic("内置智能体不能删除。")
		}
	}
	record["id"] = uint64IDsToAny(agentIDs)
	return record
}

func normalizeAgentCate(ctx context.Context, record map[string]any, partial bool) {
	agentID := util.ToUint64(record["id"])
	if isBuiltinAgent(agentID) {
		record["kind"] = agentmodel.AgentKindInternal
		record["cate_id"] = agentmodel.SystemAgentCateID
		return
	}
	if !shouldNormalizeField(record, "cate_id", partial) {
		return
	}

	kind := util.ToStringTrimmed(record["kind"])
	if kind == "" && agentID > 0 {
		if current := agentmodel.NewAgentModel().Find(ctx, map[string]any{"id": agentID}); current != nil {
			kind = current.Kind
		}
	}
	if normalizeAgentKind(kind) == agentmodel.AgentKindInternal {
		record["cate_id"] = agentmodel.SystemAgentCateID
		return
	}
	if util.ToUint64(record["cate_id"]) == agentmodel.SystemAgentCateID {
		record["cate_id"] = agentmodel.DefaultAgentCateID
	}
}

func isBuiltinAgent(id uint64) bool {
	return id == agentmodel.FrontAssistantAgentID || id == agentmodel.SkillInstallerAgentID
}

func fixedAgentCateIDs() []any {
	return []any{agentmodel.DefaultAgentCateID, agentmodel.SystemAgentCateID}
}

func fixedAgentCateOptions() []map[string]any {
	return []map[string]any{
		{"id": agentmodel.DefaultAgentCateID, "value": "默认分类", "name": "默认分类", "sort": 100},
		{"id": agentmodel.SystemAgentCateID, "value": "系统内置", "name": "系统内置", "sort": 110},
	}
}

func normalizeAgentKind(kind string) string {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case agentmodel.AgentKindInternal:
		return agentmodel.AgentKindInternal
	default:
		return agentmodel.AgentKindNormal
	}
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
