package prompt

import (
	"fmt"
	"strings"
)

const knowledgeToolNames = "open_knowledge_init, list_knowledge_files, search_knowledge_files, read_knowledge_file, list_knowledge_tree, search_knowledge_nodes, open_knowledge_node, expand_knowledge_node, find_related_knowledge, debug_knowledge_retrieval"

func knowledgeToolPrompt(bases []KnowledgeBaseRuntime) string {
	bases = normalizeKnowledgeBaseRuntime(bases)
	if len(bases) == 0 {
		return ""
	}
	sections := make([]string, 0, 4)
	sections = appendNonEmpty(sections, knowledgeToolPolicyPrompt())
	sections = appendNonEmpty(sections, knowledgeAvailableToolsPrompt())
	sections = appendNonEmpty(sections, knowledgeBaseListPrompt(bases))
	sections = appendNonEmpty(sections, knowledgeToolExamplePrompt(bases[0].ID))
	return strings.Join(sections, "\n")
}

func knowledgeToolPolicyPrompt() string {
	return strings.Join([]string{
		"知识库工具:",
		"- 资料查询、制度问答、长文档精读、跨文档分析、写作参考，先读取知识库证据；表单选中知识库相关项后，继续生成前也要回读原文或节点。",
		"- 原文读取不依赖索引：先 open_knowledge_init；没有 init.md 时 list_knowledge_files，再 search_knowledge_files/read_knowledge_file。",
		"- read_knowledge_file 必须传 knowledge_base_id 和 path/id；多个固定文件用 paths/ids 批量读，max_chars 默认不超过 4000。不要把 doc_id 当原文读取参数。",
		"- 命中片段只是候选；关键事实用 open_knowledge_node 或 read_knowledge_file 回读确认。已读过的 observation 足够时不要重复读取。",
		"- 最终回答重新组织成自然结构化内容；默认不暴露 path、doc_id、page_start、line_start，除非用户要求出处。",
	}, "\n")
}

func knowledgeAvailableToolsPrompt() string {
	return "- 可用工具: " + knowledgeToolNames + "。"
}

func knowledgeBaseListPrompt(bases []KnowledgeBaseRuntime) string {
	lines := []string{"", "已绑定知识库:"}
	for _, base := range bases {
		lines = append(lines, knowledgeBaseLine(base))
	}
	return strings.Join(lines, "\n")
}

func knowledgeBaseLine(base KnowledgeBaseRuntime) string {
	line := fmt.Sprintf("- %s（knowledge_base_id: %d）", base.Name, base.ID)
	if base.Prompt != "" {
		line += "\n  使用提示词: " + base.Prompt
	}
	return line
}

func knowledgeToolExamplePrompt(baseID uint64) string {
	return strings.Join([]string{
		"",
		"call_tool 示例:",
		"```agent-action",
		"{",
		`  "type": "call_tool",`,
		`  "tool": "search_knowledge_files",`,
		`  "input": {`,
		fmt.Sprintf(`    "knowledge_base_id": %d,`, baseID),
		`    "query": "要查询的问题",`,
		`    "limit": 8`,
		"  }",
		"}",
		"```",
		"读取原文时将 tool 改为 read_knowledge_file，并传 paths 或 ids。",
	}, "\n")
}
