package energon

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	botprotocol "my/package/bot/service/energon/protocol"
	botprovider "my/package/bot/service/energon/provider"
)

func (s GatewayService) handleProxy(ctx context.Context, req *botprotocol.ShemicRequest) (*GatewayResponse, error) {
	power, ok := s.repo.PowerByName(ctx, req.Name)
	if !ok || !isActive(power.Status) {
		return nil, fmt.Errorf("未匹配到 Energon 能力: %s", req.Name)
	}

	targets := orderActivePowerTargets(s.repo.ListTargetsByPower(ctx, power.ID))
	if len(targets) == 0 {
		return nil, fmt.Errorf("能力没有可用实现: %s", req.Name)
	}

	var lastErr error
	for _, target := range targets {
		selected, err := s.selectTarget(ctx, power, target)
		if err != nil {
			lastErr = err
			continue
		}

		result, err := s.callProxyTarget(ctx, req, selected)
		if err == nil {
			return s.buildGatewayResponse(req, selected, result), nil
		}
		lastErr = err
	}

	if lastErr != nil {
		return nil, lastErr
	}
	return nil, fmt.Errorf("代理调用失败")
}

func (s GatewayService) callProxyTarget(ctx context.Context, req *botprotocol.ShemicRequest, selected selectedTarget) (callResult, error) {
	startedAt := time.Now()
	var err error
	selected, err = s.applyServiceEndpoint(ctx, selected, botprotocol.MappedInput{})
	if err != nil {
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("select_proxy_endpoint", err.Error()))
		return callResult{Log: logItem}, err
	}
	nativeReq := buildProxyRequest(req, selected)
	resp, err := s.client.Do(ctx, nativeReq)
	if err != nil {
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("provider_error", err.Error()), nativeReq)
		return callResult{NativeRequest: nativeReq, Log: logItem}, err
	}
	if resp.StatusCode >= 400 {
		errorMessage := formatProviderStatusError(nativeReq.Method, nativeReq.URL, resp)
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("provider_status", errorMessage), nativeReq)
		return callResult{NativeRequest: nativeReq, Response: resp, Log: logItem}, fmt.Errorf("来源返回失败: %s", errorMessage)
	}

	logItem := s.recordCallLog(ctx, req, selected, StatusSuccess, time.Since(startedAt), encodeLogJSON(resp.Body), nativeReq)
	return callResult{
		NativeRequest: nativeReq,
		Response:      resp,
		ServiceAPI:    selected.ServiceAPI,
		Data:          resp.Body,
		Log:           logItem,
	}, nil
}

func buildProxyRequest(req *botprotocol.ShemicRequest, selected selectedTarget) botprovider.Request {
	path := strings.TrimSpace(selected.Service.Path)
	if path == "" {
		path = strings.TrimSpace(selected.ServiceAPI)
	}
	baseURL := selected.Provider.Host

	method := strings.TrimSpace(req.Raw.Method)
	if method == "" {
		method = http.MethodPost
	}
	if bodyMethod, _ := req.Raw.Body["method"].(string); bodyMethod != "" {
		method = strings.ToUpper(strings.TrimSpace(bodyMethod))
	}

	headers := cleanHeaders(req.Raw.Headers)
	for key, value := range botprovider.AuthHeaders(selected.Account.Key) {
		headers[key] = value
	}
	if headers["Content-Type"] == "" {
		headers["Content-Type"] = "application/json"
	}

	body := cloneGatewayBody(req.Raw.Body)
	return botprovider.Request{
		URL:     botprovider.JoinURL(baseURL, path),
		Method:  method,
		Headers: headers,
		Body:    body,
	}
}

func cleanHeaders(headers map[string]string) map[string]string {
	result := make(map[string]string, len(headers)+2)
	for key, value := range headers {
		canonical := http.CanonicalHeaderKey(key)
		switch canonical {
		case "Host", "Connection", "Content-Length", "Transfer-Encoding":
			continue
		default:
			result[canonical] = value
		}
	}
	return result
}

func cloneGatewayBody(body map[string]any) map[string]any {
	result := make(map[string]any, len(body))
	for key, value := range body {
		switch key {
		case "mode", "protocol", "path", "method", "host", "power":
			continue
		default:
			result[key] = value
		}
	}
	return result
}
