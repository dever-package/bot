package chat

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"

	deverjwt "github.com/shemic/dever/auth/jwt"

	agentmodel "github.com/dever-package/bot/model/agent"
	frontauthcontext "github.com/dever-package/front/service/authcontext"
	userservice "github.com/dever-package/user/service"
)

type ownerScope struct {
	OwnerType string
	OwnerID   uint64
}

var reusableSessionResolveMu sync.Mutex

func resolveSession(ctx context.Context, owner ownerScope, request SessionRequest) agentmodel.Session {
	if !request.NewSession {
		reusableSessionResolveMu.Lock()
		defer reusableSessionResolveMu.Unlock()
	}
	contextKey := normalizeContextKey(request.ContextKey, request.AgentKey)
	agentKey := strings.TrimSpace(request.AgentKey)
	if !request.NewSession {
		rows := agentmodel.NewSessionModel().Select(ctx, map[string]any{
			"owner_type":  owner.OwnerType,
			"owner_id":    owner.OwnerID,
			"context_key": contextKey,
			"agent_key":   agentKey,
			"status":      agentmodel.SessionStatusActive,
		}, map[string]any{"order": "main.last_message_at desc,main.id desc", "limit": 1})
		if len(rows) > 0 && rows[0] != nil {
			return *rows[0]
		}
	}
	title := strings.TrimSpace(request.Title)
	if title == "" {
		title = "新会话"
	}
	now := time.Now()
	id := uint64(agentmodel.NewSessionModel().Insert(ctx, map[string]any{
		"owner_type": owner.OwnerType, "owner_id": owner.OwnerID,
		"context_key": contextKey, "agent_key": agentKey,
		"title": title, "title_source": agentmodel.TitleSourceAuto,
		"context_summary": "", "summary_message_id": 0,
		"active_series_id": 0, "active_request_id": "",
		"status": agentmodel.SessionStatusActive, "message_count": 0,
		"last_message_at": now, "created_at": now,
	}))
	if id == 0 {
		return agentmodel.Session{}
	}
	if row := agentmodel.NewSessionModel().Find(ctx, map[string]any{"id": id}); row != nil {
		return *row
	}
	return agentmodel.Session{
		ID: id, OwnerType: owner.OwnerType, OwnerID: owner.OwnerID,
		ContextKey: contextKey, AgentKey: agentKey, Title: title,
		TitleSource: agentmodel.TitleSourceAuto, Status: agentmodel.SessionStatusActive,
		LastMessageAt: now, CreatedAt: now,
	}
}

func requireSession(ctx context.Context, owner ownerScope, sessionID uint64) (*agentmodel.Session, error) {
	row := agentmodel.NewSessionModel().Find(ctx, map[string]any{
		"id": sessionID, "owner_type": owner.OwnerType, "owner_id": owner.OwnerID,
		"status": agentmodel.SessionStatusActive,
	})
	if row == nil {
		return nil, fmt.Errorf("会话不存在")
	}
	return row, nil
}

func validateSessionScope(session agentmodel.Session, agentKey string, contextKey string) error {
	if agentKey = strings.TrimSpace(agentKey); agentKey != "" && session.AgentKey != agentKey {
		return fmt.Errorf("会话智能体不匹配")
	}
	if contextKey = strings.TrimSpace(contextKey); contextKey != "" && session.ContextKey != normalizeContextKey(contextKey, agentKey) {
		return fmt.Errorf("会话上下文不匹配")
	}
	return nil
}

func updateSessionStatus(ctx context.Context, sessionID uint64, status int16) error {
	owner, err := currentOwner(ctx)
	if err != nil {
		return err
	}
	session := agentmodel.NewSessionModel().Find(ctx, map[string]any{
		"id": sessionID, "owner_type": owner.OwnerType, "owner_id": owner.OwnerID,
	})
	if session == nil {
		return fmt.Errorf("会话不存在")
	}
	if status == agentmodel.SessionStatusArchived && sessionHasActiveWork(ctx, *session) {
		return fmt.Errorf("当前会话仍在生成，请等待完成或先停止")
	}
	filter := map[string]any{"id": session.ID}
	if status == agentmodel.SessionStatusArchived {
		filter["active_request_id"] = ""
	}
	if updated := agentmodel.NewSessionModel().Update(ctx, filter, map[string]any{"status": status}); updated != 1 {
		return fmt.Errorf("当前会话状态已变化，请重试")
	}
	return nil
}

func sessionHasActiveWork(ctx context.Context, session agentmodel.Session) bool {
	if strings.TrimSpace(session.ActiveRequestID) != "" {
		return true
	}
	if agentmodel.NewMessageModel().Find(ctx, map[string]any{
		"session_id": session.ID,
		"role":       "assistant",
		"status":     agentmodel.MessageStatusRunning,
	}) != nil {
		return true
	}
	return agentmodel.NewArtifactJobModel().Find(ctx, map[string]any{
		"session_id": session.ID,
		"status": []any{
			agentmodel.ArtifactJobStatusPending,
			agentmodel.ArtifactJobStatusRunning,
		},
	}) != nil
}

func currentOwner(ctx context.Context) (ownerScope, error) {
	if actor, ok := userservice.ActorFromContext(ctx); ok && actor.UserID > 0 {
		return ownerScope{OwnerType: agentmodel.SessionOwnerTypeBodyUser, OwnerID: actor.UserID}, nil
	}
	uid, ok := deverjwt.ActiveInt64(ctx)
	if ok && uid > 0 {
		return ownerScope{OwnerType: agentmodel.SessionOwnerTypeAdmin, OwnerID: uint64(uid)}, nil
	}
	if actorID, exists := frontauthcontext.AdminID(ctx); exists {
		return ownerScope{OwnerType: agentmodel.SessionOwnerTypeAdmin, OwnerID: actorID}, nil
	}
	return ownerScope{}, fmt.Errorf("登录账号无效")
}

func normalizeContextKey(contextKey string, agentKey string) string {
	if contextKey = strings.TrimSpace(contextKey); contextKey != "" {
		return limitText(contextKey, 128)
	}
	if agentKey = strings.TrimSpace(agentKey); agentKey != "" {
		return limitText("agent:"+agentKey, 128)
	}
	return "agent"
}

func sessionStatusFilter(status string) int16 {
	switch strings.ToLower(strings.TrimSpace(status)) {
	case "archived", "inactive", "2":
		return agentmodel.SessionStatusArchived
	case "all":
		return 0
	default:
		return agentmodel.SessionStatusActive
	}
}
