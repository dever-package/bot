package knowledge

import (
	"context"
	"fmt"
	"sync"

	agentmodel "my/package/bot/model/agent"
)

const maxBatchReindex = 50

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
		"id":     docIDs,
		"knowledge_base_id": baseID,
		"status": 1,
	}, map[string]any{
		"field": "main.id",
		"page":  1,
		"pageSize": len(docIDs),
	})
	if len(docs) == 0 {
		return fmt.Errorf("未找到要重索引的文档")
	}
	svc := NewService()
	var wg sync.WaitGroup
	for _, doc := range docs {
		if doc == nil || doc.ID == 0 {
			continue
		}
		wg.Add(1)
		docID := doc.ID
		go func() {
			defer wg.Done()
			_, _ = svc.IndexDocument(context.Background(), docID)
		}()
	}
	wg.Wait()
	return nil
}

func StartBaseIndex(ctx context.Context, baseID uint64) error {
	if baseID == 0 {
		return fmt.Errorf("知识库不能为空")
	}
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID})
	if base == nil {
		return fmt.Errorf("知识库不存在")
	}
	if base.IndexStatus == agentmodel.KnowledgeIndexStatusRunning || hasRunningKnowledgeDocs(ctx, baseID) {
		return fmt.Errorf("知识库正在索引中，请稍后再试")
	}
	agentmodel.NewKnowledgeBaseModel().Update(ctx, map[string]any{"id": baseID}, map[string]any{
		"index_status":  agentmodel.KnowledgeIndexStatusRunning,
		"error_message": "",
	})
	go func() {
		_, _ = NewService().RebuildBase(context.Background(), baseID)
	}()
	return nil
}
