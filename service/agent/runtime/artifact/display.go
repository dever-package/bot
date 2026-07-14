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

func publicError(kind string, detail string) string {
	if strings.TrimSpace(detail) == "" {
		return ""
	}
	if message := FailureText(kind); message != "" {
		return message
	}
	return strings.TrimSpace(detail)
}
