package knowledge

import (
	"context"
	"fmt"
	"sort"
	"strings"
	"time"

	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
)

type Service struct {
	embedder embeddingService
	qdrant   qdrantClient
}

func NewService() Service {
	return Service{
		embedder: newEmbeddingService(),
		qdrant:   newQdrantClient(),
	}
}

func baseCollection(base agentmodel.KnowledgeBase) string {
	return knowledgeCollectionName(base.CateID)
}

func (s Service) IndexDocument(ctx context.Context, docID uint64) (IndexResult, error) {
	startedAt := time.Now()
	doc := agentmodel.NewKnowledgeDocModel().Find(ctx, map[string]any{"id": docID})
	if doc == nil {
		return IndexResult{}, fmt.Errorf("知识文档不存在")
	}
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": doc.KnowledgeBaseID})
	if base == nil {
		return IndexResult{}, fmt.Errorf("知识库不存在")
	}
	if err := s.prepareDocumentContent(ctx, doc); err != nil {
		s.markDocFailed(ctx, doc.ID, doc.KnowledgeBaseID, err)
		return IndexResult{BaseID: doc.KnowledgeBaseID, DocID: doc.ID, Error: err.Error(), StartedAt: startedAt, FinishedAt: time.Now()}, err
	}
	result := IndexResult{BaseID: base.ID, DocID: doc.ID, StartedAt: startedAt}
	dirPath := KnowledgeDirPath(ctx, doc.DirID)
	indexContent := normalizeIndexContent(doc.Content)
	chunks := splitContent(indexContent, base.ChunkSize, base.ChunkOverlap)
	if len(chunks) == 0 {
		err := fmt.Errorf("文档内容为空，无法索引")
		s.markDocFailed(ctx, doc.ID, base.ID, err)
		result.Error = err.Error()
		result.FinishedAt = time.Now()
		return result, err
	}

	docModel := agentmodel.NewKnowledgeDocModel()
	baseModel := agentmodel.NewKnowledgeBaseModel()
	chunkModel := agentmodel.NewKnowledgeChunkModel()
	docModel.Update(ctx, map[string]any{"id": doc.ID}, map[string]any{
		"index_status":  agentmodel.KnowledgeIndexStatusRunning,
		"error_message": "",
	})
	baseModel.Update(ctx, map[string]any{"id": base.ID}, map[string]any{
		"index_status":  agentmodel.KnowledgeIndexStatusRunning,
		"error_message": "",
	})
	if isVectorEnabled(base.VectorEnabled) {
		_ = s.qdrant.deleteByDoc(ctx, baseCollection(*base), base.ID, doc.ID)
	}
	chunkModel.Delete(ctx, map[string]any{"doc_id": doc.ID})

	records := make([]chunkRecord, 0, len(chunks))
	for index, content := range chunks {
		chunkID := util.ToUint64(chunkModel.Insert(ctx, withCreatedAt(map[string]any{
			"knowledge_base_id": base.ID,
			"dir_id":            doc.DirID,
			"dir_path":          dirPath,
			"doc_id":            doc.ID,
			"chunk_index":       index + 1,
			"title":             doc.Title,
			"content":           content,
			"content_hash":      contentHash(content),
			"index_status":      agentmodel.KnowledgeIndexStatusPending,
			"status":            1,
		})))
		if chunkID == 0 {
			continue
		}
		records = append(records, chunkRecord{
			ID:        chunkID,
			DocID:     doc.ID,
			BaseID:    base.ID,
			DirID:     doc.DirID,
			DirPath:   dirPath,
			Title:     doc.Title,
			Content:   content,
			EmbedText: searchableChunkText(dirPath, doc.Title, content),
			SortRank:  index + 1,
		})
	}
	result.ChunkCount = len(records)
	if len(records) == 0 {
		err := fmt.Errorf("创建知识分段失败")
		s.markDocFailed(ctx, doc.ID, base.ID, err)
		result.Error = err.Error()
		result.FinishedAt = time.Now()
		return result, err
	}

	if err := s.indexChunks(ctx, *base, records); err != nil {
		s.markDocFailed(ctx, doc.ID, base.ID, err)
		result.Error = err.Error()
		result.FinishedAt = time.Now()
		return result, err
	}

	docModel.Update(ctx, map[string]any{"id": doc.ID}, map[string]any{
		"chunk_count":   len(records),
		"index_status":  agentmodel.KnowledgeIndexStatusSuccess,
		"error_message": "",
	})
	s.refreshBaseStats(ctx, base.ID, agentmodel.KnowledgeIndexStatusSuccess, "")
	result.Indexed = len(records)
	result.FinishedAt = time.Now()
	return result, nil
}

