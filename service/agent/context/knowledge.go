package agentcontext

import (
	"context"
	"fmt"
	"time"

	agentknowledge "github.com/dever-package/bot/service/agent/knowledge"
	agentprompt "github.com/dever-package/bot/service/agent/prompt"
)

const knowledgeCategoryCacheTTL = 30 * time.Second

func (a Assembler) collectKnowledgeBases(ctx context.Context, req Request) []agentknowledge.KnowledgeBaseRuntime {
	if a.knowledge == nil || req.Agent.KnowledgeCateID == 0 {
		return nil
	}
	key := fmt.Sprintf("agent-knowledge-category:%d", req.Agent.KnowledgeCateID)
	if cached, ok := a.cache.Get(key); ok {
		if rows, ok := cached.([]agentknowledge.KnowledgeBaseRuntime); ok {
			return rows
		}
	}
	rows := a.knowledge.KnowledgeBasesByCate(ctx, req.Agent.KnowledgeCateID)
	a.cache.Set(key, rows, knowledgeCategoryCacheTTL)
	return rows
}

func promptKnowledgeBases(rows []agentknowledge.KnowledgeBaseRuntime) []agentprompt.KnowledgeBaseRuntime {
	result := make([]agentprompt.KnowledgeBaseRuntime, 0, len(rows))
	for _, row := range rows {
		result = append(result, agentprompt.KnowledgeBaseRuntime{
			ID:     row.ID,
			Name:   row.Name,
			Prompt: row.Prompt,
		})
	}
	return result
}
