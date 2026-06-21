package draft

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	agentruntime "github.com/dever-package/bot/service/agent/runtime"
	agentskill "github.com/dever-package/bot/service/agent/skill"
	"github.com/dever-package/bot/service/agent/tool"
	"github.com/dever-package/bot/service/agent/tool/sandbox"
	"github.com/shemic/dever/orm"
)

const (
	maxDraftFileBytes  = 256 * 1024
	maxDraftTotalBytes = 2 * 1024 * 1024
	defaultStatus      = int16(1)
	defaultSort        = 100
)

type Service struct{}

type Request struct {
	ID      uint64
	Script  string
	Args    []string
	Target  string
	Timeout time.Duration
}

type SourceRequest struct {
	PackID      uint64
	CateID      uint64
	Key         string
	Name        string
	Description string
	SourceURL   string
	Ref         string
	License     string
	Notes       string
	UsedFiles   []string
}

type PatchRequest struct {
	ID     uint64
	PackID uint64
	CateID uint64
	Patch  map[string]any
}

type Result struct {
	Status  int            `json:"status"`
	Message string         `json:"message"`
	Data    map[string]any `json:"data,omitempty"`
}

type draftSnapshot struct {
	Row      agentmodel.SkillDraft
	Manifest map[string]any
	Files    map[string]string
}

func NewService() Service {
	return Service{}
}

func (Service) Validate(ctx context.Context, id uint64) Result {
	snapshot, issues, err := loadAndValidate(ctx, id)
	if err != nil {
		return failResult(err.Error(), nil)
	}
	result := validationPayload(issues)
	saveValidationResult(ctx, id, result)
	if len(issues) > 0 {
		return failResult("技能草稿校验失败", result)
	}
	return okResult("技能草稿校验通过", map[string]any{
		"key":   snapshot.Row.Key,
		"name":  snapshot.Row.Name,
		"files": len(snapshot.Files),
	})
}

func (Service) Test(ctx context.Context, req Request) Result {
	snapshot, issues, err := loadAndValidate(ctx, req.ID)
	if err != nil {
		return failResult(err.Error(), nil)
	}
	if len(issues) > 0 {
		result := validationPayload(issues)
		saveValidationResult(ctx, req.ID, result)
		return failResult("技能草稿校验失败，不能测试", result)
	}
	script := strings.TrimSpace(req.Script)
	if script == "" {
		script = firstDraftScript(snapshot)
	}
	if script == "" {
		return failResult("草稿没有可测试的 scripts/ 脚本", nil)
	}
	if err := validateDraftScriptPath(script); err != nil {
		return failResult(err.Error(), nil)
	}

	tempRoot, err := os.MkdirTemp("", "dever-skill-draft-test-*")
	if err != nil {
		return failResult(err.Error(), nil)
	}
	defer os.RemoveAll(tempRoot)

	skillRoot := filepath.Join(tempRoot, "skill")
	if err := writeDraftFiles(skillRoot, snapshot); err != nil {
		return failResult(err.Error(), nil)
	}
	testHash := draftSnapshotHash(snapshot)
	if err := installDraftDependencies(ctx, skillRoot, snapshot.Files); err != nil {
		return failResult(err.Error(), nil)
	}
	runtimeConfig := agentruntime.WithDefaults(runtimeConfig(ctx))
	options := tool.OptionsFromRuntimeConfig(runtimeConfig)
	configEnv, err := agentskill.LoadConfigEnv(ctx, draftConfigSkillID(ctx, snapshot), req.Target)
	if err != nil {
		return failResult(err.Error(), nil)
	}
	runResult, err := sandbox.Run(ctx, options.ScriptSandbox, sandbox.Request{
		SkillRoot:      skillRoot,
		TempRoot:       tempRoot,
		ScriptRelative: filepath.ToSlash(script),
		Args:           req.Args,
		Env:            configEnv.Env,
		Timeout:        req.Timeout,
	})
	if err != nil {
		return failResult(err.Error(), nil)
	}
	runResult.Stdout = agentskill.RedactSecrets(runResult.Stdout, configEnv.Secrets)
	runResult.Stderr = agentskill.RedactSecrets(runResult.Stderr, configEnv.Secrets)
	runResult.Error = agentskill.RedactSecrets(runResult.Error, configEnv.Secrets)
	payload := map[string]any{
		"test": map[string]any{
			"script":      runResult.Script,
			"runner":      runResult.Runner,
			"exit_code":   runResult.ExitCode,
			"duration_ms": runResult.DurationMS,
			"stdout":      runResult.Stdout,
			"stderr":      runResult.Stderr,
			"error":       runResult.Error,
			"truncated":   runResult.Truncated,
		},
		"test_passed": runResult.ExitCode == 0,
		"test_hash":   testHash,
	}
	saveValidationResult(ctx, req.ID, payload)
	if runResult.ExitCode != 0 {
		return failResult("技能脚本测试未通过", payload)
	}
	return okResult("技能脚本测试通过", payload)
}

