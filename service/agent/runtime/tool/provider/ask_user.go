package provider

import (
	"context"
	"fmt"
	"strings"
)

const (
	maxAskUserFields  = 4
	maxAskUserOptions = 16
)

var askUserFieldTypes = map[string]struct{}{
	"option": {}, "multi_option": {}, "file": {}, "files": {},
}

func AskUserTool() Tool {
	return Tool{
		Definition: Definition{
			Name:        "ask_user",
			Title:       "等待用户输入",
			Kind:        "interaction",
			Description: "仅当用户已经提出明确任务，并且缺少无法安全推断的必要选择或素材时，才调用此工具显示逐题表单并结束当前运行。禁止在问候、闲聊和一般咨询中调用，也禁止用它询问用户想做什么。一次只询问 1-4 个必要信息。所有可确认信息都必须使用 option 或 multi_option，提供 2-16 个具体选项和推荐值；主题、名称、风格、用途、数量、比例等也要先给出合理候选，选择题界面会自动允许用户自定义补充。只有必须上传素材时使用 file 或 files。选项来自知识库时，应先读取原文并完整保留有效选项。不得生成自由输入框，不得加入可选字段，也不得改用正文提问后结束。",
			Parameters: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"fields": map[string]any{
						"type":        "array",
						"description": "需要用户确认的必要问题，最多 4 个，所有字段均为必填",
						"minItems":    1,
						"maxItems":    maxAskUserFields,
						"items": map[string]any{
							"type": "object",
							"properties": map[string]any{
								"key":   map[string]any{"type": "string", "description": "稳定的英文或下划线字段名"},
								"label": map[string]any{"type": "string", "description": "用户看到的字段名称"},
								"type": map[string]any{
									"type": "string",
									"enum": []any{"option", "multi_option", "file", "files"},
								},
								"options": map[string]any{
									"type":        "array",
									"description": "option 或 multi_option 的简短选项文本，最多 16 个",
									"minItems":    2,
									"maxItems":    maxAskUserOptions,
									"items":       map[string]any{"type": "string"},
								},
								"recommended": map[string]any{
									"type":        "array",
									"description": "可选。AI 推荐并默认选中的选项，必须来自 options；省略时默认第一项",
									"maxItems":    maxAskUserOptions,
									"items":       map[string]any{"type": "string"},
								},
							},
							"required":             []any{"key", "label", "type"},
							"additionalProperties": false,
						},
					},
				},
				"required":             []any{"fields"},
				"additionalProperties": false,
			},
		},
		Handle: executeAskUser,
	}
}

func executeAskUser(_ context.Context, call Call) (Result, error) {
	fields, err := normalizeAskUserFields(call.Arguments["fields"])
	if err != nil {
		return Result{}, err
	}
	interactionID := strings.TrimSpace(call.ID)
	if interactionID == "" {
		interactionID = strings.TrimSpace(call.RequestID)
	}
	interaction := map[string]any{
		"id":           "ask-user-" + interactionID,
		"type":         "form",
		"presentation": "stepper",
		"title":        "需求确认",
		"fields":       fields,
	}
	return Result{
		Text:        "需求确认",
		Content:     map[string]any{"presentation": "stepper", "fields": fields},
		Interaction: interaction,
		Terminal:    true,
	}, nil
}

func normalizeAskUserFields(value any) ([]map[string]any, error) {
	items, ok := value.([]any)
	if !ok || len(items) == 0 {
		return nil, fmt.Errorf("ask_user.fields 至少需要一个字段")
	}
	if len(items) > maxAskUserFields {
		return nil, fmt.Errorf("ask_user.fields 最多支持 %d 个字段", maxAskUserFields)
	}
	seen := make(map[string]struct{}, len(items))
	fields := make([]map[string]any, 0, len(items))
	for index, item := range items {
		field, ok := item.(map[string]any)
		if !ok {
			return nil, fmt.Errorf("ask_user.fields[%d] 格式无效", index)
		}
		key := argumentText(field, "key")
		label := argumentText(field, "label")
		fieldType := normalizeAskUserFieldType(argumentText(field, "type"))
		if key == "" || label == "" {
			return nil, fmt.Errorf("ask_user.fields[%d] 缺少 key 或 label", index)
		}
		if _, exists := seen[key]; exists {
			return nil, fmt.Errorf("ask_user.fields 中存在重复 key: %s", key)
		}
		if _, exists := askUserFieldTypes[fieldType]; !exists {
			return nil, fmt.Errorf("ask_user.fields[%d].type 不支持: %s", index, fieldType)
		}
		seen[key] = struct{}{}
		normalized := map[string]any{
			"key":      key,
			"name":     label,
			"type":     fieldType,
			"required": true,
			"sort":     index + 1,
		}
		if fieldType == "option" || fieldType == "multi_option" {
			options := normalizeAskUserOptions(field["options"])
			if len(options) < 2 {
				return nil, fmt.Errorf("ask_user.fields[%d].options 需要 2-%d 个选项", index, maxAskUserOptions)
			}
			normalized["options"] = options
			recommended := normalizeRecommendedOptions(field["recommended"], options, fieldType == "option")
			if len(recommended) == 0 {
				recommended = []string{argumentText(options[0], "value")}
			}
			normalized["recommended"] = recommended
		} else {
			normalized["recommended"] = []string{}
		}
		fields = append(fields, normalized)
	}
	return fields, nil
}

func normalizeAskUserFieldType(value string) string {
	return strings.ToLower(strings.TrimSpace(value))
}

func normalizeRecommendedOptions(value any, options []map[string]any, single bool) []string {
	allowed := make(map[string]struct{}, len(options))
	for _, option := range options {
		if text := argumentText(option, "value"); text != "" {
			allowed[text] = struct{}{}
		}
	}
	seen := make(map[string]struct{})
	result := make([]string, 0)
	for _, text := range argumentStrings(value) {
		if _, exists := allowed[text]; !exists {
			continue
		}
		if _, exists := seen[text]; exists {
			continue
		}
		seen[text] = struct{}{}
		result = append(result, text)
		if single {
			break
		}
	}
	return result
}

func normalizeAskUserOptions(value any) []map[string]any {
	items, ok := value.([]any)
	if !ok {
		return nil
	}
	result := make([]map[string]any, 0, len(items))
	for _, item := range items {
		text, ok := item.(string)
		if !ok {
			continue
		}
		text = strings.TrimSpace(text)
		if text == "" || isAskUserCustomOption(text) {
			continue
		}
		result = append(result, map[string]any{"label": text, "value": text})
		if len(result) == maxAskUserOptions {
			break
		}
	}
	return result
}

func isAskUserCustomOption(value string) bool {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "其他", "其它", "自定义", "自定义补充", "other", "custom":
		return true
	default:
		return false
	}
}

func argumentText(arguments map[string]any, key string) string {
	if arguments == nil {
		return ""
	}
	if arguments[key] == nil {
		return ""
	}
	return strings.TrimSpace(fmt.Sprint(arguments[key]))
}

func argumentStrings(value any) []string {
	result := make([]string, 0)
	switch current := value.(type) {
	case []string:
		for _, item := range current {
			if text := strings.TrimSpace(item); text != "" {
				result = append(result, text)
			}
		}
	case []any:
		for _, item := range current {
			if text := strings.TrimSpace(fmt.Sprint(item)); text != "" {
				result = append(result, text)
			}
		}
	case string:
		for _, item := range strings.Split(current, ",") {
			if text := strings.TrimSpace(item); text != "" {
				result = append(result, text)
			}
		}
	}
	return result
}
