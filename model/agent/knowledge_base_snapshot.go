package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type KnowledgeBaseSnapshot struct {
	ID              uint64     `dorm:"primaryKey;autoIncrement;comment:快照ID"`
	KnowledgeBaseID uint64     `dorm:"type:bigint;not null;default:0;comment:知识库"`
	Version         int        `dorm:"type:int;not null;default:1;comment:快照版本"`
	Name            string     `dorm:"type:varchar(255);not null;default:'';comment:快照名称"`
	Description     string     `dorm:"type:text;not null;default:'';comment:快照描述"`
	DocSnapshot     string     `dorm:"type:text;not null;default:'';comment:文档快照JSON"`
	BaseConfig      string     `dorm:"type:text;not null;default:'';comment:知识库配置快照JSON"`
	PublishedAt     *time.Time `dorm:"type:timestamp;null;comment:发布时间"`
	Status          int16      `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt       time.Time  `dorm:"comment:创建时间"`
}

type KnowledgeBaseSnapshotIndex struct {
	BaseVersion struct{} `unique:"knowledge_base_id,version"`
	BaseStatus  struct{} `index:"knowledge_base_id,status,id"`
	Published   struct{} `index:"knowledge_base_id,published_at,status"`
}

var knowledgeBaseSnapshotModelRelation = orm.Relation{
	Field:      "knowledge_base_id",
	Option:     "bot.agent.NewKnowledgeBaseModel",
	OptionKeys: []string{"name", "cate_id"},
}

func NewKnowledgeBaseSnapshotModel() *orm.Model[KnowledgeBaseSnapshot] {
	return orm.LoadModel[KnowledgeBaseSnapshot]("知识库快照", "bot_knowledge_base_snapshot", orm.ModelConfig{
		Index:    KnowledgeBaseSnapshotIndex{},
		Order:    "version desc, id desc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			knowledgeBaseSnapshotModelRelation,
		},
	})
}
