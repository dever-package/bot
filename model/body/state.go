package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

type State struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:状态ID"`
	BodyID    uint64    `dorm:"type:bigint;not null;default:0;comment:载体"`
	SessionID uint64    `dorm:"type:bigint;not null;default:0;comment:会话"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Value     string    `dorm:"type:text;not null;default:'{}';comment:值"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type StateIndex struct {
	SessionName struct{} `unique:"session_id,name"`
	BodyName    struct{} `index:"body_id,name"`
}

func NewStateModel() *orm.Model[State] {
	return orm.LoadModel[State]("载体状态", "bot_body_state", orm.ModelConfig{
		Index:    StateIndex{},
		Order:    "id desc",
		Database: "default",
		Relations: []orm.Relation{
			bodyRelation,
			sessionRelation,
		},
	})
}
