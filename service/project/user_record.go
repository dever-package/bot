package project

import (
	"context"
	"fmt"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	assetmodel "github.com/dever-package/bot/model/asset"
	projectmodel "github.com/dever-package/bot/model/project"
	workspacemodel "github.com/dever-package/bot/model/workspace"
	assetservice "github.com/dever-package/bot/service/asset"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	defaultUserRecordPageSize = 20
	maxUserRecordPageSize     = 100
)

// UserRecordService exposes read-only project records to the Body usage console.
type UserRecordService struct{}

func (UserRecordService) ProviderLoadProjectDetail(c *server.Context, _ []any) any {
	ctx, projectID, userID := projectRecordContext(c)
	project := requireUserProject(ctx, projectID, userID)
	return map[string]any{
		"id":          project.ID,
		"user_id":     project.UserID,
		"name":        strings.TrimSpace(project.Name),
		"description": strings.TrimSpace(project.Description),
		"status":      project.Status,
		"created_at":  project.CreatedAt,
		"updated_at":  project.UpdatedAt,
	}
}

func (UserRecordService) ProviderLoadProjectExecutions(c *server.Context, _ []any) any {
	ctx, projectID, userID := projectRecordContext(c)
	requireUserProject(ctx, projectID, userID)
	page, pageSize := projectRecordPagination(c)
	filter := map[string]any{"project_id": projectID}
	model := workspacemodel.NewNodeExecutionModel()
	rows := model.Select(ctx, filter, map[string]any{
		"field":    "main.id,main.project_id,main.node_key,main.node_type,main.function_key,main.status,main.asset_id,main.version_id,main.started_at,main.finished_at,main.created_at,main.updated_at",
		"order":    "main.id desc",
		"page":     page,
		"pageSize": pageSize,
	})
	list := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil {
			continue
		}
		list = append(list, map[string]any{
			"id":           row.ID,
			"display_name": projectExecutionName(*row),
			"node_key":     strings.TrimSpace(row.NodeKey),
			"node_type":    strings.TrimSpace(row.NodeType),
			"function_key": strings.TrimSpace(row.FunctionKey),
			"status":       strings.TrimSpace(row.Status),
			"has_result":   row.AssetID > 0 || row.VersionID > 0,
			"started_at":   row.StartedAt,
			"finished_at":  row.FinishedAt,
			"created_at":   row.CreatedAt,
			"updated_at":   row.UpdatedAt,
		})
	}
	return map[string]any{
		"list": list, "total": model.Count(ctx, filter), "page": page, "pageSize": pageSize,
	}
}

func (UserRecordService) ProviderLoadProjectExecutionDetail(c *server.Context, _ []any) any {
	ctx, projectID, userID := projectRecordContext(c)
	requireUserProject(ctx, projectID, userID)
	executionID := projectRecordInputID(c, "execution_id")
	row := workspacemodel.NewNodeExecutionModel().Find(ctx, map[string]any{
		"id": executionID, "project_id": projectID,
	})
	if row == nil {
		panic("作品节点记录不存在")
	}

	input := mapValue(jsonValue(row.Input, map[string]any{}))
	if nested := mapValue(input["input"]); nested != nil {
		input = nested
	}
	prompt := botprotocol.BuildPromptContent(input, botprotocol.PromptOptions{
		TextTitle: "提示词",
	}).TextWithMediaReferences(botprotocol.MediaReferenceOptions{
		Images: true, Videos: true, Audios: true, Files: true,
	})
	if strings.TrimSpace(prompt) == "" {
		prompt = "未记录提示词"
	}

	resultRaw := jsonValue(row.Output, map[string]any{})
	resultKind := "richtext"
	if asset := projectExecutionAsset(ctx, userID, projectID, row.AssetID); asset != nil {
		resultKind = asset.Kind
		if version := projectExecutionVersion(ctx, *asset, row.VersionID); version != nil {
			resultRaw = jsonValue(version.Content, map[string]any{})
		}
	}
	if projectRecordResultEmpty(resultRaw) {
		resultRaw = "未生成结果"
	}
	resultText := projectRecordResultText(resultRaw)
	return map[string]any{
		"id":              row.ID,
		"project_id":      row.ProjectID,
		"display_name":    projectExecutionName(*row),
		"node_key":        strings.TrimSpace(row.NodeKey),
		"node_type":       strings.TrimSpace(row.NodeType),
		"function_key":    strings.TrimSpace(row.FunctionKey),
		"status":          strings.TrimSpace(row.Status),
		"prompt":          prompt,
		"result_text":     resultText,
		"result_document": assetservice.EnsureDocument(resultRaw, resultKind),
		"error":           strings.TrimSpace(row.Error),
		"request_id":      strings.TrimSpace(row.RequestID),
		"asset_id":        row.AssetID,
		"version_id":      row.VersionID,
		"has_error":       strings.TrimSpace(row.Error) != "",
		"started_at":      row.StartedAt,
		"finished_at":     row.FinishedAt,
		"created_at":      row.CreatedAt,
		"updated_at":      row.UpdatedAt,
	}
}

