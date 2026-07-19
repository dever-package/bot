package draft

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
	"unicode/utf8"

	agentmodel "github.com/dever-package/bot/model/agent"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

const (
	maxDraftFileBytes      = 256 * 1024
	maxDraftManifestBytes  = agentskill.MaxManifestBytes
	maxDraftFilesJSONBytes = 3 * 1024 * 1024
	maxDraftTotalBytes     = 2 * 1024 * 1024
	maxDraftFiles          = 1000
	defaultStatus          = int16(1)
	defaultSort            = 100
)

var draftDependencyFiles = []string{
	"requirements.txt",
	"pyproject.toml",
	"package.json",
	"package-lock.json",
	"npm-shrinkwrap.json",
}

type Service struct{}

type Request struct {
	ID      uint64
	Script  string
	Args    []string
	Target  string
	Timeout time.Duration
	Config  []TestConfigValue
}

type TestConfigValue struct {
	Key       string
	TargetKey string
	Value     string
}

type PublishRequest struct {
	ID              uint64
	ExpectedVersion uint64
	Name            string
	NameSet         bool
	Description     string
	DescriptionSet  bool
	PackID          uint64
	CateID          uint64
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
	ExpectedVersion     uint64
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

func (s Service) Publish(ctx context.Context, req PublishRequest) Result {
	if err := s.applyPublishMetadata(ctx, req); err != nil {
		return failResult(err.Error(), nil)
	}
	snapshot, issues, err := loadAndValidateExecutable(ctx, req.ID)
	if err != nil {
		return failResult(err.Error(), nil)
	}
	if len(issues) > 0 {
		result := validationPayload(issues)
		if err := saveValidationResult(ctx, snapshot, result); err != nil {
			return failResult(err.Error(), result)
		}
		return failResult("技能内容检查未通过，不能发布", result)
	}
	if err := agentskill.ValidateAssignment(ctx, snapshot.Row.PackID, snapshot.Row.CateID); err != nil {
		return failResult(err.Error(), nil)
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
	row, err := loadEditableDraft(ctx, req.ID)
	if err != nil {
		return err
	}
	if err := requireDraftVersion(row, req.ExpectedVersion); err != nil {
		return err
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
	if err := validateDraftUpdate(ctx, row, values); err != nil {
		return err
	}
	if len(values) == 0 {
		return nil
	}
	return updateDraftRow(ctx, row, values)
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
	if err := agentskill.ValidateAssignment(ctx, packID, skill.CateID); err != nil {
		return failResult(err.Error(), nil)
	}
	release, err := agentskill.Lock(ctx, skill.Key)
	if err != nil {
		return failResult(err.Error(), nil)
	}
	defer release()
	if draft := findEditableDraft(ctx, skill.ID); draft != nil {
		return okResult("已打开未发布版本", draftResultData(draft, skill.ID, false))
	}
	skillMD, filesJSON, err := readPublishedSkillFiles(*skill)
	if err != nil {
		return failResult(err.Error(), nil)
	}
	if err := agentskill.ValidateAssignment(ctx, packID, skill.CateID); err != nil {
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
		"version":    1,
		"created_at": time.Now(),
		"updated_at": time.Now(),
	}))
	if draftID == 0 {
		return failResult("创建修改草稿失败", nil)
	}
	draft := agentmodel.NewSkillDraftModel().Find(ctx, map[string]any{"id": draftID})
	return okResult("已创建未发布版本", draftResultData(draft, skill.ID, true))
}

func findEditableDraft(ctx context.Context, sourceSkillID uint64) *agentmodel.SkillDraft {
	if sourceSkillID == 0 {
		return nil
	}
	filters := map[string]any{
		"source_skill_id": sourceSkillID,
		"status":          agentmodel.SkillDraftStatusDraft,
	}
	rows := agentmodel.NewSkillDraftModel().Select(ctx, filters)
	for _, row := range rows {
		if row != nil {
			return row
		}
	}
	return nil
}

func reserveNewDraftKey(ctx context.Context, key string) (func(), error) {
	key = agentskill.NormalizeKey(key)
	if key == "" {
		return nil, fmt.Errorf("技能标识不能为空")
	}
	// 与安装、发布共用技能 key 锁，避免检查后被并发写入同名正式技能。
	release, err := agentskill.Lock(ctx, key)
	if err != nil {
		return nil, err
	}
	if skill := agentmodel.NewSkillModel().Find(ctx, map[string]any{"key": key}); skill != nil {
		release()
		if agentmodel.NormalizeSkillSourceType(skill.SourceType, skill.SourceURL, skill.InstallInput) == agentmodel.SkillSourceTypeCustom {
			return nil, fmt.Errorf("技能标识已存在，请从正式技能创建修改草稿: %s", key)
		}
		return nil, fmt.Errorf("技能标识已被安装或内置技能使用，不能创建自建技能: %s", key)
	}
	if draft := findEditableNewDraft(ctx, key); draft != nil {
		release()
		return nil, fmt.Errorf("已存在同标识的未发布草稿（ID: %d）", draft.ID)
	}
	return release, nil
}

func findEditableNewDraft(ctx context.Context, key string) *agentmodel.SkillDraft {
	rows := agentmodel.NewSkillDraftModel().Select(ctx, map[string]any{
		"key":             agentskill.NormalizeKey(key),
		"source_skill_id": uint64(0),
		"status":          agentmodel.SkillDraftStatusDraft,
	})
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
			"version":           draft.Version,
			"created_at":        draft.CreatedAt,
			"updated_at":        draft.UpdatedAt,
		},
	}
}

