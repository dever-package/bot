package memory

import (
	"regexp"
	"strings"
)

var sensitiveMemoryPatterns = []*regexp.Regexp{
	regexp.MustCompile(`(?i)(api[_-]?key|access[_-]?token|refresh[_-]?token|secret|password|passwd|cookie|authorization|bearer|private[_-]?key|密码|密钥|私钥|令牌|凭证)`),
	regexp.MustCompile(`-----BEGIN [A-Z ]+PRIVATE KEY-----`),
	regexp.MustCompile(`(?i)\b[A-Za-z0-9_\-]{36,}\b`),
}

type Candidate struct {
	Operation  string
	MemoryID   uint64
	Key        string
	Scope      string
	Kind       string
	Title      string
	Content    string
	Tags       []string
	Importance int
	Source     string
	Confidence float64
	Explicit   bool
}

func CanAnalyzeInput(text string) bool {
	text = normalizeAutoMemoryContent(text)
	return text != "" && !hasSensitiveMemoryContent(text)
}

func normalizeAutoMemoryContent(text string) string {
	return strings.TrimSpace(strings.ReplaceAll(text, "\r\n", "\n"))
}

func hasSensitiveMemoryContent(text string) bool {
	for _, pattern := range sensitiveMemoryPatterns {
		if pattern.MatchString(text) {
			return true
		}
	}
	return false
}

func memoryTitle(kind string, content string) string {
	prefix := map[string]string{
		"persona": "用户偏好", "procedural": "工作规则", "semantic": "长期事实",
		"episodic": "重要事件", "content": "内容摘要", "working": "工作记忆",
	}[kind]
	if prefix == "" {
		prefix = "长期记忆"
	}
	return prefix + "：" + limitMemoryText(strings.Join(strings.Fields(content), " "), 32)
}
