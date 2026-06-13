package knowledge

import (
	"context"
	"fmt"
	"strings"

	agentmodel "my/package/bot/model/agent"
)

const defaultKnowledgeGraphLimit = 180
const maxKnowledgeGraphLimit = 360

type KnowledgeGraphResult struct {
	Nodes []KnowledgeNodeResult `json:"nodes"`
	Edges []KnowledgeGraphEdge  `json:"edges"`
}

type KnowledgeGraphEdge struct {
	ID         uint64  `json:"id"`
	FromNodeID uint64  `json:"from_node_id"`
	ToNodeID   uint64  `json:"to_node_id"`
	DocID      uint64  `json:"doc_id"`
	EdgeType   string  `json:"edge_type"`
	Label      string  `json:"label"`
	Summary    string  `json:"summary"`
	Evidence   string  `json:"evidence"`
	Weight     float64 `json:"weight"`
	Confidence float64 `json:"confidence"`
}

func (s Service) ReadKnowledgeGraph(ctx context.Context, baseID uint64, limit int) (KnowledgeGraphResult, error) {
	if baseID == 0 {
		return KnowledgeGraphResult{}, fmt.Errorf("知识库不能为空")
	}
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID, "status": 1})
	if base == nil {
		return KnowledgeGraphResult{}, fmt.Errorf("知识库不存在")
	}
	limit = normalizeKnowledgeGraphLimit(limit)
	edges := knowledgeGraphEdges(ctx, baseID, limit)
	if len(edges) == 0 {
		return KnowledgeGraphResult{}, nil
	}
	nodeMap := knowledgeGraphNodeMap(ctx, graphEdgeNodeIDs(edges))
	result := KnowledgeGraphResult{
		Nodes: make([]KnowledgeNodeResult, 0, len(nodeMap)),
		Edges: make([]KnowledgeGraphEdge, 0, len(edges)),
	}
	addedNodes := map[uint64]struct{}{}
	for _, edge := range edges {
		if edge == nil || edge.FromNodeID == 0 || edge.ToNodeID == 0 {
			continue
		}
		fromNode := nodeMap[edge.FromNodeID]
		toNode := nodeMap[edge.ToNodeID]
		if fromNode == nil || toNode == nil {
			continue
		}
		result.Edges = append(result.Edges, knowledgeGraphEdgeResult(edge))
		for _, node := range []*agentmodel.KnowledgeNode{fromNode, toNode} {
			if _, exists := addedNodes[node.ID]; exists {
				continue
			}
			addedNodes[node.ID] = struct{}{}
			result.Nodes = append(result.Nodes, knowledgeNodeResult(ctx, node))
		}
	}
	return result, nil
}

func graphRetrievalPlan(ctx context.Context, baseID uint64, query string, depth int) retrievalPlan {
	terms := queryTerms(query)
	if baseID == 0 || len(terms) == 0 {
		return retrievalPlan{}
	}
	if cached, ok := graphCacheGet(baseID, query); ok {
		return cached
	}
	// Edge entry: search edge table for query terms in label/summary/evidence
	rows := agentmodel.NewKnowledgeEdgeModel().Select(ctx, graphEdgeFilter(baseID, terms), map[string]any{
		"field":    "main.id, main.doc_id, main.from_node_id, main.to_node_id, main.label, main.summary, main.evidence, main.confidence",
		"order":    "main.confidence desc, main.id desc",
		"page":     1,
		"pageSize": 20,
	})
	rows = filterAvailableKnowledgeEdges(ctx, rows)
	plan := retrievalPlan{}
	frontier := make([]uint64, 0, len(rows)*2)
	for _, row := range rows {
		if row == nil {
			continue
		}
		plan.DocIDs = append(plan.DocIDs, row.DocID)
		plan.Queries = append(plan.Queries, row.Label)
		plan.Queries = append(plan.Queries, splitSummaryKeywords(row.Summary)...)
		plan.Queries = append(plan.Queries, splitSummaryKeywords(row.Evidence)...)
		frontier = append(frontier, row.FromNodeID, row.ToNodeID)
	}
	// Node entry: search node table for matching concept/entity nodes
	if nodeMatches := nodeGraphMatches(ctx, baseID, terms); nodeMatches != nil {
		plan.DocIDs = append(plan.DocIDs, nodeMatches.DocIDs...)
		plan.Queries = append(plan.Queries, nodeMatches.Queries...)
		frontier = append(frontier, nodeMatches.NodeIDs...)
	}
	// Inference rules: derive implicit relations from matched edges
	if inferred := inferGraphRelations(ctx, baseID, rows); inferred != nil {
		plan.DocIDs = append(plan.DocIDs, inferred.DocIDs...)
		plan.Queries = append(plan.Queries, inferred.Queries...)
		frontier = append(frontier, inferred.NodeIDs...)
	}
	expanded := expandGraphRetrieval(ctx, baseID, frontier, normalizeGraphDepth(depth))
	plan.DocIDs = append(plan.DocIDs, expanded.DocIDs...)
	plan.Queries = append(plan.Queries, expanded.Queries...)
	if len(plan.Queries) > 0 || len(plan.DocIDs) > 0 {
		plan.Reason = "命中知识关系边或节点"
	}
	normalized := normalizeRetrievalPlan(plan)
	graphCacheSet(baseID, query, normalized)
	return normalized
}

