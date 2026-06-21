package runtime

import (
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
)

func WithDefaults(config agentmodel.RuntimeConfig) agentmodel.RuntimeConfig {
	defaults := agentmodel.DefaultRuntimeConfig()
	if config.ID == 0 {
		config.ID = defaults.ID
	}
	config.DefaultMaxAutoSteps = positiveInt(config.DefaultMaxAutoSteps, defaults.DefaultMaxAutoSteps)
	config.HardMaxAutoSteps = positiveInt(config.HardMaxAutoSteps, defaults.HardMaxAutoSteps)
	config.SkillMetadataMaxSkills = positiveInt(config.SkillMetadataMaxSkills, defaults.SkillMetadataMaxSkills)
	config.SkillMetadataFieldMaxLength = metadataFieldMaxLength(config.SkillMetadataFieldMaxLength, defaults.SkillMetadataFieldMaxLength)
	config.SkillFileMaxBytes = positiveInt(config.SkillFileMaxBytes, defaults.SkillFileMaxBytes)
	config.SkillLoadedContentMaxLength = positiveInt(config.SkillLoadedContentMaxLength, defaults.SkillLoadedContentMaxLength)
	config.ScriptSandboxDriver = NormalizeScriptSandboxDriver(config.ScriptSandboxDriver)
	config.ScriptSandboxBwrapPath = defaultString(config.ScriptSandboxBwrapPath, defaults.ScriptSandboxBwrapPath)
	config.ScriptSandboxNetworkMode = NormalizeScriptSandboxNetworkMode(config.ScriptSandboxNetworkMode)
	config.ScriptSandboxTimeoutSeconds = positiveInt(config.ScriptSandboxTimeoutSeconds, defaults.ScriptSandboxTimeoutSeconds)
	config.ScriptSandboxOutputMaxBytes = positiveInt(config.ScriptSandboxOutputMaxBytes, defaults.ScriptSandboxOutputMaxBytes)
	return config
}

func NormalizeScriptSandboxDriver(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case agentmodel.RuntimeScriptSandboxDriverDisabled:
		return agentmodel.RuntimeScriptSandboxDriverDisabled
	case agentmodel.RuntimeScriptSandboxDriverLocal:
		return agentmodel.RuntimeScriptSandboxDriverLocal
	case agentmodel.RuntimeScriptSandboxDriverBwrap:
		return agentmodel.RuntimeScriptSandboxDriverBwrap
	default:
		return agentmodel.DefaultRuntimeScriptSandboxDriver
	}
}

func NormalizeScriptSandboxNetworkMode(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case agentmodel.RuntimeScriptSandboxNetworkHost:
		return agentmodel.RuntimeScriptSandboxNetworkHost
	case agentmodel.RuntimeScriptSandboxNetworkNone:
		return agentmodel.RuntimeScriptSandboxNetworkNone
	default:
		return agentmodel.DefaultRuntimeScriptSandboxNetworkMode
	}
}

func positiveInt(value int, fallback int) int {
	if value > 0 {
		return value
	}
	return fallback
}

func metadataFieldMaxLength(value int, fallback int) int {
	if value > 0 {
		return value
	}
	return fallback
}

func defaultString(value string, fallback string) string {
	value = strings.TrimSpace(value)
	if value != "" {
		return value
	}
	return fallback
}