func loadAndValidate(ctx context.Context, id uint64) (draftSnapshot, []string, error) {
	row, err := loadEditableDraft(ctx, id)
	if err != nil {
		return draftSnapshot{}, nil, err
	}
	snapshot := draftSnapshot{Row: *row}
	issues := validateBase(row)
	manifest, manifestIssues := parseDraftManifest(row.Manifest)
	files, fileIssues := parseDraftFiles(row.FilesJSON)
	issues = append(issues, manifestIssues...)
	issues = append(issues, fileIssues...)
	issues = append(issues, validateDraftManifestScripts(manifest, files)...)
	snapshot.Manifest = manifest
	snapshot.Files = files
	return snapshot, issues, nil
}

func loadAndValidateExecutable(ctx context.Context, id uint64) (draftSnapshot, []string, error) {
	snapshot, issues, err := loadAndValidate(ctx, id)
	if err != nil {
		return draftSnapshot{}, nil, err
	}
	issues = append(issues, validateDraftScriptSyntax(ctx, snapshot.Files)...)
	return snapshot, issues, nil
}

func loadEditableDraft(ctx context.Context, id uint64) (*agentmodel.SkillDraft, error) {
	if id == 0 {
		return nil, fmt.Errorf("技能草稿不存在")
	}
	row := agentmodel.NewSkillDraftModel().Find(ctx, map[string]any{"id": id})
	if row == nil {
		return nil, fmt.Errorf("技能草稿不存在")
	}
	if row.Status != agentmodel.SkillDraftStatusDraft {
		return nil, fmt.Errorf("技能草稿已发布或已丢弃，不能继续修改")
	}
	return row, nil
}

func validateDraftUpdate(ctx context.Context, row *agentmodel.SkillDraft, values map[string]any) error {
	key := row.Key
	name := row.Name
	description := row.Description
	if value, exists := values["key"]; exists {
		key = strings.TrimSpace(fmt.Sprint(value))
	}
	if value, exists := values["name"]; exists {
		name = strings.TrimSpace(fmt.Sprint(value))
	}
	if value, exists := values["description"]; exists {
		description = strings.TrimSpace(fmt.Sprint(value))
	}
	if err := agentskill.ValidateMetadata(key, name, description); err != nil {
		return err
	}
	packID := row.PackID
	cateID := row.CateID
	if value := patchUint64(values, "pack_id"); value > 0 {
		packID = value
	}
	if value := patchUint64(values, "cate_id"); value > 0 {
		cateID = value
	}
	return agentskill.ValidateAssignment(ctx, packID, cateID)
}

func updateDraftRow(ctx context.Context, row *agentmodel.SkillDraft, values map[string]any) error {
	if row == nil || row.ID == 0 {
		return fmt.Errorf("技能草稿不存在")
	}
	values["version"] = row.Version + 1
	values["updated_at"] = time.Now()
	affected := agentmodel.NewSkillDraftModel().Update(ctx, map[string]any{
		"id": row.ID, "status": agentmodel.SkillDraftStatusDraft, "version": row.Version,
	}, values)
	if affected == 0 {
		return fmt.Errorf("技能草稿已发生变化，请刷新后重试")
	}
	return nil
}

func requireDraftVersion(row *agentmodel.SkillDraft, expected uint64) error {
	if row == nil || row.ID == 0 {
		return fmt.Errorf("技能草稿不存在")
	}
	if expected == 0 {
		return fmt.Errorf("缺少技能草稿版本，请刷新后重试")
	}
	if row.Version != expected {
		return fmt.Errorf("技能草稿已发生变化，请刷新后重试")
	}
	return nil
}

