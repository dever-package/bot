package asset

import (
	"context"
	"sort"

	assetmodel "github.com/dever-package/bot/model/asset"
	projectmodel "github.com/dever-package/bot/model/project"
	workspacemodel "github.com/dever-package/bot/model/workspace"
	userservice "github.com/dever-package/user/service"
)

type teamAssetScope struct {
	TeamID     uint64
	BodyID     uint64
	ProjectIDs map[uint64]struct{}
	Projects   []projectmodel.Project
}

func resolveTeamAssetScope(ctx context.Context, teamID uint64) (teamAssetScope, error) {
	actor, err := userservice.RequireActor(ctx)
	if err != nil {
		return teamAssetScope{}, err
	}
	return loadTeamAssetScope(ctx, actor.UserID, teamID, nil, true), nil
}

func resolveTeamAssetScopeForAssets(
	ctx context.Context,
	teamID uint64,
	assets []*assetmodel.Asset,
	requiredProjectIDs ...uint64,
) (teamAssetScope, error) {
	actor, err := userservice.RequireActor(ctx)
	if err != nil {
		return teamAssetScope{}, err
	}
	projectIDs := make(map[uint64]struct{}, len(assets)+len(requiredProjectIDs))
	includeWorkspace := false
	for _, asset := range assets {
		if asset == nil {
			continue
		}
		if asset.ProjectID > 0 {
			projectIDs[asset.ProjectID] = struct{}{}
		} else {
			includeWorkspace = true
		}
	}
	for _, projectID := range requiredProjectIDs {
		if projectID > 0 {
			projectIDs[projectID] = struct{}{}
		}
	}
	return loadTeamAssetScope(ctx, actor.UserID, teamID, projectIDs, includeWorkspace), nil
}

// loadTeamAssetScope treats nil projectIDs as the complete project scope. A
// non-nil map, including an empty one, keeps the query restricted to known IDs.
func loadTeamAssetScope(
	ctx context.Context,
	userID uint64,
	teamID uint64,
	projectIDs map[uint64]struct{},
	includeWorkspace bool,
) teamAssetScope {
	scope := teamAssetScope{
		TeamID:     teamID,
		ProjectIDs: map[uint64]struct{}{},
		Projects:   []projectmodel.Project{},
	}
	if includeWorkspace {
		if workspace := workspacemodel.NewTeamWorkspaceModel().Find(ctx, map[string]any{
			"user_id": userID,
			"team_id": teamID,
			"status":  workspacemodel.TeamWorkspaceStatusEnabled,
		}); workspace != nil {
			scope.BodyID = workspace.BodyID
		}
	}
	projectFilter := map[string]any{
		"user_id": userID,
		"team_id": teamID,
		"status":  projectmodel.StatusEnabled,
	}
	if projectIDs != nil {
		ids := sortedProjectIDs(projectIDs)
		if len(ids) == 0 {
			return scope
		}
		projectFilter["id"] = ids
	}
	for _, project := range projectmodel.NewProjectModel().Select(ctx, projectFilter, map[string]any{
		"field": "main.id,main.name",
	}) {
		if project != nil {
			scope.ProjectIDs[project.ID] = struct{}{}
			scope.Projects = append(scope.Projects, *project)
		}
	}
	return scope
}

func sortedProjectIDs(projectIDs map[uint64]struct{}) []uint64 {
	ids := make([]uint64, 0, len(projectIDs))
	for projectID := range projectIDs {
		ids = append(ids, projectID)
	}
	sort.Slice(ids, func(i, j int) bool { return ids[i] < ids[j] })
	return ids
}

func (scope teamAssetScope) contains(asset *assetmodel.Asset) bool {
	if asset == nil || scope.TeamID == 0 || asset.TeamID != scope.TeamID {
		return false
	}
	if asset.ProjectID > 0 {
		_, exists := scope.ProjectIDs[asset.ProjectID]
		return exists
	}
	return scope.BodyID > 0 && asset.BodyID == scope.BodyID
}

func (scope teamAssetScope) queryFilter() map[string]any {
	projectIDs := make([]uint64, 0, len(scope.ProjectIDs))
	for projectID := range scope.ProjectIDs {
		projectIDs = append(projectIDs, projectID)
	}
	sort.Slice(projectIDs, func(i, j int) bool { return projectIDs[i] < projectIDs[j] })
	return scope.queryFilterForProjectIDs(projectIDs)
}

func (scope teamAssetScope) queryFilterForProjectContext(projectID uint64) map[string]any {
	return scope.queryFilterForProjectIDs([]uint64{projectID})
}

func (scope teamAssetScope) queryFilterForProjectIDs(projectIDs []uint64) map[string]any {
	branches := make([]any, 0, 2)
	if len(projectIDs) > 0 {
		branches = append(branches, map[string]any{"project_id": projectIDs})
	}
	if scope.BodyID > 0 {
		branches = append(branches, map[string]any{
			"project_id": uint64(0),
			"body_id":    scope.BodyID,
		})
	}
	if len(branches) == 0 {
		return nil
	}
	return map[string]any{"or": branches}
}
