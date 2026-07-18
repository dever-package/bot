package asset

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	assetmodel "github.com/dever-package/bot/model/asset"
	projectmodel "github.com/dever-package/bot/model/project"
	teammodel "github.com/dever-package/bot/model/team"
)

type Service struct{}

type SaveVersionRequest struct {
	AssetID     uint64
	ProjectID   uint64
	BodyID      uint64
	TeamID      uint64
	FlowID      uint64
	AssetCateID uint64
	RunID       uint64
	NodeRunID   uint64
	ReleaseID   uint64
	RequestID   string
	NodeKey     string
	SourceType  string
	SourceID    uint64
	SourceName  string
	Source      map[string]any
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
		"role":          assetmodel.RoleWork,
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
	service := Service{}
	asset := service.FindProjectAsset(ctx, projectID, assetID)
	if asset == nil {
		return nil, fmt.Errorf("资产不存在")
	}
	return service.detail(ctx, *asset), nil
}

func (Service) SaveVersion(ctx context.Context, req SaveVersionRequest) (*assetmodel.Asset, *assetmodel.Version, error) {
	var err error
	req, err = normalizeSaveVersionRequest(ctx, req)
	if err != nil {
		return nil, nil, err
	}
	result, err := withAssetSaveLock(ctx, req, func() (saveVersionResult, error) {
		asset, version, err := saveVersion(ctx, req)
		return saveVersionResult{Asset: asset, Version: version}, err
	})
	return result.Asset, result.Version, err
}

// SaveVersionInTransaction is for callers whose business terminal state and
// asset write are already protected by the same transaction.
func (Service) SaveVersionInTransaction(ctx context.Context, req SaveVersionRequest) (*assetmodel.Asset, *assetmodel.Version, error) {
	normalized, err := normalizeSaveVersionRequest(ctx, req)
	if err != nil {
		return nil, nil, err
	}
	return saveVersion(ctx, normalized)
}

func normalizeSaveVersionRequest(ctx context.Context, req SaveVersionRequest) (SaveVersionRequest, error) {
	req.Name = strings.TrimSpace(req.Name)
	req.NodeKey = strings.TrimSpace(req.NodeKey)
	req.SourceType = NormalizeSourceType(req.SourceType)
	req.SourceName = strings.TrimSpace(req.SourceName)
	req.Kind = NormalizeKind(req.Kind)
	req.Role = NormalizeRole(req.Role)
	if req.TeamID == 0 {
		return SaveVersionRequest{}, fmt.Errorf("资产缺少团队")
	}
	switch req.SourceType {
	case assetmodel.SourceProject:
		if req.ProjectID == 0 {
			return SaveVersionRequest{}, fmt.Errorf("项目资产缺少项目")
		}
		project := projectmodel.NewProjectModel().Find(ctx, map[string]any{
			"id":      req.ProjectID,
			"team_id": req.TeamID,
			"status":  projectmodel.StatusEnabled,
		})
		if project == nil {
			return SaveVersionRequest{}, fmt.Errorf("资产所属项目不存在")
		}
		if req.BodyID == 0 {
			req.BodyID = project.BodyID
		}
		if req.SourceName == "" {
			req.SourceName = projectSourceName(ctx, *project, req)
		}
		if req.SourceID == 0 {
			req.SourceID = req.ProjectID
		}
	case assetmodel.SourceTool, assetmodel.SourceDialogue:
		if req.BodyID == 0 || req.SourceID == 0 {
			return SaveVersionRequest{}, fmt.Errorf("工作区资产缺少来源")
		}
		if req.SourceName == "" {
			return SaveVersionRequest{}, fmt.Errorf("工作区资产缺少来源名称")
		}
	case assetmodel.SourceUpload:
		if req.SourceID == 0 {
			return SaveVersionRequest{}, fmt.Errorf("上传资产缺少文件")
		}
		if req.SourceName == "" {
			return SaveVersionRequest{}, fmt.Errorf("上传资产缺少来源名称")
		}
		if req.ProjectID > 0 {
			project := projectmodel.NewProjectModel().Find(ctx, map[string]any{
				"id":      req.ProjectID,
				"team_id": req.TeamID,
				"status":  projectmodel.StatusEnabled,
			})
			if project == nil {
				return SaveVersionRequest{}, fmt.Errorf("上传资产所属项目不存在")
			}
			if project.BodyID == 0 {
				return SaveVersionRequest{}, fmt.Errorf("上传资产所属项目缺少载体")
			}
			if req.BodyID == 0 {
				req.BodyID = project.BodyID
			}
			if req.BodyID != project.BodyID {
				return SaveVersionRequest{}, fmt.Errorf("上传资产载体与项目不匹配")
			}
		} else if req.BodyID == 0 {
			return SaveVersionRequest{}, fmt.Errorf("上传资产缺少工作区")
		}
	default:
		return SaveVersionRequest{}, fmt.Errorf("资产来源不合法")
	}
	if req.Role == assetmodel.RoleWork && (req.SourceType != assetmodel.SourceProject || req.AssetCateID == 0) {
		return SaveVersionRequest{}, fmt.Errorf("作品必须绑定项目资产分类")
	}
	if req.Role == assetmodel.RoleWork {
		assetCate := teammodel.NewAssetCateModel().Find(ctx, map[string]any{
			"id":      req.AssetCateID,
			"team_id": req.TeamID,
			"status":  teammodel.StatusEnabled,
		})
		if assetCate == nil {
			return SaveVersionRequest{}, fmt.Errorf("作品资产分类不存在或已停用")
		}
	}
	if req.Name == "" {
		return SaveVersionRequest{}, fmt.Errorf("资产名称不能为空")
	}
	if !HasContent(req.Content) {
		return SaveVersionRequest{}, fmt.Errorf("资产内容不能为空")
	}
	return req, nil
}

