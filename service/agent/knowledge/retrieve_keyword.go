package knowledge

import (
	"context"
	"sort"
	"strconv"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const (
	keywordScanPageSize = 250
	keywordScanMaxRows  = 10000
	keywordCacheTTL     = 15 * time.Second
	keywordCacheMaxKeys = 128
	keywordPoolMaxRows  = 240
)

type scoredKeywordNode struct {
	node  *agentmodel.KnowledgeNode
	score float64
}

type keywordCandidateCacheKey struct {
	BaseID uint64
	Limit  int
	Query  string
	DirIDs string
}

var keywordCandidates = newExpiringCache[keywordCandidateCacheKey, []scoredKeywordNode](keywordCacheTTL, keywordCacheMaxKeys)

func (s Service) retrieveKeywordBinding(ctx context.Context, binding agentKnowledgeBinding, query string, dirIDs ...uint64) []RetrievedSnippet {
	if binding.BaseID == 0 || len(queryTerms(query)) == 0 {
		return nil
	}
	limit := binding.RetrieveLimit
	if limit <= 0 {
		limit = binding.Base.RetrieveLimit
	}
	if limit <= 0 {
		limit = defaultRetrieveLimit
	}
	candidateLimit := keywordCandidateLimit(limit, len(dirIDs) > 0, query)
	poolLimit := keywordCandidatePoolLimit(candidateLimit)
	cacheKey := newKeywordCandidateCacheKey(binding.BaseID, query, poolLimit, dirIDs)
	candidates, cached := keywordCandidates.get(cacheKey)
	if cached {
		candidates = append([]scoredKeywordNode(nil), candidates...)
	} else {
		candidates = scanKeywordCandidates(ctx, binding.BaseID, query, poolLimit, dirIDs...)
		if ctx.Err() == nil {
			keywordCandidates.set(cacheKey, append([]scoredKeywordNode(nil), candidates...))
		}
	}
	candidates, complete := hydrateKeywordCandidates(ctx, candidates, query)
	if cached && !complete {
		keywordCandidates.delete(cacheKey)
		candidates = scanKeywordCandidates(ctx, binding.BaseID, query, poolLimit, dirIDs...)
		if ctx.Err() == nil {
			keywordCandidates.set(cacheKey, append([]scoredKeywordNode(nil), candidates...))
		}
		candidates, _ = hydrateKeywordCandidates(ctx, candidates, query)
	}
	candidates = availableKeywordCandidates(ctx, candidates, candidateLimit)

	rows := make([]*agentmodel.KnowledgeNode, 0, len(candidates))
	for _, candidate := range candidates {
		rows = append(rows, candidate.node)
	}
	dirPaths := knowledgeDirPaths(ctx, binding.BaseID, knowledgeNodeDirIDs(rows))
	snippets := make([]RetrievedSnippet, 0, len(candidates))
	for _, candidate := range candidates {
		row := candidate.node
		content := strings.TrimSpace(firstNonEmpty(row.PlainText, row.Content, row.Summary))
		if content == "" {
			continue
		}
		snippets = append(snippets, RetrievedSnippet{
			BaseID:   binding.BaseID,
			BaseName: binding.Base.Name,
			Prompt:   binding.Prompt,
			DirID:    row.DirID,
			DirPath:  dirPaths[row.DirID],
			DocID:    row.DocID,
			NodeID:   row.ID,
			Title:    strings.TrimSpace(firstNonEmpty(row.Path, row.Title)),
			Content:  content,
			Score:    candidate.score,
			Source:   "node",
			SortRank: row.Sort,
			HitCount: row.HitCount,
			Weight:   row.Weight,
		})
	}
	return sortKnowledgeSnippetsByScore(mergeKnowledgeSnippets(snippets))
}

func scanKeywordCandidates(ctx context.Context, baseID uint64, query string, limit int, dirIDs ...uint64) []scoredKeywordNode {
	candidates := make([]scoredKeywordNode, 0, limit)
	var afterID uint64
	scanned := 0
	for {
		if ctx.Err() != nil || scanned >= keywordScanMaxRows {
			break
		}
		rows := keywordNodePage(ctx, baseID, query, afterID, dirIDs...)
		if len(rows) == 0 {
			break
		}
		scanned += len(rows)
		afterID = rows[len(rows)-1].ID
		for _, row := range rows {
			if row == nil {
				continue
			}
			score := keywordNodeScore(row, query)
			if score <= 0 {
				continue
			}
			candidates = append(candidates, scoredKeywordNode{node: row, score: score})
		}
		candidates = topKeywordNodes(candidates, limit)
		if len(rows) < keywordScanPageSize {
			break
		}
	}
	return candidates
}

func keywordNodePage(ctx context.Context, baseID uint64, query string, afterID uint64, dirIDs ...uint64) []*agentmodel.KnowledgeNode {
	filters := keywordNodeFilters(baseID, query, dirIDs...)
	if afterID > 0 {
		filters["id"] = map[string]any{"gt": afterID}
	}
	return agentmodel.NewKnowledgeNodeModel().Select(ctx, filters, map[string]any{
		"field":    "main.id, main.knowledge_base_id, main.dir_id, main.doc_id, main.title, main.summary, main.search_text, main.keywords, main.path, main.sort, main.node_type, main.metadata, main.index_status, main.hit_count, main.weight, main.status",
		"order":    "main.id asc",
		"page":     1,
		"pageSize": keywordScanPageSize,
	})
}

func keywordCandidatePoolLimit(limit int) int {
	poolLimit := limit * 3
	if poolLimit < limit+16 {
		poolLimit = limit + 16
	}
	if poolLimit > keywordPoolMaxRows {
		return keywordPoolMaxRows
	}
	return poolLimit
}

func newKeywordCandidateCacheKey(baseID uint64, query string, limit int, dirIDs []uint64) keywordCandidateCacheKey {
	ids := uniqueUint64s(dirIDs, 0)
	sort.Slice(ids, func(left int, right int) bool { return ids[left] < ids[right] })
	idParts := make([]string, 0, len(ids))
	for _, id := range ids {
		idParts = append(idParts, strconv.FormatUint(id, 10))
	}
	return keywordCandidateCacheKey{
		BaseID: baseID,
		Limit:  limit,
		Query:  strings.ToLower(strings.Join(strings.Fields(query), " ")),
		DirIDs: strings.Join(idParts, ","),
	}
}

func hydrateKeywordCandidates(ctx context.Context, candidates []scoredKeywordNode, query string) ([]scoredKeywordNode, bool) {
	if len(candidates) == 0 {
		return candidates, true
	}
	ids := make([]uint64, 0, len(candidates))
	for _, candidate := range candidates {
		if candidate.node != nil && candidate.node.ID > 0 {
			ids = append(ids, candidate.node.ID)
		}
	}
	if len(ids) == 0 {
		return nil, false
	}
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"id":           ids,
		"index_status": agentmodel.KnowledgeIndexStatusSuccess,
		"status":       1,
	}, map[string]any{
		"field":    "main.id, main.content, main.plain_text, main.hit_count, main.weight",
		"page":     1,
		"pageSize": len(ids),
	})
	contentByID := make(map[uint64]*agentmodel.KnowledgeNode, len(rows))
	for _, row := range rows {
		if row != nil {
			contentByID[row.ID] = row
		}
	}
	result := make([]scoredKeywordNode, 0, len(candidates))
	for _, candidate := range candidates {
		if candidate.node == nil {
			continue
		}
		content := contentByID[candidate.node.ID]
		if content == nil {
			continue
		}
		node := *candidate.node
		node.Content = content.Content
		node.PlainText = content.PlainText
		node.HitCount = content.HitCount
		node.Weight = content.Weight
		candidate.node = &node
		candidate.score = keywordNodeScore(&node, query)
		result = append(result, candidate)
	}
	return result, len(result) == len(candidates)
}

