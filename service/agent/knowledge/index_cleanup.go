package knowledge

import (
	"context"

	agentmodel "github.com/dever-package/bot/model/agent"
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
	clearKnowledgeDocumentNodeEdges(ctx, base.ID, docID)
	if base.EmbeddingPowerID > 0 {
		_ = newQdrantClient().deleteByDoc(ctx, baseCollection(base), base.ID, docID)
	}
	agentmodel.NewKnowledgeVectorModel().Delete(ctx, map[string]any{"doc_id": docID})
	agentmodel.NewKnowledgeEdgeModel().Delete(ctx, map[string]any{"doc_id": docID})
	agentmodel.NewKnowledgeNodeModel().Delete(ctx, map[string]any{"doc_id": docID})
	agentmodel.NewKnowledgeParseModel().Delete(ctx, map[string]any{"doc_id": docID})
}

func clearKnowledgeDocumentNodeEdges(ctx context.Context, baseID uint64, docID uint64) {
	if baseID == 0 || docID == 0 {
		return
	}
	nodes := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"doc_id":            docID,
	}, map[string]any{
		"field": "main.id",
	})
	nodeIDs := make([]uint64, 0, len(nodes))
	for _, node := range nodes {
		if node != nil && node.ID > 0 {
			nodeIDs = append(nodeIDs, node.ID)
		}
	}
	if len(nodeIDs) == 0 {
		return
	}
	agentmodel.NewKnowledgeEdgeModel().Delete(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"from_node_id":      nodeIDs,
	})
	agentmodel.NewKnowledgeEdgeModel().Delete(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"to_node_id":        nodeIDs,
	})
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
