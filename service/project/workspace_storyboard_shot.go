package project

import (
	"context"
	"fmt"

	energoninput "github.com/dever-package/bot/service/energon/input"
	botprocessor "github.com/dever-package/bot/service/energon/processor"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

// Video dependencies are temporal boundaries. Ordinary image references remain
// in reference_node_ids and never trigger video extraction.
func canvasStoryboardBoundarySource(node canvasRunNode, nodes map[string]canvasRunNode) (canvasRunNode, bool, error) {
	if kind := canvasStoryboardItemType(node); kind != "shot" && kind != "shot_image" {
		return canvasRunNode{}, false, nil
	}
	var boundary canvasRunNode
	for _, id := range canvasStringList(firstPresent(node.StoryboardItem["dependency_node_ids"], node.StoryboardItem["dependencyNodeIds"])) {
		source, ok := nodes[id]
		if !ok {
			return canvasRunNode{}, false, fmt.Errorf("前置节点不存在: %s", id)
		}
		if canvasStoryboardItemType(source) != "shot" {
			continue
		}
		if boundary.ID != "" && boundary.ID != id {
			return canvasRunNode{}, false, fmt.Errorf("镜头边界只能引用一个上游视频")
		}
		boundary = source
	}
	return boundary, boundary.ID != "", nil
}

func canvasStoryboardBoundaryUsage(node canvasRunNode) string {
	if canvasStoryboardItemType(node) == "shot" {
		return canvasMediaUsageFirstFrame
	}
	return canvasMediaUsageReference
}

func prepareCanvasStoryboardBoundaryReferences(
	ctx context.Context, projectID uint64, req CanvasRunRequest, node canvasRunNode,
	previousOutput any, results []canvasNodeResult, references []energoninput.MediaReference,
) ([]energoninput.MediaReference, map[string]any, error) {
	if kind := canvasStoryboardItemType(node); kind != "shot" && kind != "shot_image" {
		return references, nil, nil
	}
	nodes := map[string]canvasRunNode{}
	for _, id := range canvasStringList(firstPresent(node.StoryboardItem["dependency_node_ids"], node.StoryboardItem["dependencyNodeIds"])) {
		if raw := canvasNodeByID(id, req.Canvas); raw != nil {
			nodes[id] = canvasRunNode{ID: id, StoryboardItem: mapValue(firstPresent(raw["storyboard_item"], raw["storyboardItem"]))}
		}
	}
	source, found, err := canvasStoryboardBoundarySource(node, nodes)
	if err != nil || !found {
		return references, nil, err
	}
	owner := canvasStoryboardSourceNodeID(node)
	if owner == "" || (canvasStoryboardSourceNodeID(source) != owner && !canvasChapterFrameSourceAllowed(owner, source, req.Canvas)) {
		return nil, nil, fmt.Errorf("镜头边界不能引用其他分镜脚本的视频")
	}
	output := canvasReferencedNodeOutput(ctx, projectID, source.ID, previousOutput, results, req.Canvas)
	videos := canvasMediaURLs(output, botprotocol.MediaTypeVideo)
	if len(videos) == 0 {
		return nil, nil, fmt.Errorf("上一镜头视频尚未生成，无法提取连续尾帧")
	}
	end := canvasStoryboardDisplayedShotDuration(canvasNodeByID(source.ID, req.Canvas), req.Canvas)
	tail, err := botprocessor.ExtractVideoTailFrame(ctx, botprocessor.VideoTailFrameInput{
		VideoURL: videos[0], RequestID: canvasChildRequestID(req.RequestID, node.ID), EndTime: end,
	})
	if err != nil {
		return nil, nil, err
	}
	references = append([]energoninput.MediaReference{{
		ReferenceType: "storyboard_tail_frame", Label: "上一镜头实际尾帧",
		Kind: botprotocol.MediaTypeImage, URL: tail.URL, Usage: canvasStoryboardBoundaryUsage(node),
		StrictUsage: true, Required: true,
	}}, references...)
	return references, map[string]any{
		"url": tail.URL, "source_node_id": source.ID, "source_video": videos[0], "end_time": end,
	}, nil
}

// Continue from the last displayed frame, including an authored composition trim.
func canvasStoryboardDisplayedShotDuration(source map[string]any, canvas map[string]any) float64 {
	item := mapValue(source["storyboard_item"])
	for _, raw := range sliceValue(canvas["nodes"]) {
		node := mapValue(raw)
		compositionItem := mapValue(node["storyboard_item"])
		if textValue(compositionItem["item_type"]) != "video_compose" ||
			textValue(compositionItem["source_node_id"]) != textValue(item["source_node_id"]) {
			continue
		}
		for _, rawClip := range sliceValue(valueAtPath(node, "composer_draft", "video_composition", "clips")) {
			clip := mapValue(rawClip)
			if textValue(clip["id"]) == textValue(item["item_id"]) {
				return canvasFloat64Value(clip["duration"])
			}
		}
	}
	return canvasFloat64Value(item["shot_duration"])
}
