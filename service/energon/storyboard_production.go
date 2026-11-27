package energon

import (
	"fmt"
	"slices"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
)

type StoryboardProductionPromptRequest struct {
	ItemType       string
	ItemID         string
	ShotImageMode  string
	FrameRole      string
	EditablePrompt string
	// PreviousSceneFrame marks a new-scene opening that receives a planned
	// frame where its characters appeared, to keep their look across scenes.
	PreviousSceneFrame bool
	// NativeAudio keeps authored speech inside the video request. The separate
	// storyboard dubbing workflow leaves this false; the production plan owns it.
	NativeAudio bool
}

type StoryboardProductionPrompt struct {
	Prompt                        string
	StartFramePrompt              string
	EndFramePrompt                string
	AspectRatio                   string
	Duration                      int
	ReferenceMode                 string
	ImageSequenceFixedConstraints []string
}

// BuildStoryboardProductionPrompt projects a confirmed storyboard item into
// the final prompt used by image, video and speech powers. It deliberately depends on
// structured storyboard fields instead of topic-specific keyword inference.
func BuildStoryboardProductionPrompt(
	document map[string]any,
	request StoryboardProductionPromptRequest,
) (StoryboardProductionPrompt, error) {
	itemType := strings.ToLower(strings.TrimSpace(request.ItemType))
	itemID := strings.TrimSpace(request.ItemID)
	editablePrompt := strings.TrimSpace(request.EditablePrompt)
	if itemID == "" {
		return StoryboardProductionPrompt{}, fmt.Errorf("分镜制作条目缺少 item_id")
	}
	context := storyboardProductionContextFromDocument(document)
	switch itemType {
	case "speech":
		return storyboardSpeechProductionPrompt(document, itemID, editablePrompt)
	case "character", "scene", "prop":
		material, found := storyboardProductionItem(document["materials"], itemID)
		if !found {
			return StoryboardProductionPrompt{}, fmt.Errorf("分镜素材不存在: %s", itemID)
		}
		if requiredString(material, "type") != itemType {
			return StoryboardProductionPrompt{}, fmt.Errorf("分镜素材类型与制作节点不一致")
		}
		return StoryboardProductionPrompt{
			Prompt:      storyboardMaterialProductionPrompt(context, material, editablePrompt),
			AspectRatio: context.aspectRatio,
		}, nil
	case "shot_image", "shot":
		shot, found := storyboardProductionItem(document["shots"], itemID)
		if !found {
			return StoryboardProductionPrompt{}, fmt.Errorf("分镜镜头不存在: %s", itemID)
		}
		if boundary, ok := document["chapter_boundary"].(map[string]any); ok {
			shots, _ := storyboardValueItems(document["shots"])
			if len(shots) > 0 && requiredString(shots[0].(map[string]any), "id") == itemID {
				connection := requiredString(boundary, "connection")
				boundaryShot := make(map[string]any, len(shot))
				for key, value := range shot {
					boundaryShot[key] = value
				}
				boundaryShot["continue_previous"] = connection == "continue"
				boundaryShot["match_previous"] = connection == "match"
				shot = boundaryShot
			}
		}
		mode := firstStoryboardText(request.ShotImageMode, requiredString(shot, "shot_image_mode"))
		if itemType == "shot" && mode == "" {
			mode = botmodel.StoryboardShotImageFirstFrame
		}
		mode = botmodel.NormalizeStoryboardShotImageMode(mode)
		points := storyboardProductionCutPoints(shot)
		shots, _ := storyboardValueItems(document["shots"])
		for index, raw := range shots {
			if requiredString(raw.(map[string]any), "id") != itemID {
				continue
			}
			if index > 0 && itemType == "shot" {
				previous := shots[index-1].(map[string]any)
				previousHandoff := mapField(previous, "handoff")
				points.incomingMotion = storyboardProductionClause("切点进行中的动作", requiredString(previousHandoff, "outgoing_motion"))
				points.leadMS = storyboardProductionSoundLead(previous, shot, request.NativeAudio)
				points.sharedSoundLocation = storyboardSharedSoundLocation(context.materials, previous, shot)
				if shot["continue_previous"] == true {
					points.incoming = storyboardProductionJoin(
						points.incomingMotion,
						firstStoryboardText(requiredString(previousHandoff, "outgoing"), points.incoming),
						storyboardProductionClause("共用摄影路线，只拍接点以后的部分", requiredString(previousHandoff, "camera_through")),
					)
					if mode == botmodel.StoryboardShotImageReferences {
						points.incoming = storyboardProductionJoin(points.incoming, storyboardProductionClause("共用接点构图", requiredString(previous, "end_framing")))
					}
				}
			}
			if index+1 < len(shots) {
				next := shots[index+1].(map[string]any)
				points.nextContinues = storyboardVideoSharesEnd(shots, index)
				points.nextMatches = storyboardProductionCutPoints(next).matchAction
				if itemType == "shot" {
					points.tailMS = storyboardProductionSoundLead(shot, next, request.NativeAudio)
				}
				if (points.nextContinues || points.nextMatches) && storyboardSharedSoundLocation(context.materials, shot, next) {
					points.tailSound = requiredString(mapField(next, "handoff"), "sound_cue")
				}
			}
			break
		}
		if itemType == "shot_image" {
			var fixedConstraints []string
			if mode == botmodel.StoryboardShotImageReferences {
				fixedConstraints = []string{
					storyboardProductionVisualStyle(context),
					storyboardProductionMaterialClause(context, shot),
				}
				if spatialLayout := storyboardProductionClause("空间关系与真实尺度", requiredString(shot, "spatial_layout")); spatialLayout != "" {
					fixedConstraints = append(fixedConstraints, spatialLayout)
				}
			}
			startPrompt := storyboardShotImageProductionPrompt(context, shot, "start", mode, editablePrompt)
			if points.matchAction {
				startPrompt = storyboardProductionJoin("第一张参考图是上一镜的规划尾图。按本镜构图重画同一个动作时刻，继承人物姿态、视线、双手与道具的接触、动作方向、光线和空间轴线。只改变机位与取景。", startPrompt)
			}
			if request.PreviousSceneFrame && shot["match_previous"] != true && shot["continue_previous"] != true {
				startPrompt = storyboardProductionJoin(storyboardPreviousSceneFrameRule(context, shot), startPrompt)
			}
			endPrompt := storyboardShotImageProductionPrompt(context, shot, "end", mode, editablePrompt)
			if points.nextContinues && mode != botmodel.StoryboardShotImageReferences {
				endPrompt = storyboardProductionJoin(
					"这张图是同一次拍摄的中途接点，不是表演结束后的摆拍。画出这一刻能看见的动作进度：动的部位在画幅哪里，与哪个物体接触，重心或姿态已经有什么变化。摄影机移动到接点时，按本帧构图画出固定景物在画幅中的位置和遮挡变化。只画这个瞬间，不用模糊、拖影表现动作。",
					points.outgoingMotion,
					storyboardProductionClause("接点瞬间", points.outgoing), endPrompt,
				)
			}
			prompt := startPrompt
			switch strings.ToLower(strings.TrimSpace(request.FrameRole)) {
			case "end":
				prompt = endPrompt
			case "":
				if mode == botmodel.StoryboardShotImageLastFrame {
					prompt = endPrompt
				} else if mode == botmodel.StoryboardShotImageFirstLast {
					prompt = strings.Join([]string{
						"按顺序生成两张独立关键帧，不得合并为拼图或交换顺序。",
						"首帧：" + startPrompt,
						"尾帧：" + endPrompt,
					}, "\n")
				}
			}
			return StoryboardProductionPrompt{
				Prompt:                        prompt,
				StartFramePrompt:              startPrompt,
				EndFramePrompt:                endPrompt,
				AspectRatio:                   context.aspectRatio,
				ImageSequenceFixedConstraints: fixedConstraints,
			}, nil
		}
		duration := storyboardProductionCaptureDuration(shot)
		if points.nextContinues && mode != botmodel.StoryboardShotImageReferences {
			mode = botmodel.StoryboardShotImageFirstLast
		}
		return StoryboardProductionPrompt{
			Prompt:        storyboardShotVideoProductionPrompt(context, shot, mode, editablePrompt, request.NativeAudio, points),
			AspectRatio:   context.aspectRatio,
			Duration:      duration,
			ReferenceMode: storyboardVideoReferenceMode(mode),
		}, nil
	default:
		return StoryboardProductionPrompt{}, fmt.Errorf("分镜制作条目类型不支持: %s", itemType)
	}
}

