package brain

import (
	"time"

	"github.com/shemic/dever/orm"
)

type NodeRun struct {
	ID         uint64 `dorm:"primaryKey;autoIncrement;comment:节点运行ID"`
	RunID      uint64 `dorm:"type:bigint;not null;default:0;comment:大脑运行"`
	ThinkRunID uint64 `dorm:"type:bigint;not null;default:0;comment:思维运行"`
	RequestID  string `dorm:"type:varchar(64);not null;comment:请求ID"`
	BrainID    uint64 `dorm:"type:bigint;not null;default:0;comment:大脑"`
	ThinkID    uint64 `dorm:"type:bigint;not null;default:0;comment:思维"`
	NodeID     uint64 `dorm:"type:bigint;not null;default:0;comment:节点"`
	NodeKey    string `dorm:"type:varchar(128);not null;default:'';comment:节点标识"`
	NodeType   string `dorm:"type:varchar(32);not null;default:'';comment:节点类型"`
	Input      string `dorm:"type:text;not null;default:'{}';comment:输入"`
	Output     string `dorm:"type:text;not null;default:'{}';comment:输出"`
	Error      string `dorm:"type:text;not null;default:'';comment:错误"`
	Status     string `dorm:"type:varchar(32);not null;default:'pending';comment:状态"`
	AgentRunID uint64 `dorm:"type:bigint;not null;default:0;comment:智能体运行"`

	StartedAt  *time.Time `dorm:"null;comment:开始时间"`
	FinishedAt *time.Time `dorm:"null;comment:结束时间"`
	CreatedAt  time.Time  `dorm:"comment:创建时间"`
	UpdatedAt  time.Time  `dorm:"comment:更新时间"`
}

type NodeRunIndex struct {
	ThinkRunNode  struct{} `unique:"think_run_id,node_id"`
	RunStatus     struct{} `index:"run_id,status"`
	ThinkStatus   struct{} `index:"think_id,status"`
	NodeStatus    struct{} `index:"node_id,status"`
	RequestStatus struct{} `index:"request_id,status"`
}

func NewNodeRunModel() *orm.Model[NodeRun] {
	return orm.LoadModel[NodeRun]("节点运行", "bot_brain_node_run", orm.ModelConfig{
		Index:    NodeRunIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status":    runStatusOptions,
			"node_type": nodeTypeOptions,
		},
		Relations: []orm.Relation{
			runRelation,
			thinkRunRelation,
			brainRelation,
			thinkRelation,
			runNodeRelation,
		},
	})
}
