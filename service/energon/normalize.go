package energon

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/shemic/dever/util"

	botmodel "my/package/bot/model/energon"
	botlog "my/package/bot/service/energon/log"
	botprotocol "my/package/bot/service/energon/protocol"
	botprovider "my/package/bot/service/energon/provider"
	botruntime "my/package/bot/service/energon/runtime"
)

func (s GatewayService) handleNormalize(ctx context.Context, req *botprotocol.ShemicRequest) (*GatewayResponse, error) {
	plan, err := s.resolveNormalizePlan(ctx, req)
	if err != nil {
		return nil, err
	}

	var lastErr error
	attempts := make([]GatewayAttempt, 0, len(plan.targets))
	for _, target := range plan.targets {
		selected, err := s.selectTarget(ctx, plan.power, target)
		if err != nil {
			lastErr = err
			attempts = append(attempts, buildTargetSelectAttempt(target, err))
			continue
		}

		result, err := s.callNormalizeTarget(ctx, req, selected)
		attempts = append(attempts, result.Attempt)
		if err == nil {
			result.Attempts = attempts
			return s.buildGatewayResponse(req, selected, result), nil
		}
		lastErr = err
	}

	if lastErr != nil {
		return nil, lastErr
	}
	return nil, fmt.Errorf("调用失败")
}

type normalizePlan struct {
	power   botmodel.Power
	targets []botmodel.PowerTarget
}

func (s GatewayService) resolveNormalizePlan(ctx context.Context, req *botprotocol.ShemicRequest) (normalizePlan, error) {
	power, ok := s.repo.PowerByName(ctx, req.Name)
	if !ok || !isActive(power.Status) {
		return normalizePlan{}, fmt.Errorf("未匹配到 Energon 能力: %s", req.Name)
	}

	targets := orderActivePowerTargets(s.repo.ListTargetsByPower(ctx, power.ID))
	if targetID := requestedSourceTargetID(req); targetID > 0 && normalizePowerSourceRule(int(power.SourceRule)) == powerSourceRulePick {
		targets = filterRequestedPowerTarget(targets, targetID)
		if len(targets) == 0 {
			return normalizePlan{}, fmt.Errorf("指定来源不属于当前能力: %d", targetID)
		}
	}
	if len(targets) == 0 {
		return normalizePlan{}, fmt.Errorf("能力没有可用实现: %s", req.Name)
	}

	return normalizePlan{
		power:   power,
		targets: targets,
	}, nil
}

func requestedSourceTargetID(req *botprotocol.ShemicRequest) uint64 {
	if req == nil {
		return 0
	}
	for _, payload := range []map[string]any{req.Raw.Body, req.Options} {
		if payload == nil {
			continue
		}
		for _, key := range []string{"source_target_id", "sourceTargetId", "power_target_id", "powerTargetId"} {
			if id := util.ToUint64(payload[key]); id > 0 {
				return id
			}
		}
	}
	return 0
}

func filterRequestedPowerTarget(targets []botmodel.PowerTarget, targetID uint64) []botmodel.PowerTarget {
	for _, target := range targets {
		if target.ID == targetID {
			return []botmodel.PowerTarget{target}
		}
	}
	return nil
}

func buildTargetSelectAttempt(target botmodel.PowerTarget, err error) GatewayAttempt {
	attempt := GatewayAttempt{
		PowerTargetID: target.ID,
		ServiceID:     target.ServiceID,
		Status:        StatusFail,
	}
	if err != nil {
		attempt.Error = err.Error()
	}
	return attempt
}

func buildCallAttempt(selected selectedTarget, status string, logItem botmodel.Log, err error) GatewayAttempt {
	attempt := GatewayAttempt{
		PowerTargetID: selected.PowerTarget.ID,
		ServiceID:     selected.Service.ID,
		ServiceName:   selected.Service.Name,
		ProviderID:    selected.Provider.ID,
		ProviderName:  selected.Provider.Name,
		AccountID:     selected.Account.ID,
		AccountName:   selected.Account.Name,
		Status:        status,
		LogID:         logItem.ID,
		Latency:       logItem.Latency,
	}
	if err != nil {
		attempt.Error = err.Error()
	}
	return attempt
}

func (s GatewayService) recordCallLog(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
	status string,
	latency time.Duration,
	result string,
	nativeRequests ...botprovider.Request,
) botmodel.Log {
	record := botlog.Record(ctx, botmodel.Log{
		RequestID:     req.RequestID,
		Mode:          req.Mode,
		Protocol:      req.Protocol,
		PowerID:       selected.Power.ID,
		PowerKey:      selected.Power.Key,
		PowerName:     selected.Power.Name,
		PowerTargetID: selected.PowerTarget.ID,
		PowerParams:   encodeLogJSON(buildPowerParamsLog(req, nativeRequests...)),
		ServiceID:     selected.Service.ID,
		ServiceName:   selected.Service.Name,
		ProviderID:    selected.Provider.ID,
		ProviderName:  selected.Provider.Name,
		AccountID:     selected.Account.ID,
		AccountName:   selected.Account.Name,
		ServiceApi:    selected.ServiceAPI,
		Status:        status,
		Latency:       latency.Milliseconds(),
		Result:        result,
	})
	if status == StatusSuccess {
		botruntime.Record(ctx, selected.Service.ID, latency)
	}
	return record
}

func buildPowerParamsLog(req *botprotocol.ShemicRequest, nativeRequests ...botprovider.Request) map[string]any {
	payload := map[string]any{
		"set":     req.Set,
		"input":   req.Input,
		"history": req.History,
		"options": req.Options,
	}
	if len(nativeRequests) == 0 {
		return payload
	}

	nativeReq := nativeRequests[0]
	payload["channel"] = map[string]any{
		"url":     nativeReq.URL,
		"method":  nativeReq.Method,
		"headers": maskDebugHeaders(nativeReq.Headers),
		"body":    nativeReq.Body,
	}
	return payload
}

func encodeFailureLogResult(stage string, message string) string {
	return encodeLogJSON(map[string]any{
		"stage":   strings.TrimSpace(stage),
		"message": strings.TrimSpace(message),
	})
}

func encodeLogJSON(value any) string {
	if value == nil {
		return "{}"
	}
	raw, err := json.MarshalIndent(value, "", "  ")
	if err != nil {
		return "{}"
	}
	return string(raw)
}

func formatProviderStatusError(method string, url string, resp *botprovider.Response) string {
	if resp == nil {
		return fmt.Sprintf("%s %s status=unknown", strings.TrimSpace(method), strings.TrimSpace(url))
	}
	parts := []string{
		fmt.Sprintf("status=%d", resp.StatusCode),
		fmt.Sprintf("method=%s", strings.TrimSpace(method)),
		fmt.Sprintf("url=%s", strings.TrimSpace(url)),
	}
	if body := compactResponseBody(resp.Body); body != "" {
		parts = append(parts, "body="+body)
	}
	return strings.Join(parts, " ")
}

func compactResponseBody(value any) string {
	if value == nil {
		return ""
	}
	switch current := value.(type) {
	case string:
		return limitDebugText(current, 600)
	default:
		raw, err := json.Marshal(current)
		if err != nil {
			return limitDebugText(fmt.Sprintf("%v", current), 600)
		}
		return limitDebugText(string(raw), 600)
	}
}

func limitDebugText(value string, limit int) string {
	value = strings.TrimSpace(value)
	if len(value) <= limit {
		return value
	}
	if limit <= 3 {
		return value[:limit]
	}
	return value[:limit-3] + "..."
}
