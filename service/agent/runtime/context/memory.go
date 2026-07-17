package runtimecontext

import (
	"context"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	memoryservice "github.com/dever-package/bot/service/memory"
)

func runtimeMemoryText(ctx context.Context, session agentmodel.Session, query string) string {
	rows := memoryservice.NewService().RuntimeMemories(ctx, memoryservice.RuntimeRequest{
		OwnerType:     session.OwnerType,
		OwnerID:       session.OwnerID,
		AgentKey:      session.AgentKey,
		ContextKey:    session.ContextKey,
		SessionID:     session.ID,
		Query:         query,
		Limit:         8,
		IncludeGlobal: true,
		IncludeAgent:  true,
	})
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
		if len(parts) > 0 && totalRunes+runeCount(part) > 4000 {
			break
		}
		parts = append(parts, part)
		totalRunes += runeCount(part)
	}
	return strings.Join(parts, "\n")
}
