package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type AgentCate struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:智能体分类ID"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type AgentCateIndex struct {
	StatusSort struct{} `index:"status,sort,id"`
}

const (
	DefaultAgentCateID uint64 = 1
	SystemAgentCateID  uint64 = 2
)

var agentCateSeed = []map[string]any{
	{"id": DefaultAgentCateID, "name": "默认分类", "status": 1, "sort": 100},
	{"id": SystemAgentCateID, "name": "系统内置", "status": 1, "sort": 110},
}

func NewAgentCateModel() *orm.Model[AgentCate] {
	return orm.LoadModel[AgentCate]("智能体分类", "bot_agent_cate", orm.ModelConfig{
		Index:    AgentCateIndex{},
		Seeds:    agentCateSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
	})
}
