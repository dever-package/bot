package brain

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	RunStatusPending  = "pending"
	RunStatusRunning  = "running"
	RunStatusWaiting  = "waiting"
	RunStatusSuccess  = "success"
	RunStatusFail     = "fail"
	RunStatusCanceled = "canceled"
)

var runStatusOptions = []map[string]any{
	{"id": RunStatusPending, "value": "等待中"},
	{"id": RunStatusRunning, "value": "运行中"},
	{"id": RunStatusWaiting, "value": "等待人工"},
	{"id": RunStatusSuccess, "value": "成功"},
	{"id": RunStatusFail, "value": "失败"},
	{"id": RunStatusCanceled, "value": "已取消"},
}

type Run struct {
	ID        uint64 `dorm:"primaryKey;autoIncrement;comment:运行ID"`
	RequestID string `dorm:"type:varchar(64);not null;comment:请求ID"`
	BrainID   uint64 `dorm:"type:bigint;not null;default:0;comment:大脑"`
	ReleaseID uint64 `dorm:"type:bigint;not null;default:0;comment:发布版本"`
	Input     string `dorm:"type:text;not null;default:'{}';comment:输入"`
	Output    string `dorm:"type:text;not null;default:'{}';comment:输出"`
	Error     string `dorm:"type:text;not null;default:'';comment:错误"`
	Status    string `dorm:"type:varchar(32);not null;default:'running';comment:状态"`

	StartedAt  time.Time  `dorm:"comment:开始时间"`
	FinishedAt *time.Time `dorm:"null;comment:结束时间"`
	CreatedAt  time.Time  `dorm:"comment:创建时间"`
	UpdatedAt  time.Time  `dorm:"comment:更新时间"`
}

type RunIndex struct {
	RequestID     struct{} `index:"request_id"`
	BrainStatus   struct{} `index:"brain_id,status,created_at"`
	ReleaseStatus struct{} `index:"release_id,status,created_at"`
	StatusCreated struct{} `index:"status,created_at"`
}

func NewRunModel() *orm.Model[Run] {
	return orm.LoadModel[Run]("大脑运行", "bot_brain_run", orm.ModelConfig{
		Index:    RunIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status": runStatusOptions,
		},
		Relations: []orm.Relation{
			brainRelation,
		},
	})
}
