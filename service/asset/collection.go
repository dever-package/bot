package asset

import (
	"context"
	"crypto/sha1"
	"encoding/hex"
	"fmt"
	"strings"

	assetmodel "github.com/dever-package/bot/model/asset"
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
		Name: req.Name,
		Kind: assetmodel.KindCollection,
		Role: assetmodel.RoleMaterial,
		Content: map[string]any{
			"type":            assetmodel.KindCollection,
			"source_node_key": req.SourceNodeKey,
		},
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

func attachCollectionListMetadata(ctx context.Context, rows []*assetmodel.Asset, items []map[string]any, childStatus string) {
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
		return
	}
	children := assetmodel.NewAssetModel().Select(ctx, map[string]any{
		"team_id":       teamID,
		"collection_id": collectionIDs,
		"status":        childStatus,
		"version_id":    map[string]any{"gt": 0},
	}, map[string]any{
		"field": "main.id,main.collection_id,main.kind,main.version_id",
		"order": "main.id desc",
	})
	counts := make(map[uint64]int, len(collectionIDs))
	covers := make(map[uint64][]*assetmodel.Asset, len(collectionIDs))
	coverRows := make([]*assetmodel.Asset, 0, len(collectionIDs)*4)
	for _, child := range children {
		if child == nil {
			continue
		}
		counts[child.CollectionID]++
		if child.Kind != assetmodel.KindImage && child.Kind != assetmodel.KindVideo {
			continue
		}
		if len(covers[child.CollectionID]) >= 4 {
			continue
		}
		covers[child.CollectionID] = append(covers[child.CollectionID], child)
		coverRows = append(coverRows, child)
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
}
