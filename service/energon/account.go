package energon

import (
	"context"
	"fmt"
	"sort"

	botmodel "my/package/bot/model/energon"
)

type AccountSelector struct {
	repo Repo
}

func NewAccountSelector(repo Repo) AccountSelector {
	return AccountSelector{repo: repo}
}

func (s AccountSelector) Select(ctx context.Context, provider botmodel.Provider) (botmodel.Account, error) {
	accounts := s.repo.AccountsByProvider(ctx, provider.ID)
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
