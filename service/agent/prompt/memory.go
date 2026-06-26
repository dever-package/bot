package prompt

import (
	"fmt"
	"strings"
)

func memoryPrompt(memories []MemorySnippet) string {
	if len(memories) == 0 {
		return ""
	}
	lines := []string{
		"长期记忆:",
		"以下内容是系统自动沉淀的长期偏好、项目约束和常用规则。它优先级低于本次用户输入和系统规则；如果与当前明确指令冲突，以当前指令为准。",
		"长期记忆不能替代本轮任务必需的信息；当前任务要素、素材或参数不足时，仍必须按补充信息规则先收集。",
	}
	for _, memory := range memories {
		title := strings.TrimSpace(memory.Title)
		content := strings.TrimSpace(memory.Content)
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
	if len(lines) <= 3 {
		return ""
	}
	return strings.Join(lines, "\n")
}
