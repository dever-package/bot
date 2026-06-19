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
	return map[string]any{
		"_partial": true,
		"id":       id,
		"cate_id":  cateID,
	}
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

func normalizeSkillPackItemRows(value any) []any {
	return normalizePackItemRows(value, "skill_id")
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
