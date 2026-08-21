package materiallibrary

import (
	"context"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
)

const ReferenceType = "material"

var supportedKinds = []KindOption{
	{ID: teammodel.MaterialKindPrompt, Name: "提示词", AssetKind: "text"},
	{ID: teammodel.MaterialKindImage, Name: "图片", AssetKind: "image"},
	{ID: teammodel.MaterialKindAudio, Name: "音频", AssetKind: "audio"},
	{ID: teammodel.MaterialKindVideo, Name: "视频", AssetKind: "video"},
}

type Service struct{}

type Pack struct {
	ID          uint64 `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type KindOption struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	AssetKind string `json:"asset_kind"`
}

type Category struct {
	ID   uint64 `json:"id"`
	Name string `json:"name"`
	Kind string `json:"kind"`
	Sort int    `json:"sort"`
}

type Material struct {
	ID          uint64    `json:"id"`
	CateID      uint64    `json:"cate_id"`
	CateName    string    `json:"cate_name"`
	Kind        string    `json:"kind"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Content     string    `json:"content"`
	ResourceURL string    `json:"resource_url"`
	Sort        int       `json:"sort"`
	ItemSort    int       `json:"item_sort"`
	ItemID      uint64    `json:"item_id"`
	CreatedAt   time.Time `json:"created_at"`
}

type Snapshot struct {
	Enabled    bool         `json:"enabled"`
	Pack       Pack         `json:"pack"`
	Kinds      []KindOption `json:"kinds"`
	Categories []Category   `json:"categories"`
	Materials  []Material   `json:"-"`
}

type QueryRequest struct {
	Kind     string
	CateID   uint64
	Page     int
	PageSize int
}

type Page struct {
	Items    []Material `json:"items"`
	Page     int        `json:"page"`
	PageSize int        `json:"page_size"`
	Total    int        `json:"total"`
	HasMore  bool       `json:"has_more"`
}

type sourceRows struct {
	Pack       *teammodel.MaterialPack
	Items      []teammodel.MaterialPackItem
	Materials  []teammodel.Material
	Categories []teammodel.MaterialCate
}

func NewService() Service {
	return Service{}
}

func (Service) Catalog(ctx context.Context, teamID uint64) (Snapshot, error) {
	return loadSnapshot(ctx, teamID)
}

func (Service) Query(ctx context.Context, teamID uint64, request QueryRequest) (Page, error) {
	snapshot, err := loadSnapshot(ctx, teamID)
	if err != nil {
		return Page{}, err
	}
	return snapshot.Query(request), nil
}

func (Service) Require(ctx context.Context, teamID uint64, materialID uint64) (Material, error) {
	if materialID == 0 {
		return Material{}, fmt.Errorf("官方素材不能为空")
	}
	snapshot, err := loadSnapshot(ctx, teamID)
	if err != nil {
		return Material{}, err
	}
	return snapshot.Require(materialID)
}

func (snapshot Snapshot) Query(request QueryRequest) Page {
	request.Kind = normalizeKind(request.Kind)
	request.Page, request.PageSize = normalizePage(request.Page, request.PageSize)
	filtered := make([]Material, 0, len(snapshot.Materials))
	for _, material := range snapshot.Materials {
		if request.Kind != "" && material.Kind != request.Kind {
			continue
		}
		if request.CateID > 0 && material.CateID != request.CateID {
			continue
		}
		filtered = append(filtered, material)
	}
	start := (request.Page - 1) * request.PageSize
	if start > len(filtered) {
		start = len(filtered)
	}
	end := start + request.PageSize
	if end > len(filtered) {
		end = len(filtered)
	}
	items := append([]Material(nil), filtered[start:end]...)
	return Page{
		Items:    items,
		Page:     request.Page,
		PageSize: request.PageSize,
		Total:    len(filtered),
		HasMore:  end < len(filtered),
	}
}

func (snapshot Snapshot) Require(materialID uint64) (Material, error) {
	for _, material := range snapshot.Materials {
		if material.ID == materialID {
			return material, nil
		}
	}
	return Material{}, fmt.Errorf("官方素材不存在、已停用或不属于当前团队素材方案")
}

