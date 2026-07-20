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

func selectServiceAccount(
	ctx context.Context,
	repo Repo,
	provider botmodel.Provider,
	service botmodel.Service,
) (botmodel.Account, error) {
	if service.AccountID > 0 {
		account, ok := repo.Account(ctx, service.AccountID)
		if !ok {
			return botmodel.Account{}, fmt.Errorf("来源服务“%s”指定的账号不存在", service.Name)
		}
		if account.ProviderID != provider.ID {
			return botmodel.Account{}, fmt.Errorf("来源服务“%s”指定的账号不属于来源“%s”", service.Name, provider.Name)
		}
		if !isActive(account.Status) {
			return botmodel.Account{}, fmt.Errorf("来源服务“%s”指定的账号“%s”已停用", service.Name, account.Name)
		}
		return account, nil
	}

	accounts := repo.AccountsByProvider(ctx, provider.ID)
	active := make([]botmodel.Account, 0, len(accounts))
	for _, account := range accounts {
		if isActive(account.Status) && botmodel.NormalizeAccountScope(int(account.Scope)) == botmodel.AccountScopeCommon {
			active = append(active, account)
		}
	}
	sort.SliceStable(active, func(i, j int) bool {
		if active[i].Sort == active[j].Sort {
			return active[i].ID < active[j].ID
		}
		return active[i].Sort < active[j].Sort
	})
	if len(active) == 0 {
		return botmodel.Account{}, fmt.Errorf("来源“%s”没有可用通用账号", provider.Name)
	}
	return active[0], nil
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
