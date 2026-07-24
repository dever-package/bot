package asset

import (
	"context"
	"fmt"
	"sort"
	"strings"

	assetmodel "github.com/dever-package/bot/model/asset"
	projectmodel "github.com/dever-package/bot/model/project"
	teammodel "github.com/dever-package/bot/model/team"
)

const (
	defaultAssetPageSize = 24
	maxAssetPageSize     = 60

	QueryViewAssets     = "assets"
	QueryViewTrash      = "trash"
	QueryContentFull    = "full"
	QueryContentPreview = "preview"
)

type QueryRequest struct {
	TeamID       uint64
	SourceType   string
	SourceID     uint64
	ProjectID    uint64
	AssetCateID  uint64
	CollectionID uint64
	NodeKey      string
	Role         string
	Kind         string
	View         string
	ContentMode  string
	Page         int
	PageSize     int
}

type CurrentReference struct {
	Asset   assetmodel.Asset
	Version assetmodel.Version
	Content any
}

func (s Service) RequireContinuationTarget(
	ctx context.Context,
	teamID uint64,
	assetID uint64,
	sourceType string,
	sourceID uint64,
) (*assetmodel.Asset, error) {
	asset, err := s.requireTeamAsset(ctx, teamID, assetID)
	if err != nil {
		return nil, err
	}
	if asset.Status != assetmodel.StatusCurrent ||
		asset.VersionID == 0 ||
		asset.Kind == assetmodel.KindCollection ||
		asset.SourceType != sourceType ||
		asset.SourceID != sourceID ||
		NormalizeRole(asset.Role) != assetmodel.RoleMaterial {
		return nil, fmt.Errorf("目标素材与当前来源不匹配")
	}
	return asset, nil
}

// RequireCurrentReference resolves the asset's current version. The supplied
// version is a client snapshot, not an immutable version pin.
func (s Service) RequireCurrentReference(ctx context.Context, teamID uint64, assetID uint64, _ uint64) (CurrentReference, error) {
	if teamID == 0 || assetID == 0 {
		return CurrentReference{}, fmt.Errorf("团队和资产不能为空")
	}
	resolved, err := s.RequireCurrentReferences(ctx, teamID, []uint64{assetID})
	if err != nil {
		return CurrentReference{}, err
	}
	current, ok := resolved[assetID]
	if !ok {
		return CurrentReference{}, fmt.Errorf("资产不存在或不属于当前团队")
	}
	return current, nil
}

// RequireCurrentReferences resolves a set of current asset versions with one
// team-scope lookup and batched asset/version reads.
func (s Service) RequireCurrentReferences(
	ctx context.Context,
	teamID uint64,
	assetIDs []uint64,
) (map[uint64]CurrentReference, error) {
	if teamID == 0 {
		return nil, fmt.Errorf("团队不能为空")
	}
	uniqueIDs := distinctAssetReferenceIDs(assetIDs)
	result := make(map[uint64]CurrentReference, len(uniqueIDs))
	if len(uniqueIDs) == 0 {
		return result, nil
	}
	scope, err := resolveTeamAssetScope(ctx, teamID)
	if err != nil {
		return nil, err
	}
	rows := assetmodel.NewAssetModel().Select(ctx, map[string]any{"id": uniqueIDs})
	assets := make(map[uint64]*assetmodel.Asset, len(rows))
	for _, asset := range rows {
		if asset != nil {
			assets[asset.ID] = asset
		}
	}
	orderedAssets := make([]*assetmodel.Asset, 0, len(uniqueIDs))
	for _, assetID := range uniqueIDs {
		asset := assets[assetID]
		if !scope.contains(asset) {
			return nil, fmt.Errorf("资产不存在或不属于当前团队")
		}
		if asset.Status != assetmodel.StatusCurrent {
			return nil, fmt.Errorf("资产已不可用")
		}
		if asset.Kind == assetmodel.KindCollection {
			return nil, fmt.Errorf("资产集合不能直接作为引用")
		}
		if asset.VersionID == 0 {
			return nil, fmt.Errorf("资产当前版本不可用")
		}
		orderedAssets = append(orderedAssets, asset)
	}
	versions := currentVersionsByID(ctx, orderedAssets, QueryContentFull)
	for _, asset := range orderedAssets {
		version := versions[asset.VersionID]
		if version == nil || version.AssetID != asset.ID {
			return nil, fmt.Errorf("资产当前版本不存在")
		}
		result[asset.ID] = CurrentReference{
			Asset:   *asset,
			Version: *version,
			Content: jsonValue(version.Content),
		}
	}
	return result, nil
}

