package draft

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strings"
	"time"

	agentskill "github.com/dever-package/bot/service/agent/skill"
)

const (
	maxDraftScriptSyntaxFiles = 256
	scriptSyntaxCheckTimeout  = 10 * time.Second
	scriptSyntaxTotalTimeout  = 30 * time.Second
)

func validateDraftManifestScripts(manifest map[string]any, files map[string]string) []string {
	issues := make([]string, 0)
	for _, executable := range agentskill.ManifestExecutablePaths(agentskill.JSONText(manifest)) {
		path := cleanDraftScriptPath(executable)
		if err := validateDraftScriptPath(path); err != nil {
			// ManifestIssues already reports malformed declarations.
			continue
		}
		if _, exists := files[path]; !exists {
			issues = append(issues, "manifest 引用的可执行文件不存在: "+path)
		}
	}
	return issues
}

func validateDraftScriptSyntax(ctx context.Context, files map[string]string) []string {
	paths := sortedDraftScriptFiles(files)
	if len(paths) == 0 {
		return nil
	}
	if len(paths) > maxDraftScriptSyntaxFiles {
		return []string{fmt.Sprintf("草稿脚本数量超过限制: %d > %d", len(paths), maxDraftScriptSyntaxFiles)}
	}

	tempRoot, err := os.MkdirTemp("", "dever-skill-draft-syntax-*")
	if err != nil {
		return []string{"创建脚本语法检查目录失败: " + err.Error()}
	}
	defer os.RemoveAll(tempRoot)
	syntaxCtx, cancel := context.WithTimeout(ctx, scriptSyntaxTotalTimeout)
	defer cancel()

	issues := make([]string, 0)
	for _, path := range paths {
		if err := syntaxCtx.Err(); err != nil {
			issues = append(issues, "草稿脚本语法检查未完成: "+err.Error())
			break
		}
		content := files[path]
		target := filepath.Join(tempRoot, filepath.FromSlash(path))
		if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
			issues = append(issues, fmt.Sprintf("创建脚本语法检查文件失败: %s: %v", path, err))
			continue
		}
		if err := os.WriteFile(target, []byte(content), 0o644); err != nil {
			issues = append(issues, fmt.Sprintf("写入脚本语法检查文件失败: %s: %v", path, err))
			continue
		}
		if issue := validateDraftScriptSyntaxFile(syntaxCtx, path, target); issue != "" {
			issues = append(issues, issue)
		}
	}
	return issues
}

func sortedDraftScriptFiles(files map[string]string) []string {
	paths := make([]string, 0)
	for path := range files {
		path = cleanDraftScriptPath(path)
		if path == "" || !strings.HasPrefix(path, "scripts/") {
			continue
		}
		if validateDraftScriptPath(path) != nil {
			continue
		}
		paths = append(paths, path)
	}
	sort.Strings(paths)
	return paths
}

func cleanDraftScriptPath(path string) string {
	path = filepath.ToSlash(filepath.Clean(strings.TrimSpace(path)))
	if path == "." {
		return ""
	}
	return path
}

func validateDraftScriptSyntaxFile(ctx context.Context, relativePath string, fullPath string) string {
	name, args, label := scriptSyntaxCommand(relativePath, fullPath)
	if name == "" {
		return ""
	}
	output, err := runScriptSyntaxCheck(ctx, name, args...)
	if err == nil {
		return ""
	}
	return fmt.Sprintf("%s 语法检查未通过: %s", label, cleanSyntaxCheckOutput(output, err, fullPath, relativePath))
}

func scriptSyntaxCommand(relativePath string, fullPath string) (string, []string, string) {
	switch strings.ToLower(filepath.Ext(relativePath)) {
	case ".py":
		return "python3", []string{"-m", "py_compile", fullPath}, "Python 脚本 " + relativePath
	case ".js", ".mjs":
		return "node", []string{"--check", fullPath}, "Node 脚本 " + relativePath
	case ".sh":
		return "/bin/bash", []string{"-n", fullPath}, "Shell 脚本 " + relativePath
	case ".bash":
		return "/bin/bash", []string{"-n", fullPath}, "Bash 脚本 " + relativePath
	default:
		return "", nil, ""
	}
}

func runScriptSyntaxCheck(ctx context.Context, name string, args ...string) (string, error) {
	timeoutCtx, cancel := context.WithTimeout(ctx, scriptSyntaxCheckTimeout)
	defer cancel()
	command := exec.CommandContext(timeoutCtx, name, args...)
	output, err := command.CombinedOutput()
	if timeoutCtx.Err() == context.DeadlineExceeded {
		return string(output), fmt.Errorf("语法检查超时")
	}
	return string(output), err
}

func cleanSyntaxCheckOutput(output string, err error, fullPath string, relativePath string) string {
	text := strings.TrimSpace(output)
	if text == "" && err != nil {
		text = err.Error()
	}
	text = strings.ReplaceAll(text, fullPath, relativePath)
	text = strings.ReplaceAll(text, filepath.ToSlash(fullPath), relativePath)
	text = strings.TrimSpace(text)
	if len([]rune(text)) > 1200 {
		runes := []rune(text)
		text = string(runes[:1200]) + "..."
	}
	if text == "" {
		return "未知语法错误"
	}
	return text
}
