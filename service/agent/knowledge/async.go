package knowledge

import (
	"context"
	"fmt"
	"strings"
	"sync"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const (
	maxBatchReindex        = 50
	maxBatchReindexWorkers = 4
)

func (s Service) BatchReindex(ctx context.Context, baseID uint64, docIDs []uint64) error {
	if baseID == 0 {
		return fmt.Errorf("知识库不能为空")
	}
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID})
	if base == nil {
		return fmt.Errorf("知识库不存在")
	}
	if len(docIDs) == 0 {
		return fmt.Errorf("请选择要重索引的文档")
	}
	if len(docIDs) > maxBatchReindex {
		return fmt.Errorf("批量重索引最多 %d 个文档", maxBatchReindex)
	}
	// Validate all docs belong to this base and exist
	docs := agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{
		"id":                docIDs,
		"knowledge_base_id": baseID,
		"status":            1,
	}, map[string]any{
		"field":    "main.id",
		"page":     1,
		"pageSize": len(docIDs),
	})
	if len(docs) == 0 {
		return fmt.Errorf("未找到要重索引的文档")
	}
	return s.runBatchReindexWorkers(docs)
}

func (s Service) runBatchReindexWorkers(docs []*agentmodel.KnowledgeDoc) error {
	docIDs := reindexDocIDs(docs)
	if len(docIDs) == 0 {
		return fmt.Errorf("未找到要重索引的文档")
	}
	workerCount := maxBatchReindexWorkers
	if len(docIDs) < workerCount {
		workerCount = len(docIDs)
	}
	jobs := make(chan uint64)
	errs := make(chan error, len(docIDs))
	var wg sync.WaitGroup
	for i := 0; i < workerCount; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			svc := NewService()
			for docID := range jobs {
				if _, err := svc.IndexDocument(context.Background(), docID); err != nil {
					errs <- fmt.Errorf("文档 %d 重索引失败: %w", docID, err)
				}
			}
		}()
	}
	for _, docID := range docIDs {
		jobs <- docID
	}
	close(jobs)
	wg.Wait()
	close(errs)
	return joinBatchReindexErrors(errs)
}

func reindexDocIDs(docs []*agentmodel.KnowledgeDoc) []uint64 {
	ids := make([]uint64, 0, len(docs))
	seen := map[uint64]struct{}{}
	for _, doc := range docs {
		if doc == nil || doc.ID == 0 {
			continue
		}
		if _, exists := seen[doc.ID]; exists {
			continue
		}
		seen[doc.ID] = struct{}{}
		ids = append(ids, doc.ID)
	}
	return ids
}

func joinBatchReindexErrors(errs <-chan error) error {
	messages := make([]string, 0)
	for err := range errs {
		if err != nil {
			messages = append(messages, err.Error())
		}
	}
	if len(messages) == 0 {
		return nil
	}
	if len(messages) > 5 {
		messages = append(messages[:5], fmt.Sprintf("另有 %d 个文档失败", len(messages)-5))
	}
	return fmt.Errorf("%s", strings.Join(messages, "；"))
}

func StartBaseIndex(ctx context.Context, baseID uint64) error {
	if baseID == 0 {
		return fmt.Errorf("知识库不能为空")
	}
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID})
	if base == nil {
		return fmt.Errorf("知识库不存在")
	}
	if hasRunningKnowledgeDocs(ctx, baseID) {
		return fmt.Errorf("知识库正在索引中，请稍后再试")
	}
	updated := agentmodel.NewKnowledgeBaseModel().Update(ctx, map[string]any{
		"id":           baseID,
		"index_status": map[string]any{"neq": agentmodel.KnowledgeIndexStatusRunning},
	}, map[string]any{
		"index_status":  agentmodel.KnowledgeIndexStatusRunning,
		"error_message": "",
	})
	if updated == 0 {
		return fmt.Errorf("知识库正在索引中，请稍后再试")
	}
	go func() {
		defer func() {
			if recovered := recover(); recovered != nil {
				markRunningBaseIndexFailed(context.Background(), baseID, fmt.Sprintf("%v", recovered))
			}
		}()
		_, _ = NewService().RebuildBase(context.Background(), baseID)
	}()
	return nil
}

func markRunningBaseIndexFailed(ctx context.Context, baseID uint64, message string) {
	if baseID == 0 {
		return
	}
	agentmodel.NewKnowledgeDocModel().Update(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"index_status":      agentmodel.KnowledgeIndexStatusRunning,
		"status":            1,
	}, map[string]any{
		"index_status":  agentmodel.KnowledgeIndexStatusFailed,
		"index_stage":   agentmodel.KnowledgeIndexStageFailed,
		"error_message": strings.TrimSpace(message),
	})
	agentmodel.NewKnowledgeBaseModel().Update(ctx, map[string]any{"id": baseID}, map[string]any{
		"index_status":  agentmodel.KnowledgeIndexStatusFailed,
		"error_message": strings.TrimSpace(message),
	})
}
