package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type KnowledgeCate struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:知识库分类ID"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type KnowledgeCateIndex struct {
	Name       struct{} `unique:"name"`
	StatusSort struct{} `index:"status,sort,id"`
}

var knowledgeCateSeed = []map[string]any{
	{"id": DefaultKnowledgeCateID, "name": "默认分类", "status": 1, "sort": 100},
}

func NewKnowledgeCateModel() *orm.Model[KnowledgeCate] {
	return orm.LoadModel[KnowledgeCate]("知识库分类", "bot_knowledge_cate", orm.ModelConfig{
		Index:    KnowledgeCateIndex{},
		Seeds:    knowledgeCateSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
	})
}
