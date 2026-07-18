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
		if err := os.WriteFile(target, []byte(normalizeDraftFileContent(path, content)), mode); err != nil {
			return err
		}
	}
	return nil
}

func publishSnapshot(ctx context.Context, snapshot draftSnapshot) (uint64, error) {
	if err := os.MkdirAll(agentskill.Root, 0o755); err != nil {
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
	applyDependencyManifest(snapshot.Manifest, dependencies)
	target := filepath.Join(agentskill.Root, snapshot.Row.Key)
	if !agentskill.IsSafePath(target) {
		return 0, fmt.Errorf("技能安装目录不安全: %s", target)
	}
	var skillID uint64
	err = agentskill.ActivateDirectory(ctx, snapshot.Row.Key, tempDir, target, func(txCtx context.Context) error {
		var saveErr error
		skillID, saveErr = upsertPublishedSkill(txCtx, snapshot, target)
		if saveErr != nil {
			return saveErr
		}
		return markDraftPublished(txCtx, snapshot, skillID)
	})
	if err != nil {
		return 0, err
	}
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

func upsertPublishedSkill(ctx context.Context, snapshot draftSnapshot, target string) (uint64, error) {
	skillModel := agentmodel.NewSkillModel()
	manifest := snapshot.Manifest
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
	if existing == nil {
		agentskill.NormalizeManifestCapabilities(manifest)
	} else if _, explicit := manifest["capabilities"]; explicit {
		agentskill.NormalizeManifestCapabilities(manifest)
	}
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
		"source_type":   agentmodel.SkillSourceTypeCustom,
		"source_url":    manifest["source_url"],
		"install_input": "",
		"install_path":  filepath.ToSlash(target),
		"entry_file":    agentskill.EntryFile,
		"manifest":      agentskill.JSONText(manifest),
		"content_hash":  publishedContentHash(snapshot),
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
		skillModel.Update(ctx, map[string]any{"id": skillID}, record)
	} else {
		record["display_name"] = snapshot.Row.Name
		record["sort"] = defaultSort
		record["created_at"] = time.Now()
		skillID = uint64(skillModel.Insert(ctx, record))
	}
	if skillID == 0 {
		return 0, fmt.Errorf("写入正式技能失败")
	}
	agentskill.SyncManifestConfig(ctx, skillID, manifest)
	if snapshot.Row.PackID > 0 {
		agentskill.EnsurePackItem(ctx, snapshot.Row.PackID, skillID)
	}
	return skillID, nil
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
