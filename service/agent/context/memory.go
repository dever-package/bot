package agentcontext

import (
	"context"
	"strings"

	agentprompt "github.com/dever-package/bot/service/agent/prompt"
	memoryservice "github.com/dever-package/bot/service/memory"
)

const defaultMemoryLimit = 12

func (a Assembler) collectMemories(ctx context.Context, req Request, baseline Baseline, plan Plan, budget Budget) []memoryservice.RuntimeMemory {
	if a.memory == nil || !plan.IncludeMemory || !req.Memory.Enabled {
		return nil
	}
	query := memoryQuery(req, baseline, budget)
	if req.Memory.SessionID > 0 || req.AssistantSessionID > 0 {
		sessionID := req.Memory.SessionID
		if sessionID == 0 {
			sessionID = req.AssistantSessionID
		}
		return a.memory.RuntimeMemoriesBySession(ctx, sessionID, query, defaultMemoryLimit)
	}
	if strings.TrimSpace(req.Memory.OwnerType) == "" || req.Memory.OwnerID == 0 {
		return nil
	}
	return a.memory.RuntimeMemories(ctx, memoryservice.RuntimeRequest{
		OwnerType:       req.Memory.OwnerType,
		OwnerID:         req.Memory.OwnerID,
		AgentKey:        req.Memory.AgentKey,
		ContextKey:      req.Memory.ContextKey,
		Query:           query,
		Limit:           defaultMemoryLimit,
		IncludeGlobal:   req.Memory.IncludeGlobal,
		IncludeAgent:    req.Memory.IncludeAgent,
		IncludeUnscoped: req.Memory.IncludeUnscoped,
	})
}

func promptMemories(rows []memoryservice.RuntimeMemory) []agentprompt.MemorySnippet {
	result := make([]agentprompt.MemorySnippet, 0, len(rows))
	for _, row := range rows {
		result = append(result, agentprompt.MemorySnippet{
			ID:         row.ID,
			Kind:       row.Kind,
			Title:      row.Title,
			Content:    row.Content,
			Tags:       row.Tags,
			Importance: row.Importance,
		})
	}
	return result
}

func memoryQuery(req Request, baseline Baseline, budget Budget) string {
	parts := []string{primaryInputText(req.Input)}
	if baseline.Found && baseline.Summary != "" {
		parts = append(parts, baseline.Summary)
	}
	return truncateText(strings.Join(parts, "\n\n"), budget.MemoryQueryRunes)
}