type saveVersionResult struct {
	Asset   *assetmodel.Asset
	Version *assetmodel.Version
}

func saveVersion(ctx context.Context, req SaveVersionRequest) (*assetmodel.Asset, *assetmodel.Version, error) {
	assetModel := assetmodel.NewAssetModel()
	asset := findTargetAsset(ctx, req)
	if req.AssetID > 0 && asset == nil {
		return nil, nil, fmt.Errorf("目标资产不存在或不属于当前来源")
	}
	now := time.Now()
	if asset == nil {
		sort := req.Sort
		if sort == 0 {
			sort = 100
		}
		assetID := safeInsertAsset(ctx, map[string]any{
			"project_id":    req.ProjectID,
			"body_id":       req.BodyID,
			"team_id":       req.TeamID,
			"flow_id":       req.FlowID,
			"asset_cate_id": req.AssetCateID,
			"node_key":      req.NodeKey,
			"source_type":   req.SourceType,
			"source_id":     req.SourceID,
			"source_name":   req.SourceName,
			"name":          req.Name,
			"kind":          req.Kind,
			"role":          req.Role,
			"version_id":    0,
			"status":        assetmodel.StatusDraft,
			"sort":          sort,
			"created_at":    now,
		})
		asset = assetModel.Find(ctx, map[string]any{"id": assetID})
		if asset == nil {
			asset = assetModel.Find(ctx, assetIdentityFilter(req))
		}
	}
	if asset == nil {
		return nil, nil, fmt.Errorf("创建资产失败")
	}
	if version := findSavedVersion(ctx, asset.ID, req.RequestID, req.NodeKey); version != nil {
		if current := (Service{}).FindVersion(ctx, asset.VersionID); current != nil && current.Version > version.Version {
			return asset, current, nil
		}
		assetModel.Update(ctx, map[string]any{"id": asset.ID}, map[string]any{
			"name":        req.Name,
			"kind":        req.Kind,
			"role":        req.Role,
			"node_key":    req.NodeKey,
			"source_type": req.SourceType,
			"source_id":   req.SourceID,
			"source_name": req.SourceName,
			"version_id":  version.ID,
			"status":      assetmodel.StatusCurrent,
		})
		asset = assetModel.Find(ctx, map[string]any{"id": asset.ID})
		if asset == nil {
			return nil, nil, fmt.Errorf("读取资产失败")
		}
		return asset, version, nil
	}
	versionID := insertAssetVersionWithRetry(ctx, asset.ID, req, now)
	if versionID == 0 {
		return nil, nil, fmt.Errorf("创建资产版本失败")
	}
	assetModel.Update(ctx, map[string]any{"id": asset.ID}, map[string]any{
		"name":        req.Name,
		"kind":        req.Kind,
		"role":        req.Role,
		"node_key":    req.NodeKey,
		"source_type": req.SourceType,
		"source_id":   req.SourceID,
		"source_name": req.SourceName,
		"version_id":  versionID,
		"status":      assetmodel.StatusCurrent,
	})
	asset = assetModel.Find(ctx, map[string]any{"id": asset.ID})
	version := Service{}.FindVersion(ctx, versionID)
	if asset == nil || version == nil {
		return nil, nil, fmt.Errorf("读取资产版本失败")
	}
	return asset, version, nil
}

