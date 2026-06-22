package setting

import (
	"os"
	"path/filepath"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
	skillservice "github.com/dever-package/bot/service/agent/skill"
)

const skillDeletePathsKey = "_skill_delete_paths"

func (AgentHook) ProviderBeforeSaveSkill(_ *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialAgentRecord(record)

	trimStringField(record, "key", partial)
	trimStringField(record, "name", partial)
	trimStringField(record, "description", partial)
	trimStringField(record, "source_type", partial)
	trimStringField(record, "source_url", partial)
	trimStringField(record, "install_input", partial)
	trimStringField(record, "install_path", partial)
	trimStringField(record, "entry_file", partial)
	trimStringField(record, "manifest", partial)
	trimStringField(record, "content_hash", partial)
	if shouldNormalizeField(record, "cate_id", partial) && util.ToUint64(record["cate_id"]) == 0 {
		record["cate_id"] = defaultSkillCateID
	}
	if shouldNormalizeField(record, "key", partial) {
		record["key"] = skillservice.NormalizeKey(util.ToStringTrimmed(record["key"]))
	}
	if shouldNormalizeField(record, "entry_file", partial) && util.ToStringTrimmed(record["entry_file"]) == "" {
		record["entry_file"] = "SKILL.md"
	}
	if shouldNormalizeField(record, "source_type", partial) {
		record["source_type"] = agentmodel.NormalizeSkillSourceType(
			util.ToStringTrimmed(record["source_type"]),
			util.ToStringTrimmed(record["source_url"]),
			util.ToStringTrimmed(record["install_input"]),
		)
	}
	if !partial && util.ToStringTrimmed(record["key"]) == "" {
		panicAgentField("form.key", "技能标识不能为空。")
	}
	if !partial && util.ToStringTrimmed(record["name"]) == "" {
		panicAgentField("form.name", "技能名称不能为空。")
	}
	if !partial && util.ToStringTrimmed(record["install_path"]) == "" {
		panicAgentField("form.install_path", "安装目录不能为空。")
	}
	defaultInt16Field(record, "status", defaultAgentStatus, partial)
	defaultIntField(record, "sort", defaultAgentSort, partial)
	return record
}

func (AgentHook) ProviderBeforeSaveSkillCate(_ *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	if len(record) == 0 {
		return record
	}
	id := util.ToUint64(record["id"])
	cateID := util.ToUint64(record["cate_id"])
	if id == 0 {
		panicAgentField("form.id", "技能不能为空。")
	}
	if cateID == 0 {
		panicAgentField("form.cate_id", "技能分类不能为空。")
	}
	result := map[string]any{
		"_partial": true,
		"id":       id,
		"cate_id":  cateID,
	}
	return result
}

func (AgentHook) ProviderBeforeDeleteSkill(c *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	skillIDs := normalizeAgentUint64List(record["id"])
	if len(skillIDs) == 0 {
		return record
	}

	idValues := uint64IDsToAny(skillIDs)
	skills := agentmodel.NewSkillModel().Select(c.Context(), map[string]any{"id": idValues})
	record["id"] = idValues
	record[skillDeletePathsKey] = skillInstallPaths(skills)
	agentmodel.NewSkillPackItemModel().Delete(c.Context(), map[string]any{"skill_id": idValues})
	agentmodel.NewSkillConfigBindModel().Delete(c.Context(), map[string]any{"skill_id": idValues})
	agentmodel.NewSkillConfigModel().Delete(c.Context(), map[string]any{"skill_id": idValues})
	return record
}

func (AgentHook) ProviderAfterDeleteSkill(_ *server.Context, params []any) any {
	payload := cloneAgentRecord(params)
	record, _ := payload["payload"].(map[string]any)
	if len(record) == 0 {
		record = payload
	}
	removeSkillInstallPaths(normalizeAgentStringList(record[skillDeletePathsKey]))
	return nil
}

func (AgentHook) ProviderBeforeSaveSkillPack(_ *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialAgentRecord(record)

	trimStringField(record, "name", partial)
	trimStringField(record, "description", partial)
	if !partial && record["name"] == "" {
		panicAgentField("form.name", "技能方案名称不能为空。")
	}
	defaultInt16FieldOnCreateOrPresent(record, "status", defaultAgentStatus, partial)
	defaultIntFieldOnCreateOrPresent(record, "sort", defaultAgentSort, partial)
	if rawItems, exists := record["items"]; exists {
		record["items"] = normalizeSkillPackItemRows(rawItems)
	}
	return record
}

