package asset

import (
	"context"
	"strings"

	assetmodel "github.com/dever-package/bot/model/asset"
)

type CanvasMaterialSlot struct {
	NodeKey string
	Name    string
}

// SyncCanvasMaterialSlots mirrors the persisted executable nodes without creating
// empty assets. Versions stay intact when a node is removed or later restored.
func (s Service) SyncCanvasMaterialSlots(ctx context.Context, projectID uint64, assetCateID uint64, slots []CanvasMaterialSlot) {
	if projectID == 0 {
		return
	}
	activeSlots := make(map[string]CanvasMaterialSlot, len(slots))
	for _, slot := range slots {
		slot.NodeKey = strings.TrimSpace(slot.NodeKey)
		slot.Name = strings.TrimSpace(slot.Name)
		if slot.NodeKey != "" {
			activeSlots[slot.NodeKey] = slot
		}
	}
	assetModel := assetmodel.NewAssetModel()
	rows := assetModel.Select(ctx, map[string]any{
		"project_id":    projectID,
		"asset_cate_id": assetCateID,
		"role":          assetmodel.RoleMaterial,
	})
	for _, row := range rows {
		if row == nil {
			continue
		}
		nodeKey := strings.TrimSpace(row.NodeKey)
		if nodeKey == "" && row.VersionID > 0 {
			if version := s.FindVersion(ctx, row.VersionID); version != nil {
				nodeKey = strings.TrimSpace(version.NodeKey)
			}
		}
		if nodeKey == "" {
			continue
		}
		changes := map[string]any{"node_key": nodeKey}
		if _, exists := activeSlots[nodeKey]; exists {
			if row.VersionID > 0 {
				changes["status"] = assetmodel.StatusCurrent
			} else {
				changes["status"] = assetmodel.StatusDraft
			}
		} else {
			changes["status"] = assetmodel.StatusArchive
		}
		assetModel.Update(ctx, map[string]any{"id": row.ID}, changes)
		if slot, exists := activeSlots[nodeKey]; exists && slot.Name != "" {
			assetModel.Update(ctx, map[string]any{
				"id":        row.ID,
				"name_mode": map[string]any{"neq": assetmodel.NameModeManual},
			}, map[string]any{"name": slot.Name})
		}
	}
}
