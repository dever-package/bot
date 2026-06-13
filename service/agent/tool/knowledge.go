package tool

import (
	"context"
	"fmt"
	"strings"

	knowledgeservice "my/package/bot/service/agent/knowledge"
)

const (
	knowledgeSearchPreviewLimit = 360
	knowledgeSearchTextLimit    = 280
	knowledgeOpenTextLimit      = 4000
	knowledgeDebugSnippetLimit  = 240
)

type knowledgeNodeBrief struct {
	ID          uint64               `json:"id"`
	BaseID      uint64               `json:"knowledge_base_id"`
	DirID       uint64               `json:"dir_id,omitempty"`
	DirPath     string               `json:"dir_path,omitempty"`
	DocID       uint64               `json:"doc_id,omitempty"`
	ParentID    uint64               `json:"parent_id,omitempty"`
	NodeType    string               `json:"node_type,omitempty"`
	Title       string               `json:"title,omitempty"`
	Path        string               `json:"path,omitempty"`
	Summary     string               `json:"summary,omitempty"`
	Preview     string               `json:"preview,omitempty"`
	Keywords    []string             `json:"keywords,omitempty"`
	PageStart   int                  `json:"page_start,omitempty"`
	PageEnd     int                  `json:"page_end,omitempty"`
	LineStart   int                  `json:"line_start,omitempty"`
	LineEnd     int                  `json:"line_end,omitempty"`
	Score       float64              `json:"score,omitempty"`
	ChildCount  int                  `json:"children_count,omitempty"`
	HasChildren bool                 `json:"has_children,omitempty"`
	Children    []knowledgeNodeBrief `json:"children,omitempty"`
}

type knowledgeNodeDetail struct {
	knowledgeNodeBrief
	Text string `json:"text,omitempty"`
}

func executeKnowledgeTree(ctx context.Context, req Request) (map[string]any, error) {
	baseID := knowledgeBaseIDFromInput(req.Action.Input)
	parentID := uint64(inputInt(firstPresent(req.Action.Input, "parent_id", "parentId"), 0))
	depth := inputInt(firstPresent(req.Action.Input, "depth"), 2)
	limit := inputInt(firstPresent(req.Action.Input, "limit"), 120)
	result, err := knowledgeservice.NewService().ListKnowledgeTree(ctx, baseID, parentID, depth, limit)
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"nodes": knowledgeTreeBriefs(result.Nodes),
		"text":  fmt.Sprintf("已读取内容结构，返回 %d 个顶层节点。", len(result.Nodes)),
	}, nil
}

func executeKnowledgeSearch(ctx context.Context, req Request) (map[string]any, error) {
	baseID := knowledgeBaseIDFromInput(req.Action.Input)
	query := inputText(firstPresent(req.Action.Input, "query", "text", "keyword"))
	if query == "" {
		return nil, fmt.Errorf("搜索内容需要提供 query")
	}
	limit := inputInt(firstPresent(req.Action.Input, "limit"), 8)
	result, err := knowledgeservice.NewService().SearchKnowledgeNodes(ctx, baseID, query, limit)
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"nodes":             knowledgeNodeBriefs(result.Nodes, knowledgeSearchPreviewLimit),
		"hit_node_ids":      knowledgeSearchNodeIDs(result.Nodes),
		"query":             query,
		"knowledge_base_id": baseID,
		"summary":           "已整理相关内容",
		"text":              knowledgeSearchText(query, result.Nodes),
	}, nil
}

func knowledgeSearchNodeIDs(nodes []knowledgeservice.KnowledgeNodeResult) []uint64 {
	ids := make([]uint64, 0, len(nodes))
	for _, node := range nodes {
		if node.ID > 0 {
			ids = append(ids, node.ID)
		}
	}
	return ids
}

func knowledgeSearchText(query string, nodes []knowledgeservice.KnowledgeNodeResult) string {
	query = strings.TrimSpace(query)
	if len(nodes) == 0 {
		if query == "" {
			return "暂时没有找到相关内容。"
		}
		return fmt.Sprintf("未找到与「%s」相关的内容。", query)
	}
	sections := make([]string, 0, len(nodes)+1)
	if query != "" {
		sections = append(sections, "问题："+query)
	}
	for index, node := range nodes {
		lines := []string{fmt.Sprintf("%d. %s", index+1, knowledgeNodeTitle(node))}
		if location := knowledgeNodeLocation(node); location != "" {
			lines = append(lines, "位置："+location)
		}
		if summary := knowledgeNodePreview(node, knowledgeSearchTextLimit); summary != "" {
			lines = append(lines, "内容："+summary)
		}
		sections = append(sections, strings.Join(lines, "\n"))
	}
	return strings.Join(sections, "\n\n")
}

