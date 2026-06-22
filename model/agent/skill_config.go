package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	SkillConfigRequiredYes int16 = 1
	SkillConfigRequiredNo  int16 = 2

	SkillConfigTypeText   = "text"
	SkillConfigTypeSecret = "secret"
)

type SkillConfig struct {
	ID             uint64    `dorm:"primaryKey;autoIncrement;comment:环境变量ID"`
	SkillID        uint64    `dorm:"type:bigint;not null;default:0;comment:保留技能"`
	TargetKey      string    `dorm:"type:varchar(128);not null;default:'';comment:保留目标"`
	Key            string    `dorm:"type:varchar(128);not null;comment:变量标识"`
	Name           string    `dorm:"type:varchar(128);not null;default:'';comment:变量名称"`
	Type           string    `dorm:"type:varchar(32);not null;default:'text';comment:变量类型"`
	Required       int16     `dorm:"type:smallint;not null;default:2;comment:是否必填"`
	ValueEncrypted string    `dorm:"type:text;not null;default:'';comment:变量值存储"`
	ValueHint      string    `dorm:"type:varchar(128);not null;default:'';comment:变量值"`
	Status         int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt      time.Time `dorm:"comment:创建时间"`
}

type SkillConfigIndex struct {
	SkillTargetKey struct{} `unique:"skill_id,target_key,key"`
	SkillStatus    struct{} `index:"skill_id,status"`
}

var skillConfigTypeOptions = []map[string]any{
	{"id": SkillConfigTypeText, "value": "明文"},
	{"id": SkillConfigTypeSecret, "value": "加密"},
}

func NewSkillConfigModel() *orm.Model[SkillConfig] {
	return orm.LoadModel[SkillConfig]("环境变量", "bot_skill_config", orm.ModelConfig{
		Index:    SkillConfigIndex{},
		Order:    "key asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
			"type":   skillConfigTypeOptions,
		},
		Fields: map[string]orm.FieldConfig{
			"skill_id":   {Type: orm.FieldTypeHidden},
			"target_key": {Type: orm.FieldTypeHidden},
			"required":   {Type: orm.FieldTypeHidden},
		},
	})
}

func NormalizeSkillConfigType(value string) string {
	switch value {
	case SkillConfigTypeSecret:
		return SkillConfigTypeSecret
	default:
		return SkillConfigTypeText
	}
}
