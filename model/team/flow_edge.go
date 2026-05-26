package team

import (
	"time"

	"github.com/shemic/dever/orm"
)

type FlowEdge struct {
	ID         uint64    `dorm:"primaryKey;autoIncrement;comment:工作流连线ID"`
	TeamID     uint64    `dorm:"type:bigint;not null;default:0;comment:团队"`
	FromFlowID uint64    `dorm:"type:bigint;not null;default:0;comment:上游工作流"`
	ToFlowID   uint64    `dorm:"type:bigint;not null;default:0;comment:下游工作流"`
	Condition  string    `dorm:"type:varchar(64);not null;default:'completed';comment:条件"`
	Status     int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort       int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt  time.Time `dorm:"comment:创建时间"`
}

type FlowEdgeIndex struct {
	TeamFromTo struct{} `unique:"team_id,from_flow_id,to_flow_id"`
	TeamStatus struct{} `index:"team_id,status,sort,id"`
	FromStatus struct{} `index:"from_flow_id,status"`
	ToStatus   struct{} `index:"to_flow_id,status"`
}

func NewFlowEdgeModel() *orm.Model[FlowEdge] {
	return orm.LoadModel[FlowEdge]("工作流关系", "bot_team_flow_edge", orm.ModelConfig{
		Index:    FlowEdgeIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			teamRelation,
			fromFlowRelation,
			toFlowRelation,
		},
	})
}
