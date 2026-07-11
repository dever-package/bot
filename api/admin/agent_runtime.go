package api

import (
	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
	agentruntime "github.com/dever-package/bot/service/agent/runtime"
)

type AgentRuntime struct{}

var agentChatRuntime = agentruntime.NewService()

func (AgentRuntime) PostRun(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	response := agentChatRuntime.Run(c.Context(), agentruntime.ChatRequest{
		AgentIdentity: botapi.TextFromBody(body, "agent", "agent_key", "agent_id"),
		SessionID:     botapi.Uint64FromBody(body, "session_id", "sessionId"),
		ContextKey:    botapi.TextFromBody(body, "context_key", "contextKey"),
		Input:         agentRuntimeInput(body),
		Method:        c.Method(),
		Host:          c.Header("Host"),
		Path:          c.Path(),
		Headers:       requestHeaders(c),
	})
	return c.JSONPayload(200, response)
}

func (AgentRuntime) GetStream(c *server.Context) error {
	return botapi.HandleStreamRead(c, agentChatRuntime.ReadStream)
}

func (AgentRuntime) GetStatus(c *server.Context) error {
	data, err := agentChatRuntime.Status(c.Context(), botapi.QueryText(c, "request_id", "requestId"))
	return botapi.WriteJSON(c, data, err)
}

func (AgentRuntime) PostStop(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	return c.JSONPayload(200, agentChatRuntime.Stop(c.Context(), botapi.StreamRequestIDFromBody(body)))
}

func agentRuntimeInput(body map[string]any) string {
	if input := botapi.TextFromBody(body, "input", "text", "message"); input != "" {
		return input
	}
	if input, ok := body["input"].(map[string]any); ok {
		return botapi.TextFromBody(input, "text", "message", "prompt")
	}
	return ""
}
