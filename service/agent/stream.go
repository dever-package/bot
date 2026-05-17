package agent

import (
	"context"
	"strings"
	"time"

	botprotocol "my/package/bot/service/energon/protocol"
	botstream "my/package/bot/service/energon/stream"
	frontstream "my/package/front/service/stream"
)

type gatewayStreamState struct {
	LastID  string
	Text    string
	Outputs []botprotocol.Output
}

type gatewayStreamOptions struct {
	InitialLastID       string
	TimeoutMessage      string
	CollectDeltaText    bool
	CollectOutputs      bool
	SuppressErrorResult bool
	OnOutput            func(ctx context.Context, output map[string]any) error
	OnResult            func(ctx context.Context, frame map[string]any, state gatewayStreamState) (string, string, string)
}

func (s Service) writePayload(ctx context.Context, requestID string, payload map[string]any) error {
	_, err := s.streams.WritePayload(ctx, requestID, payload)
	return err
}

func (s Service) writeStreamOutput(ctx context.Context, requestID string, output map[string]any) error {
	return s.writePayload(ctx, requestID, frontstream.ResponsePayload(requestID, "stream", output, "", 1))
}

func (s Service) writeStreamStatus(ctx context.Context, requestID string, text string, meta map[string]any) error {
	output := map[string]any{
		"event": "status",
		"text":  text,
	}
	for key, item := range meta {
		output[key] = item
	}
	return s.writeStreamOutput(ctx, requestID, output)
}

func (s Service) writeErrorResult(ctx context.Context, requestID string, message string) error {
	return s.writePayload(ctx, requestID, frontstream.ResponsePayload(requestID, "result", map[string]any{}, message, 2))
}

func (s Service) writeSuccessResult(ctx context.Context, requestID string, output map[string]any) error {
	return s.writePayload(ctx, requestID, frontstream.ResponsePayload(requestID, "result", output, "", 1))
}

func (s Service) writeCancelResult(ctx context.Context, requestID string) error {
	return s.writeSuccessResult(ctx, requestID, cancelOutput())
}

func cancelOutput() map[string]any {
	return map[string]any{
		"event": "cancel",
		"text":  "任务已取消",
	}
}

func responseErrorMessage(payload map[string]any, output map[string]any, fallback string) string {
	if output == nil {
		output = map[string]any{}
	}
	for _, item := range []any{payload["msg"], output["error"], output["text"]} {
		if text := strings.TrimSpace(frontstream.InputText(item)); text != "" {
			return text
		}
	}
	return fallback
}

func (s Service) collectGatewayStream(ctx context.Context, exec runExecution, options gatewayStreamOptions) (string, string, string) {
	result := s.gateway.CollectStream(ctx, botstream.CollectOptions{
		RequestID:        exec.RequestID,
		InitialLastID:    options.InitialLastID,
		Block:            time.Duration(defaultAgentStreamBlockMs) * time.Millisecond,
		CollectDeltaText: options.CollectDeltaText,
		CollectOutputs:   options.CollectOutputs,
		OnOutput: func(ctx context.Context, output botprotocol.Output) error {
			if options.OnOutput == nil {
				return nil
			}
			return options.OnOutput(ctx, map[string]any(output))
		},
	})
	if result.Err != nil {
		message := result.Err.Error()
		if result.Timeout {
			message = firstText(options.TimeoutMessage, "能力调用超时")
		}
		if !options.SuppressErrorResult {
			_ = s.writeErrorResult(context.Background(), exec.RequestID, message)
		}
		return result.State.Text, runStatusFail, message
	}
	if options.OnResult == nil {
		message := "流式结果处理器未配置"
		if !options.SuppressErrorResult {
			_ = s.writeErrorResult(ctx, exec.RequestID, message)
		}
		return result.State.Text, runStatusFail, message
	}
	return options.OnResult(ctx, result.Frame, gatewayStreamState{
		LastID:  result.State.LastID,
		Text:    result.State.Text,
		Outputs: result.State.Outputs,
	})
}

func isGatewayTimingOutput(output map[string]any) bool {
	switch botstream.OutputEvent(botprotocol.Output(output)) {
	case "control", "progress", "status", "warning":
		return true
	default:
		return false
	}
}

func normalizeGatewayStreamOutput(output map[string]any) map[string]any {
	next := cloneMap(output)
	if botstream.OutputEvent(botprotocol.Output(next)) == "" {
		next["event"] = "status"
	}
	return next
}
