package knowledge

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/shemic/dever/orm"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const (
	vectorIndexBatchSize         = 64
	maxConcurrentEmbedding       = 5
	maxGlobalIndexEmbeddingCalls = 8
	maxVectorNodeTextChars       = 6000
)

var globalIndexEmbeddingSlots = make(chan struct{}, maxGlobalIndexEmbeddingCalls)

type embeddingResult struct {
	node   *agentmodel.KnowledgeNode
	vector []float64
	err    error
}

type vectorNodeEntry struct {
	node *agentmodel.KnowledgeNode
	text string
}

func (s Service) indexDocumentVectors(ctx context.Context, base agentmodel.KnowledgeBase, docID uint64, indexVersion int) error {
	if !knowledgeBaseVectorReady(base) {
		return nil
	}
	if indexVersion <= 0 {
		return fmt.Errorf("文档索引版本无效")
	}
	power, err := activeEmbeddingPower(ctx, base.EmbeddingPowerID)
	if err != nil {
		return err
	}
	docTitle := knowledgeDocTitle(ctx, docID)
	dirPaths := make(map[uint64]string)
	collection := baseCollection(base)
	collectionEnsured := false
	vectorSize := 0
	totalEntries := 0
	indexedCount := 0
	failedCount := 0
	firstFailure := ""
	var afterID uint64
	for {
		if !isKnowledgeDocIndexActive(ctx, docID, indexVersion) {
			return s.cleanupFailedVectorVersion(ctx, base.ID, docID, indexVersion, collection, fmt.Errorf("文档索引任务已失效"))
		}
		nodes := vectorIndexNodePage(ctx, base.ID, docID, afterID)
		if len(nodes) == 0 {
			break
		}
		afterID = nodes[len(nodes)-1].ID
		entries := make([]vectorNodeEntry, 0, len(nodes))
		for _, node := range nodes {
			if !shouldVectorizeNode(node) {
				continue
			}
			dirPath, exists := dirPaths[node.DirID]
			if !exists {
				dirPath = KnowledgeDirPath(ctx, node.DirID)
				dirPaths[node.DirID] = dirPath
			}
			text := vectorNodeText(node, dirPath, docTitle)
			if strings.TrimSpace(text) != "" {
				entries = append(entries, vectorNodeEntry{node: node, text: text})
			}
		}
		totalEntries += len(entries)
		results := s.embedVectorEntries(ctx, power.Key, entries)
		points := make([]qdrantPoint, 0, len(entries))
		records := make([]map[string]any, 0, len(entries))
		for _, res := range results {
			if res.err != nil || len(res.vector) == 0 {
				failedCount++
				if firstFailure == "" {
					if res.err != nil {
						firstFailure = res.err.Error()
					} else {
						firstFailure = "向量结果为空"
					}
				}
				continue
			}
			if collectionEnsured && len(res.vector) != vectorSize {
				failedCount++
				if firstFailure == "" {
					firstFailure = fmt.Sprintf("向量维度不一致: %d != %d", len(res.vector), vectorSize)
				}
				continue
			}
			if !collectionEnsured {
				if err := s.qdrant.ensureCollection(ctx, collection, len(res.vector)); err != nil {
					return s.cleanupFailedVectorVersion(ctx, base.ID, docID, indexVersion, collection, err)
				}
				vectorSize = len(res.vector)
				collectionEnsured = true
			}
			pointID := vectorPointID(res.node.ID, indexVersion)
			points = append(points, qdrantPoint{
				ID:     pointID,
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
				"point_id":          fmt.Sprintf("%d", pointID),
				"content_hash":      res.node.ContentHash,
				"index_version":     indexVersion,
				"status":            1,
				"error_message":     "",
			}))
		}
		if len(points) > 0 {
			if !isKnowledgeDocIndexActive(ctx, docID, indexVersion) {
				return s.cleanupFailedVectorVersion(ctx, base.ID, docID, indexVersion, collection, fmt.Errorf("文档索引任务已失效"))
			}
			if err := s.qdrant.upsertPoints(ctx, collection, points); err != nil {
				return s.cleanupFailedVectorVersion(ctx, base.ID, docID, indexVersion, collection, err)
			}
			if err := saveKnowledgeVectorRecords(ctx, records); err != nil {
				return s.cleanupFailedVectorVersion(ctx, base.ID, docID, indexVersion, collection, err)
			}
			indexedCount += len(points)
		}
		if len(nodes) < vectorIndexBatchSize {
			break
		}
	}
	if !isKnowledgeDocIndexActive(ctx, docID, indexVersion) {
		return s.cleanupFailedVectorVersion(ctx, base.ID, docID, indexVersion, collection, fmt.Errorf("文档索引任务已失效"))
	}
	if totalEntries == 0 {
		return nil
	}
	if indexedCount == 0 {
		return fmt.Errorf("文档向量索引全部失败: %s", firstNonEmpty(firstFailure, "未生成有效向量"))
	}
	if failedCount > 0 {
		return fmt.Errorf("文档向量索引部分失败（%d/%d）: %s", failedCount, totalEntries, firstFailure)
	}
	return nil
}

