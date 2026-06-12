package asset

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	assetmodel "my/package/bot/model/asset"
)

type Service struct{}

type SaveVersionRequest struct {
	ProjectID   uint64
	BodyID      uint64
	TeamID      uint64
	FlowID      uint64
	AssetCateID uint64
	RunID       uint64
	NodeRunID   uint64
	ReleaseID   uint64
	Name        string
	Kind        string
	Role        string
	Content     any
	Sort        int
}

func NewService() Service {
	return Service{}
}

func (Service) Find(ctx context.Context, id uint64) *assetmodel.Asset {
	if id == 0 {
		return nil
	}
	return assetmodel.NewAssetModel().Find(ctx, map[string]any{"id": id})
}

func (Service) FindProjectAsset(ctx context.Context, projectID uint64, id uint64) *assetmodel.Asset {
	if projectID == 0 || id == 0 {
		return nil
	}
	return assetmodel.NewAssetModel().Find(ctx, map[string]any{
		"id":         id,
		"project_id": projectID,
	})
}

func (Service) LatestProjectAssetByCate(ctx context.Context, projectID uint64, assetCateID uint64) (*assetmodel.Asset, *assetmodel.Version) {
	if projectID == 0 || assetCateID == 0 {
		return nil, nil
	}
	rows := assetmodel.NewAssetModel().Select(ctx, map[string]any{
		"project_id":    projectID,
		"asset_cate_id": assetCateID,
		"role":          assetmodel.RoleContent,
		"status":        assetmodel.StatusCurrent,
	})
	var latest *assetmodel.Asset
	for _, row := range rows {
		if row == nil || row.VersionID == 0 {
			continue
		}
		if latest == nil || row.VersionID > latest.VersionID {
			value := *row
			latest = &value
		}
	}
	if latest == nil {
		return nil, nil
	}
	return latest, Service{}.FindVersion(ctx, latest.VersionID)
}

func (Service) FindVersion(ctx context.Context, id uint64) *assetmodel.Version {
	if id == 0 {
		return nil
	}
	return assetmodel.NewVersionModel().Find(ctx, map[string]any{"id": id})
}

func (Service) ListProject(ctx context.Context, projectID uint64, flowID uint64, kind string) (map[string]any, error) {
	assets := listProjectAssets(ctx, projectID, flowID, NormalizeKindFilter(kind))
	items := make([]map[string]any, 0, len(assets))
	service := Service{}
	for _, asset := range assets {
		item := AssetToMap(asset)
		if version := service.FindVersion(ctx, asset.VersionID); version != nil {
			item["version"] = VersionToMap(*version)
		}
		items = append(items, item)
	}
	return map[string]any{"items": items}, nil
}

func (Service) ProjectDetail(ctx context.Context, projectID uint64, assetID uint64) (map[string]any, error) {
	asset := Service{}.FindProjectAsset(ctx, projectID, assetID)
	if asset == nil {
		return nil, fmt.Errorf("资产不存在")
	}
	return map[string]any{
		"asset":    Service{}.AssetDetailMap(ctx, *asset, nil),
		"versions": VersionsToMaps(listVersions(ctx, asset.ID)),
	}, nil
}

