package install

import (
	"context"
	"encoding/json"
	"fmt"
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
		if err := agentskill.ValidateTree(source.Directory); err != nil {
			return nil, fmt.Errorf("技能目录检查失败: %w", err)
		}
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

func validateInstallConflicts(ctx context.Context, installs []parsedSkillSource) error {
	model := agentmodel.NewSkillModel()
	for _, install := range installs {
		existing := model.Find(ctx, map[string]any{"key": install.Parsed.Key})
		if existing == nil {
			continue
		}
		sourceType := agentmodel.NormalizeSkillSourceType(existing.SourceType, existing.SourceURL, existing.InstallInput)
		if sourceType != agentmodel.SkillSourceTypeInstalled {
			return fmt.Errorf("已存在同标识的%s技能，安装来源不能覆盖: %s", agentmodel.SkillSourceTypeLabel(sourceType), install.Parsed.Key)
		}
	}
	return nil
}

type savedInstalledSkill struct {
	Result   map[string]any
	OldPath  string
	Existing bool
}

func (s Service) saveInstalledSkills(ctx context.Context, execInfo *skillInstallExecution, installs []parsedSkillSource) ([]map[string]any, error) {
	activations := make([]agentskill.DirectoryActivation, 0, len(installs))
	for _, install := range installs {
		activations = append(activations, agentskill.DirectoryActivation{
			Key: install.Parsed.Key, Source: install.Source.Directory, Target: install.FinalDir,
		})
	}
	saved := make([]savedInstalledSkill, 0, len(installs))
	err := agentskill.ActivateDirectories(ctx, activations, func(txCtx context.Context) error {
		for _, install := range installs {
			item, saveErr := s.saveInstalledSkillRecord(txCtx, execInfo, install)
			if saveErr != nil {
				return saveErr
			}
			saved = append(saved, item)
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	results := make([]map[string]any, 0, len(saved))
	for index, item := range saved {
		agentskill.RemoveObsoletePath(item.OldPath, installs[index].FinalDir)
		if item.Existing {
			s.log(execInfo, "技能已存在，已刷新安装内容: %s (%s)", installs[index].Parsed.Name, installs[index].Parsed.Key)
		} else {
			s.log(execInfo, "安装成功: %s (%s)", installs[index].Parsed.Name, installs[index].Parsed.Key)
		}
		results = append(results, item.Result)
	}
	return results, nil
}

func (s Service) saveInstalledSkillRecord(ctx context.Context, execInfo *skillInstallExecution, install parsedSkillSource) (savedInstalledSkill, error) {
	model := agentmodel.NewSkillModel()

	if existing := model.Find(ctx, map[string]any{"key": install.Parsed.Key}); existing != nil {
		sourceType := agentmodel.NormalizeSkillSourceType(existing.SourceType, existing.SourceURL, existing.InstallInput)
		if sourceType != agentmodel.SkillSourceTypeInstalled {
			return savedInstalledSkill{}, fmt.Errorf("已存在同标识的%s技能，安装来源不能覆盖: %s", agentmodel.SkillSourceTypeLabel(sourceType), install.Parsed.Key)
		}
		manifest := installedSkillManifest(install.Parsed.Manifest, install.Source.SourceURL, existing.Manifest)
		oldPath := strings.TrimSpace(existing.InstallPath)
		if affected := model.Update(ctx, map[string]any{"id": existing.ID}, map[string]any{
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
		}); affected == 0 {
			return savedInstalledSkill{}, fmt.Errorf("更新技能记录失败: %s", install.Parsed.Key)
		}
		agentskill.SyncManifestConfig(ctx, existing.ID, manifest)
		if execInfo.AutoAddToPack && execInfo.TargetPackID > 0 {
			agentskill.EnsurePackItem(ctx, execInfo.TargetPackID, existing.ID)
		}
		return savedInstalledSkill{Result: map[string]any{
			"id": existing.ID, "key": install.Parsed.Key, "name": install.Parsed.Name,
			"path": filepath.ToSlash(install.FinalDir),
		}, OldPath: oldPath, Existing: true}, nil
	}

	manifest := installedSkillManifest(install.Parsed.Manifest, install.Source.SourceURL, "")
	skillID := uint64(model.Insert(ctx, map[string]any{
		"cate_id":       execInfo.CateID,
		"key":           install.Parsed.Key,
		"name":          install.Parsed.Name,
		"description":   install.Parsed.Description,
		"display_name":  install.Parsed.Name,
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
		return savedInstalledSkill{}, fmt.Errorf("写入技能记录失败: %s", install.Parsed.Key)
	}
	agentskill.SyncManifestConfig(ctx, skillID, manifest)
	if execInfo.AutoAddToPack && execInfo.TargetPackID > 0 {
		agentskill.EnsurePackItem(ctx, execInfo.TargetPackID, skillID)
	}
	return savedInstalledSkill{Result: map[string]any{
		"id": skillID, "key": install.Parsed.Key, "name": install.Parsed.Name,
		"path": filepath.ToSlash(install.FinalDir),
	}}, nil
}

func installedSkillManifest(parsed map[string]any, sourceURL string, existingManifest string) map[string]any {
	manifest := agentskill.CloneMap(parsed)
	declared := make(map[string]struct{}, len(manifest))
	for key := range manifest {
		declared[key] = struct{}{}
	}
	manifest["source_url"] = sourceURL
	for _, key := range []string{"config", "scripts", "source_refs"} {
		if _, exists := manifest[key]; !exists {
			manifest[key] = []any{}
		}
	}

	existingManifest = strings.TrimSpace(existingManifest)
	if existingManifest == "" {
		agentskill.NormalizeManifestCapabilities(manifest)
		return manifest
	}
	existing := map[string]any{}
	if err := json.Unmarshal([]byte(existingManifest), &existing); err != nil {
		agentskill.NormalizeManifestCapabilities(manifest)
		return manifest
	}
	for _, key := range []string{
		"capabilities",
		"config",
		"scripts",
		"source_refs",
		"mcp",
		"dependencies",
		"targets",
		"domains",
	} {
		if _, exists := declared[key]; exists {
			continue
		}
		value, exists := existing[key]
		if !exists {
			continue
		}
		if key != "capabilities" && isEmptyManifestValue(value) {
			continue
		}
		manifest[key] = value
	}
	agentskill.NormalizeManifestCapabilities(manifest)
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