func StoryboardVideoFrameMode(document map[string]any, shotID string) (string, error) {
	shots, _ := storyboardValueItems(document["shots"])
	for index, raw := range shots {
		shot := raw.(map[string]any)
		if requiredString(shot, "id") != shotID {
			continue
		}
		if storyboardVideoSharesEnd(shots, index) {
			return botmodel.StoryboardShotImageFirstLast, nil
		}
		return botmodel.NormalizeStoryboardVideoFrameMode(requiredString(shot, "shot_image_mode")), nil
	}
	return "", fmt.Errorf("分镜镜头不存在: %s", shotID)
}

func storyboardVideoSharesEnd(shots []any, index int) bool {
	return index+1 < len(shots) && shots[index+1].(map[string]any)["continue_previous"] == true
}

func storyboardSpeechProductionPrompt(document map[string]any, itemID, editablePrompt string) (StoryboardProductionPrompt, error) {
	shots, _ := storyboardValueItems(document["shots"])
	for _, rawShot := range shots {
		shot := rawShot.(map[string]any)
		speech, _ := storyboardValueItems(shot["speech"])
		for _, rawSpeech := range speech {
			line := rawSpeech.(map[string]any)
			if requiredString(line, "id") == itemID {
				return StoryboardProductionPrompt{Prompt: firstStoryboardText(editablePrompt, requiredString(line, "text"))}, nil
			}
		}
	}
	return StoryboardProductionPrompt{}, fmt.Errorf("分镜配音不存在: %s", itemID)
}

type storyboardProductionContext struct {
	workType      string
	visualMode    string
	stylePrompt   string
	aspectRatio   string
	narratorVoice string
	materials     map[string]map[string]any
	references    map[string]map[string]any
}

