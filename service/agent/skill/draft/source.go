package draft

import (
	"context"
	"fmt"
	"io/fs"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

func (Service) ImportSource(ctx context.Context, req SourceRequest) Result {
	req = normalizeSourceRequest(req)
	if req.SourceURL == "" {
		return failResult("来源地址不能为空", nil)
	}
	tempRoot, err := os.MkdirTemp("", "dever-skill-source-*")
	if err != nil {
		return failResult(err.Error(), nil)
	}
	defer os.RemoveAll(tempRoot)

	repoDir := filepath.Join(tempRoot, "repo")
	if err := cloneSource(ctx, req, repoDir); err != nil {
		return failResult(err.Error(), nil)
	}
	commit := gitCommit(ctx, repoDir)
	files, usedFiles, err := sourceReferenceFiles(repoDir, req.UsedFiles)
	if err != nil {
		return failResult(err.Error(), nil)
	}
	manifest := map[string]any{
		"key":         req.Key,
		"name":        req.Name,
		"description": req.Description,
		"triggers":    []any{},
		"source_url":  req.SourceURL,
		"config":      []any{},
		"scripts":     []any{},
		"source_refs": []any{
			map[string]any{
				"source_url": req.SourceURL,
				"ref":        req.Ref,
				"commit":     commit,
				"license":    req.License,
				"used_files": usedFiles,
				"notes":      req.Notes,
			},
		},
	}
	draftID := uint64(agentmodel.NewSkillDraftModel().Insert(ctx, map[string]any{
		"pack_id":           req.PackID,
		"cate_id":           req.CateID,
		"key":               req.Key,
		"name":              req.Name,
		"description":       req.Description,
		"status":            agentmodel.SkillDraftStatusDraft,
		"skill_md":          defaultSourceSkillMD(req),
		"files_json":        agentskill.JSONText(files),
		"manifest":          agentskill.JSONText(manifest),
		"validation_result": agentskill.JSONText(map[string]any{"source_imported": true}),
		"created_at":        time.Now(),
	}))
	if draftID == 0 {
		return failResult("创建来源草稿失败", nil)
	}
	return okResult("已基于开源代码创建草稿", map[string]any{
		"draft_id":   draftID,
		"source_url": req.SourceURL,
		"commit":     commit,
	})
}

func normalizeSourceRequest(req SourceRequest) SourceRequest {
	req.Key = agentskill.NormalizeKey(req.Key)
	if req.Key == "" {
		req.Key = agentskill.NormalizeKey(sourceBaseName(req.SourceURL))
	}
	req.Name = strings.TrimSpace(req.Name)
	if req.Name == "" {
		req.Name = req.Key
	}
	req.Description = strings.TrimSpace(req.Description)
	req.SourceURL = strings.TrimSpace(req.SourceURL)
	req.Ref = strings.TrimSpace(req.Ref)
	req.License = strings.TrimSpace(req.License)
	req.Notes = strings.TrimSpace(req.Notes)
	if req.CateID == 0 {
		req.CateID = agentmodel.DefaultSkillCateID
	}
	return req
}

func cloneSource(ctx context.Context, req SourceRequest, target string) error {
	if err := validateSourceURL(req.SourceURL); err != nil {
		return err
	}
	args := []string{"-c", "core.hooksPath=/dev/null", "clone", "--depth", "1"}
	if req.Ref != "" {
		args = append(args, "--branch", req.Ref)
	}
	args = append(args, req.SourceURL, target)
	timeoutCtx, cancel := context.WithTimeout(ctx, 2*time.Minute)
	defer cancel()
	command := exec.CommandContext(timeoutCtx, "git", args...)
	command.Env = append(os.Environ(), "GIT_TERMINAL_PROMPT=0", "GCM_INTERACTIVE=Never")
	output, err := command.CombinedOutput()
	if timeoutCtx.Err() == context.DeadlineExceeded {
		return fmt.Errorf("拉取来源仓库超时")
	}
	if err != nil {
		return fmt.Errorf("拉取来源仓库失败: %s", strings.TrimSpace(string(output)))
	}
	return nil
}

func validateSourceURL(raw string) error {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return fmt.Errorf("来源地址不能为空")
	}
	if strings.HasPrefix(raw, "git@") {
		hostPart := strings.TrimPrefix(raw, "git@")
		host, _, ok := strings.Cut(hostPart, ":")
		if ok && trustedSourceHost(host) {
			return nil
		}
		return fmt.Errorf("只允许从可信 Git 托管站点引用源码")
	}
	parsed, err := url.Parse(raw)
	if err != nil || parsed.Hostname() == "" {
		return fmt.Errorf("来源地址不是合法 URL")
	}
	switch strings.ToLower(parsed.Scheme) {
	case "https", "ssh":
	default:
		return fmt.Errorf("来源地址只允许 https 或 ssh")
	}
	if !trustedSourceHost(parsed.Hostname()) {
		return fmt.Errorf("只允许从可信 Git 托管站点引用源码")
	}
	return nil
}

