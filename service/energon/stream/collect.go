package stream

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type Reader func(ctx context.Context, requestID string, lastID string, count int64, block time.Duration) ([]Entry, error)
type Stopper func(ctx context.Context, requestID string) botprotocol.Response

var ErrIdleTimeout = errors.New("stream 长时间没有返回新内容")

const (
	defaultReadCount  = int64(64)
	streamStopTimeout = 5 * time.Second
)

type CollectOptions struct {
	RequestID        string
	InitialLastID    string
	Block            time.Duration
	ReadCount        int64
	IdleTimeout      time.Duration
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
	readCount := options.ReadCount
	if readCount <= 0 {
		readCount = defaultReadCount
	}
	lastActivity := time.Now()

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
			stopRequest(stop, requestID)
			return CollectResult{State: state(), Err: ctx.Err(), Timeout: true}
		default:
		}

		readBlock := block
		if options.IdleTimeout > 0 {
			idleRemaining := options.IdleTimeout - time.Since(lastActivity)
			if idleRemaining <= 0 {
				stopRequest(stop, requestID)
				return CollectResult{State: state(), Err: ErrIdleTimeout, Timeout: true}
			}
			if idleRemaining < readBlock {
				readBlock = idleRemaining
			}
		}

		entries, err := reader(ctx, requestID, lastID, readCount, readBlock)
		if err != nil {
			return CollectResult{State: state(), Err: err}
		}
		if len(entries) == 0 {
			continue
		}
		lastActivity = time.Now()

		for _, entry := range entries {
			lastID = entry.ID
			frame := entry.Payload
			output := FrameOutput(frame)
			frameType := FrameType(frame)

			if options.CollectDeltaText && frameType != "result" && shouldCollectText(output) {
				text.WriteString(botprotocol.AsText(output["text"]))
			}
			if frameType == "result" {
				return CollectResult{Frame: frame, State: state()}
			}
			if options.CollectOutputs && len(output) > 0 {
				outputs = append(outputs, output)
			}
			if options.OnOutput != nil && len(output) > 0 {
				if err := options.OnOutput(ctx, output); err != nil {
					return CollectResult{State: state(), Err: err}
				}
			}
		}
	}
}

func stopRequest(stop Stopper, requestID string) {
	if stop == nil {
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), streamStopTimeout)
	defer cancel()
	_ = stop(ctx, requestID)
}

func shouldCollectText(output botprotocol.Output) bool {
	if botprotocol.AsText(output["text"]) == "" {
		return false
	}
	switch OutputEvent(output) {
	case "", "delta":
		return true
	default:
		return false
	}
}
