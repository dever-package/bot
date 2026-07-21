package install

import (
	"context"
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
		if err := agentskill.ValidateTreeLimits(source.Directory, installSkillSourceLimits); err != nil {
			return nil, fmt.Errorf("技能目录超过资源限制: %w", err)
		}
		parsed, err := agentskill.ParseFile(source.FilePath)
		if err != nil {
			return nil, err
		}
		if source.SourceURL == "" {
			source.SourceURL = publicSourceURL(agentskill.FirstText(parsed.Manifest["source_url"]))
		}
		if parsed.Key == "" {
			return nil, fmt.Errorf("技能标识不能为空，请检查 SKILL.md frontmatter")
		}
		// Third-party skills commonly predate manifest capability declarations.
		// Persist the inferred declarations before applying the strict validator.
		agentskill.NormalizeManifestCapabilities(parsed.Manifest)
		if err := agentskill.ValidateManifest(parsed.Manifest); err != nil {
			return nil, fmt.Errorf("技能 %s 的 %w", parsed.Key, err)
		}
		if parsed.Name == "" {
			parsed.Name = parsed.Key
		}
		if err := agentskill.ValidateMetadata(parsed.Key, parsed.Name, parsed.Description); err != nil {
			return nil, fmt.Errorf("技能 %s 的元信息无效: %w", parsed.Key, err)
		}
		if err := agentskill.ValidateStoredText("技能来源地址", source.SourceURL, agentskill.MaxSourceURLRunes); err != nil {
			return nil, err
		}
		if _, exists := seen[parsed.Key]; exists {
			return nil, fmt.Errorf("发现重复技能标识: %s", parsed.Key)
		}
		seen[parsed.Key] = struct{}{}

		entryFile := filepath.Base(source.FilePath)
		if entryFile == "" || entryFile == "." {
			entryFile = agentskill.EntryFile
		}
		if err := agentskill.ValidateStoredText("技能入口文件", entryFile, agentskill.MaxEntryFileRunes); err != nil {
			return nil, err
		}
		installs = append(installs, parsedSkillSource{
			Source:    source,
			Parsed:    parsed,
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

func selectTargetSkill(ctx context.Context, targetSkillID uint64, installs []parsedSkillSource) ([]parsedSkillSource, error) {
	if targetSkillID == 0 {
		return installs, nil
	}
	target := agentmodel.NewSkillModel().Find(ctx, map[string]any{"id": targetSkillID})
	if target == nil {
		return nil, fmt.Errorf("更新目标技能不存在或已被删除")
	}
	if agentmodel.NormalizeSkillSourceType(target.SourceType, target.SourceURL, target.InstallInput) != agentmodel.SkillSourceTypeInstalled {
		return nil, fmt.Errorf("只有安装来源技能可以通过安装流程更新")
	}
	for _, install := range installs {
		if agentskill.NormalizeKey(install.Parsed.Key) == agentskill.NormalizeKey(target.Key) {
			return []parsedSkillSource{install}, nil
		}
	}
	return nil, fmt.Errorf("安装来源中未找到更新目标技能: %s", target.Key)
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
		packID := uint64(0)
		if execInfo.AutoAddToPack {
			packID = execInfo.TargetPackID
		}
		if err := agentskill.ValidateAssignment(txCtx, packID, execInfo.CateID); err != nil {
			return err
		}
		for _, install := range installs {
			item, saveErr := s.saveInstalledSkillRecord(txCtx, execInfo, install)
			if saveErr != nil {
				return saveErr
			}
			saved = append(saved, item)
		}
		results := savedInstallResults(saved)
		result := skillInstallResult(execInfo.ID, results)
		finishedAt := time.Now()
		affected := agentmodel.NewSkillInstallModel().Update(txCtx, map[string]any{
			"id": execInfo.ID, "status": agentmodel.SkillInstallStatusFinalizing,
		}, map[string]any{
			"status":      agentmodel.SkillInstallStatusSuccess,
			"skill_id":    firstSkillUint64(results, "id"),
			"target_path": firstSkillValue(results, "path"),
			"result":      agentskill.JSONText(result),
			"log":         execInfo.logText(),
			"finished_at": finishedAt,
			"error":       "",
		})
		if affected == 0 {
			return fmt.Errorf("技能安装状态已变化，不能提交安装结果")
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	results := savedInstallResults(saved)
	for index, item := range saved {
		agentskill.RemoveObsoletePath(installs[index].Parsed.Key, item.OldPath, installs[index].FinalDir)
		agentskill.PruneSkillReleases(installs[index].Parsed.Key, installs[index].FinalDir)
		if item.Existing {
			s.log(execInfo, "技能已存在，已刷新安装内容: %s (%s)", installs[index].Parsed.Name, installs[index].Parsed.Key)
		} else {
			s.log(execInfo, "安装成功: %s (%s)", installs[index].Parsed.Name, installs[index].Parsed.Key)
		}
	}
	persistCtx, cancel := installFinalizeContext()
	s.persistLog(persistCtx, execInfo, true)
	cancel()
	return results, nil
}

func savedInstallResults(saved []savedInstalledSkill) []map[string]any {
	results := make([]map[string]any, 0, len(saved))
	for _, item := range saved {
		results = append(results, item.Result)
	}
	return results
}

func (s Service) saveInstalledSkillRecord(ctx context.Context, execInfo *skillInstallExecution, install parsedSkillSource) (savedInstalledSkill, error) {
	model := agentmodel.NewSkillModel()

	if existing := model.Find(ctx, map[string]any{"key": install.Parsed.Key}); existing != nil {
		if execInfo.TargetSkillID > 0 && existing.ID != execInfo.TargetSkillID {
			return savedInstalledSkill{}, fmt.Errorf("更新目标技能已变化，请重新发起更新")
		}
		sourceType := agentmodel.NormalizeSkillSourceType(existing.SourceType, existing.SourceURL, existing.InstallInput)
		if sourceType != agentmodel.SkillSourceTypeInstalled {
			return savedInstalledSkill{}, fmt.Errorf("已存在同标识的%s技能，安装来源不能覆盖: %s", agentmodel.SkillSourceTypeLabel(sourceType), install.Parsed.Key)
		}
		manifest := installedSkillManifest(install.Parsed.Manifest, install.Source.SourceURL)
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
		if err := agentskill.SyncManifestConfig(ctx, existing.ID, manifest); err != nil {
			return savedInstalledSkill{}, err
		}
		if execInfo.AutoAddToPack && execInfo.TargetPackID > 0 {
			if err := agentskill.EnsurePackItem(ctx, execInfo.TargetPackID, existing.ID); err != nil {
				return savedInstalledSkill{}, err
			}
		}
		return savedInstalledSkill{Result: map[string]any{
			"id": existing.ID, "key": install.Parsed.Key, "name": install.Parsed.Name,
			"path": filepath.ToSlash(install.FinalDir),
		}, OldPath: oldPath, Existing: true}, nil
	}
	if execInfo.TargetSkillID > 0 {
		return savedInstalledSkill{}, fmt.Errorf("更新目标技能不存在，不能创建同名新技能")
	}

	manifest := installedSkillManifest(install.Parsed.Manifest, install.Source.SourceURL)
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
	if err := agentskill.SyncManifestConfig(ctx, skillID, manifest); err != nil {
		return savedInstalledSkill{}, err
	}
	if execInfo.AutoAddToPack && execInfo.TargetPackID > 0 {
		if err := agentskill.EnsurePackItem(ctx, execInfo.TargetPackID, skillID); err != nil {
			return savedInstalledSkill{}, err
		}
	}
	return savedInstalledSkill{Result: map[string]any{
		"id": skillID, "key": install.Parsed.Key, "name": install.Parsed.Name,
		"path": filepath.ToSlash(install.FinalDir),
	}}, nil
}

func installedSkillManifest(parsed map[string]any, sourceURL string) map[string]any {
	manifest := agentskill.CloneMap(parsed)
	manifest["source_url"] = strings.TrimSpace(sourceURL)
	for _, key := range []string{"config", "scripts", "source_refs"} {
		if _, exists := manifest[key]; !exists {
			manifest[key] = []any{}
		}
	}
	agentskill.NormalizeManifestCapabilities(manifest)
	return manifest
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
