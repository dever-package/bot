package runtimecontext

import (
	"context"
	"strings"
	"sync"

	"github.com/google/uuid"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	softSummaryMessageLimit = 20
	hardSummaryMessageLimit = 40
	summaryKeepRecent       = 10
	summaryBatchLimit       = 100
	maxSummaryLength        = 8000
	summaryMessageMaxRunes  = 300
)

type Compactor struct {
	gateway energonservice.GatewayService
}

var sessionCompactionLocks sync.Map

func NewCompactor(gateway energonservice.GatewayService) Compactor {
	return Compactor{gateway: gateway}
}

func (c Compactor) Compact(ctx context.Context, sessionID uint64, powerKey string, hard bool) bool {
	threshold := softSummaryMessageLimit
	if hard {
		threshold = hardSummaryMessageLimit
	}
	if strings.TrimSpace(powerKey) == "" || !needsCompaction(ctx, sessionID, threshold) {
		return false
	}

	lock := compactionLock(sessionID)
	lock.Lock()
	defer lock.Unlock()

	session := agentmodel.NewSessionModel().Find(ctx, map[string]any{
		"id":     sessionID,
		"status": agentmodel.SessionStatusActive,
	})
	if session == nil {
		return false
	}
	rows := unsummarizedMessages(ctx, *session)
	if len(rows) <= threshold || len(rows) <= summaryKeepRecent {
		return false
	}
	rows = rows[:len(rows)-summaryKeepRecent]
	source := summarySource(session.ContextSummary, rows)
	if source == "" {
		return false
	}
	response := c.gateway.Request(ctx, energonservice.GatewayRequest{
		RequestID: uuid.NewString(),
		Body: map[string]any{
			"power":   powerKey,
			"set":     map[string]any{"role": summaryRole()},
			"input":   map[string]any{"text": source},
			"options": map[string]any{"stream": false, "temperature": 0},
		},
	})
	if response.Status == botprotocol.ResponseStatusFail {
		return false
	}
	summary := normalizeSummary(botprotocol.AsText(botprotocol.ExtractOutput(response.Payload())["text"]))
	if summary == "" {
		return false
	}
	lastMessageID := rows[len(rows)-1].ID
	if agentmodel.NewMessageModel().Find(ctx, map[string]any{
		"id": lastMessageID, "session_id": session.ID,
	}) == nil {
		return false
	}
	updated := agentmodel.NewSessionModel().Update(ctx, map[string]any{
		"id":                 session.ID,
		"summary_message_id": session.SummaryMessageID,
		"status":             agentmodel.SessionStatusActive,
	}, map[string]any{
		"context_summary":    summary,
		"summary_message_id": lastMessageID,
	})
	return updated > 0
}

func needsCompaction(ctx context.Context, sessionID uint64, threshold int) bool {
	if sessionID == 0 || threshold <= 0 {
		return false
	}
	session := agentmodel.NewSessionModel().Find(ctx, map[string]any{
		"id":     sessionID,
		"status": agentmodel.SessionStatusActive,
	})
	if session == nil {
		return false
	}
	filter := map[string]any{
		"session_id": session.ID,
		"status":     agentmodel.MessageStatusNormal,
	}
	if session.SummaryMessageID > 0 {
		filter["id"] = map[string]any{"gt": session.SummaryMessageID}
	}
	rows := agentmodel.NewMessageModel().Select(ctx, filter, map[string]any{
		"order": "main.id asc",
		"limit": threshold + 1,
	})
	return len(rows) > threshold
}

func compactionLock(sessionID uint64) *sync.Mutex {
	lock, _ := sessionCompactionLocks.LoadOrStore(sessionID, &sync.Mutex{})
	return lock.(*sync.Mutex)
}

func unsummarizedMessages(ctx context.Context, session agentmodel.Session) []*agentmodel.Message {
	filter := map[string]any{
		"session_id": session.ID,
		"status":     agentmodel.MessageStatusNormal,
	}
	if session.SummaryMessageID > 0 {
		filter["id"] = map[string]any{"gt": session.SummaryMessageID}
	}
	return agentmodel.NewMessageModel().Select(ctx, filter, map[string]any{
		"order": "main.id asc",
		"limit": summaryBatchLimit,
	})
}

func summarySource(previous string, rows []*agentmodel.Message) string {
	parts := make([]string, 0, len(rows)+2)
	if previous = strings.TrimSpace(previous); previous != "" {
		parts = append(parts, "已有摘要:\n"+limitRunes(previous, maxSummaryLength))
	}
	messages := make([]string, 0, len(rows))
	for _, row := range rows {
		if row == nil || strings.TrimSpace(row.Text) == "" {
			continue
		}
		message := strings.TrimSpace(row.Role) + ": " + compactMessageText(row.Text)
		messages = append(messages, message)
	}
	if len(messages) > 0 {
		parts = append(parts, "需要合并的对话:\n"+strings.Join(messages, "\n"))
	}
	return strings.Join(parts, "\n\n")
}

func compactMessageText(value string) string {
	value = strings.TrimSpace(value)
	runes := []rune(value)
	if len(runes) <= summaryMessageMaxRunes {
		return value
	}
	headLength := summaryMessageMaxRunes * 2 / 3
	return strings.TrimSpace(string(runes[:headLength])) + "\n...\n" +
		strings.TrimSpace(string(runes[len(runes)-(summaryMessageMaxRunes-headLength):]))
}

func summaryRole() string {
	return strings.Join([]string{
		"你是对话上下文压缩器。",
		"将已有摘要和新增对话合并为一份紧凑、准确、可供后续模型继续工作的摘要。",
		"保留用户目标、约束、偏好、已确认事实、关键产出和未完成事项。",
		"删除寒暄、重复内容和无关措辞；不要补充对话中不存在的信息。",
		"直接输出摘要正文，不要解释过程。",
	}, "\n")
}

func normalizeSummary(value string) string {
	value = strings.TrimSpace(value)
	if value == "" {
		return ""
	}
	runes := []rune(value)
	if len(runes) > maxSummaryLength {
		return strings.TrimSpace(string(runes[:maxSummaryLength]))
	}
	return value
}
