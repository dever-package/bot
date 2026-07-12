package loop

import (
	"context"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	frontstream "github.com/dever-package/front/service/stream"
)

const runtimeStreamNamespace = "agent_runtime"

func (s Service) startExecutionStream(ctx context.Context, execution execution) (map[string]any, error) {
	payload := frontstream.ResponsePayload(execution.requestID, botprotocol.ResponseTypeStream, map[string]any{
		"event": "start",
		"text":  "",
		"meta": map[string]any{
			"stream_key": frontstream.StreamKey(runtimeStreamNamespace, execution.requestID),
			"cancelable": true,
			"run_id":     execution.runID,
		},
	}, "", botprotocol.ResponseStatusSuccess)
	if err := s.writeExecutionPayload(ctx, execution, payload); err != nil {
		return nil, err
	}
	return payload, nil
}

func (s Service) writeExecutionOutput(ctx context.Context, execution execution, output map[string]any) error {
	return s.writeExecutionPayload(ctx, execution, frontstream.ResponsePayload(
		execution.requestID,
		botprotocol.ResponseTypeStream,
		output,
		"",
		botprotocol.ResponseStatusSuccess,
	))
}

func (s Service) writeExecutionResult(ctx context.Context, execution execution, output map[string]any, message string, status int) error {
	return s.writeExecutionPayload(ctx, execution, frontstream.ResponsePayload(
		execution.requestID,
		botprotocol.ResponseTypeResult,
		output,
		message,
		status,
	))
}

func (s Service) writeExecutionPayload(ctx context.Context, execution execution, payload map[string]any) error {
	if _, err := s.streams.WritePayload(ctx, execution.requestID, payload); err != nil {
		return err
	}
	notifyStream(execution.onStream, payload)
	return nil
}

func notifyStream(callback func(map[string]any), payload map[string]any) {
	if callback == nil {
		return
	}
	defer func() {
		_ = recover()
	}()
	callback(payload)
}
