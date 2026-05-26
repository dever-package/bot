package api

import (
	"strings"

	"github.com/shemic/dever/server"

	frontstream "my/package/front/service/stream"
)

func handleStreamRead(c *server.Context, reader frontstream.Reader) error {
	params := frontstream.ReadParamsFromServerContext(c)
	if frontstream.WantsSSE(c) {
		return frontstream.ServeSSE(c, reader, params)
	}
	entries, err := reader(c.Context(), params.RequestID, params.LastID, params.Count, params.Block)
	if err != nil {
		return c.JSONPayload(200, frontstream.ResponsePayload(params.RequestID, "result", map[string]any{}, err.Error(), 2))
	}
	return c.JSONPayload(200, frontstream.NextPayload(params.RequestID, params.LastID, entries))
}

func streamRequestIDFromBody(body map[string]any) string {
	return firstMapText(body, "request_id", "requestId")
}

func firstMapText(row map[string]any, keys ...string) string {
	for _, key := range keys {
		if text := strings.TrimSpace(frontstream.InputText(row[key])); text != "" {
			return text
		}
	}
	return ""
}
