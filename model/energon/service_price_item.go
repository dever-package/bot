package energon

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	ServicePriceItemRequest     = "request"
	ServicePriceItemInputToken  = "input_token"
	ServicePriceItemCachedToken = "cached_token"
	ServicePriceItemOutputToken = "output_token"
)

type ServicePriceItem struct {
	ID             uint64    `dorm:"primaryKey;autoIncrement;comment:服务价格项ID"`
	ServicePriceID uint64    `dorm:"type:bigint;not null;default:0;comment:服务价格"`
	Type           string    `dorm:"type:varchar(32);not null;comment:价格项"`
	UnitSize       int64     `dorm:"type:bigint;not null;default:1;comment:计价单位"`
	UnitPrice      string    `dorm:"type:varchar(32);not null;default:'0';comment:单位价格"`
	Status         int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort           int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt      time.Time `dorm:"comment:创建时间"`
}

type ServicePriceItemIndex struct {
	PriceType  struct{} `unique:"service_price_id,type"`
	PriceSort  struct{} `index:"service_price_id,status,sort,id"`
	TypeStatus struct{} `index:"type,status,id"`
}

var (
	servicePriceItemTypeOptions = []map[string]any{
		{"id": ServicePriceItemRequest, "value": "单次请求"},
		{"id": ServicePriceItemInputToken, "value": "输入 Token"},
		{"id": ServicePriceItemCachedToken, "value": "缓存输入 Token"},
		{"id": ServicePriceItemOutputToken, "value": "输出 Token"},
	}

	servicePriceItemPriceRelation = orm.Relation{
		Field:      "service_price_id",
		Option:     "bot.energon.NewServicePriceModel",
		OptionKeys: []string{"mode", "currency", "status"},
	}
)

func NewServicePriceItemModel() *orm.Model[ServicePriceItem] {
	return orm.LoadModel[ServicePriceItem]("成本价格项", "bot_energon_service_price_item", orm.ModelConfig{
		Index:    ServicePriceItemIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"type":   servicePriceItemTypeOptions,
			"status": statusOptions,
		},
		Relations: []orm.Relation{
			servicePriceItemPriceRelation,
		},
	})
}
