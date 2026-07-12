package loop

import (
	"encoding/json"
	"strings"

	"github.com/google/uuid"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func userHistoryMessage(input map[string]any) map[string]any {
	message := map[string]any{"role": "user"}
	for key, value := range input {
		message[key] = value
	}
	return message
}

func assistantToolHistoryMessage(text string, calls []botprotocol.ToolCall) map[string]any {
	message := map[string]any{
		"role":       "assistant",
		"tool_calls": botprotocol.ToolCallsValue(calls),
	}
	if text = strings.TrimSpace(text); text != "" {
		message["content"] = text
	}
	return message
}

func toolHistoryMessage(call botprotocol.ToolCall, content string) map[string]any {
	return map[string]any{
		"role":         "tool",
		"tool_call_id": call.ID,
		"name":         call.Name,
		"content":      content,
	}
}

func normalizeToolCallIDs(calls []botprotocol.ToolCall) []botprotocol.ToolCall {
	result := append([]botprotocol.ToolCall(nil), calls...)
	for index := range result {
		if strings.TrimSpace(result[index].ID) == "" {
			result[index].ID = "call_" + strings.ReplaceAll(uuid.NewString(), "-", "")
		}
	}
	return result
}

func toolErrorContent(message string) string {
	raw, err := json.Marshal(map[string]any{"error": strings.TrimSpace(message)})
	if err != nil {
		return `{"error":"工具调用失败"}`
	}
	return string(raw)
}
