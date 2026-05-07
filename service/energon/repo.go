package energon

import (
	"context"

	botmodel "my/package/bot/model/energon"
)

type Repo struct{}

func NewRepo() Repo {
	return Repo{}
}

func (Repo) ListProviders(ctx context.Context) []botmodel.Provider {
	return selectRows(func() []*botmodel.Provider {
		return botmodel.NewProviderModel().Select(ctx, map[string]any{})
	})
}

func (Repo) Accounts(ctx context.Context) []botmodel.Account {
	return selectRows(func() []*botmodel.Account {
		return botmodel.NewAccountModel().Select(ctx, map[string]any{})
	})
}

func (Repo) Powers(ctx context.Context) []botmodel.Power {
	return selectRows(func() []*botmodel.Power {
		return botmodel.NewPowerModel().Select(ctx, map[string]any{})
	})
}

func (Repo) Services(ctx context.Context) []botmodel.Service {
	return selectRows(func() []*botmodel.Service {
		return botmodel.NewServiceModel().Select(ctx, map[string]any{})
	})
}

func (Repo) Params(ctx context.Context) []botmodel.Param {
	return selectRows(func() []*botmodel.Param {
		return botmodel.NewParamModel().Select(ctx, map[string]any{})
	})
}

func (Repo) PowerParams(ctx context.Context) []botmodel.PowerParam {
	return selectRows(func() []*botmodel.PowerParam {
		return botmodel.NewPowerParamModel().Select(ctx, map[string]any{})
	})
}

func (Repo) ServiceParams(ctx context.Context) []botmodel.ServiceParam {
	return selectRows(func() []*botmodel.ServiceParam {
		return botmodel.NewServiceParamModel().Select(ctx, map[string]any{})
	})
}

func (Repo) ServiceEndpoints(ctx context.Context) []botmodel.ServiceEndpoint {
	return selectRows(func() []*botmodel.ServiceEndpoint {
		return botmodel.NewServiceEndpointModel().Select(ctx, map[string]any{})
	})
}

func (Repo) ParamOptions(ctx context.Context) []botmodel.ParamOption {
	return selectRows(func() []*botmodel.ParamOption {
		return botmodel.NewParamOptionModel().Select(ctx, map[string]any{})
	})
}

func (Repo) ListPowerTargets(ctx context.Context) []botmodel.PowerTarget {
	return selectRows(func() []*botmodel.PowerTarget {
		return botmodel.NewPowerTargetModel().Select(ctx, map[string]any{})
	})
}

func (r Repo) FindProvider(ctx context.Context, id uint64) (botmodel.Provider, bool) {
	for _, row := range r.ListProviders(ctx) {
		if row.ID == id {
			return row, true
		}
	}
	return botmodel.Provider{}, false
}

func (r Repo) Account(ctx context.Context, id uint64) (botmodel.Account, bool) {
	for _, row := range r.Accounts(ctx) {
		if row.ID == id {
			return row, true
		}
	}
	return botmodel.Account{}, false
}

func (r Repo) FindService(ctx context.Context, id uint64) (botmodel.Service, bool) {
	for _, row := range r.Services(ctx) {
		if row.ID == id {
			return row, true
		}
	}
	return botmodel.Service{}, false
}

func (r Repo) PowerByName(ctx context.Context, name string) (botmodel.Power, bool) {
	for _, row := range r.Powers(ctx) {
		if row.Key == name || row.Name == name {
			return row, true
		}
	}
	return botmodel.Power{}, false
}

func (r Repo) Power(ctx context.Context, id uint64) (botmodel.Power, bool) {
	for _, row := range r.Powers(ctx) {
		if row.ID == id {
			return row, true
		}
	}
	return botmodel.Power{}, false
}

func (r Repo) ParamMap(ctx context.Context) map[uint64]botmodel.Param {
	rows := r.Params(ctx)
	result := make(map[uint64]botmodel.Param, len(rows))
	for _, row := range rows {
		result[row.ID] = row
	}
	return result
}

func (r Repo) ListTargetsByPower(ctx context.Context, powerID uint64) []botmodel.PowerTarget {
	rows := r.ListPowerTargets(ctx)
	result := make([]botmodel.PowerTarget, 0, len(rows))
	for _, row := range rows {
		if row.PowerID == powerID {
			result = append(result, row)
		}
	}
	return result
}

func (r Repo) PowerParamsByPower(ctx context.Context, powerID uint64) []botmodel.PowerParam {
	rows := r.PowerParams(ctx)
	result := make([]botmodel.PowerParam, 0, len(rows))
	for _, row := range rows {
		if row.PowerID == powerID {
			result = append(result, row)
		}
	}
	return result
}

func (r Repo) ServiceParamsByService(ctx context.Context, serviceID uint64) []botmodel.ServiceParam {
	rows := r.ServiceParams(ctx)
	result := make([]botmodel.ServiceParam, 0, len(rows))
	for _, row := range rows {
		if row.ServiceID == serviceID {
			result = append(result, row)
		}
	}
	return result
}

func (r Repo) ServiceEndpointsByService(ctx context.Context, serviceID uint64) []botmodel.ServiceEndpoint {
	rows := r.ServiceEndpoints(ctx)
	result := make([]botmodel.ServiceEndpoint, 0, len(rows))
	for _, row := range rows {
		if row.ServiceID == serviceID {
			result = append(result, row)
		}
	}
	return result
}

func (r Repo) ParamOptionsByParam(ctx context.Context, paramID uint64) []botmodel.ParamOption {
	rows := r.ParamOptions(ctx)
	result := make([]botmodel.ParamOption, 0, len(rows))
	for _, row := range rows {
		if row.ParamID == paramID {
			result = append(result, row)
		}
	}
	return result
}

func (r Repo) FindPowerTarget(ctx context.Context, id uint64) (botmodel.PowerTarget, bool) {
	for _, row := range r.ListPowerTargets(ctx) {
		if row.ID == id {
			return row, true
		}
	}
	return botmodel.PowerTarget{}, false
}

func (r Repo) AccountsByProvider(ctx context.Context, providerID uint64) []botmodel.Account {
	rows := r.Accounts(ctx)
	result := make([]botmodel.Account, 0, len(rows))
	for _, row := range rows {
		if row.ProviderID == providerID {
			result = append(result, row)
		}
	}
	return result
}

func selectRows[T any](load func() []*T) (rows []T) {
	defer func() {
		if recover() != nil {
			rows = nil
		}
	}()

	records := load()
	if len(records) == 0 {
		return nil
	}
	rows = make([]T, 0, len(records))
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