// inferGraphRelations derives implicit node relationships from matched edges.
// Two inference rules:
//   - Transitive: A→B and B→C ⇒ A→C (with confidence multiplier)
//   - Co-citation: A→C and B→C ⇒ A↔B (shared target similarity)
func inferGraphRelations(ctx context.Context, baseID uint64, edges []*agentmodel.KnowledgeEdge) *nodeGraphMatchResult {
	if len(edges) < 2 || baseID == 0 {
		return nil
	}
	// Forward adjacency: node → set of outgoing target nodes
	forward := map[uint64]map[uint64]struct{}{}
	// Reverse adjacency: node → set of incoming source nodes
	reverse := map[uint64]map[uint64]struct{}{}
	for _, e := range edges {
		if e == nil || e.FromNodeID == 0 || e.ToNodeID == 0 {
			continue
		}
		// Transitive: skip same-node edges and unresolved references (low confidence)
		if e.FromNodeID == e.ToNodeID || e.Confidence < 0.3 {
			continue
		}
		if forward[e.FromNodeID] == nil {
			forward[e.FromNodeID] = map[uint64]struct{}{}
		}
		forward[e.FromNodeID][e.ToNodeID] = struct{}{}
		if reverse[e.ToNodeID] == nil {
			reverse[e.ToNodeID] = map[uint64]struct{}{}
		}
		reverse[e.ToNodeID][e.FromNodeID] = struct{}{}
	}
	inferred := map[uint64]struct{}{}
	// Rule 1: Transitive. For each A→B and B→C, infer A→C
	for a, targets := range forward {
		for b := range targets {
			if grandchildren, exists := forward[b]; exists {
				for c := range grandchildren {
					if c == a {
						continue
					}
					inferred[c] = struct{}{}
				}
			}
		}
	}
	// Rule 2: Co-citation. For each A→C and B→C (shared target), infer A↔B
	for _, sources := range reverse {
		for a := range sources {
			for b := range sources {
				if a != b {
					inferred[a] = struct{}{}
					inferred[b] = struct{}{}
				}
			}
		}
	}
	if len(inferred) == 0 {
		return nil
	}
	nodeIDs := make([]uint64, 0, len(inferred))
	for id := range inferred {
		if id > 0 {
			nodeIDs = append(nodeIDs, id)
		}
	}
	nodeIDs = uniqueUint64s(nodeIDs, 40)
	if len(nodeIDs) == 0 {
		return nil
	}
	// Fetch doc IDs and titles for inferred nodes
	nodes := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"id":           nodeIDs,
		"index_status": agentmodel.KnowledgeIndexStatusSuccess,
		"status":       1,
	}, map[string]any{
		"field":    "main.id, main.doc_id, main.title, main.index_status, main.status",
		"page":     1,
		"pageSize": len(nodeIDs),
	})
	nodes = filterAvailableKnowledgeNodes(ctx, nodes)
	if len(nodes) == 0 {
		return nil
	}
	result := &nodeGraphMatchResult{
		DocIDs:  make([]uint64, 0, len(nodes)),
		Queries: make([]string, 0, len(nodes)),
		NodeIDs: make([]uint64, 0, len(nodes)),
	}
	for _, n := range nodes {
		if n == nil || n.ID == 0 {
			continue
		}
		result.NodeIDs = append(result.NodeIDs, n.ID)
		if n.DocID > 0 {
			result.DocIDs = append(result.DocIDs, n.DocID)
		}
		if title := strings.TrimSpace(n.Title); title != "" {
			result.Queries = append(result.Queries, title)
		}
	}
	return result
}

