package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

type Service struct {
	ID         uint64    `dorm:"primaryKey;autoIncrement;comment:服务ID"`
	ProviderID uint64    `dorm:"type:bigint;not null;default:0;comment:来源"`
	Name       string    `dorm:"type:varchar(128);not null;comment:名称"`
	Type       string    `dorm:"type:varchar(64);not null;comment:类型"`
	Path       string    `dorm:"type:varchar(255);not null;default:'';comment:接口路径"`
	Sort       int       `dorm:"type:int;not null;default:100;comment:排序"`
	Status     int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt  time.Time `dorm:"comment:创建时间"`
}

type ServiceIndex struct {
	ProviderName   struct{} `unique:"provider_id,name"`
	ProviderStatus struct{} `index:"provider_id,status,sort"`
}

var (
	serviceProviderRelation = orm.Relation{
		Field:      "provider_id",
		Option:     "bot.energon.NewProviderModel",
		OptionKeys: []string{"name", "host"},
	}

	serviceParamRelation = orm.Relation{
		Field:      "params",
		Through:    "bot.energon.NewServiceParamModel",
		OwnerField: "service_id",
		Order:      "sort asc, id asc",
	}

	serviceEndpointRelation = orm.Relation{
		Field:      "endpoints",
		Through:    "bot.energon.NewServiceEndpointModel",
		OwnerField: "service_id",
		Order:      "sort asc, id asc",
	}
)

func NewServiceModel() *orm.Model[Service] {
	return orm.LoadModel[Service]("来源服务", "bot_energon_service", orm.ModelConfig{
		Index:    ServiceIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"type":   kindOptions,
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			serviceProviderRelation,
			serviceEndpointRelation,
			serviceParamRelation,
		},
	})
}
