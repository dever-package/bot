package maintenance

import (
	"context"
	"fmt"
	"sort"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	assetmodel "github.com/dever-package/bot/model/asset"
	memorymodel "github.com/dever-package/bot/model/memory"
	projectmodel "github.com/dever-package/bot/model/project"
	workspacemodel "github.com/dever-package/bot/model/workspace"
)

const multiCanvasMigrationBatchSize = 500

type projectCanvasScopeKey struct {
	ProjectID   uint64
	AssetCateID uint64
}

type projectCanvasScopes struct {
	byScope        map[projectCanvasScopeKey]uint64
	firstByProject map[uint64]uint64
}

// MigrateProjectMultiCanvas assigns the formerly unique project/category
// canvas to durable records whose ownership can be determined unambiguously.
func MigrateProjectMultiCanvas(ctx context.Context) (err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("迁移项目多画布数据失败: %v", recovered)
		}
	}()

	ctx = normalizeContext(ctx)
	// Import tasks intentionally stay unassigned, but loading the model ensures
	// its new canvas_id column is ready before new tasks can be accepted.
	_ = assetmodel.NewImportTaskModel()
	if err = normalizeHistoricalCanvases(ctx); err != nil {
		return err
	}
	scopes := loadProjectCanvasScopes(ctx)
	if err = migrateAssetCanvasScopes(ctx, scopes); err != nil {
		return err
	}
	if err = migrateExecutionCanvasScopes(ctx, scopes); err != nil {
		return err
	}
	if err = migrateNodeExecutionCanvasScopes(ctx, scopes); err != nil {
		return err
	}
	if err = migrateAgentMemoryCanvasScopes(ctx, scopes); err != nil {
		return err
	}
	return migrateProjectAssistantContexts(ctx, scopes.firstByProject)
}

func normalizeHistoricalCanvases(ctx context.Context) error {
	rows := projectmodel.NewCanvasModel().Select(ctx, nil, map[string]any{
		"order": "main.project_id asc,main.asset_cate_id asc,main.sort asc,main.id asc",
	})
	positions := make(map[projectCanvasScopeKey]int)
	for _, row := range rows {
		if row == nil {
			continue
		}
		key := projectCanvasScopeKey{ProjectID: row.ProjectID, AssetCateID: row.AssetCateID}
		positions[key]++
		changes := map[string]any{}
		if strings.TrimSpace(row.Name) == "" {
			changes["name"] = projectmodel.DefaultCanvasName(positions[key])
		}
		if row.Sort <= 0 {
			changes["sort"] = positions[key]
		}
		if row.Status == 0 {
			changes["status"] = projectmodel.CanvasStatusEnabled
		}
		if len(changes) == 0 {
			continue
		}
		changes["updated_at"] = time.Now()
		if projectmodel.NewCanvasModel().Update(ctx, map[string]any{"id": row.ID}, changes) != 1 {
			return fmt.Errorf("更新历史画布 %d 失败", row.ID)
		}
	}
	return nil
}

func loadProjectCanvasScopes(ctx context.Context) projectCanvasScopes {
	rows := projectmodel.NewCanvasModel().Select(ctx, map[string]any{
		"status": projectmodel.CanvasStatusEnabled,
	}, map[string]any{
		"order": "main.project_id asc,main.created_at asc,main.sort asc,main.id asc",
	})
	result := projectCanvasScopes{
		byScope:        make(map[projectCanvasScopeKey]uint64),
		firstByProject: make(map[uint64]uint64),
	}
	ambiguous := make(map[projectCanvasScopeKey]bool)
	for _, row := range rows {
		if row == nil || row.ProjectID == 0 {
			continue
		}
		if result.firstByProject[row.ProjectID] == 0 {
			result.firstByProject[row.ProjectID] = row.ID
		}
		key := projectCanvasScopeKey{ProjectID: row.ProjectID, AssetCateID: row.AssetCateID}
		if result.byScope[key] > 0 {
			ambiguous[key] = true
			continue
		}
		result.byScope[key] = row.ID
	}
	for key := range ambiguous {
		delete(result.byScope, key)
	}
	return result
}

