package energon

import (
	"context"
	"fmt"
	"strings"
	"time"

	botinput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	botruntime "github.com/dever-package/bot/service/energon/runtime"
	botstream "github.com/dever-package/bot/service/energon/stream"
	botwebcontent "github.com/dever-package/bot/service/energon/webcontent"
)

func (s GatewayService) callWebContentTarget(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
	stream bool,
) (callResult, error) {
	startedAt := time.Now()
	req.Protocol = botwebcontent.Protocol
	if !botwebcontent.ServiceMatchesPlatform(selected.Service.Path, selected.Provider.ProtocolOption) {
		err := fmt.Errorf("自媒体来源服务与平台配置不一致，请重新保存来源")
		return s.webContentCallFailure(ctx, req, selected, startedAt, "webcontent_service", err, botprovider.Request{})
	}

	mapped, err := botinput.BuildMapped(ctx, s.repo, req, botinput.Target{
		PowerID:   selected.Power.ID,
		ServiceID: selected.Service.ID,
	})
	if err != nil {
		return s.webContentCallFailure(ctx, req, selected, startedAt, "map_webcontent_input", err, botprovider.Request{})
	}
	selected, err = s.applyServiceEndpoint(ctx, selected, mapped)
	if err != nil {
		return s.webContentCallFailure(ctx, req, selected, startedAt, "select_webcontent_endpoint", err, botprovider.Request{})
	}
	if !strings.EqualFold(strings.TrimSpace(selected.ServiceAPI), botwebcontent.ResolveAPI) {
		err := fmt.Errorf("自媒体来源服务接口无效，请重新保存来源")
		return s.webContentCallFailure(ctx, req, selected, startedAt, "webcontent_endpoint", err, botprovider.Request{})
	}

	nativeRequest, err := botwebcontent.BuildNativeRequest(
		selected.Provider.ProtocolOption,
		mapped.NativeBody(),
		selected.Account.Key,
	)
	if err != nil {
		return s.webContentCallFailure(ctx, req, selected, startedAt, "build_webcontent_request", err, botprovider.Request{})
	}

	var progress *botruntime.ProgressTracker
	if stream {
		s.streamCancels.SetCancelable(req.RequestID, true)
		if err := s.writeStream(ctx, req.RequestID, botprotocol.BuildStreamResponse(req.RequestID, botprotocol.Output{
			"event": "control",
			"meta":  botstream.CancelableMeta(true),
		})); err != nil {
			return callResult{NativeRequest: nativeRequest}, err
		}
		writeOutput := s.streamOutputWriter(ctx, req.RequestID, selected.Power)
		progress, err = botruntime.StartProgress(ctx, selected.Service, selected.Power, writeOutput)
		if err != nil {
			return s.webContentCallFailure(ctx, req, selected, startedAt, "webcontent_stream_progress", err, nativeRequest)
		}
		defer progress.Stop()
		_ = s.writeStreamStatus(ctx, req.RequestID, "正在解析网页内容")
	}

	data, err := botwebcontent.Execute(
		ctx,
		selected.Provider.ProtocolOption,
		selected.Account.Key,
		nativeRequest.Body,
	)
	if err != nil {
		return s.webContentCallFailure(ctx, req, selected, startedAt, "webcontent_resolve", err, nativeRequest)
	}
	if stream {
		return s.finishStreamResult(ctx, streamFinishInput{
			Request:        req,
			Selected:       selected,
			StartedAt:      startedAt,
			NativeRequest:  nativeRequest,
			Data:           data,
			Progress:       progress,
			WriteEnd:       true,
			SkipMediaStore: true,
			CostAttempted:  false,
		})
	}

	logItem := s.recordCallLogInternal(
		ctx,
		req,
		selected,
		StatusSuccess,
		time.Since(startedAt),
		encodeLogJSON(data),
		tokenUsage{},
		false,
		nativeRequest,
	)
	return callResult{
		NativeRequest: nativeRequest,
		ServiceAPI:    selected.ServiceAPI,
		Data:          data,
		Log:           logItem,
		Attempt:       buildCallAttempt(selected, StatusSuccess, logItem, nil),
	}, nil
}

func (s GatewayService) webContentCallFailure(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
	startedAt time.Time,
	stage string,
	err error,
	nativeRequest botprovider.Request,
) (callResult, error) {
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
		false,
		requests...,
	)
	return callResult{
		NativeRequest: nativeRequest,
		Log:           logItem,
		Attempt:       buildCallAttempt(selected, StatusFail, logItem, err),
	}, err
}
