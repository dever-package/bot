package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	SystemMessagePinnedYes int16 = 1
	SystemMessagePinnedNo  int16 = 2
)

var systemMessagePinnedOptions = []map[string]any{
	{"id": SystemMessagePinnedYes, "value": "置顶"},
	{"id": SystemMessagePinnedNo, "value": "普通"},
}

type SystemMessage struct {
	ID          uint64     `dorm:"primaryKey;autoIncrement;comment:系统消息ID"`
	Title       string     `dorm:"type:varchar(160);not null;comment:标题"`
	Content     string     `dorm:"type:text;not null;default:'';comment:内容"`
	URL         string     `dorm:"type:text;not null;default:'';comment:外链地址"`
	PublishedAt time.Time  `dorm:"not null;default:CURRENT_TIMESTAMP;comment:发布时间"`
	ExpiresAt   *time.Time `dorm:"null;comment:结束时间"`
	Pinned      int16      `dorm:"type:smallint;not null;default:2;comment:是否置顶"`
	Status      int16      `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort        int        `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt   time.Time  `dorm:"not null;default:CURRENT_TIMESTAMP;comment:创建时间"`
}

type SystemMessageIndex struct {
	Visibility struct{} `index:"status,published_at,expires_at,pinned,sort,id"`
	CreatedAt  struct{} `index:"created_at"`
}

func NewSystemMessageModel() *orm.Model[SystemMessage] {
	return orm.LoadModel[SystemMessage]("系统消息", "bot_body_system_message", orm.ModelConfig{
		Index:    SystemMessageIndex{},
		Order:    "pinned asc,sort asc,published_at desc,id desc",
		Database: "default",
		Options: map[string]any{
			"pinned": systemMessagePinnedOptions,
			"status": statusOptions,
		},
	})
}
