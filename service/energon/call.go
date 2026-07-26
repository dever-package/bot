package energon

import (
	"context"
	"fmt"
	"time"

	botmodel "github.com/dever-package/bot/model/energon"
	botinput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	botruntime "github.com/dever-package/bot/service/energon/runtime"
	botstream "github.com/dever-package/bot/service/energon/stream"
	bottask "github.com/dever-package/bot/service/energon/task"
)

func (s GatewayService) callNormalizeTarget(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
) (callResult, error) {
	req = withServiceOutputLimit(req, selected.Service)
	if isLocalProvider(selected.Provider) {
		return s.callLocalTarget(ctx, req, selected, false)
	}
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
	req, mappedInput, _, err = s.prepareVideoReferenceAudio(ctx, req, selected, mappedInput)
	if err != nil {
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("prepare_reference_audio", err.Error()))
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
		logItem := s.recordProviderCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("provider_error", err.Error()), nativeReq)
		return callResult{NativeRequest: nativeReq, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}
	if resp.StatusCode >= 400 {
		errorMessage := formatProviderStatusError(nativeReq.Method, nativeReq.URL, resp)
		logItem := s.recordProviderCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("provider_status", errorMessage), nativeReq)
		err := newProviderStatusError(nativeReq.Method, nativeReq.URL, resp)
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
		usage := extractResponseTokenUsage(resp, data)
		logItem := s.recordCallLogWithUsage(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("parse_response", err.Error()), usage, nativeReq)
		return callResult{NativeRequest: nativeReq, Response: resp, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}
	data, err = normalizePowerOutput(selected.Power, data)
	if err != nil {
		usage := extractResponseTokenUsage(resp, data)
		logItem := s.recordCallLogWithUsage(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("normalize_output", err.Error()), usage, nativeReq)
		return callResult{NativeRequest: nativeReq, Response: resp, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}
	data, err = s.storeGeneratedMediaOutput(ctx, req.RequestID, selected.Power.Kind, data, nil)
	if err != nil {
		usage := extractResponseTokenUsage(resp, data)
		logItem := s.recordCallLogWithUsage(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("store_media", err.Error()), usage, nativeReq)
		return callResult{NativeRequest: nativeReq, Response: resp, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}

	usage := extractResponseTokenUsage(resp, data)
	logItem := s.recordCallLogWithUsage(ctx, req, selected, StatusSuccess, time.Since(startedAt), encodeLogJSON(data), usage, nativeReq)
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
	req.Billing = raw.Billing

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

		_, err = s.callStreamPowerTarget(ctx, req, selected)
		if err == nil {
			return nil
		}
		if s.streamCancels.IsCancelled(req.RequestID) {
			return err
		}
		if s.audioRelay().Committed(req.RequestID) {
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
	req = withServiceOutputLimit(req, selected.Service)
	if isLocalProvider(selected.Provider) {
		return s.callLocalTarget(ctx, req, selected, true)
	}
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
	var referenceAudioPreparation videoReferenceAudioPreparation
	req, mappedInput, referenceAudioPreparation, err = s.prepareVideoReferenceAudio(ctx, req, selected, mappedInput)
	if err != nil {
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("prepare_stream_reference_audio", err.Error()))
		return callResult{Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}
	if referenceAudioPreparation.Prepared {
		status := "参考音频已转换为 MP3"
		if referenceAudioPreparation.Trimmed {
			status = fmt.Sprintf(
				"参考音频已转换为 MP3 并截取为 %s 秒",
				formatReferenceAudioDuration(referenceAudioPreparation.Duration),
			)
		}
		_ = s.writeStreamStatus(
			ctx,
			req.RequestID,
			status,
		)
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

	writeOutput := s.streamOutputWriter(ctx, req.RequestID, selected.Power)
	progress, err := botruntime.StartProgress(ctx, selected.Service, selected.Power, writeOutput)
	if err != nil {
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("stream_progress", err.Error()), nativeReq)
		return callResult{NativeRequest: nativeReq, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}
	defer progress.Stop()

	if result, err := s.tasks.ResolveStream(ctx, bottask.StreamJob{
		Input:       nativeInput,
		Adapter:     adapter,
		Client:      s.client,
		Request:     nativeReq,
		Write:       writeOutput,
		WriteBinary: s.audioStreamWriter(ctx, req.RequestID, writeOutput),
		CommitBinary: func() {
			s.audioRelay().Commit(req.RequestID)
		},
		RegisterCancel: func(cancel func(context.Context) error) {
			s.streamCancels.SetRemoteCancel(req.RequestID, cancel)
		},
	}); result.Handled {
		if err != nil {
			s.audioRelay().Fail(req.RequestID, err)
			usage := extractResponseTokenUsage(result.Response, result.Data)
			if s.streamCancels.IsCancelled(req.RequestID) {
				logItem := s.recordCallLogWithUsage(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("provider_stream_cancelled", err.Error()), usage, nativeReq)
				return callResult{NativeRequest: nativeReq, Response: result.Response, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
			}
			logItem := s.recordCallLogWithUsage(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("provider_stream", err.Error()), usage, nativeReq)
			return callResult{NativeRequest: nativeReq, Response: result.Response, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
		}
		s.audioRelay().Complete(req.RequestID)

		return s.finishStreamResult(ctx, streamFinishInput{
			Request:       req,
			Selected:      selected,
			StartedAt:     startedAt,
			NativeRequest: nativeReq,
			Response:      result.Response,
			Data:          result.Data,
			Usage:         extractResponseTokenUsage(result.Response, result.Data),
			Progress:      progress,
			WriteEnd:      true,
			CostAttempted: true,
		})
	}

	if nativeReq.Body == nil {
		nativeReq.Body = map[string]any{}
	}
	nativeReq.Body["stream"] = true
	enableStreamUsage(adapter, nativeReq.Body)

	streamClient, ok := s.client.(botprovider.StreamClient)
	if !ok {
		err := fmt.Errorf("当前来源客户端不支持流式调用")
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("stream_client", err.Error()), nativeReq)
		return callResult{NativeRequest: nativeReq, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}

	streamOutputs := make([]botprotocol.Output, 0)
	streamUsage := tokenUsage{}
	resp, err := streamClient.Stream(ctx, nativeReq, func(chunk botprovider.StreamChunk) error {
		streamUsage = streamUsage.Prefer(extractTokenUsage(chunk.Data))
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
			logItem := s.recordCallLogWithUsage(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("provider_stream_cancelled", err.Error()), streamUsage, nativeReq)
			return callResult{NativeRequest: nativeReq, Response: resp, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
		}
		logItem := s.recordCallLogWithUsage(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("provider_stream", err.Error()), streamUsage, nativeReq)
		return callResult{NativeRequest: nativeReq, Response: resp, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}
	if resp == nil {
		err := fmt.Errorf("来源流式返回为空")
		logItem := s.recordProviderCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("provider_stream", err.Error()), nativeReq)
		return callResult{NativeRequest: nativeReq, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}
	if resp.StatusCode >= 400 {
		errorMessage := formatProviderStatusError(nativeReq.Method, nativeReq.URL, resp)
		err := newProviderStatusError(nativeReq.Method, nativeReq.URL, resp)
		logItem := s.recordProviderCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("provider_status", errorMessage), nativeReq)
		return callResult{NativeRequest: nativeReq, Response: resp, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}

	writeEnd := !botstream.HasEnd(streamOutputs) || botmodel.RequiresStructuredOutput(selected.Power)
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
		Usage:         streamUsage.Prefer(extractResponseTokenUsage(resp, data)),
		Progress:      progress,
		WriteEnd:      writeEnd,
		CostAttempted: true,
	})
}

func (s GatewayService) writeStreamStatus(ctx context.Context, requestID string, message string) error {
	return s.writeStreamOutput(ctx, requestID, botprotocol.Output{
		"event": "status",
		"text":  message,
	})
}

func enableStreamUsage(adapter botprotocol.Adapter, body map[string]any) {
	if adapter == nil || body == nil {
		return
	}
	switch adapter.Name() {
	case "openai", "doubao":
	default:
		return
	}

	options, _ := body["stream_options"].(map[string]any)
	if options == nil {
		options = map[string]any{}
	}
	if _, exists := options["include_usage"]; !exists {
		options["include_usage"] = true
	}
	body["stream_options"] = options
}

func (s GatewayService) streamOutputWriter(ctx context.Context, requestID string, power botmodel.Power) func(botprotocol.Output) error {
	structuredProgress := newPowerOutputStreamProgress(power)
	return func(output botprotocol.Output) error {
		if progressOutput, changed := structuredProgress.Consume(output); changed {
			if err := s.writeStreamOutput(ctx, requestID, progressOutput); err != nil {
				return err
			}
		}
		if suppressStructuredOutputStream(power, output) {
			return nil
		}
		if _, generated := generatedMediaRuleForKind(power.Kind); generated && botprotocol.HasMediaOutput(output) && !botprotocol.IsStreamingAudioOutput(output) {
			return nil
		}
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
	Request        *botprotocol.ShemicRequest
	Selected       selectedTarget
	StartedAt      time.Time
	NativeRequest  botprovider.Request
	Response       *botprovider.Response
	Data           any
	Usage          tokenUsage
	Progress       *botruntime.ProgressTracker
	WriteEnd       bool
	SkipMediaStore bool
	CostAttempted  bool
}

func (s GatewayService) finishStreamResult(ctx context.Context, input streamFinishInput) (callResult, error) {
	normalizedData, err := normalizePowerOutput(input.Selected.Power, input.Data)
	if err != nil {
		logItem := s.recordCallLogInternal(ctx, input.Request, input.Selected, StatusFail, time.Since(input.StartedAt), encodeFailureLogResult("normalize_output", err.Error()), input.Usage, input.CostAttempted, input.NativeRequest)
		return callResult{NativeRequest: input.NativeRequest, Response: input.Response, Data: input.Data, Log: logItem, Attempt: buildCallAttempt(input.Selected, StatusFail, logItem, err)}, err
	}
	input.Data = normalizedData
	storedData := input.Data
	if !input.SkipMediaStore {
		storedData, err = s.storeGeneratedMediaOutput(
			ctx,
			input.Request.RequestID,
			input.Selected.Power.Kind,
			input.Data,
			func(output botprotocol.Output) error {
				return s.writeStreamOutput(ctx, input.Request.RequestID, output)
			},
		)
	}
	if err != nil {
		logItem := s.recordCallLogInternal(ctx, input.Request, input.Selected, StatusFail, time.Since(input.StartedAt), encodeFailureLogResult("store_media", err.Error()), input.Usage, input.CostAttempted, input.NativeRequest)
		return callResult{NativeRequest: input.NativeRequest, Response: input.Response, Data: input.Data, Log: logItem, Attempt: buildCallAttempt(input.Selected, StatusFail, logItem, err)}, err
	}
	input.Data = storedData
	if err := input.Progress.Complete(); err != nil {
		logItem := s.recordCallLogInternal(ctx, input.Request, input.Selected, StatusFail, time.Since(input.StartedAt), encodeFailureLogResult("stream_progress", err.Error()), input.Usage, input.CostAttempted, input.NativeRequest)
		return callResult{NativeRequest: input.NativeRequest, Response: input.Response, Data: input.Data, Log: logItem, Attempt: buildCallAttempt(input.Selected, StatusFail, logItem, err)}, err
	}
	if input.WriteEnd {
		if err := s.writeStreamOutput(ctx, input.Request.RequestID, botprotocol.Output{"event": "end"}); err != nil {
			logItem := s.recordCallLogInternal(ctx, input.Request, input.Selected, StatusFail, time.Since(input.StartedAt), encodeFailureLogResult("stream_end", err.Error()), input.Usage, input.CostAttempted, input.NativeRequest)
			return callResult{NativeRequest: input.NativeRequest, Response: input.Response, Data: input.Data, Log: logItem, Attempt: buildCallAttempt(input.Selected, StatusFail, logItem, err)}, err
		}
	}

	resultResp := botprotocol.BuildSuccessResponse(input.Request.RequestID, input.Data)
	// The terminal frame lets callers settle billing immediately, so persist the
	// successful provider attempt and its cost before making that frame visible.
	logItem := s.recordCallLogInternal(ctx, input.Request, input.Selected, StatusSuccess, time.Since(input.StartedAt), encodeLogJSON(resultResp.Payload()), input.Usage, input.CostAttempted, input.NativeRequest)
	if err := s.writeStream(ctx, input.Request.RequestID, resultResp); err != nil {
		return callResult{NativeRequest: input.NativeRequest, Response: input.Response, Data: input.Data, Log: logItem, Attempt: buildCallAttempt(input.Selected, StatusSuccess, logItem, nil)}, err
	}

	return callResult{
		NativeRequest: input.NativeRequest,
		Response:      input.Response,
		ServiceAPI:    input.Selected.ServiceAPI,
		Data:          input.Data,
		Log:           logItem,
		Attempt:       buildCallAttempt(input.Selected, StatusSuccess, logItem, nil),
	}, nil
}
