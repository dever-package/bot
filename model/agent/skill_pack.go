package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

const DefaultSkillPackID uint64 = 1

type SkillPack struct {
	ID          uint64    `dorm:"primaryKey;autoIncrement;comment:技能方案ID"`
	Name        string    `dorm:"type:varchar(128);not null;comment:名称"`
	Description string    `dorm:"type:text;not null;default:'';comment:描述"`
	Status      int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort        int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt   time.Time `dorm:"comment:创建时间"`
}

type SkillPackIndex struct {
	Name       struct{} `unique:"name"`
	StatusSort struct{} `index:"status,sort"`
}

var (
	skillPackSeed = []map[string]any{
		{
			"id":          DefaultSkillPackID,
			"name":        "默认技能方案",
			"description": "默认可选的智能体技能方案。",
			"status":      1,
			"sort":        1,
		},
	}

	skillPackItemRelation = orm.Relation{
		Field:      "items",
		Through:    "bot.agent.NewSkillPackItemModel",
		OwnerField: "pack_id",
		Order:      "sort asc, id asc",
	}
)

func NewSkillPackModel() *orm.Model[SkillPack] {
	return orm.LoadModel[SkillPack]("技能方案", "bot_skill_pack", orm.ModelConfig{
		Index:    SkillPackIndex{},
		Seeds:    skillPackSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			skillPackItemRelation,
		},
	})
}
