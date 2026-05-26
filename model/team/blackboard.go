package team

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Blackboard struct {
	ID         uint64    `dorm:"primaryKey;autoIncrement;comment:黑板ID"`
	RunID      uint64    `dorm:"type:bigint;not null;default:0;comment:团队运行"`
	FlowRunID  uint64    `dorm:"type:bigint;not null;default:0;comment:工作流运行"`
	TeamID     uint64    `dorm:"type:bigint;not null;default:0;comment:团队"`
	FlowID     uint64    `dorm:"type:bigint;not null;default:0;comment:工作流"`
	Key        string    `dorm:"type:varchar(128);not null;comment:键"`
	Value      string    `dorm:"type:text;not null;default:'{}';comment:值"`
	SourceKind string    `dorm:"type:varchar(32);not null;default:'';comment:来源类型"`
	SourceID   uint64    `dorm:"type:bigint;not null;default:0;comment:来源ID"`
	CreatedAt  time.Time `dorm:"comment:创建时间"`
	UpdatedAt  time.Time `dorm:"comment:更新时间"`
}

type BlackboardIndex struct {
	FlowRunKey struct{} `unique:"flow_run_id,key"`
	RunKey     struct{} `index:"run_id,key"`
	TeamFlow   struct{} `index:"team_id,flow_id"`
}

func NewBlackboardModel() *orm.Model[Blackboard] {
	return orm.LoadModel[Blackboard]("团队黑板", "bot_team_blackboard", orm.ModelConfig{
		Index:    BlackboardIndex{},
		Order:    "id asc",
		Database: "default",
		Relations: []orm.Relation{
			runRelation,
			flowRunRelation,
			teamRelation,
			flowRelation,
		},
	})
}
