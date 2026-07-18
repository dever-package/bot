package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type PowerParam struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:能力参数ID"`
	PowerID   uint64    `dorm:"type:bigint;not null;default:0;comment:能力"`
	ParamID   uint64    `dorm:"type:bigint;not null;default:0;comment:参数"`
	Show      int16     `dorm:"type:smallint;not null;default:1;comment:展示"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:必填"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type PowerParamIndex struct {
	PowerStatus struct{} `index:"power_id,status,sort"`
}

var (
	powerParamShowOptions = []map[string]any{
		{"id": 1, "value": "始终展示"},
		{"id": 2, "value": "按来源展示"},
	}

	powerParamRequiredOptions = []map[string]any{
		{"id": 1, "value": "必填"},
		{"id": 2, "value": "选填"},
	}

	powerParamPowerRelation = orm.Relation{
		Field:      "power_id",
		Option:     "bot.energon.NewPowerModel",
		OptionKeys: []string{"name", "key"},
	}

	powerParamParamRelation = orm.Relation{
		Field:      "param_id",
		Option:     "bot.energon.NewParamModel",
		OptionKeys: []string{"name", "key", "type"},
	}
)

func NewPowerParamModel() *orm.Model[PowerParam] {
	return orm.LoadModel[PowerParam]("能力参数", "bot_energon_power_param", orm.ModelConfig{
		Index:    PowerParamIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"show":   powerParamShowOptions,
			"status": powerParamRequiredOptions,
		},
		Relations: []orm.Relation{
			powerParamPowerRelation,
			powerParamParamRelation,
		},
	})
}
