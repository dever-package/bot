package energon

import (
	"encoding/json"
	"fmt"
	"math"
	"sort"
	"strconv"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
)

func storyboardOutputContract(contractContext powerOutputContractContext) (powerOutputContract, error) {
	chapter, _ := contractContext.RequestInput[storyboardScreenplayInputKey].(map[string]any)
	if chapter != nil && chapter["screenplay"] == nil {
		return storyboardScreenplayContract(contractContext.RequestInput), nil
	}

	durationContract, err := storyboardGenerationContractForRequest(
		contractContext.RequestInput,
		contractContext.StoryboardMaxShotDuration,
	)
	if err != nil {
		return powerOutputContract{}, err
	}
	durationContract.SceneTimeline = (durationContract.WorkType == botmodel.StoryboardWorkTypeShort ||
		durationContract.WorkType == botmodel.StoryboardWorkTypeNarrative) && requiredString(contractContext.RequestInput, "_storyboard_shot_edit") == ""
	prompt, err := storyboardOutputPrompt(durationContract)
	if err != nil {
		return powerOutputContract{}, err
	}
	if chapter != nil {
		prompt += "\n本次只按已保存的 storyboard_screenplay.screenplay.parts 逐场生成镜头，description 是已保存的剧本唯一依据。source_passages 只供追溯，不重新改编，不扩拍后章。保留场次、对白及动作顺序。storyboard_previous 仅作第一镜的边界参考：reset 换场；match 继承人物与道具状态但按当前镜头重新构图；continue 沿同一摄影路线复用上一章规划尾图。首镜的内部 match_previous/continue_previous 仍为 false，跨章边界由系统绑定。"
		prompt += "\n保留 storyboard_screenplay.production_request 中适用于本集的时长、声音和字幕要求。每场的 target_duration 是该场全部镜头的时长预算，不是单镜时长。按对白和事件拆成足够多的镜头，完整覆盖整场的动作、对白和结尾，不要只给开场一个短镜。"
	}
	schema := storyboardOutputSchema(durationContract)
	properties := schema["properties"].(map[string]any)
	shotSchema := properties["shots"].(map[string]any)["items"].(map[string]any)
	if chapter != nil {
		screenplay, _ := chapter["screenplay"].(map[string]any)
		parts, _ := storyboardValueItems(screenplay["parts"])
		sceneCount := len(parts)
		if sceneCount == 0 {
			return powerOutputContract{}, fmt.Errorf("已保存剧本缺少场次")
		}
		shotSchema["properties"].(map[string]any)["scene_index"] = map[string]any{"type": "integer", "minimum": 1, "maximum": sceneCount, "description": fmt.Sprintf("对应已保存剧本的场次序号，共 %d 场；按原顺序覆盖，最后一个镜头必须属于第 %d 场。", sceneCount, sceneCount)}
		shotSchema["required"] = append(shotSchema["required"].([]any), "scene_index")
		prompt += fmt.Sprintf("\n已保存剧本共 %d 场，每个镜头必须填写 scene_index，对应场次序号 1 至 %d。先规划全篇的摄影路线和各场衔接，再将各场生成段数相加填写 target_shot_count；不要把场次数量当作镜头总数。shots 从第 1 场开始，按原顺序完整覆盖全部场次，每场至少一个镜头，最后一个镜头必须属于第 %d 场，不得提前结束、跳过或倒序。场次的 connection=reset 明确换场或跳时；其余边界优先沿同一条摄影路线继续拍；只在明确需要独立取景时另生成开场。", sceneCount, sceneCount, sceneCount)
	}
	if chapter == nil && contractContext.RequestInput["storyboard_previous"] != nil {
		properties["previous_connection"] = map[string]any{"type": "string", "enum": []any{"reset", "match", "continue"}}
		schema["required"] = append(schema["required"].([]any), "previous_connection")
		prompt += "\n已连接前一份分镜，storyboard_previous 是其真实末镜与素材。必须填写 previous_connection：reset 换场或跳时；match 同场换机位，继承状态并按当前镜头重新构图；continue 沿前章的摄影路线继续，系统绑定上一章规划尾图。只有空间不相通、跳时或确需独立取景时才另起开场。首镜内部 match_previous/continue_previous 仍为 false。"
	}
	if materials, _ := storyboardValueItems(contractContext.RequestInput[botmodel.StoryboardMaterialsInputKey]); len(materials) > 0 {
		// Shared definitions are server-owned. Generate shot references only.
		delete(properties, "materials")
		required := []any{}
		for _, key := range schema["required"].([]any) {
			if key != "materials" {
				required = append(required, key)
			}
		}
		schema["required"] = required
		ids, actors := []any{}, []any{""}
		for _, raw := range materials {
			material := raw.(map[string]any)
			ids = append(ids, material["id"])
			if material["type"] == "character" {
				actors = append(actors, material["id"])
			}
		}
		fields := shotSchema["properties"].(map[string]any)
		fields["material_ids"].(map[string]any)["items"] = map[string]any{"type": "string", "enum": ids}
		speech := fields["speech"].(map[string]any)["items"].(map[string]any)["properties"].(map[string]any)
		speech["character_id"] = map[string]any{"type": "string", "enum": actors}
		prompt += "\nmaterials 由系统从共用设定直接绑定，不输出或重写 materials。镜头 material_ids 和对白 character_id 只能引用输入共用设定中的实际 ID；角色、场景、道具的身份与外观均由系统保留。"
	}
	if durationContract.SceneTimeline {
		addStoryboardSceneTimelineSchema(schema, shotSchema)
	}
	return powerOutputContract{
		Type:        "分镜脚本",
		Description: "提交最终分镜脚本。先确定 target_shot_count，并在任何 shots 内容之前输出该字段；必须完整填写系统定义的字段，不得改变字段名或结构。",
		Prompt:      prompt,
		Schema:      schema,
		Normalize: func(output map[string]any, requestInput map[string]any) (map[string]any, error) {
			return normalizeStoryboardOutput(output, requestInput, durationContract)
		},
	}, nil
}

