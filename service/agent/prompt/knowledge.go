package prompt

import (
	"fmt"
	"strings"
)

func knowledgePrompt(rows []KnowledgeSnippet) string {
	groups := groupKnowledgeSnippets(rows)
	if len(groups) == 0 {
		return ""
	}
	sections := make([]string, 0, len(groups)+1)
	sections = append(sections, "知识库资料:")
	for _, group := range groups {
		block := knowledgeGroupBlock(group)
		if block != "" {
			sections = append(sections, block)
		}
	}
	return strings.Join(sections, "\n\n")
}

func knowledgeToolPrompt(bases []KnowledgeBaseRuntime) string {
	bases = normalizeKnowledgeBaseRuntime(bases)
	if len(bases) == 0 {
		return ""
	}
	lines := []string{
		"知识库工具:",
		"- 已绑定知识库如下；遇到资料查询、制度问答、长文档精读、跨文档分析、写作参考时，优先使用知识库工具读取证据。",
		"- 推荐流程：list_knowledge_tree 看结构；search_knowledge_nodes 搜候选；open_knowledge_node 读取原文；expand_knowledge_node 展开上下文；find_related_knowledge 查相关节点。",
		"- 当召回结果不足、需要解释为什么命中某些资料，或需要调试检索计划时，使用 debug_knowledge_retrieval 查看规划、图谱扩展、来源统计和候选片段。",
		"- 回答时尽量引用知识节点的 path、doc_id、page_start 或 line_start，不要编造来源。",
		"- 可用工具: list_knowledge_tree, search_knowledge_nodes, open_knowledge_node, expand_knowledge_node, find_related_knowledge, debug_knowledge_retrieval。",
		"",
		"已绑定知识库:",
	}
	for _, base := range bases {
		line := fmt.Sprintf("- %s（knowledge_base_id: %d）", base.Name, base.ID)
		if base.Prompt != "" {
			line += "\n  使用提示词: " + base.Prompt
		}
		lines = append(lines, line)
	}
	lines = append(lines,
		"",
		"agent-action call_tool 示例:",
		"```agent-action",
		"{",
		`  "type": "call_tool",`,
		`  "tool": "search_knowledge_nodes",`,
		`  "input": {`,
		`    "knowledge_base_id": `+fmt.Sprintf("%d", bases[0].ID)+`,`,
		`    "query": "要查询的问题",`,
		`    "limit": 8`,
		"  }",
		"}",
		"```",
	)
	return strings.Join(lines, "\n")
}

func normalizeKnowledgeBaseRuntime(rows []KnowledgeBaseRuntime) []KnowledgeBaseRuntime {
	result := make([]KnowledgeBaseRuntime, 0, len(rows))
	seen := map[uint64]struct{}{}
	for _, row := range rows {
		if row.ID == 0 {
			continue
		}
		if _, exists := seen[row.ID]; exists {
			continue
		}
		seen[row.ID] = struct{}{}
		name := strings.TrimSpace(row.Name)
		if name == "" {
			name = fmt.Sprintf("知识库 #%d", row.ID)
		}
		result = append(result, KnowledgeBaseRuntime{
			ID:     row.ID,
			Name:   name,
			Prompt: strings.TrimSpace(row.Prompt),
		})
	}
	return result
}

type knowledgeSnippetGroup struct {
	BaseID   uint64
	BaseName string
	Prompt   string
	Rows     []KnowledgeSnippet
}

func groupKnowledgeSnippets(rows []KnowledgeSnippet) []knowledgeSnippetGroup {
	groupIndex := make(map[uint64]int)
	groups := make([]knowledgeSnippetGroup, 0)
	for _, row := range rows {
		content := strings.TrimSpace(row.Content)
		if content == "" {
			continue
		}
		key := row.BaseID
		index, exists := groupIndex[key]
		if !exists {
			index = len(groups)
			groupIndex[key] = index
			groups = append(groups, knowledgeSnippetGroup{
				BaseID:   row.BaseID,
				BaseName: strings.TrimSpace(row.BaseName),
				Prompt:   strings.TrimSpace(row.Prompt),
			})
		}
		groups[index].Rows = append(groups[index].Rows, row)
	}
	return groups
}

func knowledgeGroupBlock(group knowledgeSnippetGroup) string {
	if len(group.Rows) == 0 {
		return ""
	}
	parts := make([]string, 0, len(group.Rows)+2)
	title := group.BaseName
	if title == "" {
		title = fmt.Sprintf("知识库 #%d", group.BaseID)
	}
	parts = append(parts, "## "+title)
	if group.Prompt != "" {
		parts = append(parts, "使用提示词:\n"+group.Prompt)
	}
	for _, row := range group.Rows {
		content := strings.TrimSpace(row.Content)
		if content == "" {
			continue
		}
		meta := knowledgeSnippetMeta(row)
		if meta != "" {
			content = meta + "\n" + content
		}
		parts = append(parts, "### "+knowledgeSnippetTitle(row)+"\n"+content)
	}
	if len(parts) <= 1 {
		return ""
	}
	return strings.Join(parts, "\n\n")
}

func knowledgeSnippetTitle(row KnowledgeSnippet) string {
	title := strings.TrimSpace(row.Title)
	if title == "" {
		title = fmt.Sprintf("知识节点 #%d", row.NodeID)
	}
	if row.Score > 0 {
		return fmt.Sprintf("%s（匹配度 %.3f）", title, row.Score)
	}
	return title
}

func knowledgeSnippetMeta(row KnowledgeSnippet) string {
	parts := make([]string, 0, 2)
	if path := strings.TrimSpace(row.DirPath); path != "" {
		parts = append(parts, "[目录: "+path+"]")
	}
	if title := strings.TrimSpace(row.Title); title != "" {
		parts = append(parts, "[文档: "+title+"]")
	}
	return strings.Join(parts, "\n")
}
