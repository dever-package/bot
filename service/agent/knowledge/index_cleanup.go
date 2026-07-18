package knowledge

import (
	"context"
	"fmt"
	"sort"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
)

func clearKnowledgeDocumentIndex(ctx context.Context, baseID uint64, docID uint64) {
	if docID == 0 {
		return
	}
	var base *agentmodel.KnowledgeBase
	if baseID > 0 {
		base = agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID})
	}
	if base != nil {
		clearKnowledgeDocumentIndexWithBase(ctx, *base, docID)
	} else {
		clearKnowledgeDocumentDatabaseIndex(ctx, baseID, docID)
	}
	agentmodel.NewKnowledgeDocVersionModel().Delete(ctx, map[string]any{"doc_id": docID})
}

func clearKnowledgeDocumentIndexWithBase(ctx context.Context, base agentmodel.KnowledgeBase, docID uint64) {
	if docID == 0 {
		return
	}
	collections := knowledgeDocumentVectorCollections(ctx, base, docID)
	_ = deleteKnowledgeDocumentVectorPoints(ctx, newQdrantClient(), base.ID, docID, collections)
	clearKnowledgeDocumentDatabaseIndex(ctx, base.ID, docID)
}

func knowledgeDocumentVectorCollections(ctx context.Context, base agentmodel.KnowledgeBase, docID uint64) []string {
	if docID == 0 {
		return nil
	}
	collections := knowledgeVectorCollections(ctx, map[string]any{
		"doc_id": docID,
	})
	if base.EmbeddingPowerID > 0 {
		collections[baseCollection(base)] = struct{}{}
	}
	result := make([]string, 0, len(collections))
	for collection := range collections {
		result = append(result, collection)
	}
	sort.Strings(result)
	return result
}

func deleteKnowledgeDocumentVectorPoints(ctx context.Context, client qdrantClient, baseID uint64, docID uint64, collections []string) error {
	errors := make([]string, 0)
	for _, collection := range collections {
		if err := client.deleteByDoc(ctx, collection, baseID, docID); err != nil {
			errors = append(errors, err.Error())
		}
	}
	if len(errors) == 0 {
		agentmodel.NewKnowledgeVectorModel().Delete(ctx, map[string]any{"doc_id": docID})
		return nil
	}
	return fmt.Errorf("%s", strings.Join(errors, "；"))
}

func deleteKnowledgeDocumentVectorVersionsBefore(ctx context.Context, client qdrantClient, baseID uint64, docID uint64, indexVersion int, collections []string) error {
	errors := make([]string, 0)
	for _, collection := range collections {
		if err := client.deleteByDocBeforeVersion(ctx, collection, baseID, docID, indexVersion); err != nil {
			errors = append(errors, err.Error())
		}
	}
	if len(errors) == 0 {
		agentmodel.NewKnowledgeVectorModel().Delete(ctx, map[string]any{
			"doc_id":        docID,
			"index_version": map[string]any{"lt": indexVersion},
		})
		return nil
	}
	return fmt.Errorf("%s", strings.Join(errors, "；"))
}

func resetKnowledgeBaseVectorsForEmbeddingChange(ctx context.Context, base agentmodel.KnowledgeBase, previousPowerID uint64) error {
	if base.ID == 0 || previousPowerID == base.EmbeddingPowerID {
		return nil
	}
	collections := knowledgeBaseVectorCollections(ctx, base)
	if previousPowerID > 0 {
		currentCollection := baseCollection(base)
		found := false
		for _, collection := range collections {
			if collection == currentCollection {
				found = true
				break
			}
		}
		if !found {
			collections = append(collections, currentCollection)
		}
		sort.Strings(collections)
	}
	sharedCollection := false
	if base.EmbeddingPowerID > 0 && previousPowerID > 0 {
		sharedCollection = agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{
			"id":                 map[string]any{"neq": base.ID},
			"cate_id":            base.CateID,
			"embedding_power_id": map[string]any{"gt": 0},
		}) != nil
	}
	client := newQdrantClient()
	for _, collection := range collections {
		var err error
		if base.EmbeddingPowerID > 0 && previousPowerID > 0 && !sharedCollection && collection == baseCollection(base) {
			err = client.deleteCollection(ctx, collection)
		} else {
			err = client.deleteByBase(ctx, collection, base.ID)
		}
		if err != nil {
			return err
		}
	}
	agentmodel.NewKnowledgeVectorModel().Delete(ctx, map[string]any{"knowledge_base_id": base.ID})
	return nil
}

