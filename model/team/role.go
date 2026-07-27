package team

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	RoleTypeChat     = "chat"
	RoleTypePlanner  = "planner"
	RoleTypeWorker   = "worker"
	RoleTypeReviewer = "reviewer"
)

var roleTypeOptions = []map[string]any{
	{"id": RoleTypeWorker, "value": "执行"},
	{"id": RoleTypeChat, "value": "沟通"},
	{"id": RoleTypePlanner, "value": "规划"},
	{"id": RoleTypeReviewer, "value": "审核"},
}

type Role struct {
	ID           uint64    `dorm:"primaryKey;autoIncrement;comment:角色ID"`
	TeamID       uint64    `dorm:"type:bigint;not null;default:0;comment:团队"`
	RoleType     string    `dorm:"type:varchar(32);not null;default:'worker';comment:类型"`
	RoleKey      string    `dorm:"type:varchar(128);not null;default:'';comment:标识"`
	Name         string    `dorm:"type:varchar(128);not null;comment:名称"`
	AgentID      uint64    `dorm:"type:bigint;not null;default:0;comment:智能体"`
	Assignment   string    `dorm:"type:text;not null;default:'';comment:职责说明"`
	Config       string    `dorm:"type:text;not null;default:'{}';comment:配置"`
	ChatStatus   int16     `dorm:"type:smallint;not null;default:1;comment:对话"`
	CreateStatus int16     `dorm:"type:smallint;not null;default:2;comment:创作"`
	Status       int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort         int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt    time.Time `dorm:"comment:创建时间"`
}

type RoleIndex struct {
	TeamType    struct{} `index:"team_id,role_type,status,sort,id"`
	AgentStatus struct{} `index:"agent_id,status"`
}

func NewRoleModel() *orm.Model[Role] {
	return orm.LoadModel[Role]("团队角色", "bot_team_role", orm.ModelConfig{
		Index:    RoleIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"chat_status":   statusOptions,
			"create_status": statusOptions,
			"status":        statusOptions,
			"role_type":     roleTypeOptions,
		},
		Relations: []orm.Relation{
			teamRelation,
			roleAgentRelation,
		},
	})
}
