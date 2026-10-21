package team

import (
	"fmt"
	"reflect"
	"strings"
)

// 用户明确保存的偏好优先；首次规划只自动补齐空值，后续写作读取保存值。
type WritingPreferences struct {
	Genre             string `json:"genre"`
	Style             string `json:"style"`
	StyleInstructions string `json:"style_instructions"`
	POV               string `json:"pov"`
	Mode              string `json:"mode"`
	ChapterWords      int    `json:"chapter_words"`
	PlannedChapters   int    `json:"planned_chapters"`
}

var writingStyleConstraints = map[string]string{
	"natural":    "表达自然清楚，以具体行动和对话推进，避免空泛抒情、套话和过度修饰。",
	"restrained": "冷峻克制，句子简洁；通过动作、对话和必要细节表现情绪，少用直接评判、夸张和感叹。",
	"vivid":      "细腻有画面，用少量准确的感官细节和动作表现人物与环境；描写服务情节，不堆叠形容词。",
	"humorous":   "轻松幽默，笑点来自人物性格、处境和对话；避免生硬插梗，也不削弱关键冲突的真实后果。",
}

var writingPOVConstraints = map[string]string{
	"first":         "采用第一人称，只写叙述者能够感知、获知和推断的内容，不直接读取其他人物内心。",
	"third_limited": "采用第三人称限定视角，同一场景聚焦一个人物；未知信息不得当作视角人物已知，切换须有清楚场景边界。",
	"omniscient":    "采用第三人称全知视角，转换观察对象须清楚；叙述者掌握的信息不等于角色已经知情。",
}

func (preferences WritingPreferences) validate() error {
	if preferences.Style != "" && writingStyleConstraints[preferences.Style] == "" {
		return fmt.Errorf("写作文风无效")
	}
	if preferences.POV != "" && writingPOVConstraints[preferences.POV] == "" {
		return fmt.Errorf("写作视角无效")
	}
	if preferences.Mode != "" && preferences.Mode != "complete" && preferences.Mode != "serial" {
		return fmt.Errorf("写作模式无效")
	}
	if preferences.ChapterWords < 0 || preferences.PlannedChapters < 0 {
		return fmt.Errorf("每章目标字数和计划总章数不能为负数")
	}
	// 根文档由浏览器读写，数量必须能被 JavaScript Number 精确表示。
	const maxSafeInteger = 1<<53 - 1
	if preferences.ChapterWords > maxSafeInteger || preferences.PlannedChapters > maxSafeInteger {
		return fmt.Errorf("每章目标字数和计划总章数超过可精确保存的整数范围")
	}
	return nil
}

func (preferences WritingPreferences) constraints() []string {
	constraints := []string{"明确的 preferences 是作品级写作要求，空字符串和 0 表示沿用用户原始需求；本次 instruction 仅修改当前任务范围，不改变已保存偏好。偏好不是输出字段。"}
	if genre := strings.TrimSpace(preferences.Genre); genre != "" {
		constraints = append(constraints, "题材为“"+genre+"”，根据该题材和故事本身决定冲突、节奏及收束；不要强制每章反转、悬念或超自然设定。")
	}
	if constraint := writingStyleConstraints[preferences.Style]; constraint != "" {
		constraints = append(constraints, constraint)
	}
	if instruction := strings.TrimSpace(preferences.StyleInstructions); instruction != "" {
		constraints = append(constraints, "具体文风要求（与预设冲突时以此为准）："+instruction)
	}
	if constraint := writingPOVConstraints[preferences.POV]; constraint != "" {
		constraints = append(constraints, constraint)
	}
	switch preferences.Mode {
	case "complete":
		constraints = append(constraints, "完整故事：围绕核心冲突形成完整叙事弧线，安排与篇幅相称的推进、高潮、结局和伏笔回收；分批规划只展开本批，不把本批结尾误作全书结局。")
	case "serial":
		constraints = append(constraints, "连载小说：规划稳定的长线目标、当前阶段目标和近期推进；未要求终局时不强锁全书结局、不在首批章节提前收束全书，保留可延展但有因果的后续方向。")
	}
	if preferences.ChapterWords > 0 {
		constraints = append(constraints, fmt.Sprintf("仅正文 body 以每章约 %d 字为软目标，按情节自然完整收段，不凑字或截断；大纲、章纲及选区修改不照此扩写。", preferences.ChapterWords))
	}
	if preferences.PlannedChapters > 0 {
		constraints = append(constraints, fmt.Sprintf("全书计划约 %d 章，作为整体节奏目标；与本次 count 和目标章节范围分开，单次仍严格遵守任务批次上限，不因计划总数扩大本次输出。", preferences.PlannedChapters))
	}
	return constraints
}

func mergeWritingGeneratedPreferences(saved, generated WritingPreferences) WritingPreferences {
	target, source := reflect.ValueOf(&saved).Elem(), reflect.ValueOf(generated)
	for i := 0; i < target.NumField(); i++ {
		if target.Field(i).IsZero() {
			target.Field(i).Set(source.Field(i))
		}
	}
	return saved
}