func (AgentHook) ProviderBeforeSaveSkillPackItem(_ *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialAgentRecord(record)
	if !partial && util.ToUint64(record["pack_id"]) == 0 {
		panicAgentField("form.pack_id", "技能方案不能为空。")
	}
	if !partial && util.ToUint64(record["skill_id"]) == 0 {
		panicAgentField("form.skill_id", "技能不能为空。")
	}
	defaultInt16Field(record, "status", defaultAgentStatus, partial)
	defaultIntField(record, "sort", defaultAgentSort, partial)
	return record
}

func (AgentHook) ProviderAttachSkillPackItemList(c *server.Context, params []any) any {
	payload := cloneAgentRecord(params)
	rows := normalizeAgentChildRows(payload["rows"])
	if len(rows) == 0 {
		return rows
	}

	skillIDs := skillPackItemSkillIDs(rows)
	skillsByID := loadSkillMapsByID(c, skillIDs)
	draftsBySkillID := loadPendingSkillDraftsBySource(c, skillIDs)

	for _, row := range rows {
		skillID := util.ToUint64(row["skill_id"])
		skill := normalizeSkillPackItemSkill(row["skill"])
		if loaded := skillsByID[skillID]; len(loaded) > 0 {
			for key, value := range loaded {
				if _, exists := skill[key]; !exists || util.ToStringTrimmed(skill[key]) == "" {
					skill[key] = value
				}
			}
		}

		sourceType := agentmodel.NormalizeSkillSourceType(
			util.ToStringTrimmed(skill["source_type"]),
			util.ToStringTrimmed(skill["source_url"]),
			util.ToStringTrimmed(skill["install_input"]),
		)
		sourceLabel := agentmodel.SkillSourceTypeLabel(sourceType)
		skill["source_type"] = sourceType
		skill["source_type_label"] = sourceLabel
		row["skill"] = skill
		row["source_type"] = sourceType
		row["source_type_label"] = sourceLabel

		if draft := draftsBySkillID[skillID]; draft != nil {
			row["pending_draft_id"] = draft.ID
			row["pending_draft"] = skillDraftRowMap(draft)
			row["publish_state"] = "pending_update"
			row["publish_state_label"] = "有未发布版本"
			continue
		}
		row["pending_draft_id"] = uint64(0)
		row["pending_draft"] = pendingSkillDraftSeed(row, skill)
		row["publish_state"] = "published"
		if sourceType == agentmodel.SkillSourceTypeInstalled {
			row["publish_state_label"] = "已安装"
		} else {
			row["publish_state_label"] = "已发布"
		}
	}
	return rows
}

func normalizeSkillPackItemRows(value any) []any {
	return normalizePackItemRows(value, "skill_id")
}

func skillPackItemSkillIDs(rows []map[string]any) []uint64 {
	ids := make([]uint64, 0, len(rows))
	seen := map[uint64]struct{}{}
	for _, row := range rows {
		id := util.ToUint64(row["skill_id"])
		if id == 0 {
			id = util.ToUint64(normalizeSkillPackItemSkill(row["skill"])["id"])
		}
		if id == 0 {
			continue
		}
		if _, exists := seen[id]; exists {
			continue
		}
		seen[id] = struct{}{}
		ids = append(ids, id)
	}
	return ids
}

func normalizeSkillPackItemSkill(value any) map[string]any {
	if mapped, ok := value.(map[string]any); ok && mapped != nil {
		return mapped
	}
	return map[string]any{}
}

func loadSkillMapsByID(c *server.Context, skillIDs []uint64) map[uint64]map[string]any {
	result := map[uint64]map[string]any{}
	if c == nil || len(skillIDs) == 0 {
		return result
	}
	rows := agentmodel.NewSkillModel().SelectMap(c.Context(), map[string]any{"id": skillIDs})
	for _, row := range rows {
		id := util.ToUint64(row["id"])
		if id == 0 {
			continue
		}
		result[id] = row
	}
	return result
}

func loadPendingSkillDraftsBySource(c *server.Context, skillIDs []uint64) map[uint64]*agentmodel.SkillDraft {
	result := map[uint64]*agentmodel.SkillDraft{}
	if c == nil || len(skillIDs) == 0 {
		return result
	}
	rows := agentmodel.NewSkillDraftModel().Select(c.Context(), map[string]any{
		"source_skill_id": skillIDs,
		"status":          agentmodel.SkillDraftStatusDraft,
	})
	for _, row := range rows {
		if row == nil || row.SourceSkillID == 0 {
			continue
		}
		if _, exists := result[row.SourceSkillID]; exists {
			continue
		}
		result[row.SourceSkillID] = row
	}
	return result
}

