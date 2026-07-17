package setting

import (
	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeconfig "github.com/dever-package/bot/service/agent/runtime/config"
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
	record["run_worker_concurrency"] = normalizeRuntimeWorkerConcurrency(record["run_worker_concurrency"])
	record["artifact_worker_concurrency"] = normalizeArtifactWorkerConcurrency(record["artifact_worker_concurrency"])
	record["artifact_per_tool_concurrency"] = normalizeArtifactPerToolConcurrency(record["artifact_per_tool_concurrency"])
	if util.ToIntDefault(record["artifact_per_tool_concurrency"], 0) > util.ToIntDefault(record["artifact_worker_concurrency"], 0) {
		panicAgentField("form.artifact_per_tool_concurrency", "单项素材能力并行数不能超过素材任务并行数。")
	}
	record["skill_metadata_max_skills"] = normalizePositiveInt(record["skill_metadata_max_skills"], agentmodel.DefaultRuntimeSkillMetadataMaxSkills)
	record["skill_metadata_field_max_length"] = normalizeRuntimeMetadataFieldMaxLength(record["skill_metadata_field_max_length"])
	record["skill_file_max_bytes"] = normalizePositiveInt(record["skill_file_max_bytes"], agentmodel.DefaultRuntimeSkillFileMaxBytes)
	record["skill_loaded_content_max_length"] = normalizePositiveInt(record["skill_loaded_content_max_length"], agentmodel.DefaultRuntimeSkillLoadedContentMaxLength)
	record["script_sandbox_driver"] = runtimeconfig.NormalizeScriptSandboxDriver(util.ToStringTrimmed(record["script_sandbox_driver"]))
	record["script_sandbox_bwrap_path"] = normalizeRuntimeText(record["script_sandbox_bwrap_path"], agentmodel.DefaultRuntimeScriptSandboxBwrapPath)
	record["script_sandbox_network_mode"] = runtimeconfig.NormalizeScriptSandboxNetworkMode(util.ToStringTrimmed(record["script_sandbox_network_mode"]))
	record["script_sandbox_timeout_seconds"] = normalizeRuntimeSandboxTimeout(record["script_sandbox_timeout_seconds"])
	record["script_sandbox_output_max_bytes"] = normalizePositiveInt(record["script_sandbox_output_max_bytes"], agentmodel.DefaultRuntimeScriptSandboxOutputMaxBytes)
	return record
}

func normalizeRuntimeText(value any, fallback string) string {
	text := util.ToStringTrimmed(value)
	if text != "" {
		return text
	}
	return fallback
}

func normalizeRuntimeSandboxTimeout(value any) int {
	timeout := normalizePositiveInt(value, agentmodel.DefaultRuntimeScriptSandboxTimeoutSeconds)
	if timeout > agentmodel.DefaultRuntimeScriptSandboxMaxTimeoutSeconds {
		panicAgentField("form.script_sandbox_timeout_seconds", "脚本沙箱超时时间不能超过 60 秒。")
	}
	return timeout
}

func normalizeRuntimeMetadataFieldMaxLength(value any) int {
	length := normalizePositiveInt(value, agentmodel.DefaultRuntimeSkillMetadataFieldMaxLength)
	if length < agentmodel.DefaultRuntimeSkillMetadataFieldMaxLength {
		return agentmodel.DefaultRuntimeSkillMetadataFieldMaxLength
	}
	return length
}

func normalizeRuntimeWorkerConcurrency(value any) int {
	concurrency := normalizePositiveInt(value, agentmodel.DefaultRuntimeRunWorkerConcurrency)
	if concurrency > agentmodel.MaxRuntimeRunWorkerConcurrency {
		panicAgentField("form.run_worker_concurrency", "并行运行数不能超过 64。")
	}
	return concurrency
}

func normalizeArtifactWorkerConcurrency(value any) int {
	concurrency := normalizePositiveInt(value, agentmodel.DefaultRuntimeArtifactWorkerConcurrency)
	if concurrency > agentmodel.MaxRuntimeArtifactWorkerConcurrency {
		panicAgentField("form.artifact_worker_concurrency", "素材任务并行数不能超过 32。")
	}
	return concurrency
}

func normalizeArtifactPerToolConcurrency(value any) int {
	concurrency := normalizePositiveInt(value, agentmodel.DefaultRuntimeArtifactPerToolConcurrency)
	if concurrency > agentmodel.MaxRuntimeArtifactPerToolConcurrency {
		panicAgentField("form.artifact_per_tool_concurrency", "单项素材能力并行数不能超过 8。")
	}
	return concurrency
}
