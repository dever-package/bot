package loop

import (
	"context"
	"strings"
	"time"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botstream "github.com/dever-package/bot/service/energon/stream"
)

const (
	modelDeltaFlushInterval = 50 * time.Millisecond
	modelDeltaFlushBytes    = 1024
)

type modelStreamPublisher struct {
	service   Service
	execution execution
	pending   map[string]any
	text      strings.Builder
	lastFlush time.Time
}

func newModelStreamPublisher(service Service, execution execution) *modelStreamPublisher {
	return &modelStreamPublisher{service: service, execution: execution}
}

func (publisher *modelStreamPublisher) Write(ctx context.Context, output botprotocol.Output) error {
	if publisher == nil {
		return nil
	}
	switch botstream.OutputEvent(output) {
	case "", "delta":
		text := botprotocol.AsText(output["text"])
		if text == "" {
			return nil
		}
		publisher.append(output, text)
		if publisher.lastFlush.IsZero() || publisher.text.Len() >= modelDeltaFlushBytes || time.Since(publisher.lastFlush) >= modelDeltaFlushInterval {
			return publisher.Flush(ctx)
		}
		return nil
	case "status", "warning":
		if err := publisher.Flush(ctx); err != nil {
			return err
		}
		return publisher.service.writeExecutionOutput(ctx, publisher.execution, map[string]any(output))
	default:
		return nil
	}
}

func (publisher *modelStreamPublisher) append(output botprotocol.Output, text string) {
	if publisher.pending == nil {
		publisher.pending = make(map[string]any, len(output))
	}
	for key, value := range output {
		if key != "text" {
			publisher.pending[key] = value
		}
	}
	publisher.pending["event"] = "delta"
	publisher.text.WriteString(text)
}

func (publisher *modelStreamPublisher) Flush(ctx context.Context) error {
	if publisher == nil || publisher.pending == nil || publisher.text.Len() == 0 {
		return nil
	}
	output := publisher.pending
	output["text"] = publisher.text.String()
	publisher.pending = nil
	publisher.text.Reset()
	if err := publisher.service.writeExecutionOutput(ctx, publisher.execution, output); err != nil {
		return err
	}
	publisher.lastFlush = time.Now()
	return nil
}
