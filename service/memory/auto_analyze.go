package memory

import (
	"regexp"
	"strings"

	memorymodel "github.com/dever-package/bot/model/memory"
)

var sensitiveMemoryPatterns = []*regexp.Regexp{
	regexp.MustCompile(`(?i)(api[_-]?key|access[_-]?token|refresh[_-]?token|secret|password|passwd|cookie|authorization|bearer|private[_-]?key|密码|密钥|私钥|令牌|凭证)`),
	regexp.MustCompile(`-----BEGIN [A-Z ]+PRIVATE KEY-----`),
	regexp.MustCompile(`(?i)\b[A-Za-z0-9_\-]{36,}\b`),
}

type Candidate struct {
	Kind       string
	Title      string
	Content    string
	Tags       []string
	Importance int
	Source     string
	Confidence float64
	Explicit   bool
}

type InputAnalysis struct {
	ForgetTarget  string
	ShouldExtract bool
	Explicit      bool
	Fallback      []Candidate
}

func AnalyzeInput(text string) InputAnalysis {
	text = normalizeAutoMemoryContent(text)
	if text == "" || len([]rune(text)) > 1200 || hasSensitiveMemoryContent(text) {
		return InputAnalysis{}
	}
	if target, ok := forgetMemoryInstruction(text); ok {
		return InputAnalysis{ForgetTarget: target}
	}
	explicit := explicitMemoryContent(text)
	if explicit == "" && (looksLikeTemporaryTaskMemory(text) || !looksLikeLongTermMemory(text)) {
		return InputAnalysis{}
	}
	return InputAnalysis{
		ShouldExtract: true,
		Explicit:      explicit != "",
		Fallback:      fallbackCandidates(text, explicit),
	}
}

func fallbackCandidates(text string, explicit string) []Candidate {
	content := explicit
	importance := 80
	if content == "" {
		content = text
		importance = 65
	}
	content = limitMemoryText(content, 420)
	kind := inferMemoryKind(content)
	return []Candidate{{
		Kind: kind, Title: memoryTitle(kind, content), Content: content,
		Importance: importance, Source: memorymodel.SourceAuto,
		Confidence: 0.68, Explicit: explicit != "",
	}}
}

func normalizeAutoMemoryContent(text string) string {
	text = strings.ReplaceAll(strings.TrimSpace(text), "\r\n", "\n")
	lines := strings.Split(text, "\n")
	cleaned := make([]string, 0, len(lines))
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line != "" && !strings.HasPrefix(line, "参考资料：") {
			cleaned = append(cleaned, line)
		}
	}
	return strings.Join(cleaned, "\n")
}

func hasSensitiveMemoryContent(text string) bool {
	for _, pattern := range sensitiveMemoryPatterns {
		if pattern.MatchString(text) {
			return true
		}
	}
	return false
}

func explicitMemoryContent(text string) string {
	markers := []string{"请记住", "帮我记住", "你要记住", "需要记住", "记住：", "记住:", "记住"}
	for _, marker := range markers {
		index := strings.Index(text, marker)
		if index < 0 {
			continue
		}
		content := strings.TrimLeft(strings.TrimSpace(text[index+len(marker):]), " ：:，,。")
		if content != "" {
			return content
		}
	}
	return ""
}

func forgetMemoryInstruction(text string) (string, bool) {
	if containsAny(text, []string{"不要记住", "别记住", "不用记住"}) {
		return strings.TrimSpace(text), true
	}
	for _, marker := range []string{"忘掉", "忘记", "删除记忆", "清除记忆"} {
		index := strings.Index(text, marker)
		if index < 0 {
			continue
		}
		target := strings.TrimLeft(strings.TrimSpace(text[index+len(marker):]), " ：:，,。")
		if target == "" {
			target = strings.TrimSpace(text)
		}
		return target, true
	}
	return "", false
}

func looksLikeLongTermMemory(text string) bool {
	return containsAny(text, []string{
		"以后", "每次", "总是", "默认", "必须", "不许", "禁止",
		"规范", "规则", "约束", "偏好", "习惯", "希望", "喜欢",
		"回复", "语气", "风格", "用中文", "长期记忆",
		"不要默认", "不要再", "不需要兼容",
	})
}

func looksLikeTemporaryTaskMemory(text string) bool {
	if containsAny(text, []string{"以后", "每次", "默认", "长期", "记住"}) {
		return false
	}
	return containsAny(text, []string{"本次", "现在", "这次", "当前任务", "这回"}) &&
		containsAny(text, []string{"生成", "写", "做", "帮我", "我要", "要求", "小红书", "图文", "文案", "图片"})
}

func inferMemoryKind(content string) string {
	switch {
	case containsAny(content, []string{"偏好", "习惯", "喜欢", "希望", "回复", "语气", "风格", "不要默认认同", "迎合"}):
		return "persona"
	case containsAny(content, []string{"流程", "步骤", "规范", "规则", "必须", "禁止", "不许", "默认", "每次", "以后"}):
		return "procedural"
	default:
		return "semantic"
	}
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

func containsAny(text string, values []string) bool {
	for _, value := range values {
		if strings.Contains(text, value) {
			return true
		}
	}
	return false
}
