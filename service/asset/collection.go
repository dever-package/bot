package asset

import (
	"context"
	"crypto/sha1"
	"encoding/hex"
	"fmt"
	"strings"
	"time"

	assetmodel "github.com/dever-package/bot/model/asset"
	"github.com/shemic/dever/orm"
)

type EnsureProjectCollectionRequest struct {
	ProjectID     uint64
	CanvasID      uint64
	BodyID        uint64
	TeamID        uint64
	AssetCateID   uint64
	RunID         uint64
	NodeRunID     uint64
	ReleaseID     uint64
	SourceNodeKey string
	Name          string
	Content       any
}

func (s Service) EnsureProjectCollection(ctx context.Context, req EnsureProjectCollectionRequest) (*assetmodel.Asset, error) {
	req.SourceNodeKey = strings.TrimSpace(req.SourceNodeKey)
	req.Name = strings.TrimSpace(req.Name)
	if req.ProjectID == 0 || req.TeamID == 0 || req.SourceNodeKey == "" {
		return nil, fmt.Errorf("创建资产集合缺少分镜来源")
	}
	if req.Name == "" {
		if existing := assetmodel.NewAssetModel().Find(ctx, map[string]any{
			"project_id":    req.ProjectID,
			"canvas_id":     req.CanvasID,
			"team_id":       req.TeamID,
			"asset_cate_id": req.AssetCateID,
			"node_key":      req.SourceNodeKey,
			"kind":          assetmodel.KindCollection,
			"status":        map[string]any{"neq": assetmodel.StatusDeleted},
		}); existing != nil {
			req.Name = strings.TrimSpace(existing.Name)
		}
	}
	if req.Name == "" {
		req.Name = "分镜脚本"
	}
	requestID := projectCollectionRequestID(req.ProjectID, req.CanvasID, req.AssetCateID, req.SourceNodeKey)
	content := req.Content
	if content == nil {
		content = map[string]any{
			"type":            assetmodel.KindCollection,
			"source_node_key": req.SourceNodeKey,
		}
	}
	asset, _, err := s.SaveVersion(ctx, SaveVersionRequest{
		ProjectID:   req.ProjectID,
		CanvasID:    req.CanvasID,
		BodyID:      req.BodyID,
		TeamID:      req.TeamID,
		AssetCateID: req.AssetCateID,
		RunID:       req.RunID,
		NodeRunID:   req.NodeRunID,
		ReleaseID:   req.ReleaseID,
		RequestID:   requestID,
		NodeKey:     req.SourceNodeKey,
		Source: map[string]any{
			"collection_source_node_key": req.SourceNodeKey,
		},
		Name:    req.Name,
		Kind:    assetmodel.KindCollection,
		Role:    assetmodel.RoleMaterial,
		Content: content,
	})
	if err != nil {
		return nil, err
	}
	return asset, nil
}

func projectCollectionRequestID(projectID uint64, canvasID uint64, assetCateID uint64, sourceNodeKey string) string {
	sum := sha1.Sum([]byte(fmt.Sprintf("%d\x1f%d\x1f%d\x1f%s", projectID, canvasID, assetCateID, strings.TrimSpace(sourceNodeKey))))
	token := hex.EncodeToString(sum[:])
	return "asset-collection:" + token
}

