package provider

import (
	"context"
	"fmt"
	"path/filepath"
	"sort"
	"strings"

	"github.com/shemic/dever/load"
	"github.com/shemic/dever/server"

	"github.com/dever-package/bot/service/agent/runtime/tool/sandbox"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

const (
	skillDescriptionRunes           = 96
	skillTriggerItems               = 3
	skillTriggerRunes               = 24
	SkillRestoreContentHashArgument = "_restore_content_hash"
)

type SkillRuntime struct {
	TempRoot string
	Sandbox  sandbox.Config
}

func SkillTools(entries []agentskill.Entry, limits agentskill.Limits, serverContext *server.Context, runtime SkillRuntime) []Tool {
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
	metadataEntries := agentskill.MetadataEntries(entries, limits)
	loaded := map[string]agentskill.Entry{}
	budget := newSkillContentBudget(limits.LoadedContentMaxRunes)
	return []Tool{
		searchSkillsTool(entries, limits),
		loadSkillTool(byKey, loaded, limits, budget, serverContext, runtime, skillToolDescription(metadataEntries, len(byKey))),
	}
}

func searchSkillsTool(entries []agentskill.Entry, limits agentskill.Limits) Tool {
	return skillActivityTool(Tool{
		Definition: Definition{
			Name:        "search_skills",
			Description: "按名称、标识、描述或触发场景搜索当前智能体已挂载的技能。",
			Parameters: objectParameters(map[string]any{
				"query": map[string]any{
					"type":        "string",
					"description": "技能名称、标识、用途或触发场景",
				},
				"limit": map[string]any{
					"type": "integer", "minimum": 1, "maximum": 20,
					"description": "返回数量，默认 10",
				},
			}, "query"),
		},
		Handle: func(_ context.Context, call Call) (Result, error) {
			query := strings.ToLower(strings.TrimSpace(argumentText(call.Arguments, "query")))
			if query == "" {
				return Result{}, fmt.Errorf("技能搜索内容不能为空")
			}
			limit := ArgumentInt(call.Arguments, "limit", 10)
			if limit < 1 || limit > 20 {
				limit = 10
			}
			matches := matchingSkillEntries(entries, query)
			if len(matches) > limit {
				matches = matches[:limit]
			}
			result := make([]map[string]any, 0, len(matches))
			for _, entry := range matches {
				result = append(result, compactSkillMetadata(entry, limits.MetadataFieldMaxRunes))
			}
			return Result{
				Text: fmt.Sprintf("找到 %d 个匹配技能", len(result)),
				Content: map[string]any{
					"query": query, "skills": result, "count": len(result),
				},
			}, nil
		},
	})
}

type skillSearchMatch struct {
	entry agentskill.Entry
	score int
}

func matchingSkillEntries(entries []agentskill.Entry, query string) []agentskill.Entry {
	matches := make([]skillSearchMatch, 0)
	for _, entry := range entries {
		key := strings.ToLower(strings.TrimSpace(entry.Key))
		name := strings.ToLower(strings.TrimSpace(entry.Name))
		description := strings.ToLower(strings.TrimSpace(entry.Description))
		score := -1
		switch {
		case key == query:
			score = 0
		case name == query:
			score = 1
		case strings.HasPrefix(key, query) || strings.HasPrefix(name, query):
			score = 2
		case strings.Contains(key, query) || strings.Contains(name, query):
			score = 3
		case strings.Contains(description, query) || skillListContains(entry.Triggers, query):
			score = 4
		}
		if score >= 0 {
			matches = append(matches, skillSearchMatch{entry: entry, score: score})
		}
	}
	sort.SliceStable(matches, func(i, j int) bool {
		if matches[i].score != matches[j].score {
			return matches[i].score < matches[j].score
		}
		return strings.TrimSpace(matches[i].entry.Key) < strings.TrimSpace(matches[j].entry.Key)
	})
	result := make([]agentskill.Entry, 0, len(matches))
	for _, match := range matches {
		result = append(result, match.entry)
	}
	return result
}

func skillListContains(values []string, query string) bool {
	for _, value := range values {
		if strings.Contains(strings.ToLower(value), query) {
			return true
		}
	}
	return false
}

func compactSkillMetadata(entry agentskill.Entry, maxRunes int) map[string]any {
	if maxRunes <= 0 {
		maxRunes = agentskill.DefaultLimits().MetadataFieldMaxRunes
	}
	return map[string]any{
		"key":         strings.TrimSpace(entry.Key),
		"name":        compactSkillText(entry.Name, maxRunes),
		"description": compactSkillText(entry.Description, maxRunes),
		"triggers":    compactSkillList(entry.Triggers, skillTriggerItems, maxRunes),
	}
}

func loadSkillTool(entries map[string]agentskill.Entry, loaded map[string]agentskill.Entry, limits agentskill.Limits, budget *skillContentBudget, serverContext *server.Context, runtime SkillRuntime, description string) Tool {
	return skillActivityTool(Tool{
		Definition: Definition{
			Name:        "load_skill",
			Description: description,
			Parameters: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"key": map[string]any{
						"type":        "string",
						"description": "元数据或 search_skills 返回的完整技能 key",
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
			restoreHash := strings.TrimSpace(argumentText(call.Arguments, SkillRestoreContentHashArgument))
			if restoreHash != "" && restoreHash == strings.TrimSpace(entry.ContentHash) {
				tools, definitions := activateLoadedSkill(entry, loaded, runtime, limits, budget, serverContext)
				return Result{
					Text: "已恢复技能: " + entry.Name,
					Content: map[string]any{
						"key": entry.Key, "name": entry.Name, "content_hash": entry.ContentHash,
						"entry_file": skillEntryFile(entry), "restored": true, "available_tools": definitions,
					},
					Tools: tools,
				}, nil
			}
			content, warnings, err := agentskill.ReadContent(entry, limits)
			if err != nil {
				return Result{}, err
			}
			if strings.TrimSpace(content) == "" {
				return Result{}, fmt.Errorf("技能 %s 没有可读取正文", key)
			}
			page, remaining, err := budget.paginate(content, 0, agentskill.DefaultContentPageRunes)
			if err != nil {
				return Result{}, err
			}
			tools, definitions := activateLoadedSkill(entry, loaded, runtime, limits, budget, serverContext)
			return Result{
				Text: "已加载技能: " + entry.Name,
				Content: map[string]any{
					"key":             entry.Key,
					"name":            entry.Name,
					"content_hash":    entry.ContentHash,
					"entry_file":      skillEntryFile(entry),
					"content":         page.Content,
					"offset":          page.Offset,
					"next_offset":     page.NextOffset,
					"total_runes":     page.TotalRunes,
					"eof":             page.EOF,
					"remaining_runes": remaining,
					"warnings":        warnings,
					"available_tools": definitions,
				},
				Tools: tools,
			}, nil
		},
	})
}

func activateLoadedSkill(entry agentskill.Entry, loaded map[string]agentskill.Entry, runtime SkillRuntime, limits agentskill.Limits, budget *skillContentBudget, serverContext *server.Context) ([]Tool, []map[string]any) {
	loaded[strings.TrimSpace(entry.Key)] = entry
	runtimeTools := runtimeSkillTools(loaded, runtime, limits, budget)
	builtinTools, definitions := builtinSkillTools(entry, serverContext)
	tools := append(runtimeTools, builtinTools...)
	for _, current := range runtimeTools {
		definitions = append(definitions, map[string]any{
			"name":        current.Definition.Name,
			"description": current.Definition.Description,
		})
	}
	return tools, definitions
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

func skillToolDescription(entries []agentskill.Entry, total int) string {
	lines := []string{
		"加载当前任务所需的技能说明。返回入口文件首段；eof=false 时按 next_offset 调用 read_skill_file 继续读取。部分技能：",
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
	if total > len(entries) {
		lines = append(lines, fmt.Sprintf("其余 %d 个已挂载技能可通过 search_skills 查找。", total-len(entries)))
	}
	return strings.Join(lines, "\n")
}

func skillEntryFile(entry agentskill.Entry) string {
	entryFile := strings.TrimSpace(entry.EntryFile)
	if entryFile == "" {
		return agentskill.EntryFile
	}
	entryFile = filepath.ToSlash(filepath.Clean(entryFile))
	if entryFile == "." {
		return agentskill.EntryFile
	}
	return entryFile
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
