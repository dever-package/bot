package runtime

import (
	"context"
	"strings"
	"time"

	"github.com/google/uuid"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func (s Service) generateSessionTitleAsync(sessionID uint64) {
	if sessionID == 0 {
		return
	}
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
		defer cancel()
		s.generateSessionTitle(ctx, sessionID)
	}()
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
	agent, err := s.repository.FindAgent(ctx, session.AgentKey)
	if err != nil {
		return
	}
	power, err := s.repository.FindTextPower(ctx, agent.LLMPowerID)
	if err != nil {
		return
	}
	response := s.gateway.Request(ctx, energonservice.GatewayRequest{
		RequestID: uuid.NewString(),
		Body: map[string]any{
			"power":   power.Key,
			"set":     map[string]any{"role": sessionTitleRole()},
			"input":   map[string]any{"text": source},
			"options": map[string]any{"stream": false, "temperature": 0},
		},
	})
	if response.Status == botprotocol.ResponseStatusFail {
		return
	}
	title := normalizeGeneratedTitle(botprotocol.AsText(botprotocol.ExtractOutput(response.Payload())["text"]))
	if title == "" {
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
		parts = append(parts, role+": "+limitText(row.Text, 600))
		lastMessageID = row.ID
	}
	return strings.Join(parts, "\n"), lastMessageID
}

func sessionTitleRole() string {
	return strings.Join([]string{
		"你是会话标题生成器。",
		"根据首轮对话生成一个简短中文标题。",
		"要求：6到16个汉字；不要标点；不要解释；不要使用“关于”“帮助”“对话”。",
		"只输出标题文本。",
	}, "\n")
}

func normalizeGeneratedTitle(text string) string {
	text = strings.TrimSpace(text)
	text = strings.Trim(text, "`\"'“”‘’")
	text = strings.ReplaceAll(text, "\n", " ")
	text = strings.Join(strings.Fields(text), "")
	text = strings.Trim(text, "。.!！?？、，,：:")
	if text == "" || strings.Contains(text, "关于") || strings.Contains(text, "帮助") || strings.Contains(text, "对话") {
		return ""
	}
	return limitText(text, 24)
}