func storyboardProductionContextFromDocument(document map[string]any) storyboardProductionContext {
	visualMode := botmodel.NormalizeStoryboardVisualMode(requiredString(document, "visual_mode"))
	if !botmodel.IsStoryboardVisualMode(visualMode) {
		visualMode = botmodel.StoryboardVisualModePhotoreal
	}
	aspectRatio := normalizeStoryboardAspectRatio(requiredString(document, "aspect_ratio"))
	materials := make(map[string]map[string]any)
	if items, ok := storyboardValueItems(document["materials"]); ok {
		for _, item := range items {
			material, _ := item.(map[string]any)
			if id := requiredString(material, "id"); id != "" {
				materials[id] = material
			}
		}
	}
	references := make(map[string]map[string]any)
	if items, ok := storyboardValueItems(document["references"]); ok {
		for _, item := range items {
			reference, _ := item.(map[string]any)
			if key := requiredString(reference, "key"); key != "" {
				references[key] = reference
			}
		}
	}
	return storyboardProductionContext{
		workType:      requiredString(document, "work_type"),
		visualMode:    visualMode,
		stylePrompt:   requiredString(document, "style_prompt"),
		aspectRatio:   aspectRatio,
		narratorVoice: requiredString(document, "narrator_voice"),
		materials:     materials,
		references:    references,
	}
}

func storyboardProductionItem(value any, id string) (map[string]any, bool) {
	items, ok := storyboardValueItems(value)
	if !ok {
		return nil, false
	}
	for _, item := range items {
		row, _ := item.(map[string]any)
		if requiredString(row, "id") == id {
			return row, true
		}
	}
	return nil, false
}

func storyboardMaterialProductionPrompt(
	context storyboardProductionContext,
	material map[string]any,
	editablePrompt string,
) string {
	materialType := requiredString(material, "type")
	name := requiredString(material, "name")
	parts := []string{
		fmt.Sprintf("生成%s“%s”的独立素材参考图", storyboardProductionMaterialLabel(materialType), name),
		storyboardProductionVisualStyle(context),
		storyboardProductionClause("视觉描述", firstStoryboardText(editablePrompt, requiredString(material, "prompt"))),
		storyboardProductionReferenceClause(context, storyboardStringItems(material["reference_keys"])),
		storyboardMaterialProductionRule(materialType),
		storyboardProductionPhysicalRule(),
		"只表现当前素材，不添加无关主体、文字、水印或界面元素",
	}
	return storyboardProductionJoin(parts...)
}

// The new-scene opening is edited from a planned frame where its
// characters appeared, so the audience sees the same people after the cut.
func storyboardPreviousSceneFrameRule(context storyboardProductionContext, shot map[string]any) string {
	names := []string{}
	for _, id := range storyboardStringItems(shot["material_ids"]) {
		if material := context.materials[id]; requiredString(material, "type") == "character" {
			names = append(names, requiredString(material, "name"))
		}
	}
	people := strings.Join(names, "、")
	return fmt.Sprintf("本镜换场，从上一场规划画面改出：所附参考图是%[1]s上一次出镜的规划尾帧。以它为底图编辑，画面中必须出现%[1]s，与参考画面是同一个人：脸型、五官、发型、体型和服装保持一致，同一人物必须是同一个人。环境、时间、天气与光照按本镜场景设定和场景参考建立，不继承人物参考画面的环境光；按本镜静态构图重新取景并摆放人物姿态，不保留参考画面的背景和机位；分镜明确写了换装时才改变服装。参考画面里人物手中的伞、书等物件不带入本镜，本镜只出现本镜素材列出的道具。人物的正脸或侧脸清晰可见，不要只拍背影", people)
}

func storyboardMaterialProductionRule(materialType string) string {
	switch materialType {
	case "character":
		return "保持同一主体的身份、解剖结构、外观特征和各视角比例一致；采用便于后续镜头复用的人物设定构图：简洁背景，正面或四分之三侧面全身或半身，脸部五官、发型和服装清楚可见；不放进剧情场景，不撑伞、不戴遮脸的帽子或口罩，手中不拿剧情道具"
	case "scene":
		return "清楚呈现环境边界、空间层次、固定结构、通行关系和主要光线；只按当前场景描述建立固定结构与陈设，不自行增加装饰性物件；地面与固定结构使用一致的透视和空间尺度，物件有明确承载面与相符的接触阴影；不加入无关主体"
	case "prop":
		return "清楚呈现完整轮廓、结构、材质和各部分比例；不得为了突出细节改变对象本身尺度"
	default:
		return "保持素材结构、外观和比例稳定"
	}
}

