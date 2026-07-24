package project

import (
	"context"
	"fmt"
	"strings"

	botprocessor "github.com/dever-package/bot/service/energon/processor"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func prepareCanvasLipSyncInput(
	ctx context.Context,
	projectID uint64,
	req CanvasRunRequest,
	node canvasRunNode,
	previousOutput any,
	results []canvasNodeResult,
	input map[string]any,
	params map[string]any,
) (map[string]any, map[string]any, error) {
	shotDuration := canvasFloat64Value(firstPresent(
		node.StoryboardItem["shot_duration"],
		node.StoryboardItem["shotDuration"],
	))
	if shotDuration <= 0 {
		return nil, nil, fmt.Errorf("口型同步缺少有效镜头时长")
	}
	visibleSpeechIDs := canvasStringSet(firstPresent(
		node.StoryboardItem["speech_ids"],
		node.StoryboardItem["speechIds"],
	))
	if len(visibleSpeechIDs) == 0 {
		return nil, nil, fmt.Errorf("口型同步缺少可见角色对白")
	}
	targetCharacterID := firstText(
		node.StoryboardItem["character_id"],
		node.StoryboardItem["characterId"],
	)

	videoURL := ""
	tracks := make([]botprocessor.SpeechTimelineTrack, 0)
	for _, sourceNodeID := range canvasStringList(firstPresent(
		node.StoryboardItem["reference_node_ids"],
		node.StoryboardItem["referenceNodeIds"],
	)) {
		sourceNode := canvasNodeByID(sourceNodeID, req.Canvas)
		if sourceNode == nil {
			return nil, nil, fmt.Errorf("口型同步来源节点不存在: %s", sourceNodeID)
		}
		metadata := mapValue(firstPresent(sourceNode["storyboard_item"], sourceNode["storyboardItem"]))
		itemType := firstText(metadata["item_type"], metadata["itemType"])
		output := canvasReferencedNodeOutput(
			ctx,
			projectID,
			sourceNodeID,
			previousOutput,
			results,
			req.Canvas,
		)
		switch itemType {
		case "shot":
			videos := canvasMediaURLs(output, botprotocol.MediaTypeVideo)
			if len(videos) == 0 {
				return nil, nil, fmt.Errorf("口型同步的原镜头视频尚未生成")
			}
			if videoURL != "" && videoURL != videos[0] {
				return nil, nil, fmt.Errorf("口型同步只能使用一个原镜头视频")
			}
			videoURL = videos[0]
		case "speech":
			speechID := firstText(
				metadata["speech_id"],
				metadata["speechId"],
				metadata["item_id"],
				metadata["itemId"],
			)
			audios := canvasMediaURLs(output, botprotocol.MediaTypeAudio)
			if len(audios) == 0 {
				return nil, nil, fmt.Errorf("配音“%s”尚未生成", speechID)
			}
			mix := visibleSpeechIDs[speechID]
			if mix {
				speechCharacterID := firstText(
					metadata["character_id"],
					metadata["characterId"],
				)
				if speechCharacterID == "" {
					return nil, nil, fmt.Errorf("出镜对白“%s”缺少角色", speechID)
				}
				if targetCharacterID == "" {
					targetCharacterID = speechCharacterID
				}
				if targetCharacterID != speechCharacterID {
					return nil, nil, fmt.Errorf("一个口型同步镜头只能包含一个出镜说话角色")
				}
			}
			tracks = append(tracks, botprocessor.SpeechTimelineTrack{
				ID:    speechID,
				Audio: audios[0],
				StartTime: canvasFloat64Value(firstPresent(
					metadata["start_time"],
					metadata["startTime"],
				)),
				Mix: mix,
			})
		}
	}
	if videoURL == "" {
		return nil, nil, fmt.Errorf("口型同步缺少原镜头视频")
	}
	if len(tracks) == 0 {
		return nil, nil, fmt.Errorf("口型同步缺少已生成配音")
	}

	timeline, err := botprocessor.BuildSpeechTimelineAudio(ctx, botprocessor.SpeechTimelineInput{
		RequestID: canvasChildRequestID(req.RequestID, node.ID),
		Duration:  shotDuration,
		Tracks:    tracks,
	})
	if err != nil {
		return nil, nil, err
	}
	input = cloneInput(input)
	params = cloneInput(params)
	clearCanvasLipSyncMedia(input)
	clearCanvasLipSyncMedia(params)
	params["video"] = videoURL
	params["audio"] = timeline.URL
	return input, params, nil
}

func canvasContextOutputsByNode(value any) map[string]any {
	result := map[string]any{}
	collectCanvasContextOutputs(value, result)
	return result
}

func collectCanvasContextOutputs(value any, result map[string]any) {
	if row := mapValue(value); row != nil {
		if nodeID := firstText(row["node_id"], row["nodeId"]); nodeID != "" {
			result[nodeID] = firstPresent(row["output"], row)
		}
		for _, source := range sliceValue(row["sources"]) {
			collectCanvasContextOutputs(source, result)
		}
		return
	}
	for _, current := range sliceValue(value) {
		collectCanvasContextOutputs(current, result)
	}
}

func canvasMediaURLs(value any, mediaType string) []string {
	media := botprotocol.ExtractMediaOutput(value, mediaType)
	return botprotocol.NormalizeMediaList(media[mediaType+"s"], mediaType)
}

func canvasStringList(value any) []string {
	result := []string{}
	for _, raw := range sliceValue(value) {
		if text := strings.TrimSpace(textValue(raw)); text != "" {
			result = append(result, text)
		}
	}
	return result
}

func canvasStringSet(value any) map[string]bool {
	result := map[string]bool{}
	for _, current := range canvasStringList(value) {
		result[current] = true
	}
	return result
}

func clearCanvasLipSyncMedia(values map[string]any) {
	for _, key := range []string{"video", "videos", "audio", "audios"} {
		delete(values, key)
	}
}
