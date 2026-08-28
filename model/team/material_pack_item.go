package team

import (
	"time"

	"github.com/shemic/dever/orm"
)

type MaterialPackItem struct {
	ID         uint64    `dorm:"primaryKey;autoIncrement;comment:素材方案条目ID"`
	PackID     uint64    `dorm:"type:bigint;not null;default:0;comment:素材方案"`
	MaterialID uint64    `dorm:"type:bigint;not null;default:0;comment:素材"`
	Status     int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort       int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt  time.Time `dorm:"comment:创建时间"`
}

type MaterialPackItemIndex struct {
	PackMaterial struct{} `unique:"pack_id,material_id"`
	PackStatus   struct{} `index:"pack_id,status,sort,id"`
}

var (
	materialPackRelation = orm.Relation{
		Field:      "pack_id",
		Option:     "bot.team.NewMaterialPackModel",
		OptionKeys: []string{"name"},
	}

	packItemMaterialRelation = orm.Relation{
		Field:      "material_id",
		Option:     "bot.team.NewMaterialModel",
		OptionKeys: []string{"name"},
	}
)

func NewMaterialPackItemModel() *orm.Model[MaterialPackItem] {
	return orm.LoadModel[MaterialPackItem]("素材方案条目", "bot_material_pack_item", orm.ModelConfig{
		Index:    MaterialPackItemIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			materialPackRelation,
			packItemMaterialRelation,
		},
	})
}
