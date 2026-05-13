package api

import (
	"strings"
	"time"

	"github.com/shemic/dever/server"

	agentservice "my/package/bot/service/agent"
	frontstream "my/package/front/service/stream"
)

type Agent struct{}

var agentRunner = agentservice.NewService()

func (Agent) PostRun(c *server.Context) error {
	body := map[string]any{}
	if err := c.BindJSON(&body); err != nil {
		return c.Error(err)
	}
	resp := agentRunner.Run(c.Context(), agentservice.RunRequest{
		Method:  c.Method(),
		Host:    c.Header("Host"),
		Path:    c.Path(),
		Headers: requestHeaders(c),
		Body:    body,
	})
	return c.JSONPayload(200, resp)
}

func (Agent) GetStream(c *server.Context) error {
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

	entries, err := agentRunner.ReadStream(c.Context(), requestID, lastID, count, block)
	if err != nil {
		return c.JSONPayload(200, frontstream.ResponsePayload(requestID, "result", map[string]any{}, err.Error(), 2))
	}
	return c.JSONPayload(200, frontstream.NextPayload(requestID, lastID, entries))
}

func (Agent) PostStop(c *server.Context) error {
	body := map[string]any{}
	if err := c.BindJSON(&body); err != nil {
		return c.Error(err)
	}
	requestID := strings.TrimSpace(frontstream.InputText(body["request_id"]))
	if requestID == "" {
		requestID = strings.TrimSpace(frontstream.InputText(body["requestId"]))
	}
	resp := agentRunner.Stop(c.Context(), requestID)
	return c.JSONPayload(200, resp)
}
