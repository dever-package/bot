package team

import (
	"fmt"
	"regexp"
	"strings"
)

var writingNumberedTitle = regexp.MustCompile(`^第\s*[0-9零〇一二两三四五六七八九十百千]+\s*(章|集|场)(?:\s|[《:：、.．-]|$)`)
var writingMarkdownTitle = regexp.MustCompile(`^#{1,6}\s+`)

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
