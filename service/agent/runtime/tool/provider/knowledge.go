package provider

import (
	"context"
	"fmt"
	"strconv"
	"strings"

	knowledgeservice "github.com/dever-package/bot/service/agent/knowledge"
)

func KnowledgeTools(bases []knowledgeservice.KnowledgeBaseRuntime) ([]Tool, string) {
	allowed := make(map[uint64]knowledgeservice.KnowledgeBaseRuntime, len(bases))
	for _, base := range bases {
		if base.ID > 0 {
			allowed[base.ID] = base
		}
	}
	if len(allowed) == 0 {
		return nil, ""
	}
	service := knowledgeservice.NewService()
	baseProperty, required := knowledgeBaseProperty(bases)
	tools := []Tool{
		knowledgeInitTool(service, allowed, baseProperty, required),
		knowledgeListTool(service, allowed, baseProperty, required),
		knowledgeSearchTool(service, allowed, baseProperty, required),
		knowledgeReadTool(service, allowed, baseProperty, required),
	}
	tools = append(tools, knowledgeNodeTools(service, allowed, baseProperty, required)...)
	return tools, knowledgePrompt(bases)
}

func knowledgeInitTool(service knowledgeservice.Service, allowed map[uint64]knowledgeservice.KnowledgeBaseRuntime, baseProperty map[string]any, required []any) Tool {
	return Tool{
		Definition: Definition{
			Name:        "open_knowledge_init",
			Description: "读取知识库根目录的 init.md，优先了解知识库结构和使用说明。",
			Parameters: knowledgeParameters(baseProperty, required, map[string]any{
				"max_chars": integerProperty("最多读取字符数，默认 8000"),
			}),
		},
		Handle: func(ctx context.Context, call Call) (Result, error) {
			base, err := resolveKnowledgeBase(call.Arguments, allowed)
			if err != nil {
				return Result{}, err
			}
			content, exists, err := service.OpenKnowledgeInitFile(ctx, base.ID, ArgumentInt(call.Arguments, "max_chars", 8000))
			if err != nil {
				return Result{}, err
			}
			if !exists {
				return Result{Text: "知识库没有 init.md", Content: map[string]any{"knowledge_base": knowledgeBaseRef(base), "exists": false}}, nil
			}
			return Result{Text: "已读取知识库初始化说明", Content: map[string]any{"knowledge_base": knowledgeBaseRef(base), "file": content}}, nil
		},
	}
}

func knowledgeListTool(service knowledgeservice.Service, allowed map[uint64]knowledgeservice.KnowledgeBaseRuntime, baseProperty map[string]any, required []any) Tool {
	return Tool{
		Definition: Definition{
			Name:        "list_knowledge_files",
			Description: "列出知识库中的目录和文件。需要了解有哪些资料时使用。",
			Parameters: knowledgeParameters(baseProperty, required, map[string]any{
				"limit": integerProperty("最多返回条数，默认 120，最大 300"),
			}),
		},
		Handle: func(ctx context.Context, call Call) (Result, error) {
			base, err := resolveKnowledgeBase(call.Arguments, allowed)
			if err != nil {
				return Result{}, err
			}
			files, err := service.ListKnowledgeRuntimeFiles(ctx, base.ID, ArgumentInt(call.Arguments, "limit", 120))
			if err != nil {
				return Result{}, err
			}
			return Result{Text: fmt.Sprintf("找到 %d 个知识库文件", len(files)), Content: map[string]any{"knowledge_base": knowledgeBaseRef(base), "files": files}}, nil
		},
	}
}

func knowledgeSearchTool(service knowledgeservice.Service, allowed map[uint64]knowledgeservice.KnowledgeBaseRuntime, baseProperty map[string]any, required []any) Tool {
	required = append(append([]any{}, required...), "query")
	return Tool{
		Definition: Definition{
			Name:        "search_knowledge_files",
			Description: "按关键词搜索知识库文本文件，并返回路径和相关内容预览。",
			Parameters: knowledgeParameters(baseProperty, required, map[string]any{
				"query": map[string]any{"type": "string", "description": "搜索关键词或短语"},
				"limit": integerProperty("最多返回条数，默认 8，最大 20"),
			}),
		},
		Handle: func(ctx context.Context, call Call) (Result, error) {
			base, err := resolveKnowledgeBase(call.Arguments, allowed)
			if err != nil {
				return Result{}, err
			}
			query := argumentText(call.Arguments, "query")
			hits, err := service.SearchKnowledgeRuntimeFiles(ctx, base.ID, query, ArgumentInt(call.Arguments, "limit", 8))
			if err != nil {
				return Result{}, err
			}
			return Result{Text: fmt.Sprintf("找到 %d 条知识库匹配", len(hits)), Content: map[string]any{"knowledge_base": knowledgeBaseRef(base), "query": query, "matches": hits}}, nil
		},
	}
}

