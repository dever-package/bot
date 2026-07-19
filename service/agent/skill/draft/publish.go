package draft

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimeconfig "github.com/dever-package/bot/service/agent/runtime/config"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

func writeDraftFiles(root string, snapshot draftSnapshot) error {
	if err := os.MkdirAll(root, 0o755); err != nil {
		return err
	}
	if err := os.WriteFile(filepath.Join(root, agentskill.EntryFile), []byte(normalizeDraftMarkdownContent(snapshot.Row.SkillMD)), 0o644); err != nil {
		return err
	}
	executableScripts := draftManifestScriptPaths(snapshot.Manifest)
	for path, content := range snapshot.Files {
		if err := validateDraftFilePath(path); err != nil {
			return err
		}
		target := filepath.Join(root, filepath.FromSlash(filepath.ToSlash(path)))
		if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
			return err
		}
		mode := os.FileMode(0o644)
		if _, executable := executableScripts[filepath.ToSlash(path)]; executable {
			mode = 0o755
		}
		if err := os.WriteFile(target, []byte(normalizeDraftFileContent(path, content)), mode); err != nil {
			return err
		}
	}
	return nil
}

func draftManifestScriptPaths(manifest map[string]any) map[string]struct{} {
	result := map[string]struct{}{}
	for _, executable := range agentskill.ManifestExecutablePaths(agentskill.JSONText(manifest)) {
		path := filepath.ToSlash(strings.TrimPrefix(strings.TrimSpace(executable), "/"))
		if path != "" {
			result[path] = struct{}{}
		}
	}
	return result
}

func publishSnapshot(ctx context.Context, snapshot draftSnapshot) (uint64, error) {
	if err := agentskill.EnsureRoot(); err != nil {
		return 0, err
	}
	tempDir, err := os.MkdirTemp(agentskill.Root, ".publish-"+snapshot.Row.Key+"-")
	if err != nil {
		return 0, err
	}
	defer os.RemoveAll(tempDir)
	if err := writeDraftFiles(tempDir, snapshot); err != nil {
		return 0, err
	}
	sandboxConfig := runtimetool.SandboxConfig(runtimeconfig.Load(ctx))
	dependencies, err := agentskill.PrepareDependencies(ctx, sandboxConfig, tempDir)
	if err != nil {
		return 0, err
	}
	if draftRequiresSandboxTest(snapshot) && !draftTestDependenciesMatch(snapshot, dependencies) {
		return 0, fmt.Errorf("技能依赖与测试时不一致，请重新测试后发布")
	}
	applyDependencyManifest(snapshot.Manifest, dependencies)
	snapshot.Manifest = publishedManifest(snapshot)
	if err := agentskill.ValidateManifestFiles(tempDir, snapshot.Manifest); err != nil {
		return 0, err
	}
	contentHash, err := agentskill.SkillContentHash(tempDir, snapshot.Manifest)
	if err != nil {
		return 0, err
	}
	target, err := agentskill.VersionedInstallPath(snapshot.Row.Key, contentHash)
	if err != nil {
		return 0, err
	}
	oldPath := publishedSkillPath(ctx, snapshot.Row.Key)
	var skillID uint64
	err = agentskill.ActivateDirectory(ctx, snapshot.Row.Key, tempDir, target, func(txCtx context.Context) error {
		if err := agentskill.ValidateAssignment(txCtx, snapshot.Row.PackID, snapshot.Row.CateID); err != nil {
			return err
		}
		var saveErr error
		skillID, saveErr = upsertPublishedSkill(txCtx, snapshot, target, contentHash)
		if saveErr != nil {
			return saveErr
		}
		return markDraftPublished(txCtx, snapshot, skillID)
	})
	if err != nil {
		return 0, err
	}
	agentskill.RemoveObsoletePath(snapshot.Row.Key, oldPath, target)
	agentskill.PruneSkillReleases(snapshot.Row.Key, target)
	return skillID, nil
}

func applyDependencyManifest(manifest map[string]any, dependencies []any) {
	if manifest == nil {
		return
	}
	if len(dependencies) > 0 {
		manifest["dependencies"] = dependencies
		return
	}
	delete(manifest, "dependencies")
}

