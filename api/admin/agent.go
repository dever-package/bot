package api

import (
	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
	runtimeloop "github.com/dever-package/bot/service/agent/runtime/loop"
)

type Agent struct{}

var agentTaskRuntime = runtimeloop.NewService()

func (Agent) PostRun(c *server.Context) error {
	body := map[string]any{}
	if err := c.BindJSON(&body); err != nil {
		return c.Error(err)
	}
	input := agentRuntimeInput(body)
	resp := agentTaskRuntime.RunTask(c.Context(), runtimeloop.TaskRequest{
		AgentIdentity: botapi.TextFromBody(body, "agent", "agent_key", "agent_id"),
		SessionID:     botapi.Uint64FromBody(input, "assistant_session_id", "assistantSessionId"),
		Input:         input,
		Method:        c.Method(),
		Host:          c.Header("Host"),
		Path:          c.Path(),
		Headers:       requestHeaders(c),
		Server:        c,
	})
	return c.JSONPayload(200, resp)
}

func (Agent) GetStream(c *server.Context) error {
	return botapi.HandleStreamRead(c, agentTaskRuntime.ReadStream)
}

func (Agent) GetRunStatus(c *server.Context) error {
	data, err := agentTaskRuntime.TaskStatus(
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
	resp := agentTaskRuntime.StopTask(requestID)
	return c.JSONPayload(200, resp)
}
