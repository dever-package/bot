package chat

import (
	"context"
	"fmt"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
	agentservice "github.com/dever-package/bot/service/agent"
	assetservice "github.com/dever-package/bot/service/asset"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	defaultAdminMessagePageSize = 20
	maxAdminMessagePageSize     = 100
)

// UserRecordService exposes read-only Body dialogue records to administrators.
type UserRecordService struct{}

func (UserRecordService) ProviderLoadSessionDetail(c *server.Context, _ []any) any {
	ctx, sessionID, userID := adminSessionContext(c)
	session := requireBodyUserSession(ctx, sessionID, userID)
	agentName := agentservice.ResolveDisplayNames(ctx, []agentservice.DisplayReference{{
		ID: session.AgentID, Key: session.AgentKey,
	}})[0]
	return map[string]any{
		"id":              session.ID,
		"user_id":         session.OwnerID,
		"title":           adminSessionTitle(*session),
		"agent_name":      agentName,
		"status":          session.Status,
		"message_count":   session.MessageCount,
		"last_message_at": session.LastMessageAt,
		"created_at":      session.CreatedAt,
	}
}

func (UserRecordService) ProviderLoadSessionMessages(c *server.Context, _ []any) any {
	ctx, sessionID, userID := adminSessionContext(c)
	requireBodyUserSession(ctx, sessionID, userID)
	page, pageSize := adminMessagePagination(c)
	filter := map[string]any{"session_id": sessionID}
	model := agentmodel.NewMessageModel()
	rows := model.Select(ctx, filter, map[string]any{
		"field":    "main.id,main.session_id,main.role,main.kind,main.text,main.status,main.created_at",
		"order":    "main.id desc",
		"page":     page,
		"pageSize": pageSize,
	})
	list := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		list = append(list, map[string]any{
			"id":         row.ID,
			"role":       strings.TrimSpace(row.Role),
			"role_name":  adminMessageRoleName(row.Role),
			"kind":       strings.TrimSpace(row.Kind),
			"summary":    adminMessageSummary(row.Text),
			"status":     row.Status,
			"created_at": row.CreatedAt,
		})
	}
	return map[string]any{
		"list": list, "total": model.Count(ctx, filter), "page": page, "pageSize": pageSize,
	}
}

func (UserRecordService) ProviderLoadMessageDetail(c *server.Context, _ []any) any {
	ctx, sessionID, userID := adminSessionContext(c)
	requireBodyUserSession(ctx, sessionID, userID)
	messageID := adminRecordInputID(c, "message_id")
	message := agentmodel.NewMessageModel().Find(ctx, map[string]any{
		"id": messageID, "session_id": sessionID,
	})
	if message == nil {
		panic("对话消息不存在")
	}
	payload := messageMap(ctx, message)
	prompt := adminMessagePrompt(ctx, *message)
	resultRaw := payload["output"]
	if adminEmptyRecordValue(resultRaw) {
		resultRaw = payload["document"]
	}
	if adminEmptyRecordValue(resultRaw) {
		resultRaw = strings.TrimSpace(util.ToString(payload["text"]))
	}
	if adminEmptyRecordValue(resultRaw) {
		resultRaw = "未生成结果"
	}
	resultKind := adminMessageResultKind(resultRaw)
	resultText := strings.TrimSpace(util.ToString(payload["text"]))
	return map[string]any{
		"id":              message.ID,
		"session_id":      message.SessionID,
		"role":            strings.TrimSpace(message.Role),
		"role_name":       adminMessageRoleName(message.Role),
		"kind":            strings.TrimSpace(message.Kind),
		"status":          message.Status,
		"prompt":          prompt,
		"result_text":     resultText,
		"result_document": assetservice.EnsureDocument(resultRaw, resultKind),
		"request_id":      strings.TrimSpace(message.RequestID),
		"created_at":      message.CreatedAt,
	}
}

func adminSessionContext(c *server.Context) (context.Context, uint64, uint64) {
	ctx := context.Background()
	if c != nil {
		ctx = c.Context()
	}
	return ctx, adminRecordInputID(c, "id"), adminRecordInputID(c, "user_id")
}

func adminRecordInputID(c *server.Context, key string) uint64 {
	if c == nil {
		return 0
	}
	return util.ToUint64(c.Input(key))
}

func requireBodyUserSession(ctx context.Context, sessionID uint64, userID uint64) *agentmodel.Session {
	if sessionID == 0 || userID == 0 {
		panic("对话记录参数不完整")
	}
	session := agentmodel.NewSessionModel().Find(ctx, map[string]any{
		"id":         sessionID,
		"owner_type": agentmodel.SessionOwnerTypeBodyUser,
		"owner_id":   userID,
	})
	if session == nil {
		panic("对话记录不存在")
	}
	return session
}

func adminMessagePagination(c *server.Context) (int, int) {
	page, pageSize := 1, defaultAdminMessagePageSize
	if c != nil {
		page = util.ToIntDefault(c.Input("page"), page)
		pageSize = util.ToIntDefault(c.Input("pageSize"), pageSize)
	}
	return max(page, 1), min(max(pageSize, 1), maxAdminMessagePageSize)
}

func adminSessionTitle(session agentmodel.Session) string {
	if title := strings.TrimSpace(session.Title); title != "" {
		return title
	}
	return fmt.Sprintf("对话 #%d", session.ID)
}

func adminMessageRoleName(role string) string {
	switch strings.ToLower(strings.TrimSpace(role)) {
	case "user":
		return "用户"
	case "assistant":
		return "智能体"
	case "system":
		return "系统"
	case "tool":
		return "工具"
	default:
		return "未知角色"
	}
}

func adminMessageSummary(text string) string {
	runes := []rune(strings.TrimSpace(text))
	if len(runes) <= 160 {
		return string(runes)
	}
	return string(runes[:160]) + "..."
}

func adminMessagePrompt(ctx context.Context, message agentmodel.Message) string {
	if strings.EqualFold(strings.TrimSpace(message.Role), "user") {
		if prompt := strings.TrimSpace(message.Text); prompt != "" {
			return prompt
		}
	}
	rows := agentmodel.NewMessageModel().Select(ctx, map[string]any{
		"session_id": message.SessionID,
		"role":       "user",
		"id":         map[string]any{"lt": message.ID},
	}, map[string]any{
		"field": "main.id,main.text", "order": "main.id desc", "limit": 1,
	})
	if len(rows) > 0 && rows[0] != nil {
		if prompt := strings.TrimSpace(rows[0].Text); prompt != "" {
			return prompt
		}
	}
	return "未记录提示词"
}

func adminMessageResultKind(raw any) string {
	for _, kind := range []string{"video", "audio", "image", "file"} {
		if len(botprotocol.ExtractPrimaryMediaURLs(raw, kind)) > 0 {
			return kind
		}
	}
	return "richtext"
}

func adminEmptyRecordValue(value any) bool {
	if value == nil {
		return true
	}
	switch current := value.(type) {
	case string:
		return strings.TrimSpace(current) == ""
	case map[string]any:
		return len(current) == 0
	case []any:
		return len(current) == 0
	default:
		return false
	}
}