func storyboardOutputSchema(contract storyboardGenerationContract) map[string]any {
	minShotDuration := contract.MinShotDuration
	maxShotDuration := contract.MaxShotDuration
	durationSchema := map[string]any{"type": "integer", "minimum": minShotDuration, "maximum": maxShotDuration}
	if len(contract.DurationOptions) > 0 && !storyboardTracksContinuity(contract.WorkType) {
		durationSchema["enum"] = contract.DurationOptions
	}
	minShotCount := 1
	maxShotCount := botmodel.StoryboardMaxShots
	continuityStateSchema := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"entry": map[string]any{"type": "string", "minLength": 1},
			"exit":  map[string]any{"type": "string", "minLength": 1},
		},
		"required":             []any{"entry", "exit"},
		"additionalProperties": false,
	}
	if storyboardTracksContinuity(contract.WorkType) {
		continuityStateSchema = storyboardContinuitySchema()
	}
	storylineSchema := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"setup":       map[string]any{"type": "string", "minLength": 1},
			"development": map[string]any{"type": "string", "minLength": 1},
			"payoff":      map[string]any{"type": "string", "minLength": 1},
		},
		"required":             []any{"setup", "development", "payoff"},
		"additionalProperties": false,
	}
	speechSchema := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"id":               map[string]any{"type": "string", "minLength": 1},
			"kind":             map[string]any{"type": "string", "enum": []any{"dialogue", "narration"}},
			"text":             map[string]any{"type": "string", "minLength": 1},
			"start_time":       map[string]any{"type": "number", "minimum": 0},
			"character_id":     map[string]any{"type": "string"},
			"speaker_mode":     map[string]any{"type": "string", "enum": []any{"visible", "offscreen"}},
			"subtitle_enabled": map[string]any{"type": "boolean"},
			"subtitle_text":    map[string]any{"type": "string"},
		},
		"required":             []any{"id", "kind", "text", "start_time", "subtitle_enabled", "subtitle_text"},
		"additionalProperties": false,
	}
	captionSchema := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"id":         map[string]any{"type": "string", "minLength": 1},
			"type":       map[string]any{"type": "string", "enum": []any{"caption", "title", "highlight"}},
			"text":       map[string]any{"type": "string", "minLength": 1},
			"start_time": map[string]any{"type": "number", "minimum": 0},
			"end_time":   map[string]any{"type": "number", "exclusiveMinimum": 0},
		},
		"required":             []any{"id", "type", "text", "start_time", "end_time"},
		"additionalProperties": false,
	}
	materialSchema := storyboardMaterialSchema()
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"type":    map[string]any{"type": "string", "enum": []any{botmodel.OutputTypeStoryboard}},
			"version": map[string]any{"type": "integer", "enum": []any{botmodel.StoryboardVersion}},
			"title":   map[string]any{"type": "string"},
			"summary": map[string]any{"type": "string", "minLength": 1},
			"target_duration": map[string]any{
				"type":    "integer",
				"minimum": minShotDuration,
			},
			"target_shot_count": map[string]any{
				"type":    "integer",
				"minimum": minShotCount,
				"maximum": maxShotCount,
			},
			"narrator_voice": map[string]any{"type": "string"},
			"storyline":      storylineSchema,
			"style_prompt":   map[string]any{"type": "string", "minLength": 1},
			"visual_mode": map[string]any{
				"type": "string",
				"enum": []any{botmodel.StoryboardVisualModePhotoreal, botmodel.StoryboardVisualModeStylized},
			},
			"aspect_ratio": map[string]any{"type": "string", "enum": []any{"16:9", "9:16", "1:1", "4:3", "3:4", "21:9"}},
			"production_plan": map[string]any{
				"type": "object",
				"properties": map[string]any{
					"voice_mode":    map[string]any{"type": "string", "enum": []any{"auto", "native", "off"}, "description": "auto 使用独立配音节点；用户要求视频原声或模型直接说话时用 native；明确不要人声时用 off。MV 固定 off。"},
					"subtitle_mode": map[string]any{"type": "string", "enum": []any{"auto", "off"}, "description": "用户要求字幕时用 auto，否则 off。"},
				},
				"required":             []any{"voice_mode", "subtitle_mode"},
				"additionalProperties": false,
			},
			"shots": map[string]any{
				"description": "按一条完整摄影路线从开场到落点排列的生成段。同一摄影镜头拆出的后段使用 continue_previous，机位和景别在连续运镜里推进。",
				"type":        "array",
				"minItems":    minShotCount,
				"maxItems":    maxShotCount,
				"items": map[string]any{
					"type": "object",
					"properties": map[string]any{
						"id":         map[string]any{"type": "string", "minLength": 1},
						"order":      map[string]any{"type": "integer", "minimum": 1},
						"duration":   durationSchema,
						"beat":       map[string]any{"type": "string", "minLength": 1},
						"transition": map[string]any{"type": "string"},
						"handoff": map[string]any{
							"type": "object", "additionalProperties": false,
							"properties": map[string]any{
								"outgoing":      map[string]any{"type": "string", "description": "本段尾帧的运动方向、速度感、画面重心及下一段可接住的动作或视线。"},
								"incoming":      map[string]any{"type": "string", "description": "续拍沿用上一段 outgoing 的同一时刻；实际切镜时，写新取景如何接住前段的动作或视线。"},
								"camera_path":   map[string]any{"type": "string", "description": "仅在跨不同场景素材仍连续可拍时填写。从上一段末帧通过哪个已有开口或路径进入新空间、如何逐步显露新画面，并设置 continue_previous；其他情况留空。"},
								"match_action":  map[string]any{"type": "boolean", "description": "仅当同场换机位的直接切点需要用相邻上一镜实际末帧承接同一个动作或刚造成的道具状态时为 true；普通同场切镜、省略时间或换场用 false。"},
								"sound_cue":     map[string]any{"type": "string"},
								"sound_lead_ms": map[string]any{"type": "integer", "minimum": 0, "maximum": 900},
							},
							"required": []string{"outgoing", "incoming", "sound_cue", "sound_lead_ms"},
						},
						"transition_type": map[string]any{
							"type": "string",
							"enum": []string{botmodel.StoryboardTransitionNone},
						},
						"transition_duration_ms": map[string]any{"type": "integer", "enum": []int{0}},
						"description":            map[string]any{"type": "string", "minLength": 1},
						"camera_instruction":     map[string]any{"type": "string", "description": "从开场位置与景别出发，写清摄影机移动的方向、速度感和最终关注点；稳定取景时写明机位。"},
						"start_framing":          map[string]any{"type": "string"},
						"end_framing":            map[string]any{"type": "string"},
						"spatial_layout":         map[string]any{"type": "string", "minLength": 1, "description": storyboardSpatialLayoutDescription},
						"video_prompt":           map[string]any{"type": "string", "minLength": 1, "description": "直接送给视频模型的镜内表演与声音；存在 continuity_state.facts 时，状态变化由 facts 规定，此处只补动作的节拍、视线、反应和现场声。无 facts 时写完整镜内动作。不含镜间剪辑指令。动作切镜只写接点后的表演；台词原文与起点只写 speech。"},
						"material_ids":           map[string]any{"type": "array", "items": map[string]any{"type": "string", "minLength": 1}},
						"reference_keys":         map[string]any{"type": "array", "items": map[string]any{"type": "string", "minLength": 1}, "uniqueItems": true},
						"shared_end_shot_id":     map[string]any{"type": "string"},
						"shot_image_mode":        map[string]any{"type": "string", "enum": []string{botmodel.StoryboardShotImageFirstLast}, "description": "镜头使用首尾图。续拍时，上一段规划尾图同时作为本段首图。"},
						"match_previous":         map[string]any{"type": "boolean", "description": "同场换机位，重新生成本镜构图的首帧。普通换机位参考同主体最近的规划画面；handoff.match_action=true 时以紧邻上一镜的规划尾图重构同一动作时刻。与 continue_previous 互斥。"},
						"continue_previous":      map[string]any{"type": "boolean", "description": "同一次拍摄的后段为 true，共用上一段规划尾图；entry 和 start_framing 承接上一段 exit 和 end_framing。景别、机位方向可在当前段内经运镜改变；时空有跳跃时为 false。"},
						"continuity_anchor":      map[string]any{"type": "string"},
						"continuity_state":       continuityStateSchema,
						"lyric_line_indexes": map[string]any{
							"type": "array", "items": map[string]any{"type": "integer", "minimum": 1}, "uniqueItems": true,
							"description": "按音轨时间顺序对应歌词行；本镜最小行号不得小于此前镜头已用的最大行号。跨镜延续只可重复此前最后一行，不能按画面意象回填早先歌词。",
						},
						"speech":   map[string]any{"type": "array", "items": speechSchema},
						"captions": map[string]any{"type": "array", "items": captionSchema},
					},
					"required":             storyboardShotRequiredFields(),
					"additionalProperties": false,
				},
			},
			"materials": map[string]any{"type": "array", "items": materialSchema},
		},
		"required":             []any{"type", "version", "title", "summary", "target_duration", "target_shot_count", "narrator_voice", "storyline", "style_prompt", "visual_mode", "aspect_ratio", "production_plan", "shots", "materials"},
		"additionalProperties": false,
	}
}

