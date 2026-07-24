package project

import (
	"context"
	"fmt"
	"strings"

	assetservice "github.com/dever-package/bot/service/asset"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	canvasVideoCompositionVersion  = 3
	canvasVideoCompositionMaxClips = 50
)

func refreshCanvasVideoCompositionReferences(
	node canvasRunNode,
	raw map[string]any,
	results []canvasNodeResult,
	canvas map[string]any,
) map[string]any {
	sourceNodeID := canvasStoryboardSourceNodeID(node)
	if sourceNodeID == "" || raw == nil {
		return raw
	}
	itemNodeIDs := canvasStoryboardItemNodeIDs(canvas, sourceNodeID)
	composition := cloneInput(raw)
	clips := make([]any, 0, len(sliceValue(raw["clips"])))
	for _, value := range sliceValue(raw["clips"]) {
		clip := cloneInput(mapValue(value))
		clipID := textValue(clip["id"])
		shotReference, hasShot := canvasStoryboardItemAssetReference(
			itemNodeIDs,
			"shot",
			clipID,
			results,
			canvas,
		)
		lipSyncReference, hasLipSync := canvasStoryboardItemAssetReference(
			itemNodeIDs,
			"lip_sync",
			clipID,
			results,
			canvas,
		)
		if hasLipSync && canvasStoryboardItemNodeStale(itemNodeIDs, "lip_sync", clipID, canvas) {
			hasLipSync = false
		}
		if hasShot {
			clip["original_audio_source"] = canvasVideoCompositionReference(shotReference)
			if boolValue(firstPresent(clip["use_original_video"], clip["useOriginalVideo"])) || !hasLipSync {
				clip["visual_video"] = canvasVideoCompositionReference(shotReference)
			}
		}
		if hasLipSync && !boolValue(firstPresent(clip["use_original_video"], clip["useOriginalVideo"])) {
			clip["visual_video"] = canvasVideoCompositionReference(lipSyncReference)
		}

		tracks := make([]any, 0, len(sliceValue(firstPresent(clip["speech_tracks"], clip["speechTracks"]))))
		for _, trackValue := range sliceValue(firstPresent(clip["speech_tracks"], clip["speechTracks"])) {
			track := cloneInput(mapValue(trackValue))
			if reference, ok := canvasStoryboardItemAssetReference(
				itemNodeIDs,
				"speech",
				textValue(track["id"]),
				results,
				canvas,
			); ok {
				track["audio"] = canvasVideoCompositionReference(reference)
			}
			tracks = append(tracks, track)
		}
		clip["speech_tracks"] = tracks
		clip["blocking_issues"] = []any{}
		clips = append(clips, clip)
	}
	composition["clips"] = clips
	return composition
}

func canvasStoryboardItemNodeIDs(canvas map[string]any, sourceNodeID string) map[string]string {
	result := map[string]string{}
	for _, value := range sliceValue(canvas["nodes"]) {
		node := mapValue(value)
		metadata := mapValue(firstPresent(node["storyboard_item"], node["storyboardItem"]))
		if firstText(metadata["source_node_id"], metadata["sourceNodeId"]) != sourceNodeID {
			continue
		}
		itemType := firstText(metadata["item_type"], metadata["itemType"])
		itemID := firstText(metadata["item_id"], metadata["itemId"])
		if itemType == "" || itemID == "" {
			continue
		}
		result[itemType+"\x00"+itemID] = textValue(node["id"])
	}
	return result
}

func canvasStoryboardItemAssetReference(
	itemNodeIDs map[string]string,
	itemType string,
	itemID string,
	results []canvasNodeResult,
	canvas map[string]any,
) (canvasPromptReference, bool) {
	nodeID := itemNodeIDs[itemType+"\x00"+itemID]
	if nodeID == "" {
		return canvasPromptReference{}, false
	}
	return canvasNodeCurrentAssetReference(nodeID, results, canvas)
}

