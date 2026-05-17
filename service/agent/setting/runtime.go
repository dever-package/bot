package setting

import (
	"github.com/shemic/dever/server"

	agentmodel "my/package/bot/model/agent"
)

func (AgentHook) ProviderBeforeSaveRuntimeConfig(_ *server.Context, params []any) any {
	record := cloneAgentRecord(params)
	if len(record) == 0 {
		return record
	}

	record["id"] = agentmodel.DefaultRuntimeConfigID
	defaultMax := normalizePositiveInt(record["default_max_auto_steps"], agentmodel.DefaultRuntimeMaxAutoSteps)
	hardMax := normalizePositiveInt(record["hard_max_auto_steps"], agentmodel.DefaultRuntimeHardMaxAutoSteps)
	if hardMax < defaultMax {
		panicAgentField("form.hard_max_auto_steps", "全局强制最大自动步骤数不能小于默认最大自动步骤数。")
	}
	record["default_max_auto_steps"] = defaultMax
	record["hard_max_auto_steps"] = hardMax
	record["skill_metadata_max_skills"] = normalizePositiveInt(record["skill_metadata_max_skills"], agentmodel.DefaultRuntimeSkillMetadataMaxSkills)
	record["skill_metadata_field_max_length"] = normalizePositiveInt(record["skill_metadata_field_max_length"], agentmodel.DefaultRuntimeSkillMetadataFieldMaxLength)
	record["skill_file_max_bytes"] = normalizePositiveInt(record["skill_file_max_bytes"], agentmodel.DefaultRuntimeSkillFileMaxBytes)
	record["skill_loaded_content_max_length"] = normalizePositiveInt(record["skill_loaded_content_max_length"], agentmodel.DefaultRuntimeSkillLoadedContentMaxLength)
	return record
}
