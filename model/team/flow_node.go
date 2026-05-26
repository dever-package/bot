package team

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	NodeTypeAgent         = "agent"
	NodeTypeRole          = "role"
	NodeTypePower         = "power"
	NodeTypeTeam          = "team"
	NodeTypeCondition     = "condition"
	NodeTypeMerge         = "merge"
	NodeTypeHumanApproval = "human_approval"
	NodeTypeSave          = "save"
)

var nodeTypeOptions = []map[string]any{
	{"id": NodeTypeAgent, "value": "智能体"},
	{"id": NodeTypeRole, "value": "角色"},
	{"id": NodeTypePower, "value": "能力"},
	{"id": NodeTypeTeam, "value": "团队"},
	{"id": NodeTypeCondition, "value": "条件"},
	{"id": NodeTypeMerge, "value": "合并"},
	{"id": NodeTypeHumanApproval, "value": "人工确认"},
	{"id": NodeTypeSave, "value": "保存"},
}

type FlowNode struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:节点ID"`
	TeamID    uint64    `dorm:"type:bigint;not null;default:0;comment:团队"`
	FlowID    uint64    `dorm:"type:bigint;not null;default:0;comment:工作流"`
	NodeKey   string    `dorm:"type:varchar(128);not null;comment:节点标识"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Type      string    `dorm:"type:varchar(32);not null;default:'agent';comment:类型"`
	RoleID    uint64    `dorm:"type:bigint;not null;default:0;comment:角色"`
	RoleKey   string    `dorm:"type:varchar(128);not null;default:'';comment:角色标识"`
	AgentID   uint64    `dorm:"type:bigint;not null;default:0;comment:智能体"`
	PowerID   uint64    `dorm:"type:bigint;not null;default:0;comment:能力"`
	SubTeamID uint64    `dorm:"type:bigint;not null;default:0;comment:子团队"`
	Config    string    `dorm:"type:text;not null;default:'{}';comment:配置"`
	Position  string    `dorm:"type:text;not null;default:'{}';comment:画布位置"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type FlowNodeIndex struct {
	FlowKey       struct{} `unique:"flow_id,node_key"`
	TeamStatus    struct{} `index:"team_id,status,sort,id"`
	FlowStatus    struct{} `index:"flow_id,status,sort,id"`
	TypeStatus    struct{} `index:"type,status"`
	RoleStatus    struct{} `index:"role_id,status"`
	AgentStatus   struct{} `index:"agent_id,status"`
	PowerStatus   struct{} `index:"power_id,status"`
	SubTeamStatus struct{} `index:"sub_team_id,status"`
}

func NewFlowNodeModel() *orm.Model[FlowNode] {
	return orm.LoadModel[FlowNode]("工作流节点", "bot_team_flow_node", orm.ModelConfig{
		Index:    FlowNodeIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
			"type":   nodeTypeOptions,
		},
		Relations: []orm.Relation{
			teamRelation,
			flowRelation,
			nodeRoleRelation,
			nodeAgentRelation,
			nodePowerRelation,
			nodeSubTeamRelation,
		},
	})
}