func (s Service) RebuildBase(ctx context.Context, baseID uint64) (IndexResult, error) {
	docs := agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	})
	if len(docs) == 0 {
		s.refreshBaseStats(ctx, baseID, agentmodel.KnowledgeIndexStatusSuccess, "")
		now := time.Now()
		return IndexResult{BaseID: baseID, StartedAt: now, FinishedAt: now}, nil
	}
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID})
	if base != nil && isVectorEnabled(base.VectorEnabled) {
		_ = s.qdrant.deleteByBase(ctx, baseCollection(*base), baseID)
	}
	total := IndexResult{BaseID: baseID, StartedAt: time.Now()}
	for _, doc := range docs {
		if doc == nil {
			continue
		}
		result, err := s.IndexDocument(ctx, doc.ID)
		total.ChunkCount += result.ChunkCount
		total.Indexed += result.Indexed
		total.Failed += result.Failed
		if err != nil && total.Error == "" {
			total.Error = err.Error()
		}
	}
	total.FinishedAt = time.Now()
	if total.Error != "" {
		return total, fmt.Errorf("%s", total.Error)
	}
	return total, nil
}

func (s Service) indexChunks(ctx context.Context, base agentmodel.KnowledgeBase, chunks []chunkRecord) error {
	if !isVectorEnabled(base.VectorEnabled) {
		markChunksSuccess(ctx, chunks)
		return nil
	}
	points := make([]qdrantPoint, 0, len(chunks))
	indexedChunks := make([]chunkRecord, 0, len(chunks))
	for _, chunk := range chunks {
		vectorText := strings.TrimSpace(chunk.EmbedText)
		if vectorText == "" {
			vectorText = chunk.Content
		}
		vector, err := s.embedder.embed(ctx, base.EmbeddingPowerID, vectorText)
		if err != nil {
			agentmodel.NewKnowledgeChunkModel().Update(ctx, map[string]any{"id": chunk.ID}, map[string]any{
				"index_status":  agentmodel.KnowledgeIndexStatusFailed,
				"error_message": err.Error(),
			})
			return err
		}
		if err := s.qdrant.ensureCollection(ctx, baseCollection(base), len(vector)); err != nil {
			return err
		}
		point := pointID(chunk.ID)
		points = append(points, qdrantPoint{
			ID:      point,
			Vector:  vector,
			Payload: chunkPayload(base, chunk),
		})
		chunk.PointID = point
		indexedChunks = append(indexedChunks, chunk)
	}
	if err := s.qdrant.upsertPoints(ctx, baseCollection(base), points); err != nil {
		markChunksFailed(ctx, indexedChunks, err)
		return err
	}
	for _, chunk := range indexedChunks {
		agentmodel.NewKnowledgeChunkModel().Update(ctx, map[string]any{"id": chunk.ID}, map[string]any{
			"point_id":      fmt.Sprintf("%d", chunk.PointID),
			"index_status":  agentmodel.KnowledgeIndexStatusSuccess,
			"error_message": "",
		})
	}
	return nil
}

func markChunksSuccess(ctx context.Context, chunks []chunkRecord) {
	for _, chunk := range chunks {
		agentmodel.NewKnowledgeChunkModel().Update(ctx, map[string]any{"id": chunk.ID}, map[string]any{
			"point_id":      "",
			"index_status":  agentmodel.KnowledgeIndexStatusSuccess,
			"error_message": "",
		})
	}
}

func markChunksFailed(ctx context.Context, chunks []chunkRecord, err error) {
	message := ""
	if err != nil {
		message = err.Error()
	}
	for _, chunk := range chunks {
		agentmodel.NewKnowledgeChunkModel().Update(ctx, map[string]any{"id": chunk.ID}, map[string]any{
			"index_status":  agentmodel.KnowledgeIndexStatusFailed,
			"error_message": message,
		})
	}
}

func chunkPayload(base agentmodel.KnowledgeBase, chunk chunkRecord) map[string]any {
	return map[string]any{
		"knowledge_base_id": base.ID,
		"cate_id":           base.CateID,
		"dir_id":            chunk.DirID,
		"dir_path":          chunk.DirPath,
		"doc_id":            chunk.DocID,
		"chunk_id":          chunk.ID,
		"chunk_index":       chunk.SortRank,
		"title":             chunk.Title,
		"content":           chunk.Content,
		"status":            1,
	}
}

