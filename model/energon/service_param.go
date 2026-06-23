package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type ServiceParam struct {
	ID             uint64    `dorm:"primaryKey;autoIncrement;comment:服务参数ID"`
	ServiceID      uint64    `dorm:"type:bigint;not null;default:0;comment:服务"`
	ParamID        uint64    `dorm:"type:bigint;not null;default:0;comment:参数"`
	ParamRule      int16     `dorm:"type:smallint;not null;default:1;comment:映射规则"`
	Key            string    `dorm:"type:varchar(128);not null;comment:字段标识"`
	Name           string    `dorm:"type:varchar(128);not null;comment:字段名"`
	Mapping        string    `dorm:"type:text;not null;comment:映射配置"`
	FixedValueType string    `dorm:"type:varchar(32);not null;default:string;comment:固定值类型"`
	Status         int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort           int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt      time.Time `dorm:"comment:创建时间"`
}

type ServiceParamIndex struct {
	ServiceParamKey struct{} `unique:"service_id,param_id,key"`
	ServiceStatus   struct{} `index:"service_id,status,sort"`
}

const (
	serviceParamRuleDirect     int16 = 1
	serviceParamRuleAttachment int16 = 3
	serviceParamRuleCombo      int16 = 4
	serviceParamRuleFixed      int16 = 5

	fixedValueTypeString  = "string"
	fixedValueTypeBoolean = "boolean"

	shemicLabImageSizeMapping = `{
	"params": [6, 7],
	"rows": [
		{"native_value": "1024x1024", "values": {"6": 1, "7": 4}},
		{"native_value": "1536x1024", "values": {"6": 1, "7": 5}},
		{"native_value": "1024x1536", "values": {"6": 1, "7": 6}}
	]
}`
	doubaoSeedreamSizeMapping = `{
	"params": [6, 7],
	"rows": [
		{"native_value": "2048x2048", "values": {"6": 2, "7": 4}},
		{"native_value": "2848x1600", "values": {"6": 2, "7": 5}},
		{"native_value": "1600x2848", "values": {"6": 2, "7": 6}},
		{"native_value": "2304x1728", "values": {"6": 2, "7": 7}},
		{"native_value": "1728x2304", "values": {"6": 2, "7": 8}},
		{"native_value": "2496x1664", "values": {"6": 2, "7": 9}},
		{"native_value": "1664x2496", "values": {"6": 2, "7": 10}},
		{"native_value": "3136x1344", "values": {"6": 2, "7": 13}},
		{"native_value": "4096x4096", "values": {"6": 3, "7": 4}},
		{"native_value": "5504x3040", "values": {"6": 3, "7": 5}},
		{"native_value": "3040x5504", "values": {"6": 3, "7": 6}},
		{"native_value": "4704x3520", "values": {"6": 3, "7": 7}},
		{"native_value": "3520x4704", "values": {"6": 3, "7": 8}},
		{"native_value": "4992x3328", "values": {"6": 3, "7": 9}},
		{"native_value": "3328x4992", "values": {"6": 3, "7": 10}},
		{"native_value": "6240x2656", "values": {"6": 3, "7": 13}}
	]
}`
)

