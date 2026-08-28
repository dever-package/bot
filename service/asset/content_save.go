package asset

import (
	"context"
	"fmt"
	"strings"
	"time"

	assetmodel "github.com/dever-package/bot/model/asset"
)

const (
	ContentSaveOverwriteCurrent = "overwrite_current"
	ContentSaveCreateVersion    = "create_version"
)

type SaveContentRequest struct {
	AssetID           uint64
	ExpectedVersionID uint64
	ExpectedUpdatedAt string
	RequestID         string
	SaveMode          string
	Content           any
}

func NormalizeContentSaveMode(value string) (string, error) {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case ContentSaveOverwriteCurrent:
		return ContentSaveOverwriteCurrent, nil
	case ContentSaveCreateVersion:
		return ContentSaveCreateVersion, nil
	default:
		return "", fmt.Errorf("资产正文保存方式无效")
	}
}

func IsEditableTextKind(kind string) bool {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case assetmodel.KindText, assetmodel.KindRichText:
		return true
	default:
		return false
	}
}

func (s Service) SaveTeamContent(
	ctx context.Context,
	teamID uint64,
	req SaveContentRequest,
) (*assetmodel.Asset, *assetmodel.Version, error) {
	asset, err := s.requireTeamAsset(ctx, teamID, req.AssetID)
	if err != nil {
		return nil, nil, err
	}
	return s.saveContent(ctx, *asset, req)
}

func (s Service) SaveProjectContent(
	ctx context.Context,
	projectID uint64,
	req SaveContentRequest,
) (*assetmodel.Asset, *assetmodel.Version, error) {
	asset := s.FindProjectAsset(ctx, projectID, req.AssetID)
	if asset == nil {
		return nil, nil, fmt.Errorf("资产不存在")
	}
	return s.saveContent(ctx, *asset, req)
}

func (s Service) saveContent(
	ctx context.Context,
	asset assetmodel.Asset,
	req SaveContentRequest,
) (*assetmodel.Asset, *assetmodel.Version, error) {
	mode, err := NormalizeContentSaveMode(req.SaveMode)
	if err != nil {
		return nil, nil, err
	}
	if !IsEditableTextKind(asset.Kind) {
		return nil, nil, fmt.Errorf("当前资产类型不支持编辑正文")
	}
	if req.ExpectedVersionID == 0 || strings.TrimSpace(req.ExpectedUpdatedAt) == "" {
		return nil, nil, fmt.Errorf("缺少资产版本并发基线")
	}
	if mode == ContentSaveCreateVersion && strings.TrimSpace(req.RequestID) == "" {
		return nil, nil, fmt.Errorf("保存新版本缺少请求标识")
	}
	if !HasContent(req.Content) {
		return nil, nil, fmt.Errorf("资产内容不能为空")
	}

	lockRequest := saveContentVersionRequest(asset, req, nil, 0)
	result, err := withAssetSaveLock(ctx, lockRequest, func() (saveVersionResult, error) {
		currentAsset, currentVersion, alreadySaved, err := s.currentContentVersion(ctx, asset, req, mode)
		if err != nil {
			return saveVersionResult{}, err
		}
		if alreadySaved {
			return saveVersionResult{Asset: currentAsset, Version: currentVersion}, nil
		}
		if mode == ContentSaveOverwriteCurrent {
			updatedAsset, updatedVersion, err := s.overwriteCurrentContent(
				ctx,
				*currentAsset,
				*currentVersion,
				req.Content,
			)
			return saveVersionResult{Asset: updatedAsset, Version: updatedVersion}, err
		}

		source := contentRevisionSource(currentVersion.Source, currentVersion.ID)
		versionRequest := saveContentVersionRequest(
			*currentAsset,
			req,
			source,
			currentVersion.ReleaseID,
		)
		normalized, err := normalizeSaveVersionRequest(ctx, versionRequest)
		if err != nil {
			return saveVersionResult{}, err
		}
		createdAsset, createdVersion, err := saveVersion(ctx, normalized)
		return saveVersionResult{Asset: createdAsset, Version: createdVersion}, err
	})
	return result.Asset, result.Version, err
}

func (s Service) currentContentVersion(
	ctx context.Context,
	expectedAsset assetmodel.Asset,
	req SaveContentRequest,
	mode string,
) (*assetmodel.Asset, *assetmodel.Version, bool, error) {
	asset := s.Find(ctx, expectedAsset.ID)
	if !sameAssetScope(asset, expectedAsset) {
		return nil, nil, false, fmt.Errorf("资产不存在或权限范围已变化")
	}
	if err := ensureAssetMutable(asset); err != nil {
		return nil, nil, false, err
	}
	if !IsEditableTextKind(asset.Kind) {
		return nil, nil, false, fmt.Errorf("当前资产类型不支持编辑正文")
	}

	if mode == ContentSaveCreateVersion {
		if saved := findSavedVersion(ctx, asset.ID, req.RequestID, asset.NodeKey); saved != nil {
			current := s.FindVersion(ctx, asset.VersionID)
			if current == nil || current.AssetID != asset.ID {
				return nil, nil, false, fmt.Errorf("资产当前版本不存在")
			}
			return asset, current, true, nil
		}
	}
	if asset.VersionID != req.ExpectedVersionID {
		return nil, nil, false, fmt.Errorf("资产正文已被更新，请刷新后重试")
	}
	version := s.FindVersion(ctx, asset.VersionID)
	if version == nil || version.AssetID != asset.ID {
		return nil, nil, false, fmt.Errorf("资产当前版本不存在")
	}
	if hasSpecializedTextDocument(jsonValue(version.Content), 0) {
		return nil, nil, false, fmt.Errorf("当前结构化内容需要使用专用编辑器")
	}
	if !versionUpdatedAtMatches(*version, req.ExpectedUpdatedAt) {
		return nil, nil, false, fmt.Errorf("资产正文已被更新，请刷新后重试")
	}
	return asset, version, false, nil
}

