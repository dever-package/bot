package maintenance

import (
	"context"
	"fmt"
	"sort"

	assetmodel "github.com/dever-package/bot/model/asset"
	projectmodel "github.com/dever-package/bot/model/project"
	workspacemodel "github.com/dever-package/bot/model/workspace"
)

type assetWorkspaceOwnerKey struct {
	TeamID uint64
	BodyID uint64
}

type assetOwnerResolution struct {
	UserID    uint64
	TeamID    uint64
	Ambiguous bool
}

// MigrateAssetOwners backfills the direct asset owner from the authoritative
// project or personal team workspace relation. Unresolved legacy rows remain
// ownerless and are therefore excluded from every user-facing asset query.
func MigrateAssetOwners(ctx context.Context) (err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("迁移资产用户失败: %v", recovered)
		}
	}()

	ctx = normalizeContext(ctx)
	assetModel := assetmodel.NewAssetModel()
	assets := assetModel.Select(ctx, map[string]any{"user_id": uint64(0)}, map[string]any{
		"field": "main.id,main.project_id,main.body_id,main.team_id",
	})
	if len(assets) == 0 {
		return nil
	}

	projectOwners := assetProjectOwners(ctx, assets)
	workspaceOwners := assetWorkspaceOwners(ctx, assets)
	assetIDsByUser := make(map[uint64][]uint64)
	for _, asset := range assets {
		if asset == nil {
			continue
		}
		ownerID := uint64(0)
		if asset.ProjectID > 0 {
			owner := projectOwners[asset.ProjectID]
			if owner.TeamID == asset.TeamID {
				ownerID = owner.UserID
			}
		} else {
			owner := workspaceOwners[assetWorkspaceOwnerKey{
				TeamID: asset.TeamID,
				BodyID: asset.BodyID,
			}]
			if !owner.Ambiguous {
				ownerID = owner.UserID
			}
		}
		if ownerID > 0 {
			assetIDsByUser[ownerID] = append(assetIDsByUser[ownerID], asset.ID)
		}
	}

	userIDs := make([]uint64, 0, len(assetIDsByUser))
	for userID := range assetIDsByUser {
		userIDs = append(userIDs, userID)
	}
	sort.Slice(userIDs, func(i, j int) bool { return userIDs[i] < userIDs[j] })
	for _, userID := range userIDs {
		assetIDs := assetIDsByUser[userID]
		sort.Slice(assetIDs, func(i, j int) bool { return assetIDs[i] < assetIDs[j] })
		assetModel.Update(ctx, map[string]any{
			"id":      assetIDs,
			"user_id": uint64(0),
		}, map[string]any{"user_id": userID})
		if remaining := assetModel.Count(ctx, map[string]any{
			"id":      assetIDs,
			"user_id": uint64(0),
		}); remaining > 0 {
			return fmt.Errorf("仍有 %d 条资产未写入用户 %d", remaining, userID)
		}
	}
	return nil
}

func assetProjectOwners(ctx context.Context, assets []*assetmodel.Asset) map[uint64]assetOwnerResolution {
	projectIDs := make([]uint64, 0)
	seen := make(map[uint64]struct{})
	for _, asset := range assets {
		if asset == nil || asset.ProjectID == 0 {
			continue
		}
		if _, exists := seen[asset.ProjectID]; exists {
			continue
		}
		seen[asset.ProjectID] = struct{}{}
		projectIDs = append(projectIDs, asset.ProjectID)
	}
	owners := make(map[uint64]assetOwnerResolution, len(projectIDs))
	if len(projectIDs) == 0 {
		return owners
	}
	for _, project := range projectmodel.NewProjectModel().Select(ctx, map[string]any{
		"id": projectIDs,
	}, map[string]any{
		"field": "main.id,main.user_id,main.team_id",
	}) {
		if project != nil && project.UserID > 0 {
			owners[project.ID] = assetOwnerResolution{
				UserID: project.UserID,
				TeamID: project.TeamID,
			}
		}
	}
	return owners
}

func assetWorkspaceOwners(ctx context.Context, assets []*assetmodel.Asset) map[assetWorkspaceOwnerKey]assetOwnerResolution {
	bodyIDs := make([]uint64, 0)
	teamIDs := make([]uint64, 0)
	seenBodies := make(map[uint64]struct{})
	seenTeams := make(map[uint64]struct{})
	for _, asset := range assets {
		if asset == nil || asset.ProjectID > 0 || asset.BodyID == 0 || asset.TeamID == 0 {
			continue
		}
		if _, exists := seenBodies[asset.BodyID]; !exists {
			seenBodies[asset.BodyID] = struct{}{}
			bodyIDs = append(bodyIDs, asset.BodyID)
		}
		if _, exists := seenTeams[asset.TeamID]; !exists {
			seenTeams[asset.TeamID] = struct{}{}
			teamIDs = append(teamIDs, asset.TeamID)
		}
	}
	owners := make(map[assetWorkspaceOwnerKey]assetOwnerResolution)
	if len(bodyIDs) == 0 || len(teamIDs) == 0 {
		return owners
	}
	for _, workspace := range workspacemodel.NewTeamWorkspaceModel().Select(ctx, map[string]any{
		"body_id": bodyIDs,
		"team_id": teamIDs,
	}, map[string]any{
		"field": "main.user_id,main.team_id,main.body_id",
	}) {
		if workspace == nil || workspace.UserID == 0 {
			continue
		}
		key := assetWorkspaceOwnerKey{TeamID: workspace.TeamID, BodyID: workspace.BodyID}
		existing := owners[key]
		if existing.Ambiguous {
			continue
		}
		if existing.UserID > 0 && existing.UserID != workspace.UserID {
			owners[key] = assetOwnerResolution{Ambiguous: true}
			continue
		}
		owners[key] = assetOwnerResolution{
			UserID: workspace.UserID,
			TeamID: workspace.TeamID,
		}
	}
	return owners
}
