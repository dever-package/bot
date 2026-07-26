package asset

import (
	"context"
	"strings"

	assetmodel "github.com/dever-package/bot/model/asset"
	projectmodel "github.com/dever-package/bot/model/project"
)

type CanvasMaterialSlot struct {
	NodeKey string
	Name    string
}

// CanvasReferences returns only current assets needed to hydrate one canvas.
// Explicit references may point across categories and projects in the same
// team; material slots stay scoped to the current canvas category.
func (s Service) CanvasReferences(ctx context.Context, projectID uint64, assetCateID uint64, assetIDs []uint64, nodeKeys []string) []map[string]any {
	if projectID == 0 {
		return []map[string]any{}
	}
	scope, ok := resolveCanvasAssetScope(ctx, projectID)
	if !ok {
		return []map[string]any{}
	}
	assetModel := assetmodel.NewAssetModel()
	rowsByID := map[uint64]*assetmodel.Asset{}
	if ids := uniqueCanvasAssetIDs(assetIDs); len(ids) > 0 {
		for _, row := range assetModel.Select(ctx, map[string]any{
			"id":         ids,
			"kind":       map[string]any{"neq": assetmodel.KindCollection},
			"status":     assetmodel.StatusCurrent,
			"version_id": map[string]any{"gt": 0},
		}) {
			if scope.contains(row) {
				rowsByID[row.ID] = row
			}
		}
	}
	if keys := uniqueCanvasNodeKeys(nodeKeys); len(keys) > 0 {
		for _, row := range assetModel.Select(ctx, map[string]any{
			"project_id":    projectID,
			"asset_cate_id": assetCateID,
			"node_key":      keys,
			"role":          assetmodel.RoleMaterial,
			"kind":          map[string]any{"neq": assetmodel.KindCollection},
			"status":        assetmodel.StatusCurrent,
			"version_id":    map[string]any{"gt": 0},
		}) {
			if scope.contains(row) {
				rowsByID[row.ID] = row
			}
		}
	}
	rows := make([]*assetmodel.Asset, 0, len(rowsByID))
	for _, row := range rowsByID {
		rows = append(rows, row)
	}
	versions := currentVersionsByID(ctx, rows, QueryContentFull)
	items := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		items = append(items, assetListMap(*row, versions[row.VersionID], QueryContentFull))
	}
	return items
}

func resolveCanvasAssetScope(ctx context.Context, projectID uint64) (teamAssetScope, bool) {
	project := projectmodel.NewProjectModel().Find(ctx, map[string]any{
		"id":     projectID,
		"status": projectmodel.StatusEnabled,
	})
	if project == nil || project.TeamID == 0 {
		return teamAssetScope{}, false
	}
	scope, err := resolveTeamAssetScope(ctx, project.TeamID)
	if err != nil {
		return teamAssetScope{}, false
	}
	if _, exists := scope.ProjectIDs[projectID]; !exists {
		return teamAssetScope{}, false
	}
	return scope, true
}

func uniqueCanvasAssetIDs(values []uint64) []uint64 {
	result := make([]uint64, 0, len(values))
	seen := map[uint64]struct{}{}
	for _, value := range values {
		if value == 0 {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
}

func uniqueCanvasNodeKeys(values []string) []string {
	result := make([]string, 0, len(values))
	seen := map[string]struct{}{}
	for _, value := range values {
		value = strings.TrimSpace(value)
		if value == "" {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
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
		"status":        map[string]any{"neq": assetmodel.StatusDeleted},
	})
	versionNodeKeys := canvasVersionNodeKeys(ctx, rows)
	for _, row := range rows {
		if row == nil {
			continue
		}
		nodeKey := strings.TrimSpace(row.NodeKey)
		if nodeKey == "" && row.VersionID > 0 {
			nodeKey = versionNodeKeys[row.VersionID]
		}
		if nodeKey == "" {
			continue
		}
		desiredStatus := assetmodel.StatusArchive
		if _, exists := activeSlots[nodeKey]; exists {
			if row.VersionID > 0 {
				desiredStatus = assetmodel.StatusCurrent
			} else {
				desiredStatus = assetmodel.StatusDraft
			}
		}
		changes := map[string]any{}
		if strings.TrimSpace(row.NodeKey) != nodeKey {
			changes["node_key"] = nodeKey
		}
		if row.Status != desiredStatus {
			changes["status"] = desiredStatus
		}
		if len(changes) > 0 {
			assetModel.Update(ctx, map[string]any{
				"id":     row.ID,
				"status": map[string]any{"neq": assetmodel.StatusDeleted},
			}, changes)
		}
		if slot, exists := activeSlots[nodeKey]; exists &&
			slot.Name != "" && row.NameMode != assetmodel.NameModeManual && row.Name != slot.Name {
			assetModel.Update(ctx, map[string]any{
				"id":        row.ID,
				"name_mode": map[string]any{"neq": assetmodel.NameModeManual},
				"status":    map[string]any{"neq": assetmodel.StatusDeleted},
			}, map[string]any{"name": slot.Name})
		}
	}
}

func canvasVersionNodeKeys(ctx context.Context, assets []*assetmodel.Asset) map[uint64]string {
	versionIDs := make([]uint64, 0, len(assets))
	for _, asset := range assets {
		if asset != nil && strings.TrimSpace(asset.NodeKey) == "" && asset.VersionID > 0 {
			versionIDs = append(versionIDs, asset.VersionID)
		}
	}
	result := make(map[uint64]string, len(versionIDs))
	if len(versionIDs) == 0 {
		return result
	}
	for _, version := range assetmodel.NewVersionModel().Select(
		ctx,
		map[string]any{"id": versionIDs},
		map[string]any{"field": "main.id,main.node_key"},
	) {
		if version != nil {
			result[version.ID] = strings.TrimSpace(version.NodeKey)
		}
	}
	return result
}
