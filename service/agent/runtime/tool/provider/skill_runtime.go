package provider

import (
	"fmt"
	"strings"

	agentskill "github.com/dever-package/bot/service/agent/skill"
)

const (
	maxSkillFileBytes = 256 * 1024
	maxTempFileBytes  = 256 * 1024
	maxSkillFiles     = 200
	maxSkillListDepth = 4
	maxScriptArgs     = 32
	maxScriptArgRunes = 512
)

func runtimeSkillTools(loaded map[string]agentskill.Entry, runtime SkillRuntime) []Tool {
	return skillActivityTools([]Tool{
		listSkillFilesTool(loaded),
		readSkillFileTool(loaded),
		writeTempFileTool(loaded, runtime),
		readTempFileTool(loaded, runtime),
		runSkillScriptTool(loaded, runtime),
		httpRequestTool(loaded),
		curlRequestTool(loaded),
		mcpCallTool(loaded, runtime),
	})
}

func skillActivityTools(tools []Tool) []Tool {
	for index := range tools {
		tools[index] = skillActivityTool(tools[index])
	}
	return tools
}

func skillActivityTool(tool Tool) Tool {
	tool.Definition.Kind = "skill"
	if skillToolHasExternalSideEffect(tool.Definition.Name) {
		tool.Definition.Execution.PreventDuplicateRecovery = true
	}
	if strings.TrimSpace(tool.Definition.Title) == "" {
		tool.Definition.Title = skillActivityTitle(tool.Definition.Name)
	}
	return tool
}

func skillToolHasExternalSideEffect(name string) bool {
	switch strings.ToLower(strings.TrimSpace(name)) {
	case "run_skill_script", "http_request", "curl_request", "mcp_call":
		return true
	default:
		return false
	}
}

func skillActivityTitle(name string) string {
	switch strings.ToLower(strings.TrimSpace(name)) {
	case "load_skill":
		return "技能加载"
	case "list_skill_files":
		return "技能目录读取"
	case "read_skill_file", "read_temp_file":
		return "技能文件读取"
	case "write_temp_file":
		return "技能文件准备"
	case "run_skill_script":
		return "技能执行"
	case "http_request", "curl_request":
		return "技能请求"
	case "mcp_call":
		return "技能工具调用"
	default:
		return "技能调用"
	}
}

func loadedSkill(loaded map[string]agentskill.Entry, arguments map[string]any) (agentskill.Entry, error) {
	identity := agentskill.NormalizeKey(argumentText(arguments, "skill"))
	if identity == "" && len(loaded) == 1 {
		for _, entry := range loaded {
			return entry, nil
		}
	}
	if identity == "" {
		return agentskill.Entry{}, fmt.Errorf("工具调用需要指定已加载技能 skill")
	}
	for _, entry := range loaded {
		if agentskill.NormalizeKey(entry.Key) == identity || agentskill.NormalizeKey(entry.Name) == identity {
			return entry, nil
		}
	}
	return agentskill.Entry{}, fmt.Errorf("技能未在本轮加载: %s", identity)
}

func skillProperty() map[string]any {
	return map[string]any{
		"type":        "string",
		"description": "已加载的技能；只有一个时可省略",
	}
}

func objectParameters(properties map[string]any, required ...string) map[string]any {
	result := map[string]any{
		"type":                 "object",
		"properties":           properties,
		"additionalProperties": false,
	}
	if len(required) > 0 {
		items := make([]any, 0, len(required))
		for _, key := range required {
			items = append(items, key)
		}
		result["required"] = items
	}
	return result
}

func argumentMap(arguments map[string]any, keys ...string) map[string]any {
	for _, key := range keys {
		if value, ok := arguments[key].(map[string]any); ok {
			return value
		}
	}
	return map[string]any{}
}

func argumentValue(arguments map[string]any, keys ...string) any {
	for _, key := range keys {
		if value, exists := arguments[key]; exists {
			return value
		}
	}
	return nil
}

func resultText(content map[string]any, fallback string) string {
	for _, key := range []string{"text", "summary", "body", "content"} {
		if text := strings.TrimSpace(fmt.Sprint(content[key])); text != "" && text != "<nil>" {
			return truncateRunes(text, 1000)
		}
	}
	return fallback
}

func truncateRunes(value string, limit int) string {
	value = strings.TrimSpace(value)
	if limit <= 0 {
		return value
	}
	runes := []rune(value)
	if len(runes) <= limit {
		return value
	}
	return strings.TrimSpace(string(runes[:limit])) + "..."
}