func distinctAssetReferenceIDs(assetIDs []uint64) []uint64 {
	result := make([]uint64, 0, len(assetIDs))
	seen := make(map[uint64]struct{}, len(assetIDs))
	for _, assetID := range assetIDs {
		if assetID == 0 {
			continue
		}
		if _, exists := seen[assetID]; exists {
			continue
		}
		seen[assetID] = struct{}{}
		result = append(result, assetID)
	}
	return result
}

func (s Service) Query(ctx context.Context, req QueryRequest) (map[string]any, error) {
	if req.TeamID == 0 {
		return nil, fmt.Errorf("团队不能为空")
	}
	normalized, err := normalizeQueryRequest(req)
	if err != nil {
		return nil, err
	}
	scope, err := resolveTeamAssetScope(ctx, normalized.TeamID)
	if err != nil {
		return nil, err
	}
	if normalized.ProjectID > 0 {
		if _, exists := scope.ProjectIDs[normalized.ProjectID]; !exists {
			return nil, fmt.Errorf("项目不存在或不属于当前用户")
		}
	}
	if normalized.CollectionID > 0 {
		collection := assetmodel.NewAssetModel().Find(ctx, map[string]any{
			"id":            normalized.CollectionID,
			"team_id":       normalized.TeamID,
			"kind":          assetmodel.KindCollection,
			"collection_id": uint64(0),
		})
		if !scope.contains(collection) ||
			(collection.Status != assetmodel.StatusCurrent && collection.Status != assetmodel.StatusDeleted) {
			return nil, fmt.Errorf("资产集合不存在或不属于当前用户")
		}
	}
	scopeFilter := scope.queryFilter()
	page, pageSize := normalizeAssetPage(normalized.Page, normalized.PageSize)
	if scopeFilter == nil {
		return emptyAssetPage(page, pageSize), nil
	}
	status, order := assetQueryState(normalized.View)
	filter := map[string]any{
		"team_id":    normalized.TeamID,
		"status":     status,
		"version_id": map[string]any{"gt": 0},
		"or":         scopeFilter["or"],
	}
	if normalized.SourceType != "" {
		filter["source_type"] = normalized.SourceType
	}
	if normalized.SourceID > 0 {
		filter["source_id"] = normalized.SourceID
	}
	if normalized.ProjectID > 0 {
		filter["project_id"] = normalized.ProjectID
	}
	if normalized.AssetCateID > 0 {
		filter["asset_cate_id"] = normalized.AssetCateID
	}
	filter["collection_id"] = normalized.CollectionID
	if normalized.NodeKey != "" {
		filter["node_key"] = normalized.NodeKey
	}
	if normalized.Role != "" {
		filter["role"] = normalized.Role
	}
	if !teamHasEnabledAssetCates(ctx, normalized.TeamID) {
		filter["role"] = assetmodel.RoleMaterial
	}
	if normalized.Kind != "" {
		if normalized.CollectionID == 0 && normalized.Kind != assetmodel.KindCollection {
			filter["kind"] = []string{normalized.Kind, assetmodel.KindCollection}
		} else {
			filter["kind"] = normalized.Kind
		}
	}

	assetModel := assetmodel.NewAssetModel()
	total := int(assetModel.Count(ctx, filter))
	rows := assetModel.Select(ctx, filter, map[string]any{
		"order":    order,
		"page":     page,
		"pageSize": pageSize,
	})
	versions := currentVersionsByID(ctx, rows, normalized.ContentMode)
	items := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row == nil || row.VersionID == 0 {
			continue
		}
		version := versions[row.VersionID]
		item := assetListMap(*row, version, normalized.ContentMode)
		items = append(items, item)
	}
	attachCollectionListMetadata(ctx, rows, items, status)
	return map[string]any{
		"items":     items,
		"page":      page,
		"page_size": pageSize,
		"total":     total,
		"has_more":  page*pageSize < total,
	}, nil
}

