package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

type CanvasBrain struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:画布大脑ID"`
	CanvasID  uint64    `dorm:"type:bigint;not null;default:0;comment:画布"`
	BrainID   uint64    `dorm:"type:bigint;not null;default:0;comment:大脑"`
	ReleaseID uint64    `dorm:"type:bigint;not null;default:0;comment:发布版本"`
	Config    string    `dorm:"type:text;not null;default:'{}';comment:配置"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type CanvasBrainIndex struct {
	CanvasBrain  struct{} `unique:"canvas_id,brain_id"`
	CanvasStatus struct{} `index:"canvas_id,status,sort,id"`
	BrainStatus  struct{} `index:"brain_id,status"`
	Release      struct{} `index:"release_id,status"`
}

func NewCanvasBrainModel() *orm.Model[CanvasBrain] {
	return orm.LoadModel[CanvasBrain]("画布大脑", "bot_body_canvas_brain", orm.ModelConfig{
		Index:    CanvasBrainIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			canvasRelation,
			brainRelation,
			releaseRelation,
		},
	})
}
