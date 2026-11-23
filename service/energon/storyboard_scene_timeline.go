package energon

import (
	"fmt"
	"maps"
	"strings"
)

const storyboardSceneTimelineRules = `本次先排戏，再设计摄影。以下规则优先于上文关于逐镜输出字段的说明：
1. 先输出 scene_timeline，再输出 target_shot_count 和 shots。先排人物与道具，不写机位、运镜或切镜。opening_state 交代场内位置、朝向、视线、手和身体的姿态以及主要道具状态；从首拍动作发生前或正在进行的时刻开始，不把动作结果提前摆进开场。人物已在场的开场，除非剧情明确要静候，第一秒就让承担开场叙事的角色做出有原因、看得见的身体动作。需要表现反应时，在连续节拍里排清这个人原来在做什么、什么事情让角色察觉、原动作何时停住或改变、视线、手或身体如何回应。不要只写“注意到”“感到”，也不要用别人的动作或道具变化代替这个人的表演。每拍的 seconds 给足真实表演时间，action 写清先后和同期声；停顿要有表演目的。end_state 写动作后完整而可见的状态，没变就用空字符串；下一拍接这个状态，不重做上拍。只有真正换场或跳时才在新一拍填 reset_state；已保存剧本标明 reset 的场次按这个规则开场。
2. 台词只在节拍的 speech 写一次，start_time 相对本拍开头。先排听到后的停顿、眼神和语气，再定发声时刻，留足说完和回应的时间。不要切开一句话，不在 action 复述台词；角色和道具在同场一直沿用共用设定，不为切镜重新入场。没有其他声音要求时 production_plan.voice_mode 用 native，保留模型同期原声和现场声；未要求字幕时 subtitle_mode 用 off。
3. 排完戏才确定 shots：先让观众看清动作发生的部位、接触的物件或被触发的反应，再决定跟拍、移焦或换机位。反应是落点时，保留那个角色的表演时间，让首尾构图分别看得见本人在反应前后的视线、手势或姿态；推拉和景别变化不能代替人物表演。优先用同一机位的跟拍、推近、摇摄或移焦展示新信息，不因模型时长拆段就换镜头。同一运镜拆成多个生成段时，用 camera_connection=continue，接住上段结束的机位、方向、速度和动作阶段，成片用上一段实际尾帧续拍，不停住再启动。需要换机位时用 cut，在动作或视线交接处只改变取景，接同一时刻的动作进度，不能重新摆人物或道具。首镜和换场开场也写 cut，不绑定旧画面。camera_instruction 只安排实际机位、运动与落点，description 和构图只写怎么呈现既定状态，不另编动作。handoff 只安排镜间相机及声场交接，不重拍上一镜动作、台词或音效。
4. 每镜的 cut_after_beat 填它拍完的最后一拍序号，从 1 开始；本镜从上一镜切点之后紧接着拍，不能跳拍或重拍。不要把换场拍装进上一场的镜头。最后一镜拍到全片最后一拍。每镜所含节拍秒数之和须满足本次模型允许的单镜时长。镜头引用本段上镜的人物、使用的场景和道具以及说话角色。duration、首尾状态、镜内动作、对白时刻和镜间绑定由系统从时间线生成，不要在 shots 另填。`

func addStoryboardSceneTimelineSchema(schema, shotSchema map[string]any) {
	fields := mapField(shotSchema, "properties")
	beatFields := map[string]any{
		"seconds":     map[string]any{"type": "integer", "minimum": 1},
		"action":      map[string]any{"type": "string", "minLength": 1, "description": "按发生顺序写本拍可见动作的起势、反应和同期声，不写机位、切镜或台词原文。"},
		"end_state":   map[string]any{"type": "string", "description": "动作结束后的完整人物与道具状态；无变化则留空。"},
		"reset_state": map[string]any{"type": "string", "description": "仅换场或跳时后重新建立的开场状态；第一拍和同一时空内留空。"},
		"speech":      fields["speech"],
	}
	mapField(schema, "properties")["scene_timeline"] = map[string]any{
		"type": "object",
		"properties": map[string]any{
			"opening_state": map[string]any{"type": "string", "minLength": 1},
			"beats": map[string]any{"type": "array", "minItems": 1, "items": map[string]any{
				"type": "object", "properties": beatFields,
				"required": []any{"seconds", "action", "end_state", "reset_state", "speech"}, "additionalProperties": false,
			}},
		},
		"required": []any{"opening_state", "beats"}, "additionalProperties": false,
	}
	schema["required"] = append(schema["required"].([]any), "scene_timeline")
	for _, field := range []string{"duration", "video_prompt", "continuity_state", "continuity_anchor", "speech", "continue_previous", "match_previous"} {
		delete(fields, field)
	}
	fields["cut_after_beat"] = map[string]any{"type": "integer", "minimum": 1}
	fields["camera_connection"] = map[string]any{"type": "string", "enum": []any{"continue", "cut"}}
	required := []any{"cut_after_beat", "camera_connection"}
	for _, field := range shotSchema["required"].([]any) {
		if _, kept := fields[field.(string)]; kept {
			required = append(required, field)
		}
	}
	shotSchema["required"] = required
}

