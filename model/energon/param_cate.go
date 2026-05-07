package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type ParamCate struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:参数分类ID"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type ParamCateIndex struct {
	Name struct{} `unique:"name"`
	Sort struct{} `index:"sort"`
}

var paramCateSeed = []map[string]any{
	{"id": 1, "name": "默认分类", "sort": 100},
}

func NewParamCateModel() *orm.Model[ParamCate] {
	return orm.LoadModel[ParamCate]("参数分类", "bot_energon_param_cate", orm.ModelConfig{
		Index:    ParamCateIndex{},
		Seeds:    paramCateSeed,
		Order:    "sort asc,id asc",
		Database: "default",
	})
}