func (s Service) markDocFailed(ctx context.Context, docID uint64, baseID uint64, err error) {
	message := ""
	if err != nil {
		message = err.Error()
	}
	agentmodel.NewKnowledgeDocModel().Update(ctx, map[string]any{"id": docID}, map[string]any{
		"index_status":  agentmodel.KnowledgeIndexStatusFailed,
		"error_message": message,
	})
	s.refreshBaseStats(ctx, baseID, agentmodel.KnowledgeIndexStatusFailed, message)
}

func (s Service) refreshBaseStats(ctx context.Context, baseID uint64, status string, message string) {
	docCount := agentmodel.NewKnowledgeDocModel().Count(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	})
	chunkCount := agentmodel.NewKnowledgeChunkModel().Count(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	})
	agentmodel.NewKnowledgeBaseModel().Update(ctx, map[string]any{"id": baseID}, map[string]any{
		"doc_count":     docCount,
		"chunk_count":   chunkCount,
		"index_status":  normalizeIndexStatus(status),
		"error_message": strings.TrimSpace(message),
	})
}

func (s Service) Retrieve(ctx context.Context, req RetrieveRequest) (RetrieveResult, error) {
	query := strings.TrimSpace(req.Query)
	if req.AgentID == 0 || query == "" {
		return RetrieveResult{}, nil
	}
	bindings := s.activeBindings(ctx, req.AgentID)
	if len(bindings) == 0 {
		return RetrieveResult{}, nil
	}

	result := RetrieveResult{}
	for _, binding := range bindings {
		snippets, matches, err := s.retrieveBinding(ctx, binding, query)
		if err != nil {
			return result, err
		}
		result.Matches = append(result.Matches, matches...)
		result.Snippets = append(result.Snippets, snippets...)
	}
	sort.SliceStable(result.Snippets, func(i, j int) bool {
		return result.Snippets[i].Score > result.Snippets[j].Score
	})
	result.Snippets = limitContext(result.Snippets, bindings)
	return result, nil
}

func (s Service) retrieveBinding(ctx context.Context, binding agentKnowledgeBinding, query string) ([]RetrievedSnippet, []map[string]any, error) {
	candidateDirs := candidateKnowledgeDirs(ctx, binding.BaseID, query)
	if binding.Base.VectorEnabled {
		snippets, matches, err := s.retrieveVectorBinding(ctx, binding, query)
		if err != nil {
			return nil, nil, err
		}
		if len(candidateDirs) > 0 {
			snippets = append(snippets, s.retrieveKeywordBinding(ctx, binding, query, candidateDirIDs(candidateDirs)...)...)
		}
		return rankKnowledgeSnippets(mergeKnowledgeSnippets(snippets), query, candidateDirs), matches, nil
	}
	snippets := s.retrieveKeywordBinding(ctx, binding, query)
	if len(candidateDirs) > 0 {
		snippets = append(snippets, s.retrieveKeywordBinding(ctx, binding, query, candidateDirIDs(candidateDirs)...)...)
	}
	return rankKnowledgeSnippets(mergeKnowledgeSnippets(snippets), query, candidateDirs), nil, nil
}

func (s Service) retrieveVectorBinding(ctx context.Context, binding agentKnowledgeBinding, query string) ([]RetrievedSnippet, []map[string]any, error) {
	vector, err := s.embedder.embed(ctx, binding.Base.EmbeddingPowerID, query)
	if err != nil {
		return nil, nil, err
	}
	limit := binding.RetrieveLimit
	if limit <= 0 {
		limit = binding.Base.RetrieveLimit
	}
	threshold := normalizeOverrideScoreThreshold(binding.ScoreThreshold, binding.Base.ScoreThreshold)
	hits, err := s.qdrant.search(ctx, binding.Base.Collection, vector, []uint64{binding.BaseID}, limit, threshold)
	if err != nil {
		return nil, nil, err
	}
	return snippetsFromHits(binding, hits), hitMaps(binding, hits), nil
}

func (s Service) retrieveKeywordBinding(ctx context.Context, binding agentKnowledgeBinding, query string, dirIDs ...uint64) []RetrievedSnippet {
	limit := binding.RetrieveLimit
	if limit <= 0 {
		limit = binding.Base.RetrieveLimit
	}
	if limit <= 0 {
		limit = defaultRetrieveLimit
	}
	rows := agentmodel.NewKnowledgeChunkModel().Select(ctx, keywordChunkFilters(binding.BaseID, query, dirIDs...), map[string]any{
		"field":    "main.id, main.dir_id, main.dir_path, main.doc_id, main.chunk_index, main.title, main.content",
		"order":    "main.id desc",
		"page":     1,
		"pageSize": focusedRetrieveLimit(limit, len(dirIDs) > 0),
	})
	snippets := make([]RetrievedSnippet, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		content := strings.TrimSpace(row.Content)
		if content == "" {
			continue
		}
		snippets = append(snippets, RetrievedSnippet{
			BaseID:   binding.BaseID,
			BaseName: binding.Base.Name,
			Prompt:   binding.Prompt,
			DirID:    row.DirID,
			DirPath:  strings.TrimSpace(row.DirPath),
			DocID:    row.DocID,
			ChunkID:  row.ID,
			Title:    strings.TrimSpace(row.Title),
			Content:  content,
			Score:    0,
			Source:   "pgsql",
			SortRank: row.ChunkIndex,
		})
	}
	return snippets
}

