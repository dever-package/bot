package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type AgentKnowledgeBase struct {
	ID              uint64    `dorm:"primaryKey;autoIncrement;comment:智能体知识库ID"`
	AgentID         uint64    `dorm:"type:bigint;not null;default:0;comment:智能体"`
	KnowledgeBaseID uint64    `dorm:"type:bigint;not null;default:0;comment:知识库"`
	Prompt          string    `dorm:"type:text;not null;default:'';comment:使用提示词"`
	RetrieveLimit   int       `dorm:"type:int;not null;default:0;comment:召回数量"`
	ScoreThreshold  float64   `dorm:"type:double precision;not null;default:0;comment:相似度阈值"`
	Status          int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort            int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt       time.Time `dorm:"comment:创建时间"`
}

type AgentKnowledgeBaseIndex struct {
	AgentBase  struct{} `unique:"agent_id,knowledge_base_id"`
	AgentSort  struct{} `index:"agent_id,status,sort,id"`
	BaseStatus struct{} `index:"knowledge_base_id,status"`
}

var agentKnowledgeBaseAgentRelation = orm.Relation{
	Field:      "agent_id",
	Option:     "bot.agent.NewAgentModel",
	OptionKeys: []string{"name", "key"},
}

func NewAgentKnowledgeBaseModel() *orm.Model[AgentKnowledgeBase] {
	return orm.LoadModel[AgentKnowledgeBase]("智能体知识库", "bot_agent_knowledge_base", orm.ModelConfig{
		Index:    AgentKnowledgeBaseIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			agentKnowledgeBaseAgentRelation,
			knowledgeBaseRelation,
		},
	})
}
