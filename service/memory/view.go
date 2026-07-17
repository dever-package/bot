package memory

import (
	"encoding/json"
	"strings"
	"time"

	memorymodel "github.com/dever-package/bot/model/memory"
)

func normalizeMemoryPage(page int, pageSize int) (int, int) {
	if page <= 0 {
		page = 1
	}
	if pageSize <= 0 {
		pageSize = 10
	}
	if pageSize > 100 {
		pageSize = 100
	}
	return page, pageSize
}

func memoryPaginationMap(page int, pageSize int, total int64) map[string]any {
	totalPages := 0
	if pageSize > 0 {
		totalPages = int((total + int64(pageSize) - 1) / int64(pageSize))
	}
	return map[string]any{"page": page, "page_size": pageSize, "total": total, "total_pages": totalPages}
}

func firstPositive(values ...int) int {
	for _, value := range values {
		if value > 0 {
			return value
		}
	}
	return 0
}

func memoryMaps(rows []*memorymodel.Memory) []map[string]any {
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, MemoryMap(row))
	}
	return result
}

func MemoryMap(row *memorymodel.Memory) map[string]any {
	if row == nil {
		return map[string]any{}
	}
	return map[string]any{
		"id": row.ID, "key": row.Key, "kind": row.Kind, "title": row.Title, "content": row.Content,
		"tags": decodeMemoryJSON(row.Tags), "importance": row.Importance, "scope": normalizeStoredMemoryScope(*row),
		"agent_key": row.AgentKey, "context_key": row.ContextKey, "session_id": row.SessionID,
		"source": row.Source, "confidence": row.Confidence, "status": row.Status,
		"source_message_id": row.SourceMessageID,
		"created_at":        row.CreatedAt.Format(time.RFC3339), "updated_at": memoryTimeText(row.UpdatedAt),
	}
}

func memoryTimeText(value time.Time) string {
	if value.IsZero() {
		return ""
	}
	return value.Format(time.RFC3339)
}

func encodeMemoryJSON(value any, fallback string) string {
	encoded, err := json.Marshal(value)
	if err != nil {
		return fallback
	}
	return string(encoded)
}

func decodeMemoryJSON(value string) any {
	var result any
	if err := json.Unmarshal([]byte(strings.TrimSpace(value)), &result); err != nil {
		return value
	}
	return result
}

func limitMemoryText(text string, limit int) string {
	text = strings.TrimSpace(text)
	runes := []rune(text)
	if limit > 0 && len(runes) > limit {
		return strings.TrimSpace(string(runes[:limit]))
	}
	return text
}
