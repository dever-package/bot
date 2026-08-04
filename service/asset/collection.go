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
	requestID := projectCollectionRequestID(req.ProjectID, req.AssetCateID, req.SourceNodeKey)
	content := req.Content
	if content == nil {
		content = map[string]any{
			"type":            assetmodel.KindCollection,
			"source_node_key": req.SourceNodeKey,
		}
	}
	asset, _, err := s.SaveVersion(ctx, SaveVersionRequest{
		ProjectID:   req.ProjectID,
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

func projectCollectionRequestID(projectID uint64, assetCateID uint64, sourceNodeKey string) string {
	sum := sha1.Sum([]byte(fmt.Sprintf("%d\x1f%d\x1f%s", projectID, assetCateID, strings.TrimSpace(sourceNodeKey))))
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

func attachCollectionListMetadata(ctx context.Context, rows []*assetmodel.Asset, items []map[string]any, childStatus string) error {
	collectionItems := make(map[uint64]map[string]any)
	collectionIDs := make([]uint64, 0)
	teamID := uint64(0)
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
		teamID = row.TeamID
	}
	if len(collectionIDs) == 0 {
		return nil
	}
	counts, coverRows, err := collectionListMetadataRows(ctx, teamID, collectionIDs, childStatus)
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

func collectionListMetadataRows(
	ctx context.Context,
	teamID uint64,
	collectionIDs []uint64,
	childStatus string,
) (map[uint64]int, []*assetmodel.Asset, error) {
	counts := make(map[uint64]int, len(collectionIDs))
	if teamID == 0 || len(collectionIDs) == 0 {
		return counts, nil, nil
	}
	db, err := orm.Get(assetmodel.NewAssetModel().Config().Database)
	if err != nil {
		return nil, nil, err
	}
	table := assetmodel.NewAssetModel().Config().Table
	placeholders := strings.TrimSuffix(strings.Repeat("?,", len(collectionIDs)), ",")
	baseArgs := make([]any, 0, len(collectionIDs)+2)
	baseArgs = append(baseArgs, teamID)
	for _, collectionID := range collectionIDs {
		baseArgs = append(baseArgs, collectionID)
	}
	baseArgs = append(baseArgs, childStatus)

	countSQL := fmt.Sprintf(`
		SELECT collection_id, COUNT(*) AS collection_count
		FROM %s
		WHERE team_id = ?
			AND collection_id IN (%s)
			AND status = ?
			AND version_id > 0
		GROUP BY collection_id`, table, placeholders)
	var countRows []collectionCountRow
	if err := db.SelectContext(ctx, &countRows, db.Rebind(countSQL), baseArgs...); err != nil {
		return nil, nil, fmt.Errorf("读取资产集合数量失败: %w", err)
	}
	for _, row := range countRows {
		counts[row.CollectionID] = row.Count
	}

	coverArgs := append(append([]any(nil), baseArgs...), assetmodel.KindImage, assetmodel.KindVideo, collectionPreviewLimit)
	coverSQL := fmt.Sprintf(`
		SELECT id, collection_id, kind, version_id
		FROM (
			SELECT id, collection_id, kind, version_id,
				ROW_NUMBER() OVER (PARTITION BY collection_id ORDER BY id DESC) AS cover_rank
			FROM %s
			WHERE team_id = ?
				AND collection_id IN (%s)
				AND status = ?
				AND version_id > 0
				AND kind IN (?, ?)
		) AS ranked_covers
		WHERE cover_rank <= ?
		ORDER BY collection_id ASC, cover_rank ASC`, table, placeholders)
	var rankedCovers []collectionCoverRow
	if err := db.SelectContext(ctx, &rankedCovers, db.Rebind(coverSQL), coverArgs...); err != nil {
		return nil, nil, fmt.Errorf("读取资产集合封面失败: %w", err)
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
	return counts, covers, nil
}
