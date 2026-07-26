package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	PowerRunHistoryStatusPending  = "pending"
	PowerRunHistoryStatusSuccess  = "success"
	PowerRunHistoryStatusFail     = "fail"
	PowerRunHistoryStatusCanceled = "canceled"
)

type PowerRunHistory struct {
	ID             uint64     `dorm:"primaryKey;autoIncrement;comment:运行历史ID"`
	AdminID        uint64     `dorm:"type:bigint;not null;default:0;comment:后台账号"`
	PowerID        uint64     `dorm:"type:bigint;not null;default:0;comment:能力"`
	PowerKey       string     `dorm:"type:varchar(128);not null;default:'';comment:能力标识"`
	RequestID      string     `dorm:"type:varchar(96);not null;default:'';comment:请求标识"`
	Title          string     `dorm:"type:varchar(128);not null;default:'';comment:历史标题"`
	InputSummary   string     `dorm:"type:varchar(255);not null;default:'';comment:输入摘要"`
	Input          string     `dorm:"type:text;not null;default:'{}';comment:输入快照"`
	Output         string     `dorm:"type:text;not null;default:'{}';comment:最终输出"`
	SourceTargetID uint64     `dorm:"type:bigint;not null;default:0;comment:能力来源"`
	Status         string     `dorm:"type:varchar(32);not null;default:'pending';comment:状态"`
	Error          string     `dorm:"type:text;not null;default:'';comment:错误"`
	StartedAt      time.Time  `dorm:"comment:开始时间"`
	FinishedAt     *time.Time `dorm:"null;comment:结束时间"`
	CreatedAt      time.Time  `dorm:"comment:创建时间"`
	UpdatedAt      time.Time  `dorm:"comment:更新时间"`
}

type PowerRunHistoryIndex struct {
	Request  struct{} `unique:"request_id"`
	AdminKey struct{} `index:"admin_id,power_key,id"`
}

func NewPowerRunHistoryModel() *orm.Model[PowerRunHistory] {
	return orm.LoadModel[PowerRunHistory]("后台能力运行历史", "bot_energon_power_run_history", orm.ModelConfig{
		Index:    PowerRunHistoryIndex{},
		Order:    "id desc",
		Database: "default",
	})
}
