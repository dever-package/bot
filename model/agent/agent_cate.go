package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type AgentCate struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:智能体分类ID"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type AgentCateIndex struct {
	Name struct{} `unique:"name"`
	Sort struct{} `index:"sort"`
}

const (
	DefaultAgentCateID   uint64 = 1
	AssistantAgentCateID uint64 = 2
)

var agentCateSeed = []map[string]any{
	{"id": DefaultAgentCateID, "name": "默认分类", "sort": 100},
	{"id": AssistantAgentCateID, "name": "助理", "sort": 110},
}

func NewAgentCateModel() *orm.Model[AgentCate] {
	return orm.LoadModel[AgentCate]("智能体分类", "bot_agent_cate", orm.ModelConfig{
		Index:    AgentCateIndex{},
		Seeds:    agentCateSeed,
		Order:    "sort asc,id asc",
		Database: "default",
	})
}