func canvasStoryboardItemNodeStale(itemNodeIDs map[string]string, itemType string, itemID string, canvas map[string]any) bool {
	node := canvasNodeByID(itemNodeIDs[itemType+"\x00"+itemID], canvas)
	metadata := mapValue(firstPresent(node["storyboard_item"], node["storyboardItem"]))
	return boolValue(metadata["stale"])
}

func canvasVideoCompositionReference(reference canvasPromptReference) map[string]any {
	return map[string]any{
		"asset_id":   reference.AssetID,
		"version_id": reference.VersionID,
		"label":      reference.Label,
	}
}

func resolveCanvasVideoComposition(
	ctx context.Context,
	teamID uint64,
	raw map[string]any,
) (map[string]any, error) {
	if uint64Value(raw["version"]) != canvasVideoCompositionVersion {
		return nil, fmt.Errorf("视频合成清单版本无效")
	}
	rawClips := sliceValue(raw["clips"])
	if len(rawClips) == 0 {
		return nil, fmt.Errorf("视频合成至少需要一个镜头")
	}
	if len(rawClips) > canvasVideoCompositionMaxClips {
		return nil, fmt.Errorf("单次视频合成最多支持 %d 个镜头", canvasVideoCompositionMaxClips)
	}
	for index, value := range rawClips {
		clip := mapValue(value)
		if issues := canvasTextList(firstPresent(clip["blocking_issues"], clip["blockingIssues"])); len(issues) > 0 {
			return nil, fmt.Errorf("第 %d 个镜头尚不能合成: %s", index+1, strings.Join(issues, "；"))
		}
	}
	resolvedReferences, err := assetservice.NewService().RequireCurrentReferences(
		ctx,
		teamID,
		canvasVideoCompositionAssetIDs(rawClips),
	)
	if err != nil {
		return nil, err
	}
	resolver := canvasCompositionReferenceResolver{references: resolvedReferences}

	clips := make([]any, 0, len(rawClips))
	for index, value := range rawClips {
		clip, err := resolveCanvasVideoClip(resolver, index, mapValue(value))
		if err != nil {
			return nil, err
		}
		clips = append(clips, clip)
	}
	return map[string]any{
		"version": canvasVideoCompositionVersion,
		"clips":   clips,
		"settings": resolveCanvasVideoCompositionSettings(
			mapValue(raw["settings"]),
		),
	}, nil
}

func canvasVideoCompositionAssetIDs(rawClips []any) []uint64 {
	assetIDs := make([]uint64, 0, len(rawClips)*2)
	appendReference := func(raw map[string]any) {
		if assetID := uint64Value(firstPresent(raw["asset_id"], raw["assetId"])); assetID > 0 {
			assetIDs = append(assetIDs, assetID)
		}
	}
	for _, value := range rawClips {
		clip := mapValue(value)
		appendReference(mapValue(firstPresent(clip["visual_video"], clip["visualVideo"])))
		appendReference(mapValue(firstPresent(clip["original_audio_source"], clip["originalAudioSource"])))
		for _, track := range sliceValue(firstPresent(clip["speech_tracks"], clip["speechTracks"])) {
			appendReference(mapValue(mapValue(track)["audio"]))
		}
	}
	return assetIDs
}

func canvasVideoCompositionURLs(composition map[string]any) []string {
	result := make([]string, 0, len(sliceValue(composition["clips"])))
	for _, value := range sliceValue(composition["clips"]) {
		if videoURL := textValue(mapValue(value)["visual_video"]); videoURL != "" {
			result = append(result, videoURL)
		}
	}
	return result
}