// 最终输出 schema 和只读流式预览共享必填字段；预览不补造缺失内容。
func storyboardShotRequiredFields() []any {
	return []any{
		"id", "order", "duration", "beat", "transition", "transition_type", "transition_duration_ms", "description", "camera_instruction", "start_framing", "end_framing", "spatial_layout", "video_prompt", "material_ids", "reference_keys", "shot_image_mode", "shared_end_shot_id", "match_previous", "continue_previous", "continuity_anchor", "continuity_state", "lyric_line_indexes", "speech", "captions",
	}
}

func normalizeStoryboardOutput(
	input map[string]any,
	requestInput map[string]any,
	durationContract storyboardGenerationContract,
) (map[string]any, error) {
	if durationContract.SceneTimeline {
		if err := projectStoryboardSceneTimeline(input, durationContract); err != nil {
			return nil, err
		}
	}
	if definitions, _ := storyboardValueItems(requestInput[botmodel.StoryboardMaterialsInputKey]); len(definitions) > 0 {
		input = cloneAnyMap(input)
		input["materials"] = definitions
		known := map[string]string{}
		for _, raw := range definitions {
			material := raw.(map[string]any)
			known[requiredString(material, "id")] = requiredString(material, "type")
		}
		shots, _ := storyboardValueItems(input["shots"])
		for i, raw := range shots {
			shot, ok := raw.(map[string]any)
			if !ok {
				return nil, fmt.Errorf("镜头%d格式无效", i+1)
			}
			for _, id := range storyboardStringItems(shot["material_ids"]) {
				if known[id] == "" {
					return nil, fmt.Errorf("镜头%d引用了共用素材以外的身份：%s", i+1, id)
				}
			}
			speech, _ := storyboardValueItems(shot["speech"])
			for _, raw := range speech {
				line, ok := raw.(map[string]any)
				if !ok {
					return nil, fmt.Errorf("镜头%d的对白格式无效", i+1)
				}
				if requiredString(line, "kind") == "dialogue" && known[requiredString(line, "character_id")] != "character" {
					return nil, fmt.Errorf("镜头%d的对白未引用共用角色", i+1)
				}
			}
		}
	}
	narratorVoice := requiredString(input, "narrator_voice")
	materials, materialTypes, materialIDLookup, err := normalizeStoryboardMaterials(input["materials"])
	if err != nil {
		return nil, err
	}
	settingStyle, err := normalizeStoryboardSettingMaterials(materials, requestInput[botmodel.StoryboardMaterialsInputKey])
	if err != nil {
		return nil, err
	}
	if err := applyStoryboardSceneConnections(input, requestInput); err != nil {
		return nil, err
	}
	shots, err := normalizeStoryboardShots(input["shots"], materialTypes, materialIDLookup, durationContract)
	if err != nil {
		return nil, err
	}
	if storyboardTracksContinuity(durationContract.WorkType) && !durationContract.SceneTimeline {
		for index, value := range shots {
			shot := value.(map[string]any)
			if _, exists := mapField(shot, "continuity_state")["facts"]; !exists {
				return nil, fmt.Errorf("镜头 %d 缺少动作连续性计划", index+1)
			}
		}
	}
	storyline := normalizeStoryboardStoryline(input["storyline"], shots)
	summary := requiredString(input, "summary")
	if summary == "" {
		summary = botmodel.StoryboardSummaryFromStoryline(
			requiredString(storyline, "setup"),
			requiredString(storyline, "development"),
			requiredString(storyline, "payoff"),
		)
	}
	if summary == "" {
		summary = "围绕当前主题展开并完成一个连贯事件"
	}
	lyricsLRC, err := normalizeStoryboardLyricsPlan(requestInput, durationContract.WorkType, shots)
	if err != nil {
		return nil, err
	}
	title := storyboardOutputTitle(requiredString(input, "title"), requestInput, summary, shots)
	visualMode := botmodel.NormalizeStoryboardVisualMode(requiredString(input, "visual_mode"))
	if !botmodel.IsStoryboardVisualMode(visualMode) {
		visualMode = botmodel.StoryboardVisualModePhotoreal
	}
	stylePrompt := requiredString(input, "style_prompt")
	if stylePrompt == "" {
		stylePrompt = botmodel.DefaultStoryboardStylePrompt(visualMode, false)
	}
	aspectRatio := normalizeStoryboardAspectRatio(requiredString(input, "aspect_ratio"))
	if mode := requiredString(settingStyle, "visual_mode"); mode != "" {
		visualMode = mode
		stylePrompt = requiredString(settingStyle, "style_prompt")
		aspectRatio = normalizeStoryboardAspectRatio(requiredString(settingStyle, "aspect_ratio"))
	}
	// Totals are derived from the shots, not a reason to reject the script.
	targetDuration := 0
	for _, value := range shots {
		shot, _ := value.(map[string]any)
		duration, _ := integerValue(shot["duration"])
		targetDuration += duration
	}
	result := map[string]any{
		"type":    botmodel.OutputTypeStoryboard,
		"version": botmodel.StoryboardVersion,
		"workflow": map[string]any{
			"status":       "draft",
			"confirmed_at": "",
		},
		"title":             title,
		"summary":           summary,
		"target_duration":   targetDuration,
		"target_shot_count": len(shots),
		"min_shot_duration": durationContract.MinShotDuration,
		"lyrics_lrc":        lyricsLRC,
		"narrator_voice":    narratorVoice,
		"storyline":         storyline,
		"style_prompt":      stylePrompt,
		"visual_mode":       visualMode,
		"aspect_ratio":      aspectRatio,
		"references":        []any{},
		"shots":             shots,
		"materials":         materials,
	}
	if durationContract.TargetDuration > 0 {
		result[botmodel.StoryboardRangeStartMSKey] = durationContract.RangeStartMS
		result[botmodel.StoryboardRangeEndMSKey] = durationContract.RangeEndMS
		result[botmodel.StoryboardSoundtrackDurationMSKey] = durationContract.SoundtrackDurationMS
		result[botmodel.StoryboardTimelineDurationMSKey] = durationContract.TimelineDurationMS
	}
	if requestInput["storyboard_previous"] != nil && requestInput[storyboardScreenplayInputKey] == nil {
		result["previous_connection"] = requiredString(input, "previous_connection")
	}
	if err := applyStoryboardChapterBoundary(result, requestInput); err != nil {
		return nil, err
	}
	if err := ResolveStoryboardContinuity(result); err != nil {
		return nil, err
	}
	if plan, ok := input["production_plan"].(map[string]any); ok {
		productionPlan := map[string]any{
			"output_target": "shot_images", "shot_visual_strategy": "auto",
			"voice_mode": plan["voice_mode"], "subtitle_mode": plan["subtitle_mode"],
		}
		if requestInput[storyboardScreenplayInputKey] != nil {
			productionPlan["output_target"] = "final_video"
		}
		if durationContract.WorkType == botmodel.StoryboardWorkTypeMV {
			productionPlan["voice_mode"] = "off"
			productionPlan["subtitle_mode"] = "off"
		}
		result["production_plan"] = productionPlan
	}
	return result, nil
}

