package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type ServiceParam struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:服务参数ID"`
	ServiceID uint64    `dorm:"type:bigint;not null;default:0;comment:服务"`
	ParamID   uint64    `dorm:"type:bigint;not null;default:0;comment:参数"`
	ParamRule int16     `dorm:"type:smallint;not null;default:1;comment:映射规则"`
	Key       string    `dorm:"type:varchar(128);not null;comment:字段标识"`
	Name      string    `dorm:"type:varchar(128);not null;comment:字段名"`
	Mapping   string    `dorm:"type:text;not null;comment:映射配置"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type ServiceParamIndex struct {
	ServiceParamKey struct{} `unique:"service_id,param_id,key"`
	ServiceStatus   struct{} `index:"service_id,status,sort"`
}

var (
	paramRuleOptions = []map[string]any{
		{"id": 1, "value": "直接映射"},
		{"id": 2, "value": "选项映射"},
		{"id": 3, "value": "附件映射"},
		{"id": 4, "value": "组合映射"},
		{"id": 5, "value": "固定值映射"},
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
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"param_rule": paramRuleOptions,
			"status":     statusOptions,
		},
		Relations: []orm.Relation{
			serviceParamServiceRelation,
			serviceParamParamRelation,
		},
	})
}
