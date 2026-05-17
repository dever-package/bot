package skill

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
)

func LoadContents(entries []Entry, limits Limits) ([]Entry, []string) {
	limits = normalizeLimits(limits)
	loaded := make([]Entry, 0, len(entries))
	warnings := make([]string, 0)
	remaining := limits.LoadedContentMaxRunes
	for _, entry := range entries {
		if remaining <= 0 {
			warnings = append(warnings, "已加载技能正文达到总长度上限，后续技能未继续读取。")
			break
		}
		content, entryWarnings := ReadContent(entry, limits)
		warnings = append(warnings, entryWarnings...)
		if strings.TrimSpace(content) == "" {
			continue
		}
		content, truncated := truncateRunes(content, remaining)
		if truncated {
			warnings = append(warnings, fmt.Sprintf("技能 %s 正文超过剩余总长度上限，已截断。", entry.Key))
		}
		entry.Content = strings.TrimSpace(content)
		loaded = append(loaded, entry)
		remaining -= runeLen(entry.Content)
	}
	return loaded, warnings
}

func ReadContent(entry Entry, limits Limits) (string, []string) {
	limits = normalizeLimits(limits)
	warnings := make([]string, 0)
	installPath := strings.TrimSpace(entry.InstallPath)
	if installPath == "" {
		return "", []string{fmt.Sprintf("技能 %s 未配置安装目录", entry.Key)}
	}
	entryFile := strings.TrimSpace(entry.EntryFile)
	if entryFile == "" {
		entryFile = EntryFile
	}
	path := filepath.Join(installPath, entryFile)
	if !IsSafePath(path) {
		return "", []string{fmt.Sprintf("技能 %s 安装目录不安全", entry.Key)}
	}
	raw, truncated, err := readLimitedFile(path, limits.SkillFileMaxBytes)
	if err != nil {
		return "", []string{fmt.Sprintf("技能 %s 读取失败: %s", entry.Key, err.Error())}
	}
	if truncated {
		warnings = append(warnings, fmt.Sprintf("技能 %s 文件超过 %d 字节，已按上限读取。", entry.Key, limits.SkillFileMaxBytes))
	}
	_, body := SplitFrontMatter(string(raw))
	if strings.TrimSpace(body) == "" {
		body = string(raw)
	}
	return strings.TrimSpace(body), warnings
}

func RenderLoaded(entries []Entry) string {
	if len(entries) == 0 {
		return "已加载技能正文:\n本轮未加载额外技能。"
	}
	parts := []string{"已加载技能正文:"}
	for _, entry := range entries {
		parts = append(parts, fmt.Sprintf("## %s\n%s", entry.Key, strings.TrimSpace(entry.Content)))
	}
	return strings.Join(parts, "\n\n")
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

func runeLen(value string) int {
	return len([]rune(strings.TrimSpace(value)))
}
