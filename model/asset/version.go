package asset

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Version struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:版本ID"`
	AssetID   uint64    `dorm:"type:bigint;not null;default:0;comment:资产"`
	RunID     uint64    `dorm:"type:bigint;not null;default:0;comment:团队运行"`
	NodeRunID uint64    `dorm:"type:bigint;not null;default:0;comment:节点运行"`
	ReleaseID uint64    `dorm:"type:bigint;not null;default:0;comment:团队发布版本"`
	RequestID string    `dorm:"type:varchar(64);not null;default:'';comment:请求ID"`
	NodeKey   string    `dorm:"type:varchar(128);not null;default:'';comment:画布节点"`
	Source    string    `dorm:"type:text;not null;default:'{}';comment:来源信息"`
	Version   int       `dorm:"type:int;not null;default:1;comment:版本号"`
	Content   string    `dorm:"type:text;not null;default:'{}';comment:内容"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type VersionIndex struct {
	AssetVersion struct{} `unique:"asset_id,version"`
	AssetCreated struct{} `index:"asset_id,created_at"`
	RunCreated   struct{} `index:"run_id,created_at"`
	NodeRun      struct{} `index:"node_run_id,created_at"`
	Release      struct{} `index:"release_id,created_at"`
	Request      struct{} `index:"request_id,created_at"`
}

func NewVersionModel() *orm.Model[Version] {
	return orm.LoadModel[Version]("资产版本", "bot_asset_version", orm.ModelConfig{
		Index:    VersionIndex{},
		Order:    "id desc",
		Database: "default",
		Relations: []orm.Relation{
			assetRelation,
			runRelation,
			nodeRunRelation,
			releaseRelation,
		},
	})
}
