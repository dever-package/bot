package energon

import (
	"context"
	"fmt"
	"sort"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
	botinput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func orderActivePowerTargets(items []botmodel.PowerTarget) []botmodel.PowerTarget {
	targets := make([]botmodel.PowerTarget, 0, len(items))
	for _, item := range items {
		if isActive(item.Status) {
			targets = append(targets, item)
		}
	}
	sort.SliceStable(targets, func(i, j int) bool {
		if targets[i].Sort == targets[j].Sort {
			return targets[i].ID < targets[j].ID
		}
		return targets[i].Sort < targets[j].Sort
	})
	return targets
}

// An empty binding selects common accounts; explicit bindings may include
// dedicated accounts. Selection here is only preparation, not admission.
func serviceAccountIDs(ctx context.Context, serviceID uint64) []uint64 {
	rows := botmodel.NewServiceAccountModel().Select(ctx, map[string]any{"service_id": serviceID})
	ids := make([]uint64, 0, len(rows))
	for _, row := range rows {
		ids = append(ids, row.AccountID)
	}
	return ids
}

func serviceAccounts(ctx context.Context, provider botmodel.Provider, service botmodel.Service) ([]botmodel.Account, error) {
	ids := serviceAccountIDs(ctx, service.ID)
	filters := map[string]any{"provider_id": provider.ID, "status": StatusActive}
	if len(ids) > 0 {
		filters["id"] = ids
	} else {
		filters["scope"] = botmodel.AccountScopeCommon
	}
	rows := botmodel.NewAccountModel().Select(ctx, filters)
	accounts := make([]botmodel.Account, 0, len(rows))
	for _, row := range rows {
		accounts = append(accounts, *row)
	}
	if len(accounts) == 0 && !(isWebContentProvider(provider) && len(ids) == 0) {
		return nil, fmt.Errorf("来源服务“%s”没有可用账号，请检查账号绑定及启用状态", service.Name)
	}
	return accounts, nil
}

func selectServiceAccount(ctx context.Context, provider botmodel.Provider, service botmodel.Service) (botmodel.Account, error) {
	accounts, err := serviceAccounts(ctx, provider, service)
	if err != nil || len(accounts) == 0 {
		return botmodel.Account{}, err
	}
	return accounts[0], nil
}

func withAccountHost(provider botmodel.Provider, account botmodel.Account) botmodel.Provider {
	if host := strings.TrimSpace(account.Host); host != "" {
		provider.Host = host
	}
	return provider
}

func (s GatewayService) applyServiceEndpoint(
	ctx context.Context,
	selected selectedTarget,
	mapped botprotocol.MappedInput,
) (selectedTarget, error) {
	endpoint, ok := botinput.SelectEndpoint(ctx, s.repo, selected.Service.ID, mapped)
	if !ok {
		return selectedTarget{}, missingServiceEndpointError(selected.Service)
	}
	if err := botprotocol.ValidateServiceEndpointType(selected.Provider.Protocol, endpoint.InterfaceType); err != nil {
		return selectedTarget{}, err
	}
	if api := strings.TrimSpace(endpoint.Api); api != "" {
		selected.ServiceAPI = api
	}
	selected.ServiceEndpoint = endpoint
	if strings.TrimSpace(selected.ServiceAPI) == "" {
		return selectedTarget{}, missingServiceEndpointError(selected.Service)
	}
	return selected, nil
}

func missingServiceEndpointError(service botmodel.Service) error {
	return fmt.Errorf("来源服务“%s”没有可用服务接口", service.Name)
}
