package setting

import (
	"context"
	"math"
	"strings"

	"github.com/google/uuid"
	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
)

func (AgentHook) ProviderBeforeSaveAgent(c *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialAgentRecord(record)

	trimStringField(record, "name", partial)
	normalizeAgentKeyField(c.Context(), record, partial)
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
	defaultInt16FieldOnCreateOrPresent(record, "status", defaultAgentStatus, partial)
	defaultIntFieldOnCreateOrPresent(record, "sort", defaultAgentSort, partial)
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
	if len(record) == 0 {
		return record
	}
	partial := isPartialAgentRecord(record)
	trimStringField(record, "name", partial)
	defaultIntField(record, "sort", defaultAgentSort, partial)
	return record
}

func ensureBaseAgentCates(ctx context.Context) {
	// Seeds 只在建表时写入；这里保证内置分类 ID 存在，但不限制用户维护自定义分类。
	agentModel := agentmodel.NewAgentModel()
	ensureBuiltinAgentKey(ctx, agentmodel.FrontAssistantAgentID, agentmodel.FrontAssistantAgentKey)
	ensureBuiltinAgentKey(ctx, agentmodel.SkillInstallerAgentID, agentmodel.SkillInstallerAgentKey)
	agentModel.Update(ctx, map[string]any{"kind": agentmodel.AgentKindInternal}, map[string]any{
		"cate_id": agentmodel.SystemAgentCateID,
	})
	ensureBaseAgentCate(ctx, agentmodel.DefaultAgentCateID, "默认分类", 100)
	ensureBaseAgentCate(ctx, agentmodel.SystemAgentCateID, "系统内置", 110)
}

func ensureBaseAgentCate(ctx context.Context, id uint64, name string, sort int) {
	model := agentmodel.NewAgentCateModel()
	if model.Find(ctx, map[string]any{"id": id}) != nil {
		return
	}
	model.Insert(ctx, map[string]any{
		"id":   id,
		"name": name,
		"sort": sort,
	})
}

func ensureBuiltinAgentKey(ctx context.Context, id uint64, key string) {
	agentmodel.NewAgentModel().Update(ctx, map[string]any{"id": id}, map[string]any{
		"key":     key,
		"kind":    agentmodel.AgentKindInternal,
		"cate_id": agentmodel.SystemAgentCateID,
	})
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
	return id == agentmodel.FrontAssistantAgentID ||
		id == agentmodel.SkillInstallerAgentID ||
		id == agentmodel.SkillCreatorAgentID
}

func builtinAgentKey(id uint64) string {
	switch id {
	case agentmodel.FrontAssistantAgentID:
		return agentmodel.FrontAssistantAgentKey
	case agentmodel.SkillInstallerAgentID:
		return agentmodel.SkillInstallerAgentKey
	case agentmodel.SkillCreatorAgentID:
		return agentmodel.SkillCreatorAgentKey
	default:
		return ""
	}
}

func normalizeAgentKeyField(ctx context.Context, record map[string]any, partial bool) {
	if !shouldNormalizeField(record, "key", partial) {
		return
	}

	agentID := util.ToUint64(record["id"])
	current := currentAgent(ctx, agentID)
	key := normalizeAgentKey(util.ToStringTrimmed(record["key"]))

	if fixedKey := builtinAgentKey(agentID); fixedKey != "" {
		currentKey := ""
		if current != nil {
			currentKey = strings.TrimSpace(current.Key)
		}
		if currentKey == fixedKey && key != "" && key != fixedKey {
			panicAgentField("form.key", "内置智能体标识不能修改。")
		}
		key = fixedKey
	} else if current != nil && normalizeAgentKind(current.Kind) == agentmodel.AgentKindInternal {
		currentKey := strings.TrimSpace(current.Key)
		if currentKey != "" && key != "" && key != currentKey {
			panicAgentField("form.key", "内置智能体标识不能修改。")
		}
		if currentKey != "" {
			key = currentKey
		}
	}

	if key == "" {
		key = generateAgentKey(record, current)
	}
	if key == "" {
		panicAgentField("form.key", "智能体标识不能为空。")
	}
	validateUniqueAgentKey(ctx, agentID, key)
	record["key"] = key
}

func currentAgent(ctx context.Context, id uint64) *agentmodel.Agent {
	if id == 0 {
		return nil
	}
	return agentmodel.NewAgentModel().Find(ctx, map[string]any{"id": id})
}

func validateUniqueAgentKey(ctx context.Context, agentID uint64, key string) {
	existing := agentmodel.NewAgentModel().Find(ctx, map[string]any{"key": key})
	if existing == nil || existing.ID == agentID {
		return
	}
	panicAgentField("form.key", "智能体标识已存在。")
}

func generateAgentKey(record map[string]any, current *agentmodel.Agent) string {
	name := util.ToStringTrimmed(record["name"])
	if name == "" && current != nil {
		name = current.Name
	}
	base := normalizeAgentKey(name)
	if base == "" {
		base = "agent"
	}
	return limitAgentKey(base + "-" + strings.Split(uuid.NewString(), "-")[0])
}

func normalizeAgentKey(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	var builder strings.Builder
	lastDash := false
	for _, current := range value {
		if isAgentKeyChar(current) {
			builder.WriteRune(current)
			lastDash = false
			continue
		}
		if current == '-' || current == '_' || current == '.' || current == ' ' {
			if builder.Len() == 0 || lastDash {
				continue
			}
			builder.WriteByte('-')
			lastDash = true
		}
	}
	return limitAgentKey(strings.Trim(builder.String(), "-"))
}

func isAgentKeyChar(value rune) bool {
	return (value >= 'a' && value <= 'z') || (value >= '0' && value <= '9')
}

func limitAgentKey(value string) string {
	value = strings.Trim(value, "-")
	if len(value) <= 128 {
		return value
	}
	return strings.Trim(value[:128], "-")
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
