package team

import (
	"time"

	"github.com/shemic/dever/orm"
)

type TeamPower struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:团队能力ID"`
	TeamID    uint64    `dorm:"type:bigint;not null;default:0;comment:团队"`
	PowerID   uint64    `dorm:"type:bigint;not null;default:0;comment:能力"`
	Config    string    `dorm:"type:text;not null;default:'{}';comment:配置"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type TeamPowerIndex struct {
	TeamPower   struct{} `unique:"team_id,power_id"`
	TeamStatus  struct{} `index:"team_id,status,sort,id"`
	PowerStatus struct{} `index:"power_id,status"`
}

func NewTeamPowerModel() *orm.Model[TeamPower] {
	return orm.LoadModel[TeamPower]("团队能力", "bot_team_power", orm.ModelConfig{
		Index:    TeamPowerIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			teamRelation,
			powerRelation,
		},
	})
}
