package energon

import (
	"fmt"
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
		mode := botmodel.NormalizeStoryboardShotImageMode(firstStoryboardText(request.ShotImageMode, requiredString(shot, "shot_image_mode")))
		points := storyboardProductionCutPoints(shot)
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
		duration, _ := integerValue(shot["duration"])
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
	parts := []string{fmt.Sprintf("生成镜头 %s 的单张%s", storyboardProductionShotOrder(shot), frameLabel)}
	if isEnd {
		parts = append(parts,
			"第一张参考图是本镜首图；保留它的场内布局、未变化的物件与照明，沿分镜运镜到达结束机位。没有位移动作的主体保持原位，按结束机位的视线和遮挡取景",
			storyboardProductionClause("到达尾帧机位的运镜", requiredString(shot, "camera_instruction")),
		)
	}
	parts = append(parts, storyboardProductionClause("静态构图", framing), storyboardProductionClause(stateLabel, state))
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
	matchAction bool
	incoming    string
	outgoing    string
	sound       string
	leadMS      int
}

func storyboardProductionCutPoints(shot map[string]any) storyboardCutPoints {
	handoff := mapField(shot, "handoff")
	lead, _ := integerValue(handoff["sound_lead_ms"])
	return storyboardCutPoints{
		matchAction: shot["match_previous"] == true && handoff["match_action"] == true,
		incoming:    requiredString(handoff, "incoming"),
		outgoing:    requiredString(handoff, "outgoing"),
		sound:       requiredString(handoff, "sound_cue"),
		leadMS:      lead,
	}
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
	motion := storyboardProductionClause("镜内动作与声音", action)
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
	parts = append(parts,
		storyboardProductionClause("运镜", firstStoryboardText(requiredString(shot, "camera_instruction"), "保持开场时的构图和运动方向")),
		storyboardProductionClause("连续经过的空间路线", cameraPath),
		"没有位移动作的主体保持相对场内固定物的位置。因运镜或遮挡而出画的主体，只能沿计划中的相机路线在原处重新可见，或按本镜明确安排的移动路线入画；不为对齐尾帧换位、换边或重做动作",
	)
	incoming := storyboardProductionClause("本镜入点", points.incoming)
	if points.matchAction {
		parts = append([]string{"从本镜新机位首帧里的姿态、视线、持物关系与道具状态接着拍。只执行下面安排的后续动作和与之同步的声音。若首帧仍有正在进行的动作，沿原方向自然收势；已经完成就保持其结果并接下一拍。没有新动作安排的道具保持首帧状态。"}, parts...)
		incoming = ""
	}
	parts = append(parts,
		storyboardProductionVideoBoundaryClause(shot, points.matchAction || continues),
		incoming,
		storyboardProductionClause("本镜出点", points.outgoing),
		storyboardProductionClause("连续性锚点", requiredString(shot, "continuity_anchor")),
	)
	inputRule := storyboardProductionVideoInputRule(shot, mode)
	if continues {
		parts = append([]string{inputRule}, parts...)
	} else {
		parts = append(parts, inputRule)
	}
	parts = append(parts, "生成一个连续镜头，按自然实时速度完成动作与运镜，根据结束构图渐进改变视角和关注点，不在段尾摆姿势或拖慢动作；不在镜内切换机位，不生成闪黑、模糊或叠化效果")
	if cameraPath != "" {
		parts = append(parts, "随摄影机沿路径经过真实空间，新区域从相机前进方向逐步进入画面，原区域因正常的透视和遮挡退出画面；曝光与环境声随相机位置和实际光源变化，禁止背景变形或整幅跳亮。")
	}
	if storyboardProductionHasStartFrame(shot, mode) {
		parts = append(parts, "视觉风格、主体外观、材质与光线承接首帧；只按本镜要求发生变化")
	} else {
		parts = append(parts, storyboardProductionVisualStyle(context))
	}
	// 首帧可能尚未出现本镜将要入场的主体，仍须传递本镜素材的身份与外观。
	parts = append(parts, storyboardProductionMaterialClause(context, shot))
	parts = append(parts, storyboardProductionLightingRule())
	if storyboardProductionHasCharacters(context, shot) {
		parts = append(parts, "人物身份、服装、姿态与持物关系保持连续，只执行本镜明确安排的变化；画外人物仅在本镜明确安排入场时入画", storyboardProductionFaceRule(), storyboardProductionMotionRule())
	}
	if nativeAudio && context.workType != botmodel.StoryboardWorkTypeMV {
		parts = append(parts, storyboardNativeAudioPrompt(context, shot))
	} else {
		parts = append(parts, "不生成可辨识对白、旁白、字幕、文字或背景音乐；环境声与动作音按本镜补充要求生成，完全静音要求优先。")
	}
	parts = append(parts, "动作音与画面中实际发生的动作、接触同步，没有声音来源时保持安静，不自行添加人声、配乐或无关音效。")
	if (continues || shot["match_previous"] == true) && cameraPath == "" {
		parts = append(parts, "本镜仍在同一场戏：按本镜明确的环境底声、空间混响和声音强弱保持声场一致，底声贯穿段首段尾，不单独做开场或收尾，不重放上一段已完成动作的音效。")
	}
	if context.workType != botmodel.StoryboardWorkTypeMV && points.sound != "" {
		parts = append(parts, storyboardProductionClause("开场环境底声", points.sound))
		if points.leadMS > 0 {
			parts = append(parts, fmt.Sprintf("开场前 %d 毫秒只保留连续环境底声，动作音和人声从这之后按分镜进入", points.leadMS))
		}
	}
	if context.workType == botmodel.StoryboardWorkTypeMV {
		parts = append(parts, "歌曲是后期加入的画外主音轨，画面角色不因歌曲含有人声而张嘴或对口型；只执行分镜明确安排的故事动作。仅当本镜动作明确安排出镜演唱时才表现演唱。")
	}
	parts = append(parts,
		storyboardProductionClause("空间关系与真实尺度", requiredString(shot, "spatial_layout")),
		storyboardProductionReferenceClause(context, storyboardStringItems(shot["reference_keys"])),
		fmt.Sprintf("画幅：%s", context.aspectRatio),
		storyboardProductionDurationClause(shot),
		"保持主体、环境和物件的相对尺度稳定，接触、遮挡与透视合理；参考图画面占比不代表对象间真实大小，不融合或互换对象特征",
	)
	return storyboardProductionJoin(parts...)
}

