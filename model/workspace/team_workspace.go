package workspace

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	TeamWorkspaceStatusEnabled int16 = 1
)

type TeamWorkspace struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:团队工作区ID"`
	UserID    uint64    `dorm:"type:bigint;not null;default:0;comment:用户"`
	TeamID    uint64    `dorm:"type:bigint;not null;default:0;comment:团队"`
	BodyID    uint64    `dorm:"type:bigint;not null;default:0;comment:载体"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
	UpdatedAt time.Time `dorm:"comment:更新时间"`
}

type TeamWorkspaceIndex struct {
	UserTeam   struct{} `unique:"user_id,team_id"`
	UserStatus struct{} `index:"user_id,status,updated_at"`
	Body       struct{} `index:"body_id"`
}

func NewTeamWorkspaceModel() *orm.Model[TeamWorkspace] {
	return orm.LoadModel[TeamWorkspace]("用户团队工作区", "bot_team_workspace", orm.ModelConfig{
		Index:    TeamWorkspaceIndex{},
		Order:    "id desc",
		Database: "default",
		Relations: []orm.Relation{
			workspaceUserRelation,
			teamRelation,
			workspaceBodyRelation,
		},
	})
}
