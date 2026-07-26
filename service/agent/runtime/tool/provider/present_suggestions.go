package provider

import (
	"context"
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const (
	PresentSuggestionsToolName = "present_suggestions"
	maxSuggestionItems         = 8
	defaultSuggestionMessage   = "内容已完成，你可以从下面的方向继续。"
)

type SuggestionPresentation struct {
	Message string
	Items   []map[string]any
}

func (presentation SuggestionPresentation) Output() map[string]any {
	output := map[string]any{"message": strings.TrimSpace(presentation.Message)}
	if len(presentation.Items) > 0 {
		output["suggestions"] = presentation.Items
	}
	return output
}

func PresentSuggestionsTool(mode string) Tool {
	return Tool{
		Definition: Definition{
			Name:        PresentSuggestionsToolName,
			Title:       "后续建议",
			Kind:        "presentation",
			Description: suggestionToolDescription(mode),
			Parameters:  suggestionParameters(1, maxSuggestionItems),
		},
		Handle: executePresentSuggestions,
	}
}

func executePresentSuggestions(_ context.Context, call Call) (Result, error) {
	presentation, err := parseSuggestionPresentation(call.Arguments, defaultSuggestionMessage, 1, maxSuggestionItems)
	if err != nil {
		return Result{}, err
	}
	output := presentation.Output()
	return Result{
		Text:         presentation.Message,
		Content:      output,
		Presentation: output,
		Terminal:     true,
	}, nil
}

func suggestionToolDescription(mode string) string {
	if agentmodel.NormalizeSuggestionMode(mode) == agentmodel.SuggestionModeAfterResult {
		return "仅在运行时要求结果后建议，或 session_started 需要首个选择时调用。用一句真实说明和可点击按钮收口；必要信息必须使用 ask_user。普通闲聊不调用，不要在正文中重复按钮。"
	}
	return "当前任务已完成且适合给出可选下一步时，在同一模型响应中调用。用一句真实结果说明和可点击按钮收口；必要信息必须使用 ask_user。普通闲聊不强制调用，不要在正文中重复按钮。"
}

func suggestionParameters(minItems int, maxItems int) map[string]any {
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"message": map[string]any{
				"type":        "string",
				"description": "按钮上方的一句自然结果说明",
			},
			"items": map[string]any{
				"type":     "array",
				"minItems": minItems,
				"maxItems": maxItems,
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
	}
}

func parseSuggestionPresentation(
	value map[string]any,
	fallbackMessage string,
	minItems int,
	maxItems int,
) (SuggestionPresentation, error) {
	items, err := normalizeSuggestionItems(value["items"], maxItems)
	if err != nil {
		return SuggestionPresentation{}, err
	}
	if len(items) < minItems {
		return SuggestionPresentation{}, fmt.Errorf("后续建议至少需要 %d 项", minItems)
	}
	message := strings.TrimSpace(argumentText(value, "message"))
	if message == "" {
		message = fallbackMessage
	}
	return SuggestionPresentation{Message: message, Items: items}, nil
}

func normalizeSuggestionItems(value any, maxItems int) ([]map[string]any, error) {
	items, ok := value.([]any)
	if !ok || len(items) == 0 {
		return nil, fmt.Errorf("present_suggestions.items 至少需要一项")
	}
	if maxItems <= 0 || maxItems > maxSuggestionItems {
		maxItems = maxSuggestionItems
	}
	seen := make(map[string]struct{}, len(items))
	result := make([]map[string]any, 0, min(len(items), maxItems))
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
		if len(result) == maxItems {
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
