package knowledge

import (
	"context"
	"strings"
	"time"

	agentmodel "my/package/bot/model/agent"
)

func withCreatedAt(values map[string]any) map[string]any {
	if _, ok := values["created_at"]; !ok {
		values["created_at"] = time.Now()
	}
	return values
}

func insertKnowledgeRetrieveLog(ctx context.Context, req knowledgeRetrieveLogInput) {
	query := strings.TrimSpace(req.Query)
	if req.BaseID == 0 || query == "" {
		return
	}
	agentmodel.NewKnowledgeRetrieveLogModel().Insert(ctx, withCreatedAt(map[string]any{
		"knowledge_base_id": req.BaseID,
		"agent_id":          req.AgentID,
		"query":             query,
		"planned_queries":   retrievalPlannedQueriesJSON(req.Matches),
		"node_ids":          snippetNodeIDsJSON(req.Snippets),
		"snippet_count":     len(req.Snippets),
		"latency_ms":        req.LatencyMs,
	}))
}

type knowledgeRetrieveLogInput struct {
	BaseID    uint64
	AgentID   uint64
	Query     string
	Snippets  []RetrievedSnippet
	Matches   []map[string]any
	LatencyMs int
}
