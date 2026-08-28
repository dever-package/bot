package project

import (
	"context"
	"fmt"
	"strings"
	"time"
	"unicode/utf8"

	assetmodel "github.com/dever-package/bot/model/asset"
	maintenancemodel "github.com/dever-package/bot/model/maintenance"
	projectmodel "github.com/dever-package/bot/model/project"
	workspacemodel "github.com/dever-package/bot/model/workspace"
	teamservice "github.com/dever-package/bot/service/team"
	"github.com/shemic/dever/orm"
)

const maxCanvasNameRunes = 128

type CanvasCreateRequest struct {
	AssetCateID uint64
	Name        string
}

type CanvasRenameRequest struct {
	CanvasID uint64
	Name     string
}

type CanvasReorderRequest struct {
	AssetCateID uint64
	CanvasIDs   []uint64
}

type CanvasDeleteRequest struct {
	CanvasID uint64
}

type CanvasRestoreRequest struct {
	CanvasID uint64
}

func (s WorkspaceService) projectCanvasAssetCates(
	ctx context.Context,
	project *projectmodel.Project,
) ([]teamservice.GraphAssetCate, error) {
	if project == nil {
		return nil, fmt.Errorf("项目不存在")
	}
	current, err := s.project.currentTeamRelease(ctx, project)
	if err != nil {
		return nil, err
	}
	payload, err := s.project.team.WorkspaceCanvasBootstrap(ctx, current.TeamID, current.ReleaseID)
	if err != nil {
		return nil, err
	}
	assetCates, _ := payload["asset_cates"].([]teamservice.GraphAssetCate)
	return assetCates, nil
}

func requireProjectMultiCanvasReady(ctx context.Context) error {
	if maintenancemodel.NewDataMigrationModel().Find(ctx, map[string]any{
		"key": maintenancemodel.ProjectMultiCanvasMigrationKey,
	}) == nil {
		return fmt.Errorf("项目多画布数据迁移尚未完成，请重启服务并检查启动日志")
	}
	return nil
}

func (s WorkspaceService) ensureProjectCanvas(
	ctx context.Context,
	projectID uint64,
	assetCateID uint64,
	requestedCanvasID uint64,
) (*projectmodel.Canvas, error) {
	if requestedCanvasID > 0 {
		return requireProjectCanvas(ctx, projectID, requestedCanvasID, assetCateID)
	}
	if row := firstProjectCanvas(ctx, projectID, assetCateID); row != nil {
		return row, nil
	}
	if err := requireProjectMultiCanvasReady(ctx); err != nil {
		return nil, err
	}
	return withWorkspaceAssetLock(ctx, projectID, []string{
		"canvas_create",
		fmt.Sprintf("%d", assetCateID),
	}, func() (*projectmodel.Canvas, error) {
		if row := firstProjectCanvas(ctx, projectID, assetCateID); row != nil {
			return row, nil
		}
		now := time.Now()
		canvasID := uint64(projectmodel.NewCanvasModel().Insert(ctx, map[string]any{
			"project_id":    projectID,
			"asset_cate_id": assetCateID,
			"name":          projectmodel.CanvasDefaultName,
			"sort":          1,
			"status":        projectmodel.CanvasStatusEnabled,
			"next_node_no":  1,
			"nodes":         "[]",
			"edges":         "[]",
			"viewport":      "{}",
			"created_at":    now,
			"updated_at":    now,
		}))
		if canvasID == 0 {
			return nil, fmt.Errorf("创建初始画布失败")
		}
		return requireProjectCanvas(ctx, projectID, canvasID, assetCateID)
	})
}

func requireProjectCanvas(
	ctx context.Context,
	projectID uint64,
	canvasID uint64,
	assetCateID uint64,
) (*projectmodel.Canvas, error) {
	if projectID == 0 || canvasID == 0 {
		return nil, fmt.Errorf("画布不能为空")
	}
	row := projectmodel.NewCanvasModel().Find(ctx, map[string]any{
		"id":         canvasID,
		"project_id": projectID,
		"status":     projectmodel.CanvasStatusEnabled,
	})
	if row == nil {
		return nil, fmt.Errorf("画布不存在或不属于当前项目")
	}
	if assetCateID > 0 && row.AssetCateID != assetCateID {
		return nil, fmt.Errorf("画布输出类型不一致")
	}
	return row, nil
}

func firstProjectCanvas(ctx context.Context, projectID uint64, assetCateID uint64) *projectmodel.Canvas {
	return projectmodel.NewCanvasModel().Find(ctx, map[string]any{
		"project_id":    projectID,
		"asset_cate_id": assetCateID,
		"status":        projectmodel.CanvasStatusEnabled,
	}, map[string]any{"order": "main.sort asc,main.id asc"})
}

