package memory

import (
	"regexp"
	"strings"
	"unicode/utf8"
)

const autoMemoryMinimumRunes = 12

var sensitiveMemoryPatterns = []*regexp.Regexp{
	regexp.MustCompile(`(?i)(api[_-]?key|access[_-]?token|refresh[_-]?token|secret|password|passwd|cookie|authorization|bearer|private[_-]?key|密码|密钥|私钥|令牌|凭证)`),
	regexp.MustCompile(`-----BEGIN [A-Z ]+PRIVATE KEY-----`),
	regexp.MustCompile(`(?i)\b[A-Za-z0-9_\-]{36,}\b`),
}

var explicitMemorySignals = []string{
	"记住", "别忘", "以后请", "以后都", "我的偏好", "我偏好", "我喜欢", "我不喜欢",
	"我叫", "叫我", "称呼我", "我的名字", "我是", "我在",
	"remember", "call me", "my name", "i prefer", "i like", "i dislike", "i am",
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
	if text == "" || hasSensitiveMemoryContent(text) {
		return false
	}
	if utf8.RuneCountInString(text) >= autoMemoryMinimumRunes {
		return true
	}
	lower := strings.ToLower(text)
	for _, signal := range explicitMemorySignals {
		if strings.Contains(lower, signal) {
			return true
		}
	}
	return false
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
