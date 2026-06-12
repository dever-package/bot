package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type KnowledgeRetrieveLog struct {
	ID              uint64    `dorm:"primaryKey;autoIncrement;comment:检索日志ID"`
	KnowledgeBaseID uint64    `dorm:"type:bigint;not null;default:0;comment:知识库"`
	AgentID         uint64    `dorm:"type:bigint;not null;default:0;comment:智能体"`
	Query           string    `dorm:"type:text;not null;default:'';comment:用户原始问题"`
	PlannedQueries  string    `dorm:"type:text;not null;default:'';comment:规划扩展查询词JSON"`
	NodeIDs         string    `dorm:"type:text;not null;default:'';comment:命中节点ID列表JSON"`
	SnippetCount    int       `dorm:"type:int;not null;default:0;comment:返回片段数"`
	LatencyMs       int       `dorm:"type:int;not null;default:0;comment:检索耗时ms"`
	Status          int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt       time.Time `dorm:"comment:创建时间"`
}

func NewKnowledgeRetrieveLogModel() *orm.Model[KnowledgeRetrieveLog] {
	return orm.LoadModel[KnowledgeRetrieveLog]("检索日志", "bot_knowledge_retrieve_log", orm.ModelConfig{
		Index:    KnowledgeRetrieveLogIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			knowledgeBaseRelation,
		},
	})
}

type KnowledgeRetrieveLogIndex struct {
	BaseStatus struct{} `index:"knowledge_base_id,status,id"`
	AgentQuery struct{} `index:"agent_id,created_at"`
}