func (material Material) AssetKind() string {
	for _, option := range supportedKinds {
		if option.ID == material.Kind {
			return option.AssetKind
		}
	}
	return "text"
}

func (material Material) PreviewContent() any {
	if material.Kind == teammodel.MaterialKindPrompt {
		return map[string]any{"text": strings.TrimSpace(material.Content)}
	}
	field := material.Kind + "s"
	return map[string]any{field: []string{strings.TrimSpace(material.ResourceURL)}}
}

func loadSnapshot(ctx context.Context, teamID uint64) (Snapshot, error) {
	packID, err := publishedMaterialPackID(ctx, teamID)
	if err != nil {
		return Snapshot{}, err
	}
	if packID == 0 {
		return emptySnapshot(), nil
	}
	pack := teammodel.NewMaterialPackModel().Find(ctx, map[string]any{
		"id":     packID,
		"status": teammodel.StatusEnabled,
	})
	if pack == nil {
		return emptySnapshot(), nil
	}
	itemRows := teammodel.NewMaterialPackItemModel().Select(ctx, map[string]any{
		"pack_id": packID,
		"status":  teammodel.StatusEnabled,
	})
	items := make([]teammodel.MaterialPackItem, 0, len(itemRows))
	materialIDs := make([]uint64, 0, len(itemRows))
	for _, row := range itemRows {
		if row == nil {
			continue
		}
		items = append(items, *row)
		materialIDs = append(materialIDs, row.MaterialID)
	}
	if len(materialIDs) == 0 {
		return buildSnapshot(sourceRows{Pack: pack}), nil
	}
	materialRows := teammodel.NewMaterialModel().Select(ctx, map[string]any{
		"id":     materialIDs,
		"status": teammodel.StatusEnabled,
	})
	materials := make([]teammodel.Material, 0, len(materialRows))
	cateIDs := make([]uint64, 0, len(materialRows))
	for _, row := range materialRows {
		if row == nil {
			continue
		}
		materials = append(materials, *row)
		cateIDs = append(cateIDs, row.CateID)
	}
	categoryRows := teammodel.NewMaterialCateModel().Select(ctx, map[string]any{
		"id":     cateIDs,
		"status": teammodel.StatusEnabled,
	})
	categories := make([]teammodel.MaterialCate, 0, len(categoryRows))
	for _, row := range categoryRows {
		if row != nil {
			categories = append(categories, *row)
		}
	}
	return buildSnapshot(sourceRows{
		Pack:       pack,
		Items:      items,
		Materials:  materials,
		Categories: categories,
	}), nil
}

func publishedMaterialPackID(ctx context.Context, teamID uint64) (uint64, error) {
	if teamID == 0 {
		return 0, fmt.Errorf("团队不能为空")
	}
	team := teammodel.NewTeamModel().Find(ctx, map[string]any{
		"id":     teamID,
		"status": teammodel.StatusEnabled,
	})
	if team == nil {
		return 0, fmt.Errorf("团队不存在或已停用")
	}
	var release *teammodel.TeamRelease
	if team.CurrentReleaseID > 0 {
		release = teammodel.NewTeamReleaseModel().Find(ctx, map[string]any{
			"id":      team.CurrentReleaseID,
			"team_id": team.ID,
			"status":  teammodel.TeamReleaseStatusCurrent,
		})
	}
	if release == nil {
		release = teammodel.NewTeamReleaseModel().Find(ctx, map[string]any{
			"team_id": team.ID,
			"status":  teammodel.TeamReleaseStatusCurrent,
		})
	}
	if release == nil {
		return 0, nil
	}
	var snapshot struct {
		Team struct {
			ID             uint64 `json:"id"`
			MaterialPackID uint64 `json:"material_pack_id"`
		} `json:"team"`
	}
	if err := json.Unmarshal([]byte(release.Snapshot), &snapshot); err != nil {
		return 0, fmt.Errorf("团队发布快照无效: %w", err)
	}
	if snapshot.Team.ID != team.ID {
		return 0, fmt.Errorf("团队发布快照与当前团队不匹配")
	}
	return snapshot.Team.MaterialPackID, nil
}

