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
		"- content.rich 必须是 Tiptap doc JSON；节点顺序就是最终展示和编辑顺序。媒体插入位置写进 rich，占位节点再由 tasks 绑定能力任务。",
		"- 图文/媒体交付：正文结构、素材位置和提示词确定后立即输出 agent-result，不等待素材生成，也不要先用 agent-action call_power 预生成素材。",
		"- 基于上一版 final_result 修改时，只改用户指定部分；保留未改正文、占位和素材任务。目标不清楚先用 agent-interaction 收集。",
		"- tasks 只用于最终交付物内的 Energon 素材任务；中间观察用 agent-action call_power；技能、HTTP、curl、脚本走 call_tool。",
		"- task.type 固定 call_power，必须含 id、title、power、input；有占位节点时 placeholder_id 必须一致。独立素材默认 execution=async，后端最多并发 " + fmt.Sprintf("%d", asyncMax) + " 个；有依赖才用 sync。",
		"- rich 占位节点格式：{\"type\":\"agentAbilityPlaceholder\",\"attrs\":{\"placeholder_id\":\"cover\",\"kind\":\"image\",\"title\":\"封面图\"}}。",
		"- suggestions 放 2 到 5 个贴合当前结果的下一步动作。不要编造进度、URL、文件、能力结果或前端 UI 文案。",
		"",
		"最小 agent-result 示例:",
		"```agent-result",
		"{",
		`  "kind": "final_result",`,
		`  "content": {"format": "rich_json", "rich": {"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "正文"}]}, {"type": "agentAbilityPlaceholder", "attrs": {"placeholder_id": "cover", "kind": "image", "title": "封面图"}}]}},`,
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
		`  "suggestions": [{"label": "修改第一段", "prompt": "把第一段改得更口语化"}]`,
		"}",
		"```",
	}, "\n")
}
