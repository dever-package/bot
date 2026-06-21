package assistant

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	SessionStatusActive   int16 = 1
	SessionStatusArchived int16 = 2

	OwnerTypeAdmin    = "admin"
	OwnerTypeBodyUser = "body_user"
)

var sessionStatusOptions = []map[string]any{
	{"id": SessionStatusActive, "value": "活跃"},
	{"id": SessionStatusArchived, "value": "归档"},
}

var ownerTypeOptions = []map[string]any{
	{"id": OwnerTypeAdmin, "value": "后台账号"},
	{"id": OwnerTypeBodyUser, "value": "前台用户"},
}

type Session struct {
	ID            uint64    `dorm:"primaryKey;autoIncrement;comment:会话ID"`
	OwnerType     string    `dorm:"type:varchar(32);not null;default:'admin';comment:归属类型"`
	OwnerID       uint64    `dorm:"type:bigint;not null;default:0;comment:归属账号"`
	ContextKey    string    `dorm:"type:varchar(128);not null;default:'';comment:上下文"`
	AgentKey      string    `dorm:"type:varchar(128);not null;default:'';comment:智能体"`
	Title         string    `dorm:"type:varchar(255);not null;default:'';comment:标题"`
	Status        int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	MessageCount  int       `dorm:"type:int;not null;default:0;comment:消息数"`
	LastMessageAt time.Time `dorm:"comment:最后消息时间"`
	CreatedAt     time.Time `dorm:"comment:创建时间"`
}

type SessionIndex struct {
	OwnerContext struct{} `index:"owner_type,owner_id,context_key,agent_key,status,last_message_at"`
	OwnerStatus  struct{} `index:"owner_type,owner_id,status,last_message_at"`
	AgentStatus  struct{} `index:"agent_key,status,last_message_at"`
}

func NewSessionModel() *orm.Model[Session] {
	return orm.LoadModel[Session]("AI助理会话", "bot_assistant_session", orm.ModelConfig{
		Index:    SessionIndex{},
		Order:    "last_message_at desc,id desc",
		Database: "default",
		Options: map[string]any{
			"owner_type": ownerTypeOptions,
			"status":     sessionStatusOptions,
		},
	})
}