func migrateAssetCanvasScopes(ctx context.Context, scopes projectCanvasScopes) error {
	model := assetmodel.NewAssetModel()
	return migrateCanvasScopedRecords(
		"资产",
		func(cursor uint64) []*assetmodel.Asset {
			return model.Select(ctx, map[string]any{
				"id":         map[string]any{"gt": cursor},
				"project_id": map[string]any{"gt": 0},
				"canvas_id":  uint64(0),
			}, migrationPageOptions())
		},
		func(row *assetmodel.Asset) (uint64, uint64, uint64) {
			return row.ID, row.ProjectID, row.AssetCateID
		},
		func(id uint64, canvasID uint64) int64 {
			return model.Update(ctx, map[string]any{"id": id, "canvas_id": uint64(0)}, map[string]any{"canvas_id": canvasID})
		},
		scopes.byScope,
	)
}

func migrateExecutionCanvasScopes(ctx context.Context, scopes projectCanvasScopes) error {
	model := workspacemodel.NewExecutionModel()
	return migrateCanvasScopedRecords(
		"画布执行",
		func(cursor uint64) []*workspacemodel.Execution {
			return model.Select(ctx, map[string]any{
				"id":         map[string]any{"gt": cursor},
				"project_id": map[string]any{"gt": 0},
				"canvas_id":  uint64(0),
			}, migrationPageOptions())
		},
		func(row *workspacemodel.Execution) (uint64, uint64, uint64) {
			return row.ID, row.ProjectID, row.AssetCateID
		},
		func(id uint64, canvasID uint64) int64 {
			return model.Update(ctx, map[string]any{"id": id, "canvas_id": uint64(0)}, map[string]any{"canvas_id": canvasID})
		},
		scopes.byScope,
	)
}

func migrateAgentMemoryCanvasScopes(ctx context.Context, scopes projectCanvasScopes) error {
	model := workspacemodel.NewAgentMemoryModel()
	return migrateCanvasScopedRecords(
		"画布智能体记忆",
		func(cursor uint64) []*workspacemodel.AgentMemory {
			return model.Select(ctx, map[string]any{
				"id":         map[string]any{"gt": cursor},
				"project_id": map[string]any{"gt": 0},
				"canvas_id":  uint64(0),
			}, migrationPageOptions())
		},
		func(row *workspacemodel.AgentMemory) (uint64, uint64, uint64) {
			return row.ID, row.ProjectID, row.AssetCateID
		},
		func(id uint64, canvasID uint64) int64 {
			return model.Update(ctx, map[string]any{"id": id, "canvas_id": uint64(0)}, map[string]any{"canvas_id": canvasID})
		},
		scopes.byScope,
	)
}

func migrateCanvasScopedRecords[T any](
	label string,
	load func(cursor uint64) []*T,
	scope func(row *T) (id uint64, projectID uint64, assetCateID uint64),
	update func(id uint64, canvasID uint64) int64,
	canvasByScope map[projectCanvasScopeKey]uint64,
) error {
	cursor := uint64(0)
	for {
		rows := load(cursor)
		if len(rows) == 0 {
			return nil
		}
		for _, row := range rows {
			if row == nil {
				continue
			}
			id, projectID, assetCateID := scope(row)
			if id > cursor {
				cursor = id
			}
			canvasID := canvasByScope[projectCanvasScopeKey{ProjectID: projectID, AssetCateID: assetCateID}]
			if canvasID == 0 {
				continue
			}
			if update(id, canvasID) != 1 {
				return fmt.Errorf("回填%s %d 的画布失败", label, id)
			}
		}
		if len(rows) < multiCanvasMigrationBatchSize {
			return nil
		}
	}
}

