package setting

import (
	"context"
	"os"
	"path/filepath"
	"strings"

	dlog "github.com/shemic/dever/log"
	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
	skillservice "github.com/dever-package/bot/service/agent/skill"
)

const skillDeletePathsKey = "_skill_delete_paths"

func (AgentHook) ProviderBeforeSaveSkillDisplay(c *server.Context, params []any) any {
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
	if c != nil {
		if err := skillservice.RequireActiveCate(c.Context(), cateID); err != nil {
			panicAgentField("form.cate_id", err.Error())
		}
	}
	displayName := util.ToStringTrimmed(record["display_name"])
	if displayName == "" && c != nil {
		if skill := agentmodel.NewSkillModel().Find(c.Context(), map[string]any{"id": id}); skill != nil {
			displayName = strings.TrimSpace(skill.Name)
		}
	}
	validateSkillDisplayField("form.display_name", "展示标题", displayName, 128)
	validateSkillDisplayField("form.display_icon", "展示图标", util.ToStringTrimmed(record["display_icon"]), 64)
	validateSkillDisplayField("form.display_description", "展示描述", util.ToStringTrimmed(record["display_description"]), 512)
	result := map[string]any{
		"_partial":            true,
		"id":                  id,
		"cate_id":             cateID,
		"display_name":        displayName,
		"display_icon":        util.ToStringTrimmed(record["display_icon"]),
		"display_description": util.ToStringTrimmed(record["display_description"]),
	}
	return result
}

func (AgentHook) ProviderBeforeSaveSkillCate(_ *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialAgentRecord(record)
	trimStringField(record, "name", partial)
	if shouldNormalizeField(record, "name", partial) {
		name := util.ToStringTrimmed(record["name"])
		if name == "" {
			panicAgentField("form.name", "技能分类名称不能为空。")
		}
		validateSkillDisplayField("form.name", "技能分类名称", name, 128)
	}
	defaultInt16Field(record, "status", defaultAgentStatus, partial)
	defaultIntField(record, "sort", defaultAgentSort, partial)
	return record
}

func (AgentHook) ProviderBeforeDeleteSkill(c *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	skillIDs := normalizeAgentUint64List(record["id"])
	if len(skillIDs) == 0 {
		return record
	}

	idValues := uint64IDsToAny(skillIDs)
	skills := agentmodel.NewSkillModel().Select(c.Context(), map[string]any{"id": idValues})
	for _, skill := range skills {
		if skill == nil {
			continue
		}
		sourceType := agentmodel.NormalizeSkillSourceType(skill.SourceType, skill.SourceURL, skill.InstallInput)
		if sourceType == agentmodel.SkillSourceTypeBuiltin {
			panicAgentField("table.id", "内置技能不能删除。")
		}
	}
	if pending := agentmodel.NewSkillDraftModel().Find(c.Context(), map[string]any{
		"source_skill_id": idValues,
		"status":          agentmodel.SkillDraftStatusDraft,
	}); pending != nil {
		panicAgentField("table.id", "技能存在未发布版本，请先发布或删除对应草稿。")
	}
	if hasActiveSkillInstall(c.Context(), idValues) {
		panicAgentField("table.id", "技能正在安装或更新，请等待任务结束或先取消安装。")
	}
	record["id"] = idValues
	record[skillDeletePathsKey] = skillInstallPaths(skills)
	return record
}

func (AgentHook) ProviderBeforeDeleteSkillDraft(c *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	ids := normalizeAgentUint64List(record["id"])
	if len(ids) == 0 {
		return record
	}
	idValues := uint64IDsToAny(ids)
	if c != nil && agentmodel.NewSkillDraftModel().Find(c.Context(), map[string]any{
		"id": idValues, "status": agentmodel.SkillDraftStatusPublished,
	}) != nil {
		panicAgentField("table.id", "已发布草稿是正式技能的来源记录，不能删除。")
	}
	record["id"] = idValues
	return record
}

func hasActiveSkillInstall(ctx context.Context, skillIDs []any) bool {
	statuses := []any{
		agentmodel.SkillInstallStatusPending,
		agentmodel.SkillInstallStatusInstalling,
		agentmodel.SkillInstallStatusFinalizing,
	}
	model := agentmodel.NewSkillInstallModel()
	for _, field := range []string{"target_skill_id", "skill_id"} {
		if model.Find(ctx, map[string]any{field: skillIDs, "status": statuses}) != nil {
			return true
		}
	}
	return false
}

