package api

import (
	"context"
	"time"

	"github.com/shemic/dever/server"

	botapi "github.com/dever-package/bot/api"
	assetservice "github.com/dever-package/bot/service/asset"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	workbenchservice "github.com/dever-package/bot/service/workbench"
	frontstream "github.com/dever-package/front/service/stream"
	uploadaccess "github.com/dever-package/front/service/upload/access"
	uploadrepo "github.com/dever-package/front/service/upload/repository"
)

type Workbench struct{}

var workbenchRunner = workbenchservice.NewService()

func (Workbench) GetCatalog(c *server.Context) error {
	data, err := workbenchRunner.Catalog(c.Context(), botapi.QueryUint64(c, "team_id", "teamId"))
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) GetPowerForm(c *server.Context) error {
	data, err := workbenchRunner.PowerForm(
		c.Context(),
		botapi.QueryUint64(c, "team_id", "teamId"),
		botapi.QueryUint64(c, "team_power_id", "teamPowerId", "id"),
		botapi.QueryUint64(c, "source_target_id", "sourceTargetId", "target_id", "targetId"),
		botapi.QueryUint64(c, "target_asset_id", "targetAssetId"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) PostPowerRun(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := workbenchRunner.StartPower(c.Context(), workbenchservice.PowerRunRequest{
		TeamID:         botapi.Uint64FromBody(body, "team_id", "teamId"),
		TeamPowerID:    botapi.Uint64FromBody(body, "team_power_id", "teamPowerId", "id"),
		SourceTargetID: botapi.Uint64FromBody(body, "source_target_id", "sourceTargetId", "target_id", "targetId"),
		TargetAssetID:  botapi.Uint64FromBody(body, "target_asset_id", "targetAssetId"),
		ParamsComplete: botapi.BoolFromBody(body, "params_complete", "paramsComplete"),
		Input:          map[string]any{},
		Params:         botapi.MapFromBody(body, "input"),
	})
	if err != nil {
		return c.JSONPayload(200, botprotocol.BuildErrorResponse("", err).Payload())
	}
	return c.JSONPayload(200, data)
}

func (Workbench) GetPowerStream(c *server.Context) error {
	params := frontstream.ReadParamsFromServerContext(c)
	teamID := botapi.QueryUint64(c, "team_id", "teamId")
	reader := func(ctx context.Context, requestID string, lastID string, count int64, block time.Duration) ([]frontstream.Entry, error) {
		return workbenchRunner.ReadPowerStream(ctx, teamID, requestID, lastID, count, block)
	}
	if frontstream.WantsSSE(c) {
		return frontstream.ServeSSE(c, reader, params)
	}
	entries, err := reader(c.Context(), params.RequestID, params.LastID, params.Count, params.Block)
	if err != nil {
		return c.JSONPayload(200, frontstream.ResponsePayload(params.RequestID, "result", map[string]any{}, err.Error(), 2))
	}
	return c.JSONPayload(200, frontstream.NextPayload(params.RequestID, params.LastID, entries))
}

func (Workbench) PostPowerStop(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	requestID := botapi.TextFromBody(body, "request_id", "requestId")
	teamID := botapi.Uint64FromBody(body, "team_id", "teamId")
	if teamID == 0 {
		teamID = botapi.QueryUint64(c, "team_id", "teamId")
	}
	data, err := workbenchRunner.StopPower(
		c.Context(), teamID,
		botapi.Uint64FromBody(body, "run_id", "runId", "id"), requestID,
	)
	if err != nil {
		return c.JSONPayload(200, botprotocol.BuildErrorResponse(requestID, err).Payload())
	}
	return c.JSONPayload(200, botprotocol.BuildSuccessResponse(requestID, botprotocol.Output{
		"event": "cancel", "text": "已停止运行", "run": data,
	}).Payload())
}

func (Workbench) GetPowerStatus(c *server.Context) error {
	data, err := workbenchRunner.PowerStatus(
		c.Context(),
		botapi.QueryUint64(c, "team_id", "teamId"),
		botapi.QueryUint64(c, "run_id", "runId", "id"),
		botapi.QueryText(c, "request_id", "requestId"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) GetPowerHistory(c *server.Context) error {
	data, err := workbenchRunner.PowerHistory(c.Context(), workbenchservice.PowerHistoryListRequest{
		TeamID:      botapi.QueryUint64(c, "team_id", "teamId"),
		TeamPowerID: botapi.QueryUint64(c, "team_power_id", "teamPowerId"),
		BeforeID:    botapi.QueryUint64(c, "before_id", "beforeId"),
		Limit:       int(botapi.QueryUint64(c, "limit")),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) GetPowerHistoryDetail(c *server.Context) error {
	data, err := workbenchRunner.PowerHistoryDetail(
		c.Context(),
		botapi.QueryUint64(c, "team_id", "teamId"),
		botapi.QueryUint64(c, "history_id", "historyId", "id"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) PostPowerSaveAsset(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := workbenchRunner.SavePowerAsset(c.Context(), workbenchservice.SavePowerAssetRequest{
		TeamID:      botapi.Uint64FromBody(body, "team_id", "teamId"),
		TeamPowerID: botapi.Uint64FromBody(body, "team_power_id", "teamPowerId"),
		RequestID:   botapi.TextFromBody(body, "request_id", "requestId"),
		Name:        botapi.TextFromBody(body, "name"),
		TargetAsset: botapi.Uint64FromBody(body, "target_asset_id", "targetAssetId"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) PostChatSaveAsset(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := workbenchRunner.SaveDialogueAsset(c.Context(), workbenchservice.SaveDialogueAssetRequest{
		TeamID:      botapi.Uint64FromBody(body, "team_id", "teamId"),
		RoleID:      botapi.Uint64FromBody(body, "role_id", "roleId"),
		MessageID:   botapi.Uint64FromBody(body, "message_id", "messageId"),
		ArtifactID:  botapi.Uint64FromBody(body, "artifact_id", "artifactId"),
		Name:        botapi.TextFromBody(body, "name"),
		TargetAsset: botapi.Uint64FromBody(body, "target_asset_id", "targetAssetId"),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) PostUploadSaveAsset(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	file, err := uploadrepo.FindUploadFile(
		c.Context(),
		botapi.Uint64FromBody(body, "file_id", "fileId", "id"),
	)
	if err != nil {
		return botapi.WriteJSON(c, nil, err)
	}
	if err = uploadaccess.EnsureFile(c, uploadaccess.OperationRead, file); err != nil {
		return botapi.WriteJSON(c, nil, err)
	}
	data, err := workbenchRunner.SaveUploadAsset(c.Context(), workbenchservice.SaveUploadAssetRequest{
		TeamID:    botapi.Uint64FromBody(body, "team_id", "teamId"),
		ProjectID: botapi.Uint64FromBody(body, "project_id", "projectId"),
		File:      file,
	})
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) GetAssets(c *server.Context) error {
	data, err := workbenchRunner.Assets(c.Context(), assetservice.QueryRequest{
		TeamID:      botapi.QueryUint64(c, "team_id", "teamId"),
		SourceType:  botapi.QueryText(c, "source_type", "sourceType", "source"),
		SourceID:    botapi.QueryUint64(c, "source_id", "sourceId"),
		ProjectID:   botapi.QueryUint64(c, "project_id", "projectId"),
		AssetCateID: botapi.QueryUint64(c, "asset_cate_id", "assetCateId"),
		NodeKey:     botapi.QueryText(c, "node_key", "nodeKey"),
		Role:        botapi.QueryText(c, "role"),
		Kind:        botapi.QueryText(c, "kind", "type"),
		Page:        int(botapi.QueryUint64(c, "page")),
		PageSize:    int(botapi.QueryUint64(c, "page_size", "pageSize")),
	})
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) GetAssetFilters(c *server.Context) error {
	data, err := workbenchRunner.AssetFilters(
		c.Context(),
		botapi.QueryUint64(c, "team_id", "teamId"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) GetAssetDetail(c *server.Context) error {
	data, err := workbenchRunner.AssetDetail(
		c.Context(),
		botapi.QueryUint64(c, "team_id", "teamId"),
		botapi.QueryUint64(c, "asset_id", "assetId", "id"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) GetAssetVersions(c *server.Context) error {
	data, err := workbenchRunner.AssetVersions(
		c.Context(),
		botapi.QueryUint64(c, "team_id", "teamId"),
		botapi.QueryUint64(c, "asset_id", "assetId", "id"),
		int(botapi.QueryUint64(c, "page")),
		int(botapi.QueryUint64(c, "page_size", "pageSize")),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) GetAssetVersion(c *server.Context) error {
	data, err := workbenchRunner.AssetVersion(
		c.Context(),
		botapi.QueryUint64(c, "team_id", "teamId"),
		botapi.QueryUint64(c, "asset_id", "assetId", "id"),
		botapi.QueryUint64(c, "version_id", "versionId"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) PostAssetSetCurrent(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := workbenchRunner.SetAssetCurrentVersion(
		c.Context(),
		botapi.Uint64FromBody(body, "team_id", "teamId"),
		botapi.Uint64FromBody(body, "asset_id", "assetId", "id"),
		botapi.Uint64FromBody(body, "version_id", "versionId"),
	)
	return botapi.WriteJSON(c, data, err)
}

func (Workbench) PostAssetRename(c *server.Context) error {
	body, err := botapi.BindBody(c)
	if err != nil {
		return c.Error(err)
	}
	data, err := workbenchRunner.RenameAsset(
		c.Context(),
		botapi.Uint64FromBody(body, "team_id", "teamId"),
		botapi.Uint64FromBody(body, "asset_id", "assetId", "id"),
		botapi.TextFromBody(body, "name", "title"),
	)
	return botapi.WriteJSON(c, data, err)
}