type storyboardSceneBeat struct {
	start, end          int
	entry, exit, action string
	reset               bool
	speech              []any
}

type storyboardSceneTimeline struct {
	beats []storyboardSceneBeat
	next  int
}

func readStoryboardSceneTimeline(value any) (storyboardSceneTimeline, error) {
	plan, _ := value.(map[string]any)
	state := requiredString(plan, "opening_state")
	items, _ := storyboardValueItems(plan["beats"])
	if state == "" || len(items) == 0 {
		return storyboardSceneTimeline{}, fmt.Errorf("场次时间线缺少开场状态或节拍")
	}
	timeline := storyboardSceneTimeline{beats: make([]storyboardSceneBeat, 0, len(items))}
	elapsed := 0
	for index, item := range items {
		row, _ := item.(map[string]any)
		seconds, valid := integerValue(row["seconds"])
		action := requiredString(row, "action")
		if !valid || seconds < 1 || action == "" {
			return storyboardSceneTimeline{}, fmt.Errorf("场次时间线第 %d 拍缺少有效时长或动作", index+1)
		}
		reset := requiredString(row, "reset_state")
		if reset != "" {
			state = reset
		}
		endState := firstStoryboardText(requiredString(row, "end_state"), state)
		speech, _ := storyboardValueItems(row["speech"])
		timeline.beats = append(timeline.beats, storyboardSceneBeat{
			start: elapsed, end: elapsed + seconds, entry: state, exit: endState, action: action, reset: reset != "", speech: speech,
		})
		elapsed += seconds
		state = endState
	}
	return timeline, nil
}

func (timeline *storyboardSceneTimeline) projectShot(shot map[string]any) error {
	cut, valid := integerValue(shot["cut_after_beat"])
	if !valid || cut <= timeline.next || cut > len(timeline.beats) {
		return fmt.Errorf("切点须位于第 %d 至 %d 拍", timeline.next+1, len(timeline.beats))
	}
	beats := timeline.beats[timeline.next:cut]
	first, last := beats[0], beats[len(beats)-1]
	var actions []string
	speech := []any{}
	for index, beat := range beats {
		if index > 0 && beat.reset {
			return fmt.Errorf("须在第 %d 拍换场前切镜", timeline.next+index+1)
		}
		offset := beat.start - first.start
		actions = append(actions, fmt.Sprintf("%d–%d 秒：%s", offset, beat.end-first.start, beat.action))
		for _, item := range beat.speech {
			line, _ := item.(map[string]any)
			start, ok := numberValue(line["start_time"])
			if !ok || start < 0 || start >= float64(beat.end-beat.start) {
				return fmt.Errorf("第 %d 拍的对白起点不在本拍内", timeline.next+index+1)
			}
			line = maps.Clone(line)
			line["start_time"] = float64(offset) + start
			speech = append(speech, line)
		}
	}
	connected := timeline.next > 0 && !first.reset
	continues := connected && shot["camera_connection"] == "continue"
	matches := connected && !continues
	handoff := mapField(shot, "handoff")
	if handoff == nil {
		handoff = map[string]any{}
	}
	handoff["match_action"] = matches
	shot["handoff"] = handoff
	shot["duration"] = last.end - first.start
	shot["video_prompt"] = strings.Join(actions, "\n")
	shot["speech"] = speech
	shot["continuity_state"] = map[string]any{"entry": first.entry, "exit": last.exit}
	shot["continuity_anchor"] = ""
	shot["continue_previous"] = continues
	shot["match_previous"] = matches
	timeline.next = cut
	return nil
}

func projectStoryboardSceneTimeline(output map[string]any, contract storyboardGenerationContract) error {
	timeline, err := readStoryboardSceneTimeline(output["scene_timeline"])
	if err != nil {
		return err
	}
	shots, _ := storyboardValueItems(output["shots"])
	for index, item := range shots {
		shot, ok := item.(map[string]any)
		if !ok {
			return fmt.Errorf("镜头 %d 格式无效", index+1)
		}
		if err := timeline.projectShot(shot); err != nil {
			return fmt.Errorf("镜头 %d：%w", index+1, err)
		}
		seconds := shot["duration"].(int)
		if duration, err := normalizeStoryboardShotDuration(seconds, contract); err != nil || duration != seconds {
			return fmt.Errorf("镜头 %d 的 %d 秒编排不符合当前模型的单镜时长", index+1, seconds)
		}
	}
	if timeline.next != len(timeline.beats) {
		return fmt.Errorf("镜头只拍到第 %d 拍，时间线还有 %d 拍未安排", timeline.next, len(timeline.beats)-timeline.next)
	}
	return nil
}
