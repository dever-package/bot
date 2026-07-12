package provider

import (
	"context"
	"fmt"
	"strings"
)

func AskUserTool() Tool {
	return Tool{
		Definition: Definition{
			Name:        "ask_user",
			Description: "当缺少继续执行所必需的信息或需要用户做选择时，暂停当前运行并向用户提问。不要用于普通确认或可以自行推断的问题。",
			Parameters: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"question": map[string]any{
						"type":        "string",
						"description": "要向用户提出的一个清晰问题",
					},
					"options": map[string]any{
						"type":        "array",
						"description": "可选答案；开放式问题可省略",
						"items":       map[string]any{"type": "string"},
					},
				},
				"required":             []any{"question"},
				"additionalProperties": false,
			},
		},
		Handle: executeAskUser,
	}
}

func executeAskUser(_ context.Context, call Call) (Result, error) {
	question := strings.TrimSpace(argumentText(call.Arguments, "question"))
	if question == "" {
		return Result{}, fmt.Errorf("ask_user.question 不能为空")
	}
	options := argumentStrings(call.Arguments["options"])
	interaction := map[string]any{
		"id":       "ask-user-" + strings.TrimSpace(call.ID),
		"type":     "ask_user",
		"question": question,
	}
	if len(options) > 0 {
		interaction["options"] = options
	}
	return Result{
		Text:        question,
		Content:     map[string]any{"question": question, "options": options},
		Interaction: interaction,
	}, nil
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
