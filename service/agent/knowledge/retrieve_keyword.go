package knowledge

import (
	"context"
	"sort"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const (
	keywordScanPageSize = 250
	keywordScanMaxRows  = 10000
)

type scoredKeywordNode struct {
	node  *agentmodel.KnowledgeNode
	score float64
}

func (s Service) retrieveKeywordBinding(ctx context.Context, binding agentKnowledgeBinding, query string, dirIDs ...uint64) []RetrievedSnippet {
	limit := binding.RetrieveLimit
	if limit <= 0 {
		limit = binding.Base.RetrieveLimit
	}
	if limit <= 0 {
		limit = defaultRetrieveLimit
	}
	candidateLimit := keywordCandidateLimit(limit, len(dirIDs) > 0, query)
	candidates := make([]scoredKeywordNode, 0, candidateLimit)
	var afterID uint64
	scanned := 0
	for {
		if ctx.Err() != nil || scanned >= keywordScanMaxRows {
			break
		}
		rows := keywordNodePage(ctx, binding.BaseID, query, afterID, dirIDs...)
		if len(rows) == 0 {
			break
		}
		scanned += len(rows)
		afterID = rows[len(rows)-1].ID
		for _, row := range filterAvailableKnowledgeNodes(ctx, rows) {
			if row == nil {
				continue
			}
			score := keywordNodeScore(row, query)
			if score <= 0 {
				continue
			}
			candidates = append(candidates, scoredKeywordNode{node: row, score: score})
		}
		candidates = topKeywordNodes(candidates, candidateLimit)
		if len(rows) < keywordScanPageSize {
			break
		}
	}
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

func keywordNodePage(ctx context.Context, baseID uint64, query string, afterID uint64, dirIDs ...uint64) []*agentmodel.KnowledgeNode {
	filters := keywordNodeFilters(baseID, query, dirIDs...)
	if afterID > 0 {
		filters["id"] = map[string]any{"gt": afterID}
	}
	return agentmodel.NewKnowledgeNodeModel().Select(ctx, filters, map[string]any{
		"field":    "main.id, main.knowledge_base_id, main.dir_id, main.doc_id, main.title, main.summary, main.content, main.plain_text, main.search_text, main.keywords, main.path, main.sort, main.node_type, main.metadata, main.index_status, main.hit_count, main.weight, main.status",
		"order":    "main.id asc",
		"page":     1,
		"pageSize": keywordScanPageSize,
	})
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
