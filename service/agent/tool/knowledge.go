package tool

import (
	"context"
	"fmt"
	"strings"

	knowledgeservice "my/package/bot/service/agent/knowledge"
)

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
		"nodes": result.Nodes,
		"text":  fmt.Sprintf("已读取知识库结构树，返回 %d 个顶层节点。", len(result.Nodes)),
	}, nil
}

func executeKnowledgeSearch(ctx context.Context, req Request) (map[string]any, error) {
	baseID := knowledgeBaseIDFromInput(req.Action.Input)
	query := inputText(firstPresent(req.Action.Input, "query", "text", "keyword"))
	if query == "" {
		return nil, fmt.Errorf("搜索知识节点需要提供 query")
	}
	limit := inputInt(firstPresent(req.Action.Input, "limit"), 8)
	result, err := knowledgeservice.NewService().SearchKnowledgeNodes(ctx, baseID, query, limit)
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"nodes":            result.Nodes,
		"hit_node_ids":     knowledgeSearchNodeIDs(result.Nodes),
		"query":            query,
		"knowledge_base_id": baseID,
		"text":             fmt.Sprintf("知识库搜索完成，命中 %d 个节点。", len(result.Nodes)),
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

func executeKnowledgeOpen(ctx context.Context, req Request) (map[string]any, error) {
	nodeID := knowledgeNodeIDFromInput(req.Action.Input)
	if nodeID == 0 {
		return nil, fmt.Errorf("打开知识节点需要提供 node_id")
	}
	result, err := knowledgeservice.NewService().OpenKnowledgeNode(ctx, nodeID)
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"node":     result.Node,
		"parents":  result.Parents,
		"children": result.Children,
		"siblings": result.Siblings,
		"related":  result.Related,
		"text":     result.Node.PlainText,
	}, nil
}

func executeKnowledgeExpand(ctx context.Context, req Request) (map[string]any, error) {
	nodeID := knowledgeNodeIDFromInput(req.Action.Input)
	if nodeID == 0 {
		return nil, fmt.Errorf("展开知识节点需要提供 node_id")
	}
	depth := inputInt(firstPresent(req.Action.Input, "depth"), 1)
	result, err := knowledgeservice.NewService().ExpandKnowledgeNode(ctx, nodeID, depth)
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"node":     result.Node,
		"parents":  result.Parents,
		"children": result.Children,
		"siblings": result.Siblings,
		"related":  result.Related,
		"text":     fmt.Sprintf("已展开知识节点，返回 %d 个子孙节点。", len(result.Children)),
	}, nil
}

func executeKnowledgeRelated(ctx context.Context, req Request) (map[string]any, error) {
	nodeID := knowledgeNodeIDFromInput(req.Action.Input)
	if nodeID == 0 {
		return nil, fmt.Errorf("查找相关知识需要提供 node_id")
	}
	limit := inputInt(firstPresent(req.Action.Input, "limit"), 10)
	result, err := knowledgeservice.NewService().FindRelatedKnowledge(ctx, nodeID, knowledgeEdgeTypesFromInput(req.Action.Input), limit)
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"nodes": result.Nodes,
		"text":  fmt.Sprintf("已找到 %d 个相关知识节点。", len(result.Nodes)),
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
		"snippets":       result.Snippets,
		"matches":        result.Matches,
		"source_counts":  result.SourceCounts,
		"plans":          result.Plans,
		"text":           fmt.Sprintf("检索调试完成，返回 %d 个候选片段。", len(result.Snippets)),
	}, nil
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
