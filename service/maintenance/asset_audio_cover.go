package maintenance

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	assetmodel "github.com/dever-package/bot/model/asset"
	workspacemodel "github.com/dever-package/bot/model/workspace"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type legacyAudioVersion struct {
	row     *assetmodel.Version
	content map[string]any
	items   []botprotocol.PrimaryMediaItem
}

// MigrateLegacyAudioCovers restores covers that survived in workspace run
// output but were replaced by the MP3 URL in older asset versions.
func MigrateLegacyAudioCovers(ctx context.Context) (err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("修复历史音频封面失败: %v", recovered)
		}
	}()

	ctx = normalizeContext(ctx)
	versions := legacyAudioVersionsMissingCovers(ctx)
	if len(versions) == 0 {
		return nil
	}
	executions := legacyAudioNodeExecutions(ctx, versions)
	versionModel := assetmodel.NewVersionModel()
	for _, version := range versions {
		execution := matchingAudioNodeExecution(executions[version.row.NodeRunID], version.row.NodeKey)
		if execution == nil {
			continue
		}
		sourceItems := audioCoverItemsFromExecution(execution.Output, version.row)
		if !restoreAudioCoverMetadata(version.content, version.items, sourceItems) {
			continue
		}
		encoded, encodeErr := json.Marshal(version.content)
		if encodeErr != nil {
			return fmt.Errorf("编码音频资产版本 %d 失败: %w", version.row.ID, encodeErr)
		}
		if affected := versionModel.Update(ctx, map[string]any{"id": version.row.ID}, map[string]any{
			"content": string(encoded),
		}); affected != 1 {
			return fmt.Errorf("更新音频资产版本 %d 失败", version.row.ID)
		}
	}
	return nil
}

func legacyAudioVersionsMissingCovers(ctx context.Context) []legacyAudioVersion {
	assetIDs := make([]uint64, 0)
	for _, asset := range assetmodel.NewAssetModel().Select(ctx, map[string]any{
		"kind": assetmodel.KindAudio,
	}) {
		if asset != nil {
			assetIDs = append(assetIDs, asset.ID)
		}
	}
	if len(assetIDs) == 0 {
		return nil
	}

	result := make([]legacyAudioVersion, 0)
	for _, version := range assetmodel.NewVersionModel().Select(ctx, map[string]any{
		"asset_id":    assetIDs,
		"node_run_id": map[string]any{"gt": 0},
	}) {
		if version == nil {
			continue
		}
		content, ok := decodeAudioCoverObject(version.Content)
		if !ok {
			continue
		}
		items := botprotocol.ExtractPrimaryMediaItems(content, botprotocol.MediaTypeAudio)
		if !audioItemsMissingCovers(items) {
			continue
		}
		result = append(result, legacyAudioVersion{row: version, content: content, items: items})
	}
	return result
}

func legacyAudioNodeExecutions(
	ctx context.Context,
	versions []legacyAudioVersion,
) map[uint64][]*workspacemodel.NodeExecution {
	nodeRunIDs := make([]uint64, 0, len(versions))
	seen := make(map[uint64]struct{}, len(versions))
	for _, version := range versions {
		if version.row.NodeRunID == 0 {
			continue
		}
		if _, exists := seen[version.row.NodeRunID]; exists {
			continue
		}
		seen[version.row.NodeRunID] = struct{}{}
		nodeRunIDs = append(nodeRunIDs, version.row.NodeRunID)
	}
	result := make(map[uint64][]*workspacemodel.NodeExecution, len(nodeRunIDs))
	if len(nodeRunIDs) == 0 {
		return result
	}
	for _, execution := range workspacemodel.NewNodeExecutionModel().Select(ctx, map[string]any{
		"node_run_id": nodeRunIDs,
		"status":      workspacemodel.NodeExecutionStatusSuccess,
	}) {
		if execution != nil {
			result[execution.NodeRunID] = append(result[execution.NodeRunID], execution)
		}
	}
	return result
}

func matchingAudioNodeExecution(
	executions []*workspacemodel.NodeExecution,
	nodeKey string,
) *workspacemodel.NodeExecution {
	nodeKey = strings.TrimSpace(nodeKey)
	for _, execution := range executions {
		if execution != nil && strings.TrimSpace(execution.NodeKey) == nodeKey {
			return execution
		}
	}
	if nodeKey == "" && len(executions) == 1 {
		return executions[0]
	}
	return nil
}

