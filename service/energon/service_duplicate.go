package energon

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/shemic/dever/orm"

	botmodel "github.com/dever-package/bot/model/energon"
	botprocessor "github.com/dever-package/bot/service/energon/processor"
)

const duplicatedServiceNameMaxRunes = 128

type DuplicateServiceResult struct {
	ID   uint64 `json:"id"`
	Name string `json:"name"`
}

func DuplicateServiceConfiguration(ctx context.Context, serviceID uint64) (DuplicateServiceResult, error) {
	if serviceID == 0 {
		return DuplicateServiceResult{}, fmt.Errorf("来源服务不能为空")
	}

	var result DuplicateServiceResult
	err := orm.Transaction(ctx, func(tx context.Context) error {
		source := botmodel.NewServiceModel().Find(tx, map[string]any{"id": serviceID})
		if source == nil {
			return fmt.Errorf("来源服务不存在")
		}
		provider := botmodel.NewProviderModel().Find(tx, map[string]any{"id": source.ProviderID})
		if provider == nil {
			return fmt.Errorf("来源服务所属来源不存在")
		}
		if strings.EqualFold(strings.TrimSpace(provider.Protocol), botprocessor.ProtocolLocal) {
			return fmt.Errorf("本地处理器服务由系统自动维护，不支持复制")
		}

		endpoints := botmodel.NewServiceEndpointModel().Select(tx, map[string]any{
			"service_id": source.ID,
		}, map[string]any{"order": "sort asc,id asc"})
		if len(endpoints) == 0 {
			return fmt.Errorf("来源服务没有可复制的服务接口")
		}

		now := time.Now()
		result.Name = duplicatedServiceName(source.Name)
		result.ID = uint64(botmodel.NewServiceModel().Insert(tx, map[string]any{
			"provider_id": source.ProviderID,
			"account_id":  source.AccountID,
			"name":        result.Name,
			"type":        source.Type,
			"path":        source.Path,
			"sort":        source.Sort,
			"status":      source.Status,
			"created_at":  now,
		}))
		if result.ID == 0 {
			return fmt.Errorf("复制来源服务失败")
		}

		for _, endpoint := range endpoints {
			if endpoint == nil {
				continue
			}
			newEndpointID := uint64(botmodel.NewServiceEndpointModel().Insert(tx, map[string]any{
				"service_id": result.ID,
				"api":        endpoint.Api,
				"param_mode": endpoint.ParamMode,
				"param_ids":  endpoint.ParamIds,
				"status":     endpoint.Status,
				"sort":       endpoint.Sort,
				"created_at": now,
			}))
			if newEndpointID == 0 {
				return fmt.Errorf("复制服务接口“%s”失败", endpoint.Api)
			}
			if err := duplicateServiceEndpointPricing(tx, endpoint.ID, newEndpointID, now); err != nil {
				return err
			}
		}

		params := botmodel.NewServiceParamModel().Select(tx, map[string]any{
			"service_id": source.ID,
		}, map[string]any{"order": "sort asc,id asc"})
		for _, param := range params {
			if param == nil {
				continue
			}
			paramID := uint64(botmodel.NewServiceParamModel().Insert(tx, map[string]any{
				"service_id":       result.ID,
				"param_id":         param.ParamID,
				"param_rule":       param.ParamRule,
				"key":              param.Key,
				"name":             param.Name,
				"mapping":          param.Mapping,
				"fixed_value_type": param.FixedValueType,
				"status":           param.Status,
				"sort":             param.Sort,
				"created_at":       now,
			}))
			if paramID == 0 {
				return fmt.Errorf("复制服务参数“%s”失败", param.Key)
			}
		}
		return nil
	})
	if err != nil {
		return DuplicateServiceResult{}, err
	}
	return result, nil
}

func duplicateServiceEndpointPricing(
	ctx context.Context,
	sourceEndpointID uint64,
	targetEndpointID uint64,
	createdAt time.Time,
) error {
	priceModel := botmodel.NewServicePriceModel()
	prices := priceModel.Select(ctx, map[string]any{
		"service_endpoint_id": sourceEndpointID,
	}, map[string]any{"order": "id asc"})
	for _, price := range prices {
		if price == nil {
			continue
		}
		newPriceID := uint64(priceModel.Insert(ctx, map[string]any{
			"service_endpoint_id": targetEndpointID,
			"mode":                price.Mode,
			"currency":            price.Currency,
			"max_cost":            price.MaxCost,
			"status":              price.Status,
			"created_at":          createdAt,
		}))
		if newPriceID == 0 {
			return fmt.Errorf("复制服务接口成本价格失败")
		}

		itemModel := botmodel.NewServicePriceItemModel()
		items := itemModel.Select(ctx, map[string]any{
			"service_price_id": price.ID,
		}, map[string]any{"order": "sort asc,id asc"})
		for _, item := range items {
			if item == nil {
				continue
			}
			itemID := uint64(itemModel.Insert(ctx, map[string]any{
				"service_price_id": newPriceID,
				"type":             item.Type,
				"unit_size":        item.UnitSize,
				"unit_price":       item.UnitPrice,
				"status":           item.Status,
				"sort":             item.Sort,
				"created_at":       createdAt,
			}))
			if itemID == 0 {
				return fmt.Errorf("复制服务接口成本价格项失败")
			}
		}
	}
	return nil
}

func duplicatedServiceName(source string) string {
	const suffix = "-复制"
	runes := []rune(strings.TrimSpace(source))
	limit := duplicatedServiceNameMaxRunes - len([]rune(suffix))
	if len(runes) > limit {
		runes = runes[:limit]
	}
	return string(runes) + suffix
}
