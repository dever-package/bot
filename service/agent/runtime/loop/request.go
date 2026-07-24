package loop

import (
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	agentskill "github.com/dever-package/bot/service/agent/skill"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const runtimeCorePrompt = `运行规则：
- 遵守当前智能体设定和用户当前要求；设定已明确固定业务目标时，收到用户消息即按该目标处理，不要求用户重复描述目标或已经明确的信息。
- 收到 runtime_event.type=session_started 时，这是没有用户消息的新会话。只做简短自然的主动开场，或使用 ask_user / present_suggestions 给出开始当前智能体工作的首个选择；不得假装用户已经提出具体请求，不得直接交付业务结果，也不得读取知识、加载技能、生成文档或调用外部能力。
- 需要工具时按工具说明使用原生 Function Calling，并根据真实工具结果继续执行。
- 缺少完成任务所必需且无法合理推断的信息时调用 ask_user；提供可选下一步时调用 present_suggestions。禁止用正文提问或选项列表代替结构化交互工具。
- 收到 runtime_event.type=completion_required 时，只补足 missing 指出的交付；dependency=user_input 时使用 ask_user 收集真正阻塞任务的信息，follow_up=suggestions 时使用 present_suggestions 展示已完成任务的可选方向。未给出这些状态时保持自动工具选择，可以继续调用完成任务所需的普通能力。
- 开始一段工具操作时，先用一句简短、直接的用户语言说明目的，再立即发起 Function Calling；连续检索或读取知识库只说明一次，收到 runtime_event.type=tool_results_available 后若仍需知识工具，直接调用且不重复播报；相互独立且路径已知的知识文件应在同一响应中一并读取。转入 ask_user 等需要用户感知的新阶段时，再用一句话说明需要用户做什么。说明中不提工具名、文件名、参数或内部流程，不使用比喻、拟人、角色表演或情绪铺垫，不复述用户原话。
- 只有当前要求已完整交付，或已调用结构化终态工具时才可结束；不得以计划、预告、进度说明或未兑现的承诺结束本轮。`

const documentWriterCorePrompt = `文档子任务规则：
- 你正在执行父智能体发起的文档写作子任务，不直接与用户对话。
- runtime_event.content_requirements 是当前这轮唯一的正文任务简报，继承历史只提供更早的会话背景；聊天完成消息、后续建议或下一步均由父运行负责，不属于本子任务。
- 所有普通文本都会成为右侧文档正文，只能输出可以直接交付的完整正文；不要输出计划、过程说明、自我评价、完成说明、后续邀约或可选优化方向。
- 标题由文档容器单独展示，正文开头不要重复输出同名 Markdown 标题。
- 需要图片、视频、音频或文件时，在正文对应位置调用已挂载的素材能力，素材提交后继续完成后续正文。
- 收到 runtime_event.type=completion_required 且 document_revision_mode=replace_current_step 时，只替换上一轮被拒绝的正文块；不要重复已经保存在更早正文块中的内容。
- 完成正文所需信息已经由父智能体提供；不得要求用户继续输入，不得输出聊天收尾。正文完整后自然结束。`

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
	parts := []string{
		strings.TrimSpace(prompt),
		strings.TrimSpace(runtimeCorePrompt),
		runtimeprovider.ComposeDocumentOutputRule,
	}
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		if part != "" {
			result = append(result, part)
		}
	}
	return strings.Join(result, "\n\n")
}

func modelRolePromptForExecution(execution execution) string {
	if !execution.documentWriter {
		return modelRolePrompt(execution.prompt)
	}
	parts := []string{strings.TrimSpace(execution.prompt), strings.TrimSpace(documentWriterCorePrompt)}
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
