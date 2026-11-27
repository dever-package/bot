package energon

import (
	"fmt"
	"maps"
	"strings"
)

const storyboardLongBeatSeconds = 4

const storyboardSceneTimelineRules = `本次先排戏，再设计摄影。一句话创意展开为有可见变化的小场景；已有剧本保留原有动作、停顿、对白和顺序。不要要求用户补动作提示词。
生成段长不是动作时长。短动作按自然速度做完，分别排清可见的完成点和紧接的动作；不要把几步先后发生的动作塞进一个笼统的时间段。余下时间延续行进或拍对方的反应，不拉长动作、不摆拍等尾帧，也不加无关动作凑时长。剧本有意停顿或放慢则保留。
每拍 opening_action 写起势，progress_at 标出前一阶段达到可见进展的时刻，progress_action 写此时已做到哪、接着谁做什么。短拍无后段填 0 和空串；4 秒及以上写出前后两个时刻，静候写清等什么。递交或展示写清接收者和物件朝向，不朝镜头。只写可拍到的表演，不用运镜代替反应；重拍按反馈删去无用运镜，不只是放慢。普通镜头用 first_frame，必须命中特定构图才用 first_last，shared_end_shot_id 留空。默认只录人物同期台词和表演声。sound_cue 留空、sound_lead_ms 填 0；明确要现场环境原声才设计底声。镜内不配乐，交给全片的音乐节点。
1. 先输出 scene_timeline，再输出 target_shot_count 和 shots。先排人物与道具，不写机位、运镜或切镜。opening_state 交代场内位置、朝向、视线、手和身体的姿态以及主要道具状态；从首拍动作发生前或正在进行的时刻开始，不把动作结果提前摆进开场。人物已在场的开场，除非剧情明确要静候，第一秒就让承担开场叙事的角色做出有原因、看得见的身体动作。反应写清视线从谁或什么移到哪里，目标要符合站位。道具转移写清谁先碰到、谁接住重量、何时放手；没碰到不能带动物件，失去支撑就落到承接面。手有意不松时，让另一人完成自己的动作，不让两人悬着等切点。end_state 写这一拍最后一刻可见的状态，可以在动作中途；没变就用空字符串。下一拍接这个状态，不重做上拍。只有真正换场或跳时才在新一拍填 reset_state；已保存剧本标明 reset 的场次按这个规则开场。
2. 台词只在节拍的 speech 写一次，start_time 相对本拍开头。先排听到后的停顿、眼神和语气，再定发声时刻，留足说完和回应的时间。不要切开一句话，不在表演里复述台词；角色和道具在同场一直沿用共用设定，不为切镜重新入场。道具操作写清哪只手支撑、哪只手操作、视线落在哪，不能让同一只手同时做互斥的动作。没有其他声音要求时 production_plan.voice_mode 用 native，保留人物同期原声；未要求字幕时 subtitle_mode 用 off。
3. 排完戏才确定 shots：先让观众看清动作发生的部位、接触的物件或被触发的反应，再决定跟拍、移焦或换机位。反应是落点时，保留那个角色的表演时间，让首尾构图分别看得见本人在反应前后的视线、手势或姿态；推拉和景别变化不能代替人物表演。默认用固定机位拍清人物动作与回应，画内能看清就保持景别、轴线和焦点。只有主体即将离开取景、需要揭示画外信息，或剧本明确指定时才运镜；选一次有目的的移动，不叠加推拉、横移、环绕和移焦。固定机位也可跨多个生成段，不因满五秒就换镜头或启动相机。同机位续拍用 camera_connection=continue，上段规划尾图就是下段开场图，两段在同一机位、方向、速度与动作阶段交接。若路线本就经过场内前景，可在自然遮挡时交接，再以同方向移出遮挡，不额外加入物件或转场特效。同一场戏默认一次连续拍摄。镜头数或时长只决定分几段生成，不授权剪切。开场就选能容纳整段表演的机位；要看近些就让人物自然走近，或让本机位连续靠近，不能另开近景。只有原剧本明确要求多机位、反打或独立插入镜时才填 allow_camera_cuts=true，按指定位置切；长镜头、连续运镜或不切镜一律为 false。首镜和换场开场也写 cut，不绑定旧画面。camera_moves 用相对本镜的秒数只框出确需移动的时段；人物视线或身体转向不代表相机要动，description 和构图只写怎么呈现既定状态，不另编动作。handoff 只安排镜间相机及声场交接，不重拍上一镜动作、台词或音效。
4. cut_at_second 是本镜结束的全场累计秒数（三段各五秒为 5、10、15），可以落在一拍或一个连续动作的中间。先按自然表演排节拍，不按生成段等分。一条跨段动作只写一次，例如从第 4.3 至 5.8 秒手匀速转动画本，不拆成两次动作。除非剧本需要停顿，同机位续拍应让生成段边界落在已编排的动作内部，不与每个 cue 的开头或结尾重合。拍内切只在 handoff.outgoing 写接点姿态；拍末沿用 end_state。end_framing 只写取景。相邻切点之差须符合模型支持的时长，最后一个切点等于全场时长；换场前切镜，不切断一句对白。duration、首尾状态、镜内动作、对白时刻和镜间绑定由系统按时间生成。`