func assetIdentityFilter(req SaveVersionRequest) map[string]any {
	filter := map[string]any{
		"team_id":     req.TeamID,
		"project_id":  req.ProjectID,
		"source_type": req.SourceType,
		"source_id":   req.SourceID,
		"role":        req.Role,
	}
	if req.SourceType == assetmodel.SourceProject {
		filter["asset_cate_id"] = req.AssetCateID
	}
	if req.NodeKey != "" {
		filter["node_key"] = req.NodeKey
	} else {
		filter["body_id"] = req.BodyID
		filter["flow_id"] = req.FlowID
		filter["asset_cate_id"] = req.AssetCateID
		filter["name"] = req.Name
	}
	return filter
}

func findTargetAsset(ctx context.Context, req SaveVersionRequest) *assetmodel.Asset {
	if req.AssetID == 0 {
		return assetmodel.NewAssetModel().Find(ctx, assetIdentityFilter(req))
	}
	asset := assetmodel.NewAssetModel().Find(ctx, map[string]any{"id": req.AssetID})
	if !assetMatchesSaveRequest(asset, req) {
		return nil
	}
	return asset
}

func assetMatchesSaveRequest(asset *assetmodel.Asset, req SaveVersionRequest) bool {
	if asset == nil ||
		asset.Status != assetmodel.StatusCurrent ||
		asset.VersionID == 0 ||
		asset.TeamID != req.TeamID ||
		asset.ProjectID != req.ProjectID ||
		asset.SourceType != req.SourceType ||
		asset.SourceID != req.SourceID ||
		NormalizeRole(asset.Role) != req.Role {
		return false
	}
	if req.SourceType == assetmodel.SourceProject && asset.AssetCateID != req.AssetCateID {
		return false
	}
	return req.ProjectID > 0 || asset.BodyID == req.BodyID
}

func projectSourceName(ctx context.Context, project projectmodel.Project, req SaveVersionRequest) string {
	parts := []string{strings.TrimSpace(project.Name)}
	if req.AssetCateID > 0 {
		if assetCate := teammodel.NewAssetCateModel().Find(ctx, map[string]any{
			"id":      req.AssetCateID,
			"team_id": req.TeamID,
		}); assetCate != nil {
			parts = appendDistinctText(parts, assetCate.Name)
		}
	}
	nodeName := ""
	if req.FlowID > 0 && req.NodeKey != "" {
		if node := teammodel.NewFlowNodeModel().Find(ctx, map[string]any{
			"flow_id":  req.FlowID,
			"node_key": req.NodeKey,
		}); node != nil {
			nodeName = node.Name
		}
	}
	if nodeName == "" && req.NodeKey != "" {
		nodeName = req.Name
	}
	parts = appendDistinctText(parts, nodeName)
	return strings.Join(parts, " / ")
}

func appendDistinctText(parts []string, value string) []string {
	value = strings.TrimSpace(value)
	if value == "" {
		return parts
	}
	for _, part := range parts {
		if part == value {
			return parts
		}
	}
	return append(parts, value)
}

func (s Service) UpdateVersionContent(ctx context.Context, projectID uint64, assetID uint64, versionID uint64, content any) (*assetmodel.Asset, *assetmodel.Version, error) {
	asset := s.FindProjectAsset(ctx, projectID, assetID)
	if asset == nil {
		return nil, nil, fmt.Errorf("资产不存在")
	}
	result, err := withAssetSaveLock(ctx, SaveVersionRequest{
		AssetID:     asset.ID,
		ProjectID:   asset.ProjectID,
		BodyID:      asset.BodyID,
		TeamID:      asset.TeamID,
		FlowID:      asset.FlowID,
		AssetCateID: asset.AssetCateID,
		SourceType:  asset.SourceType,
		SourceID:    asset.SourceID,
		SourceName:  asset.SourceName,
		Name:        asset.Name,
		Kind:        asset.Kind,
		Role:        NormalizeRole(asset.Role),
		NodeKey:     asset.NodeKey,
	}, func() (saveVersionResult, error) {
		asset, version, err := s.updateVersionContent(ctx, projectID, assetID, versionID, content)
		return saveVersionResult{Asset: asset, Version: version}, err
	})
	return result.Asset, result.Version, err
}

