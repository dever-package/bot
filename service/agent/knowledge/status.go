package knowledge

import (
	"context"
	"encoding/json"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
)

type indexStageResult struct {
	Status  string `json:"status"`
	Message string `json:"message,omitempty"`
}

type indexStageDetail map[string]indexStageResult

func markDocumentIndexStage(ctx context.Context, docID uint64, indexVersion int, stage string, status string, message string) {
	if docID == 0 || indexVersion <= 0 {
		return
	}
	doc := agentmodel.NewKnowledgeDocModel().Find(ctx, map[string]any{
		"id":            docID,
		"index_version": indexVersion,
		"index_status":  agentmodel.KnowledgeIndexStatusRunning,
	})
	if doc == nil {
		return
	}
	detail := parseIndexStageDetail(doc.IndexStageDetail)
	stage = strings.TrimSpace(stage)
	if stage == "" {
		stage = agentmodel.KnowledgeIndexStagePending
	}
	detail[stage] = indexStageResult{
		Status:  strings.TrimSpace(status),
		Message: strings.TrimSpace(message),
	}
	values := map[string]any{
		"index_stage":        stage,
		"index_stage_detail": jsonText(detail),
	}
	agentmodel.NewKnowledgeDocModel().Update(ctx, map[string]any{
		"id":            docID,
		"index_version": indexVersion,
		"index_status":  agentmodel.KnowledgeIndexStatusRunning,
	}, values)
}

func currentDocumentStageDetail(ctx context.Context, docID uint64) indexStageDetail {
	doc := agentmodel.NewKnowledgeDocModel().Find(ctx, map[string]any{"id": docID})
	if doc == nil {
		return indexStageDetail{}
	}
	return parseIndexStageDetail(doc.IndexStageDetail)
}

func parseIndexStageDetail(value string) indexStageDetail {
	result := indexStageDetail{}
	value = strings.TrimSpace(value)
	if value == "" {
		return result
	}
	_ = json.Unmarshal([]byte(value), &result)
	return result
}

func resetDocumentIndexProgress(ctx context.Context, docID uint64) {
	if docID == 0 {
		return
	}
	agentmodel.NewKnowledgeDocModel().Update(ctx, map[string]any{"id": docID}, map[string]any{
		"index_stage":        agentmodel.KnowledgeIndexStagePending,
		"index_stage_detail": "",
		"error_message":      "",
	})
}

func beginKnowledgeDocIndex(ctx context.Context, doc *agentmodel.KnowledgeDoc) (int, bool) {
	if doc == nil || doc.ID == 0 {
		return 1, false
	}
	indexVersion := nextDocIndexVersion(doc.IndexVersion)
	doc.IndexVersion = indexVersion
	updated := agentmodel.NewKnowledgeDocModel().Update(ctx, map[string]any{
		"id":           doc.ID,
		"index_status": map[string]any{"neq": agentmodel.KnowledgeIndexStatusRunning},
	}, map[string]any{
		"index_version":      indexVersion,
		"index_status":       agentmodel.KnowledgeIndexStatusRunning,
		"index_stage":        agentmodel.KnowledgeIndexStagePending,
		"index_stage_detail": "",
		"error_message":      "",
	})
	return indexVersion, updated > 0
}

func isKnowledgeDocIndexActive(ctx context.Context, docID uint64, indexVersion int) bool {
	if docID == 0 || indexVersion <= 0 || ctx.Err() != nil {
		return false
	}
	return agentmodel.NewKnowledgeDocModel().Find(ctx, map[string]any{
		"id":            docID,
		"index_version": indexVersion,
		"index_status":  agentmodel.KnowledgeIndexStatusRunning,
	}) != nil
}

func nextDocIndexVersion(current int) int {
	if current <= 0 {
		return 1
	}
	return current + 1
}

func appendIndexWarning(current string, message string) string {
	const maxIndexWarningChars = 4000
	message = strings.TrimSpace(message)
	if message == "" {
		return strings.TrimSpace(current)
	}
	current = strings.TrimSpace(current)
	if current == "" {
		return truncateText(message, maxIndexWarningChars)
	}
	return truncateText(current+"；"+message, maxIndexWarningChars)
}

func firstFailedIndexStage(ctx context.Context, docID uint64) string {
	detail := currentDocumentStageDetail(ctx, docID)
	for _, stage := range []string{
		agentmodel.KnowledgeIndexStageParse,
		agentmodel.KnowledgeIndexStageNodes,
		agentmodel.KnowledgeIndexStageVector,
		agentmodel.KnowledgeIndexStageGraph,
		agentmodel.KnowledgeIndexStageSummary,
	} {
		if detail[stage].Status == agentmodel.KnowledgeIndexStatusFailed {
			return stage
		}
	}
	return agentmodel.KnowledgeIndexStageComplete
}
