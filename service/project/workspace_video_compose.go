package project

import (
	"context"
	"fmt"
	"strings"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	canvasVideoCompositionVersion  = 2
	canvasVideoCompositionMaxClips = 50
)

var canvasVideoTransitionTypes = map[string]bool{
	"none":      true,
	"fade":      true,
	"crossfade": true,
}

func resolveCanvasVideoComposition(
	ctx context.Context,
	projectID uint64,
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

	clips := make([]any, 0, len(rawClips))
	for index, value := range rawClips {
		clip, err := resolveCanvasVideoClip(ctx, projectID, index, mapValue(value))
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
	ctx context.Context,
	projectID uint64,
	index int,
	raw map[string]any,
) (map[string]any, error) {
	label := fmt.Sprintf("第 %d 个镜头", index+1)
	if issues := canvasTextList(firstPresent(raw["blocking_issues"], raw["blockingIssues"])); len(issues) > 0 {
		return nil, fmt.Errorf("%s尚不能合成: %s", label, strings.Join(issues, "；"))
	}
	visualVideo, err := resolveCanvasCompositionMediaURL(
		ctx,
		projectID,
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

	clip := map[string]any{
		"id":                 textValue(raw["id"]),
		"title":              firstText(raw["title"], label),
		"visual_video":       visualVideo,
		"duration":           canvasFloat64Value(raw["duration"]),
		"subtitle":           textValue(raw["subtitle"]),
		"original_volume":    boundedCanvasVolume(firstPresent(raw["original_volume"], raw["originalVolume"]), 1),
		"speech_tracks":      []any{},
		"transition_to_next": transition,
	}
	if originalRaw := mapValue(firstPresent(raw["original_audio_source"], raw["originalAudioSource"])); len(originalRaw) > 0 {
		originalAudio, originalErr := resolveCanvasCompositionMediaURL(
			ctx,
			projectID,
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
		ctx,
		projectID,
		label,
		sliceValue(firstPresent(raw["speech_tracks"], raw["speechTracks"])),
	)
	if err != nil {
		return nil, err
	}
	clip["speech_tracks"] = tracks
	return clip, nil
}

func resolveCanvasVideoSpeechTracks(
	ctx context.Context,
	projectID uint64,
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
		audioURL, err := resolveCanvasCompositionMediaURL(
			ctx,
			projectID,
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

func resolveCanvasVideoTransition(label string, raw map[string]any) (map[string]any, error) {
	transitionType := strings.ToLower(textValue(raw["type"]))
	if transitionType == "" {
		transitionType = "none"
	}
	if !canvasVideoTransitionTypes[transitionType] {
		return nil, fmt.Errorf("%s使用了不支持的转场", label)
	}
	durationMS := int(uint64Value(firstPresent(raw["duration_ms"], raw["durationMs"])))
	if transitionType != "none" && (durationMS < 100 || durationMS > 5000) {
		return nil, fmt.Errorf("%s的转场时长必须在 0.1 到 5 秒之间", label)
	}
	return map[string]any{
		"type":        transitionType,
		"duration_ms": durationMS,
	}, nil
}

func resolveCanvasVideoCompositionSettings(raw map[string]any) map[string]any {
	return map[string]any{
		"resolution": firstText(raw["resolution"], "1920x1080"),
		"fps":        firstPresent(raw["fps"], 25),
	}
}

func resolveCanvasCompositionMediaURL(
	ctx context.Context,
	projectID uint64,
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
	_, output, err := resolveCanvasReferenceAsset(ctx, projectID, reference)
	if err != nil {
		return "", fmt.Errorf("%s不可用: %w", label, err)
	}
	media := botprotocol.ExtractMediaOutput(output, mediaType)
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
