package team

import (
	"time"

	"github.com/shemic/dever/orm"

	agentmodel "my/package/bot/model/agent"
)

const (
	RoleTypeChat     = "chat"
	RoleTypePlanner  = "planner"
	RoleTypeWorker   = "worker"
	RoleTypeReviewer = "reviewer"
)

var roleTypeOptions = []map[string]any{
	{"id": RoleTypeChat, "value": "沟通"},
	{"id": RoleTypePlanner, "value": "规划"},
	{"id": RoleTypeWorker, "value": "执行"},
	{"id": RoleTypeReviewer, "value": "审核"},
}

var roleSeed = []map[string]any{
	defaultRoleSeed(1, RoleTypeChat, "default_chat", "默认沟通角色", "负责和用户沟通，理解需求，保持对话体验连续。", 10),
	defaultRoleSeed(2, RoleTypePlanner, "default_planner", "默认规划角色", "负责拆解目标、制定步骤、选择合适工作流和执行角色。", 20),
	defaultRoleSeed(3, RoleTypeWorker, "default_worker", "默认执行角色", "负责执行具体任务，产出可被下游节点继续使用的结果。", 30),
	defaultRoleSeed(4, RoleTypeReviewer, "default_reviewer", "默认审核角色", "负责检查结果质量、风险和是否满足目标。", 40),
}

type Role struct {
	ID          uint64    `dorm:"primaryKey;autoIncrement;comment:角色ID"`
	TeamID      uint64    `dorm:"type:bigint;not null;default:0;comment:团队"`
	RoleType    string    `dorm:"type:varchar(32);not null;default:'worker';comment:类型"`
	RoleKey     string    `dorm:"type:varchar(128);not null;default:'';comment:标识"`
	Name        string    `dorm:"type:varchar(128);not null;comment:名称"`
	AgentID     uint64    `dorm:"type:bigint;not null;default:0;comment:智能体"`
	AssetCateID uint64    `dorm:"type:bigint;not null;default:0;comment:资产分类"`
	Assignment  string    `dorm:"type:text;not null;default:'';comment:职责说明"`
	Config      string    `dorm:"type:text;not null;default:'{}';comment:配置"`
	Status      int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort        int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt   time.Time `dorm:"comment:创建时间"`
}

type RoleIndex struct {
	TeamType        struct{} `index:"team_id,role_type,status,sort,id"`
	AgentStatus     struct{} `index:"agent_id,status"`
	AssetCateStatus struct{} `index:"asset_cate_id,status"`
}

func NewRoleModel() *orm.Model[Role] {
	return orm.LoadModel[Role]("团队角色", "bot_team_role", orm.ModelConfig{
		Index:    RoleIndex{},
		Seeds:    roleSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status":    statusOptions,
			"role_type": roleTypeOptions,
		},
		Relations: []orm.Relation{
			teamRelation,
			roleAgentRelation,
			assetCateRelation,
		},
	})
}

func defaultRoleSeed(id uint64, roleType string, roleKey string, name string, assignment string, sort int) map[string]any {
	return map[string]any{
		"id":            id,
		"team_id":       DefaultTeamID,
		"role_type":     roleType,
		"role_key":      roleKey,
		"name":          name,
		"agent_id":      agentmodel.DefaultAgentID,
		"asset_cate_id": 0,
		"assignment":    assignment,
		"config":        "{}",
		"status":        StatusEnabled,
		"sort":          sort,
	}
}