func projectCanvasRows(ctx context.Context, projectID uint64, assetCateID *uint64) []*projectmodel.Canvas {
	filter := map[string]any{
		"project_id": projectID,
		"status":     projectmodel.CanvasStatusEnabled,
	}
	if assetCateID != nil {
		filter["asset_cate_id"] = *assetCateID
	}
	return projectmodel.NewCanvasModel().Select(ctx, filter, map[string]any{
		"order": "main.asset_cate_id asc,main.sort asc,main.id asc",
	})
}

func projectDeletedCanvasRows(ctx context.Context, projectID uint64, assetCateID uint64) []*projectmodel.Canvas {
	return projectmodel.NewCanvasModel().Select(ctx, map[string]any{
		"project_id":    projectID,
		"asset_cate_id": assetCateID,
		"status":        projectmodel.CanvasStatusDeleted,
	}, map[string]any{
		"order": "main.deleted_at desc,main.updated_at desc,main.id desc",
	})
}

func projectCanvasListPayload(rows []*projectmodel.Canvas) []map[string]any {
	items := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			items = append(items, canvasSummaryPayload(*row))
		}
	}
	return items
}

func canvasSummaryPayload(row projectmodel.Canvas) map[string]any {
	return map[string]any{
		"id":            row.ID,
		"project_id":    row.ProjectID,
		"asset_cate_id": row.AssetCateID,
		"name":          strings.TrimSpace(row.Name),
		"sort":          row.Sort,
		"status":        row.Status,
		"updated_at":    row.UpdatedAt,
		"deleted_at":    row.DeletedAt,
	}
}

func (s WorkspaceService) DeletedCanvases(
	ctx context.Context,
	projectID uint64,
	assetCateID uint64,
) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	if err = requireProjectMultiCanvasReady(ctx); err != nil {
		return nil, err
	}
	assetCates, err := s.projectCanvasAssetCates(ctx, project)
	if err != nil {
		return nil, err
	}
	if !validCanvasAssetCate(assetCates, assetCateID) {
		return nil, fmt.Errorf("输出类型不存在")
	}
	rows := projectDeletedCanvasRows(ctx, project.ID, assetCateID)
	return map[string]any{
		"items": projectCanvasListPayload(rows),
		"count": len(rows),
	}, nil
}

func (s WorkspaceService) CreateCanvas(
	ctx context.Context,
	projectID uint64,
	req CanvasCreateRequest,
) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	if err = requireProjectMultiCanvasReady(ctx); err != nil {
		return nil, err
	}
	assetCates, err := s.projectCanvasAssetCates(ctx, project)
	if err != nil {
		return nil, err
	}
	if !validCanvasAssetCate(assetCates, req.AssetCateID) {
		return nil, fmt.Errorf("输出类型不存在")
	}
	return withWorkspaceAssetLock(ctx, project.ID, []string{
		"canvas_create",
		fmt.Sprintf("%d", req.AssetCateID),
	}, func() (map[string]any, error) {
		rows := projectCanvasRows(ctx, project.ID, &req.AssetCateID)
		name, nameErr := createCanvasName(req.Name, rows)
		if nameErr != nil {
			return nil, nameErr
		}
		now := time.Now()
		canvasID := uint64(projectmodel.NewCanvasModel().Insert(ctx, map[string]any{
			"project_id":    project.ID,
			"asset_cate_id": req.AssetCateID,
			"name":          name,
			"sort":          nextCanvasSort(rows),
			"status":        projectmodel.CanvasStatusEnabled,
			"next_node_no":  1,
			"nodes":         "[]",
			"edges":         "[]",
			"viewport":      "{}",
			"created_at":    now,
			"updated_at":    now,
		}))
		if canvasID == 0 {
			return nil, fmt.Errorf("创建画布失败")
		}
		created, canvasErr := requireProjectCanvas(ctx, project.ID, canvasID, req.AssetCateID)
		if canvasErr != nil {
			return nil, canvasErr
		}
		return map[string]any{
			"canvas":           canvasPayload(*created),
			"canvas_list":      projectCanvasListPayload(projectCanvasRows(ctx, project.ID, nil)),
			"active_canvas_id": created.ID,
		}, nil
	})
}

func (s WorkspaceService) RenameCanvas(
	ctx context.Context,
	projectID uint64,
	req CanvasRenameRequest,
) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	if err := requireProjectMultiCanvasReady(ctx); err != nil {
		return nil, err
	}
	row, err := requireProjectCanvas(ctx, projectID, req.CanvasID, 0)
	if err != nil {
		return nil, err
	}
	name, err := normalizeCanvasName(req.Name)
	if err != nil {
		return nil, err
	}
	if row.Name != name && projectmodel.NewCanvasModel().Update(ctx, map[string]any{
		"id":         row.ID,
		"project_id": projectID,
		"status":     projectmodel.CanvasStatusEnabled,
	}, map[string]any{"name": name, "updated_at": time.Now()}) != 1 {
		return nil, fmt.Errorf("重命名画布失败")
	}
	row.Name = name
	return map[string]any{
		"canvas":      canvasSummaryPayload(*row),
		"canvas_list": projectCanvasListPayload(projectCanvasRows(ctx, projectID, nil)),
	}, nil
}