func knowledgeNodeTitle(node knowledgeservice.KnowledgeNodeResult) string {
	return firstKnowledgeText(node.Title, node.Path, node.DirPath, fmt.Sprintf("相关内容 #%d", node.ID))
}

func knowledgeNodeLocation(node knowledgeservice.KnowledgeNodeResult) string {
	values := make([]string, 0, 2)
	if node.PageStart > 0 {
		if node.PageEnd > node.PageStart {
			values = append(values, fmt.Sprintf("第 %d-%d 页", node.PageStart, node.PageEnd))
		} else {
			values = append(values, fmt.Sprintf("第 %d 页", node.PageStart))
		}
	}
	if node.LineStart > 0 {
		if node.LineEnd > node.LineStart {
			values = append(values, fmt.Sprintf("第 %d-%d 行", node.LineStart, node.LineEnd))
		} else {
			values = append(values, fmt.Sprintf("第 %d 行", node.LineStart))
		}
	}
	return strings.Join(values, "，")
}

func knowledgeNodePreview(node knowledgeservice.KnowledgeNodeResult, limit int) string {
	return truncateText(firstKnowledgeText(node.Summary, node.PlainText, node.Content), limit)
}

func firstKnowledgeText(values ...string) string {
	for _, value := range values {
		if text := strings.TrimSpace(value); text != "" {
			return text
		}
	}
	return ""
}

func executeKnowledgeOpen(ctx context.Context, req Request) (map[string]any, error) {
	nodeID := knowledgeNodeIDFromInput(req.Action.Input)
	if nodeID == 0 {
		return nil, fmt.Errorf("打开内容节点需要提供 node_id")
	}
	result, err := knowledgeservice.NewService().OpenKnowledgeNode(ctx, nodeID)
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"node":     knowledgeNodeDetailFromResult(result.Node, knowledgeOpenTextLimit),
		"parents":  knowledgeNodeBriefs(result.Parents, 160),
		"children": knowledgeNodeBriefs(result.Children, 160),
		"siblings": knowledgeNodeBriefs(result.Siblings, 160),
		"related":  knowledgeNodeBriefs(result.Related, 160),
		"text":     knowledgeNodeFullText(result.Node, knowledgeOpenTextLimit),
	}, nil
}

func executeKnowledgeExpand(ctx context.Context, req Request) (map[string]any, error) {
	nodeID := knowledgeNodeIDFromInput(req.Action.Input)
	if nodeID == 0 {
		return nil, fmt.Errorf("展开内容节点需要提供 node_id")
	}
	depth := inputInt(firstPresent(req.Action.Input, "depth"), 1)
	result, err := knowledgeservice.NewService().ExpandKnowledgeNode(ctx, nodeID, depth)
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"node":     knowledgeNodeBriefFromResult(result.Node, 240),
		"parents":  knowledgeNodeBriefs(result.Parents, 120),
		"children": knowledgeNodeBriefs(result.Children, 180),
		"siblings": knowledgeNodeBriefs(result.Siblings, 120),
		"related":  knowledgeNodeBriefs(result.Related, 120),
		"text":     fmt.Sprintf("已展开相关内容，返回 %d 个子项。", len(result.Children)),
	}, nil
}

func executeKnowledgeRelated(ctx context.Context, req Request) (map[string]any, error) {
	nodeID := knowledgeNodeIDFromInput(req.Action.Input)
	if nodeID == 0 {
		return nil, fmt.Errorf("查找相关内容需要提供 node_id")
	}
	limit := inputInt(firstPresent(req.Action.Input, "limit"), 10)
	result, err := knowledgeservice.NewService().FindRelatedKnowledge(ctx, nodeID, knowledgeEdgeTypesFromInput(req.Action.Input), limit)
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"nodes": knowledgeNodeBriefs(result.Nodes, 220),
		"text":  fmt.Sprintf("已整理 %d 条相关内容。", len(result.Nodes)),
	}, nil
}

