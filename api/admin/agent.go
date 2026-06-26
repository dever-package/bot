package api

import (
	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
	agentservice "github.com/dever-package/bot/service/agent"
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
		Server:  c,
	})
	return c.JSONPayload(200, resp)
}

func (Agent) GetStream(c *server.Context) error {
	return botapi.HandleStreamRead(c, agentRunner.ReadStream)
}

func (Agent) GetRunStatus(c *server.Context) error {
	data, err := agentRunner.RunStatus(
		c.Context(),
		botapi.QueryText(c, "request_id", "requestId"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Agent) PostStop(c *server.Context) error {
	body := map[string]any{}
	if err := c.BindJSON(&body); err != nil {
		return c.Error(err)
	}
	requestID := botapi.StreamRequestIDFromBody(body)
	resp := agentRunner.Stop(c.Context(), requestID)
	return c.JSONPayload(200, resp)
}
