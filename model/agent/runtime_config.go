package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	DefaultRuntimeConfigID                    uint64 = 1
	DefaultRuntimeMaxAutoSteps                       = 5
	DefaultRuntimeHardMaxAutoSteps                   = 8
	DefaultRuntimeSkillMetadataMaxSkills             = 80
	DefaultRuntimeSkillMetadataFieldMaxLength        = 1000
	DefaultRuntimeSkillFileMaxBytes                  = 256 * 1024
	DefaultRuntimeSkillLoadedContentMaxLength        = 30000

	RuntimeScriptSandboxDriverDisabled = "disabled"
	RuntimeScriptSandboxDriverLocal    = "local"
	RuntimeScriptSandboxDriverBwrap    = "bwrap"

	RuntimeScriptSandboxNetworkNone = "none"
	RuntimeScriptSandboxNetworkHost = "host"

	DefaultRuntimeScriptSandboxDriver            = RuntimeScriptSandboxDriverBwrap
	DefaultRuntimeScriptSandboxBwrapPath         = "bwrap"
	DefaultRuntimeScriptSandboxNetworkMode       = RuntimeScriptSandboxNetworkHost
	DefaultRuntimeScriptSandboxTimeoutSeconds    = 15
	DefaultRuntimeScriptSandboxMaxTimeoutSeconds = 60
	DefaultRuntimeScriptSandboxOutputMaxBytes    = 256 * 1024
)

type RuntimeConfig struct {
	ID                          uint64    `dorm:"primaryKey;autoIncrement;comment:配置ID"`
	DefaultMaxAutoSteps         int       `dorm:"type:int;not null;default:5;comment:默认最大自动步骤数"`
	HardMaxAutoSteps            int       `dorm:"type:int;not null;default:8;comment:强制最大自动步骤数"`
	SkillMetadataMaxSkills      int       `dorm:"type:int;not null;default:80;comment:技能 metadata 最大技能数"`
	SkillMetadataFieldMaxLength int       `dorm:"type:int;not null;default:1000;comment:技能 metadata 单字段最大长度"`
	SkillFileMaxBytes           int       `dorm:"type:int;not null;default:262144;comment:SKILL.md 最大读取字节数"`
	SkillLoadedContentMaxLength int       `dorm:"type:int;not null;default:30000;comment:本轮技能正文最大总长度"`
	ScriptSandboxDriver         string    `dorm:"type:varchar(32);not null;default:'bwrap';comment:脚本沙箱模式"`
	ScriptSandboxBwrapPath      string    `dorm:"type:varchar(255);not null;default:'bwrap';comment:bwrap 可执行文件"`
	ScriptSandboxNetworkMode    string    `dorm:"type:varchar(32);not null;default:'host';comment:脚本沙箱网络模式"`
	ScriptSandboxTimeoutSeconds int       `dorm:"type:int;not null;default:15;comment:脚本沙箱超时时间(秒)"`
	ScriptSandboxOutputMaxBytes int       `dorm:"type:int;not null;default:262144;comment:脚本输出最大字节数"`
	CreatedAt                   time.Time `dorm:"comment:创建时间"`
}

var (
	runtimeScriptSandboxDriverOptions = []map[string]any{
		{"id": RuntimeScriptSandboxDriverDisabled, "value": "禁用脚本"},
		{"id": RuntimeScriptSandboxDriverLocal, "value": "本地受控执行"},
		{"id": RuntimeScriptSandboxDriverBwrap, "value": "bubblewrap 沙箱"},
	}

	runtimeScriptSandboxNetworkModeOptions = []map[string]any{
		{"id": RuntimeScriptSandboxNetworkHost, "value": "使用宿主网络"},
		{"id": RuntimeScriptSandboxNetworkNone, "value": "断网"},
	}
)

var runtimeConfigSeed = []map[string]any{
	{
		"id":                              DefaultRuntimeConfigID,
		"default_max_auto_steps":          DefaultRuntimeMaxAutoSteps,
		"hard_max_auto_steps":             DefaultRuntimeHardMaxAutoSteps,
		"skill_metadata_max_skills":       DefaultRuntimeSkillMetadataMaxSkills,
		"skill_metadata_field_max_length": DefaultRuntimeSkillMetadataFieldMaxLength,
		"skill_file_max_bytes":            DefaultRuntimeSkillFileMaxBytes,
		"skill_loaded_content_max_length": DefaultRuntimeSkillLoadedContentMaxLength,
		"script_sandbox_driver":           DefaultRuntimeScriptSandboxDriver,
		"script_sandbox_bwrap_path":       DefaultRuntimeScriptSandboxBwrapPath,
		"script_sandbox_network_mode":     DefaultRuntimeScriptSandboxNetworkMode,
		"script_sandbox_timeout_seconds":  DefaultRuntimeScriptSandboxTimeoutSeconds,
		"script_sandbox_output_max_bytes": DefaultRuntimeScriptSandboxOutputMaxBytes,
	},
}

func NewRuntimeConfigModel() *orm.Model[RuntimeConfig] {
	return orm.LoadModel[RuntimeConfig]("运行配置", "bot_agent_runtime_config", orm.ModelConfig{
		Seeds:    runtimeConfigSeed,
		Database: "default",
		Options: map[string]any{
			"script_sandbox_driver":       runtimeScriptSandboxDriverOptions,
			"script_sandbox_network_mode": runtimeScriptSandboxNetworkModeOptions,
		},
	})
}

func DefaultRuntimeConfig() RuntimeConfig {
	return RuntimeConfig{
		ID:                          DefaultRuntimeConfigID,
		DefaultMaxAutoSteps:         DefaultRuntimeMaxAutoSteps,
		HardMaxAutoSteps:            DefaultRuntimeHardMaxAutoSteps,
		SkillMetadataMaxSkills:      DefaultRuntimeSkillMetadataMaxSkills,
		SkillMetadataFieldMaxLength: DefaultRuntimeSkillMetadataFieldMaxLength,
		SkillFileMaxBytes:           DefaultRuntimeSkillFileMaxBytes,
		SkillLoadedContentMaxLength: DefaultRuntimeSkillLoadedContentMaxLength,
		ScriptSandboxDriver:         DefaultRuntimeScriptSandboxDriver,
		ScriptSandboxBwrapPath:      DefaultRuntimeScriptSandboxBwrapPath,
		ScriptSandboxNetworkMode:    DefaultRuntimeScriptSandboxNetworkMode,
		ScriptSandboxTimeoutSeconds: DefaultRuntimeScriptSandboxTimeoutSeconds,
		ScriptSandboxOutputMaxBytes: DefaultRuntimeScriptSandboxOutputMaxBytes,
	}
}

func RuntimeScriptSandboxDriverOptions() []map[string]any {
	return cloneOptionRows(runtimeScriptSandboxDriverOptions)
}

func RuntimeScriptSandboxNetworkModeOptions() []map[string]any {
	return cloneOptionRows(runtimeScriptSandboxNetworkModeOptions)
}
