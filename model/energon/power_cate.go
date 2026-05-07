package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type PowerCate struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:能力分类ID"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type PowerCateIndex struct {
	Name struct{} `unique:"name"`
	Sort struct{} `index:"sort"`
}

var powerCateSeed = []map[string]any{
	{"id": 1, "name": "默认分类", "sort": 100},
}

func NewPowerCateModel() *orm.Model[PowerCate] {
	return orm.LoadModel[PowerCate]("能力分类", "bot_energon_power_cate", orm.ModelConfig{
		Index:    PowerCateIndex{},
		Seeds:    powerCateSeed,
		Order:    "sort asc,id asc",
		Database: "default",
	})
}
