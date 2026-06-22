package assistant

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	MessageStatusNormal  int16 = 1
	MessageStatusError   int16 = 2
	MessageStatusRunning int16 = 3
)

var messageStatusOptions = []map[string]any{
	{"id": MessageStatusNormal, "value": "正常"},
	{"id": MessageStatusError, "value": "异常"},
	{"id": MessageStatusRunning, "value": "执行中"},
}

type Message struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:消息ID"`
	SessionID uint64    `dorm:"type:bigint;not null;default:0;comment:会话"`
	Role      string    `dorm:"type:varchar(32);not null;default:'';comment:角色"`
	Kind      string    `dorm:"type:varchar(64);not null;default:'chat';comment:类型"`
	Text      string    `dorm:"type:text;not null;default:'';comment:文本"`
	Content   string    `dorm:"type:text;not null;default:'{}';comment:内容"`
	Output    string    `dorm:"type:text;not null;default:'{}';comment:输出"`
	RequestID string    `dorm:"type:varchar(128);not null;default:'';comment:请求ID"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type MessageIndex struct {
	SessionRole struct{} `index:"session_id,role,created_at"`
	SessionKind struct{} `index:"session_id,kind,created_at"`
	Request     struct{} `index:"request_id"`
}

func NewMessageModel() *orm.Model[Message] {
	return orm.LoadModel[Message]("AI助理消息", "bot_assistant_message", orm.ModelConfig{
		Index:    MessageIndex{},
		Order:    "id asc",
		Database: "default",
		Options: map[string]any{
			"status": messageStatusOptions,
		},
	})
}
