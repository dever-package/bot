package install

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/shemic/dever/orm"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

func parseSkillSources(sources []installedSkillSource) ([]parsedSkillSource, error) {
	if len(sources) == 0 {
		return nil, fmt.Errorf("未找到可安装技能")
	}
	seen := map[string]struct{}{}
	installs := make([]parsedSkillSource, 0, len(sources))
	for _, source := range sources {
		parsed, err := agentskill.ParseFile(source.FilePath)
		if err != nil {
			return nil, err
		}
		if parsed.Key == "" {
			return nil, fmt.Errorf("技能标识不能为空，请检查 SKILL.md frontmatter")
		}
		if parsed.Name == "" {
			parsed.Name = parsed.Key
		}
		if _, exists := seen[parsed.Key]; exists {
			return nil, fmt.Errorf("发现重复技能标识: %s", parsed.Key)
		}
		seen[parsed.Key] = struct{}{}

		finalDir := filepath.Join(agentskill.Root, parsed.Key)
		if !agentskill.IsSafePath(finalDir) {
			return nil, fmt.Errorf("技能安装目录不安全: %s", finalDir)
		}

		entryFile := filepath.Base(source.FilePath)
		if entryFile == "" || entryFile == "." {
			entryFile = agentskill.EntryFile
		}
		installs = append(installs, parsedSkillSource{
			Source:    source,
			Parsed:    parsed,
			FinalDir:  finalDir,
			EntryFile: entryFile,
		})
	}
	return installs, nil
}

func (s Service) saveInstalledSkill(ctx context.Context, execInfo *skillInstallExecution, install parsedSkillSource) (map[string]any, error) {
	model := agentmodel.NewSkillModel()

	if existing := model.Find(ctx, map[string]any{"key": install.Parsed.Key}); existing != nil {
		manifest := installedSkillManifest(install.Parsed.Manifest, install.Source.SourceURL, existing.Manifest)
		oldPath := strings.TrimSpace(existing.InstallPath)
		replacement, err := replaceInstalledSkill(install.Source.Directory, install.FinalDir)
		if err != nil {
			return nil, err
		}
		result, err := saveInstalledSkillWithRollback(ctx, replacement, func(txCtx context.Context) (map[string]any, error) {
			model.Update(txCtx, map[string]any{"id": existing.ID}, map[string]any{
				"cate_id":       execInfo.CateID,
				"name":          install.Parsed.Name,
				"description":   install.Parsed.Description,
				"source_type":   agentmodel.SkillSourceTypeInstalled,
				"source_url":    install.Source.SourceURL,
				"install_input": execInfo.Input,
				"install_path":  filepath.ToSlash(install.FinalDir),
				"entry_file":    install.EntryFile,
				"manifest":      agentskill.JSONText(manifest),
				"content_hash":  install.Parsed.Hash,
				"status":        defaultStatus,
			})
			if execInfo.AutoAddToPack && execInfo.TargetPackID > 0 {
				ensureSkillInPack(txCtx, execInfo.TargetPackID, existing.ID)
			}
			return map[string]any{
				"id":   existing.ID,
				"key":  install.Parsed.Key,
				"name": install.Parsed.Name,
				"path": filepath.ToSlash(install.FinalDir),
			}, nil
		})
		if err != nil {
			return nil, err
		}
		removeOldSkillPath(oldPath, install.FinalDir)
		s.log(execInfo, "技能已存在，已刷新安装内容: %s (%s)", install.Parsed.Name, install.Parsed.Key)
		return result, nil
	}

	manifest := installedSkillManifest(install.Parsed.Manifest, install.Source.SourceURL, "")
	replacement, err := replaceInstalledSkill(install.Source.Directory, install.FinalDir)
	if err != nil {
		return nil, err
	}

	result, err := saveInstalledSkillWithRollback(ctx, replacement, func(txCtx context.Context) (map[string]any, error) {
		skillID := uint64(model.Insert(txCtx, map[string]any{
			"cate_id":       execInfo.CateID,
			"key":           install.Parsed.Key,
			"name":          install.Parsed.Name,
			"description":   install.Parsed.Description,
			"source_type":   agentmodel.SkillSourceTypeInstalled,
			"source_url":    install.Source.SourceURL,
			"install_input": execInfo.Input,
			"install_path":  filepath.ToSlash(install.FinalDir),
			"entry_file":    install.EntryFile,
			"manifest":      agentskill.JSONText(manifest),
			"content_hash":  install.Parsed.Hash,
			"status":        defaultStatus,
			"sort":          defaultSort,
			"created_at":    time.Now(),
		}))
		if skillID == 0 {
			return nil, fmt.Errorf("写入技能记录失败: %s", install.Parsed.Key)
		}
		if execInfo.AutoAddToPack && execInfo.TargetPackID > 0 {
			ensureSkillInPack(txCtx, execInfo.TargetPackID, skillID)
		}
		return map[string]any{
			"id":   skillID,
			"key":  install.Parsed.Key,
			"name": install.Parsed.Name,
			"path": filepath.ToSlash(install.FinalDir),
		}, nil
	})
	if err != nil {
		return nil, err
	}

	s.log(execInfo, "安装成功: %s (%s)", install.Parsed.Name, install.Parsed.Key)
	return result, nil
}

