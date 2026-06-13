package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type KnowledgeBase struct {
	ID                  uint64    `dorm:"primaryKey;autoIncrement;comment:知识库ID"`
	CateID              uint64    `dorm:"type:bigint;not null;default:1;comment:知识库分类"`
	Name                string    `dorm:"type:varchar(128);not null;comment:名称"`
	ParserServiceID     uint64    `dorm:"type:bigint;not null;default:0;comment:文档解析服务"`
	IndexPowerID        uint64    `dorm:"type:bigint;not null;default:1;comment:索引模型"`
	ConceptGraphEnabled int16     `dorm:"type:smallint;not null;default:1;comment:开启概念图谱"`
	Collection          string    `dorm:"type:varchar(128);not null;default:'';comment:向量数据库集合"`
	EmbeddingPowerID    uint64    `dorm:"type:bigint;not null;default:0;comment:向量能力"`
	NodeMaxLength       int       `dorm:"type:int;not null;default:800;comment:节点最大长度"`
	NodeSplitOverlap    int       `dorm:"type:int;not null;default:120;comment:长节点拆分重叠"`
	RetrieveLimit       int       `dorm:"type:int;not null;default:5;comment:召回数量"`
	ScoreThreshold      float64   `dorm:"type:double precision;not null;default:0.35;comment:相似度阈值"`
	MaxContextChars     int       `dorm:"type:int;not null;default:6000;comment:最大注入字数"`
	GraphDepth          int       `dorm:"type:int;not null;default:1;comment:扩展层数"`
	DocCount            int       `dorm:"type:int;not null;default:0;comment:文档数"`
	NodeCount           int       `dorm:"type:int;not null;default:0;comment:节点数"`
	IndexStatus         string    `dorm:"type:varchar(32);not null;default:'pending';comment:索引状态"`
	ErrorMessage        string    `dorm:"type:text;not null;default:'';comment:错误信息"`
	Status              int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort                int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt           time.Time `dorm:"comment:创建时间"`
}

type KnowledgeBaseIndex struct {
	CateName       struct{} `unique:"cate_id,name"`
	CateStatusSort struct{} `index:"cate_id,status,sort,id"`
	ParserService  struct{} `index:"parser_service_id,status"`
	IndexPower     struct{} `index:"index_power_id,status"`
	EmbeddingPower struct{} `index:"embedding_power_id,status"`
	IndexStatus    struct{} `index:"index_status,status"`
	StatusSort     struct{} `index:"status,sort,id"`
}

var (
	knowledgeCateRelation = orm.Relation{
		Field:      "cate_id",
		Option:     "bot.agent.NewKnowledgeCateModel",
		OptionKeys: []string{"name"},
	}

	knowledgeParserServiceRelation = orm.Relation{
		Field:      "parser_service_id",
		Option:     "bot.agent.NewKnowledgeParserServiceModel",
		OptionKeys: []string{"name", "provider", "host"},
	}

	knowledgeEmbeddingPowerRelation = orm.Relation{
		Field:      "embedding_power_id",
		Option:     "bot.energon.NewPowerModel",
		OptionKeys: []string{"name", "key", "kind"},
	}

	knowledgeIndexPowerRelation = orm.Relation{
		Field:      "index_power_id",
		Option:     "bot.energon.NewPowerModel",
		OptionKeys: []string{"name", "key", "kind"},
	}

	knowledgeDocRelation = orm.Relation{
		Field:      "docs",
		Through:    "bot.agent.NewKnowledgeDocModel",
		OwnerField: "knowledge_base_id",
		Order:      "id desc",
	}
)

func NewKnowledgeBaseModel() *orm.Model[KnowledgeBase] {
	return orm.LoadModel[KnowledgeBase]("知识库", "bot_knowledge_base", orm.ModelConfig{
		Index:    KnowledgeBaseIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status":                statusOptions,
			"concept_graph_enabled": statusOptions,
			"index_status":          knowledgeIndexStatusOptions,
		},
		Relations: []orm.Relation{
			knowledgeCateRelation,
			knowledgeParserServiceRelation,
			knowledgeIndexPowerRelation,
			knowledgeEmbeddingPowerRelation,
			knowledgeDocRelation,
		},
	})
}
