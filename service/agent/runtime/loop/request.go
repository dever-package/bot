package loop

import (
	"strconv"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
)

const runtimeAgentRules = `运行协议（只约束运行方式，不定义业务流程）：
- 当前智能体设定是业务阶段、知识读取、参数确认和输出结构的唯一依据。通用运行协议不得覆盖、改写或跳过智能体设定。
- 阶段名、状态名和业务字段只能按智能体设定中的条件产生；运行时不得另行创建或预设“已确认参数”等业务状态。
- 工具只通过原生 Function Calling 调用，禁止在正文中输出或伪造工具 JSON。
- 智能体设定要求读取知识库时，必须先调用已挂载的知识库工具取得依据，不得仅凭通用知识跳过读取。
- 给出最终回答前，由当前主模型静默检查用户任务和智能体设定。仍有可自主完成的正文或工具步骤时直接继续；普通任务完整交付后在同一次最终正文末尾调用 finish_response，图文、交互和建议分别使用各自终态工具。禁止要求用户回复“继续”来恢复本可自主完成的流程。
- 继续任务缺少无法安全推断的必要输入、选择、确认或素材时，ask_user 是唯一等待用户输入的方式；具体字段协议以工具定义为准。
- interaction_response 是上一份表单的回答，直接继续原任务，不重复询问。
- present_suggestions 只用于完整交付后的可选操作，不得推进当前任务；没有自然后续时使用 finish_response。
- 最终回答使用 Markdown；标题独占一行并保留必要空行。`

const toolCommunicationRules = `工具沟通规则：
- 完整图文任务直接调用 start_document，不要在调用前输出开场说明、计划或承诺。进入图文模式后，第一段可见文本就是可复制发布的正式正文；素材调用前只输出紧邻该素材的正文，不得展示进度、操作步骤或素材提示词。
- 非图文模式下，调用图片、视频、音频、文件或工作流等耗时生成能力前，先使用用户当前语言输出一到两句简短、自然且具体的说明，概括将生成的内容和关键方向；随后在同一轮立即调用工具。
- 首次读取或检索知识库前，先使用用户当前语言输出一句与当前任务相关的自然说明，说清将核对哪类资料及用途；随后在同一轮立即调用工具。同一任务中连续读取多份知识库资料时，不要在每次调用前重复说明。
- 说明必须作为面向用户的正文先于工具调用输出，并以完整句子结束；不要暴露函数名、参数或内部推理，也不要只说“正在处理”。
- 技能加载等其他快速内部工具无需播报。
- 工具完成后直接结合结果继续回答，不要重复前置说明。`

const documentToolCommunicationRules = `图文模式输出规则：
- 当前已经进入图文模式，普通素材工具的前置说明规则不再适用。
- 每轮可见文本只能是最终成品中尚未发布的一段正式正文；正文后需要一个或多个连续素材位置时，可在同一轮按最终顺序调用对应工具。
- “先补上正文”“继续补充正文”“下面补一段”“接着生成配图”等句子属于操作说明，不是成品正文，禁止输出。
- 不得用一句话声明将要写正文来代替正文，也不得在正文中说明图片、素材、提示词、生成动作或执行进度。
- 没有新的成品正文需要输出时，直接调用下一步工具；正文与素材都已提交时直接调用 finish_document。`

func buildGatewayBody(agent agentmodel.Agent, power energonmodel.Power, role string, input map[string]any, history []any, tools []any, toolChoice any, parallelToolCalls bool) map[string]any {
	options := map[string]any{
		"stream":      true,
		"temperature": normalizeTemperature(agent.Temperature),
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
			"id":   strconv.FormatUint(agent.ID, 10),
			"role": strings.TrimSpace(role),
		},
		"input":   gatewayInput(input),
		"history": history,
		"options": options,
	}
}

func modelRolePrompt(prompt string, toolsEnabled bool, documentMode bool) string {
	// 智能体设定定义业务，末尾的运行协议约束模型如何执行和结束。
	parts := []string{strings.TrimSpace(prompt), strings.TrimSpace(runtimeAgentRules)}
	if toolsEnabled {
		communicationRules := toolCommunicationRules
		if documentMode {
			communicationRules = documentToolCommunicationRules
		}
		parts = append(parts, strings.TrimSpace(communicationRules))
	}
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
	return result
}

func normalizeTemperature(value float64) float64 {
	if value < 0 || value > 2 {
		return 0.7
	}
	return value
}
