package knowledge

import (
	"context"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

type KnowledgeNodeSearchResult struct {
	Nodes []KnowledgeNodeResult `json:"nodes"`
}

type KnowledgeTreeResult struct {
	Nodes []KnowledgeTreeNode `json:"nodes"`
}

type KnowledgeNodeOpenResult struct {
	Node     KnowledgeNodeResult   `json:"node"`
	Parents  []KnowledgeNodeResult `json:"parents"`
	Children []KnowledgeNodeResult `json:"children"`
	Siblings []KnowledgeNodeResult `json:"siblings"`
	Related  []KnowledgeNodeResult `json:"related"`
}

type KnowledgeRelatedResult struct {
	Nodes []KnowledgeNodeResult `json:"nodes"`
}

type KnowledgeNodeResult struct {
	ID          uint64   `json:"id"`
	BaseID      uint64   `json:"knowledge_base_id"`
	DirID       uint64   `json:"dir_id"`
	DirPath     string   `json:"dir_path"`
	DocID       uint64   `json:"doc_id"`
	ParentID    uint64   `json:"parent_id"`
	NodeType    string   `json:"node_type"`
	Title       string   `json:"title"`
	Path        string   `json:"path"`
	Summary     string   `json:"summary"`
	Content     string   `json:"content"`
	PlainText   string   `json:"plain_text"`
	Keywords    []string `json:"keywords"`
	PageStart   int      `json:"page_start"`
	PageEnd     int      `json:"page_end"`
	LineStart   int      `json:"line_start"`
	LineEnd     int      `json:"line_end"`
	Score       float64  `json:"score,omitempty"`
	IndexStatus string   `json:"index_status"`
	IndexStage  string   `json:"index_stage,omitempty"`
}

type KnowledgeTreeNode struct {
	KnowledgeNodeResult
	Children      []KnowledgeTreeNode `json:"children,omitempty"`
	ChildrenCount int                 `json:"children_count"`
}

func (s Service) SearchKnowledgeNodes(ctx context.Context, baseID uint64, query string, limit int) (KnowledgeNodeSearchResult, error) {
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID, "status": 1})
	if base == nil {
		return KnowledgeNodeSearchResult{}, fmt.Errorf("知识库不存在")
	}
	query = strings.TrimSpace(query)
	if query == "" {
		return KnowledgeNodeSearchResult{}, nil
	}
	limit = normalizeKnowledgeSearchLimit(limit, base.RetrieveLimit)
	binding := knowledgeBaseDebugBinding(*base)
	binding.RetrieveLimit = limit
	binding.Base.RetrieveLimit = limit

	startedAt := time.Now()
	retrieved := s.retrieveAgenticBinding(ctx, binding, query)
	snippets := limitRetrievedSnippets(retrieved.Snippets, limit)
	s.recordKnowledgeSearchLog(ctx, base.ID, query, snippets, retrieved.Matches, time.Since(startedAt))
	s.incrementHitCounts(ctx, snippets)
	nodes := knowledgeNodeResultsFromSnippets(ctx, base.ID, snippets, limit)
	return KnowledgeNodeSearchResult{Nodes: nodes}, nil
}

func normalizeKnowledgeSearchLimit(limit int, fallback int) int {
	if limit <= 0 {
		return normalizeRetrieveLimit(fallback)
	}
	return normalizeRetrieveLimit(limit)
}

func limitRetrievedSnippets(snippets []RetrievedSnippet, limit int) []RetrievedSnippet {
	if limit <= 0 || len(snippets) <= limit {
		return snippets
	}
	return snippets[:limit]
}

func knowledgeNodeResultsFromSnippets(ctx context.Context, baseID uint64, snippets []RetrievedSnippet, limit int) []KnowledgeNodeResult {
	if len(snippets) == 0 {
		return nil
	}
	if limit <= 0 {
		limit = defaultRetrieveLimit
	}
	ids := make([]uint64, 0, len(snippets))
	scoreByID := make(map[uint64]float64, len(snippets))
	seen := make(map[uint64]struct{}, len(snippets))
	for _, snippet := range snippets {
		if snippet.NodeID == 0 {
			continue
		}
		if _, exists := seen[snippet.NodeID]; exists {
			continue
		}
		seen[snippet.NodeID] = struct{}{}
		ids = append(ids, snippet.NodeID)
		scoreByID[snippet.NodeID] = snippet.Score
		if len(ids) >= limit {
			break
		}
	}
	if len(ids) == 0 {
		return nil
	}
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"id":                ids,
		"knowledge_base_id": baseID,
		"index_status":      agentmodel.KnowledgeIndexStatusSuccess,
		"status":            1,
	}, map[string]any{
		"page":     1,
		"pageSize": len(ids),
	})
	rows = filterAvailableKnowledgeNodes(ctx, rows)
	nodeByID := make(map[uint64]*agentmodel.KnowledgeNode, len(rows))
	for _, row := range rows {
		if row != nil {
			nodeByID[row.ID] = row
		}
	}
	orderedRows := make([]*agentmodel.KnowledgeNode, 0, len(ids))
	for _, id := range ids {
		row := nodeByID[id]
		if row == nil {
			continue
		}
		orderedRows = append(orderedRows, row)
	}
	result := knowledgeNodeResults(ctx, orderedRows)
	for index := range result {
		result[index].Score = scoreByID[result[index].ID]
	}
	return result
}

