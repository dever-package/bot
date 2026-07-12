package chat

import (
	"context"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const (
	defaultSessionLimit = 20
	maxSessionLimit     = 50
	defaultMessageLimit = 10
	maxMessageLimit     = 200
)

type SessionRequest struct {
	SessionID     uint64
	LastSessionID uint64
	LastMessageID uint64
	ContextKey    string
	AgentKey      string
	Title         string
	NewSession    bool
	Limit         int
	Page          int
	PageSize      int
	Keyword       string
	Status        string
	MemoryEnabled bool
	SessionOnly   bool
}

type RebindSessionContextRequest struct {
	SessionID      uint64
	AgentKey       string
	FromContextKey string
	ToContextKey   string
}

func (s Service) ResolveSession(ctx context.Context, request SessionRequest) (map[string]any, error) {
	owner, err := currentOwner(ctx)
	if err != nil {
		return nil, err
	}
	var session agentmodel.Session
	if request.SessionID > 0 {
		current, currentErr := requireSession(ctx, owner, request.SessionID)
		if currentErr != nil {
			return nil, currentErr
		}
		if currentErr = validateSessionScope(*current, request.AgentKey, request.ContextKey); currentErr != nil {
			return nil, currentErr
		}
		session = *current
	} else {
		session = resolveSession(ctx, owner, request)
		if session.ID == 0 {
			return nil, fmt.Errorf("创建会话失败")
		}
	}
	result := map[string]any{"session": sessionMap(session)}
	if request.SessionOnly {
		return result, nil
	}
	result["messages"] = sessionMessages(ctx, session.ID, request.Limit, request.LastMessageID)
	result["memories"] = sessionMemories(ctx, session, request.MemoryEnabled)
	return result, nil
}

func (s Service) StartSession(ctx context.Context, request SessionRequest) (map[string]any, error) {
	request.NewSession = true
	return s.ResolveSession(ctx, request)
}

func (Service) ReviewSessions(ctx context.Context, request SessionRequest) (map[string]any, error) {
	owner, err := currentOwner(ctx)
	if err != nil {
		return nil, err
	}
	filter := map[string]any{
		"owner_type":  owner.OwnerType,
		"owner_id":    owner.OwnerID,
		"context_key": normalizeContextKey(request.ContextKey, request.AgentKey),
		"agent_key":   strings.TrimSpace(request.AgentKey),
	}
	if status := sessionStatusFilter(request.Status); status > 0 {
		filter["status"] = status
	}
	if keyword := strings.TrimSpace(request.Keyword); keyword != "" {
		filter["title"] = map[string]any{"LIKE": "%" + keyword + "%"}
	}
	if request.Limit > 0 && request.Page <= 0 && request.PageSize <= 0 {
		return reviewSessionsByCursor(ctx, filter, request.LastSessionID, request.Limit), nil
	}

	page, pageSize := normalizePage(request.Page, request.PageSize)
	model := agentmodel.NewSessionModel()
	total := model.Count(ctx, filter)
	rows := model.Select(ctx, filter, map[string]any{
		"order":    "main.last_message_at desc,main.id desc",
		"page":     page,
		"pageSize": pageSize,
	})
	sessions := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			sessions = append(sessions, sessionMap(*row))
		}
	}
	return map[string]any{
		"sessions":   sessions,
		"pagination": paginationMap(page, pageSize, total),
	}, nil
}

func reviewSessionsByCursor(ctx context.Context, filter map[string]any, lastSessionID uint64, requestedLimit int) map[string]any {
	if lastSessionID > 0 {
		filter["id"] = map[string]any{"lt": lastSessionID}
	}
	rows := agentmodel.NewSessionModel().Select(ctx, filter, map[string]any{
		"order": "main.id desc",
		"limit": clampLimit(requestedLimit, defaultSessionLimit, maxSessionLimit),
	})
	sessions := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			sessions = append(sessions, sessionSummaryMap(*row))
		}
	}
	return map[string]any{"sessions": sessions}
}

func (s Service) ClearSession(ctx context.Context, sessionID uint64, memoryEnabled bool) (map[string]any, error) {
	owner, err := currentOwner(ctx)
	if err != nil {
		return nil, err
	}
	session, err := requireSession(ctx, owner, sessionID)
	if err != nil {
		return nil, err
	}
	agentmodel.NewArtifactModel().Delete(ctx, map[string]any{"session_id": session.ID})
	agentmodel.NewMessageModel().Delete(ctx, map[string]any{"session_id": session.ID})
	now := time.Now()
	agentmodel.NewSessionModel().Update(ctx, map[string]any{"id": session.ID}, map[string]any{
		"message_count":      0,
		"title":              "新会话",
		"title_source":       agentmodel.TitleSourceAuto,
		"context_summary":    "",
		"summary_message_id": 0,
		"active_series_id":   0,
		"last_message_at":    now,
	})
	session.MessageCount = 0
	session.Title = "新会话"
	session.TitleSource = agentmodel.TitleSourceAuto
	session.ContextSummary = ""
	session.SummaryMessageID = 0
	session.ActiveSeriesID = 0
	session.LastMessageAt = now
	return map[string]any{
		"session":  sessionMap(*session),
		"messages": []map[string]any{},
		"memories": sessionMemories(ctx, *session, memoryEnabled),
	}, nil
}

func (s Service) ArchiveSession(ctx context.Context, sessionID uint64) error {
	return updateSessionStatus(ctx, sessionID, agentmodel.SessionStatusArchived)
}

func (s Service) RestoreSession(ctx context.Context, sessionID uint64) error {
	return updateSessionStatus(ctx, sessionID, agentmodel.SessionStatusActive)
}

func (s Service) RenameSession(ctx context.Context, sessionID uint64, title string) (map[string]any, error) {
	owner, err := currentOwner(ctx)
	if err != nil {
		return nil, err
	}
	session, err := requireSession(ctx, owner, sessionID)
	if err != nil {
		return nil, err
	}
	title = limitText(title, 255)
	if title == "" {
		return nil, fmt.Errorf("会话标题不能为空")
	}
	agentmodel.NewSessionModel().Update(ctx, map[string]any{"id": session.ID}, map[string]any{
		"title":        title,
		"title_source": agentmodel.TitleSourceManual,
	})
	session.Title = title
	session.TitleSource = agentmodel.TitleSourceManual
	return map[string]any{"session": sessionMap(*session)}, nil
}

func (s Service) RebindSessionContext(ctx context.Context, request RebindSessionContextRequest) error {
	if request.SessionID == 0 {
		return nil
	}
	owner, err := currentOwner(ctx)
	if err != nil {
		return err
	}
	agentKey := strings.TrimSpace(request.AgentKey)
	fromContextKey := normalizeContextKey(request.FromContextKey, agentKey)
	toContextKey := normalizeContextKey(request.ToContextKey, agentKey)
	if fromContextKey == toContextKey {
		return nil
	}
	filter := map[string]any{
		"id":          request.SessionID,
		"owner_type":  owner.OwnerType,
		"owner_id":    owner.OwnerID,
		"context_key": fromContextKey,
		"status":      agentmodel.SessionStatusActive,
	}
	if agentKey != "" {
		filter["agent_key"] = agentKey
	}
	if agentmodel.NewSessionModel().Update(ctx, filter, map[string]any{"context_key": toContextKey}) == 0 {
		return fmt.Errorf("会话不存在或上下文不匹配")
	}
	return nil
}
