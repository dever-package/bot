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
		title = fmt.Sprintf("知识片段 #%d", row.ChunkID)
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
