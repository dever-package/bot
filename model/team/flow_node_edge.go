package team

import (
	"time"

	"github.com/shemic/dever/orm"
)

type FlowNodeEdge struct {
	ID         uint64    `dorm:"primaryKey;autoIncrement;comment:节点连线ID"`
	TeamID     uint64    `dorm:"type:bigint;not null;default:0;comment:团队"`
	FlowID     uint64    `dorm:"type:bigint;not null;default:0;comment:工作流"`
	FromNodeID uint64    `dorm:"type:bigint;not null;default:0;comment:上游节点"`
	ToNodeID   uint64    `dorm:"type:bigint;not null;default:0;comment:下游节点"`
	Condition  string    `dorm:"type:varchar(64);not null;default:'always';comment:条件"`
	Status     int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort       int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt  time.Time `dorm:"comment:创建时间"`
}

type FlowNodeEdgeIndex struct {
	FlowFromTo struct{} `unique:"flow_id,from_node_id,to_node_id"`
	TeamStatus struct{} `index:"team_id,status,sort,id"`
	FlowStatus struct{} `index:"flow_id,status,sort,id"`
	FromStatus struct{} `index:"from_node_id,status"`
	ToStatus   struct{} `index:"to_node_id,status"`
}

func NewFlowNodeEdgeModel() *orm.Model[FlowNodeEdge] {
	return orm.LoadModel[FlowNodeEdge]("工作流节点关系", "bot_team_flow_node_edge", orm.ModelConfig{
		Index:    FlowNodeEdgeIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			teamRelation,
			flowRelation,
			nodeFromRelation,
			nodeToRelation,
		},
	})
}
