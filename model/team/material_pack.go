package team

import (
	"time"

	"github.com/shemic/dever/orm"
)

const DefaultMaterialPackID uint64 = 1

var (
	materialPackSeed = []map[string]any{
		{
			"id":          DefaultMaterialPackID,
			"name":        "默认素材方案",
			"description": "默认提供给团队使用的官方素材方案。",
			"status":      StatusEnabled,
			"sort":        1,
		},
	}

	materialPackItemRelation = orm.Relation{
		Field:      "items",
		Through:    "bot.team.NewMaterialPackItemModel",
		OwnerField: "pack_id",
		Order:      "sort asc,id asc",
	}
)

type MaterialPack struct {
	ID          uint64    `dorm:"primaryKey;autoIncrement;comment:素材方案ID"`
	Name        string    `dorm:"type:varchar(128);not null;comment:名称"`
	Description string    `dorm:"type:text;not null;default:'';comment:描述"`
	Status      int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort        int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt   time.Time `dorm:"comment:创建时间"`
}

type MaterialPackIndex struct {
	StatusSort struct{} `index:"status,sort,id"`
}

func NewMaterialPackModel() *orm.Model[MaterialPack] {
	return orm.LoadModel[MaterialPack]("素材方案", "bot_material_pack", orm.ModelConfig{
		Index:    MaterialPackIndex{},
		Seeds:    materialPackSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			materialPackItemRelation,
		},
	})
}
