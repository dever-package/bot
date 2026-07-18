package knowledge

import (
	"context"
	"strings"
	"time"

	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const (
	knowledgeRetrieveLogRetention = 90 * 24 * time.Hour
	knowledgeRetrieveLogPruneStep = 100
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
	id := util.ToUint64(agentmodel.NewKnowledgeRetrieveLogModel().Insert(ctx, withCreatedAt(map[string]any{
		"knowledge_base_id": req.BaseID,
		"agent_id":          req.AgentID,
		"query":             query,
		"planned_queries":   retrievalPlannedQueriesJSON(req.Matches),
		"node_ids":          snippetNodeIDsJSON(req.Snippets),
		"snippet_count":     len(req.Snippets),
		"latency_ms":        req.LatencyMs,
	})))
	if id > 0 && id%knowledgeRetrieveLogPruneStep == 0 {
		agentmodel.NewKnowledgeRetrieveLogModel().Delete(ctx, map[string]any{
			"created_at": map[string]any{"lt": time.Now().Add(-knowledgeRetrieveLogRetention)},
		})
	}
}

type knowledgeRetrieveLogInput struct {
	BaseID    uint64
	AgentID   uint64
	Query     string
	Snippets  []RetrievedSnippet
	Matches   []map[string]any
	LatencyMs int
}
