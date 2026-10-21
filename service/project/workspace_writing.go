package project

import (
	"context"
	"fmt"

	assetmodel "github.com/dever-package/bot/model/asset"
	energonmodel "github.com/dever-package/bot/model/energon"
	teammodel "github.com/dever-package/bot/model/team"
	assetservice "github.com/dever-package/bot/service/asset"
)

func canvasWritingOutputType(outputType string) bool {
	switch energonmodel.NormalizeOutputType(outputType) {
	case energonmodel.OutputTypeStory:
		return true
	default:
		return false
	}
}

// 资产识别只读取存储文档，Run 在这里读取当前 writing 快照封装。
func workspaceWritingResultDocument(output any) (map[string]any, bool) {
	snapshot := mapValue(mapValue(output)["writing"])
	document, ok := assetservice.WritingDocument(snapshot["document"])
	return document, ok && canvasWritingOutputType(textValue(document["type"]))
}

// 叙事运行已经原子保存根目录；画布只能读取该版本，不能再走普通资产保存。
func workspaceWritingMaterial(ctx context.Context, run *teammodel.Run, canvasID uint64, node canvasRunNode, output any) (map[string]any, map[string]any, error) {
	row := mapValue(output)
	assetID := uint64Value(row["asset_id"])
	versionID := uint64Value(row["version_id"])
	if run == nil || assetID == 0 || versionID == 0 {
		return nil, nil, fmt.Errorf("创作运行没有已保存的作品版本")
	}
	if snapshot := mapValue(row["writing"]); snapshot != nil &&
		(uint64Value(snapshot["work_asset_id"]) != assetID || uint64Value(snapshot["work_version_id"]) != versionID) {
		return nil, nil, fmt.Errorf("创作运行的作品版本引用不一致")
	}
	service := assetservice.NewService()
	work := service.FindProjectAsset(ctx, run.ProjectID, assetID)
	version := service.FindVersion(ctx, versionID)
	if work == nil || version == nil || version.AssetID != work.ID || work.TeamID != run.TeamID || work.CanvasID != canvasID ||
		work.NodeKey != node.ID || work.Kind != assetmodel.KindCollection || work.Status != assetmodel.StatusCurrent {
		return nil, nil, fmt.Errorf("创作结果不属于当前画布节点")
	}
	document, ok := assetservice.WritingDocument(version.Content)
	if !ok || !canvasWritingOutputType(textValue(document["type"])) ||
		(canvasWritingOutputType(node.OutputType) && textValue(document["type"]) != energonmodel.NormalizeOutputType(node.OutputType)) {
		return nil, nil, fmt.Errorf("创作结果的作品类型无效")
	}
	metadata := service.AssetDetailMap(ctx, *work, version)
	// 当前资产指针可能已被后续正文运行推进；此运行的输出仍固定到自己的版本。
	metadata["version_id"] = version.ID
	return metadata, assetservice.VersionToMap(*version), nil
}

func attachWorkspaceWritingMaterial(ctx context.Context, run *teammodel.Run, canvasID uint64, node canvasRunNode, payload map[string]any, output any) (map[string]any, error) {
	work, version, err := workspaceWritingMaterial(ctx, run, canvasID, node, output)
	if err != nil {
		return payload, err
	}
	payload = mergeMap(payload, map[string]any{"asset": work, "version": version, "asset_id": work["id"], "version_id": version["id"]})
	for _, raw := range sliceValue(payload["node_results"]) {
		result := mapValue(raw)
		if textValue(result["node_key"]) != node.ID {
			continue
		}
		result["asset"] = work
		result["version"] = version
		result["persists_result"] = true
		assignCanvasNodeResultAssetRefs(result, payload)
	}
	return payload, nil
}

// 浏览器手工上下文里的同一作品应由固定版本引用替代，避免重复发送原始目录。
func excludeManualWritingSources(value any, excluded map[string]bool) any {
	if len(excluded) == 0 {
		return value
	}
	known := manualCanvasContextNodeIDs(value)
	allowed := map[string]bool{}
	removed := false
	for nodeID := range known {
		if excluded[nodeID] {
			removed = true
		} else {
			allowed[nodeID] = true
		}
	}
	if !removed {
		return value
	}
	filtered, keep := filterCanvasContextValue(value, allowed)
	if !keep {
		return nil
	}
	return filtered
}
