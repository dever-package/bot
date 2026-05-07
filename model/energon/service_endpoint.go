package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type ServiceEndpoint struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:服务接口ID"`
	ServiceID uint64    `dorm:"type:bigint;not null;default:0;comment:服务"`
	Api       string    `dorm:"type:varchar(255);not null;comment:接口标识"`
	ParamMode string    `dorm:"type:varchar(16);not null;default:all;comment:参数要求"`
	ParamIds  string    `dorm:"type:text;not null;comment:关联参数"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"comment:创建时间"`
}

type ServiceEndpointIndex struct {
	ServiceApi    struct{} `unique:"service_id,api"`
	ServiceStatus struct{} `index:"service_id,status,sort"`
}

var (
	serviceEndpointParamModeOptions = []map[string]any{
		{"id": "all", "value": "全部参数满足"},
		{"id": "any", "value": "任一参数满足"},
	}

	serviceEndpointServiceRelation = orm.Relation{
		Field:      "service_id",
		Option:     "bot.energon.NewServiceModel",
		OptionKeys: []string{"name"},
	}
)

func NewServiceEndpointModel() *orm.Model[ServiceEndpoint] {
	return orm.LoadModel[ServiceEndpoint]("服务接口", "bot_energon_service_endpoint", orm.ModelConfig{
		Index:    ServiceEndpointIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"param_mode": serviceEndpointParamModeOptions,
			"status":     statusOptions,
		},
		Relations: []orm.Relation{
			serviceEndpointServiceRelation,
		},
	})
}
