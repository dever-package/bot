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
	// PreviousSceneFrame marks a new-scene opening that receives the last real
	// frame where its characters appeared, to keep their look across scenes.
	PreviousSceneFrame bool
	// NativeAudio keeps authored speech inside the video request. The separate
	// storyboard dubbing workflow leaves this false. It is not a user setting.
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
// the final prompt used by image and video powers. It deliberately depends on
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
				instruction := "跨章换机位：上一章视频尾帧只作为人物朝向、持物手、道具姿态、空间与光线参考；按本镜 start_framing 重新取景，不复制上一镜构图，不将上一章动作再演一遍。"
				if connection == "continue" {
					instruction = "跨章同机位接续：直接从绑定的上一章真实视频尾帧继续本镜动作。保持尾帧的机位、人物朝向、持物手、道具姿态及光线，不重复入场或重演已完成动作。"
				}
				editablePrompt = strings.Join([]string{editablePrompt, instruction}, "\n")
			}
		}
		mode := botmodel.NormalizeStoryboardShotImageMode(firstStoryboardText(request.ShotImageMode, requiredString(shot, "shot_image_mode")))
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
			if request.PreviousSceneFrame && shot["match_previous"] != true && shot["continue_previous"] != true {
				// 放在最前面：较长的提示词末尾可能被图像模型忽略。
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
			Prompt:        storyboardShotVideoProductionPrompt(context, shot, mode, editablePrompt, request.NativeAudio),
			AspectRatio:   context.aspectRatio,
			Duration:      duration,
			ReferenceMode: storyboardVideoReferenceMode(mode),
		}, nil
	default:
		return StoryboardProductionPrompt{}, fmt.Errorf("分镜制作条目类型不支持: %s", itemType)
	}
}

