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

func (Workspace) PostCanvasExecute(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := workspaceRunner.RunCanvas(
		c.Context(),
		projectservice.CanvasRunRequest{
			ProjectID:   uint64ValueFromBody(body, "project_id", "projectId"),
			AssetCateID: uint64ValueFromBody(body, "asset_cate_id", "assetCateId"),
			StartNodeID: textFromBody(body, "start_node_id", "startNodeId", "node_id", "nodeId"),
			RequestID:   textFromBody(body, "request_id", "requestId"),
			SingleNode:  boolFromBody(body, "single_node", "singleNode"),
			Canvas:      mapFromBody(body, "canvas"),
			Input:       mapFromBody(body, "input"),
		},
	)
	return teamJSON(c, data, err)
}

func (Workspace) GetCanvasExecutionList(c *server.Context) error {
	data, err := workspaceRunner.CanvasExecutionList(c.Context(), projectservice.CanvasExecutionQuery{
		ProjectID:   queryUint64(c, "project_id", "projectId"),
		AssetCateID: queryUint64(c, "asset_cate_id", "assetCateId"),
		Status:      queryText(c, "status"),
		Limit:       queryInt(c, "limit"),
	})
	return teamJSON(c, data, err)
}

func (Workspace) GetCanvasExecution(c *server.Context) error {
	data, err := workspaceRunner.CanvasExecution(
		c.Context(),
		queryUint64(c, "project_id", "projectId"),
		queryUint64(c, "execution_id", "executionId", "id"),
		queryUint64(c, "run_id", "runId"),
		queryText(c, "request_id", "requestId"),
	)
	return teamJSON(c, data, err)
}

func (Workspace) GetCanvasNodeResults(c *server.Context) error {
	data, err := workspaceRunner.CanvasNodeResults(
		c.Context(),
		queryUint64(c, "project_id", "projectId"),
		queryUint64(c, "execution_id", "executionId", "id"),
		queryUint64(c, "run_id", "runId"),
		queryText(c, "request_id", "requestId"),
	)
	return teamJSON(c, data, err)
}
