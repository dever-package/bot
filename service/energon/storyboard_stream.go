package energon

import (
	"encoding/json"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botruntime "github.com/dever-package/bot/service/energon/runtime"
)

// 只读取已闭合的根字段与镜头对象；未完成 JSON 不进入最终输出归一化或保存路径。
func storyboardPartialPreview(arguments string) (map[string]any, int, int) {
	shots := make([]any, 0)
	preview := map[string]any{"type": botmodel.OutputTypeStoryboard, "version": botmodel.StoryboardVersion, "shots": shots}
	decoder := json.NewDecoder(strings.NewReader(arguments))
	token, err := decoder.Token()
	if err != nil || token != json.Delim('{') {
		return preview, 0, 0
	}
	observedCount, targetCount := 0, 0
	shotIDs := make(map[string]struct{})
	for decoder.More() {
		token, err := decoder.Token()
		if err != nil {
			break
		}
		key, ok := token.(string)
		if !ok {
			break
		}
		if key == "shots" {
			token, err := decoder.Token()
			if err != nil || token != json.Delim('[') {
				break
			}
			for index := 0; decoder.More(); index++ {
				if index >= botmodel.StoryboardMaxShots {
					return preview, observedCount, targetCount
				}
				tail := strings.TrimLeft(arguments[decoder.InputOffset():], " \t\r\n,")
				if strings.HasPrefix(tail, "{") {
					observedCount++
				}
				var shot map[string]any
				if decoder.Decode(&shot) != nil {
					return preview, observedCount, targetCount
				}
				if !storyboardPreviewShotComplete(shot) {
					continue
				}
				id := requiredString(shot, "id")
				if _, duplicate := shotIDs[id]; duplicate {
					continue
				}
				shotIDs[id] = struct{}{}
				shots = append(shots, shot)
				preview["shots"] = shots
			}
			if _, err := decoder.Token(); err != nil {
				break
			}
			continue
		}
		var value any
		if decoder.Decode(&value) != nil {
			break
		}
		switch key {
		case "target_shot_count":
			// 数字可能停在 2|0 这类分片边界，等待根字段分隔符后才确认总数。
			tail := strings.TrimLeft(arguments[decoder.InputOffset():], " \t\r\n")
			if tail == "" || tail[0] != ',' && tail[0] != '}' {
				continue
			}
			if count, ok := integerValue(value); ok && count > 0 && count <= botmodel.StoryboardMaxShots {
				targetCount = count
			}
		case "title", "summary", "style_prompt", "visual_mode", "aspect_ratio", "narrator_voice":
			if text, ok := value.(string); ok {
				preview[key] = text
			}
		case "storyline":
			if object, ok := value.(map[string]any); ok {
				preview[key] = object
			}
		case "materials":
			if materials, ok := value.([]any); ok {
				preview[key] = materials
			}
		}
	}
	return preview, observedCount, targetCount
}

func storyboardPreviewShotComplete(shot map[string]any) bool {
	for _, field := range storyboardShotRequiredFields() {
		if _, exists := shot[field.(string)]; !exists {
			return false
		}
	}
	for _, field := range []string{"id", "beat", "description", "video_prompt"} {
		if requiredString(shot, field) == "" {
			return false
		}
	}
	for _, field := range []string{"transition", "transition_type", "camera_instruction", "start_framing", "end_framing", "spatial_layout", "shot_image_mode", "continuity_anchor"} {
		if _, ok := shot[field].(string); !ok {
			return false
		}
	}
	for _, field := range []string{"match_previous", "continue_previous"} {
		if _, ok := shot[field].(bool); !ok {
			return false
		}
	}
	if _, ok := integerValue(shot["transition_duration_ms"]); !ok {
		return false
	}
	order, orderOK := integerValue(shot["order"])
	duration, durationOK := numberValue(shot["duration"])
	if !orderOK || order <= 0 || !durationOK || !botmodel.IsStoryboardShotDurationValid(duration) {
		return false
	}
	for _, field := range []string{"material_ids", "reference_keys", "lyric_line_indexes", "speech", "captions"} {
		if _, ok := shot[field].([]any); !ok {
			return false
		}
	}
	state := mapField(shot, "continuity_state")
	return requiredString(state, "entry") != "" && requiredString(state, "exit") != ""
}

func (progress *powerOutputStreamProgress) storyboardPreview(force bool) (botprotocol.Output, bool) {
	if !progress.refreshPreview(force) {
		return nil, false
	}
	for _, call := range progress.calls.Snapshot() {
		if !strings.EqualFold(strings.TrimSpace(call.Name), submitOutputToolName) {
			continue
		}
		preview, observedCount, targetCount := storyboardPartialPreview(call.Arguments)
		progress.observedCount = max(progress.observedCount, observedCount)
		if targetCount > 0 {
			progress.targetCount = targetCount
		}
		generatedCount := progress.observedCount
		if progress.targetCount > 0 {
			generatedCount = min(generatedCount, progress.targetCount)
		}
		meta := map[string]any{
			"output_type": progress.outputType, "generated_count": generatedCount,
			"completed_count": len(preview["shots"].([]any)), "storyboard_preview": preview,
		}
		if progress.targetCount > 0 {
			meta["target_count"] = progress.targetCount
		}
		encoded, err := json.Marshal(meta)
		if err != nil || progress.started && string(encoded) == progress.previewText {
			continue
		}
		progress.started = true
		progress.generatedCount = generatedCount
		progress.previewText = string(encoded)
		return botruntime.WithEstimatedDuration(botprotocol.Output{
			"event": "status", "text": progress.outputName + "正在生成", "meta": meta,
		}, progress.estimatedDurationMS), true
	}
	return nil, false
}
