package energon

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	botinput "github.com/dever-package/bot/service/energon/input"
	botprocessor "github.com/dever-package/bot/service/energon/processor"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	botruntime "github.com/dever-package/bot/service/energon/runtime"
	botstream "github.com/dever-package/bot/service/energon/stream"
	bottask "github.com/dever-package/bot/service/energon/task"
)

func (s GatewayService) callLocalTarget(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
	stream bool,
) (callResult, error) {
	startedAt := time.Now()
	req.Protocol = botprocessor.ProtocolLocal
	if !localServiceMatchesProcessor(selected.Service.Path, selected.Provider.ProtocolOption) {
		err := fmt.Errorf("本地来源服务与处理器配置不一致，请重新保存来源")
		return s.localCallFailure(ctx, req, selected, startedAt, "local_service", err, botprovider.Request{}, false)
	}

	mappedInput, err := botinput.BuildMapped(ctx, s.repo, req, botinput.Target{
		PowerID:   selected.Power.ID,
		ServiceID: selected.Service.ID,
	})
	if err != nil {
		return s.localCallFailure(ctx, req, selected, startedAt, "map_local_input", err, botprovider.Request{}, false)
	}
	selected, err = s.applyServiceEndpoint(ctx, selected, mappedInput)
	if err != nil {
		return s.localCallFailure(ctx, req, selected, startedAt, "select_local_endpoint", err, botprovider.Request{}, false)
	}

	ctx, releaseResource, admissionErr := s.acquireSource(ctx, req, selected, false)
	if admissionErr != nil {
		return callResult{}, admissionErr
	}
	defer finishSourceCall(ctx)
	selected = ctx.Value(sourceCallKey{}).(*sourceCall).selected
	checkpoint, loadErr := prepareExecution(ctx, req.RequestID)
	if loadErr != nil {
		return callResult{}, loadErr
	}
	if checkpoint.Result != nil || checkpoint.Persisted != nil {
		data, err := executionResultData(checkpoint)
		if err != nil {
			return callResult{}, err
		}
		return s.finishStreamResult(ctx, streamFinishInput{Immediate: !stream, Request: req, Selected: selected, StartedAt: startedAt, Data: data, SkipMediaStore: true})
	}
	if checkpoint.Stage != bottask.ExecutionPrepared {
		return callResult{}, executionError(fmt.Errorf("本地任务执行结果待核对，未重复执行"))
	}
	if _, err = saveSelectedCheckpoint(ctx, checkpoint, req, selected, mappedInput, req.Protocol, false); err != nil {
		return callResult{}, err
	}
	_ = releaseResource

	nativeRequest := botprovider.Request{
		URL:     localProcessorCallURL(selected.Provider.ProtocolOption, selected.ServiceAPI),
		Method:  "EXEC",
		Headers: map[string]string{},
		Body:    mappedInput.NativeBody(),
	}
	if !stream {
		return s.executeLocalTarget(ctx, req, selected, startedAt, nativeRequest, nil, nil)
	}

	s.streamCancels.SetCancelable(req.RequestID, true)
	if err := s.writeStream(ctx, req.RequestID, botprotocol.BuildStreamResponse(req.RequestID, botprotocol.Output{
		"event": "control",
		"meta":  botstream.CancelableMeta(true),
	})); err != nil {
		return callResult{NativeRequest: nativeRequest}, err
	}
	writeOutput := s.streamOutputWriter(ctx, req.RequestID, selected.Power)
	progress, err := botruntime.StartProgress(ctx, selected.Service, selected.Power, writeOutput)
	if err != nil {
		return s.localCallFailure(ctx, req, selected, startedAt, "local_stream_progress", err, nativeRequest, false)
	}
	defer progress.Stop()

	result, err := s.executeLocalTarget(ctx, req, selected, startedAt, nativeRequest, writeOutput, progress)
	if err != nil && s.streamCancels.IsCancelled(req.RequestID) {
		return callResult{NativeRequest: nativeRequest}, err
	}
	return result, err
}

func (s GatewayService) executeLocalTarget(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
	startedAt time.Time,
	nativeRequest botprovider.Request,
	writeOutput func(botprotocol.Output) error,
	progress *botruntime.ProgressTracker,
) (callResult, error) {
	if s.processors == nil {
		err := fmt.Errorf("本地处理器注册表未初始化")
		return s.localCallFailure(ctx, req, selected, startedAt, "local_registry", err, nativeRequest, false)
	}
	data, err := s.processors.Execute(ctx, selected.Provider.ProtocolOption, botprocessor.ExecuteRequest{
		RequestID: req.RequestID,
		Operation: selected.ServiceAPI,
		Input:     nativeRequest.Body,
		Write:     writeOutput,
	})
	if call, ok := ctx.Value(sourceCallKey{}).(*sourceCall); ok {
		err = errors.Join(err, call.complete(context.WithoutCancel(ctx)))
	}
	if err != nil {
		return s.localCallFailure(ctx, req, selected, startedAt, "local_processor", err, nativeRequest, true)
	}
	usage := extractTokenUsage(data)

	if data, err = stageExecutionResult(ctx, req.RequestID, data, usage); err != nil {
		return callResult{}, s.deferFinalizationError(ctx, req.RequestID, err)
	}
	return s.finishStreamResult(ctx, streamFinishInput{Immediate: writeOutput == nil, Request: req, Selected: selected, StartedAt: startedAt, NativeRequest: nativeRequest, Data: data, Usage: usage, Progress: progress, WriteEnd: writeOutput != nil, SkipMediaStore: true, CostAttempted: true})
}

func (s GatewayService) localCallFailure(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
	startedAt time.Time,
	stage string,
	err error,
	nativeRequest botprovider.Request,
	costAttempted bool,
) (callResult, error) {
	if s.executionHandedOff(ctx, req.RequestID, err) {
		return callResult{}, &bottask.ExecutionHandoff{Cause: err}
	}

	requests := []botprovider.Request{}
	if strings.TrimSpace(nativeRequest.URL) != "" {
		requests = append(requests, nativeRequest)
	}
	logItem := s.recordCallLogInternal(
		ctx,
		req,
		selected,
		StatusFail,
		time.Since(startedAt),
		encodeFailureLogResult(stage, err.Error()),
		tokenUsage{},
		costAttempted,
		requests...,
	)
	return callResult{
		NativeRequest: nativeRequest,
		Log:           logItem,
		Attempt:       buildCallAttempt(selected, StatusFail, logItem, err),
	}, err
}

func localProcessorCallURL(processorKey string, operation string) string {
	return "local://" + strings.ToLower(strings.TrimSpace(processorKey)) + "/" + strings.ToLower(strings.TrimSpace(operation))
}

func localServiceMatchesProcessor(servicePath string, processorKey string) bool {
	prefix := "local://" + strings.ToLower(strings.TrimSpace(processorKey)) + "/"
	return prefix != "local:///" && strings.HasPrefix(strings.ToLower(strings.TrimSpace(servicePath)), prefix)
}
