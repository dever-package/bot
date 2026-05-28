package team

import (
	"time"

	"github.com/shemic/dever/orm"
)

type AssetCate struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:资产分类ID"`
	TeamID    uint64    `dorm:"type:bigint;not null;default:0;comment:团队"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type AssetCateIndex struct {
	TeamName   struct{} `unique:"team_id,name"`
	TeamStatus struct{} `index:"team_id,status,sort,id"`
}

func NewAssetCateModel() *orm.Model[AssetCate] {
	return orm.LoadModel[AssetCate]("资产分类", "bot_team_asset_cate", orm.ModelConfig{
		Index:    AssetCateIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			teamRelation,
		},
	})
}
