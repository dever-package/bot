package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Param struct {
	ID           uint64    `dorm:"primaryKey;autoIncrement;comment:参数ID"`
	Name         string    `dorm:"type:varchar(128);not null;comment:参数名"`
	Key          string    `dorm:"type:varchar(128);not null;comment:参数标识"`
	Type         string    `dorm:"type:varchar(32);not null;comment:类型"`
	Usage        int16     `dorm:"type:smallint;not null;default:1;comment:用途"`
	ValueType    string    `dorm:"type:varchar(32);not null;default:string;comment:值类型"`
	CateID       uint64    `dorm:"type:bigint;not null;default:0;comment:参数分类"`
	UploadRuleID uint64    `dorm:"type:bigint;not null;default:0;comment:上传规则"`
	MaxFiles     int       `dorm:"type:int;not null;default:5;comment:最多文件数"`
	DefaultValue string    `dorm:"type:text;not null;comment:默认值"`
	Status       int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort         int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt    time.Time `dorm:"comment:创建时间"`
}

type ParamIndex struct {
	CateKey    struct{} `unique:"cate_id,key"`
	CateStatus struct{} `index:"cate_id,status,sort"`
}

var (
	paramTypeOptions = []map[string]any{
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
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"type":       paramTypeOptions,
			"usage":      paramUsageOptions,
			"value_type": paramValueTypeOptions,
			"status":     statusOptions,
		},
		Relations: []orm.Relation{
			paramCateRelation,
			paramUploadRuleRelation,
			paramOptionRelation,
		},
	})
}
