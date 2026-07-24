package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	DocumentStatusWriting       = "writing"
	DocumentStatusGenerating    = "generating"
	DocumentStatusReady         = "ready"
	DocumentStatusPartialFailed = "partial_failed"
	DocumentStatusFailed        = "failed"
)

var documentStatusOptions = []map[string]any{
	{"id": DocumentStatusWriting, "value": "写作中"},
	{"id": DocumentStatusGenerating, "value": "素材生成中"},
	{"id": DocumentStatusReady, "value": "已完成"},
	{"id": DocumentStatusPartialFailed, "value": "部分失败"},
	{"id": DocumentStatusFailed, "value": "生成失败"},
}

type Document struct {
	ID              uint64     `dorm:"primaryKey;autoIncrement;comment:文档ID"`
	SessionID       uint64     `dorm:"type:bigint;not null;default:0;comment:会话"`
	MessageID       uint64     `dorm:"type:bigint;not null;default:0;comment:消息"`
	RunID           uint64     `dorm:"type:bigint;not null;default:0;comment:运行"`
	Title           string     `dorm:"type:varchar(255);not null;default:'';comment:标题"`
	Status          string     `dorm:"type:varchar(32);not null;default:writing;comment:状态"`
	BlockCount      int        `dorm:"type:int;not null;default:0;comment:内容块数"`
	PendingJobCount int        `dorm:"type:int;not null;default:0;comment:待完成素材任务数"`
	Meta            string     `dorm:"type:text;not null;default:'{}';comment:扩展信息"`
	CreatedAt       time.Time  `dorm:"comment:创建时间"`
	UpdatedAt       time.Time  `dorm:"comment:更新时间"`
	CompletedAt     *time.Time `dorm:"null;comment:完成时间"`
}

type DocumentIndex struct {
	MessageID     struct{} `unique:"message_id"`
	SessionID     struct{} `index:"session_id,id"`
	RunID         struct{} `index:"run_id,id"`
	StatusUpdated struct{} `index:"status,updated_at,id"`
}

func NewDocumentModel() *orm.Model[Document] {
	return orm.LoadModel[Document]("智能体文档", "bot_agent_document", orm.ModelConfig{
		Index:    DocumentIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status": documentStatusOptions,
		},
	})
}