func (Service) Publish(ctx context.Context, id uint64) Result {
	snapshot, issues, err := loadAndValidate(ctx, id)
	if err != nil {
		return failResult(err.Error(), nil)
	}
	if len(issues) > 0 {
		result := validationPayload(issues)
		saveValidationResult(ctx, id, result)
		return failResult("技能草稿校验失败，不能发布", result)
	}
	if draftRequiresSandboxTest(snapshot) && !draftTestPassed(snapshot) {
		return failResult("技能草稿必须先通过当前内容的沙箱测试后才能发布", map[string]any{
			"required": "run_test",
		})
	}
	skillID, err := publishSnapshot(ctx, snapshot)
	if err != nil {
		return failResult(err.Error(), nil)
	}
	return okResult("技能发布成功", map[string]any{
		"skill_id": skillID,
		"key":      snapshot.Row.Key,
	})
}

func (Service) CreateFromSkill(ctx context.Context, skillID uint64, packID uint64) Result {
	skill := agentmodel.NewSkillModel().Find(ctx, map[string]any{"id": skillID})
	if skill == nil {
		return failResult("正式技能不存在", nil)
	}
	skillMD, filesJSON, err := readPublishedSkillFiles(*skill)
	if err != nil {
		return failResult(err.Error(), nil)
	}
	if packID == 0 {
		packID = firstSkillPackID(ctx, skillID)
	}
	draftID := uint64(agentmodel.NewSkillDraftModel().Insert(ctx, map[string]any{
		"pack_id":         packID,
		"cate_id":         skill.CateID,
		"source_skill_id": skill.ID,
		"key":             skill.Key,
		"name":            skill.Name,
		"description":     skill.Description,
		"status":          agentmodel.SkillDraftStatusDraft,
		"skill_md":        skillMD,
		"files_json":      filesJSON,
		"manifest":        skill.Manifest,
		"validation_result": agentskill.JSONText(map[string]any{
			"source_skill_id": skill.ID,
		}),
		"created_at": time.Now(),
	}))
	if draftID == 0 {
		return failResult("创建修改草稿失败", nil)
	}
	return okResult("已创建修改草稿", map[string]any{
		"draft_id": draftID,
		"skill_id": skill.ID,
	})
}

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

func (Service) ApplyPatch(ctx context.Context, req PatchRequest) Result {
	values, err := draftPatchValues(ctx, req)
	if err != nil {
		return failResult(err.Error(), nil)
	}
	if req.ID > 0 {
		row := agentmodel.NewSkillDraftModel().Find(ctx, map[string]any{"id": req.ID})
		if row == nil {
			return failResult("技能草稿不存在", nil)
		}
		if len(values) == 0 {
			return okResult("没有需要更新的草稿内容", map[string]any{"draft_id": req.ID})
		}
		agentmodel.NewSkillDraftModel().Update(ctx, map[string]any{"id": req.ID}, values)
		return okResult("技能草稿已更新", map[string]any{"draft_id": req.ID})
	}

	if _, exists := values["key"]; !exists {
		return failResult("创建草稿时技能标识不能为空", nil)
	}
	if _, exists := values["name"]; !exists {
		values["name"] = values["key"]
	}
	if _, exists := values["pack_id"]; !exists {
		values["pack_id"] = req.PackID
	}
	if _, exists := values["cate_id"]; !exists {
		values["cate_id"] = defaultCateID(req.CateID)
	}
	values["status"] = agentmodel.SkillDraftStatusDraft
	values["created_at"] = time.Now()
	draftID := uint64(agentmodel.NewSkillDraftModel().Insert(ctx, values))
	if draftID == 0 {
		return failResult("创建技能草稿失败", nil)
	}
	return okResult("技能草稿已创建", map[string]any{"draft_id": draftID})
}

func loadAndValidate(ctx context.Context, id uint64) (draftSnapshot, []string, error) {
	row := agentmodel.NewSkillDraftModel().Find(ctx, map[string]any{"id": id})
	if row == nil {
		return draftSnapshot{}, nil, fmt.Errorf("技能草稿不存在")
	}
	snapshot := draftSnapshot{Row: *row}
	issues := validateBase(row)
	manifest, manifestIssues := parseDraftManifest(row.Manifest)
	files, fileIssues := parseDraftFiles(row.FilesJSON)
	issues = append(issues, manifestIssues...)
	issues = append(issues, fileIssues...)
	snapshot.Manifest = manifest
	snapshot.Files = files
	return snapshot, issues, nil
}

