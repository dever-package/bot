package energon

import (
	"context"
	"fmt"
	"strings"
	"time"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botstream "github.com/dever-package/bot/service/energon/stream"
)

type InvokeOptions struct {
	InitialLastID string
	Block         time.Duration
	IdleTimeout   time.Duration
	OnOutput      func(context.Context, botprotocol.Output) error
}

type InvokeResult struct {
	RequestID string
	Output    botprotocol.Output
	Frame     map[string]any
	LastID    string
}

// Invoke executes a normalized capability request and returns one canonical
// output for both immediate and streamed providers.
func (s GatewayService) Invoke(ctx context.Context, request GatewayRequest, options InvokeOptions) (InvokeResult, error) {
	request.RequestID = resolveRequestID(request)
	response := s.Request(ctx, request)
	payload := response.Payload()
	if response.Status != botprotocol.ResponseStatusSuccess {
		return InvokeResult{RequestID: request.RequestID, Frame: payload}, gatewayFrameError(payload, "能力调用失败")
	}
	if botstream.FrameType(payload) == botprotocol.ResponseTypeResult {
		return InvokeResult{
			RequestID: request.RequestID,
			Output:    botstream.FrameOutput(payload),
			Frame:     payload,
		}, nil
	}

	collected := s.CollectStream(ctx, botstream.CollectOptions{
		RequestID:      request.RequestID,
		InitialLastID:  options.InitialLastID,
		Block:          options.Block,
		IdleTimeout:    options.IdleTimeout,
		CollectOutputs: true,
		OnOutput:       options.OnOutput,
	})
	result := InvokeResult{
		RequestID: request.RequestID,
		Frame:     collected.Frame,
		LastID:    collected.State.LastID,
		Output: botprotocol.MergeStreamFinal(
			collected.State.Outputs,
			botstream.FrameOutput(collected.Frame),
		),
	}
	if collected.Err != nil {
		return result, collected.Err
	}
	if intValue := botstream.FrameStatus(collected.Frame); intValue != botprotocol.ResponseStatusSuccess {
		return result, gatewayFrameError(collected.Frame, "能力调用失败")
	}
	return result, nil
}

func gatewayFrameError(frame map[string]any, fallback string) error {
	message := strings.TrimSpace(botprotocol.AsText(frame["msg"]))
	if message == "" {
		message = fallback
	}
	return fmt.Errorf("%s", message)
}
