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
			KnowledgeNodeExpandToolName,
			"知识库节点",
			"展开指定知识节点的子级。",
			knowledgeParameters(baseProperty, required, map[string]any{
				"node_id": integerProperty("节点搜索或知识树返回的 node_id"),
				"depth":   integerProperty("展开层数"),
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
			KnowledgeNodeRelatedToolName,
			"关联知识",
			"查找指定知识节点的关联内容。",
			knowledgeParameters(baseProperty, required, map[string]any{
				"node_id": integerProperty("节点搜索或知识树返回的 node_id"),
				"edge_types": map[string]any{
					"type":        "array",
					"description": "关联类型",
					"items":       map[string]any{"type": "string"},
				},
				"limit": integerProperty("最多返回数量"),
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