func installedSkillManifest(parsed map[string]any, sourceURL string, existingManifest string) map[string]any {
	manifest := agentskill.CloneMap(parsed)
	manifest["source_url"] = sourceURL
	for _, key := range []string{"config", "scripts", "source_refs"} {
		if _, exists := manifest[key]; !exists {
			manifest[key] = []any{}
		}
	}

	existingManifest = strings.TrimSpace(existingManifest)
	if existingManifest == "" {
		return manifest
	}
	existing := map[string]any{}
	if err := json.Unmarshal([]byte(existingManifest), &existing); err != nil {
		return manifest
	}
	for _, key := range []string{
		"config",
		"scripts",
		"source_refs",
		"mcp",
		"dependencies",
		"targets",
		"domains",
	} {
		value, exists := existing[key]
		if !exists || isEmptyManifestValue(value) {
			continue
		}
		manifest[key] = value
	}
	return manifest
}

func isEmptyManifestValue(value any) bool {
	switch typed := value.(type) {
	case nil:
		return true
	case string:
		return strings.TrimSpace(typed) == ""
	case []any:
		return len(typed) == 0
	case map[string]any:
		return len(typed) == 0
	default:
		return false
	}
}

func ensureSkillInPack(ctx context.Context, packID uint64, skillID uint64) {
	if packID == 0 || skillID == 0 {
		return
	}
	model := agentmodel.NewSkillPackItemModel()
	existing := model.Find(ctx, map[string]any{
		"pack_id":  packID,
		"skill_id": skillID,
	})
	if existing != nil {
		if existing.Status != defaultStatus {
			model.Update(ctx, map[string]any{"id": existing.ID}, map[string]any{
				"status": defaultStatus,
			})
		}
		return
	}
	model.Insert(ctx, map[string]any{
		"pack_id":    packID,
		"skill_id":   skillID,
		"status":     defaultStatus,
		"sort":       nextSkillPackItemSort(ctx, packID),
		"created_at": time.Now(),
	})
}

func nextSkillPackItemSort(ctx context.Context, packID uint64) int {
	rows := agentmodel.NewSkillPackItemModel().Select(ctx, map[string]any{"pack_id": packID})
	maxSort := 0
	for _, row := range rows {
		if row != nil && row.Sort > maxSort {
			maxSort = row.Sort
		}
	}
	if maxSort <= 0 {
		return defaultSort
	}
	return maxSort + 10
}

type installedSkillReplacement struct {
	target    string
	backup    string
	committed bool
}

func replaceInstalledSkill(source string, target string) (*installedSkillReplacement, error) {
	if !agentskill.IsSafePath(target) {
		return nil, fmt.Errorf("技能安装目录不安全: %s", target)
	}
	if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
		return nil, err
	}

	replacement := &installedSkillReplacement{target: target}
	if _, err := os.Stat(target); err == nil {
		replacement.backup = target + ".bak-" + backupSuffix()
		if err := os.Rename(target, replacement.backup); err != nil {
			return nil, err
		}
	} else if !os.IsNotExist(err) {
		return nil, err
	}

	if err := moveInstalledSkill(source, target); err != nil {
		_ = os.RemoveAll(target)
		if replacement.backup != "" {
			if restoreErr := os.Rename(replacement.backup, target); restoreErr != nil {
				return nil, fmt.Errorf("%w；恢复旧技能目录失败: %v", err, restoreErr)
			}
		}
		return nil, err
	}
	return replacement, nil
}