func (s Service) activeBindings(ctx context.Context, agentID uint64) []agentKnowledgeBinding {
	rows := agentmodel.NewAgentKnowledgeBaseModel().Select(ctx, map[string]any{
		"agent_id": agentID,
		"status":   1,
	})
	result := make([]agentKnowledgeBinding, 0, len(rows))
	for _, row := range rows {
		if row == nil || row.KnowledgeBaseID == 0 {
			continue
		}
		base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{
			"id":     row.KnowledgeBaseID,
			"status": 1,
		})
		if base == nil {
			continue
		}
		result = append(result, agentKnowledgeBinding{
			ID:             row.ID,
			AgentID:        row.AgentID,
			BaseID:         row.KnowledgeBaseID,
			Prompt:         row.Prompt,
			RetrieveLimit:  row.RetrieveLimit,
			ScoreThreshold: row.ScoreThreshold,
			Sort:           row.Sort,
			Base: knowledgeBaseConfig{
				ID:               base.ID,
				CateID:           base.CateID,
				Name:             base.Name,
				Collection:       baseCollection(*base),
				VectorEnabled:    isVectorEnabled(base.VectorEnabled),
				EmbeddingPowerID: base.EmbeddingPowerID,
				RetrieveLimit:    normalizeRetrieveLimit(base.RetrieveLimit),
				ScoreThreshold:   normalizeScoreThreshold(base.ScoreThreshold),
				MaxContextChars:  normalizeMaxContextChars(base.MaxContextChars),
				Status:           base.Status,
			},
		})
	}
	sort.SliceStable(result, func(i, j int) bool {
		return result[i].Sort < result[j].Sort
	})
	return result
}

func snippetsFromHits(binding agentKnowledgeBinding, hits []searchHit) []RetrievedSnippet {
	snippets := make([]RetrievedSnippet, 0, len(hits))
	for _, hit := range hits {
		content := trimText(hit.Payload["content"])
		if content == "" {
			continue
		}
		snippets = append(snippets, RetrievedSnippet{
			BaseID:   binding.BaseID,
			BaseName: binding.Base.Name,
			Prompt:   binding.Prompt,
			DirID:    uint64Value(hit.Payload["dir_id"]),
			DirPath:  trimText(hit.Payload["dir_path"]),
			DocID:    uint64Value(hit.Payload["doc_id"]),
			ChunkID:  uint64Value(hit.Payload["chunk_id"]),
			Title:    trimText(hit.Payload["title"]),
			Content:  content,
			Score:    hit.Score,
			Source:   "vector",
			SortRank: util.ToIntDefault(hit.Payload["chunk_index"], 0),
		})
	}
	return snippets
}

func hitMaps(binding agentKnowledgeBinding, hits []searchHit) []map[string]any {
	rows := make([]map[string]any, 0, len(hits))
	for _, hit := range hits {
		rows = append(rows, map[string]any{
			"knowledge_base_id": binding.BaseID,
			"knowledge_base":    binding.Base.Name,
			"score":             hit.Score,
			"payload":           hit.Payload,
		})
	}
	return rows
}

func limitContext(snippets []RetrievedSnippet, bindings []agentKnowledgeBinding) []RetrievedSnippet {
	if len(snippets) == 0 {
		return snippets
	}
	limit := defaultMaxContextChars
	for _, binding := range bindings {
		if binding.Base.MaxContextChars > limit {
			limit = binding.Base.MaxContextChars
		}
	}
	total := 0
	result := make([]RetrievedSnippet, 0, len(snippets))
	for _, snippet := range snippets {
		length := textLength(snippet.Content)
		if total+length > limit {
			remaining := limit - total
			if remaining <= 0 {
				break
			}
			snippet.Content = truncateText(snippet.Content, remaining)
			length = textLength(snippet.Content)
		}
		result = append(result, snippet)
		total += length
	}
	return result
}
