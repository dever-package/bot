package runtimecontext

import (
	"context"
	"encoding/json"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimemessageoutput "github.com/dever-package/bot/service/agent/runtime/messageoutput"
	runtimereference "github.com/dever-package/bot/service/agent/runtime/reference"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	frontstream "github.com/dever-package/front/service/stream"
)

const (
	recentMessageLimit     = summaryBatchLimit
	historyMessageMaxRunes = 64000
)

type persistedHistoryCheckpoint struct {
	HistoryDelta []any          `json:"history_delta"`
	FinalOutput  map[string]any `json:"final_output"`
}

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
	runHistories := persistedRunHistories(ctx, session.ID, rows)
	history := make([]any, 0, len(rows))
	for index := len(rows) - 1; index >= 0; index-- {
		row := rows[index]
		if row == nil || (row.Role != "user" && row.Role != "assistant") {
			continue
		}
		if row.Role == "assistant" {
			if structured := runHistories[strings.TrimSpace(row.RequestID)]; len(structured) > 0 {
				if historyMessageRole(structured[0]) == "user" && lastHistoryRole(history) == "user" {
					history = history[:len(history)-1]
				}
				history = append(history, structured...)
				continue
			}
		}
		text := runtimemessageoutput.NormalizeText(row.Text)
		message := map[string]any{"role": row.Role, "text": text}
		if row.Role == "user" {
			for key, value := range runtimereference.ContentContext(row.Content) {
				message[key] = value
			}
		}
		history = append(history, message)
	}
	return normalizeHistory(history)
}

func persistedRunHistories(ctx context.Context, sessionID uint64, messages []*agentmodel.Message) map[string][]any {
	requestIDs := make([]string, 0, len(messages))
	seen := make(map[string]struct{}, len(messages))
	for _, message := range messages {
		if message == nil || message.Role != "assistant" {
			continue
		}
		requestID := strings.TrimSpace(message.RequestID)
		if requestID == "" {
			continue
		}
		if _, exists := seen[requestID]; exists {
			continue
		}
		seen[requestID] = struct{}{}
		requestIDs = append(requestIDs, requestID)
	}
	if len(requestIDs) == 0 {
		return nil
	}
	runs := agentmodel.NewRunModel().Select(ctx, map[string]any{
		"session_id": sessionID,
		"request_id": requestIDs,
		"status":     "success",
	})
	result := make(map[string][]any, len(runs))
	for _, run := range runs {
		if run == nil {
			continue
		}
		var checkpoint persistedHistoryCheckpoint
		if json.Unmarshal([]byte(strings.TrimSpace(run.Checkpoint)), &checkpoint) != nil {
			continue
		}
		history := normalizeHistoryMessages(checkpoint.HistoryDelta)
		if !persistedHistoryComplete(history, checkpoint.FinalOutput) {
			continue
		}
		result[strings.TrimSpace(run.RequestID)] = history
	}
	return result
}

func persistedHistoryComplete(history []any, output map[string]any) bool {
	hasToolResult := false
	for _, message := range history {
		if historyMessageRole(message) == "tool" {
			hasToolResult = true
			break
		}
	}
	if !hasToolResult || len(history) == 0 {
		return false
	}
	switch lastHistoryRole(history) {
	case "assistant":
		return true
	case "tool":
		mode := strings.ToLower(strings.TrimSpace(frontstream.InputText(output["completion_mode"])))
		return mode != "" && mode != "implicit"
	default:
		return false
	}
}

func normalizeHistory(history []any) []any {
	groups := historyGroups(normalizeHistoryMessages(history))
	selected := make([][]any, 0, len(groups))
	messageCount := 0
	for index := len(groups) - 1; index >= 0; index-- {
		group := groups[index]
		if messageCount > 0 && messageCount+len(group) > recentMessageLimit {
			break
		}
		selected = append(selected, group)
		messageCount += len(group)
	}
	result := make([]any, 0, messageCount)
	for index := len(selected) - 1; index >= 0; index-- {
		result = append(result, selected[index]...)
	}
	return result
}

