package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	ServicePriceModeRequest = "request"
	ServicePriceModeToken   = "token"

	ServicePriceCurrencyCNY = "CNY"
	ServicePriceCurrencyUSD = "USD"
)

type ServicePrice struct {
	ID                uint64    `dorm:"primaryKey;autoIncrement;comment:服务价格ID"`
	ServiceEndpointID uint64    `dorm:"type:bigint;not null;default:0;comment:服务接口"`
	Mode              string    `dorm:"type:varchar(16);not null;default:'request';comment:计价方式"`
	Currency          string    `dorm:"type:varchar(8);not null;default:'CNY';comment:币种"`
	MaxCost           string    `dorm:"type:varchar(32);not null;default:'0';comment:单次预授权成本上限"`
	Status            int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	CreatedAt         time.Time `dorm:"comment:创建时间"`
}

type ServicePriceIndex struct {
	ServiceEndpoint struct{} `unique:"service_endpoint_id"`
	Status          struct{} `index:"status,id"`
}

var (
	servicePriceModeOptions = []map[string]any{
		{"id": ServicePriceModeRequest, "value": "按次"},
		{"id": ServicePriceModeToken, "value": "按 Token"},
	}
	servicePriceCurrencyOptions = []map[string]any{
		{"id": ServicePriceCurrencyCNY, "value": "人民币（CNY）"},
		{"id": ServicePriceCurrencyUSD, "value": "美元（USD）"},
	}

	servicePriceEndpointRelation = orm.Relation{
		Field:      "service_endpoint_id",
		Option:     "bot.energon.NewServiceEndpointModel",
		OptionKeys: []string{"service_id", "api"},
	}

	servicePriceItemRelation = orm.Relation{
		Field:      "items",
		Through:    "bot.energon.NewServicePriceItemModel",
		OwnerField: "service_price_id",
		Order:      "sort asc,id asc",
	}
)

func NewServicePriceModel() *orm.Model[ServicePrice] {
	return orm.LoadModel[ServicePrice]("成本价格", "bot_energon_service_price", orm.ModelConfig{
		Index:    ServicePriceIndex{},
		Order:    "id asc",
		Database: "default",
		Options: map[string]any{
			"mode":     servicePriceModeOptions,
			"currency": servicePriceCurrencyOptions,
			"status":   statusOptions,
		},
		Relations: []orm.Relation{
			servicePriceEndpointRelation,
			servicePriceItemRelation,
		},
	})
}
