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
)

const (
	maxDraftScriptSyntaxFiles = 64
	scriptSyntaxCheckTimeout  = 10 * time.Second
)

func validateDraftManifestScripts(manifest map[string]any, files map[string]string) []string {
	scriptFiles := sortedDraftScriptFiles(files)
	if len(scriptFiles) == 0 {
		return nil
	}
	rawScripts, hasScripts := manifest["scripts"]
	if !hasScripts {
		return []string{"存在 scripts/ 脚本，但 manifest.scripts 未声明可执行入口"}
	}
	scripts, ok := rawScripts.([]any)
	if !ok {
		return []string{"manifest.scripts 必须是数组"}
	}
	if len(scripts) == 0 {
		return []string{"存在 scripts/ 脚本，但 manifest.scripts 为空"}
	}
	if len(scripts) > maxDraftScriptSyntaxFiles {
		return []string{fmt.Sprintf("manifest.scripts 数量超过限制: %d > %d", len(scripts), maxDraftScriptSyntaxFiles)}
	}

	issues := make([]string, 0)
	declared := map[string]bool{}
	for index, item := range scripts {
		values, ok := item.(map[string]any)
		if !ok {
			issues = append(issues, fmt.Sprintf("manifest.scripts[%d] 必须是对象", index))
			continue
		}
		path := cleanDraftScriptPath(manifestString(values, "path", ""))
		if path == "" {
			issues = append(issues, fmt.Sprintf("manifest.scripts[%d].path 不能为空", index))
			continue
		}
		if err := validateDraftScriptPath(path); err != nil {
			issues = append(issues, fmt.Sprintf("manifest.scripts[%d].path 无效: %s", index, err.Error()))
			continue
		}
		if _, exists := files[path]; !exists {
			issues = append(issues, fmt.Sprintf("manifest.scripts[%d].path 对应脚本不存在: %s", index, path))
			continue
		}
		declared[path] = true
	}
	for _, path := range scriptFiles {
		if !declared[path] {
			issues = append(issues, "脚本未在 manifest.scripts 声明: "+path)
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

	issues := make([]string, 0)
	for _, path := range paths {
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
		if issue := validateDraftScriptSyntaxFile(ctx, path, target); issue != "" {
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
	case ".js":
		return "node", []string{"--check", fullPath}, "Node 脚本 " + relativePath
	case ".sh":
		return "/bin/sh", []string{"-n", fullPath}, "Shell 脚本 " + relativePath
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
