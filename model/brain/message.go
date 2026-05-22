package brain

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Message struct {
	ID         uint64    `dorm:"primaryKey;autoIncrement;comment:消息ID"`
	RunID      uint64    `dorm:"type:bigint;not null;default:0;comment:大脑运行"`
	ThinkRunID uint64    `dorm:"type:bigint;not null;default:0;comment:思维运行"`
	NodeRunID  uint64    `dorm:"type:bigint;not null;default:0;comment:节点运行"`
	BrainID    uint64    `dorm:"type:bigint;not null;default:0;comment:大脑"`
	ThinkID    uint64    `dorm:"type:bigint;not null;default:0;comment:思维"`
	NodeID     uint64    `dorm:"type:bigint;not null;default:0;comment:节点"`
	Type       string    `dorm:"type:varchar(32);not null;default:'artifact';comment:类型"`
	Role       string    `dorm:"type:varchar(32);not null;default:'';comment:角色"`
	Content    string    `dorm:"type:text;not null;default:'{}';comment:内容"`
	CreatedAt  time.Time `dorm:"comment:创建时间"`
}

type MessageIndex struct {
	RunType   struct{} `index:"run_id,type,created_at"`
	ThinkRun  struct{} `index:"think_run_id,created_at"`
	NodeRun   struct{} `index:"node_run_id,created_at"`
	BrainType struct{} `index:"brain_id,type,created_at"`
}

func NewMessageModel() *orm.Model[Message] {
	return orm.LoadModel[Message]("大脑消息", "bot_brain_message", orm.ModelConfig{
		Index:    MessageIndex{},
		Order:    "id asc",
		Database: "default",
		Relations: []orm.Relation{
			runRelation,
			thinkRunRelation,
			nodeRunRelation,
			brainRelation,
			thinkRelation,
			runNodeRelation,
		},
	})
}
