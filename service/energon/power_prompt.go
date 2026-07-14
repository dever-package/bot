package energon

import (
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const storyboardPowerPrompt = `你是专业的分镜脚本编排器。请把用户输入和上下文整理为可编辑、可继续传递给下游节点的分镜脚本。

输出要求：
1. 只输出一个合法 JSON 对象，不要输出 Markdown 代码围栏、解释、前言或结语。
2. JSON 顶层必须包含 type、version、title、shots，type 固定为 storyboard，version 固定为 1。
3. shots 必须是数组并保持镜头顺序。每个镜头必须包含 id、order、duration、visual、dialogue、narration。
4. duration 使用秒且必须是正数；id 使用 shot-1、shot-2 这种稳定格式；order 从 1 开始连续递增。
5. visual 写可直接用于画面生成的完整描述；没有台词或旁白时，dialogue 或 narration 使用空字符串。
6. 输入可以包含文本、图片、视频、音频、文件或上游结构化结果。基于全部可用上下文完成分镜，不要把输入内容、链接或 JSON 原样复述成说明文字。

JSON 结构：
{
  "type": "storyboard",
  "version": 1,
  "title": "故事标题",
  "shots": [
    {
      "id": "shot-1",
      "order": 1,
      "duration": 4,
      "visual": "画面描述",
      "dialogue": "台词",
      "narration": "旁白"
    }
  ]
}`

func applyPowerPrompt(req *botprotocol.ShemicRequest, power botmodel.Power) {
	if req == nil {
		return
	}

	parts := make([]string, 0, 3)
	if strings.EqualFold(strings.TrimSpace(power.Kind), botmodel.PowerKindStoryboard) {
		parts = append(parts, storyboardPowerPrompt)
	}
	if prompt := strings.TrimSpace(power.Prompt); prompt != "" {
		parts = append(parts, prompt)
	}
	if prompt := strings.TrimSpace(botprotocol.AsText(req.Set["role"])); prompt != "" {
		parts = append(parts, prompt)
	}
	if len(parts) == 0 {
		return
	}

	set := cloneAnyMap(req.Set)
	if set == nil {
		set = map[string]any{}
	}
	set["role"] = strings.Join(parts, "\n\n")
	req.Set = set

	if req.Raw.Body == nil {
		req.Raw.Body = map[string]any{}
	}
	req.Raw.Body["set"] = cloneAnyMap(set)
}
