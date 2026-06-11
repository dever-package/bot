package knowledge

import (
	"context"
	"fmt"

	agentmodel "my/package/bot/model/agent"
)

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
