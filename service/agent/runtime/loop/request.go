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
- 使用工具时，先向用户输出简短、自然的可见反馈。
- 只有当前要求已完整交付，或已调用结构化终态工具时才可结束；不得以计划、预告、进度说明或未兑现的承诺结束本轮。`

func buildGatewayBody(agent agentmodel.Agent, power energonmodel.Power, role string, input map[string]any, history []any, tools []any, toolChoice any, parallelToolCalls bool) map[string]any {
	options := map[string]any{
		"stream":      true,
		"temperature": normalizeTemperature(agent.Temperature),
	}
	if tokens := normalizedMaxOutputTokens(agent.MaxOutputTokens); tokens > 0 {
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

func normalizedMaxOutputTokens(value int) int {
	if value <= 0 {
		return 0
	}
	if value > agentmodel.MaxAgentOutputTokens {
		return agentmodel.MaxAgentOutputTokens
	}
	return value
}