type nodeGraphMatchResult struct {
	DocIDs  []uint64
	Queries []string
	NodeIDs []uint64
}

func nodeGraphMatches(ctx context.Context, baseID uint64, terms []string) *nodeGraphMatchResult {
	// search_text concatenates title+summary+plain_text, single field suffices
	conditions := make([]any, 0, len(terms))
	for _, term := range terms {
		pattern := "%" + term + "%"
		conditions = append(conditions,
			map[string]any{"main.search_text": map[string]any{"like": pattern}},
		)
	}
	if len(conditions) == 0 {
		return nil
	}
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"node_type": []string{
			agentmodel.KnowledgeNodeTypeConcept,
			agentmodel.KnowledgeNodeTypeDoc,
			agentmodel.KnowledgeNodeTypeHeading,
		},
		"index_status": agentmodel.KnowledgeIndexStatusSuccess,
		"status":       1,
		"or":           conditions,
	}, map[string]any{
		"field":    "main.id, main.doc_id, main.title, main.index_status, main.status",
		"order":    "main.id desc",
		"page":     1,
		"pageSize": 15,
	})
	rows = filterAvailableKnowledgeNodes(ctx, rows)
	if len(rows) == 0 {
		return nil
	}
	result := &nodeGraphMatchResult{
		DocIDs:  make([]uint64, 0, len(rows)),
		Queries: make([]string, 0, len(rows)),
		NodeIDs: make([]uint64, 0, len(rows)),
	}
	for _, row := range rows {
		if row == nil || row.ID == 0 {
			continue
		}
		result.NodeIDs = append(result.NodeIDs, row.ID)
		if row.DocID > 0 {
			result.DocIDs = append(result.DocIDs, row.DocID)
		}
		if title := strings.TrimSpace(row.Title); title != "" {
			result.Queries = append(result.Queries, title)
		}
	}
	return result
}

func graphEdgeFilter(baseID uint64, terms []string) map[string]any {
	filter := map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	}
	// label+summary+evidence cover edge content; metadata is JSON, not user-facing text
	conditions := make([]any, 0, len(terms)*3)
	for _, term := range terms {
		term = strings.TrimSpace(term)
		if term == "" {
			continue
		}
		pattern := "%" + term + "%"
		conditions = append(conditions,
			map[string]any{"main.label": map[string]any{"like": pattern}},
			map[string]any{"main.summary": map[string]any{"like": pattern}},
			map[string]any{"main.evidence": map[string]any{"like": pattern}},
		)
	}
	if len(conditions) > 0 {
		filter["or"] = conditions
	}
	return filter
}

const maxGraphTotalEdges = 200

func expandGraphRetrieval(ctx context.Context, baseID uint64, startNodeIDs []uint64, depth int) retrievalPlan {
	startNodeIDs = uniqueUint64s(startNodeIDs, 80)
	if baseID == 0 || len(startNodeIDs) == 0 || depth <= 0 {
		return retrievalPlan{}
	}
	visited := map[uint64]struct{}{}
	for _, nodeID := range startNodeIDs {
		visited[nodeID] = struct{}{}
	}
	frontier := startNodeIDs
	plan := retrievalPlan{}
	totalEdges := 0
	for level := 0; level < depth && len(frontier) > 0 && totalEdges < maxGraphTotalEdges; level++ {
		edges := graphEdgesAroundNodes(ctx, baseID, frontier)
		next := make([]uint64, 0)
		for _, edge := range edges {
			if edge == nil {
				continue
			}
			totalEdges++
			if totalEdges > maxGraphTotalEdges {
				break
			}
			plan.DocIDs = append(plan.DocIDs, edge.DocID)
			plan.Queries = append(plan.Queries, edge.Label)
			plan.Queries = append(plan.Queries, splitSummaryKeywords(edge.Summary)...)
			for _, nodeID := range []uint64{edge.FromNodeID, edge.ToNodeID} {
				if nodeID == 0 {
					continue
				}
				if _, exists := visited[nodeID]; exists {
					continue
				}
				visited[nodeID] = struct{}{}
				next = append(next, nodeID)
			}
		}
		frontier = uniqueUint64s(next, 80)
	}
	return normalizeRetrievalPlan(plan)
}