// Shared identities are checked against the supplied setting, not inferred from
// the model's newly generated material list. New story objects remain allowed.
func normalizeStoryboardSettingMaterials(materials []any, input any) (map[string]any, error) {
	style := map[string]any{}
	if input == nil {
		return style, nil
	}
	definitions, ok := storyboardValueItems(input)
	if !ok {
		return nil, fmt.Errorf("共用设定必须是素材数组")
	}
	byID := map[string]map[string]any{}
	byName := map[string]string{}
	for _, raw := range definitions {
		definition, ok := raw.(map[string]any)
		if !ok {
			return nil, fmt.Errorf("共用设定条目格式无效")
		}
		id, kind, name := requiredString(definition, "id"), requiredString(definition, "type"), requiredString(definition, "name")
		if id == "" || normalizeStoryboardMaterialType(kind) == "" || name == "" || requiredString(definition, "prompt") == "" || byID[id] != nil {
			return nil, fmt.Errorf("共用设定需要唯一身份、有效类型、名称和外观描述")
		}
		key := kind + ":" + storyboardLookupKey(name)
		if byName[key] != "" {
			return nil, fmt.Errorf("共用设定名称重复：%s", name)
		}
		byID[id], byName[key] = definition, id
		if mode := requiredString(definition, "visual_mode"); mode != "" {
			if !botmodel.IsStoryboardVisualMode(mode) || requiredString(definition, "style_prompt") == "" {
				return nil, fmt.Errorf("共用设定画风无效")
			}
			for _, field := range []string{"visual_mode", "style_prompt", "aspect_ratio"} {
				value := requiredString(definition, field)
				if previous, exists := style[field]; exists && previous != value {
					return nil, fmt.Errorf("共用设定画风不一致")
				}
				style[field] = value
			}
		}
	}
	for _, raw := range materials {
		material := raw.(map[string]any)
		id, kind, name := requiredString(material, "id"), requiredString(material, "type"), requiredString(material, "name")
		definition := byID[id]
		if definition == nil {
			if byName[kind+":"+storyboardLookupKey(name)] != "" {
				return nil, fmt.Errorf("角色或素材“%s”未沿用共用设定的身份，请重新生成分镜", name)
			}
			continue
		}
		if kind != requiredString(definition, "type") || name != requiredString(definition, "name") {
			return nil, fmt.Errorf("共用设定身份与名称或类型不一致：%s", id)
		}
		material["prompt"] = requiredString(definition, "prompt")
	}
	return style, nil
}

func storyboardOutputTitle(current string, requestInput map[string]any, summary string, shots []any) string {
	if title := storyboardTitleCandidate(current); title != "" && !isGenericStoryboardTitle(title) {
		return title
	}
	candidates := []any{requestInput["prompt"], requestInput["text"], summary}
	if len(shots) > 0 {
		shot, _ := shots[0].(map[string]any)
		candidates = append(candidates, shot["beat"], shot["description"])
	}
	for _, candidate := range candidates {
		if title := storyboardTitleCandidate(powerPromptText(candidate)); title != "" && !isGenericStoryboardTitle(title) {
			return title
		}
	}
	return "分镜脚本"
}

func storyboardTitleCandidate(value string) string {
	value = strings.TrimSpace(value)
	if index := strings.IndexAny(value, "\r\n"); index >= 0 {
		value = value[:index]
	}
	value = strings.Join(strings.Fields(value), " ")
	if index := strings.IndexAny(value, "@#。！？!?；;"); index >= 0 {
		value = value[:index]
	}
	value = strings.Trim(value, " \t，,。.!！?？:：;；-—")
	runes := []rune(value)
	if len(runes) > 24 {
		value = string(runes[:24])
	}
	return strings.TrimSpace(value)
}

func isGenericStoryboardTitle(value string) bool {
	switch strings.TrimSpace(value) {
	case "未命名", "未命名分镜", "分镜", "分镜脚本", "暂无内容简介", "围绕当前主题展开并完成一个连贯事件":
		return true
	default:
		return false
	}
}