func resolveCanvasVideoClip(
	resolver canvasCompositionReferenceResolver,
	index int,
	raw map[string]any,
) (map[string]any, error) {
	label := fmt.Sprintf("第 %d 个镜头", index+1)
	visualVideo, err := resolver.resolveMediaURL(
		mapValue(firstPresent(raw["visual_video"], raw["visualVideo"])),
		botprotocol.MediaTypeVideo,
		label+"画面",
	)
	if err != nil {
		return nil, err
	}
	transition, err := resolveCanvasVideoTransition(
		label,
		mapValue(firstPresent(raw["transition_to_next"], raw["transitionToNext"])),
	)
	if err != nil {
		return nil, err
	}

	duration := canvasFloat64Value(raw["duration"])
	clip := map[string]any{
		"id":                 textValue(raw["id"]),
		"title":              firstText(raw["title"], label),
		"visual_video":       visualVideo,
		"duration":           duration,
		"original_volume":    boundedCanvasVolume(firstPresent(raw["original_volume"], raw["originalVolume"]), 1),
		"speech_tracks":      []any{},
		"subtitle_tracks":    []any{},
		"transition_to_next": transition,
	}
	if originalRaw := mapValue(firstPresent(raw["original_audio_source"], raw["originalAudioSource"])); len(originalRaw) > 0 {
		originalAudio, originalErr := resolver.resolveMediaURL(
			originalRaw,
			botprotocol.MediaTypeVideo,
			label+"原声来源",
		)
		if originalErr != nil {
			return nil, originalErr
		}
		clip["original_audio_source"] = originalAudio
	}

	tracks, err := resolveCanvasVideoSpeechTracks(
		resolver,
		label,
		sliceValue(firstPresent(raw["speech_tracks"], raw["speechTracks"])),
	)
	if err != nil {
		return nil, err
	}
	clip["speech_tracks"] = tracks
	subtitleTracks, err := resolveCanvasVideoSubtitleTracks(
		label,
		duration,
		sliceValue(firstPresent(raw["subtitle_tracks"], raw["subtitleTracks"])),
	)
	if err != nil {
		return nil, err
	}
	clip["subtitle_tracks"] = subtitleTracks
	return clip, nil
}

func resolveCanvasVideoSpeechTracks(
	resolver canvasCompositionReferenceResolver,
	clipLabel string,
	rawTracks []any,
) ([]any, error) {
	tracks := make([]any, 0, len(rawTracks))
	usedIDs := map[string]bool{}
	for index, value := range rawTracks {
		raw := mapValue(value)
		trackID := textValue(raw["id"])
		if trackID == "" || usedIDs[trackID] {
			return nil, fmt.Errorf("%s第 %d 条语音轨标识无效", clipLabel, index+1)
		}
		usedIDs[trackID] = true
		audioURL, err := resolver.resolveMediaURL(
			mapValue(raw["audio"]),
			botprotocol.MediaTypeAudio,
			fmt.Sprintf("%s第 %d 条语音", clipLabel, index+1),
		)
		if err != nil {
			return nil, err
		}
		startTime := canvasFloat64Value(firstPresent(raw["start_time"], raw["startTime"]))
		if startTime < 0 {
			return nil, fmt.Errorf("%s第 %d 条语音开始时间不能小于 0", clipLabel, index+1)
		}
		kind := strings.ToLower(textValue(raw["kind"]))
		if kind != "dialogue" && kind != "narration" {
			return nil, fmt.Errorf("%s第 %d 条语音类型无效", clipLabel, index+1)
		}
		tracks = append(tracks, map[string]any{
			"id":           trackID,
			"audio":        audioURL,
			"start_time":   startTime,
			"kind":         kind,
			"character_id": textValue(firstPresent(raw["character_id"], raw["characterId"])),
			"text":         textValue(raw["text"]),
			"volume":       boundedCanvasVolume(raw["volume"], 1),
		})
	}
	return tracks, nil
}

