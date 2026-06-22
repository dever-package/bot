package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type SkillConfigBind struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:技能参数绑定ID"`
	SkillID   uint64    `dorm:"type:bigint;not null;default:0;comment:技能"`
	ConfigID  uint64    `dorm:"type:bigint;not null;default:0;comment:参数"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type SkillConfigBindIndex struct {
	SkillConfig struct{} `unique:"skill_id,config_id"`
	ConfigSkill struct{} `index:"config_id,skill_id"`
}

func NewSkillConfigBindModel() *orm.Model[SkillConfigBind] {
	return orm.LoadModel[SkillConfigBind]("技能参数绑定", "bot_skill_config_bind", orm.ModelConfig{
		Index:    SkillConfigBindIndex{},
		Order:    "id asc",
		Database: "default",
	})
}
