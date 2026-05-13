package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type ServiceRuntimeStat struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:记录ID"`
	ServiceID uint64    `dorm:"type:bigint;not null;default:0;comment:服务ID"`
	Avg       int64     `dorm:"type:bigint;not null;default:0;comment:平均耗时"`
	Last      int64     `dorm:"type:bigint;not null;default:0;comment:上次耗时"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type ServiceRuntimeStatIndex struct {
	Service struct{} `unique:"service_id"`
}

func NewServiceRuntimeStatModel() *orm.Model[ServiceRuntimeStat] {
	return orm.LoadModel[ServiceRuntimeStat]("服务执行耗时", "bot_service_runtime_stat", orm.ModelConfig{
		Index:    ServiceRuntimeStatIndex{},
		Order:    "id desc",
		Database: "default",
	})
}
