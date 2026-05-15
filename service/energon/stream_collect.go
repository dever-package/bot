package energon

import (
	"context"
	"fmt"
	"strings"
	"time"

	botprotocol "my/package/bot/service/energon/protocol"
	frontstream "my/package/front/service/stream"
)

type StreamCollectOptions struct {
	RequestID        string
	InitialLastID    string
	Block            time.Duration
	CollectDeltaText bool
	CollectOutputs   bool
	OnOutput         func(ctx context.Context, output botprotocol.Output) error
}

type StreamCollectState struct {
	LastID  string
	Text    string
	Outputs []botprotocol.Output
}

type StreamCollectResult struct {
	Frame   map[string]any
	State   StreamCollectState
	Err     error
	Timeout bool
}

func (s GatewayService) CollectStream(ctx context.Context, options StreamCollectOptions) StreamCollectResult {
	requestID := strings.TrimSpace(options.RequestID)
	if requestID == "" {
		return StreamCollectResult{Err: fmt.Errorf("request_id 不能为空")}
	}

	lastID := strings.TrimSpace(options.InitialLastID)
	if lastID == "" {
		lastID = "0-0"
	}
	block := options.Block
	if block <= 0 {
		block = time.Second
	}

	var text strings.Builder
	outputs := make([]botprotocol.Output, 0)

	for {
		select {
		case <-ctx.Done():
			_ = s.StopStream(context.Background(), requestID)
			return StreamCollectResult{
				State: StreamCollectState{
					LastID:  lastID,
					Text:    text.String(),
					Outputs: outputs,
				},
				Err:     ctx.Err(),
				Timeout: true,
			}
		default:
		}

		entries, err := s.ReadStream(ctx, requestID, lastID, 1, block)
		if err != nil {
			return StreamCollectResult{
				State: StreamCollectState{
					LastID:  lastID,
					Text:    text.String(),
					Outputs: outputs,
				},
				Err: err,
			}
		}
		if len(entries) == 0 {
			continue
		}

		for _, entry := range entries {
			lastID = entry.ID
			frame := entry.Payload
			output := StreamFrameOutput(frame)

			if options.CollectDeltaText && StreamOutputEvent(output) == "delta" {
				text.WriteString(frontstream.InputText(output["text"]))
			}
			if options.CollectOutputs && len(output) > 0 {
				outputs = append(outputs, output)
			}
			if StreamFrameType(frame) == "result" {
				return StreamCollectResult{
					Frame: frame,
					State: StreamCollectState{
						LastID:  lastID,
						Text:    text.String(),
						Outputs: outputs,
					},
				}
			}
			if options.OnOutput != nil && len(output) > 0 {
				if err := options.OnOutput(ctx, output); err != nil {
					return StreamCollectResult{
						State: StreamCollectState{
							LastID:  lastID,
							Text:    text.String(),
							Outputs: outputs,
						},
						Err: err,
					}
				}
			}
		}
	}
}

func StreamFrameType(frame map[string]any) string {
	return strings.ToLower(strings.TrimSpace(frontstream.InputText(frame["type"])))
}

func StreamFrameOutput(frame map[string]any) botprotocol.Output {
	if frame == nil {
		return botprotocol.Output{}
	}
	if output, ok := frame["output"].(botprotocol.Output); ok {
		return output
	}
	if output, ok := frame["output"].(map[string]any); ok {
		return botprotocol.Output(output)
	}
	return botprotocol.Output{}
}

func StreamOutputEvent(output botprotocol.Output) string {
	if output == nil {
		return ""
	}
	return strings.ToLower(strings.TrimSpace(frontstream.InputText(output["event"])))
}
