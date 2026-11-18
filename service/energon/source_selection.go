package energon

import (
	"context"
	"fmt"
	"slices"

	botmodel "github.com/dever-package/bot/model/energon"
	botinput "github.com/dever-package/bot/service/energon/input"
	botschedule "github.com/dever-package/bot/service/energon/schedule"
)

// Admission can wait. Recheck mutable configuration at the point that grants
// execution, and use the account's current credential on the original host.
func currentSourceSelection(ctx context.Context, selected selectedTarget) (current selectedTarget, err error) {
	defer botschedule.StorageError(&err)
	provider := botmodel.NewProviderModel().Find(ctx, map[string]any{"id": selected.Provider.ID})
	if provider == nil || !isActive(provider.Status) {
		return selected, fmt.Errorf("来源已停用或删除")
	}
	if provider.Protocol != selected.Provider.Protocol || provider.ProtocolOption != selected.Provider.ProtocolOption {
		return selected, fmt.Errorf("来源协议已改变，未执行原调用")
	}
	account := botmodel.Account{}
	if selected.Account.ID != 0 {
		current := botmodel.NewAccountModel().Find(ctx, map[string]any{"id": selected.Account.ID})
		if current == nil || !isActive(current.Status) || current.ProviderID != provider.ID {
			return selected, fmt.Errorf("原来源账号已停用或删除")
		}
		account = *current
	}
	effective := withAccountHost(*provider, account)
	if effective.Host != selected.Provider.Host {
		return selected, fmt.Errorf("来源地址已改变，未执行原调用")
	}
	service := botmodel.NewServiceModel().Find(ctx, map[string]any{"id": selected.Service.ID})
	if service == nil || !isActive(service.Status) || service.ProviderID != provider.ID {
		return selected, fmt.Errorf("原来源服务已停用或删除")
	}
	if service.Path != selected.Service.Path {
		return selected, fmt.Errorf("来源服务路径已改变，未执行原调用")
	}
	if selected.PowerTarget.ID != 0 {
		target := botmodel.NewPowerTargetModel().Find(ctx, map[string]any{"id": selected.PowerTarget.ID})
		if target == nil || !isActive(target.Status) || target.PowerID != selected.Power.ID || target.ServiceID != service.ID {
			return selected, fmt.Errorf("原能力来源绑定已改变，未执行原调用")
		}
	}
	if selected.ServiceEndpoint.ID != 0 {
		endpoint := botmodel.NewServiceEndpointModel().Find(ctx, map[string]any{"id": selected.ServiceEndpoint.ID})
		if endpoint == nil || !isActive(endpoint.Status) || endpoint.ServiceID != service.ID || endpoint.Api != selected.ServiceAPI {
			return selected, fmt.Errorf("原来源接口已停用或改变")
		}
		selected.ServiceEndpoint = *endpoint
	}
	selected.Provider, selected.Account, selected.Service = effective, account, *service
	return selected, nil
}

// Binding changes affect new submissions, never the identity of an accepted task.
func validateServiceAccount(ctx context.Context, selected selectedTarget) error {
	if selected.Account.ID == 0 {
		return nil
	}
	ids := serviceAccountIDs(ctx, selected.Service.ID)
	if (len(ids) > 0 && !slices.Contains(ids, selected.Account.ID)) || (len(ids) == 0 && selected.Account.Scope == botmodel.AccountScopeDedicated) {
		return fmt.Errorf("来源账号已不属于该服务的可用账号，未提交原调用")
	}
	return nil
}

func (s GatewayService) refreshRemoteCredential(ctx context.Context, prepared remoteCallPreparation) (remoteCallPreparation, error) {
	prepared.Selected = ctx.Value(sourceCallKey{}).(*sourceCall).selected
	prepared.NativeInput.Provider = prepared.Selected.Provider
	prepared.NativeInput.Account = prepared.Selected.Account
	prepared.NativeInput.Service = prepared.Selected.Service
	prepared.NativeInput.ServiceEndpoint = prepared.Selected.ServiceEndpoint
	nativeInput := prepared.NativeInput
	mapped, err := botinput.FormatMappedFiles(ctx, s.repo, nativeInput.Mapped)
	if err != nil {
		return prepared, err
	}
	nativeInput.Mapped = mapped
	request, err := prepared.Adapter.BuildNativeRequest(nativeInput)
	if err != nil {
		return prepared, err
	}
	request.Operation = "submit"
	prepared.NativeRequest = request
	return prepared, nil
}