func (s Service) Filters(ctx context.Context, teamID uint64) (map[string]any, error) {
	if teamID == 0 {
		return nil, fmt.Errorf("团队不能为空")
	}
	scope, err := resolveTeamAssetScope(ctx, teamID)
	if err != nil {
		return nil, err
	}
	projectRows := append([]projectmodel.Project(nil), scope.Projects...)
	sort.Slice(projectRows, func(i, j int) bool {
		return projectRows[i].ID > projectRows[j].ID
	})
	projects := make([]map[string]any, 0, len(projectRows))
	for _, project := range projectRows {
		projects = append(projects, map[string]any{"id": project.ID, "name": project.Name})
	}
	nodes := make([]map[string]any, 0)
	tools := make([]map[string]any, 0)
	dialogues := make([]map[string]any, 0)
	seenNodes := map[string]struct{}{}
	scopeFilter := scope.queryFilter()
	if scopeFilter == nil {
		return map[string]any{
			"projects":  projects,
			"tools":     tools,
			"dialogues": dialogues,
			"nodes":     nodes,
		}, nil
	}
	sourceFilter := scopedAssetFilter(teamID, scopeFilter)
	sourceFilter["source_type"] = []string{assetmodel.SourceTool, assetmodel.SourceDialogue}
	sourceRows := assetmodel.NewAssetModel().Select(ctx, sourceFilter, map[string]any{
		"field": "main.id,main.source_type,main.source_id,main.source_name,main.name",
		"order": "main.id desc",
	})
	tools = savedSourceOptions(sourceRows, assetmodel.SourceTool)
	dialogues = savedSourceOptions(sourceRows, assetmodel.SourceDialogue)

	nodeFilter := scopedAssetFilter(teamID, scopeFilter)
	nodeFilter["source_type"] = assetmodel.SourceProject
	nodeFilter["collection_id"] = uint64(0)
	nodeFilter["kind"] = map[string]any{"neq": assetmodel.KindCollection}
	nodeFilter["node_key"] = map[string]any{"neq": ""}
	nodeRows := assetmodel.NewAssetModel().Select(ctx, nodeFilter, map[string]any{
		"field": "main.id,main.project_id,main.flow_id,main.asset_cate_id,main.node_key,main.name,main.version_id",
		"order": "main.id desc",
	})
	nodeNames := flowNodeNames(ctx, nodeRows)
	for _, asset := range nodeRows {
		if asset == nil || asset.SourceType != assetmodel.SourceProject ||
			asset.VersionID == 0 || strings.TrimSpace(asset.NodeKey) == "" {
			continue
		}
		key := fmt.Sprintf("%d:%d:%s", asset.ProjectID, asset.AssetCateID, asset.NodeKey)
		if _, exists := seenNodes[key]; exists {
			continue
		}
		seenNodes[key] = struct{}{}
		nodes = append(nodes, map[string]any{
			"project_id":    asset.ProjectID,
			"asset_cate_id": asset.AssetCateID,
			"node_key":      asset.NodeKey,
			"name":          firstNonEmptyText(nodeNames[flowNodeIdentity(asset.FlowID, asset.NodeKey)], asset.Name),
		})
	}
	return map[string]any{
		"projects":  projects,
		"tools":     tools,
		"dialogues": dialogues,
		"nodes":     nodes,
	}, nil
}