func migrateNodeExecutionCanvasScopes(ctx context.Context, scopes projectCanvasScopes) error {
	nodeModel := workspacemodel.NewNodeExecutionModel()
	executionModel := workspacemodel.NewExecutionModel()
	cursor := uint64(0)
	for {
		rows := nodeModel.Select(ctx, map[string]any{
			"id":         map[string]any{"gt": cursor},
			"project_id": map[string]any{"gt": 0},
			"canvas_id":  uint64(0),
		}, migrationPageOptions())
		if len(rows) == 0 {
			return nil
		}
		executionIDs := make([]uint64, 0, len(rows))
		for _, row := range rows {
			if row != nil && row.ExecutionID > 0 {
				executionIDs = append(executionIDs, row.ExecutionID)
			}
		}
		executionCanvasIDs := make(map[uint64]uint64, len(executionIDs))
		if len(executionIDs) > 0 {
			for _, execution := range executionModel.Select(ctx, map[string]any{"id": uniqueUint64s(executionIDs)}) {
				if execution != nil && execution.CanvasID > 0 {
					executionCanvasIDs[execution.ID] = execution.CanvasID
				}
			}
		}
		for _, row := range rows {
			if row == nil {
				continue
			}
			if row.ID > cursor {
				cursor = row.ID
			}
			canvasID := executionCanvasIDs[row.ExecutionID]
			if canvasID == 0 {
				canvasID = scopes.byScope[projectCanvasScopeKey{ProjectID: row.ProjectID, AssetCateID: row.AssetCateID}]
			}
			if canvasID == 0 {
				continue
			}
			if nodeModel.Update(ctx, map[string]any{"id": row.ID, "canvas_id": uint64(0)}, map[string]any{"canvas_id": canvasID}) != 1 {
				return fmt.Errorf("回填画布节点执行 %d 的画布失败", row.ID)
			}
		}
		if len(rows) < multiCanvasMigrationBatchSize {
			return nil
		}
	}
}

func migrateProjectAssistantContexts(ctx context.Context, firstCanvasByProject map[uint64]uint64) error {
	projectIDs := make([]uint64, 0, len(firstCanvasByProject))
	for projectID := range firstCanvasByProject {
		projectIDs = append(projectIDs, projectID)
	}
	sort.Slice(projectIDs, func(left int, right int) bool { return projectIDs[left] < projectIDs[right] })
	sessionModel := agentmodel.NewSessionModel()
	memoryModel := memorymodel.NewMemoryModel()
	for _, projectID := range projectIDs {
		canvasID := firstCanvasByProject[projectID]
		rows := sessionModel.Select(ctx, map[string]any{"project_id": projectID})
		for _, row := range rows {
			if row == nil {
				continue
			}
			oldPrefix := fmt.Sprintf("project-canvas:%d:team:", projectID)
			contextKey := strings.TrimSpace(row.ContextKey)
			if !strings.HasPrefix(contextKey, oldPrefix) || strings.Contains(contextKey, ":canvas:") {
				continue
			}
			newContextKey := fmt.Sprintf(
				"project-canvas:%d:canvas:%d:team:%s",
				projectID,
				canvasID,
				strings.TrimPrefix(contextKey, oldPrefix),
			)
			if sessionModel.Update(ctx, map[string]any{
				"id":          row.ID,
				"context_key": contextKey,
			}, map[string]any{"context_key": newContextKey}) != 1 {
				return fmt.Errorf("迁移项目画布助手会话 %d 失败", row.ID)
			}
			memoryModel.Update(ctx, map[string]any{
				"project_id":  projectID,
				"context_key": contextKey,
			}, map[string]any{"context_key": newContextKey})
		}
	}
	return nil
}

func migrationPageOptions() map[string]any {
	return map[string]any{
		"order":    "main.id asc",
		"pageSize": multiCanvasMigrationBatchSize,
	}
}

func uniqueUint64s(values []uint64) []uint64 {
	result := make([]uint64, 0, len(values))
	seen := make(map[uint64]struct{}, len(values))
	for _, value := range values {
		if value == 0 {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
}
