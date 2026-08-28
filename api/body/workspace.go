package api

import (
	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
	projectservice "github.com/dever-package/bot/service/project"
)

type Workspace struct{}

var workspaceRunner = projectservice.NewWorkspaceService()

func (Workspace) GetBootstrap(c *server.Context) error {
	data, err := workspaceRunner.Bootstrap(
		c.Context(),
		botapi.QueryUint64(c, "project_id", "projectId"),
		botapi.QueryUint64(c, "canvas_id", "canvasId"),
		botapi.QueryUint64(c, "asset_cate_id", "assetCateId"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Workspace) GetCanvas(c *server.Context) error {
	data, err := workspaceRunner.Canvas(
		c.Context(),
		botapi.QueryUint64(c, "project_id", "projectId"),
		botapi.QueryUint64(c, "canvas_id", "canvasId"),
		botapi.QueryUint64(c, "asset_cate_id", "assetCateId"),
	)
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
		botapi.Uint64FromBody(body, "canvas_id", "canvasId"),
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
			ProjectID:      botapi.Uint64FromBody(body, "project_id", "projectId"),
			CanvasID:       botapi.Uint64FromBody(body, "canvas_id", "canvasId"),
			AssetCateID:    botapi.Uint64FromBody(body, "asset_cate_id", "assetCateId"),
			StartNodeID:    botapi.TextFromBody(body, "start_node_id", "startNodeId", "node_id", "nodeId"),
			RequestID:      botapi.TextFromBody(body, "request_id", "requestId"),
			SingleNode:     botapi.BoolFromBody(body, "single_node", "singleNode"),
			TargetNodeIDs:  botapi.TextSliceFromBody(body, "target_node_ids", "targetNodeIds"),
			ExecutionScope: botapi.TextFromBody(body, "execution_scope", "executionScope"),
			Canvas:         botapi.MapFromBody(body, "canvas"),
			Input:          botapi.MapFromBody(body, "input"),
		},
	)
	return botapi.WriteJSON(c, data, err)
}

func (Workspace) PostCanvasCreate(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := workspaceRunner.CreateCanvas(c.Context(), botapi.Uint64FromBody(body, "project_id", "projectId"), projectservice.CanvasCreateRequest{
		AssetCateID: botapi.Uint64FromBody(body, "asset_cate_id", "assetCateId"),
		Name:        botapi.TextFromBody(body, "name"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Workspace) PostCanvasRename(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := workspaceRunner.RenameCanvas(c.Context(), botapi.Uint64FromBody(body, "project_id", "projectId"), projectservice.CanvasRenameRequest{
		CanvasID: botapi.Uint64FromBody(body, "canvas_id", "canvasId"),
		Name:     botapi.TextFromBody(body, "name"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Workspace) PostCanvasReorder(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := workspaceRunner.ReorderCanvases(c.Context(), botapi.Uint64FromBody(body, "project_id", "projectId"), projectservice.CanvasReorderRequest{
		AssetCateID: botapi.Uint64FromBody(body, "asset_cate_id", "assetCateId"),
		CanvasIDs:   botapi.Uint64SliceFromBody(body, "canvas_ids", "canvasIds"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Workspace) PostCanvasDelete(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := workspaceRunner.DeleteCanvas(c.Context(), botapi.Uint64FromBody(body, "project_id", "projectId"), projectservice.CanvasDeleteRequest{
		CanvasID: botapi.Uint64FromBody(body, "canvas_id", "canvasId"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Workspace) GetCanvasDeleted(c *server.Context) error {
	data, err := workspaceRunner.DeletedCanvases(
		c.Context(),
		botapi.QueryUint64(c, "project_id", "projectId"),
		botapi.QueryUint64(c, "asset_cate_id", "assetCateId"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Workspace) PostCanvasRestore(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := workspaceRunner.RestoreCanvas(c.Context(), botapi.Uint64FromBody(body, "project_id", "projectId"), projectservice.CanvasRestoreRequest{
		CanvasID: botapi.Uint64FromBody(body, "canvas_id", "canvasId"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Workspace) PostCanvasStopAll(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := workspaceRunner.StopAllCanvasRuns(
		c.Context(),
		botapi.Uint64FromBody(body, "project_id", "projectId"),
		botapi.Uint64FromBody(body, "canvas_id", "canvasId"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Workspace) PostCanvasNodeTitle(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := workspaceRunner.GenerateCanvasNodeTitle(c.Context(), projectservice.CanvasNodeTitleRequest{
		ProjectID: botapi.Uint64FromBody(body, "project_id", "projectId"),
		NodeKey:   botapi.TextFromBody(body, "node_key", "nodeKey", "node_id", "nodeId"),
		VersionID: botapi.Uint64FromBody(body, "version_id", "versionId"),
		Prompt:    botapi.TextFromBody(body, "prompt"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Workspace) GetCanvasExecutionList(c *server.Context) error {
	data, err := workspaceRunner.CanvasExecutionList(c.Context(), projectservice.CanvasExecutionQuery{
		ProjectID:   botapi.QueryUint64(c, "project_id", "projectId"),
		CanvasID:    botapi.QueryUint64(c, "canvas_id", "canvasId"),
		AssetCateID: botapi.QueryUint64(c, "asset_cate_id", "assetCateId"),
		Status:      botapi.QueryText(c, "status"),
		Scope:       botapi.QueryText(c, "scope"),
		RunIDs:      botapi.QueryText(c, "run_ids", "runIds"),
		BeforeID:    botapi.QueryUint64(c, "before_id", "beforeId"),
		Limit:       botapi.QueryInt(c, "limit"),
		SummaryOnly: botapi.QueryText(c, "summary_only", "summaryOnly") == "1",
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