func (s WorkspaceService) ReorderCanvases(
	ctx context.Context,
	projectID uint64,
	req CanvasReorderRequest,
) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	if err := requireProjectMultiCanvasReady(ctx); err != nil {
		return nil, err
	}
	return withWorkspaceAssetLock(ctx, projectID, []string{
		"canvas_reorder",
		fmt.Sprintf("%d", req.AssetCateID),
	}, func() (map[string]any, error) {
		rows := projectCanvasRows(ctx, projectID, &req.AssetCateID)
		if err := validateCanvasOrder(rows, req.CanvasIDs); err != nil {
			return nil, err
		}
		if err := orm.Transaction(ctx, func(tx context.Context) error {
			now := time.Now()
			for index, canvasID := range req.CanvasIDs {
				if projectmodel.NewCanvasModel().Update(tx, map[string]any{
					"id":            canvasID,
					"project_id":    projectID,
					"asset_cate_id": req.AssetCateID,
					"status":        projectmodel.CanvasStatusEnabled,
				}, map[string]any{"sort": index + 1, "updated_at": now}) != 1 {
					return fmt.Errorf("更新画布排序失败")
				}
			}
			return nil
		}); err != nil {
			return nil, err
		}
		return map[string]any{
			"canvas_list": projectCanvasListPayload(projectCanvasRows(ctx, projectID, nil)),
		}, nil
	})
}

func (s WorkspaceService) DeleteCanvas(
	ctx context.Context,
	projectID uint64,
	req CanvasDeleteRequest,
) (map[string]any, error) {
	if _, err := requireProject(ctx, projectID); err != nil {
		return nil, err
	}
	if err := requireProjectMultiCanvasReady(ctx); err != nil {
		return nil, err
	}
	row, err := requireProjectCanvas(ctx, projectID, req.CanvasID, 0)
	if err != nil {
		return nil, err
	}
	return withWorkspaceAssetLock(ctx, projectID, []string{
		"canvas_delete",
		fmt.Sprintf("%d", row.AssetCateID),
	}, func() (map[string]any, error) {
		rows := projectCanvasRows(ctx, projectID, &row.AssetCateID)
		if len(rows) <= 1 {
			return nil, fmt.Errorf("至少保留一个画布")
		}
		remaining := make([]*projectmodel.Canvas, 0, len(rows)-1)
		for _, current := range rows {
			if current != nil && current.ID != row.ID {
				remaining = append(remaining, current)
			}
		}
		if len(remaining) == 0 {
			return nil, fmt.Errorf("至少保留一个画布")
		}
		if workspacemodel.NewExecutionModel().Count(ctx, map[string]any{
			"project_id": projectID,
			"canvas_id":  row.ID,
			"status":     canvasRunActiveStatuses(),
		}) > 0 {
			return nil, fmt.Errorf("画布仍有运行中的任务，请先停止后再删除")
		}
		if assetmodel.NewImportTaskModel().Count(ctx, map[string]any{
			"project_id": projectID,
			"canvas_id":  row.ID,
			"status": []string{
				assetmodel.ImportTaskStatusPending,
				assetmodel.ImportTaskStatusDiscovering,
				assetmodel.ImportTaskStatusRunning,
			},
		}) > 0 {
			return nil, fmt.Errorf("画布仍有导入中的任务，请等待完成后再删除")
		}
		if err := orm.Transaction(ctx, func(tx context.Context) error {
			now := time.Now()
			if projectmodel.NewCanvasModel().Update(tx, map[string]any{
				"id":         row.ID,
				"project_id": projectID,
				"status":     projectmodel.CanvasStatusEnabled,
			}, map[string]any{
				"status":     projectmodel.CanvasStatusDeleted,
				"deleted_at": now,
				"updated_at": now,
			}) != 1 {
				return fmt.Errorf("删除画布失败")
			}
			for index, current := range remaining {
				if current.Sort == index+1 {
					continue
				}
				if projectmodel.NewCanvasModel().Update(tx, map[string]any{"id": current.ID}, map[string]any{
					"sort":       index + 1,
					"updated_at": now,
				}) != 1 {
					return fmt.Errorf("整理画布排序失败")
				}
			}
			return nil
		}); err != nil {
			return nil, err
		}
		return map[string]any{
			"active_canvas_id": remaining[0].ID,
			"canvas_list":      projectCanvasListPayload(projectCanvasRows(ctx, projectID, nil)),
		}, nil
	})
}

