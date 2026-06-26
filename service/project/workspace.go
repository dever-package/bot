package project

import (
	"context"
	"fmt"
	"time"

	projectmodel "github.com/dever-package/bot/model/project"
	teamservice "github.com/dever-package/bot/service/team"
	frontstream "github.com/dever-package/front/service/stream"
)

type WorkspaceService struct {
	project Service
	streams frontstream.Service
}

func NewWorkspaceService() WorkspaceService {
	return WorkspaceService{project: NewService(), streams: teamservice.StreamStore()}
}

func (s WorkspaceService) Bootstrap(ctx context.Context, projectID uint64) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	project, err = s.project.SyncTeamRelease(ctx, project)
	if err != nil {
		return nil, err
	}
	detail, err := s.project.Detail(ctx, project.ID)
	if err != nil {
		return nil, err
	}
	config, err := s.project.CanvasConfig(ctx, project.ID, 0)
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"project":       detail["project"],
		"team":          detail["team"],
		"assets":        detail["assets"],
		"canvas":        s.projectCanvases(ctx, project.ID),
		"canvas_config": config,
	}, nil
}

func (s WorkspaceService) SaveCanvas(ctx context.Context, projectID uint64, assetCateID uint64, canvas map[string]any) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	clean, err := sanitizeCanvasPayload(assetCateID, canvas)
	if err != nil {
		return nil, err
	}
	record := map[string]any{
		"nodes":      jsonText(clean.Nodes, "[]"),
		"edges":      jsonText(clean.Edges, "[]"),
		"viewport":   jsonText(clean.Viewport, "{}"),
		"updated_at": time.Now(),
	}

	model := projectmodel.NewCanvasModel()
	row := model.Find(ctx, map[string]any{
		"project_id":    project.ID,
		"asset_cate_id": clean.AssetCateID,
	})
	if row == nil {
		record["project_id"] = project.ID
		record["asset_cate_id"] = clean.AssetCateID
		record["created_at"] = time.Now()
		if model.Insert(ctx, record) == 0 {
			return nil, fmt.Errorf("保存画布失败")
		}
	} else {
		if model.Update(ctx, map[string]any{"id": row.ID}, record) == 0 {
			return nil, fmt.Errorf("保存画布失败")
		}
	}
	return map[string]any{
		"canvas": s.projectCanvas(ctx, project.ID, clean.AssetCateID),
	}, nil
}

func (s WorkspaceService) projectCanvases(ctx context.Context, projectID uint64) map[string]any {
	rows := projectmodel.NewCanvasModel().Select(ctx, map[string]any{"project_id": projectID})
	result := map[string]any{}
	for _, row := range rows {
		if row == nil {
			continue
		}
		result[canvasKey(row.AssetCateID)] = canvasPayload(*row)
	}
	return result
}

func (s WorkspaceService) projectCanvas(ctx context.Context, projectID uint64, assetCateID uint64) map[string]any {
	row := projectmodel.NewCanvasModel().Find(ctx, map[string]any{
		"project_id":    projectID,
		"asset_cate_id": assetCateID,
	})
	if row == nil {
		return map[string]any{
			"asset_cate_id": assetCateID,
			"nodes":         []any{},
			"edges":         []any{},
			"viewport":      map[string]any{},
		}
	}
	return canvasPayload(*row)
}

func canvasPayload(row projectmodel.Canvas) map[string]any {
	return map[string]any{
		"id":            row.ID,
		"project_id":    row.ProjectID,
		"asset_cate_id": row.AssetCateID,
		"nodes":         jsonValue(row.Nodes, []any{}),
		"edges":         jsonValue(row.Edges, []any{}),
		"viewport":      jsonValue(row.Viewport, map[string]any{}),
		"updated_at":    row.UpdatedAt,
	}
}

func canvasKey(assetCateID uint64) string {
	if assetCateID == 0 {
		return "default"
	}
	return fmt.Sprintf("%d", assetCateID)
}
