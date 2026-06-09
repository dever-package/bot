package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type KnowledgeChunk struct {
	ID              uint64    `dorm:"primaryKey;autoIncrement;comment:分段ID"`
	KnowledgeBaseID uint64    `dorm:"type:bigint;not null;default:0;comment:知识库"`
	DirID           uint64    `dorm:"type:bigint;not null;default:0;comment:目录"`
	DirPath         string    `dorm:"type:varchar(512);not null;default:'';comment:目录路径"`
	DocID           uint64    `dorm:"type:bigint;not null;default:0;comment:文档"`
	ChunkIndex      int       `dorm:"type:int;not null;default:0;comment:分段序号"`
	Title           string    `dorm:"type:varchar(255);not null;default:'';comment:标题"`
	Content         string    `dorm:"type:text;not null;default:'';comment:内容"`
	ContentHash     string    `dorm:"type:varchar(64);not null;default:'';comment:内容哈希"`
	PointID         string    `dorm:"type:varchar(128);not null;default:'';comment:向量点ID"`
	IndexStatus     string    `dorm:"type:varchar(32);not null;default:'pending';comment:索引状态"`
	ErrorMessage    string    `dorm:"type:text;not null;default:'';comment:错误信息"`
	Status          int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt       time.Time `dorm:"comment:创建时间"`
}

type KnowledgeChunkIndex struct {
	DocIndex      struct{} `unique:"doc_id,chunk_index"`
	BaseStatus    struct{} `index:"knowledge_base_id,status,id"`
	BaseDirStatus struct{} `index:"knowledge_base_id,dir_id,status,id"`
	DocStatus     struct{} `index:"doc_id,status,id"`
	BaseIndex     struct{} `index:"knowledge_base_id,index_status,id"`
	BaseDirIndex  struct{} `index:"knowledge_base_id,dir_id,index_status,id"`
	PointID       struct{} `index:"point_id"`
	ContentHash   struct{} `index:"knowledge_base_id,content_hash"`
}

var knowledgeDocModelRelation = orm.Relation{
	Field:      "doc_id",
	Option:     "bot.agent.NewKnowledgeDocModel",
	OptionKeys: []string{"title", "knowledge_base_id"},
}

func NewKnowledgeChunkModel() *orm.Model[KnowledgeChunk] {
	return orm.LoadModel[KnowledgeChunk]("知识分段", "bot_knowledge_chunk", orm.ModelConfig{
		Index:    KnowledgeChunkIndex{},
		Order:    "doc_id asc,chunk_index asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status":       statusOptions,
			"index_status": knowledgeIndexStatusOptions,
		},
		Relations: []orm.Relation{
			knowledgeBaseRelation,
			knowledgeDirRelation,
			knowledgeDocModelRelation,
		},
	})
}
