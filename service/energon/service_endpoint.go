package energon

import (
	"context"
	"fmt"
	"strings"

	botmodel "my/package/bot/model/energon"
	botinput "my/package/bot/service/energon/input"
	botprotocol "my/package/bot/service/energon/protocol"
)

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
