package tool

import (
	"fmt"
	"net"
	"os"
	"path/filepath"
	"strings"

	frontstream "github.com/dever-package/front/service/stream"

	agentskill "github.com/dever-package/bot/service/agent/skill"
)

const (
	maxFileBytes     = 256 * 1024
	maxTempFileBytes = 256 * 1024
	maxListedFiles   = 200
	maxListDepth     = 4
	maxArgCount      = 32
	maxArgLength     = 512
)

func normalizeTool(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	value = strings.ReplaceAll(value, "-", "_")
	return value
}

func resolveSkill(entries []agentskill.Entry, identity string) (agentskill.Entry, error) {
	identity = agentskill.NormalizeKey(identity)
	if identity == "" && len(entries) == 1 {
		return entries[0], nil
	}
	if identity == "" {
		return agentskill.Entry{}, fmt.Errorf("工具调用需要指定已加载技能")
	}
	for _, entry := range entries {
		if agentskill.NormalizeKey(entry.Key) == identity || agentskill.NormalizeKey(entry.Name) == identity {
			return entry, nil
		}
	}
	return agentskill.Entry{}, fmt.Errorf("工具调用的技能未在本轮加载: %s", identity)
}

func inputText(value any) string {
	return strings.TrimSpace(frontstream.InputText(value))
}

func inputInt(value any, fallback int) int {
	parsed := int(frontstream.InputInt64(value, int64(fallback)))
	if parsed == 0 {
		return fallback
	}
	return parsed
}

func inputMap(value any) map[string]any {
	mapped, ok := value.(map[string]any)
	if !ok || mapped == nil {
		return map[string]any{}
	}
	return mapped
}

func inputStringSlice(value any) []string {
	switch current := value.(type) {
	case []string:
		return append([]string{}, current...)
	case []any:
		result := make([]string, 0, len(current))
		for _, item := range current {
			if text := inputText(item); text != "" {
				result = append(result, text)
			}
		}
		return result
	default:
		if text := inputText(value); text != "" {
			return []string{text}
		}
	}
	return nil
}

func firstPresent(source map[string]any, keys ...string) any {
	for _, key := range keys {
		if value, exists := source[key]; exists {
			return value
		}
	}
	return nil
}

func safeSkillPath(entry agentskill.Entry, requested string) (string, string, error) {
	root := strings.TrimSpace(entry.InstallPath)
	if root == "" {
		return "", "", fmt.Errorf("技能未配置安装目录")
	}
	return safeRelativePath(root, requested)
}

func safeTempPath(root string, requested string) (string, string, error) {
	if strings.TrimSpace(root) == "" {
		return "", "", fmt.Errorf("临时工作目录未初始化")
	}
	return safeRelativePath(root, requested)
}

func safeRelativePath(root string, requested string) (string, string, error) {
	requested = strings.TrimSpace(requested)
	if requested == "" {
		requested = "."
	}
	if filepath.IsAbs(requested) {
		return "", "", fmt.Errorf("不允许使用绝对路径")
	}
	cleanRoot, err := filepath.Abs(filepath.Clean(root))
	if err != nil {
		return "", "", err
	}
	cleanPath, err := filepath.Abs(filepath.Join(cleanRoot, filepath.Clean(requested)))
	if err != nil {
		return "", "", err
	}
	relative, err := filepath.Rel(cleanRoot, cleanPath)
	if err != nil {
		return "", "", err
	}
	if relative == ".." || strings.HasPrefix(relative, ".."+string(filepath.Separator)) {
		return "", "", fmt.Errorf("路径超出允许目录")
	}
	return cleanPath, filepath.ToSlash(relative), nil
}

func ensureDirectory(path string) error {
	return os.MkdirAll(path, 0o755)
}

func rejectUnsafeHost(ip net.IP) bool {
	if ip == nil {
		return true
	}
	return ip.IsLoopback() ||
		ip.IsPrivate() ||
		ip.IsLinkLocalUnicast() ||
		ip.IsLinkLocalMulticast() ||
		ip.IsUnspecified() ||
		ip.IsMulticast()
}

func truncateText(value string, limit int) string {
	value = strings.TrimSpace(value)
	if limit <= 0 {
		return value
	}
	runes := []rune(value)
	if len(runes) <= limit {
		return value
	}
	if limit <= 3 {
		return string(runes[:limit])
	}
	return string(runes[:limit-3]) + "..."
}

func normalizeArgs(raw any) ([]string, error) {
	args := inputStringSlice(raw)
	if len(args) > maxArgCount {
		return nil, fmt.Errorf("脚本参数超过 %d 个", maxArgCount)
	}
	for _, arg := range args {
		if len([]rune(arg)) > maxArgLength {
			return nil, fmt.Errorf("脚本参数过长")
		}
	}
	return args, nil
}
