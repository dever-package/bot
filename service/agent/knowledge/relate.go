package knowledge

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"strings"

	dlog "github.com/shemic/dever/log"

	agentmodel "my/package/bot/model/agent"
)

const (
	minKeywordSimilarity = 0.3
	maxAutoRelations     = 100
	maxRelationDocs      = 50
	cooccurrenceMinCount = 2
	cooccurrenceMinRate  = 0.3
	maxCooccurrenceNodes = 30
	maxCooccurrenceLogs  = 200
)

// autoDiscoverRelations discovers implicit relations across the knowledge base.
// Runs as goroutine after document indexing.
func (s Service) autoDiscoverRelations(ctx context.Context, base agentmodel.KnowledgeBase) {
	if base.ID == 0 || base.Status != 1 {
		return
	}
	defer func() {
		if recovered := recover(); recovered != nil {
			dlog.ErrorFields("knowledge_auto_discover_relations", "知识库自动关系发现失败", dlog.Fields{
				"knowledge_base_id": base.ID,
				"error":             fmt.Sprintf("%v", recovered),
			})
		}
	}()
	discoverKeywordSimilarDocs(ctx, base)
	discoverCooccurrenceRelations(ctx, base)
}

// discoverKeywordSimilarDocs finds docs with overlapping keywords and creates similar edges.
func discoverKeywordSimilarDocs(ctx context.Context, base agentmodel.KnowledgeBase) {
	docs := agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{
		"knowledge_base_id": base.ID,
		"index_status":      agentmodel.KnowledgeIndexStatusSuccess,
		"status":            1,
	}, map[string]any{
		"field":    "main.id, main.title, main.keywords",
		"page":     1,
		"pageSize": maxRelationDocs,
	})
	if len(docs) < 2 {
		return
	}
	// Build keyword sets for docs that have keywords
	type docEntry struct {
		DocID    uint64
		Title    string
		Keywords map[string]struct{}
	}
	entries := make([]docEntry, 0, len(docs))
	for _, doc := range docs {
		if doc == nil || doc.ID == 0 {
			continue
		}
		kw := parseKeywordSet(doc.Keywords)
		if len(kw) == 0 {
			continue
		}
		entries = append(entries, docEntry{
			DocID:    doc.ID,
			Title:    doc.Title,
			Keywords: kw,
		})
	}
	if len(entries) < 2 {
		return
	}
	edgesCreated := 0
	for i := 0; i < len(entries) && edgesCreated < maxAutoRelations; i++ {
		for j := i + 1; j < len(entries) && edgesCreated < maxAutoRelations; j++ {
			sim := jaccardSimilarity(entries[i].Keywords, entries[j].Keywords)
			if sim < minKeywordSimilarity {
				continue
			}
			fromNodeID := docRootNodeID(ctx, entries[i].DocID)
			toNodeID := docRootNodeID(ctx, entries[j].DocID)
			if fromNodeID == 0 || toNodeID == 0 || fromNodeID == toNodeID {
				continue
			}
			insertKnowledgeEdge(ctx, knowledgeEdgeInput{
				BaseID:     base.ID,
				DocID:      0,
				FromNodeID: fromNodeID,
				ToNodeID:   toNodeID,
				EdgeType:   agentmodel.KnowledgeEdgeTypeSimilar,
				Label:      fmt.Sprintf("%s ↔ %s", entries[i].Title, entries[j].Title),
				Summary:    fmt.Sprintf("关键词相似度: %.2f", sim),
				Weight:     math.Round(sim*10) / 10,
				Confidence: sim,
				Metadata: map[string]any{
					"source":     "keyword_similarity",
					"similarity": sim,
				},
			})
			edgesCreated++
		}
	}
}

