package energon

import (
	"fmt"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
)

var storyboardProfiles = map[string]string{
	botmodel.StoryboardWorkTypeShort: "可以由事件、观察、氛围或概念驱动，不强制设置主角目标、对抗性阻碍、角色成长或对白。在目标时长内只聚焦一个核心内容，完成清晰的建立、变化和落点，不扩展多条人物线。",
	botmodel.StoryboardWorkTypeMV:    "以主音轨的音乐气质、表演和视觉节奏组织镜头；主音轨提供歌词时再使用歌词段落与意象。允许蒙太奇与非因果画面连接；用户未要求时不增加旁白、对白或字幕。",
	botmodel.StoryboardWorkTypeAd:    "围绕商品或服务、目标受众、核心卖点、使用场景和行动目标组织镜头。不得编造价格、优惠、参数、效果、资质或法律承诺。",
	botmodel.StoryboardWorkTypeNarrative: `必须以人物行动驱动：
1. 先确定一个明确主角、主角在开场即可理解的具体目标，以及阻止目标达成的具体人物、环境或条件。
2. storyline.setup 必须建立主角的初始处境与目标；development 必须表现阻碍、主角针对阻碍采取的行动及其后果；payoff 必须呈现目标达成、失败或主角主动改变后的可见结果。
3. 每个镜头的 beat 必须推进目标、改变阻碍或呈现行动后果；不承担其中任何作用的镜头必须删除或合并。
4. 除非用户明确要求，不得用纯氛围蒙太奇、旁白说明或无因果跳切代替剧情推进；连续镜头必须保持人物、场景、道具和动作状态一致。`,
}

func storyboardOutputPromptForInput(input map[string]any) (string, error) {
	workType, err := botmodel.NormalizeStoryboardWorkType(
		storyboardProfileInputText(input["storyboard_work_type"]),
	)
	if err != nil {
		return "", err
	}
	profile := strings.TrimSpace(storyboardProfiles[workType])
	if profile == "" {
		return "", fmt.Errorf("作品类型缺少创作规则")
	}
	workTypeSpec, _ := botmodel.FindStoryboardWorkTypeSpec(workType)
	return strings.Join([]string{
		storyboardOutputPrompt,
		"当前作品类型：" + workTypeSpec.Name + "（" + workType + "）。",
		"当前类型创作规则：" + profile,
		"作品类型由系统确定；不要自行改成其他类型，也不要新增输出字段。",
	}, "\n\n"), nil
}

func storyboardProfileInputText(value any) string {
	if value == nil {
		return ""
	}
	return strings.TrimSpace(fmt.Sprint(value))
}
