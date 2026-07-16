package loop

import (
	"context"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	frontstream "github.com/dever-package/front/service/stream"
)

const runtimeStreamNamespace = "agent_runtime"

var sharedRuntimeStreams = frontstream.New(runtimeStreamNamespace)

// StreamStore keeps API readers and durable workers on the same configured
// stream backend. Redis failures are surfaced so terminal delivery can retry.
func StreamStore() frontstream.Service {
	return sharedRuntimeStreams
}

func (s Service) startExecutionStream(ctx context.Context, execution execution) (map[string]any, error) {
	payload := frontstream.ResponsePayload(execution.requestID, botprotocol.ResponseTypeStream, withExecutionStreamMeta(execution, map[string]any{
		"event": "start",
		"text":  "",
		"meta": map[string]any{
			"stream_key": frontstream.StreamKey(runtimeStreamNamespace, execution.requestID),
			"cancelable": true,
			"run_id":     execution.runID,
		},
	}), "", botprotocol.ResponseStatusSuccess)
	if err := s.writeExecutionPayload(ctx, execution, payload); err != nil {
		return nil, err
	}
	return payload, nil
}

func (s Service) writeExecutionOutput(ctx context.Context, execution execution, output map[string]any) error {
	return s.writeExecutionPayload(ctx, execution, frontstream.ResponsePayload(
		execution.requestID,
		botprotocol.ResponseTypeStream,
		withExecutionStreamMeta(execution, output),
		"",
		botprotocol.ResponseStatusSuccess,
	))
}

func (s Service) writeExecutionResult(ctx context.Context, execution execution, output map[string]any, message string, status int) error {
	return s.writeExecutionPayload(ctx, execution, frontstream.ResponsePayload(
		execution.requestID,
		botprotocol.ResponseTypeResult,
		withExecutionStreamMeta(execution, output),
		message,
		status,
	))
}

func withExecutionStreamMeta(execution execution, output map[string]any) map[string]any {
	result := cloneMap(output)
	if result == nil {
		result = map[string]any{}
	}
	meta, _ := result["meta"].(map[string]any)
	meta = cloneMap(meta)
	if meta == nil {
		meta = map[string]any{}
	}
	if execution.runID > 0 {
		meta["run_id"] = execution.runID
	}
	if execution.version > 0 {
		meta["run_version"] = execution.version
	}
	if execution.assistantMessageID > 0 {
		meta["assistant_message_id"] = execution.assistantMessageID
	}
	result["meta"] = meta
	return result
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
