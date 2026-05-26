package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

type CanvasTeam struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:画布团队ID"`
	CanvasID  uint64    `dorm:"type:bigint;not null;default:0;comment:画布"`
	TeamID    uint64    `dorm:"type:bigint;not null;default:0;comment:团队"`
	ReleaseID uint64    `dorm:"type:bigint;not null;default:0;comment:发布版本"`
	Config    string    `dorm:"type:text;not null;default:'{}';comment:配置"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type CanvasTeamIndex struct {
	CanvasTeam   struct{} `unique:"canvas_id,team_id"`
	CanvasStatus struct{} `index:"canvas_id,status,sort,id"`
	TeamStatus   struct{} `index:"team_id,status"`
	Release      struct{} `index:"release_id,status"`
}

func NewCanvasTeamModel() *orm.Model[CanvasTeam] {
	return orm.LoadModel[CanvasTeam]("画布团队", "bot_body_canvas_team", orm.ModelConfig{
		Index:    CanvasTeamIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			canvasRelation,
			teamRelation,
			releaseRelation,
		},
	})
}
