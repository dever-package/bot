package setting

import (
	"context"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
	skillservice "github.com/dever-package/bot/service/agent/skill"
	frontaction "github.com/dever-package/front/service/action"
)

func (AgentHook) ProviderBeforeSaveSkillConfig(c *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialAgentRecord(record)
	trimStringField(record, "key", partial)
	trimStringField(record, "name", partial)

	if shouldNormalizeField(record, "key", partial) {
		rawKey := util.ToStringTrimmed(record["key"])
		envName := skillservice.ConfigEnvName(rawKey)
		if rawKey != "" && envName == "" {
			panicAgentField("form.key", "变量标识只能包含字母、数字和下划线，且不能使用 PATH、HOME 等系统保留变量名。")
		}
		record["key"] = envName
	}
	if shouldNormalizeField(record, "name", partial) && util.ToStringTrimmed(record["name"]) == "" {
		record["name"] = util.ToStringTrimmed(record["key"])
	}
	if !partial && util.ToStringTrimmed(record["key"]) == "" {
		panicAgentField("form.key", "变量标识不能为空。")
	}
	if shouldNormalizeField(record, "skill_id", partial) {
		skillID := util.ToUint64(record["skill_id"])
		if skillID == 0 {
			skillID = util.ToUint64(c.Input("skill_id"))
		}
		record["skill_id"] = skillID
	}
	record["target_key"] = ""
	normalizeSkillConfigType(record, partial)
	record["required"] = agentmodel.SkillConfigRequiredNo
	normalizeSkillConfigValue(c.Context(), record)
	if _, exists := record["status"]; exists {
		defaultInt16Field(record, "status", defaultAgentStatus, partial)
	}
	return record
}

func (AgentHook) ProviderBeforeDeleteSkillConfig(c *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	ids := normalizeAgentUint64List(record["id"])
	if len(ids) == 0 {
		return record
	}
	agentmodel.NewSkillConfigBindModel().Delete(c.Context(), map[string]any{
		"config_id": uint64IDsToAny(ids),
	})
	record["id"] = uint64IDsToAny(ids)
	return record
}

func (AgentHook) ProviderAttachSkillConfigList(c *server.Context, params []any) any {
	payload := cloneAgentRecord(params)
	rows := normalizeAgentChildRows(payload["rows"])
	if len(rows) == 0 {
		return rows
	}

	valueByID := loadSkillConfigStoredValues(c.Context(), rows)
	for _, row := range rows {
		id := util.ToUint64(row["id"])
		configType := agentmodel.NormalizeSkillConfigType(util.ToStringTrimmed(row["type"]))
		storedValue := util.ToStringTrimmed(row["value_encrypted"])
		if storedValue == "" {
			storedValue = valueByID[id]
		}
		row["type"] = configType
		row["value_hint"] = truncateSkillConfigDisplayValue(skillConfigDisplayValue(configType, storedValue))
		delete(row, "value_encrypted")
	}
	return rows
}

func (AgentHook) ProviderAttachSkillConfigForm(c *server.Context, params []any) any {
	payload := cloneAgentRecord(params)
	record, ok := payload["record"].(map[string]any)
	if !ok || len(record) == 0 {
		return payload
	}
	configType := agentmodel.NormalizeSkillConfigType(util.ToStringTrimmed(record["type"]))
	if configType == agentmodel.SkillConfigTypeText {
		record["value_plain"] = util.ToStringTrimmed(record["value_encrypted"])
		if record["value_plain"] == "" {
			record["value_plain"] = loadPlainSkillConfigValue(c.Context(), util.ToUint64(record["id"]))
		}
	} else {
		record["value_plain"] = ""
	}
	delete(record, "value_encrypted")
	return record
}

func normalizeSkillConfigType(record map[string]any, partial bool) {
	if !shouldNormalizeField(record, "type", partial) {
		return
	}
	record["type"] = agentmodel.NormalizeSkillConfigType(util.ToStringTrimmed(record["type"]))
}

