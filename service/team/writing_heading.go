package team

import (
	"fmt"
	"regexp"
	"strings"
)

var writingMarkdownTitle = regexp.MustCompile(`^#{1,6}\s+`)

// 模型重复当前章标题时只移除已确认的展示标题；正文块同步移除同一前缀，证据仍绑定原文。
func normalizeGeneratedBodyHeading(target unitIdentity, candidate map[string]any) error {
	body := candidate["body"].(string)
	first, rest, found := strings.Cut(strings.TrimLeft(body, " \t\r\n"), "\n")
	heading := writingMarkdownTitle.ReplaceAllString(strings.TrimSpace(first), "")
	heading = strings.TrimSpace(strings.Trim(heading, "*#"))
	if !found || (heading != target.Title && heading != fmt.Sprintf("第%d章《%s》", target.Number, target.Title) && heading != fmt.Sprintf("第%d章 %s", target.Number, target.Title)) {
		return nil
	}
	rest = strings.TrimLeft(rest, "\r\n")
	if strings.TrimSpace(rest) == "" {
		return nil
	}
	prefix := body[:len(body)-len(rest)]
	blocks, _ := mapValue(candidate["continuity"])["blocks"].([]any)
	if len(blocks) == 0 {
		return nil
	}
	block := mapValue(blocks[0])
	text, ok := block["text"].(string)
	if !ok || !strings.HasPrefix(text, prefix) || strings.TrimSpace(strings.TrimPrefix(text, prefix)) == "" {
		return nil
	}
	candidate["body"] = rest
	block["text"] = strings.TrimPrefix(text, prefix)
	return nil
}
