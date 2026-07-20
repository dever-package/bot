package billing

import (
	"context"
	"fmt"

	energonmodel "github.com/dever-package/bot/model/energon"
	pricingservice "github.com/dever-package/bot/service/energon/pricing"
)

type PowerReserveQuote struct {
	Currency    string
	CostMicros  int64
	EndpointIDs []uint64
}

func QuotePowerReserve(ctx context.Context, powerID uint64, powerTargetID uint64) (PowerReserveQuote, error) {
	targets, err := billablePowerTargets(ctx, powerID, powerTargetID)
	if err != nil {
		return PowerReserveQuote{}, err
	}
	services, endpointsByService := billableServicesAndEndpoints(ctx, targets)
	quote := PowerReserveQuote{Currency: energonmodel.ServicePriceCurrencyCNY}
	seenEndpoint := map[uint64]bool{}
	for _, target := range targets {
		service := services[target.ServiceID]
		if service == nil || service.ID == 0 {
			return PowerReserveQuote{}, fmt.Errorf("能力来源服务不存在或未开启")
		}
		endpoints := endpointsByService[service.ID]
		if len(endpoints) == 0 {
			return PowerReserveQuote{}, fmt.Errorf("来源服务“%s”没有可用服务接口", service.Name)
		}
		for _, endpoint := range endpoints {
			if endpoint == nil || seenEndpoint[endpoint.ID] {
				continue
			}
			seenEndpoint[endpoint.ID] = true
			endpointQuote := pricingservice.Calculate(ctx, endpoint.ID, pricingservice.Usage{})
			if endpointQuote.Status != energonmodel.CostPricingPriced && endpointQuote.Status != energonmodel.CostPricingMissingUsage {
				return PowerReserveQuote{}, fmt.Errorf("服务接口“%s”无法计费：%s", endpoint.Api, endpointQuote.Error)
			}
			if pricingservice.NormalizeCurrency(endpointQuote.Currency) != energonmodel.ServicePriceCurrencyCNY {
				return PowerReserveQuote{}, fmt.Errorf("服务接口“%s”的结算币种不是 CNY", endpoint.Api)
			}
			reserveCost := endpointQuote.CostMicros
			if endpointQuote.Mode == energonmodel.ServicePriceModeToken {
				reserveCost = endpointQuote.MaxCostMicros
				if reserveCost <= 0 {
					return PowerReserveQuote{}, fmt.Errorf("Token 计价接口“%s”必须配置大于 0 的预授权成本上限", endpoint.Api)
				}
			}
			if reserveCost > quote.CostMicros {
				quote.CostMicros = reserveCost
			}
			quote.EndpointIDs = append(quote.EndpointIDs, endpoint.ID)
		}
	}
	if len(quote.EndpointIDs) == 0 {
		return PowerReserveQuote{}, fmt.Errorf("能力没有可计费的服务接口")
	}
	return quote, nil
}

func billableServicesAndEndpoints(ctx context.Context, targets []*energonmodel.PowerTarget) (map[uint64]*energonmodel.Service, map[uint64][]*energonmodel.ServiceEndpoint) {
	serviceIDs := make([]any, 0, len(targets))
	seen := make(map[uint64]bool, len(targets))
	for _, target := range targets {
		if target == nil || target.ServiceID == 0 || seen[target.ServiceID] {
			continue
		}
		seen[target.ServiceID] = true
		serviceIDs = append(serviceIDs, target.ServiceID)
	}
	services := make(map[uint64]*energonmodel.Service, len(serviceIDs))
	endpointsByService := make(map[uint64][]*energonmodel.ServiceEndpoint, len(serviceIDs))
	if len(serviceIDs) == 0 {
		return services, endpointsByService
	}
	for _, service := range energonmodel.NewServiceModel().Select(ctx, map[string]any{
		"id": serviceIDs, "status": int16(1),
	}) {
		if service != nil {
			services[service.ID] = service
		}
	}
	for _, endpoint := range energonmodel.NewServiceEndpointModel().Select(ctx, map[string]any{
		"service_id": serviceIDs, "status": int16(1),
	}, map[string]any{"order": "service_id asc,sort asc,id asc"}) {
		if endpoint != nil {
			endpointsByService[endpoint.ServiceID] = append(endpointsByService[endpoint.ServiceID], endpoint)
		}
	}
	return services, endpointsByService
}

func billablePowerTargets(ctx context.Context, powerID uint64, powerTargetID uint64) ([]*energonmodel.PowerTarget, error) {
	if powerID == 0 {
		return nil, fmt.Errorf("计费能力不能为空")
	}
	if powerTargetID > 0 {
		target := energonmodel.NewPowerTargetModel().Find(ctx, map[string]any{
			"id":       powerTargetID,
			"power_id": powerID,
			"status":   int16(1),
		})
		if target == nil || target.ID == 0 {
			return nil, fmt.Errorf("指定能力来源不存在或未开启")
		}
		return []*energonmodel.PowerTarget{target}, nil
	}
	targets := energonmodel.NewPowerTargetModel().Select(ctx, map[string]any{
		"power_id": powerID,
		"status":   int16(1),
	}, map[string]any{"order": "sort asc,id asc"})
	if len(targets) == 0 {
		return nil, fmt.Errorf("能力没有可用来源")
	}
	return targets, nil
}
