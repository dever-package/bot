package workspace

import (
	"time"

	"github.com/shemic/dever/orm"
)

type RunLock struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:画布运行锁ID"`
	ProjectID uint64    `dorm:"type:bigint;not null;default:0;comment:项目"`
	RunID     uint64    `dorm:"type:bigint;not null;default:0;comment:运行"`
	Owner     string    `dorm:"type:varchar(128);not null;default:'';comment:持有者"`
	ExpiresAt time.Time `dorm:"comment:过期时间"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
	UpdatedAt time.Time `dorm:"comment:更新时间"`
}

type RunLockIndex struct {
	Run     struct{} `unique:"run_id"`
	Project struct{} `index:"project_id,expires_at"`
}

func NewRunLockModel() *orm.Model[RunLock] {
	return orm.LoadModel[RunLock]("工作台画布运行锁", "bot_workspace_run_lock", orm.ModelConfig{
		Index:    RunLockIndex{},
		Order:    "id desc",
		Database: "default",
		Relations: []orm.Relation{
			projectRelation,
			runRelation,
		},
	})
}
