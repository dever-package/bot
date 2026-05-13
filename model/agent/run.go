package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Run struct {
	ID        uint64 `dorm:"primaryKey;autoIncrement;comment:运行ID"`
	RequestID string `dorm:"type:varchar(64);not null;comment:请求ID"`
	AgentID   uint64 `dorm:"type:bigint;not null;default:0;comment:智能体"`
	AgentKey  string `dorm:"type:varchar(128);not null;default:'';comment:智能体标识"`

	Input          string `dorm:"type:text;not null;default:'';comment:输入内容"`
	Skills         string `dorm:"type:text;not null;default:'[]';comment:技能列表"`
	RuntimeContext string `dorm:"type:text;not null;default:'';comment:运行上下文"`
	Output         string `dorm:"type:text;not null;default:'';comment:输出内容"`
	Error          string `dorm:"type:text;not null;default:'';comment:错误信息"`

	Status     string     `dorm:"type:varchar(32);not null;default:running;comment:状态"`
	StepCount  int        `dorm:"type:int;not null;default:0;comment:步骤数"`
	Latency    int64      `dorm:"type:bigint;not null;default:0;comment:耗时"`
	StartedAt  time.Time  `dorm:"comment:开始时间"`
	FinishedAt *time.Time `dorm:"null;comment:结束时间"`
	CreatedAt  time.Time  `dorm:"comment:创建时间"`
}

type RunIndex struct {
	RequestID     struct{} `index:"request_id"`
	AgentCreated  struct{} `index:"agent_id,created_at"`
	StatusCreated struct{} `index:"status,created_at"`
}

var (
	runStatusOptions = []map[string]any{
		{"id": "running", "value": "运行中"},
		{"id": "success", "value": "成功"},
		{"id": "fail", "value": "失败"},
		{"id": "canceled", "value": "已取消"},
	}

	runAgentRelation = orm.Relation{
		Field:      "agent_id",
		Option:     "bot.agent.NewAgentModel",
		OptionKeys: []string{"name", "key"},
	}

	runStepRelation = orm.Relation{
		Field:      "steps",
		Through:    "bot.agent.NewStepModel",
		OwnerField: "run_id",
		Order:      "seq asc,id asc",
	}
)

func NewRunModel() *orm.Model[Run] {
	return orm.LoadModel[Run]("智能体运行", "bot_agent_run", orm.ModelConfig{
		Index:    RunIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status": runStatusOptions,
		},
		Relations: []orm.Relation{
			runAgentRelation,
			runStepRelation,
		},
	})
}