func savedSourceOptions(assets []*assetmodel.Asset, sourceType string) []map[string]any {
	result := make([]map[string]any, 0)
	seen := map[uint64]struct{}{}
	for _, asset := range assets {
		if asset == nil || asset.SourceType != sourceType || asset.SourceID == 0 {
			continue
		}
		if _, exists := seen[asset.SourceID]; exists {
			continue
		}
		seen[asset.SourceID] = struct{}{}
		name := strings.TrimSpace(asset.SourceName)
		if name == "" {
			name = strings.TrimSpace(asset.Name)
		}
		if name == "" {
			name = "未命名来源"
		}
		result = append(result, map[string]any{
			"id":   asset.SourceID,
			"name": name,
		})
	}
	return result
}

func scopedAssetFilter(teamID uint64, scopeFilter map[string]any) map[string]any {
	return map[string]any{
		"team_id":    teamID,
		"status":     []string{assetmodel.StatusCurrent, assetmodel.StatusDeleted},
		"version_id": map[string]any{"gt": 0},
		"or":         scopeFilter["or"],
	}
}

func (s Service) TeamDetail(ctx context.Context, teamID uint64, assetID uint64) (map[string]any, error) {
	asset, err := s.requireTeamAsset(ctx, teamID, assetID)
	if err != nil {
		return nil, err
	}
	return s.detail(ctx, *asset), nil
}

func (s Service) detail(ctx context.Context, asset assetmodel.Asset) map[string]any {
	page := s.versionPage(ctx, asset, VersionPageRequest{})
	return map[string]any{
		"asset":         s.AssetDetailMap(ctx, asset, nil),
		"versions":      page["items"],
		"version_total": page["total"],
		"has_more":      page["has_more"],
	}
}

func (s Service) TeamVersionPage(ctx context.Context, teamID uint64, assetID uint64, req VersionPageRequest) (map[string]any, error) {
	asset, err := s.requireTeamAsset(ctx, teamID, assetID)
	if err != nil {
		return nil, err
	}
	return s.versionPage(ctx, *asset, req), nil
}

func (s Service) TeamVersionDetail(ctx context.Context, teamID uint64, assetID uint64, versionID uint64) (map[string]any, error) {
	asset, err := s.requireTeamAsset(ctx, teamID, assetID)
	if err != nil {
		return nil, err
	}
	return s.versionDetail(ctx, *asset, versionID)
}

func (s Service) versionDetail(ctx context.Context, asset assetmodel.Asset, versionID uint64) (map[string]any, error) {
	version := s.FindVersion(ctx, versionID)
	if version == nil || version.AssetID != asset.ID {
		return nil, fmt.Errorf("资产版本不存在")
	}
	return map[string]any{"version": VersionToMap(*version)}, nil
}

func (s Service) SetTeamCurrentVersion(ctx context.Context, teamID uint64, assetID uint64, versionID uint64) (map[string]any, error) {
	asset, err := s.requireTeamAsset(ctx, teamID, assetID)
	if err != nil {
		return nil, err
	}
	version := s.FindVersion(ctx, versionID)
	if version == nil || version.AssetID != asset.ID {
		return nil, fmt.Errorf("资产版本不存在")
	}
	return s.setCurrentVersion(ctx, *asset, *version)
}

func (s Service) setCurrentVersion(ctx context.Context, asset assetmodel.Asset, version assetmodel.Version) (map[string]any, error) {
	if err := ensureAssetMutable(&asset); err != nil {
		return nil, err
	}
	affected := assetmodel.NewAssetModel().Update(ctx, map[string]any{
		"id":     asset.ID,
		"status": map[string]any{"neq": assetmodel.StatusDeleted},
	}, map[string]any{
		"version_id": version.ID,
		"status":     assetmodel.StatusCurrent,
		"deleted_at": nil,
	})
	if affected == 0 {
		return nil, fmt.Errorf("资产已移入回收站")
	}
	updated := s.Find(ctx, asset.ID)
	if updated == nil {
		return nil, fmt.Errorf("读取资产失败")
	}
	return map[string]any{"asset": s.AssetDetailMap(ctx, *updated, &version)}, nil
}

