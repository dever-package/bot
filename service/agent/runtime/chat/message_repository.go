package chat

import (
	"context"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

func resolveMessageSession(ctx context.Context, owner ownerScope, request MessageRequest) (*agentmodel.Session, error) {
	if request.SessionID > 0 {
		session, err := requireSession(ctx, owner, request.SessionID)
		if err != nil {
			return nil, err
		}
		if err := validateSessionScope(*session, request.AgentKey, request.ContextKey); err != nil {
			return nil, err
		}
		return session, nil
	}
	session := resolveSession(ctx, owner, SessionRequest{ContextKey: request.ContextKey, AgentKey: request.AgentKey})
	if session.ID == 0 {
		return nil, fmt.Errorf("会话不存在")
	}
	return &session, nil
}

func validateRunTurnSession(session agentmodel.Session, request RunTurnRequest) error {
	agentKey := strings.TrimSpace(request.AgentKey)
	if agentKey == "" || session.AgentKey != agentKey {
		return fmt.Errorf("会话智能体不匹配")
	}
	if session.ContextKey != normalizeContextKey(request.ContextKey, agentKey) {
		return fmt.Errorf("会话上下文不匹配")
	}
	return nil
}

func (Service) RequireRunSession(ctx context.Context, request RunTurnRequest) (*agentmodel.Session, error) {
	owner, err := currentOwner(ctx)
	if err != nil {
		return nil, err
	}
	session, err := requireSession(ctx, owner, request.SessionID)
	if err != nil {
		return nil, err
	}
	if err := validateRunTurnSession(*session, request); err != nil {
		return nil, err
	}
	return session, nil
}

func (Service) RequireAgentSession(ctx context.Context, sessionID uint64, agentKey string) (*agentmodel.Session, error) {
	owner, err := currentOwner(ctx)
	if err != nil {
		return nil, err
	}
	session, err := requireSession(ctx, owner, sessionID)
	if err != nil {
		return nil, err
	}
	if strings.TrimSpace(agentKey) == "" || session.AgentKey != strings.TrimSpace(agentKey) {
		return nil, fmt.Errorf("会话智能体不匹配")
	}
	return session, nil
}

func sessionMessages(ctx context.Context, sessionID uint64, requestedLimit int, lastMessageID uint64) []map[string]any {
	if sessionID == 0 {
		return []map[string]any{}
	}
	filter := map[string]any{"session_id": sessionID}
	if lastMessageID > 0 {
		filter["id"] = map[string]any{"lt": lastMessageID}
	}
	rows := agentmodel.NewMessageModel().Select(ctx, filter, map[string]any{
		"order": "main.id desc", "limit": clampLimit(requestedLimit, defaultMessageLimit, maxMessageLimit),
	})
	return messageMaps(ctx, rows)
}

func touchSession(ctx context.Context, session *agentmodel.Session, role string, text string, now time.Time) {
	session.MessageCount++
	session.LastMessageAt = now
	values := map[string]any{"message_count": session.MessageCount, "last_message_at": now}
	if role == "user" && strings.TrimSpace(text) != "" && (session.Title == "" || session.Title == "新会话") {
		session.Title = shortTitle(text)
		session.TitleSource = agentmodel.TitleSourceAuto
		values["title"] = session.Title
		values["title_source"] = session.TitleSource
	}
	agentmodel.NewSessionModel().Update(ctx, map[string]any{"id": session.ID}, values)
}

func touchSessionTimestamp(ctx context.Context, sessionID uint64, now time.Time) {
	agentmodel.NewSessionModel().Update(ctx, map[string]any{"id": sessionID}, map[string]any{"last_message_at": now})
}
