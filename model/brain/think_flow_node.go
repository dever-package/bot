package brain

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	NodeTypeAgent         = "agent"
	NodeTypePower         = "power"
	NodeTypeCondition     = "condition"
	NodeTypeMerge         = "merge"
	NodeTypeHumanApproval = "human_approval"
	NodeTypeSave          = "save"
)

var nodeTypeOptions = []map[string]any{
	{"id": NodeTypeAgent, "value": "智能体"},
	{"id": NodeTypePower, "value": "能力"},
	{"id": NodeTypeCondition, "value": "条件"},
	{"id": NodeTypeMerge, "value": "合并"},
	{"id": NodeTypeHumanApproval, "value": "人工确认"},
	{"id": NodeTypeSave, "value": "保存"},
}

type ThinkFlowNode struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:节点ID"`
	BrainID   uint64    `dorm:"type:bigint;not null;default:0;comment:大脑"`
	ThinkID   uint64    `dorm:"type:bigint;not null;default:0;comment:思维"`
	NodeKey   string    `dorm:"type:varchar(128);not null;comment:节点标识"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Type      string    `dorm:"type:varchar(32);not null;default:'agent';comment:类型"`
	AgentID   uint64    `dorm:"type:bigint;not null;default:0;comment:智能体"`
	Config    string    `dorm:"type:text;not null;default:'{}';comment:配置"`
	Position  string    `dorm:"type:text;not null;default:'{}';comment:画布位置"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type ThinkFlowNodeIndex struct {
	ThinkKey    struct{} `unique:"think_id,node_key"`
	BrainStatus struct{} `index:"brain_id,status,sort,id"`
	ThinkStatus struct{} `index:"think_id,status,sort,id"`
	TypeStatus  struct{} `index:"type,status"`
	AgentStatus struct{} `index:"agent_id,status"`
}

func NewThinkFlowNodeModel() *orm.Model[ThinkFlowNode] {
	return orm.LoadModel[ThinkFlowNode]("思维流程节点", "bot_brain_think_flow_node", orm.ModelConfig{
		Index:    ThinkFlowNodeIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
			"type":   nodeTypeOptions,
		},
		Relations: []orm.Relation{
			brainRelation,
			thinkRelation,
			flowNodeAgentRelation,
		},
	})
}