func validateBase(row *agentmodel.SkillDraft) []string {
	issues := make([]string, 0)
	if row == nil {
		return append(issues, "草稿不存在")
	}
	if strings.TrimSpace(row.Key) == "" {
		issues = append(issues, "技能标识不能为空")
	}
	if strings.TrimSpace(row.Name) == "" {
		issues = append(issues, "技能名称不能为空")
	}
	if strings.TrimSpace(row.SkillMD) == "" {
		issues = append(issues, "SKILL.md 不能为空")
	}
	if containsSecretLikeContent(row.SkillMD) {
		issues = append(issues, "SKILL.md 中疑似包含真实密钥")
	}
	return issues
}

func parseDraftManifest(raw string) (map[string]any, []string) {
	manifest := map[string]any{}
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return manifest, nil
	}
	if err := json.Unmarshal([]byte(raw), &manifest); err != nil {
		return manifest, []string{"manifest 必须是 JSON 对象"}
	}
	issues := make([]string, 0)
	for _, key := range []string{"value", "value_encrypted", "secret", "api_key", "cookie", "token"} {
		if _, exists := manifest[key]; exists {
			issues = append(issues, "manifest 顶层不能包含真实配置值: "+key)
		}
	}
	if configItems, ok := manifest["config"].([]any); ok {
		for index, item := range configItems {
			itemMap, ok := item.(map[string]any)
			if !ok {
				issues = append(issues, fmt.Sprintf("manifest.config[%d] 必须是对象", index))
				continue
			}
			for _, key := range []string{"value", "value_encrypted", "secret_value"} {
				if _, exists := itemMap[key]; exists {
					issues = append(issues, fmt.Sprintf("manifest.config[%d] 不能包含真实配置值: %s", index, key))
				}
			}
		}
	}
	return manifest, issues
}

func parseDraftFiles(raw string) (map[string]string, []string) {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return map[string]string{}, nil
	}
	values := map[string]string{}
	if err := json.Unmarshal([]byte(raw), &values); err != nil {
		return values, []string{"files_json 必须是路径到文本内容的 JSON 对象"}
	}
	issues := make([]string, 0)
	totalBytes := 0
	for path, content := range values {
		if err := validateDraftFilePath(path); err != nil {
			issues = append(issues, err.Error())
			continue
		}
		size := len([]byte(content))
		totalBytes += size
		if size > maxDraftFileBytes {
			issues = append(issues, fmt.Sprintf("草稿文件过大: %s", path))
		}
		if containsSecretLikeContent(content) {
			issues = append(issues, fmt.Sprintf("草稿文件疑似包含真实密钥: %s", path))
		}
	}
	if totalBytes > maxDraftTotalBytes {
		issues = append(issues, "草稿文件总大小超过限制")
	}
	return values, issues
}

func readPublishedSkillFiles(skill agentmodel.Skill) (string, string, error) {
	root := filepath.Clean(strings.TrimSpace(skill.InstallPath))
	if !agentskill.IsSafePath(root) {
		return "", "", fmt.Errorf("技能安装目录不安全")
	}
	entryFile := strings.TrimSpace(skill.EntryFile)
	if entryFile == "" {
		entryFile = agentskill.EntryFile
	}
	raw, err := os.ReadFile(filepath.Join(root, entryFile))
	if err != nil {
		return "", "", fmt.Errorf("读取正式技能入口失败: %w", err)
	}
	files := map[string]string{}
	for _, dir := range []string{"scripts", "references"} {
		if err := readPublishedSkillDir(root, dir, files); err != nil {
			return "", "", err
		}
	}
	return string(raw), agentskill.JSONText(files), nil
}

