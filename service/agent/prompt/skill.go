package prompt

import (
	"strings"

	agentskill "my/package/bot/service/agent/skill"
)

func skillPrompt(catalog agentskill.Catalog, tools ToolRuntime) string {
	sections := make([]string, 0, 3)
	sections = appendNonEmpty(sections, catalog.Metadata)
	sections = appendNonEmpty(sections, catalog.LoadedContent)
	sections = appendNonEmpty(sections, skillToolPrompt(catalog, tools))
	return strings.Join(sections, "\n\n")
}

func skillToolPrompt(catalog agentskill.Catalog, tools ToolRuntime) string {
	if len(catalog.Loaded) == 0 {
		return ""
	}
	keys := make([]string, 0, len(catalog.Loaded))
	for _, entry := range catalog.Loaded {
		if strings.TrimSpace(entry.Key) != "" {
			keys = append(keys, entry.Key)
		}
	}
	if len(keys) == 0 {
		return ""
	}
	capabilityTarget := "API、curl 和附属文件"
	if tools.RunSkillScriptEnabled {
		capabilityTarget = "API、curl、附属文件和 scripts/ 脚本"
	}
	toolNames := []string{
		"http_request",
		"curl_request",
		"list_skill_files",
		"read_skill_file",
		"write_temp_file",
		"read_temp_file",
	}
	if tools.RunSkillScriptEnabled {
		toolNames = append(toolNames, "run_skill_script")
	}
	toolNames = append(toolNames, "internal_api", "mcp_call")
	scriptRule := "- 当前运行配置已禁用 run_skill_script；不要调用脚本工具。"
	if tools.RunSkillScriptEnabled {
		scriptRule = "- run_skill_script 当前使用 " + strings.TrimSpace(tools.ScriptSandboxDriver) + " 模式执行，只能执行当前技能 scripts/ 下的脚本，禁止传 command 字符串。"
		if strings.TrimSpace(tools.ScriptNetworkMode) == "none" {
			scriptRule += " 脚本默认断网；需要访问外部 API 时优先调用 http_request 或 curl_request。"
		}
	}
	return strings.Join([]string{
		"技能工具执行协议:",
		"- 可用工具: " + strings.Join(toolNames, ", ") + "。",
		"- 已加载技能可以通过平台通用工具执行其说明中的 " + capabilityTarget + "；不要要求用户自己执行 curl 或命令。",
		"- 如果技能正文出现 curl 示例，把它转换为 call_tool 的 http_request 或 curl_request；后端不会执行系统 curl 命令。",
		"- read_skill_file/list_skill_files 只能访问当前技能安装目录。",
		scriptRule,
		"- write_temp_file/read_temp_file 只读写本轮临时目录；internal_api 只用于平台白名单内部接口；mcp_call 只有接入 MCP 后可用。",
		"- 工具调用结果会作为 tool_observation 回到下一轮；收到结果后继续判断原始目标，完成后再输出 agent-result。",
		"- 本轮已加载技能 key: " + strings.Join(keys, ", "),
		"",
		"agent-action call_tool 示例:",
		"```agent-action",
		"{",
		`  "type": "call_tool",`,
		`  "tool": "http_request",`,
		`  "skill": "` + keys[0] + `",`,
		`  "input": {`,
		`    "method": "GET",`,
		`    "url": "https://example.com/api",`,
		`    "query": {}`,
		"  }",
		"}",
		"```",
	}, "\n")
}
