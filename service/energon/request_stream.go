package energon

import (
	"context"
	"time"

	botprotocol "my/package/bot/service/energon/protocol"
	bottask "my/package/bot/service/energon/task"
)

const streamWorkerTimeout = 10 * time.Minute

func (s GatewayService) StartStream(ctx context.Context, raw GatewayRequest) botprotocol.Response {
	raw.RequestID = resolveRequestID(raw)
	raw.Body = botprotocol.NormalizeRequestBody(raw.Body)
	s.streamCancels.Init(raw.RequestID)

	start := botprotocol.BuildStreamResponse(raw.RequestID, botprotocol.Output{
		"event": "start",
		"text":  "流式调用已开始",
		"meta": map[string]any{
			"stream_key": StreamKey(raw.RequestID),
			"cancelable": false,
		},
	})

	writeCtx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	if _, err := s.streams.Write(writeCtx, raw.RequestID, start); err != nil {
		return botprotocol.BuildErrorResponse(raw.RequestID, err)
	}

	if err := s.tasks.Submit(ctx, newStreamJob(raw)); err != nil {
		s.streamCancels.Remove(raw.RequestID)
		return botprotocol.BuildErrorResponse(raw.RequestID, err)
	}
	return start
}

func (s GatewayService) ReadStream(ctx context.Context, requestID string, lastID string, count int64, block time.Duration) ([]StreamEntry, error) {
	return s.streams.Read(ctx, requestID, lastID, count, block)
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
	_, err := s.streams.Write(ctx, requestID, resp)
	return err
}

func cloneGatewayRequest(raw GatewayRequest) GatewayRequest {
	next := raw
	if raw.Headers != nil {
		next.Headers = make(map[string]string, len(raw.Headers))
		for key, value := range raw.Headers {
			next.Headers[key] = value
		}
	}
	if raw.Body != nil {
		next.Body = make(map[string]any, len(raw.Body))
		for key, value := range raw.Body {
			next.Body[key] = value
		}
	}
	return next
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
