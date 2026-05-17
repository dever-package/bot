package energon

import (
	"context"
	"fmt"
	"strings"

	botmodel "my/package/bot/model/energon"
	botinput "my/package/bot/service/energon/input"
)

type PowerParam = botinput.PowerParam
type PowerParamOption = botinput.PowerParamOption
type PowerParamConfig = botinput.PowerParamConfig
type PowerSource = botinput.PowerSource

func (s GatewayService) PowerParams(ctx context.Context, powerKey string) ([]PowerParam, error) {
	config, err := s.PowerParamConfig(ctx, powerKey, 0)
	if err != nil {
		return nil, err
	}
	return config.Params, nil
}

func (s GatewayService) PowerParamConfig(ctx context.Context, powerKey string, targetID uint64) (PowerParamConfig, error) {
	powerKey = strings.TrimSpace(powerKey)
	if powerKey == "" {
		return PowerParamConfig{}, fmt.Errorf("能力不能为空")
	}

	power, ok := s.repo.PowerByName(ctx, powerKey)
	if !ok {
		return PowerParamConfig{}, fmt.Errorf("未匹配到能力: %s", powerKey)
	}

	sourceRule := normalizePowerSourceRule(int(power.SourceRule))
	if sourceRule != powerSourceRulePick {
		targetID = 0
	}
	sources, selectedTargetID := s.powerSources(ctx, power, targetID)
	serviceID := s.powerTargetServiceID(ctx, power.ID, selectedTargetID)
	params := botinput.BuildPowerParams(ctx, s.repo, power.ID, serviceID)
	return PowerParamConfig{
		SourceRule:       sourceRule,
		SelectedTargetID: selectedTargetID,
		Sources:          sources,
		Params:           params,
	}, nil
}

func (s GatewayService) powerTargetServiceID(ctx context.Context, powerID uint64, targetID uint64) uint64 {
	if targetID == 0 {
		return 0
	}
	target, ok := s.repo.FindPowerTarget(ctx, targetID)
	if !ok || target.PowerID != powerID || !isActive(target.Status) {
		return 0
	}
	return target.ServiceID
}

func (s GatewayService) powerSources(ctx context.Context, power botmodel.Power, selectedTargetID uint64) ([]PowerSource, uint64) {
	targets := orderActivePowerTargets(s.repo.ListTargetsByPower(ctx, power.ID))
	sources := make([]PowerSource, 0, len(targets))
	firstTargetID := uint64(0)
	selectedExists := false

	for _, target := range targets {
		if !isActive(target.Status) {
			continue
		}
		service, ok := s.repo.FindService(ctx, target.ServiceID)
		if !ok || !isActive(service.Status) {
			continue
		}
		provider, _ := s.repo.FindProvider(ctx, service.ProviderID)
		source := PowerSource{
			ID:           target.ID,
			TargetID:     target.ID,
			ServiceID:    service.ID,
			ServiceName:  service.Name,
			ProviderID:   provider.ID,
			ProviderName: provider.Name,
			Name:         powerSourceName(provider.Name, service.Name),
			Sort:         target.Sort,
		}
		sources = append(sources, source)
		if firstTargetID == 0 {
			firstTargetID = target.ID
		}
		if selectedTargetID > 0 && selectedTargetID == target.ID {
			selectedExists = true
		}
	}

	if selectedTargetID > 0 && selectedExists {
		return sources, selectedTargetID
	}
	return sources, firstTargetID
}

func powerSourceName(providerName string, serviceName string) string {
	serviceName = strings.TrimSpace(serviceName)
	providerName = strings.TrimSpace(providerName)
	if providerName == "" {
		return serviceName
	}
	if serviceName == "" || serviceName == providerName {
		return providerName
	}
	return providerName + " / " + serviceName
}
