package workspace

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Execution struct {
	ID          uint64     `dorm:"primaryKey;autoIncrement;comment:画布执行ID"`
	ProjectID   uint64     `dorm:"type:bigint;not null;default:0;comment:项目"`
	AssetCateID uint64     `dorm:"type:bigint;not null;default:0;comment:资产分类"`
	TeamID      uint64     `dorm:"type:bigint;not null;default:0;comment:团队"`
	ReleaseID   uint64     `dorm:"type:bigint;not null;default:0;comment:发布版本"`
	RunID       uint64     `dorm:"type:bigint;not null;default:0;comment:团队运行"`
	FlowRunID   uint64     `dorm:"type:bigint;not null;default:0;comment:工作流运行"`
	RequestID   string     `dorm:"type:varchar(96);not null;default:'';comment:请求标识"`
	StartNodeID string     `dorm:"type:varchar(128);not null;default:'';comment:开始节点"`
	SingleNode  int16      `dorm:"type:smallint;not null;default:0;comment:单节点执行"`
	Status      string     `dorm:"type:varchar(32);not null;default:'pending';comment:状态"`
	Executed    int        `dorm:"type:int;not null;default:0;comment:已执行节点数"`
	Total       int        `dorm:"type:int;not null;default:0;comment:计划节点数"`
	Input       string     `dorm:"type:text;not null;default:'{}';comment:输入"`
	Output      string     `dorm:"type:text;not null;default:'{}';comment:输出"`
	Plan        string     `dorm:"type:text;not null;default:'{}';comment:执行计划"`
	Error       string     `dorm:"type:text;not null;default:'';comment:错误"`
	StartedAt   *time.Time `dorm:"null;comment:开始时间"`
	FinishedAt  *time.Time `dorm:"null;comment:结束时间"`
	CreatedAt   time.Time  `dorm:"comment:创建时间"`
	UpdatedAt   time.Time  `dorm:"comment:更新时间"`
}

type ExecutionIndex struct {
	ProjectRequest struct{} `unique:"project_id,request_id"`
	ProjectStatus  struct{} `index:"project_id,asset_cate_id,status,updated_at"`
	Run            struct{} `index:"run_id"`
	Request        struct{} `index:"request_id"`
}

func NewExecutionModel() *orm.Model[Execution] {
	return orm.LoadModel[Execution]("工作台画布执行", "bot_workspace_execution", orm.ModelConfig{
		Index:    ExecutionIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status": workspaceExecutionStatusOptions,
		},
		Relations: []orm.Relation{
			projectRelation,
			teamRelation,
			releaseRelation,
			runRelation,
			flowRunRelation,
		},
	})
}