var (
	serviceParamSeed = []map[string]any{
		{
			"id":               1,
			"service_id":       serviceShemicLabImageID,
			"param_id":         paramTextID,
			"param_rule":       serviceParamRuleDirect,
			"key":              "prompt",
			"name":             "",
			"mapping":          "",
			"fixed_value_type": fixedValueTypeString,
			"status":           1,
			"sort":             1,
		},
		{
			"id":               2,
			"service_id":       serviceShemicLabImageID,
			"param_id":         paramResolutionID,
			"param_rule":       serviceParamRuleCombo,
			"key":              "size",
			"name":             "",
			"mapping":          shemicLabImageSizeMapping,
			"fixed_value_type": fixedValueTypeString,
			"status":           1,
			"sort":             2,
		},
		{
			"id":               3,
			"service_id":       serviceShemicLabImageID,
			"param_id":         paramImageID,
			"param_rule":       serviceParamRuleAttachment,
			"key":              "image",
			"name":             "",
			"mapping":          "[1]",
			"fixed_value_type": fixedValueTypeString,
			"status":           1,
			"sort":             3,
		},
		{
			"id":               4,
			"service_id":       serviceDoubaoImageID,
			"param_id":         paramResolutionID,
			"param_rule":       serviceParamRuleCombo,
			"key":              "size",
			"name":             "",
			"mapping":          doubaoSeedreamSizeMapping,
			"fixed_value_type": fixedValueTypeString,
			"status":           1,
			"sort":             1,
		},
		{
			"id":               5,
			"service_id":       serviceDoubaoImageID,
			"param_id":         0,
			"param_rule":       serviceParamRuleFixed,
			"key":              "watermark",
			"name":             "",
			"mapping":          "false",
			"fixed_value_type": fixedValueTypeBoolean,
			"status":           1,
			"sort":             2,
		},
		{
			"id":               6,
			"service_id":       serviceDoubaoVideoID,
			"param_id":         0,
			"param_rule":       serviceParamRuleFixed,
			"key":              "content[0].type",
			"name":             "",
			"mapping":          "text",
			"fixed_value_type": fixedValueTypeString,
			"status":           1,
			"sort":             1,
		},
		{
			"id":               7,
			"service_id":       serviceDoubaoVideoID,
			"param_id":         paramTextID,
			"param_rule":       serviceParamRuleDirect,
			"key":              "content[0].text",
			"name":             "",
			"mapping":          "",
			"fixed_value_type": fixedValueTypeString,
			"status":           1,
			"sort":             2,
		},
		{
			"id":               8,
			"service_id":       serviceDoubaoVideoID,
			"param_id":         0,
			"param_rule":       serviceParamRuleFixed,
			"key":              "content[1].type",
			"name":             "",
			"mapping":          "image_url",
			"fixed_value_type": fixedValueTypeString,
			"status":           1,
			"sort":             3,
		},
		{
			"id":               9,
			"service_id":       serviceDoubaoVideoID,
			"param_id":         paramImageID,
			"param_rule":       serviceParamRuleAttachment,
			"key":              "content[1].image_url.url",
			"name":             "",
			"mapping":          "[1]",
			"fixed_value_type": fixedValueTypeString,
			"status":           1,
			"sort":             4,
		},
		{
			"id":               10,
			"service_id":       serviceDoubaoVideoID,
			"param_id":         0,
			"param_rule":       serviceParamRuleFixed,
			"key":              "content[1].role",
			"name":             "",
			"mapping":          "first_frame",
			"fixed_value_type": fixedValueTypeString,
			"status":           1,
			"sort":             5,
		},
		{
			"id":               11,
			"service_id":       serviceRunningHubImageID,
			"param_id":         paramTextID,
			"param_rule":       serviceParamRuleDirect,
			"key":              "prompt",
			"name":             "",
			"mapping":          "",
			"fixed_value_type": fixedValueTypeString,
			"status":           1,
			"sort":             1,
		},
		{
			"id":               12,
			"service_id":       serviceRunningHubImageID,
			"param_id":         paramImageID,
			"param_rule":       serviceParamRuleDirect,
			"key":              "imageUrls",
			"name":             "",
			"mapping":          "",
			"fixed_value_type": fixedValueTypeString,
			"status":           1,
			"sort":             2,
		},
		{
			"id":               13,
			"service_id":       serviceRunningHubMusicID,
			"param_id":         paramTextID,
			"param_rule":       serviceParamRuleDirect,
			"key":              "description",
			"name":             "",
			"mapping":          "",
			"fixed_value_type": fixedValueTypeString,
			"status":           1,
			"sort":             1,
		},
		{
			"id":               14,
			"service_id":       serviceRunningHubMusicID,
			"param_id":         paramSwitchID,
			"param_rule":       serviceParamRuleDirect,
			"key":              "make_instrumental",
			"name":             "是否仅生成背景音乐",
			"mapping":          "",
			"fixed_value_type": fixedValueTypeString,
			"status":           1,
			"sort":             2,
		},
		{
			"id":               15,
			"service_id":       serviceRunningHubFlowClothingID,
			"param_id":         paramImageID,
			"param_rule":       serviceParamRuleAttachment,
			"key":              "15.image",
			"name":             "服装图",
			"mapping":          "[1]",
			"fixed_value_type": fixedValueTypeString,
			"status":           1,
			"sort":             1,
		},
		{
			"id":               16,
			"service_id":       serviceRunningHubFlowClothingID,
			"param_id":         paramImageID,
			"param_rule":       serviceParamRuleAttachment,
			"key":              "14.image",
			"name":             "人物图",
			"mapping":          "[1]",
			"fixed_value_type": fixedValueTypeString,
			"status":           1,
			"sort":             2,
		},
	}

	paramRuleOptions = []map[string]any{
		{"id": 1, "value": "直接映射"},
		{"id": 2, "value": "选项映射"},
		{"id": 3, "value": "附件映射"},
		{"id": 4, "value": "组合映射"},
		{"id": 5, "value": "固定值映射"},
	}

	fixedValueTypeOptions = []map[string]any{
		{"id": "string", "value": "字符串"},
		{"id": "boolean", "value": "布尔"},
		{"id": "number", "value": "数字"},
		{"id": "json", "value": "JSON"},
	}

	serviceParamServiceRelation = orm.Relation{
		Field:      "service_id",
		Option:     "bot.energon.NewServiceModel",
		OptionKeys: []string{"name"},
	}

	serviceParamParamRelation = orm.Relation{
		Field:      "param_id",
		Option:     "bot.energon.NewParamModel",
		OptionKeys: []string{"name", "key", "type"},
	}
)

func NewServiceParamModel() *orm.Model[ServiceParam] {
	return orm.LoadModel[ServiceParam]("服务参数", "bot_energon_service_param", orm.ModelConfig{
		Index:    ServiceParamIndex{},
		Seeds:    serviceParamSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"param_rule":       paramRuleOptions,
			"fixed_value_type": fixedValueTypeOptions,
			"status":           statusOptions,
		},
		Relations: []orm.Relation{
			serviceParamServiceRelation,
			serviceParamParamRelation,
		},
	})
}
