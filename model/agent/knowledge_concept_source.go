package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

// KnowledgeConceptSource 记录共享概念节点对应的文档证据。
type KnowledgeConceptSource struct {
	ID              uint64    `dorm:"primaryKey;autoIncrement;comment:概念来源ID"`
	KnowledgeBaseID uint64    `dorm:"type:bigint;not null;default:0;comment:知识库"`
	ConceptNodeID   uint64    `dorm:"type:bigint;not null;default:0;comment:概念节点"`
	DocID           uint64    `dorm:"type:bigint;not null;default:0;comment:来源文档"`
	SourceNodeID    uint64    `dorm:"type:bigint;not null;default:0;comment:来源节点"`
	Description     string    `dorm:"type:text;not null;default:'';comment:概念说明"`
	Evidence        string    `dorm:"type:text;not null;default:'';comment:来源证据"`
	Keywords        string    `dorm:"type:text;not null;default:'';comment:来源关键词"`
	Confidence      float64   `dorm:"type:double precision;not null;default:0;comment:置信度"`
	Status          int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt       time.Time `dorm:"comment:创建时间"`
}

type KnowledgeConceptSourceIndex struct {
	ConceptDocNode struct{} `unique:"concept_node_id,doc_id,source_node_id"`
	BaseConcept    struct{} `index:"knowledge_base_id,concept_node_id,status,id"`
	DocStatus      struct{} `index:"doc_id,status,id"`
	SourceNode     struct{} `index:"source_node_id,status,id"`
}

func NewKnowledgeConceptSourceModel() *orm.Model[KnowledgeConceptSource] {
	return orm.LoadModel[KnowledgeConceptSource]("概念来源", "bot_knowledge_concept_source", orm.ModelConfig{
		Index:    KnowledgeConceptSourceIndex{},
		Order:    "confidence desc,id desc",
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
