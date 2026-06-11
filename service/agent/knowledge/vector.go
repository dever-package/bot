package knowledge

import (
	"context"
	"fmt"
	"strings"

	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
)

const maxVectorIndexNodes = 80

func (s Service) indexDocumentVectors(ctx context.Context, base agentmodel.KnowledgeBase, docID uint64) error {
	if !knowledgeBaseVectorReady(base) {
		return nil
	}
	nodes := vectorIndexNodes(ctx, base.ID, docID)
	if len(nodes) == 0 {
		return nil
	}
	collection := baseCollection(base)
	points := make([]qdrantPoint, 0, len(nodes))
	records := make([]map[string]any, 0, len(nodes))
	for _, node := range nodes {
		text := vectorNodeText(ctx, node)
		if strings.TrimSpace(text) == "" {
			continue
		}
		vector, err := s.embedder.embed(ctx, base.EmbeddingPowerID, text)
		if err != nil {
			return err
		}
		if err := s.qdrant.ensureCollection(ctx, collection, len(vector)); err != nil {
			return err
		}
		points = append(points, qdrantPoint{
			ID:     pointID(node.ID),
			Vector: vector,
			Payload: map[string]any{
				"knowledge_base_id": base.ID,
				"doc_id":            node.DocID,
				"node_id":           node.ID,
				"node_type":         strings.TrimSpace(node.NodeType),
				"path":              strings.TrimSpace(node.Path),
				"title":             strings.TrimSpace(node.Title),
				"status":            1,
			},
		})
		records = append(records, withCreatedAt(map[string]any{
			"knowledge_base_id": base.ID,
			"doc_id":            node.DocID,
			"node_id":           node.ID,
			"collection":        collection,
			"point_id":          fmt.Sprintf("%d", pointID(node.ID)),
			"content_hash":      node.ContentHash,
			"status":            1,
			"error_message":     "",
		}))
	}
	if len(points) == 0 {
		return nil
	}
	if err := s.qdrant.upsertPoints(ctx, collection, points); err != nil {
		return err
	}
	for _, record := range records {
		agentmodel.NewKnowledgeVectorModel().Insert(ctx, record)
	}
	return nil
}

func (s Service) retrieveVectorBinding(ctx context.Context, binding agentKnowledgeBinding, query string) []RetrievedSnippet {
	if !binding.Base.VectorEnabled || binding.Base.EmbeddingPowerID == 0 || strings.TrimSpace(query) == "" {
		return nil
	}
	vector, err := s.embedder.embed(ctx, binding.Base.EmbeddingPowerID, query)
	if err != nil {
		return nil
	}
	limit := binding.RetrieveLimit
	if limit <= 0 {
		limit = binding.Base.RetrieveLimit
	}
	if limit <= 0 {
		limit = defaultRetrieveLimit
	}
	threshold := normalizeOverrideScoreThreshold(binding.ScoreThreshold, binding.Base.ScoreThreshold)
	hits, err := s.qdrant.search(ctx, binding.Base.Collection, vector, []uint64{binding.BaseID}, keywordCandidateLimit(limit, false, query), threshold)
	if err != nil {
		return nil
	}
	snippets := make([]RetrievedSnippet, 0, len(hits))
	for _, hit := range hits {
		nodeID := util.ToUint64(hit.Payload["node_id"])
		if nodeID == 0 {
			nodeID = util.ToUint64(hit.ID)
		}
		node := agentmodel.NewKnowledgeNodeModel().Find(ctx, map[string]any{"id": nodeID, "status": 1})
		if node == nil {
			continue
		}
		content := strings.TrimSpace(firstNonEmpty(node.PlainText, node.Content, node.Summary))
		if content == "" {
			continue
		}
		snippets = append(snippets, RetrievedSnippet{
			BaseID:   binding.BaseID,
			BaseName: binding.Base.Name,
			Prompt:   binding.Prompt,
			DirID:    node.DirID,
			DirPath:  KnowledgeDirPath(ctx, node.DirID),
			DocID:    node.DocID,
			NodeID:   node.ID,
			Title:    strings.TrimSpace(firstNonEmpty(node.Path, node.Title)),
			Content:  content,
			Score:    hit.Score,
			Source:   "node_vector",
			SortRank: node.Sort,
		})
	}
	return snippets
}

func knowledgeBaseVectorReady(base agentmodel.KnowledgeBase) bool {
	return isVectorEnabled(base.VectorEnabled) && base.EmbeddingPowerID > 0
}

func vectorIndexNodes(ctx context.Context, baseID uint64, docID uint64) []*agentmodel.KnowledgeNode {
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"doc_id":            docID,
		"index_status":      agentmodel.KnowledgeIndexStatusSuccess,
		"status":            1,
	}, map[string]any{
		"field":    "main.id, main.knowledge_base_id, main.dir_id, main.doc_id, main.node_type, main.title, main.summary, main.content, main.plain_text, main.search_text, main.path, main.sort, main.content_hash",
		"order":    "main.depth asc, main.sort asc, main.id asc",
		"page":     1,
		"pageSize": maxVectorIndexNodes,
	})
	result := make([]*agentmodel.KnowledgeNode, 0, len(rows))
	for _, row := range rows {
		if row == nil || !shouldVectorizeNode(row) {
			continue
		}
		result = append(result, row)
	}
	return result
}

func shouldVectorizeNode(node *agentmodel.KnowledgeNode) bool {
	if node == nil {
		return false
	}
	text := strings.TrimSpace(firstNonEmpty(node.PlainText, node.Content, node.Summary))
	if textLength(text) < 20 && node.NodeType != agentmodel.KnowledgeNodeTypeDoc {
		return false
	}
	switch node.NodeType {
	case agentmodel.KnowledgeNodeTypeDoc,
		agentmodel.KnowledgeNodeTypeHeading,
		agentmodel.KnowledgeNodeTypePage,
		agentmodel.KnowledgeNodeTypeParagraph,
		agentmodel.KnowledgeNodeTypeTable,
		agentmodel.KnowledgeNodeTypeCode:
		return true
	default:
		return false
	}
}

func vectorNodeText(ctx context.Context, node *agentmodel.KnowledgeNode) string {
	if node == nil {
		return ""
	}
	return searchableNodeText(
		KnowledgeDirPath(ctx, node.DirID),
		knowledgeDocTitle(ctx, node.DocID),
		node.Path,
		node.Title,
		node.Summary,
		firstNonEmpty(node.PlainText, node.Content),
	)
}

func knowledgeDocTitle(ctx context.Context, docID uint64) string {
	if docID == 0 {
		return ""
	}
	doc := agentmodel.NewKnowledgeDocModel().Find(ctx, map[string]any{"id": docID})
	if doc == nil {
		return ""
	}
	return strings.TrimSpace(doc.Title)
}
