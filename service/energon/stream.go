package energon

import (
	"context"
	"time"

	botprotocol "my/package/bot/service/energon/protocol"
	frontstream "my/package/front/service/stream"
)

type StreamService struct {
	service frontstream.Service
}

type StreamEntry = frontstream.Entry

func NewStreamService() StreamService {
	return StreamService{service: frontstream.New("energon")}
}

func (s StreamService) Write(ctx context.Context, requestID string, resp botprotocol.Response) (string, error) {
	return s.service.WritePayload(ctx, requestID, resp.Payload())
}

func (s StreamService) Read(ctx context.Context, requestID string, lastID string, count int64, block time.Duration) ([]StreamEntry, error) {
	return s.service.Read(ctx, requestID, lastID, count, block)
}

func StreamKey(requestID string) string {
	return frontstream.StreamKey("energon", requestID)
}
