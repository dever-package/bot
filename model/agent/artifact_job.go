package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	ArtifactJobStatusPending  = "pending"
	ArtifactJobStatusRunning  = "running"
	ArtifactJobStatusSuccess  = "success"
	ArtifactJobStatusFailed   = "failed"
	ArtifactJobStatusCanceled = "canceled"
)

var artifactJobStatusOptions = []map[string]any{
	{"id": ArtifactJobStatusPending, "value": "等待中"},
	{"id": ArtifactJobStatusRunning, "value": "运行中"},
	{"id": ArtifactJobStatusSuccess, "value": "成功"},
	{"id": ArtifactJobStatusFailed, "value": "失败"},
	{"id": ArtifactJobStatusCanceled, "value": "已取消"},
}

type ArtifactJob struct {
	ID             uint64     `dorm:"primaryKey;autoIncrement;comment:素材任务ID"`
	RequestID      string     `dorm:"type:varchar(128);not null;default:'';comment:请求ID"`
	DocumentID     uint64     `dorm:"type:bigint;not null;default:0;comment:文档"`
	BlockID        uint64     `dorm:"type:bigint;not null;default:0;comment:内容块"`
	SessionID      uint64     `dorm:"type:bigint;not null;default:0;comment:会话"`
	MessageID      uint64     `dorm:"type:bigint;not null;default:0;comment:消息"`
	RunID          uint64     `dorm:"type:bigint;not null;default:0;comment:运行"`
	ToolCallID     string     `dorm:"type:varchar(160);not null;default:'';comment:工具调用ID"`
	ToolName       string     `dorm:"type:varchar(160);not null;default:'';comment:工具名称"`
	ToolKind       string     `dorm:"type:varchar(32);not null;default:file;comment:工具素材类型"`
	Arguments      string     `dorm:"type:text;not null;default:'{}';comment:调用参数"`
	Snapshot       string     `dorm:"type:text;not null;default:'{}';comment:工具快照"`
	Status         string     `dorm:"type:varchar(32);not null;default:pending;comment:状态"`
	Attempt        int        `dorm:"type:int;not null;default:0;comment:执行次数"`
	Version        int        `dorm:"type:int;not null;default:1;comment:调度版本"`
	WorkerID       string     `dorm:"type:varchar(128);not null;default:'';comment:执行者"`
	AvailableAt    time.Time  `dorm:"type:timestamp;not null;default:CURRENT_TIMESTAMP;comment:下次可执行时间"`
	LeaseExpiresAt *time.Time `dorm:"null;comment:租约过期时间"`
	HeartbeatAt    *time.Time `dorm:"null;comment:心跳时间"`
	Error          string     `dorm:"type:text;not null;default:'';comment:错误信息"`
	CreatedAt      time.Time  `dorm:"comment:创建时间"`
	UpdatedAt      time.Time  `dorm:"comment:更新时间"`
	StartedAt      *time.Time `dorm:"null;comment:开始时间"`
	FinishedAt     *time.Time `dorm:"null;comment:结束时间"`
}

type ArtifactJobIndex struct {
	RequestID      struct{} `unique:"request_id"`
	RunToolCall    struct{} `unique:"run_id,tool_call_id"`
	DocumentStatus struct{} `index:"document_id,status,id"`
	BlockID        struct{} `index:"block_id,id"`
	StatusQueue    struct{} `index:"status,available_at,id"`
	StatusLease    struct{} `index:"status,lease_expires_at,id"`
	WorkerStatus   struct{} `index:"worker_id,status"`
}

func NewArtifactJobModel() *orm.Model[ArtifactJob] {
	return orm.LoadModel[ArtifactJob]("智能体素材任务", "bot_agent_artifact_job", orm.ModelConfig{
		Index:    ArtifactJobIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status": artifactJobStatusOptions,
		},
	})
}
