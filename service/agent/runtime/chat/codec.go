package chat

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeartifact "github.com/dever-package/bot/service/agent/runtime/artifact"
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

func messageMap(ctx context.Context, row *agentmodel.Message) map[string]any {
	return messageMapWithArtifacts(ctx, row, nil)
}

func messageMapWithArtifacts(ctx context.Context, row *agentmodel.Message, artifacts []map[string]any) map[string]any {
	if row == nil {
		return map[string]any{}
	}
	output := decodeJSON(row.Output)
	if artifacts == nil {
		artifacts = runtimeartifact.NewService().MessagePayloads(ctx, row.ID)
	}
	if len(artifacts) > 0 {
		output = mergeMessageOutput(output, map[string]any{"artifacts": artifacts})
		output = hydrateActivityArtifacts(output, artifacts)
	}
	return map[string]any{
		"id": row.ID, "session_id": row.SessionID, "role": row.Role, "kind": row.Kind,
		"text": row.Text, "content": decodeJSON(row.Content), "output": output,
		"request_id": row.RequestID, "status": row.Status, "created_at": timeText(row.CreatedAt),
	}
}

func hydrateActivityArtifacts(output any, artifacts []map[string]any) map[string]any {
	result := mergeMessageOutput(output, nil)
	activities, ok := result["activities"].([]any)
	if !ok {
		return result
	}
	byBatch := make(map[string][]map[string]any)
	for _, artifact := range artifacts {
		batchKey := strings.TrimSpace(fmt.Sprint(artifact["batch_key"]))
		if batchKey != "" {
			byBatch[batchKey] = append(byBatch[batchKey], artifact)
		}
	}
	for index, value := range activities {
		activity, currentOK := value.(map[string]any)
		if !currentOK {
			continue
		}
		meta, _ := activity["meta"].(map[string]any)
		callID := strings.TrimSpace(fmt.Sprint(meta["tool_call_id"]))
		if current := byBatch[callID]; len(current) > 0 {
			activity["artifacts"] = current
			activities[index] = activity
		}
	}
	result["activities"] = activities
	return result
}

func messageMaps(ctx context.Context, rows []*agentmodel.Message) []map[string]any {
	messageIDs := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			messageIDs = append(messageIDs, row.ID)
		}
	}
	artifacts := runtimeartifact.NewService().MessagePayloadMap(ctx, messageIDs)
	result := make([]map[string]any, 0, len(rows))
	for index := len(rows) - 1; index >= 0; index-- {
		row := rows[index]
		if row != nil {
			messageArtifacts := artifacts[row.ID]
			if messageArtifacts == nil {
				messageArtifacts = []map[string]any{}
			}
			result = append(result, messageMapWithArtifacts(ctx, row, messageArtifacts))
		}
	}
	return result
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