// ReconcileProjectCollectionChildren keeps a generated collection aligned
// with the latest structured output. It only removes current children that
// are no longer present; historical versions remain available for auditing.
func (s Service) ReconcileProjectCollectionChildren(
	ctx context.Context,
	teamID uint64,
	collectionID uint64,
	activeAssetIDs []uint64,
) error {
	if teamID == 0 || collectionID == 0 {
		return fmt.Errorf("同步资产集合缺少范围")
	}
	collection := assetmodel.NewAssetModel().Find(ctx, map[string]any{
		"id":            collectionID,
		"team_id":       teamID,
		"kind":          assetmodel.KindCollection,
		"collection_id": uint64(0),
		"status":        assetmodel.StatusCurrent,
	})
	if collection == nil {
		return fmt.Errorf("资产集合不存在或已不可用")
	}
	active := make(map[uint64]struct{}, len(activeAssetIDs))
	for _, assetID := range activeAssetIDs {
		if assetID > 0 {
			active[assetID] = struct{}{}
		}
	}
	children := assetmodel.NewAssetModel().Select(ctx, map[string]any{
		"user_id":       collection.UserID,
		"team_id":       teamID,
		"collection_id": collectionID,
		"status":        assetmodel.StatusCurrent,
	})
	staleIDs := make([]uint64, 0)
	for _, child := range children {
		if child == nil {
			continue
		}
		if _, exists := active[child.ID]; !exists {
			staleIDs = append(staleIDs, child.ID)
		}
	}
	if len(staleIDs) == 0 {
		return nil
	}
	deletedAt := time.Now()
	return orm.Transaction(ctx, func(tx context.Context) error {
		assetModel := assetmodel.NewAssetModel()
		for _, assetID := range staleIDs {
			if assetModel.Update(tx, map[string]any{
				"id":            assetID,
				"user_id":       collection.UserID,
				"team_id":       teamID,
				"collection_id": collectionID,
				"status":        assetmodel.StatusCurrent,
			}, map[string]any{
				"status":     assetmodel.StatusDeleted,
				"deleted_at": deletedAt,
			}) == 0 {
				return fmt.Errorf("同步资产集合失败")
			}
		}
		return nil
	})
}

type collectionCountRow struct {
	CollectionID uint64 `db:"collection_id"`
	Count        int    `db:"collection_count"`
}

type collectionCoverRow struct {
	ID           uint64 `db:"id"`
	CollectionID uint64 `db:"collection_id"`
	Kind         string `db:"kind"`
	VersionID    uint64 `db:"version_id"`
}

const collectionPreviewLimit = 4

type collectionChildFilter struct {
	userID, teamID, projectID, canvasID uint64
	status, kind, role                  string
}

func (filter collectionChildFilter) where(collectionIDs []uint64) (string, []any) {
	where := "user_id = ? AND team_id = ? AND status = ? AND version_id > 0"
	args := []any{filter.userID, filter.teamID, filter.status}
	if len(collectionIDs) == 0 {
		where += " AND collection_id > 0"
	} else {
		placeholders := strings.TrimSuffix(strings.Repeat("?,", len(collectionIDs)), ",")
		where += " AND collection_id IN (" + placeholders + ")"
		for _, collectionID := range collectionIDs {
			args = append(args, collectionID)
		}
	}
	if filter.projectID > 0 {
		where += " AND project_id = ?"
		args = append(args, filter.projectID)
	}
	if filter.canvasID > 0 {
		where += " AND canvas_id = ?"
		args = append(args, filter.canvasID)
	}
	if filter.role != "" {
		where += " AND role = ?"
		args = append(args, filter.role)
	}
	if filter.kind != "" {
		where += " AND kind = ?"
		args = append(args, filter.kind)
	}
	return where, args
}

