package runtimecontext

import (
	"context"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const (
	recentMessageLimit     = hardSummaryMessageLimit
	historyMessageMaxRunes = 6000
	historyTotalMaxRunes   = 24000
	historyMinimumMessages = 2
)

func recentHistory(ctx context.Context, session agentmodel.Session) []any {
	filter := map[string]any{
		"session_id": session.ID,
		"status":     agentmodel.MessageStatusNormal,
	}
	if session.SummaryMessageID > 0 {
		filter["id"] = map[string]any{"gt": session.SummaryMessageID}
	}
	rows := agentmodel.NewMessageModel().Select(ctx, filter, map[string]any{
		"order": "main.id desc",
		"limit": recentMessageLimit,
	})
	selected := make([]map[string]any, 0, len(rows))
	totalRunes := 0
	for _, row := range rows {
		if row == nil || (row.Role != "user" && row.Role != "assistant") {
			continue
		}
		text := limitRunes(row.Text, historyMessageMaxRunes)
		if text == "" {
			continue
		}
		cost := runeCount(text)
		if len(selected) >= historyMinimumMessages && totalRunes+cost > historyTotalMaxRunes {
			break
		}
		selected = append(selected, map[string]any{"role": row.Role, "text": text})
		totalRunes += cost
	}
	result := make([]any, 0, len(selected))
	for index := len(selected) - 1; index >= 0; index-- {
		result = append(result, selected[index])
	}
	return result
}
