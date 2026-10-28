package energon

import (
	"fmt"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
	tokenbudget "github.com/dever-package/bot/service/agent/runtime/tokenbudget"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

// WritingChapterBatchLimit is shared by the planning command and strict model output.
const WritingChapterBatchLimit = 20

const writingOutlineResponsibilities = "故事总纲是唯一的全书故事走向，写成可直接阅读的完整故事梗概：按时间与因果讲清主角想达成什么、为何行动、遇到什么阻碍、采取什么具体行动、造成什么后果，以及由此发生的重要转折和收束。用自然段和必要的小标题串起故事，不以设定清单、抽象主题或固定节拍模板代替情节，也不在正文添加 overview: 等字段标签。依计划总章数安排少量连续阶段，每阶段标明预期章号范围、阶段目标、关键转折，以及应埋设和回收的伏笔；短篇按实际篇幅简化，长篇覆盖全书而不是只规划首批，不逐章罗列，不另写梗概、故事线或结构副本。完整故事交代核心冲突如何解决、代价及确定结局；连载保留长期方向与当前阶段目标，未要求终局时不强锁结局。已有正文是事实不能改写，未来情节仍是计划而非已发生事实；逐章细节留在章节卡片。"

const writingChapterPlanResponsibilities = "依据 outline.overview 对应的阶段目标、转折和伏笔推进。每章 plan 写清谁为达成什么目标采取什么具体行动、遭遇什么冲突、行动造成什么后果，以及这些后果如何推动下一步；先说明承接前章的起点、行动后的实际预期结果与章末如何引出下一章；交代本章必须推进的人物关系、线索及必要伏笔埋设/回收，不用抽象主题或泛泛的剧情概述代替章纲，不强制每章反转。actual_history/latest_actual 是实际正文证据，units、neighboring_units 和未来阶段是计划而非已发生事实；后续规划须衔接已写事实，不倒改已保存正文。"

const writingChapterPlanningResponsibilities = "batch 是程序指定的本批章号起止、数量与计划总数，只细化该范围，不能将本批末章误作全书结局，也不能把批次扩为全书。" + writingChapterPlanResponsibilities

func writingSectionResponsibilities(sectionID string) string {
	switch sectionID {
	case "overview":
		return writingOutlineResponsibilities
	case "world":
		return "世界背景只写本故事适用的时代、社会环境与影响行动的必要约束，说明这些条件怎样影响人物选择和冲突；普通日常故事不虚构超自然规则，不复述整段情节或堆砌无关设定。"
	case "characters":
		return "人物 description 写清其目标、动机、阻碍、关键人物关系及随故事发生的成长或变化，使其选择和行动有依据；外貌只写影响情节或人物辨识的必要部分，不用外貌履历清单代替人物。遵循已保存的故事走向和正文事实。"
	case "locations":
		return "地点 description 写清具体环境、与人物行动或冲突的关系及必要限制，只保留故事需要的地点，不堆砌无关风景。"
	case "props":
		return "道具 description 写清用途、限制及与行动或线索的关系，只保留故事需要的道具，不为凑数添加。"
	default:
		return ""
	}
}

func writingObject(properties map[string]any, required ...string) map[string]any {
	return map[string]any{"type": "object", "additionalProperties": false, "properties": properties, "required": required}
}
func writingString() map[string]any         { return map[string]any{"type": "string"} }
func writingArray(items any) map[string]any { return map[string]any{"type": "array", "items": items} }
func writingEntitySchema() map[string]any {
	return writingObject(map[string]any{"id": writingString(), "name": writingString(), "description": writingString()}, "id", "name", "description")
}
func writingPlanSchema() map[string]any {
	return writingObject(map[string]any{"id": writingString(), "unit_type": map[string]any{"type": "string", "enum": []string{"chapter"}}, "title": writingString(), "plan": writingString(), "children": map[string]any{"type": "array", "maxItems": 0, "items": writingString()}}, "id", "unit_type", "title", "plan", "children")
}

// 分步任务复用 Gateway；候选、目录和正文各有唯一输出合同。
func writingOutputContract(request powerOutputContractContext) (powerOutputContract, error) {
	action := request.WritingAction
	sectionID := request.WritingSectionID
	if action == "" {
		action = "generate_inspirations"
	}
	fields := []string{}
	properties := map[string]any{}
	required := []string{}
	prompt := ""
	switch action {
	case "generate_inspirations":
		properties["inspirations"] = writingArray(writingObject(map[string]any{"id": writingString(), "title": writingString(), "content": writingString()}, "id", "title", "content"))
		required = []string{"inspirations"}
		prompt = "根据用户的一句话创作三个明显不同、可供选择的故事灵感，每条包含标题 title 和具体创作方向 content，id 必须留空。当前任务 count 为 1 时只返回一个替代 current_inspiration 的灵感；否则恰好返回三个。不要生成大纲、章节、素材或正文，不提出确认和补充信息。"
	case "planning_preferences":
		properties["preferences"] = writingPreferencesSchema()
		required = []string{"preferences"}
		prompt = "只补齐本书写作设定，已有显式值保持。根据原始需求确定题材、文风、视角、complete或serial模式、每章软字数和计划章数。不生成情节、人物或正文。"
	case "planning_direction":
		fields = []string{"content"}
		prompt = "只返回 content，保存为故事总纲，不生成章纲、素材或正文。" + writingOutlineResponsibilities
	case "planning_background":
		properties["world"] = writingString()
		properties["locations"] = writingArray(writingEntitySchema())
		properties["props"] = writingArray(writingEntitySchema())
		required = []string{"world", "locations", "props"}
		prompt = "只规划背景，按world、locations、props的顺序输出：先写完整的世界背景，再写必要地点，最后写必要道具（不需要则[]）。" + writingSectionResponsibilities("world") + writingSectionResponsibilities("locations") + writingSectionResponsibilities("props") + "保留所有已有地点道具ID及类型，新增ID为空，名称描述非空。遵循已保存人物和故事走向，不生成章节和正文。"
	case "chapter_body":
		properties = writingChapterBodyProperties(request)
		required = []string{"blocks", "body_complete", "synopsis", "end_state"}
		prompt = writingChapterBodyPrompt
	case "continuity":
		if request.WritingSourcePassageCount <= 0 {
			return powerOutputContract{}, fmt.Errorf("衔接整理缺少当前固定正文的段落选择范围")
		}
		properties = writingContinuityOutputProperties(request.WritingSourcePassageCount, request.WritingCharacterIDs, request.WritingThreadIDs)
		required = []string{"synopsis", "end_state", "facts", "character_changes", "threads", "findings"}
		prompt = writingContinuityOutputPrompt
	case "generate_chapters":
		properties["units"] = writingArray(writingPlanSchema())
		properties["units"].(map[string]any)["maxItems"] = WritingChapterBatchLimit
		required = []string{"units"}
		prompt = "仅依据已选灵感和完整大纲中的故事走向、人物关系与背景约束展开章节目录及具体章纲 plan。每章必须完整返回 id、unit_type、title、plan、children 基础字段，title 是具体且非空的本章标题，plan 是非空的本章章纲。target_unit_ids 非空时恰好返回这些章节，严格按 target_unit_ids 的顺序排列 units，保留每个原 ID，禁止调换顺序、新增、遗漏、重复或返回邻章；units 为目标现状，neighboring_units 仅供衔接，不属于修改范围。首次生成 target_unit_ids 为空时必须恰好返回程序指定的 count 章，不能自行扩大或缩减。单次最多 max_chapters 章，不能将超过限制的需求偷偷缩减后冒充全书完成。unit_type 只能 chapter，children 为 []；新章节 ID 留空。禁止生成或修改大纲人物场景道具，禁止返回 entities、正文或正文资产指针。" + writingChapterPlanningResponsibilities
	case "outline_section":
		fields = []string{"content"}
		prompt = "仅修改 section_id 指定的大纲文字区块，其他区块和素材只作上下文参考。" + writingSectionResponsibilities(sectionID) + "遵循 instruction 和已有正文事实，不返回其他区块、素材、目录或正文。"
	case "chapter_plan":
		fields = []string{"plan"}
		prompt = "只为 unit 指定的章节生成章纲 plan，不返回正文、章节身份或标题。" + writingChapterPlanResponsibilities
	case "section_entities":
		properties["entities"] = writingArray(writingEntitySchema())
		required = []string{"entities"}
		prompt = "只根据 instruction 修改 section_id 指定的素材。" + writingSectionResponsibilities(sectionID) + "entity_id 非空时仅返回该 ID 的一个实体；为空时返回此类型完整列表并保留所有已有 ID。新增 ID 留空，name 和 description 非空；不返回其他类型、目录和正文。"
	case "append":
		properties["units"] = writingArray(writingPlanSchema())
		properties["units"].(map[string]any)["maxItems"] = WritingChapterBatchLimit
		required = []string{"units"}
		prompt = "从 append_after 和 next_number 后续规划恰好 count 个全新章节，按章号顺序返回 units，unit_type 为 chapter，每章 title 和 plan 非空，id 留空，children 为 []。不返回已有章节、正文或资产指针。" + writingChapterPlanningResponsibilities
	case "propose_edit":
		fields = []string{"replacement"}
		prompt = "只修改 target 的文字，返回 replacement。selected_text 非空时仅返回该选区替换结果，current_content 只供参考；为空时返回目标完整替换文字。遵循 instruction，不添加说明、标记、其他内容。正文不得添加章节标题，标题由编辑器单独显示。"
	default:
		return powerOutputContract{}, fmt.Errorf("创作输出动作无效")
	}
	for _, field := range fields {
		properties[field] = writingString()
	}
	required = append(required, fields...)
	schema := writingObject(properties, required...)
	preferenceRule := "它们仅为输入，不得返回或自行更改。"
	if action == "planning_preferences" {
		preferenceRule = "本次生成 preferences 自动补齐空值，保持已有显式值。"
	}
	prompt += "\n遵循当前创作数据中的 preferences 和 writing_constraints；" + preferenceRule + "当前动作 " + action + " 的输出合同优先于通用能力中的其他输出格式要求：仅调用 submit_output 一次，参数严格遵循该工具的 parameters，顶层必填且仅允许字段：" + strings.Join(required, ", ") + "。不得把结果放进 text、json 或其他包装，不得附加说明或省略必填字段。"
	return powerOutputContract{Type: "writing", Strict: true, Description: "提交创作动作 " + action + " 的结果", Prompt: prompt, Schema: schema, Normalize: func(output, input map[string]any) (normalized map[string]any, failure error) {
		defer func() {
			if failure != nil {
				failure = fmt.Errorf("动作 %s: %w", action, failure)
			}
		}()
		if action == "chapter_body" {
			// 只有原生明确完成结果会进入此处。派生格式问题不能抹掉独立有效的完整正文。
			return normalizeWritingChapterBody(output)
		}
		if err := validateWritingOutputValue(output, schema, "result"); err != nil {
			return nil, err
		}
		for _, field := range fields {
			value, ok := output[field].(string)
			if !ok || field != "open_threads" && strings.TrimSpace(value) == "" {
				return nil, fmt.Errorf("result.%s 必须为有效文字", field)
			}
		}
		for _, field := range []string{"inspirations", "units"} {
			if _, needed := properties[field]; needed {
				rows, ok := output[field].([]any)
				if !ok || len(rows) == 0 {
					return nil, fmt.Errorf("缺少有效 %s", field)
				}
			}
		}
		if action == "planning_background" {
			if strings.TrimSpace(output["world"].(string)) == "" {
				return nil, fmt.Errorf("result.world 必须为有效文字")
			}
			for _, field := range []string{"locations", "props"} {
				if err := validateWritingOutputEntities(output[field].([]any), "result."+field); err != nil {
					return nil, err
				}
			}
		}
		if action == "section_entities" {
			rows, ok := output["entities"].([]any)
			if !ok {
				return nil, fmt.Errorf("缺少当前素材列表")
			}
			if err := validateWritingOutputEntities(rows, "result.entities"); err != nil {
				return nil, err
			}
		}

		return output, nil
	}}, nil
}
func validateWritingOutputEntities(rows []any, path string) error {
	for index, row := range rows {
		entity, ok := row.(map[string]any)
		if !ok {
			return fmt.Errorf("%s[%d] 必须为对象", path, index)
		}
		for _, field := range []string{"id", "name", "description"} {
			value, ok := entity[field].(string)
			if !ok || field != "id" && strings.TrimSpace(value) == "" {
				return fmt.Errorf("%s[%d].%s 必须为有效文字", path, index, field)
			}
		}
	}
	return nil
}

func validateWritingRequestBudget(req *botprotocol.ShemicRequest, service botmodel.Service) error {
	if req == nil || req.WritingAction == "" {
		return nil
	}
	limits, err := limitsForService(service)
	if err != nil {
		return err
	}
	required := tokenbudget.Estimate(req.Input) + tokenbudget.Estimate(req.Set) + tokenbudget.Estimate(req.Options) + tokenbudget.Estimate(req.History)
	_, err = tokenbudget.Resolve(limits.ContextWindowTokens, limits.ContextWindowTokens, limits.MaxOutputTokens, required)
	return err
}
func writingOutputReceived(power botmodel.Power, output botprotocol.Output) bool {
	if power.OutputType != botmodel.OutputTypeStory {
		return false
	}
	switch strings.ToLower(botprotocol.AsText(output["event"])) {
	case "status", "control", "warning":
		return false
	}
	return len(botprotocol.ParseToolCalls(output["tool_calls"])) > 0 || strings.TrimSpace(botprotocol.AsText(output["text"])) != "" || output["json"] != nil
}

func writingPreferencesSchema() map[string]any {
	properties := map[string]any{}
	for _, field := range []string{"genre", "style", "style_instructions", "pov", "mode"} {
		properties[field] = writingString()
	}
	for _, field := range []string{"chapter_words", "planned_chapters"} {
		properties[field] = map[string]any{"type": "integer", "minimum": 0}
	}
	properties["style"] = map[string]any{"type": "string", "enum": []string{"natural", "restrained", "vivid", "humorous"}}
	properties["pov"] = map[string]any{"type": "string", "enum": []string{"first", "third_limited", "omniscient"}}
	properties["mode"] = map[string]any{"type": "string", "enum": []string{"complete", "serial"}}
	return writingObject(properties, "genre", "style", "style_instructions", "pov", "mode", "chapter_words", "planned_chapters")
}