func validateBase(row *agentmodel.SkillDraft) []string {
	issues := make([]string, 0)
	if row == nil {
		return append(issues, "草稿不存在")
	}
	if err := agentskill.ValidateMetadata(row.Key, row.Name, row.Description); err != nil {
		issues = append(issues, err.Error())
	}
	if strings.TrimSpace(row.SkillMD) == "" {
		issues = append(issues, "SKILL.md 不能为空")
	}
	if len([]byte(row.SkillMD)) > maxDraftFileBytes {
		issues = append(issues, fmt.Sprintf("SKILL.md 不能超过 %d 字节", maxDraftFileBytes))
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
	if len([]byte(raw)) > maxDraftManifestBytes {
		return manifest, []string{fmt.Sprintf("manifest 不能超过 %d 字节", maxDraftManifestBytes)}
	}
	if err := json.Unmarshal([]byte(raw), &manifest); err != nil {
		return manifest, []string{"manifest 必须是 JSON 对象"}
	}
	return manifest, agentskill.ManifestIssues(manifest)
}

func parseDraftFiles(raw string) (map[string]string, []string) {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return map[string]string{}, nil
	}
	if len([]byte(raw)) > maxDraftFilesJSONBytes {
		return map[string]string{}, []string{fmt.Sprintf("files_json 不能超过 %d 字节", maxDraftFilesJSONBytes)}
	}
	values := map[string]string{}
	if err := json.Unmarshal([]byte(raw), &values); err != nil {
		return values, []string{"files_json 必须是路径到文本内容的 JSON 对象"}
	}
	issues := make([]string, 0)
	normalized := normalizeDraftFiles(values)
	if len(normalized) != len(values) {
		issues = append(issues, "files_json 包含规范化后重复的文件路径")
	}
	values = normalized
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
	if err := agentskill.ValidateInstallRoot(root); err != nil {
		return "", "", fmt.Errorf("技能安装目录不安全: %w", err)
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
	if !utf8.Valid(raw) {
		return "", "", fmt.Errorf("正式技能入口不是 UTF-8 文本")
	}
	files := map[string]string{}
	totalBytes := len(raw)
	for _, file := range draftDependencyFiles {
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
	if !utf8.Valid(raw) {
		return fmt.Errorf("正式技能文件不是 UTF-8 文本: %s", relative)
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
	normalized, err := agentskill.NormalizeRelativePath(path)
	if err != nil {
		return fmt.Errorf("草稿文件路径不安全 %s: %w", path, err)
	}
	if isDraftDependencyFile(normalized) {
		return nil
	}
	if strings.HasPrefix(normalized, "scripts/") {
		return validateDraftResourcePath(normalized, "scripts/", "脚本资源")
	}
	if strings.HasPrefix(normalized, "references/") {
		return validateDraftResourcePath(normalized, "references/", "参考资料")
	}
	return fmt.Errorf("草稿文件只能放在 scripts/ 或 references/: %s", normalized)
}

func isDraftDependencyFile(path string) bool {
	path = filepath.ToSlash(filepath.Clean(strings.TrimSpace(path)))
	for _, allowed := range draftDependencyFiles {
		if path == allowed {
			return true
		}
	}
	return false
}

func validateDraftResourcePath(path string, prefix string, label string) error {
	path = filepath.ToSlash(filepath.Clean(strings.TrimSpace(path)))
	if !strings.HasPrefix(path, prefix) || path == strings.TrimSuffix(prefix, "/") || strings.Contains(path, "/.") {
		return fmt.Errorf("%s路径不安全: %s", label, path)
	}
	return nil
}

func validateDraftScriptPath(path string) error {
	normalized, err := agentskill.NormalizeRelativePath(path)
	if err != nil || !strings.HasPrefix(normalized, "scripts/") || strings.Contains(normalized, "/.") {
		return fmt.Errorf("脚本路径不安全: %s", path)
	}
	switch strings.ToLower(filepath.Ext(normalized)) {
	case ".py", ".js", ".mjs", ".sh", ".bash":
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

func validationPayload(issues []string) map[string]any {
	return map[string]any{
		"valid":  len(issues) == 0,
		"issues": issues,
	}
}

func saveValidationResult(ctx context.Context, snapshot draftSnapshot, payload map[string]any) error {
	current := validationResultMap(snapshot.Row.ValidationResult)
	for key, value := range payload {
		current[key] = value
	}
	affected := agentmodel.NewSkillDraftModel().Update(ctx, map[string]any{
		"id": snapshot.Row.ID, "status": agentmodel.SkillDraftStatusDraft, "version": snapshot.Row.Version,
	}, map[string]any{
		"validation_result": agentskill.JSONText(current),
	})
	if affected == 0 {
		return fmt.Errorf("技能草稿已发生变化，请刷新后重试")
	}
	return nil
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
