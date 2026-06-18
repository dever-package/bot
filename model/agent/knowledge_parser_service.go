package agent

import (
	"time"

	"github.com/shemic/dever/orm"
)

const KnowledgeParserProviderMinerU = "mineru"

var knowledgeParserProviderOptions = []map[string]any{
	{"id": KnowledgeParserProviderMinerU, "value": "MinerU"},
}

type KnowledgeParserService struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:文档解析服务ID"`
	Name      string    `dorm:"type:varchar(128);not null;comment:名称"`
	Provider  string    `dorm:"type:varchar(32);not null;default:'mineru';comment:服务"`
	Host      string    `dorm:"type:varchar(255);not null;default:'';comment:Host"`
	APIKey    string    `dorm:"type:text;not null;default:'';comment:APIKey"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type KnowledgeParserServiceIndex struct {
	ProviderStatusSort struct{} `index:"provider,status,sort,id"`
	StatusSort         struct{} `index:"status,sort,id"`
}

func NewKnowledgeParserServiceModel() *orm.Model[KnowledgeParserService] {
	return orm.LoadModel[KnowledgeParserService]("文档解析服务", "bot_knowledge_parser_service", orm.ModelConfig{
		Index:    KnowledgeParserServiceIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Fields: map[string]orm.FieldConfig{
			"api_key": {Type: orm.FieldTypeHidden},
		},
		Options: map[string]any{
			"provider": knowledgeParserProviderOptions,
			"status":   statusOptions,
		},
	})
}
