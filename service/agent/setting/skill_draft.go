package setting

import (
	"encoding/json"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
	skillservice "github.com/dever-package/bot/service/agent/skill"
	frontaction "github.com/dever-package/front/service/action"
)

func (AgentHook) ProviderBeforeSaveSkillDraft(_ *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialAgentRecord(record)
	trimStringField(record, "key", partial)
	trimStringField(record, "name", partial)
	trimStringField(record, "description", partial)
	trimStringField(record, "skill_md", partial)
	trimStringField(record, "files_json", partial)
	trimStringField(record, "manifest", partial)
	trimStringField(record, "validation_result", partial)

	if shouldNormalizeField(record, "key", partial) {
		record["key"] = skillservice.NormalizeKey(util.ToStringTrimmed(record["key"]))
	}
	if shouldNormalizeField(record, "pack_id", partial) && util.ToUint64(record["pack_id"]) == 0 {
		record["pack_id"] = defaultSkillPackID
	}
	if shouldNormalizeField(record, "cate_id", partial) && util.ToUint64(record["cate_id"]) == 0 {
		record["cate_id"] = defaultSkillCateID
	}
	if shouldNormalizeField(record, "status", partial) && util.ToIntDefault(record["status"], 0) <= 0 {
		record["status"] = agentmodel.SkillDraftStatusDraft
	}
	if !partial && util.ToStringTrimmed(record["key"]) == "" {
		panicAgentField("form.key", "技能标识不能为空。")
	}
	if !partial && util.ToStringTrimmed(record["name"]) == "" {
		panicAgentField("form.name", "技能名称不能为空。")
	}
	if shouldNormalizeField(record, "skill_md", partial) && util.ToStringTrimmed(record["skill_md"]) == "" {
		record["skill_md"] = defaultSkillDraftMarkdown(record)
	}
	if shouldNormalizeField(record, "files_json", partial) {
		record["files_json"] = normalizeSkillDraftJSON(record["files_json"], "{}", "form.files_json", "草稿文件必须是 JSON 对象。")
	}
	if shouldNormalizeField(record, "manifest", partial) {
		record["manifest"] = normalizeSkillDraftManifest(record)
	}
	if shouldNormalizeField(record, "validation_result", partial) {
		record["validation_result"] = normalizeSkillDraftJSON(record["validation_result"], "{}", "form.validation_result", "测试结果必须是 JSON 对象。")
	}
	return record
}

func defaultSkillDraftMarkdown(record map[string]any) string {
	name := util.ToStringTrimmed(record["name"])
	description := util.ToStringTrimmed(record["description"])
	if name == "" {
		name = util.ToStringTrimmed(record["key"])
	}
	lines := []string{
		"---",
		"name: " + name,
		"description: " + description,
		"---",
		"",
		"# " + name,
	}
	if description != "" {
		lines = append(lines, "", description)
	}
	return strings.Join(lines, "\n")
}

func normalizeSkillDraftManifest(record map[string]any) string {
	raw := util.ToStringTrimmed(record["manifest"])
	if raw == "" {
		return skillservice.JSONText(map[string]any{
			"key":         util.ToStringTrimmed(record["key"]),
			"name":        util.ToStringTrimmed(record["name"]),
			"description": util.ToStringTrimmed(record["description"]),
			"triggers":    []any{},
			"source_url":  "",
			"config":      []any{},
			"scripts":     []any{},
			"source_refs": []any{},
		})
	}
	decoded := map[string]any{}
	if err := json.Unmarshal([]byte(raw), &decoded); err != nil {
		panic(frontaction.NewFieldError("form.manifest", "运行配置必须是 JSON 对象。"))
	}
	if _, exists := decoded["key"]; !exists {
		decoded["key"] = util.ToStringTrimmed(record["key"])
	}
	if _, exists := decoded["name"]; !exists {
		decoded["name"] = util.ToStringTrimmed(record["name"])
	}
	if _, exists := decoded["description"]; !exists {
		decoded["description"] = util.ToStringTrimmed(record["description"])
	}
	for _, key := range []string{"triggers", "config", "scripts", "source_refs"} {
		if _, exists := decoded[key]; !exists {
			decoded[key] = []any{}
		}
	}
	return skillservice.JSONText(decoded)
}

func normalizeSkillDraftJSON(value any, fallback string, field string, message string) string {
	raw := util.ToStringTrimmed(value)
	if raw == "" {
		return fallback
	}
	decoded := map[string]any{}
	if err := json.Unmarshal([]byte(raw), &decoded); err != nil {
		panic(frontaction.NewFieldError(field, message))
	}
	return skillservice.JSONText(decoded)
}
