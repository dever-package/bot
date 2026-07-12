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
	return []Tool{
		listSkillFilesTool(loaded),
		readSkillFileTool(loaded),
		writeTempFileTool(loaded, runtime),
		readTempFileTool(loaded, runtime),
		runSkillScriptTool(loaded, runtime),
		httpRequestTool(loaded),
		curlRequestTool(loaded),
		mcpCallTool(loaded, runtime),
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
		"description": "已通过 load_skill 加载的技能 key；本轮只加载一个技能时可省略",
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
