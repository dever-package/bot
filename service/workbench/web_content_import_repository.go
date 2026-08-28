package workbench

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/shemic/dever/orm"

	assetmodel "github.com/dever-package/bot/model/asset"
	"github.com/dever-package/bot/service/internal/dbop"
)

const webContentImportLeaseDuration = 45 * time.Second

type webContentImportRepository struct{}

type webContentImportCreate struct {
	Scope     externalAssetSaveScope
	RequestID string
	Platform  string
	Source    string
	Items     []webContentImportCreateItem
}

type webContentImportCreateItem struct {
	Platform  string
	SourceURL string
	DedupeKey string
}

type webContentImportSummary struct {
	Total        int
	Success      int
	Skipped      int
	Failed       int
	Finished     int
	ErrorMessage string
}

func (webContentImportRepository) create(
	ctx context.Context,
	input webContentImportCreate,
) (assetmodel.ImportTask, error) {
	if len(input.Items) == 0 {
		return assetmodel.ImportTask{}, fmt.Errorf("导入任务没有可执行明细")
	}
	now := time.Now()
	mode := assetmodel.ImportTaskModeSingle
	if len(input.Items) > 1 {
		mode = assetmodel.ImportTaskModeBatch
	}
	var taskID uint64
	err := orm.Transaction(ctx, func(tx context.Context) error {
		inserted, err := dbop.Insert(func() int64 {
			return assetmodel.NewImportTaskModel().Insert(tx, map[string]any{
				"user_id":          input.Scope.UserID,
				"team_id":          input.Scope.TeamID,
				"project_id":       input.Scope.ProjectID,
				"body_id":          input.Scope.BodyID,
				"release_id":       input.Scope.ReleaseID,
				"provider_id":      0,
				"account_id":       0,
				"request_id":       input.RequestID,
				"mode":             mode,
				"target_type":      assetmodel.ImportTargetContent,
				"platform":         input.Platform,
				"source":           input.Source,
				"options_json":     "{}",
				"cursor_json":      "{}",
				"status":           assetmodel.ImportTaskStatusPending,
				"stage":            "pending",
				"stage_message":    "等待导入",
				"progress":         0,
				"item_total":       len(input.Items),
				"success_count":    0,
				"skipped_count":    0,
				"failed_count":     0,
				"collection_id":    0,
				"error_message":    "",
				"worker_id":        "",
				"attempt":          0,
				"version":          1,
				"available_at":     now,
				"lease_expires_at": nil,
				"heartbeat_at":     nil,
				"started_at":       nil,
				"finished_at":      nil,
				"created_at":       now,
				"updated_at":       now,
			})
		})
		if err != nil {
			return err
		}
		taskID = uint64(inserted)
		if taskID == 0 {
			return fmt.Errorf("创建网页内容导入任务失败")
		}
		for _, current := range input.Items {
			itemID, err := dbop.Insert(func() int64 {
				return assetmodel.NewImportItemModel().Insert(tx, map[string]any{
					"task_id":          taskID,
					"platform":         current.Platform,
					"external_id":      "",
					"source_url":       current.SourceURL,
					"dedupe_key":       current.DedupeKey,
					"content_type":     "",
					"title":            "",
					"status":           assetmodel.ImportItemStatusPending,
					"stage":            "pending",
					"stage_message":    "等待解析",
					"progress":         0,
					"asset_id":         0,
					"result_json":      "{}",
					"warnings_json":    "[]",
					"error_message":    "",
					"worker_id":        "",
					"attempt":          0,
					"version":          1,
					"available_at":     now,
					"lease_expires_at": nil,
					"heartbeat_at":     nil,
					"started_at":       nil,
					"finished_at":      nil,
					"created_at":       now,
					"updated_at":       now,
				})
			})
			if err != nil || itemID == 0 {
				if err != nil {
					return err
				}
				return fmt.Errorf("创建网页内容导入明细失败")
			}
		}
		return nil
	})
	if err != nil {
		return assetmodel.ImportTask{}, err
	}
	task := assetmodel.NewImportTaskModel().Find(ctx, map[string]any{"id": taskID})
	if task == nil {
		return assetmodel.ImportTask{}, fmt.Errorf("读取网页内容导入任务失败")
	}
	return *task, nil
}

func (webContentImportRepository) findTask(ctx context.Context, id uint64) *assetmodel.ImportTask {
	if id == 0 {
		return nil
	}
	return assetmodel.NewImportTaskModel().Find(ctx, map[string]any{"id": id})
}

func (webContentImportRepository) findTaskByRequestID(
	ctx context.Context,
	requestID string,
) *assetmodel.ImportTask {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return nil
	}
	return assetmodel.NewImportTaskModel().Find(ctx, map[string]any{"request_id": requestID})
}

