package project

import (
	"context"
	"crypto/sha1"
	"encoding/hex"
	"fmt"
	"strings"

	assetmodel "github.com/dever-package/bot/model/asset"
	energonmodel "github.com/dever-package/bot/model/energon"
	teammodel "github.com/dever-package/bot/model/team"
	assetservice "github.com/dever-package/bot/service/asset"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func (s WorkspaceService) saveWorkspaceStoryboardGridMaterial(
	ctx context.Context,
	projectID uint64,
	req CanvasRunRequest,
	run *teammodel.Run,
	node canvasRunNode,
	nodeRunID uint64,
	payload map[string]any,
	output any,
) (map[string]any, bool, error) {
	document, ok := workspaceStoryboardGridDocument(output)
	if !ok {
		return payload, false, nil
	}

	assetCateID := firstUint64(node.AssetCateID, req.AssetCateID)
	collectionName := firstText(document["title"], canvasRunNodeTitle(node), "宫格图片")
	collection, err := s.project.asset.EnsureProjectCollection(ctx, assetservice.EnsureProjectCollectionRequest{
		ProjectID:     projectID,
		BodyID:        run.BodyID,
		TeamID:        run.TeamID,
		AssetCateID:   assetCateID,
		RunID:         run.ID,
		NodeRunID:     nodeRunID,
		ReleaseID:     run.ReleaseID,
		SourceNodeKey: node.ID,
		Name:          collectionName,
		Content:       document,
	})
	if err != nil {
		return payload, true, err
	}

	frames := sliceValue(document["frames"])
	children := make([]any, 0, len(frames))
	activeAssetIDs := make([]uint64, 0, len(frames))
	for index, value := range frames {
		frame := mapValue(value)
		image := firstText(frame["image"])
		if image == "" || strings.EqualFold(firstText(frame["status"]), teammodel.RunStatusFail) {
			continue
		}
		frameID := firstText(frame["id"], fmt.Sprintf("frame-%02d", index+1))
		frameTitle := firstText(frame["title"], fmt.Sprintf("画面 %02d", index+1))
		nodeKey := strings.TrimSpace(node.ID) + ":" + frameID
		childRequestID := canvasChildRequestID(run.RequestID, nodeKey)
		content := storyboardGridFrameAssetContent(document, frame, image)
		result, saveErr := s.project.SaveAsset(ctx, projectID, SaveAssetRequest{
			AssetCateID:  assetCateID,
			CollectionID: collection.ID,
			FlowID:       node.FlowID,
			RunID:        run.ID,
			NodeRunID:    nodeRunID,
			ReleaseID:    run.ReleaseID,
			RequestID:    childRequestID,
			NodeKey:      nodeKey,
			Source: map[string]any{
				"source_request_id":          childRequestID,
				"source_run_id":              run.ID,
				"source_node_key":            node.ID,
				"source_node_type":           node.Type,
				"collection_id":              collection.ID,
				"collection_source_node_key": node.ID,
				"storyboard_grid_frame_id":   frameID,
				"storyboard_grid_order":      index + 1,
			},
			Name:    frameTitle,
			Kind:    assetmodel.KindImage,
			Role:    assetmodel.RoleMaterial,
			Content: content,
			Sort:    (index + 1) * 10,
		})
		if saveErr != nil {
			return payload, true, saveErr
		}
		child := mapValue(result["asset"])
		assetID, versionID, storedImage := savedStoryboardGridFrame(child)
		if assetID == 0 || versionID == 0 || storedImage == "" {
			return payload, true, fmt.Errorf("第 %d 个宫格画面保存后没有可用图片", index+1)
		}
		activeAssetIDs = append(activeAssetIDs, assetID)
		frame["asset_id"] = assetID
		frame["asset_version_id"] = versionID
		frame["image"] = storedImage
		frame["status"] = "success"
		frame["error"] = ""
		children = append(children, child)
	}
	document["frames"] = frames
	if err := s.project.asset.ReconcileProjectCollectionChildren(ctx, run.TeamID, collection.ID, activeAssetIDs); err != nil {
		return payload, true, err
	}
	collection, version, err := s.project.asset.UpdateVersionContent(
		ctx,
		projectID,
		collection.ID,
		collection.VersionID,
		document,
	)
	if err != nil {
		return payload, true, err
	}

	collectionDetail := s.project.asset.AssetDetailMap(ctx, *collection, version)
	payload["asset"] = collectionDetail
	payload["version"] = mapValue(collectionDetail["version"])
	payload["assets"] = children
	payload["output"] = output
	return payload, true, nil
}

func savedStoryboardGridFrame(child map[string]any) (uint64, uint64, string) {
	if child == nil {
		return 0, 0, ""
	}
	assetID := uint64Value(child["id"])
	version := mapValue(child["version"])
	versionID := uint64Value(child["version_id"])
	if versionID == 0 {
		versionID = uint64Value(version["id"])
	}
	mediaURLs := assetservice.ContentMediaURLs(version["content"], assetmodel.KindImage)
	if len(mediaURLs) == 0 {
		return assetID, versionID, ""
	}
	return assetID, versionID, strings.TrimSpace(mediaURLs[0])
}

func workspaceStoryboardGridDocument(output any) (map[string]any, bool) {
	normalized := botprotocol.ExtractOutput(output)
	candidates := []any{
		output,
		map[string]any(normalized),
	}
	for _, candidate := range candidates {
		document, found := findWorkspaceDocument(
			candidate,
			energonmodel.OutputTypeStoryboardGrid,
			storyboardGridWrapperKeys[:],
		)
		if !found {
			continue
		}
		frameCount := len(sliceValue(document["frames"]))
		if frameCount < energonmodel.StoryboardGridMinImages ||
			frameCount > energonmodel.StoryboardGridMaxImages {
			continue
		}
		return document, true
	}
	return nil, false
}

var storyboardGridWrapperKeys = [...]string{
	"storyboard_grid",
	"json",
	"output",
	"result",
	"data",
	"content",
	"body",
	"value",
	"text",
	"finalOutput",
	"final_output",
	"rich",
}

func (s Service) saveImportedStoryboardGrid(
	ctx context.Context,
	projectID uint64,
	bodyID uint64,
	teamID uint64,
	releaseID uint64,
	req SaveAssetRequest,
) (map[string]any, bool, error) {
	if !strings.EqualFold(strings.TrimSpace(req.Kind), assetmodel.KindCollection) {
		return nil, false, nil
	}
	document, ok := workspaceStoryboardGridDocument(req.Content)
	if !ok {
		return nil, false, nil
	}
	collection, err := s.asset.EnsureProjectCollection(
		ctx,
		assetservice.EnsureProjectCollectionRequest{
			ProjectID:     projectID,
			BodyID:        bodyID,
			TeamID:        teamID,
			AssetCateID:   req.AssetCateID,
			RunID:         req.RunID,
			NodeRunID:     req.NodeRunID,
			ReleaseID:     firstUint64(req.ReleaseID, releaseID),
			SourceNodeKey: req.NodeKey,
			Name:          firstText(document["title"], req.Name, "宫格图片"),
			Content:       document,
		},
	)
	if err != nil {
		return nil, true, err
	}
	normalized, err := s.editableStoryboardGridContent(ctx, collection, document)
	if err != nil {
		return nil, true, err
	}
	collection, version, err := s.asset.UpdateVersionContent(
		ctx,
		projectID,
		collection.ID,
		collection.VersionID,
		normalized,
	)
	if err != nil {
		return nil, true, err
	}
	return map[string]any{
		"asset": s.asset.AssetDetailMap(ctx, *collection, version),
	}, true, nil
}

func storyboardGridFrameAssetContent(document map[string]any, frame map[string]any, image string) map[string]any {
	frameCopy := make(map[string]any, len(frame))
	for key, value := range frame {
		frameCopy[key] = value
	}
	return map[string]any{
		"event":  "final",
		"title":  firstText(frame["title"]),
		"images": []any{image},
		"json": map[string]any{
			"type":         energonmodel.OutputTypeStoryboardGrid,
			"grid_title":   firstText(document["title"]),
			"grid_summary": firstText(document["summary"]),
			"frame":        frameCopy,
		},
		"meta": map[string]any{
			"output_type": energonmodel.OutputTypeStoryboardGrid,
			"view_mode":   "image",
			"frame_id":    firstText(frame["id"]),
			"frame_order": uint64Value(frame["order"]),
		},
	}
}

func (s Service) editableStoryboardGridContent(
	ctx context.Context,
	collection *assetmodel.Asset,
	document map[string]any,
) (map[string]any, error) {
	if collection == nil ||
		collection.Kind != assetmodel.KindCollection ||
		collection.CollectionID > 0 ||
		collection.Status != assetmodel.StatusCurrent {
		return nil, fmt.Errorf("宫格集合不存在或已不可用")
	}
	frames := sliceValue(document["frames"])
	if len(frames) < energonmodel.StoryboardGridMinImages || len(frames) > energonmodel.StoryboardGridMaxImages {
		return nil, fmt.Errorf(
			"宫格画面数量必须为 %d-%d 张",
			energonmodel.StoryboardGridMinImages,
			energonmodel.StoryboardGridMaxImages,
		)
	}

	normalizedFrames := make([]any, 0, len(frames))
	activeAssetIDs := make([]uint64, 0, len(frames))
	frameIDs := make(map[string]struct{}, len(frames))
	for index, raw := range frames {
		frame := mapValue(raw)
		if frame == nil {
			return nil, fmt.Errorf("第 %d 个宫格画面格式无效", index+1)
		}
		frameID := firstText(frame["id"], fmt.Sprintf("frame-%02d", index+1))
		if _, exists := frameIDs[frameID]; exists {
			return nil, fmt.Errorf("宫格画面标识 %s 重复", frameID)
		}
		frameIDs[frameID] = struct{}{}
		frame["id"] = frameID
		frame["order"] = index + 1
		frame["title"] = firstText(frame["title"], fmt.Sprintf("画面 %02d", index+1))

		child, version, err := s.resolveStoryboardGridFrameAsset(ctx, collection, frame, index)
		if err != nil {
			return nil, err
		}
		if child != nil && version != nil {
			mediaURLs := assetservice.ContentMediaURLs(
				assetservice.VersionToMap(*version)["content"],
				assetmodel.KindImage,
			)
			if len(mediaURLs) == 0 {
				return nil, fmt.Errorf("第 %d 个宫格画面没有可用图片", index+1)
			}
			frame["asset_id"] = child.ID
			frame["asset_version_id"] = version.ID
			frame["image"] = mediaURLs[0]
			frame["status"] = "success"
			frame["error"] = ""
			activeAssetIDs = append(activeAssetIDs, child.ID)
		} else {
			frame["asset_id"] = uint64(0)
			frame["asset_version_id"] = uint64(0)
			if firstText(frame["image"]) == "" {
				frame["status"] = "pending"
			}
		}
		normalizedFrames = append(normalizedFrames, frame)
	}
	document["type"] = energonmodel.OutputTypeStoryboardGrid
	document["version"] = 1
	document["title"] = firstText(document["title"], collection.Name, "宫格图片")
	document["summary"] = firstText(document["summary"])
	document["frames"] = normalizedFrames
	if err := s.asset.ReconcileProjectCollectionChildren(
		ctx,
		collection.TeamID,
		collection.ID,
		activeAssetIDs,
	); err != nil {
		return nil, err
	}
	return document, nil
}

func (s Service) resolveStoryboardGridFrameAsset(
	ctx context.Context,
	collection *assetmodel.Asset,
	frame map[string]any,
	index int,
) (*assetmodel.Asset, *assetmodel.Version, error) {
	assetID := uint64Value(firstPresent(
		frame["asset_id"],
		frame["assetId"],
		frame["assetID"],
	))
	if assetID == 0 {
		return nil, nil, nil
	}
	source := s.asset.FindProjectAsset(ctx, collection.ProjectID, assetID)
	if source == nil || source.Status != assetmodel.StatusCurrent {
		return nil, nil, fmt.Errorf("第 %d 个宫格画面的图片资产不存在", index+1)
	}
	if source.Kind != assetmodel.KindImage {
		return nil, nil, fmt.Errorf("第 %d 个宫格画面必须选择图片资产", index+1)
	}
	if source.CollectionID == collection.ID {
		currentVersion := s.asset.FindVersion(ctx, source.VersionID)
		if currentVersion == nil || currentVersion.AssetID != source.ID {
			return nil, nil, fmt.Errorf("第 %d 个宫格画面的当前图片版本不存在", index+1)
		}
		return source, currentVersion, nil
	}
	versionID := uint64Value(firstPresent(
		frame["asset_version_id"],
		frame["assetVersionId"],
		frame["assetVersionID"],
	))
	if versionID == 0 {
		versionID = source.VersionID
	}
	sourceVersion := s.asset.FindVersion(ctx, versionID)
	if sourceVersion == nil || sourceVersion.AssetID != source.ID {
		return nil, nil, fmt.Errorf("第 %d 个宫格画面的图片版本不存在", index+1)
	}

	frameID := firstText(frame["id"], fmt.Sprintf("frame-%02d", index+1))
	frameTitle := firstText(frame["title"], fmt.Sprintf("画面 %02d", index+1))
	requestID := storyboardGridImportRequestID(collection.ID, frameID, sourceVersion.ID)
	child, childVersion, err := s.asset.SaveVersion(ctx, assetservice.SaveVersionRequest{
		ProjectID:    collection.ProjectID,
		BodyID:       collection.BodyID,
		TeamID:       collection.TeamID,
		FlowID:       collection.FlowID,
		AssetCateID:  collection.AssetCateID,
		CollectionID: collection.ID,
		ReleaseID:    sourceVersion.ReleaseID,
		RequestID:    requestID,
		NodeKey:      storyboardGridChildNodeKey(collection, frameID),
		Source: map[string]any{
			"source_asset_id":             source.ID,
			"source_asset_version_id":     sourceVersion.ID,
			"collection_id":               collection.ID,
			"storyboard_grid_frame_id":    frameID,
			"storyboard_grid_frame_order": index + 1,
		},
		Name:    frameTitle,
		Kind:    assetmodel.KindImage,
		Role:    assetmodel.RoleMaterial,
		Content: assetservice.VersionToMap(*sourceVersion)["content"],
		Sort:    (index + 1) * 10,
	})
	if err != nil {
		return nil, nil, err
	}
	return child, childVersion, nil
}

func storyboardGridImportRequestID(collectionID uint64, frameID string, versionID uint64) string {
	digest := sha1.Sum([]byte(fmt.Sprintf("%d/%s/%d", collectionID, frameID, versionID)))
	return "grid-edit:" + hex.EncodeToString(digest[:])
}

func storyboardGridChildNodeKey(collection *assetmodel.Asset, frameID string) string {
	prefix := strings.TrimSpace(collection.NodeKey)
	if prefix == "" {
		prefix = fmt.Sprintf("storyboard-grid-%d", collection.ID)
	}
	if len(prefix) > 104 {
		prefix = prefix[:104]
	}
	digest := sha1.Sum([]byte(fmt.Sprintf("%d/%s", collection.ID, frameID)))
	return prefix + ":grid:" + hex.EncodeToString(digest[:8])
}
