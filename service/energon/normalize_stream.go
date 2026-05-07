package energon

import (
	"context"
	"fmt"
	"time"

	botprotocol "my/package/bot/service/energon/protocol"
	botprovider "my/package/bot/service/energon/provider"
	bottask "my/package/bot/service/energon/task"
)

func (s GatewayService) handleStream(ctx context.Context, raw GatewayRequest) error {
	adapter, err := s.registry.Get(detectProtocol(raw))
	if err != nil {
		return err
	}
	req, err := adapter.Normalize(buildRawProtocolRequest(raw, ModeNormalize))
	if err != nil {
		return err
	}
	req.RequestID = raw.RequestID
	req.Mode = ModeNormalize

	plan, err := s.resolveNormalizePlan(ctx, req)
	if err != nil {
		return err
	}

	var lastErr error
	for _, target := range plan.targets {
		selected, err := s.selectTarget(ctx, plan.power, target)
		if err != nil {
			lastErr = err
			_ = s.writeStreamProgress(ctx, req.RequestID, err.Error())
			continue
		}

		if err := s.writeStreamProgress(ctx, req.RequestID, "正在调用来源服务: "+selected.Service.Name); err != nil {
			return err
		}
		_, err = s.callStreamTarget(ctx, req, selected)
		if err == nil {
			return nil
		}
		if s.streamCancels.IsCancelled(req.RequestID) {
			return err
		}
		lastErr = err
		_ = s.writeStreamProgress(ctx, req.RequestID, err.Error())
	}

	if lastErr != nil {
		return lastErr
	}
	return fmt.Errorf("流式调用失败")
}

