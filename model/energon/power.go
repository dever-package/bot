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
	Icon       string    `dorm:"type:varchar(64);not null;default:'';comment:图标"`
	OutputType string    `json:"output_type" dorm:"type:varchar(64);not null;default:general;comment:输出类型"`
	Kind       string    `dorm:"type:varchar(64);not null;comment:类型"`
	Prompt     string    `dorm:"type:text;not null;default:'';comment:设定提示词"`
	SourceRule int16     `dorm:"type:smallint;not null;default:1;comment:来源规则"`
	Status     int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt  time.Time `dorm:"comment:创建时间"`
}

type PowerIndex struct {
	Key              struct{} `unique:"key"`
	CateStatus       struct{} `index:"cate_id,status"`
	KindStatus       struct{} `index:"kind,status"`
	OutputKindStatus struct{} `index:"output_type,kind,status"`
}

const (
	DefaultLLMPowerID          uint64 = 1
	defaultImagePowerID        uint64 = 2
	defaultVideoPowerID        uint64 = 3
	defaultClothingPowerID     uint64 = 4
	defaultMusicPowerID        uint64 = 5
	defaultStoryboardPowerID   uint64 = 7
	defaultVideoComposePowerID uint64 = 12
	defaultSpeechPowerID       uint64 = 13
	defaultCopywritingPowerID  uint64 = 14

	defaultCopywritingPrompt = `{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":null,"lineHeight":null,"color":null,"backgroundColor":null,"fontFamily":null,"fontSize":null,"textIndent":null,"marginTop":null,"marginRight":null,"marginBottom":null,"marginLeft":null,"paddingTop":null,"paddingRight":null,"paddingBottom":null,"paddingLeft":null,"border":null,"borderTop":null,"borderRight":null,"borderBottom":null,"borderLeft":null,"borderRadius":null,"width":null,"maxWidth":null},"content":[{"type":"text","text":"你是“文案”能力的设定提示词。你的职责是根据用户需求生成清晰、准确、可直接使用的文案内容。输出要求：1）优先满足用户目标与场景；2）语言自然、简洁、有重点；3）根据需要调整语气、长度与风格，但避免空话套话；4）如信息不足，先输出最合理的可用版本，不要编造具体事实；5）确保内容符合常见平台表达规范，不包含违规、攻击、歧视、虚假或敏感内容；6）如用户未特别说明，默认输出为中文；7）只输出最终文案结果，不要输出分析过程、解释说明或多余前缀。"}]}]}`
)

var (
	powerSeed = []map[string]any{
		{
			"id":          DefaultLLMPowerID,
			"cate_id":     1,
			"key":         "llm",
			"name":        "文本",
			"icon":        "book",
			"output_type": OutputTypeGeneral,
			"kind":        "text",
			"prompt":      "",
			"source_rule": 2,
			"status":      1,
		},
		{
			"id":          defaultImagePowerID,
			"cate_id":     1,
			"key":         "image",
			"name":        "图片",
			"icon":        "image",
			"output_type": OutputTypeGeneral,
			"kind":        "image",
			"prompt":      "",
			"source_rule": 2,
			"status":      1,
		},
		{
			"id":          defaultVideoPowerID,
			"cate_id":     1,
			"key":         "video",
			"name":        "视频",
			"icon":        "circle-play",
			"output_type": OutputTypeGeneral,
			"kind":        "video",
			"prompt":      "",
			"source_rule": 2,
			"status":      1,
		},
		{
			"id":          defaultClothingPowerID,
			"cate_id":     1,
			"key":         "huanzhuang",
			"name":        "换装",
			"icon":        "lucide-contact2",
			"output_type": OutputTypeGeneral,
			"kind":        "image",
			"prompt":      "",
			"source_rule": 1,
			"status":      2,
		},
		{
			"id":          defaultMusicPowerID,
			"cate_id":     1,
			"key":         "music",
			"name":        "音乐",
			"icon":        "lucide-music4",
			"output_type": OutputTypeGeneral,
			"kind":        "audio",
			"prompt":      "",
			"source_rule": 1,
			"status":      1,
		},
		{
			"id":          defaultStoryboardPowerID,
			"cate_id":     1,
			"key":         "fenjing",
			"name":        "分镜脚本",
			"icon":        "zap",
			"output_type": OutputTypeStoryboard,
			"kind":        "text",
			"prompt":      "",
			"source_rule": 1,
			"status":      1,
		},
		{
			"id":          defaultVideoComposePowerID,
			"cate_id":     1,
			"key":         "video-compose",
			"name":        "视频合成",
			"icon":        "clapperboard",
			"output_type": OutputTypeVideoCompose,
			"kind":        "video",
			"prompt":      "",
			"source_rule": 1,
			"status":      1,
		},
		{
			"id":          defaultSpeechPowerID,
			"cate_id":     1,
			"key":         "tts",
			"name":        "语音",
			"icon":        "lucide-mic",
			"output_type": OutputTypeSpeech,
			"kind":        "audio",
			"prompt":      "",
			"source_rule": 1,
			"status":      1,
		},
		{
			"id":          defaultCopywritingPowerID,
			"cate_id":     1,
			"key":         "wenan",
			"name":        "文案",
			"icon":        "zap",
			"output_type": OutputTypeGeneral,
			"kind":        "text",
			"prompt":      defaultCopywritingPrompt,
			"source_rule": 2,
			"status":      1,
		},
	}

	kindOptions = []map[string]any{
		{"id": "text", "value": "文本"},
		{"id": "image", "value": "图片"},
		{"id": "video", "value": "视频"},
		{"id": "audio", "value": "音频"},
		{"id": "file", "value": "文件"},
		{"id": "role", "value": "角色"},
		{"id": "multi", "value": "多模态"},
		{"id": "embeddings", "value": "向量"},
		{"id": "workflow", "value": "工作流"},
	}

	sourceRuleOptions = []map[string]any{
		{"id": 1, "value": "自动选择来源"},
		{"id": 2, "value": "手动选择来源"},
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
			"output_type": OutputTypeOptions(),
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
