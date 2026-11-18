package energon

import (
	"context"
	"errors"
	"fmt"
	"time"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botstream "github.com/dever-package/bot/service/energon/stream"
	bottask "github.com/dever-package/bot/service/energon/task"
	"github.com/dever-package/bot/service/worker"
)

func (s GatewayService) Request(ctx context.Context, raw GatewayRequest) botprotocol.Response {
	ctx = bottask.WithDefaultStoreFor(ctx, raw.Billing.UserID, raw.AdminID)
	raw.RequestID = resolveRequestID(raw)
	raw.Body = botprotocol.NormalizeRequestBody(raw.Body)
	checkpoint, prepareErr := prepareExecution(ctx, raw.RequestID)
	if prepareErr != nil {
		return botprotocol.BuildErrorResponse(raw.RequestID, executionError(prepareErr))
	}
	if checkpoint.Failure != "" {
		return botprotocol.BuildErrorResponse(raw.RequestID, executionError(botprotocol.RestoreWritingResultError(raw.RequestID, checkpoint.FailureCode, checkpoint.Failure)))
	}
	if err := saveSourceRequest(ctx, raw); err != nil {
		return botprotocol.BuildErrorResponse(raw.RequestID, executionError(err))
	}
	if botprotocol.IsStreamEnabled(raw.Body) {
		return s.StartStream(ctx, raw)
	}

	response, err := s.Handle(ctx, raw)
	if err != nil {
		if botprotocol.IsWritingResultError(err, raw.RequestID) {
			err = saveWritingExecutionFailure(ctx, raw.RequestID, err)
		}
		var handoff interface{ DeferPowerSettlement() bool }
		if errors.As(err, &handoff) && handoff.DeferPowerSettlement() {
			bottask.SignalHandoff(ctx)
		} else {
			err = rememberSourceError(ctx, raw.RequestID, err)
		}
		return botprotocol.BuildErrorResponse(raw.RequestID, err)
	}

	return botprotocol.BuildSuccessResponse(response.RequestID, response.Data)
}

// 即时请求也保存同一失败回执；持久读取不能把内容拒绝退化为未知请求。
func saveWritingExecutionFailure(ctx context.Context, requestID string, failure error) error {
	store := bottask.Store(ctx)
	if store == nil {
		return failure
	}
	checkpoint, err := store.Load(ctx, requestID)
	if err != nil {
		return errors.Join(failure, err)
	}
	if checkpoint == nil || checkpoint.RequestID != requestID || checkpoint.Result != nil || checkpoint.Persisted != nil {
		return errors.Join(failure, fmt.Errorf("写作失败回执的请求状态已变化"))
	}
	checkpoint.Failure, checkpoint.FailureCode = failure.Error(), botprotocol.WritingResultFailureCode
	if _, err = store.Save(ctx, bottask.ExecutionChange{Checkpoint: *checkpoint}); err != nil {
		return errors.Join(failure, err)
	}
	return failure
}

func (s GatewayService) StartStream(ctx context.Context, raw GatewayRequest) botprotocol.Response {
	ctx = bottask.WithDefaultStoreFor(ctx, raw.Billing.UserID, raw.AdminID)
	raw.RequestID = resolveRequestID(raw)
	raw.Body = botprotocol.NormalizeRequestBody(raw.Body)
	checkpoint, err := prepareExecution(ctx, raw.RequestID)
	if err != nil {
		return botprotocol.BuildErrorResponse(raw.RequestID, executionError(err))
	}
	if checkpoint.Failure != "" {
		return botprotocol.BuildErrorResponse(raw.RequestID, executionError(botprotocol.RestoreWritingResultError(raw.RequestID, checkpoint.FailureCode, checkpoint.Failure)))
	}
	if err := saveSourceRequest(ctx, raw); err != nil {
		return botprotocol.BuildErrorResponse(raw.RequestID, executionError(err))
	}
	if !worker.Active() {
		botmodel.NewExecutionModel().Update(ctx, map[string]any{"request_id": raw.RequestID, "phase": "prepared"}, map[string]any{"phase": "queued"})
	}
	response, err := botstream.Start(ctx, s.streams, s.streamCancels, s.tasks, raw.RequestID, newStreamJob(raw))
	if err == nil {
		return response
	}
	var handoff *bottask.ExecutionHandoff
	if !errors.As(err, &handoff) {
		err = rememberSourceError(ctx, raw.RequestID, err)
	}
	return botprotocol.BuildErrorResponse(raw.RequestID, err)
}

func (s GatewayService) ReadStream(ctx context.Context, requestID string, lastID string, count int64, block time.Duration) ([]botstream.Entry, error) {
	return botstream.Read(ctx, s.streams, requestID, lastID, count, block)
}

func (s GatewayService) StopStream(ctx context.Context, requestID string) botprotocol.Response {
	err := s.CancelSource(ctx, requestID)
	response := sourceCancelResponse(requestID, err)
	if err == nil {
		if writeErr := s.writeStream(ctx, requestID, response); writeErr != nil {
			return botprotocol.BuildErrorResponse(requestID, writeErr)
		}
	}
	return response
}

func (s GatewayService) CollectStream(ctx context.Context, options botstream.CollectOptions) botstream.CollectResult {
	return botstream.Collect(ctx, s.ReadStream, s.StopStream, options)
}

