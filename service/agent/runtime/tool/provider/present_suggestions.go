package provider

import (
	"context"
	"fmt"
	"strings"
)

const maxPresentedSuggestions = 3

func PresentSuggestionsTool() Tool {
	return Tool{
		Definition: Definition{
			Name:        "present_suggestions",
			Title:       "后续建议",
			Kind:        "presentation",
			Description: "可选工具。仅在已经完整回答用户之后调用，用 1 到 3 个简短按钮给出自然的后续操作。调用后结束当前运行；不要把建议重复写进正文。",
			Parameters: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"items": map[string]any{
						"type":     "array",
						"minItems": 1,
						"maxItems": maxPresentedSuggestions,
						"items": map[string]any{
							"type": "object",
							"properties": map[string]any{
								"label":  map[string]any{"type": "string", "description": "按钮文案，简短明确"},
								"prompt": map[string]any{"type": "string", "description": "点击后真正发送给智能体的完整要求"},
							},
							"required":             []any{"label", "prompt"},
							"additionalProperties": false,
						},
					},
				},
				"required":             []any{"items"},
				"additionalProperties": false,
			},
		},
		Handle: executePresentSuggestions,
	}
}

func executePresentSuggestions(_ context.Context, call Call) (Result, error) {
	items, err := normalizePresentedSuggestions(call.Arguments["items"])
	if err != nil {
		return Result{}, err
	}
	return Result{
		Text:         "你还可以继续选择下面的建议。",
		Content:      map[string]any{"suggestions": items},
		Presentation: map[string]any{"suggestions": items},
		Terminal:     true,
	}, nil
}

func normalizePresentedSuggestions(value any) ([]map[string]any, error) {
	items, ok := value.([]any)
	if !ok || len(items) == 0 {
		return nil, fmt.Errorf("present_suggestions.items 至少需要一项")
	}
	if len(items) > maxPresentedSuggestions {
		items = items[:maxPresentedSuggestions]
	}
	seen := make(map[string]struct{}, len(items))
	result := make([]map[string]any, 0, len(items))
	for _, item := range items {
		row, ok := item.(map[string]any)
		if !ok {
			continue
		}
		label := strings.TrimSpace(argumentText(row, "label"))
		prompt := strings.TrimSpace(argumentText(row, "prompt"))
		if label == "" || prompt == "" {
			continue
		}
		if _, exists := seen[prompt]; exists {
			continue
		}
		seen[prompt] = struct{}{}
		result = append(result, map[string]any{"label": label, "prompt": prompt})
	}
	if len(result) == 0 {
		return nil, fmt.Errorf("present_suggestions.items 缺少有效的 label 和 prompt")
	}
	return result, nil
}
