package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type ProviderCate struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:来源分类ID"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type ProviderCateIndex struct {
	Name struct{} `unique:"name"`
	Sort struct{} `index:"sort"`
}

var providerCateSeed = []map[string]any{
	{"id": 1, "name": "默认分类", "sort": 100},
}

func NewProviderCateModel() *orm.Model[ProviderCate] {
	return orm.LoadModel[ProviderCate]("来源分类", "bot_energon_provider_cate", orm.ModelConfig{
		Index:    ProviderCateIndex{},
		Seeds:    providerCateSeed,
		Order:    "sort asc,id asc",
		Database: "default",
	})
}