func (s GatewayService) handleStreamJob(ctx context.Context, job bottask.Job) (failure error) {
	ctx = withRepoRequestCache(ctx)
	raw := streamJobRequest(job)
	var failureOutput botprotocol.Output
	defer s.streamCancels.Remove(raw.RequestID)
	defer func() {
		if recovered := recover(); recovered != nil {
			failure = fmt.Errorf("能力执行失败: %v", recovered)
		}
		if failure == nil {
			return
		}
		if s.streamCancels.IsCancelled(raw.RequestID) {
			return
		}
		var handoff interface{ DeferPowerSettlement() bool }
		if (ctx.Err() != nil && !wasNotSubmitted(failure)) || (errors.As(failure, &handoff) && handoff.DeferPowerSettlement()) {
			bottask.SignalHandoff(ctx)
			return
		}
		if store := bottask.Store(ctx); store != nil {
			checkpoint, err := store.Load(context.WithoutCancel(ctx), raw.RequestID)
			if err == nil && checkpoint != nil && (checkpoint.Result != nil || checkpoint.Persisted != nil) {
				failure = s.deferFinalizationError(ctx, raw.RequestID, failure)
				if errors.As(failure, &handoff) && handoff.DeferPowerSettlement() {
					bottask.SignalHandoff(ctx)
					return
				}
			}
			if err == nil && checkpoint != nil {
				failureOutput = checkpoint.FailureOutput
				if checkpoint.RemoteTaskID != "" && checkpoint.RemoteResponse == nil {
					bottask.SignalHandoff(ctx)
					return
				}
				checkpoint.LastError = failure.Error()
				checkpoint.Failure = failure.Error()
				if botprotocol.IsWritingResultError(failure, raw.RequestID) {
					checkpoint.FailureCode = botprotocol.WritingResultFailureCode
				}
				_, err = store.Save(context.WithoutCancel(ctx), bottask.ExecutionChange{Checkpoint: *checkpoint})
			}
			if err != nil {
				if errors.As(err, &handoff) && handoff.DeferPowerSettlement() {
					bottask.SignalHandoff(ctx)
					return
				}
				failure = errors.Join(failure, err)
			}
		}
		_ = s.writeStream(ctx, raw.RequestID, botprotocol.BuildStreamErrorResponse(raw.RequestID, failure))
		response := botprotocol.BuildErrorResponse(raw.RequestID, failure)
		for key, value := range failureOutput {
			response.Output[key] = value
		}
		_ = s.writeStream(ctx, raw.RequestID, response)
	}()
	if !botprotocol.IsStreamEnabled(raw.Body) {
		response, err := s.Handle(ctx, raw)
		if err != nil {
			return err
		}
		return s.writeStream(ctx, raw.RequestID, botprotocol.BuildSuccessResponse(raw.RequestID, response.Data))
	}
	return s.handleStream(ctx, raw)
}

func (s GatewayService) writeStream(ctx context.Context, requestID string, resp botprotocol.Response) error {
	err := botstream.Write(ctx, s.streams, requestID, resp)
	if bottask.NotificationFailed(ctx, requestID, err) {
		return nil
	}
	return err
}

func newStreamJob(raw GatewayRequest) bottask.Job {
	raw = cloneGatewayRequest(raw)
	return bottask.Job{
		RequestID:                 raw.RequestID,
		AdminID:                   raw.AdminID,
		Method:                    raw.Method,
		Host:                      raw.Host,
		Path:                      raw.Path,
		Headers:                   raw.Headers,
		Body:                      raw.Body,
		Billing:                   raw.Billing,
		AllowedSourceTargetIDs:    raw.AllowedSourceTargetIDs,
		StoryboardMaxShotDuration: raw.StoryboardMaxShotDuration,
		WritingAction:             raw.WritingAction,
		WritingSectionID:          raw.WritingSectionID,
		WritingSourcePassageCount: raw.WritingSourcePassageCount,
		WritingCharacterIDs:       append([]string(nil), raw.WritingCharacterIDs...),
		WritingThreadIDs:          append([]string(nil), raw.WritingThreadIDs...),
		AllowSilentTextCompletion: raw.AllowSilentTextCompletion,
	}
}

func streamJobRequest(job bottask.Job) GatewayRequest {
	return GatewayRequest{
		RequestID:                 job.RequestID,
		AdminID:                   job.AdminID,
		Method:                    job.Method,
		Host:                      job.Host,
		Path:                      job.Path,
		Headers:                   cloneStringMap(job.Headers),
		Body:                      cloneAnyMap(job.Body),
		Billing:                   job.Billing,
		AllowedSourceTargetIDs:    cloneUint64Slice(job.AllowedSourceTargetIDs),
		StoryboardMaxShotDuration: job.StoryboardMaxShotDuration,
		WritingAction:             job.WritingAction,
		WritingSectionID:          job.WritingSectionID,
		WritingSourcePassageCount: job.WritingSourcePassageCount,
		WritingCharacterIDs:       append([]string(nil), job.WritingCharacterIDs...),
		WritingThreadIDs:          append([]string(nil), job.WritingThreadIDs...),
		AllowSilentTextCompletion: job.AllowSilentTextCompletion,
	}
}

func cloneGatewayRequest(raw GatewayRequest) GatewayRequest {
	next := raw
	next.Headers = cloneStringMap(raw.Headers)
	next.Body = cloneAnyMap(raw.Body)
	next.AllowedSourceTargetIDs = cloneUint64Slice(raw.AllowedSourceTargetIDs)
	next.WritingCharacterIDs = append([]string(nil), raw.WritingCharacterIDs...)
	next.WritingThreadIDs = append([]string(nil), raw.WritingThreadIDs...)
	return next
}

func cloneUint64Slice(source []uint64) []uint64 {
	return append([]uint64(nil), source...)
}

func cloneStringMap(source map[string]string) map[string]string {
	if source == nil {
		return nil
	}
	target := make(map[string]string, len(source))
	for key, value := range source {
		target[key] = value
	}
	return target
}

func cloneAnyMap(source map[string]any) map[string]any {
	if source == nil {
		return nil
	}
	target := make(map[string]any, len(source))
	for key, value := range source {
		target[key] = value
	}
	return target
}
