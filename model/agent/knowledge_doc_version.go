package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type KnowledgeDocVersion struct {
	ID              uint64    `dorm:"primaryKey;autoIncrement;comment:版本ID"`
	KnowledgeBaseID uint64    `dorm:"type:bigint;not null;default:0;comment:知识库"`
	DocID           uint64    `dorm:"type:bigint;not null;default:0;comment:文档"`
	Version         int       `dorm:"type:int;not null;default:1;comment:版本号"`
	Title           string    `dorm:"type:varchar(255);not null;comment:标题"`
	FileName        string    `dorm:"type:varchar(255);not null;default:'';comment:文件名"`
	StoragePath     string    `dorm:"type:varchar(1024);not null;default:'';comment:存储路径"`
	MimeType        string    `dorm:"type:varchar(128);not null;default:'';comment:MIME类型"`
	Content         string    `dorm:"type:text;not null;default:'';comment:历史内容"`
	Summary         string    `dorm:"type:text;not null;default:'';comment:历史摘要"`
	Keywords        string    `dorm:"type:text;not null;default:'';comment:历史关键词"`
	NodeCount       int       `dorm:"type:int;not null;default:0;comment:节点数"`
	ContentHash     string    `dorm:"type:varchar(64);not null;default:'';comment:内容哈希"`
	Size            int64     `dorm:"type:bigint;not null;default:0;comment:文件大小"`
	ChangeLog       string    `dorm:"type:text;not null;default:'';comment:变更说明"`
	Status          int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt       time.Time `dorm:"comment:创建时间"`
}

type KnowledgeDocVersionIndex struct {
	DocVersion struct{} `unique:"doc_id,version"`
	BaseDoc    struct{} `index:"knowledge_base_id,doc_id,status,version"`
}

func NewKnowledgeDocVersionModel() *orm.Model[KnowledgeDocVersion] {
	return orm.LoadModel[KnowledgeDocVersion]("文档版本", "bot_knowledge_doc_version", orm.ModelConfig{
		Index:    KnowledgeDocVersionIndex{},
		Order:    "version desc, id desc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			knowledgeBaseRelation,
			knowledgeDocModelRelation,
		},
	})
}
