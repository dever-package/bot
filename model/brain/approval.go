package brain

import (
	"time"

	"github.com/shemic/dever/orm"
)

var approvalDecisionOptions = []map[string]any{
	{"id": "pending", "value": "待确认"},
	{"id": "approved", "value": "确认"},
	{"id": "rejected", "value": "驳回"},
}

type Approval struct {
	ID         uint64    `dorm:"primaryKey;autoIncrement;comment:确认ID"`
	RunID      uint64    `dorm:"type:bigint;not null;default:0;comment:大脑运行"`
	ThinkRunID uint64    `dorm:"type:bigint;not null;default:0;comment:思维运行"`
	NodeRunID  uint64    `dorm:"type:bigint;not null;default:0;comment:节点运行"`
	BrainID    uint64    `dorm:"type:bigint;not null;default:0;comment:大脑"`
	ThinkID    uint64    `dorm:"type:bigint;not null;default:0;comment:思维"`
	NodeID     uint64    `dorm:"type:bigint;not null;default:0;comment:节点"`
	Title      string    `dorm:"type:varchar(128);not null;default:'';comment:标题"`
	Content    string    `dorm:"type:text;not null;default:'{}';comment:待确认内容"`
	Comment    string    `dorm:"type:text;not null;default:'';comment:修改意见"`
	Decision   string    `dorm:"type:varchar(32);not null;default:'pending';comment:结果"`
	Status     string    `dorm:"type:varchar(32);not null;default:'pending';comment:状态"`
	CreatedAt  time.Time `dorm:"comment:创建时间"`
	UpdatedAt  time.Time `dorm:"comment:更新时间"`
}

type ApprovalIndex struct {
	RunStatus     struct{} `index:"run_id,status"`
	ThinkRun      struct{} `index:"think_run_id,status"`
	NodeRunStatus struct{} `index:"node_run_id,status"`
	BrainStatus   struct{} `index:"brain_id,status,created_at"`
}

func NewApprovalModel() *orm.Model[Approval] {
	return orm.LoadModel[Approval]("人工确认", "bot_brain_approval", orm.ModelConfig{
		Index:    ApprovalIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status":   runStatusOptions,
			"decision": approvalDecisionOptions,
		},
		Relations: []orm.Relation{
			runRelation,
			thinkRunRelation,
			nodeRunRelation,
			brainRelation,
			thinkRelation,
			runNodeRelation,
		},
	})
}
