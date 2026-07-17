package provider

import (
	"context"
	"fmt"
	"sort"
	"strings"

	"github.com/shemic/dever/load"
	"github.com/shemic/dever/server"

	"github.com/dever-package/bot/service/agent/runtime/tool/sandbox"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

const (
	skillDescriptionRunes = 96
	skillTriggerItems     = 3
	skillTriggerRunes     = 24
)

type SkillRuntime struct {
	TempRoot string
	Sandbox  sandbox.Config
}

func SkillTools(entries []agentskill.Entry, limits agentskill.Limits, serverContext *server.Context, runtime SkillRuntime) []Tool {
	entries = agentskill.MetadataEntries(entries, limits)
	if len(entries) == 0 {
		return nil
	}
	byKey := make(map[string]agentskill.Entry, len(entries))
	for _, entry := range entries {
		key := strings.TrimSpace(entry.Key)
		if key != "" {
			byKey[key] = entry
		}
	}
	if len(byKey) == 0 {
		return nil
	}
	loaded := map[string]agentskill.Entry{}
	return []Tool{loadSkillTool(byKey, loaded, limits, serverContext, runtime, skillToolDescription(entries))}
}

func loadSkillTool(entries map[string]agentskill.Entry, loaded map[string]agentskill.Entry, limits agentskill.Limits, serverContext *server.Context, runtime SkillRuntime, description string) Tool {
	keys := make([]any, 0, len(entries))
	for key := range entries {
		keys = append(keys, key)
	}
	sort.Slice(keys, func(i, j int) bool {
		return fmt.Sprint(keys[i]) < fmt.Sprint(keys[j])
	})
	return skillActivityTool(Tool{
		Definition: Definition{
			Name:        "load_skill",
			Description: description,
			Execution:   ExecutionPolicy{ReuseSuccessfulArguments: true},
			Parameters: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"key": map[string]any{
						"type":        "string",
						"description": "要加载的技能 key",
						"enum":        keys,
					},
				},
				"required":             []any{"key"},
				"additionalProperties": false,
			},
		},
		Handle: func(_ context.Context, call Call) (Result, error) {
			key := argumentText(call.Arguments, "key")
			entry, exists := entries[key]
			if !exists {
				return Result{}, fmt.Errorf("技能 %s 未挂载到当前智能体", key)
			}
			contents, warnings := agentskill.LoadContents([]agentskill.Entry{entry}, limits)
			if len(contents) == 0 || strings.TrimSpace(contents[0].Content) == "" {
				return Result{}, fmt.Errorf("技能 %s 没有可读取正文", key)
			}
			content := contents[0].Content
			loaded[key] = entry
			runtimeTools := runtimeSkillTools(loaded, runtime)
			builtinTools, definitions := builtinSkillTools(entry, serverContext)
			tools := append(runtimeTools, builtinTools...)
			for _, current := range runtimeTools {
				definitions = append(definitions, map[string]any{
					"name":        current.Definition.Name,
					"description": current.Definition.Description,
				})
			}
			return Result{
				Text: "已加载技能: " + entry.Name,
				Content: map[string]any{
					"key":             entry.Key,
					"name":            entry.Name,
					"content":         content,
					"warnings":        warnings,
					"available_tools": definitions,
				},
				Tools: tools,
			}, nil
		},
	})
}

func builtinSkillTools(entry agentskill.Entry, serverContext *server.Context) ([]Tool, []map[string]any) {
	methods := agentskill.LoadedBuiltinMethods([]agentskill.Entry{entry})
	tools := make([]Tool, 0, len(methods))
	definitions := make([]map[string]any, 0, len(methods))
	for _, method := range methods {
		method := method
		name := FunctionName("skill_"+entry.Key+"_", method.Key)
		description := compactSkillText(method.Description, skillDescriptionRunes)
		if description == "" {
			description = "调用已加载技能方法“" + method.Key + "”。"
		}
		parameters := method.Parameters
		if len(parameters) == 0 {
			parameters = map[string]any{
				"type":                 "object",
				"properties":           map[string]any{},
				"additionalProperties": true,
			}
		}
		tools = append(tools, skillActivityTool(Tool{
			Definition: Definition{
				Name:        name,
				Description: description,
				Execution:   ExecutionPolicy{PreventDuplicateRecovery: true},
				Parameters:  parameters,
			},
			Handle: func(_ context.Context, call Call) (Result, error) {
				result, err := callBuiltinSkillMethod(serverContext, method, call.Arguments)
				if err != nil {
					return Result{}, err
				}
				return Result{Text: method.Key + " 调用完成", Content: result}, nil
			},
		}))
		definitions = append(definitions, map[string]any{
			"name":        name,
			"source_key":  method.Key,
			"description": description,
		})
	}
	return tools, definitions
}

func callBuiltinSkillMethod(serverContext *server.Context, method agentskill.BuiltinMethod, arguments map[string]any) (result any, err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("内置工具 %s 调用失败: %v", method.Key, recovered)
		}
	}()
	if serverContext != nil {
		return load.Service(method.Service, serverContext, []any{arguments}), nil
	}
	return load.Service(method.Service, []any{arguments}), nil
}

func skillToolDescription(entries []agentskill.Entry) string {
	lines := []string{
		"加载完成当前任务所需的技能说明。可用技能：",
	}
	for _, entry := range entries {
		line := "- " + strings.TrimSpace(entry.Key) + "：" + strings.TrimSpace(entry.Name)
		if description := strings.TrimSpace(entry.Description); description != "" {
			line += "，" + compactSkillText(description, skillDescriptionRunes)
		}
		if triggers := compactSkillList(entry.Triggers, skillTriggerItems, skillTriggerRunes); len(triggers) > 0 {
			line += "；适用：" + strings.Join(triggers, "、")
		}
		lines = append(lines, line)
	}
	return strings.Join(lines, "\n")
}

func compactSkillList(values []string, maxItems int, maxRunes int) []string {
	result := make([]string, 0, min(len(values), maxItems))
	for _, value := range values {
		value = compactSkillText(value, maxRunes)
		if value == "" {
			continue
		}
		result = append(result, value)
		if len(result) == maxItems {
			break
		}
	}
	return result
}

func compactSkillText(value string, maxRunes int) string {
	value = strings.Join(strings.Fields(value), " ")
	if maxRunes <= 0 {
		return ""
	}
	runes := []rune(value)
	if len(runes) <= maxRunes {
		return value
	}
	return strings.TrimSpace(string(runes[:maxRunes])) + "..."
}