func addStoryboardSceneTimelineSchema(schema, shotSchema map[string]any) {
	fields := mapField(shotSchema, "properties")
	mapField(fields, "description")["description"] = "只写取景内的人物、道具和相互位置。摄影移动只在 camera_moves 安排，不在画面概述中重复指挥相机。"
	mapField(fields, "end_framing")["description"] = "只写该时刻的静态取景。camera_moves 为空时，沿用开场的摄影机位置和视角，人物与道具可以在画内移动；跟拍、推拉等过程只写在 camera_moves。"
	properties := mapField(schema, "properties")
	if materials := mapField(properties, "materials"); materials != nil {
		delete(mapField(mapField(mapField(materials, "items"), "properties"), "reference_keys"), "uniqueItems")
	}
	delete(mapField(fields, "reference_keys"), "uniqueItems")
	delete(mapField(fields, "lyric_line_indexes"), "uniqueItems")
	mapField(properties, "shots")["description"] = "先排完整场节拍，再以 cut_at_second 标记每段边界；原机位继续拍（固定或移动）用 camera_connection=continue。"
	mapField(mapField(mapField(properties, "production_plan"), "properties"), "voice_mode")["description"] = "默认 native，保留人物同期声，不逐镜生成环境底声；明确要求另配音用 auto，要求静音用 off。"
	handoff := mapField(fields, "handoff")
	handoffFields := mapField(handoff, "properties")
	handoffFields["reaction_cut"] = map[string]any{"type": "boolean", "description": "仅同场换机位，前镜说话、下一镜先拍听者无声反应时为 true。两机位重叠拍同一瞬间：前镜末四分之一秒保留说话人的尾音，后镜前四分之一秒只有听者表情与底声，不开口、不安排接触音；合成会先切画面再切声音，成片比素材之和略短。要求足时、连续运镜、匹配运动或真正换场均为 false。"}
	mapField(handoffFields, "sound_cue")["description"] = "默认留空；仅用户明确要求现场环境原声时设计连续底声：只写稳定声源的远近、强弱和空间混响。同一地点换机位不另起底声。对白、笑声、脚步和道具声写在对应的表演节拍，不能作为循环底声。明确静音时留空。"
	delete(handoffFields, "match_action")
	mapField(handoffFields, "camera_path")["description"] = "仅同一摄影路线穿过相通空间时写途经的开口和逐步显露的新空间，否则留空。"
	mapField(handoffFields, "outgoing")["description"] = "拍内切写当下姿态与道具位置；拍末留空，沿用本拍结束状态。"
	delete(fields, "camera_instruction")
	fields["camera_moves"] = map[string]any{
		"type": "array", "maxItems": 1, "description": "先按固定机位取景，人物都在画内且反应可读时填空数组。只在现有构图即将失去主体、新信息还在画外或用户明确要移动摄影时，给出必要的移动时间窗；可在一拍中途开始或收住。",
		"items": map[string]any{"type": "object", "additionalProperties": false, "required": []string{"start_time", "end_time", "route"}, "properties": map[string]any{
			"start_time": map[string]any{"type": "number", "minimum": 0, "description": "从本镜开头计秒，原构图仍看得清时不提前启动。"},
			"end_time":   map[string]any{"type": "number", "exclusiveMinimum": 0, "description": "从本镜开头计秒，到达能看清新信息的位置就收住，不默认横贯整镜。"},
			"route":        map[string]any{"type": "string", "minLength": 1, "description": "写可见动机、相机方向和落点；若运动跨段，写接点正在经过哪里，而非停车。"},
		}},
	}
	handoffFields["camera_through"] = map[string]any{"type": "string", "description": "下一段沿同一次运镜续拍时，只在前段写一次跨接点的摄影路线：接点前半秒从哪里来、同一固定景物此刻落在画面哪里、后半秒以什么方向和速度离开。固定机位写保持不动。两段共用此路线。真正换机位或收场留空；在下一镜 transition 写观众此时要看的反应或新信息，不因满五秒就换机位。"}
	handoff["required"] = append(handoff["required"].([]string), "camera_through", "camera_path", "reaction_cut")
	speech := mapField(mapField(fields, "speech"), "items")
	speech["required"] = append(speech["required"].([]any), "character_id", "speaker_mode")
	beatFields := map[string]any{
		"seconds": map[string]any{"type": "integer", "minimum": 1},
		"opening_action": map[string]any{"type": "string", "minLength": 1, "description": "第零秒正在进行的动作，只写起始阶段。"},
		"progress_at": map[string]any{"type": "number", "minimum": 0, "description": "前一阶段达到可见进展、后段接上的时刻，从本拍开始计秒，须早于本拍结束。短拍无后段才填零。"},
		"progress_action": map[string]any{"type": "string", "description": "写到 progress_at 时已经能看到的进展，以及紧接的动作、接收者反应或有意等待的缘由，不重演起势。四秒及以上不能留空。"},
		"end_state":     map[string]any{"type": "string", "description": "本拍最后一刻可见的人物与道具状态，可处于动作中途；无变化则留空。"},
		"motion_at_end": map[string]any{"type": "string", "description": "只写接点尚在移动的部位、目标和方向。已经停住的手势或注视是状态，写入 end_state；没有运动就留空。"},
		"reset_state":   map[string]any{"type": "string", "description": "仅换场或跳时后重新建立的开场状态；第一拍和同一时空内留空。"},
		"speech":        fields["speech"],
	}
	mapField(schema, "properties")["scene_timeline"] = map[string]any{
		"type": "object",
		"properties": map[string]any{
			"allow_camera_cuts": map[string]any{"type": "boolean", "description": "原剧本明确指定同场换机位才为 true；一般剧情描述、镜头数量和生成段时长都不是切镜要求。换场或跳时由 reset_state 表示。"},
			"opening_state": map[string]any{"type": "string", "minLength": 1},
			"beats": map[string]any{"type": "array", "minItems": 1, "items": map[string]any{
				"type": "object", "properties": beatFields,

				"required": []any{"seconds", "opening_action", "progress_at", "progress_action", "end_state", "motion_at_end", "reset_state", "speech"}, "additionalProperties": false,
			}},
		},
		"required": []any{"allow_camera_cuts", "opening_state", "beats"}, "additionalProperties": false,
	}
	schema["required"] = append([]any{"scene_timeline"}, schema["required"].([]any)...)
	for _, field := range []string{"duration", "video_prompt", "continuity_state", "continuity_anchor", "speech", "continue_previous", "match_previous"} {
		delete(fields, field)
	}
	fields["cut_at_second"] = map[string]any{"type": "integer", "minimum": 1}
	fields["camera_connection"] = map[string]any{"type": "string", "enum": []any{"continue", "cut"}}
	required := []any{"cut_at_second", "camera_connection", "camera_moves", "handoff"}
	for _, field := range shotSchema["required"].([]any) {
		if _, kept := fields[field.(string)]; kept {
			required = append(required, field)
		}
	}
	shotSchema["required"] = required
}

