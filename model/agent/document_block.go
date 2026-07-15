package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	DocumentBlockTypeText  = "text"
	DocumentBlockTypeMedia = "media"

	DocumentBlockStatusGenerating = "generating"
	DocumentBlockStatusReady      = "ready"
	DocumentBlockStatusFailed     = "failed"
)

type DocumentBlock struct {
	ID         uint64    `dorm:"primaryKey;autoIncrement;comment:内容块ID"`
	DocumentID uint64    `dorm:"type:bigint;not null;default:0;comment:文档"`
	MessageID  uint64    `dorm:"type:bigint;not null;default:0;comment:消息"`
	RunID      uint64    `dorm:"type:bigint;not null;default:0;comment:运行"`
	SourceKey  string    `dorm:"type:varchar(160);not null;default:'';comment:幂等来源"`
	Seq        int       `dorm:"type:int;not null;default:1;comment:顺序"`
	Type       string    `dorm:"type:varchar(32);not null;default:text;comment:内容类型"`
	Format     string    `dorm:"type:varchar(32);not null;default:markdown;comment:内容格式"`
	MediaKind  string    `dorm:"type:varchar(32);not null;default:'';comment:素材类型"`
	Text       string    `dorm:"type:text;not null;default:'';comment:文本内容"`
	Status     string    `dorm:"type:varchar(32);not null;default:ready;comment:状态"`
	Meta       string    `dorm:"type:text;not null;default:'{}';comment:扩展信息"`
	CreatedAt  time.Time `dorm:"comment:创建时间"`
	UpdatedAt  time.Time `dorm:"comment:更新时间"`
}

type DocumentBlockIndex struct {
	DocumentSource struct{} `unique:"document_id,source_key"`
	DocumentSeq    struct{} `unique:"document_id,seq"`
	MessageSeq     struct{} `index:"message_id,seq"`
	RunSeq         struct{} `index:"run_id,seq"`
	Status         struct{} `index:"document_id,status,id"`
}

func NewDocumentBlockModel() *orm.Model[DocumentBlock] {
	return orm.LoadModel[DocumentBlock]("智能体文档内容块", "bot_agent_document_block", orm.ModelConfig{
		Index:    DocumentBlockIndex{},
		Order:    "document_id desc,seq asc",
		Database: "default",
	})
}
