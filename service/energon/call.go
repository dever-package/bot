package energon

import (
	"context"
	"fmt"
	"time"

	botinput "my/package/bot/service/energon/input"
	botprotocol "my/package/bot/service/energon/protocol"
	botprovider "my/package/bot/service/energon/provider"
	botruntime "my/package/bot/service/energon/runtime"
	botstream "my/package/bot/service/energon/stream"
	bottask "my/package/bot/service/energon/task"
)

func (s GatewayService) callNormalizeTarget(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
) (callResult, error) {
	startedAt := time.Now()
	adapter, err := s.adapterForSelected(req, selected)
	if err != nil {
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("select_protocol", err.Error()))
		return callResult{Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}
	req.Protocol = adapter.Name()

	mappedInput, err := botinput.BuildMapped(ctx, s.repo, req, botinput.Target{
		PowerID:   selected.Power.ID,
		ServiceID: selected.Service.ID,
	})
	if err != nil {
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("map_input", err.Error()))
		return callResult{Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}
	selected, err = s.applyServiceEndpoint(ctx, selected, mappedInput)
	if err != nil {
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("select_service_endpoint", err.Error()))
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
	nativeReq, err := adapter.BuildNativeRequest(nativeInput)
	if err != nil {
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("build_request", err.Error()))
		return callResult{Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}

	resp, err := s.client.Do(ctx, nativeReq)
	if err != nil {
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("provider_error", err.Error()), nativeReq)
		return callResult{NativeRequest: nativeReq, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}
	if resp.StatusCode >= 400 {
		errorMessage := formatProviderStatusError(nativeReq.Method, nativeReq.URL, resp)
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("provider_status", errorMessage), nativeReq)
		err := fmt.Errorf("来源返回失败: %s", errorMessage)
		return callResult{NativeRequest: nativeReq, Response: resp, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}

	var data any
	if taskData, handled, taskErr := s.tasks.ResolveResponse(ctx, bottask.ResponseJob{
		Input:    nativeInput,
		Adapter:  adapter,
		Client:   s.client,
		Response: resp,
	}); handled {
		data, err = taskData, taskErr
	} else {
		data, err = adapter.BuildClientResponse(req, resp)
	}
	if err != nil {
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("parse_response", err.Error()), nativeReq)
		return callResult{NativeRequest: nativeReq, Response: resp, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}

	logItem := s.recordCallLog(ctx, req, selected, StatusSuccess, time.Since(startedAt), encodeLogJSON(data), nativeReq)
	return callResult{
		NativeRequest: nativeReq,
		Response:      resp,
		ServiceAPI:    selected.ServiceAPI,
		Data:          data,
		Log:           logItem,
		Attempt:       buildCallAttempt(selected, StatusSuccess, logItem, nil),
	}, nil
}

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
			_ = s.writeStreamStatus(ctx, req.RequestID, err.Error())
			continue
		}

		_, err = s.callStreamTarget(ctx, req, selected)
		if err == nil {
			return nil
		}
		if s.streamCancels.IsCancelled(req.RequestID) {
			return err
		}
		lastErr = err
		_ = s.writeStreamStatus(ctx, req.RequestID, err.Error())
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

	mappedInput, err := botinput.BuildMapped(ctx, s.repo, req, botinput.Target{
		PowerID:   selected.Power.ID,
		ServiceID: selected.Service.ID,
	})
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
	nativeReq, err := adapter.BuildNativeRequest(nativeInput)
	if err != nil {
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("build_stream_request", err.Error()))
		return callResult{Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}
	cancelable := botstream.SupportsCancel(adapter, nativeInput)
	s.streamCancels.SetCancelable(req.RequestID, cancelable)
	if err := s.writeStream(ctx, req.RequestID, botprotocol.BuildStreamResponse(req.RequestID, botprotocol.Output{
		"event": "control",
		"meta":  botstream.CancelableMeta(cancelable),
	})); err != nil {
		return callResult{NativeRequest: nativeReq}, err
	}

	writeOutput := s.streamOutputWriter(ctx, req.RequestID)
	progress, err := botruntime.StartProgress(ctx, selected.Service, selected.Power, writeOutput)
	if err != nil {
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("stream_progress", err.Error()), nativeReq)
		return callResult{NativeRequest: nativeReq, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}
	defer progress.Stop()

	if result, err := s.tasks.ResolveStream(ctx, bottask.StreamJob{
		Input:   nativeInput,
		Adapter: adapter,
		Client:  s.client,
		Request: nativeReq,
		Write:   writeOutput,
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

		return s.finishStreamResult(ctx, streamFinishInput{
			Request:       req,
			Selected:      selected,
			StartedAt:     startedAt,
			NativeRequest: nativeReq,
			Response:      result.Response,
			Data:          result.Data,
			Progress:      progress,
			WriteEnd:      true,
		})
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
		botprotocol.StripOutputProgress(output)
		streamOutputs = append(streamOutputs, output)
		return writeOutput(output)
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

	writeEnd := !botstream.HasEnd(streamOutputs)
	if writeEnd {
		streamOutputs = append(streamOutputs, botprotocol.Output{"event": "end"})
	}

	data := botprotocol.MergeStreamResult(streamOutputs)
	return s.finishStreamResult(ctx, streamFinishInput{
		Request:       req,
		Selected:      selected,
		StartedAt:     startedAt,
		NativeRequest: nativeReq,
		Response:      resp,
		Data:          data,
		Progress:      progress,
		WriteEnd:      writeEnd,
	})
}

func (s GatewayService) writeStreamStatus(ctx context.Context, requestID string, message string) error {
	return s.writeStreamOutput(ctx, requestID, botprotocol.Output{
		"event": "status",
		"text":  message,
	})
}

func (s GatewayService) streamOutputWriter(ctx context.Context, requestID string) func(botprotocol.Output) error {
	return func(output botprotocol.Output) error {
		return s.writeStreamOutput(ctx, requestID, output)
	}
}

func (s GatewayService) writeStreamOutput(ctx context.Context, requestID string, output botprotocol.Output) error {
	if len(output) == 0 {
		return nil
	}
	return s.writeStream(ctx, requestID, botprotocol.BuildStreamResponse(requestID, output))
}

type streamFinishInput struct {
	Request       *botprotocol.ShemicRequest
	Selected      selectedTarget
	StartedAt     time.Time
	NativeRequest botprovider.Request
	Response      *botprovider.Response
	Data          any
	Progress      *botruntime.ProgressTracker
	WriteEnd      bool
}

func (s GatewayService) finishStreamResult(ctx context.Context, input streamFinishInput) (callResult, error) {
	if err := input.Progress.Complete(); err != nil {
		logItem := s.recordCallLog(ctx, input.Request, input.Selected, StatusFail, time.Since(input.StartedAt), encodeFailureLogResult("stream_progress", err.Error()), input.NativeRequest)
		return callResult{NativeRequest: input.NativeRequest, Response: input.Response, Data: input.Data, Log: logItem, Attempt: buildCallAttempt(input.Selected, StatusFail, logItem, err)}, err
	}
	if input.WriteEnd {
		if err := s.writeStreamOutput(ctx, input.Request.RequestID, botprotocol.Output{"event": "end"}); err != nil {
			return callResult{NativeRequest: input.NativeRequest, Response: input.Response, Data: input.Data}, err
		}
	}

	resultResp := botprotocol.BuildSuccessResponse(input.Request.RequestID, input.Data)
	if err := s.writeStream(ctx, input.Request.RequestID, resultResp); err != nil {
		logItem := s.recordCallLog(ctx, input.Request, input.Selected, StatusFail, time.Since(input.StartedAt), encodeFailureLogResult("stream_result", err.Error()), input.NativeRequest)
		return callResult{NativeRequest: input.NativeRequest, Response: input.Response, Data: input.Data, Log: logItem, Attempt: buildCallAttempt(input.Selected, StatusFail, logItem, err)}, err
	}

	logItem := s.recordCallLog(ctx, input.Request, input.Selected, StatusSuccess, time.Since(input.StartedAt), encodeLogJSON(resultResp.Payload()), input.NativeRequest)
	return callResult{
		NativeRequest: input.NativeRequest,
		Response:      input.Response,
		ServiceAPI:    input.Selected.ServiceAPI,
		Data:          input.Data,
		Log:           logItem,
		Attempt:       buildCallAttempt(input.Selected, StatusSuccess, logItem, nil),
	}, nil
}