func storyboardShotImageProductionPrompt(
	context storyboardProductionContext,
	shot map[string]any,
	frameRole string,
	mode string,
	editablePrompt string,
) string {
	isEnd := frameRole == "end"
	hasCharacters := storyboardProductionHasCharacters(context, shot)
	state := requiredString(mapField(shot, "continuity_state"), "entry")
	frameLabel := "首帧"
	stateLabel := "起始状态"
	if isEnd {
		state = requiredString(mapField(shot, "continuity_state"), "exit")
		frameLabel = "尾帧"
		stateLabel = "结束状态"
	}
	framingField := "start_framing"
	if isEnd {
		framingField = "end_framing"
	}
	framing := requiredString(shot, framingField)
	if override := requiredString(mapField(shot, "prompt_overrides"), frameRole); override != "" {
		framing = override
		editablePrompt = ""
	}
	parts := []string{
		fmt.Sprintf("生成镜头 %s 的单张%s", storyboardProductionShotOrder(shot), frameLabel),
		storyboardProductionClause("静态构图", framing),
		storyboardProductionClause(stateLabel, state),
	}
	if isEnd {
		parts = append(parts,
			"第一张参考图是本镜首图，沿用场内布局、未变化的物件与照明。固定机位保持背景构图；有运镜时按尾帧机位改变固定景物在画幅中的位置、前后景遮挡或主体占幅，不能只改人物姿势而照搬首图构图。按结束状态画出变化后的视线、姿态和持物关系；没安排位移的主体仍在场内原位",
			storyboardProductionClause("到达尾帧机位的运镜", requiredString(shot, "camera_instruction")),
		)
	}
	if hasCharacters {
		parts = append(parts, "这是戏中一帧，不是人物展示照。角色设定图只决定外观；视线落在本帧动作指向的人或物，按本帧规定的支撑点和手与道具的接触作画。除非分镜指定对镜头表演，不看镜头、不摆拍")
	}
	if _, tracked := mapField(shot, "continuity_state")["facts"]; tracked {
		parts = append(parts, "按本帧的状态和取景作画；构图、补充要求和素材图只决定看哪里及外观，不替换站位、动作阶段或道具状态，不把画外主体拉入画面")
	}
	if editablePrompt != "" {
		parts = append(parts, "本帧补充画面要求（保持上述分镜状态与取景）："+editablePrompt)
	}
	parts = append(parts, "按指定景别裁切，素材设定不要求完整入画，不为展示素材而扩大取景")
	if !isEnd && shot["match_previous"] == true {
		parts = append(parts, "沿用参考画面中仍适用的人物、道具、光线和空间关系，按本镜首帧构图重新取景")
	}
	parts = append(parts, storyboardProductionVisualStyle(context), storyboardProductionMaterialClause(context, shot))
	parts = append(parts,
		storyboardProductionClause("空间关系与真实尺度", requiredString(shot, "spatial_layout")),
		storyboardProductionReferenceClause(context, storyboardStringItems(shot["reference_keys"])),
		fmt.Sprintf("画幅：%s", context.aspectRatio),
		storyboardProductionPhysicalRule(),
		storyboardProductionContinuityRule(),
		storyboardProductionLightingRule(),
		"只表现本帧状态与静态构图，不把动作过程同时画入一张图",
		"只生成一个完整画面，不出现字幕、对白文字、水印或界面元素",
	)
	if hasCharacters {
		parts = append(parts, storyboardProductionFaceRule(), "人物身份、服装、姿态与持物按本帧状态呈现，不因素材设定改变构图或提前执行动作")
	}
	if mode == botmodel.StoryboardShotImageReferences {
		parts[0] = fmt.Sprintf("生成镜头 %s 的并列视觉参考图", storyboardProductionShotOrder(shot))
	}
	return storyboardProductionJoin(parts...)
}

type storyboardCutPoints struct {
	matchAction         bool
	incoming            string
	incomingMotion      string
	outgoing            string
	outgoingMotion      string
	sound               string
	tailSound           string
	leadMS              int
	tailMS              int
	nextContinues       bool
	nextMatches         bool
	sharedSoundLocation bool
}

func storyboardProductionCutPoints(shot map[string]any) storyboardCutPoints {
	handoff := mapField(shot, "handoff")
	state := mapField(shot, "continuity_state")
	outgoing := requiredString(handoff, "outgoing")
	if outgoing == requiredString(state, "exit") {
		outgoing = ""
	}
	return storyboardCutPoints{
		matchAction:         shot["match_previous"] == true && handoff["match_action"] == true,
		incoming:            requiredString(handoff, "incoming"),
		outgoing:            outgoing,
		outgoingMotion:      storyboardProductionClause("切点进行中的动作", requiredString(handoff, "outgoing_motion")),
		sound:               requiredString(handoff, "sound_cue"),
		sharedSoundLocation: requiredString(handoff, "camera_path") == "",
	}
}

func StoryboardCanCarryNativeRoomTone(document, previous, next map[string]any) bool {
	return storyboardProductionSoundLead(previous, next, true) > 0 && StoryboardContinuesNativeSound(document, previous, next)
}

func StoryboardContinuesNativeSound(document, previous, next map[string]any) bool {
	handoff := mapField(next, "handoff")
	return previous != nil && requiredString(document, "work_type") != botmodel.StoryboardWorkTypeMV &&
		requiredString(mapField(next, "continuity_state"), "time_jump") == "" && (next["continue_previous"] == true || storyboardProductionCutPoints(next).matchAction) &&
		requiredString(handoff, "sound_cue") != "" &&
		storyboardSharedSoundLocation(storyboardProductionContextFromDocument(document).materials, previous, next)
}

func storyboardSharedSoundLocation(materials map[string]map[string]any, previous, next map[string]any) bool {
	sceneIDs := func(shot map[string]any) []string {
		var ids []string
		for _, id := range storyboardStringItems(shot["material_ids"]) {
			if requiredString(materials[id], "type") == "scene" {
				ids = append(ids, id)
			}
		}
		slices.Sort(ids)
		return ids
	}
	previousScenes, nextScenes := sceneIDs(previous), sceneIDs(next)
	return slices.Equal(previousScenes, nextScenes) &&
		(len(nextScenes) > 0 || requiredString(mapField(next, "handoff"), "camera_path") == "")
}

