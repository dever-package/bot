package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type AgentKnowledge struct {
	ID          uint64    `dorm:"primaryKey;autoIncrement;comment:智能体资料ID"`
	AgentID     uint64    `dorm:"type:bigint;not null;default:0;comment:智能体"`
	Name        string    `dorm:"type:varchar(128);not null;comment:名称"`
	Type        string    `dorm:"type:varchar(64);not null;default:'document';comment:类型"`
	LoadMode    string    `dorm:"type:varchar(32);not null;default:'always';comment:加载方式"`
	Description string    `dorm:"type:varchar(512);not null;default:'';comment:使用说明"`
	Content     string    `dorm:"type:text;not null;comment:资料正文"`
	Status      int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort        int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt   time.Time `dorm:"comment:创建时间"`
}

type AgentKnowledgeIndex struct {
	AgentName       struct{} `unique:"agent_id,name"`
	AgentStatusSort struct{} `index:"agent_id,status,sort"`
	AgentLoadMode   struct{} `index:"agent_id,load_mode,status,sort"`
}

var (
	agentKnowledgeTypeOptions = []map[string]any{
		agentKnowledgeTypeOption("document", "参考文档", "可被智能体参考的说明文档、产品资料、需求文档或知识片段。"),
		agentKnowledgeTypeOption("background", "背景资料", "长期稳定的领域背景、故事世界观、品牌背景或业务背景。"),
		agentKnowledgeTypeOption("glossary", "术语词表", "专有名词、人物名、品牌词、别名、固定译法或缩写解释。"),
		agentKnowledgeTypeOption("example", "示例样本", "高质量样例、参考输出、风格样本或正反例。"),
		agentKnowledgeTypeOption("state", "状态记录", "阶段性进度、当前设定集、项目现状或仍需持续参考的临时状态。"),
		agentKnowledgeTypeOption("other", "补充资料", "无法归入以上类型，但仍需要作为参考材料的资料。"),
	}

	agentKnowledgeAgentRelation = orm.Relation{
		Field:      "agent_id",
		Option:     "bot.agent.NewAgentModel",
		OptionKeys: []string{"name", "key"},
	}
)

func agentKnowledgeTypeOption(id string, value string, description string) map[string]any {
	return map[string]any{
		"id":          id,
		"value":       value,
		"description": description,
	}
}

func NewAgentKnowledgeModel() *orm.Model[AgentKnowledge] {
	return orm.LoadModel[AgentKnowledge]("智能体资料", "bot_agent_knowledge", orm.ModelConfig{
		Index:    AgentKnowledgeIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status":    statusOptions,
			"type":      agentKnowledgeTypeOptions,
			"load_mode": settingLoadModeOptions,
		},
		Relations: []orm.Relation{
			agentKnowledgeAgentRelation,
		},
	})
}

func AgentKnowledgeTypeOptions() []map[string]any {
	return cloneOptionRows(agentKnowledgeTypeOptions)
}