func graphEdgesAroundNodes(ctx context.Context, baseID uint64, nodeIDs []uint64) []*agentmodel.KnowledgeEdge {
	nodeIDs = uniqueUint64s(nodeIDs, 80)
	if baseID == 0 || len(nodeIDs) == 0 {
		return nil
	}
	rows := agentmodel.NewKnowledgeEdgeModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
		"or": []any{
			map[string]any{"main.from_node_id": nodeIDs},
			map[string]any{"main.to_node_id": nodeIDs},
		},
	}, map[string]any{
		"field":    "main.id, main.doc_id, main.from_node_id, main.to_node_id, main.label, main.summary, main.evidence, main.confidence",
		"order":    "main.confidence desc, main.id desc",
		"page":     1,
		"pageSize": 80,
	})
	return filterAvailableKnowledgeEdges(ctx, rows)
}

func normalizeKnowledgeGraphLimit(limit int) int {
	if limit <= 0 {
		return defaultKnowledgeGraphLimit
	}
	if limit > maxKnowledgeGraphLimit {
		return maxKnowledgeGraphLimit
	}
	return limit
}

func knowledgeGraphEdges(ctx context.Context, baseID uint64, limit int) []*agentmodel.KnowledgeEdge {
	rows := agentmodel.NewKnowledgeEdgeModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"edge_type": []string{
			agentmodel.KnowledgeEdgeTypeReferences,
			agentmodel.KnowledgeEdgeTypeAsset,
			agentmodel.KnowledgeEdgeTypeMentions,
			agentmodel.KnowledgeEdgeTypeDefines,
			agentmodel.KnowledgeEdgeTypeDependsOn,
			agentmodel.KnowledgeEdgeTypeConcept,
		},
		"status": 1,
	}, map[string]any{
		"field":    "main.id, main.from_node_id, main.to_node_id, main.doc_id, main.edge_type, main.label, main.summary, main.evidence, main.weight, main.confidence",
		"order":    "main.confidence desc, main.weight desc, main.id desc",
		"page":     1,
		"pageSize": limit,
	})
	return filterAvailableKnowledgeEdges(ctx, rows)
}

func graphEdgeNodeIDs(edges []*agentmodel.KnowledgeEdge) []uint64 {
	ids := make([]uint64, 0, len(edges)*2)
	for _, edge := range edges {
		if edge == nil {
			continue
		}
		ids = append(ids, edge.FromNodeID, edge.ToNodeID)
	}
	return uniqueUint64s(ids, maxKnowledgeGraphLimit*2)
}

func knowledgeGraphNodeMap(ctx context.Context, nodeIDs []uint64) map[uint64]*agentmodel.KnowledgeNode {
	if len(nodeIDs) == 0 {
		return nil
	}
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"id":           nodeIDs,
		"index_status": agentmodel.KnowledgeIndexStatusSuccess,
		"status":       1,
	}, map[string]any{
		"page":     1,
		"pageSize": len(nodeIDs),
	})
	rows = filterAvailableKnowledgeNodes(ctx, rows)
	result := make(map[uint64]*agentmodel.KnowledgeNode, len(rows))
	for _, row := range rows {
		if row != nil && row.ID > 0 {
			result[row.ID] = row
		}
	}
	return result
}

func knowledgeGraphEdgeResult(row *agentmodel.KnowledgeEdge) KnowledgeGraphEdge {
	if row == nil {
		return KnowledgeGraphEdge{}
	}
	return KnowledgeGraphEdge{
		ID:         row.ID,
		FromNodeID: row.FromNodeID,
		ToNodeID:   row.ToNodeID,
		DocID:      row.DocID,
		EdgeType:   strings.TrimSpace(row.EdgeType),
		Label:      strings.TrimSpace(row.Label),
		Summary:    strings.TrimSpace(row.Summary),
		Evidence:   strings.TrimSpace(row.Evidence),
		Weight:     row.Weight,
		Confidence: row.Confidence,
	}
}