func readPublishedSkillDir(root string, dir string, files map[string]string) error {
	fullDir := filepath.Join(root, dir)
	info, err := os.Stat(fullDir)
	if err != nil || !info.IsDir() {
		return nil
	}
	totalBytes := 0
	return filepath.WalkDir(fullDir, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return nil
		}
		if path == fullDir {
			return nil
		}
		if entry.IsDir() {
			name := entry.Name()
			if strings.HasPrefix(name, ".") || name == "node_modules" || name == "__pycache__" || name == ".venv" || name == "venv" {
				return filepath.SkipDir
			}
			return nil
		}
		relative, err := filepath.Rel(root, path)
		if err != nil {
			return nil
		}
		relative = filepath.ToSlash(relative)
		if err := validateDraftFilePath(relative); err != nil {
			return nil
		}
		raw, err := os.ReadFile(path)
		if err != nil {
			return nil
		}
		if len(raw) > maxDraftFileBytes {
			return fmt.Errorf("正式技能文件过大，不能创建草稿: %s", relative)
		}
		totalBytes += len(raw)
		if totalBytes > maxDraftTotalBytes {
			return fmt.Errorf("正式技能文件总大小过大，不能创建草稿")
		}
		files[relative] = string(raw)
		return nil
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
	args := []string{"clone", "--depth", "1"}
	if req.Ref != "" {
		args = append(args, "--branch", req.Ref)
	}
	args = append(args, req.SourceURL, target)
	timeoutCtx, cancel := context.WithTimeout(ctx, 2*time.Minute)
	defer cancel()
	command := exec.CommandContext(timeoutCtx, "git", args...)
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
		fullPath := filepath.Join(repoDir, filepath.FromSlash(relative))
		if !strings.HasPrefix(filepath.Clean(fullPath), filepath.Clean(repoDir)+string(filepath.Separator)) {
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
		if err != nil || path == repoDir {
			return nil
		}
		relative, err := filepath.Rel(repoDir, path)
		if err != nil {
			return nil
		}
		relative = filepath.ToSlash(relative)
		if entry.IsDir() {
			if sourceDirSkipped(entry.Name()) {
				return filepath.SkipDir
			}
			return nil
		}
		if len(paths) >= 200 {
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

func draftPatchValues(ctx context.Context, req PatchRequest) (map[string]any, error) {
	patch := normalizePatchMap(req.Patch)
	if len(patch) == 0 {
		return nil, fmt.Errorf("草稿 patch 不能为空")
	}
	values := map[string]any{}
	if req.PackID > 0 {
		values["pack_id"] = req.PackID
	}
	if req.CateID > 0 {
		values["cate_id"] = req.CateID
	}
	if key := agentskill.NormalizeKey(patchText(patch, "key")); key != "" {
		values["key"] = key
	}
	if name := patchText(patch, "name"); name != "" {
		values["name"] = name
	}
	if description := patchText(patch, "description", "desc"); description != "" {
		values["description"] = description
	}
	if packID := patchUint64(patch, "pack_id", "packId"); packID > 0 {
		values["pack_id"] = packID
	}
	if cateID := patchUint64(patch, "cate_id", "cateId"); cateID > 0 {
		values["cate_id"] = cateID
	}
	if skillMD := patchText(patch, "skill_md", "skillMd", "skill"); skillMD != "" {
		values["skill_md"] = skillMD
	}
	if filesJSON, ok, err := patchJSONText(patch, "files_json", "filesJson", "files"); err != nil {
		return nil, err
	} else if ok {
		values["files_json"] = filesJSON
	}
	if manifest, ok, err := patchJSONText(patch, "manifest", "runtime_config", "runtimeConfig"); err != nil {
		return nil, err
	} else if ok {
		values["manifest"] = manifest
	}

	if req.ID > 0 {
		return values, nil
	}
	applyDraftPatchDefaults(ctx, values)
	return values, nil
}

func normalizePatchMap(raw map[string]any) map[string]any {
	if raw == nil {
		return map[string]any{}
	}
	if nested, ok := raw["patch"].(map[string]any); ok {
		return nested
	}
	if draft, ok := raw["draft"].(map[string]any); ok {
		return draft
	}
	return raw
}

func applyDraftPatchDefaults(ctx context.Context, values map[string]any) {
	key := strings.TrimSpace(fmt.Sprint(values["key"]))
	name := strings.TrimSpace(fmt.Sprint(values["name"]))
	description := strings.TrimSpace(fmt.Sprint(values["description"]))
	if key == "" {
		key = agentskill.NormalizeKey(name)
		if key != "" {
			values["key"] = key
		}
	}
	if name == "" && key != "" {
		name = key
		values["name"] = name
	}
	if _, exists := values["cate_id"]; !exists {
		values["cate_id"] = defaultCateID(0)
	}
	if _, exists := values["files_json"]; !exists {
		values["files_json"] = "{}"
	}
	if _, exists := values["skill_md"]; !exists {
		values["skill_md"] = defaultDraftSkillMD(name, description)
	}
	if _, exists := values["manifest"]; !exists {
		values["manifest"] = defaultDraftManifest(ctx, key, name, description)
	}
	values["validation_result"] = agentskill.JSONText(map[string]any{
		"assistant_patch": true,
	})
}

func defaultCateID(value uint64) uint64 {
	if value > 0 {
		return value
	}
	return agentmodel.DefaultSkillCateID
}

func defaultDraftSkillMD(name string, description string) string {
	lines := []string{
		"---",
		"name: " + strings.TrimSpace(name),
		"description: " + strings.TrimSpace(description),
		"---",
		"",
		"# " + strings.TrimSpace(name),
	}
	if strings.TrimSpace(description) != "" {
		lines = append(lines, "", strings.TrimSpace(description))
	}
	lines = append(lines, "", "## Usage", "", "按用户输入选择是否使用该技能。")
	return strings.Join(lines, "\n")
}

func defaultDraftManifest(_ context.Context, key string, name string, description string) string {
	return agentskill.JSONText(map[string]any{
		"key":         key,
		"name":        name,
		"description": description,
		"triggers":    []any{},
		"config":      []any{},
		"scripts":     []any{},
		"source_refs": []any{},
	})
}

func patchText(patch map[string]any, keys ...string) string {
	for _, key := range keys {
		if value, exists := patch[key]; exists {
			return strings.TrimSpace(fmt.Sprint(value))
		}
	}
	return ""
}

func patchUint64(patch map[string]any, keys ...string) uint64 {
	for _, key := range keys {
		if value, exists := patch[key]; exists {
			switch typed := value.(type) {
			case float64:
				return uint64(typed)
			case int:
				return uint64(typed)
			case uint64:
				return typed
			case string:
				var parsed uint64
				_, _ = fmt.Sscanf(strings.TrimSpace(typed), "%d", &parsed)
				return parsed
			}
		}
	}
	return 0
}

func patchJSONText(patch map[string]any, keys ...string) (string, bool, error) {
	for _, key := range keys {
		value, exists := patch[key]
		if !exists {
			continue
		}
		switch typed := value.(type) {
		case string:
			text := strings.TrimSpace(typed)
			if text == "" {
				return "", false, nil
			}
			if !json.Valid([]byte(text)) {
				return "", false, fmt.Errorf("%s 必须是 JSON", key)
			}
			return text, true, nil
		default:
			return agentskill.JSONText(typed), true, nil
		}
	}
	return "", false, nil
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

func validateDraftFilePath(path string) error {
	path = filepath.ToSlash(filepath.Clean(strings.TrimSpace(path)))
	if path == "" || path == "." || strings.HasPrefix(path, "../") || strings.HasPrefix(path, "/") {
		return fmt.Errorf("草稿文件路径不安全: %s", path)
	}
	if path == "requirements.txt" || path == "package.json" {
		return nil
	}
	if strings.HasPrefix(path, "scripts/") {
		return validateDraftScriptPath(path)
	}
	if strings.HasPrefix(path, "references/") {
		return nil
	}
	return fmt.Errorf("草稿文件只能放在 scripts/ 或 references/: %s", path)
}

func validateDraftScriptPath(path string) error {
	path = filepath.ToSlash(filepath.Clean(strings.TrimSpace(path)))
	if !strings.HasPrefix(path, "scripts/") || strings.Contains(path, "/.") {
		return fmt.Errorf("脚本路径不安全: %s", path)
	}
	switch strings.ToLower(filepath.Ext(path)) {
	case ".py", ".js", ".sh", ".bash":
		return nil
	default:
		return fmt.Errorf("脚本扩展名不允许: %s", path)
	}
}

func containsSecretLikeContent(content string) bool {
	lower := strings.ToLower(content)
	for _, marker := range []string{"sk-", "xoxb-", "-----begin private key-----"} {
		if strings.Contains(lower, marker) {
			return true
		}
	}
	return false
}

func firstDraftScript(snapshot draftSnapshot) string {
	if scripts, ok := snapshot.Manifest["scripts"].([]any); ok {
		for _, item := range scripts {
			if mapped, ok := item.(map[string]any); ok {
				if path := strings.TrimSpace(fmt.Sprint(mapped["path"])); path != "" {
					return filepath.ToSlash(path)
				}
			}
		}
	}
	paths := make([]string, 0, len(snapshot.Files))
	for path := range snapshot.Files {
		if strings.HasPrefix(filepath.ToSlash(path), "scripts/") {
			paths = append(paths, filepath.ToSlash(path))
		}
	}
	if len(paths) == 0 {
		return ""
	}
	sort.Strings(paths)
	return paths[0]
}

func writeDraftFiles(root string, snapshot draftSnapshot) error {
	if err := os.MkdirAll(root, 0o755); err != nil {
		return err
	}
	if err := os.WriteFile(filepath.Join(root, agentskill.EntryFile), []byte(snapshot.Row.SkillMD), 0o644); err != nil {
		return err
	}
	for path, content := range snapshot.Files {
		if err := validateDraftFilePath(path); err != nil {
			return err
		}
		target := filepath.Join(root, filepath.FromSlash(filepath.ToSlash(path)))
		if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
			return err
		}
		mode := os.FileMode(0o644)
		if strings.HasPrefix(filepath.ToSlash(path), "scripts/") {
			mode = 0o755
		}
		if err := os.WriteFile(target, []byte(content), mode); err != nil {
			return err
		}
	}
	return nil
}

func publishSnapshot(ctx context.Context, snapshot draftSnapshot) (uint64, error) {
	tempDir, err := os.MkdirTemp(agentskill.Root, ".publish-"+snapshot.Row.Key+"-")
	if err != nil {
		return 0, err
	}
	defer os.RemoveAll(tempDir)
	if err := writeDraftFiles(tempDir, snapshot); err != nil {
		return 0, err
	}
	applyDependencyManifest(snapshot.Manifest, snapshot.Files)
	if err := installDraftDependencies(ctx, tempDir, snapshot.Files); err != nil {
		return 0, err
	}
	target := filepath.Join(agentskill.Root, snapshot.Row.Key)
	if !agentskill.IsSafePath(target) {
		return 0, fmt.Errorf("技能安装目录不安全: %s", target)
	}
	replacement, err := replaceSkillDir(tempDir, target)
	if err != nil {
		return 0, err
	}
	skillID, err := upsertPublishedSkillWithRollback(ctx, snapshot, target, replacement)
	if err != nil {
		return 0, err
	}
	replacement.commit()
	return skillID, nil
}

func applyDependencyManifest(manifest map[string]any, files map[string]string) {
	if manifest == nil {
		return
	}
	if _, exists := manifest["dependencies"]; exists {
		return
	}
	dependencies := make([]any, 0, 2)
	if _, exists := files["requirements.txt"]; exists {
		dependencies = append(dependencies, map[string]any{
			"type": "python",
			"file": "requirements.txt",
			"path": ".dever/deps/python",
		})
	}
	if _, exists := files["package.json"]; exists {
		dependencies = append(dependencies, map[string]any{
			"type": "node",
			"file": "package.json",
			"path": ".dever/deps/node",
		})
	}
	if len(dependencies) > 0 {
		manifest["dependencies"] = dependencies
	}
}

func installDraftDependencies(ctx context.Context, root string, files map[string]string) error {
	if _, exists := files["requirements.txt"]; exists {
		target := filepath.Join(root, ".dever", "deps", "python")
		if err := os.MkdirAll(target, 0o755); err != nil {
			return err
		}
		if err := runDependencyCommand(ctx, root, "python3", "-m", "pip", "install", "--disable-pip-version-check", "-r", "requirements.txt", "-t", target); err != nil {
			return fmt.Errorf("安装 Python 依赖失败: %w", err)
		}
	}
	if _, exists := files["package.json"]; exists {
		target := filepath.Join(root, ".dever", "deps", "node")
		if err := os.MkdirAll(target, 0o755); err != nil {
			return err
		}
		if err := os.WriteFile(filepath.Join(target, "package.json"), []byte(files["package.json"]), 0o644); err != nil {
			return err
		}
		if err := runDependencyCommand(ctx, root, "npm", "install", "--ignore-scripts", "--omit=dev", "--prefix", target); err != nil {
			return fmt.Errorf("安装 Node 依赖失败: %w", err)
		}
	}
	return nil
}

func runDependencyCommand(ctx context.Context, workDir string, name string, args ...string) error {
	timeoutCtx, cancel := context.WithTimeout(ctx, 5*time.Minute)
	defer cancel()
	command := exec.CommandContext(timeoutCtx, name, args...)
	command.Dir = workDir
	output, err := command.CombinedOutput()
	if timeoutCtx.Err() == context.DeadlineExceeded {
		return fmt.Errorf("依赖安装超时")
	}
	if err != nil {
		return fmt.Errorf("%s", strings.TrimSpace(string(output)))
	}
	return nil
}

type skillDirReplacement struct {
	target    string
	backup    string
	committed bool
}

func replaceSkillDir(source string, target string) (*skillDirReplacement, error) {
	replacement := &skillDirReplacement{target: target}
	if _, err := os.Stat(target); err == nil {
		replacement.backup = target + ".bak-" + time.Now().Format("20060102150405.000000000")
		if err := os.Rename(target, replacement.backup); err != nil {
			return nil, err
		}
	} else if !os.IsNotExist(err) {
		return nil, err
	}
	if err := os.Rename(source, target); err != nil {
		if replacement.backup != "" {
			if restoreErr := os.Rename(replacement.backup, target); restoreErr != nil {
				return nil, fmt.Errorf("%w；恢复旧技能目录失败: %v", err, restoreErr)
			}
		}
		return nil, err
	}
	return replacement, nil
}

func (replacement *skillDirReplacement) commit() {
	if replacement == nil || replacement.committed {
		return
	}
	replacement.committed = true
	if replacement.backup != "" {
		_ = os.RemoveAll(replacement.backup)
	}
}

func (replacement *skillDirReplacement) rollback() error {
	if replacement == nil || replacement.committed {
		return nil
	}
	replacement.committed = true
	if err := os.RemoveAll(replacement.target); err != nil {
		return fmt.Errorf("清理新技能目录失败: %w", err)
	}
	if replacement.backup == "" {
		return nil
	}
	if err := os.Rename(replacement.backup, replacement.target); err != nil {
		return fmt.Errorf("恢复旧技能目录失败: %w", err)
	}
	return nil
}

func upsertPublishedSkillWithRollback(ctx context.Context, snapshot draftSnapshot, target string, replacement *skillDirReplacement) (skillID uint64, err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			if recoveredErr, ok := recovered.(error); ok {
				err = recoveredErr
			} else {
				err = fmt.Errorf("%v", recovered)
			}
		}
		if err != nil {
			if rollbackErr := replacement.rollback(); rollbackErr != nil {
				err = fmt.Errorf("%w；目录回滚失败: %v", err, rollbackErr)
			}
		}
	}()
	err = orm.Transaction(ctx, func(txCtx context.Context) error {
		var txErr error
		skillID, txErr = upsertPublishedSkill(txCtx, snapshot, target)
		if txErr != nil {
			return txErr
		}
		return markDraftPublished(txCtx, snapshot, skillID)
	})
	return skillID, err
}

func upsertPublishedSkill(ctx context.Context, snapshot draftSnapshot, target string) (uint64, error) {
	skillModel := agentmodel.NewSkillModel()
	manifest := snapshot.Manifest
	manifest["key"] = snapshot.Row.Key
	manifest["name"] = snapshot.Row.Name
	manifest["description"] = snapshot.Row.Description
	if _, exists := manifest["triggers"]; !exists {
		manifest["triggers"] = []any{}
	}
	manifest["source_url"] = fmt.Sprintf("dever:draft/%d", snapshot.Row.ID)
	record := map[string]any{
		"cate_id":       snapshot.Row.CateID,
		"key":           snapshot.Row.Key,
		"name":          snapshot.Row.Name,
		"description":   snapshot.Row.Description,
		"source_url":    manifest["source_url"],
		"install_input": "",
		"install_path":  filepath.ToSlash(target),
		"entry_file":    agentskill.EntryFile,
		"manifest":      agentskill.JSONText(manifest),
		"content_hash":  publishedContentHash(snapshot),
		"status":        defaultStatus,
	}
	existing := skillModel.Find(ctx, map[string]any{"key": snapshot.Row.Key})
	var skillID uint64
	if existing != nil {
		skillID = existing.ID
		skillModel.Update(ctx, map[string]any{"id": skillID}, record)
	} else {
		record["sort"] = defaultSort
		record["created_at"] = time.Now()
		skillID = uint64(skillModel.Insert(ctx, record))
	}
	if skillID == 0 {
		return 0, fmt.Errorf("写入正式技能失败")
	}
	ensureConfigRows(ctx, skillID, manifest)
	if snapshot.Row.PackID > 0 {
		ensurePackItem(ctx, snapshot.Row.PackID, skillID)
	}
	return skillID, nil
}

func ensureConfigRows(ctx context.Context, skillID uint64, manifest map[string]any) {
	items, ok := manifest["config"].([]any)
	if !ok || len(items) == 0 {
		return
	}
	model := agentmodel.NewSkillConfigModel()
	for _, item := range items {
		mapped, ok := item.(map[string]any)
		if !ok {
			continue
		}
		key := agentskill.ConfigEnvName(manifestString(mapped, "key", ""))
		if key == "" {
			continue
		}
		targetKey := manifestString(mapped, "target_key", "")
		required := agentmodel.SkillConfigRequiredNo
		if agentskill.Truthy(mapped["required"]) {
			required = agentmodel.SkillConfigRequiredYes
		}
		if existing := model.Find(ctx, map[string]any{"skill_id": skillID, "target_key": targetKey, "key": key}); existing != nil {
			model.Update(ctx, map[string]any{"id": existing.ID}, map[string]any{
				"name":     manifestString(mapped, "name", key),
				"type":     manifestString(mapped, "type", "secret"),
				"required": required,
			})
			continue
		}
		model.Insert(ctx, map[string]any{
			"skill_id":   skillID,
			"target_key": targetKey,
			"key":        key,
			"name":       manifestString(mapped, "name", key),
			"type":       manifestString(mapped, "type", "secret"),
			"required":   required,
			"status":     defaultStatus,
			"created_at": time.Now(),
		})
	}
	_ = agentskill.SyncConfigManifest(ctx, skillID)
}

func manifestString(values map[string]any, key string, fallback string) string {
	if values == nil {
		return fallback
	}
	value, exists := values[key]
	if !exists || value == nil {
		return fallback
	}
	text := strings.TrimSpace(fmt.Sprint(value))
	if text == "" || text == "<nil>" {
		return fallback
	}
	return text
}

func ensurePackItem(ctx context.Context, packID uint64, skillID uint64) {
	model := agentmodel.NewSkillPackItemModel()
	if model.Find(ctx, map[string]any{"pack_id": packID, "skill_id": skillID}) != nil {
		return
	}
	model.Insert(ctx, map[string]any{
		"pack_id":    packID,
		"skill_id":   skillID,
		"status":     defaultStatus,
		"sort":       defaultSort,
		"created_at": time.Now(),
	})
}

func firstSkillPackID(ctx context.Context, skillID uint64) uint64 {
	row := agentmodel.NewSkillPackItemModel().Find(ctx, map[string]any{
		"skill_id": skillID,
		"status":   defaultStatus,
	})
	if row == nil {
		return 0
	}
	return row.PackID
}

func runtimeConfig(ctx context.Context) agentmodel.RuntimeConfig {
	row := agentmodel.NewRuntimeConfigModel().Find(ctx, map[string]any{"id": agentmodel.DefaultRuntimeConfigID})
	if row == nil {
		return agentmodel.DefaultRuntimeConfig()
	}
	return *row
}

func draftConfigSkillID(ctx context.Context, snapshot draftSnapshot) uint64 {
	if snapshot.Row.SourceSkillID > 0 {
		return snapshot.Row.SourceSkillID
	}
	key := agentskill.NormalizeKey(snapshot.Row.Key)
	if key == "" {
		return 0
	}
	row := agentmodel.NewSkillModel().Find(ctx, map[string]any{"key": key})
	if row == nil {
		return 0
	}
	return row.ID
}

func publishedContentHash(snapshot draftSnapshot) string {
	hashInput := snapshot.Row.SkillMD + "\n" + agentskill.JSONText(snapshot.Files)
	sum := sha256.Sum256([]byte(hashInput))
	return hex.EncodeToString(sum[:])
}

func draftSnapshotHash(snapshot draftSnapshot) string {
	hashInput := snapshot.Row.SkillMD + "\n" + agentskill.JSONText(snapshot.Files) + "\n" + agentskill.JSONText(snapshot.Manifest)
	sum := sha256.Sum256([]byte(hashInput))
	return hex.EncodeToString(sum[:])
}

func draftTestPassed(snapshot draftSnapshot) bool {
	result := validationResultMap(snapshot.Row.ValidationResult)
	if !agentskill.Truthy(result["test_passed"]) {
		return false
	}
	if strings.TrimSpace(fmt.Sprint(result["test_hash"])) != draftSnapshotHash(snapshot) {
		return false
	}
	test, ok := result["test"].(map[string]any)
	if !ok {
		return false
	}
	return intFromAny(test["exit_code"]) == 0
}

func draftRequiresSandboxTest(snapshot draftSnapshot) bool {
	return firstDraftScript(snapshot) != ""
}

func markDraftPublished(ctx context.Context, snapshot draftSnapshot, skillID uint64) error {
	result := validationResultMap(snapshot.Row.ValidationResult)
	result["published_skill_id"] = skillID
	result["published_at"] = time.Now().Format(time.RFC3339Nano)
	affected := agentmodel.NewSkillDraftModel().Update(ctx, map[string]any{"id": snapshot.Row.ID}, map[string]any{
		"status":            agentmodel.SkillDraftStatusPublished,
		"source_skill_id":   skillID,
		"validation_result": agentskill.JSONText(result),
	})
	if affected == 0 {
		return fmt.Errorf("更新技能草稿发布状态失败")
	}
	return nil
}

func validationPayload(issues []string) map[string]any {
	return map[string]any{
		"valid":  len(issues) == 0,
		"issues": issues,
	}
}

func saveValidationResult(ctx context.Context, id uint64, payload map[string]any) {
	if id == 0 {
		return
	}
	current := map[string]any{}
	if row := agentmodel.NewSkillDraftModel().Find(ctx, map[string]any{"id": id}); row != nil {
		current = validationResultMap(row.ValidationResult)
	}
	for key, value := range payload {
		current[key] = value
	}
	agentmodel.NewSkillDraftModel().Update(ctx, map[string]any{"id": id}, map[string]any{
		"validation_result": agentskill.JSONText(current),
	})
}

func validationResultMap(raw string) map[string]any {
	result := map[string]any{}
	if strings.TrimSpace(raw) == "" {
		return result
	}
	_ = json.Unmarshal([]byte(raw), &result)
	return result
}

func intFromAny(value any) int {
	switch typed := value.(type) {
	case int:
		return typed
	case int64:
		return int(typed)
	case float64:
		return int(typed)
	case json.Number:
		parsed, _ := typed.Int64()
		return int(parsed)
	default:
		var parsed int
		_, _ = fmt.Sscanf(strings.TrimSpace(fmt.Sprint(value)), "%d", &parsed)
		return parsed
	}
}

func okResult(message string, data map[string]any) Result {
	return Result{Status: 1, Message: message, Data: data}
}

func failResult(message string, data map[string]any) Result {
	return Result{Status: 2, Message: message, Data: data}
}
