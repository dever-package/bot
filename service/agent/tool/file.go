package tool

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
)

func executeListSkillFiles(_ctx context.Context, req Request) (map[string]any, error) {
	entry, err := resolveSkill(req.Loaded, req.Action.Skill)
	if err != nil {
		return nil, err
	}
	base, relativeBase, err := safeSkillPath(entry, inputText(firstPresent(req.Action.Input, "path", "dir", "directory")))
	if err != nil {
		return nil, err
	}
	files := make([]map[string]any, 0)
	rootDepth := pathDepth(base)
	err = filepath.WalkDir(base, func(path string, dirEntry os.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if path == base {
			return nil
		}
		name := dirEntry.Name()
		if shouldSkipSkillFile(name, dirEntry.IsDir()) {
			if dirEntry.IsDir() {
				return filepath.SkipDir
			}
			return nil
		}
		if pathDepth(path)-rootDepth > maxListDepth {
			if dirEntry.IsDir() {
				return filepath.SkipDir
			}
			return nil
		}
		if len(files) >= maxListedFiles {
			if dirEntry.IsDir() {
				return filepath.SkipDir
			}
			return nil
		}
		info, err := dirEntry.Info()
		if err != nil {
			return err
		}
		_, relative, err := safeSkillPath(entry, pathRelativeTo(entry.InstallPath, path))
		if err != nil {
			return err
		}
		files = append(files, map[string]any{
			"path":   relative,
			"is_dir": dirEntry.IsDir(),
			"size":   info.Size(),
		})
		return nil
	})
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"path":      relativeBase,
		"files":     files,
		"truncated": len(files) >= maxListedFiles,
		"text":      fmt.Sprintf("已列出 %d 个技能文件。", len(files)),
	}, nil
}

func executeReadSkillFile(_ctx context.Context, req Request) (map[string]any, error) {
	entry, err := resolveSkill(req.Loaded, req.Action.Skill)
	if err != nil {
		return nil, err
	}
	requested := inputText(firstPresent(req.Action.Input, "path", "file", "name"))
	if requested == "" {
		return nil, fmt.Errorf("读取技能文件需要提供 path")
	}
	path, relative, err := safeSkillPath(entry, requested)
	if err != nil {
		return nil, err
	}
	if blockedSkillRelative(relative) {
		return nil, fmt.Errorf("不允许读取隐藏或依赖目录内的技能文件")
	}
	info, err := os.Stat(path)
	if err != nil {
		return nil, err
	}
	if info.IsDir() {
		return nil, fmt.Errorf("不能读取目录: %s", relative)
	}
	content, truncated, err := readLimited(path, maxFileBytes)
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"path":      relative,
		"size":      info.Size(),
		"content":   string(content),
		"truncated": truncated,
		"text":      string(content),
	}, nil
}

func readLimited(path string, limit int64) ([]byte, bool, error) {
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

func shouldSkipSkillFile(name string, isDir bool) bool {
	if name == "" {
		return true
	}
	if isDir && (name == ".git" || name == "node_modules" || name == "__pycache__") {
		return true
	}
	return strings.HasPrefix(name, ".")
}

func blockedSkillRelative(relative string) bool {
	for _, part := range strings.Split(filepath.ToSlash(relative), "/") {
		if part == "" || part == "." {
			continue
		}
		if part == ".git" || part == "node_modules" || part == "__pycache__" {
			return true
		}
		if strings.HasPrefix(part, ".") {
			return true
		}
	}
	return false
}

func pathDepth(path string) int {
	return len(strings.Split(filepath.Clean(path), string(filepath.Separator)))
}

func pathRelativeTo(root string, path string) string {
	cleanRoot, rootErr := filepath.Abs(filepath.Clean(root))
	cleanPath, pathErr := filepath.Abs(filepath.Clean(path))
	if rootErr != nil || pathErr != nil {
		return path
	}
	relative, err := filepath.Rel(cleanRoot, cleanPath)
	if err != nil {
		return path
	}
	return relative
}
