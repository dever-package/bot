package prompt

import "strings"

func contextNotesPrompt(notes []string) string {
	if len(notes) == 0 {
		return ""
	}
	lines := []string{
		"当前临时资料:",
		"来自本次运行弹窗内的多轮对话、交互表单、选项和工具结果；只用于当前运行，不代表长期记忆。",
	}
	for _, note := range notes {
		note = strings.TrimSpace(note)
		if note != "" {
			lines = append(lines, "- "+note)
		}
	}
	if len(lines) <= 2 {
		return ""
	}
	return truncatePromptText(strings.Join(lines, "\n"), historyPromptMaxTotalRunes)
}