func storyboardNativeAudioPrompt(context storyboardProductionContext, shot map[string]any) string {
	parts := []string{"同时生成本镜原生声音，环境声与动作音按本镜补充要求生成，完全静音要求优先；不生成背景音乐、字幕或画面文字。"}
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
			mode = "出镜对白，仅此人说话，其他人保持聆听；保持分镜构图，不为说话擅自切镜"
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
		parts = append(parts, "本镜没有台词或旁白；未要求完全静音时只生成环境声和动作音效。")
		if storyboardProductionHasCharacters(context, shot) {
			parts = append(parts, "人物不说话，不做说话口型。")
		}
	} else {
		parts[0] += "以下是完整台词，按原文和指定起点说出，不改词、不增删、不抢说，所有台词在本镜时长内说完。未安排台词时不说话。"
		parts = append(parts, "同一角色保持本镜要求的语言、声线与说话方式，台词自然说完，不在镜头边界截断音节，不补说上一段台词。")
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
	return "本镜素材设定（出画范围以当前构图为准，不要求全部入画）：" + strings.Join(descriptions, "；") + "；未列出的主体不得擅自出现"
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

func storyboardProductionMotionRule() string {
	return "人体运动符合解剖：转身由脚步、髋部、躯干带动头部依次完成，头部与躯干朝向连贯，不出现头部单独旋转、颈部拧转、肢体数量或关节方向异常；人物从首帧自然过渡到尾帧，不在镜内突然改变朝向或位置；可见范围以本镜构图为准，特写只呈现指定部位，入画与出画按本镜动作执行"
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
		return "firstFrame 与上一镜的 lastFrame 使用同一张规划图。lastFrame 是本镜结束图。沿上一镜结束的方向与速度感起拍，渐进地完成两张图之间的动作和运镜，不重置姿态、机位或动作进度" + firstFrameRule
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
	duration, ok := integerValue(shot["duration"])
	if !ok || duration <= 0 {
		return ""
	}
	return fmt.Sprintf("时长：%d 秒", duration)
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