func trustedSourceHost(host string) bool {
	host = strings.ToLower(strings.TrimSpace(host))
	switch host {
	case "github.com", "gitlab.com", "gitee.com":
		return true
	default:
		return false
	}
}

func gitCommit(ctx context.Context, repoDir string) string {
	command := exec.CommandContext(ctx, "git", "-C", repoDir, "rev-parse", "HEAD")
	output, err := command.Output()
	if err != nil {
		return ""
	}
	return strings.TrimSpace(string(output))
}

func sourceReferenceFiles(repoDir string, selected []string) (map[string]string, []string, error) {
	if len(selected) == 0 {
		tree, err := sourceTree(repoDir)
		if err != nil {
			return nil, nil, err
		}
		return map[string]string{"references/source-tree.txt": tree}, []string{}, nil
	}
	files := map[string]string{}
	usedFiles := make([]string, 0, len(selected))
	totalBytes := 0
	for _, item := range selected {
		relative := cleanSourceRelativePath(item)
		if relative == "" {
			continue
		}
		fullPath, _, err := agentskill.ResolveRelativePath(repoDir, filepath.FromSlash(relative))
		if err != nil {
			return nil, nil, fmt.Errorf("来源文件路径不安全: %s", item)
		}
		info, err := os.Stat(fullPath)
		if err != nil || info.IsDir() {
			return nil, nil, fmt.Errorf("来源文件不存在: %s", relative)
		}
		if info.Size() > maxDraftFileBytes {
			return nil, nil, fmt.Errorf("来源文件过大: %s", relative)
		}
		totalBytes += int(info.Size())
		if totalBytes > maxDraftTotalBytes {
			return nil, nil, fmt.Errorf("来源文件总大小超过限制")
		}
		raw, err := os.ReadFile(fullPath)
		if err != nil {
			return nil, nil, err
		}
		target := "references/source/" + relative
		files[target] = string(raw)
		usedFiles = append(usedFiles, relative)
	}
	sort.Strings(usedFiles)
	return files, usedFiles, nil
}

func sourceTree(repoDir string) (string, error) {
	paths := make([]string, 0, 200)
	err := filepath.WalkDir(repoDir, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if path == repoDir {
			return nil
		}
		if len(paths) >= 200 {
			return fs.SkipAll
		}
		relative, err := filepath.Rel(repoDir, path)
		if err != nil {
			return err
		}
		relative = filepath.ToSlash(relative)
		if entry.IsDir() {
			if sourceDirSkipped(entry.Name()) {
				return filepath.SkipDir
			}
			return nil
		}
		paths = append(paths, relative)
		return nil
	})
	if err != nil {
		return "", err
	}
	sort.Strings(paths)
	return strings.Join(paths, "\n"), nil
}

func sourceDirSkipped(name string) bool {
	switch name {
	case ".git", "node_modules", "dist", "build", ".venv", "venv", "__pycache__":
		return true
	default:
		return strings.HasPrefix(name, ".")
	}
}

func cleanSourceRelativePath(path string) string {
	path = filepath.ToSlash(filepath.Clean(strings.TrimSpace(path)))
	if path == "." || path == "" || strings.HasPrefix(path, "../") || strings.HasPrefix(path, "/") || strings.Contains(path, "/.") {
		return ""
	}
	return path
}

func sourceBaseName(sourceURL string) string {
	sourceURL = strings.TrimSuffix(strings.TrimSpace(sourceURL), "/")
	sourceURL = strings.TrimSuffix(sourceURL, ".git")
	if sourceURL == "" {
		return "source-skill"
	}
	parts := strings.FieldsFunc(sourceURL, func(char rune) bool {
		return char == '/' || char == ':'
	})
	if len(parts) == 0 {
		return "source-skill"
	}
	return parts[len(parts)-1]
}

func defaultSourceSkillMD(req SourceRequest) string {
	return strings.Join([]string{
		"---",
		"name: " + req.Name,
		"description: " + req.Description,
		"---",
		"",
		"# " + req.Name,
		"",
		req.Description,
		"",
		"## Source",
		"",
		req.SourceURL,
		"",
		"## Notes",
		"",
		"该草稿只引用开源代码到 references/source/，不会直接执行来源仓库脚本。需要执行能力时，请审查后包装到 scripts/ 并通过测试再发布。",
	}, "\n")
}
