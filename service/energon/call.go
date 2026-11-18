package energon

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"sync/atomic"
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
	req = withoutImageSequenceOptions(req)
	req = withServiceOutputLimit(req, selected.Service)
	if err := validateWritingRequestBudget(req, selected.Service); err != nil {
		return callResult{}, err
	}
	if isLocalProvider(selected.Provider) {
		return s.callLocalTarget(ctx, req, selected, false)
	}
	if isWebContentProvider(selected.Provider) {
		return s.callWebContentTarget(ctx, req, selected, false)
	}
	startedAt := time.Now()
	prepared, stage, err := s.prepareRemoteCall(ctx, req, selected)
	if err != nil {
		logItem := s.recordCallLog(ctx, prepared.Request, prepared.Selected, StatusFail, time.Since(startedAt), encodeFailureLogResult(stage, err.Error()))
		return callResult{Log: logItem, Attempt: buildCallAttempt(prepared.Selected, StatusFail, logItem, err)}, err
	}
	req = prepared.Request
	selected = prepared.Selected
	adapter := prepared.Adapter
	nativeInput := prepared.NativeInput
	nativeReq := prepared.NativeRequest
	writeStatus := func(output botprotocol.Output) error { _ = s.writeStreamOutput(ctx, req.RequestID, output); return nil }

	ctx, releaseResource, admissionErr := s.acquireRemoteResource(ctx, prepared)
	if admissionErr != nil {
		return callResult{}, admissionErr
	}
	defer finishSourceCall(ctx)
	prepared, err = s.refreshRemoteCredential(ctx, prepared)
	if err != nil {
		return callResult{}, err
	}
	selected, nativeInput, nativeReq = prepared.Selected, prepared.NativeInput, prepared.NativeRequest
	if data, persisted, err := restoreDirectMediaReceipt(ctx, prepared); err != nil {
		return callResult{}, executionError(err)
	} else if data != nil {
		return s.finishStreamResult(ctx, streamFinishInput{Immediate: true, Request: req, Selected: selected, StartedAt: startedAt, NativeRequest: nativeReq, Data: data, Normalized: true, SkipMediaStore: persisted, CostAttempted: true, Receipt: &prepared})
	}
	checkpoint, checkpointErr := s.beginRemoteExecution(ctx, prepared)
	if checkpointErr != nil {
		return callResult{}, executionError(checkpointErr)
	}
	if checkpoint != nil {
		if checkpoint.Result != nil {
			releaseResource()
			data, err := executionResultData(checkpoint)
			if err != nil {
				return callResult{}, s.deferFinalizationError(ctx, req.RequestID, err)
			}
			return s.finishStreamResult(ctx, streamFinishInput{Immediate: true, Request: req, Selected: selected, StartedAt: startedAt, NativeRequest: nativeReq, Data: data, Usage: tokenUsageFromMap(checkpoint.Usage), CostAttempted: true, Normalized: true, SkipMediaStore: checkpoint.Persisted != nil, ReleaseResource: releaseResource, Receipt: &prepared})
		}
	}

	if checkpoint != nil && checkpoint.Stage != bottask.ExecutionSubmitting && checkpoint.RemoteTaskID == "" && checkpoint.SubmissionResponse == nil {
		return callResult{}, executionError(fmt.Errorf("能力提交结果待确认，未重新提交"))
	}
	if checkpoint != nil && checkpoint.RemoteTaskID != "" {
		result, resumeErr := s.tasks.ResumePolling(ctx, bottask.StreamJob{Input: nativeInput, Adapter: adapter, Client: s.client, Request: nativeReq, Write: writeStatus}, checkpoint.RemoteTaskID)
		if resumeErr != nil {
			return callResult{}, executionError(resumeErr)
		}
		return s.finishStreamResult(ctx, streamFinishInput{Immediate: true, Request: req, Selected: selected, StartedAt: startedAt, NativeRequest: nativeReq, Data: result.Data, Response: result.Response, Usage: extractResponseTokenUsage(result.Response, result.Data), CostAttempted: true, ReleaseResource: releaseResource, Receipt: &prepared})
	}
	if lookup, ok := adapter.(bottask.SubmissionLookupAdapter); ok {
		id, err := lookup.LookupSubmission(ctx, nativeInput, s.client)
		if err != nil {
			return callResult{}, executionError(err)
		}
		if id != "" {
			if err := bottask.SaveRemoteTaskID(ctx, req.RequestID, id); err != nil {
				return callResult{}, executionError(err)
			}
			result, err := s.tasks.ResumePolling(ctx, bottask.StreamJob{Input: nativeInput, Adapter: adapter, Client: s.client, Request: nativeReq, Write: writeStatus}, id)
			if err != nil {
				return callResult{}, executionError(err)
			}
			return s.finishStreamResult(ctx, streamFinishInput{Immediate: true, Request: req, Selected: selected, StartedAt: startedAt, NativeRequest: nativeReq, Data: result.Data, Usage: extractResponseTokenUsage(result.Response, result.Data), CostAttempted: true, ReleaseResource: releaseResource, Receipt: &prepared})
		}
	}
	if !bottask.IsPolling(adapter, nativeInput) {
		_ = writeStatus(botprotocol.Output{"event": "status", "text": "生成服务处理中", "meta": map[string]any{"execution_phase": "generating"}})
	}
	resp, err := s.client.Do(ctx, nativeReq)
	if err != nil {
		if s.executionHandedOff(ctx, req.RequestID, err) {
			return callResult{}, &bottask.ExecutionHandoff{Cause: err}
		}
		err = bottask.WrapTaskError(adapter, "", err)
		if _, media := generatedMediaRuleForKind(selected.Power.Kind); media {
			err = executionError(err)
		}
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
		Write:    writeStatus,
	}); handled {
		data, err = taskData, taskErr
	} else {
		data, err = adapter.BuildClientResponse(req, resp)
	}
	if err != nil {
		usage := extractResponseTokenUsage(resp, data)
		err = bottask.WrapTaskError(adapter, "", err)
		logItem := s.recordCallLogWithUsage(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("parse_response", err.Error()), usage, nativeReq)
		return callResult{NativeRequest: nativeReq, Response: resp, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}
	data, err = normalizePowerOutput(req, selected.Power, data)
	if err == nil {
		data, err = resolveGeneratedMediaURLs(selected.Power.Kind, data, nativeReq.URL)
	}
	if err != nil {
		err = bottask.WrapTaskError(adapter, "", err)
		usage := extractResponseTokenUsage(resp, data)
		logItem := s.recordCallLogWithUsage(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("normalize_output", err.Error()), usage, nativeReq)
		return callResult{NativeRequest: nativeReq, Response: resp, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}
	if checkpoint != nil {
		if data, err = stageExecutionResult(ctx, req.RequestID, data, extractResponseTokenUsage(resp, data)); err != nil {
			return callResult{}, s.deferFinalizationError(ctx, req.RequestID, err)
		}
	}
	if err := saveDirectMediaReceipt(ctx, prepared, data, false); err != nil {
		return callResult{}, executionError(err)
	}
	if checkpoint == nil {
		if staged, _, err := restoreDirectMediaReceipt(ctx, prepared); err != nil {
			return callResult{}, executionError(err)
		} else if staged != nil {
			data = staged
		}
	}
	releaseResource()
	data, err = s.storeGeneratedMediaOutput(ctx, req.RequestID, selected.Power.Kind, data, writeStatus)
	if err != nil {
		if checkpoint != nil {
			return callResult{}, s.deferFinalizationError(ctx, req.RequestID, err)
		}
		err = executionError(bottask.WrapTaskError(adapter, "", err))
		usage := extractResponseTokenUsage(resp, data)
		logItem := s.recordCallLogWithUsage(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("store_media", err.Error()), usage, nativeReq)
		return callResult{NativeRequest: nativeReq, Response: resp, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}
	if err := saveDirectMediaReceipt(ctx, prepared, data, true); err != nil {
		return callResult{}, executionError(err)
	}

	usage := extractResponseTokenUsage(resp, data)
	var logItem botmodel.Log
	recordSuccess := func(tx context.Context) error {
		logItem = s.recordCallLogWithUsage(tx, req, selected, StatusSuccess, time.Since(startedAt), encodeLogJSON(data), usage, nativeReq)
		return nil
	}
	if checkpoint != nil {
		if err := commitExecutionResult(ctx, req.RequestID, powerOutputFromData(data), recordSuccess); err != nil {
			return callResult{}, s.deferFinalizationError(ctx, req.RequestID, err)
		}
	} else {
		_ = recordSuccess(ctx)
	}
	return callResult{
		NativeRequest: nativeReq,
		Response:      resp,
		ServiceAPI:    selected.ServiceAPI,
		Data:          data,
		Log:           logItem,
		Attempt:       buildCallAttempt(selected, StatusSuccess, logItem, nil),
	}, nil
}

type remoteCallPreparation struct {
	Request        *botprotocol.ShemicRequest
	Selected       selectedTarget
	Adapter        botprotocol.Adapter
	NativeInput    botprotocol.NativeInput
	NativeRequest  botprovider.Request
	ReferenceAudio videoReferenceAudioPreparation
}

func (s GatewayService) prepareRemoteCall(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
) (remoteCallPreparation, string, error) {
	var restoreErr error
	selected, restoreErr = s.restoreExecutionSelection(ctx, req, selected)
	prepared := remoteCallPreparation{Request: req, Selected: selected}
	if restoreErr != nil {
		return prepared, "restore_execution", restoreErr
	}
	adapter, err := s.adapterForSelected(req, selected)
	if err != nil {
		return prepared, "select_protocol", err
	}
	prepared.Adapter = adapter
	req.Protocol = adapter.Name()

	var mapped botprotocol.MappedInput
	var checkpoint *bottask.ExecutionCheckpoint
	if store := bottask.Store(ctx); store != nil {
		checkpoint, err = store.Load(ctx, req.RequestID)
		if err != nil {
			return prepared, "restore_execution", err
		}
	}
	if checkpoint != nil && checkpoint.TargetID != 0 {
		if checkpoint.Protocol != adapter.Name() {
			return prepared, "restore_execution", executionError(fmt.Errorf("原任务协议已改变，恢复受阻"))
		}
		mapped = checkpoint.Mapped
	} else {
		mapped, err = botinput.BuildMappedReferences(ctx, s.repo, req, s.mediaPromptMappingTarget(ctx, req, selected))
		if err != nil {
			return prepared, "map_input", err
		}
		req, mapped, prepared.ReferenceAudio, err = s.prepareVideoReferenceAudio(ctx, req, selected, mapped)
		if err != nil {
			return prepared, "prepare_reference_audio", err
		}
	}
	prepared.Request = req
	resolved, err := s.applyServiceEndpoint(ctx, selected, mapped)
	if err != nil {
		return prepared, "select_service_endpoint", err
	}
	if store := bottask.Store(ctx); store != nil {
		checkpoint, loadErr := store.Load(ctx, req.RequestID)
		if loadErr != nil {
			return prepared, "restore_execution", loadErr
		}
		if checkpoint != nil && checkpoint.TargetID != 0 && (checkpoint.EndpointID != resolved.ServiceEndpoint.ID || checkpoint.ServiceAPI != resolved.ServiceAPI) {
			return prepared, "restore_execution", executionError(fmt.Errorf("原任务服务端点已改变，恢复受阻"))
		}
	}
	prepared.Selected = resolved
	prepared.NativeInput = botprotocol.NativeInput{
		Request:         req,
		Provider:        resolved.Provider,
		Account:         resolved.Account,
		Power:           resolved.Power,
		PowerTarget:     resolved.PowerTarget,
		Service:         resolved.Service,
		ServiceEndpoint: resolved.ServiceEndpoint,
		ServiceAPI:      resolved.ServiceAPI,
		Mapped:          mapped,
	}
	prepared.NativeRequest, err = adapter.BuildNativeRequest(prepared.NativeInput)
	prepared.NativeRequest.Operation = "submit"
	if err != nil {
		return prepared, "build_request", err
	}
	return prepared, "", nil
}

func (s GatewayService) mediaPromptMappingTarget(ctx context.Context, req *botprotocol.ShemicRequest, selected selectedTarget) botinput.Target {
	target := botinput.Target{PowerID: selected.Power.ID, ServiceID: selected.Service.ID, Kind: selected.Power.Kind}
	if req.MediaReferencePrompt != nil && (target.Kind == "image" || target.Kind == "video") {
		target.MediaParams = hydratePowerParamAcceptedKinds(ctx, botinput.BuildPowerParams(ctx, s.repo, target.PowerID, target.ServiceID))
	}
	return target
}

func (s GatewayService) handleStream(ctx context.Context, raw GatewayRequest) error {
	if mode, err := resolveMode(raw); err != nil {
		return err
	} else if mode == ModeProxy {
		response, err := s.Handle(ctx, raw)
		if err != nil {
			return err
		}
		return s.writeStream(ctx, raw.RequestID, botprotocol.BuildSuccessResponse(raw.RequestID, response.Data))
	}
	req, err := s.normalizeGatewayRequest(raw, ModeNormalize)
	if err != nil {
		return err
	}

	plan, err := s.resolveNormalizePlan(ctx, req)
	if err != nil {
		return err
	}

	var lastErr error
	for _, target := range plan.targets {
		if store := bottask.Store(ctx); store != nil {
			checkpoint, loadErr := store.Load(ctx, req.RequestID)
			if loadErr != nil {
				return loadErr
			}
			if checkpoint != nil && checkpoint.TargetID != 0 && checkpoint.TargetID != target.ID {
				continue
			}
		}
		selected, err := s.selectTarget(ctx, plan.power, target, req.RequestID)
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
		if botprotocol.PreventsReplay(err) {
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
) (result callResult, failure error) {
	var receivedContent atomic.Bool
	defer func() {
		if failure != nil && (receivedContent.Load() || bottask.Store(ctx) != nil) && !botprotocol.PreventsReplay(failure) {
			failure = &botprotocol.ContentResultError{Cause: failure}
		}
	}()
	req = withoutImageSequenceOptions(req)
	req = withServiceOutputLimit(req, selected.Service)
	if err := validateWritingRequestBudget(req, selected.Service); err != nil {
		return callResult{}, err
	}
	if isLocalProvider(selected.Provider) {
		return s.callLocalTarget(ctx, req, selected, true)
	}
	if isWebContentProvider(selected.Provider) {
		return s.callWebContentTarget(ctx, req, selected, true)
	}
	startedAt := time.Now()
	prepared, stage, err := s.prepareRemoteCall(ctx, req, selected)
	if err != nil {
		logItem := s.recordCallLog(ctx, prepared.Request, prepared.Selected, StatusFail, time.Since(startedAt), encodeFailureLogResult(stage, err.Error()))
		return callResult{Log: logItem, Attempt: buildCallAttempt(prepared.Selected, StatusFail, logItem, err)}, err
	}
	req = prepared.Request
	selected = prepared.Selected
	adapter := prepared.Adapter
	nativeInput := prepared.NativeInput
	nativeReq := prepared.NativeRequest

	ctx, releaseResource, admissionErr := s.acquireRemoteResource(ctx, prepared)
	if admissionErr != nil {
		return callResult{}, admissionErr
	}
	defer finishSourceCall(ctx)
	prepared, err = s.refreshRemoteCredential(ctx, prepared)
	if err != nil {
		return callResult{}, err
	}
	selected, nativeInput, nativeReq = prepared.Selected, prepared.NativeInput, prepared.NativeRequest
	if data, persisted, err := restoreDirectMediaReceipt(ctx, prepared); err != nil {
		return callResult{}, executionError(err)
	} else if data != nil {
		return s.finishStreamResult(ctx, streamFinishInput{Request: req, Selected: selected, StartedAt: startedAt, NativeRequest: nativeReq, Data: data, Normalized: true, SkipMediaStore: persisted, CostAttempted: true, Receipt: &prepared})
	}
	checkpoint, checkpointErr := s.beginRemoteExecution(ctx, prepared)
	if checkpointErr != nil {
		return callResult{}, executionError(checkpointErr)
	}
	if checkpoint != nil {
		if checkpoint.Result != nil {
			releaseResource()
			data, err := executionResultData(checkpoint)
			if err != nil {
				return callResult{}, s.deferFinalizationError(ctx, req.RequestID, err)
			}
			return s.finishStreamResult(ctx, streamFinishInput{Request: req, Selected: selected, StartedAt: startedAt, NativeRequest: nativeReq, Data: data, Usage: tokenUsageFromMap(checkpoint.Usage), CostAttempted: true, Normalized: true, SkipMediaStore: checkpoint.Persisted != nil, ReleaseResource: releaseResource, Receipt: &prepared})
		}
	}
	if prepared.ReferenceAudio.Prepared {
		status := "参考音频已转换为 MP3"
		if prepared.ReferenceAudio.Trimmed {
			status = fmt.Sprintf(
				"参考音频已转换为 MP3 并截取为 %s 秒",
				formatReferenceAudioDuration(prepared.ReferenceAudio.Duration),
			)
		}
		_ = s.writeStreamStatus(
			ctx,
			req.RequestID,
			status,
		)
	}
	remoteCancelable := botstream.SupportsCancel(adapter, nativeInput)
	s.streamCancels.SetCancelable(req.RequestID, true)
	if err := s.writeStream(ctx, req.RequestID, botprotocol.BuildStreamResponse(req.RequestID, botprotocol.Output{
		"event": "control",
		"meta":  botstream.CancelableMeta(true),
	})); err != nil {
		return callResult{NativeRequest: nativeReq}, err
	}

	structuredProgress := newPowerOutputStreamProgress(selected.Power)
	baseWriter := powerOutputStreamWriter(selected.Power, structuredProgress, func(output botprotocol.Output) error {
		return s.writeStreamOutput(ctx, req.RequestID, output)
	})
	writeOutput := func(output botprotocol.Output) error {
		if writingOutputReceived(selected.Power, output) {
			receivedContent.Store(true)
		}
		return baseWriter(output)
	}
	progress, err := botruntime.StartProgress(ctx, selected.Service, selected.Power, writeOutput)
	if err != nil {
		logItem := s.recordCallLog(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("stream_progress", err.Error()), nativeReq)
		return callResult{NativeRequest: nativeReq, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
	}
	defer progress.Stop()
	if !bottask.IsPolling(adapter, nativeInput) {
		_ = s.writeStreamOutput(ctx, req.RequestID, botprotocol.Output{"event": "status", "text": "生成服务处理中", "meta": map[string]any{"execution_phase": "generating"}})
	}

	if result, err := s.resolveExecutionStream(ctx, checkpoint, bottask.StreamJob{
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
			if remoteCancelable {
				s.streamCancels.SetRemoteCancel(req.RequestID, cancel)
			}
		},
	}); result.Handled {
		if err != nil {
			if s.executionHandedOff(ctx, req.RequestID, err) {
				return callResult{}, &bottask.ExecutionHandoff{Cause: err}
			}
			s.audioRelay().Fail(req.RequestID, err)
			if _, media := generatedMediaRuleForKind(selected.Power.Kind); media {
				err = executionError(err)
			}
			usage := extractResponseTokenUsage(result.Response, result.Data)
			if s.streamCancels.IsCancelled(req.RequestID) {
				logItem := s.recordCallLogWithUsage(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("provider_stream_cancelled", err.Error()), usage, nativeReq)
				return callResult{NativeRequest: nativeReq, Response: result.Response, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
			}
			logItem := s.recordCallLogWithUsage(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("provider_stream", err.Error()), usage, nativeReq)
			return callResult{NativeRequest: nativeReq, Response: result.Response, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
		}
		s.audioRelay().Complete(req.RequestID)

		finished, finishErr := s.finishStreamResult(ctx, streamFinishInput{
			Request:         req,
			Selected:        selected,
			StartedAt:       startedAt,
			NativeRequest:   nativeReq,
			Response:        result.Response,
			Data:            result.Data,
			Usage:           extractResponseTokenUsage(result.Response, result.Data),
			Progress:        progress,
			WriteEnd:        true,
			CostAttempted:   true,
			ReleaseResource: releaseResource,
			Receipt:         &prepared,
		})
		return finished, bottask.WrapTaskError(adapter, "", finishErr)
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

	decoder, _ := adapter.(botprotocol.StreamOutputDecoder)
	stream := nativeOutputStream{progress: structuredProgress, write: writeOutput, decoder: decoder}
	resp, err := requestNativeStream(ctx, streamClient, nativeReq, &stream, req.WritingAction != "")
	if stream.receivedContent {
		receivedContent.Store(true)
	}
	if flushErr := stream.Flush(); flushErr != nil {
		err = errors.Join(err, flushErr)
	}
	if err != nil {
		if s.executionHandedOff(ctx, req.RequestID, err) {
			return callResult{}, &bottask.ExecutionHandoff{Cause: err}
		}
		if s.streamCancels.IsCancelled(req.RequestID) {
			logItem := s.recordCallLogWithUsage(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("provider_stream_cancelled", err.Error()), stream.usage, nativeReq)
			return callResult{NativeRequest: nativeReq, Response: resp, Log: logItem, Attempt: buildCallAttempt(selected, StatusFail, logItem, err)}, err
		}
		logItem := s.recordCallLogWithUsage(ctx, req, selected, StatusFail, time.Since(startedAt), encodeFailureLogResult("provider_stream", nativeStreamFailureDetail(err)), stream.usage, nativeReq)
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

	writeEnd := !botstream.HasEnd(stream.outputs) || botmodel.RequiresStructuredOutput(selected.Power)
	if writeEnd {
		stream.outputs = append(stream.outputs, botprotocol.Output{"event": "end"})
	}

	data := stream.MergeFinal(resp.Body)
	return s.finishStreamResult(ctx, streamFinishInput{
		Request:         req,
		Selected:        selected,
		StartedAt:       startedAt,
		NativeRequest:   nativeReq,
		Response:        resp,
		Data:            data,
		Usage:           stream.usage.Prefer(extractResponseTokenUsage(resp, data)),
		Progress:        progress,
		WriteEnd:        writeEnd,
		CostAttempted:   true,
		ReleaseResource: releaseResource,
		Receipt:         &prepared,
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
	return powerOutputStreamWriter(power, newPowerOutputStreamProgress(power), func(output botprotocol.Output) error {
		return s.writeStreamOutput(ctx, requestID, output)
	})
}

func powerOutputStreamWriter(power botmodel.Power, structuredProgress *powerOutputStreamProgress, write func(botprotocol.Output) error) func(botprotocol.Output) error {
	return func(output botprotocol.Output) error {
		if progressOutput, changed := structuredProgress.Consume(output); changed {
			if err := write(progressOutput); err != nil {
				return err
			}
		}
		if suppressStructuredOutputStream(power, output) {
			return nil
		}
		if _, generated := generatedMediaRuleForKind(power.Kind); generated && botprotocol.HasMediaOutput(output) && !botprotocol.IsStreamingAudioOutput(output) {
			return nil
		}
		return write(output)
	}
}

func (s GatewayService) writeStreamOutput(ctx context.Context, requestID string, output botprotocol.Output) error {
	if len(output) == 0 {
		return nil
	}
	if target, ok := ctx.Value(imageSequenceProgressTargetKey{}).(imageSequenceProgressTarget); ok {
		requestID = target.RequestID
		if botprotocol.AsText(output["event"]) == "status" {
			phase := botprotocol.AsText(botprotocol.NormalizeMap(output["meta"])["execution_phase"])
			if phase == "generating" {
				output["text"] = "正在生成" + target.FrameText
			} else if text := strings.TrimSpace(botprotocol.AsText(output["text"])); text != "" {
				output["text"] = target.FrameText + " · " + text
			}
		}
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
	// Only server-side receipts have already passed the output contract.
	Normalized      bool
	CostAttempted   bool
	ReleaseResource func()
	Receipt         *remoteCallPreparation
	Immediate       bool
}

func (s GatewayService) finishStreamResult(ctx context.Context, input streamFinishInput) (result callResult, failure error) {
	// ORM errors may panic after the remote result is already durable. Keep that receipt recoverable.
	defer func() {
		if recovered := recover(); recovered != nil {
			failure = s.deferFinalizationError(ctx, input.Request.RequestID, fmt.Errorf("保存能力结果失败: %v", recovered))
		}
	}()
	normalizedData := input.Data
	var err error
	if !input.Normalized {
		normalizedData, err = normalizePowerOutput(input.Request, input.Selected.Power, input.Data)
		if err == nil && !input.SkipMediaStore {
			normalizedData, err = resolveGeneratedMediaURLs(input.Selected.Power.Kind, normalizedData, input.NativeRequest.URL)
		}
	}
	if err != nil {
		logItem := s.recordCallLogInternal(ctx, input.Request, input.Selected, StatusFail, time.Since(input.StartedAt), encodeFailureLogResult("normalize_output", err.Error()), input.Usage, input.CostAttempted, input.NativeRequest)
		return callResult{NativeRequest: input.NativeRequest, Response: input.Response, Data: input.Data, Log: logItem, Attempt: buildCallAttempt(input.Selected, StatusFail, logItem, err)}, err
	}
	input.Data = normalizedData
	if input.Receipt != nil && !input.SkipMediaStore {
		if err := saveDirectMediaReceipt(ctx, *input.Receipt, input.Data, false); err != nil {
			return callResult{}, executionError(err)
		}
	}
	if bottask.Store(ctx) != nil && !input.SkipMediaStore {
		if input.Data, err = stageExecutionResult(ctx, input.Request.RequestID, input.Data, input.Usage); err != nil {
			return callResult{}, s.deferFinalizationError(ctx, input.Request.RequestID, err)
		}
	}
	if input.Receipt != nil && bottask.Store(ctx) == nil && !input.SkipMediaStore {
		if staged, _, err := restoreDirectMediaReceipt(ctx, *input.Receipt); err != nil {
			return callResult{}, executionError(err)
		} else if staged != nil {
			input.Data = staged
		}
	}
	if input.ReleaseResource != nil {
		input.ReleaseResource()
	}
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
		if bottask.Store(ctx) != nil {
			return callResult{}, s.deferFinalizationError(ctx, input.Request.RequestID, err)
		}
		logItem := s.recordCallLogInternal(ctx, input.Request, input.Selected, StatusFail, time.Since(input.StartedAt), encodeFailureLogResult("store_media", err.Error()), input.Usage, input.CostAttempted, input.NativeRequest)
		return callResult{NativeRequest: input.NativeRequest, Response: input.Response, Data: input.Data, Log: logItem, Attempt: buildCallAttempt(input.Selected, StatusFail, logItem, err)}, executionError(err)
	}
	input.Data = storedData
	if input.Receipt != nil {
		if err := saveDirectMediaReceipt(ctx, *input.Receipt, input.Data, true); err != nil {
			return callResult{}, executionError(err)
		}
	}
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
	var logItem botmodel.Log
	recordSuccess := func(tx context.Context) error {
		logItem = s.recordCallLogInternal(tx, input.Request, input.Selected, StatusSuccess, time.Since(input.StartedAt), encodeLogJSON(resultResp.Payload()), input.Usage, input.CostAttempted, input.NativeRequest)
		return nil
	}
	if bottask.Store(ctx) != nil {
		if err := commitExecutionResult(ctx, input.Request.RequestID, powerOutputFromData(input.Data), recordSuccess); err != nil {
			return callResult{}, s.deferFinalizationError(ctx, input.Request.RequestID, err)
		}
	} else {
		if input.Receipt != nil && input.SkipMediaStore {
			billing := input.Request.Billing
			existing := botmodel.NewLogModel().Find(ctx, map[string]any{"request_id": input.Request.RequestID, "user_id": billing.UserID, "project_id": billing.ProjectID, "power_target_id": input.Selected.PowerTarget.ID, "account_id": input.Selected.Account.ID, "status": StatusSuccess})
			if existing != nil {
				logItem = *existing
			} else {
				_ = recordSuccess(ctx)
			}
		} else {
			_ = recordSuccess(ctx)
		}
	}
	if !input.Immediate {
		if err := s.writeStream(ctx, input.Request.RequestID, resultResp); err != nil {
			return callResult{NativeRequest: input.NativeRequest, Response: input.Response, Data: input.Data, Log: logItem, Attempt: buildCallAttempt(input.Selected, StatusSuccess, logItem, nil)}, err
		}
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

func (s GatewayService) dispatchNormalizePowerTarget(ctx context.Context, req *botprotocol.ShemicRequest, selected selectedTarget) (callResult, error) {
	if botmodel.IsStoryboardGridPower(selected.Power) {
		return s.callNormalizeStoryboardGrid(ctx, req, selected)
	}
	if shouldPlanContextImages(req, selected.Power) {
		return s.callNormalizeContextImages(ctx, req, selected)
	}
	return s.callNormalizeTarget(ctx, req, selected)
}
