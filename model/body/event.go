package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Event struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:事件ID"`
	BodyID    uint64    `dorm:"type:bigint;not null;default:0;comment:载体"`
	SessionID uint64    `dorm:"type:bigint;not null;default:0;comment:会话"`
	Type      string    `dorm:"type:varchar(64);not null;comment:类型"`
	Payload   string    `dorm:"type:text;not null;default:'{}';comment:内容"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type EventIndex struct {
	SessionType struct{} `index:"session_id,type,created_at"`
	BodyStatus  struct{} `index:"body_id,status,created_at"`
}

func NewEventModel() *orm.Model[Event] {
	return orm.LoadModel[Event]("载体事件", "bot_body_event", orm.ModelConfig{
		Index:    EventIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			bodyRelation,
			sessionRelation,
		},
	})
}
