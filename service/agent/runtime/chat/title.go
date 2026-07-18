package chat

import (
	"context"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimecontext "github.com/dever-package/bot/service/agent/runtime/context"
	runtimemessageoutput "github.com/dever-package/bot/service/agent/runtime/messageoutput"
	energonservice "github.com/dever-package/bot/service/energon"
)

func (s Service) generateSessionTitleAsync(sessionID uint64) {
	submitChatMaintenance("生成会话标题", sessionID, 20*time.Second, func(ctx context.Context) {
		s.generateSessionTitle(ctx, sessionID)
	})
}

func (s Service) generateSessionTitle(ctx context.Context, sessionID uint64) {
	session := agentmodel.NewSessionModel().Find(ctx, map[string]any{
		"id": sessionID, "status": agentmodel.SessionStatusActive,
	})
	if !sessionNeedsGeneratedTitle(session) {
		return
	}
	source, sourceMessageID := titleSourceText(ctx, session.ID)
	if source == "" {
		return
	}
	agent, err := runtimecontext.ResolveAgent(ctx, session.AgentKey)
	if err != nil {
		return
	}
	title, err := s.gateway.GenerateShortTitle(ctx, energonservice.ShortTitleRequest{
		PowerID:  agent.LLMPowerID,
		Role:     sessionTitleRole(),
		Source:   source,
		MaxRunes: 24,
	})
	if err != nil {
		return
	}
	latest := agentmodel.NewSessionModel().Find(ctx, map[string]any{
		"id": session.ID, "status": agentmodel.SessionStatusActive,
	})
	if !sessionNeedsGeneratedTitle(latest) {
		return
	}
	if agentmodel.NewMessageModel().Find(ctx, map[string]any{
		"id": sourceMessageID, "session_id": latest.ID,
	}) == nil {
		return
	}
	agentmodel.NewSessionModel().Update(ctx, map[string]any{
		"id": latest.ID, "title_source": latest.TitleSource,
	}, map[string]any{"title": title, "title_source": agentmodel.TitleSourceLLM})
}

func sessionNeedsGeneratedTitle(session *agentmodel.Session) bool {
	return session != nil && session.ID > 0 &&
		session.TitleSource == agentmodel.TitleSourceAuto && session.MessageCount >= 2 && session.MessageCount <= 4
}

func titleSourceText(ctx context.Context, sessionID uint64) (string, uint64) {
	rows := agentmodel.NewMessageModel().Select(ctx, map[string]any{
		"session_id": sessionID, "status": agentmodel.MessageStatusNormal,
	}, map[string]any{"order": "main.id asc", "limit": 2})
	parts := make([]string, 0, len(rows))
	var lastMessageID uint64
	for _, row := range rows {
		if row == nil || strings.TrimSpace(row.Text) == "" {
			continue
		}
		role := strings.TrimSpace(row.Role)
		if role == "" {
			role = "message"
		}
		parts = append(parts, role+": "+limitText(runtimemessageoutput.NormalizeText(row.Text), 600))
		lastMessageID = row.ID
	}
	return strings.Join(parts, "\n"), lastMessageID
}

func sessionTitleRole() string {
	return strings.Join([]string{
		"你是会话标题生成器。",
		"根据首轮对话生成一个简短中文标题。",
		"要求：6到16个汉字；不要标点；不要解释。",
		"只输出标题文本。",
	}, "\n")
}