func normalizeStoryboardStoryline(value any, shots []any) map[string]any {
	storyline, _ := value.(map[string]any)
	setup := requiredString(storyline, "setup")
	development := requiredString(storyline, "development")
	payoff := requiredString(storyline, "payoff")
	if len(shots) > 0 {
		first, _ := shots[0].(map[string]any)
		last, _ := shots[len(shots)-1].(map[string]any)
		setup = firstStoryboardText(setup, requiredString(first, "description"), requiredString(first, "beat"))
		payoff = firstStoryboardText(payoff, requiredString(last, "description"), requiredString(last, "beat"))
		if development == "" {
			parts := make([]string, 0, len(shots))
			for _, value := range shots {
				shot, _ := value.(map[string]any)
				if beat := requiredString(shot, "beat"); beat != "" {
					parts = append(parts, beat)
				}
			}
			development = strings.Join(parts, "；")
		}
	}
	setup = firstStoryboardText(setup, development, payoff, "建立人物、环境与当前处境")
	development = firstStoryboardText(development, setup, payoff, "事件在镜头间持续推进")
	payoff = firstStoryboardText(payoff, development, setup, "事件形成清晰的可见结果")
	return map[string]any{
		"setup":       setup,
		"development": development,
		"payoff":      payoff,
	}
}

func normalizeStoryboardAspectRatio(value string) string {
	switch strings.TrimSpace(value) {
	case "16:9", "9:16", "1:1", "4:3", "3:4", "21:9":
		return strings.TrimSpace(value)
	default:
		return "16:9"
	}
}

func normalizeStoryboardShots(
	value any,
	materialTypes map[string]string,
	materialIDLookup map[string]string,
	durationContract storyboardGenerationContract,
) ([]any, error) {
	items, ok := storyboardValueItems(value)
	if !ok || len(items) == 0 {
		return nil, fmt.Errorf("shots 至少需要一个镜头")
	}
	if len(items) > botmodel.StoryboardMaxShots {
		return nil, fmt.Errorf("shots 最多允许 %d 个镜头", botmodel.StoryboardMaxShots)
	}
	shots := make([]any, 0, len(items))
	shotIDs := make(map[string]struct{}, len(items))
	speechIDs := make(map[string]struct{})
	captionIDs := make(map[string]struct{})
	soundPolicy := botmodel.StoryboardSoundPolicyForWorkType(durationContract.WorkType)
	previousExitState := ""
	previousEndFraming := ""
	previousOutgoing := ""
	var previousMaterialIDs map[string]struct{}
	for index, item := range items {
		row, ok := item.(map[string]any)
		if !ok {
			return nil, fmt.Errorf("镜头 %d 格式无效", index+1)
		}
		shotID := uniqueStoryboardID(requiredString(row, "id"), fmt.Sprintf("shot-%d", index+1), shotIDs)
		duration, captureDuration, err := storyboardShotDurations(row["duration"], durationContract)
		if err != nil {
			return nil, fmt.Errorf("镜头 %d: %w", index+1, err)
		}
		beat := requiredString(row, "beat")
		description := requiredString(row, "description")
		videoPrompt := requiredString(row, "video_prompt")
		if beat == "" && description == "" && videoPrompt == "" {
			return nil, fmt.Errorf("镜头 %d 缺少可执行的画面语义", index+1)
		}
		beat = firstStoryboardText(beat, description, videoPrompt)
		description = firstStoryboardText(description, videoPrompt, beat)
		videoPrompt = firstStoryboardText(videoPrompt, description, beat)
		transition := ""
		if index > 0 {
			transition = requiredString(row, "transition")
		}
		cameraInstruction := firstStoryboardText(requiredString(row, "camera_instruction"), "固定机位")
		startFraming := firstStoryboardText(requiredString(row, "start_framing"), cameraInstruction)
		endFraming := firstStoryboardText(requiredString(row, "end_framing"), startFraming)
		materialIDs, materialIDSet := normalizeStoryboardMaterialIDs(
			row["material_ids"],
			materialTypes,
			materialIDLookup,
		)
		referenceKeys := normalizeStoryboardReferenceKeys(row["reference_keys"])
		matchPrevious, matchPreviousProvided := row["match_previous"].(bool)
		continuePrevious, _ := row["continue_previous"].(bool)
		matchesPrevious := index > 0 && matchPrevious
		if index > 0 && !matchPreviousProvided {
			matchesPrevious = storyboardShouldMatchPrevious(previousMaterialIDs, materialIDSet, materialTypes)
		}
		continuesPrevious := index > 0 && continuePrevious
		rawHandoff := mapField(row, "handoff")
		cameraPath := requiredString(rawHandoff, "camera_path")
		if continuesPrevious && cameraPath == "" && storyboardIntroducesScene(previousMaterialIDs, materialIDSet, materialTypes) {
			// 接不上尾帧但仍在同一场戏内时，以尾帧为底改图，不从零重画。
			continuesPrevious = false
			matchesPrevious = storyboardShouldMatchPrevious(previousMaterialIDs, materialIDSet, materialTypes)
		}
		if continuesPrevious {
			matchesPrevious = false
		}
		speech := normalizeStoryboardSpeech(
			row["speech"],
			index,
			speechIDs,
			materialTypes,
			materialIDLookup,
			materialIDSet,
		)
		if !soundPolicy.GeneratedSpeech {
			speech = []any{}
		}
		continuityAnchor := ""
		if continuesPrevious {
			continuityAnchor = firstStoryboardText(
				requiredString(row, "continuity_anchor"),
				transition,
				"承接上一镜头结束状态，保持角色、场景、主体位置、姿态、动作方向与光线连续，并说明道具变化",
			)
		}
		continuityState, err := normalizeStoryboardContinuityState(
			row["continuity_state"],
			index,
			materialIDLookup,
		)
		if err != nil {
			return nil, err
		}
		matchAction := matchesPrevious && rawHandoff["match_action"] == true && !storyboardIntroducesScene(previousMaterialIDs, materialIDSet, materialTypes)
		if continuesPrevious || matchAction {
			continuityState["entry"] = previousExitState
		}
		if continuesPrevious && previousEndFraming != "" {
			startFraming = previousEndFraming
		}
		incoming := requiredString(rawHandoff, "incoming")
		if continuesPrevious {
			// The shared frame also represents one camera and action state.
			incoming = firstStoryboardText(previousOutgoing, incoming)
		}
		outgoing := requiredString(rawHandoff, "outgoing")
		soundCue := requiredString(rawHandoff, "sound_cue")
		lead, _ := integerValue(rawHandoff["sound_lead_ms"])
		if index == 0 || continuesPrevious || soundCue == "" || lead < 100 || !soundPolicy.GeneratedSpeech {
			lead = 0
		}
		handoff := map[string]any{
			"outgoing":      firstStoryboardText(outgoing, requiredString(continuityState, "exit")),
			"incoming":      firstStoryboardText(incoming, requiredString(continuityState, "entry")),
			"sound_cue":     soundCue,
			"sound_lead_ms": min(900, lead),
		}
		// A connected chapter can also share a planning frame.
		if cameraPath != "" && (continuesPrevious || index == 0) {
			handoff["camera_path"] = cameraPath
		}
		// Keep the spatial layout separate from movement at an action cut.
		spatialLayout := requiredString(row, "spatial_layout")
		if matchAction {
			handoff["match_action"] = true
		} else {
			spatialLayout = firstStoryboardText(spatialLayout, description)
		}
		captions := normalizeStoryboardCaptions(row["captions"], index, float64(duration), captionIDs)
		if !soundPolicy.GeneratedCaptions {
			captions = []any{}
		}
		shots = append(shots, map[string]any{
			"id":                     shotID,
			"order":                  index + 1,
			"duration":               duration,
			"beat":                   beat,
			"transition":             transition,
			"handoff":                handoff,
			"transition_type":        botmodel.StoryboardTransitionNone,
			"transition_duration_ms": 0,
			"description":            description,
			"camera_instruction":     cameraInstruction,
			"start_framing":          startFraming,
			"end_framing":            endFraming,
			"spatial_layout":         spatialLayout,
			"video_prompt":           videoPrompt,
			"material_ids":           materialIDs,
			"reference_keys":         referenceKeys,
			"shot_image_mode":        botmodel.StoryboardShotImageFirstLast,
			"shared_end_shot_id":     "",
			"match_previous":         matchesPrevious,
			"continue_previous":      continuesPrevious,
			"continuity_anchor":      continuityAnchor,
			"continuity_state":       continuityState,
			"lyric_line_indexes":     normalizeStoryboardLyricLineIndexes(row["lyric_line_indexes"]),
			"speech":                 speech,
			"captions":               captions,
		})
		if captureDuration > duration {
			shots[len(shots)-1].(map[string]any)["capture_duration"] = captureDuration
		}
		if sceneIndex, exists := row["scene_index"]; exists {
			shots[len(shots)-1].(map[string]any)["scene_index"] = sceneIndex
		}
		previousExitState = requiredString(continuityState, "exit")
		previousEndFraming = endFraming
		previousOutgoing = outgoing
		previousMaterialIDs = materialIDSet
	}
	if len(shots) == 0 {
		return nil, fmt.Errorf("shots 至少需要一个有效镜头")
	}
	return shots, nil
}

