package provider

import (
	"context"
	"fmt"

	knowledgeservice "github.com/dever-package/bot/service/agent/knowledge"
)

func knowledgeNodeExpandTool(service knowledgeservice.Service, allowed map[uint64]knowledgeservice.KnowledgeBaseRuntime, baseProperty map[string]any, required []any) Tool {
	required = appendRequired(required, "node_id")
	return Tool{
		Definition: knowledgeToolDefinition(
			"expand_knowledge_node",
			"知识库节点",
			"展开知识节点的多层子节点，用于继续浏览章节结构。",
			knowledgeParameters(baseProperty, required, map[string]any{
				"node_id": integerProperty("要展开的知识节点 ID"),
				"depth":   integerProperty("展开层数，默认 1，最大 3"),
			}),
		),
		Handle: func(ctx context.Context, call Call) (Result, error) {
			base, opened, err := openMountedKnowledgeNode(ctx, service, allowed, call.Arguments)
			if err != nil {
				return Result{}, err
			}
			result, err := service.ExpandKnowledgeNode(ctx, opened.Node.ID, ArgumentInt(call.Arguments, "depth", 1))
			if err != nil {
				return Result{}, err
			}
			return Result{
				Text: fmt.Sprintf("已展开知识节点，返回 %d 个子节点", len(result.Children)),
				Content: map[string]any{
					"knowledge_base": knowledgeBaseRef(base),
					"node":           knowledgeNodeViewFromResult(result.Node, 240, false),
					"parents":        knowledgeNodeViews(result.Parents, 120, false),
					"children":       knowledgeNodeViews(result.Children, 180, false),
					"siblings":       knowledgeNodeViews(result.Siblings, 120, false),
					"related":        knowledgeNodeViews(result.Related, 120, false),
				},
			}, nil
		},
	}
}

func knowledgeNodeRelatedTool(service knowledgeservice.Service, allowed map[uint64]knowledgeservice.KnowledgeBaseRuntime, baseProperty map[string]any, required []any) Tool {
	required = appendRequired(required, "node_id")
	return Tool{
		Definition: knowledgeToolDefinition(
			"find_related_knowledge",
			"关联知识",
			"查找与指定知识节点有关联的其他节点。",
			knowledgeParameters(baseProperty, required, map[string]any{
				"node_id": integerProperty("起始知识节点 ID"),
				"edge_types": map[string]any{
					"type":        "array",
					"description": "可选的关联类型过滤",
					"items":       map[string]any{"type": "string"},
				},
				"limit": integerProperty("最多返回条数，默认 10，最大 50"),
			}),
		),
		Handle: func(ctx context.Context, call Call) (Result, error) {
			base, opened, err := openMountedKnowledgeNode(ctx, service, allowed, call.Arguments)
			if err != nil {
				return Result{}, err
			}
			result, err := service.FindRelatedKnowledge(
				ctx,
				opened.Node.ID,
				argumentStrings(call.Arguments["edge_types"]),
				ArgumentInt(call.Arguments, "limit", 10),
			)
			if err != nil {
				return Result{}, err
			}
			return Result{
				Text: fmt.Sprintf("找到 %d 条相关知识", len(result.Nodes)),
				Content: map[string]any{
					"knowledge_base": knowledgeBaseRef(base),
					"nodes":          knowledgeNodeViews(result.Nodes, 220, false),
				},
			}, nil
		},
	}
}

func knowledgeDebugTool(service knowledgeservice.Service, allowed map[uint64]knowledgeservice.KnowledgeBaseRuntime, baseProperty map[string]any, required []any) Tool {
	required = appendRequired(required, "query")
	return Tool{
		Definition: knowledgeToolDefinition(
			"debug_knowledge_retrieval",
			"知识库检索诊断",
			"查看知识检索候选、来源和规划信息；仅在普通检索结果异常时使用。",
			knowledgeParameters(baseProperty, required, map[string]any{
				"query": map[string]any{"type": "string", "description": "要调试的检索问题"},
				"limit": integerProperty("最多返回候选数，默认 8"),
			}),
		),
		Handle: func(ctx context.Context, call Call) (Result, error) {
			base, err := resolveKnowledgeBase(call.Arguments, allowed)
			if err != nil {
				return Result{}, err
			}
			query := argumentText(call.Arguments, "query")
			if query == "" {
				return Result{}, fmt.Errorf("检索调试需要提供 query")
			}
			result, err := service.DebugRetrieve(ctx, knowledgeservice.RetrieveDebugRequest{
				BaseID: base.ID,
				Query:  query,
				Limit:  ArgumentInt(call.Arguments, "limit", 8),
			})
			if err != nil {
				return Result{}, err
			}
			return Result{
				Text: fmt.Sprintf("检索调试完成，返回 %d 个候选片段", len(result.Snippets)),
				Content: map[string]any{
					"knowledge_base": result.KnowledgeBase,
					"query":          result.Query,
					"snippets":       knowledgeDebugSnippets(result.Snippets),
					"matches":        result.Matches,
					"source_counts":  result.SourceCounts,
					"plans":          result.Plans,
				},
			}, nil
		},
	}
}

func openMountedKnowledgeNode(
	ctx context.Context,
	service knowledgeservice.Service,
	allowed map[uint64]knowledgeservice.KnowledgeBaseRuntime,
	arguments map[string]any,
) (knowledgeservice.KnowledgeBaseRuntime, knowledgeservice.KnowledgeNodeOpenResult, error) {
	base, err := resolveKnowledgeBase(arguments, allowed)
	if err != nil {
		return knowledgeservice.KnowledgeBaseRuntime{}, knowledgeservice.KnowledgeNodeOpenResult{}, err
	}
	nodeID, err := requireKnowledgeNodeID(arguments)
	if err != nil {
		return knowledgeservice.KnowledgeBaseRuntime{}, knowledgeservice.KnowledgeNodeOpenResult{}, err
	}
	result, err := service.OpenKnowledgeNode(ctx, nodeID)
	if err != nil {
		return knowledgeservice.KnowledgeBaseRuntime{}, knowledgeservice.KnowledgeNodeOpenResult{}, err
	}
	if err := validateKnowledgeNodeBase(result.Node, base); err != nil {
		return knowledgeservice.KnowledgeBaseRuntime{}, knowledgeservice.KnowledgeNodeOpenResult{}, err
	}
	return base, result, nil
}

func requireKnowledgeNodeID(arguments map[string]any) (uint64, error) {
	nodeID := ArgumentUint64(arguments, "node_id")
	if nodeID == 0 {
		return 0, fmt.Errorf("需要提供 node_id")
	}
	return nodeID, nil
}

func validateKnowledgeNodeBase(node knowledgeservice.KnowledgeNodeResult, base knowledgeservice.KnowledgeBaseRuntime) error {
	if node.BaseID != base.ID {
		return fmt.Errorf("知识节点不属于当前挂载知识库")
	}
	return nil
}
