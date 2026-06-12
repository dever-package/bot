package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	KnowledgeNodeTypeRoot       = "root"
	KnowledgeNodeTypeDir        = "dir"
	KnowledgeNodeTypeDoc        = "doc"
	KnowledgeNodeTypePage       = "page"
	KnowledgeNodeTypeHeading    = "heading"
	KnowledgeNodeTypeParagraph  = "paragraph"
	KnowledgeNodeTypeTable      = "table"
	KnowledgeNodeTypeImage      = "image"
	KnowledgeNodeTypeCode       = "code"
	KnowledgeNodeTypeAttachment = "attachment"
	KnowledgeNodeTypeConcept    = "concept"
	KnowledgeNodeTypeQA         = "qa"
)

type KnowledgeNode struct {
	ID              uint64    `dorm:"primaryKey;autoIncrement;comment:节点ID"`
	KnowledgeBaseID uint64    `dorm:"type:bigint;not null;default:0;comment:知识库"`
	DirID           uint64    `dorm:"type:bigint;not null;default:0;comment:目录"`
	DocID           uint64    `dorm:"type:bigint;not null;default:0;comment:文档"`
	ParseID         uint64    `dorm:"type:bigint;not null;default:0;comment:解析记录"`
	ParentID        uint64    `dorm:"type:bigint;not null;default:0;comment:父节点"`
	NodeType        string    `dorm:"type:varchar(32);not null;default:'';comment:节点类型"`
	Title           string    `dorm:"type:varchar(255);not null;default:'';comment:标题"`
	Summary         string    `dorm:"type:text;not null;default:'';comment:摘要"`
	Content         string    `dorm:"type:text;not null;default:'';comment:内容"`
	PlainText       string    `dorm:"type:text;not null;default:'';comment:纯文本"`
	SearchText      string    `dorm:"type:text;not null;default:'';comment:检索文本"`
	Keywords        string    `dorm:"type:text;not null;default:'';comment:关键词"`
	Path            string    `dorm:"type:varchar(1024);not null;default:'';comment:节点路径"`
	NodeKey         string    `dorm:"type:varchar(255);not null;default:'';comment:节点标识"`
	Depth           int       `dorm:"type:int;not null;default:0;comment:层级"`
	Sort            int       `dorm:"type:int;not null;default:100;comment:排序"`
	PageStart       int       `dorm:"type:int;not null;default:0;comment:起始页"`
	PageEnd         int       `dorm:"type:int;not null;default:0;comment:结束页"`
	LineStart       int       `dorm:"type:int;not null;default:0;comment:起始行"`
	LineEnd         int       `dorm:"type:int;not null;default:0;comment:结束行"`
	Metadata        string    `dorm:"type:text;not null;default:'';comment:元数据JSON"`
	ContentHash     string    `dorm:"type:varchar(64);not null;default:'';comment:内容哈希"`
	IndexStatus     string    `dorm:"type:varchar(32);not null;default:'pending';comment:索引状态"`
	ErrorMessage    string    `dorm:"type:text;not null;default:'';comment:错误信息"`
	HitCount        int       `dorm:"type:int;not null;default:0;comment:命中次数"`
	Weight          float64   `dorm:"type:double precision;not null;default:0;comment:反馈权重"`
	Status          int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt       time.Time `dorm:"comment:创建时间"`
}

type KnowledgeNodeIndex struct {
	BaseStatus    struct{} `index:"knowledge_base_id,status,id"`
	BaseDoc       struct{} `index:"knowledge_base_id,doc_id,status,id"`
	BaseDir       struct{} `index:"knowledge_base_id,dir_id,status,id"`
	ParentSort    struct{} `index:"parent_id,status,sort,id"`
	DocParentSort struct{} `index:"doc_id,parent_id,status,sort,id"`
	BaseType      struct{} `index:"knowledge_base_id,node_type,status"`
	ContentHash   struct{} `index:"knowledge_base_id,content_hash"`
	NodeKey       struct{} `unique:"knowledge_base_id,doc_id,node_key"`
	IndexStatus   struct{} `index:"knowledge_base_id,index_status,status"`
}

func NewKnowledgeNodeModel() *orm.Model[KnowledgeNode] {
	return orm.LoadModel[KnowledgeNode]("知识节点", "bot_knowledge_node", orm.ModelConfig{
		Index:    KnowledgeNodeIndex{},
		Order:    "doc_id asc,sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status":       statusOptions,
			"index_status": knowledgeIndexStatusOptions,
			"node_type":    knowledgeNodeTypeOptions,
		},
		Relations: []orm.Relation{
			knowledgeBaseRelation,
			knowledgeDirRelation,
			knowledgeDocModelRelation,
		},
	})
}
