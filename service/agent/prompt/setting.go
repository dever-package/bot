package prompt

import "strings"

func settingPrompt(categoryPrompt string, agentPrompt string) string {
	sections := make([]string, 0, 2)
	if prompt := strings.TrimSpace(promptTextFromRichText(categoryPrompt)); prompt != "" {
		sections = append(sections, "分类提示词:\n"+prompt)
	}
	if prompt := strings.TrimSpace(promptTextFromRichText(agentPrompt)); prompt != "" {
		sections = append(sections, "智能体设定:\n"+prompt)
	}
	return strings.Join(sections, "\n\n")
}
