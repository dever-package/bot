package provider

import (
	"context"
	"fmt"
	"strconv"
	"strings"
	"time"

	knowledgeservice "github.com/dever-package/bot/service/agent/knowledge"
)

func KnowledgeTools(bases []knowledgeservice.KnowledgeBaseRuntime) []Tool {
	allowed := make(map[uint64]knowledgeservice.KnowledgeBaseRuntime, len(bases))
	for _, base := range bases {
		if base.ID > 0 {
			allowed[base.ID] = base
		}
	}
	if len(allowed) == 0 {
		return nil
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
	return tools
}

func knowledgeInitTool(service knowledgeservice.Service, allowed map[uint64]knowledgeservice.KnowledgeBaseRuntime, baseProperty map[string]any, required []any) Tool {
	return Tool{
		Definition: knowledgeToolDefinition(
			"open_knowledge_init",
			"知识库说明",
			"读取知识库入口说明。",
			knowledgeParameters(baseProperty, required, map[string]any{
				"max_chars": integerProperty("最多读取字符数"),
			}),
		),
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
		Definition: knowledgeToolDefinition(
			"list_knowledge_files",
			"知识库文件",
			"列出知识库文件和目录。",
			knowledgeParameters(baseProperty, required, map[string]any{
				"limit": integerProperty("最多返回数量"),
			}),
		),
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
		Definition: knowledgeToolDefinition(
			"search_knowledge_files",
			"知识库搜索",
			"按关键词搜索知识库文件。",
			knowledgeParameters(baseProperty, required, map[string]any{
				"query": map[string]any{"type": "string", "description": "搜索内容"},
				"limit": integerProperty("最多返回数量"),
			}),
		),
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
		Definition: knowledgeToolDefinition(
			"read_knowledge_file",
			"知识库文件",
			"读取指定知识库文件正文。",
			knowledgeParameters(baseProperty, required, map[string]any{
				"path":      map[string]any{"type": "string", "description": "文件 ID 或相对路径"},
				"max_chars": integerProperty("最多读取字符数"),
			}),
		),
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

func knowledgeToolDefinition(name string, title string, description string, parameters map[string]any) Definition {
	return Definition{
		Name:        name,
		Title:       title,
		Kind:        "knowledge",
		Description: description,
		Parameters:  parameters,
		Execution: ExecutionPolicy{
			ReuseSuccessfulArguments: true,
			Timeout:                  90 * time.Second,
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
			line := strconv.FormatUint(base.ID, 10) + "=" + strings.TrimSpace(base.Name)
			if usage := strings.TrimSpace(base.Prompt); usage != "" {
				line += "（" + usage + "）"
			}
			lines = append(lines, line)
		}
	}
	property := map[string]any{
		"type":        "integer",
		"description": "知识库 ID：" + strings.Join(lines, ", "),
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
	result := map[string]any{
		"type":                 "object",
		"properties":           properties,
		"additionalProperties": false,
	}
	if len(required) > 0 {
		result["required"] = required
	}
	return result
}

func integerProperty(description string) map[string]any {
	return map[string]any{"type": "integer", "description": description}
}
