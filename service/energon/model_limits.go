package energon

import (
	"context"
	"fmt"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
	botcapacity "github.com/dever-package/bot/service/energon/capacity"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	DefaultModelContextWindowTokens = 64000
	DefaultModelMaxOutputTokens     = 16000
)

type ModelLimits struct {
	ContextWindowTokens int      `json:"context_window_tokens"`
	MaxOutputTokens     int      `json:"max_output_tokens"`
	UsedFallback        bool     `json:"used_fallback,omitempty"`
	ServiceIDs          []uint64 `json:"service_ids,omitempty"`
}

func (limits ModelLimits) Source() string {
	if limits.UsedFallback {
		return "fallback"
	}
	return "service"
}

// ResolveModelLimits returns a conservative budget that remains valid when a
// text power falls back through its active source services.
func (s GatewayService) ResolveModelLimits(ctx context.Context, powerKey string) (ModelLimits, error) {
	power, ok := s.repo.PowerByName(ctx, strings.TrimSpace(powerKey))
	if !ok || !isActive(power.Status) {
		return ModelLimits{}, fmt.Errorf("未匹配到 Energon 能力: %s", strings.TrimSpace(powerKey))
	}
	if !strings.EqualFold(strings.TrimSpace(power.Kind), "text") {
		return ModelLimits{}, fmt.Errorf("模型容量只适用于文本能力: %s", power.Name)
	}
	targets := orderActivePowerTargets(s.repo.ListTargetsByPower(ctx, power.ID))
	if len(targets) == 0 {
		return ModelLimits{}, fmt.Errorf("能力没有可用实现: %s", power.Name)
	}

	result := ModelLimits{}
	seenServices := make(map[uint64]struct{}, len(targets))
	var lastErr error
	for _, target := range targets {
		selected, err := s.selectTarget(ctx, power, target)
		if err != nil {
			lastErr = err
			continue
		}
		serviceLimits, err := limitsForService(selected.Service)
		if err != nil {
			return ModelLimits{}, err
		}
		result.ContextWindowTokens = minimumPositive(result.ContextWindowTokens, serviceLimits.ContextWindowTokens)
		result.MaxOutputTokens = minimumPositive(result.MaxOutputTokens, serviceLimits.MaxOutputTokens)
		result.UsedFallback = result.UsedFallback || serviceLimits.UsedFallback
		if _, exists := seenServices[selected.Service.ID]; !exists {
			seenServices[selected.Service.ID] = struct{}{}
			result.ServiceIDs = append(result.ServiceIDs, selected.Service.ID)
		}
	}
	if len(result.ServiceIDs) == 0 {
		if lastErr != nil {
			return ModelLimits{}, lastErr
		}
		return ModelLimits{}, fmt.Errorf("能力没有可用来源服务: %s", power.Name)
	}
	return result, nil
}

func limitsForService(service botmodel.Service) (ModelLimits, error) {
	contextTokens := service.ContextWindowTokens
	maxOutputTokens := service.MaxOutputTokens
	usedFallback := false
	if contextTokens <= 0 {
		contextTokens = DefaultModelContextWindowTokens
		usedFallback = true
	}
	if maxOutputTokens <= 0 {
		maxOutputTokens = DefaultModelMaxOutputTokens
		usedFallback = true
	}
	if maxOutputTokens >= contextTokens {
		return ModelLimits{}, fmt.Errorf(
			"来源服务“%s”的单次最大输出必须小于上下文窗口",
			strings.TrimSpace(service.Name),
		)
	}
	return ModelLimits{
		ContextWindowTokens: contextTokens,
		MaxOutputTokens:     maxOutputTokens,
		UsedFallback:        usedFallback,
		ServiceIDs:          []uint64{service.ID},
	}, nil
}

func minimumPositive(current int, incoming int) int {
	if current <= 0 || (incoming > 0 && incoming < current) {
		return incoming
	}
	return current
}

func withServiceOutputLimit(req *botprotocol.ShemicRequest, service botmodel.Service) *botprotocol.ShemicRequest {
	if req == nil || service.MaxOutputTokens <= 0 {
		return req
	}
	requested, err := botcapacity.Parse(req.Options["max_tokens"])
	if err != nil || requested <= 0 || requested <= service.MaxOutputTokens {
		return req
	}

	next := *req
	next.Set = cloneAnyMap(req.Set)
	next.Input = cloneAnyMap(req.Input)
	next.History = append([]any(nil), req.History...)
	next.Options = cloneAnyMap(req.Options)
	next.Options["max_tokens"] = service.MaxOutputTokens
	next.Raw = req.Raw
	next.Raw.Body = cloneAnyMap(req.Raw.Body)
	if next.Raw.Body == nil {
		next.Raw.Body = map[string]any{}
	}
	next.Raw.Body["options"] = cloneAnyMap(next.Options)
	return &next
}
