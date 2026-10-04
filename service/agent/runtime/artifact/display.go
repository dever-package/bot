package artifact

import "strings"

// FailureText returns the user-facing error for generated artifacts.
func FailureText(kind string) string {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case "image":
		return "图片生成失败"
	case "video":
		return "视频生成失败"
	case "audio":
		return "音频生成失败"
	case "file":
		return "文件生成失败"
	default:
		return ""
	}
}

// FailureMessage 用于素材及工具结果的公开错误；详细诊断仍保存在原记录。
func FailureMessage(kind string, detail string) string {
	detail = strings.TrimSpace(detail)
	if detail == "" {
		return ""
	}
	// 消息恢复会再次投影已公开的错误；仅保留已知安全文案，不信任任意文本。
	if strings.EqualFold(strings.TrimSpace(kind), "video") && detail == videoPrivacyFailureMessage {
		return detail
	}
	if failure := classifyGenerationFailure(kind, detail); failure.message != "" {
		return failure.message
	}
	if message := FailureText(kind); message != "" {
		return message
	}
	return strings.TrimSpace(detail)
}
