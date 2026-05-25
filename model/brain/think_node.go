package brain

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	NodeTypeAgent         = "agent"
	NodeTypePower         = "power"
	NodeTypeBrain         = "brain"
	NodeTypeCondition     = "condition"
	NodeTypeMerge         = "merge"
	NodeTypeHumanApproval = "human_approval"
	NodeTypeSave          = "save"
)

var nodeTypeOptions = []map[string]any{
	{"id": NodeTypeAgent, "value": "智能体"},
	{"id": NodeTypePower, "value": "能力"},
	{"id": NodeTypeBrain, "value": "大脑"},
	{"id": NodeTypeCondition, "value": "条件"},
	{"id": NodeTypeMerge, "value": "合并"},
	{"id": NodeTypeHumanApproval, "value": "人工确认"},
	{"id": NodeTypeSave, "value": "保存"},
}

type ThinkNode struct {
	ID         uint64    `dorm:"primaryKey;autoIncrement;comment:节点ID"`
	BrainID    uint64    `dorm:"type:bigint;not null;default:0;comment:大脑"`
	ThinkID    uint64    `dorm:"type:bigint;not null;default:0;comment:思维"`
	NodeKey    string    `dorm:"type:varchar(128);not null;comment:节点标识"`
	Name       string    `dorm:"type:varchar(128);not null;comment:名称"`
	Type       string    `dorm:"type:varchar(32);not null;default:'agent';comment:类型"`
	AgentID    uint64    `dorm:"type:bigint;not null;default:0;comment:智能体"`
	PowerID    uint64    `dorm:"type:bigint;not null;default:0;comment:能力"`
	SubBrainID uint64    `dorm:"type:bigint;not null;default:0;comment:子大脑"`
	Config     string    `dorm:"type:text;not null;default:'{}';comment:配置"`
	Position   string    `dorm:"type:text;not null;default:'{}';comment:画布位置"`
	Status     int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort       int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt  time.Time `dorm:"comment:创建时间"`
}

type ThinkNodeIndex struct {
	ThinkKey       struct{} `unique:"think_id,node_key"`
	BrainStatus    struct{} `index:"brain_id,status,sort,id"`
	ThinkStatus    struct{} `index:"think_id,status,sort,id"`
	TypeStatus     struct{} `index:"type,status"`
	AgentStatus    struct{} `index:"agent_id,status"`
	PowerStatus    struct{} `index:"power_id,status"`
	SubBrainStatus struct{} `index:"sub_brain_id,status"`
}

func NewThinkNodeModel() *orm.Model[ThinkNode] {
	return orm.LoadModel[ThinkNode]("思维节点", "bot_brain_think_node", orm.ModelConfig{
		Index:    ThinkNodeIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
			"type":   nodeTypeOptions,
		},
		Relations: []orm.Relation{
			brainRelation,
			thinkRelation,
			nodeAgentRelation,
			nodePowerRelation,
			nodeSubBrainRelation,
		},
	})
}