func (s Service) updateVersionContent(ctx context.Context, projectID uint64, assetID uint64, versionID uint64, content any) (*assetmodel.Asset, *assetmodel.Version, error) {
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
	if version.ID != asset.VersionID {
		return nil, nil, fmt.Errorf("历史版本不可编辑，请先恢复为新版本")
	}
	assetmodel.NewVersionModel().Update(ctx, map[string]any{"id": version.ID}, map[string]any{
		"content":    jsonText(EnsureDocument(content, asset.Kind)),
		"updated_at": time.Now(),
	})
	assetmodel.NewAssetModel().Update(ctx, map[string]any{"id": asset.ID}, map[string]any{
		"status": assetmodel.StatusCurrent,
	})
	asset = s.FindProjectAsset(ctx, projectID, assetID)
	version = s.FindVersion(ctx, versionID)
	if asset == nil || version == nil {
		return nil, nil, fmt.Errorf("读取资产版本失败")
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
		"node_key":      strings.TrimSpace(row.NodeKey),
		"source_type":   row.SourceType,
		"source_id":     row.SourceID,
		"source_name":   row.SourceName,
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
	case assetmodel.RoleWork:
		return assetmodel.RoleWork
	default:
		return assetmodel.RoleMaterial
	}
}

func NormalizeSourceType(sourceType string) string {
	switch strings.ToLower(strings.TrimSpace(sourceType)) {
	case assetmodel.SourceProject:
		return assetmodel.SourceProject
	case assetmodel.SourceTool:
		return assetmodel.SourceTool
	case assetmodel.SourceDialogue:
		return assetmodel.SourceDialogue
	case assetmodel.SourceUpload:
		return assetmodel.SourceUpload
	default:
		return assetmodel.SourceProject
	}
}

func VersionToMap(row assetmodel.Version) map[string]any {
	item := versionMetadataToMap(row)
	item["content"] = jsonValue(row.Content)
	return item
}

