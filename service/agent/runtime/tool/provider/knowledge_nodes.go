package provider

import (
	"context"
	"fmt"

	knowledgeservice "github.com/dever-package/bot/service/agent/knowledge"
)

const (
	knowledgeSearchPreviewRunes = 360
	knowledgeOpenTextRunes      = 4000
)

func knowledgeNodeTools(
	service knowledgeservice.Service,
	allowed map[uint64]knowledgeservice.KnowledgeBaseRuntime,
	baseProperty map[string]any,
	required []any,
) []Tool {
	return []Tool{
		knowledgeTreeTool(service, allowed, baseProperty, required),
		knowledgeNodeSearchTool(service, allowed, baseProperty, required),
		knowledgeNodeOpenTool(service, allowed, baseProperty, required),
		knowledgeNodeExpandTool(service, allowed, baseProperty, required),
		knowledgeNodeRelatedTool(service, allowed, baseProperty, required),
	}
}

func knowledgeTreeTool(service knowledgeservice.Service, allowed map[uint64]knowledgeservice.KnowledgeBaseRuntime, baseProperty map[string]any, required []any) Tool {
	return Tool{
		Definition: knowledgeToolDefinition(
			"list_knowledge_tree",
			"知识库结构",
			"浏览知识库节点结构。",
			knowledgeParameters(baseProperty, required, map[string]any{
				"parent_id": integerProperty("父节点 ID"),
				"depth":     integerProperty("展开层数"),
				"limit":     integerProperty("最多返回数量"),
			}),
		),
		Handle: func(ctx context.Context, call Call) (Result, error) {
			base, err := resolveKnowledgeBase(call.Arguments, allowed)
			if err != nil {
				return Result{}, err
			}
			result, err := service.ListKnowledgeTree(
				ctx,
				base.ID,
				ArgumentUint64(call.Arguments, "parent_id"),
				ArgumentInt(call.Arguments, "depth", 2),
				ArgumentInt(call.Arguments, "limit", 120),
			)
			if err != nil {
				return Result{}, err
			}
			return Result{
				Text: fmt.Sprintf("已读取知识库结构，返回 %d 个顶层节点", len(result.Nodes)),
				Content: map[string]any{
					"knowledge_base": knowledgeBaseRef(base),
					"nodes":          knowledgeTreeViews(result.Nodes),
				},
			}, nil
		},
	}
}

func knowledgeNodeSearchTool(service knowledgeservice.Service, allowed map[uint64]knowledgeservice.KnowledgeBaseRuntime, baseProperty map[string]any, required []any) Tool {
	required = appendRequired(required, "query")
	return Tool{
		Definition: knowledgeToolDefinition(
			"search_knowledge_nodes",
			"知识库搜索",
			"检索与当前问题相关的知识节点。",
			knowledgeParameters(baseProperty, required, map[string]any{
				"query": map[string]any{"type": "string", "description": "检索内容"},
				"limit": integerProperty("最多返回数量"),
			}),
		),
		Handle: func(ctx context.Context, call Call) (Result, error) {
			base, err := resolveKnowledgeBase(call.Arguments, allowed)
			if err != nil {
				return Result{}, err
			}
			query := argumentText(call.Arguments, "query")
			if query == "" {
				return Result{}, fmt.Errorf("搜索内容需要提供 query")
			}
			result, err := service.SearchKnowledgeNodes(ctx, base.ID, query, ArgumentInt(call.Arguments, "limit", 8))
			if err != nil {
				return Result{}, err
			}
			return Result{
				Text: fmt.Sprintf("找到 %d 条相关知识", len(result.Nodes)),
				Content: map[string]any{
					"knowledge_base": knowledgeBaseRef(base),
					"query":          query,
					"nodes":          knowledgeNodeViews(result.Nodes, knowledgeSearchPreviewRunes, false),
				},
			}, nil
		},
	}
}

func knowledgeNodeOpenTool(service knowledgeservice.Service, allowed map[uint64]knowledgeservice.KnowledgeBaseRuntime, baseProperty map[string]any, required []any) Tool {
	required = appendRequired(required, "node_id")
	return Tool{
		Definition: knowledgeToolDefinition(
			"open_knowledge_node",
			"知识库节点",
			"读取指定知识节点正文及关系。",
			knowledgeParameters(baseProperty, required, map[string]any{
				"node_id": integerProperty("知识节点 ID"),
			}),
		),
		Handle: func(ctx context.Context, call Call) (Result, error) {
			base, result, err := openMountedKnowledgeNode(ctx, service, allowed, call.Arguments)
			if err != nil {
				return Result{}, err
			}
			return Result{
				Text: "已读取知识节点: " + knowledgeNodeName(result.Node),
				Content: map[string]any{
					"knowledge_base": knowledgeBaseRef(base),
					"node":           knowledgeNodeViewFromResult(result.Node, knowledgeOpenTextRunes, true),
					"parents":        knowledgeNodeViews(result.Parents, 160, false),
					"children":       knowledgeNodeViews(result.Children, 160, false),
					"siblings":       knowledgeNodeViews(result.Siblings, 160, false),
					"related":        knowledgeNodeViews(result.Related, 160, false),
				},
			}, nil
		},
	}
}
