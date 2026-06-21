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

const skillConfigSyncIDsKey = "_skill_config_sync_skill_ids"

func (AgentHook) ProviderBeforeSaveSkillConfig(c *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialAgentRecord(record)
	trimStringField(record, "target_key", partial)
	trimStringField(record, "key", partial)
	trimStringField(record, "name", partial)
	trimStringField(record, "type", partial)

	if shouldNormalizeField(record, "key", partial) {
		record["key"] = skillservice.ConfigEnvName(util.ToStringTrimmed(record["key"]))
	}
	if shouldNormalizeField(record, "type", partial) && util.ToStringTrimmed(record["type"]) == "" {
		record["type"] = "secret"
	}
	if shouldNormalizeField(record, "name", partial) && util.ToStringTrimmed(record["name"]) == "" {
		record["name"] = util.ToStringTrimmed(record["key"])
	}
	if shouldNormalizeField(record, "required", partial) && util.ToIntDefault(record["required"], 0) <= 0 {
		record["required"] = agentmodel.SkillConfigRequiredNo
	}
	if !partial && util.ToUint64(record["skill_id"]) == 0 {
		panicAgentField("form.skill_id", "技能不能为空。")
	}
	if !partial && util.ToStringTrimmed(record["key"]) == "" {
		panicAgentField("form.key", "配置键不能为空。")
	}
	normalizeSkillConfigSecret(c.Context(), record)
	defaultInt16Field(record, "status", defaultAgentStatus, partial)
	return record
}

func (AgentHook) ProviderAfterSaveSkillConfig(c *server.Context, params []any) any {
	payload := cloneAgentRecord(params)
	skillID := skillConfigSkillIDFromPayload(c, payload)
	if skillID > 0 {
		_ = skillservice.SyncConfigManifest(c.Context(), skillID)
	}
	return nil
}

func (AgentHook) ProviderBeforeDeleteSkillConfig(c *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	ids := normalizeAgentUint64List(record["id"])
	if len(ids) == 0 {
		return record
	}
	rows := agentmodel.NewSkillConfigModel().Select(c.Context(), map[string]any{
		"id": uint64IDsToAny(ids),
	})
	skillIDs := make([]uint64, 0, len(rows))
	seen := map[uint64]struct{}{}
	for _, row := range rows {
		if row == nil || row.SkillID == 0 {
			continue
		}
		if _, exists := seen[row.SkillID]; exists {
			continue
		}
		seen[row.SkillID] = struct{}{}
		skillIDs = append(skillIDs, row.SkillID)
	}
	record["id"] = uint64IDsToAny(ids)
	record[skillConfigSyncIDsKey] = uint64IDsToAny(skillIDs)
	return record
}

func (AgentHook) ProviderAfterDeleteSkillConfig(c *server.Context, params []any) any {
	payload := cloneAgentRecord(params)
	for _, skillID := range normalizeAgentUint64List(payload[skillConfigSyncIDsKey]) {
		_ = skillservice.SyncConfigManifest(c.Context(), skillID)
	}
	return nil
}

func normalizeSkillConfigSecret(ctx context.Context, record map[string]any) {
	plain := util.ToStringTrimmed(record["value_plain"])
	delete(record, "value_plain")
	delete(record, "value")
	if plain == "" {
		preserveExistingSkillConfigSecret(ctx, record)
		return
	}
	encrypted, err := skillservice.EncryptSecret(plain)
	if err != nil {
		panic(frontaction.NewFieldError("form.value_plain", "配置值加密失败。"))
	}
	record["value_encrypted"] = encrypted
	record["value_hint"] = skillservice.SecretHint(plain)
}

func preserveExistingSkillConfigSecret(ctx context.Context, record map[string]any) {
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
	record["value_encrypted"] = existing.ValueEncrypted
	record["value_hint"] = existing.ValueHint
}

func skillConfigSkillIDFromPayload(c *server.Context, payload map[string]any) uint64 {
	if id := util.ToUint64(payload["skill_id"]); id > 0 {
		return id
	}
	for _, key := range []string{"payload", "data"} {
		if record, ok := payload[key].(map[string]any); ok {
			if id := util.ToUint64(record["skill_id"]); id > 0 {
				return id
			}
		}
	}
	configID := util.ToUint64(payload["id"])
	if configID == 0 {
		for _, key := range []string{"result", "data"} {
			if record, ok := payload[key].(map[string]any); ok {
				if id := util.ToUint64(record["id"]); id > 0 {
					configID = id
					break
				}
			}
		}
	}
	if configID == 0 {
		return 0
	}
	row := agentmodel.NewSkillConfigModel().Find(c.Context(), map[string]any{"id": configID})
	if row == nil {
		return 0
	}
	return row.SkillID
}

func skillConfigRows(ctx context.Context, skillID uint64) []map[string]any {
	if skillID == 0 {
		return []map[string]any{}
	}
	rows := agentmodel.NewSkillConfigModel().Select(ctx, map[string]any{"skill_id": skillID})
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		result = append(result, map[string]any{
			"id":         row.ID,
			"target_key": strings.TrimSpace(row.TargetKey),
			"key":        strings.TrimSpace(row.Key),
			"name":       strings.TrimSpace(row.Name),
			"type":       strings.TrimSpace(row.Type),
			"required":   row.Required,
			"value_hint": strings.TrimSpace(row.ValueHint),
			"status":     row.Status,
			"created_at": row.CreatedAt,
		})
	}
	return result
}
