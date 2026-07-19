package skill

import (
	"context"
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
)

func RequireActivePack(ctx context.Context, packID uint64) error {
	if packID == 0 || agentmodel.NewSkillPackModel().Find(ctx, map[string]any{"id": packID, "status": activeStatus}) == nil {
		return fmt.Errorf("技能方案 %d 不存在或未启用", packID)
	}
	return nil
}

func RequireActiveCate(ctx context.Context, cateID uint64) error {
	if cateID == 0 || agentmodel.NewSkillCateModel().Find(ctx, map[string]any{"id": cateID, "status": activeStatus}) == nil {
		return fmt.Errorf("技能分类 %d 不存在或未启用", cateID)
	}
	return nil
}

func RequireActiveSkill(ctx context.Context, skillID uint64) error {
	row := agentmodel.NewSkillModel().Find(ctx, map[string]any{"id": skillID, "status": activeStatus})
	if row == nil {
		return fmt.Errorf("技能 %d 不存在或未启用", skillID)
	}
	return RequireActiveCate(ctx, row.CateID)
}

func ValidateAssignment(ctx context.Context, packID uint64, cateID uint64) error {
	if cateID > 0 {
		if err := RequireActiveCate(ctx, cateID); err != nil {
			return err
		}
	}
	if packID > 0 {
		return RequireActivePack(ctx, packID)
	}
	return nil
}

func EntriesByPack(ctx context.Context, packID uint64) ([]Entry, error) {
	if err := RequireActivePack(ctx, packID); err != nil {
		return nil, err
	}
	items := agentmodel.NewSkillPackItemModel().Select(ctx, map[string]any{
		"pack_id": packID,
		"status":  1,
	})
	if len(items) == 0 {
		return nil, nil
	}

	skillIDs := make([]any, 0, len(items))
	for _, item := range items {
		if item != nil && item.SkillID > 0 {
			skillIDs = append(skillIDs, item.SkillID)
		}
	}
	if len(skillIDs) == 0 {
		return nil, nil
	}

	rows := agentmodel.NewSkillModel().Select(ctx, map[string]any{
		"id":     skillIDs,
		"status": 1,
	})
	cateIDs := make([]any, 0, len(rows))
	for _, row := range rows {
		if row != nil && row.CateID > 0 {
			cateIDs = append(cateIDs, row.CateID)
		}
	}
	activeCates := map[uint64]struct{}{}
	if len(cateIDs) > 0 {
		for _, row := range agentmodel.NewSkillCateModel().Select(ctx, map[string]any{"id": cateIDs, "status": activeStatus}) {
			if row != nil {
				activeCates[row.ID] = struct{}{}
			}
		}
	}
	byID := make(map[uint64]agentmodel.Skill, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		if _, active := activeCates[row.CateID]; active {
			byID[row.ID] = *row
		}
	}

	result := make([]Entry, 0, len(byID))
	for _, item := range items {
		if item == nil {
			continue
		}
		skill, exists := byID[item.SkillID]
		if !exists {
			continue
		}
		entry := ResolveEntryManifest(Entry{
			ID:          skill.ID,
			Key:         strings.TrimSpace(skill.Key),
			Name:        strings.TrimSpace(skill.Name),
			Description: strings.TrimSpace(skill.Description),
			SourceType:  agentmodel.NormalizeSkillSourceType(skill.SourceType, skill.SourceURL, skill.InstallInput),
			InstallPath: strings.TrimSpace(skill.InstallPath),
			EntryFile:   strings.TrimSpace(skill.EntryFile),
			Manifest:    strings.TrimSpace(skill.Manifest),
			ContentHash: strings.TrimSpace(skill.ContentHash),
		})
		result = append(result, entry)
	}
	return result, nil
}
