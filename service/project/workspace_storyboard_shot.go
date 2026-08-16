package project

import (
	"context"
	"fmt"
	"strings"

	energoninput "github.com/dever-package/bot/service/energon/input"
	botprocessor "github.com/dever-package/bot/service/energon/processor"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func prepareCanvasStoryboardShotInput(
	ctx context.Context,
	projectID uint64,
	req CanvasRunRequest,
	node canvasRunNode,
	previousOutput any,
	results []canvasNodeResult,
	input map[string]any,
	params map[string]any,
	mediaReferences []energoninput.MediaReference,
) (map[string]any, map[string]any, []energoninput.MediaReference, error) {
	dependencyID, continuesPrevious, err := canvasStoryboardContinuationDependencyID(node)
	if err != nil {
		return nil, nil, nil, err
	}
	if !continuesPrevious {
		return input, params, mediaReferences, nil
	}
	dependencyNode := canvasNodeByID(dependencyID, req.Canvas)
	dependencyAssetID := firstUint64(
		uint64Value(valueAtPath(dependencyNode, "asset", "id")),
		uint64Value(valueAtPath(dependencyNode, "result_ref", "asset_id")),
	)
	dependencyMetadata := mapValue(firstPresent(
		dependencyNode["storyboard_item"],
		dependencyNode["storyboardItem"],
	))
	if firstText(dependencyMetadata["item_type"], dependencyMetadata["itemType"]) != "shot" {
		return nil, nil, nil, fmt.Errorf("连续镜头依赖的上游不是镜头视频")
	}
	currentSourceNodeID := firstText(
		node.StoryboardItem["source_node_id"],
		node.StoryboardItem["sourceNodeId"],
	)
	dependencySourceNodeID := firstText(
		dependencyMetadata["source_node_id"],
		dependencyMetadata["sourceNodeId"],
	)
	if currentSourceNodeID == "" || dependencySourceNodeID != currentSourceNodeID {
		return nil, nil, nil, fmt.Errorf("连续镜头不能引用其他分镜脚本的镜头")
	}

	output := canvasReferencedNodeOutput(
		ctx,
		projectID,
		dependencyID,
		previousOutput,
		results,
		req.Canvas,
	)
	videos := canvasMediaURLs(output, botprotocol.MediaTypeVideo)
	if len(videos) == 0 {
		return nil, nil, nil, fmt.Errorf("上一镜头视频尚未生成，无法提取连续尾帧")
	}
	tailFrame, err := botprocessor.ExtractVideoTailFrame(ctx, botprocessor.VideoTailFrameInput{
		VideoURL:  videos[0],
		RequestID: canvasChildRequestID(req.RequestID, node.ID),
	})
	if err != nil {
		return nil, nil, nil, err
	}

	input = cloneInput(input)
	params = cloneInput(params)
	delete(input, "previous_output")
	clearCanvasStoryboardMedia(input)
	clearCanvasStoryboardMedia(params)
	mediaReferences = withoutCanvasStoryboardTailVideo(mediaReferences, dependencyAssetID, videos[0])
	mediaReferences = append([]energoninput.MediaReference{{
		ReferenceType: "storyboard_tail_frame",
		Label:         "上一镜头尾帧",
		Kind:          botprotocol.MediaTypeImage,
		URL:           tailFrame.URL,
		Usage:         canvasMediaUsageFirstFrame,
		StrictUsage:   true,
		Required:      true,
	}}, mediaReferences...)
	return input, params, mediaReferences, nil
}

func canvasStoryboardContinuationDependencyID(node canvasRunNode) (string, bool, error) {
	if firstText(node.StoryboardItem["item_type"], node.StoryboardItem["itemType"]) != "shot" {
		return "", false, nil
	}
	continuityAnchor := firstText(
		node.StoryboardItem["continuity_anchor"],
		node.StoryboardItem["continuityAnchor"],
	)
	if continuityAnchor == "" {
		return "", false, nil
	}
	dependencyIDs := canvasStringList(firstPresent(
		node.StoryboardItem["dependency_node_ids"],
		node.StoryboardItem["dependencyNodeIds"],
	))
	if len(dependencyIDs) != 1 {
		return "", false, fmt.Errorf("连续镜头必须且只能依赖一个上一镜头")
	}
	return dependencyIDs[0], true, nil
}

func withoutCanvasStoryboardTailVideo(
	references []energoninput.MediaReference,
	assetID uint64,
	videoURL string,
) []energoninput.MediaReference {
	videoURL = strings.TrimSpace(videoURL)
	result := make([]energoninput.MediaReference, 0, len(references))
	for _, reference := range references {
		isTailVideo := strings.EqualFold(strings.TrimSpace(reference.Kind), botprotocol.MediaTypeVideo) &&
			((assetID > 0 && reference.ReferenceID == assetID) ||
				(videoURL != "" && strings.TrimSpace(reference.URL) == videoURL))
		if isTailVideo {
			continue
		}
		result = append(result, reference)
	}
	return result
}

func clearCanvasStoryboardMedia(values map[string]any) {
	for _, key := range []string{"image", "images", "video", "videos", "audio", "audios", "file", "files"} {
		delete(values, key)
	}
}
