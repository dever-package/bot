package skill

import (
	"context"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
)

func EntriesByPack(ctx context.Context, packID uint64) []Entry {
	if packID == 0 {
		return nil
	}
	items := agentmodel.NewSkillPackItemModel().Select(ctx, map[string]any{
		"pack_id": packID,
		"status":  1,
	})
	if len(items) == 0 {
		return nil
	}

	skillIDs := make([]any, 0, len(items))
	for _, item := range items {
		if item != nil && item.SkillID > 0 {
			skillIDs = append(skillIDs, item.SkillID)
		}
	}
	if len(skillIDs) == 0 {
		return nil
	}

	rows := agentmodel.NewSkillModel().Select(ctx, map[string]any{
		"id":     skillIDs,
		"status": 1,
	})
	byID := make(map[uint64]agentmodel.Skill, len(rows))
	for _, row := range rows {
		if row != nil {
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
		result = append(result, Entry{
			ID:          skill.ID,
			Key:         strings.TrimSpace(skill.Key),
			Name:        strings.TrimSpace(skill.Name),
			Description: strings.TrimSpace(skill.Description),
			SourceType:  agentmodel.NormalizeSkillSourceType(skill.SourceType, skill.SourceURL, skill.InstallInput),
			Triggers:    ManifestTriggers(skill.Manifest),
			Domains:     ManifestDomains(skill.Manifest),
			Targets:     ManifestTargets(skill.Manifest),
			InstallPath: strings.TrimSpace(skill.InstallPath),
			EntryFile:   strings.TrimSpace(skill.EntryFile),
			Manifest:    strings.TrimSpace(skill.Manifest),
		})
	}
	return result
}
