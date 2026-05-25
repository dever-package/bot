package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

type CanvasPower struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:画布能力ID"`
	CanvasID  uint64    `dorm:"type:bigint;not null;default:0;comment:画布"`
	PowerID   uint64    `dorm:"type:bigint;not null;default:0;comment:能力"`
	Config    string    `dorm:"type:text;not null;default:'{}';comment:配置"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type CanvasPowerIndex struct {
	CanvasPower  struct{} `unique:"canvas_id,power_id"`
	CanvasStatus struct{} `index:"canvas_id,status,sort,id"`
	PowerStatus  struct{} `index:"power_id,status"`
}

func NewCanvasPowerModel() *orm.Model[CanvasPower] {
	return orm.LoadModel[CanvasPower]("画布能力", "bot_body_canvas_power", orm.ModelConfig{
		Index:    CanvasPowerIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			canvasRelation,
			powerRelation,
		},
	})
}
