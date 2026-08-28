package energon

import botmodel "github.com/dever-package/bot/model/energon"

var storyboardProfiles = map[string]string{
	botmodel.StoryboardWorkTypeShort:     "短片可以由事件、观察、氛围或概念驱动，不强制设置人物目标、对抗性阻碍、人物成长或对白。30 秒以内聚焦一个核心内容，用具体的开场状态、变化和落点形成完整段落，不扩展无关人物线。镜头之间可以用时间、空间、视线、动作或声音建立关系，不要求每次切换都有剧情因果。",
	botmodel.StoryboardWorkTypeMV:        "MV 按主音轨组织画面：有歌词时遵循歌词顺序和段落内容，无歌词时跟随节奏、音色和段落变化。允许非因果蒙太奇，transition 写清声音、动作、色彩、构图或意象上的连接，不套剧情因果自检。除非歌词、用户要求或表演参考明确涉及演唱、演奏或舞蹈，不自动加入歌手、乐手、乐器、舞台或录音棚。MV 只使用主音轨，所有镜头的 speech 和 captions 必须使用空数组，不生成额外旁白、对白、配音或字幕。",
	botmodel.StoryboardWorkTypeAd:        "广告片围绕用户已经提供的商品或服务事实、使用场景、目标受众和行动目标组织镜头。卖点要通过使用动作、前后变化或真实信息呈现，不得编造价格、优惠、参数、功效、资质、销量、口碑或法律承诺。",
	botmodel.StoryboardWorkTypeNarrative: `剧情片由人物行动推进。先明确主角在开场可理解的目标，以及阻碍目标的具体人物、环境或条件。storyline 依次写初始处境与目标、主角针对阻碍采取的行动及其后果、最终可见结果。每个 beat 至少完成一件事：推进目标、改变阻碍、表现行动结果或改变人物关系；不强制圆满结局，也不自动添加人物成长或主题总结。`,
}
