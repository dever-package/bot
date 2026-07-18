package skill

import (
	"context"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

func SyncManifestConfig(ctx context.Context, skillID uint64, manifest map[string]any) {
	if skillID == 0 {
		return
	}
	rawItems, declared := manifest["config"]
	if !declared {
		return
	}
	items, _ := rawItems.([]any)
	model := agentmodel.NewSkillConfigModel()
	existingRows := model.Select(ctx, map[string]any{"skill_id": skillID})
	existingByKey := make(map[string]*agentmodel.SkillConfig, len(existingRows))
	for _, row := range existingRows {
		if row == nil {
			continue
		}
		existingByKey[manifestConfigIdentity(row.TargetKey, row.Key)] = row
	}
	activeKeys := make(map[string]struct{}, len(items))
	for _, item := range items {
		mapped, ok := item.(map[string]any)
		if !ok {
			continue
		}
		key := ConfigEnvName(FirstText(mapped["key"]))
		if key == "" {
			continue
		}
		targetKey := strings.TrimSpace(FirstText(FirstPresent(mapped, "target_key", "targetKey", "target")))
		name := FirstText(mapped["name"])
		if name == "" {
			name = key
		}
		required := agentmodel.SkillConfigRequiredNo
		if Truthy(mapped["required"]) {
			required = agentmodel.SkillConfigRequiredYes
		}
		configType := agentmodel.NormalizeSkillConfigType(strings.TrimSpace(FirstText(mapped["type"])))
		identity := manifestConfigIdentity(targetKey, key)
		activeKeys[identity] = struct{}{}
		existing := existingByKey[identity]
		if existing != nil {
			values := map[string]any{"required": required, "status": activeStatus}
			if strings.TrimSpace(existing.Name) == "" {
				values["name"] = name
			}
			if strings.TrimSpace(existing.ValueEncrypted) == "" {
				values["type"] = configType
			}
			model.Update(ctx, map[string]any{"id": existing.ID}, values)
			continue
		}
		model.Insert(ctx, map[string]any{
			"skill_id": skillID, "target_key": targetKey, "key": key, "name": name,
			"type": configType, "required": required,
			"status": activeStatus, "created_at": time.Now(),
		})
	}
	for identity, row := range existingByKey {
		if row == nil || row.Status != activeStatus {
			continue
		}
		if _, exists := activeKeys[identity]; exists {
			continue
		}
		model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{"status": inactiveStatus})
	}
}

func manifestConfigIdentity(targetKey string, key string) string {
	return strings.TrimSpace(targetKey) + "\x00" + ConfigEnvName(key)
}
