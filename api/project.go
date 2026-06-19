package api

import (
	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	projectservice "github.com/dever-package/bot/service/project"
	frontstream "github.com/dever-package/front/service/stream"
)

type Project struct{}

var projectRunner = projectservice.NewService()

func (Project) GetList(c *server.Context) error {
	data, err := projectRunner.List(c.Context())
	return teamJSON(c, data, err)
}

func (Project) PostCreate(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := projectRunner.Create(c.Context(), projectservice.CreateRequest{
		Name:        textFromBody(body, "name"),
		Description: textFromBody(body, "description"),
		Cover:       textFromBody(body, "cover"),
		TeamID:      uint64ValueFromBody(body, "team_id", "teamId"),
		ReleaseID:   uint64ValueFromBody(body, "release_id", "releaseId"),
	})
	return teamJSON(c, data, err)
}

func (Project) GetDetail(c *server.Context) error {
	data, err := projectRunner.Detail(c.Context(), queryUint64(c, "id", "project_id", "projectId"))
	return teamJSON(c, data, err)
}

func (Project) PostDelete(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := projectRunner.Delete(c.Context(), uint64ValueFromBody(body, "id", "project_id", "projectId"))
	return teamJSON(c, data, err)
}

func (Project) GetTeamList(c *server.Context) error {
	data, err := projectRunner.TeamList(c.Context())
	return teamJSON(c, data, err)
}

func (Project) GetAssetList(c *server.Context) error {
	data, err := projectRunner.Assets(
		c.Context(),
		queryUint64(c, "project_id", "projectId"),
		queryUint64(c, "flow_id", "flowId"),
		queryText(c, "kind", "type"),
	)
	return teamJSON(c, data, err)
}

func (Project) GetAssetDetail(c *server.Context) error {
	data, err := projectRunner.AssetDetail(
		c.Context(),
		queryUint64(c, "project_id", "projectId"),
		queryUint64(c, "asset_id", "assetId", "id"),
	)
	return teamJSON(c, data, err)
}

func (Project) PostSaveAsset(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := projectRunner.SaveAsset(
		c.Context(),
		uint64ValueFromBody(body, "project_id", "projectId"),
		projectservice.SaveAssetRequest{
			AssetCateID: uint64ValueFromBody(body, "asset_cate_id", "assetCateId"),
			FlowID:      uint64ValueFromBody(body, "flow_id", "flowId"),
			RunID:       uint64ValueFromBody(body, "run_id", "runId"),
			NodeRunID:   uint64ValueFromBody(body, "node_run_id", "nodeRunId"),
			ReleaseID:   uint64ValueFromBody(body, "release_id", "releaseId"),
			RequestID:   textFromBody(body, "request_id", "requestId"),
			NodeKey:     textFromBody(body, "node_key", "nodeKey"),
			Source:      sourceFromBody(body),
			Name:        textFromBody(body, "name"),
			Kind:        textFromBody(body, "kind", "type"),
			Role:        textFromBody(body, "role"),
			Content:     body["content"],
		},
	)
	return teamJSON(c, data, err)
}

func (Project) PostUpdateAssetVersion(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := projectRunner.UpdateAssetVersion(
		c.Context(),
		uint64ValueFromBody(body, "project_id", "projectId"),
		projectservice.UpdateAssetVersionRequest{
			AssetID:   uint64ValueFromBody(body, "asset_id", "assetId"),
			VersionID: uint64ValueFromBody(body, "version_id", "versionId"),
			Content:   body["content"],
		},
	)
	return teamJSON(c, data, err)
}

func (Project) PostUseAssetVersion(c *server.Context) error {
	body, err := bindTeamBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := projectRunner.UseAssetVersion(
		c.Context(),
		uint64ValueFromBody(body, "project_id", "projectId"),
		uint64ValueFromBody(body, "asset_id", "assetId"),
		uint64ValueFromBody(body, "version_id", "versionId"),
	)
	return teamJSON(c, data, err)
}

func (Project) GetCanvasConfig(c *server.Context) error {
	data, err := projectRunner.CanvasConfig(
		c.Context(),
		queryUint64(c, "project_id", "projectId"),
		queryUint64(c, "flow_id", "flowId"),
	)
	return teamJSON(c, data, err)
}

func (Project) GetCanvasPowerForm(c *server.Context) error {
	data, err := projectRunner.CanvasPowerForm(
		c.Context(),
		queryUint64(c, "project_id", "projectId"),
		queryUint64(c, "flow_id", "flowId"),
		queryUint64(c, "power_id", "powerId"),
		queryText(c, "power_key", "powerKey"),
		queryUint64(c, "target_id", "targetId", "source_target_id", "sourceTargetId"),
	)
	return teamJSON(c, data, err)
}

func queryUint64(c *server.Context, keys ...string) uint64 {
	for _, key := range keys {
		if value := util.ToUint64(c.Input(key)); value > 0 {
			return value
		}
	}
	return 0
}

func queryInt(c *server.Context, keys ...string) int {
	for _, key := range keys {
		if value := util.ToIntDefault(c.Input(key), 0); value > 0 {
			return value
		}
	}
	return 0
}

func queryText(c *server.Context, keys ...string) string {
	for _, key := range keys {
		if text := frontstream.InputText(c.Input(key)); text != "" {
			return text
		}
	}
	return ""
}

func sourceFromBody(body map[string]any) map[string]any {
	source := map[string]any{}
	for _, key := range []string{
		"source_key",
		"source_run_id",
		"source_node_run_id",
		"source_asset_id",
		"source_version_id",
		"source_release_id",
		"source_request_id",
		"source_node_key",
		"source_node_type",
		"source_status",
	} {
		if value, ok := body[key]; ok && value != nil {
			source[key] = value
		}
	}
	if len(source) == 0 {
		return nil
	}
	return source
}
