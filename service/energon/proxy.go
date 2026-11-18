package energon

import (
	"context"
	"fmt"
	botmodel "github.com/dever-package/bot/model/energon"
	"github.com/dever-package/bot/service/worker"
	"log/slog"
	"net/http"
	"strings"
	"time"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	bottask "github.com/dever-package/bot/service/energon/task"
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
		selected, err := s.selectTarget(ctx, power, target, req.RequestID)
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
	selected, err = s.restoreExecutionSelection(ctx, req, selected)
	if err != nil {
		return callResult{}, err
	}
	adapter, err := s.adapterForSelected(req, selected)
	if err != nil {
		return callResult{}, err
	}
	nativeReq := buildProxyRequest(req, selected)
	nativeReq.Operation = "submit"
	mapped := botprotocol.NewMappedInput(nativeReq.Body, nil)
	cp, err := prepareExecution(ctx, req.RequestID)
	if err != nil {
		return callResult{}, err
	}
	if cp.TargetID != 0 {
		mapped = cp.Mapped
		nativeReq.Body = mapped.Original
	}
	input := botprotocol.NativeInput{Request: req, Provider: selected.Provider, Account: selected.Account, Power: selected.Power, PowerTarget: selected.PowerTarget, Service: selected.Service, ServiceEndpoint: selected.ServiceEndpoint, ServiceAPI: selected.ServiceAPI, Mapped: mapped}
	async := bottask.IsPolling(adapter, input)
	if async {
		ctx = context.WithoutCancel(ctx)
	}
	ctx, _, err = s.acquireSource(ctx, req, selected, async)
	if err != nil {
		return callResult{}, err
	}
	selected = ctx.Value(sourceCallKey{}).(*sourceCall).selected
	input.Provider, input.Account, input.Service, input.ServiceEndpoint = selected.Provider, selected.Account, selected.Service, selected.ServiceEndpoint
	nativeReq = buildProxyRequest(req, selected)
	nativeReq.Operation = "submit"
	nativeReq.Body = mapped.Original
	monitor := false
	defer func() {
		if !monitor {
			finishSourceCall(ctx)
		}
	}()
	prepared := remoteCallPreparation{Request: req, Selected: selected, Adapter: adapter, NativeInput: input, NativeRequest: nativeReq}
	cp, err = s.beginRemoteExecution(ctx, prepared)
	if err != nil {
		return callResult{}, executionError(err)
	}
	var resp *botprovider.Response
	if cp.SubmissionResponse != nil {
		resp = cp.SubmissionResponse
	} else {
		resp, err = s.client.Do(ctx, nativeReq)
		if err != nil {
			return callResult{NativeRequest: nativeReq}, executionError(err)
		}
		if resp.StatusCode >= 400 {
			return callResult{NativeRequest: nativeReq, Response: resp}, newProviderStatusError(nativeReq.Method, nativeReq.URL, resp)
		}
	}
	if async {
		polling := adapter.(bottask.PollingAdapter)
		id := cp.RemoteTaskID
		if id == "" {
			id, err = polling.ParseTaskID(input, resp)
			if err != nil {
				return callResult{}, executionError(err)
			}
		}
		if id != "" {
			if err = bottask.SaveRemoteTaskID(ctx, req.RequestID, id); err != nil {
				return callResult{}, executionError(err)
			}
			monitor = true
			s.monitorProxyTask(ctx, bottask.StreamJob{Input: input, Adapter: adapter, Client: s.client, Request: nativeReq}, id)
		}
	}
	if !monitor {
		if _, err = stageExecutionResult(ctx, req.RequestID, resp.Body, extractResponseTokenUsage(resp)); err != nil {
			return callResult{}, executionError(err)
		}
		if err = commitExecutionResult(ctx, req.RequestID, powerOutputFromData(resp.Body), nil); err != nil {
			return callResult{}, executionError(err)
		}
	}
	usage := extractResponseTokenUsage(resp)
	logItem := s.recordCallLogWithUsage(ctx, req, selected, StatusSuccess, time.Since(startedAt), encodeLogJSON(resp.Body), usage, nativeReq)
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

func (s GatewayService) monitorProxyTask(ctx context.Context, job bottask.StreamJob, id string) {
	// Source observation survives completion of the caller's business run. It
	// stores receipts only and does not perform business settlement a second time.
	row := botmodel.NewExecutionModel().Find(ctx, map[string]any{"request_id": job.Input.Request.RequestID})
	ctx = bottask.WithExecutionStore(ctx, bottask.DatabaseStore{RunID: row.RunID, NodeRunID: row.NodeRunID, UserID: row.UserID, AdminID: row.AdminID})
	worker.Go(ctx, func(jobCtx context.Context) {
		ctx = jobCtx
		defer finishSourceCall(ctx)
		result, err := s.tasks.ResumePolling(ctx, job, id)
		if err == nil {
			result.Data, err = stageExecutionResult(ctx, job.Input.Request.RequestID, result.Data, extractResponseTokenUsage(result.Response, result.Data))
		}
		if err == nil {
			err = commitExecutionResult(ctx, job.Input.Request.RequestID, powerOutputFromData(result.Data), nil)
		}
		if err != nil {
			slog.Error("代理来源任务观察暂未完成，将沿原回执恢复", "request_id", job.Input.Request.RequestID, "error", err)
		}
	})
}
