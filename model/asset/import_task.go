package asset

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	ImportTaskModeSingle    = "single"
	ImportTaskModeBatch     = "batch"
	ImportTaskPlatformMixed = "mixed"

	ImportTargetContent  = "content"
	ImportTargetAccount  = "account"
	ImportTargetPlaylist = "playlist"

	ImportTaskStatusPending     = "pending"
	ImportTaskStatusDiscovering = "discovering"
	ImportTaskStatusRunning     = "running"
	ImportTaskStatusSuccess     = "success"
	ImportTaskStatusPartial     = "partial"
	ImportTaskStatusFailed      = "failed"
)

var importTaskStatusOptions = []map[string]any{
	{"id": ImportTaskStatusPending, "value": "等待中"},
	{"id": ImportTaskStatusDiscovering, "value": "发现内容"},
	{"id": ImportTaskStatusRunning, "value": "导入中"},
	{"id": ImportTaskStatusSuccess, "value": "成功"},
	{"id": ImportTaskStatusPartial, "value": "部分成功"},
	{"id": ImportTaskStatusFailed, "value": "失败"},
}

type ImportTask struct {
	ID             uint64     `dorm:"primaryKey;autoIncrement;comment:导入任务ID"`
	UserID         uint64     `dorm:"type:bigint;not null;default:0;comment:用户ID"`
	TeamID         uint64     `dorm:"type:bigint;not null;default:0;comment:团队ID"`
	ProjectID      uint64     `dorm:"type:bigint;not null;default:0;comment:项目ID"`
	BodyID         uint64     `dorm:"type:bigint;not null;default:0;comment:载体ID"`
	ReleaseID      uint64     `dorm:"type:bigint;not null;default:0;comment:发布版本ID"`
	ProviderID     uint64     `dorm:"type:bigint;not null;default:0;comment:来源ID"`
	AccountID      uint64     `dorm:"type:bigint;not null;default:0;comment:来源账号ID"`
	RequestID      string     `dorm:"type:varchar(64);not null;comment:幂等请求ID"`
	Mode           string     `dorm:"type:varchar(16);not null;default:single;comment:导入模式"`
	TargetType     string     `dorm:"type:varchar(16);not null;default:content;comment:导入目标"`
	Platform       string     `dorm:"type:varchar(32);not null;comment:内容平台"`
	Source         string     `dorm:"type:text;not null;comment:导入来源"`
	OptionsJSON    string     `dorm:"type:text;not null;comment:导入选项"`
	CursorJSON     string     `dorm:"type:text;not null;comment:发现断点"`
	Status         string     `dorm:"type:varchar(32);not null;default:pending;comment:任务状态"`
	Stage          string     `dorm:"type:varchar(32);not null;default:pending;comment:执行阶段"`
	StageMessage   string     `dorm:"type:varchar(255);not null;default:'';comment:阶段说明"`
	Progress       int        `dorm:"type:int;not null;default:0;comment:任务进度"`
	ItemTotal      int        `dorm:"type:int;not null;default:0;comment:明细总数"`
	SuccessCount   int        `dorm:"type:int;not null;default:0;comment:成功数"`
	SkippedCount   int        `dorm:"type:int;not null;default:0;comment:跳过数"`
	FailedCount    int        `dorm:"type:int;not null;default:0;comment:失败数"`
	CollectionID   uint64     `dorm:"type:bigint;not null;default:0;comment:素材集合ID"`
	ErrorMessage   string     `dorm:"type:text;not null;comment:失败说明"`
	WorkerID       string     `dorm:"type:varchar(128);not null;default:'';comment:执行者"`
	Attempt        int        `dorm:"type:int;not null;default:0;comment:执行次数"`
	Version        int        `dorm:"type:int;not null;default:1;comment:调度版本"`
	AvailableAt    time.Time  `dorm:"type:timestamp;not null;default:CURRENT_TIMESTAMP;comment:下次执行时间"`
	LeaseExpiresAt *time.Time `dorm:"null;comment:租约过期时间"`
	HeartbeatAt    *time.Time `dorm:"null;comment:心跳时间"`
	StartedAt      *time.Time `dorm:"null;comment:开始时间"`
	FinishedAt     *time.Time `dorm:"null;comment:结束时间"`
	CreatedAt      time.Time  `dorm:"comment:创建时间"`
	UpdatedAt      time.Time  `dorm:"comment:更新时间"`
}

type ImportTaskIndex struct {
	RequestID     struct{} `unique:"request_id"`
	ScopeStatus   struct{} `index:"user_id,team_id,project_id,body_id,status,created_at"`
	StatusQueue   struct{} `index:"status,available_at,id"`
	StatusLease   struct{} `index:"status,lease_expires_at,id"`
	AccountStatus struct{} `index:"platform,account_id,status,id"`
}

func NewImportTaskModel() *orm.Model[ImportTask] {
	return orm.LoadModel[ImportTask]("素材导入任务", "bot_asset_import_task", orm.ModelConfig{
		Index:    ImportTaskIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status": importTaskStatusOptions,
		},
	})
}

func IsImportTaskTerminal(status string) bool {
	switch status {
	case ImportTaskStatusSuccess, ImportTaskStatusPartial, ImportTaskStatusFailed:
		return true
	default:
		return false
	}
}

func IsImportTaskRunnable(task ImportTask, now time.Time) bool {
	if !task.AvailableAt.IsZero() && task.AvailableAt.After(now) {
		return false
	}
	switch task.Status {
	case ImportTaskStatusPending:
		return true
	case ImportTaskStatusRunning:
		return task.LeaseExpiresAt == nil || !task.LeaseExpiresAt.After(now)
	default:
		return false
	}
}