func attachCollectionListMetadata(
	ctx context.Context,
	rows []*assetmodel.Asset,
	items []map[string]any,
	filter collectionChildFilter,
	counts map[uint64]int,
) error {
	collectionItems := make(map[uint64]map[string]any)
	collectionIDs := make([]uint64, 0)
	itemsByID := make(map[uint64]map[string]any, len(items))
	for _, item := range items {
		if id, ok := item["id"].(uint64); ok && id > 0 {
			itemsByID[id] = item
		}
	}
	for _, row := range rows {
		if row == nil || row.Kind != assetmodel.KindCollection {
			continue
		}
		item := itemsByID[row.ID]
		if item == nil {
			continue
		}
		collectionIDs = append(collectionIDs, row.ID)
		collectionItems[row.ID] = item
	}
	if len(collectionIDs) == 0 {
		return nil
	}
	if counts == nil {
		var err error
		counts, err = collectionListCounts(ctx, filter, collectionIDs)
		if err != nil {
			return err
		}
	}
	coverRows, err := collectionListCovers(ctx, filter, collectionIDs)
	if err != nil {
		return err
	}
	covers := make(map[uint64][]*assetmodel.Asset, len(collectionIDs))
	for _, cover := range coverRows {
		covers[cover.CollectionID] = append(covers[cover.CollectionID], cover)
	}
	versions := currentVersionsByID(ctx, coverRows, QueryContentPreview)
	for collectionID, item := range collectionItems {
		previews := make([]map[string]any, 0, len(covers[collectionID]))
		for _, cover := range covers[collectionID] {
			version := versions[cover.VersionID]
			if version == nil {
				continue
			}
			content := assetPreviewContent(jsonValue(version.Content), cover.Kind)
			if content == nil {
				continue
			}
			previews = append(previews, map[string]any{
				"id":      cover.ID,
				"kind":    cover.Kind,
				"content": content,
			})
		}
		item["collection_count"] = counts[collectionID]
		item["collection_previews"] = previews
	}
	return nil
}

func collectionListCounts(ctx context.Context, filter collectionChildFilter, collectionIDs []uint64) (map[uint64]int, error) {
	config := assetmodel.NewAssetModel().Config()
	db, err := orm.Get(config.Database)
	if err != nil {
		return nil, err
	}
	where, args := filter.where(collectionIDs)
	countSQL := fmt.Sprintf(`SELECT collection_id, COUNT(*) AS collection_count FROM %s WHERE %s GROUP BY collection_id`, config.Table, where)
	var countRows []collectionCountRow
	if err := db.SelectContext(ctx, &countRows, db.Rebind(countSQL), args...); err != nil {
		return nil, fmt.Errorf("读取资产集合数量失败: %w", err)
	}
	counts := make(map[uint64]int, len(countRows))
	for _, row := range countRows {
		counts[row.CollectionID] = row.Count
	}
	return counts, nil
}

func collectionListCovers(ctx context.Context, filter collectionChildFilter, collectionIDs []uint64) ([]*assetmodel.Asset, error) {
	if filter.kind != "" && filter.kind != assetmodel.KindImage && filter.kind != assetmodel.KindVideo {
		return nil, nil
	}
	config := assetmodel.NewAssetModel().Config()
	db, err := orm.Get(config.Database)
	if err != nil {
		return nil, err
	}
	where, args := filter.where(collectionIDs)
	if filter.kind == "" {
		where += " AND kind IN (?, ?)"
		args = append(args, assetmodel.KindImage, assetmodel.KindVideo)
	}
	args = append(args, collectionPreviewLimit)
	coverSQL := fmt.Sprintf(`
		SELECT id, collection_id, kind, version_id
		FROM (
			SELECT id, collection_id, kind, version_id,
				ROW_NUMBER() OVER (PARTITION BY collection_id ORDER BY id DESC) AS cover_rank
			FROM %s
			WHERE %s
		) AS ranked_covers
		WHERE cover_rank <= ?
		ORDER BY collection_id ASC, cover_rank ASC`, config.Table, where)
	var rankedCovers []collectionCoverRow
	if err := db.SelectContext(ctx, &rankedCovers, db.Rebind(coverSQL), args...); err != nil {
		return nil, fmt.Errorf("读取资产集合封面失败: %w", err)
	}
	covers := make([]*assetmodel.Asset, 0, len(rankedCovers))
	for _, row := range rankedCovers {
		covers = append(covers, &assetmodel.Asset{
			ID:           row.ID,
			CollectionID: row.CollectionID,
			Kind:         row.Kind,
			VersionID:    row.VersionID,
		})
	}
	return covers, nil
}