func availableKeywordCandidates(ctx context.Context, candidates []scoredKeywordNode, limit int) []scoredKeywordNode {
	rows := make([]*agentmodel.KnowledgeNode, 0, len(candidates))
	scores := make(map[uint64]float64, len(candidates))
	for _, candidate := range candidates {
		if candidate.node == nil {
			continue
		}
		rows = append(rows, candidate.node)
		scores[candidate.node.ID] = candidate.score
	}
	available := filterAvailableKnowledgeNodes(ctx, rows)
	result := make([]scoredKeywordNode, 0, len(available))
	for _, row := range available {
		if row != nil {
			result = append(result, scoredKeywordNode{node: row, score: scores[row.ID]})
		}
	}
	return topKeywordNodes(result, limit)
}

func topKeywordNodes(candidates []scoredKeywordNode, limit int) []scoredKeywordNode {
	sort.SliceStable(candidates, func(left int, right int) bool {
		if candidates[left].score != candidates[right].score {
			return candidates[left].score > candidates[right].score
		}
		if candidates[left].node.Weight != candidates[right].node.Weight {
			return candidates[left].node.Weight > candidates[right].node.Weight
		}
		if candidates[left].node.HitCount != candidates[right].node.HitCount {
			return candidates[left].node.HitCount > candidates[right].node.HitCount
		}
		return candidates[left].node.ID < candidates[right].node.ID
	})
	if limit > 0 && len(candidates) > limit {
		return candidates[:limit]
	}
	return candidates
}

func needsRetrievalPlan(binding agentKnowledgeBinding, snippets []RetrievedSnippet) bool {
	if len(snippets) == 0 {
		return true
	}
	threshold := normalizeOverrideScoreThreshold(binding.ScoreThreshold, binding.Base.ScoreThreshold)
	for _, snippet := range snippets {
		if snippet.Score >= threshold {
			return false
		}
	}
	return true
}
