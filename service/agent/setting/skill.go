package setting

import (
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
	skillservice "my/package/bot/service/agent/skill"
	skillinstall "my/package/bot/service/agent/skill/install"
)

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
	defaultInt16Field(record, "status", defaultAgentStatus, partial)
	defaultIntField(record, "sort", defaultAgentSort, partial)
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

func (AgentHook) ProviderBeforeSaveSkillInstall(_ *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	if len(record) == 0 {
		return record
	}
	partial := isPartialAgentRecord(record)

	trimStringField(record, "action", partial)
	trimStringField(record, "install_type", partial)
	trimStringField(record, "install_input", partial)
	trimStringField(record, "status", partial)
	if shouldNormalizeField(record, "cate_id", partial) && util.ToUint64(record["cate_id"]) == 0 {
		record["cate_id"] = defaultSkillCateID
	}
	if shouldNormalizeField(record, "action", partial) {
		record["action"] = agentmodel.SkillInstallActionInstall
	}
	if shouldNormalizeField(record, "install_type", partial) {
		record["install_type"] = skillinstall.NormalizeInstallType(util.ToStringTrimmed(record["install_type"]))
	}
	if shouldNormalizeField(record, "status", partial) {
		record["status"] = normalizeSkillInstallStatus(util.ToStringTrimmed(record["status"]))
	}
	if !partial && util.ToStringTrimmed(record["install_input"]) == "" {
		panicAgentField("form.install_input", "安装输入不能为空。")
	}
	return record
}

func normalizeSkillPackItemRows(value any) []any {
	return normalizePackItemRows(value, "skill_id")
}

func normalizeSkillInstallStatus(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case agentmodel.SkillInstallStatusPending,
		agentmodel.SkillInstallStatusInstalling,
		agentmodel.SkillInstallStatusSuccess,
		agentmodel.SkillInstallStatusFail:
		return strings.ToLower(strings.TrimSpace(value))
	default:
		return agentmodel.SkillInstallStatusPending
	}
}
