package energon

import (
	"context"
	"fmt"
	"sort"
	"strings"

	botmodel "my/package/bot/model/energon"
	botinput "my/package/bot/service/energon/input"
	botprotocol "my/package/bot/service/energon/protocol"
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

func selectProviderAccount(ctx context.Context, repo Repo, provider botmodel.Provider) (botmodel.Account, error) {
	accounts := repo.AccountsByProvider(ctx, provider.ID)
	active := make([]botmodel.Account, 0, len(accounts))
	for _, account := range accounts {
		if isActive(account.Status) {
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
		return botmodel.Account{}, fmt.Errorf("没有可用账号")
	}
	return active[0], nil
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
	if strings.TrimSpace(selected.ServiceAPI) == "" {
		return selectedTarget{}, missingServiceEndpointError(selected.Service)
	}
	return selected, nil
}

func missingServiceEndpointError(service botmodel.Service) error {
	return fmt.Errorf("来源服务“%s”没有可用服务接口", service.Name)
}
