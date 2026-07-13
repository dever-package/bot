package runtimecontext

import (
	"context"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimereference "github.com/dever-package/bot/service/agent/runtime/reference"
	frontstream "github.com/dever-package/front/service/stream"
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
	history := make([]any, 0, len(rows))
	for index := len(rows) - 1; index >= 0; index-- {
		row := rows[index]
		if row == nil || (row.Role != "user" && row.Role != "assistant") {
			continue
		}
		text := row.Text
		if row.Role == "user" {
			if response := runtimereference.InteractionResponsePrompt(row.Content); response != "" {
				text = strings.TrimSpace(text + "\n\n" + response)
			}
		}
		if references := runtimereference.ReferencesFromContent(row.Content); len(references) > 0 {
			if resolved, err := runtimereference.NewResolver().Resolve(ctx, session, references); err == nil && strings.TrimSpace(resolved.Prompt) != "" {
				text = strings.TrimSpace(text + "\n\n" + resolved.Prompt)
			}
		}
		history = append(history, map[string]any{"role": row.Role, "text": text})
	}
	return normalizeHistory(history)
}

func normalizeHistory(history []any) []any {
	selected := make([]map[string]any, 0, len(history))
	totalRunes := 0
	for index := len(history) - 1; index >= 0; index-- {
		message, ok := history[index].(map[string]any)
		if !ok {
			continue
		}
		role := strings.ToLower(strings.TrimSpace(frontstream.InputText(message["role"])))
		if role != "user" && role != "assistant" {
			continue
		}
		text := strings.TrimSpace(frontstream.InputText(message["text"]))
		if text == "" {
			text = strings.TrimSpace(frontstream.InputText(message["content"]))
		}
		text = limitRunes(text, historyMessageMaxRunes)
		if text == "" {
			continue
		}
		cost := runeCount(text)
		if len(selected) >= historyMinimumMessages && totalRunes+cost > historyTotalMaxRunes {
			break
		}
		selected = append(selected, map[string]any{"role": role, "text": text})
		totalRunes += cost
	}
	result := make([]any, 0, len(selected))
	for index := len(selected) - 1; index >= 0; index-- {
		result = append(result, selected[index])
	}
	return result
}