func (s Service) requireTeamAsset(ctx context.Context, teamID uint64, assetID uint64) (*assetmodel.Asset, error) {
	if teamID == 0 || assetID == 0 {
		return nil, fmt.Errorf("团队和资产不能为空")
	}
	scope, err := resolveTeamAssetScope(ctx, teamID)
	if err != nil {
		return nil, err
	}
	asset := s.Find(ctx, assetID)
	if !scope.contains(asset) {
		return nil, fmt.Errorf("资产不存在或不属于当前团队")
	}
	return asset, nil
}

func normalizeQueryRequest(req QueryRequest) (QueryRequest, error) {
	req.SourceType = strings.ToLower(strings.TrimSpace(req.SourceType))
	req.NodeKey = strings.TrimSpace(req.NodeKey)
	req.Role = strings.ToLower(strings.TrimSpace(req.Role))
	req.Kind = strings.ToLower(strings.TrimSpace(req.Kind))
	req.View = strings.ToLower(strings.TrimSpace(req.View))
	req.ContentMode = strings.ToLower(strings.TrimSpace(req.ContentMode))
	if req.View == "" {
		req.View = QueryViewAssets
	}
	if req.View != QueryViewAssets && req.View != QueryViewTrash {
		return QueryRequest{}, fmt.Errorf("资产视图不合法")
	}
	if req.ContentMode == "" {
		req.ContentMode = QueryContentFull
	}
	if req.ContentMode != QueryContentFull && req.ContentMode != QueryContentPreview {
		return QueryRequest{}, fmt.Errorf("资产内容模式不合法")
	}
	if req.SourceType != "" {
		switch req.SourceType {
		case assetmodel.SourceProject, assetmodel.SourceTool, assetmodel.SourceDialogue, assetmodel.SourceUpload:
		default:
			return QueryRequest{}, fmt.Errorf("资产来源不合法")
		}
	}
	if req.ProjectID > 0 {
		req.SourceType = assetmodel.SourceProject
		req.SourceID = req.ProjectID
	}
	if req.SourceType != assetmodel.SourceProject {
		req.ProjectID = 0
		req.AssetCateID = 0
		req.NodeKey = ""
		req.Role = ""
	}
	if req.Role != "" && req.Role != assetmodel.RoleWork && req.Role != assetmodel.RoleMaterial {
		return QueryRequest{}, fmt.Errorf("资产业务角色不合法")
	}
	if req.Kind != "" {
		switch req.Kind {
		case assetmodel.KindText,
			assetmodel.KindImage,
			assetmodel.KindAudio,
			assetmodel.KindVideo,
			assetmodel.KindRichText,
			assetmodel.KindFile,
			assetmodel.KindCollection:
		default:
			return QueryRequest{}, fmt.Errorf("资产类型不合法")
		}
	}
	return req, nil
}

func assetQueryState(view string) (string, string) {
	if view == QueryViewTrash {
		return assetmodel.StatusDeleted, "main.deleted_at desc,main.id desc"
	}
	return assetmodel.StatusCurrent, "main.id desc"
}

func normalizeAssetPage(page int, pageSize int) (int, int) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = defaultAssetPageSize
	}
	if pageSize > maxAssetPageSize {
		pageSize = maxAssetPageSize
	}
	return page, pageSize
}

func emptyAssetPage(page int, pageSize int) map[string]any {
	return map[string]any{
		"items":     []map[string]any{},
		"page":      page,
		"page_size": pageSize,
		"total":     0,
		"has_more":  false,
	}
}

func teamHasEnabledAssetCates(ctx context.Context, teamID uint64) bool {
	return teammodel.NewAssetCateModel().Count(ctx, map[string]any{
		"team_id": teamID,
		"status":  teammodel.StatusEnabled,
	}) > 0
}

