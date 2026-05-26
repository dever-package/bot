package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Canvas struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:画布ID"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Config    string    `dorm:"type:text;not null;default:'{}';comment:配置"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type CanvasIndex struct {
	Status struct{} `index:"status,sort,id"`
}

var (
	canvasPowerRelation = orm.Relation{
		Field:      "powers",
		Through:    "bot.body.NewCanvasPowerModel",
		OwnerField: "canvas_id",
		Order:      "sort asc, id asc",
	}

	canvasAgentRelation = orm.Relation{
		Field:      "agents",
		Through:    "bot.body.NewCanvasAgentModel",
		OwnerField: "canvas_id",
		Order:      "sort asc, id asc",
	}

	canvasTeamRelation = orm.Relation{
		Field:      "teams",
		Through:    "bot.body.NewCanvasTeamModel",
		OwnerField: "canvas_id",
		Order:      "sort asc, id asc",
	}
)

func NewCanvasModel() *orm.Model[Canvas] {
	return orm.LoadModel[Canvas]("画布", "bot_body_canvas", orm.ModelConfig{
		Index:    CanvasIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			canvasPowerRelation,
			canvasAgentRelation,
			canvasTeamRelation,
		},
	})
}
