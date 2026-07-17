package api

import (
	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
	runtimechat "github.com/dever-package/bot/service/agent/runtime/chat"
	runtimeinput "github.com/dever-package/bot/service/agent/runtime/input"
	runtimeloop "github.com/dever-package/bot/service/agent/runtime/loop"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	workbenchservice "github.com/dever-package/bot/service/workbench"
	frontstream "github.com/dever-package/front/service/stream"
)

var workbenchChatSessions = runtimechat.NewService()
var workbenchChatRuntime = runtimeloop.NewService()

func (Workbench) PostChatSession(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	scope, err := resolveWorkbenchChatScope(c, body)
	if err != nil {
		return botapi.WriteJSON(c, nil, err)
	}
	data, err := workbenchChatSessions.ResolveSession(c.Context(), runtimechat.SessionRequest{
		SessionID:     botapi.Uint64FromBody(body, "session_id", "sessionId", "id"),
		LastMessageID: botapi.Uint64FromBody(body, "last_message_id", "lastMessageId"),
		ContextKey:    scope.ContextKey,
		AgentKey:      scope.AgentKey,
		Limit:         int(frontstream.InputInt64(body["limit"], 0)),
		SessionOnly:   botapi.BoolFromBody(body, "session_only", "sessionOnly"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) PostChatSessions(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	scope, err := resolveWorkbenchChatScope(c, body)
	if err != nil {
		return botapi.WriteJSON(c, nil, err)
	}
	data, err := workbenchChatSessions.ReviewSessions(c.Context(), runtimechat.SessionRequest{
		LastSessionID: botapi.Uint64FromBody(body, "last_session_id", "lastSessionId"),
		ContextKey:    scope.ContextKey,
		AgentKey:      scope.AgentKey,
		Limit:         int(frontstream.InputInt64(body["limit"], 0)),
		Status:        "active",
	})
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) PostChatNewSession(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	scope, err := resolveWorkbenchChatScope(c, body)
	if err != nil {
		return botapi.WriteJSON(c, nil, err)
	}
	data, err := workbenchChatSessions.StartSession(c.Context(), runtimechat.SessionRequest{
		ContextKey: scope.ContextKey,
		AgentKey:   scope.AgentKey,
		Title:      botapi.TextFromBody(body, "title"),
		Limit:      int(frontstream.InputInt64(body["limit"], 0)),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) PostChatRenameSession(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	scope, err := resolveWorkbenchChatScope(c, body)
	if err != nil {
		return botapi.WriteJSON(c, nil, err)
	}
	sessionID := botapi.Uint64FromBody(body, "session_id", "sessionId", "id")
	if err = workbenchChatRuntime.RequireSessionScope(c.Context(), sessionID, scope.AgentKey, scope.ContextKey); err != nil {
		return botapi.WriteJSON(c, nil, err)
	}
	data, err := workbenchChatSessions.RenameSession(c.Context(), sessionID, botapi.TextFromBody(body, "title", "name"))
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) PostChatArchiveSession(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	scope, err := resolveWorkbenchChatScope(c, body)
	if err != nil {
		return botapi.WriteJSON(c, nil, err)
	}
	sessionID := botapi.Uint64FromBody(body, "session_id", "sessionId", "id")
	if err = workbenchChatRuntime.RequireSessionScope(c.Context(), sessionID, scope.AgentKey, scope.ContextKey); err == nil {
		err = workbenchChatSessions.ArchiveSession(c.Context(), sessionID)
	}
	return botapi.WriteJSON(c, map[string]any{"ok": err == nil}, err)
}

func (Workbench) GetChatInputConfig(c *server.Context) error {
	scope, err := resolveWorkbenchChatScope(c, nil)
	if err != nil {
		return botapi.WriteJSON(c, nil, err)
	}
	return botapi.WriteJSON(c, runtimeinput.LoadConfig(c.Context(), scope.AgentID), nil)
}

func (Workbench) PostChatRun(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	scope, err := resolveWorkbenchChatScope(c, body)
	if err != nil {
		return c.JSONPayload(200, botprotocol.BuildErrorResponse("", err).Payload())
	}
	targetAssetID := botapi.Uint64FromBody(body, "target_asset_id", "targetAssetId")
	if err = workbenchRunner.RequireDialogueContinuation(c.Context(), scope, targetAssetID); err != nil {
		return c.JSONPayload(200, botprotocol.BuildErrorResponse("", err).Payload())
	}
	input := botapi.MapFromBody(body, "input")
	if targetAssetID > 0 {
		input["_target_asset_id"] = targetAssetID
	}
	response := workbenchChatRuntime.RunChat(c.Context(), runtimeloop.ChatRequest{
		AgentIdentity: scope.AgentKey,
		SessionID:     botapi.Uint64FromBody(body, "session_id", "sessionId"),
		ContextKey:    scope.ContextKey,
		Input:         input,
		Method:        c.Method(),
		Host:          c.Header("Host"),
		Path:          c.Path(),
		Headers:       botapi.RequestHeaders(c),
		Server:        c,
	})
	return c.JSONPayload(200, response)
}

func (Workbench) GetChatStream(c *server.Context) error {
	scope, err := resolveWorkbenchChatScope(c, nil)
	if err != nil {
		return workbenchChatStreamError(c, "", err)
	}
	params := frontstream.ReadParamsFromServerContext(c)
	if err = workbenchChatRuntime.RequireRunScope(c.Context(), params.RequestID, scope.AgentKey, scope.ContextKey); err != nil {
		return workbenchChatStreamError(c, params.RequestID, err)
	}
	return botapi.HandleStreamRead(c, workbenchChatRuntime.ReadStream)
}

func (Workbench) GetChatStatus(c *server.Context) error {
	scope, err := resolveWorkbenchChatScope(c, nil)
	requestID := botapi.QueryText(c, "request_id", "requestId")
	if err == nil {
		err = workbenchChatRuntime.RequireRunScope(c.Context(), requestID, scope.AgentKey, scope.ContextKey)
	}
	if err != nil {
		return botapi.WriteJSON(c, nil, err)
	}
	data, err := workbenchChatRuntime.Status(c.Context(), requestID)
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) PostChatStop(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	requestID := botapi.StreamRequestIDFromBody(body)
	scope, err := resolveWorkbenchChatScope(c, body)
	if err == nil {
		err = workbenchChatRuntime.RequireRunScope(c.Context(), requestID, scope.AgentKey, scope.ContextKey)
	}
	if err != nil {
		return c.JSONPayload(200, botprotocol.BuildErrorResponse(requestID, err).Payload())
	}
	return c.JSONPayload(200, workbenchChatRuntime.Stop(c.Context(), requestID))
}

func (Workbench) PostChatReferencePreview(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	scope, err := resolveWorkbenchChatScope(c, body)
	if err != nil {
		return botapi.WriteJSON(c, nil, err)
	}
	sessionID := botapi.Uint64FromBody(body, "session_id", "sessionId")
	if err = workbenchChatRuntime.RequireSessionScope(c.Context(), sessionID, scope.AgentKey, scope.ContextKey); err != nil {
		return botapi.WriteJSON(c, nil, err)
	}
	data, err := workbenchChatRuntime.ReferencePreview(c.Context(), runtimeloop.ReferencePreviewRequest{
		SessionID: sessionID, AgentKey: scope.AgentKey,
		ReferenceType: botapi.TextFromBody(body, "ref_type", "refType"),
		ReferenceID:   botapi.Uint64FromBody(body, "ref_id", "refId"),
		Label:         botapi.TextFromBody(body, "label"),
		Server:        c,
	})
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) GetChatDocument(c *server.Context) error {
	scope, err := resolveWorkbenchChatScope(c, nil)
	documentID := botapi.QueryUint64(c, "document_id", "documentId", "id")
	if err == nil {
		err = workbenchChatRuntime.RequireDocumentScope(c.Context(), documentID, scope.AgentKey, scope.ContextKey)
	}
	if err != nil {
		return botapi.WriteJSON(c, nil, err)
	}
	data, err := workbenchChatRuntime.Document(c.Context(), documentID)
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) GetChatDocumentStream(c *server.Context) error {
	scope, err := resolveWorkbenchChatScope(c, nil)
	params := frontstream.ReadParamsFromServerContext(c)
	if err == nil {
		err = workbenchChatRuntime.RequireDocumentStreamScope(c.Context(), params.RequestID, scope.AgentKey, scope.ContextKey)
	}
	if err != nil {
		return workbenchChatStreamError(c, params.RequestID, err)
	}
	return botapi.HandleStreamRead(c, workbenchChatRuntime.ReadDocumentStream)
}

func resolveWorkbenchChatScope(c *server.Context, body map[string]any) (workbenchservice.ChatRoleBinding, error) {
	teamID := botapi.Uint64FromBody(body, "team_id", "teamId")
	roleID := botapi.Uint64FromBody(body, "role_id", "roleId")
	if teamID == 0 {
		teamID = botapi.QueryUint64(c, "team_id", "teamId")
	}
	if roleID == 0 {
		roleID = botapi.QueryUint64(c, "role_id", "roleId")
	}
	return workbenchRunner.ResolveRole(c.Context(), teamID, roleID)
}

func workbenchChatStreamError(c *server.Context, requestID string, err error) error {
	return c.JSONPayload(200, frontstream.ResponsePayload(requestID, "result", map[string]any{}, err.Error(), 2))
}
