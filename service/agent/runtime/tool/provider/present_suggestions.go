package provider

import (
	"context"
	"fmt"
	"strings"
)

const (
	PresentSuggestionsToolName = "present_suggestions"
	maxSuggestionItems         = 8
)

const PresentSuggestionsDecisionRule = "仅当当前用户任务已经按照当前智能体设定完整交付后，才可调用 present_suggestions 展示可选的后续操作。" +
	"它不是完成度检查器，也不是当前任务的确认表单：当前任务尚缺必要信息或需要用户确认时必须调用 ask_user；仍有可自主完成的步骤时必须继续执行，均不得调用本工具。" +
	"不得用本工具要求用户继续当前流程，不得把智能体设定中的阶段选项或参数确认移入后续建议。普通问候、闲聊或没有自然后续操作时不要调用。"

func PresentSuggestionsTool() Tool {
	return Tool{
		Definition: Definition{
			Name:        PresentSuggestionsToolName,
			Title:       "后续建议",
			Kind:        "presentation",
			Description: PresentSuggestionsDecisionRule + " 必须在当前主模型同一次响应已经给出完整最终正文后调用。使用 message 输出一句自然引导语，使用 items 输出 1-8 个紧贴当前结果、点击即可执行的后续按钮；正文不要重复这些按钮。调用后结束当前运行。",
			Parameters: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"message": map[string]any{
						"type":        "string",
						"description": "展示在按钮上方的一句自然引导语，不得使用固定系统状态文案",
					},
					"items": map[string]any{
						"type":     "array",
						"minItems": 1,
						"maxItems": maxSuggestionItems,
						"items": map[string]any{
							"type": "object",
							"properties": map[string]any{
								"label": map[string]any{
									"type":        "string",
									"description": "按钮短标题",
								},
								"prompt": map[string]any{
									"type":        "string",
									"description": "点击后发送给智能体的完整请求",
								},
							},
							"required":             []any{"label", "prompt"},
							"additionalProperties": false,
						},
					},
				},
				"required":             []any{"message", "items"},
				"additionalProperties": false,
			},
		},
		Handle: executePresentSuggestions,
	}
}

func executePresentSuggestions(_ context.Context, call Call) (Result, error) {
	items, err := normalizeSuggestionItems(call.Arguments["items"])
	if err != nil {
		return Result{}, err
	}
	message := strings.TrimSpace(argumentText(call.Arguments, "message"))
	return Result{
		Text:         message,
		Content:      map[string]any{"message": message, "suggestions": items},
		Presentation: map[string]any{"message": message, "suggestions": items},
		Terminal:     true,
	}, nil
}

func normalizeSuggestionItems(value any) ([]map[string]any, error) {
	items, ok := value.([]any)
	if !ok || len(items) == 0 {
		return nil, fmt.Errorf("present_suggestions.items 至少需要一项")
	}
	seen := make(map[string]struct{}, len(items))
	result := make([]map[string]any, 0, min(len(items), maxSuggestionItems))
	for _, item := range items {
		current, ok := item.(map[string]any)
		if !ok {
			continue
		}
		label := truncateSuggestionLabel(argumentText(current, "label"), 24)
		prompt := strings.TrimSpace(argumentText(current, "prompt"))
		if label == "" || prompt == "" {
			continue
		}
		if _, exists := seen[prompt]; exists {
			continue
		}
		seen[prompt] = struct{}{}
		result = append(result, map[string]any{"label": label, "prompt": prompt})
		if len(result) == maxSuggestionItems {
			break
		}
	}
	if len(result) == 0 {
		return nil, fmt.Errorf("present_suggestions.items 缺少有效的 label 和 prompt")
	}
	return result, nil
}

func truncateSuggestionLabel(value string, limit int) string {
	return truncateSuggestionText(value, limit)
}

func truncateSuggestionText(value string, limit int) string {
	runes := []rune(strings.TrimSpace(value))
	if len(runes) <= limit {
		return string(runes)
	}
	return string(runes[:limit])
}
