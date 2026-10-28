package energon

import (
	"fmt"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
)

// ValidateStoryboardSharedFrames validates explicit shared endpoints without
// inventing frames or rebinding a saved endpoint after shots are reordered.
func ValidateStoryboardSharedFrames(document map[string]any) error {
	shots, _ := document["shots"].([]any)
	materialTypes := map[string]string{}
	materials, _ := document["materials"].([]any)
	for _, value := range materials {
		material, _ := value.(map[string]any)
		materialTypes[requiredString(material, "id")] = requiredString(material, "type")
	}
	for index, value := range shots {
		shot, _ := value.(map[string]any)
		if requiredString(shot, "shot_image_mode") != botmodel.StoryboardShotImageNextFirst {
			continue
		}
		fail := func(reason string) error { return fmt.Errorf("镜头 %d 共享结束画面：%s", index+1, reason) }
		if index+1 >= len(shots) {
			return fail("最后一镜没有下一镜，请改用首帧或独立首尾帧")
		}
		next, _ := shots[index+1].(map[string]any)
		if requiredString(shot, "shared_end_shot_id") != requiredString(next, "id") {
			return fail("来源不再是相邻下一镜，请重新选择结束画面")
		}
		currentContinues, _ := shot["continue_previous"].(bool)
		nextContinues, _ := next["continue_previous"].(bool)
		nextMatches, _ := next["match_previous"].(bool)
		if currentContinues || nextContinues || !nextMatches {
			return fail("须使用计划首帧直接连续，不能与真实视频尾帧续接混用")
		}
		nextMode := botmodel.NormalizeStoryboardShotImageMode(requiredString(next, "shot_image_mode"))
		if nextMode != botmodel.StoryboardShotImageFirstFrame && nextMode != botmodel.StoryboardShotImageFirstLast && nextMode != botmodel.StoryboardShotImageNextFirst {
			return fail("下一镜没有可共享的首帧")
		}
		if botmodel.NormalizeStoryboardTransitionType(requiredString(next, "transition_type")) != botmodel.StoryboardTransitionNone {
			return fail("下一镜不能设置转场效果")
		}
		exit := mapField(shot, "continuity_state")
		entry := mapField(next, "continuity_state")
		if requiredString(exit, "exit") == "" || requiredString(exit, "exit") != requiredString(entry, "entry") {
			return fail("结束状态必须与下一镜入镜状态完全一致")
		}
		framing := requiredString(shot, "end_framing")
		if framing == "" || framing != requiredString(next, "start_framing") {
			return fail("结束构图必须与下一镜起始构图完全一致")
		}
		stableIDs := func(row map[string]any) map[string]struct{} {
			ids := map[string]struct{}{}
			values, _ := row["material_ids"].([]any)
			for _, value := range values {
				id, _ := value.(string)
				ids[strings.TrimSpace(id)] = struct{}{}
			}
			return ids
		}
		currentIDs, nextIDs := stableIDs(shot), stableIDs(next)
		hasScene := false
		for id := range currentIDs {
			hasScene = hasScene || materialTypes[id] == "scene"
		}
		if !hasScene || !botmodel.SameStoryboardMaterialIDSet(currentIDs, nextIDs) {
			return fail("必须保持同一场景与相同主体素材")
		}
	}
	return nil
}
