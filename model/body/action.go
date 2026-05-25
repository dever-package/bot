package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	ActionStatusPending = "pending"
	ActionStatusDone    = "done"
	ActionStatusFailed  = "failed"
)

var actionStatusOptions = []map[string]any{
	{"id": ActionStatusPending, "value": "待执行"},
	{"id": ActionStatusDone, "value": "已执行"},
	{"id": ActionStatusFailed, "value": "失败"},
}

type Action struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:动作ID"`
	BodyID    uint64    `dorm:"type:bigint;not null;default:0;comment:载体"`
	SessionID uint64    `dorm:"type:bigint;not null;default:0;comment:会话"`
	Type      string    `dorm:"type:varchar(64);not null;comment:类型"`
	Payload   string    `dorm:"type:text;not null;default:'{}';comment:内容"`
	Result    string    `dorm:"type:text;not null;default:'{}';comment:结果"`
	Status    string    `dorm:"type:varchar(32);not null;default:'pending';comment:状态"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type ActionIndex struct {
	SessionStatus struct{} `index:"session_id,status,created_at"`
	BodyStatus    struct{} `index:"body_id,status,created_at"`
}

func NewActionModel() *orm.Model[Action] {
	return orm.LoadModel[Action]("载体动作", "bot_body_action", orm.ModelConfig{
		Index:    ActionIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status": actionStatusOptions,
		},
		Relations: []orm.Relation{
			bodyRelation,
			sessionRelation,
		},
	})
}
