package brain

import (
	"time"

	"github.com/shemic/dever/orm"
)

type ThinkRun struct {
	ID        uint64 `dorm:"primaryKey;autoIncrement;comment:思维运行ID"`
	RunID     uint64 `dorm:"type:bigint;not null;default:0;comment:大脑运行"`
	RequestID string `dorm:"type:varchar(64);not null;comment:请求ID"`
	ProjectID uint64 `dorm:"type:bigint;not null;default:0;comment:项目"`
	BrainID   uint64 `dorm:"type:bigint;not null;default:0;comment:大脑"`
	ThinkID   uint64 `dorm:"type:bigint;not null;default:0;comment:思维"`
	Input     string `dorm:"type:text;not null;default:'{}';comment:输入"`
	Output    string `dorm:"type:text;not null;default:'{}';comment:输出"`
	Error     string `dorm:"type:text;not null;default:'';comment:错误"`
	Status    string `dorm:"type:varchar(32);not null;default:'pending';comment:状态"`

	StartedAt  *time.Time `dorm:"null;comment:开始时间"`
	FinishedAt *time.Time `dorm:"null;comment:结束时间"`
	CreatedAt  time.Time  `dorm:"comment:创建时间"`
	UpdatedAt  time.Time  `dorm:"comment:更新时间"`
}

type ThinkRunIndex struct {
	RunThink      struct{} `unique:"run_id,think_id"`
	ProjectStatus struct{} `index:"project_id,status"`
	RunStatus     struct{} `index:"run_id,status"`
	BrainThink    struct{} `index:"brain_id,think_id,status"`
	RequestStatus struct{} `index:"request_id,status"`
}

func NewThinkRunModel() *orm.Model[ThinkRun] {
	return orm.LoadModel[ThinkRun]("思维运行", "bot_brain_think_run", orm.ModelConfig{
		Index:    ThinkRunIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status": runStatusOptions,
		},
		Relations: []orm.Relation{
			runRelation,
			brainRelation,
			thinkRelation,
		},
	})
}
