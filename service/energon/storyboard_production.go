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
}

type StoryboardProductionPrompt struct {
	Prompt           string
	StartFramePrompt string
	EndFramePrompt   string
	AspectRatio      string
	Duration         int
	ReferenceMode    string
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
		mode := botmodel.NormalizeStoryboardShotImageMode(request.ShotImageMode)
		if mode == "" {
			mode = botmodel.NormalizeStoryboardShotImageMode(requiredString(shot, "shot_image_mode"))
		}
		if mode == "" {
			mode = botmodel.StoryboardShotImageFirstFrame
		}
		if itemType == "shot_image" {
			startPrompt := storyboardShotImageProductionPrompt(context, shot, "start", mode, editablePrompt)
			endPrompt := storyboardShotImageProductionPrompt(context, shot, "end", mode, editablePrompt)
			prompt := startPrompt
			switch strings.ToLower(strings.TrimSpace(request.FrameRole)) {
			case "end":
				prompt = endPrompt
			case "":
				if mode == botmodel.StoryboardShotImageFirstLast {
					prompt = strings.Join([]string{
						"按顺序生成两张独立关键帧，不得合并为拼图或交换顺序。",
						"首帧：" + startPrompt,
						"尾帧：" + endPrompt,
					}, "\n")
				}
			}
			return StoryboardProductionPrompt{
				Prompt:           prompt,
				StartFramePrompt: startPrompt,
				EndFramePrompt:   endPrompt,
				AspectRatio:      context.aspectRatio,
			}, nil
		}
		duration, _ := integerValue(shot["duration"])
		return StoryboardProductionPrompt{
			Prompt:        storyboardShotVideoProductionPrompt(context, shot, mode, editablePrompt),
			AspectRatio:   context.aspectRatio,
			Duration:      duration,
			ReferenceMode: storyboardVideoReferenceMode(mode),
		}, nil
	default:
		return StoryboardProductionPrompt{}, fmt.Errorf("分镜制作条目类型不支持: %s", itemType)
	}
}

