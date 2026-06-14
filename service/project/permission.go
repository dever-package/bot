package project

import (
	"context"
	"fmt"

	projectmodel "my/package/bot/model/project"
	userservice "my/package/user/service"
)

func currentActor(ctx context.Context) (userservice.Actor, error) {
	return userservice.RequireActor(ctx)
}

func currentUserID(ctx context.Context) (uint64, error) {
	actor, err := currentActor(ctx)
	if err != nil {
		return 0, err
	}
	return actor.UserID, nil
}

func requireProject(ctx context.Context, projectID uint64) (*projectmodel.Project, error) {
	userID, err := currentUserID(ctx)
	if err != nil {
		return nil, err
	}
	if projectID == 0 {
		return nil, fmt.Errorf("项目不能为空")
	}
	project := projectmodel.NewProjectModel().Find(ctx, map[string]any{
		"id":      projectID,
		"user_id": userID,
		"status":  projectmodel.StatusEnabled,
	})
	if project == nil {
		return nil, fmt.Errorf("项目不存在")
	}
	return project, nil
}