func executeKnowledgeDebug(ctx context.Context, req Request) (map[string]any, error) {
	query := inputText(firstPresent(req.Action.Input, "query", "text", "keyword"))
	if query == "" {
		return nil, fmt.Errorf("检索调试需要提供 query")
	}
	result, err := knowledgeservice.NewService().DebugRetrieve(ctx, knowledgeservice.RetrieveDebugRequest{
		AgentID: uint64(inputInt(firstPresent(req.Action.Input, "agent_id", "agentId"), 0)),
		BaseID:  knowledgeBaseIDFromInput(req.Action.Input),
		Query:   query,
		Limit:   inputInt(firstPresent(req.Action.Input, "limit"), 8),
	})
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"query":          result.Query,
		"knowledge_base": result.KnowledgeBase,
		"snippets":       knowledgeDebugSnippets(result.Snippets),
		"matches":        result.Matches,
		"source_counts":  result.SourceCounts,
		"plans":          result.Plans,
		"text":           fmt.Sprintf("调试完成，返回 %d 个候选片段。", len(result.Snippets)),
	}, nil
}

func knowledgeNodeBriefs(nodes []knowledgeservice.KnowledgeNodeResult, previewLimit int) []knowledgeNodeBrief {
	result := make([]knowledgeNodeBrief, 0, len(nodes))
	for _, node := range nodes {
		if node.ID == 0 {
			continue
		}
		result = append(result, knowledgeNodeBriefFromResult(node, previewLimit))
	}
	return result
}

func knowledgeTreeBriefs(nodes []knowledgeservice.KnowledgeTreeNode) []knowledgeNodeBrief {
	result := make([]knowledgeNodeBrief, 0, len(nodes))
	for _, node := range nodes {
		brief := knowledgeNodeBriefFromResult(node.KnowledgeNodeResult, 0)
		brief.ChildCount = node.ChildrenCount
		brief.HasChildren = node.ChildrenCount > 0 || len(node.Children) > 0
		brief.Children = knowledgeTreeBriefs(node.Children)
		result = append(result, brief)
	}
	return result
}

func knowledgeNodeBriefFromResult(node knowledgeservice.KnowledgeNodeResult, previewLimit int) knowledgeNodeBrief {
	brief := knowledgeNodeBrief{
		ID:        node.ID,
		BaseID:    node.BaseID,
		DirID:     node.DirID,
		DirPath:   strings.TrimSpace(node.DirPath),
		DocID:     node.DocID,
		ParentID:  node.ParentID,
		NodeType:  strings.TrimSpace(node.NodeType),
		Title:     strings.TrimSpace(knowledgeNodeTitle(node)),
		Path:      strings.TrimSpace(node.Path),
		Summary:   strings.TrimSpace(node.Summary),
		Keywords:  node.Keywords,
		PageStart: node.PageStart,
		PageEnd:   node.PageEnd,
		LineStart: node.LineStart,
		LineEnd:   node.LineEnd,
		Score:     node.Score,
	}
	if previewLimit > 0 {
		brief.Preview = knowledgeNodePreview(node, previewLimit)
	}
	return brief
}

func knowledgeNodeDetailFromResult(node knowledgeservice.KnowledgeNodeResult, textLimit int) knowledgeNodeDetail {
	return knowledgeNodeDetail{
		knowledgeNodeBrief: knowledgeNodeBriefFromResult(node, 0),
		Text:               knowledgeNodeFullText(node, textLimit),
	}
}

func knowledgeNodeFullText(node knowledgeservice.KnowledgeNodeResult, limit int) string {
	return truncateText(firstKnowledgeText(node.PlainText, node.Content, node.Summary), limit)
}

func knowledgeDebugSnippets(snippets []knowledgeservice.RetrievedSnippet) []map[string]any {
	result := make([]map[string]any, 0, len(snippets))
	for _, snippet := range snippets {
		row := map[string]any{
			"knowledge_base_id": snippet.BaseID,
			"doc_id":            snippet.DocID,
			"node_id":           snippet.NodeID,
			"title":             snippet.Title,
			"path":              snippet.Path,
			"score":             snippet.Score,
			"source":            snippet.Source,
			"preview":           truncateText(snippet.Content, knowledgeDebugSnippetLimit),
		}
		result = append(result, row)
	}
	return result
}

func knowledgeBaseIDFromInput(input map[string]any) uint64 {
	return uint64(inputInt(firstPresent(input, "knowledge_base_id", "knowledgeBaseId", "base_id", "baseId"), 0))
}

func knowledgeNodeIDFromInput(input map[string]any) uint64 {
	return uint64(inputInt(firstPresent(input, "node_id", "nodeId", "id"), 0))
}

func knowledgeEdgeTypesFromInput(input map[string]any) []string {
	raw := inputStringSlice(firstPresent(input, "edge_types", "edgeTypes", "edge_type", "edgeType"))
	result := make([]string, 0, len(raw))
	for _, item := range raw {
		for _, part := range strings.Split(item, ",") {
			if value := strings.TrimSpace(part); value != "" {
				result = append(result, value)
			}
		}
	}
	return result
}