func upsertPublishedSkill(ctx context.Context, snapshot draftSnapshot, target string, contentHash string) (uint64, error) {
	skillModel := agentmodel.NewSkillModel()
	manifest := publishedManifest(snapshot)
	existing := skillModel.Find(ctx, map[string]any{"key": snapshot.Row.Key})
	if snapshot.Row.SourceSkillID > 0 {
		source := skillModel.Find(ctx, map[string]any{"id": snapshot.Row.SourceSkillID})
		if source == nil {
			return 0, fmt.Errorf("原正式技能不存在")
		}
		if agentskill.NormalizeKey(source.Key) != agentskill.NormalizeKey(snapshot.Row.Key) {
			return 0, fmt.Errorf("修改正式技能时不能变更技能标识")
		}
	}
	record := map[string]any{
		"cate_id":       snapshot.Row.CateID,
		"key":           snapshot.Row.Key,
		"name":          snapshot.Row.Name,
		"description":   snapshot.Row.Description,
		"source_type":   agentmodel.SkillSourceTypeCustom,
		"source_url":    manifest["source_url"],
		"install_input": "",
		"install_path":  filepath.ToSlash(target),
		"entry_file":    agentskill.EntryFile,
		"manifest":      agentskill.JSONText(manifest),
		"content_hash":  contentHash,
		"status":        defaultStatus,
	}
	var skillID uint64
	if existing != nil {
		sourceType := agentmodel.NormalizeSkillSourceType(existing.SourceType, existing.SourceURL, existing.InstallInput)
		if sourceType != agentmodel.SkillSourceTypeCustom {
			return 0, fmt.Errorf("已存在同标识的安装来源技能，不能用自建技能覆盖: %s", snapshot.Row.Key)
		}
		if snapshot.Row.SourceSkillID == 0 {
			return 0, fmt.Errorf("技能标识已存在，请从已有技能走升级流程: %s", snapshot.Row.Key)
		}
		if existing.ID != snapshot.Row.SourceSkillID {
			return 0, fmt.Errorf("技能标识已被其他自创技能使用: %s", snapshot.Row.Key)
		}
		skillID = existing.ID
		if affected := skillModel.Update(ctx, map[string]any{"id": skillID}, record); affected == 0 {
			return 0, fmt.Errorf("更新正式技能失败: %s", snapshot.Row.Key)
		}
	} else {
		record["display_name"] = snapshot.Row.Name
		record["sort"] = defaultSort
		record["created_at"] = time.Now()
		skillID = uint64(skillModel.Insert(ctx, record))
	}
	if skillID == 0 {
		return 0, fmt.Errorf("写入正式技能失败")
	}
	if err := agentskill.SyncManifestConfig(ctx, skillID, manifest); err != nil {
		return 0, err
	}
	if snapshot.Row.PackID > 0 {
		if err := agentskill.EnsurePackItem(ctx, snapshot.Row.PackID, skillID); err != nil {
			return 0, err
		}
	}
	return skillID, nil
}

func publishedManifest(snapshot draftSnapshot) map[string]any {
	manifest := agentskill.CloneMap(snapshot.Manifest)
	agentskill.NormalizeManifestCapabilities(manifest)
	manifest["key"] = snapshot.Row.Key
	manifest["name"] = snapshot.Row.Name
	manifest["description"] = snapshot.Row.Description
	if _, exists := manifest["triggers"]; !exists {
		manifest["triggers"] = []any{}
	}
	manifest["source_url"] = fmt.Sprintf("dever:draft/%d", snapshot.Row.ID)
	return manifest
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

func publishedSkillPath(ctx context.Context, key string) string {
	row := agentmodel.NewSkillModel().Find(ctx, map[string]any{"key": agentskill.NormalizeKey(key)})
	if row == nil {
		return ""
	}
	return strings.TrimSpace(row.InstallPath)
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
	tests, ok := result["tests"].([]any)
	if !ok {
		return false
	}
	mcpTests, ok := result["mcp_tests"].([]any)
	if !ok {
		return false
	}
	return draftTestsCoverManifest(snapshot, tests) && draftMCPTestsCoverManifest(snapshot, mcpTests)
}

func draftRequiresSandboxTest(snapshot draftSnapshot) bool {
	manifest := agentskill.JSONText(snapshot.Manifest)
	return len(agentskill.ManifestScripts(manifest)) > 0 || agentskill.ManifestMCPCount(manifest) > 0
}

func draftTestDependenciesMatch(snapshot draftSnapshot, dependencies []any) bool {
	result := validationResultMap(snapshot.Row.ValidationResult)
	tested, ok := result["dependencies"].([]any)
	return ok && agentskill.JSONText(tested) == agentskill.JSONText(dependencies)
}

func markDraftPublished(ctx context.Context, snapshot draftSnapshot, skillID uint64) error {
	result := validationResultMap(snapshot.Row.ValidationResult)
	result["published_skill_id"] = skillID
	result["published_at"] = time.Now().Format(time.RFC3339Nano)
	affected := agentmodel.NewSkillDraftModel().Update(ctx, map[string]any{
		"id": snapshot.Row.ID, "status": agentmodel.SkillDraftStatusDraft, "version": snapshot.Row.Version,
	}, map[string]any{
		"status":            agentmodel.SkillDraftStatusPublished,
		"source_skill_id":   skillID,
		"validation_result": agentskill.JSONText(result),
		"version":           snapshot.Row.Version + 1,
		"updated_at":        time.Now(),
	})
	if affected == 0 {
		return fmt.Errorf("技能草稿在发布期间已发生变化，请重新测试后发布")
	}
	discardCompetingDrafts(ctx, snapshot)
	return nil
}

func discardCompetingDrafts(ctx context.Context, snapshot draftSnapshot) {
	filters := map[string]any{
		"status": agentmodel.SkillDraftStatusDraft,
	}
	if snapshot.Row.SourceSkillID > 0 {
		filters["source_skill_id"] = snapshot.Row.SourceSkillID
	} else {
		filters["source_skill_id"] = uint64(0)
		filters["key"] = snapshot.Row.Key
	}
	rows := agentmodel.NewSkillDraftModel().Select(ctx, filters)
	ids := make([]any, 0, len(rows))
	for _, row := range rows {
		if row != nil && row.ID != snapshot.Row.ID {
			ids = append(ids, row.ID)
		}
	}
	if len(ids) == 0 {
		return
	}
	agentmodel.NewSkillDraftModel().Update(ctx, map[string]any{
		"id": ids, "status": agentmodel.SkillDraftStatusDraft,
	}, map[string]any{
		"status": agentmodel.SkillDraftStatusDisabled, "updated_at": time.Now(),
	})
}
