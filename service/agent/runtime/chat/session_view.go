package chat

import (
	"context"

	agentmodel "github.com/dever-package/bot/model/agent"
	memoryservice "github.com/dever-package/bot/service/memory"
)

func sessionSummaryMap(row agentmodel.Session) map[string]any {
	return map[string]any{"id": row.ID, "title": row.Title}
}

func sessionMap(row agentmodel.Session) map[string]any {
	return map[string]any{
		"id": row.ID, "owner_type": row.OwnerType,
		"context_key": row.ContextKey, "agent_key": row.AgentKey,
		"title": row.Title, "title_source": row.TitleSource,
		"active_series_id": row.ActiveSeriesID,
		"status":           row.Status, "message_count": row.MessageCount,
		"last_message_at": timeText(row.LastMessageAt), "created_at": timeText(row.CreatedAt),
	}
}

func sessionMemories(ctx context.Context, session agentmodel.Session, enabled bool) []map[string]any {
	if !enabled {
		return []map[string]any{}
	}
	rows := memoryservice.NewService().RuntimeRows(ctx, memoryservice.RuntimeRequest{
		OwnerType: session.OwnerType, OwnerID: session.OwnerID,
		AgentKey: session.AgentKey, ContextKey: session.ContextKey,
		SessionID: session.ID, Limit: 20,
	})
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, memoryservice.MemoryMap(row))
	}
	return result
}

func normalizePage(page int, pageSize int) (int, int) {
	if page <= 0 {
		page = 1
	}
	return page, clampLimit(pageSize, 10, 100)
}

func paginationMap(page int, pageSize int, total int64) map[string]any {
	totalPages := 0
	if pageSize > 0 {
		totalPages = int((total + int64(pageSize) - 1) / int64(pageSize))
	}
	return map[string]any{
		"page": page, "page_size": pageSize, "total": total, "total_pages": totalPages,
	}
}

func clampLimit(value int, fallback int, maximum int) int {
	if value <= 0 {
		value = fallback
	}
	if value > maximum {
		return maximum
	}
	return value
}
