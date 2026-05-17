package install

import (
	"context"
	"time"

	agentmodel "my/package/bot/model/agent"
)

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
	rows := agentmodel.NewSkillPackItemModel().Select(ctx, map[string]any{
		"pack_id": packID,
	})
	maxSort := 0
	for _, row := range rows {
		if row == nil || row.Sort <= maxSort {
			continue
		}
		maxSort = row.Sort
	}
	if maxSort <= 0 {
		return defaultSort
	}
	return maxSort + 10
}
