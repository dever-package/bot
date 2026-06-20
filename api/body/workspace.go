package api

import (
	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
	projectservice "github.com/dever-package/bot/service/project"
)

type Workspace struct{}

var workspaceRunner = projectservice.NewWorkspaceService()

func (Workspace) GetBootstrap(c *server.Context) error {
	data, err := workspaceRunner.Bootstrap(c.Context(), botapi.QueryUint64(c, "project_id", "projectId"))
	return botapi.WriteJSON(c, data, err)
}

func (Workspace) PostCanvas(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := workspaceRunner.SaveCanvas(
		c.Context(),
		botapi.Uint64FromBody(body, "project_id", "projectId"),
		botapi.Uint64FromBody(body, "asset_cate_id", "assetCateId"),
		botapi.MapFromBody(body, "canvas"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Workspace) PostCanvasExecute(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := workspaceRunner.RunCanvas(
		c.Context(),
		projectservice.CanvasRunRequest{
			ProjectID:   botapi.Uint64FromBody(body, "project_id", "projectId"),
			AssetCateID: botapi.Uint64FromBody(body, "asset_cate_id", "assetCateId"),
			StartNodeID: botapi.TextFromBody(body, "start_node_id", "startNodeId", "node_id", "nodeId"),
			RequestID:   botapi.TextFromBody(body, "request_id", "requestId"),
			SingleNode:  botapi.BoolFromBody(body, "single_node", "singleNode"),
			Canvas:      botapi.MapFromBody(body, "canvas"),
			Input:       botapi.MapFromBody(body, "input"),
		},
	)
	return botapi.WriteJSON(c, data, err)
}

func (Workspace) GetCanvasExecutionList(c *server.Context) error {
	data, err := workspaceRunner.CanvasExecutionList(c.Context(), projectservice.CanvasExecutionQuery{
		ProjectID:   botapi.QueryUint64(c, "project_id", "projectId"),
		AssetCateID: botapi.QueryUint64(c, "asset_cate_id", "assetCateId"),
		Status:      botapi.QueryText(c, "status"),
		Limit:       botapi.QueryInt(c, "limit"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Workspace) GetCanvasExecution(c *server.Context) error {
	data, err := workspaceRunner.CanvasExecution(
		c.Context(),
		botapi.QueryUint64(c, "project_id", "projectId"),
		botapi.QueryUint64(c, "execution_id", "executionId", "id"),
		botapi.QueryUint64(c, "run_id", "runId"),
		botapi.QueryText(c, "request_id", "requestId"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Workspace) GetCanvasNodeResults(c *server.Context) error {
	data, err := workspaceRunner.CanvasNodeResults(
		c.Context(),
		botapi.QueryUint64(c, "project_id", "projectId"),
		botapi.QueryUint64(c, "execution_id", "executionId", "id"),
		botapi.QueryUint64(c, "run_id", "runId"),
		botapi.QueryText(c, "request_id", "requestId"),
	)
	return botapi.WriteJSON(c, data, err)
}
