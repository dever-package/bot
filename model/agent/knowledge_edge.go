package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	KnowledgeEdgeTypeContains   = "contains"
	KnowledgeEdgeTypeReferences = "references"
	KnowledgeEdgeTypeMentions   = "mentions"
	KnowledgeEdgeTypeDefines    = "defines"
	KnowledgeEdgeTypeDependsOn  = "depends_on"
	KnowledgeEdgeTypeSimilar    = "similar"
	KnowledgeEdgeTypeEvidence   = "evidence"
	KnowledgeEdgeTypeAsset      = "asset"
	KnowledgeEdgeTypeConcept    = "concept"
)

type KnowledgeEdge struct {
	ID              uint64    `dorm:"primaryKey;autoIncrement;comment:关系ID"`
	KnowledgeBaseID uint64    `dorm:"type:bigint;not null;default:0;comment:知识库"`
	FromNodeID      uint64    `dorm:"type:bigint;not null;default:0;comment:起始节点"`
	ToNodeID        uint64    `dorm:"type:bigint;not null;default:0;comment:目标节点"`
	DocID           uint64    `dorm:"type:bigint;not null;default:0;comment:文档"`
	EdgeType        string    `dorm:"type:varchar(64);not null;default:'';comment:关系类型"`
	Label           string    `dorm:"type:varchar(128);not null;default:'';comment:关系名称"`
	Summary         string    `dorm:"type:text;not null;default:'';comment:说明"`
	Evidence        string    `dorm:"type:text;not null;default:'';comment:证据"`
	Weight          float64   `dorm:"type:double precision;not null;default:0;comment:权重"`
	Confidence      float64   `dorm:"type:double precision;not null;default:0;comment:置信度"`
	Metadata        string    `dorm:"type:text;not null;default:'';comment:元数据JSON"`
	Status          int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt       time.Time `dorm:"comment:创建时间"`
}

type KnowledgeEdgeIndex struct {
	BaseStatus struct{} `index:"knowledge_base_id,status,id"`
	FromNode   struct{} `index:"from_node_id,status,id"`
	ToNode     struct{} `index:"to_node_id,status,id"`
	BaseType   struct{} `index:"knowledge_base_id,edge_type,status"`
	DocType    struct{} `index:"doc_id,edge_type,status"`
}

func NewKnowledgeEdgeModel() *orm.Model[KnowledgeEdge] {
	return orm.LoadModel[KnowledgeEdge]("知识关系边", "bot_knowledge_edge", orm.ModelConfig{
		Index:    KnowledgeEdgeIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status":    statusOptions,
			"edge_type": knowledgeEdgeTypeOptions,
		},
		Relations: []orm.Relation{
			knowledgeBaseRelation,
			knowledgeDocModelRelation,
		},
	})
}
