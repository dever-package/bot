package energon

import (
	"context"
	"sort"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
)

type availablePowerTarget struct {
	Target   botmodel.PowerTarget
	Service  botmodel.Service
	Provider botmodel.Provider
}

// AvailableToolPowers returns enabled, non-embedding powers with at least one
// usable source. Passing no IDs resolves the complete tool catalog.
func (s GatewayService) AvailableToolPowers(ctx context.Context, powerIDs []uint64) []botmodel.Power {
	filter := map[string]any{"status": StatusActive}
	if values := uniquePowerAvailabilityValues(powerIDs); len(values) > 0 {
		filter["id"] = values
	}
	rows := selectRows(func() []*botmodel.Power {
		return botmodel.NewPowerModel().Select(ctx, filter, map[string]any{"order": "main.id asc"})
	})
	candidateIDs := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if strings.EqualFold(strings.TrimSpace(row.Kind), "embeddings") {
			continue
		}
		candidateIDs = append(candidateIDs, row.ID)
	}
	available := s.AvailablePowerIDs(ctx, candidateIDs)
	result := make([]botmodel.Power, 0, len(available))
	for _, row := range rows {
		if _, exists := available[row.ID]; !exists || strings.EqualFold(strings.TrimSpace(row.Kind), "embeddings") {
			continue
		}
		result = append(result, row)
	}
	return result
}

// AvailablePowerIDs reports powers that have at least one source which can
// reach the gateway. It deliberately stops before input-dependent endpoint
// matching, which is validated again when a request is executed.
func (s GatewayService) AvailablePowerIDs(ctx context.Context, powerIDs []uint64) map[uint64]struct{} {
	availableTargets := s.availablePowerTargets(ctx, powerIDs)
	result := make(map[uint64]struct{}, len(availableTargets))
	for powerID, targets := range availableTargets {
		if len(targets) > 0 {
			result[powerID] = struct{}{}
		}
	}
	return result
}

func (s GatewayService) availablePowerTargets(
	ctx context.Context,
	powerIDs []uint64,
) map[uint64][]availablePowerTarget {
	powerValues := uniquePowerAvailabilityValues(powerIDs)
	if len(powerValues) == 0 {
		return map[uint64][]availablePowerTarget{}
	}

	targets := selectRows(func() []*botmodel.PowerTarget {
		return botmodel.NewPowerTargetModel().Select(ctx, map[string]any{
			"power_id": powerValues,
			"status":   StatusActive,
		})
	})
	serviceValues := powerAvailabilityTargetServiceValues(targets)
	if len(serviceValues) == 0 {
		return map[uint64][]availablePowerTarget{}
	}

	services := selectRows(func() []*botmodel.Service {
		return botmodel.NewServiceModel().Select(ctx, map[string]any{
			"id":     serviceValues,
			"status": StatusActive,
		})
	})
	servicesByID := make(map[uint64]botmodel.Service, len(services))
	providerIDs := make([]uint64, 0, len(services))
	for _, service := range services {
		servicesByID[service.ID] = service
		providerIDs = append(providerIDs, service.ProviderID)
	}

	providerValues := uniquePowerAvailabilityValues(providerIDs)
	if len(providerValues) == 0 {
		return map[uint64][]availablePowerTarget{}
	}
	providers := selectRows(func() []*botmodel.Provider {
		return botmodel.NewProviderModel().Select(ctx, map[string]any{
			"id":     providerValues,
			"status": StatusActive,
		})
	})
	providersByID := make(map[uint64]botmodel.Provider, len(providers))
	for _, provider := range providers {
		providersByID[provider.ID] = provider
	}

	servicesWithAccount := availablePowerServiceAccounts(ctx, services, providersByID)
	servicesWithEndpoint := availablePowerServiceEndpoints(ctx, servicesByID)
	result := map[uint64][]availablePowerTarget{}
	for _, target := range targets {
		service, serviceExists := servicesByID[target.ServiceID]
		provider, providerExists := providersByID[service.ProviderID]
		if !serviceExists || !providerExists ||
			!servicesWithAccount[service.ID] || !servicesWithEndpoint[service.ID] {
			continue
		}
		result[target.PowerID] = append(result[target.PowerID], availablePowerTarget{
			Target: target, Service: service, Provider: provider,
		})
	}
	for powerID := range result {
		sort.SliceStable(result[powerID], func(i, j int) bool {
			left := result[powerID][i].Target
			right := result[powerID][j].Target
			if left.Sort == right.Sort {
				return left.ID < right.ID
			}
			return left.Sort < right.Sort
		})
	}
	return result
}

