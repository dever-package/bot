package api

import (
	"strings"
	"time"

	"github.com/shemic/dever/server"

	energonservice "my/package/bot/service/energon"
	frontstream "my/package/front/service/stream"
)

type Energon struct{}

var gateway = energonservice.NewGatewayService()

func (Energon) PostRequest(c *server.Context) error {
	body := map[string]any{}
	if err := c.BindJSON(&body); err != nil {
		return c.Error(err)
	}
	return handlePowerRequest(c, body)
}

func (Energon) GetTest(c *server.Context) error {
	return handlePowerRequest(c, map[string]any{
		"power": "llm",
		"input": map[string]any{
			"text": "你好",
		},
		"history": []any{},
		"options": map[string]any{
			"stream": isRequestTruthy(c.Input("stream")),
		},
	})
}

func (Energon) GetPowerParams(c *server.Context) error {
	powerKey := strings.TrimSpace(frontstream.InputText(c.Input("power", "required", "能力")))
	targetID := uint64(frontstream.InputInt64(c.Input("source_target_id"), 0))
	if targetID == 0 {
		targetID = uint64(frontstream.InputInt64(c.Input("sourceTargetId"), 0))
	}
	if isRequestTruthy(c.Input("include_sources")) || isRequestTruthy(c.Input("includeSources")) {
		config, err := gateway.TestParamConfig(c.Context(), powerKey, targetID)
		if err != nil {
			return c.Error(err)
		}
		return c.JSON(config)
	}
	rows, err := gateway.TestParams(c.Context(), powerKey)
	if err != nil {
		return c.Error(err)
	}
	return c.JSON(rows)
}

func (Energon) GetStream(c *server.Context) error {
	requestID := strings.TrimSpace(frontstream.InputText(c.Input("request_id")))
	if requestID == "" {
		requestID = strings.TrimSpace(frontstream.InputText(c.Input("requestId")))
	}
	lastID := strings.TrimSpace(frontstream.InputText(c.Input("last_id")))
	if lastID == "" {
		lastID = strings.TrimSpace(frontstream.InputText(c.Input("lastId")))
	}
	count := frontstream.InputInt64(c.Input("count"), 1)
	if count != 1 {
		count = 1
	}
	block := time.Duration(frontstream.InputInt64(c.Input("block"), 0)) * time.Millisecond

	entries, err := gateway.ReadStream(c.Context(), requestID, lastID, count, block)
	if err != nil {
		return c.JSONPayload(200, frontstream.ResponsePayload(requestID, "result", map[string]any{}, err.Error(), 2))
	}
	return c.JSONPayload(200, frontstream.NextPayload(requestID, lastID, entries))
}

func (Energon) PostStreamStop(c *server.Context) error {
	body := map[string]any{}
	if err := c.BindJSON(&body); err != nil {
		return c.Error(err)
	}
	requestID := strings.TrimSpace(frontstream.InputText(body["request_id"]))
	if requestID == "" {
		requestID = strings.TrimSpace(frontstream.InputText(body["requestId"]))
	}
	resp := gateway.StopStream(c.Context(), requestID)
	return c.JSONPayload(200, resp.Payload())
}

func handlePowerRequest(c *server.Context, body map[string]any) error {
	resp := gateway.Request(c.Context(), energonservice.GatewayRequest{
		Method:  c.Method(),
		Host:    c.Header("Host"),
		Path:    c.Path(),
		Headers: requestHeaders(c),
		Body:    body,
	})
	return c.JSONPayload(200, resp.Payload())
}

func isRequestTruthy(value any) bool {
	switch strings.ToLower(strings.TrimSpace(frontstream.InputText(value))) {
	case "1", "true", "yes", "y", "on":
		return true
	default:
		return false
	}
}

func requestHeaders(c *server.Context) map[string]string {
	headers := map[string]string{}
	for _, key := range []string{"Authorization", "Content-Type", "X-Request-ID", "X-Request-Id"} {
		if value := strings.TrimSpace(c.Header(key)); value != "" {
			headers[key] = value
		}
	}
	return headers
}
