package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type KnowledgeDoc struct {
	ID              uint64    `dorm:"primaryKey;autoIncrement;comment:文档ID"`
	KnowledgeBaseID uint64    `dorm:"type:bigint;not null;default:0;comment:知识库"`
	DirID           uint64    `dorm:"type:bigint;not null;default:0;comment:目录"`
	Title           string    `dorm:"type:varchar(255);not null;comment:标题"`
	FileName        string    `dorm:"type:varchar(255);not null;default:'';comment:文件名"`
	StoragePath     string    `dorm:"type:varchar(1024);not null;default:'';comment:存储路径"`
	MimeType        string    `dorm:"type:varchar(128);not null;default:'';comment:MIME类型"`
	Size            int64     `dorm:"type:bigint;not null;default:0;comment:文件大小"`
	Content         string    `dorm:"type:text;not null;default:'';comment:内容"`
	ContentHash     string    `dorm:"type:varchar(64);not null;default:'';comment:内容哈希"`
	ChunkCount      int       `dorm:"type:int;not null;default:0;comment:分段数"`
	IndexStatus     string    `dorm:"type:varchar(32);not null;default:'pending';comment:索引状态"`
	ErrorMessage    string    `dorm:"type:text;not null;default:'';comment:错误信息"`
	Status          int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt       time.Time `dorm:"comment:创建时间"`
}

type KnowledgeDocIndex struct {
	BaseDirTitle struct{} `unique:"knowledge_base_id,dir_id,title"`
	BaseStatus   struct{} `index:"knowledge_base_id,status,id"`
	BaseDir      struct{} `index:"knowledge_base_id,dir_id,status,id"`
	BaseIndex    struct{} `index:"knowledge_base_id,index_status,id"`
	StoragePath  struct{} `index:"knowledge_base_id,storage_path"`
	ContentHash  struct{} `index:"knowledge_base_id,content_hash"`
}

var knowledgeBaseRelation = orm.Relation{
	Field:      "knowledge_base_id",
	Option:     "bot.agent.NewKnowledgeBaseModel",
	OptionKeys: []string{"name", "cate_id"},
}

var knowledgeDirRelation = orm.Relation{
	Field:      "dir_id",
	Option:     "bot.agent.NewKnowledgeDirModel",
	OptionKeys: []string{"name", "path"},
}

func NewKnowledgeDocModel() *orm.Model[KnowledgeDoc] {
	return orm.LoadModel[KnowledgeDoc]("知识文档", "bot_knowledge_doc", orm.ModelConfig{
		Index:    KnowledgeDocIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status":       statusOptions,
			"index_status": knowledgeIndexStatusOptions,
		},
		Relations: []orm.Relation{
			knowledgeBaseRelation,
			knowledgeDirRelation,
		},
	})
}
