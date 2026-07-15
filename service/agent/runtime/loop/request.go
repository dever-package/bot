package loop

import (
	"strconv"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
)

const toolCommunicationRules = `工具调用沟通规则：
- 调用图片、视频、音频、文件或工作流等耗时生成能力前，先使用用户当前语言输出一到两句简短、自然且具体的说明，概括将生成的内容和关键方向；随后在同一轮立即调用工具。
- 首次读取或检索知识库前，先使用用户当前语言输出一句与当前任务相关的自然说明，说清将核对哪类资料及用途；随后在同一轮立即调用工具。同一任务中连续读取多份知识库资料时，不要在每次调用前重复说明。
- 说明必须作为面向用户的正文先于工具调用输出，并以完整句子结束；不要暴露函数名、参数或内部推理，也不要只说“正在处理”。
- 技能加载等其他快速内部工具无需播报。
- 工具完成后直接结合结果继续回答，不要重复前置说明。`

func buildGatewayBody(agent agentmodel.Agent, power energonmodel.Power, prompt string, input map[string]any, history []any, tools []any, toolChoice string) map[string]any {
	options := map[string]any{
		"stream":      true,
		"temperature": normalizeTemperature(agent.Temperature),
	}
	if len(tools) > 0 {
		toolChoice = strings.TrimSpace(toolChoice)
		if toolChoice == "" {
			toolChoice = "auto"
		}
		options["tools"] = tools
		options["tool_choice"] = toolChoice
		options["parallel_tool_calls"] = false
	}
	return map[string]any{
		"power": power.Key,
		"set": map[string]any{
			"id":   strconv.FormatUint(agent.ID, 10),
			"role": modelRolePrompt(prompt, len(tools) > 0),
		},
		"input":   gatewayInput(input),
		"history": history,
		"options": options,
	}
}

func modelRolePrompt(prompt string, toolsEnabled bool) string {
	prompt = strings.TrimSpace(prompt)
	if !toolsEnabled {
		return prompt
	}
	if prompt == "" {
		return toolCommunicationRules
	}
	return prompt + "\n\n" + toolCommunicationRules
}

func gatewayInput(input map[string]any) map[string]any {
	if len(input) == 0 {
		return map[string]any{}
	}
	result := make(map[string]any, len(input))
	for key, value := range input {
		result[key] = value
	}
	return result
}

func normalizeTemperature(value float64) float64 {
	if value < 0 || value > 2 {
		return 0.7
	}
	return value
}
