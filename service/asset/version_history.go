package asset

import (
	"context"
	"fmt"
	"strings"

	assetmodel "github.com/dever-package/bot/model/asset"
)

const (
	defaultVersionPageSize = 20
	maxVersionPageSize     = 50
	versionSummaryLimit    = 120
)

type VersionPageRequest struct {
	Page     int
	PageSize int
}

type RestoreVersionRequest struct {
	ProjectID uint64
	AssetID   uint64
	VersionID uint64
	RequestID string
	NodeKey   string
}

func (s Service) ProjectVersionPage(ctx context.Context, projectID uint64, assetID uint64, req VersionPageRequest) (map[string]any, error) {
	asset := s.FindProjectAsset(ctx, projectID, assetID)
	if asset == nil {
		return nil, fmt.Errorf("资产不存在")
	}
	return s.versionPage(ctx, *asset, req), nil
}

func (s Service) versionPage(ctx context.Context, asset assetmodel.Asset, req VersionPageRequest) map[string]any {
	page, pageSize := normalizeVersionPage(req.Page, req.PageSize)
	filter := map[string]any{"asset_id": asset.ID}
	model := assetmodel.NewVersionModel()
	total := model.Count(ctx, filter)
	rows := model.Select(ctx, filter, map[string]any{
		"order":    "main.version desc,main.id desc",
		"page":     page,
		"pageSize": pageSize,
	})
	items := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			items = append(items, VersionSummaryToMap(*row, asset.Kind))
		}
	}
	return map[string]any{
		"items":     items,
		"page":      page,
		"page_size": pageSize,
		"total":     total,
		"has_more":  int64(page*pageSize) < total,
	}
}

func (s Service) ProjectVersionDetail(ctx context.Context, projectID uint64, assetID uint64, versionID uint64) (map[string]any, error) {
	asset := s.FindProjectAsset(ctx, projectID, assetID)
	if asset == nil {
		return nil, fmt.Errorf("资产不存在")
	}
	return s.versionDetail(ctx, *asset, versionID)
}

func (s Service) RestoreProjectVersion(ctx context.Context, req RestoreVersionRequest) (*assetmodel.Asset, *assetmodel.Version, error) {
	asset := s.FindProjectAsset(ctx, req.ProjectID, req.AssetID)
	if asset == nil {
		return nil, nil, fmt.Errorf("资产不存在")
	}
	version := s.FindVersion(ctx, req.VersionID)
	if version == nil || version.AssetID != asset.ID {
		return nil, nil, fmt.Errorf("资产版本不存在")
	}
	_, err := s.setCurrentVersion(ctx, *asset, *version)
	if err != nil {
		return nil, nil, err
	}
	asset = s.FindProjectAsset(ctx, req.ProjectID, req.AssetID)
	if asset == nil {
		return nil, nil, fmt.Errorf("读取资产失败")
	}
	return asset, version, nil
}

func VersionSummaryToMap(row assetmodel.Version, kind string) map[string]any {
	item := versionMetadataToMap(row)
	item["summary"] = versionContentSummary(jsonValue(row.Content), kind)
	return item
}

func normalizeVersionPage(page int, pageSize int) (int, int) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = defaultVersionPageSize
	}
	if pageSize > maxVersionPageSize {
		pageSize = maxVersionPageSize
	}
	return page, pageSize
}

func versionContentSummary(value any, kind string) string {
	parts := make([]string, 0, 8)
	collectVersionSummaryText(value, &parts, 0)
	text := compactVersionSummary(strings.Join(parts, " "))
	if text == "" {
		switch NormalizeKind(kind) {
		case assetmodel.KindImage:
			text = "图片内容"
		case assetmodel.KindVideo:
			text = "视频内容"
		case assetmodel.KindAudio:
			text = "音频内容"
		case assetmodel.KindFile:
			text = "文件内容"
		default:
			text = "暂无内容"
		}
	}
	runes := []rune(text)
	if len(runes) > versionSummaryLimit {
		return string(runes[:versionSummaryLimit]) + "…"
	}
	return text
}

func collectVersionSummaryText(value any, parts *[]string, depth int) {
	if value == nil || depth > 12 || len(*parts) >= 12 {
		return
	}
	switch current := value.(type) {
	case string:
		text := strings.TrimSpace(current)
		if text != "" && !isURL(text) {
			*parts = append(*parts, text)
		}
	case []any:
		for _, item := range current {
			collectVersionSummaryText(item, parts, depth+1)
		}
	case map[string]any:
		for _, key := range []string{"title", "text", "alt", "caption", "summary", "visual", "dialogue", "narration", "name"} {
			if item, exists := current[key]; exists {
				collectVersionSummaryText(item, parts, depth+1)
			}
		}
		for _, key := range []string{"content", "rich", "storyboard", "shots", "output", "result", "data", "body", "value"} {
			if item, exists := current[key]; exists {
				collectVersionSummaryText(item, parts, depth+1)
			}
		}
	}
}

func compactVersionSummary(value string) string {
	return strings.Join(strings.Fields(value), " ")
}
