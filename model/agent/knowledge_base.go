package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type KnowledgeBase struct {
	ID               uint64    `dorm:"primaryKey;autoIncrement;comment:知识库ID"`
	CateID           uint64    `dorm:"type:bigint;not null;default:1;comment:知识库分类"`
	Name             string    `dorm:"type:varchar(128);not null;comment:名称"`
	VectorEnabled    int16     `dorm:"type:smallint;not null;default:2;comment:开启向量能力"`
	Collection       string    `dorm:"type:varchar(128);not null;default:'';comment:向量数据库集合"`
	EmbeddingPowerID uint64    `dorm:"type:bigint;not null;default:0;comment:向量能力"`
	ChunkSize        int       `dorm:"type:int;not null;default:800;comment:分段长度"`
	ChunkOverlap     int       `dorm:"type:int;not null;default:120;comment:分段重叠"`
	RetrieveLimit    int       `dorm:"type:int;not null;default:5;comment:召回数量"`
	ScoreThreshold   float64   `dorm:"type:double precision;not null;default:0.35;comment:相似度阈值"`
	MaxContextChars  int       `dorm:"type:int;not null;default:6000;comment:最大注入字数"`
	DocCount         int       `dorm:"type:int;not null;default:0;comment:文档数"`
	ChunkCount       int       `dorm:"type:int;not null;default:0;comment:分段数"`
	IndexStatus      string    `dorm:"type:varchar(32);not null;default:'pending';comment:索引状态"`
	ErrorMessage     string    `dorm:"type:text;not null;default:'';comment:错误信息"`
	Status           int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort             int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt        time.Time `dorm:"comment:创建时间"`
}

type KnowledgeBaseIndex struct {
	CateName       struct{} `unique:"cate_id,name"`
	CateStatusSort struct{} `index:"cate_id,status,sort,id"`
	VectorStatus   struct{} `index:"vector_enabled,status"`
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

	knowledgeEmbeddingPowerRelation = orm.Relation{
		Field:      "embedding_power_id",
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
			"status":         statusOptions,
			"vector_enabled": statusOptions,
			"index_status":   knowledgeIndexStatusOptions,
		},
		Relations: []orm.Relation{
			knowledgeCateRelation,
			knowledgeEmbeddingPowerRelation,
			knowledgeDocRelation,
		},
	})
}