// A change in named surroundings needs a filmed path. Shots without named
// scene assets still follow the authored continuation decision.
func storyboardIntroducesScene(previous, current map[string]struct{}, materialTypes map[string]string) bool {
	for id := range current {
		if materialTypes[id] == "scene" {
			if _, shared := previous[id]; !shared {
				return true
			}
		}
	}
	return false
}

func storyboardShouldMatchPrevious(
	previousMaterialIDs map[string]struct{},
	currentMaterialIDs map[string]struct{},
	materialTypes map[string]string,
) bool {
	sharedScene := false
	sharedSubject := false
	for id := range currentMaterialIDs {
		if _, exists := previousMaterialIDs[id]; !exists {
			continue
		}
		switch materialTypes[id] {
		case "scene":
			sharedScene = true
		case "character", "prop":
			sharedSubject = true
		}
	}
	return sharedScene && sharedSubject
}

func normalizeStoryboardLyricsPlan(requestInput map[string]any, workType string, shots []any) (string, error) {
	lyricsInput := storyboardProfileInputText(requestInput[botmodel.StoryboardLyricsInputKey])
	lyrics := botmodel.NormalizeStoryboardLyrics(lyricsInput)
	if workType != botmodel.StoryboardWorkTypeMV || len(lyrics) == 0 {
		for _, value := range shots {
			value.(map[string]any)["lyric_line_indexes"] = []any{}
		}
		return "", nil
	}
	plans := make([]botmodel.StoryboardLyricShotPlan, 0, len(shots))
	for _, value := range shots {
		shot := value.(map[string]any)
		duration, _ := integerValue(shot["duration"])
		indexes := normalizeStoryboardLyricLineIndexes(shot["lyric_line_indexes"])
		shot["lyric_line_indexes"] = indexes
		plan := botmodel.StoryboardLyricShotPlan{Duration: duration}
		for _, raw := range indexes {
			plan.LineIndexes = append(plan.LineIndexes, raw.(int))
		}
		plans = append(plans, plan)
	}
	completedPlans, err := botmodel.CompleteStoryboardLyricShotPlans(len(lyrics), plans)
	if err != nil {
		return "", err
	}
	for index, plan := range completedPlans {
		indexes := make([]any, len(plan.LineIndexes))
		for lineIndex, value := range plan.LineIndexes {
			indexes[lineIndex] = value
		}
		shots[index].(map[string]any)["lyric_line_indexes"] = indexes
	}
	return botmodel.BuildStoryboardLyricsLRCFromInput(lyricsInput, completedPlans)
}

func normalizeStoryboardLyricLineIndexes(value any) []any {
	seen := map[int]struct{}{}
	indexes := make([]int, 0)
	items, ok := storyboardValueItems(value)
	if !ok {
		return []any{}
	}
	for _, raw := range items {
		index, ok := integerValue(raw)
		if !ok || index < 1 {
			continue
		}
		if _, exists := seen[index]; exists {
			continue
		}
		seen[index] = struct{}{}
		indexes = append(indexes, index)
	}
	sort.Ints(indexes)
	result := make([]any, 0, len(indexes))
	for _, index := range indexes {
		result = append(result, index)
	}
	return result
}

func normalizeStoryboardContinuityState(value any, shotIndex int, materialIDLookup map[string]string) (map[string]any, error) {
	state, ok := value.(map[string]any)
	if !ok {
		return nil, fmt.Errorf("镜头 %d 的连续状态格式无效", shotIndex+1)
	}
	result := map[string]any{"entry": requiredString(state, "entry"), "exit": requiredString(state, "exit")}
	if facts, exists := state["facts"]; exists {
		if items, ok := facts.([]any); ok {
			for _, item := range items {
				fact, _ := item.(map[string]any)
				if id := requiredString(fact, "material_id"); id != "" {
					fact["material_id"] = resolveStoryboardMaterialID(id, materialIDLookup)
				}
			}
		}
		result["facts"] = facts
		result["time_jump"] = state["time_jump"]
	}
	return result, nil
}

