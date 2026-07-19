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
	"unicode"
	"unicode/utf8"

	agentmodel "github.com/dever-package/bot/model/agent"
	"github.com/dever-package/bot/service/agent/runtime/tool/sandbox"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

const (
	sourceCloneTimeout       = 2 * time.Minute
	sourceCloneCheckInterval = 500 * time.Millisecond
	maxSourceURLRunes        = 2048
	maxSourceLicenseRunes    = 256
	maxSourceNotesRunes      = 4096
)

var sourceCloneTreeLimits = agentskill.TreeLimits{
	MaxFiles: 50_000,
	MaxBytes: 512 * 1024 * 1024,
	MaxDepth: 64,
}

func (Service) ImportSource(ctx context.Context, req SourceRequest) Result {
	req = normalizeSourceRequest(req)
	if err := agentskill.ValidateAssignment(ctx, req.PackID, req.CateID); err != nil {
		return failResult(err.Error(), nil)
	}
	if req.SourceURL == "" {
		return failResult("来源地址不能为空", nil)
	}
	if err := validateSourceRequest(req); err != nil {
		return failResult(err.Error(), nil)
	}
	if req.Key == "" {
		return failResult("无法生成有效的技能标识", nil)
	}
	if err := agentskill.ValidateMetadata(req.Key, req.Name, req.Description); err != nil {
		return failResult(err.Error(), nil)
	}
	release, err := reserveNewDraftKey(ctx, req.Key)
	if err != nil {
		return failResult(err.Error(), nil)
	}
	defer release()
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
	manifestText := agentskill.JSONText(manifest)
	if err := agentskill.ValidateManifestText(manifestText); err != nil {
		return failResult(err.Error(), nil)
	}
	if err := agentskill.ValidateAssignment(ctx, req.PackID, req.CateID); err != nil {
		return failResult(err.Error(), nil)
	}
	now := time.Now()
	draftID := uint64(agentmodel.NewSkillDraftModel().Insert(ctx, map[string]any{
		"pack_id":           req.PackID,
		"cate_id":           req.CateID,
		"key":               req.Key,
		"name":              req.Name,
		"description":       req.Description,
		"status":            agentmodel.SkillDraftStatusDraft,
		"skill_md":          defaultSourceSkillMD(req),
		"files_json":        agentskill.JSONText(files),
		"manifest":          manifestText,
		"validation_result": agentskill.JSONText(map[string]any{"source_imported": true}),
		"version":           1,
		"created_at":        now,
		"updated_at":        now,
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

func validateSourceRequest(req SourceRequest) error {
	if err := agentskill.ValidateStoredText("来源地址", req.SourceURL, maxSourceURLRunes); err != nil {
		return err
	}
	if err := agentskill.ValidateStoredText("许可证", req.License, maxSourceLicenseRunes); err != nil {
		return err
	}
	if err := agentskill.ValidateStoredText("来源说明", req.Notes, maxSourceNotesRunes); err != nil {
		return err
	}
	if len(req.UsedFiles) > maxDraftFiles {
		return fmt.Errorf("来源文件数量不能超过 %d 个", maxDraftFiles)
	}
	return nil
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
	if req.PackID == 0 {
		req.PackID = agentmodel.DefaultSkillPackID
	}
	return req
}

func cloneSource(ctx context.Context, req SourceRequest, target string) error {
	if err := validateSourceURL(req.SourceURL); err != nil {
		return err
	}
	if err := validateSourceRef(req.Ref); err != nil {
		return err
	}
	timeoutCtx, cancel := context.WithTimeout(ctx, sourceCloneTimeout)
	defer cancel()
	if req.Ref == "" {
		return runSourceGitCommand(timeoutCtx, "", target,
			"-c", "core.hooksPath=/dev/null", "clone", "--depth", "1", req.SourceURL, target,
		)
	}
	if err := os.MkdirAll(target, 0o755); err != nil {
		return err
	}
	commands := [][]string{
		{"-c", "core.hooksPath=/dev/null", "init"},
		{"-c", "core.hooksPath=/dev/null", "remote", "add", "origin", req.SourceURL},
		{"-c", "core.hooksPath=/dev/null", "fetch", "--depth", "1", "origin", req.Ref},
		{"-c", "core.hooksPath=/dev/null", "checkout", "--detach", "FETCH_HEAD"},
	}
	for _, args := range commands {
		if err := runSourceGitCommand(timeoutCtx, target, target, args...); err != nil {
			return err
		}
	}
	return validateSourceCloneTree(target)
}

func runSourceGitCommand(ctx context.Context, workDir string, limitRoot string, args ...string) error {
	gitHome := filepath.Join(filepath.Dir(limitRoot), ".git-home")
	if err := os.MkdirAll(gitHome, 0o700); err != nil {
		return err
	}
	command := exec.CommandContext(ctx, "git", args...)
	command.Dir = workDir
	command.Env = sourceGitEnvironment(gitHome)
	output := sandbox.NewOutputBuffer(sandbox.DefaultOutputMaxBytes)
	command.Stdout = output
	command.Stderr = output
	if err := command.Start(); err != nil {
		return fmt.Errorf("启动来源仓库拉取失败: %w", err)
	}
	wait := make(chan error, 1)
	go func() {
		wait <- command.Wait()
	}()
	ticker := time.NewTicker(sourceCloneCheckInterval)
	defer ticker.Stop()
	for {
		select {
		case err := <-wait:
			if ctx.Err() == context.DeadlineExceeded {
				return fmt.Errorf("拉取来源仓库超时")
			}
			if err != nil {
				message := strings.TrimSpace(output.String())
				if message == "" {
					message = err.Error()
				}
				if output.Truncated() {
					message += "\n[Git 输出已截断]"
				}
				return fmt.Errorf("拉取来源仓库失败: %s", message)
			}
			if _, statErr := os.Stat(limitRoot); statErr != nil {
				return fmt.Errorf("来源仓库目录不存在: %w", statErr)
			}
			return validateSourceCloneTree(limitRoot)
		case <-ticker.C:
			if err := validateSourceCloneTree(limitRoot); err != nil {
				if command.Process != nil {
					_ = command.Process.Kill()
				}
				<-wait
				return err
			}
		case <-ctx.Done():
			<-wait
			if ctx.Err() == context.DeadlineExceeded {
				return fmt.Errorf("拉取来源仓库超时")
			}
			return ctx.Err()
		}
	}
}

func sourceGitEnvironment(home string) []string {
	blocked := map[string]struct{}{
		"HOME": {}, "XDG_CONFIG_HOME": {}, "GIT_CONFIG_NOSYSTEM": {},
		"GIT_TERMINAL_PROMPT": {}, "GCM_INTERACTIVE": {}, "GIT_ASKPASS": {},
		"SSH_AUTH_SOCK": {}, "GIT_SSH": {}, "GIT_SSH_COMMAND": {},
	}
	env := make([]string, 0, len(os.Environ())+6)
	for _, item := range os.Environ() {
		name, _, hasValue := strings.Cut(item, "=")
		_, blockedName := blocked[name]
		if hasValue && blockedName {
			continue
		}
		env = append(env, item)
	}
	return append(env,
		"HOME="+home,
		"XDG_CONFIG_HOME="+filepath.Join(home, ".config"),
		"GIT_CONFIG_NOSYSTEM=1",
		"GIT_TERMINAL_PROMPT=0",
		"GCM_INTERACTIVE=Never",
		"GIT_ASKPASS=/bin/false",
	)
}

func validateSourceRef(ref string) error {
	ref = strings.TrimSpace(ref)
	if ref == "" {
		return nil
	}
	if len([]byte(ref)) > 255 || strings.HasPrefix(ref, "-") || strings.IndexFunc(ref, func(char rune) bool {
		return unicode.IsSpace(char) || char < 0x20 || char == 0x7f
	}) >= 0 {
		return fmt.Errorf("来源分支或标签格式不合法")
	}
	return nil
}

func validateSourceCloneTree(root string) error {
	if _, err := os.Stat(root); os.IsNotExist(err) {
		return nil
	} else if err != nil {
		return err
	}
	if err := agentskill.ValidateTreeLimits(root, sourceCloneTreeLimits); err != nil {
		return fmt.Errorf("来源仓库超过资源限制: %w", err)
	}
	return nil
}

func validateSourceURL(raw string) error {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return fmt.Errorf("来源地址不能为空")
	}
	if err := agentskill.ValidateStoredText("来源地址", raw, maxSourceURLRunes); err != nil {
		return err
	}
	parsed, err := url.Parse(raw)
	if err != nil || parsed.Hostname() == "" {
		return fmt.Errorf("来源地址不是合法 URL")
	}
	if strings.ToLower(parsed.Scheme) != "https" {
		return fmt.Errorf("来源地址只允许无凭据的 https")
	}
	if parsed.RawQuery != "" || parsed.Fragment != "" {
		return fmt.Errorf("来源地址不能包含查询参数或片段")
	}
	if parsed.User != nil {
		return fmt.Errorf("来源地址不能包含账号口令")
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
	seen := make(map[string]struct{}, len(selected))
	totalBytes := 0
	for _, item := range selected {
		relative := cleanSourceRelativePath(item)
		if relative == "" {
			if strings.TrimSpace(item) != "" {
				return nil, nil, fmt.Errorf("来源文件路径不安全: %s", item)
			}
			continue
		}
		if _, exists := seen[relative]; exists {
			continue
		}
		seen[relative] = struct{}{}
		if len(seen) > maxDraftFiles {
			return nil, nil, fmt.Errorf("来源文件数量不能超过 %d 个", maxDraftFiles)
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
		if !utf8.Valid(raw) {
			return nil, nil, fmt.Errorf("来源文件不是 UTF-8 文本: %s", relative)
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
	truncated := false
	err := filepath.WalkDir(repoDir, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if path == repoDir {
			return nil
		}
		if len(paths) >= 200 {
			truncated = true
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
	if truncated {
		paths = append(paths, "[来源文件列表已截断]")
	}
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
	if path == "." || path == "" || strings.HasPrefix(path, ".") || strings.HasPrefix(path, "../") || strings.HasPrefix(path, "/") || strings.Contains(path, "/.") {
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
		agentskill.MarkdownFrontMatter(req.Key, req.Name, req.Description),
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