func (s Service) recordKnowledgeSearchLog(ctx context.Context, baseID uint64, query string, snippets []RetrievedSnippet, matches []map[string]any, latency time.Duration) {
	insertKnowledgeRetrieveLog(ctx, knowledgeRetrieveLogInput{
		BaseID:    baseID,
		Query:     query,
		Snippets:  snippets,
		Matches:   matches,
		LatencyMs: int(latency.Milliseconds()),
	})
}

func (s Service) ListKnowledgeTree(ctx context.Context, baseID uint64, parentID uint64, depth int, limit int) (KnowledgeTreeResult, error) {
	if baseID == 0 {
		return KnowledgeTreeResult{}, fmt.Errorf("知识库不能为空")
	}
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID, "status": 1})
	if base == nil {
		return KnowledgeTreeResult{}, fmt.Errorf("知识库不存在")
	}
	if depth <= 0 {
		depth = 2
	}
	if depth > 4 {
		depth = 4
	}
	if limit <= 0 {
		limit = 120
	}
	if limit > 1000 {
		limit = 1000
	}
	return KnowledgeTreeResult{Nodes: knowledgeTreeNodes(ctx, baseID, parentID, depth, limit)}, nil
}

func (s Service) OpenKnowledgeNode(ctx context.Context, nodeID uint64) (KnowledgeNodeOpenResult, error) {
	node := availableKnowledgeNode(ctx, nodeID)
	if node == nil {
		return KnowledgeNodeOpenResult{}, fmt.Errorf("知识节点不存在或不可用")
	}
	result := KnowledgeNodeOpenResult{
		Node:     knowledgeNodeResult(ctx, node),
		Parents:  parentKnowledgeNodes(ctx, node),
		Children: childKnowledgeNodes(ctx, node.KnowledgeBaseID, node.ID, 20),
		Siblings: siblingKnowledgeNodes(ctx, node, 12),
		Related:  relatedKnowledgeNodes(ctx, node.KnowledgeBaseID, node.ID, 10),
	}
	return result, nil
}

func (s Service) ExpandKnowledgeNode(ctx context.Context, nodeID uint64, depth int) (KnowledgeNodeOpenResult, error) {
	if depth <= 0 {
		depth = 1
	}
	if depth > 3 {
		depth = 3
	}
	result, err := s.OpenKnowledgeNode(ctx, nodeID)
	if err != nil {
		return KnowledgeNodeOpenResult{}, err
	}
	result.Children = descendantKnowledgeNodes(ctx, result.Node.BaseID, nodeID, depth, 80)
	return result, nil
}

func (s Service) FindRelatedKnowledge(ctx context.Context, nodeID uint64, edgeTypes []string, limit int) (KnowledgeRelatedResult, error) {
	node := availableKnowledgeNode(ctx, nodeID)
	if node == nil {
		return KnowledgeRelatedResult{}, fmt.Errorf("知识节点不存在或不可用")
	}
	if limit <= 0 {
		limit = 10
	}
	if limit > 50 {
		limit = 50
	}
	return KnowledgeRelatedResult{Nodes: relatedKnowledgeNodesByTypes(ctx, node.KnowledgeBaseID, nodeID, edgeTypes, limit)}, nil
}

func knowledgeNodeResult(ctx context.Context, row *agentmodel.KnowledgeNode) KnowledgeNodeResult {
	if row == nil {
		return KnowledgeNodeResult{}
	}
	return knowledgeNodeResultValue(row, KnowledgeDirPath(ctx, row.DirID), nodeIndexStage(ctx, row))
}

func knowledgeNodeResultValue(row *agentmodel.KnowledgeNode, dirPath string, indexStage string) KnowledgeNodeResult {
	if row == nil {
		return KnowledgeNodeResult{}
	}
	return KnowledgeNodeResult{
		ID:          row.ID,
		BaseID:      row.KnowledgeBaseID,
		DirID:       row.DirID,
		DirPath:     dirPath,
		DocID:       row.DocID,
		ParentID:    row.ParentID,
		NodeType:    strings.TrimSpace(row.NodeType),
		Title:       strings.TrimSpace(row.Title),
		Path:        strings.TrimSpace(row.Path),
		Summary:     strings.TrimSpace(row.Summary),
		Content:     strings.TrimSpace(row.Content),
		PlainText:   strings.TrimSpace(row.PlainText),
		Keywords:    keywordList(row.Keywords, 20),
		PageStart:   row.PageStart,
		PageEnd:     row.PageEnd,
		LineStart:   row.LineStart,
		LineEnd:     row.LineEnd,
		IndexStatus: strings.TrimSpace(row.IndexStatus),
		IndexStage:  indexStage,
	}
}

