package brain

import (
	"time"

	"github.com/shemic/dever/orm"
)

type ThinkEdge struct {
	ID          uint64    `dorm:"primaryKey;autoIncrement;comment:思维连线ID"`
	BrainID     uint64    `dorm:"type:bigint;not null;default:0;comment:大脑"`
	FromThinkID uint64    `dorm:"type:bigint;not null;default:0;comment:上游思维"`
	ToThinkID   uint64    `dorm:"type:bigint;not null;default:0;comment:下游思维"`
	Condition   string    `dorm:"type:varchar(64);not null;default:'completed';comment:条件"`
	Status      int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort        int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt   time.Time `dorm:"comment:创建时间"`
}

type ThinkEdgeIndex struct {
	BrainFromTo struct{} `unique:"brain_id,from_think_id,to_think_id"`
	BrainStatus struct{} `index:"brain_id,status,sort,id"`
	FromStatus  struct{} `index:"from_think_id,status"`
	ToStatus    struct{} `index:"to_think_id,status"`
}

func NewThinkEdgeModel() *orm.Model[ThinkEdge] {
	return orm.LoadModel[ThinkEdge]("思维关系", "bot_brain_think_edge", orm.ModelConfig{
		Index:    ThinkEdgeIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			brainRelation,
			fromThinkRelation,
			toThinkRelation,
		},
	})
}
