package workbench

import (
	"context"
	"encoding/json"
	"fmt"
	"regexp"
	"strings"
	"unicode/utf8"

	"github.com/google/uuid"

	assetmodel "github.com/dever-package/bot/model/asset"
	botwebcontent "github.com/dever-package/bot/service/energon/webcontent"
	frontwebcontent "github.com/dever-package/front/service/webcontent"
)

const (
	webContentImportSourceLimit = 8192
	webContentImportItemLimit   = 10
)

var webContentImportRequestIDPattern = regexp.MustCompile(`^[A-Za-z0-9._:-]{1,64}$`)

type WebContentImportRequest struct {
	TeamID    uint64
	ProjectID uint64
	RequestID string
	Source    string
}

type WebContentImportTaskRequest struct {
	TeamID    uint64
	ProjectID uint64
	TaskID    uint64
}

func (s Service) ImportWebContent(ctx context.Context, request WebContentImportRequest) (map[string]any, error) {
	source, requestID, err := normalizeWebContentImportRequest(request.Source, request.RequestID)
	if err != nil {
		return nil, err
	}
	scope, err := s.resolveExternalAssetSaveScope(ctx, request.TeamID, request.ProjectID)
	if err != nil {
		return nil, err
	}
	repository := webContentImportRepository{}
	if existing := repository.findTaskByRequestID(ctx, requestID); existing != nil {
		if err := requireMatchingWebContentImport(*existing, scope, source); err != nil {
			return nil, err
		}
		if !assetmodel.IsImportTaskTerminal(existing.Status) {
			dispatchWebContentImport(existing.ID)
		}
		return s.webContentImportTaskPayload(ctx, *existing), nil
	}
	platform, items, err := prepareWebContentImportItems(ctx, source)
	if err != nil {
		return nil, err
	}
	task, err := repository.create(ctx, webContentImportCreate{
		Scope:     scope,
		RequestID: requestID,
		Platform:  platform,
		Source:    source,
		Items:     items,
	})
	if err != nil {
		if existing := repository.findTaskByRequestID(ctx, requestID); existing != nil {
			if matchErr := requireMatchingWebContentImport(*existing, scope, source); matchErr != nil {
				return nil, matchErr
			}
			dispatchWebContentImport(existing.ID)
			return s.webContentImportTaskPayload(ctx, *existing), nil
		}
		return nil, err
	}
	dispatchWebContentImport(task.ID)
	return s.webContentImportTaskPayload(ctx, task), nil
}

func prepareWebContentImportItems(
	ctx context.Context,
	source string,
) (string, []webContentImportCreateItem, error) {
	detected, err := frontwebcontent.DetectSources(source)
	if err != nil {
		return "", nil, err
	}
	available := webContentImportAvailablePlatforms(ctx)
	items := make([]webContentImportCreateItem, 0, len(detected))
	seenDedupeKeys := make(map[string]struct{}, len(detected))
	platform := ""
	for _, current := range detected {
		dedupeKey := assetmodel.BuildImportDedupeKey(current.Platform, "", current.URL)
		if _, exists := seenDedupeKeys[dedupeKey]; exists {
			continue
		}
		if len(items) >= webContentImportItemLimit {
			return "", nil, fmt.Errorf("一次最多导入%d条内容", webContentImportItemLimit)
		}
		spec, ok := botwebcontent.FindPlatform(current.Platform)
		if !ok {
			return "", nil, fmt.Errorf("暂不支持该内容平台")
		}
		if !available[current.Platform] {
			return "", nil, fmt.Errorf("请先配置并启用%s来源", spec.Name)
		}
		items = append(items, webContentImportCreateItem{
			Platform:  current.Platform,
			SourceURL: current.URL,
			DedupeKey: dedupeKey,
		})
		seenDedupeKeys[dedupeKey] = struct{}{}
		if platform == "" {
			platform = current.Platform
		} else if platform != current.Platform {
			platform = assetmodel.ImportTaskPlatformMixed
		}
	}
	if len(items) == 0 {
		return "", nil, fmt.Errorf("未找到可导入的内容链接")
	}
	return platform, items, nil
}

func (s Service) WebContentImportTask(
	ctx context.Context,
	request WebContentImportTaskRequest,
) (map[string]any, error) {
	if request.TaskID == 0 {
		return nil, fmt.Errorf("导入任务不能为空")
	}
	scope, err := s.resolveExternalAssetSaveScope(ctx, request.TeamID, request.ProjectID)
	if err != nil {
		return nil, err
	}
	task := webContentImportRepository{}.findTaskInScope(ctx, request.TaskID, scope)
	if task == nil {
		return nil, fmt.Errorf("导入任务不存在")
	}
	if !assetmodel.IsImportTaskTerminal(task.Status) {
		dispatchWebContentImport(task.ID)
	}
	return s.webContentImportTaskPayload(ctx, *task), nil
}

func (s Service) ActiveWebContentImports(
	ctx context.Context,
	teamID uint64,
	projectID uint64,
) (map[string]any, error) {
	scope, err := s.resolveExternalAssetSaveScope(ctx, teamID, projectID)
	if err != nil {
		return nil, err
	}
	tasks := webContentImportRepository{}.listActiveTasks(ctx, scope, 10)
	items := make([]map[string]any, 0, len(tasks))
	for _, task := range tasks {
		dispatchWebContentImport(task.ID)
		items = append(items, s.webContentImportTaskPayload(ctx, task))
	}
	return map[string]any{"items": items}, nil
}

