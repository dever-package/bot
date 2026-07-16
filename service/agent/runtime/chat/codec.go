package chat

import (
	"context"
	"encoding/json"
	"strconv"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeartifact "github.com/dever-package/bot/service/agent/runtime/artifact"
	runtimedocument "github.com/dever-package/bot/service/agent/runtime/document"
	runtimemessageoutput "github.com/dever-package/bot/service/agent/runtime/messageoutput"
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
	if row == nil {
		return map[string]any{}
	}
	artifacts := runtimeartifact.NewService().MessagePayloads(ctx, row.ID)
	documents := runtimedocument.NewService().MessagePayloadMap(
		ctx,
		[]uint64{row.ID},
		artifactsByBlock(map[uint64][]map[string]any{row.ID: artifacts}),
	)
	document, hasDocument := documents[row.ID]
	return messageMapWithRelations(row, artifacts, document, hasDocument)
}

func messageMapWithRelations(
	row *agentmodel.Message,
	artifacts []map[string]any,
	document runtimedocument.Payload,
	hasDocument bool,
) map[string]any {
	if row == nil {
		return map[string]any{}
	}
	output, text := runtimemessageoutput.FormatMessage(row.Output, row.Text, artifacts)
	result := map[string]any{
		"id": row.ID, "session_id": row.SessionID, "role": row.Role, "kind": row.Kind,
		"text": text, "content": decodeJSON(row.Content), "output": output,
		"request_id": row.RequestID, "status": row.Status, "created_at": timeText(row.CreatedAt),
	}
	if hasDocument {
		result["document"] = document
	}
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
	documents := runtimedocument.NewService().MessagePayloadMap(ctx, messageIDs, artifactsByBlock(artifacts))
	result := make([]map[string]any, 0, len(rows))
	for index := len(rows) - 1; index >= 0; index-- {
		row := rows[index]
		if row != nil {
			messageArtifacts := artifacts[row.ID]
			if messageArtifacts == nil {
				messageArtifacts = []map[string]any{}
			}
			document, hasDocument := documents[row.ID]
			result = append(result, messageMapWithRelations(row, messageArtifacts, document, hasDocument))
		}
	}
	return result
}

func artifactsByBlock(messages map[uint64][]map[string]any) runtimedocument.ArtifactPayloadMap {
	result := runtimedocument.ArtifactPayloadMap{}
	for _, artifacts := range messages {
		for _, artifact := range artifacts {
			blockID := positiveUint64(artifact["block_id"])
			if blockID == 0 {
				continue
			}
			result[blockID] = append(result[blockID], artifact)
		}
	}
	return result
}

func positiveUint64(value any) uint64 {
	switch current := value.(type) {
	case uint64:
		return current
	case uint:
		return uint64(current)
	case int:
		if current > 0 {
			return uint64(current)
		}
	case int64:
		if current > 0 {
			return uint64(current)
		}
	case float64:
		if current > 0 {
			return uint64(current)
		}
	case json.Number:
		parsed, _ := strconv.ParseUint(string(current), 10, 64)
		return parsed
	case string:
		parsed, _ := strconv.ParseUint(strings.TrimSpace(current), 10, 64)
		return parsed
	}
	return 0
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
