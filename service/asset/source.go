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
	scope := teamAssetScope{
		TeamID:     teamID,
		ProjectIDs: map[uint64]struct{}{},
		Projects:   []projectmodel.Project{},
	}
	if workspace := workspacemodel.NewTeamWorkspaceModel().Find(ctx, map[string]any{
		"user_id": actor.UserID,
		"team_id": teamID,
		"status":  workspacemodel.TeamWorkspaceStatusEnabled,
	}); workspace != nil {
		scope.BodyID = workspace.BodyID
	}
	for _, project := range projectmodel.NewProjectModel().Select(ctx, map[string]any{
		"user_id": actor.UserID,
		"team_id": teamID,
		"status":  projectmodel.StatusEnabled,
	}, map[string]any{
		"field": "main.id,main.name",
	}) {
		if project != nil {
			scope.ProjectIDs[project.ID] = struct{}{}
			scope.Projects = append(scope.Projects, *project)
		}
	}
	return scope, nil
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
