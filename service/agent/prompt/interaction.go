package prompt

import "strings"

func interactionPrompt() string {
	return strings.Join([]string{
		"用户补充信息协议:",
		"- 当前信息不足且必须由用户选择、确认或补充时，输出 agent-interaction；不要替用户猜。",
		"- 只收集完成任务必需的信息；字段尽量少，问题要具体。",
		"",
		"最小 agent-interaction 示例:",
		"```agent-interaction",
		`{"type":"form","title":"需要补充信息","fields":[{"key":"detail","label":"请补充关键信息","type":"text","required":true}]}`,
		"```",
	}, "\n")
}