type storyboardSceneBeat struct {
	start, end  int
	entry, exit string
	motionAtEnd string
	reset       bool
	speech      []any
	cues        []storyboardPerformanceCue
}

type storyboardPerformanceCue struct {
	start  float64
	action string
}

type storyboardSceneTimeline struct {
	allowCameraCuts bool
	beats           []storyboardSceneBeat
	next            int
	previousExit    string
	previousHandoff map[string]any
}

func readStoryboardSceneTimeline(value any) (storyboardSceneTimeline, error) {
	plan, _ := value.(map[string]any)
	state := requiredString(plan, "opening_state")
	items, _ := storyboardValueItems(plan["beats"])
	if state == "" || len(items) == 0 {
		return storyboardSceneTimeline{}, fmt.Errorf("场次时间线缺少开场状态或节拍")
	}
	allowCuts, ok := plan["allow_camera_cuts"].(bool)
	if !ok {
		return storyboardSceneTimeline{}, fmt.Errorf("场次时间线缺少同场机位安排")
	}
	timeline := storyboardSceneTimeline{allowCameraCuts: allowCuts, beats: make([]storyboardSceneBeat, 0, len(items))}
	elapsed := 0
	for index, item := range items {
		row, _ := item.(map[string]any)
		seconds, valid := integerValue(row["seconds"])
		opening := requiredString(row, "opening_action")
		progress := requiredString(row, "progress_action")
		at, timed := numberValue(row["progress_at"])
		if !valid || seconds < 1 || opening == "" {
			return storyboardSceneTimeline{}, fmt.Errorf("第 %d 拍缺少有效时长或起始动作", index+1)
		}
		if !timed || (progress == "" && (seconds >= storyboardLongBeatSeconds || at != 0)) || (progress != "" && (at <= 0 || at >= float64(seconds))) {
			return storyboardSceneTimeline{}, fmt.Errorf("第 %d 拍的后段表演与起点不符：长拍须写可见进展，时间在本拍开始与结束之间", index+1)
		}
		reset := requiredString(row, "reset_state")
		if reset != "" {
			state = reset
		}
		endState := firstStoryboardText(requiredString(row, "end_state"), state)
		speech, _ := storyboardValueItems(row["speech"])
		cues := []storyboardPerformanceCue{{action: opening}}
		if progress != "" {
			cues = append(cues, storyboardPerformanceCue{start: at, action: progress})
		}
		timeline.beats = append(timeline.beats, storyboardSceneBeat{
			start: elapsed, end: elapsed + seconds, entry: state, exit: endState, reset: reset != "", speech: speech,
			motionAtEnd: requiredString(row, "motion_at_end"), cues: cues,
		})
		elapsed += seconds
		state = endState
	}
	return timeline, nil
}