func normalizeHistoryMessages(history []any) []any {
	result := make([]any, 0, len(history))
	for _, value := range history {
		message, ok := value.(map[string]any)
		if !ok {
			continue
		}
		if normalized := normalizeHistoryMessage(message); normalized != nil {
			result = append(result, normalized)
		}
	}
	return result
}

func normalizeHistoryMessage(message map[string]any) map[string]any {
	role := strings.ToLower(strings.TrimSpace(frontstream.InputText(message["role"])))
	switch role {
	case "user":
		text := historyMessageText(message, "text", "content", "prompt")
		if text == "" {
			return nil
		}
		result := map[string]any{"role": role, "text": text}
		for _, key := range []string{"params", "interaction_response", "references"} {
			if value, exists := message[key]; exists {
				result[key] = value
			}
		}
		return result
	case "assistant":
		calls := botprotocol.ParseToolCalls(message["tool_calls"])
		if len(calls) > 0 {
			result := map[string]any{
				"role":       role,
				"tool_calls": botprotocol.ToolCallsValue(calls),
			}
			if text := historyMessageText(message, "content", "text"); text != "" {
				result["content"] = text
			}
			return result
		}
		text := historyMessageText(message, "text", "content")
		if text == "" {
			return nil
		}
		return map[string]any{"role": role, "text": text}
	case "tool":
		callID := strings.TrimSpace(frontstream.InputText(message["tool_call_id"]))
		if callID == "" {
			return nil
		}
		return map[string]any{
			"role":         role,
			"tool_call_id": callID,
			"name":         strings.TrimSpace(frontstream.InputText(message["name"])),
			"content":      historyMessageText(message, "content", "text"),
		}
	default:
		return nil
	}
}

func historyGroups(history []any) [][]any {
	groups := make([][]any, 0, len(history))
	for index := 0; index < len(history); {
		message := history[index]
		role := historyMessageRole(message)
		if role == "tool" {
			index++
			continue
		}
		group := []any{message}
		index++
		callIDs := historyToolCallIDs(message)
		if len(callIDs) == 0 {
			groups = append(groups, group)
			continue
		}
		matched := make(map[string]struct{}, len(callIDs))
		for index < len(history) && historyMessageRole(history[index]) == "tool" {
			toolMessage, _ := history[index].(map[string]any)
			callID := strings.TrimSpace(frontstream.InputText(toolMessage["tool_call_id"]))
			if _, exists := callIDs[callID]; exists {
				matched[callID] = struct{}{}
				group = append(group, history[index])
			}
			index++
		}
		if len(matched) == len(callIDs) {
			groups = append(groups, group)
		}
	}
	return groups
}

func historyToolCallIDs(value any) map[string]struct{} {
	message, ok := value.(map[string]any)
	if !ok {
		return nil
	}
	calls := botprotocol.ParseToolCalls(message["tool_calls"])
	if len(calls) == 0 {
		return nil
	}
	result := make(map[string]struct{}, len(calls))
	for _, call := range calls {
		if callID := strings.TrimSpace(call.ID); callID != "" {
			result[callID] = struct{}{}
		}
	}
	return result
}

func historyMessageText(message map[string]any, keys ...string) string {
	for _, key := range keys {
		if text := strings.TrimSpace(frontstream.InputText(message[key])); text != "" {
			return limitRunes(text, historyMessageMaxRunes)
		}
	}
	return ""
}

func historyMessageRole(value any) string {
	message, ok := value.(map[string]any)
	if !ok {
		return ""
	}
	return strings.ToLower(strings.TrimSpace(frontstream.InputText(message["role"])))
}

func lastHistoryRole(history []any) string {
	if len(history) == 0 {
		return ""
	}
	return historyMessageRole(history[len(history)-1])
}
