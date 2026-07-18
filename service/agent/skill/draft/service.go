package draft

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeconfig "github.com/dever-package/bot/service/agent/runtime/config"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	"github.com/dever-package/bot/service/agent/runtime/tool/sandbox"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

const (
	maxDraftFileBytes  = 256 * 1024
	maxDraftTotalBytes = 2 * 1024 * 1024
	maxDraftFiles      = 1000
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

type PublishRequest struct {
	ID             uint64
	Name           string
	NameSet        bool
	Description    string
	DescriptionSet bool
	PackID         uint64
	CateID         uint64
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
	ID                  uint64
	PackID              uint64
	CateID              uint64
	Patch               map[string]any
	AssistantSessionID  uint64
	AssistantAgentKey   string
	AssistantContextKey string
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

func (Service) Test(ctx context.Context, req Request) Result {
	snapshot, issues, err := loadAndValidate(ctx, req.ID)
	if err != nil {
		return failResult(err.Error(), nil)
	}
	if len(issues) > 0 {
		result := validationPayload(issues)
		saveValidationResult(ctx, req.ID, result)
		return failResult("技能内容检查未通过，不能测试", result)
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
	runtimeConfig := runtimeconfig.Load(ctx)
	sandboxConfig := runtimetool.SandboxConfig(runtimeConfig)
	if _, err := agentskill.PrepareDependencies(ctx, sandboxConfig, skillRoot); err != nil {
		return failResult(err.Error(), nil)
	}
	configEnv, err := agentskill.LoadConfigEnv(ctx, draftConfigSkillID(ctx, snapshot), agentskill.JSONText(snapshot.Manifest), req.Target)
	if err != nil {
		return failResult(err.Error(), nil)
	}
	runResult, err := sandbox.Run(ctx, sandboxConfig, sandbox.Request{
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

func (s Service) Publish(ctx context.Context, req PublishRequest) Result {
	if err := s.applyPublishMetadata(ctx, req); err != nil {
		return failResult(err.Error(), nil)
	}
	snapshot, issues, err := loadAndValidate(ctx, req.ID)
	if err != nil {
		return failResult(err.Error(), nil)
	}
	if len(issues) > 0 {
		result := validationPayload(issues)
		saveValidationResult(ctx, req.ID, result)
		return failResult("技能内容检查未通过，不能发布", result)
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

func (Service) applyPublishMetadata(ctx context.Context, req PublishRequest) error {
	if req.ID == 0 {
		return fmt.Errorf("技能草稿不存在")
	}
	row := agentmodel.NewSkillDraftModel().Find(ctx, map[string]any{"id": req.ID})
	if row == nil {
		return fmt.Errorf("技能草稿不存在")
	}
	values := map[string]any{}
	if req.NameSet {
		name := strings.TrimSpace(req.Name)
		if name == "" {
			return fmt.Errorf("技能名称不能为空")
		}
		values["name"] = name
	}
	if req.DescriptionSet {
		values["description"] = strings.TrimSpace(req.Description)
	}
	if req.PackID > 0 {
		values["pack_id"] = req.PackID
	}
	if req.CateID > 0 {
		values["cate_id"] = req.CateID
	}
	if len(values) == 0 {
		return nil
	}
	if affected := agentmodel.NewSkillDraftModel().Update(ctx, map[string]any{"id": req.ID}, values); affected == 0 {
		return fmt.Errorf("保存发布设置失败")
	}
	return nil
}

func (Service) CreateFromSkill(ctx context.Context, skillID uint64, packID uint64) Result {
	skill := agentmodel.NewSkillModel().Find(ctx, map[string]any{"id": skillID})
	if skill == nil {
		return failResult("正式技能不存在", nil)
	}
	sourceType := agentmodel.NormalizeSkillSourceType(skill.SourceType, skill.SourceURL, skill.InstallInput)
	if sourceType != agentmodel.SkillSourceTypeCustom {
		return failResult("安装来源的技能不能直接修改，请使用升级安装。", map[string]any{
			"skill_id":     skill.ID,
			"source_type":  sourceType,
			"source_label": agentmodel.SkillSourceTypeLabel(sourceType),
		})
	}
	if packID == 0 {
		packID = firstSkillPackID(ctx, skillID)
	}
	if draft := findEditableDraft(ctx, skill.ID, packID); draft != nil {
		return okResult("已打开未发布版本", draftResultData(draft, skill.ID, false))
	}
	skillMD, filesJSON, err := readPublishedSkillFiles(*skill)
	if err != nil {
		return failResult(err.Error(), nil)
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
	draft := agentmodel.NewSkillDraftModel().Find(ctx, map[string]any{"id": draftID})
	return okResult("已创建未发布版本", draftResultData(draft, skill.ID, true))
}

func findEditableDraft(ctx context.Context, sourceSkillID uint64, packID uint64) *agentmodel.SkillDraft {
	if sourceSkillID == 0 {
		return nil
	}
	filters := map[string]any{
		"source_skill_id": sourceSkillID,
		"status":          agentmodel.SkillDraftStatusDraft,
	}
	if packID > 0 {
		filters["pack_id"] = packID
	}
	rows := agentmodel.NewSkillDraftModel().Select(ctx, filters)
	for _, row := range rows {
		if row != nil {
			return row
		}
	}
	return nil
}

func draftResultData(draft *agentmodel.SkillDraft, sourceSkillID uint64, created bool) map[string]any {
	if draft == nil {
		return map[string]any{
			"skill_id": sourceSkillID,
			"created":  created,
		}
	}
	return map[string]any{
		"draft_id": draft.ID,
		"skill_id": sourceSkillID,
		"created":  created,
		"draft": map[string]any{
			"id":                draft.ID,
			"pack_id":           draft.PackID,
			"cate_id":           draft.CateID,
			"source_skill_id":   draft.SourceSkillID,
			"key":               draft.Key,
			"name":              draft.Name,
			"description":       draft.Description,
			"status":            draft.Status,
			"skill_md":          draft.SkillMD,
			"files_json":        draft.FilesJSON,
			"manifest":          draft.Manifest,
			"validation_result": draft.ValidationResult,
			"created_at":        draft.CreatedAt,
		},
	}
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
	issues = append(issues, validateDraftManifestScripts(manifest, files)...)
	issues = append(issues, validateDraftScriptSyntax(ctx, files)...)
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
	if _, exists := manifest["builtin_methods"]; exists {
		issues = append(issues, "manifest 不能声明平台内置方法")
		delete(manifest, "builtin_methods")
	}
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
			configKey := strings.TrimSpace(fmt.Sprint(itemMap["key"]))
			if configKey == "" {
				issues = append(issues, fmt.Sprintf("manifest.config[%d].key 不能为空", index))
			} else if !agentskill.IsValidConfigEnvName(configKey) {
				issues = append(issues, fmt.Sprintf("manifest.config[%d].key 只能包含字母、数字和下划线，且不能使用系统保留变量名", index))
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
	values = normalizeDraftFiles(values)
	issues := make([]string, 0)
	if len(values) > maxDraftFiles {
		issues = append(issues, fmt.Sprintf("草稿文件数量不能超过 %d 个", maxDraftFiles))
	}
	totalBytes := 0
	validatedFiles := 0
	for path, content := range values {
		if validatedFiles >= maxDraftFiles {
			break
		}
		validatedFiles++
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
	entryPath, _, err := agentskill.ResolveRelativePath(root, entryFile)
	if err != nil {
		return "", "", fmt.Errorf("技能入口路径不安全: %w", err)
	}
	raw, err := os.ReadFile(entryPath)
	if err != nil {
		return "", "", fmt.Errorf("读取正式技能入口失败: %w", err)
	}
	if len(raw) > maxDraftFileBytes {
		return "", "", fmt.Errorf("正式技能入口过大，不能创建草稿")
	}
	files := map[string]string{}
	totalBytes := len(raw)
	for _, file := range []string{"requirements.txt", "package.json"} {
		if err := readPublishedSkillFile(root, file, files, &totalBytes, true); err != nil {
			return "", "", err
		}
	}
	for _, dir := range []string{"scripts", "references"} {
		if err := readPublishedSkillDir(root, dir, files, &totalBytes); err != nil {
			return "", "", err
		}
	}
	return string(raw), agentskill.JSONText(files), nil
}

func readPublishedSkillFile(root string, relative string, files map[string]string, totalBytes *int, optional bool) error {
	path, normalized, err := agentskill.ResolveRelativePath(root, relative)
	if err != nil {
		return fmt.Errorf("正式技能文件路径不安全 %s: %w", relative, err)
	}
	info, err := os.Stat(path)
	if optional && os.IsNotExist(err) {
		return nil
	}
	if err != nil {
		return fmt.Errorf("读取正式技能文件失败 %s: %w", relative, err)
	}
	if !info.Mode().IsRegular() {
		return fmt.Errorf("正式技能文件不是普通文件: %s", relative)
	}
	if info.Size() > maxDraftFileBytes {
		return fmt.Errorf("正式技能文件过大，不能创建草稿: %s", relative)
	}
	raw, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("读取正式技能文件失败 %s: %w", relative, err)
	}
	*totalBytes += len(raw)
	if *totalBytes > maxDraftTotalBytes {
		return fmt.Errorf("正式技能文件总大小过大，不能创建草稿")
	}
	normalized = filepath.ToSlash(normalized)
	if _, exists := files[normalized]; !exists && len(files) >= maxDraftFiles {
		return fmt.Errorf("正式技能文件数量超过 %d 个，不能创建草稿", maxDraftFiles)
	}
	files[normalized] = string(raw)
	return nil
}

func readPublishedSkillDir(root string, dir string, files map[string]string, totalBytes *int) error {
	fullDir, _, resolveErr := agentskill.ResolveRelativePath(root, dir)
	if resolveErr != nil {
		return resolveErr
	}
	info, err := os.Stat(fullDir)
	if os.IsNotExist(err) {
		return nil
	}
	if err != nil {
		return fmt.Errorf("读取正式技能目录失败 %s: %w", dir, err)
	}
	if !info.IsDir() {
		return fmt.Errorf("正式技能路径不是目录: %s", dir)
	}
	return filepath.WalkDir(fullDir, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
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
			return err
		}
		relative = filepath.ToSlash(relative)
		if err := validateDraftFilePath(relative); err != nil {
			return err
		}
		return readPublishedSkillFile(root, relative, files, totalBytes, false)
	})
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
