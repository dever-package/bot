package runtimecontext

import (
	"context"
	"strings"

	memoryservice "github.com/dever-package/bot/service/memory"
)

func runtimeMemoryText(ctx context.Context, sessionID uint64, query string) string {
	rows := memoryservice.NewService().RuntimeMemoriesBySession(ctx, sessionID, query, 12)
	parts := make([]string, 0, len(rows))
	totalRunes := 0
	for _, row := range rows {
		content := limitRunes(row.Content, 800)
		if content == "" {
			continue
		}
		part := "- " + content
		if title := strings.TrimSpace(row.Title); title != "" {
			part = "- " + limitRunes(title, 120) + ": " + content
		}
		if len(parts) > 0 && totalRunes+runeCount(part) > 6000 {
			break
		}
		parts = append(parts, part)
		totalRunes += runeCount(part)
	}
	return strings.Join(parts, "\n")
}
