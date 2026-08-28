package chat

import (
	"context"
	"fmt"
	"strings"
	"time"

	deverjwt "github.com/shemic/dever/auth/jwt"

	agentmodel "github.com/dever-package/bot/model/agent"
	"github.com/dever-package/bot/service/internal/keylock"
	frontauthcontext "github.com/dever-package/front/service/authcontext"
	userservice "github.com/dever-package/user/service"
)

type ownerScope struct {
	OwnerType string
	OwnerID   uint64
}

type SessionOrigin struct {
	ProjectID uint64
	TeamID    uint64
	AgentID   uint64
}

type reusableSessionLockKey struct {
	OwnerType  string
	OwnerID    uint64
	ContextKey string
	AgentKey   string
}

var reusableSessionLocks keylock.Locker[reusableSessionLockKey]

func resolveSession(ctx context.Context, owner ownerScope, request SessionRequest) agentmodel.Session {
	contextKey := normalizeContextKey(request.ContextKey, request.AgentKey)
	agentKey := strings.TrimSpace(request.AgentKey)
	if !request.NewSession {
		release := acquireReusableSessionLock(reusableSessionLockKey{
			OwnerType:  owner.OwnerType,
			OwnerID:    owner.OwnerID,
			ContextKey: contextKey,
			AgentKey:   agentKey,
		})
		defer release()
	}
	if !request.NewSession {
		rows := agentmodel.NewSessionModel().Select(ctx, map[string]any{
			"owner_type":  owner.OwnerType,
			"owner_id":    owner.OwnerID,
			"context_key": contextKey,
			"agent_key":   agentKey,
			"status":      agentmodel.SessionStatusActive,
		}, map[string]any{"order": "main.last_message_at desc,main.id desc", "limit": 1})
		if len(rows) > 0 && rows[0] != nil {
			session := *rows[0]
			bindSessionOrigin(ctx, &session, sessionOriginFromRequest(request))
			return session
		}
	}
	title := strings.TrimSpace(request.Title)
	if title == "" {
		title = "新会话"
	}
	now := time.Now()
	id := uint64(agentmodel.NewSessionModel().Insert(ctx, map[string]any{
		"owner_type": owner.OwnerType, "owner_id": owner.OwnerID,
		"project_id": request.ProjectID, "team_id": request.TeamID, "agent_id": request.AgentID,
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
		ProjectID: request.ProjectID, TeamID: request.TeamID, AgentID: request.AgentID,
		ContextKey: contextKey, AgentKey: agentKey, Title: title,
		TitleSource: agentmodel.TitleSourceAuto, Status: agentmodel.SessionStatusActive,
		LastMessageAt: now, CreatedAt: now,
	}
}

func (Service) BindSessionOrigin(ctx context.Context, session *agentmodel.Session, origin SessionOrigin) {
	bindSessionOrigin(ctx, session, origin)
}

func sessionOriginFromRequest(request SessionRequest) SessionOrigin {
	return SessionOrigin{
		ProjectID: request.ProjectID,
		TeamID:    request.TeamID,
		AgentID:   request.AgentID,
	}
}

func bindSessionOrigin(ctx context.Context, session *agentmodel.Session, origin SessionOrigin) {
	if session == nil || session.ID == 0 {
		return
	}
	updates := map[string]any{}
	if session.ProjectID == 0 && origin.ProjectID > 0 {
		updates["project_id"] = origin.ProjectID
		session.ProjectID = origin.ProjectID
	}
	if session.TeamID == 0 && origin.TeamID > 0 {
		updates["team_id"] = origin.TeamID
		session.TeamID = origin.TeamID
	}
	if session.AgentID == 0 && origin.AgentID > 0 {
		updates["agent_id"] = origin.AgentID
		session.AgentID = origin.AgentID
	}
	if len(updates) > 0 {
		agentmodel.NewSessionModel().Update(ctx, map[string]any{"id": session.ID}, updates)
	}
}

func acquireReusableSessionLock(key reusableSessionLockKey) func() {
	return reusableSessionLocks.Lock(key)
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