// jaccardSimilarity computes Jaccard similarity between two string sets.
func discoverCooccurrenceRelations(ctx context.Context, base agentmodel.KnowledgeBase) {
	logs := agentmodel.NewKnowledgeRetrieveLogModel().Select(ctx, map[string]any{
		"knowledge_base_id": base.ID,
		"node_ids":          map[string]any{"neq": ""},
		"status":            1,
	}, map[string]any{
		"field":    "main.node_ids",
		"order":    "main.id desc",
		"page":     1,
		"pageSize": maxCooccurrenceLogs,
	})
	if len(logs) < 2 {
		return
	}
	// Parse node IDs from each log
	logNodeSets := make([][]uint64, 0, len(logs))
	for _, log := range logs {
		if log == nil || log.NodeIDs == "" {
			continue
		}
		var ids []uint64
		if err := json.Unmarshal([]byte(log.NodeIDs), &ids); err != nil {
			continue
		}
		if len(ids) < 2 {
			continue
		}
		logNodeSets = append(logNodeSets, ids)
	}
	if len(logNodeSets) < 2 {
		return
	}
	// Count co-occurrences for each pair
	type pairKey struct {
		a, b uint64
	}
	pairCount := make(map[pairKey]int)
	nodeTotal := make(map[uint64]int)
	for _, ids := range logNodeSets {
		seen := make(map[uint64]struct{}, len(ids))
		for _, id := range ids {
			if id == 0 {
				continue
			}
			if _, exists := seen[id]; exists {
				continue
			}
			seen[id] = struct{}{}
			nodeTotal[id]++
		}
		uniqueIDs := make([]uint64, 0, len(seen))
		for id := range seen {
			uniqueIDs = append(uniqueIDs, id)
		}
		for i := 0; i < len(uniqueIDs); i++ {
			for j := i + 1; j < len(uniqueIDs); j++ {
				a, b := uniqueIDs[i], uniqueIDs[j]
				if a > b {
					a, b = b, a
				}
				pairCount[pairKey{a, b}]++
			}
		}
	}
	if len(pairCount) == 0 {
		return
	}
	edgesCreated := 0
	for pair, count := range pairCount {
		if edgesCreated >= maxAutoRelations {
			break
		}
		minTotal := nodeTotal[pair.a]
		if nodeTotal[pair.b] < minTotal {
			minTotal = nodeTotal[pair.b]
		}
		if minTotal <= 0 {
			continue
		}
		if count < cooccurrenceMinCount {
			continue
		}
		rate := float64(count) / float64(minTotal)
		if rate < cooccurrenceMinRate {
			continue
		}
		fromNode := agentmodel.NewKnowledgeNodeModel().Find(ctx, map[string]any{
			"id":     pair.a,
			"status": 1,
		})
		toNode := agentmodel.NewKnowledgeNodeModel().Find(ctx, map[string]any{
			"id":     pair.b,
			"status": 1,
		})
		if fromNode == nil || toNode == nil || fromNode.NodeType != toNode.NodeType {
			continue
		}
		insertKnowledgeEdge(ctx, knowledgeEdgeInput{
			BaseID:     base.ID,
			DocID:      0,
			FromNodeID: pair.a,
			ToNodeID:   pair.b,
			EdgeType:   agentmodel.KnowledgeEdgeTypeSimilar,
			Label:      fmt.Sprintf("%s ↔ %s", fromNode.Title, toNode.Title),
			Summary:    fmt.Sprintf("共现频次: %d, 共现率: %.2f", count, rate),
			Weight:     math.Round(rate*10) / 10,
			Confidence: math.Round(rate*10) / 10,
			Metadata: map[string]any{
				"source":            "cooccurrence",
				"occurrences":       count,
				"cooccurrence_rate": rate,
			},
		})
		edgesCreated++
	}
}

func jaccardSimilarity(a, b map[string]struct{}) float64 {
	if len(a) == 0 || len(b) == 0 {
		return 0
	}
	intersection := 0
	for k := range a {
		if _, exists := b[k]; exists {
			intersection++
		}
	}
	union := len(a) + len(b) - intersection
	if union == 0 {
		return 0
	}
	return float64(intersection) / float64(union)
}

// parseKeywordSet splits a comma/space-separated keyword string into a lowercase set.
func parseKeywordSet(s string) map[string]struct{} {
	s = strings.TrimSpace(s)
	if s == "" {
		return nil
	}
	result := make(map[string]struct{})
	for _, kw := range strings.FieldsFunc(s, func(r rune) bool {
		return r == ',' || r == '，' || r == '、' || r == ' ' || r == '\n' || r == '\t'
	}) {
		kw = strings.TrimSpace(kw)
		if kw != "" {
			result[strings.ToLower(kw)] = struct{}{}
		}
	}
	return result
}
