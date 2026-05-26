package team

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Flow struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:工作流ID"`
	TeamID    uint64    `dorm:"type:bigint;not null;default:0;comment:团队"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Key       string    `dorm:"type:varchar(128);not null;comment:标识"`
	Goal      string    `dorm:"type:text;not null;default:'';comment:目标"`
	Position  string    `dorm:"type:text;not null;default:'{}';comment:位置"`
	Config    string    `dorm:"type:text;not null;default:'{}';comment:配置"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type FlowIndex struct {
	TeamKey    struct{} `unique:"team_id,key"`
	TeamStatus struct{} `index:"team_id,status,sort,id"`
}

func NewFlowModel() *orm.Model[Flow] {
	return orm.LoadModel[Flow]("团队工作流", "bot_team_flow", orm.ModelConfig{
		Index:    FlowIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			teamRelation,
		},
	})
}