func (s Service) overwriteCurrentContent(
	ctx context.Context,
	asset assetmodel.Asset,
	version assetmodel.Version,
	content any,
) (*assetmodel.Asset, *assetmodel.Version, error) {
	document := EnsureDocument(content, asset.Kind)
	if !HasContent(document) {
		return nil, nil, fmt.Errorf("资产内容不能为空")
	}
	now := time.Now()
	affected := assetmodel.NewVersionModel().Update(ctx, map[string]any{
		"id":       version.ID,
		"asset_id": asset.ID,
	}, map[string]any{
		"content":    jsonText(document),
		"updated_at": now,
	})
	if affected == 0 {
		return nil, nil, fmt.Errorf("保存资产正文失败")
	}
	updatedAsset := s.Find(ctx, asset.ID)
	updatedVersion := s.FindVersion(ctx, version.ID)
	if updatedAsset == nil || updatedVersion == nil {
		return nil, nil, fmt.Errorf("读取资产版本失败")
	}
	return updatedAsset, updatedVersion, nil
}

func saveContentVersionRequest(
	asset assetmodel.Asset,
	req SaveContentRequest,
	source map[string]any,
	releaseID uint64,
) SaveVersionRequest {
	return SaveVersionRequest{
		AssetID:      asset.ID,
		UserID:       asset.UserID,
		ProjectID:    asset.ProjectID,
		CanvasID:     asset.CanvasID,
		BodyID:       asset.BodyID,
		TeamID:       asset.TeamID,
		FlowID:       asset.FlowID,
		AssetCateID:  asset.AssetCateID,
		CollectionID: asset.CollectionID,
		ReleaseID:    releaseID,
		RequestID:    strings.TrimSpace(req.RequestID),
		NodeKey:      asset.NodeKey,
		SourceType:   asset.SourceType,
		SourceID:     asset.SourceID,
		SourceName:   asset.SourceName,
		Source:       source,
		Name:         asset.Name,
		Kind:         asset.Kind,
		Role:         NormalizeRole(asset.Role),
		Content:      req.Content,
		Sort:         asset.Sort,
	}
}

func sameAssetScope(current *assetmodel.Asset, expected assetmodel.Asset) bool {
	return current != nil &&
		current.ID == expected.ID &&
		current.UserID == expected.UserID &&
		current.TeamID == expected.TeamID &&
		current.ProjectID == expected.ProjectID &&
		current.CanvasID == expected.CanvasID &&
		current.BodyID == expected.BodyID
}

func versionUpdatedAtMatches(version assetmodel.Version, expected string) bool {
	expectedTime, err := time.Parse(time.RFC3339Nano, strings.TrimSpace(expected))
	if err != nil {
		return false
	}
	updatedAt := version.CreatedAt
	if version.UpdatedAt != nil && !version.UpdatedAt.IsZero() {
		updatedAt = *version.UpdatedAt
	}
	return updatedAt.Equal(expectedTime)
}

func contentRevisionSource(raw string, parentVersionID uint64) map[string]any {
	source, _ := jsonValue(raw).(map[string]any)
	cloned := make(map[string]any, len(source)+2)
	for key, value := range source {
		cloned[key] = value
	}
	cloned["parent_version_id"] = parentVersionID
	cloned["revision_type"] = "manual_edit"
	return cloned
}

func hasSpecializedTextDocument(value any, depth int) bool {
	if value == nil || depth > 12 {
		return false
	}
	switch current := value.(type) {
	case string:
		parsed := jsonValue(current)
		if text, ok := parsed.(string); ok && text == current {
			return false
		}
		return hasSpecializedTextDocument(parsed, depth+1)
	case []any:
		for _, item := range current {
			if hasSpecializedTextDocument(item, depth+1) {
				return true
			}
		}
	case map[string]any:
		switch strings.ToLower(strings.TrimSpace(fmt.Sprint(current["type"]))) {
		case "storyboard", "storyboard_grid":
			return true
		}
		for _, key := range []string{"content", "output", "result", "data", "body", "value", "json", "rich"} {
			if hasSpecializedTextDocument(current[key], depth+1) {
				return true
			}
		}
	}
	return false
}
