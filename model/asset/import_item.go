package asset

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	ImportItemStatusPending = "pending"
	ImportItemStatusRunning = "running"
	ImportItemStatusSuccess = "success"
	ImportItemStatusSkipped = "skipped"
	ImportItemStatusFailed  = "failed"
)

var importItemStatusOptions = []map[string]any{
	{"id": ImportItemStatusPending, "value": "等待中"},
	{"id": ImportItemStatusRunning, "value": "导入中"},
	{"id": ImportItemStatusSuccess, "value": "成功"},
	{"id": ImportItemStatusSkipped, "value": "已存在"},
	{"id": ImportItemStatusFailed, "value": "失败"},
}

type ImportItem struct {
	ID             uint64     `dorm:"primaryKey;autoIncrement;comment:导入明细ID"`
	TaskID         uint64     `dorm:"type:bigint;not null;default:0;comment:导入任务ID"`
	Platform       string     `dorm:"type:varchar(32);not null;comment:内容平台"`
	ExternalID     string     `dorm:"type:varchar(255);not null;default:'';comment:平台内容ID"`
	SourceURL      string     `dorm:"type:text;not null;comment:规范来源地址"`
	DedupeKey      string     `dorm:"type:varchar(64);not null;comment:稳定去重键"`
	ContentType    string     `dorm:"type:varchar(32);not null;default:'';comment:内容类型"`
	Title          string     `dorm:"type:varchar(255);not null;default:'';comment:内容标题"`
	Status         string     `dorm:"type:varchar(32);not null;default:pending;comment:明细状态"`
	Stage          string     `dorm:"type:varchar(32);not null;default:pending;comment:执行阶段"`
	StageMessage   string     `dorm:"type:varchar(255);not null;default:'';comment:阶段说明"`
	Progress       int        `dorm:"type:int;not null;default:0;comment:明细进度"`
	AssetID        uint64     `dorm:"type:bigint;not null;default:0;comment:素材ID"`
	ResultJSON     string     `dorm:"type:text;not null;comment:结果摘要"`
	WarningsJSON   string     `dorm:"type:text;not null;comment:警告列表"`
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

type ImportItemIndex struct {
	TaskDedupe  struct{} `unique:"task_id,dedupe_key"`
	TaskStatus  struct{} `index:"task_id,status,id"`
	StatusQueue struct{} `index:"status,available_at,id"`
	StatusLease struct{} `index:"status,lease_expires_at,id"`
	Asset       struct{} `index:"asset_id"`
}

func NewImportItemModel() *orm.Model[ImportItem] {
	return orm.LoadModel[ImportItem]("素材导入明细", "bot_asset_import_item", orm.ModelConfig{
		Index:    ImportItemIndex{},
		Order:    "id asc",
		Database: "default",
		Options: map[string]any{
			"status": importItemStatusOptions,
		},
	})
}

func IsImportItemTerminal(status string) bool {
	switch status {
	case ImportItemStatusSuccess, ImportItemStatusSkipped, ImportItemStatusFailed:
		return true
	default:
		return false
	}
}

func IsImportItemRunnable(item ImportItem, now time.Time) bool {
	if !item.AvailableAt.IsZero() && item.AvailableAt.After(now) {
		return false
	}
	switch item.Status {
	case ImportItemStatusPending:
		return true
	case ImportItemStatusRunning:
		return item.LeaseExpiresAt == nil || !item.LeaseExpiresAt.After(now)
	default:
		return false
	}
}
