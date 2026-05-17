package stream

import (
	"context"
	"fmt"
	"strings"
	"time"

	botprotocol "my/package/bot/service/energon/protocol"
	frontstream "my/package/front/service/stream"
)

type Reader func(ctx context.Context, requestID string, lastID string, count int64, block time.Duration) ([]Entry, error)
type Stopper func(ctx context.Context, requestID string) botprotocol.Response

type CollectOptions struct {
	RequestID        string
	InitialLastID    string
	Block            time.Duration
	CollectDeltaText bool
	CollectOutputs   bool
	OnOutput         func(ctx context.Context, output botprotocol.Output) error
}

type CollectState struct {
	LastID  string
	Text    string
	Outputs []botprotocol.Output
}

type CollectResult struct {
	Frame   map[string]any
	State   CollectState
	Err     error
	Timeout bool
}

func Collect(ctx context.Context, reader Reader, stop Stopper, options CollectOptions) CollectResult {
	requestID := strings.TrimSpace(options.RequestID)
	if requestID == "" {
		return CollectResult{Err: fmt.Errorf("request_id 不能为空")}
	}
	if reader == nil {
		return CollectResult{Err: fmt.Errorf("stream reader 未初始化")}
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

	state := func() CollectState {
		return CollectState{
			LastID:  lastID,
			Text:    text.String(),
			Outputs: outputs,
		}
	}

	for {
		select {
		case <-ctx.Done():
			if stop != nil {
				_ = stop(context.Background(), requestID)
			}
			return CollectResult{State: state(), Err: ctx.Err(), Timeout: true}
		default:
		}

		entries, err := reader(ctx, requestID, lastID, 1, block)
		if err != nil {
			return CollectResult{State: state(), Err: err}
		}
		if len(entries) == 0 {
			continue
		}

		for _, entry := range entries {
			lastID = entry.ID
			frame := entry.Payload
			output := FrameOutput(frame)

			if options.CollectDeltaText && OutputEvent(output) == "delta" {
				text.WriteString(frontstream.InputText(output["text"]))
			}
			if options.CollectOutputs && len(output) > 0 {
				outputs = append(outputs, output)
			}
			if FrameType(frame) == "result" {
				return CollectResult{Frame: frame, State: state()}
			}
			if options.OnOutput != nil && len(output) > 0 {
				if err := options.OnOutput(ctx, output); err != nil {
					return CollectResult{State: state(), Err: err}
				}
			}
		}
	}
}
