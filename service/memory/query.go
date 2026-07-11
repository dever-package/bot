package memory

import (
	"context"
	"strings"

	memorymodel "github.com/dever-package/bot/model/memory"
)

func (s Service) reviewMemoryRows(ctx context.Context, owner memoryOwner, request MemoryListRequest) ([]map[string]any, int64, int, int) {
	page, pageSize := normalizeMemoryPage(request.Page, firstPositive(request.PageSize, request.Limit, 10))
	filter := map[string]any{"owner_type": owner.OwnerType, "owner_id": owner.OwnerID}
	if status := memoryStatusFilter(request.Status); status > 0 {
		filter["status"] = status
	}
	if kind := normalizeMemoryKind(request.Kind); kind != "" {
		filter["kind"] = kind
	}
	if keyword := strings.TrimSpace(request.Keyword); keyword != "" {
		like := "%" + keyword + "%"
		filter["or"] = []map[string]any{
			{"title": map[string]any{"LIKE": like}},
			{"content": map[string]any{"LIKE": like}},
		}
	}
	model := memorymodel.NewMemoryModel()
	if strings.EqualFold(strings.TrimSpace(request.Scope), memoryScopeAll) {
		total := model.Count(ctx, filter)
		rows := model.Select(ctx, filter, map[string]any{
			"order": "main.importance desc,main.id desc", "page": page, "pageSize": pageSize,
		})
		return memoryMaps(rows), total, page, pageSize
	}
	rows := model.Select(ctx, filter, map[string]any{
		"order": "main.importance desc,main.id desc", "limit": memoryReviewMaxRows,
	})
	filtered := make([]*memorymodel.Memory, 0, len(rows))
	for _, row := range rows {
		if row != nil && memoryMatchesScope(*row, request) {
			filtered = append(filtered, row)
		}
	}
	start := (page - 1) * pageSize
	if start >= len(filtered) {
		return []map[string]any{}, int64(len(filtered)), page, pageSize
	}
	end := start + pageSize
	if end > len(filtered) {
		end = len(filtered)
	}
	return memoryMaps(filtered[start:end]), int64(len(filtered)), page, pageSize
}

func (s Service) findSimilarMemory(ctx context.Context, owner memoryOwner, scope string, contextKey string, agentKey string, sessionID uint64, title string, content string) *memorymodel.Memory {
	probe := NormalizeComparableText(title + " " + content)
	if probe == "" {
		return nil
	}
	request := MemoryListRequest{Scope: scope, ContextKey: contextKey, AgentKey: agentKey, SessionID: sessionID}
	rows := memorymodel.NewMemoryModel().Select(ctx, map[string]any{
		"owner_type": owner.OwnerType, "owner_id": owner.OwnerID, "status": memorymodel.StatusEnabled,
	}, map[string]any{"order": "main.importance desc,main.id desc", "limit": 120})
	for _, row := range rows {
		if row != nil && memoryMatchesScope(*row, request) && TextSimilar(probe, row.Title+" "+row.Content) {
			return row
		}
	}
	return nil
}
