package loop

import (
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	agentskill "github.com/dever-package/bot/service/agent/skill"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const runtimeCorePrompt = `运行规则：
- 遵守当前智能体设定和用户当前要求；不要重复询问已经明确的信息。
- 需要工具时按工具说明使用原生 Function Calling，并根据真实工具结果继续执行。
- 缺少完成任务所必需且无法合理推断的信息时调用 ask_user；提供可选下一步时调用 present_suggestions。禁止用正文提问或选项列表代替结构化交互工具。
- 开始一段工具操作时，先用一句简短、直接的用户语言说明目的，再立即发起 Function Calling；连续检索或读取知识库只说明一次，收到 runtime_event.type=tool_results_available 后若仍需知识工具，直接调用且不重复播报；相互独立且路径已知的知识文件应在同一响应中一并读取。转入 ask_user 等需要用户感知的新阶段时，再用一句话说明需要用户做什么。说明中不提工具名、文件名、参数或内部流程，不使用比喻、拟人、角色表演或情绪铺垫，不复述用户原话。
- 只有当前要求已完整交付，或已调用结构化终态工具时才可结束；不得以计划、预告、进度说明或未兑现的承诺结束本轮。`

func buildGatewayBody(agent agentmodel.Agent, power energonmodel.Power, sourceMaxOutputTokens int, role string, input map[string]any, history []any, tools []any, toolChoice any, parallelToolCalls bool) map[string]any {
	options := map[string]any{
		"stream":      true,
		"temperature": normalizeTemperature(agent.Temperature),
	}
	if tokens := explicitMaxOutputTokens(agent.MaxOutputTokens, sourceMaxOutputTokens); tokens > 0 {
		options["max_tokens"] = tokens
	}
	if len(tools) > 0 {
		if text, ok := toolChoice.(string); ok && strings.TrimSpace(text) == "" {
			toolChoice = "auto"
		}
		if toolChoice == nil {
			toolChoice = "auto"
		}
		options["tools"] = tools
		options["tool_choice"] = toolChoice
		options["parallel_tool_calls"] = parallelToolCalls
	}
	return map[string]any{
		"power": power.Key,
		"set": map[string]any{
			"role":                        strings.TrimSpace(role),
			botprotocol.SetPromptOwnerKey: botprotocol.PromptOwnerAgentRuntime,
		},
		"input":   gatewayInput(input),
		"history": history,
		"options": options,
	}
}

func modelRolePrompt(prompt string) string {
	parts := []string{strings.TrimSpace(prompt), strings.TrimSpace(runtimeCorePrompt)}
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		if part != "" {
			result = append(result, part)
		}
	}
	return strings.Join(result, "\n\n")
}

func gatewayInput(input map[string]any) map[string]any {
	if len(input) == 0 {
		return map[string]any{}
	}
	result := make(map[string]any, len(input))
	for key, value := range input {
		result[key] = value
	}
	prompt := agentskill.FirstText(result["prompt"], result["text"])
	delete(result, "text")
	if prompt != "" {
		result["prompt"] = prompt
	}
	return result
}

func normalizeTemperature(value float64) float64 {
	if value < 0 || value > 2 {
		return 0.7
	}
	return value
}

func explicitMaxOutputTokens(value int, sourceMaximum int) int {
	if value <= 0 {
		return 0
	}
	if sourceMaximum > 0 && value > sourceMaximum {
		return sourceMaximum
	}
	return value
}