func audioCoverItemsFromExecution(
	raw string,
	version *assetmodel.Version,
) []botprotocol.PrimaryMediaItem {
	var value any
	if json.Unmarshal([]byte(raw), &value) != nil {
		return nil
	}
	record, ok := value.(map[string]any)
	if !ok {
		return audioItemsWithAnyCover(value)
	}
	results, hasNodeResults := record["node_results"].([]any)
	if !hasNodeResults {
		return audioItemsWithAnyCover(value)
	}
	for _, result := range results {
		item, ok := result.(map[string]any)
		if !ok || !matchesAudioVersionResult(item, version) {
			continue
		}
		if items := audioItemsWithAnyCover(item["output"]); len(items) > 0 {
			return items
		}
	}
	return nil
}

func matchesAudioVersionResult(result map[string]any, version *assetmodel.Version) bool {
	if version == nil {
		return false
	}
	nodeRunID := strings.TrimSpace(botprotocol.AsText(result["node_run_id"]))
	if nodeRunID != "" {
		return nodeRunID == strconv.FormatUint(version.NodeRunID, 10)
	}
	return strings.TrimSpace(botprotocol.AsText(result["node_key"])) == strings.TrimSpace(version.NodeKey)
}

func audioItemsWithAnyCover(value any) []botprotocol.PrimaryMediaItem {
	items := botprotocol.ExtractPrimaryMediaItems(value, botprotocol.MediaTypeAudio)
	for _, item := range items {
		if item.Thumbnail != "" {
			return items
		}
	}
	return nil
}

func audioItemsMissingCovers(items []botprotocol.PrimaryMediaItem) bool {
	if len(items) == 0 {
		return false
	}
	for _, item := range items {
		if item.Thumbnail == "" {
			return true
		}
	}
	return false
}

func restoreAudioCoverMetadata(
	content map[string]any,
	currentItems []botprotocol.PrimaryMediaItem,
	sourceItems []botprotocol.PrimaryMediaItem,
) bool {
	if len(currentItems) == 0 || len(currentItems) != len(sourceItems) {
		return false
	}
	previews := make(map[string]string, len(currentItems))
	for index, current := range currentItems {
		preview := botprotocol.NormalizeMediaPreviewURL(current.URL, sourceItems[index].Thumbnail)
		if preview != "" {
			previews[current.URL] = preview
		}
	}
	if len(previews) == 0 {
		return false
	}

	files, _ := content["media_files"].([]any)
	normalizedFiles := append([]any(nil), files...)
	knownFiles := make(map[string]struct{}, len(files))
	changed := false
	for index, value := range normalizedFiles {
		file, ok := value.(map[string]any)
		if !ok {
			continue
		}
		mediaURL := strings.TrimSpace(botprotocol.AsText(file["url"]))
		if mediaURL == "" {
			continue
		}
		knownFiles[mediaURL] = struct{}{}
		preview := previews[mediaURL]
		if preview == "" || botprotocol.NormalizeMediaPreviewURL(mediaURL, botprotocol.AsText(file["thumbnail"])) != "" {
			continue
		}
		updated := cloneAudioMediaFile(file)
		updated["thumbnail"] = preview
		normalizedFiles[index] = updated
		changed = true
	}
	for _, current := range currentItems {
		preview := previews[current.URL]
		if preview == "" {
			continue
		}
		if _, exists := knownFiles[current.URL]; exists {
			continue
		}
		normalizedFiles = append(normalizedFiles, map[string]any{
			"kind":      botprotocol.MediaTypeAudio,
			"url":       current.URL,
			"thumbnail": preview,
		})
		changed = true
	}
	if changed {
		content["media_files"] = normalizedFiles
	}
	return changed
}

func cloneAudioMediaFile(source map[string]any) map[string]any {
	result := make(map[string]any, len(source)+1)
	for key, value := range source {
		result[key] = value
	}
	return result
}

func decodeAudioCoverObject(raw string) (map[string]any, bool) {
	result := map[string]any{}
	if json.Unmarshal([]byte(raw), &result) != nil {
		return nil, false
	}
	return result, true
}
