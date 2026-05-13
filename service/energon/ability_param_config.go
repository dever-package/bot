package energon

import (
	"context"
	"fmt"
	"strings"

	botmodel "my/package/bot/model/energon"
	botinput "my/package/bot/service/energon/input"
)

type TestParam = botinput.TestParam
type TestParamOption = botinput.TestParamOption
type TestParamConfig = botinput.TestParamConfig
type TestSource = botinput.TestSource

func (s GatewayService) TestParams(ctx context.Context, powerKey string) ([]TestParam, error) {
	config, err := s.TestParamConfig(ctx, powerKey, 0)
	if err != nil {
		return nil, err
	}
	return config.Params, nil
}

func (s GatewayService) TestParamConfig(ctx context.Context, powerKey string, targetID uint64) (TestParamConfig, error) {
	powerKey = strings.TrimSpace(powerKey)
	if powerKey == "" {
		return TestParamConfig{}, fmt.Errorf("能力不能为空")
	}

	power, ok := s.repo.PowerByName(ctx, powerKey)
	if !ok {
		return TestParamConfig{}, fmt.Errorf("未匹配到能力: %s", powerKey)
	}

	sourceRule := normalizePowerSourceRule(int(power.SourceRule))
	if sourceRule != powerSourceRulePick {
		targetID = 0
	}
	sources, selectedTargetID := s.testSources(ctx, power, targetID)
	serviceID := s.testTargetServiceID(ctx, power.ID, selectedTargetID)
	params := botinput.BuildTestParams(ctx, s.repo, power.ID, serviceID)
	return TestParamConfig{
		SourceRule:       sourceRule,
		SelectedTargetID: selectedTargetID,
		Sources:          sources,
		Params:           params,
	}, nil
}

func (s GatewayService) testTargetServiceID(ctx context.Context, powerID uint64, targetID uint64) uint64 {
	if targetID == 0 {
		return 0
	}
	target, ok := s.repo.FindPowerTarget(ctx, targetID)
	if !ok || target.PowerID != powerID || !isActive(target.Status) {
		return 0
	}
	return target.ServiceID
}

func (s GatewayService) testSources(ctx context.Context, power botmodel.Power, selectedTargetID uint64) ([]TestSource, uint64) {
	targets := s.dispatcher.OrderPowerTargets(s.repo.ListTargetsByPower(ctx, power.ID))
	sources := make([]TestSource, 0, len(targets))
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
		source := TestSource{
			ID:           target.ID,
			TargetID:     target.ID,
			ServiceID:    service.ID,
			ServiceName:  service.Name,
			ProviderID:   provider.ID,
			ProviderName: provider.Name,
			Name:         testSourceName(provider.Name, service.Name),
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

func testSourceName(providerName string, serviceName string) string {
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