func (s Service) embedVectorEntries(ctx context.Context, powerKey string, entries []vectorNodeEntry) []embeddingResult {
	results := make([]embeddingResult, len(entries))
	localSlots := make(chan struct{}, maxConcurrentEmbedding)
	var wg sync.WaitGroup
	for index, entry := range entries {
		wg.Add(1)
		go func(idx int, current vectorNodeEntry) {
			defer wg.Done()
			if err := acquireEmbeddingSlot(ctx, localSlots); err != nil {
				results[idx] = embeddingResult{node: current.node, err: err}
				return
			}
			defer releaseEmbeddingSlot(localSlots)
			vector, err := s.embedder.embedWithPower(ctx, powerKey, current.text)
			results[idx] = embeddingResult{node: current.node, vector: vector, err: err}
		}(index, entry)
	}
	wg.Wait()
	return results
}

func acquireEmbeddingSlot(ctx context.Context, localSlots chan struct{}) error {
	select {
	case localSlots <- struct{}{}:
	case <-ctx.Done():
		return ctx.Err()
	}
	select {
	case globalIndexEmbeddingSlots <- struct{}{}:
		return nil
	case <-ctx.Done():
		<-localSlots
		return ctx.Err()
	}
}

func releaseEmbeddingSlot(localSlots chan struct{}) {
	<-globalIndexEmbeddingSlots
	<-localSlots
}

func saveKnowledgeVectorRecords(ctx context.Context, records []map[string]any) error {
	return orm.Transaction(ctx, func(txCtx context.Context) error {
		for _, record := range records {
			if util.ToUint64(agentmodel.NewKnowledgeVectorModel().Insert(txCtx, record)) == 0 {
				return fmt.Errorf("保存向量索引记录失败")
			}
		}
		return nil
	})
}

func (s Service) cleanupFailedVectorVersion(ctx context.Context, baseID uint64, docID uint64, indexVersion int, collection string, cause error) error {
	cleanupCtx, cancel := context.WithTimeout(context.WithoutCancel(ctx), 30*time.Second)
	defer cancel()
	agentmodel.NewKnowledgeVectorModel().Delete(cleanupCtx, map[string]any{
		"doc_id":        docID,
		"index_version": indexVersion,
	})
	if cleanupErr := s.qdrant.deleteByDocVersion(cleanupCtx, collection, baseID, docID, indexVersion); cleanupErr != nil {
		return fmt.Errorf("%v；清理当前向量版本失败: %w", cause, cleanupErr)
	}
	return cause
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
	nodeIDs := make([]uint64, 0, len(hits))
	for _, hit := range hits {
		nodeID := util.ToUint64(hit.Payload["node_id"])
		if nodeID == 0 {
			nodeID = util.ToUint64(hit.ID)
		}
		if nodeID > 0 {
			nodeIDs = append(nodeIDs, nodeID)
		}
	}
	nodeIDs = uniqueUint64s(nodeIDs, 0)
	if len(nodeIDs) == 0 {
		return nil
	}
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"id":                nodeIDs,
		"knowledge_base_id": binding.BaseID,
		"index_status":      agentmodel.KnowledgeIndexStatusSuccess,
		"status":            1,
	}, map[string]any{
		"page":     1,
		"pageSize": len(nodeIDs),
	})
	nodeByID := make(map[uint64]*agentmodel.KnowledgeNode, len(rows))
	for _, node := range filterAvailableKnowledgeNodes(ctx, rows) {
		if node != nil {
			nodeByID[node.ID] = node
		}
	}
	dirPaths := knowledgeDirPaths(ctx, binding.BaseID, knowledgeNodeDirIDs(rows))
	snippets := make([]RetrievedSnippet, 0, len(hits))
	for _, hit := range hits {
		nodeID := util.ToUint64(hit.Payload["node_id"])
		if nodeID == 0 {
			nodeID = util.ToUint64(hit.ID)
		}
		node := nodeByID[nodeID]
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
			DirPath:  dirPaths[node.DirID],
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
	return isConceptGraphEnabled(base.ConceptGraphEnabled) && base.EmbeddingPowerID > 0
}

func vectorIndexNodePage(ctx context.Context, baseID uint64, docID uint64, afterID uint64) []*agentmodel.KnowledgeNode {
	filters := map[string]any{
		"knowledge_base_id": baseID,
		"doc_id":            docID,
		"index_status":      agentmodel.KnowledgeIndexStatusSuccess,
		"status":            1,
	}
	if afterID > 0 {
		filters["id"] = map[string]any{"gt": afterID}
	}
	return agentmodel.NewKnowledgeNodeModel().Select(ctx, filters, map[string]any{
		"field":    "main.id, main.knowledge_base_id, main.dir_id, main.doc_id, main.node_type, main.title, main.summary, main.content, main.plain_text, main.search_text, main.path, main.sort, main.content_hash",
		"order":    "main.id asc",
		"page":     1,
		"pageSize": vectorIndexBatchSize,
	})
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

func vectorNodeText(node *agentmodel.KnowledgeNode, dirPath string, docTitle string) string {
	if node == nil {
		return ""
	}
	return representativeText(searchableNodeText(
		dirPath,
		docTitle,
		node.Path,
		node.Title,
		node.Summary,
		firstNonEmpty(node.PlainText, node.Content),
	), maxVectorNodeTextChars)
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