func (webContentImportRepository) findTaskInScope(
	ctx context.Context,
	id uint64,
	scope externalAssetSaveScope,
) *assetmodel.ImportTask {
	if id == 0 {
		return nil
	}
	filter := webContentImportScopeFilter(scope)
	filter["id"] = id
	return assetmodel.NewImportTaskModel().Find(ctx, filter)
}

func (webContentImportRepository) listActiveTasks(
	ctx context.Context,
	scope externalAssetSaveScope,
	limit int,
) []assetmodel.ImportTask {
	if limit < 1 {
		limit = 10
	}
	filter := webContentImportScopeFilter(scope)
	filter["status"] = []string{
		assetmodel.ImportTaskStatusPending,
		assetmodel.ImportTaskStatusDiscovering,
		assetmodel.ImportTaskStatusRunning,
	}
	rows := assetmodel.NewImportTaskModel().Select(ctx, filter, map[string]any{
		"order": "main.id desc",
		"limit": limit,
	})
	result := make([]assetmodel.ImportTask, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func webContentImportScopeFilter(scope externalAssetSaveScope) map[string]any {
	return map[string]any{
		"user_id":    scope.UserID,
		"team_id":    scope.TeamID,
		"project_id": scope.ProjectID,
		"body_id":    scope.BodyID,
	}
}

func (webContentImportRepository) listRunnableTasks(
	ctx context.Context,
	now time.Time,
	limit int,
) []assetmodel.ImportTask {
	if limit < 1 {
		return []assetmodel.ImportTask{}
	}
	rows := assetmodel.NewImportTaskModel().Select(ctx, map[string]any{
		"available_at": map[string]any{"lte": now},
		"or": []any{
			map[string]any{"status": assetmodel.ImportTaskStatusPending},
			map[string]any{"and": []any{
				map[string]any{"status": assetmodel.ImportTaskStatusRunning},
				map[string]any{"or": []any{
					map[string]any{"lease_expires_at": nil},
					map[string]any{"lease_expires_at": map[string]any{"lte": now}},
				}},
			}},
		},
	}, map[string]any{"order": "main.available_at asc,main.id asc", "limit": limit})
	result := make([]assetmodel.ImportTask, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (webContentImportRepository) claimTask(
	ctx context.Context,
	task assetmodel.ImportTask,
	workerID string,
	now time.Time,
) bool {
	workerID = strings.TrimSpace(workerID)
	if task.ID == 0 || workerID == "" || !assetmodel.IsImportTaskRunnable(task, now) {
		return false
	}
	filter := map[string]any{
		"id":           task.ID,
		"version":      task.Version,
		"available_at": map[string]any{"lte": now},
		"status":       task.Status,
	}
	if task.Status == assetmodel.ImportTaskStatusRunning {
		filter["or"] = []any{
			map[string]any{"lease_expires_at": nil},
			map[string]any{"lease_expires_at": map[string]any{"lte": now}},
		}
	}
	updates := map[string]any{
		"status":           assetmodel.ImportTaskStatusRunning,
		"stage":            "parsing",
		"stage_message":    "正在解析内容",
		"worker_id":        workerID,
		"attempt":          task.Attempt + 1,
		"version":          task.Version + 1,
		"heartbeat_at":     now,
		"lease_expires_at": now.Add(webContentImportLeaseDuration),
		"updated_at":       now,
	}
	if task.StartedAt == nil {
		updates["started_at"] = now
	}
	return assetmodel.NewImportTaskModel().Update(ctx, filter, updates) == 1
}

func (webContentImportRepository) renewTask(
	ctx context.Context,
	taskID uint64,
	workerID string,
	now time.Time,
) bool {
	return assetmodel.NewImportTaskModel().Update(ctx, map[string]any{
		"id":               taskID,
		"status":           assetmodel.ImportTaskStatusRunning,
		"worker_id":        strings.TrimSpace(workerID),
		"lease_expires_at": map[string]any{"gt": now},
	}, map[string]any{
		"heartbeat_at":     now,
		"lease_expires_at": now.Add(webContentImportLeaseDuration),
		"updated_at":       now,
	}) == 1
}

func (webContentImportRepository) listTaskItems(
	ctx context.Context,
	taskID uint64,
) []assetmodel.ImportItem {
	rows := assetmodel.NewImportItemModel().Select(ctx, map[string]any{"task_id": taskID}, map[string]any{
		"order": "main.id asc",
	})
	result := make([]assetmodel.ImportItem, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (webContentImportRepository) findItem(ctx context.Context, id uint64) *assetmodel.ImportItem {
	if id == 0 {
		return nil
	}
	return assetmodel.NewImportItemModel().Find(ctx, map[string]any{"id": id})
}

func (webContentImportRepository) claimItem(
	ctx context.Context,
	item assetmodel.ImportItem,
	workerID string,
	now time.Time,
) bool {
	workerID = strings.TrimSpace(workerID)
	if item.ID == 0 || workerID == "" || !assetmodel.IsImportItemRunnable(item, now) {
		return false
	}
	filter := map[string]any{
		"id":           item.ID,
		"task_id":      item.TaskID,
		"status":       item.Status,
		"version":      item.Version,
		"available_at": map[string]any{"lte": now},
	}
	if item.Status == assetmodel.ImportItemStatusRunning {
		filter["or"] = []any{
			map[string]any{"lease_expires_at": nil},
			map[string]any{"lease_expires_at": map[string]any{"lte": now}},
		}
	}
	updates := map[string]any{
		"status":           assetmodel.ImportItemStatusRunning,
		"stage":            "parsing",
		"stage_message":    "正在解析内容",
		"progress":         max(item.Progress, 3),
		"worker_id":        workerID,
		"attempt":          item.Attempt + 1,
		"version":          item.Version + 1,
		"heartbeat_at":     now,
		"lease_expires_at": now.Add(webContentImportLeaseDuration),
		"updated_at":       now,
	}
	if item.StartedAt == nil {
		updates["started_at"] = now
	}
	return assetmodel.NewImportItemModel().Update(ctx, filter, updates) == 1
}

func (webContentImportRepository) renewItem(
	ctx context.Context,
	itemID uint64,
	workerID string,
	now time.Time,
) bool {
	return assetmodel.NewImportItemModel().Update(ctx, map[string]any{
		"id":               itemID,
		"status":           assetmodel.ImportItemStatusRunning,
		"worker_id":        strings.TrimSpace(workerID),
		"lease_expires_at": map[string]any{"gt": now},
	}, map[string]any{
		"heartbeat_at":     now,
		"lease_expires_at": now.Add(webContentImportLeaseDuration),
		"updated_at":       now,
	}) == 1
}

func (webContentImportRepository) updateSelection(
	ctx context.Context,
	taskID uint64,
	workerID string,
	providerID uint64,
	accountID uint64,
) bool {
	return assetmodel.NewImportTaskModel().Update(ctx, map[string]any{
		"id":        taskID,
		"status":    assetmodel.ImportTaskStatusRunning,
		"worker_id": strings.TrimSpace(workerID),
	}, map[string]any{
		"provider_id": providerID,
		"account_id":  accountID,
		"updated_at":  time.Now(),
	}) == 1
}

func (webContentImportRepository) updateItemResolution(
	ctx context.Context,
	item assetmodel.ImportItem,
	workerID string,
	resolved resolvedWebContentImport,
) bool {
	model := assetmodel.NewImportItemModel()
	updates := map[string]any{
		"platform":     resolved.Platform,
		"external_id":  resolved.ExternalID,
		"source_url":   resolved.SourceURL,
		"content_type": resolved.ContentType,
		"title":        resolved.Title,
		"updated_at":   time.Now(),
	}
	duplicate := model.Find(ctx, map[string]any{
		"task_id":    item.TaskID,
		"dedupe_key": resolved.DedupeKey,
	})
	if duplicate == nil || duplicate.ID == item.ID {
		updates["dedupe_key"] = resolved.DedupeKey
	}
	return model.Update(ctx, map[string]any{
		"id":        item.ID,
		"status":    assetmodel.ImportItemStatusRunning,
		"worker_id": strings.TrimSpace(workerID),
	}, updates) == 1
}

func (webContentImportRepository) updateProgress(
	ctx context.Context,
	taskID uint64,
	itemID uint64,
	workerID string,
	stage string,
	message string,
	itemProgress int,
	taskProgress int,
) bool {
	now := time.Now()
	itemUpdated := assetmodel.NewImportItemModel().Update(ctx, map[string]any{
		"id":        itemID,
		"task_id":   taskID,
		"status":    assetmodel.ImportItemStatusRunning,
		"worker_id": strings.TrimSpace(workerID),
	}, map[string]any{
		"stage":         strings.TrimSpace(stage),
		"stage_message": strings.TrimSpace(message),
		"progress":      clampImportProgress(itemProgress),
		"updated_at":    now,
	}) == 1
	taskUpdated := assetmodel.NewImportTaskModel().Update(ctx, map[string]any{
		"id":        taskID,
		"status":    assetmodel.ImportTaskStatusRunning,
		"worker_id": strings.TrimSpace(workerID),
	}, map[string]any{
		"stage":         strings.TrimSpace(stage),
		"stage_message": strings.TrimSpace(message),
		"progress":      clampImportProgress(taskProgress),
		"updated_at":    now,
	}) == 1
	return itemUpdated && taskUpdated
}

func (webContentImportRepository) finishItem(
	ctx context.Context,
	item assetmodel.ImportItem,
	workerID string,
	status string,
	assetID uint64,
	resultJSON string,
	warningsJSON string,
	errorMessage string,
) bool {
	now := time.Now()
	return assetmodel.NewImportItemModel().Update(ctx, map[string]any{
		"id":        item.ID,
		"task_id":   item.TaskID,
		"status":    assetmodel.ImportItemStatusRunning,
		"worker_id": strings.TrimSpace(workerID),
	}, map[string]any{
		"status":           status,
		"stage":            importItemTerminalStage(status),
		"stage_message":    importItemTerminalMessage(status),
		"progress":         100,
		"asset_id":         assetID,
		"result_json":      resultJSON,
		"warnings_json":    warningsJSON,
		"error_message":    strings.TrimSpace(errorMessage),
		"worker_id":        "",
		"lease_expires_at": nil,
		"heartbeat_at":     nil,
		"finished_at":      now,
		"updated_at":       now,
	}) == 1
}

func (webContentImportRepository) summarizeItems(
	ctx context.Context,
	taskID uint64,
) webContentImportSummary {
	items := webContentImportRepository{}.listTaskItems(ctx, taskID)
	summary := webContentImportSummary{Total: len(items)}
	for _, item := range items {
		switch item.Status {
		case assetmodel.ImportItemStatusSuccess:
			summary.Success++
			summary.Finished++
		case assetmodel.ImportItemStatusSkipped:
			summary.Skipped++
			summary.Finished++
		case assetmodel.ImportItemStatusFailed:
			summary.Failed++
			summary.Finished++
			if summary.ErrorMessage == "" {
				summary.ErrorMessage = strings.TrimSpace(item.ErrorMessage)
			}
		}
	}
	return summary
}

func (webContentImportRepository) finishTask(
	ctx context.Context,
	taskID uint64,
	workerID string,
	summary webContentImportSummary,
) bool {
	status := assetmodel.ImportTaskStatusSuccess
	stage := "completed"
	stageMessage := "导入完成"
	if summary.Failed > 0 && summary.Success+summary.Skipped > 0 {
		status = assetmodel.ImportTaskStatusPartial
		stageMessage = "部分内容导入失败"
	} else if summary.Failed > 0 || summary.Total == 0 {
		status = assetmodel.ImportTaskStatusFailed
		stage = "failed"
		stageMessage = "导入失败"
	}
	now := time.Now()
	return assetmodel.NewImportTaskModel().Update(ctx, map[string]any{
		"id":        taskID,
		"status":    assetmodel.ImportTaskStatusRunning,
		"worker_id": strings.TrimSpace(workerID),
	}, map[string]any{
		"status":           status,
		"stage":            stage,
		"stage_message":    stageMessage,
		"progress":         100,
		"item_total":       summary.Total,
		"success_count":    summary.Success,
		"skipped_count":    summary.Skipped,
		"failed_count":     summary.Failed,
		"error_message":    summary.ErrorMessage,
		"worker_id":        "",
		"lease_expires_at": nil,
		"heartbeat_at":     nil,
		"finished_at":      now,
		"updated_at":       now,
	}) == 1
}

func (webContentImportRepository) releaseTask(
	ctx context.Context,
	taskID uint64,
	workerID string,
) bool {
	now := time.Now()
	return assetmodel.NewImportTaskModel().Update(ctx, map[string]any{
		"id":        taskID,
		"status":    assetmodel.ImportTaskStatusRunning,
		"worker_id": strings.TrimSpace(workerID),
	}, map[string]any{
		"status":           assetmodel.ImportTaskStatusPending,
		"stage":            "pending",
		"stage_message":    "等待继续导入",
		"worker_id":        "",
		"available_at":     now.Add(time.Second),
		"lease_expires_at": nil,
		"heartbeat_at":     nil,
		"updated_at":       now,
	}) == 1
}

func clampImportProgress(progress int) int {
	if progress < 0 {
		return 0
	}
	if progress > 100 {
		return 100
	}
	return progress
}

func importItemTerminalStage(status string) string {
	if status == assetmodel.ImportItemStatusFailed {
		return "failed"
	}
	return "completed"
}

func importItemTerminalMessage(status string) string {
	switch status {
	case assetmodel.ImportItemStatusSkipped:
		return "内容已存在"
	case assetmodel.ImportItemStatusFailed:
		return "导入失败"
	default:
		return "导入完成"
	}
}
