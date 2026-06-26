package team

import (
	"time"

	"github.com/shemic/dever/orm"
)

const DefaultTeamCateID uint64 = 1

type TeamCate struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:团队分类ID"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type TeamCateIndex struct {
	StatusSort struct{} `index:"status,sort,id"`
}

var teamCateSeed = []map[string]any{
	{"id": DefaultTeamCateID, "name": "默认分类", "status": StatusEnabled, "sort": 100},
}

func NewTeamCateModel() *orm.Model[TeamCate] {
	return orm.LoadModel[TeamCate]("团队分类", "bot_team_cate", orm.ModelConfig{
		Index:    TeamCateIndex{},
		Seeds:    teamCateSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
	})
}
