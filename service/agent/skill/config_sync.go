package skill

import (
	"context"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

func SyncManifestConfig(ctx context.Context, skillID uint64, manifest map[string]any) error {
	if skillID == 0 {
		return fmt.Errorf("同步技能配置缺少技能 ID")
	}
	if err := ValidateManifest(manifest); err != nil {
		return err
	}
	rawItems := manifest["config"]
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
			values := map[string]any{
				"name": name, "type": configType, "required": required, "status": activeStatus,
			}
			currentType := agentmodel.NormalizeSkillConfigType(strings.TrimSpace(existing.Type))
			if currentType != configType {
				// A stored text value must never become an exposed secret (or vice
				// versa). Require an explicit re-entry under the new definition.
				values["value_encrypted"] = ""
				values["value_hint"] = ""
			}
			if affected := model.Update(ctx, map[string]any{"id": existing.ID}, values); affected == 0 {
				return fmt.Errorf("同步技能配置失败: %s", key)
			}
			continue
		}
		if id := model.Insert(ctx, map[string]any{
			"skill_id": skillID, "target_key": targetKey, "key": key, "name": name,
			"type": configType, "required": required,
			"status": activeStatus, "created_at": time.Now(),
		}); id == 0 {
			return fmt.Errorf("同步技能配置失败: %s", key)
		}
	}
	for identity, row := range existingByKey {
		if row == nil || row.Status != activeStatus {
			continue
		}
		if _, exists := activeKeys[identity]; exists {
			continue
		}
		if affected := model.Update(ctx, map[string]any{"id": row.ID}, map[string]any{"status": inactiveStatus}); affected == 0 {
			return fmt.Errorf("停用已移除的技能配置失败: %s", row.Key)
		}
	}
	return nil
}

func manifestConfigIdentity(targetKey string, key string) string {
	return strings.TrimSpace(targetKey) + "\x00" + ConfigEnvName(key)
}