func (Service) SaveVersion(ctx context.Context, req SaveVersionRequest) (*assetmodel.Asset, *assetmodel.Version, error) {
	req.Name = strings.TrimSpace(req.Name)
	req.Kind = NormalizeKind(req.Kind)
	req.Role = NormalizeRole(req.Role)
	if req.ProjectID == 0 && req.BodyID == 0 {
		return nil, nil, fmt.Errorf("资产缺少项目或身体")
	}
	if req.Name == "" {
		return nil, nil, fmt.Errorf("资产名称不能为空")
	}
	assetModel := assetmodel.NewAssetModel()
	asset := assetModel.Find(ctx, map[string]any{
		"project_id":    req.ProjectID,
		"body_id":       req.BodyID,
		"team_id":       req.TeamID,
		"flow_id":       req.FlowID,
		"asset_cate_id": req.AssetCateID,
		"role":          req.Role,
		"name":          req.Name,
	})
	if asset == nil && req.Role == assetmodel.RoleContent {
		asset = assetModel.Find(ctx, map[string]any{
			"project_id":    req.ProjectID,
			"body_id":       req.BodyID,
			"team_id":       req.TeamID,
			"flow_id":       req.FlowID,
			"asset_cate_id": req.AssetCateID,
			"name":          req.Name,
		})
		if asset != nil && NormalizeRole(asset.Role) != assetmodel.RoleContent {
			asset = nil
		}
	}
	now := time.Now()
	if asset == nil {
		sort := req.Sort
		if sort == 0 {
			sort = 100
		}
		assetID := uint64(assetModel.Insert(ctx, map[string]any{
			"project_id":    req.ProjectID,
			"body_id":       req.BodyID,
			"team_id":       req.TeamID,
			"flow_id":       req.FlowID,
			"asset_cate_id": req.AssetCateID,
			"name":          req.Name,
			"kind":          req.Kind,
			"role":          req.Role,
			"version_id":    0,
			"status":        assetmodel.StatusDraft,
			"sort":          sort,
			"created_at":    now,
		}))
		asset = assetModel.Find(ctx, map[string]any{"id": assetID})
	}
	if asset == nil {
		return nil, nil, fmt.Errorf("创建资产失败")
	}
	versionID := uint64(assetmodel.NewVersionModel().Insert(ctx, map[string]any{
		"asset_id":    asset.ID,
		"run_id":      req.RunID,
		"node_run_id": req.NodeRunID,
		"release_id":  req.ReleaseID,
		"version":     nextVersion(ctx, asset.ID),
		"content":     jsonText(EnsureDocument(req.Content, req.Kind)),
		"created_at":  now,
	}))
	if versionID == 0 {
		return nil, nil, fmt.Errorf("创建资产版本失败")
	}
	assetModel.Update(ctx, map[string]any{"id": asset.ID}, map[string]any{
		"kind":       req.Kind,
		"role":       req.Role,
		"version_id": versionID,
		"status":     assetmodel.StatusCurrent,
	})
	asset = assetModel.Find(ctx, map[string]any{"id": asset.ID})
	version := Service{}.FindVersion(ctx, versionID)
	if asset == nil || version == nil {
		return nil, nil, fmt.Errorf("读取资产版本失败")
	}
	return asset, version, nil
}

func (s Service) UpdateVersionContent(ctx context.Context, projectID uint64, assetID uint64, versionID uint64, content any) (*assetmodel.Asset, *assetmodel.Version, error) {
	asset := s.FindProjectAsset(ctx, projectID, assetID)
	if asset == nil {
		return nil, nil, fmt.Errorf("资产不存在")
	}
	if versionID == 0 {
		versionID = asset.VersionID
	}
	version := s.FindVersion(ctx, versionID)
	if version == nil || version.AssetID != asset.ID {
		return nil, nil, fmt.Errorf("资产版本不存在")
	}
	now := time.Now()
	assetmodel.NewVersionModel().Update(ctx, map[string]any{"id": version.ID}, map[string]any{
		"content":    jsonText(EnsureDocument(content, asset.Kind)),
		"created_at": now,
	})
	assetmodel.NewAssetModel().Update(ctx, map[string]any{"id": asset.ID}, map[string]any{
		"version_id": version.ID,
		"status":     assetmodel.StatusCurrent,
	})
	asset = s.FindProjectAsset(ctx, projectID, assetID)
	version = s.FindVersion(ctx, versionID)
	if asset == nil || version == nil {
		return nil, nil, fmt.Errorf("读取资产版本失败")
	}
	return asset, version, nil
}

func (s Service) UseVersion(ctx context.Context, projectID uint64, assetID uint64, versionID uint64) (*assetmodel.Asset, *assetmodel.Version, error) {
	asset := s.FindProjectAsset(ctx, projectID, assetID)
	if asset == nil {
		return nil, nil, fmt.Errorf("资产不存在")
	}
	version := s.FindVersion(ctx, versionID)
	if version == nil || version.AssetID != asset.ID {
		return nil, nil, fmt.Errorf("资产版本不存在")
	}
	assetmodel.NewAssetModel().Update(ctx, map[string]any{"id": asset.ID}, map[string]any{
		"version_id": version.ID,
		"status":     assetmodel.StatusCurrent,
	})
	asset = s.FindProjectAsset(ctx, projectID, assetID)
	if asset == nil {
		return nil, nil, fmt.Errorf("读取资产失败")
	}
	return asset, version, nil
}

func (s Service) AssetDetailMap(ctx context.Context, row assetmodel.Asset, current *assetmodel.Version) map[string]any {
	item := AssetToMap(row)
	if current == nil && row.VersionID > 0 {
		current = s.FindVersion(ctx, row.VersionID)
	}
	if current != nil {
		item["version"] = VersionToMap(*current)
	}
	item["versions"] = VersionsToMaps(listVersions(ctx, row.ID))
	return item
}

func AssetToMap(row assetmodel.Asset) map[string]any {
	return map[string]any{
		"id":            row.ID,
		"project_id":    row.ProjectID,
		"body_id":       row.BodyID,
		"team_id":       row.TeamID,
		"flow_id":       row.FlowID,
		"asset_cate_id": row.AssetCateID,
		"name":          row.Name,
		"kind":          row.Kind,
		"role":          NormalizeRole(row.Role),
		"version_id":    row.VersionID,
		"status":        row.Status,
		"sort":          row.Sort,
		"created_at":    row.CreatedAt,
	}
}

