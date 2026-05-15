package api

import (
	"github.com/shemic/dever/server"

	agentservice "my/package/bot/service/agent"
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
	return handleStreamRead(c, agentRunner.ReadStream)
}

func (Agent) PostStop(c *server.Context) error {
	body := map[string]any{}
	if err := c.BindJSON(&body); err != nil {
		return c.Error(err)
	}
	requestID := streamRequestIDFromBody(body)
	resp := agentRunner.Stop(c.Context(), requestID)
	return c.JSONPayload(200, resp)
}
