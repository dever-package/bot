package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Step struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:步骤ID"`
	RunID     uint64    `dorm:"type:bigint;not null;default:0;comment:运行"`
	RequestID string    `dorm:"type:varchar(64);not null;comment:请求ID"`
	Seq       int       `dorm:"type:int;not null;default:1;comment:序号"`
	Type      string    `dorm:"type:varchar(32);not null;default:input;comment:步骤类型"`
	Title     string    `dorm:"type:varchar(128);not null;default:'';comment:标题"`
	Content   string    `dorm:"type:text;not null;default:'';comment:内容"`
	Payload   string    `dorm:"type:longtext;not null;default:'{}';comment:原始数据"`
	Status    string    `dorm:"type:varchar(32);not null;default:success;comment:状态"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type StepIndex struct {
	RunSeq     struct{} `unique:"run_id,seq"`
	RequestID  struct{} `index:"request_id"`
	RequestSeq struct{} `index:"request_id,seq"`
	RunStatus  struct{} `index:"run_id,status"`
	Type       struct{} `index:"type"`
}

var (
	stepTypeOptions = []map[string]any{
		{"id": "input", "value": "输入"},
		{"id": "skill_catalog", "value": "技能目录"},
		{"id": "skill_select", "value": "技能选择"},
		{"id": "skill_load", "value": "技能加载"},
		{"id": "context", "value": "运行上下文"},
		{"id": "llm_delta", "value": "LLM片段"},
		{"id": "final", "value": "最终输出"},
		{"id": "error", "value": "错误"},
		{"id": "warning", "value": "警告"},
	}

	stepStatusOptions = []map[string]any{
		{"id": "running", "value": "运行中"},
		{"id": "success", "value": "成功"},
		{"id": "fail", "value": "失败"},
		{"id": "warning", "value": "警告"},
	}

	stepRunRelation = orm.Relation{
		Field:            "run_id",
		Option:           "bot.agent.NewRunModel",
		OptionKeys:       []string{"request_id", "agent_id", "status"},
		OptionLabelField: "request_id",
	}
)

func NewStepModel() *orm.Model[Step] {
	return orm.LoadModel[Step]("智能体步骤", "bot_agent_step", orm.ModelConfig{
		Index:    StepIndex{},
		Order:    "run_id desc,seq asc",
		Database: "default",
		Options: map[string]any{
			"type":   stepTypeOptions,
			"status": stepStatusOptions,
		},
		Relations: []orm.Relation{
			stepRunRelation,
		},
	})
}
