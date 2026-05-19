package tool

import (
	"time"

	agentmodel "my/package/bot/model/agent"
	"my/package/bot/service/agent/tool/sandbox"
)

func OptionsFromRuntimeConfig(config agentmodel.RuntimeConfig) Options {
	config = agentmodel.RuntimeConfigWithDefaults(config)
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
