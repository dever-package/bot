package document

import (
	"context"
	"fmt"
	"strconv"
	"strings"
	"time"

	frontstream "github.com/dever-package/front/service/stream"
)

const StreamNamespace = "agent_document"

var sharedStreams = frontstream.New(StreamNamespace)

type deferStreamKey struct{}

type streamWriter struct {
	store frontstream.Service
}

func newStreamWriter() streamWriter {
	return streamWriter{store: sharedStreams}
}

func StreamRequestID(documentID uint64) string {
	return fmt.Sprintf("document:%d", documentID)
}

func ParseStreamRequestID(requestID string) (uint64, error) {
	prefix, value, found := strings.Cut(strings.TrimSpace(requestID), ":")
	if !found || prefix != "document" {
		return 0, fmt.Errorf("文档流标识无效")
	}
	documentID, err := strconv.ParseUint(strings.TrimSpace(value), 10, 64)
	if err != nil || documentID == 0 {
		return 0, fmt.Errorf("文档流标识无效")
	}
	return documentID, nil
}

func DeferStream(ctx context.Context) context.Context {
	return context.WithValue(ctx, deferStreamKey{}, true)
}

func (writer streamWriter) write(ctx context.Context, documentID uint64, event string, output map[string]any) error {
	if documentID == 0 || ctx.Value(deferStreamKey{}) == true {
		return nil
	}
	if output == nil {
		output = map[string]any{}
	}
	output["event"] = event
	output["document_id"] = documentID
	requestID := StreamRequestID(documentID)
	_, err := writer.store.WritePayload(ctx, requestID, frontstream.ResponsePayload(requestID, "stream", output, "", 1))
	return err
}

func (s Service) ReadStream(ctx context.Context, documentID uint64, lastID string, count int64, block time.Duration) ([]frontstream.Entry, error) {
	return s.streams.store.Read(ctx, StreamRequestID(documentID), lastID, count, block)
}

func (s Service) Publish(ctx context.Context, documentID uint64, event string, output map[string]any) {
	_ = s.streams.write(ctx, documentID, event, output)
}
