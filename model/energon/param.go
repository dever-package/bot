package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Param struct {
	ID            uint64    `dorm:"primaryKey;autoIncrement;comment:参数ID"`
	Name          string    `dorm:"type:varchar(128);not null;comment:参数名"`
	Key           string    `dorm:"type:varchar(128);not null;comment:参数标识"`
	Icon          string    `dorm:"type:varchar(64);not null;default:'';comment:图标"`
	Type          string    `dorm:"type:varchar(32);not null;comment:类型"`
	PreviewType   string    `dorm:"type:varchar(32);not null;default:none;comment:预览类型"`
	Usage         int16     `dorm:"type:smallint;not null;default:1;comment:用途"`
	ValueType     string    `dorm:"type:varchar(32);not null;default:string;comment:值类型"`
	CateID        uint64    `dorm:"type:bigint;not null;default:0;comment:参数分类"`
	UploadRuleID  uint64    `dorm:"type:bigint;not null;default:0;comment:上传规则"`
	MaxFiles      int       `dorm:"type:int;not null;default:5;comment:最多文件数"`
	AssetText     int16     `dorm:"type:smallint;not null;default:1;comment:允许引用文本资产"`
	AssetImage    int16     `dorm:"type:smallint;not null;default:1;comment:允许引用图片资产"`
	AssetAudio    int16     `dorm:"type:smallint;not null;default:1;comment:允许引用音频资产"`
	AssetVideo    int16     `dorm:"type:smallint;not null;default:1;comment:允许引用视频资产"`
	AssetRichtext int16     `dorm:"type:smallint;not null;default:1;comment:允许引用富文本资产"`
	AssetFile     int16     `dorm:"type:smallint;not null;default:1;comment:允许引用文件资产"`
	DefaultValue  string    `dorm:"type:text;not null;comment:默认值"`
	Status        int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort          int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt     time.Time `dorm:"comment:创建时间"`
}

type ParamIndex struct {
	CateKey    struct{} `unique:"cate_id,key"`
	CateStatus struct{} `index:"cate_id,status,sort"`
}

const (
	ParamPromptID      uint64 = 1
	paramImageID       uint64 = 2
	paramAudioID       uint64 = 3
	paramVideoID       uint64 = 4
	paramFileID        uint64 = 5
	paramResolutionID  uint64 = 6
	paramAspectRatioID uint64 = 7
	paramSwitchID      uint64 = 8
	paramWatermarkID   uint64 = 9
	paramTestID        uint64 = 10
	paramDurationID    uint64 = 11
	paramVideosID      uint64 = 12
	paramSubtitlesID   uint64 = 13
	paramFPSID         uint64 = 14
)

