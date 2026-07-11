package runtime

import (
	"encoding/json"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

func messageValues(kind string, text string, content any, output any, status int16) map[string]any {
	return map[string]any{
		"kind": kind, "text": strings.TrimSpace(text),
		"content": encodeJSON(content, "{}"), "output": encodeJSON(output, "{}"), "status": status,
	}
}

func normalizeRole(role string) string {
	switch strings.ToLower(strings.TrimSpace(role)) {
	case "user", "assistant", "system", "tool":
		return strings.ToLower(strings.TrimSpace(role))
	default:
		return ""
	}
}

func messageMap(row *agentmodel.Message) map[string]any {
	if row == nil {
		return map[string]any{}
	}
	return map[string]any{
		"id": row.ID, "session_id": row.SessionID, "role": row.Role, "kind": row.Kind,
		"text": row.Text, "content": decodeJSON(row.Content), "output": decodeJSON(row.Output),
		"request_id": row.RequestID, "status": row.Status, "created_at": timeText(row.CreatedAt),
	}
}

func mergeMessageOutput(base any, extras map[string]any) map[string]any {
	result := map[string]any{}
	current := base
	if raw, ok := base.(string); ok {
		current = decodeJSON(raw)
	}
	if values, ok := current.(map[string]any); ok {
		for key, value := range values {
			result[key] = value
		}
	} else if values, ok := decodeJSON(encodeJSON(current, "{}")).(map[string]any); ok {
		for key, value := range values {
			result[key] = value
		}
	}
	for key, value := range extras {
		result[key] = value
	}
	return result
}

func encodeJSON(value any, fallback string) string {
	if value == nil {
		return fallback
	}
	encoded, err := json.Marshal(value)
	if err != nil {
		return fallback
	}
	return string(encoded)
}

func decodeJSON(value string) any {
	value = strings.TrimSpace(value)
	if value == "" {
		return map[string]any{}
	}
	var result any
	if err := json.Unmarshal([]byte(value), &result); err != nil {
		return value
	}
	return result
}

func shortTitle(text string) string {
	return limitText(strings.Join(strings.Fields(strings.TrimSpace(text)), " "), 28)
}

func limitText(text string, limit int) string {
	text = strings.TrimSpace(text)
	if limit <= 0 {
		return ""
	}
	runes := []rune(text)
	if len(runes) <= limit {
		return text
	}
	return strings.TrimSpace(string(runes[:limit]))
}

func timeText(value time.Time) string {
	if value.IsZero() {
		return ""
	}
	return value.Format(time.RFC3339)
}
