package provider

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"

	agentskill "github.com/dever-package/bot/service/agent/skill"
)

func listSkillFilesTool(loaded map[string]agentskill.Entry) Tool {
	return Tool{
		Definition: Definition{
			Name:        "list_skill_files",
			Description: "列出已加载技能目录中的文件。",
			Parameters: objectParameters(map[string]any{
				"skill": skillProperty(),
				"path":  map[string]any{"type": "string", "description": "目录相对路径"},
			}),
		},
		Handle: func(_ context.Context, call Call) (Result, error) {
			entry, err := loadedSkill(loaded, call.Arguments)
			if err != nil {
				return Result{}, err
			}
			requested := normalizeSkillListPath(entry, argumentText(call.Arguments, "path"))
			base, relativeBase, err := safeSkillPath(entry, requested)
			if err != nil {
				return Result{}, err
			}
			files := make([]map[string]any, 0)
			rootDepth := pathDepth(base)
			err = filepath.WalkDir(base, func(path string, item os.DirEntry, walkErr error) error {
				if walkErr != nil {
					return walkErr
				}
				if path == base {
					return nil
				}
				if skipSkillPath(item.Name(), item.IsDir()) {
					if item.IsDir() {
						return filepath.SkipDir
					}
					return nil
				}
				if pathDepth(path)-rootDepth > maxSkillListDepth || len(files) >= maxSkillFiles {
					if item.IsDir() {
						return filepath.SkipDir
					}
					return nil
				}
				info, infoErr := item.Info()
				if infoErr != nil {
					return infoErr
				}
				relative, pathErr := relativeSkillPath(entry.InstallPath, path)
				if pathErr != nil {
					return pathErr
				}
				files = append(files, map[string]any{"path": relative, "is_dir": item.IsDir(), "size": info.Size()})
				return nil
			})
			if err != nil {
				return Result{}, err
			}
			content := map[string]any{
				"skill": entry.Key, "path": relativeBase, "files": files, "truncated": len(files) >= maxSkillFiles,
			}
			return Result{Text: fmt.Sprintf("已列出 %d 个技能文件", len(files)), Content: content}, nil
		},
	}
}

func readSkillFileTool(loaded map[string]agentskill.Entry) Tool {
	return Tool{
		Definition: Definition{
			Name:        "read_skill_file",
			Description: "读取已加载技能目录中的文本文件。",
			Parameters: objectParameters(map[string]any{
				"skill": skillProperty(),
				"path":  map[string]any{"type": "string", "description": "文件相对路径"},
			}, "path"),
		},
		Handle: func(_ context.Context, call Call) (Result, error) {
			entry, err := loadedSkill(loaded, call.Arguments)
			if err != nil {
				return Result{}, err
			}
			path, relative, err := safeSkillPath(entry, argumentText(call.Arguments, "path"))
			if err != nil {
				return Result{}, err
			}
			if blockedSkillPath(relative) {
				return Result{}, fmt.Errorf("不允许读取隐藏或依赖目录内的技能文件")
			}
			info, err := os.Stat(path)
			if err != nil {
				return Result{}, err
			}
			if info.IsDir() {
				return Result{}, fmt.Errorf("不能读取目录: %s", relative)
			}
			content, truncated, err := readLimitedFile(path, maxSkillFileBytes)
			if err != nil {
				return Result{}, err
			}
			text := string(content)
			return Result{Text: text, Content: map[string]any{
				"skill": entry.Key, "path": relative, "size": info.Size(), "content": text, "truncated": truncated,
			}}, nil
		},
	}
}

func safeSkillPath(entry agentskill.Entry, requested string) (string, string, error) {
	root := strings.TrimSpace(entry.InstallPath)
	if root == "" {
		return "", "", fmt.Errorf("技能 %s 没有安装目录", entry.Key)
	}
	return safeRelativePath(root, requested)
}

func normalizeSkillListPath(entry agentskill.Entry, requested string) string {
	requested = strings.TrimSpace(requested)
	if requested == "" || requested == "/" || requested == "." {
		return "."
	}
	if !filepath.IsAbs(requested) {
		return requested
	}
	requestedPath, requestedErr := filepath.Abs(filepath.Clean(requested))
	rootPath, rootErr := filepath.Abs(filepath.Clean(entry.InstallPath))
	if requestedErr == nil && rootErr == nil && requestedPath == rootPath {
		return "."
	}
	requested = strings.TrimLeft(filepath.ToSlash(requested), "/")
	if requested == "skill" {
		return "."
	}
	if strings.HasPrefix(requested, "skill/") {
		return strings.TrimPrefix(requested, "skill/")
	}
	return requested
}

func safeRelativePath(root string, requested string) (string, string, error) {
	if strings.TrimSpace(root) == "" {
		return "", "", fmt.Errorf("运行目录未初始化")
	}
	requested = strings.TrimSpace(requested)
	if requested == "" {
		requested = "."
	}
	if filepath.IsAbs(requested) {
		return "", "", fmt.Errorf("不允许使用绝对路径，请使用技能目录内的相对路径")
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

func readLimitedFile(path string, limit int64) ([]byte, bool, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, false, err
	}
	defer file.Close()
	raw, err := io.ReadAll(io.LimitReader(file, limit+1))
	if err != nil {
		return nil, false, err
	}
	if int64(len(raw)) > limit {
		return raw[:limit], true, nil
	}
	return raw, false, nil
}

func skipSkillPath(name string, directory bool) bool {
	if strings.HasPrefix(name, ".") {
		return true
	}
	return directory && (name == "node_modules" || name == "__pycache__")
}

func blockedSkillPath(relative string) bool {
	for _, part := range strings.Split(filepath.ToSlash(relative), "/") {
		if part == "" || part == "." {
			continue
		}
		if strings.HasPrefix(part, ".") || part == "node_modules" || part == "__pycache__" {
			return true
		}
	}
	return false
}

func pathDepth(path string) int {
	return len(strings.Split(filepath.Clean(path), string(filepath.Separator)))
}

func relativeSkillPath(root string, path string) (string, error) {
	cleanRoot, err := filepath.Abs(filepath.Clean(root))
	if err != nil {
		return "", err
	}
	cleanPath, err := filepath.Abs(filepath.Clean(path))
	if err != nil {
		return "", err
	}
	relative, err := filepath.Rel(cleanRoot, cleanPath)
	if err != nil {
		return "", err
	}
	if relative == ".." || strings.HasPrefix(relative, ".."+string(filepath.Separator)) {
		return "", fmt.Errorf("路径超出允许目录")
	}
	return filepath.ToSlash(relative), nil
}
