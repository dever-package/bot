package knowledge

import (
	"context"
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const indexOverviewErrorLimit = 8

type KnowledgeIndexOverview struct {
	Base         KnowledgeIndexOverviewBase       `json:"base"`
	Docs         KnowledgeIndexOverviewStatus     `json:"docs"`
	Nodes        KnowledgeIndexOverviewStatus     `json:"nodes"`
	Stages       []KnowledgeIndexStageOverview    `json:"stages"`
	Dirs         int                              `json:"dirs"`
	Edges        int                              `json:"edges"`
	Vectors      int                              `json:"vectors"`
	Progress     int                              `json:"progress"`
	RecentErrors []KnowledgeIndexOverviewDocError `json:"recent_errors"`
}

type KnowledgeIndexOverviewBase struct {
	ID           uint64 `json:"id"`
	Name         string `json:"name"`
	IndexStatus  string `json:"index_status"`
	ErrorMessage string `json:"error_message,omitempty"`
	DocCount     int    `json:"doc_count"`
	NodeCount    int    `json:"node_count"`
}

type KnowledgeIndexOverviewStatus struct {
	Total   int `json:"total"`
	Pending int `json:"pending"`
	Running int `json:"running"`
	Success int `json:"success"`
	Failed  int `json:"failed"`
}

type KnowledgeIndexStageOverview struct {
	Stage   string `json:"stage"`
	Label   string `json:"label"`
	Running int    `json:"running"`
	Failed  int    `json:"failed"`
}

type KnowledgeIndexOverviewDocError struct {
	ID           uint64 `json:"id"`
	Title        string `json:"title"`
	StoragePath  string `json:"storage_path"`
	IndexStatus  string `json:"index_status"`
	ErrorMessage string `json:"error_message"`
}

func (s Service) ReadKnowledgeIndexOverview(ctx context.Context, baseID uint64) (KnowledgeIndexOverview, error) {
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID, "status": 1})
	if base == nil {
		return KnowledgeIndexOverview{}, fmt.Errorf("知识库不存在")
	}
	docStatus := knowledgeDocStatusCounts(ctx, base.ID)
	nodeStatus := knowledgeNodeStatusCounts(ctx, base.ID)
	return KnowledgeIndexOverview{
		Base: KnowledgeIndexOverviewBase{
			ID:           base.ID,
			Name:         strings.TrimSpace(base.Name),
			IndexStatus:  strings.TrimSpace(base.IndexStatus),
			ErrorMessage: strings.TrimSpace(base.ErrorMessage),
			DocCount:     docStatus.Total,
			NodeCount:    nodeStatus.Total,
		},
		Docs:         docStatus,
		Nodes:        nodeStatus,
		Stages:       knowledgeStageOverview(ctx, base.ID),
		Dirs:         knowledgeDirCount(ctx, base.ID),
		Edges:        knowledgeEdgeCount(ctx, base.ID),
		Vectors:      knowledgeVectorCount(ctx, base.ID),
		Progress:     indexProgressPercent(docStatus),
		RecentErrors: recentKnowledgeIndexErrors(ctx, base.ID),
	}, nil
}

func knowledgeStageOverview(ctx context.Context, baseID uint64) []KnowledgeIndexStageOverview {
	stages := []KnowledgeIndexStageOverview{
		{Stage: agentmodel.KnowledgeIndexStageParse, Label: "解析"},
		{Stage: agentmodel.KnowledgeIndexStageNodes, Label: "节点"},
		{Stage: agentmodel.KnowledgeIndexStageSummary, Label: "摘要"},
		{Stage: agentmodel.KnowledgeIndexStageGraph, Label: "图谱"},
		{Stage: agentmodel.KnowledgeIndexStageVector, Label: "向量"},
	}
	for index := range stages {
		filter := map[string]any{
			"knowledge_base_id": baseID,
			"index_stage":       stages[index].Stage,
			"status":            1,
		}
		stages[index].Running = countInt(agentmodel.NewKnowledgeDocModel().Count(ctx, mergeFilter(filter, map[string]any{
			"index_status": agentmodel.KnowledgeIndexStatusRunning,
		})))
		stages[index].Failed = stageFailureCount(ctx, baseID, stages[index].Stage)
	}
	return stages
}

