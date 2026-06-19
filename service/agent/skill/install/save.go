package install

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"

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
	manifest := agentskill.CloneMap(install.Parsed.Manifest)
	manifest["source_url"] = install.Source.SourceURL

	if existing := model.Find(ctx, map[string]any{"key": install.Parsed.Key}); existing != nil {
		oldPath := strings.TrimSpace(existing.InstallPath)
		if err := replaceInstalledSkill(install.Source.Directory, install.FinalDir); err != nil {
			return nil, err
		}
		removeOldSkillPath(oldPath, install.FinalDir)

		model.Update(ctx, map[string]any{"id": existing.ID}, map[string]any{
			"cate_id":       execInfo.CateID,
			"name":          install.Parsed.Name,
			"description":   install.Parsed.Description,
			"source_url":    install.Source.SourceURL,
			"install_input": execInfo.Input,
			"install_path":  filepath.ToSlash(install.FinalDir),
			"entry_file":    install.EntryFile,
			"manifest":      agentskill.JSONText(manifest),
			"content_hash":  install.Parsed.Hash,
			"status":        defaultStatus,
		})
		if execInfo.AutoAddToPack && execInfo.TargetPackID > 0 {
			ensureSkillInPack(ctx, execInfo.TargetPackID, existing.ID)
		}
		s.log(execInfo, "技能已存在，已刷新安装内容: %s (%s)", install.Parsed.Name, install.Parsed.Key)
		return map[string]any{
			"id":   existing.ID,
			"key":  install.Parsed.Key,
			"name": install.Parsed.Name,
			"path": filepath.ToSlash(install.FinalDir),
		}, nil
	}

	if err := replaceInstalledSkill(install.Source.Directory, install.FinalDir); err != nil {
		return nil, err
	}

	skillID := uint64(model.Insert(ctx, map[string]any{
		"cate_id":       execInfo.CateID,
		"key":           install.Parsed.Key,
		"name":          install.Parsed.Name,
		"description":   install.Parsed.Description,
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
		ensureSkillInPack(ctx, execInfo.TargetPackID, skillID)
	}

	s.log(execInfo, "安装成功: %s (%s)", install.Parsed.Name, install.Parsed.Key)
	return map[string]any{
		"id":   skillID,
		"key":  install.Parsed.Key,
		"name": install.Parsed.Name,
		"path": filepath.ToSlash(install.FinalDir),
	}, nil
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

func replaceInstalledSkill(source string, target string) error {
	if !agentskill.IsSafePath(target) {
		return fmt.Errorf("技能安装目录不安全: %s", target)
	}
	if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
		return err
	}

	backup := ""
	if _, err := os.Stat(target); err == nil {
		backup = target + ".bak-" + backupSuffix()
		if err := os.Rename(target, backup); err != nil {
			return err
		}
	}

	if err := moveInstalledSkill(source, target); err != nil {
		_ = os.RemoveAll(target)
		if backup != "" {
			_ = os.Rename(backup, target)
		}
		return err
	}
	if backup != "" {
		_ = os.RemoveAll(backup)
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
