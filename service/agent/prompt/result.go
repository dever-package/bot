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
		"- 最终回答不要把完整正文直接塞进聊天气泡；后端会把 final_result 展示成“内容已生成，点击查看结果”的卡片，并在右侧结果抽屉展示正文。",
		"- 当正文已经确定，但图片、视频、音频、文件等能力产物还需要生成时，先输出 final_result.content.rich 或 content.text 作为正文草稿，并在 tasks 中列出要调用的能力。",
		"- 当用户基于上一轮最终结果选择建议、追问修改、重新生成封面/插图/视频/音频等素材时，必须输出新的 final_result；保留未修改的正文，在被修改素材的位置继续放占位节点，并在 tasks 中列出新的能力调用。",
		"- tasks 只用于可由内部能力 Energon 完成的后续产物；技能工具、HTTP、curl、脚本仍然用 agent-action call_tool 先执行，不能放入 tasks。",
		"- 独立素材任务默认 execution=async；后端最多并发执行 " + fmt.Sprintf("%d", asyncMax) + " 个任务。只有后一个任务依赖前一个任务输出时才写 execution=sync。",
		"- 每个 task 必须包含 id、title、type=call_power、power 和 input；如果 rich 中预留了占位节点，task.placeholder_id 必须等于占位节点 attrs.placeholder_id。",
		"- rich 中可用占位节点: {\"type\":\"agentAbilityPlaceholder\",\"attrs\":{\"placeholder_id\":\"cover\",\"kind\":\"image\",\"title\":\"封面图\"}}。占位节点应放在对应段落位置。",
		"- 同步任务会共用整体进度；异步任务会显示每个占位自己的进度。不要为了显示进度而写虚假的百分比。",
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
