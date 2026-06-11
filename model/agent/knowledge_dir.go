package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type KnowledgeDir struct {
	ID              uint64    `dorm:"primaryKey;autoIncrement;comment:目录ID"`
	KnowledgeBaseID uint64    `dorm:"type:bigint;not null;default:0;comment:知识库"`
	ParentID        uint64    `dorm:"type:bigint;not null;default:0;comment:父目录"`
	Name            string    `dorm:"type:varchar(128);not null;comment:目录名称"`
	Path            string    `dorm:"type:varchar(512);not null;default:'';comment:目录路径"`
	Depth           int       `dorm:"type:int;not null;default:0;comment:层级"`
	DocCount        int       `dorm:"type:int;not null;default:0;comment:文档数"`
	Summary         string    `dorm:"type:text;not null;default:'';comment:摘要"`
	Keywords        string    `dorm:"type:text;not null;default:'';comment:关键词"`
	Status          int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort            int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt       time.Time `dorm:"comment:创建时间"`
}

type KnowledgeDirIndex struct {
	BaseParentName struct{} `unique:"knowledge_base_id,parent_id,name"`
	BasePath       struct{} `unique:"knowledge_base_id,path"`
	BaseParentSort struct{} `index:"knowledge_base_id,parent_id,status,sort,id"`
	BaseStatus     struct{} `index:"knowledge_base_id,status,id"`
}

var knowledgeDirBaseRelation = orm.Relation{
	Field:      "knowledge_base_id",
	Option:     "bot.agent.NewKnowledgeBaseModel",
	OptionKeys: []string{"name", "cate_id"},
}

func NewKnowledgeDirModel() *orm.Model[KnowledgeDir] {
	return orm.LoadModel[KnowledgeDir]("知识目录", "bot_knowledge_dir", orm.ModelConfig{
		Index:    KnowledgeDirIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			knowledgeDirBaseRelation,
		},
	})
}
