package team

import (
	"fmt"
	"regexp"
	"strings"
)

var writingNumberedTitle = regexp.MustCompile(`^第\s*[0-9零〇一二两三四五六七八九十百千]+\s*(章|集|场)(?:\s|[《:：、.．-]|$)`)
var writingMarkdownTitle = regexp.MustCompile(`^#{1,6}\s+`)

// 模型重复当前章标题时只移除已确认的展示标题；正文块同步移除同一前缀，证据仍绑定原文。
func normalizeGeneratedBodyHeading(target unitIdentity, candidate map[string]any) error {
	body := candidate["body"].(string)
	first, rest, found := strings.Cut(strings.TrimLeft(body, " \t\r\n"), "\n")
	heading := writingMarkdownTitle.ReplaceAllString(strings.TrimSpace(first), "")
	heading = strings.TrimSpace(strings.Trim(heading, "*#"))
	if !found || (heading != target.Title && heading != fmt.Sprintf("第%d章《%s》", target.Number, target.Title) && heading != fmt.Sprintf("第%d章 %s", target.Number, target.Title)) {
		return validateBodyHeading(target, body)
	}
	rest = strings.TrimLeft(rest, "\r\n")
	if strings.TrimSpace(rest) == "" {
		return fmt.Errorf("章节标题之后缺少正文")
	}
	prefix := body[:len(body)-len(rest)]
	blocks, _ := mapValue(candidate["continuity"])["blocks"].([]any)
	if len(blocks) == 0 {
		return fmt.Errorf("章节标题缺少对应正文块")
	}
	block := mapValue(blocks[0])
	text, ok := block["text"].(string)
	if !ok || !strings.HasPrefix(text, prefix) || strings.TrimSpace(strings.TrimPrefix(text, prefix)) == "" {
		return fmt.Errorf("章节标题与首个正文块不一致")
	}
	if err := validateBodyHeading(target, rest); err != nil {
		return err
	}
	candidate["body"] = rest
	block["text"] = strings.TrimPrefix(text, prefix)
	return nil
}

// 标题由编辑器单独显示；模型正文不能再次输出章节标题。
func validateBodyHeading(target unitIdentity, content string) error {
	if strings.TrimSpace(content) == "" {
		return nil
	}
	first, _, _ := strings.Cut(strings.TrimSpace(content), "\n")
	first = writingMarkdownTitle.ReplaceAllString(strings.TrimSpace(first), "")
	first = strings.TrimSpace(strings.Trim(first, "*#"))
	title := strings.TrimSpace(strings.Trim(first, "《》"))
	if writingNumberedTitle.MatchString(first) || title == target.Title {
		return fmt.Errorf("正文不应重复章节标题，请直接从正文开始")
	}
	return nil
}
