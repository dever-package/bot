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
		"- 普通短回复直接自然语言回答；只有明确交付物才输出 agent-result，kind 固定 final_result。",
		"- 纯文本用 content.format=markdown 和 content.text；可编辑长文、图文混排、媒体插入、异步素材任务用 content.format=rich_json 和 content.rich。",
		"- content.rich 是 Tiptap doc JSON；需要异步素材时，在 rich 中放占位节点，并在 tasks 中列出能力任务。",
		"- 图文/媒体类交付：正文结构、素材位置和提示词确定后立即输出 agent-result，不等待素材生成，也不要先用 agent-action call_power 预生成素材。",
		"- 基于上一版 final_result 修改时，保留未改内容，只替换目标占位和 tasks；目标不清楚则先用 agent-interaction 收集。",
		"- tasks 只用于最终交付物里的 Energon 素材任务；中间观察才用 agent-action call_power；技能、HTTP、curl、脚本走 call_tool。",
		"- task.type 固定 call_power，必须包含 id、title、power、input；有占位节点时 placeholder_id 必须一致，title 要可读。",
		"- 独立素材任务默认 execution=async；后端最多并发执行 " + fmt.Sprintf("%d", asyncMax) + " 个任务。依赖前序输出时才用 sync。",
		"- rich 占位节点格式：{\"type\":\"agentAbilityPlaceholder\",\"attrs\":{\"placeholder_id\":\"cover\",\"kind\":\"image\",\"title\":\"封面图\"}}。",
		"- 不要编造进度、URL、文件、能力结果或前端 UI 文案。",
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
