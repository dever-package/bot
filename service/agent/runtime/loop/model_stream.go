package loop

import (
	"context"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimedocument "github.com/dever-package/bot/service/agent/runtime/document"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botstream "github.com/dever-package/bot/service/energon/stream"
)

const (
	modelDeltaFlushInterval     = 50 * time.Millisecond
	modelDeltaFlushBytes        = 1024
	documentTextPersistInterval = 500 * time.Millisecond
	documentTextPersistBytes    = 8 * 1024
	documentTextSourceKeyPrefix = "model:text:"
)

type modelOutputPublisher interface {
	Write(context.Context, botprotocol.Output) error
	Flush(context.Context) error
	Close(context.Context) error
	TextPublished() bool
}

func newModelStreamPublisher(service Service, execution execution) modelOutputPublisher {
	if execution.documentID > 0 {
		sourceKey := strings.TrimSpace(execution.documentTextSourceKey)
		if sourceKey == "" {
			sourceKey = documentModelTextSourceKey(execution.documentModelStep)
		}
		return &documentModelStreamPublisher{
			service:    service,
			execution:  execution,
			documents:  runtimedocument.NewService(),
			documentID: execution.documentID,
			sourceKey:  sourceKey,
			modelStep:  execution.documentModelStep,
		}
	}
	return &chatModelStreamPublisher{service: service, execution: execution}
}

type chatModelStreamPublisher struct {
	service   Service
	execution execution
	pending   map[string]any
	text      strings.Builder
	lastFlush time.Time
	published bool
}

func (publisher *chatModelStreamPublisher) Write(ctx context.Context, output botprotocol.Output) error {
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

func (publisher *chatModelStreamPublisher) append(output botprotocol.Output, text string) {
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

func (publisher *chatModelStreamPublisher) Flush(ctx context.Context) error {
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
	publisher.published = true
	publisher.lastFlush = time.Now()
	return nil
}

func (publisher *chatModelStreamPublisher) Close(ctx context.Context) error {
	return publisher.Flush(ctx)
}

func (publisher *chatModelStreamPublisher) TextPublished() bool {
	return publisher != nil && publisher.published
}

type documentModelStreamPublisher struct {
	service        Service
	execution      execution
	documents      runtimedocument.Service
	documentID     uint64
	sourceKey      string
	modelStep      int
	block          agentmodel.DocumentBlock
	text           strings.Builder
	publishedBytes int
	persistedBytes int
	revision       int
	lastFlush      time.Time
	lastPersist    time.Time
}

func (publisher *documentModelStreamPublisher) Write(ctx context.Context, output botprotocol.Output) error {
	if publisher == nil {
		return nil
	}
	switch botstream.OutputEvent(output) {
	case "", "delta":
		text := botprotocol.AsText(output["text"])
		if text == "" {
			return nil
		}
		publisher.text.WriteString(text)
		if publisher.block.ID == 0 {
			return publisher.begin(ctx)
		}
		if publisher.text.Len()-publisher.publishedBytes >= modelDeltaFlushBytes || time.Since(publisher.lastFlush) >= modelDeltaFlushInterval {
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

func (publisher *documentModelStreamPublisher) begin(ctx context.Context) error {
	content := publisher.text.String()
	if strings.TrimSpace(content) == "" {
		return nil
	}
	block, revision, err := publisher.documents.BeginTextStream(ctx, runtimedocument.AppendTextRequest{
		DocumentID: publisher.documentID,
		SourceKey:  publisher.sourceKey,
		Text:       content,
		Meta:       map[string]any{"model_step": publisher.modelStep},
	})
	if err != nil {
		return err
	}
	publisher.block = block
	publisher.revision = revision
	publisher.publishedBytes = publisher.text.Len()
	publisher.persistedBytes = publisher.text.Len()
	publisher.lastFlush = time.Now()
	publisher.lastPersist = publisher.lastFlush
	return publisher.service.writeExecutionOutput(ctx, publisher.execution, map[string]any{
		"event":       "block_commit",
		"document_id": publisher.documentID,
		"block":       runtimedocument.BuildBlockPayload(block, nil),
	})
}

func (publisher *documentModelStreamPublisher) Flush(ctx context.Context) error {
	if publisher == nil {
		return nil
	}
	if publisher.block.ID == 0 {
		return publisher.begin(ctx)
	}
	content := publisher.text.String()
	if publisher.publishedBytes < len(content) {
		delta := content[publisher.publishedBytes:]
		publisher.revision++
		textDelta := runtimedocument.TextDelta{
			DocumentID: publisher.documentID,
			BlockID:    publisher.block.ID,
			Revision:   publisher.revision,
			Delta:      delta,
		}
		if err := publisher.documents.PublishTextDelta(ctx, textDelta); err != nil {
			return err
		}
		if err := publisher.service.writeExecutionOutput(ctx, publisher.execution, map[string]any{
			"event":       "text_delta",
			"document_id": publisher.documentID,
			"block_id":    publisher.block.ID,
			"revision":    publisher.revision,
			"delta":       delta,
		}); err != nil {
			return err
		}
		publisher.publishedBytes = len(content)
		publisher.lastFlush = time.Now()
	}
	if len(content)-publisher.persistedBytes >= documentTextPersistBytes || time.Since(publisher.lastPersist) >= documentTextPersistInterval {
		block, err := publisher.documents.SaveTextStream(ctx, publisher.block.ID, content, publisher.revision)
		if err != nil {
			return err
		}
		if block != nil {
			publisher.block = *block
		}
		publisher.persistedBytes = len(content)
		publisher.lastPersist = time.Now()
	}
	return nil
}

func (publisher *documentModelStreamPublisher) Close(ctx context.Context) error {
	if publisher == nil {
		return nil
	}
	if err := publisher.Flush(ctx); err != nil {
		return err
	}
	if publisher.block.ID == 0 {
		return nil
	}
	block, err := publisher.documents.CommitTextStream(
		ctx,
		publisher.block.ID,
		publisher.text.String(),
		publisher.revision,
	)
	if err != nil {
		return err
	}
	if block != nil {
		publisher.block = *block
	}
	return publisher.service.writeExecutionOutput(ctx, publisher.execution, map[string]any{
		"event":       "block_commit",
		"document_id": publisher.documentID,
		"block":       runtimedocument.BuildBlockPayload(publisher.block, nil),
	})
}

func (publisher *documentModelStreamPublisher) TextPublished() bool {
	return publisher != nil && publisher.block.ID > 0
}
