package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	SessionStatusActive = "active"
	SessionStatusClosed = "closed"
)

var sessionStatusOptions = []map[string]any{
	{"id": SessionStatusActive, "value": "进行中"},
	{"id": SessionStatusClosed, "value": "已关闭"},
}

type Session struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:会话ID"`
	BodyID    uint64    `dorm:"type:bigint;not null;default:0;comment:载体"`
	ProjectID uint64    `dorm:"type:bigint;not null;default:0;comment:项目"`
	RequestID string    `dorm:"type:varchar(64);not null;comment:请求ID"`
	State     string    `dorm:"type:text;not null;default:'{}';comment:状态"`
	Status    string    `dorm:"type:varchar(32);not null;default:'active';comment:状态"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type SessionIndex struct {
	RequestID  struct{} `unique:"request_id"`
	BodyStatus struct{} `index:"body_id,status,created_at"`
	Project    struct{} `index:"project_id,status,created_at"`
}

func NewSessionModel() *orm.Model[Session] {
	return orm.LoadModel[Session]("载体会话", "bot_body_session", orm.ModelConfig{
		Index:    SessionIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status": sessionStatusOptions,
		},
		Relations: []orm.Relation{
			bodyRelation,
		},
	})
}
