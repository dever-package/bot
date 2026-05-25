package brain

import (
	"time"

	"github.com/shemic/dever/orm"
)

const DefaultBrainCateID uint64 = 1

type BrainCate struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:大脑分类ID"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type BrainCateIndex struct {
	Name struct{} `unique:"name"`
	Sort struct{} `index:"sort"`
}

var brainCateSeed = []map[string]any{
	{"id": DefaultBrainCateID, "name": "默认分类", "sort": 100},
}

func NewBrainCateModel() *orm.Model[BrainCate] {
	return orm.LoadModel[BrainCate]("大脑分类", "bot_brain_cate", orm.ModelConfig{
		Index:    BrainCateIndex{},
		Seeds:    brainCateSeed,
		Order:    "sort asc,id asc",
		Database: "default",
	})
}
