package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	SkillConfigRequiredYes int16 = 1
	SkillConfigRequiredNo  int16 = 2
)

type SkillConfig struct {
	ID             uint64    `dorm:"primaryKey;autoIncrement;comment:技能配置ID"`
	SkillID        uint64    `dorm:"type:bigint;not null;default:0;comment:技能"`
	TargetKey      string    `dorm:"type:varchar(128);not null;default:'';comment:目标"`
	Key            string    `dorm:"type:varchar(128);not null;comment:配置键"`
	Name           string    `dorm:"type:varchar(128);not null;default:'';comment:配置名称"`
	Type           string    `dorm:"type:varchar(32);not null;default:'secret';comment:配置类型"`
	Required       int16     `dorm:"type:smallint;not null;default:2;comment:是否必填"`
	ValueEncrypted string    `dorm:"type:text;not null;default:'';comment:加密值"`
	ValueHint      string    `dorm:"type:varchar(128);not null;default:'';comment:脱敏提示"`
	Status         int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt      time.Time `dorm:"comment:创建时间"`
}

type SkillConfigIndex struct {
	SkillTargetKey struct{} `unique:"skill_id,target_key,key"`
	SkillStatus    struct{} `index:"skill_id,status"`
}

var skillConfigRelation = orm.Relation{
	Field:      "skill_id",
	Option:     "bot.agent.NewSkillModel",
	OptionKeys: []string{"name", "key"},
}

var skillConfigTypeOptions = []map[string]any{
	{"id": "secret", "value": "Secret"},
	{"id": "api_key", "value": "API Key"},
	{"id": "cookie", "value": "Cookie"},
	{"id": "token", "value": "Token"},
	{"id": "text", "value": "文本"},
}

var skillConfigRequiredOptions = []map[string]any{
	{"id": SkillConfigRequiredYes, "value": "必填"},
	{"id": SkillConfigRequiredNo, "value": "可选"},
}

func NewSkillConfigModel() *orm.Model[SkillConfig] {
	return orm.LoadModel[SkillConfig]("技能配置", "bot_skill_config", orm.ModelConfig{
		Index:    SkillConfigIndex{},
		Order:    "skill_id asc,target_key asc,key asc,id asc",
		Database: "default",
		Options: map[string]any{
			"type":     skillConfigTypeOptions,
			"required": skillConfigRequiredOptions,
			"status":   statusOptions,
		},
		Relations: []orm.Relation{
			skillConfigRelation,
		},
	})
}

func SkillConfigTypeOptions() []map[string]any {
	return cloneOptionRows(skillConfigTypeOptions)
}