func versionMetadataToMap(row assetmodel.Version) map[string]any {
	updatedAt := row.CreatedAt
	if row.UpdatedAt != nil && !row.UpdatedAt.IsZero() {
		updatedAt = *row.UpdatedAt
	}
	return map[string]any{
		"id":          row.ID,
		"asset_id":    row.AssetID,
		"run_id":      row.RunID,
		"node_run_id": row.NodeRunID,
		"release_id":  row.ReleaseID,
		"request_id":  strings.TrimSpace(row.RequestID),
		"node_key":    strings.TrimSpace(row.NodeKey),
		"source":      jsonValue(row.Source),
		"version":     row.Version,
		"created_at":  row.CreatedAt,
		"updated_at":  updatedAt,
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
	case assetmodel.KindImage, assetmodel.KindAudio, assetmodel.KindVideo, assetmodel.KindRichText, assetmodel.KindFile:
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

func HasContent(value any) bool {
	return hasAssetContent(value, 0)
}

func hasAssetContent(value any, depth int) bool {
	if value == nil || depth > 16 {
		return false
	}
	switch current := value.(type) {
	case string:
		return strings.TrimSpace(current) != ""
	case []any:
		for _, item := range current {
			if hasAssetContent(item, depth+1) {
				return true
			}
		}
		return false
	case []string:
		for _, item := range current {
			if strings.TrimSpace(item) != "" {
				return true
			}
		}
		return false
	case []map[string]any:
		for _, item := range current {
			if hasAssetContent(item, depth+1) {
				return true
			}
		}
		return false
	case map[string]any:
		return assetMapHasContent(current, depth+1)
	default:
		return true
	}
}

func assetMapHasContent(value map[string]any, depth int) bool {
	if len(value) == 0 {
		return false
	}
	typeName := strings.ToLower(strings.TrimSpace(fmt.Sprint(value["type"])))
	switch typeName {
	case "doc":
		return hasAssetContent(value["content"], depth)
	case "storyboard":
		return hasAssetContent(value["shots"], depth)
	case "file":
		return hasAssetContent(firstMapValue(value, "file_url", "file", "url"), depth)
	}
	for _, key := range []string{
		"text", "content", "body", "result", "output", "json", "rich",
		"image", "images", "image_url", "audio", "audios", "audio_url",
		"video", "videos", "video_url", "file", "files", "file_url", "url",
		"artifacts", "activities", "blocks", "parts", "shots",
	} {
		if hasAssetContent(value[key], depth) {
			return true
		}
	}
	metadata := map[string]bool{
		"type": true, "kind": true, "event": true, "status": true,
		"progress": true, "request_id": true, "run_id": true,
		"node_run_id": true, "release_id": true, "meta": true,
		"version": true,
	}
	for key, item := range value {
		if metadata[key] || strings.HasPrefix(key, "_") {
			continue
		}
		if hasAssetContent(item, depth) {
			return true
		}
	}
	return false
}

func firstMapValue(value map[string]any, keys ...string) any {
	for _, key := range keys {
		if current := value[key]; current != nil {
			return current
		}
	}
	return nil
}

func EnsureDocument(raw any, kind string) map[string]any {
	if document, ok := raw.(map[string]any); ok && isStructuredAssetDocument(document) {
		return document
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

func isStructuredAssetDocument(document map[string]any) bool {
	typeName := strings.ToLower(strings.TrimSpace(fmt.Sprint(document["type"])))
	switch typeName {
	case "doc":
		return true
	case "storyboard":
		return document["shots"] != nil
	case "file":
		return document["file_url"] != nil || document["file"] != nil
	}
	format := strings.ToLower(strings.TrimSpace(fmt.Sprint(document["format"])))
	return format == "markdown" || format == "rich_json"
}

func listProjectAssets(ctx context.Context, projectID uint64, flowID uint64, kind string) []assetmodel.Asset {
	if projectID == 0 {
		return nil
	}
	filter := map[string]any{
		"project_id": projectID,
		"status":     assetmodel.StatusCurrent,
	}
	if flowID > 0 {
		filter["flow_id"] = flowID
	}
	if kind != "" {
		filter["kind"] = kind
	}
	rows := assetmodel.NewAssetModel().Select(ctx, filter)
	result := make([]assetmodel.Asset, 0, len(rows))
	for _, row := range rows {
		if row != nil && row.VersionID > 0 {
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

func safeInsertAsset(ctx context.Context, record map[string]any) (id uint64) {
	defer func() {
		if recover() != nil {
			id = 0
		}
	}()
	return uint64(assetmodel.NewAssetModel().Insert(ctx, record))
}

func insertAssetVersionWithRetry(ctx context.Context, assetID uint64, req SaveVersionRequest, now time.Time) uint64 {
	for attempt := 0; attempt < 5; attempt++ {
		versionID := safeInsertAssetVersion(ctx, map[string]any{
			"asset_id":    assetID,
			"run_id":      req.RunID,
			"node_run_id": req.NodeRunID,
			"release_id":  req.ReleaseID,
			"request_id":  strings.TrimSpace(req.RequestID),
			"node_key":    strings.TrimSpace(req.NodeKey),
			"source":      jsonText(versionSource(req)),
			"version":     nextVersion(ctx, assetID),
			"content":     jsonText(EnsureDocument(req.Content, req.Kind)),
			"created_at":  now,
			"updated_at":  now,
		})
		if versionID > 0 {
			return versionID
		}
		time.Sleep(time.Duration(attempt+1) * 20 * time.Millisecond)
	}
	return 0
}

func findSavedVersion(ctx context.Context, assetID uint64, requestID string, nodeKey string) *assetmodel.Version {
	requestID = strings.TrimSpace(requestID)
	nodeKey = strings.TrimSpace(nodeKey)
	if assetID == 0 || requestID == "" {
		return nil
	}
	filter := map[string]any{
		"asset_id":   assetID,
		"request_id": requestID,
	}
	if nodeKey != "" {
		filter["node_key"] = nodeKey
	}
	return assetmodel.NewVersionModel().Find(ctx, filter)
}

func versionSource(req SaveVersionRequest) map[string]any {
	source := make(map[string]any, len(req.Source)+12)
	for key, value := range req.Source {
		source[key] = value
	}
	source["type"] = req.SourceType
	source["id"] = req.SourceID
	source["name"] = req.SourceName
	source["project_id"] = req.ProjectID
	source["body_id"] = req.BodyID
	source["team_id"] = req.TeamID
	source["flow_id"] = req.FlowID
	source["asset_cate_id"] = req.AssetCateID
	source["run_id"] = req.RunID
	source["node_run_id"] = req.NodeRunID
	source["release_id"] = req.ReleaseID
	source["request_id"] = strings.TrimSpace(req.RequestID)
	source["node_key"] = req.NodeKey
	return source
}

func safeInsertAssetVersion(ctx context.Context, record map[string]any) (id uint64) {
	defer func() {
		if recover() != nil {
			id = 0
		}
	}()
	return uint64(assetmodel.NewVersionModel().Insert(ctx, record))
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