func storyboardProductionSoundLead(previous, next map[string]any, native bool) int {
	handoff := mapField(next, "handoff")
	lead, _ := integerValue(handoff["sound_lead_ms"])
	if lead < 100 || lead > 900 || requiredString(handoff, "sound_cue") == "" {
		return 0
	}
	if native {
		if lines, _ := storyboardValueItems(previous["speech"]); len(lines) > 0 {
			return 0
		}
		lines, _ := storyboardValueItems(next["speech"])
		for _, raw := range lines {
			start, _ := numberValue(raw.(map[string]any)["start_time"])
			if start*1000 < float64(lead) {
				return 0
			}
		}
	}
	return lead
}

func storyboardShotVideoProductionPrompt(
	context storyboardProductionContext,
	shot map[string]any,
	mode string,
	editablePrompt string,
	nativeAudio bool,
	points storyboardCutPoints,
) string {
	continues := shot["continue_previous"] == true
	cameraPath := ""
	if continues {
		cameraPath = requiredString(mapField(shot, "handoff"), "camera_path")
	}
	action := requiredString(shot, "video_prompt")
	if override := requiredString(mapField(shot, "prompt_overrides"), "video"); override != "" {
		action = override
		editablePrompt = ""
	}
	stateActions := storyboardContinuityActions(mapField(shot, "continuity_state"))
	motionLabel := "镜内动作与声音"
	if _, tracked := mapField(shot, "continuity_state")["facts"]; tracked {
		motionLabel = "既定动作的节拍、表演与声音（不增加或重演状态变化）"
	}
	motion := storyboardProductionClause(motionLabel, action)
	var parts []string
	if points.matchAction || continues {
		// The synopsis can describe the earlier state. The actual opening and
		// the authored in-segment action determine what happens after the seam.
		parts = storyboardEditableProductionParts(editablePrompt, motion)
	} else {
		parts = storyboardEditableProductionParts(editablePrompt,
			storyboardProductionClause("画面内容", requiredString(shot, "description")), motion,
		)
	}
	hasCharacters := storyboardProductionHasCharacters(context, shot)
	if hasCharacters {
		parts = append(parts, "按节拍以自然速度表演，短动作做完即接下一步；只按剧情需要停顿或放慢，不用运镜代替表演。")
	}
	parts = append(parts,
		storyboardProductionClause("运镜", firstStoryboardText(requiredString(shot, "camera_instruction"), "保持开场时的构图和运动方向")),
		"成片画面不烧录字幕、台词、旁白或说明文字；说出口的词只进入声音。",
		storyboardProductionClause("连续经过的空间路线", cameraPath),
		"保持场内站位与轴线，不为对齐尾帧换边或重做动作",
	)
	incoming := storyboardProductionClause("本镜入点", points.incoming)
	if points.matchAction {
		parts = append([]string{
			"从本镜新机位首帧承接姿态、视线与持物；未完成的动作按原速度继续，已完成的不重演。",
			storyboardProductionClause("第 0 秒在新机位接住的动作", points.incomingMotion),
		}, parts...)
		incoming = ""
	}
	if continues {
		parts = append([]string{
			storyboardProductionClause("第 0 秒承接的动作与相机运动", points.incoming),
			"沿原方向和速度接拍，不重起动作；保留剧情停顿。",
		}, parts...)
		incoming = ""
	}
	if points.nextContinues {
		route := requiredString(mapField(shot, "handoff"), "camera_through")
		motionRule := ""
		if points.outgoingMotion != "" || route != "" {
			motionRule = "最后半秒按同一方向和速度穿过所给接点，不提前收势。"
		}
		parts = append([]string{
			storyboardProductionClause("共用摄影路线，只拍到接点为止", route),
			storyboardProductionClause("最后一帧穿过的动作与摄影机位置", storyboardProductionJoin(points.outgoingMotion, points.outgoing)),
			motionRule,
		}, parts...)
	} else if points.nextMatches && points.outgoingMotion != "" {
		parts = append([]string{
			storyboardProductionClause("下一机位接走的最后一刻", points.outgoingMotion),
			"如果接点动作仍在进行，最后半秒沿既定方向和速度演到切点，不提前收势、摆好姿势等待或在本镜换机位。",
		}, parts...)
	}
	parts = append([]string{stateActions}, parts...)
	parts = append(parts,
		storyboardProductionVideoBoundaryClause(shot, points.matchAction || continues),
		incoming,
		storyboardProductionClause("连续性锚点", requiredString(shot, "continuity_anchor")),
	)
	if !points.nextContinues && (!points.nextMatches || points.outgoingMotion == "") {
		parts = append(parts, storyboardProductionClause("本镜出点", points.outgoing))
	}
	inputRule := storyboardProductionVideoInputRule(shot, mode)
	if mode == botmodel.StoryboardShotImageReferences && points.nextContinues {
		inputRule = "第一张图参考开场，第二张图参考接点的动作进度与机位；两张都是参考图，不需要停下来复刻图中姿势。人物动作接过切点；若是固定机位，接点前后保持同一取景"
	}
	if mode == botmodel.StoryboardShotImageFirstFrame || mode == botmodel.StoryboardShotImageReferences && !points.nextContinues && requiredString(shot, "shot_image_mode") == botmodel.StoryboardShotImageFirstFrame {
		parts = append(parts, "没有固定尾图：按既定节拍自然走完动作")
	}
	if continues {
		parts = append([]string{inputRule}, parts...)
	} else {
		parts = append(parts, inputRule)
	}
	parts = append(parts, "一镜到底；固定机位不动，有运镜时沿指定路线逐步改变固定景物在画幅中的位置，按编排的触发时刻开始。")
	if storyboardProductionHasStartFrame(shot, mode) {
		parts = append(parts, "视觉风格、主体外观、材质与光线承接首帧；只按本镜要求发生变化")
	} else {
		parts = append(parts, storyboardProductionVisualStyle(context))
	}
	// 首帧可能尚未出现本镜将要入场的主体，仍须传递本镜素材的身份与外观。
	parts = append(parts, storyboardProductionMaterialClause(context, shot))
	parts = append(parts, "同场沿用光线，只有剧本指定才改变。")
	if hasCharacters {
		parts = append(parts, "保持身份、服装、持物；视线目标和表情随动作变化，只按编排入画。")
	}
	if nativeAudio && context.workType != botmodel.StoryboardWorkTypeMV {
		parts = append(parts, storyboardNativeAudioPrompt(context, shot))
		if points.sound != "" {
			parts = append(parts, "按明确安排的现场原声收音，声源和距离保持一致，不为切镜另加音效。")
		}
		if mapField(shot, "handoff")["reaction_cut"] == true && !continues {
			parts = append(parts, "本镜从听者反应开始，前四分之一秒与前一机位拍的是同一瞬间，听者尚未开口，不重复上一镜的对白或做出有声接触。")
		}
	} else {
		parts = append(parts, "不生成可辨识对白、旁白或背景音乐；环境声与动作音按本镜补充要求生成，完全静音要求优先。")
	}
	if points.sound != "" && (continues || shot["match_previous"] == true) && points.sharedSoundLocation {
		parts = append(parts, "本镜仍在同一场戏：按本镜明确的环境底声、空间混响和声音强弱保持声场一致，底声贯穿段首段尾，不单独做开场或收尾，不重放上一段已完成动作的音效。")
	}
	if context.workType != botmodel.StoryboardWorkTypeMV && points.sound != "" {
		parts = append(parts, storyboardProductionClause("开场环境底声", points.sound))
		if points.leadMS > 0 {
			parts = append(parts, fmt.Sprintf("开场前 %d 毫秒只保留连续环境底声，动作音和人声从这之后按分镜进入", points.leadMS))
		}
	}
	if context.workType != botmodel.StoryboardWorkTypeMV && points.tailMS > 0 {
		parts = append(parts, storyboardProductionClause("与下一段共用的环境底声", points.tailSound))
		parts = append(parts, fmt.Sprintf("结束前 %d 毫秒只延续现场环境底声；不加台词、脚步、瞬时音效或淡出，画面按原动作与运镜继续", points.tailMS))
	}
	if context.workType == botmodel.StoryboardWorkTypeMV {
		parts = append(parts, "歌曲是后期加入的画外主音轨，画面角色不因歌曲含有人声而张嘴或对口型；只执行分镜明确安排的故事动作。仅当本镜动作明确安排出镜演唱时才表现演唱。")
	}
	parts = append(parts,
		storyboardProductionClause("空间关系与真实尺度", requiredString(shot, "spatial_layout")),
		storyboardProductionReferenceClause(context, storyboardStringItems(shot["reference_keys"])),
		fmt.Sprintf("画幅：%s", context.aspectRatio),
		storyboardProductionDurationClause(shot),
		"相对尺度稳定，画面占比不代表对象间真实大小，不融合或互换对象特征",
	)
	return storyboardProductionJoin(parts...)
}

