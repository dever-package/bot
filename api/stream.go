package api

import (
	"context"
	"strings"
	"time"

	"github.com/shemic/dever/server"

	frontstream "my/package/front/service/stream"
)

type streamReader func(ctx context.Context, requestID string, lastID string, count int64, block time.Duration) ([]frontstream.Entry, error)

type streamReadParams struct {
	RequestID string
	LastID    string
	Count     int64
	Block     time.Duration
}

func handleStreamRead(c *server.Context, reader streamReader) error {
	params := parseStreamReadParams(c)
	entries, err := reader(c.Context(), params.RequestID, params.LastID, params.Count, params.Block)
	if err != nil {
		return c.JSONPayload(200, frontstream.ResponsePayload(params.RequestID, "result", map[string]any{}, err.Error(), 2))
	}
	return c.JSONPayload(200, frontstream.NextPayload(params.RequestID, params.LastID, entries))
}

func parseStreamReadParams(c *server.Context) streamReadParams {
	count := frontstream.InputInt64(c.Input("count"), 1)
	if count != 1 {
		count = 1
	}
	return streamReadParams{
		RequestID: firstRequestInputText(c, "request_id", "requestId"),
		LastID:    firstRequestInputText(c, "last_id", "lastId"),
		Count:     count,
		Block:     time.Duration(frontstream.InputInt64(c.Input("block"), 0)) * time.Millisecond,
	}
}

func streamRequestIDFromBody(body map[string]any) string {
	return firstMapText(body, "request_id", "requestId")
}

func firstRequestInputText(c *server.Context, keys ...string) string {
	for _, key := range keys {
		if text := strings.TrimSpace(frontstream.InputText(c.Input(key))); text != "" {
			return text
		}
	}
	return ""
}

func firstMapText(row map[string]any, keys ...string) string {
	for _, key := range keys {
		if text := strings.TrimSpace(frontstream.InputText(row[key])); text != "" {
			return text
		}
	}
	return ""
}
