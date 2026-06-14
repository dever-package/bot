package api

import (
	"github.com/shemic/dever/server"

	projectservice "my/package/bot/service/project"
)

type Workspace struct{}

var workspaceRunner = projectservice.NewWorkspaceService()

func (Workspace) GetBootstrap(c *server.Context) error {
	data, err := workspaceRunner.Bootstrap(c.Context(), queryUint64(c, "project_id", "projectId"))
	return teamJSON(c, data, err)
}

func (Workspace) PostCanvas(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := workspaceRunner.SaveCanvas(
		c.Context(),
		uint64ValueFromBody(body, "project_id", "projectId"),
		uint64ValueFromBody(body, "asset_cate_id", "assetCateId"),
		mapFromBody(body, "canvas"),
	)
	return teamJSON(c, data, err)
}
