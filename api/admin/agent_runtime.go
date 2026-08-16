package api

import (
	"strings"

	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
	runtimecontext "github.com/dever-package/bot/service/agent/runtime/context"
	runtimeinput "github.com/dever-package/bot/service/agent/runtime/input"
	runtimeloop "github.com/dever-package/bot/service/agent/runtime/loop"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
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

func (AgentRuntime) GetExecutionConfig(c *server.Context) error {
	data, err := agentChatRuntime.AgentExecutionConfig(
		c.Context(),
		botapi.QueryText(c, "agent", "agent_key", "agent_id"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (AgentRuntime) GetToolForm(c *server.Context) error {
	data, err := agentChatRuntime.AgentToolForm(
		c.Context(),
		botapi.QueryText(c, "agent", "agent_key", "agent_id"),
		botapi.QueryUint64(c, "power_id", "powerId"),
		botapi.QueryUint64(c, "source_target_id", "sourceTargetId", "target_id"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (AgentRuntime) PostRun(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	agentIdentity := botapi.TextFromBody(body, "agent", "agent_key", "agent_id")
	agent, err := runtimecontext.ResolveAgent(c.Context(), agentIdentity)
	if err != nil {
		return c.JSONPayload(200, botprotocol.BuildErrorResponse("", err).Payload())
	}
	agentIdentity = agent.Key
	sessionID := botapi.Uint64FromBody(body, "session_id", "sessionId")
	contextKey := botapi.TextFromBody(body, "context_key", "contextKey")
	if contextKey == "" {
		contextKey = "agent-runtime:" + strings.TrimSpace(agentIdentity)
	}
	input := agentRuntimeInput(body)
	var resume *runtimeloop.RunExecutionSelection
	if interactionID := agentRuntimeInteractionID(input); interactionID != "" {
		selection, selectionErr := agentChatRuntime.RequireInteractionRunExecutionSelection(
			c.Context(), sessionID, agentIdentity, contextKey, interactionID,
		)
		if selectionErr != nil {
			return c.JSONPayload(200, botprotocol.BuildErrorResponse("", selectionErr).Payload())
		}
		resume = &selection
	}
	execution, err := agentChatRuntime.PrepareAgentExecution(c.Context(), agentIdentity, input, resume)
	if err != nil {
		return c.JSONPayload(200, botprotocol.BuildErrorResponse("", err).Payload())
	}
	response := agentChatRuntime.RunChat(c.Context(), runtimeloop.ChatRequest{
		AgentIdentity:    execution.Agent.Key,
		SessionID:        sessionID,
		ContextKey:       contextKey,
		Input:            execution.Input,
		ModelTargetID:    execution.ModelTargetID,
		PowerPolicy:      execution.PowerPolicy,
		RequiredToolName: execution.RequiredToolName,
		ResumeReferences: execution.MediaReferences,
		Method:           c.Method(),
		Host:             c.Header("Host"),
		Path:             c.Path(),
		Headers:          botapi.RequestHeaders(c),
		Server:           c,
	})
	return c.JSONPayload(200, response)
}

func (AgentRuntime) PostOpening(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	response := agentChatRuntime.RunOpening(c.Context(), runtimeloop.ChatRequest{
		AgentIdentity: botapi.TextFromBody(body, "agent", "agent_key", "agent_id"),
		SessionID:     botapi.Uint64FromBody(body, "session_id", "sessionId"),
		ContextKey:    botapi.TextFromBody(body, "context_key", "contextKey"),
		Method:        c.Method(),
		Host:          c.Header("Host"),
		Path:          c.Path(),
		Headers:       botapi.RequestHeaders(c),
		Server:        c,
	})
	return c.JSONPayload(200, response)
}

func (AgentRuntime) GetStream(c *server.Context) error {
	return botapi.HandleStreamRead(c, agentChatRuntime.ReadStream)
}

func (AgentRuntime) GetDocument(c *server.Context) error {
	data, err := agentChatRuntime.Document(c.Context(), botapi.QueryUint64(c, "document_id", "documentId", "id"))
	return botapi.WriteJSON(c, data, err)
}

func (AgentRuntime) GetDocumentStream(c *server.Context) error {
	return botapi.HandleStreamRead(c, agentChatRuntime.ReadDocumentStream)
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

func agentRuntimeInteractionID(input map[string]any) string {
	content, _ := input["content"].(map[string]any)
	response, _ := content["interaction_response"].(map[string]any)
	return strings.TrimSpace(botapi.TextFromBody(response, "interaction_id", "interactionId"))
}
