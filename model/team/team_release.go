package team

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	TeamReleaseStatusCurrent = "current"
	TeamReleaseStatusArchive = "archive"
)

var teamReleaseStatusOptions = []map[string]any{
	{"id": TeamReleaseStatusCurrent, "value": "当前"},
	{"id": TeamReleaseStatusArchive, "value": "历史"},
}

type TeamRelease struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:发布版本ID"`
	TeamID    uint64    `dorm:"type:bigint;not null;default:0;comment:团队"`
	Version   int       `dorm:"type:int;not null;default:1;comment:版本号"`
	Snapshot  string    `dorm:"type:text;not null;default:'{}';comment:发布快照"`
	Status    string    `dorm:"type:varchar(32);not null;default:'current';comment:状态"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type TeamReleaseIndex struct {
	TeamVersion struct{} `unique:"team_id,version"`
	TeamStatus  struct{} `index:"team_id,status,version"`
}

func NewTeamReleaseModel() *orm.Model[TeamRelease] {
	return orm.LoadModel[TeamRelease]("团队发布版本", "bot_team_release", orm.ModelConfig{
		Index:    TeamReleaseIndex{},
		Order:    "version desc,id desc",
		Database: "default",
		Options: map[string]any{
			"status": teamReleaseStatusOptions,
		},
		Relations: []orm.Relation{
			teamRelation,
		},
	})
}
