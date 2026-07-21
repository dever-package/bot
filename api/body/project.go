package api

import (
	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
	projectservice "github.com/dever-package/bot/service/project"
)

type Project struct{}

var projectRunner = projectservice.NewService()

func (Project) GetList(c *server.Context) error {
	data, err := projectRunner.List(c.Context(), projectservice.ListRequest{
		TeamID:   botapi.QueryUint64(c, "team_id", "teamId"),
		Page:     int(botapi.QueryUint64(c, "page")),
		PageSize: int(botapi.QueryUint64(c, "page_size", "pageSize")),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Project) GetTrash(c *server.Context) error {
	data, err := projectRunner.Trash(c.Context(), projectservice.ListRequest{
		TeamID:   botapi.QueryUint64(c, "team_id", "teamId"),
		Page:     int(botapi.QueryUint64(c, "page")),
		PageSize: int(botapi.QueryUint64(c, "page_size", "pageSize")),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Project) PostCreate(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := projectRunner.Create(c.Context(), projectservice.CreateRequest{
		Name:        botapi.TextFromBody(body, "name"),
		Description: botapi.TextFromBody(body, "description"),
		Cover:       botapi.TextFromBody(body, "cover"),
		TeamID:      botapi.Uint64FromBody(body, "team_id", "teamId"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Project) GetDetail(c *server.Context) error {
	data, err := projectRunner.Detail(c.Context(), botapi.QueryUint64(c, "id", "project_id", "projectId"))
	return botapi.WriteJSON(c, data, err)
}

func (Project) PostUpdate(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := projectRunner.Update(
		c.Context(),
		botapi.Uint64FromBody(body, "id", "project_id", "projectId"),
		projectservice.UpdateRequest{
			Name:        botapi.TextFromBody(body, "name"),
			Description: botapi.TextFromBody(body, "description"),
		},
	)
	return botapi.WriteJSON(c, data, err)
}

func (Project) PostDelete(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := projectRunner.Delete(c.Context(), botapi.Uint64FromBody(body, "id", "project_id", "projectId"))
	return botapi.WriteJSON(c, data, err)
}

func (Project) PostRestore(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := projectRunner.Restore(c.Context(), botapi.Uint64FromBody(body, "id", "project_id", "projectId"))
	return botapi.WriteJSON(c, data, err)
}

func (Project) GetTeamList(c *server.Context) error {
	data, err := projectRunner.TeamList(c.Context())
	return botapi.WriteJSON(c, data, err)
}

func (Project) GetAssetList(c *server.Context) error {
	data, err := projectRunner.Assets(
		c.Context(),
		botapi.QueryUint64(c, "project_id", "projectId"),
		botapi.QueryUint64(c, "flow_id", "flowId"),
		botapi.QueryText(c, "kind", "type"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Project) GetAssetDetail(c *server.Context) error {
	data, err := projectRunner.AssetDetail(
		c.Context(),
		botapi.QueryUint64(c, "project_id", "projectId"),
		botapi.QueryUint64(c, "asset_id", "assetId", "id"),
		botapi.QueryUint64(c, "current_only", "currentOnly") > 0,
	)
	return botapi.WriteJSON(c, data, err)
}

func (Project) GetAssetVersions(c *server.Context) error {
	data, err := projectRunner.AssetVersions(
		c.Context(),
		botapi.QueryUint64(c, "project_id", "projectId"),
		botapi.QueryUint64(c, "asset_id", "assetId", "id"),
		int(botapi.QueryUint64(c, "page")),
		int(botapi.QueryUint64(c, "page_size", "pageSize")),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Project) GetAssetVersionDetail(c *server.Context) error {
	data, err := projectRunner.AssetVersionDetail(
		c.Context(),
		botapi.QueryUint64(c, "project_id", "projectId"),
		botapi.QueryUint64(c, "asset_id", "assetId", "id"),
		botapi.QueryUint64(c, "version_id", "versionId"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Project) PostSaveAsset(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := projectRunner.SaveAsset(
		c.Context(),
		botapi.Uint64FromBody(body, "project_id", "projectId"),
		projectservice.SaveAssetRequest{
			AssetCateID: botapi.Uint64FromBody(body, "asset_cate_id", "assetCateId"),
			FlowID:      botapi.Uint64FromBody(body, "flow_id", "flowId"),
			RunID:       botapi.Uint64FromBody(body, "run_id", "runId"),
			NodeRunID:   botapi.Uint64FromBody(body, "node_run_id", "nodeRunId"),
			ReleaseID:   botapi.Uint64FromBody(body, "release_id", "releaseId"),
			RequestID:   botapi.TextFromBody(body, "request_id", "requestId"),
			NodeKey:     botapi.TextFromBody(body, "node_key", "nodeKey"),
			Source:      botapi.SourceFromBody(body),
			Name:        botapi.TextFromBody(body, "name"),
			Kind:        botapi.TextFromBody(body, "kind", "type"),
			Role:        botapi.TextFromBody(body, "role"),
			Content:     body["content"],
		},
	)
	return botapi.WriteJSON(c, data, err)
}

func (Project) PostUpdateAssetVersion(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := projectRunner.UpdateAssetVersion(
		c.Context(),
		botapi.Uint64FromBody(body, "project_id", "projectId"),
		projectservice.UpdateAssetVersionRequest{
			AssetID:   botapi.Uint64FromBody(body, "asset_id", "assetId"),
			VersionID: botapi.Uint64FromBody(body, "version_id", "versionId"),
			Content:   body["content"],
		},
	)
	return botapi.WriteJSON(c, data, err)
}

func (Project) PostRestoreAssetVersion(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := projectRunner.RestoreAssetVersion(
		c.Context(),
		botapi.Uint64FromBody(body, "project_id", "projectId"),
		projectservice.RestoreAssetVersionRequest{
			AssetID:   botapi.Uint64FromBody(body, "asset_id", "assetId"),
			VersionID: botapi.Uint64FromBody(body, "version_id", "versionId"),
			RequestID: botapi.TextFromBody(body, "request_id", "requestId"),
			NodeKey:   botapi.TextFromBody(body, "node_key", "nodeKey"),
		},
	)
	return botapi.WriteJSON(c, data, err)
}

func (Project) PostConfirmStoryboard(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := projectRunner.ConfirmStoryboard(
		c.Context(),
		botapi.Uint64FromBody(body, "project_id", "projectId"),
		projectservice.ConfirmStoryboardRequest{
			AssetID:   botapi.Uint64FromBody(body, "asset_id", "assetId"),
			VersionID: botapi.Uint64FromBody(body, "version_id", "versionId"),
		},
	)
	return botapi.WriteJSON(c, data, err)
}

func (Project) PostCreateStoryboardRevision(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := projectRunner.CreateStoryboardRevision(
		c.Context(),
		botapi.Uint64FromBody(body, "project_id", "projectId"),
		projectservice.CreateStoryboardRevisionRequest{
			AssetID:   botapi.Uint64FromBody(body, "asset_id", "assetId"),
			VersionID: botapi.Uint64FromBody(body, "version_id", "versionId"),
			RequestID: botapi.TextFromBody(body, "request_id", "requestId"),
			NodeKey:   botapi.TextFromBody(body, "node_key", "nodeKey"),
		},
	)
	return botapi.WriteJSON(c, data, err)
}

func (Project) GetCanvasConfig(c *server.Context) error {
	data, err := projectRunner.CanvasConfig(
		c.Context(),
		botapi.QueryUint64(c, "project_id", "projectId"),
		botapi.QueryUint64(c, "flow_id", "flowId"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Project) GetCanvasPowerForm(c *server.Context) error {
	data, err := projectRunner.CanvasPowerForm(
		c.Context(),
		botapi.QueryUint64(c, "project_id", "projectId"),
		botapi.QueryUint64(c, "flow_id", "flowId"),
		botapi.QueryUint64(c, "power_id", "powerId"),
		botapi.QueryText(c, "power_key", "powerKey"),
		botapi.QueryUint64(c, "target_id", "targetId", "source_target_id", "sourceTargetId"),
	)
	return botapi.WriteJSON(c, data, err)
}
