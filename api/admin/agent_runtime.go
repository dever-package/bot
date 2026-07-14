package api

import (
	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
	runtimecontext "github.com/dever-package/bot/service/agent/runtime/context"
	runtimeinput "github.com/dever-package/bot/service/agent/runtime/input"
	runtimeloop "github.com/dever-package/bot/service/agent/runtime/loop"
)

type AgentRuntime struct{}

var agentChatRuntime = runtimeloop.NewService()

func (AgentRuntime) GetInputConfig(c *server.Context) error {
	agent, err := runtimecontext.ResolveAgent(c.Context(), botapi.QueryText(c, "agent", "agent_key", "agent_id"))
	if err != nil {
		return botapi.WriteJSON(c, nil, err)
	}
	return botapi.WriteJSON(c, runtimeinput.LoadConfig(c.Context(), agent.ID), nil)
}

func (AgentRuntime) PostRun(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	response := agentChatRuntime.RunChat(c.Context(), runtimeloop.ChatRequest{
		AgentIdentity: botapi.TextFromBody(body, "agent", "agent_key", "agent_id"),
		SessionID:     botapi.Uint64FromBody(body, "session_id", "sessionId"),
		ContextKey:    botapi.TextFromBody(body, "context_key", "contextKey"),
		Input:         agentRuntimeInput(body),
		Method:        c.Method(),
		Host:          c.Header("Host"),
		Path:          c.Path(),
		Headers:       requestHeaders(c),
		Server:        c,
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

func (AgentRuntime) PostReferencePreview(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := agentChatRuntime.ReferencePreview(c.Context(), runtimeloop.ReferencePreviewRequest{
		SessionID:     botapi.Uint64FromBody(body, "session_id", "sessionId"),
		AgentKey:      botapi.TextFromBody(body, "agent_key", "agentKey", "agent"),
		ReferenceType: botapi.TextFromBody(body, "ref_type", "refType"),
		ReferenceID:   botapi.Uint64FromBody(body, "ref_id", "refId"),
		Label:         botapi.TextFromBody(body, "label"),
		Server:        c,
	})
	return botapi.WriteJSON(c, data, err)
}

func agentRuntimeInput(body map[string]any) map[string]any {
	if input, ok := body["input"].(map[string]any); ok {
		result := make(map[string]any, len(input))
		for key, value := range input {
			result[key] = value
		}
		return result
	}
	if input := botapi.TextFromBody(body, "input", "text", "message", "prompt"); input != "" {
		return map[string]any{"text": input}
	}
	return map[string]any{}
}