func storyboardNativeAudioPrompt(context storyboardProductionContext, shot map[string]any) string {
	parts := []string{"原声只录人声和表演声，无背景音乐或环境底声。"}
	if requiredString(mapField(shot, "handoff"), "sound_cue") != "" {
		parts[0] = "原声按指定的现场声音收音，无背景音乐。"
	}
	lines, _ := storyboardValueItems(shot["speech"])
	for _, raw := range lines {
		line, _ := raw.(map[string]any)
		text := requiredString(line, "text")
		if text == "" {
			continue
		}
		speaker, mode := "旁白", "画外旁白，画面人物不代说"
		voice := context.narratorVoice
		if requiredString(line, "kind") == "dialogue" {
			id := requiredString(line, "character_id")
			speaker = firstStoryboardText(requiredString(context.materials[id], "name"), id)
			voice = requiredString(context.materials[id], "voice")
			mode = "出镜对白，此句由本人说；听者按节拍回应，不切机位"
			if requiredString(line, "speaker_mode") == "offscreen" {
				mode = "画外对白，说话人不因此入画，画内人物不代说"
			}
		}
		if voice != "" {
			mode += "；声音设定：" + voice
		}
		parts = append(parts, fmt.Sprintf("台词起点 %v 秒，%s（%s）：%q", line["start_time"], speaker, mode, text))
	}
	if len(parts) == 1 {
		parts = append(parts, "本镜没有台词或旁白，不做说话口型。")
	} else {
		parts[0] += "以下是完整台词，按起点原词说完，不跨镜断句。"
	}
	return strings.Join(parts, "\n")
}

