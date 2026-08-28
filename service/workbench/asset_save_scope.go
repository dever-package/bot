package workbench

import (
	"context"
	"fmt"

	projectmodel "github.com/dever-package/bot/model/project"
	userservice "github.com/dever-package/user/service"
)

type externalAssetSaveScope struct {
	UserID    uint64
	TeamID    uint64
	ProjectID uint64
	BodyID    uint64
	ReleaseID uint64
}

func (s Service) resolveExternalAssetSaveScope(
	ctx context.Context,
	teamID uint64,
	projectID uint64,
) (externalAssetSaveScope, error) {
	if projectID > 0 {
		actor, err := userservice.RequireActor(ctx)
		if err != nil {
			return externalAssetSaveScope{}, err
		}
		project := projectmodel.NewProjectModel().Find(ctx, map[string]any{
			"id":      projectID,
			"user_id": actor.UserID,
			"status":  projectmodel.StatusEnabled,
		})
		if project == nil {
			return externalAssetSaveScope{}, fmt.Errorf("项目不存在")
		}
		if teamID > 0 && project.TeamID != teamID {
			return externalAssetSaveScope{}, fmt.Errorf("项目不属于当前团队")
		}
		if project.BodyID == 0 {
			return externalAssetSaveScope{}, fmt.Errorf("项目载体不存在")
		}
		return externalAssetSaveScope{
			UserID:    actor.UserID,
			TeamID:    project.TeamID,
			ProjectID: project.ID,
			BodyID:    project.BodyID,
			ReleaseID: project.ReleaseID,
		}, nil
	}

	workspace, err := s.requireWorkspace(ctx, teamID)
	if err != nil {
		return externalAssetSaveScope{}, err
	}
	if workspace.BodyID == 0 {
		return externalAssetSaveScope{}, fmt.Errorf("团队工作区载体不存在")
	}
	return externalAssetSaveScope{
		UserID: workspace.UserID,
		TeamID: workspace.TeamID,
		BodyID: workspace.BodyID,
	}, nil
}
