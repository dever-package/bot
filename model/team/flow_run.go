package team

import (
	"time"

	"github.com/shemic/dever/orm"
)

type FlowRun struct {
	ID        uint64 `dorm:"primaryKey;autoIncrement;comment:工作流运行ID"`
	RunID     uint64 `dorm:"type:bigint;not null;default:0;comment:团队运行"`
	RequestID string `dorm:"type:varchar(64);not null;comment:请求ID"`
	ProjectID uint64 `dorm:"type:bigint;not null;default:0;comment:项目"`
	TeamID    uint64 `dorm:"type:bigint;not null;default:0;comment:团队"`
	FlowID    uint64 `dorm:"type:bigint;not null;default:0;comment:工作流"`
	Input     string `dorm:"type:text;not null;default:'{}';comment:输入"`
	Output    string `dorm:"type:text;not null;default:'{}';comment:输出"`
	Error     string `dorm:"type:text;not null;default:'';comment:错误"`
	Status    string `dorm:"type:varchar(32);not null;default:'pending';comment:状态"`

	StartedAt  *time.Time `dorm:"null;comment:开始时间"`
	FinishedAt *time.Time `dorm:"null;comment:结束时间"`
	CreatedAt  time.Time  `dorm:"comment:创建时间"`
	UpdatedAt  time.Time  `dorm:"comment:更新时间"`
}

type FlowRunIndex struct {
	RunFlow       struct{} `unique:"run_id,flow_id"`
	ProjectStatus struct{} `index:"project_id,status"`
	RunStatus     struct{} `index:"run_id,status"`
	TeamFlow      struct{} `index:"team_id,flow_id,status"`
	RequestStatus struct{} `index:"request_id,status"`
}

func NewFlowRunModel() *orm.Model[FlowRun] {
	return orm.LoadModel[FlowRun]("工作流运行", "bot_team_flow_run", orm.ModelConfig{
		Index:    FlowRunIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status": runStatusOptions,
		},
		Relations: []orm.Relation{
			runRelation,
			teamRelation,
			flowRelation,
		},
	})
}
