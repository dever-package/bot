package asset

import (
	"context"
	"fmt"
	"time"

	assetmodel "github.com/dever-package/bot/model/asset"
	"github.com/shemic/dever/orm"
)

func ensureAssetMutable(asset *assetmodel.Asset) error {
	if asset != nil && asset.Status == assetmodel.StatusDeleted {
		return fmt.Errorf("回收站资产请先恢复")
	}
	return nil
}

func (s Service) MoveTeamAssetToTrash(ctx context.Context, teamID uint64, assetID uint64) (map[string]any, error) {
	asset, err := s.requireTeamAsset(ctx, teamID, assetID)
	if err != nil {
		return nil, err
	}
	if asset.Status != assetmodel.StatusCurrent {
		return nil, fmt.Errorf("资产不存在或已不可用")
	}

	deletedAt := time.Now()
	if err := orm.Transaction(ctx, func(tx context.Context) error {
		assetModel := assetmodel.NewAssetModel()
		if asset.Kind == assetmodel.KindCollection {
			assetModel.Update(tx, map[string]any{
				"collection_id": asset.ID,
				"team_id":       teamID,
				"status":        assetmodel.StatusCurrent,
			}, map[string]any{
				"status":     assetmodel.StatusDeleted,
				"deleted_at": deletedAt,
			})
		}
		if assetModel.Update(tx, map[string]any{
			"id":      asset.ID,
			"team_id": teamID,
			"status":  assetmodel.StatusCurrent,
		}, map[string]any{
			"status":     assetmodel.StatusDeleted,
			"deleted_at": deletedAt,
		}) == 0 {
			return fmt.Errorf("资产不存在或已不可用")
		}
		return nil
	}); err != nil {
		return nil, err
	}
	return map[string]any{"id": asset.ID, "deleted_at": deletedAt}, nil
}

func (s Service) RestoreTeamAsset(ctx context.Context, teamID uint64, assetID uint64) (map[string]any, error) {
	asset, err := s.requireTeamAsset(ctx, teamID, assetID)
	if err != nil {
		return nil, err
	}
	if asset.Status != assetmodel.StatusDeleted {
		return nil, fmt.Errorf("资产不在回收站")
	}
	if hasAssetIdentityConflict(ctx, asset) {
		return nil, fmt.Errorf("相同来源已有新资产，无法恢复当前资产")
	}

	if err := orm.Transaction(ctx, func(tx context.Context) error {
		assetModel := assetmodel.NewAssetModel()
		if assetModel.Update(tx, map[string]any{
			"id":      asset.ID,
			"team_id": teamID,
			"status":  assetmodel.StatusDeleted,
		}, map[string]any{
			"status":     assetmodel.StatusCurrent,
			"deleted_at": nil,
		}) == 0 {
			return fmt.Errorf("资产不在回收站")
		}
		if asset.Kind == assetmodel.KindCollection && asset.DeletedAt != nil {
			assetModel.Update(tx, map[string]any{
				"collection_id": asset.ID,
				"team_id":       teamID,
				"status":        assetmodel.StatusDeleted,
				"deleted_at":    *asset.DeletedAt,
			}, map[string]any{
				"status":     assetmodel.StatusCurrent,
				"deleted_at": nil,
			})
		}
		return nil
	}); err != nil {
		return nil, err
	}
	updated := s.Find(ctx, asset.ID)
	if updated == nil {
		return nil, fmt.Errorf("读取资产失败")
	}
	return map[string]any{"asset": s.AssetDetailMap(ctx, *updated, nil)}, nil
}

func hasAssetIdentityConflict(ctx context.Context, asset *assetmodel.Asset) bool {
	filter := assetIdentityFilter(SaveVersionRequest{
		ProjectID:    asset.ProjectID,
		BodyID:       asset.BodyID,
		TeamID:       asset.TeamID,
		FlowID:       asset.FlowID,
		AssetCateID:  asset.AssetCateID,
		CollectionID: asset.CollectionID,
		NodeKey:      asset.NodeKey,
		SourceType:   asset.SourceType,
		SourceID:     asset.SourceID,
		Name:         asset.Name,
		Kind:         asset.Kind,
		Role:         NormalizeRole(asset.Role),
	})
	filter["id"] = map[string]any{"neq": asset.ID}
	return assetmodel.NewAssetModel().Find(ctx, filter) != nil
}