func storyboardEditableProductionParts(editablePrompt string, generatedParts ...string) []string {
	if editablePrompt = strings.TrimSpace(editablePrompt); editablePrompt != "" {
		return []string{"本镜补充要求：" + editablePrompt}
	}
	return generatedParts
}

func storyboardProductionHasCharacters(context storyboardProductionContext, shot map[string]any) bool {
	for _, id := range storyboardStringItems(shot["material_ids"]) {
		if requiredString(context.materials[id], "type") == "character" {
			return true
		}
	}
	return false
}

func storyboardProductionHasStartFrame(shot map[string]any, mode string) bool {
	if shot["continue_previous"] == true {
		return true
	}
	if mode == botmodel.StoryboardShotImageReferences {
		mode = requiredString(shot, "shot_image_mode")
	}
	switch mode {
	case botmodel.StoryboardShotImageFirstFrame, botmodel.StoryboardShotImageFirstLast, botmodel.StoryboardShotImageNextFirst:
		return true
	default:
		return false
	}
}

func storyboardProductionMaterialClause(context storyboardProductionContext, shot map[string]any) string {
	descriptions := make([]string, 0)
	for _, id := range storyboardStringItems(shot["material_ids"]) {
		material := context.materials[id]
		if material == nil {
			continue
		}
		label := fmt.Sprintf("%s“%s”", storyboardProductionMaterialLabel(requiredString(material, "type")), requiredString(material, "name"))
		if prompt := requiredString(material, "prompt"); prompt != "" {
			label += "：" + prompt
		}
		descriptions = append(descriptions, label)
	}
	if len(descriptions) == 0 {
		return "主体以本镜构图为准，不得从其他镜头擅自带入主体"
	}
	return "本镜素材设定（只约束稳定外观；姿态、道具状态和内容以本拍为准；出画范围以当前构图为准，不要求全部入画）：" + strings.Join(descriptions, "；") + "；未列出的主体不得擅自出现"
}

func storyboardProductionReferenceClause(context storyboardProductionContext, keys []string) string {
	labels := make([]string, 0, len(keys))
	for _, key := range keys {
		reference := context.references[key]
		if reference == nil {
			continue
		}
		label := firstStoryboardText(requiredString(reference, "label"), key)
		purpose := requiredString(reference, "purpose")
		if spec, found := botmodel.FindStoryboardReferencePurposeSpec(purpose); found {
			label += "（" + spec.Name + "）"
		}
		labels = append(labels, label)
	}
	if len(labels) == 0 {
		return ""
	}
	return "明确参考：" + strings.Join(labels, "、") + "；各参考对象保持独立，不融合或互换特征"
}

func storyboardProductionVisualStyle(context storyboardProductionContext) string {
	if context.visualMode == "" {
		return storyboardProductionClause("统一视觉风格", context.stylePrompt)
	}
	visualType := "写实影像"
	if context.visualMode == botmodel.StoryboardVisualModeStylized {
		visualType = "风格化影像"
	}
	return storyboardProductionJoin("画面类型："+visualType, storyboardProductionClause("统一视觉风格", context.stylePrompt))
}

func storyboardProductionPhysicalRule() string {
	return "按素材设定与镜头关系保持主体、环境和物件的相对尺度稳定，保留明确尺寸与幻想设定；空间层次、透视、遮挡、接触点、支撑关系和重力合理；景深与裁切改变画面占比，不改变实体大小"
}

func storyboardProductionFaceRule() string {
	return "可见人物或生物的姿态、面部结构、视线目标和表情必须符合当前动作与情境；不可见面部不强行补出"
}

func storyboardProductionContinuityRule() string {
	return "参考图按用途使用：角色与道具图保持身份、外观、结构和材质，场景图保持环境布局与光线；独立素材图的裁切、留白和画面占比不代表对象间真实大小；镜头参考图延续当前状态未改变的空间关系，尺度与当前明确的素材和空间设定冲突时以文字设定为准，保留外观并校正比例及接触关系，不沿用失衡比例；不融合或互换对象特征"
}

func storyboardProductionLightingRule() string {
	return "光照默认继承场景设定与起始画面的光源方向、色温、曝光和阴影关系；同场换机位只改变观察角度，不重新布光，镜内保持照明稳定，不自行添加侧光扫过、亮度起伏或色温渐变。只有分镜或本镜补充要求明确安排时间、天气或光源变化时，才执行对应的光照变化"
}

func storyboardProductionVideoBoundaryClause(shot map[string]any, useActualStart bool) string {
	state := mapField(shot, "continuity_state")
	start := ""
	if !useActualStart {
		start = storyboardProductionJoin(
			storyboardProductionClause("起始状态", requiredString(state, "entry")),
			storyboardProductionClause("起始构图", requiredString(shot, "start_framing")),
		)
	} else if _, tracked := state["facts"]; tracked {
		start = storyboardProductionClause("首帧正在承接的状态", requiredString(state, "entry"))
	}
	end := storyboardProductionJoin(
		storyboardProductionClause("结束状态", requiredString(state, "exit")),
		storyboardProductionClause("结束构图", requiredString(shot, "end_framing")),
	)
	return storyboardProductionJoin(start, end)
}