func stageFailureCount(ctx context.Context, baseID uint64, stage string) int {
	pattern := `%\"` + stage + `\":{\"status\":\"` + agentmodel.KnowledgeIndexStatusFailed + `%`
	return countInt(agentmodel.NewKnowledgeDocModel().Count(ctx, map[string]any{
		"knowledge_base_id":  baseID,
		"index_stage_detail": map[string]any{"like": pattern},
		"status":             1,
	}))
}

func mergeFilter(base map[string]any, values map[string]any) map[string]any {
	result := make(map[string]any, len(base)+len(values))
	for key, value := range base {
		result[key] = value
	}
	for key, value := range values {
		result[key] = value
	}
	return result
}

func knowledgeDocStatusCounts(ctx context.Context, baseID uint64) KnowledgeIndexOverviewStatus {
	return knowledgeIndexStatusCounts(func(status string) int {
		filter := map[string]any{"knowledge_base_id": baseID, "status": 1}
		if status != "" {
			filter["index_status"] = status
		}
		return countInt(agentmodel.NewKnowledgeDocModel().Count(ctx, filter))
	})
}

func knowledgeNodeStatusCounts(ctx context.Context, baseID uint64) KnowledgeIndexOverviewStatus {
	return knowledgeIndexStatusCounts(func(status string) int {
		filter := map[string]any{"knowledge_base_id": baseID, "status": 1}
		if status != "" {
			filter["index_status"] = status
		}
		return countInt(agentmodel.NewKnowledgeNodeModel().Count(ctx, filter))
	})
}

func knowledgeIndexStatusCounts(count func(status string) int) KnowledgeIndexOverviewStatus {
	return KnowledgeIndexOverviewStatus{
		Total:   count(""),
		Pending: count(agentmodel.KnowledgeIndexStatusPending),
		Running: count(agentmodel.KnowledgeIndexStatusRunning),
		Success: count(agentmodel.KnowledgeIndexStatusSuccess),
		Failed:  count(agentmodel.KnowledgeIndexStatusFailed),
	}
}

func knowledgeDirCount(ctx context.Context, baseID uint64) int {
	return countInt(agentmodel.NewKnowledgeDirModel().Count(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	}))
}

func knowledgeEdgeCount(ctx context.Context, baseID uint64) int {
	return countInt(agentmodel.NewKnowledgeEdgeModel().Count(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	}))
}

func knowledgeVectorCount(ctx context.Context, baseID uint64) int {
	return countInt(agentmodel.NewKnowledgeVectorModel().Count(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	}))
}

func indexProgressPercent(status KnowledgeIndexOverviewStatus) int {
	if status.Total <= 0 {
		return 0
	}
	return status.Success * 100 / status.Total
}

func recentKnowledgeIndexErrors(ctx context.Context, baseID uint64) []KnowledgeIndexOverviewDocError {
	rows := agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"index_status":      agentmodel.KnowledgeIndexStatusFailed,
		"status":            1,
	}, map[string]any{
		"field":    "main.id, main.title, main.storage_path, main.index_status, main.error_message",
		"order":    "main.id desc",
		"page":     1,
		"pageSize": indexOverviewErrorLimit,
	})
	result := make([]KnowledgeIndexOverviewDocError, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		result = append(result, KnowledgeIndexOverviewDocError{
			ID:           row.ID,
			Title:        strings.TrimSpace(row.Title),
			StoragePath:  strings.TrimSpace(row.StoragePath),
			IndexStatus:  strings.TrimSpace(row.IndexStatus),
			ErrorMessage: strings.TrimSpace(row.ErrorMessage),
		})
	}
	return result
}