func NormalizeRole(role string) string {
	switch strings.ToLower(strings.TrimSpace(role)) {
	case assetmodel.RoleMaterial, "source", "file", "media":
		return assetmodel.RoleMaterial
	case assetmodel.RoleContent, "":
		return assetmodel.RoleContent
	default:
		return assetmodel.RoleContent
	}
}

func VersionToMap(row assetmodel.Version) map[string]any {
	return map[string]any{
		"id":          row.ID,
		"asset_id":    row.AssetID,
		"run_id":      row.RunID,
		"node_run_id": row.NodeRunID,
		"release_id":  row.ReleaseID,
		"version":     row.Version,
		"content":     jsonValue(row.Content),
		"created_at":  row.CreatedAt,
	}
}

func VersionsToMaps(rows []assetmodel.Version) []map[string]any {
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		result = append(result, VersionToMap(row))
	}
	return result
}

func NormalizeKind(kind string) string {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case assetmodel.KindImage, assetmodel.KindVideo, assetmodel.KindAudio, assetmodel.KindFile, assetmodel.KindMixed:
		return strings.ToLower(strings.TrimSpace(kind))
	case "llm", "text":
		return assetmodel.KindText
	default:
		return assetmodel.KindText
	}
}

func NormalizeKindFilter(kind string) string {
	kind = strings.ToLower(strings.TrimSpace(kind))
	if kind == "" {
		return ""
	}
	return NormalizeKind(kind)
}

func EnsureDocument(raw any, kind string) map[string]any {
	if doc, ok := raw.(map[string]any); ok && doc["type"] == "doc" {
		return doc
	}
	text := contentText(raw)
	if text == "" {
		text = "{}"
	}
	if NormalizeKind(kind) == assetmodel.KindImage && isURL(text) {
		return map[string]any{
			"type": "doc",
			"content": []map[string]any{
				{
					"type": "image",
					"attrs": map[string]any{
						"src": text,
					},
				},
			},
		}
	}
	return map[string]any{
		"type": "doc",
		"content": []map[string]any{
			{
				"type": "paragraph",
				"content": []map[string]any{
					{"type": "text", "text": text},
				},
			},
		},
	}
}

func listProjectAssets(ctx context.Context, projectID uint64, flowID uint64, kind string) []assetmodel.Asset {
	if projectID == 0 {
		return nil
	}
	filter := map[string]any{"project_id": projectID}
	if flowID > 0 {
		filter["flow_id"] = flowID
	}
	if kind != "" {
		filter["kind"] = kind
	}
	rows := assetmodel.NewAssetModel().Select(ctx, filter)
	result := make([]assetmodel.Asset, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func listVersions(ctx context.Context, assetID uint64) []assetmodel.Version {
	if assetID == 0 {
		return nil
	}
	rows := assetmodel.NewVersionModel().Select(ctx, map[string]any{"asset_id": assetID})
	result := make([]assetmodel.Version, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func nextVersion(ctx context.Context, assetID uint64) int {
	maxVersion := 0
	for _, row := range assetmodel.NewVersionModel().Select(ctx, map[string]any{"asset_id": assetID}) {
		if row != nil && row.Version > maxVersion {
			maxVersion = row.Version
		}
	}
	return maxVersion + 1
}

func contentText(raw any) string {
	switch value := raw.(type) {
	case nil:
		return ""
	case string:
		return strings.TrimSpace(value)
	case map[string]any:
		for _, key := range []string{"text", "content", "body", "result", "url", "image", "video", "audio", "file", "finalOutput"} {
			if text, ok := value[key].(string); ok && strings.TrimSpace(text) != "" {
				return strings.TrimSpace(text)
			}
		}
		for _, key := range []string{"images", "videos", "audios", "files"} {
			if list, ok := value[key].([]any); ok && len(list) > 0 {
				if text, ok := list[0].(string); ok && strings.TrimSpace(text) != "" {
					return strings.TrimSpace(text)
				}
			}
		}
		content, _ := json.MarshalIndent(value, "", "  ")
		return string(content)
	default:
		content, _ := json.MarshalIndent(value, "", "  ")
		return string(content)
	}
}

func isURL(text string) bool {
	return strings.HasPrefix(text, "http://") || strings.HasPrefix(text, "https://") || strings.HasPrefix(text, "/") || strings.HasPrefix(text, "data:")
}

func jsonText(raw any) string {
	content, err := json.Marshal(raw)
	if err != nil {
		return "{}"
	}
	return string(content)
}

func jsonValue(text string) any {
	if strings.TrimSpace(text) == "" {
		return nil
	}
	var result any
	if err := json.Unmarshal([]byte(text), &result); err != nil {
		return text
	}
	return result
}
