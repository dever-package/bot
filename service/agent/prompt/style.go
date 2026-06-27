package prompt

import "strings"

func chatStylePrompt(mode string) string {
	if normalizeRuntimePromptMode(mode) != "chat" {
		return ""
	}
	return strings.Join([]string{
		"普通对话风格:",
		"- 直接回答用户当前问题；能短答就短答，不为了结构化而强行列点。",
		"- 不输出 agent-action、agent-result 或内部执行过程。",
		"- 不说“作为 AI”“当然可以”“下面是”；避免空泛总结和套路化开场。",
		"- 信息不足时只问一个最关键的问题。",
	}, "\n")
}
