package workspace

import (
	"time"

	"github.com/shemic/dever/orm"
)

type AssetLock struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:画布资产锁ID"`
	ProjectID uint64    `dorm:"type:bigint;not null;default:0;comment:项目"`
	LockKey   string    `dorm:"type:varchar(96);not null;default:'';comment:锁标识"`
	Owner     string    `dorm:"type:varchar(128);not null;default:'';comment:持有者"`
	ExpiresAt time.Time `dorm:"comment:过期时间"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
	UpdatedAt time.Time `dorm:"comment:更新时间"`
}

type AssetLockIndex struct {
	Lock    struct{} `unique:"lock_key"`
	Project struct{} `index:"project_id,expires_at"`
}

func NewAssetLockModel() *orm.Model[AssetLock] {
	return orm.LoadModel[AssetLock]("工作台画布资产锁", "bot_workspace_asset_lock", orm.ModelConfig{
		Index:    AssetLockIndex{},
		Order:    "id desc",
		Database: "default",
		Relations: []orm.Relation{
			projectRelation,
		},
	})
}
