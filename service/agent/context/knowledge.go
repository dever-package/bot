package agentcontext

import (
	"context"
	"fmt"
	"time"

	agentknowledge "github.com/dever-package/bot/service/agent/knowledge"
	agentprompt "github.com/dever-package/bot/service/agent/prompt"
)

const knowledgeBindingCacheTTL = 30 * time.Second

func (a Assembler) collectKnowledgeBases(ctx context.Context, req Request) []agentknowledge.AgentKnowledgeBaseRuntime {
	if a.knowledge == nil {
		return nil
	}
	key := fmt.Sprintf("agent-knowledge-bases:%d", req.Agent.ID)
	if cached, ok := a.cache.Get(key); ok {
		if rows, ok := cached.([]agentknowledge.AgentKnowledgeBaseRuntime); ok {
			return rows
		}
	}
	rows := a.knowledge.AgentKnowledgeBases(ctx, req.Agent.ID)
	a.cache.Set(key, rows, knowledgeBindingCacheTTL)
	return rows
}

func promptKnowledgeBases(rows []agentknowledge.AgentKnowledgeBaseRuntime) []agentprompt.KnowledgeBaseRuntime {
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
