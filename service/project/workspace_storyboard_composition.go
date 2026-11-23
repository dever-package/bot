package project

import (
	"context"
	"fmt"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
	energonservice "github.com/dever-package/bot/service/energon"
	botprocessor "github.com/dever-package/bot/service/energon/processor"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func applyCanvasStoryboardCompositionCuts(ctx context.Context, projectID uint64, req CanvasRunRequest, node canvasRunNode, draft, composition map[string]any, results []canvasNodeResult, billing botprotocol.BillingContext) error {
	source := canvasStoryboardSourceNodeID(node)
	baseline := canvasVideoCompositionItemsByID(valueAtPath(draft, "storyboardBaseline", "clips"))
	clips := sliceValue(composition["clips"])
	if source == "" || len(clips) == 0 || len(baseline) == 0 || len(sliceValue(composition["audio_tracks"])) > 0 {
		return nil
	}
	document, err := canvasStoryboardProductionDocument(ctx, projectID, source, req.Canvas)
	if err != nil {
		return err
	}
	workType := textValue(document["work_type"])
	if (workType != botmodel.StoryboardWorkTypeShort && workType != botmodel.StoryboardWorkTypeNarrative) ||
		textValue(valueAtPath(document, "production_plan", "voice_mode")) != storyboardProductionNative {
		return nil
	}
	shots := canvasVideoCompositionItemsByID(document["shots"])
	scenes := map[string]bool{}
	for _, raw := range sliceValue(document["materials"]) {
		material := mapValue(raw)
		if textValue(material["type"]) == "scene" {
			scenes[textValue(material["id"])] = true
		}
	}
	nodes := canvasStoryboardItemNodeIDs(req.Canvas, source)
	orderedPlans := make([]map[string]any, len(clips))
	for index, raw := range sliceValue(draft["clips"]) {
		clip := mapValue(raw)
		resolved := mapValue(clips[index])
		id := textValue(clip["id"])
		originalPlan := baseline[id]
		ref, found := canvasStoryboardItemAssetReference(nodes, "shot", id, results, req.Canvas)
		if originalPlan == nil || !found ||
			!canvasVideoCompositionReferencesEqual(firstPresent(clip["visual_video"], clip["visualVideo"]), canvasVideoCompositionReference(ref)) ||
			!canvasVideoCompositionReferencesEqual(firstPresent(clip["original_audio_source"], clip["originalAudioSource"]), canvasVideoCompositionReference(ref)) ||
			canvasFloat64Value(clip["duration"]) != canvasFloat64Value(originalPlan["duration"]) ||
			len(sliceValue(resolved["speech_tracks"])) > 0 || len(sliceValue(resolved["subtitle_tracks"])) > 0 {
			continue
		}
		orderedPlans[index] = shots[id]
	}
	seams := make([]bool, len(clips)-1)
	for index := range seams {
		seams[index] = canvasStoryboardNeedsSeamReview(orderedPlans[index], orderedPlans[index+1], scenes)
	}
	ctx = energonservice.WithPowerRequestCache(ctx)
	requestID := canvasChildRequestID(req.RequestID, node.ID)
	edges := make([]botprocessor.VideoReviewEdges, len(clips))
	for index, raw := range clips {
		head := index > 0 && seams[index-1]
		tail := index < len(seams) && seams[index]
		if orderedPlans[index] == nil {
			continue
		}
		clip := mapValue(raw)
		protectDialogue := len(sliceValue(orderedPlans[index]["speech"])) > 0
		edges[index], err = botprocessor.ExtractVideoReviewEdges(ctx, textValue(clip["visual_video"]), canvasChildRequestID(requestID, fmt.Sprintf("edge-%d", index+1)), head, tail, protectDialogue)
		if err != nil {
			return fmt.Errorf("镜头 %s：%w", textValue(clip["title"]), err)
		}
	}
	starts := make([]float64, len(clips))
	ends := make([]float64, len(clips))
	for index, edge := range edges {
		ends[index] = edge.Duration
	}
	gateway := energonservice.NewGatewayService()
	for index, verify := range seams {
		if !verify {
			continue
		}
		left, right := orderedPlans[index], orderedPlans[index+1]
		plan := strings.Join([]string{
			"上一镜叙事：" + textValue(left["beat"]),
			"上一镜结束状态：" + textValue(valueAtPath(left, "continuity_state", "exit")),
			"下一镜开始状态：" + textValue(valueAtPath(right, "continuity_state", "entry")),
			"下一镜叙事：" + textValue(right["beat"]),
			"下一镜入点：" + textValue(valueAtPath(right, "handoff", "incoming")),
		}, "\n")
		if boolValue(right["continue_previous"]) {
			plan += "\n沿上一镜的同一次运镜继续。"
		}
		ends[index], starts[index+1], err = gateway.ReviewStoryboardSeam(ctx, canvasChildRequestID(requestID, fmt.Sprintf("seam-%d", index+1)), plan, edges[index].Tail, edges[index+1].Head, billing)
		if err != nil {
			return fmt.Errorf("镜头 %d→%d：%w", index+1, index+2, err)
		}
		mapValue(mapValue(clips[index])["transition_to_next"])["sound_lead_ms"] = 0
	}
	for index, raw := range clips {
		if edges[index].Duration == 0 {
			continue
		}
		length := ends[index] - starts[index]
		if length < 0.1 {
			return fmt.Errorf("镜头 %d 的前后切点没有留下可用区间", index+1)
		}
		clip := mapValue(raw)
		clip["source_start"] = starts[index]
		clip["duration"] = length
	}
	return nil
}

func canvasStoryboardNeedsSeamReview(left, right map[string]any, scenes map[string]bool) bool {
	if left == nil || right == nil || textValue(valueAtPath(right, "continuity_state", "time_jump")) != "" ||
		uint64Value(right["order"]) != uint64Value(left["order"])+1 {
		return false
	}
	if boolValue(right["continue_previous"]) || boolValue(right["match_previous"]) {
		return true
	}
	for _, previous := range sliceValue(left["material_ids"]) {
		if scenes[textValue(previous)] {
			for _, current := range sliceValue(right["material_ids"]) {
				if textValue(previous) == textValue(current) {
					return true
				}
			}
		}
	}
	return false
}
