package assistant

import (
	"context"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/shemic/dever/util"

	assistantmodel "github.com/dever-package/bot/model/assistant"
	energonservice "github.com/dever-package/bot/service/energon"
)

func (s Service) generateSessionTitleAsync(owner ownerScope, session assistantmodel.Session) {
	if session.ID == 0 || session.TitleSource == assistantmodel.TitleSourceManual || session.MessageCount > 2 {
		return
	}
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
		defer cancel()
		s.generateSessionTitle(ctx, owner, session)
	}()
}

func (s Service) generateSessionTitle(ctx context.Context, owner ownerScope, session assistantmodel.Session) {
	current := assistantmodel.NewSessionModel().Find(ctx, map[string]any{
		"id":         session.ID,
		"owner_type": owner.OwnerType,
		"owner_id":   owner.OwnerID,
		"status":     assistantmodel.SessionStatusActive,
	})
	if current == nil || current.TitleSource == assistantmodel.TitleSourceManual || current.MessageCount > 2 {
		return
	}
	source := titleSourceText(ctx, session.ID)
	if source == "" {
		return
	}
	powerKey := assistantMemoryPowerKey(ctx, current.AgentKey)
	if powerKey == "" {
		return
	}
	resp := energonservice.NewGatewayService().Request(ctx, energonservice.GatewayRequest{
		RequestID: uuid.NewString(),
		Body: map[string]any{
			"power": powerKey,
			"set": map[string]any{
				"role": sessionTitleRole(),
			},
			"input": map[string]any{
				"text": source,
			},
			"options": map[string]any{
				"stream":      false,
				"temperature": 0,
			},
		},
	})
	payload := resp.Payload()
	if util.ToIntDefault(payload["status"], 0) == 2 {
		return
	}
	title := normalizeGeneratedTitle(gatewayPayloadText(payload))
	if title == "" {
		return
	}
	latest := assistantmodel.NewSessionModel().Find(ctx, map[string]any{
		"id":         current.ID,
		"owner_type": owner.OwnerType,
		"owner_id":   owner.OwnerID,
		"status":     assistantmodel.SessionStatusActive,
	})
	if latest == nil || latest.TitleSource == assistantmodel.TitleSourceManual || latest.MessageCount > 2 {
		return
	}
	assistantmodel.NewSessionModel().Update(ctx, map[string]any{
		"id":           latest.ID,
		"owner_type":   owner.OwnerType,
		"owner_id":     owner.OwnerID,
		"title_source": latest.TitleSource,
	}, map[string]any{
		"title":        title,
		"title_source": assistantmodel.TitleSourceLLM,
	})
}

func titleSourceText(ctx context.Context, sessionID uint64) string {
	rows := assistantmodel.NewMessageModel().Select(ctx, map[string]any{
		"session_id": sessionID,
		"status":     assistantmodel.MessageStatusNormal,
	}, map[string]any{
		"order": "main.id asc",
		"limit": 2,
	})
	parts := make([]string, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		role := strings.TrimSpace(row.Role)
		if role == "" {
			role = "message"
		}
		text := strings.TrimSpace(row.Text)
		if text != "" {
			parts = append(parts, role+": "+limitText(text, 600))
		}
	}
	return strings.Join(parts, "\n")
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
