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
	sections := make([]string, 0, 6)
	sections = appendNonEmpty(sections, knowledgeToolPolicyPrompt())
	sections = appendNonEmpty(sections, knowledgeRetrievalWorkflowPrompt())
	sections = appendNonEmpty(sections, knowledgeAnswerPolicyPrompt())
	sections = appendNonEmpty(sections, knowledgeAvailableToolsPrompt())
	sections = appendNonEmpty(sections, knowledgeBaseListPrompt(bases))
	sections = appendNonEmpty(sections, knowledgeToolExamplePrompt(bases[0].ID))
	return strings.Join(sections, "\n")
}

func knowledgeToolPolicyPrompt() string {
	return strings.Join([]string{
		"知识库工具:",
		"- 已绑定知识库如下；遇到资料查询、制度问答、长文档精读、跨文档分析、写作参考时，优先使用知识库工具读取证据。",
	}, "\n")
}

func knowledgeRetrievalWorkflowPrompt() string {
	return strings.Join([]string{
		"- 原文读取默认可用，不依赖索引。进入知识库先尝试 open_knowledge_init；没有 init.md 时用 list_knowledge_files 看文件，再用 search_knowledge_files 或 read_knowledge_file 读取原文。",
		"- 需要召回候选时使用 search_knowledge_nodes；命中片段只是候选，关键事实要用 open_knowledge_node 或 read_knowledge_file 回读原文确认。",
		"- 智能增强知识库可结合 expand_knowledge_node、find_related_knowledge 和 debug_knowledge_retrieval 查看规划、图谱扩展、来源统计和候选片段；轻量检索下不要依赖图谱或规划。",
	}, "\n")
}

func knowledgeAnswerPolicyPrompt() string {
	return strings.Join([]string{
		"- 工具返回的是内部依据；最终回答要根据用户问题重新组织成自然、结构化的答案，不要直接复述检索结果列表。",
		"- 基于知识库回答时优先使用 Markdown：先给一句结论，再按 2 到 5 个小节分段；细节用列表或表格承载。",
		"- 不要把多个编号项、短横线要点或费用说明压在同一个段落里；每个编号、小节和要点都要独立换行。",
		"- 普通知识问答直接输出 Markdown 正文；只有用户明确要求生成正式交付物、可编辑长文或素材任务时才使用 agent-result。",
		"- 默认不要在最终回答中说明内容来自知识库，也不要展示 path、doc_id、page_start、line_start 等内部来源字段；只有用户明确要求出处或溯源时才提供。",
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
		"agent-action call_tool 示例:",
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
	}, "\n")
}