func nodeIndexStage(ctx context.Context, row *agentmodel.KnowledgeNode) string {
	if row == nil || row.DocID == 0 {
		return strings.TrimSpace(row.IndexStatus)
	}
	doc := agentmodel.NewKnowledgeDocModel().Find(ctx, map[string]any{"id": row.DocID})
	if doc == nil {
		return strings.TrimSpace(row.IndexStatus)
	}
	return strings.TrimSpace(doc.IndexStage)
}

func knowledgeTreeNodes(ctx context.Context, baseID uint64, parentID uint64, depth int, limit int) []KnowledgeTreeNode {
	if depth <= 0 || limit <= 0 {
		return nil
	}
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"parent_id":         parentID,
		"index_status":      agentmodel.KnowledgeIndexStatusSuccess,
		"status":            1,
	}, map[string]any{
		"order":    "main.depth asc, main.sort asc, main.id asc",
		"page":     1,
		"pageSize": limit,
	})
	rows = filterAvailableKnowledgeNodes(ctx, rows)
	nodeResults := knowledgeNodeResults(ctx, rows)
	resultByID := make(map[uint64]KnowledgeNodeResult, len(nodeResults))
	for _, item := range nodeResults {
		resultByID[item.ID] = item
	}
	childCounts := knowledgeChildCounts(ctx, baseID, knowledgeNodeIDs(rows))
	result := make([]KnowledgeTreeNode, 0, len(rows))
	remaining := limit
	for _, row := range rows {
		if row == nil || remaining <= 0 {
			continue
		}
		item := KnowledgeTreeNode{
			KnowledgeNodeResult: resultByID[row.ID],
			ChildrenCount:       childCounts[row.ID],
		}
		remaining--
		if depth > 1 && item.ChildrenCount > 0 {
			children := knowledgeTreeNodes(ctx, baseID, row.ID, depth-1, remaining)
			item.Children = children
			remaining -= len(children)
		}
		result = append(result, item)
	}
	return result
}

func knowledgeChildCounts(ctx context.Context, baseID uint64, parentIDs []uint64) map[uint64]int {
	parentIDs = uniqueUint64s(parentIDs, 0)
	result := make(map[uint64]int, len(parentIDs))
	if baseID == 0 || len(parentIDs) == 0 {
		return result
	}
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"parent_id":         parentIDs,
		"index_status":      agentmodel.KnowledgeIndexStatusSuccess,
		"status":            1,
	}, map[string]any{
		"field": "main.id, main.parent_id, main.doc_id, main.index_status, main.status",
	})
	for _, row := range filterAvailableKnowledgeNodes(ctx, rows) {
		if row != nil {
			result[row.ParentID]++
		}
	}
	return result
}

func parentKnowledgeNodes(ctx context.Context, node *agentmodel.KnowledgeNode) []KnowledgeNodeResult {
	result := make([]KnowledgeNodeResult, 0)
	currentParentID := node.ParentID
	for currentParentID > 0 {
		parent := availableKnowledgeNode(ctx, currentParentID)
		if parent == nil || parent.KnowledgeBaseID != node.KnowledgeBaseID {
			break
		}
		result = append([]KnowledgeNodeResult{knowledgeNodeResult(ctx, parent)}, result...)
		currentParentID = parent.ParentID
	}
	return result
}

func childKnowledgeNodes(ctx context.Context, baseID uint64, parentID uint64, limit int) []KnowledgeNodeResult {
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"knowledge_base_id": baseID,
		"parent_id":         parentID,
		"index_status":      agentmodel.KnowledgeIndexStatusSuccess,
		"status":            1,
	}, map[string]any{
		"order":    "main.sort asc, main.id asc",
		"page":     1,
		"pageSize": limit,
	})
	return knowledgeNodeResults(ctx, filterAvailableKnowledgeNodes(ctx, rows))
}

func siblingKnowledgeNodes(ctx context.Context, node *agentmodel.KnowledgeNode, limit int) []KnowledgeNodeResult {
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"knowledge_base_id": node.KnowledgeBaseID,
		"parent_id":         node.ParentID,
		"doc_id":            node.DocID,
		"index_status":      agentmodel.KnowledgeIndexStatusSuccess,
		"status":            1,
	}, map[string]any{
		"order":    "main.sort asc, main.id asc",
		"page":     1,
		"pageSize": limit,
	})
	return knowledgeNodeResults(ctx, filterAvailableKnowledgeNodes(ctx, rows))
}

