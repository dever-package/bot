package knowledge

import (
	"context"
	"fmt"

	agentmodel "my/package/bot/model/agent"
)

func StartDocumentIndex(ctx context.Context, docID uint64) error {
	doc := agentmodel.NewKnowledgeDocModel().Find(ctx, map[string]any{"id": docID})
	if doc == nil {
		return fmt.Errorf("知识文档不存在")
	}
	if doc.Status != 1 {
		return fmt.Errorf("知识文档已停用，不能索引")
	}
	startAsyncDocumentIndex(ctx, docID)
	return nil
}

func StartDirectoryIndex(ctx context.Context, baseID uint64, dirID uint64) error {
	if baseID == 0 {
		return fmt.Errorf("知识库不能为空")
	}
	if agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID}) == nil {
		return fmt.Errorf("知识库不存在")
	}
	if err := validateDocDir(ctx, baseID, dirID); err != nil {
		return err
	}
	agentmodel.NewKnowledgeBaseModel().Update(ctx, map[string]any{"id": baseID}, map[string]any{
		"index_status":  agentmodel.KnowledgeIndexStatusRunning,
		"error_message": "",
	})
	go func() {
		_, _ = NewService().IndexDirectory(context.Background(), baseID, dirID)
	}()
	return nil
}

func StartBaseIndex(ctx context.Context, baseID uint64) error {
	if baseID == 0 {
		return fmt.Errorf("知识库不能为空")
	}
	if agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID}) == nil {
		return fmt.Errorf("知识库不存在")
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
