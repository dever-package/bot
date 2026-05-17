package energon

import (
	"context"
	"time"

	botprotocol "my/package/bot/service/energon/protocol"
	botstream "my/package/bot/service/energon/stream"
	bottask "my/package/bot/service/energon/task"
)

func (s GatewayService) Request(ctx context.Context, raw GatewayRequest) botprotocol.Response {
	raw.RequestID = resolveRequestID(raw)
	raw.Body = botprotocol.NormalizeRequestBody(raw.Body)
	if botprotocol.IsStreamEnabled(raw.Body) {
		return s.StartStream(ctx, raw)
	}

	response, err := s.Handle(ctx, raw)
	if err != nil {
		return botprotocol.BuildErrorResponse(raw.RequestID, err)
	}

	return botprotocol.BuildSuccessResponse(response.RequestID, response.Data)
}

func (s GatewayService) StartStream(ctx context.Context, raw GatewayRequest) botprotocol.Response {
	raw.RequestID = resolveRequestID(raw)
	raw.Body = botprotocol.NormalizeRequestBody(raw.Body)
	return botstream.Start(ctx, s.streams, s.streamCancels, s.tasks, raw.RequestID, newStreamJob(raw))
}

func (s GatewayService) ReadStream(ctx context.Context, requestID string, lastID string, count int64, block time.Duration) ([]botstream.Entry, error) {
	return botstream.Read(ctx, s.streams, requestID, lastID, count, block)
}

func (s GatewayService) StopStream(ctx context.Context, requestID string) botprotocol.Response {
	return botstream.Stop(ctx, s.streams, s.streamCancels, s.tasks, requestID)
}

func (s GatewayService) CollectStream(ctx context.Context, options botstream.CollectOptions) botstream.CollectResult {
	return botstream.Collect(ctx, s.ReadStream, s.StopStream, options)
}

func (s GatewayService) handleStreamJob(ctx context.Context, job bottask.Job) error {
	raw := streamJobRequest(job)
	defer s.streamCancels.Remove(raw.RequestID)
	if err := s.handleStream(ctx, raw); err != nil {
		if s.streamCancels.IsCancelled(raw.RequestID) {
			return nil
		}
		_ = s.writeStream(ctx, raw.RequestID, botprotocol.BuildStreamErrorResponse(raw.RequestID, err))
		_ = s.writeStream(ctx, raw.RequestID, botprotocol.BuildErrorResponse(raw.RequestID, err))
		return err
	}
	return nil
}

func (s GatewayService) writeStream(ctx context.Context, requestID string, resp botprotocol.Response) error {
	return botstream.Write(ctx, s.streams, requestID, resp)
}

func newStreamJob(raw GatewayRequest) bottask.Job {
	raw = cloneGatewayRequest(raw)
	return bottask.Job{
		RequestID: raw.RequestID,
		Method:    raw.Method,
		Host:      raw.Host,
		Path:      raw.Path,
		Headers:   raw.Headers,
		Body:      raw.Body,
	}
}

func streamJobRequest(job bottask.Job) GatewayRequest {
	return GatewayRequest{
		RequestID: job.RequestID,
		Method:    job.Method,
		Host:      job.Host,
		Path:      job.Path,
		Headers:   cloneStringMap(job.Headers),
		Body:      cloneAnyMap(job.Body),
	}
}

func cloneGatewayRequest(raw GatewayRequest) GatewayRequest {
	next := raw
	next.Headers = cloneStringMap(raw.Headers)
	next.Body = cloneAnyMap(raw.Body)
	return next
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
