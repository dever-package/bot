package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

type CanvasAgent struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:画布智能体ID"`
	CanvasID  uint64    `dorm:"type:bigint;not null;default:0;comment:画布"`
	AgentID   uint64    `dorm:"type:bigint;not null;default:0;comment:智能体"`
	Config    string    `dorm:"type:text;not null;default:'{}';comment:配置"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type CanvasAgentIndex struct {
	CanvasAgent  struct{} `unique:"canvas_id,agent_id"`
	CanvasStatus struct{} `index:"canvas_id,status,sort,id"`
	AgentStatus  struct{} `index:"agent_id,status"`
}

func NewCanvasAgentModel() *orm.Model[CanvasAgent] {
	return orm.LoadModel[CanvasAgent]("画布智能体", "bot_body_canvas_agent", orm.ModelConfig{
		Index:    CanvasAgentIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			canvasRelation,
			agentRelation,
		},
	})
}
