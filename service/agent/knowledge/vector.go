package knowledge

import (
	"context"
	"fmt"
	"strings"
	"sync"

	"github.com/shemic/dever/orm"
	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
)

const (
	maxVectorIndexNodes    = 80
	maxConcurrentEmbedding = 5
)

type embeddingResult struct {
	node   *agentmodel.KnowledgeNode
	vector []float64
	err    error
}

func (s Service) indexDocumentVectors(ctx context.Context, base agentmodel.KnowledgeBase, docID uint64) error {
	if !knowledgeBaseVectorReady(base) {
		return nil
	}
	nodes := vectorIndexNodes(ctx, base.ID, docID)
	if len(nodes) == 0 {
		return nil
	}
	// Collect embeddable nodes with their text
	type nodeText struct {
		node *agentmodel.KnowledgeNode
		text string
	}
	entries := make([]nodeText, 0, len(nodes))
	for _, node := range nodes {
		text := vectorNodeText(ctx, node)
		if strings.TrimSpace(text) == "" {
			continue
		}
		entries = append(entries, nodeText{node: node, text: text})
	}
	if len(entries) == 0 {
		return nil
	}
	indexVersion := knowledgeDocIndexVersion(ctx, docID)
	// Concurrent embedding with semaphore
	sem := make(chan struct{}, maxConcurrentEmbedding)
	results := make([]embeddingResult, len(entries))
	var wg sync.WaitGroup
	for i, entry := range entries {
		wg.Add(1)
		sem <- struct{}{}
		go func(idx int, nt nodeText) {
			defer wg.Done()
			defer func() { <-sem }()
			vector, err := s.embedder.embed(ctx, base.EmbeddingPowerID, nt.text)
			results[idx] = embeddingResult{node: nt.node, vector: vector, err: err}
		}(i, entry)
	}
	wg.Wait()
	collection := baseCollection(base)
	points := make([]qdrantPoint, 0, len(entries))
	records := make([]map[string]any, 0, len(entries))
	collectionEnsured := false
	for _, res := range results {
		if res.err != nil || len(res.vector) == 0 {
			continue
		}
		if !collectionEnsured {
			if err := s.qdrant.ensureCollection(ctx, collection, len(res.vector)); err != nil {
				return err
			}
			collectionEnsured = true
		}
		points = append(points, qdrantPoint{
			ID:     pointID(res.node.ID),
			Vector: res.vector,
			Payload: map[string]any{
				"knowledge_base_id": base.ID,
				"doc_id":            res.node.DocID,
				"node_id":           res.node.ID,
				"node_type":         strings.TrimSpace(res.node.NodeType),
				"path":              strings.TrimSpace(res.node.Path),
				"title":             strings.TrimSpace(res.node.Title),
				"index_version":     indexVersion,
				"status":            1,
			},
		})
		records = append(records, withCreatedAt(map[string]any{
			"knowledge_base_id": base.ID,
			"doc_id":            res.node.DocID,
			"node_id":           res.node.ID,
			"collection":        collection,
			"point_id":          fmt.Sprintf("%d", pointID(res.node.ID)),
			"content_hash":      res.node.ContentHash,
			"index_version":     indexVersion,
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
	_ = orm.Transaction(ctx, func(txCtx context.Context) error {
		for _, record := range records {
			agentmodel.NewKnowledgeVectorModel().Insert(txCtx, record)
		}
		return nil
	})
	return nil
}

func (s Service) retrieveVectorBinding(ctx context.Context, binding agentKnowledgeBinding, query string) []RetrievedSnippet {
	if binding.Base.EmbeddingPowerID == 0 || strings.TrimSpace(query) == "" {
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
		node := availableKnowledgeNode(ctx, nodeID)
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
			HitCount: node.HitCount,
			Weight:   node.Weight,
		})
	}
	return snippets
}

func knowledgeBaseVectorReady(base agentmodel.KnowledgeBase) bool {
	return base.EmbeddingPowerID > 0
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
		agentmodel.KnowledgeNodeTypeCode,
		agentmodel.KnowledgeNodeTypeQA:
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

func knowledgeDocIndexVersion(ctx context.Context, docID uint64) int {
	if docID == 0 {
		return 1
	}
	doc := agentmodel.NewKnowledgeDocModel().Find(ctx, map[string]any{"id": docID})
	if doc == nil || doc.IndexVersion <= 0 {
		return 1
	}
	return doc.IndexVersion
}
