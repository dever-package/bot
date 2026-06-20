package api

import (
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	frontstream "github.com/dever-package/front/service/stream"
	userservice "github.com/dever-package/user/service"
)

func BindBody(c *server.Context) (map[string]any, error) {
	body := map[string]any{}
	if err := c.BindJSON(&body); err != nil {
		return nil, err
	}
	return body, nil
}

func WriteJSON(c *server.Context, data any, err error) error {
	if err != nil {
		payload := map[string]any{
			"status": 2,
			"data":   map[string]any{},
			"msg":    err.Error(),
		}
		if userservice.IsAuthRequired(err) {
			payload["code"] = 401
		}
		return c.JSONPayload(200, payload)
	}
	return c.JSONPayload(200, map[string]any{
		"status": 1,
		"data":   data,
		"msg":    "",
	})
}

func Uint64FromBody(body map[string]any, keys ...string) uint64 {
	for _, key := range keys {
		if value := uint64(frontstream.InputInt64(body[key], 0)); value > 0 {
			return value
		}
	}
	return 0
}

func TextFromBody(body map[string]any, keys ...string) string {
	for _, key := range keys {
		if text := strings.TrimSpace(frontstream.InputText(body[key])); text != "" {
			return text
		}
	}
	return ""
}

func MapFromBody(body map[string]any, key string) map[string]any {
	if row, ok := body[key].(map[string]any); ok && row != nil {
		return row
	}
	return map[string]any{}
}

func BoolFromBody(body map[string]any, keys ...string) bool {
	for _, key := range keys {
		switch strings.ToLower(strings.TrimSpace(frontstream.InputText(body[key]))) {
		case "1", "true", "yes", "y", "on":
			return true
		}
	}
	return false
}

func QueryUint64(c *server.Context, keys ...string) uint64 {
	for _, key := range keys {
		if value := util.ToUint64(c.Input(key)); value > 0 {
			return value
		}
	}
	return 0
}

func QueryInt(c *server.Context, keys ...string) int {
	for _, key := range keys {
		if value := util.ToIntDefault(c.Input(key), 0); value > 0 {
			return value
		}
	}
	return 0
}

func QueryText(c *server.Context, keys ...string) string {
	for _, key := range keys {
		if text := frontstream.InputText(c.Input(key)); text != "" {
			return text
		}
	}
	return ""
}

func SourceFromBody(body map[string]any) map[string]any {
	source := map[string]any{}
	for _, key := range []string{
		"source_key",
		"source_run_id",
		"source_node_run_id",
		"source_asset_id",
		"source_version_id",
		"source_release_id",
		"source_request_id",
		"source_node_key",
		"source_node_type",
		"source_status",
	} {
		if value, ok := body[key]; ok && value != nil {
			source[key] = value
		}
	}
	if len(source) == 0 {
		return nil
	}
	return source
}

func HandleStreamRead(c *server.Context, reader frontstream.Reader) error {
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

func StreamRequestIDFromBody(body map[string]any) string {
	return FirstMapText(body, "request_id", "requestId")
}

func FirstMapText(row map[string]any, keys ...string) string {
	for _, key := range keys {
		if text := strings.TrimSpace(frontstream.InputText(row[key])); text != "" {
			return text
		}
	}
	return ""
}