func projectRecordContext(c *server.Context) (context.Context, uint64, uint64) {
	ctx := context.Background()
	if c != nil {
		ctx = c.Context()
	}
	return ctx, projectRecordInputID(c, "id"), projectRecordInputID(c, "user_id")
}

func projectRecordInputID(c *server.Context, key string) uint64 {
	if c == nil {
		return 0
	}
	return util.ToUint64(c.Input(key))
}

func projectRecordPagination(c *server.Context) (int, int) {
	page, pageSize := 1, defaultUserRecordPageSize
	if c != nil {
		page = util.ToIntDefault(c.Input("page"), page)
		pageSize = util.ToIntDefault(c.Input("pageSize"), pageSize)
	}
	return max(page, 1), min(max(pageSize, 1), maxUserRecordPageSize)
}

func requireUserProject(ctx context.Context, projectID uint64, userID uint64) *projectmodel.Project {
	if projectID == 0 || userID == 0 {
		panic("作品记录参数不完整")
	}
	project := projectmodel.NewProjectModel().Find(ctx, map[string]any{
		"id": projectID, "user_id": userID,
	})
	if project == nil {
		panic("作品记录不存在")
	}
	return project
}

func projectExecutionName(row workspacemodel.NodeExecution) string {
	for _, value := range []string{row.FunctionKey, row.NodeType, row.NodeKey} {
		if name := strings.TrimSpace(value); name != "" {
			return name
		}
	}
	return fmt.Sprintf("节点记录 #%d", row.ID)
}

func projectExecutionAsset(ctx context.Context, userID uint64, projectID uint64, assetID uint64) *assetmodel.Asset {
	if assetID == 0 {
		return nil
	}
	return assetmodel.NewAssetModel().Find(ctx, map[string]any{
		"id": assetID, "user_id": userID, "project_id": projectID,
	})
}

func projectExecutionVersion(ctx context.Context, asset assetmodel.Asset, versionID uint64) *assetmodel.Version {
	if versionID == 0 {
		versionID = asset.VersionID
	}
	if versionID == 0 {
		return nil
	}
	return assetmodel.NewVersionModel().Find(ctx, map[string]any{
		"id": versionID, "asset_id": asset.ID,
	})
}

func projectRecordResultText(raw any) string {
	output := botprotocol.ExtractOutput(raw)
	for _, key := range []string{"text", "lyrics", "title", "error"} {
		if text := strings.TrimSpace(botprotocol.AsText(output[key])); text != "" {
			return text
		}
	}
	return ""
}

func projectRecordResultEmpty(raw any) bool {
	switch value := raw.(type) {
	case nil:
		return true
	case string:
		return strings.TrimSpace(value) == ""
	case map[string]any:
		return len(value) == 0
	case []any:
		return len(value) == 0
	default:
		return false
	}
}