type storyboardProductionContext struct {
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

func storyboardMaterialProductionRule(materialType string) string {
	switch materialType {
	case "character":
		return "保持同一主体的身份、解剖结构、外观特征和各视角比例一致；采用便于后续镜头复用的清晰设定构图"
	case "scene":
		return "清楚呈现环境边界、空间层次、固定结构、通行关系和主要光线；不加入无关主体"
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
	parts := []string{
		fmt.Sprintf("生成镜头 %s 的单张%s", storyboardProductionShotOrder(shot), frameLabel),
		storyboardProductionVisualStyle(context),
		storyboardProductionMaterialClause(context, shot),
	}
	parts = append(parts, storyboardEditableProductionParts(editablePrompt,
		storyboardProductionClause("画面内容", requiredString(shot, "description")),
		storyboardProductionClause(stateLabel, state),
		storyboardProductionClause("静态构图", framing),
	)...)
	parts = append(parts,
		storyboardProductionClause("空间关系与真实尺度", requiredString(shot, "spatial_layout")),
		storyboardProductionReferenceClause(context, storyboardStringItems(shot["reference_keys"])),
		fmt.Sprintf("画幅：%s", context.aspectRatio),
		storyboardProductionPhysicalRule(),
		storyboardProductionFaceRule(),
		storyboardProductionContinuityRule(),
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
) string {
	parts := []string{
		fmt.Sprintf("生成镜头 %s 的连续视频", storyboardProductionShotOrder(shot)),
		storyboardProductionVisualStyle(context),
		storyboardProductionMaterialClause(context, shot),
	}
	parts = append(parts, storyboardEditableProductionParts(editablePrompt,
		storyboardProductionClause("画面内容", requiredString(shot, "description")),
		storyboardProductionVideoBoundaryClause(shot, mode),
		storyboardProductionClause("动作推进", requiredString(shot, "beat")),
		storyboardProductionClause("运镜", firstStoryboardText(requiredString(shot, "camera_instruction"), "固定机位，保持构图和轴线稳定")),
		storyboardProductionClause("连续性锚点", requiredString(shot, "continuity_anchor")),
		storyboardProductionClause("补充视觉要求", requiredString(shot, "video_prompt")),
	)...)
	parts = append(parts,
		storyboardProductionClause("空间关系与真实尺度", requiredString(shot, "spatial_layout")),
		storyboardProductionReferenceClause(context, storyboardStringItems(shot["reference_keys"])),
		storyboardProductionVideoInputRule(shot, mode),
		fmt.Sprintf("画幅：%s", context.aspectRatio),
		storyboardProductionDurationClause(shot),
		storyboardProductionPhysicalRule(),
		storyboardProductionFaceRule(),
		storyboardProductionContinuityRule(),
		"不生成可辨识对白、旁白、字幕、文字或背景音乐",
	)
	return storyboardProductionJoin(parts...)
}

func storyboardEditableProductionParts(editablePrompt string, generatedParts ...string) []string {
	if editablePrompt = strings.TrimSpace(editablePrompt); editablePrompt != "" {
		return []string{"用户编辑的完整画面要求：" + editablePrompt}
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
		return "当前镜头未声明可见素材，不得从其他镜头或参考图擅自带入主体"
	}
	return "当前可见素材设定：" + strings.Join(descriptions, "；") + "；未列出的主体不得擅自出现"
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
	visualType := "写实影像"
	if context.visualMode == botmodel.StoryboardVisualModeStylized {
		visualType = "风格化影像"
	}
	return storyboardProductionJoin("画面类型："+visualType, storyboardProductionClause("统一视觉风格", context.stylePrompt))
}

func storyboardProductionPhysicalRule() string {
	return "按素材设定与镜头关系保持主体、环境和物件的相对尺度稳定；空间层次、透视、遮挡、接触点、支撑关系和重力合理；景深与机位改变画面占比，不改变实体大小，不得为突出细节擅自放大对象"
}

func storyboardProductionFaceRule() string {
	return "可见人物或生物的姿态、面部结构、视线目标和表情必须符合当前动作与情境；不可见面部不强行补出"
}

func storyboardProductionContinuityRule() string {
	return "参考图按用途使用：角色与道具图保持身份、外观、结构和材质，场景图保持环境布局与光线；独立素材图的裁切、留白和画面占比不代表对象间真实大小；镜头参考图延续当前状态未改变的空间关系，不融合或互换对象特征"
}

func storyboardProductionVideoBoundaryClause(shot map[string]any, mode string) string {
	state := mapField(shot, "continuity_state")
	start := storyboardProductionJoin(
		storyboardProductionClause("起始状态", requiredString(state, "entry")),
		storyboardProductionClause("起始构图", requiredString(shot, "start_framing")),
	)
	end := storyboardProductionJoin(
		storyboardProductionClause("结束状态", requiredString(state, "exit")),
		storyboardProductionClause("结束构图", requiredString(shot, "end_framing")),
	)
	continuesPrevious, _ := shot["continue_previous"].(bool)
	if continuesPrevious || mode == botmodel.StoryboardShotImageFirstLast || mode == botmodel.StoryboardShotImageLastFrame {
		return ""
	}
	if mode == botmodel.StoryboardShotImageReferences || mode == botmodel.StoryboardShotImageNone {
		return storyboardProductionJoin(start, end)
	}
	return end
}

func storyboardProductionVideoInputRule(shot map[string]any, mode string) string {
	continuesPrevious, _ := shot["continue_previous"].(bool)
	if continuesPrevious {
		return "以上一镜真实视频尾帧作为当前首帧，从该状态自然继续，不重复上一镜内容"
	}
	switch mode {
	case botmodel.StoryboardShotImageFirstLast:
		return "输入的第一张和第二张图片分别作为首帧与尾帧，只补全两帧之间的连续动作"
	case botmodel.StoryboardShotImageLastFrame:
		return "输入图片作为尾帧，动作必须自然到达该状态"
	case botmodel.StoryboardShotImageReferences:
		return "输入图片是并列视觉参考，不代表时间顺序；按文字状态生成完整动作"
	case botmodel.StoryboardShotImageNone:
		return "按结构化描述生成完整动作，不假定存在镜头图片"
	default:
		return "输入图片作为首帧，从该状态自然完成本镜动作"
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
