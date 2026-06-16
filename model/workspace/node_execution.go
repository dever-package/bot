package workspace

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	NodeExecutionStatusPending  = "pending"
	NodeExecutionStatusRunning  = "running"
	NodeExecutionStatusSuccess  = "success"
	NodeExecutionStatusFail     = "fail"
	NodeExecutionStatusWaiting  = "waiting"
	NodeExecutionStatusCanceled = "canceled"
	NodeExecutionStatusSkipped  = "skipped"
)

var workspaceExecutionStatusOptions = []map[string]any{
	{"id": NodeExecutionStatusPending, "value": "等待中"},
	{"id": NodeExecutionStatusRunning, "value": "运行中"},
	{"id": NodeExecutionStatusSuccess, "value": "成功"},
	{"id": NodeExecutionStatusFail, "value": "失败"},
	{"id": NodeExecutionStatusWaiting, "value": "等待人工"},
	{"id": NodeExecutionStatusCanceled, "value": "已取消"},
	{"id": NodeExecutionStatusSkipped, "value": "跳过"},
}

type NodeExecution struct {
	ID             uint64     `dorm:"primaryKey;autoIncrement;comment:画布节点执行ID"`
	ExecutionID    uint64     `dorm:"type:bigint;not null;default:0;comment:画布执行"`
	ProjectID      uint64     `dorm:"type:bigint;not null;default:0;comment:项目"`
	AssetCateID    uint64     `dorm:"type:bigint;not null;default:0;comment:资产分类"`
	RunID          uint64     `dorm:"type:bigint;not null;default:0;comment:团队运行"`
	FlowRunID      uint64     `dorm:"type:bigint;not null;default:0;comment:工作流运行"`
	NodeRunID      uint64     `dorm:"type:bigint;not null;default:0;comment:节点运行"`
	AgentRunID     uint64     `dorm:"type:bigint;not null;default:0;comment:智能体运行"`
	RequestID      string     `dorm:"type:varchar(96);not null;default:'';comment:请求标识"`
	NodeKey        string     `dorm:"type:varchar(128);not null;default:'';comment:画布节点标识"`
	NodeType       string     `dorm:"type:varchar(32);not null;default:'';comment:节点类型"`
	FunctionKey    string     `dorm:"type:varchar(64);not null;default:'';comment:功能标识"`
	Status         string     `dorm:"type:varchar(32);not null;default:'pending';comment:状态"`
	Input          string     `dorm:"type:text;not null;default:'{}';comment:输入"`
	Output         string     `dorm:"type:text;not null;default:'{}';comment:输出"`
	Error          string     `dorm:"type:text;not null;default:'';comment:错误"`
	AssetID        uint64     `dorm:"type:bigint;not null;default:0;comment:资产"`
	VersionID      uint64     `dorm:"type:bigint;not null;default:0;comment:资产版本"`
	ChildRunID     uint64     `dorm:"type:bigint;not null;default:0;comment:子运行"`
	ChildRequestID string     `dorm:"type:varchar(96);not null;default:'';comment:子请求标识"`
	ApprovalID     uint64     `dorm:"type:bigint;not null;default:0;comment:人工确认"`
	StartedAt      *time.Time `dorm:"null;comment:开始时间"`
	FinishedAt     *time.Time `dorm:"null;comment:结束时间"`
	CreatedAt      time.Time  `dorm:"comment:创建时间"`
	UpdatedAt      time.Time  `dorm:"comment:更新时间"`
}

type NodeExecutionIndex struct {
	ExecutionNode struct{} `index:"execution_id,node_key"`
	RunNode       struct{} `unique:"run_id,node_key"`
	ProjectStatus struct{} `index:"project_id,asset_cate_id,status,updated_at"`
	Request       struct{} `index:"request_id,node_key"`
	NodeRun       struct{} `index:"node_run_id"`
	AgentRun      struct{} `index:"agent_run_id"`
	Approval      struct{} `index:"approval_id"`
}

func NewNodeExecutionModel() *orm.Model[NodeExecution] {
	return orm.LoadModel[NodeExecution]("工作台画布节点执行", "bot_workspace_node_execution", orm.ModelConfig{
		Index:    NodeExecutionIndex{},
		Order:    "id asc",
		Database: "default",
		Options: map[string]any{
			"status": workspaceExecutionStatusOptions,
		},
		Relations: []orm.Relation{
			executionRelation,
			projectRelation,
			runRelation,
			flowRunRelation,
			nodeRunRelation,
		},
	})
}