func buildSnapshot(rows sourceRows) Snapshot {
	if rows.Pack == nil || rows.Pack.ID == 0 || rows.Pack.Status != teammodel.StatusEnabled {
		return emptySnapshot()
	}
	categoryByID := make(map[uint64]teammodel.MaterialCate, len(rows.Categories))
	for _, category := range rows.Categories {
		if category.ID == 0 || category.Status != teammodel.StatusEnabled || normalizeKind(category.Kind) == "" {
			continue
		}
		category.Kind = normalizeKind(category.Kind)
		categoryByID[category.ID] = category
	}
	materialByID := make(map[uint64]teammodel.Material, len(rows.Materials))
	for _, material := range rows.Materials {
		material.Kind = normalizeKind(material.Kind)
		category, categoryExists := categoryByID[material.CateID]
		if material.ID == 0 || material.Status != teammodel.StatusEnabled || material.Kind == "" ||
			!categoryExists || category.Kind != material.Kind || !usableMaterial(material) {
			continue
		}
		materialByID[material.ID] = material
	}
	items := append([]teammodel.MaterialPackItem(nil), rows.Items...)
	sort.SliceStable(items, func(i, j int) bool {
		if items[i].Sort == items[j].Sort {
			return items[i].ID < items[j].ID
		}
		return items[i].Sort < items[j].Sort
	})
	materials := make([]Material, 0, len(items))
	usedCategoryIDs := map[uint64]struct{}{}
	usedKinds := map[string]struct{}{}
	seenMaterials := map[uint64]struct{}{}
	for _, item := range items {
		material, exists := materialByID[item.MaterialID]
		if item.PackID != rows.Pack.ID || item.Status != teammodel.StatusEnabled || !exists {
			continue
		}
		if _, duplicate := seenMaterials[material.ID]; duplicate {
			continue
		}
		seenMaterials[material.ID] = struct{}{}
		category := categoryByID[material.CateID]
		materials = append(materials, Material{
			ID:          material.ID,
			CateID:      material.CateID,
			CateName:    category.Name,
			Kind:        material.Kind,
			Name:        material.Name,
			Description: material.Description,
			Content:     material.Content,
			ResourceURL: material.ResourceURL,
			Sort:        material.Sort,
			ItemSort:    item.Sort,
			ItemID:      item.ID,
			CreatedAt:   material.CreatedAt,
		})
		usedCategoryIDs[category.ID] = struct{}{}
		usedKinds[material.Kind] = struct{}{}
	}
	categories := make([]Category, 0, len(usedCategoryIDs))
	for categoryID := range usedCategoryIDs {
		category := categoryByID[categoryID]
		categories = append(categories, Category{
			ID:   category.ID,
			Name: category.Name,
			Kind: category.Kind,
			Sort: category.Sort,
		})
	}
	sort.SliceStable(categories, func(i, j int) bool {
		if categories[i].Sort == categories[j].Sort {
			return categories[i].ID < categories[j].ID
		}
		return categories[i].Sort < categories[j].Sort
	})
	kinds := make([]KindOption, 0, len(usedKinds))
	for _, option := range supportedKinds {
		if _, exists := usedKinds[option.ID]; exists {
			kinds = append(kinds, option)
		}
	}
	return Snapshot{
		Enabled:    true,
		Pack:       Pack{ID: rows.Pack.ID, Name: rows.Pack.Name, Description: rows.Pack.Description},
		Kinds:      kinds,
		Categories: categories,
		Materials:  materials,
	}
}

func emptySnapshot() Snapshot {
	return Snapshot{
		Kinds:      []KindOption{},
		Categories: []Category{},
		Materials:  []Material{},
	}
}

func normalizeKind(kind string) string {
	kind = strings.ToLower(strings.TrimSpace(kind))
	for _, option := range supportedKinds {
		if kind == option.ID {
			return kind
		}
	}
	return ""
}

func usableMaterial(material teammodel.Material) bool {
	if material.Kind == teammodel.MaterialKindPrompt {
		return strings.TrimSpace(material.Content) != ""
	}
	return strings.TrimSpace(material.ResourceURL) != ""
}

func normalizePage(page int, pageSize int) (int, int) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 24
	}
	if pageSize > 100 {
		pageSize = 100
	}
	return page, pageSize
}
