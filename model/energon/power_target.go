package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type PowerTarget struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:能力来源ID"`
	PowerID   uint64    `dorm:"type:bigint;not null;default:0;comment:能力"`
	ServiceID uint64    `dorm:"type:bigint;not null;default:0;comment:服务"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type PowerTargetIndex struct {
	PowerService struct{} `unique:"power_id,service_id"`
	PowerStatus  struct{} `index:"power_id,status,sort"`
}

var (
	powerTargetPowerRelation = orm.Relation{
		Field:      "power_id",
		Option:     "bot.energon.NewPowerModel",
		OptionKeys: []string{"name", "key"},
	}

	powerTargetServiceRelation = orm.Relation{
		Field:      "service_id",
		Option:     "bot.energon.NewServiceModel",
		OptionKeys: []string{"name"},
	}
)

func NewPowerTargetModel() *orm.Model[PowerTarget] {
	return orm.LoadModel[PowerTarget]("能力来源", "bot_energon_power_target", orm.ModelConfig{
		Index:    PowerTargetIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			powerTargetPowerRelation,
			powerTargetServiceRelation,
		},
	})
}
