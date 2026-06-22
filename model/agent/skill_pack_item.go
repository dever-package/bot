package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type SkillPackItem struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:技能方案条目ID"`
	PackID    uint64    `dorm:"type:bigint;not null;default:0;comment:技能方案"`
	SkillID   uint64    `dorm:"type:bigint;not null;default:0;comment:技能"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type SkillPackItemIndex struct {
	PackSkill  struct{} `unique:"pack_id,skill_id"`
	PackStatus struct{} `index:"pack_id,status,sort"`
}

var (
	skillPackItemSeed = []map[string]any{
		{
			"id":       10001,
			"pack_id":  DefaultSkillPackID,
			"skill_id": BuiltinArticleImportSkillID,
			"status":   1,
			"sort":     10,
		},
	}

	skillPackRelation = orm.Relation{
		Field:      "pack_id",
		Option:     "bot.agent.NewSkillPackModel",
		OptionKeys: []string{"name"},
	}

	packItemSkillRelation = orm.Relation{
		Field:      "skill_id",
		Option:     "bot.agent.NewSkillModel",
		OptionKeys: []string{"name", "key", "cate_id", "description", "source_type", "source_url", "install_input"},
	}
)

func NewSkillPackItemModel() *orm.Model[SkillPackItem] {
	return orm.LoadModel[SkillPackItem]("技能方案条目", "bot_skill_pack_item", orm.ModelConfig{
		Index:    SkillPackItemIndex{},
		Seeds:    skillPackItemSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			skillPackRelation,
			packItemSkillRelation,
		},
	})
}
