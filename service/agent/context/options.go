package agentcontext

import (
	agentmodel "github.com/dever-package/bot/model/agent"
	agentprompt "github.com/dever-package/bot/service/agent/prompt"
	agenttool "github.com/dever-package/bot/service/agent/tool"
	frontstream "github.com/dever-package/front/service/stream"
)

func resolveRuntimeOptions(config agentmodel.RuntimeConfig, agent agentmodel.Agent, requestOptions map[string]any) RuntimeOptions {
	defaultMax := positiveInt(config.DefaultMaxAutoSteps, agentmodel.DefaultRuntimeMaxAutoSteps)
	hardMax := positiveInt(config.HardMaxAutoSteps, agentmodel.DefaultRuntimeHardMaxAutoSteps)
	if hardMax < defaultMax {
		hardMax = defaultMax
	}

	maxSteps := defaultMax
	if agent.MaxAutoSteps > 0 {
		maxSteps = agent.MaxAutoSteps
	}
	if requested := requestMaxSteps(requestOptions); requested > 0 {
		maxSteps = requested
	}
	if maxSteps <= 0 {
		maxSteps = defaultMax
	}
	if maxSteps > hardMax {
		maxSteps = hardMax
	}
	return RuntimeOptions{
		MaxSteps:            maxSteps,
		AsyncMaxConcurrency: 10,
		Tool:                agenttool.OptionsFromRuntimeConfig(config),
	}
}

func runtimePromptTools(options agenttool.Options) agentprompt.ToolRuntime {
	sandboxConfig := options.ScriptSandbox
	return agentprompt.ToolRuntime{
		RunSkillScriptEnabled: sandboxConfig.Driver != agentmodel.RuntimeScriptSandboxDriverDisabled,
		ScriptSandboxDriver:   sandboxConfig.Driver,
		ScriptNetworkMode:     sandboxConfig.NetworkMode,
	}
}

func requestMaxSteps(options map[string]any) int {
	if len(options) == 0 {
		return 0
	}
	for _, key := range []string{"max_steps", "maxSteps", "max_auto_steps", "maxAutoSteps"} {
		value, exists := options[key]
		if exists {
			return int(frontstream.InputInt64(value, 0))
		}
	}
	return 0
}

func positiveInt(value int, fallback int) int {
	if value > 0 {
		return value
	}
	return fallback
}
