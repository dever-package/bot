package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

const DefaultSkillCateID uint64 = 1

type SkillCate struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:技能分类ID"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type SkillCateIndex struct {
	Name       struct{} `unique:"name"`
	StatusSort struct{} `index:"status,sort"`
}

var skillCateSeed = []map[string]any{
	{"id": DefaultSkillCateID, "name": "默认", "status": 1, "sort": 1},
}

func NewSkillCateModel() *orm.Model[SkillCate] {
	return orm.LoadModel[SkillCate]("技能分类", "bot_skill_cate", orm.ModelConfig{
		Index:    SkillCateIndex{},
		Seeds:    skillCateSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
	})
}
