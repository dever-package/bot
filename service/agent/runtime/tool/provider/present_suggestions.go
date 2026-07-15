package provider

import (
	"context"
	"fmt"
	"strings"
)

const maxPresentedSuggestions = 8

const PresentSuggestionsDecisionRule = "只要本轮回复准备让用户从两个或更多可执行的后续动作、方案或方向中选择，无论用户如何措辞，都必须调用 present_suggestions，不能把选择项写成正文列表。判断依据是本轮是否需要用户做选择，不是关键词或固定句式。用户表达不确定、把决定交给你、要求推荐可选方向，或者询问后续可做什么时，如果存在多个合理选择，应先形成具体选项并调用 present_suggestions。完成正文后又提出多个可继续处理的方向，也属于需要调用本工具的选择场景。例如完成故事后准备让用户选择续写、换风格或扩写时，必须把这些动作放入本工具，而不是写在正文结尾。仅有一个明确动作时直接回答或执行；普通问候、没有选择需求的闲聊和纯知识性列表不要调用。"

func PresentSuggestionsTool() Tool {
	return Tool{
		Definition: Definition{
			Name:        "present_suggestions",
			Title:       "后续建议",
			Kind:        "presentation",
			Description: PresentSuggestionsDecisionRule + " 使用 message 输出一句自然引导语，使用 items 输出 1 到 8 个简短按钮。正文不得重复这些选项，禁止用产品的通用功能导航替代正常回答。调用后结束当前运行。",
			Parameters: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"message": map[string]any{
						"type":        "string",
						"description": "展示在按钮上方的一句自然引导语，不得使用固定的系统状态文案",
					},
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
				"required":             []any{"message", "items"},
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
	message := strings.TrimSpace(argumentText(call.Arguments, "message"))
	return Result{
		Text:         message,
		Content:      map[string]any{"message": message, "suggestions": items},
		Presentation: map[string]any{"message": message, "suggestions": items},
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