func storyboardProductionVideoInputRule(shot map[string]any, mode string) string {
	firstFrameRule := "。首帧确定起始画面，只按本镜明确安排让主体入场、离场或改变状态；画外声音不引入新的画面主体"
	if shot["continue_previous"] == true && mode == botmodel.StoryboardShotImageFirstLast {
		return "firstFrame 是续接画面，来自与上一段共用的规划接点图；lastFrame 是本镜结束图。首帧实际可见的姿态、视线、手与道具的接触和机位优先于文字中的预计起始状态。沿正在进行的动作、相机方向与速度续拍；不回到动作起点，不先停住再启动。固定机位保持景别和视角；只有安排了运镜才沿原路线渐变，不在段首跳到落点" + firstFrameRule
	}
	if shot["continue_previous"] == true {
		resume := "从开场图可见的姿态、视线、手与道具接触和机位接下去。接续正在进行的人物动作；固定机位保持取景，有运镜才沿原方向继续。不回到动作起点，不先停住再重新启动"
		if mode == botmodel.StoryboardShotImageFirstFrame {
			return "firstFrame 是与上一段共用的规划接点图。" + resume + firstFrameRule
		}
		if mode == botmodel.StoryboardShotImageReferences && requiredString(shot, "shot_image_mode") == botmodel.StoryboardShotImageFirstFrame {
			return "第一张参考图提供与上一段共用的规划开场；其余图仅参考外观。" + resume
		}
	}
	switch mode {
	case botmodel.StoryboardShotImageNextFirst:
		return "firstFrame 为本镜首帧，lastFrame 为相邻下一镜的同一首帧；只生成两端之间的直接连续动作，结束构图与下一镜开场一致" + firstFrameRule
	case botmodel.StoryboardShotImageFirstLast:
		return "firstFrame 是本镜开场，lastFrame 是本镜结束画面；只补全两帧之间的连续动作" + firstFrameRule
	case botmodel.StoryboardShotImageLastFrame:
		return "输入图片作为尾帧，动作必须自然到达该状态"
	case botmodel.StoryboardShotImageReferences:
		// Generic image transport must retain the storyboard's temporal roles.
		switch requiredString(shot, "shot_image_mode") {
		case botmodel.StoryboardShotImageFirstLast, botmodel.StoryboardShotImageNextFirst:
			return "输入图片按时间端点排序：第一张参考本镜起始状态，第二张参考本镜结束状态；从第一张的姿态与构图连续推进到第二张，不把它们当作可任选的并列外观，不在开场提前采用结束姿态" + firstFrameRule
		case botmodel.StoryboardShotImageLastFrame:
			return "输入图片参考本镜结束状态，动作自然到达该状态"
		case botmodel.StoryboardShotImageFirstFrame:
			return "第一张图片参考本镜起始画面，从这张图的姿态与构图继续动作；其余图片只作外观参考，不另起开场" + firstFrameRule
		}
		return "输入图片是并列视觉参考，不代表时间顺序；按文字状态生成完整动作"
	case botmodel.StoryboardShotImageNone:
		return "按结构化描述生成完整动作，不假定存在镜头图片"
	default:
		return "输入图片作为首帧，从该状态自然完成本镜动作" + firstFrameRule
	}
}

func storyboardVideoReferenceMode(mode string) string {
	if mode == botmodel.StoryboardShotImageReferences {
		return "references"
	}
	if mode == botmodel.StoryboardShotImageNone {
		return ""
	}
	return "frames"
}

func storyboardProductionDurationClause(shot map[string]any) string {
	duration := storyboardProductionCaptureDuration(shot)
	if duration <= 0 {
		return ""
	}
	return fmt.Sprintf("时长：%d 秒", duration)
}

func storyboardProductionCaptureDuration(shot map[string]any) int {
	duration, _ := integerValue(shot["duration"])
	capture, _ := integerValue(shot["capture_duration"])
	return max(capture, duration)
}

func storyboardProductionShotOrder(shot map[string]any) string {
	if order, ok := integerValue(shot["order"]); ok && order > 0 {
		return fmt.Sprint(order)
	}
	return requiredString(shot, "id")
}

func storyboardProductionMaterialLabel(materialType string) string {
	switch materialType {
	case "character":
		return "角色"
	case "scene":
		return "场景"
	case "prop":
		return "道具"
	default:
		return "素材"
	}
}

func storyboardProductionClause(label string, value string) string {
	value = strings.TrimSpace(value)
	if value == "" {
		return ""
	}
	return label + "：" + value
}

func storyboardProductionJoin(parts ...string) string {
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		part = strings.TrimSpace(strings.TrimRight(part, "。！？!?；;，,：:"))
		if part != "" {
			result = append(result, part)
		}
	}
	return strings.Join(result, "。")
}

func mapField(row map[string]any, key string) map[string]any {
	value, _ := row[key].(map[string]any)
	return value
}
