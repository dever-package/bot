package tool

import (
	"time"

	agentmodel "my/package/bot/model/agent"
	agentruntime "my/package/bot/service/agent/runtime"
	"my/package/bot/service/agent/tool/sandbox"
)

func OptionsFromRuntimeConfig(config agentmodel.RuntimeConfig) Options {
	config = agentruntime.WithDefaults(config)
	return Options{
		ScriptSandbox: sandbox.NormalizeConfig(sandbox.Config{
			Driver:         config.ScriptSandboxDriver,
			BwrapPath:      config.ScriptSandboxBwrapPath,
			NetworkMode:    config.ScriptSandboxNetworkMode,
			Timeout:        time.Duration(config.ScriptSandboxTimeoutSeconds) * time.Second,
			OutputMaxBytes: config.ScriptSandboxOutputMaxBytes,
		}),
	}
}
