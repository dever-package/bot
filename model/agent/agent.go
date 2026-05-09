package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Agent struct {
	ID              uint64    `dorm:"primaryKey;autoIncrement;comment:智能体ID"`
	Name            string    `dorm:"type:varchar(128);not null;comment:名称"`
	Key             string    `dorm:"type:varchar(128);not null;comment:标识"`
	Description     string    `dorm:"type:text;not null;default:'';comment:描述"`
	Mode            string    `dorm:"type:varchar(32);not null;default:direct;comment:运行模式"`
	LLMPowerID      uint64    `dorm:"type:bigint;not null;default:0;comment:LLM能力"`
	SystemPrompt    string    `dorm:"type:text;not null;default:'';comment:系统提示词"`
	DeveloperPrompt string    `dorm:"type:text;not null;default:'';comment:开发者提示词"`
	Instruction     string    `dorm:"type:text;not null;default:'';comment:任务说明"`
	Temperature     float64   `dorm:"type:double;not null;default:0.7;comment:温度"`
	MaxSteps        int       `dorm:"type:int;not null;default:6;comment:最大步骤数"`
	TimeoutSeconds  int       `dorm:"type:int;not null;default:300;comment:超时时间"`
	Status          int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort            int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt       time.Time `dorm:"comment:创建时间"`
}

type AgentIndex struct {
	Key        struct{} `unique:"key"`
	ModeStatus struct{} `index:"mode,status"`
	StatusSort struct{} `index:"status,sort"`
}

var (
	agentModeOptions = []map[string]any{
		{"id": "direct", "value": "直接执行"},
		{"id": "react", "value": "ReAct"},
		{"id": "plan", "value": "计划执行"},
	}

	statusOptions = []map[string]any{
		{"id": 1, "value": "开启"},
		{"id": 2, "value": "停用"},
	}

	agentLLMPowerRelation = orm.Relation{
		Field:      "llm_power_id",
		Option:     "bot.energon.NewPowerModel",
		OptionKeys: []string{"name", "key", "kind"},
	}
)

func NewAgentModel() *orm.Model[Agent] {
	return orm.LoadModel[Agent]("智能体", "bot_agent", orm.ModelConfig{
		Index:    AgentIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"mode":   agentModeOptions,
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			agentLLMPowerRelation,
		},
	})
}