func saveInstalledSkillWithRollback(ctx context.Context, replacement *installedSkillReplacement, fn func(context.Context) (map[string]any, error)) (result map[string]any, err error) {
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
			return
		}
		replacement.commit()
	}()
	err = orm.Transaction(ctx, func(txCtx context.Context) error {
		var txErr error
		result, txErr = fn(txCtx)
		return txErr
	})
	return result, err
}

func (replacement *installedSkillReplacement) commit() {
	if replacement == nil || replacement.committed {
		return
	}
	replacement.committed = true
	if replacement.backup != "" {
		_ = os.RemoveAll(replacement.backup)
	}
}

func (replacement *installedSkillReplacement) rollback() error {
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

func removeOldSkillPath(oldPath string, currentPath string) {
	oldPath = filepath.Clean(strings.TrimSpace(oldPath))
	currentPath = filepath.Clean(strings.TrimSpace(currentPath))
	root := filepath.Clean(agentskill.Root)
	if oldPath == "" || oldPath == "." || oldPath == currentPath || oldPath == root {
		return
	}
	if !agentskill.IsSafePath(oldPath) {
		return
	}
	_ = os.RemoveAll(oldPath)
}

func backupSuffix() string {
	return strings.ReplaceAll(time.Now().Format("20060102150405.000000000"), ".", "")
}

func moveInstalledSkill(source string, target string) error {
	if err := os.Rename(source, target); err == nil {
		return nil
	}
	if err := copyDirectory(source, target); err != nil {
		_ = os.RemoveAll(target)
		return err
	}
	return os.RemoveAll(source)
}

func copyDirectory(source string, target string) error {
	return filepath.WalkDir(source, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		relativePath, err := filepath.Rel(source, path)
		if err != nil {
			return err
		}
		targetPath := filepath.Join(target, relativePath)
		info, err := entry.Info()
		if err != nil {
			return err
		}
		if entry.IsDir() {
			return os.MkdirAll(targetPath, info.Mode())
		}
		return copyFile(path, targetPath, info.Mode())
	})
}

func copyFile(source string, target string, mode os.FileMode) error {
	if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
		return err
	}
	input, err := os.Open(source)
	if err != nil {
		return err
	}
	defer input.Close()
	output, err := os.OpenFile(target, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, mode)
	if err != nil {
		return err
	}
	defer output.Close()
	_, err = io.Copy(output, input)
	return err
}

func skillInstallResult(installID uint64, skills []map[string]any) map[string]any {
	return map[string]any{
		"event":      "final",
		"kind":       "skill_install",
		"text":       skillInstallResultText(skills),
		"install_id": installID,
		"skill_id":   firstSkillUint64(skills, "id"),
		"skill_key":  firstSkillValue(skills, "key"),
		"skill_keys": skillValues(skills, "key"),
		"skills":     skills,
	}
}

func skillInstallResultText(skills []map[string]any) string {
	if len(skills) == 1 {
		return fmt.Sprintf("技能安装成功：%s（%s）。", skillValue(skills[0], "name"), skillValue(skills[0], "key"))
	}
	return fmt.Sprintf("技能安装成功：%d 个技能。", len(skills))
}

func skillValues(skills []map[string]any, field string) []string {
	values := make([]string, 0, len(skills))
	for _, skill := range skills {
		if value := skillValue(skill, field); value != "" {
			values = append(values, value)
		}
	}
	return values
}

func firstSkillValue(skills []map[string]any, field string) string {
	values := skillValues(skills, field)
	if len(values) == 0 {
		return ""
	}
	return values[0]
}

func firstSkillUint64(skills []map[string]any, field string) uint64 {
	if len(skills) == 0 {
		return 0
	}
	return skillUint64(skills[0], field)
}

func skillValue(skill map[string]any, field string) string {
	value, _ := skill[field].(string)
	return value
}

func skillUint64(skill map[string]any, field string) uint64 {
	return util.ToUint64(skill[field])
}

func firstUint64(values []uint64) uint64 {
	if len(values) == 0 {
		return 0
	}
	return values[0]
}

func firstString(values []string) string {
	if len(values) == 0 {
		return ""
	}
	return values[0]
}
