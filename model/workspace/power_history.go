package workspace

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	PowerHistoryTitleSourceAuto   = "auto"
	PowerHistoryTitleSourceLLM    = "llm"
	PowerHistoryTitleSourceManual = "manual"
)

type PowerHistory struct {
	ID          uint64    `dorm:"primaryKey;autoIncrement;comment:工具历史ID"`
	UserID      uint64    `dorm:"type:bigint;not null;default:0;comment:用户"`
	TeamID      uint64    `dorm:"type:bigint;not null;default:0;comment:团队"`
	TeamPowerID uint64    `dorm:"type:bigint;not null;default:0;comment:团队能力"`
	BodyID      uint64    `dorm:"type:bigint;not null;default:0;comment:载体"`
	RunID       uint64    `dorm:"type:bigint;not null;default:0;comment:团队运行"`
	RequestID   string    `dorm:"type:varchar(96);not null;default:'';comment:请求标识"`
	Title       string    `dorm:"type:varchar(128);not null;default:'';comment:历史标题"`
	TitleSource string    `dorm:"type:varchar(16);not null;default:'auto';comment:标题来源"`
	CreatedAt   time.Time `dorm:"comment:创建时间"`
	UpdatedAt   time.Time `dorm:"comment:更新时间"`
}

type PowerHistoryIndex struct {
	Run           struct{} `unique:"run_id"`
	Request       struct{} `unique:"request_id"`
	UserTeamPower struct{} `index:"user_id,team_id,team_power_id,id"`
	BodyTeamPower struct{} `index:"body_id,team_power_id,id"`
}

func NewPowerHistoryModel() *orm.Model[PowerHistory] {
	return orm.LoadModel[PowerHistory]("工作台工具历史", "bot_workspace_power_history", orm.ModelConfig{
		Index:    PowerHistoryIndex{},
		Order:    "id desc",
		Database: "default",
	})
}