func storyboardShotDurations(value any, contract storyboardGenerationContract) (int, int, error) {
	capture, err := normalizeStoryboardShotDuration(value, contract)
	if err != nil {
		return 0, 0, err
	}
	duration := capture
	if len(contract.DurationOptions) > 0 && storyboardTracksContinuity(contract.WorkType) {
		planned, _ := integerValue(value)
		duration = min(capture, max(contract.MinShotDuration, planned))
	}
	return duration, capture, nil
}

func normalizeStoryboardShotDuration(value any, contract storyboardGenerationContract) (int, error) {
	duration, ok := integerValue(value)
	if !ok {
		return 0, fmt.Errorf("duration 必须是整数")
	}
	if len(contract.DurationOptions) > 0 {
		for _, option := range contract.DurationOptions {
			if duration <= option {
				return option, nil
			}
		}
		return contract.MaxShotDuration, nil
	}
	if duration < contract.MinShotDuration {
		return contract.MinShotDuration, nil
	}
	if duration > contract.MaxShotDuration {
		return 0, fmt.Errorf(
			"duration %d 秒超过本次允许的最大时长 %d 秒",
			duration,
			contract.MaxShotDuration,
		)
	}
	return duration, nil
}

func normalizeStoryboardSpeech(
	value any,
	shotIndex int,
	usedIDs map[string]struct{},
	materialTypes map[string]string,
	materialIDLookup map[string]string,
	shotMaterialIDs map[string]struct{},
) []any {
	items := storyboardSpeechItems(value)
	result := make([]any, 0, len(items))
	visibleCharacterID := ""
	for index, item := range items {
		row, ok := item.(map[string]any)
		if !ok {
			if text, textOK := item.(string); textOK {
				row = map[string]any{"kind": "narration", "text": text}
			} else {
				continue
			}
		}
		text := requiredString(row, "text")
		if text == "" {
			continue
		}
		id := uniqueStoryboardID(requiredString(row, "id"), fmt.Sprintf("speech-%d-%d", shotIndex+1, index+1), usedIDs)
		kind := normalizeStoryboardSpeechKind(requiredString(row, "kind"))
		characterID := resolveStoryboardMaterialID(requiredString(row, "character_id"), materialIDLookup)
		if kind == "" {
			if characterID != "" {
				kind = "dialogue"
			} else {
				kind = "narration"
			}
		}
		startTime, ok := numberValue(row["start_time"])
		if !ok || startTime < 0 {
			startTime = 0
		}
		subtitleEnabled, ok := row["subtitle_enabled"].(bool)
		if !ok {
			subtitleEnabled = true
		}
		normalized := map[string]any{
			"id":               id,
			"kind":             kind,
			"text":             text,
			"start_time":       startTime,
			"subtitle_enabled": subtitleEnabled,
			"subtitle_text":    requiredString(row, "subtitle_text"),
		}
		if kind == "dialogue" {
			if materialTypes[characterID] != "character" {
				characterID = singleStoryboardCharacterID(shotMaterialIDs, materialTypes)
			}
			if _, exists := shotMaterialIDs[characterID]; !exists || materialTypes[characterID] != "character" {
				normalized["kind"] = "narration"
				result = append(result, normalized)
				continue
			}
			speakerMode := normalizeStoryboardSpeakerMode(requiredString(row, "speaker_mode"))
			if speakerMode == "visible" {
				if visibleCharacterID != "" && visibleCharacterID != characterID {
					speakerMode = "offscreen"
				} else {
					visibleCharacterID = characterID
				}
			}
			normalized["character_id"] = characterID
			normalized["speaker_mode"] = speakerMode
		}
		result = append(result, normalized)
	}
	return result
}

func normalizeStoryboardCaptions(
	value any,
	shotIndex int,
	duration float64,
	usedIDs map[string]struct{},
) []any {
	items := storyboardCaptionItems(value)
	result := make([]any, 0, len(items))
	for index, item := range items {
		row, ok := item.(map[string]any)
		if !ok {
			if text, textOK := item.(string); textOK {
				row = map[string]any{"text": text}
			} else {
				continue
			}
		}
		text := requiredString(row, "text")
		if text == "" {
			continue
		}
		id := uniqueStoryboardID(requiredString(row, "id"), fmt.Sprintf("caption-%d-%d", shotIndex+1, index+1), usedIDs)
		captionType := normalizeStoryboardCaptionType(requiredString(row, "type"))
		if captionType != "caption" && captionType != "title" && captionType != "highlight" {
			captionType = "caption"
		}
		startTime, startOK := numberValue(row["start_time"])
		endTime, endOK := numberValue(row["end_time"])
		if !startOK || startTime < 0 || startTime >= duration {
			startTime = 0
		}
		if !endOK || endTime <= startTime || endTime > duration {
			endTime = duration
		}
		result = append(result, map[string]any{
			"id":         id,
			"type":       captionType,
			"text":       text,
			"start_time": startTime,
			"end_time":   endTime,
		})
	}
	return result
}

func normalizeStoryboardMaterials(value any) ([]any, map[string]string, map[string]string, error) {
	items, ok := storyboardValueItems(value)
	if !ok {
		return nil, nil, nil, fmt.Errorf("materials 必须是素材数组")
	}
	result := make([]any, 0, len(items))
	materialTypes := make(map[string]string, len(items))
	materialIDLookup := make(map[string]string, len(items)*2)
	materialNames := make(map[string]struct{}, len(items))
	materialIDs := make(map[string]struct{}, len(items))
	for index, item := range items {
		row, ok := item.(map[string]any)
		if !ok {
			return nil, nil, nil, fmt.Errorf("素材 %d 格式无效", index+1)
		}
		materialType := normalizeStoryboardMaterialType(requiredString(row, "type"))
		if materialType == "" {
			return nil, nil, nil, fmt.Errorf("素材 %d 的 type 必须是 character、scene 或 prop", index+1)
		}
		id := uniqueStoryboardID(requiredString(row, "id"), fmt.Sprintf("%s-%d", materialType, index+1), materialIDs)
		name := firstStoryboardText(
			normalizeStoryboardMaterialName(requiredString(row, "name")),
			fmt.Sprintf("%s%d", storyboardMaterialTypeLabel(materialType), index+1),
		)
		name = uniqueStoryboardName(name, materialNames)
		prompt := firstStoryboardText(requiredString(row, "prompt"), fmt.Sprintf("%s的清晰素材设定图", name))
		voice := requiredString(row, "voice")
		referenceKeys := normalizeStoryboardReferenceKeys(row["reference_keys"])
		if materialType != "character" {
			voice = ""
		}
		materialTypes[id] = materialType
		materialIDLookup[storyboardLookupKey(id)] = id
		materialIDLookup[storyboardLookupKey(name)] = id
		result = append(result, map[string]any{
			"id":             id,
			"type":           materialType,
			"name":           name,
			"prompt":         prompt,
			"voice":          voice,
			"reference_keys": referenceKeys,
		})
	}
	return result, materialTypes, materialIDLookup, nil
}

