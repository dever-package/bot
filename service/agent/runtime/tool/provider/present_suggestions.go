package provider

import (
	"context"
	"fmt"
	"strings"
)

const (
	PresentSuggestionsToolName = "present_suggestions"
	maxSuggestionItems         = 8
	defaultSuggestionMessage   = "内容已完成，你可以从下面的方向继续。"
)

func PresentSuggestionsTool() Tool {
	return Tool{
		Definition: Definition{
			Name:        PresentSuggestionsToolName,
			Title:       "后续建议",
			Kind:        "presentation",
			Description: "当前任务需要用一句结果说明和可点击下一步收口时，必须调用此工具。任务继续所必需的信息使用 ask_user；禁止用正文选项列表代替本工具。图文场景必须依据 compose_document 的真实结果：成功时说明文档已完成，并给出 2 至 4 个修改、扩展或使用方向；失败时明确说明生成失败，并给出重新生成或调整要求的方向，不得谎报完成。不要在调用前用普通文本复述。",
			Parameters: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"message": map[string]any{
						"type":        "string",
						"description": "按钮上方的一句自然结果说明；失败时必须明确说明失败",
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
									"description": "按钮标题",
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
	if message == "" {
		message = defaultSuggestionMessage
	}
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
