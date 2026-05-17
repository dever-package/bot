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
	DefaultRuntimeSkillMetadataFieldMaxLength        = 240
	DefaultRuntimeSkillFileMaxBytes                  = 256 * 1024
	DefaultRuntimeSkillLoadedContentMaxLength        = 30000
)

type RuntimeConfig struct {
	ID                          uint64    `dorm:"primaryKey;autoIncrement;comment:配置ID"`
	DefaultMaxAutoSteps         int       `dorm:"type:int;not null;default:5;comment:默认最大自动步骤数"`
	HardMaxAutoSteps            int       `dorm:"type:int;not null;default:8;comment:强制最大自动步骤数"`
	SkillMetadataMaxSkills      int       `dorm:"type:int;not null;default:80;comment:技能 metadata 最大技能数"`
	SkillMetadataFieldMaxLength int       `dorm:"type:int;not null;default:240;comment:技能 metadata 单字段最大长度"`
	SkillFileMaxBytes           int       `dorm:"type:int;not null;default:262144;comment:SKILL.md 最大读取字节数"`
	SkillLoadedContentMaxLength int       `dorm:"type:int;not null;default:30000;comment:本轮技能正文最大总长度"`
	CreatedAt                   time.Time `dorm:"comment:创建时间"`
}

var runtimeConfigSeed = []map[string]any{
	{
		"id":                              DefaultRuntimeConfigID,
		"default_max_auto_steps":          DefaultRuntimeMaxAutoSteps,
		"hard_max_auto_steps":             DefaultRuntimeHardMaxAutoSteps,
		"skill_metadata_max_skills":       DefaultRuntimeSkillMetadataMaxSkills,
		"skill_metadata_field_max_length": DefaultRuntimeSkillMetadataFieldMaxLength,
		"skill_file_max_bytes":            DefaultRuntimeSkillFileMaxBytes,
		"skill_loaded_content_max_length": DefaultRuntimeSkillLoadedContentMaxLength,
	},
}

func NewRuntimeConfigModel() *orm.Model[RuntimeConfig] {
	return orm.LoadModel[RuntimeConfig]("运行配置", "bot_agent_runtime_config", orm.ModelConfig{
		Seeds:    runtimeConfigSeed,
		Database: "default",
	})
}
