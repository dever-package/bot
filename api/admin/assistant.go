package api

import (
	"strings"

	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
	assistantservice "github.com/dever-package/bot/service/assistant"
	frontstream "github.com/dever-package/front/service/stream"
)

type Assistant struct{}

var assistantRunner = assistantservice.NewService()

func (Assistant) PostSession(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := assistantRunner.ResolveSession(c.Context(), assistantservice.ResolveRequest{
		SessionID:  botapi.Uint64FromBody(body, "session_id", "sessionId", "id"),
		ContextKey: botapi.TextFromBody(body, "context_key", "contextKey"),
		AgentKey:   botapi.TextFromBody(body, "agent_key", "agentKey", "agent"),
		Title:      botapi.TextFromBody(body, "title"),
		NewSession: botapi.BoolFromBody(body, "new_session", "newSession"),
		Limit:      int(frontstream.InputInt64(body["limit"], 0)),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Assistant) PostSessions(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := assistantRunner.ReviewSessions(c.Context(), assistantservice.ResolveRequest{
		ContextKey: botapi.TextFromBody(body, "context_key", "contextKey"),
		AgentKey:   botapi.TextFromBody(body, "agent_key", "agentKey", "agent"),
		Limit:      int(frontstream.InputInt64(body["limit"], 0)),
		Page:       int(frontstream.InputInt64(firstBodyValue(body, "page"), 0)),
		PageSize:   int(frontstream.InputInt64(firstBodyValue(body, "page_size", "pageSize"), 0)),
		Keyword:    botapi.TextFromBody(body, "keyword", "search", "query"),
		Status:     botapi.TextFromBody(body, "status"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Assistant) PostNewSession(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := assistantRunner.StartSession(c.Context(), assistantservice.ResolveRequest{
		ContextKey: botapi.TextFromBody(body, "context_key", "contextKey"),
		AgentKey:   botapi.TextFromBody(body, "agent_key", "agentKey", "agent"),
		Title:      botapi.TextFromBody(body, "title"),
		Limit:      int(frontstream.InputInt64(body["limit"], 0)),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Assistant) PostClearSession(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := assistantRunner.ClearSession(c.Context(), botapi.Uint64FromBody(body, "session_id", "sessionId", "id"))
	return botapi.WriteJSON(c, data, err)
}

func (Assistant) PostArchiveSession(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	err = assistantRunner.ArchiveSession(c.Context(), botapi.Uint64FromBody(body, "session_id", "sessionId", "id"))
	return botapi.WriteJSON(c, map[string]any{"ok": true}, err)
}

func (Assistant) PostRestoreSession(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	err = assistantRunner.RestoreSession(c.Context(), botapi.Uint64FromBody(body, "session_id", "sessionId", "id"))
	return botapi.WriteJSON(c, map[string]any{"ok": true}, err)
}

func (Assistant) PostRenameSession(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := assistantRunner.RenameSession(
		c.Context(),
		botapi.Uint64FromBody(body, "session_id", "sessionId", "id"),
		botapi.TextFromBody(body, "title", "name"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Assistant) PostMessage(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	status := int16(frontstream.InputInt64(body["status"], 0))
	data, err := assistantRunner.RecordMessage(c.Context(), assistantservice.MessageRequest{
		SessionID:  botapi.Uint64FromBody(body, "session_id", "sessionId"),
		ContextKey: botapi.TextFromBody(body, "context_key", "contextKey"),
		AgentKey:   botapi.TextFromBody(body, "agent_key", "agentKey", "agent"),
		Role:       botapi.TextFromBody(body, "role"),
		Kind:       botapi.TextFromBody(body, "kind", "type"),
		Text:       botapi.TextFromBody(body, "text", "message"),
		Content:    body["content"],
		Output:     body["output"],
		RequestID:  botapi.TextFromBody(body, "request_id", "requestId"),
		Status:     status,
	})
	return botapi.WriteJSON(c, data, err)
}

func (Assistant) GetMemories(c *server.Context) error {
	data, err := assistantRunner.ReviewMemories(c.Context(), assistantservice.MemoryListRequest{
		Limit: botapi.QueryInt(c, "limit"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Assistant) PostMemories(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := assistantRunner.ReviewMemories(c.Context(), assistantservice.MemoryListRequest{
		Limit:      int(frontstream.InputInt64(body["limit"], 0)),
		Page:       int(frontstream.InputInt64(firstBodyValue(body, "page"), 0)),
		PageSize:   int(frontstream.InputInt64(firstBodyValue(body, "page_size", "pageSize"), 0)),
		Keyword:    botapi.TextFromBody(body, "keyword", "search", "query"),
		Kind:       botapi.TextFromBody(body, "kind", "type"),
		Status:     botapi.TextFromBody(body, "status"),
		ContextKey: botapi.TextFromBody(body, "context_key", "contextKey"),
		AgentKey:   botapi.TextFromBody(body, "agent_key", "agentKey", "agent"),
		Scope:      botapi.TextFromBody(body, "scope"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Assistant) PostMemory(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := assistantRunner.Remember(c.Context(), assistantservice.MemoryRequest{
		Kind:       botapi.TextFromBody(body, "kind", "type"),
		Title:      botapi.TextFromBody(body, "title", "name"),
		Content:    botapi.TextFromBody(body, "content", "text"),
		Tags:       assistantStringList(body["tags"]),
		Importance: int(frontstream.InputInt64(body["importance"], 0)),
		ContextKey: botapi.TextFromBody(body, "context_key", "contextKey"),
		AgentKey:   botapi.TextFromBody(body, "agent_key", "agentKey", "agent"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Assistant) PostUpdateMemory(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := assistantRunner.UpdateMemory(c.Context(), assistantservice.MemoryUpdateRequest{
		ID:         botapi.Uint64FromBody(body, "id", "memory_id", "memoryId"),
		Kind:       botapi.TextFromBody(body, "kind", "type"),
		Title:      botapi.TextFromBody(body, "title", "name"),
		Content:    botapi.TextFromBody(body, "content", "text"),
		Tags:       assistantStringList(body["tags"]),
		Importance: int(frontstream.InputInt64(body["importance"], 0)),
		Status:     int16(frontstream.InputInt64(body["status"], 0)),
		ContextKey: botapi.TextFromBody(body, "context_key", "contextKey"),
		AgentKey:   botapi.TextFromBody(body, "agent_key", "agentKey", "agent"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Assistant) PostForgetMemory(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	err = assistantRunner.ForgetMemory(c.Context(), assistantservice.MemoryForgetRequest{
		ID:   botapi.Uint64FromBody(body, "id", "memory_id", "memoryId"),
		Hard: botapi.BoolFromBody(body, "hard"),
	})
	return botapi.WriteJSON(c, map[string]any{"ok": true}, err)
}

func assistantStringList(value any) []string {
	switch typed := value.(type) {
	case []string:
		return typed
	case []any:
		result := make([]string, 0, len(typed))
		for _, item := range typed {
			if text := strings.TrimSpace(frontstream.InputText(item)); text != "" {
				result = append(result, text)
			}
		}
		return result
	case string:
		parts := strings.Split(typed, ",")
		result := make([]string, 0, len(parts))
		for _, item := range parts {
			if text := strings.TrimSpace(item); text != "" {
				result = append(result, text)
			}
		}
		return result
	default:
		return []string{}
	}
}

func firstBodyValue(body map[string]any, keys ...string) any {
	for _, key := range keys {
		if value, ok := body[key]; ok {
			return value
		}
	}
	return nil
}
