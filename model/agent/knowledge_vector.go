package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type KnowledgeVector struct {
	ID              uint64    `dorm:"primaryKey;autoIncrement;comment:向量记录ID"`
	KnowledgeBaseID uint64    `dorm:"type:bigint;not null;default:0;comment:知识库"`
	DocID           uint64    `dorm:"type:bigint;not null;default:0;comment:文档"`
	NodeID          uint64    `dorm:"type:bigint;not null;default:0;comment:节点"`
	Collection      string    `dorm:"type:varchar(128);not null;default:'';comment:集合"`
	PointID         string    `dorm:"type:varchar(128);not null;default:'';comment:向量点ID"`
	ContentHash     string    `dorm:"type:varchar(64);not null;default:'';comment:内容哈希"`
	IndexVersion    int       `dorm:"type:int;not null;default:1;comment:索引版本"`
	Status          int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	ErrorMessage    string    `dorm:"type:text;not null;default:'';comment:错误信息"`
	CreatedAt       time.Time `dorm:"comment:创建时间"`
}

type KnowledgeVectorIndex struct {
	BaseStatus  struct{} `index:"knowledge_base_id,status,id"`
	BaseVersion struct{} `index:"knowledge_base_id,index_version,status,id"`
	DocStatus   struct{} `index:"doc_id,status,id"`
	DocVersion  struct{} `index:"doc_id,index_version,status,id"`
	NodeStatus  struct{} `index:"node_id,status,id"`
	Point       struct{} `index:"collection,point_id"`
}

func NewKnowledgeVectorModel() *orm.Model[KnowledgeVector] {
	return orm.LoadModel[KnowledgeVector]("知识向量", "bot_knowledge_vector", orm.ModelConfig{
		Index:    KnowledgeVectorIndex{},
		Order:    "id desc",
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