func (AgentHook) ProviderAfterDeleteSkill(c *server.Context, params []any) any {
	payload := cloneAgentRecord(params)
	record, _ := payload["payload"].(map[string]any)
	if len(record) == 0 {
		record = payload
	}
	skillIDs := normalizeAgentUint64List(record["id"])
	if c != nil && len(skillIDs) > 0 {
		idValues := uint64IDsToAny(skillIDs)
		agentmodel.NewSkillPackItemModel().Delete(c.Context(), map[string]any{"skill_id": idValues})
		agentmodel.NewSkillConfigModel().Delete(c.Context(), map[string]any{"skill_id": idValues})
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
	if shouldNormalizeField(record, "name", partial) {
		name := util.ToStringTrimmed(record["name"])
		if name == "" {
			panicAgentField("form.name", "技能方案名称不能为空。")
		}
		validateSkillDisplayField("form.name", "技能方案名称", name, 128)
	}
	if shouldNormalizeField(record, "description", partial) {
		if err := skillservice.ValidateStoredBytes("技能方案描述", util.ToStringTrimmed(record["description"]), 16*1024); err != nil {
			panicAgentField("form.description", err.Error())
		}
	}
	defaultInt16FieldOnCreateOrPresent(record, "status", defaultAgentStatus, partial)
	defaultIntFieldOnCreateOrPresent(record, "sort", defaultAgentSort, partial)
	if rawItems, exists := record["items"]; exists {
		record["items"] = normalizeSkillPackItemRows(rawItems)
	}
	return record
}

func validateSkillDisplayField(field string, label string, value string, limit int) {
	if err := skillservice.ValidateStoredText(label, value, limit); err != nil {
		panicAgentField(field, err.Error())
	}
}

func (AgentHook) ProviderBeforeSaveSkillPackItem(c *server.Context, params []any) any {
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
	if c != nil && shouldValidateSkillPackItem(record, partial) {
		packID, skillID := skillPackItemIdentity(c, record)
		if err := skillservice.RequireActivePack(c.Context(), packID); err != nil {
			panicAgentField("form.pack_id", err.Error())
		}
		if err := skillservice.RequireActiveSkill(c.Context(), skillID); err != nil {
			panicAgentField("form.skill_id", err.Error())
		}
	}
	defaultInt16Field(record, "status", defaultAgentStatus, partial)
	defaultIntField(record, "sort", defaultAgentSort, partial)
	return record
}

func shouldValidateSkillPackItem(record map[string]any, partial bool) bool {
	if !partial {
		return true
	}
	if _, exists := record["pack_id"]; exists {
		return true
	}
	if _, exists := record["skill_id"]; exists {
		return true
	}
	status, exists := record["status"]
	return exists && int16(util.ToInt64(status)) == defaultAgentStatus
}

func skillPackItemIdentity(c *server.Context, record map[string]any) (uint64, uint64) {
	packID := util.ToUint64(record["pack_id"])
	skillID := util.ToUint64(record["skill_id"])
	if packID > 0 && skillID > 0 {
		return packID, skillID
	}
	id := util.ToUint64(record["id"])
	if id == 0 {
		return packID, skillID
	}
	row := agentmodel.NewSkillPackItemModel().Find(c.Context(), map[string]any{"id": id})
	if row == nil {
		return packID, skillID
	}
	if packID == 0 {
		packID = row.PackID
	}
	if skillID == 0 {
		skillID = row.SkillID
	}
	return packID, skillID
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
		applySkillDisplayDefaults(skill)

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

		if sourceType == agentmodel.SkillSourceTypeBuiltin {
			row["pending_draft_id"] = uint64(0)
			row["pending_draft"] = map[string]any{}
			row["publish_state"] = "published"
			row["publish_state_label"] = "内置"
			continue
		}

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

func applySkillDisplayDefaults(skill map[string]any) {
	if len(skill) == 0 || util.ToStringTrimmed(skill["display_name"]) != "" {
		return
	}
	skill["display_name"] = util.ToStringTrimmed(skill["name"])
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
		"version":           row.Version,
		"created_at":        row.CreatedAt,
		"updated_at":        row.UpdatedAt,
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
		return ""
	}
	if root := skillservice.SkillRemovalPath(skill.Key, path); root != "" {
		path = root
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
			dlog.ErrorFields("skill_directory_cleanup", "删除技能目录失败", dlog.Fields{
				"path": path, "error": err.Error(),
			})
		}
	}
}

func cleanSkillInstallPath(path string) string {
	path = strings.TrimSpace(path)
	if path == "" {
		return ""
	}
	cleaned := filepath.Clean(path)
	if cleaned == filepath.Clean(skillservice.Root) || skillservice.ValidateInstallRoot(cleaned) != nil {
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