func descendantKnowledgeNodes(ctx context.Context, baseID uint64, nodeID uint64, depth int, limit int) []KnowledgeNodeResult {
	result := make([]KnowledgeNodeResult, 0)
	current := []uint64{nodeID}
	for level := 0; level < depth && len(current) > 0 && len(result) < limit; level++ {
		next := make([]uint64, 0)
		for _, parentID := range current {
			children := childKnowledgeNodes(ctx, baseID, parentID, limit-len(result))
			for _, child := range children {
				result = append(result, child)
				next = append(next, child.ID)
				if len(result) >= limit {
					break
				}
			}
			if len(result) >= limit {
				break
			}
		}
		current = next
	}
	return result
}

func relatedKnowledgeNodes(ctx context.Context, baseID uint64, nodeID uint64, limit int) []KnowledgeNodeResult {
	return relatedKnowledgeNodesByTypes(ctx, baseID, nodeID, nil, limit)
}

func relatedKnowledgeNodesByTypes(ctx context.Context, baseID uint64, nodeID uint64, edgeTypes []string, limit int) []KnowledgeNodeResult {
	if baseID == 0 || nodeID == 0 {
		return nil
	}
	filter := map[string]any{
		"knowledge_base_id": baseID,
		"status":            1,
	}
	filter["or"] = []any{
		map[string]any{"main.from_node_id": nodeID},
		map[string]any{"main.to_node_id": nodeID},
	}
	if types := normalizedEdgeTypes(edgeTypes); len(types) > 0 {
		filter["edge_type"] = types
	}
	edges := agentmodel.NewKnowledgeEdgeModel().Select(ctx, filter, map[string]any{
		"field":    "main.doc_id, main.from_node_id, main.to_node_id",
		"order":    "main.confidence desc, main.id desc",
		"page":     1,
		"pageSize": limit,
	})
	edges = filterAvailableKnowledgeEdges(ctx, edges)
	ids := make([]uint64, 0, len(edges))
	seen := map[uint64]struct{}{}
	for _, edge := range edges {
		if edge == nil {
			continue
		}
		relatedID := edge.ToNodeID
		if relatedID == nodeID {
			relatedID = edge.FromNodeID
		}
		if relatedID == 0 || relatedID == nodeID {
			continue
		}
		if _, exists := seen[relatedID]; exists {
			continue
		}
		seen[relatedID] = struct{}{}
		ids = append(ids, relatedID)
	}
	if len(ids) == 0 {
		return nil
	}
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"id":                ids,
		"knowledge_base_id": baseID,
		"index_status":      agentmodel.KnowledgeIndexStatusSuccess,
		"status":            1,
	}, map[string]any{
		"order":    "main.id asc",
		"page":     1,
		"pageSize": limit,
	})
	return knowledgeNodeResults(ctx, filterAvailableKnowledgeNodes(ctx, rows))
}

func normalizedEdgeTypes(values []string) []string {
	result := make([]string, 0, len(values))
	seen := map[string]struct{}{}
	for _, value := range values {
		current := strings.TrimSpace(value)
		if current == "" {
			continue
		}
		if _, exists := seen[current]; exists {
			continue
		}
		seen[current] = struct{}{}
		result = append(result, current)
	}
	return result
}

func knowledgeNodeResults(ctx context.Context, rows []*agentmodel.KnowledgeNode) []KnowledgeNodeResult {
	dirPaths := knowledgeDirPaths(ctx, 0, knowledgeNodeDirIDs(rows))
	docIDs := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if row != nil && row.DocID > 0 {
			docIDs = append(docIDs, row.DocID)
		}
	}
	stages := knowledgeDocIndexStages(ctx, docIDs)
	result := make([]KnowledgeNodeResult, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		stage := stages[row.DocID]
		if stage == "" {
			stage = strings.TrimSpace(row.IndexStatus)
		}
		result = append(result, knowledgeNodeResultValue(row, dirPaths[row.DirID], stage))
	}
	return result
}

func knowledgeDocIndexStages(ctx context.Context, docIDs []uint64) map[uint64]string {
	docIDs = uniqueUint64s(docIDs, 0)
	result := make(map[uint64]string, len(docIDs))
	if len(docIDs) == 0 {
		return result
	}
	rows := agentmodel.NewKnowledgeDocModel().Select(ctx, map[string]any{"id": docIDs}, map[string]any{
		"field":    "main.id, main.index_stage",
		"page":     1,
		"pageSize": len(docIDs),
	})
	for _, row := range rows {
		if row != nil {
			result[row.ID] = strings.TrimSpace(row.IndexStage)
		}
	}
	return result
}
