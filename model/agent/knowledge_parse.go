package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

type KnowledgeParse struct {
	ID              uint64    `dorm:"primaryKey;autoIncrement;comment:解析ID"`
	KnowledgeBaseID uint64    `dorm:"type:bigint;not null;default:0;comment:知识库"`
	DirID           uint64    `dorm:"type:bigint;not null;default:0;comment:目录"`
	DocID           uint64    `dorm:"type:bigint;not null;default:0;comment:文档"`
	ParserServiceID uint64    `dorm:"type:bigint;not null;default:0;comment:文档解析服务"`
	Provider        string    `dorm:"type:varchar(64);not null;default:'';comment:解析服务"`
	SourceHash      string    `dorm:"type:varchar(64);not null;default:'';comment:源文件哈希"`
	ParseHash       string    `dorm:"type:varchar(64);not null;default:'';comment:解析结果哈希"`
	PlainText       string    `dorm:"type:text;not null;default:'';comment:纯文本"`
	Markdown        string    `dorm:"type:text;not null;default:'';comment:Markdown"`
	OutlineJSON     string    `dorm:"type:text;not null;default:'';comment:目录结构JSON"`
	PagesJSON       string    `dorm:"type:text;not null;default:'';comment:页面JSON"`
	AssetsJSON      string    `dorm:"type:text;not null;default:'';comment:资源JSON"`
	RawJSON         string    `dorm:"type:text;not null;default:'';comment:原始解析JSON"`
	Status          int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	ErrorMessage    string    `dorm:"type:text;not null;default:'';comment:错误信息"`
	CreatedAt       time.Time `dorm:"comment:创建时间"`
}

type KnowledgeParseIndex struct {
	DocStatus  struct{} `index:"doc_id,status,id"`
	BaseDoc    struct{} `index:"knowledge_base_id,doc_id,status"`
	SourceHash struct{} `index:"knowledge_base_id,doc_id,source_hash"`
}

func NewKnowledgeParseModel() *orm.Model[KnowledgeParse] {
	return orm.LoadModel[KnowledgeParse]("知识解析", "bot_knowledge_parse", orm.ModelConfig{
		Index:    KnowledgeParseIndex{},
		Order:    "id desc",
		Database: "default",
		Options: map[string]any{
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			knowledgeBaseRelation,
			knowledgeDirRelation,
			knowledgeDocModelRelation,
			knowledgeParserServiceRelation,
		},
	})
}
