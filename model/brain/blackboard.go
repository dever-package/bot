package brain

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Blackboard struct {
	ID         uint64    `dorm:"primaryKey;autoIncrement;comment:黑板ID"`
	RunID      uint64    `dorm:"type:bigint;not null;default:0;comment:大脑运行"`
	ThinkRunID uint64    `dorm:"type:bigint;not null;default:0;comment:思维运行"`
	BrainID    uint64    `dorm:"type:bigint;not null;default:0;comment:大脑"`
	ThinkID    uint64    `dorm:"type:bigint;not null;default:0;comment:思维"`
	Key        string    `dorm:"type:varchar(128);not null;comment:键"`
	Value      string    `dorm:"type:text;not null;default:'{}';comment:值"`
	SourceKind string    `dorm:"type:varchar(32);not null;default:'';comment:来源类型"`
	SourceID   uint64    `dorm:"type:bigint;not null;default:0;comment:来源ID"`
	CreatedAt  time.Time `dorm:"comment:创建时间"`
	UpdatedAt  time.Time `dorm:"comment:更新时间"`
}

type BlackboardIndex struct {
	ThinkRunKey struct{} `unique:"think_run_id,key"`
	RunKey      struct{} `index:"run_id,key"`
	BrainThink  struct{} `index:"brain_id,think_id"`
}

func NewBlackboardModel() *orm.Model[Blackboard] {
	return orm.LoadModel[Blackboard]("大脑黑板", "bot_brain_blackboard", orm.ModelConfig{
		Index:    BlackboardIndex{},
		Order:    "id asc",
		Database: "default",
		Relations: []orm.Relation{
			runRelation,
			thinkRunRelation,
			brainRelation,
			thinkRelation,
		},
	})
}
