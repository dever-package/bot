package knowledge

import (
	"context"
	"fmt"
	"strings"

	agentmodel "my/package/bot/model/agent"
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
	base := agentmodel.NewKnowledgeBaseModel().Find(ctx, map[string]any{"id": baseID})
	if base == nil {
		return KnowledgeNodeSearchResult{}, fmt.Errorf("知识库不存在")
	}
	if limit <= 0 {
		limit = normalizeRetrieveLimit(base.RetrieveLimit)
	}
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, keywordNodeFilters(baseID, query), map[string]any{
		"order":    "main.depth asc, main.sort asc, main.id asc",
		"page":     1,
		"pageSize": keywordCandidateLimit(limit, false, query),
	})
	nodes := make([]KnowledgeNodeResult, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		item := knowledgeNodeResult(ctx, row)
		item.Score = keywordNodeScore(row, query)
		nodes = append(nodes, item)
	}
	return KnowledgeNodeSearchResult{Nodes: nodes}, nil
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
	node := agentmodel.NewKnowledgeNodeModel().Find(ctx, map[string]any{"id": nodeID, "status": 1})
	if node == nil {
		return KnowledgeNodeOpenResult{}, fmt.Errorf("知识节点不存在")
	}
	result := KnowledgeNodeOpenResult{
		Node:     knowledgeNodeResult(ctx, node),
		Parents:  parentKnowledgeNodes(ctx, node),
		Children: childKnowledgeNodes(ctx, node.ID, 20),
		Siblings: siblingKnowledgeNodes(ctx, node, 12),
		Related:  relatedKnowledgeNodes(ctx, node.ID, 10),
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
	result.Children = descendantKnowledgeNodes(ctx, nodeID, depth, 80)
	return result, nil
}

func (s Service) FindRelatedKnowledge(ctx context.Context, nodeID uint64, edgeTypes []string, limit int) (KnowledgeRelatedResult, error) {
	node := agentmodel.NewKnowledgeNodeModel().Find(ctx, map[string]any{"id": nodeID, "status": 1})
	if node == nil {
		return KnowledgeRelatedResult{}, fmt.Errorf("知识节点不存在")
	}
	if limit <= 0 {
		limit = 10
	}
	if limit > 50 {
		limit = 50
	}
	return KnowledgeRelatedResult{Nodes: relatedKnowledgeNodesByTypes(ctx, nodeID, edgeTypes, limit)}, nil
}

func knowledgeNodeResult(ctx context.Context, row *agentmodel.KnowledgeNode) KnowledgeNodeResult {
	if row == nil {
		return KnowledgeNodeResult{}
	}
	return KnowledgeNodeResult{
		ID:          row.ID,
		BaseID:      row.KnowledgeBaseID,
		DirID:       row.DirID,
		DirPath:     KnowledgeDirPath(ctx, row.DirID),
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
		IndexStage:  nodeIndexStage(ctx, row),
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
		"status":            1,
	}, map[string]any{
		"order":    "main.depth asc, main.sort asc, main.id asc",
		"page":     1,
		"pageSize": limit,
	})
	result := make([]KnowledgeTreeNode, 0, len(rows))
	remaining := limit
	for _, row := range rows {
		if row == nil || remaining <= 0 {
			continue
		}
		item := KnowledgeTreeNode{
			KnowledgeNodeResult: knowledgeNodeResult(ctx, row),
			ChildrenCount:       knowledgeChildCount(ctx, row.ID),
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

func knowledgeChildCount(ctx context.Context, parentID uint64) int {
	if parentID == 0 {
		return 0
	}
	return countInt(agentmodel.NewKnowledgeNodeModel().Count(ctx, map[string]any{
		"parent_id": parentID,
		"status":    1,
	}))
}

func parentKnowledgeNodes(ctx context.Context, node *agentmodel.KnowledgeNode) []KnowledgeNodeResult {
	result := make([]KnowledgeNodeResult, 0)
	currentParentID := node.ParentID
	for currentParentID > 0 {
		parent := agentmodel.NewKnowledgeNodeModel().Find(ctx, map[string]any{"id": currentParentID, "status": 1})
		if parent == nil {
			break
		}
		result = append([]KnowledgeNodeResult{knowledgeNodeResult(ctx, parent)}, result...)
		currentParentID = parent.ParentID
	}
	return result
}

func childKnowledgeNodes(ctx context.Context, parentID uint64, limit int) []KnowledgeNodeResult {
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"parent_id": parentID,
		"status":    1,
	}, map[string]any{
		"order":    "main.sort asc, main.id asc",
		"page":     1,
		"pageSize": limit,
	})
	return knowledgeNodeResults(ctx, rows)
}

func siblingKnowledgeNodes(ctx context.Context, node *agentmodel.KnowledgeNode, limit int) []KnowledgeNodeResult {
	rows := agentmodel.NewKnowledgeNodeModel().Select(ctx, map[string]any{
		"parent_id": node.ParentID,
		"doc_id":    node.DocID,
		"status":    1,
	}, map[string]any{
		"order":    "main.sort asc, main.id asc",
		"page":     1,
		"pageSize": limit,
	})
	return knowledgeNodeResults(ctx, rows)
}

func descendantKnowledgeNodes(ctx context.Context, nodeID uint64, depth int, limit int) []KnowledgeNodeResult {
	result := make([]KnowledgeNodeResult, 0)
	current := []uint64{nodeID}
	for level := 0; level < depth && len(current) > 0 && len(result) < limit; level++ {
		next := make([]uint64, 0)
		for _, parentID := range current {
			children := childKnowledgeNodes(ctx, parentID, limit-len(result))
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

func relatedKnowledgeNodes(ctx context.Context, nodeID uint64, limit int) []KnowledgeNodeResult {
	return relatedKnowledgeNodesByTypes(ctx, nodeID, nil, limit)
}

func relatedKnowledgeNodesByTypes(ctx context.Context, nodeID uint64, edgeTypes []string, limit int) []KnowledgeNodeResult {
	filter := map[string]any{"status": 1}
	filter["or"] = []any{
		map[string]any{"main.from_node_id": nodeID},
		map[string]any{"main.to_node_id": nodeID},
	}
	if types := normalizedEdgeTypes(edgeTypes); len(types) > 0 {
		filter["edge_type"] = types
	}
	edges := agentmodel.NewKnowledgeEdgeModel().Select(ctx, filter, map[string]any{
		"field":    "main.from_node_id, main.to_node_id",
		"order":    "main.confidence desc, main.id desc",
		"page":     1,
		"pageSize": limit,
	})
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
		"id":     ids,
		"status": 1,
	}, map[string]any{
		"order":    "main.id asc",
		"page":     1,
		"pageSize": limit,
	})
	return knowledgeNodeResults(ctx, rows)
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
	result := make([]KnowledgeNodeResult, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		result = append(result, knowledgeNodeResult(ctx, row))
	}
	return result
}
