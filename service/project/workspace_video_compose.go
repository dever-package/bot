package project

import (
	"context"
	"fmt"
	"strings"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	canvasVideoCompositionVersion  = 1
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
	settings, err := resolveCanvasVideoCompositionSettings(ctx, projectID, mapValue(raw["settings"]))
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"version":  canvasVideoCompositionVersion,
		"clips":    clips,
		"settings": settings,
	}, nil
}

func canvasVideoCompositionURLs(composition map[string]any) []string {
	result := make([]string, 0, len(sliceValue(composition["clips"])))
	for _, value := range sliceValue(composition["clips"]) {
		if videoURL := textValue(mapValue(value)["video"]); videoURL != "" {
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
	videoURL, err := resolveCanvasCompositionMediaURL(
		ctx,
		projectID,
		mapValue(raw["video"]),
		botprotocol.MediaTypeVideo,
		label,
	)
	if err != nil {
		return nil, err
	}
	soundRaw := mapValue(raw["sound"])
	sound := map[string]any{
		"keep_original":   canvasBoolValue(firstPresent(soundRaw["keep_original"], soundRaw["keepOriginal"]), true),
		"original_volume": boundedCanvasVolume(firstPresent(soundRaw["original_volume"], soundRaw["originalVolume"]), 1),
		"voice_volume":    boundedCanvasVolume(firstPresent(soundRaw["voice_volume"], soundRaw["voiceVolume"]), 1),
	}
	if voiceRaw := mapValue(soundRaw["voice"]); len(voiceRaw) > 0 {
		voiceURL, voiceErr := resolveCanvasCompositionMediaURL(
			ctx,
			projectID,
			voiceRaw,
			botprotocol.MediaTypeAudio,
			label+"配音",
		)
		if voiceErr != nil {
			return nil, voiceErr
		}
		sound["voice"] = voiceURL
	}
	transitionRaw := mapValue(firstPresent(raw["transition_to_next"], raw["transitionToNext"]))
	transitionType := strings.ToLower(textValue(transitionRaw["type"]))
	if !canvasVideoTransitionTypes[transitionType] {
		return nil, fmt.Errorf("%s使用了不支持的转场", label)
	}
	durationMS := int(uint64Value(firstPresent(transitionRaw["duration_ms"], transitionRaw["durationMs"])))
	if transitionType != "none" && (durationMS < 100 || durationMS > 5000) {
		return nil, fmt.Errorf("%s的转场时长必须在 0.1 到 5 秒之间", label)
	}
	return map[string]any{
		"id":       textValue(raw["id"]),
		"title":    firstText(raw["title"], label),
		"video":    videoURL,
		"duration": canvasFloat64Value(raw["duration"]),
		"subtitle": textValue(raw["subtitle"]),
		"sound":    sound,
		"transition_to_next": map[string]any{
			"type":        transitionType,
			"duration_ms": durationMS,
		},
	}, nil
}

func resolveCanvasVideoCompositionSettings(
	ctx context.Context,
	projectID uint64,
	raw map[string]any,
) (map[string]any, error) {
	settings := map[string]any{
		"resolution": firstText(raw["resolution"], "1920x1080"),
		"fps":        firstPresent(raw["fps"], 25),
		"background_music_volume": boundedCanvasVolume(
			firstPresent(raw["background_music_volume"], raw["backgroundMusicVolume"]),
			0.2,
		),
	}
	backgroundRaw := mapValue(firstPresent(raw["background_music"], raw["backgroundMusic"]))
	if len(backgroundRaw) == 0 {
		return settings, nil
	}
	backgroundURL, err := resolveCanvasCompositionMediaURL(
		ctx,
		projectID,
		backgroundRaw,
		botprotocol.MediaTypeAudio,
		"背景音乐",
	)
	if err != nil {
		return nil, err
	}
	settings["background_music"] = backgroundURL
	return settings, nil
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

func canvasBoolValue(value any, fallback bool) bool {
	switch current := value.(type) {
	case bool:
		return current
	case int:
		return current != 0
	case float64:
		return current != 0
	case string:
		switch strings.ToLower(strings.TrimSpace(current)) {
		case "1", "true", "yes", "on":
			return true
		case "0", "false", "no", "off":
			return false
		}
	}
	return fallback
}
