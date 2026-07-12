package tool

import (
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeconfig "github.com/dever-package/bot/service/agent/runtime/config"
	"github.com/dever-package/bot/service/agent/runtime/tool/sandbox"
)

func SandboxConfig(config agentmodel.RuntimeConfig) sandbox.Config {
	config = runtimeconfig.WithDefaults(config)
	return sandbox.NormalizeConfig(sandbox.Config{
		Driver:         config.ScriptSandboxDriver,
		BwrapPath:      config.ScriptSandboxBwrapPath,
		NetworkMode:    config.ScriptSandboxNetworkMode,
		Timeout:        time.Duration(config.ScriptSandboxTimeoutSeconds) * time.Second,
		OutputMaxBytes: config.ScriptSandboxOutputMaxBytes,
	})
}
