package prompt

import (
	"fmt"
	"strings"
)

func resultPrompt(runtime ResultRuntime) string {
	asyncMax := runtime.AsyncMaxConcurrency
	if asyncMax <= 0 {
		asyncMax = 10
	}
	return strings.Join([]string{
		"最终结果与异步素材协议:",
		"- 普通问候、闲聊、简单问答、解释、澄清和不形成交付物的短回复：直接自然语言回答，禁止输出 agent-result。",
		"- 只有明确作品、交付物、结构化内容、媒体内容、可编辑长文或异步素材任务，才输出 agent-result。",
		"- agent-result.kind 固定为 final_result；不要手写后端展示卡片、抽屉、按钮或“点击查看结果”等 UI 文案。",
		"- 纯文本交付物用 content.format=markdown 和 content.text。",
		"- 可编辑长文、图文混排、媒体插入或异步素材任务用 content.format=rich_json 和 content.rich。",
		"- content.rich 必须是 Tiptap doc JSON；节点顺序就是最终展示和后续编辑顺序。",
		"- 需要图片、视频、音频、文件等后续产物时，在 rich 中放占位节点，并在 tasks 中列出能力任务。",
		"- 用户基于上一轮结果继续修改或重新生成素材时，输出新的 final_result；保留未修改内容，只替换相关占位和任务。",
		"- tasks 只用于 Energon 能力；技能工具、HTTP、curl、脚本必须先用 agent-action call_tool。",
		"- task.type 固定 call_power，必须包含 id、title、power、input；有占位节点时 placeholder_id 必须一致。",
		"- 独立素材任务默认 execution=async；后端最多并发执行 " + fmt.Sprintf("%d", asyncMax) + " 个任务。依赖前序输出时才用 sync。",
		"- rich 占位节点格式：{\"type\":\"agentAbilityPlaceholder\",\"attrs\":{\"placeholder_id\":\"cover\",\"kind\":\"image\",\"title\":\"封面图\"}}。",
		"- 不要编造进度、URL、文件或能力结果。",
		"",
		"带异步素材的 agent-result 示例:",
		"```agent-result",
		"{",
		`  "kind": "final_result",`,
		`  "content": {`,
		`    "format": "rich_json",`,
		`    "rich": {`,
		`      "type": "doc",`,
		`      "content": [`,
		`        {"type": "heading", "attrs": {"level": 2}, "content": [{"type": "text", "text": "标题"}]},`,
		`        {"type": "paragraph", "content": [{"type": "text", "text": "正文段落。"}]},`,
		`        {"type": "agentAbilityPlaceholder", "attrs": {"placeholder_id": "cover", "kind": "image", "title": "封面图"}}`,
		`      ]`,
		`    }`,
		`  },`,
		`  "tasks": [`,
		`    {`,
		`      "id": "cover",`,
		`      "placeholder_id": "cover",`,
		`      "title": "封面图",`,
		`      "kind": "image",`,
		`      "execution": "async",`,
		`      "type": "call_power",`,
		`      "power": "能力 key",`,
		`      "input": {"prompt": "生成封面图的完整提示词"}`,
		`    }`,
		`  ],`,
		`  "suggestions": [`,
		`    {"label": "修改第一段", "prompt": "把第一段改得更口语化"}`,
		`  ]`,
		"}",
		"```",
	}, "\n")
}