func currentVersionsByID(ctx context.Context, assets []*assetmodel.Asset, contentMode string) map[uint64]*assetmodel.Version {
	versionIDs := make([]uint64, 0, len(assets))
	for _, asset := range assets {
		if asset != nil && asset.VersionID > 0 {
			versionIDs = append(versionIDs, asset.VersionID)
		}
	}
	result := make(map[uint64]*assetmodel.Version, len(versionIDs))
	if len(versionIDs) == 0 {
		return result
	}
	options := map[string]any{}
	if contentMode == QueryContentPreview {
		options["field"] = "main.id,main.asset_id,main.version,main.content,main.created_at,main.updated_at"
	}
	for _, version := range assetmodel.NewVersionModel().Select(ctx, map[string]any{"id": versionIDs}, options) {
		if version != nil {
			result[version.ID] = version
		}
	}
	return result
}

func assetListMap(row assetmodel.Asset, current *assetmodel.Version, contentMode string) map[string]any {
	item := AssetToMap(row)
	if current == nil {
		return item
	}
	content := jsonValue(current.Content)
	summary := versionContentSummary(content, row.Kind)
	item["summary"] = summary
	if contentMode == QueryContentFull {
		item["version"] = VersionToMap(*current)
		return item
	}
	updatedAt := current.CreatedAt
	if current.UpdatedAt != nil && !current.UpdatedAt.IsZero() {
		updatedAt = *current.UpdatedAt
	}
	item["version"] = map[string]any{
		"id":         current.ID,
		"asset_id":   current.AssetID,
		"version":    current.Version,
		"content":    assetPreviewContent(content, row.Kind),
		"summary":    summary,
		"created_at": current.CreatedAt,
		"updated_at": updatedAt,
	}
	return item
}

func assetPreviewContent(content any, kind string) any {
	kind = NormalizeKind(kind)
	if len(mediaContentKeys(kind)) == 0 {
		return nil
	}
	url := contentMediaURL(content, kind, 0)
	if url == "" {
		return nil
	}
	return mediaDocument(kind, url)
}

func flowNodeNames(ctx context.Context, assets []*assetmodel.Asset) map[string]string {
	flowIDs := make([]uint64, 0)
	nodeKeys := make([]string, 0)
	seenFlows := map[uint64]struct{}{}
	seenNodeKeys := map[string]struct{}{}
	for _, asset := range assets {
		if asset == nil || asset.FlowID == 0 || strings.TrimSpace(asset.NodeKey) == "" {
			continue
		}
		if _, exists := seenFlows[asset.FlowID]; !exists {
			seenFlows[asset.FlowID] = struct{}{}
			flowIDs = append(flowIDs, asset.FlowID)
		}
		nodeKey := strings.TrimSpace(asset.NodeKey)
		if _, exists := seenNodeKeys[nodeKey]; !exists {
			seenNodeKeys[nodeKey] = struct{}{}
			nodeKeys = append(nodeKeys, nodeKey)
		}
	}
	result := map[string]string{}
	if len(flowIDs) == 0 {
		return result
	}
	for _, node := range teammodel.NewFlowNodeModel().Select(ctx, map[string]any{
		"flow_id":  flowIDs,
		"node_key": nodeKeys,
	}, map[string]any{
		"field": "main.flow_id,main.node_key,main.name",
		"order": "",
	}) {
		if node != nil {
			result[flowNodeIdentity(node.FlowID, node.NodeKey)] = strings.TrimSpace(node.Name)
		}
	}
	return result
}

func flowNodeIdentity(flowID uint64, nodeKey string) string {
	return fmt.Sprintf("%d:%s", flowID, strings.TrimSpace(nodeKey))
}

func firstNonEmptyText(values ...string) string {
	for _, value := range values {
		if value = strings.TrimSpace(value); value != "" {
			return value
		}
	}
	return "未命名节点"
}
