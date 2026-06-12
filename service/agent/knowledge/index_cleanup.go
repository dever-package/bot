package knowledge

import (
	"context"

	agentmodel "my/package/bot/model/agent"
)

func clearKnowledgeDocumentIndex(ctx context.Context, baseID uint64, docID uint64) {
	if docID == 0 {
		return
	}
	if baseID > 0 {
		if base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID}); base != nil {
			clearKnowledgeDocumentIndexWithBase(ctx, *base, docID)
			return
		}
	}
	agentmodel.NewKnowledgeVectorModel().Delete(ctx, map[string]any{"doc_id": docID})
	agentmodel.NewKnowledgeEdgeModel().Delete(ctx, map[string]any{"doc_id": docID})
	agentmodel.NewKnowledgeNodeModel().Delete(ctx, map[string]any{"doc_id": docID})
	agentmodel.NewKnowledgeParseModel().Delete(ctx, map[string]any{"doc_id": docID})
}

func clearKnowledgeDocumentIndexWithBase(ctx context.Context, base agentmodel.KnowledgeBase, docID uint64) {
	if docID == 0 {
		return
	}
	if base.EmbeddingPowerID > 0 {
		_ = newQdrantClient().deleteByDoc(ctx, baseCollection(base), base.ID, docID)
	}
	agentmodel.NewKnowledgeVectorModel().Delete(ctx, map[string]any{"doc_id": docID})
	agentmodel.NewKnowledgeEdgeModel().Delete(ctx, map[string]any{"doc_id": docID})
	agentmodel.NewKnowledgeNodeModel().Delete(ctx, map[string]any{"doc_id": docID})
	agentmodel.NewKnowledgeParseModel().Delete(ctx, map[string]any{"doc_id": docID})
}

func clearKnowledgeBaseIndex(ctx context.Context, base agentmodel.KnowledgeBase) {
	if base.ID == 0 {
		return
	}
	if base.EmbeddingPowerID > 0 {
		_ = newQdrantClient().deleteByBase(ctx, baseCollection(base), base.ID)
	}
	filter := map[string]any{"knowledge_base_id": base.ID}
	agentmodel.NewKnowledgeVectorModel().Delete(ctx, filter)
	agentmodel.NewKnowledgeEdgeModel().Delete(ctx, filter)
	agentmodel.NewKnowledgeNodeModel().Delete(ctx, filter)
	agentmodel.NewKnowledgeParseModel().Delete(ctx, filter)
}