func resolveCanvasVideoSubtitleTracks(
	clipLabel string,
	clipDuration float64,
	rawTracks []any,
) ([]any, error) {
	tracks := make([]any, 0, len(rawTracks))
	usedIDs := map[string]bool{}
	for index, value := range rawTracks {
		raw := mapValue(value)
		trackID := textValue(raw["id"])
		text := textValue(raw["text"])
		if trackID == "" || usedIDs[trackID] || text == "" {
			return nil, fmt.Errorf("%s第 %d 条字幕轨配置无效", clipLabel, index+1)
		}
		usedIDs[trackID] = true
		startTime := canvasFloat64Value(firstPresent(raw["start_time"], raw["startTime"]))
		endTime := canvasFloat64Value(firstPresent(raw["end_time"], raw["endTime"]))
		speechID := firstText(raw["speech_id"], raw["speechId"])
		if startTime < 0 || startTime >= clipDuration {
			return nil, fmt.Errorf("%s第 %d 条字幕开始时间超出镜头范围", clipLabel, index+1)
		}
		if speechID == "" && (endTime <= startTime || endTime > clipDuration) {
			return nil, fmt.Errorf("%s第 %d 条字幕结束时间超出镜头范围", clipLabel, index+1)
		}
		source := strings.ToLower(textValue(raw["source"]))
		if source != "speech" && source != "caption" {
			return nil, fmt.Errorf("%s第 %d 条字幕来源无效", clipLabel, index+1)
		}
		tracks = append(tracks, map[string]any{
			"id":         trackID,
			"text":       text,
			"start_time": startTime,
			"end_time":   endTime,
			"speech_id":  speechID,
			"source":     source,
		})
	}
	return tracks, nil
}

func resolveCanvasVideoTransition(label string, raw map[string]any) (map[string]any, error) {
	transitionType, ok := botprotocol.NormalizeVideoTransitionType(textValue(raw["type"]))
	if !ok {
		return nil, fmt.Errorf("%s使用了不支持的转场", label)
	}
	durationMS := int(uint64Value(firstPresent(raw["duration_ms"], raw["durationMs"])))
	if transitionType != botprotocol.VideoTransitionNone && (durationMS < 100 || durationMS > 5000) {
		return nil, fmt.Errorf("%s的转场时长必须在 0.1 到 5 秒之间", label)
	}
	return map[string]any{
		"type":        transitionType,
		"duration_ms": durationMS,
	}, nil
}

func resolveCanvasVideoCompositionSettings(raw map[string]any) map[string]any {
	return map[string]any{
		"resolution": firstText(raw["resolution"], "auto"),
		"fps":        firstPresent(raw["fps"], 0),
	}
}

type canvasCompositionReferenceResolver struct {
	references map[uint64]assetservice.CurrentReference
}

func (resolver canvasCompositionReferenceResolver) resolveMediaURL(
	raw map[string]any,
	mediaType string,
	label string,
) (string, error) {
	reference := canvasPromptReference{
		AssetID:   uint64Value(firstPresent(raw["asset_id"], raw["assetId"])),
		VersionID: uint64Value(firstPresent(raw["version_id"], raw["versionId"])),
		Label:     firstText(raw["label"], label),
	}
	if reference.AssetID == 0 || reference.VersionID == 0 {
		return "", fmt.Errorf("%s缺少有效素材引用", label)
	}
	resolved, ok := resolver.references[reference.AssetID]
	if !ok || resolved.Content == nil {
		return "", fmt.Errorf("%s不可用", label)
	}
	media := botprotocol.ExtractMediaOutput(resolved.Content, mediaType)
	values := botprotocol.NormalizeMediaList(media[mediaType+"s"], mediaType)
	if len(values) == 0 {
		return "", fmt.Errorf("%s不是可用的%s素材", label, botprotocol.MediaOutputLabel(mediaType))
	}
	return values[0], nil
}

func boundedCanvasVolume(value any, fallback float64) float64 {
	if value == nil || strings.TrimSpace(fmt.Sprint(value)) == "" {
		return fallback
	}
	volume := canvasFloat64Value(value)
	if volume < 0 || volume > 1 {
		return fallback
	}
	return volume
}

func canvasFloat64Value(value any) float64 {
	switch current := value.(type) {
	case float64:
		return current
	case float32:
		return float64(current)
	case int:
		return float64(current)
	case int64:
		return float64(current)
	case uint64:
		return float64(current)
	default:
		return 0
	}
}

func canvasTextList(value any) []string {
	result := []string{}
	for _, raw := range sliceValue(value) {
		if text := textValue(raw); text != "" {
			result = append(result, text)
		}
	}
	return result
}
