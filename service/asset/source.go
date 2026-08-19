package asset

import (
	"context"

	assetmodel "github.com/dever-package/bot/model/asset"
	projectmodel "github.com/dever-package/bot/model/project"
	workspacemodel "github.com/dever-package/bot/model/workspace"
	userservice "github.com/dever-package/user/service"
)

type teamAssetScope struct {
	UserID     uint64
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
	return loadTeamAssetScope(ctx, actor.UserID, teamID), nil
}

func resolveTeamAssetOwnerScope(ctx context.Context, teamID uint64) (teamAssetScope, error) {
	actor, err := userservice.RequireActor(ctx)
	if err != nil {
		return teamAssetScope{}, err
	}
	return teamAssetScope{UserID: actor.UserID, TeamID: teamID}, nil
}

func loadTeamAssetScope(ctx context.Context, userID uint64, teamID uint64) teamAssetScope {
	scope := teamAssetScope{
		UserID:     userID,
		TeamID:     teamID,
		ProjectIDs: map[uint64]struct{}{},
		Projects:   []projectmodel.Project{},
	}
	if workspace := workspacemodel.NewTeamWorkspaceModel().Find(ctx, map[string]any{
		"user_id": userID,
		"team_id": teamID,
		"status":  workspacemodel.TeamWorkspaceStatusEnabled,
	}); workspace != nil {
		scope.BodyID = workspace.BodyID
	}
	projectFilter := map[string]any{
		"user_id": userID,
		"team_id": teamID,
		"status":  projectmodel.StatusEnabled,
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

func (scope teamAssetScope) withWorkspace(ctx context.Context) teamAssetScope {
	if workspace := workspacemodel.NewTeamWorkspaceModel().Find(ctx, map[string]any{
		"user_id": scope.UserID,
		"team_id": scope.TeamID,
		"status":  workspacemodel.TeamWorkspaceStatusEnabled,
	}); workspace != nil {
		scope.BodyID = workspace.BodyID
	}
	return scope
}

func (scope teamAssetScope) ownsEnabledProjects(ctx context.Context, projectIDs ...uint64) bool {
	uniqueIDs := make([]uint64, 0, len(projectIDs))
	seen := make(map[uint64]struct{}, len(projectIDs))
	for _, projectID := range projectIDs {
		if projectID == 0 {
			continue
		}
		if _, exists := seen[projectID]; exists {
			continue
		}
		seen[projectID] = struct{}{}
		uniqueIDs = append(uniqueIDs, projectID)
	}
	if len(uniqueIDs) == 0 {
		return true
	}
	return projectmodel.NewProjectModel().Count(ctx, map[string]any{
		"id":      uniqueIDs,
		"user_id": scope.UserID,
		"team_id": scope.TeamID,
		"status":  projectmodel.StatusEnabled,
	}) == int64(len(uniqueIDs))
}

func (scope teamAssetScope) contains(asset *assetmodel.Asset) bool {
	return asset != nil &&
		scope.UserID > 0 &&
		scope.TeamID > 0 &&
		asset.UserID == scope.UserID &&
		asset.TeamID == scope.TeamID
}

func (scope teamAssetScope) queryFilter() map[string]any {
	if scope.UserID == 0 || scope.TeamID == 0 {
		return nil
	}
	return map[string]any{"user_id": scope.UserID}
}

func (scope teamAssetScope) queryFilterForProjectContext(projectID uint64) map[string]any {
	filter := scope.queryFilter()
	if filter == nil {
		return nil
	}
	branches := make([]any, 0, 2)
	if projectID > 0 {
		branches = append(branches, map[string]any{"project_id": projectID})
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
	filter["or"] = branches
	return filter
}
