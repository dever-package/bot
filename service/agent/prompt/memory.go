package prompt

import (
	"fmt"
	"strings"
)

func memoryPrompt(memories []MemorySnippet) string {
	return BuildMemoryPrompt(memories)
}

func BuildMemoryPrompt(memories []MemorySnippet) string {
	if len(memories) == 0 {
		return ""
	}
	lines := []string{
		"长期记忆:",
		"系统沉淀的长期偏好、项目约束和常用规则；优先级低于本次用户输入和系统规则。信息不足时仍先收集，不要用记忆补齐关键任务参数。",
	}
	for _, memory := range memories {
		title := truncatePromptText(memory.Title, 96)
		content := truncatePromptText(memory.Content, 700)
		if title == "" && content == "" {
			continue
		}
		if title == "" {
			title = fmt.Sprintf("记忆 %d", memory.ID)
		}
		if memory.Kind != "" {
			title += " [" + memory.Kind + "]"
		}
		lines = append(lines, "## "+title)
		if content != "" {
			lines = append(lines, content)
		}
	}
	if len(lines) <= 2 {
		return ""
	}
	return strings.Join(lines, "\n")
}