func normalizeWebContentImportRequest(source string, requestID string) (string, string, error) {
	source = strings.TrimSpace(source)
	if source == "" {
		return "", "", fmt.Errorf("链接或分享内容不能为空")
	}
	if utf8.RuneCountInString(source) > webContentImportSourceLimit {
		return "", "", fmt.Errorf("链接或分享内容不能超过%d个字符", webContentImportSourceLimit)
	}
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		requestID = uuid.NewString()
	}
	if !webContentImportRequestIDPattern.MatchString(requestID) {
		return "", "", fmt.Errorf("导入请求标识格式无效")
	}
	return source, requestID, nil
}

func requireMatchingWebContentImport(
	task assetmodel.ImportTask,
	scope externalAssetSaveScope,
	source string,
) error {
	if task.UserID != scope.UserID || task.TeamID != scope.TeamID ||
		task.ProjectID != scope.ProjectID || task.BodyID != scope.BodyID {
		return fmt.Errorf("导入请求标识已被其他范围使用")
	}
	if strings.TrimSpace(task.Source) != strings.TrimSpace(source) {
		return fmt.Errorf("导入请求标识对应的内容不一致")
	}
	return nil
}

func (s Service) webContentImportTaskPayload(
	ctx context.Context,
	task assetmodel.ImportTask,
) map[string]any {
	rows := webContentImportRepository{}.listTaskItems(ctx, task.ID)
	items := make([]map[string]any, 0, len(rows))
	assetPayloads := make([]map[string]any, 0, len(rows))
	assetIDs := make(map[uint64]struct{}, len(rows))
	warnings := []string{}
	for _, item := range rows {
		items = append(items, webContentImportItemPayload(item))
		warnings = appendDistinctImportWarnings(warnings, decodeImportWarnings(item.WarningsJSON))
		if item.AssetID == 0 {
			continue
		}
		if _, exists := assetIDs[item.AssetID]; exists {
			continue
		}
		asset := s.asset.Find(ctx, item.AssetID)
		if webContentImportAssetMatchesTask(asset, task) {
			assetIDs[item.AssetID] = struct{}{}
			assetPayloads = append(assetPayloads, s.asset.AssetDetailMap(ctx, *asset, nil))
		}
	}
	return map[string]any{
		"id":            task.ID,
		"request_id":    task.RequestID,
		"mode":          task.Mode,
		"target_type":   task.TargetType,
		"platform":      task.Platform,
		"source":        task.Source,
		"provider_id":   task.ProviderID,
		"account_id":    task.AccountID,
		"status":        task.Status,
		"stage":         task.Stage,
		"stage_message": task.StageMessage,
		"progress":      clampImportProgress(task.Progress),
		"item_total":    task.ItemTotal,
		"success_count": task.SuccessCount,
		"skipped_count": task.SkippedCount,
		"failed_count":  task.FailedCount,
		"collection_id": task.CollectionID,
		"error_message": task.ErrorMessage,
		"items":         items,
		"assets":        assetPayloads,
		"warnings":      warnings,
		"created_at":    task.CreatedAt,
		"updated_at":    task.UpdatedAt,
		"started_at":    task.StartedAt,
		"finished_at":   task.FinishedAt,
	}
}

func webContentImportItemPayload(item assetmodel.ImportItem) map[string]any {
	return map[string]any{
		"id":            item.ID,
		"task_id":       item.TaskID,
		"platform":      item.Platform,
		"external_id":   item.ExternalID,
		"source_url":    item.SourceURL,
		"content_type":  item.ContentType,
		"title":         item.Title,
		"status":        item.Status,
		"stage":         item.Stage,
		"stage_message": item.StageMessage,
		"progress":      clampImportProgress(item.Progress),
		"asset_id":      item.AssetID,
		"error_message": item.ErrorMessage,
		"warnings":      decodeImportWarnings(item.WarningsJSON),
		"created_at":    item.CreatedAt,
		"updated_at":    item.UpdatedAt,
		"started_at":    item.StartedAt,
		"finished_at":   item.FinishedAt,
	}
}

func webContentImportAssetMatchesTask(asset *assetmodel.Asset, task assetmodel.ImportTask) bool {
	return asset != nil && asset.UserID == task.UserID && asset.TeamID == task.TeamID &&
		asset.ProjectID == task.ProjectID && asset.BodyID == task.BodyID &&
		asset.SourceType == assetmodel.SourceImport
}

func encodeImportJSON(value any, fallback string) string {
	encoded, err := json.Marshal(value)
	if err != nil {
		return fallback
	}
	return string(encoded)
}

func decodeImportWarnings(value string) []string {
	var result []string
	if json.Unmarshal([]byte(strings.TrimSpace(value)), &result) != nil || result == nil {
		return []string{}
	}
	return result
}

func appendDistinctImportWarnings(current []string, values []string) []string {
	seen := make(map[string]struct{}, len(current)+len(values))
	for _, value := range current {
		seen[value] = struct{}{}
	}
	for _, value := range values {
		value = strings.TrimSpace(value)
		if value == "" {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		current = append(current, value)
	}
	return current
}