func (s GatewayService) callStreamTarget(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
) (callResult, error) {
	startedAt := time.Now()
	adapter, err := s.adapterForSelected(req, selected)
	if err != nil {
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("select_stream_protocol", err.Error()))
		return callResult{Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}
	req.Protocol = adapter.Name()

	mappedInput, err := s.buildMappedInput(ctx, req, selected)
	if err != nil {
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("map_stream_input", err.Error()))
		return callResult{Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}
	selected, err = s.applyServiceEndpoint(ctx, selected, mappedInput)
	if err != nil {
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("select_stream_endpoint", err.Error()))
		return callResult{Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}

	nativeInput := botprotocol.NativeInput{
		Request:     req,
		Provider:    selected.Provider,
		Account:     selected.Account,
		Power:       selected.Power,
		PowerTarget: selected.PowerTarget,
		Service:     selected.Service,
		ServiceAPI:  selected.ServiceAPI,
		Mapped:      mappedInput,
	}
	cancelable := supportsStreamCancel(adapter, nativeInput)
	s.streamCancels.SetCancelable(req.RequestID, cancelable)
	if err := s.writeStream(ctx, req.RequestID, botprotocol.BuildStreamResponse(req.RequestID, botprotocol.Output{
		"event": "control",
		"meta":  cancelableMeta(cancelable),
	})); err != nil {
		return callResult{NativeRequest: botprovider.Request{}}, err
	}
	nativeReq, err := adapter.BuildNativeRequest(nativeInput)
	if err != nil {
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("build_stream_request", err.Error()))
		return callResult{Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}

	if result, err := s.tasks.ResolveStream(ctx, bottask.StreamJob{
		Input:   nativeInput,
		Adapter: adapter,
		Client:  s.client,
		Request: nativeReq,
		Write: func(output botprotocol.Output) error {
			if len(output) == 0 {
				return nil
			}
			return s.writeStream(ctx, req.RequestID, botprotocol.BuildStreamResponse(req.RequestID, output))
		},
		RegisterCancel: func(cancel func(context.Context) error) {
			s.streamCancels.SetRemoteCancel(req.RequestID, cancel)
		},
	}); result.Handled {
		if err != nil {
			if s.streamCancels.IsCancelled(req.RequestID) {
				return callResult{NativeRequest: nativeReq, Response: result.Response}, err
			}
			logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("provider_stream", err.Error()), nativeReq)
			return callResult{NativeRequest: nativeReq, Response: result.Response, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
		}

		end := botprotocol.Output{"event": "end"}
		if err := s.writeStream(ctx, req.RequestID, botprotocol.BuildStreamResponse(req.RequestID, end)); err != nil {
			return callResult{NativeRequest: nativeReq, Response: result.Response, Data: result.Data}, err
		}
		resultResp := botprotocol.BuildSuccessResponse(req.RequestID, result.Data)
		if err := s.writeStream(ctx, req.RequestID, resultResp); err != nil {
			logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("stream_result", err.Error()), nativeReq)
			return callResult{NativeRequest: nativeReq, Response: result.Response, Data: result.Data, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
		}

		logItem := s.recordCallLog(ctx, req, selected, StatusSuccess, time.Since(startedAt), encodeLogJSON(resultResp.Payload()), nativeReq)
		return callResult{
			NativeRequest: nativeReq,
			Response:      result.Response,
			ServiceAPI:    selected.ServiceAPI,
			Data:          result.Data,
			Log:           logItem,
			Attempt:       buildCallAttempt(selected, StatusSuccess, logItem, nil),
		}, nil
	}

	if nativeReq.Body == nil {
		nativeReq.Body = map[string]any{}
	}
	nativeReq.Body["stream"] = true

	streamClient, ok := s.client.(botprovider.StreamClient)
	if !ok {
		err := fmt.Errorf("当前来源客户端不支持流式调用")
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("stream_client", err.Error()), nativeReq)
		return callResult{NativeRequest: nativeReq, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}

	streamOutputs := make([]botprotocol.Output, 0)
	resp, err := streamClient.Stream(ctx, nativeReq, func(chunk botprovider.StreamChunk) error {
		output := botprotocol.ExtractStreamOutput(chunk.Data)
		if len(output) == 0 {
			return nil
		}
		streamOutputs = append(streamOutputs, output)
		return s.writeStream(ctx, req.RequestID, botprotocol.BuildStreamResponse(req.RequestID, output))
	})
	if err != nil {
		if s.streamCancels.IsCancelled(req.RequestID) {
			return callResult{NativeRequest: nativeReq, Response: resp}, err
		}
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("provider_stream", err.Error()), nativeReq)
		return callResult{NativeRequest: nativeReq, Response: resp, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}
	if resp == nil {
		err := fmt.Errorf("来源流式返回为空")
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("provider_stream", err.Error()), nativeReq)
		return callResult{NativeRequest: nativeReq, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}
	if resp.StatusCode >= 400 {
		errorMessage := formatProviderStatusError(nativeReq.Method, nativeReq.URL, resp)
		err := fmt.Errorf("来源返回失败: %s", errorMessage)
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("provider_status", errorMessage), nativeReq)
		return callResult{NativeRequest: nativeReq, Response: resp, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}

	if !hasStreamEnd(streamOutputs) {
		end := botprotocol.Output{"event": "end"}
		streamOutputs = append(streamOutputs, end)
		if err := s.writeStream(ctx, req.RequestID, botprotocol.BuildStreamResponse(req.RequestID, end)); err != nil {
			return callResult{NativeRequest: nativeReq, Response: resp}, err
		}
	}

	data := botprotocol.MergeStreamResult(streamOutputs)
	resultResp := botprotocol.BuildSuccessResponse(req.RequestID, data)
	if err := s.writeStream(ctx, req.RequestID, resultResp); err != nil {
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("stream_result", err.Error()), nativeReq)
		return callResult{NativeRequest: nativeReq, Response: resp, Data: data, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}

	logItem := s.recordCallLog(ctx, req, selected, StatusSuccess, time.Since(startedAt), encodeLogJSON(resultResp.Payload()), nativeReq)
	return callResult{
		NativeRequest: nativeReq,
		Response:      resp,
		ServiceAPI:    selected.ServiceAPI,
		Data:          data,
		Log:           logItem,
		Attempt:       buildCallAttempt(selected, StatusSuccess, logItem, nil),
	}, nil
}

func (s GatewayService) writeStreamProgress(ctx context.Context, requestID string, message string) error {
	return s.writeStream(ctx, requestID, botprotocol.BuildProgressResponse(requestID, message, -1))
}

func hasStreamEnd(outputs []botprotocol.Output) bool {
	for _, output := range outputs {
		if fmt.Sprint(output["event"]) == "end" {
			return true
		}
	}
	return false
}
