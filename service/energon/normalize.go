package energon

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/shemic/dever/util"

	botmodel "github.com/dever-package/bot/model/energon"
	botinput "github.com/dever-package/bot/service/energon/input"
	botlog "github.com/dever-package/bot/service/energon/log"
	botpricing "github.com/dever-package/bot/service/energon/pricing"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	botruntime "github.com/dever-package/bot/service/energon/runtime"
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

		result, err := s.callNormalizePowerTarget(ctx, req, selected)
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
	if err := preparePowerRequest(req, power); err != nil {
		return normalizePlan{}, err
	}

	targets := orderActivePowerTargets(s.repo.ListTargetsByPower(ctx, power.ID))
	if normalizePowerSourceRule(int(power.SourceRule)) == powerSourceRulePick {
		if targetID := requestedSourceTargetID(req); targetID > 0 {
			targets = filterRequestedPowerTarget(targets, targetID)
			if len(targets) == 0 {
				return normalizePlan{}, fmt.Errorf("指定来源不属于当前能力: %d", targetID)
			}
		}
	} else {
		compatible, reasons := s.compatiblePowerTargets(ctx, req, power, targets)
		if len(compatible) == 0 && len(targets) > 0 {
			return normalizePlan{}, fmt.Errorf("当前参数没有兼容的能力来源: %s", strings.Join(reasons, "；"))
		}
		targets = compatible
	}
	if len(targets) == 0 {
		return normalizePlan{}, fmt.Errorf("能力没有可用实现: %s", req.Name)
	}

	return normalizePlan{
		power:   power,
		targets: targets,
	}, nil
}

func (s GatewayService) compatiblePowerTargets(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	power botmodel.Power,
	targets []botmodel.PowerTarget,
) ([]botmodel.PowerTarget, []string) {
	compatible := make([]botmodel.PowerTarget, 0, len(targets))
	reasons := make([]string, 0, len(targets))
	for _, target := range targets {
		err := botinput.ValidateTargetCompatibility(ctx, s.repo, req, botinput.Target{
			PowerID:   power.ID,
			ServiceID: target.ServiceID,
		})
		if err == nil {
			compatible = append(compatible, target)
			continue
		}

		name := fmt.Sprintf("来源 %d", target.ID)
		if service, exists := s.repo.FindService(ctx, target.ServiceID); exists && strings.TrimSpace(service.Name) != "" {
			name = strings.TrimSpace(service.Name)
		}
		reasons = append(reasons, name+"："+err.Error())
	}
	return compatible, reasons
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
		PowerTargetID:     selected.PowerTarget.ID,
		ServiceID:         selected.Service.ID,
		ServiceName:       selected.Service.Name,
		ServiceEndpointID: selected.ServiceEndpoint.ID,
		ProviderID:        selected.Provider.ID,
		ProviderName:      selected.Provider.Name,
		AccountID:         selected.Account.ID,
		AccountName:       selected.Account.Name,
		Status:            status,
		LogID:             logItem.ID,
		Latency:           logItem.Latency,
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
	return s.recordCallLogInternal(ctx, req, selected, status, latency, result, tokenUsage{}, false, nativeRequests...)
}

func (s GatewayService) recordProviderCallLog(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
	status string,
	latency time.Duration,
	result string,
	nativeRequests ...botprovider.Request,
) botmodel.Log {
	return s.recordCallLogInternal(ctx, req, selected, status, latency, result, tokenUsage{}, true, nativeRequests...)
}

func (s GatewayService) recordCallLogWithUsage(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
	status string,
	latency time.Duration,
	result string,
	usage tokenUsage,
	nativeRequests ...botprovider.Request,
) botmodel.Log {
	return s.recordCallLogInternal(ctx, req, selected, status, latency, result, usage, true, nativeRequests...)
}

func (s GatewayService) recordCallLogInternal(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
	status string,
	latency time.Duration,
	result string,
	usage tokenUsage,
	costAttempted bool,
	nativeRequests ...botprovider.Request,
) botmodel.Log {
	powerParams := buildPowerParamsLog(req, nativeRequests...)
	if !usage.IsZero() {
		powerParams["usage"] = usage.Map()
	}
	record := botlog.Record(ctx, botmodel.Log{
		RequestID:         req.RequestID,
		Mode:              req.Mode,
		Protocol:          req.Protocol,
		PowerID:           selected.Power.ID,
		PowerKey:          selected.Power.Key,
		PowerName:         selected.Power.Name,
		PowerTargetID:     selected.PowerTarget.ID,
		PowerParams:       encodeLogJSON(sanitizeLogValue(powerParams, "")),
		ServiceID:         selected.Service.ID,
		ServiceName:       selected.Service.Name,
		ServiceEndpointID: selected.ServiceEndpoint.ID,
		ProviderID:        selected.Provider.ID,
		ProviderName:      selected.Provider.Name,
		AccountID:         selected.Account.ID,
		AccountName:       selected.Account.Name,
		ServiceApi:        selected.ServiceAPI,
		Status:            status,
		Latency:           latency.Milliseconds(),
		PromptTokens:      usage.PromptTokens,
		CompletionTokens:  usage.CompletionTokens,
		TotalTokens:       usage.TotalTokens,
		CachedTokens:      usage.CachedTokens,
		Result:            sanitizeLogJSON(result),
	})
	if status == StatusSuccess {
		botruntime.Record(ctx, selected.Service.ID, latency)
	}
	if costAttempted && record.ID > 0 && selected.ServiceEndpoint.ID > 0 {
		botpricing.RecordAttempt(ctx, botpricing.AttemptRecordRequest{
			Log:               record,
			Billing:           req.Billing,
			ServiceEndpointID: selected.ServiceEndpoint.ID,
			CallStatus:        status,
			Usage: botpricing.Usage{
				PromptTokens: usage.PromptTokens, CompletionTokens: usage.CompletionTokens, CachedTokens: usage.CachedTokens,
			},
		})
	}
	return record
}

func buildPowerParamsLog(req *botprotocol.ShemicRequest, nativeRequests ...botprovider.Request) map[string]any {
	payload := map[string]any{
		"set":           req.Set,
		"input":         req.Input,
		"history_count": len(req.History),
		"options":       req.Options,
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

type providerStatusError struct {
	message string
	code    string
}

func (err providerStatusError) Error() string {
	return err.message
}

func (err providerStatusError) ErrorCode() string {
	return err.code
}

func newProviderStatusError(method string, url string, resp *botprovider.Response) error {
	message := "来源返回失败: " + formatProviderStatusError(method, url, resp)
	return providerStatusError{message: message, code: providerResponseErrorCode(resp)}
}

func providerResponseErrorCode(resp *botprovider.Response) string {
	if resp == nil {
		return ""
	}
	values := make([]string, 0, 4)
	collectProviderErrorCodes(resp.Body, &values)
	for _, value := range values {
		switch strings.ToLower(strings.TrimSpace(value)) {
		case "context_length_exceeded", "context_window_exceeded", "max_context_length_exceeded", "context_overflow", "prompt_too_long", "input_too_long":
			return "context_overflow"
		}
	}
	return ""
}

func collectProviderErrorCodes(value any, result *[]string) {
	switch current := value.(type) {
	case map[string]any:
		for key, item := range current {
			switch strings.ToLower(strings.TrimSpace(key)) {
			case "code", "type", "error_code":
				if text, ok := item.(string); ok {
					*result = append(*result, text)
				}
			default:
				collectProviderErrorCodes(item, result)
			}
		}
	case []any:
		for _, item := range current {
			collectProviderErrorCodes(item, result)
		}
	}
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