func knowledgeBaseVectorCollections(ctx context.Context, base agentmodel.KnowledgeBase) []string {
	collections := knowledgeVectorCollections(ctx, map[string]any{
		"knowledge_base_id": base.ID,
	})
	result := make([]string, 0, len(collections))
	for collection := range collections {
		result = append(result, collection)
	}
	sort.Strings(result)
	return result
}

func knowledgeVectorCollections(ctx context.Context, filters map[string]any) map[string]struct{} {
	const pageSize = 1000
	collections := map[string]struct{}{}
	var afterID uint64
	for ctx.Err() == nil {
		pageFilters := mergeFilter(filters, map[string]any{})
		if afterID > 0 {
			pageFilters["id"] = map[string]any{"gt": afterID}
		}
		rows := agentmodel.NewKnowledgeVectorModel().Select(ctx, pageFilters, map[string]any{
			"field":    "main.id, main.collection",
			"order":    "main.id asc",
			"page":     1,
			"pageSize": pageSize,
		})
		if len(rows) == 0 {
			break
		}
		afterID = rows[len(rows)-1].ID
		for _, row := range rows {
			if row != nil && strings.TrimSpace(row.Collection) != "" {
				collections[strings.TrimSpace(row.Collection)] = struct{}{}
			}
		}
		if len(rows) < pageSize {
			break
		}
	}
	return collections
}

func clearKnowledgeDocumentDatabaseIndex(ctx context.Context, baseID uint64, docID uint64) {
	if docID == 0 {
		return
	}
	clearKnowledgeDocumentNodeEdges(ctx, baseID, docID)
	agentmodel.NewKnowledgeVectorModel().Delete(ctx, map[string]any{"doc_id": docID})
	agentmodel.NewKnowledgeEdgeModel().Delete(ctx, map[string]any{"doc_id": docID})
	agentmodel.NewKnowledgeNodeModel().Delete(ctx, map[string]any{"doc_id": docID})
	agentmodel.NewKnowledgeParseModel().Delete(ctx, map[string]any{"doc_id": docID})
}

func clearKnowledgeDocumentNodeEdges(ctx context.Context, baseID uint64, docID uint64) {
	if baseID == 0 || docID == 0 {
		return
	}
	const cleanupBatchSize = 500
	var afterID uint64
	for {
		filters := map[string]any{
			"knowledge_base_id": baseID,
			"doc_id":            docID,
		}
		if afterID > 0 {
			filters["id"] = map[string]any{"gt": afterID}
		}
		nodes := agentmodel.NewKnowledgeNodeModel().Select(ctx, filters, map[string]any{
			"field":    "main.id",
			"order":    "main.id asc",
			"page":     1,
			"pageSize": cleanupBatchSize,
		})
		if len(nodes) == 0 {
			break
		}
		afterID = nodes[len(nodes)-1].ID
		batch := make([]uint64, 0, len(nodes))
		for _, node := range nodes {
			if node != nil && node.ID > 0 {
				batch = append(batch, node.ID)
			}
		}
		if len(batch) == 0 {
			break
		}
		agentmodel.NewKnowledgeEdgeModel().Delete(ctx, map[string]any{
			"knowledge_base_id": baseID,
			"from_node_id":      batch,
		})
		agentmodel.NewKnowledgeEdgeModel().Delete(ctx, map[string]any{
			"knowledge_base_id": baseID,
			"to_node_id":        batch,
		})
		if len(nodes) < cleanupBatchSize {
			break
		}
	}
}
