package prompt

import (
	"encoding/json"
	"strings"
)

func historyPrompt(history []any) string {
	if len(history) == 0 {
		return ""
	}
	content, err := json.MarshalIndent(history, "", "  ")
	if err != nil || len(content) == 0 {
		return ""
	}
	return strings.Join([]string{
		"当前临时资料:",
		"以下内容来自本次运行弹窗内的多轮对话、用户提交的交互表单、选项和上传结果。它只用于当前运行，不代表长期记忆。",
		string(content),
	}, "\n")
}