func normalizeSkillConfigValue(ctx context.Context, record map[string]any) {
	plain := util.ToStringTrimmed(record["value_plain"])
	delete(record, "value_plain")
	delete(record, "value")
	if plain == "" {
		preserveExistingSkillConfigValue(ctx, record)
		return
	}
	configType := agentmodel.NormalizeSkillConfigType(util.ToStringTrimmed(record["type"]))
	if configType == agentmodel.SkillConfigTypeText {
		record["value_encrypted"] = plain
		record["value_hint"] = plain
		return
	}
	encrypted, err := skillservice.EncryptSecret(plain)
	if err != nil {
		panic(frontaction.NewFieldError("form.value_plain", "环境变量值加密失败。"))
	}
	record["value_encrypted"] = encrypted
	record["value_hint"] = skillservice.SecretHint(plain)
}

func preserveExistingSkillConfigValue(ctx context.Context, record map[string]any) {
	id := util.ToUint64(record["id"])
	if id == 0 {
		delete(record, "value_encrypted")
		delete(record, "value_hint")
		return
	}
	existing := agentmodel.NewSkillConfigModel().Find(ctx, map[string]any{"id": id})
	if existing == nil {
		delete(record, "value_encrypted")
		delete(record, "value_hint")
		return
	}
	nextType := agentmodel.NormalizeSkillConfigType(strings.TrimSpace(existing.Type))
	if _, exists := record["type"]; exists {
		nextType = agentmodel.NormalizeSkillConfigType(util.ToStringTrimmed(record["type"]))
	}
	currentType := agentmodel.NormalizeSkillConfigType(strings.TrimSpace(existing.Type))
	if nextType != currentType {
		panic(frontaction.NewFieldError("form.value_plain", "切换变量类型时必须重新填写变量值。"))
	}
	record["value_encrypted"] = existing.ValueEncrypted
	record["value_hint"] = existing.ValueHint
}

func loadSkillConfigStoredValues(ctx context.Context, rows []map[string]any) map[uint64]string {
	result := map[uint64]string{}
	ids := make([]uint64, 0, len(rows))
	seen := map[uint64]struct{}{}
	for _, row := range rows {
		id := util.ToUint64(row["id"])
		if id == 0 {
			continue
		}
		if storedValue := util.ToStringTrimmed(row["value_encrypted"]); storedValue != "" {
			result[id] = storedValue
			continue
		}
		if _, exists := seen[id]; exists {
			continue
		}
		seen[id] = struct{}{}
		ids = append(ids, id)
	}
	if len(ids) == 0 {
		return result
	}

	configs := agentmodel.NewSkillConfigModel().Select(ctx, map[string]any{
		"id": uint64IDsToAny(ids),
	})
	for _, config := range configs {
		if config == nil {
			continue
		}
		result[config.ID] = strings.TrimSpace(config.ValueEncrypted)
	}
	return result
}

func skillConfigDisplayValue(configType string, storedValue string) string {
	storedValue = strings.TrimSpace(storedValue)
	if storedValue == "" {
		return "未填写"
	}
	if agentmodel.NormalizeSkillConfigType(configType) == agentmodel.SkillConfigTypeSecret {
		return skillservice.SecretHint(storedValue)
	}
	return storedValue
}

func truncateSkillConfigDisplayValue(value string) string {
	value = strings.TrimSpace(value)
	const maxRunes = 48
	runes := []rune(value)
	if len(runes) <= maxRunes {
		return value
	}
	return string(runes[:maxRunes]) + "..."
}

func loadPlainSkillConfigValue(ctx context.Context, id uint64) string {
	if id == 0 {
		return ""
	}
	row := agentmodel.NewSkillConfigModel().Find(ctx, map[string]any{"id": id})
	if row == nil {
		return ""
	}
	if agentmodel.NormalizeSkillConfigType(strings.TrimSpace(row.Type)) != agentmodel.SkillConfigTypeText {
		return ""
	}
	return strings.TrimSpace(row.ValueEncrypted)
}

func skillConfigRows(ctx context.Context, skillID uint64) []map[string]any {
	if skillID == 0 {
		return []map[string]any{}
	}
	rows := skillservice.SkillConfigRows(ctx, skillID, false)
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		result = append(result, map[string]any{
			"id":         row.ID,
			"key":        strings.TrimSpace(row.Key),
			"name":       strings.TrimSpace(row.Name),
			"type":       agentmodel.NormalizeSkillConfigType(strings.TrimSpace(row.Type)),
			"value_hint": skillConfigDisplayValue(row.Type, row.ValueEncrypted),
			"status":     row.Status,
			"created_at": row.CreatedAt,
		})
	}
	return result
}
