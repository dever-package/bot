package team

import (
	"time"

	"github.com/shemic/dever/orm"
)

type NodeRun struct {
	ID         uint64 `dorm:"primaryKey;autoIncrement;comment:节点运行ID"`
	RunID      uint64 `dorm:"type:bigint;not null;default:0;comment:团队运行"`
	FlowRunID  uint64 `dorm:"type:bigint;not null;default:0;comment:工作流运行"`
	RequestID  string `dorm:"type:varchar(64);not null;comment:请求ID"`
	ProjectID  uint64 `dorm:"type:bigint;not null;default:0;comment:项目"`
	TeamID     uint64 `dorm:"type:bigint;not null;default:0;comment:团队"`
	FlowID     uint64 `dorm:"type:bigint;not null;default:0;comment:工作流"`
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
	FlowRunNode   struct{} `unique:"flow_run_id,node_id"`
	ProjectStatus struct{} `index:"project_id,status"`
	RunStatus     struct{} `index:"run_id,status"`
	FlowStatus    struct{} `index:"flow_id,status"`
	NodeStatus    struct{} `index:"node_id,status"`
	RequestStatus struct{} `index:"request_id,status"`
}

func NewNodeRunModel() *orm.Model[NodeRun] {
	return orm.LoadModel[NodeRun]("节点运行", "bot_team_node_run", orm.ModelConfig{
		Index:    NodeRunIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status":    runStatusOptions,
			"node_type": nodeTypeOptions,
		},
		Relations: []orm.Relation{
			nodeRunDisplayRelation(flowRelation),
			nodeRunDisplayRelation(runNodeRelation),
		},
	})
}

func nodeRunDisplayRelation(relation orm.Relation) orm.Relation {
	relation.OptionKeys = nil
	return relation
}
