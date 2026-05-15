package agent

import (
	"context"
	"time"

	energonservice "my/package/bot/service/energon"
	botprotocol "my/package/bot/service/energon/protocol"
)

type gatewayStreamState struct {
	LastID  string
	Text    string
	Outputs []botprotocol.Output
}

type gatewayStreamOptions struct {
	InitialLastID    string
	TimeoutMessage   string
	CollectDeltaText bool
	CollectOutputs   bool
	OnOutput         func(ctx context.Context, output map[string]any) error
	OnResult         func(ctx context.Context, frame map[string]any, state gatewayStreamState) (string, string, string)
}

func (s Service) collectGatewayStream(ctx context.Context, exec runExecution, options gatewayStreamOptions) (string, string, string) {
	result := s.gateway.CollectStream(ctx, energonservice.StreamCollectOptions{
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
		_ = s.writeErrorResult(context.Background(), exec.RequestID, message)
		return result.State.Text, runStatusFail, message
	}
	if options.OnResult == nil {
		message := "流式结果处理器未配置"
		_ = s.writeErrorResult(ctx, exec.RequestID, message)
		return result.State.Text, runStatusFail, message
	}
	return options.OnResult(ctx, result.Frame, gatewayStreamState{
		LastID:  result.State.LastID,
		Text:    result.State.Text,
		Outputs: result.State.Outputs,
	})
}
