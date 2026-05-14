package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Power struct {
	ID         uint64    `dorm:"primaryKey;autoIncrement;comment:能力ID"`
	CateID     uint64    `dorm:"type:bigint;not null;default:1;comment:能力分类"`
	Key        string    `dorm:"type:varchar(128);not null;comment:标识"`
	Name       string    `dorm:"type:varchar(128);not null;comment:名称"`
	Kind       string    `dorm:"type:varchar(64);not null;comment:类型"`
	SourceRule int16     `dorm:"type:smallint;not null;default:1;comment:来源规则"`
	Status     int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt  time.Time `dorm:"comment:创建时间"`
}

type PowerIndex struct {
	Key        struct{} `unique:"key"`
	CateStatus struct{} `index:"cate_id,status"`
	KindStatus struct{} `index:"kind,status"`
}

const DefaultLLMPowerID uint64 = 1

var (
	powerSeed = []map[string]any{
		{
			"id":          DefaultLLMPowerID,
			"cate_id":     1,
			"key":         "llm",
			"name":        "LLM",
			"kind":        "text",
			"source_rule": 1,
			"status":      1,
		},
	}

	kindOptions = []map[string]any{
		{"id": "text", "value": "文本"},
		{"id": "image", "value": "图片"},
		{"id": "video", "value": "视频"},
		{"id": "audio", "value": "音频"},
		{"id": "role", "value": "角色"},
		{"id": "multi", "value": "多模态"},
		{"id": "embeddings", "value": "向量"},
		{"id": "workflow", "value": "工作流"},
	}

	sourceRuleOptions = []map[string]any{
		{"id": 1, "value": "仅调用第一个可用来源"},
		{"id": 2, "value": "可以选择来源"},
	}

	powerCateRelation = orm.Relation{
		Field:      "cate_id",
		Option:     "bot.energon.NewPowerCateModel",
		OptionKeys: []string{"name"},
	}

	powerParamRelation = orm.Relation{
		Field:      "params",
		Through:    "bot.energon.NewPowerParamModel",
		OwnerField: "power_id",
		Order:      "sort asc, id asc",
	}

	powerTargetRelation = orm.Relation{
		Field:      "targets",
		Through:    "bot.energon.NewPowerTargetModel",
		OwnerField: "power_id",
		Order:      "sort asc, id asc",
	}
)

func NewPowerModel() *orm.Model[Power] {
	return orm.LoadModel[Power]("能力", "bot_energon_power", orm.ModelConfig{
		Index:    PowerIndex{},
		Seeds:    powerSeed,
		Order:    "id asc",
		Database: "default",
		Options: map[string]any{
			"kind":        kindOptions,
			"source_rule": sourceRuleOptions,
			"status":      statusOptions,
		},
		Relations: []orm.Relation{
			powerCateRelation,
			powerParamRelation,
			powerTargetRelation,
		},
	})
}