type storyboardProductionContext struct {
	workType    string
	visualMode  string
	stylePrompt string
	aspectRatio string
	materials   map[string]map[string]any
	references  map[string]map[string]any
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
		workType:    requiredString(document, "work_type"),
		visualMode:  visualMode,
		stylePrompt: requiredString(document, "style_prompt"),
		aspectRatio: aspectRatio,
		materials:   materials,
		references:  references,
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

// The new-scene opening is edited from the last real frame where its
// characters appeared, so the audience sees the same people after the cut.
func storyboardPreviousSceneFrameRule(context storyboardProductionContext, shot map[string]any) string {
	names := []string{}
	for _, id := range storyboardStringItems(shot["material_ids"]) {
		if material := context.materials[id]; requiredString(material, "type") == "character" {
			names = append(names, requiredString(material, "name"))
		}
	}
	people := strings.Join(names, "、")
	return fmt.Sprintf("本镜换场，从上一场画面改出：所附“上一镜头尾帧”是%[1]s上一次出镜的真实画面。以它为底图编辑，画面中必须出现%[1]s，与参考画面是同一个人：脸型、五官、发型、体型和服装保持一致，同一人物必须是同一个人。把环境、时间、天气和光线换成本镜描述，按本镜静态构图重新取景并摆放人物姿态，不保留参考画面的背景和机位；分镜明确写了换装时才改变服装。参考画面里人物手中的伞、书等物件不带入本镜，本镜只出现本镜素材列出的道具。人物的正脸或侧脸清晰可见，不要只拍背影", people)
}

func storyboardMaterialProductionRule(materialType string) string {
	switch materialType {
	case "character":
		return "保持同一主体的身份、解剖结构、外观特征和各视角比例一致；采用便于后续镜头复用的人物设定构图：简洁背景，正面或四分之三侧面全身或半身，脸部五官、发型和服装清楚可见；不放进剧情场景，不撑伞、不戴遮脸的帽子或口罩，手中不拿剧情道具"
	case "scene":
		return "清楚呈现环境边界、空间层次、固定结构、通行关系和主要光线；地面与固定结构使用一致的透视和空间尺度，物件有明确承载面与相符的接触阴影；不加入无关主体"
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
	framing := firstStoryboardText(
		requiredString(shot, framingField),
		requiredString(shot, "camera_instruction"),
	)
	parts := []string{fmt.Sprintf("生成镜头 %s 的单张%s", storyboardProductionShotOrder(shot), frameLabel)}
	parts = append(parts, storyboardProductionClause("本镜相机约束", requiredString(shot, "camera_instruction")))
	if isEnd {
		parts = append(parts, "若提供本镜首帧，直接编辑这张图到下述结束状态。保留未发生变化的内容，只调整状态变化所涉及的主体及其遮挡区域", "摄影机只执行本镜明确的运镜；固定机位时，首帧中门窗、墙面和家具的位置、大小与透视保持原样，不能移动背景来配合人物的新站位")
	} else {
		parts = append(parts, "先按相机约束确定本镜的取景范围，再绘制起始状态。固定机位须在首帧留出相机约束所要求的动作空间，不能按初始姿态填满画框；预留空间不代表提前执行动作")
	}
	parts = append(parts,
		storyboardProductionClause("静态构图", framing),
		storyboardProductionClause(stateLabel, state),
	)
	if editablePrompt != "" {
		parts = append(parts, "本帧补充画面要求（保持上述分镜状态与取景）："+editablePrompt)
	}
	parts = append(parts, "按指定景别裁切主体：画框可以截断人物身体与道具，保留本帧要求可见的脸、手和接触点；不要为了展示完整人物、完整道具或环境而退成更宽景别。素材的完整结构用于保持外观，不要求完整入画")
	if !isEnd && shot["match_previous"] == true {
		parts = append(parts, "本镜换机位：仍在同一场戏内。所附“上一镜头尾帧”是此刻的真实画面，以它为底图改出新机位；这是同一个空间，门窗、墙面、家具和灯具的位置关系不变，人物的脸、发型、服装、持物手和道具状态不变，光线方向与色调不变；只改变相机位置、景别和画面裁切，依照当前静态构图重新取景，不照抄上一镜的构图，也不重新设计环境")
	}
	parts = append(parts, storyboardProductionVisualStyle(context), storyboardProductionMaterialClause(context, shot))
	parts = append(parts,
		storyboardProductionClause("空间关系与真实尺度", requiredString(shot, "spatial_layout")),
		storyboardProductionReferenceClause(context, storyboardStringItems(shot["reference_keys"])),
		fmt.Sprintf("画幅：%s", context.aspectRatio),
		storyboardProductionPhysicalRule(),
		storyboardProductionFaceRule(),
		storyboardProductionContinuityRule(),
		"只表现本帧时刻，空间布局用于保持固定环境与尺度；人物位置、姿态和持物以本帧状态为准，取景以本帧静态构图为准，不把动作过程同时画入一张图",
		"只生成一个完整画面，不出现字幕、对白文字、水印或界面元素",
	)
	if mode == botmodel.StoryboardShotImageReferences {
		parts[0] = fmt.Sprintf("生成镜头 %s 的并列视觉参考图", storyboardProductionShotOrder(shot))
	}
	return storyboardProductionJoin(parts...)
}

func storyboardShotVideoProductionPrompt(
	context storyboardProductionContext,
	shot map[string]any,
	mode string,
	editablePrompt string,
	nativeAudio bool,
) string {
	parts := []string{
		"生成一个连续镜头，全程不切镜。取景和人物出画范围由下列首尾构图决定，机位变化只执行本镜明确的运镜，不为展示场景或听者自行拉远、反打或切全景。镜间转场由后期合成处理。",
		storyboardProductionVideoInputRule(shot, mode),
	}
	// Sound is part of the shot contract, not an afterthought following all
	// appearance references. Keep authored speech (including silence) explicit.
	if nativeAudio {
		parts = append(parts, storyboardNativeAudioPrompt(context, shot))
	} else {
		parts = append(parts, "不生成可辨识对白、旁白、字幕、文字或背景音乐")
	}
	if context.workType == botmodel.StoryboardWorkTypeMV {
		parts = append(parts, "歌曲是后期加入的画外主音轨，画面角色不因歌曲含有人声而张嘴或对口型；只执行分镜明确安排的故事动作。仅当本镜动作明确安排出镜演唱时才表现演唱。")
	}
	parts = append(parts,
		storyboardProductionVideoBoundaryClause(shot),
		storyboardProductionClause("运镜", firstStoryboardText(requiredString(shot, "camera_instruction"), "固定机位，保持构图和轴线稳定")),
		storyboardProductionClause("动作推进", requiredString(shot, "beat")),
		"只执行动作推进明确安排的变化，不自行增加换手、转身、折返或物件交接。未安排变化的人物身份、持物关系和道具数量在整个镜头持续成立，不能仅在首尾恢复；素材描述只约束外观，不新增动作或道具。",
	)
	parts = append(parts, storyboardEditableProductionParts(editablePrompt,
		storyboardProductionClause("补充视觉要求", requiredString(shot, "video_prompt")),
		storyboardProductionClause("画面内容", requiredString(shot, "description")),
		storyboardProductionClause("连续性锚点", requiredString(shot, "continuity_anchor")),
	)...)
	parts = append(parts,
		storyboardProductionMaterialClause(context, shot),
		storyboardProductionVisualStyle(context),
		storyboardProductionClause("空间关系与真实尺度", requiredString(shot, "spatial_layout")),
		storyboardProductionReferenceClause(context, storyboardStringItems(shot["reference_keys"])),
		fmt.Sprintf("画幅：%s", context.aspectRatio),
		storyboardProductionDurationClause(shot),
		"保持主体、环境和物件的相对尺度稳定，保留原分镜明确的尺寸与幻想设定；视线目标和表情符合当前动作；接触、承托、遮挡与重力合理；参考素材的画面占比不代表对象间真实大小。参考图保持人物身份、服装、道具唯一性和场景布局，不融合或互换对象特征。",
	)
	return storyboardProductionJoin(parts...)
}

func storyboardNativeAudioPrompt(context storyboardProductionContext, shot map[string]any) string {
	parts := []string{"同时生成本镜原生声音，环境声与动作一致；不生成背景音乐、字幕或画面文字。"}
	lines, _ := storyboardValueItems(shot["speech"])
	for _, raw := range lines {
		line, _ := raw.(map[string]any)
		text := requiredString(line, "text")
		if text == "" {
			continue
		}
		speaker, mode := "旁白", "画外旁白，画面人物不代说"
		if requiredString(line, "kind") == "dialogue" {
			id := requiredString(line, "character_id")
			speaker = firstStoryboardText(requiredString(context.materials[id], "name"), id)
			mode = "出镜对白，仅此人说话，其他人保持聆听；保持分镜构图，不为说话擅自切镜"
			if requiredString(line, "speaker_mode") == "offscreen" {
				mode = "画外对白，说话人不因此入画，画内人物不代说"
			}
		}
		parts = append(parts, fmt.Sprintf("台词起点 %v 秒，%s（%s）：%q", line["start_time"], speaker, mode, text))
	}
	if len(parts) == 1 {
		parts = append(parts, "本镜没有台词或旁白，只生成环境声和动作音效；人物不说话，不做说话口型。")
	} else {
		parts[0] += "以下是完整台词，按原文和指定起点说出，不改词、不增删、不抢说，所有台词在本镜时长内说完。未安排台词时不说话。"
	}
	return strings.Join(parts, "\n")
}

func storyboardEditableProductionParts(editablePrompt string, generatedParts ...string) []string {
	if editablePrompt = strings.TrimSpace(editablePrompt); editablePrompt != "" {
		return []string{"本镜画面要求：" + editablePrompt}
	}
	return generatedParts
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
	return "按素材设定与镜头关系保持主体、环境和物件的相对尺度稳定；明确的尺寸、身体参照和承载面关系优先，未明确时按该主体与用途的通常尺度呈现，保留明确的幻想设定；空间层次、透视、遮挡、接触点、支撑关系和重力合理，地面与固定结构使用一致透视，接触阴影符合承载面和光线；景深与机位改变画面占比，不改变实体大小，特写通过机位与裁切呈现，不得为突出细节擅自放大对象或缩小人物"
}

func storyboardProductionFaceRule() string {
	return "可见人物或生物的姿态、面部结构、视线目标和表情必须符合当前动作与情境；不可见面部不强行补出"
}

func storyboardProductionContinuityRule() string {
	return "参考图按用途使用：角色与道具图保持身份、外观、结构和材质，场景图保持环境布局与光线；独立素材图的裁切、留白和画面占比不代表对象间真实大小；镜头参考图延续当前状态未改变的空间关系，尺度与当前明确的素材和空间设定冲突时以文字设定为准，保留外观并校正比例及接触关系，不沿用失衡比例；不融合或互换对象特征"
}

func storyboardProductionVideoBoundaryClause(shot map[string]any) string {
	state := mapField(shot, "continuity_state")
	start := storyboardProductionJoin(
		storyboardProductionClause("起始状态", requiredString(state, "entry")),
		storyboardProductionClause("起始构图", requiredString(shot, "start_framing")),
	)
	end := storyboardProductionJoin(
		storyboardProductionClause("结束状态", requiredString(state, "exit")),
		storyboardProductionClause("结束构图", requiredString(shot, "end_framing")),
	)
	return storyboardProductionJoin(start, end)
}

func storyboardProductionVideoInputRule(shot map[string]any, mode string) string {
	firstFrameRule := "。首帧确定已经入画的人物、服装和物件；场次状态可以包含画外主体，不能据此把主体补进画面。没有明确的入画、离场或换装动作时，保持已入画主体及服装，画外人物始终留在画外，不新增背景人物"
	if shot["continue_previous"] == true {
		return "以上一镜真实视频尾帧作为当前首帧，从该时刻直接继续动作；保持已经发生的动作进度，不重复起势或先停住再动。本段不绑定额外目标尾帧，不为抵达新画面改变取景或收尾定姿" + firstFrameRule
	}
	switch mode {
	case botmodel.StoryboardShotImageNextFirst:
		return "firstFrame 为本镜首帧，lastFrame 为相邻下一镜的同一首帧；只生成两端之间的直接连续动作，结束构图与下一镜开场一致" + firstFrameRule
	case botmodel.StoryboardShotImageFirstLast:
		return "输入的第一张和第二张图片分别作为首帧与尾帧，只补全两帧之间的连续动作" + firstFrameRule
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
