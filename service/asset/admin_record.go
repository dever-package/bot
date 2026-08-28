package asset

import (
	"context"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
	assetmodel "github.com/dever-package/bot/model/asset"
	teammodel "github.com/dever-package/bot/model/team"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

// UserRecordService exposes read-only asset records to administrators.
type UserRecordService struct{}

func (UserRecordService) ProviderLoadAssetDetail(c *server.Context, _ []any) any {
	ctx, assetID, userID := adminAssetRecordContext(c)
	if assetID == 0 || userID == 0 {
		panic("资产记录参数不完整")
	}
	row := assetmodel.NewAssetModel().Find(ctx, map[string]any{
		"id": assetID, "user_id": userID,
	})
	if row == nil {
		panic("资产记录不存在")
	}
	version := assetmodel.NewVersionModel().Find(ctx, map[string]any{
		"id": row.VersionID, "asset_id": row.ID,
	})
	if version == nil {
		panic("资产版本不存在")
	}
	resultRaw := jsonValue(version.Content)
	if resultRaw == nil {
		resultRaw = "未生成结果"
	}
	updatedAt := version.CreatedAt
	if version.UpdatedAt != nil && !version.UpdatedAt.IsZero() {
		updatedAt = *version.UpdatedAt
	}
	return map[string]any{
		"id":              row.ID,
		"name":            strings.TrimSpace(row.Name),
		"kind":            strings.TrimSpace(row.Kind),
		"role":            strings.TrimSpace(row.Role),
		"source_type":     strings.TrimSpace(row.SourceType),
		"source_name":     strings.TrimSpace(row.SourceName),
		"status":          strings.TrimSpace(row.Status),
		"version":         version.Version,
		"prompt":          adminAssetPrompt(ctx, *row, *version),
		"result_text":     adminAssetResultText(resultRaw),
		"result_document": EnsureDocument(resultRaw, row.Kind),
		"request_id":      strings.TrimSpace(version.RequestID),
		"created_at":      row.CreatedAt,
		"updated_at":      updatedAt,
	}
}

func adminAssetRecordContext(c *server.Context) (context.Context, uint64, uint64) {
	ctx := context.Background()
	if c != nil {
		ctx = c.Context()
		return ctx, util.ToUint64(c.Input("id")), util.ToUint64(c.Input("user_id"))
	}
	return ctx, 0, 0
}

func adminAssetPrompt(ctx context.Context, asset assetmodel.Asset, version assetmodel.Version) string {
	if asset.SourceType == assetmodel.SourceUpload || asset.SourceType == assetmodel.SourceImport {
		return "用户导入资产，无生成提示词"
	}
	source := adminAssetRecordMap(jsonValue(version.Source))
	if prompt := strings.TrimSpace(util.ToString(source["prompt"])); prompt != "" {
		return prompt
	}
	if asset.SourceType == assetmodel.SourceDialogue {
		if prompt := adminDialogueAssetPrompt(ctx, source, asset.UserID); prompt != "" {
			return prompt
		}
	}
	input := adminAssetRecordMap(source["input"])
	if run := adminAssetSourceRun(ctx, asset, source); run != nil {
		input = adminAssetRecordMap(jsonValue(run.Input))
		if replay := adminAssetRecordMap(input["_replay_input"]); len(replay) > 0 {
			input = replay
		}
	}
	prompt := botprotocol.BuildPromptContent(input, botprotocol.PromptOptions{
		TextTitle: "提示词",
	}).TextWithMediaReferences(botprotocol.MediaReferenceOptions{
		Images: true, Videos: true, Audios: true, Files: true,
	})
	if strings.TrimSpace(prompt) == "" {
		return "未记录提示词"
	}
	return prompt
}

func adminAssetSourceRun(ctx context.Context, asset assetmodel.Asset, source map[string]any) *teammodel.Run {
	requestID := strings.TrimSpace(util.ToString(source["source_request_id"]))
	filter := adminAssetSourceRunScope(asset)
	if runID := util.ToUint64(source["source_run_id"]); runID > 0 {
		filter["id"] = runID
		if run := teammodel.NewRunModel().Find(ctx, filter); run != nil &&
			(requestID == "" || strings.TrimSpace(run.RequestID) == requestID) {
			return run
		}
		delete(filter, "id")
	}
	if requestID == "" {
		return nil
	}
	filter["request_id"] = requestID
	return teammodel.NewRunModel().Find(ctx, filter)
}

func adminAssetSourceRunScope(asset assetmodel.Asset) map[string]any {
	filter := map[string]any{}
	switch {
	case asset.ProjectID > 0:
		filter["project_id"] = asset.ProjectID
	case asset.BodyID > 0:
		filter["body_id"] = asset.BodyID
	case asset.TeamID > 0:
		filter["team_id"] = asset.TeamID
	}
	return filter
}

func adminDialogueAssetPrompt(ctx context.Context, source map[string]any, userID uint64) string {
	messageID := util.ToUint64(source["message_id"])
	sessionID := util.ToUint64(source["session_id"])
	if messageID == 0 || sessionID == 0 || userID == 0 {
		return ""
	}
	if session := agentmodel.NewSessionModel().Find(ctx, map[string]any{
		"id":         sessionID,
		"owner_type": agentmodel.SessionOwnerTypeBodyUser,
		"owner_id":   userID,
	}); session == nil {
		return ""
	}
	rows := agentmodel.NewMessageModel().Select(ctx, map[string]any{
		"session_id": sessionID,
		"role":       "user",
		"id":         map[string]any{"lt": messageID},
	}, map[string]any{
		"field": "main.id,main.text", "order": "main.id desc", "limit": 1,
	})
	if len(rows) == 0 || rows[0] == nil {
		return ""
	}
	return strings.TrimSpace(rows[0].Text)
}

func adminAssetRecordMap(value any) map[string]any {
	row, _ := value.(map[string]any)
	if row == nil {
		return map[string]any{}
	}
	return row
}

func adminAssetResultText(raw any) string {
	output := botprotocol.ExtractOutput(raw)
	for _, key := range []string{"text", "lyrics", "title", "error"} {
		if text := strings.TrimSpace(botprotocol.AsText(output[key])); text != "" {
			return text
		}
	}
	if text, ok := raw.(string); ok {
		return strings.TrimSpace(text)
	}
	return ""
}
