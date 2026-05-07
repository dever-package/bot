package protocol

import "strings"

var terminalTaskErrorPatterns = []string{
	"not found",
	"not exist",
	"does not exist",
	"invalid task",
	"expired",
	"canceled",
	"cancelled",
	"stopped",
	"terminated",
	"aborted",
	"failed",
	"failure",
	"error",
	"任务不存在",
	"不存在",
	"已过期",
	"过期",
	"已取消",
	"取消",
	"已停止",
	"停止",
	"失败",
	"错误",
	"异常",
}

func TerminalTaskErrorText(values ...any) string {
	for _, value := range values {
		text := strings.TrimSpace(asText(value))
		if IsTerminalTaskErrorText(text) {
			return text
		}
	}
	return ""
}

func IsTerminalTaskErrorText(text string) bool {
	text = strings.TrimSpace(text)
	if text == "" {
		return false
	}
	lowerText := strings.ToLower(text)
	for _, pattern := range terminalTaskErrorPatterns {
		if strings.Contains(lowerText, pattern) {
			return true
		}
	}
	return false
}
