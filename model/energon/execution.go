package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

// Execution owns a source invocation receipt; business runs reference it.
type Execution struct {
	ID              uint64     `dorm:"primaryKey;autoIncrement;comment:来源执行ID"`
	RequestID       string     `dorm:"type:varchar(96);not null;comment:调用ID"`
	RootRequestID   string     `dorm:"type:varchar(96);not null;default:'';comment:根调用ID"`
	Checkpoint      string     `dorm:"type:text;not null;default:'{}';comment:执行回执"`
	Request         string     `dorm:"type:text;not null;default:'{}';comment:调用快照"`
	RunID           uint64     `dorm:"type:bigint;not null;default:0;comment:业务运行"`
	NodeRunID       uint64     `dorm:"type:bigint;not null;default:0;comment:业务节点运行"`
	UserID          uint64     `dorm:"type:bigint;not null;default:0;comment:用户"`
	AdminID         uint64     `dorm:"type:bigint;not null;default:0;comment:后台账号"`
	ProviderID      uint64     `dorm:"type:bigint;not null;default:0;comment:来源"`
	AccountID       uint64     `dorm:"type:bigint;not null;default:0;comment:来源账号"`
	ServiceID       uint64     `dorm:"type:bigint;not null;default:0;comment:来源服务"`
	RemoteTaskID    string     `dorm:"type:varchar(256);not null;default:'';comment:远端任务号"`
	LastError       string     `dorm:"type:text;not null;default:'';comment:最近错误"`
	TaskOutstanding bool       `dorm:"not null;default:false;comment:远端任务尚未确认结束"`
	RemoteTerminal  bool       `dorm:"not null;default:false;comment:已确认远端结束"`
	CancelRequested bool       `dorm:"not null;default:false;comment:已请求停止"`
	QueuePosition   int        `dorm:"not null;default:0;comment:排队位置"`
	Phase           string     `dorm:"type:varchar(32);not null;default:prepared;comment:调度阶段"`
	Owner           string     `dorm:"type:varchar(128);not null;default:'';comment:执行者"`
	Version         int64      `dorm:"type:bigint;not null;default:0;comment:执行版本"`
	ExpiresAt       *time.Time `dorm:"null;comment:执行租约期限"`
	QueuedAt        *time.Time `dorm:"null;comment:入队时间"`
	UpdatedAt       time.Time  `dorm:"comment:更新时间"`
	CreatedAt       time.Time  `dorm:"comment:创建时间"`
}

type ExecutionIndex struct {
	Request struct{} `unique:"request_id"`
	Recover struct{} `index:"phase,expires_at,id"`
	Root    struct{} `index:"root_request_id,id"`
	Parent  struct{} `index:"run_id,node_run_id,id"`
	Source  struct{} `index:"provider_id,account_id,service_id,phase"`
}

func NewExecutionModel() *orm.Model[Execution] {
	return orm.LoadModel[Execution]("来源调用", "bot_energon_execution", orm.ModelConfig{
		Database: "default", Index: ExecutionIndex{}, Order: "id desc",
		Fields: map[string]orm.FieldConfig{"checkpoint": {Type: orm.FieldTypeHidden}, "request": {Type: orm.FieldTypeHidden}, "owner": {Type: orm.FieldTypeHidden}},
		Relations: []orm.Relation{
			{Field: "provider_id", Option: "bot.energon.NewProviderModel", OptionKeys: []string{"name"}},
			{Field: "account_id", Option: "bot.energon.NewAccountModel", OptionKeys: []string{"name"}},
			{Field: "service_id", Option: "bot.energon.NewServiceModel", OptionKeys: []string{"name"}},
		},
		Options: map[string]any{"phase": []map[string]any{
			{"id": "prepared", "value": "已登记"}, {"id": "queued", "value": "等待账号名额"},
			{"id": "running", "value": "执行中"}, {"id": "submitted", "value": "远端执行中"},
			{"id": "fetching", "value": "获取结果"}, {"id": "succeeded", "value": "已完成"},
			{"id": "failed", "value": "失败"}, {"id": "canceled", "value": "已取消"},
			{"id": "unknown", "value": "提交待确认"},
		}},
	})
}