func knowledgeReadTool(service knowledgeservice.Service, allowed map[uint64]knowledgeservice.KnowledgeBaseRuntime, baseProperty map[string]any, required []any) Tool {
	required = append(append([]any{}, required...), "path")
	return Tool{
		Definition: Definition{
			Name:        "read_knowledge_file",
			Description: "按 list/search 返回的文件 id 或 path 读取知识库文件正文。",
			Parameters: knowledgeParameters(baseProperty, required, map[string]any{
				"path":      map[string]any{"type": "string", "description": "文件 id 或相对路径"},
				"max_chars": integerProperty("最多读取字符数，默认 8000，最大 24000"),
			}),
		},
		Handle: func(ctx context.Context, call Call) (Result, error) {
			base, err := resolveKnowledgeBase(call.Arguments, allowed)
			if err != nil {
				return Result{}, err
			}
			path := argumentText(call.Arguments, "path")
			content, err := service.ReadKnowledgeRuntimeFile(ctx, base.ID, path, ArgumentInt(call.Arguments, "max_chars", 8000))
			if err != nil {
				return Result{}, err
			}
			return Result{Text: "已读取知识库文件: " + content.Path, Content: map[string]any{"knowledge_base": knowledgeBaseRef(base), "file": content}}, nil
		},
	}
}

func knowledgeBaseRef(base knowledgeservice.KnowledgeBaseRuntime) map[string]any {
	return map[string]any{"id": base.ID, "name": strings.TrimSpace(base.Name)}
}

func resolveKnowledgeBase(arguments map[string]any, allowed map[uint64]knowledgeservice.KnowledgeBaseRuntime) (knowledgeservice.KnowledgeBaseRuntime, error) {
	baseID := ArgumentUint64(arguments, "knowledge_base_id")
	if baseID == 0 && len(allowed) == 1 {
		for _, base := range allowed {
			return base, nil
		}
	}
	base, exists := allowed[baseID]
	if !exists {
		return knowledgeservice.KnowledgeBaseRuntime{}, fmt.Errorf("知识库 %d 未挂载到当前智能体", baseID)
	}
	return base, nil
}

func knowledgeBaseProperty(bases []knowledgeservice.KnowledgeBaseRuntime) (map[string]any, []any) {
	lines := make([]string, 0, len(bases))
	for _, base := range bases {
		if base.ID > 0 {
			lines = append(lines, strconv.FormatUint(base.ID, 10)+"="+strings.TrimSpace(base.Name))
		}
	}
	property := map[string]any{
		"type":        "integer",
		"description": "知识库 ID，可用值: " + strings.Join(lines, ", "),
	}
	if len(lines) <= 1 {
		return property, nil
	}
	return property, []any{"knowledge_base_id"}
}

func knowledgeParameters(baseProperty map[string]any, required []any, extra map[string]any) map[string]any {
	properties := map[string]any{"knowledge_base_id": baseProperty}
	for key, value := range extra {
		properties[key] = value
	}
	return map[string]any{
		"type":                 "object",
		"properties":           properties,
		"required":             required,
		"additionalProperties": false,
	}
}

func integerProperty(description string) map[string]any {
	return map[string]any{"type": "integer", "description": description}
}

func knowledgePrompt(bases []knowledgeservice.KnowledgeBaseRuntime) string {
	lines := []string{
		"知识库使用规则：",
		"- 回答依赖知识库事实时先检索证据；关键事实再用 read_knowledge_file 或 open_knowledge_node 回读确认。",
		"- 优先 open_knowledge_init 了解结构；没有 init.md 时使用 list/search/read_knowledge_files。",
		"- 已有工具结果足够时不要重复读取，最终回答默认不暴露内部 ID 和路径。",
		"已挂载知识库（不要猜测未挂载 ID）：",
	}
	for _, base := range bases {
		if base.ID == 0 {
			continue
		}
		line := fmt.Sprintf("- id=%d, name=%s", base.ID, strings.TrimSpace(base.Name))
		if prompt := strings.TrimSpace(base.Prompt); prompt != "" {
			line += ", usage=" + prompt
		}
		lines = append(lines, line)
	}
	return strings.Join(lines, "\n")
}
