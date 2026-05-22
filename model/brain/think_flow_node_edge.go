package brain

import (
	"time"

	"github.com/shemic/dever/orm"
)

type ThinkFlowNodeEdge struct {
	ID           uint64    `dorm:"primaryKey;autoIncrement;comment:节点连线ID"`
	BrainID      uint64    `dorm:"type:bigint;not null;default:0;comment:大脑"`
	ThinkID      uint64    `dorm:"type:bigint;not null;default:0;comment:思维"`
	FromNodeID   uint64    `dorm:"type:bigint;not null;default:0;comment:上游节点"`
	ToNodeID     uint64    `dorm:"type:bigint;not null;default:0;comment:下游节点"`
	Condition    string    `dorm:"type:varchar(64);not null;default:'always';comment:条件"`
	InputMapping string    `dorm:"type:text;not null;default:'{}';comment:输入映射"`
	Config       string    `dorm:"type:text;not null;default:'{}';comment:配置"`
	Status       int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort         int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt    time.Time `dorm:"comment:创建时间"`
}

type ThinkFlowNodeEdgeIndex struct {
	ThinkFromTo struct{} `unique:"think_id,from_node_id,to_node_id"`
	BrainStatus struct{} `index:"brain_id,status,sort,id"`
	ThinkStatus struct{} `index:"think_id,status,sort,id"`
	FromStatus  struct{} `index:"from_node_id,status"`
	ToStatus    struct{} `index:"to_node_id,status"`
}

func NewThinkFlowNodeEdgeModel() *orm.Model[ThinkFlowNodeEdge] {
	return orm.LoadModel[ThinkFlowNodeEdge]("思维流程节点关系", "bot_brain_think_flow_node_edge", orm.ModelConfig{
		Index:    ThinkFlowNodeEdgeIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			brainRelation,
			thinkRelation,
			flowFromNodeRelation,
			flowToNodeRelation,
		},
	})
}