func (s WorkspaceService) RestoreCanvas(
	ctx context.Context,
	projectID uint64,
	req CanvasRestoreRequest,
) (map[string]any, error) {
	project, err := requireProject(ctx, projectID)
	if err != nil {
		return nil, err
	}
	if err = requireProjectMultiCanvasReady(ctx); err != nil {
		return nil, err
	}
	row := projectmodel.NewCanvasModel().Find(ctx, map[string]any{
		"id":         req.CanvasID,
		"project_id": project.ID,
		"status":     projectmodel.CanvasStatusDeleted,
	})
	if row == nil {
		return nil, fmt.Errorf("画布不在已删除列表")
	}
	assetCates, err := s.projectCanvasAssetCates(ctx, project)
	if err != nil {
		return nil, err
	}
	if !validCanvasAssetCate(assetCates, row.AssetCateID) {
		return nil, fmt.Errorf("原输出类型已不存在，无法恢复画布")
	}
	return withWorkspaceAssetLock(ctx, project.ID, []string{
		"canvas_restore",
		fmt.Sprintf("%d", row.AssetCateID),
	}, func() (map[string]any, error) {
		deleted := projectmodel.NewCanvasModel().Find(ctx, map[string]any{
			"id":            row.ID,
			"project_id":    project.ID,
			"asset_cate_id": row.AssetCateID,
			"status":        projectmodel.CanvasStatusDeleted,
		})
		if deleted == nil {
			return nil, fmt.Errorf("画布不在已删除列表")
		}
		activeRows := projectCanvasRows(ctx, project.ID, &deleted.AssetCateID)
		now := time.Now()
		if projectmodel.NewCanvasModel().Update(ctx, map[string]any{
			"id":         deleted.ID,
			"project_id": project.ID,
			"status":     projectmodel.CanvasStatusDeleted,
		}, map[string]any{
			"status":     projectmodel.CanvasStatusEnabled,
			"sort":       nextCanvasSort(activeRows),
			"deleted_at": nil,
			"updated_at": now,
		}) != 1 {
			return nil, fmt.Errorf("恢复画布失败")
		}
		restored, restoreErr := requireProjectCanvas(
			ctx,
			project.ID,
			deleted.ID,
			deleted.AssetCateID,
		)
		if restoreErr != nil {
			return nil, restoreErr
		}
		return map[string]any{
			"canvas":           canvasPayload(*restored),
			"canvas_list":      projectCanvasListPayload(projectCanvasRows(ctx, project.ID, nil)),
			"active_canvas_id": restored.ID,
		}, nil
	})
}

func validCanvasAssetCate(assetCates []teamservice.GraphAssetCate, assetCateID uint64) bool {
	if len(assetCates) == 0 {
		return assetCateID == 0
	}
	for _, assetCate := range assetCates {
		if assetCate.ID == assetCateID {
			return true
		}
	}
	return false
}

func createCanvasName(requested string, rows []*projectmodel.Canvas) (string, error) {
	if strings.TrimSpace(requested) != "" {
		return normalizeCanvasName(requested)
	}
	names := make(map[string]struct{}, len(rows))
	for _, row := range rows {
		if row != nil {
			names[strings.TrimSpace(row.Name)] = struct{}{}
		}
	}
	for position := len(rows) + 1; ; position++ {
		name := projectmodel.DefaultCanvasName(position)
		if _, exists := names[name]; !exists {
			return name, nil
		}
	}
}

func normalizeCanvasName(value string) (string, error) {
	name := strings.TrimSpace(value)
	if name == "" {
		return "", fmt.Errorf("画布名称不能为空")
	}
	if utf8.RuneCountInString(name) > maxCanvasNameRunes {
		return "", fmt.Errorf("画布名称不能超过%d个字符", maxCanvasNameRunes)
	}
	return name, nil
}

func nextCanvasSort(rows []*projectmodel.Canvas) int {
	next := 1
	for _, row := range rows {
		if row != nil && row.Sort >= next {
			next = row.Sort + 1
		}
	}
	return next
}

func validateCanvasOrder(rows []*projectmodel.Canvas, canvasIDs []uint64) error {
	if len(rows) == 0 || len(canvasIDs) != len(rows) {
		return fmt.Errorf("画布排序必须包含当前输出类型下的全部画布")
	}
	expected := make(map[uint64]struct{}, len(rows))
	for _, row := range rows {
		if row != nil {
			expected[row.ID] = struct{}{}
		}
	}
	seen := make(map[uint64]struct{}, len(canvasIDs))
	for _, canvasID := range canvasIDs {
		if _, exists := expected[canvasID]; !exists {
			return fmt.Errorf("画布排序包含无效画布")
		}
		if _, exists := seen[canvasID]; exists {
			return fmt.Errorf("画布排序包含重复画布")
		}
		seen[canvasID] = struct{}{}
	}
	return nil
}
