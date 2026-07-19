package skill

import (
	"fmt"
	"io"
	"os"
	"strings"
	"unicode/utf8"
)

const DefaultContentPageRunes = 12000

type TextPage struct {
	Content    string
	Offset     int
	NextOffset int
	TotalRunes int
	EOF        bool
}

func ReadContent(entry Entry, limits Limits) (string, []string, error) {
	limits = normalizeLimits(limits)
	warnings := make([]string, 0)
	if content := BuiltinContent(entry); strings.TrimSpace(content) != "" {
		return strings.TrimSpace(content), warnings, nil
	}
	installPath := strings.TrimSpace(entry.InstallPath)
	if installPath == "" {
		return "", nil, fmt.Errorf("技能 %s 未配置安装目录", entry.Key)
	}
	if err := ValidateInstallRoot(installPath); err != nil {
		return "", nil, fmt.Errorf("技能 %s 安装目录不安全: %w", entry.Key, err)
	}
	entryFile := strings.TrimSpace(entry.EntryFile)
	if entryFile == "" {
		entryFile = EntryFile
	}
	path, _, err := ResolveRelativePath(installPath, entryFile)
	if err != nil {
		return "", nil, fmt.Errorf("技能 %s 入口路径不安全: %w", entry.Key, err)
	}
	raw, truncated, err := readLimitedFile(path, limits.SkillFileMaxBytes)
	if err != nil {
		return "", nil, fmt.Errorf("技能 %s 读取失败: %w", entry.Key, err)
	}
	if truncated {
		warnings = append(warnings, fmt.Sprintf("技能 %s 文件超过 %d 字节，已按上限读取。", entry.Key, limits.SkillFileMaxBytes))
	}
	raw, valid := UTF8Prefix(raw, truncated)
	if !valid {
		return "", warnings, fmt.Errorf("技能 %s 入口文件不是 UTF-8 文本", entry.Key)
	}
	_, body := SplitFrontMatter(string(raw))
	if strings.TrimSpace(body) == "" {
		body = string(raw)
	}
	return strings.TrimSpace(body), warnings, nil
}

// UTF8Prefix permits a size-limited read to end in the middle of one UTF-8
// rune, while still rejecting genuinely invalid text.
func UTF8Prefix(raw []byte, truncated bool) ([]byte, bool) {
	if utf8.Valid(raw) {
		return raw, true
	}
	if !truncated {
		return raw, false
	}
	for trim := 1; trim < utf8.UTFMax && trim < len(raw); trim++ {
		if prefix := raw[:len(raw)-trim]; utf8.Valid(prefix) {
			return prefix, true
		}
	}
	return raw, false
}

func PaginateText(value string, offset int, limit int) (TextPage, error) {
	value = strings.TrimSpace(value)
	if offset < 0 {
		return TextPage{}, fmt.Errorf("读取偏移不能小于 0")
	}
	if limit <= 0 || limit > DefaultContentPageRunes {
		limit = DefaultContentPageRunes
	}
	runes := []rune(value)
	if offset > len(runes) {
		return TextPage{}, fmt.Errorf("读取偏移 %d 超出正文长度 %d", offset, len(runes))
	}
	end := offset + limit
	if end > len(runes) {
		end = len(runes)
	}
	return TextPage{
		Content:    string(runes[offset:end]),
		Offset:     offset,
		NextOffset: end,
		TotalRunes: len(runes),
		EOF:        end >= len(runes),
	}, nil
}

func readLimitedFile(path string, maxBytes int64) ([]byte, bool, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, false, err
	}
	defer file.Close()
	raw, err := io.ReadAll(io.LimitReader(file, maxBytes+1))
	if err != nil {
		return nil, false, err
	}
	if int64(len(raw)) > maxBytes {
		return raw[:maxBytes], true, nil
	}
	return raw, false, nil
}

func truncateRunes(value string, limit int) (string, bool) {
	value = strings.TrimSpace(value)
	if limit <= 0 {
		return value, false
	}
	runes := []rune(value)
	if len(runes) <= limit {
		return value, false
	}
	if limit <= 3 {
		return string(runes[:limit]), true
	}
	return string(runes[:limit-3]) + "...", true
}