func (timeline *storyboardSceneTimeline) projectShot(shot map[string]any) error {
	cut, valid := integerValue(shot["cut_at_second"])
	from := timeline.next
	if !valid || cut <= from || len(timeline.beats) == 0 || cut > timeline.beats[len(timeline.beats)-1].end {
		return fmt.Errorf("镜头结束秒数须递增且不能超出全场时间线，当前从第 %d 秒开始", from)
	}
	duration := cut - from
	moves, ok := shot["camera_moves"].([]any)
	if !ok || len(moves) > 1 {
		return fmt.Errorf("摄影安排须为固定机位或一段运镜")
	}
	camera := "固定机位，人物按节拍表演，取景不随视线漂移"
	movesAtEntry, movesAtExit := false, false
	if len(moves) == 1 {
		move, _ := moves[0].(map[string]any)
		from, fromOK := numberValue(move["start_time"])
		through, throughOK := numberValue(move["end_time"])
		duration := float64(duration)
		route := requiredString(move, "route")
		if !fromOK || !throughOK || from < 0 || through <= from || through > duration || route == "" {
			return fmt.Errorf("运镜须指定本镜 0 至 %g 秒内的起止时间和路线", duration)
		}
		camera = fmt.Sprintf("%g–%g 秒：%s", from, through, route)
		if from != 0 || through != duration {
			camera += "；其余时段机位固定，表演按节拍继续"
		}
		movesAtEntry, movesAtExit = from == 0, through == duration
	}
	var actions []string
	speech := []any{}
	var entry, exit, outgoingMotion string
	connected := from > 0
	for index, beat := range timeline.beats {
		if beat.end <= from || beat.start >= cut {
			continue
		}
		if beat.reset && beat.start > from {
			return fmt.Errorf("须在第 %d 拍换场前切镜", index+1)
		}
		if beat.start <= from {
			entry = beat.entry
			if from > beat.start {
				entry = timeline.previousExit
			} else if beat.reset {
				connected = false
			}
		}
		for cueIndex, cue := range beat.cues {
			start := float64(beat.start) + cue.start
			end := float64(beat.end)
			if cueIndex+1 < len(beat.cues) {
				end = float64(beat.start) + beat.cues[cueIndex+1].start
			}
			left, right := max(float64(from), start), min(float64(cut), end)
			if left >= right {
				continue
			}
			action := cue.action
			if left > start || right < end {
				action = fmt.Sprintf("同一段表演（%s），只拍其第 %.2f 至 %.2f 秒，共 %.2f 秒；不重演起势、不提前到达结果", cue.action, left-start, right-start, end-start)
			}
			if right == float64(cut) && cut < beat.end {
				exit = requiredString(mapField(shot, "handoff"), "outgoing")
				if exit == "" {
					return fmt.Errorf("第 %d 秒在拍内切分，须写出接点当下可见的姿态", cut)
				}
				if right < end {
					outgoingMotion = fmt.Sprintf("%s，已过 %.2f 秒，共 %.2f 秒", cue.action, right-start, end-start)
				}
			}
			performance := fmt.Sprintf("%g–%g 秒：%s", left-float64(from), right-float64(from), action)
			if right == float64(beat.end) {
				exit = beat.exit
				if beat.end < cut && beat.exit != beat.entry {
					performance += fmt.Sprintf("；到第 %g 秒可见：%s", right-float64(from), beat.exit)
				}
				if index+1 < len(timeline.beats) && !timeline.beats[index+1].reset && beat.motionAtEnd != "" {
					if beat.end == cut {
						outgoingMotion = beat.motionAtEnd
					} else {
						performance += "；接入下一拍的动作：" + beat.motionAtEnd
					}
				}
			}
			actions = append(actions, performance)
		}
		for _, item := range beat.speech {
			line, _ := item.(map[string]any)
			start, ok := numberValue(line["start_time"])
			if !ok || start < 0 || start >= float64(beat.end-beat.start) {
				return fmt.Errorf("第 %d 拍的对白起点不在本拍内", index+1)
			}
			absolute := float64(beat.start) + start
			if absolute >= float64(from) && absolute < float64(cut) {
				line = maps.Clone(line)
				line["start_time"] = absolute - float64(from)
				speech = append(speech, line)
			}
		}
	}
	continues := connected && (!timeline.allowCameraCuts || shot["camera_connection"] == "continue")
	if !continues || !movesAtEntry {
		delete(timeline.previousHandoff, "camera_through")
	}
	matches := connected && !continues
	handoff := mapField(shot, "handoff")
	if handoff == nil {
		handoff = map[string]any{}
	}
	if outgoingMotion != "" {
		handoff["outgoing_motion"] = outgoingMotion
	}
	handoff["outgoing"] = exit
	if continues {
		handoff["incoming"] = entry
	}
	handoff["match_action"] = matches
	if !matches {
		handoff["reaction_cut"] = false
	}
	if !movesAtExit || cut == timeline.beats[len(timeline.beats)-1].end {
		delete(handoff, "camera_through")
	}
	if len(moves) == 0 {
		delete(handoff, "camera_path")
	}
	shot["camera_instruction"] = camera
	shot["handoff"] = handoff
	shot["duration"] = duration
	shot["video_prompt"] = strings.Join(actions, "\n")
	shot["speech"] = speech
	shot["continuity_state"] = map[string]any{"entry": entry, "exit": exit}
	shot["continuity_anchor"] = ""
	shot["continue_previous"] = continues
	shot["match_previous"] = matches
	timeline.previousHandoff = handoff
	timeline.previousExit = exit
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
	if total := timeline.beats[len(timeline.beats)-1].end; timeline.next != total {
		return fmt.Errorf("镜头只拍到第 %d 秒，时间线还有 %d 秒未安排", timeline.next, total-timeline.next)
	}
	return nil
}