var (
	paramSeed = []map[string]any{
		{
			"id":             ParamPromptID,
			"name":           "提示词",
			"key":            "prompt",
			"type":           "prompt",
			"usage":          1,
			"value_type":     "string",
			"cate_id":        paramCateCommonID,
			"upload_rule_id": 0,
			"max_files":      0,
			"default_value":  "",
			"status":         1,
			"sort":           100,
		},
		{
			"id":             paramImageID,
			"name":           "上传图片",
			"key":            "image",
			"type":           "files",
			"usage":          1,
			"value_type":     "string",
			"cate_id":        paramCateCommonID,
			"upload_rule_id": 1,
			"max_files":      9,
			"default_value":  "",
			"status":         1,
			"sort":           100,
		},
		{
			"id":             paramAudioID,
			"name":           "上传音频",
			"key":            "audio",
			"type":           "file",
			"usage":          1,
			"value_type":     "string",
			"cate_id":        paramCateCommonID,
			"upload_rule_id": 3,
			"max_files":      0,
			"default_value":  "",
			"status":         1,
			"sort":           100,
		},
		{
			"id":             paramVideoID,
			"name":           "上传视频",
			"key":            "video",
			"type":           "file",
			"usage":          1,
			"value_type":     "string",
			"cate_id":        paramCateCommonID,
			"upload_rule_id": 2,
			"max_files":      0,
			"default_value":  "",
			"status":         1,
			"sort":           100,
		},
		{
			"id":             paramFileID,
			"name":           "上传文件",
			"key":            "file",
			"type":           "file",
			"usage":          1,
			"value_type":     "string",
			"cate_id":        paramCateCommonID,
			"upload_rule_id": 6,
			"max_files":      0,
			"default_value":  "",
			"status":         1,
			"sort":           100,
		},
		{
			"id":             paramResolutionID,
			"name":           "分辨率",
			"key":            "resolution",
			"type":           "option",
			"usage":          2,
			"value_type":     "string",
			"cate_id":        paramCateCommonID,
			"upload_rule_id": 0,
			"max_files":      0,
			"default_value":  "",
			"status":         1,
			"sort":           100,
		},
		{
			"id":             paramAspectRatioID,
			"name":           "比例",
			"key":            "aspectRatio",
			"type":           "option",
			"usage":          2,
			"value_type":     "string",
			"cate_id":        paramCateCommonID,
			"upload_rule_id": 0,
			"max_files":      0,
			"default_value":  "",
			"status":         1,
			"sort":           100,
		},
		{
			"id":             paramSwitchID,
			"name":           "开关",
			"key":            "switch",
			"type":           "switch",
			"usage":          2,
			"value_type":     "string",
			"cate_id":        paramCateCommonID,
			"upload_rule_id": 0,
			"max_files":      0,
			"default_value":  "",
			"status":         1,
			"sort":           100,
		},
		{
			"id":             paramWatermarkID,
			"name":           "水印",
			"key":            "watermark",
			"type":           "hidden",
			"usage":          2,
			"value_type":     "number",
			"cate_id":        paramCateSpecialID,
			"upload_rule_id": 0,
			"max_files":      0,
			"default_value":  "false",
			"status":         1,
			"sort":           100,
		},
		{
			"id":             paramTestID,
			"name":           "测试",
			"key":            "test",
			"type":           "textarea",
			"usage":          1,
			"value_type":     "string",
			"cate_id":        paramCateSpecialID,
			"upload_rule_id": 0,
			"max_files":      0,
			"default_value":  "",
			"status":         1,
			"sort":           100,
		},
		{
			"id":             paramDurationID,
			"name":           "时长",
			"key":            "duration",
			"type":           "option",
			"usage":          2,
			"value_type":     "number",
			"cate_id":        paramCateCommonID,
			"upload_rule_id": 0,
			"max_files":      0,
			"default_value":  "5",
			"status":         1,
			"sort":           100,
		},
		{
			"id":             paramVideosID,
			"name":           "视频片段",
			"key":            "videos",
			"type":           "files",
			"usage":          1,
			"value_type":     "string",
			"cate_id":        paramCateCommonID,
			"upload_rule_id": 2,
			"max_files":      50,
			"default_value":  "",
			"status":         1,
			"sort":           110,
		},
		{
			"id":             paramSubtitlesID,
			"name":           "字幕文件",
			"key":            "subtitles",
			"type":           "file",
			"usage":          2,
			"value_type":     "string",
			"cate_id":        paramCateCommonID,
			"upload_rule_id": 6,
			"max_files":      1,
			"default_value":  "",
			"status":         1,
			"sort":           120,
		},
		{
			"id":             paramFPSID,
			"name":           "帧率",
			"key":            "fps",
			"type":           "option",
			"usage":          2,
			"value_type":     "number",
			"cate_id":        paramCateCommonID,
			"upload_rule_id": 0,
			"max_files":      0,
			"default_value":  "25",
			"status":         1,
			"sort":           130,
		},
	}

	paramTypeOptions = []map[string]any{
		{"id": "prompt", "value": "提示词"},
		{"id": "input", "value": "单行输入"},
		{"id": "textarea", "value": "多行输入"},
		{"id": "switch", "value": "开关选项"},
		{"id": "option", "value": "单项选择"},
		{"id": "multi_option", "value": "多项选择"},
		{"id": "file", "value": "单文件"},
		{"id": "files", "value": "多文件"},
		{"id": "hidden", "value": "隐藏框"},
		{"id": "description", "value": "说明描述"},
	}

	paramUsageOptions = []map[string]any{
		{"id": 1, "value": "主要参数"},
		{"id": 2, "value": "工具栏参数"},
	}

	paramPreviewTypeOptions = []map[string]any{
		{"id": "none", "value": "无预览"},
		{"id": "image", "value": "图片"},
		{"id": "audio", "value": "音频"},
		{"id": "video", "value": "视频"},
	}

	paramValueTypeOptions = []map[string]any{
		{"id": "string", "value": "字符串"},
		{"id": "number", "value": "数字"},
	}

	paramCateRelation = orm.Relation{
		Field:      "cate_id",
		Option:     "bot.energon.NewParamCateModel",
		OptionKeys: []string{"name"},
	}

	paramUploadRuleRelation = orm.Relation{
		Field:      "upload_rule_id",
		Option:     "front.NewUploadRuleModel",
		OptionKeys: []string{"name"},
	}

	paramOptionRelation = orm.Relation{
		Field:      "options",
		Through:    "bot.energon.NewParamOptionModel",
		OwnerField: "param_id",
		Order:      "sort asc, id asc",
	}
)

func NewParamModel() *orm.Model[Param] {
	return orm.LoadModel[Param]("参数", "bot_energon_param", orm.ModelConfig{
		Index:    ParamIndex{},
		Seeds:    paramSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"type":         paramTypeOptions,
			"preview_type": paramPreviewTypeOptions,
			"usage":        paramUsageOptions,
			"value_type":   paramValueTypeOptions,
			"status":       statusOptions,
		},
		Relations: []orm.Relation{
			paramCateRelation,
			paramUploadRuleRelation,
			paramOptionRelation,
		},
	})
}