func skillDraftRowMap(row *agentmodel.SkillDraft) map[string]any {
	if row == nil {
		return map[string]any{}
	}
	return map[string]any{
		"id":                row.ID,
		"pack_id":           row.PackID,
		"cate_id":           row.CateID,
		"source_skill_id":   row.SourceSkillID,
		"key":               row.Key,
		"name":              row.Name,
		"description":       row.Description,
		"status":            row.Status,
		"skill_md":          row.SkillMD,
		"files_json":        row.FilesJSON,
		"manifest":          row.Manifest,
		"validation_result": row.ValidationResult,
		"created_at":        row.CreatedAt,
	}
}

func pendingSkillDraftSeed(row map[string]any, skill map[string]any) map[string]any {
	return map[string]any{
		"id":              0,
		"pack_id":         util.ToUint64(row["pack_id"]),
		"cate_id":         util.ToUint64(skill["cate_id"]),
		"source_skill_id": util.ToUint64(row["skill_id"]),
		"key":             util.ToStringTrimmed(skill["key"]),
		"name":            util.ToStringTrimmed(skill["name"]),
		"description":     util.ToStringTrimmed(skill["description"]),
		"status":          agentmodel.SkillDraftStatusDraft,
		"files_json":      "{}",
		"manifest":        "",
	}
}

func skillInstallPaths(skills []*agentmodel.Skill) []string {
	paths := make([]string, 0, len(skills))
	seen := map[string]struct{}{}
	for _, skill := range skills {
		if skill == nil {
			continue
		}
		path := skillInstallPath(skill)
		if path == "" {
			continue
		}
		if _, exists := seen[path]; exists {
			continue
		}
		seen[path] = struct{}{}
		paths = append(paths, path)
	}
	return paths
}

func skillInstallPath(skill *agentmodel.Skill) string {
	path := strings.TrimSpace(skill.InstallPath)
	if path == "" {
		key := skillservice.NormalizeKey(skill.Key)
		if key == "" {
			return ""
		}
		path = filepath.Join(skillservice.Root, key)
	}
	return cleanSkillInstallPath(path)
}

func removeSkillInstallPaths(paths []string) {
	for _, path := range paths {
		path = cleanSkillInstallPath(path)
		if path == "" {
			continue
		}
		if err := os.RemoveAll(path); err != nil {
			panic("删除技能目录失败: " + err.Error())
		}
	}
}

func cleanSkillInstallPath(path string) string {
	path = strings.TrimSpace(path)
	if path == "" {
		return ""
	}
	cleaned := filepath.Clean(path)
	if cleaned == filepath.Clean(skillservice.Root) || !skillservice.IsSafePath(cleaned) {
		return ""
	}
	return cleaned
}

func normalizeAgentUint64List(value any) []uint64 {
	rawItems := normalizeAgentAnyList(value)
	result := make([]uint64, 0, len(rawItems))
	seen := map[uint64]struct{}{}
	for _, item := range rawItems {
		id := util.ToUint64(item)
		if id == 0 {
			continue
		}
		if _, exists := seen[id]; exists {
			continue
		}
		seen[id] = struct{}{}
		result = append(result, id)
	}
	return result
}

func normalizeAgentStringList(value any) []string {
	rawItems := normalizeAgentAnyList(value)
	result := make([]string, 0, len(rawItems))
	for _, item := range rawItems {
		text := util.ToStringTrimmed(item)
		if text != "" {
			result = append(result, text)
		}
	}
	return result
}

func normalizeAgentAnyList(value any) []any {
	switch items := value.(type) {
	case []any:
		return items
	case []string:
		result := make([]any, 0, len(items))
		for _, item := range items {
			result = append(result, item)
		}
		return result
	case []uint64:
		result := make([]any, 0, len(items))
		for _, item := range items {
			result = append(result, item)
		}
		return result
	default:
		if value == nil {
			return nil
		}
		return []any{value}
	}
}

func uint64IDsToAny(ids []uint64) []any {
	result := make([]any, 0, len(ids))
	for _, id := range ids {
		if id > 0 {
			result = append(result, id)
		}
	}
	return result
}
