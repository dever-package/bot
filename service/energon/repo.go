package energon

import (
	"context"
	"strconv"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
)

type Repo struct{}

func NewRepo() Repo {
	return Repo{}
}

func (r Repo) FindProvider(ctx context.Context, id uint64) (botmodel.Provider, bool) {
	return findRepoRecord(ctx, "provider:id:"+repoID(id), func() *botmodel.Provider {
		return botmodel.NewProviderModel().Find(ctx, map[string]any{"id": id})
	})
}

func (r Repo) Account(ctx context.Context, id uint64) (botmodel.Account, bool) {
	return findRepoRecord(ctx, "account:id:"+repoID(id), func() *botmodel.Account {
		return botmodel.NewAccountModel().Find(ctx, map[string]any{"id": id})
	})
}

func (r Repo) FindService(ctx context.Context, id uint64) (botmodel.Service, bool) {
	return findRepoRecord(ctx, "service:id:"+repoID(id), func() *botmodel.Service {
		return botmodel.NewServiceModel().Find(ctx, map[string]any{"id": id})
	})
}

func (r Repo) PowerByName(ctx context.Context, name string) (botmodel.Power, bool) {
	name = strings.TrimSpace(name)
	if name == "" {
		return botmodel.Power{}, false
	}
	return findRepoRecord(ctx, "power:name:"+name, func() *botmodel.Power {
		model := botmodel.NewPowerModel()
		if row := model.Find(ctx, map[string]any{"key": name}); row != nil {
			return row
		}
		return model.Find(ctx, map[string]any{"name": name})
	})
}

func (r Repo) Power(ctx context.Context, id uint64) (botmodel.Power, bool) {
	return findRepoRecord(ctx, "power:id:"+repoID(id), func() *botmodel.Power {
		return botmodel.NewPowerModel().Find(ctx, map[string]any{"id": id})
	})
}

func (r Repo) ParamMap(ctx context.Context) map[uint64]botmodel.Param {
	return cachedRepoValue(ctx, "params:map", func() map[uint64]botmodel.Param {
		rows := selectRows(func() []*botmodel.Param {
			return botmodel.NewParamModel().Select(ctx, map[string]any{})
		})
		result := make(map[uint64]botmodel.Param, len(rows))
		for _, row := range rows {
			result[row.ID] = row
		}
		return result
	})
}

func (r Repo) ListTargetsByPower(ctx context.Context, powerID uint64) []botmodel.PowerTarget {
	return cachedRepoValue(ctx, "targets:power:"+repoID(powerID), func() []botmodel.PowerTarget {
		return selectRows(func() []*botmodel.PowerTarget {
			return botmodel.NewPowerTargetModel().Select(ctx, map[string]any{"power_id": powerID})
		})
	})
}

func (r Repo) PowerParamsByPower(ctx context.Context, powerID uint64) []botmodel.PowerParam {
	return cachedRepoValue(ctx, "power-params:power:"+repoID(powerID), func() []botmodel.PowerParam {
		return selectRows(func() []*botmodel.PowerParam {
			return botmodel.NewPowerParamModel().Select(ctx, map[string]any{"power_id": powerID})
		})
	})
}

func (r Repo) ServiceParamsByService(ctx context.Context, serviceID uint64) []botmodel.ServiceParam {
	return cachedRepoValue(ctx, "service-params:service:"+repoID(serviceID), func() []botmodel.ServiceParam {
		return selectRows(func() []*botmodel.ServiceParam {
			return botmodel.NewServiceParamModel().Select(ctx, map[string]any{"service_id": serviceID})
		})
	})
}

func (r Repo) ServiceEndpointsByService(ctx context.Context, serviceID uint64) []botmodel.ServiceEndpoint {
	return cachedRepoValue(ctx, "service-endpoints:service:"+repoID(serviceID), func() []botmodel.ServiceEndpoint {
		return selectRows(func() []*botmodel.ServiceEndpoint {
			return botmodel.NewServiceEndpointModel().Select(ctx, map[string]any{"service_id": serviceID})
		})
	})
}

func (r Repo) ParamOptionsByParam(ctx context.Context, paramID uint64) []botmodel.ParamOption {
	return cachedRepoValue(ctx, "param-options:param:"+repoID(paramID), func() []botmodel.ParamOption {
		return selectRows(func() []*botmodel.ParamOption {
			return botmodel.NewParamOptionModel().Select(ctx, map[string]any{"param_id": paramID})
		})
	})
}

func (r Repo) FindPowerTarget(ctx context.Context, id uint64) (botmodel.PowerTarget, bool) {
	return findRepoRecord(ctx, "power-target:id:"+repoID(id), func() *botmodel.PowerTarget {
		return botmodel.NewPowerTargetModel().Find(ctx, map[string]any{"id": id})
	})
}

func (r Repo) AccountsByProvider(ctx context.Context, providerID uint64) []botmodel.Account {
	return cachedRepoValue(ctx, "accounts:provider:"+repoID(providerID), func() []botmodel.Account {
		return selectRows(func() []*botmodel.Account {
			return botmodel.NewAccountModel().Select(ctx, map[string]any{"provider_id": providerID})
		})
	})
}

func findRepoRecord[T any](ctx context.Context, key string, load func() *T) (T, bool) {
	result := cachedRepoValue(ctx, key, func() cachedRepoRecord[T] {
		record := load()
		if record == nil {
			return cachedRepoRecord[T]{}
		}
		return cachedRepoRecord[T]{Value: *record, Found: true}
	})
	return result.Value, result.Found
}

func repoID(id uint64) string {
	return strconv.FormatUint(id, 10)
}

func selectRows[T any](load func() []*T) []T {
	records := load()
	if len(records) == 0 {
		return nil
	}
	rows := make([]T, 0, len(records))
	for _, record := range records {
		if record != nil {
			rows = append(rows, *record)
		}
	}
	if len(rows) == 0 {
		return nil
	}
	return rows
}