func normalizeStoryboardReferenceKeys(value any) []any {
	items := storyboardStringItems(value)
	result := make([]any, 0, len(items))
	seen := make(map[string]struct{}, len(items))
	for _, key := range items {
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		result = append(result, key)
	}
	return result
}

func normalizeStoryboardMaterialIDs(
	value any,
	materialTypes map[string]string,
	materialIDLookup map[string]string,
) ([]any, map[string]struct{}) {
	items := storyboardStringItems(value)
	result := make([]any, 0, len(items))
	seen := make(map[string]struct{}, len(items))
	for _, value := range items {
		id := resolveStoryboardMaterialID(value, materialIDLookup)
		if _, exists := materialTypes[id]; !exists {
			continue
		}
		if _, exists := seen[id]; exists {
			continue
		}
		seen[id] = struct{}{}
		result = append(result, id)
	}
	return result, seen
}

func storyboardValueItems(value any) ([]any, bool) {
	switch current := value.(type) {
	case nil:
		return []any{}, true
	case []any:
		return current, true
	case map[string]any:
		return []any{current}, true
	default:
		return nil, false
	}
}

func storyboardSpeechItems(value any) []any {
	if text, ok := value.(string); ok {
		return []any{text}
	}
	items, ok := storyboardValueItems(value)
	if !ok {
		return []any{}
	}
	return items
}

func storyboardCaptionItems(value any) []any {
	return storyboardSpeechItems(value)
}

func storyboardStringItems(value any) []string {
	var raw []any
	switch current := value.(type) {
	case nil:
		return []string{}
	case string:
		raw = []any{current}
	case []string:
		raw = make([]any, 0, len(current))
		for _, item := range current {
			raw = append(raw, item)
		}
	case []any:
		raw = current
	default:
		return []string{}
	}
	result := make([]string, 0, len(raw))
	for _, item := range raw {
		text, ok := item.(string)
		text = strings.TrimSpace(text)
		if ok && text != "" {
			result = append(result, text)
		}
	}
	return result
}

func uniqueStoryboardID(preferred string, fallback string, used map[string]struct{}) string {
	base := firstStoryboardText(preferred, fallback, "item")
	candidate := base
	for suffix := 2; ; suffix++ {
		if _, exists := used[candidate]; !exists {
			used[candidate] = struct{}{}
			return candidate
		}
		candidate = fmt.Sprintf("%s-%d", base, suffix)
	}
}

func uniqueStoryboardName(preferred string, used map[string]struct{}) string {
	base := firstStoryboardText(preferred, "未命名素材")
	candidate := base
	for suffix := 2; ; suffix++ {
		key := storyboardLookupKey(candidate)
		if _, exists := used[key]; !exists {
			used[key] = struct{}{}
			return candidate
		}
		candidate = fmt.Sprintf("%s %d", base, suffix)
	}
}

func storyboardLookupKey(value string) string {
	return strings.ToLower(normalizeStoryboardMaterialName(value))
}

func resolveStoryboardMaterialID(value string, lookup map[string]string) string {
	value = strings.TrimSpace(value)
	if id := lookup[storyboardLookupKey(value)]; id != "" {
		return id
	}
	return value
}

func normalizeStoryboardMaterialType(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "character", "role", "person", "角色", "人物":
		return "character"
	case "scene", "location", "environment", "场景", "地点", "环境":
		return "scene"
	case "prop", "object", "item", "道具", "物品":
		return "prop"
	default:
		return ""
	}
}

func storyboardMaterialTypeLabel(materialType string) string {
	switch materialType {
	case "character":
		return "角色"
	case "scene":
		return "场景"
	default:
		return "道具"
	}
}

func normalizeStoryboardSpeechKind(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "dialogue", "dialog", "speech", "对白", "台词":
		return "dialogue"
	case "narration", "narrator", "voiceover", "voice_over", "旁白", "解说":
		return "narration"
	default:
		return ""
	}
}

func normalizeStoryboardSpeakerMode(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "visible", "onscreen", "on_screen", "出镜", "画内":
		return "visible"
	default:
		return "offscreen"
	}
}

func normalizeStoryboardCaptionType(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "title", "标题":
		return "title"
	case "highlight", "重点", "强调":
		return "highlight"
	default:
		return "caption"
	}
}

func singleStoryboardCharacterID(materialIDs map[string]struct{}, materialTypes map[string]string) string {
	characterID := ""
	for id := range materialIDs {
		if materialTypes[id] != "character" {
			continue
		}
		if characterID != "" {
			return ""
		}
		characterID = id
	}
	return characterID
}

func firstStoryboardText(values ...string) string {
	for _, value := range values {
		if text := strings.TrimSpace(value); text != "" {
			return text
		}
	}
	return ""
}

func normalizeStoryboardMaterialName(value string) string {
	return strings.TrimSpace(strings.TrimLeft(strings.TrimSpace(value), "@#"))
}

func requiredString(row map[string]any, key string) string {
	value, ok := stringField(row, key)
	if !ok {
		return ""
	}
	return value
}

func stringField(row map[string]any, key string) (string, bool) {
	value, exists := row[key]
	if !exists {
		return "", false
	}
	text, ok := value.(string)
	if !ok {
		return "", false
	}
	return strings.TrimSpace(text), true
}

func integerValue(value any) (int, bool) {
	number, ok := numberValue(value)
	if !ok || math.Trunc(number) != number {
		return 0, false
	}
	return int(number), true
}

func numberValue(value any) (float64, bool) {
	switch current := value.(type) {
	case float64:
		return current, !math.IsNaN(current) && !math.IsInf(current, 0)
	case float32:
		parsed := float64(current)
		return parsed, !math.IsNaN(parsed) && !math.IsInf(parsed, 0)
	case int:
		return float64(current), true
	case int64:
		return float64(current), true
	case json.Number:
		parsed, err := current.Float64()
		return parsed, err == nil && !math.IsNaN(parsed) && !math.IsInf(parsed, 0)
	case string:
		parsed, err := strconv.ParseFloat(strings.TrimSpace(current), 64)
		return parsed, err == nil && !math.IsNaN(parsed) && !math.IsInf(parsed, 0)
	default:
		return 0, false
	}
}