func availablePowerServiceAccounts(
	ctx context.Context,
	services []botmodel.Service,
	providersByID map[uint64]botmodel.Provider,
) map[uint64]bool {
	result := make(map[uint64]bool, len(services))
	dedicatedAccountIDs := make([]uint64, 0)
	commonProviderIDs := make([]uint64, 0)
	for _, service := range services {
		provider, exists := providersByID[service.ProviderID]
		if !exists {
			continue
		}
		if isLocalProvider(provider) {
			result[service.ID] = true
			continue
		}
		if serviceAllowsAnonymousAccount(provider, service) {
			result[service.ID] = true
			continue
		}
		if service.AccountID > 0 {
			dedicatedAccountIDs = append(dedicatedAccountIDs, service.AccountID)
			continue
		}
		commonProviderIDs = append(commonProviderIDs, provider.ID)
	}

	dedicatedAccounts := map[uint64]botmodel.Account{}
	if values := uniquePowerAvailabilityValues(dedicatedAccountIDs); len(values) > 0 {
		rows := selectRows(func() []*botmodel.Account {
			return botmodel.NewAccountModel().Select(ctx, map[string]any{
				"id": values, "status": StatusActive,
			})
		})
		for _, account := range rows {
			dedicatedAccounts[account.ID] = account
		}
	}
	commonAccounts := map[uint64]bool{}
	if values := uniquePowerAvailabilityValues(commonProviderIDs); len(values) > 0 {
		rows := selectRows(func() []*botmodel.Account {
			return botmodel.NewAccountModel().Select(ctx, map[string]any{
				"provider_id": values,
				"scope":       botmodel.AccountScopeCommon,
				"status":      StatusActive,
			})
		})
		for _, account := range rows {
			commonAccounts[account.ProviderID] = true
		}
	}
	for _, service := range services {
		if result[service.ID] {
			continue
		}
		if service.AccountID == 0 {
			result[service.ID] = commonAccounts[service.ProviderID]
			continue
		}
		account, exists := dedicatedAccounts[service.AccountID]
		result[service.ID] = exists && account.ProviderID == service.ProviderID
	}
	return result
}

func availablePowerServiceEndpoints(
	ctx context.Context,
	servicesByID map[uint64]botmodel.Service,
) map[uint64]bool {
	serviceIDs := make([]uint64, 0, len(servicesByID))
	for serviceID := range servicesByID {
		serviceIDs = append(serviceIDs, serviceID)
	}
	values := uniquePowerAvailabilityValues(serviceIDs)
	if len(values) == 0 {
		return map[uint64]bool{}
	}
	rows := selectRows(func() []*botmodel.ServiceEndpoint {
		return botmodel.NewServiceEndpointModel().Select(ctx, map[string]any{
			"service_id": values,
			"status":     StatusActive,
		})
	})
	result := make(map[uint64]bool, len(servicesByID))
	for _, endpoint := range rows {
		_, exists := servicesByID[endpoint.ServiceID]
		if exists && strings.TrimSpace(endpoint.Api) != "" {
			result[endpoint.ServiceID] = true
		}
	}
	return result
}

func powerAvailabilityTargetServiceValues(targets []botmodel.PowerTarget) []any {
	serviceIDs := make([]uint64, 0, len(targets))
	for _, target := range targets {
		serviceIDs = append(serviceIDs, target.ServiceID)
	}
	return uniquePowerAvailabilityValues(serviceIDs)
}

func uniquePowerAvailabilityValues(ids []uint64) []any {
	seen := map[uint64]struct{}{}
	values := make([]any, 0, len(ids))
	for _, id := range ids {
		if id == 0 {
			continue
		}
		if _, exists := seen[id]; exists {
			continue
		}
		seen[id] = struct{}{}
		values = append(values, id)
	}
	return values
}
