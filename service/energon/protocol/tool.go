package protocol

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
)

type ToolCall struct {
	Index     int
	ID        string
	Type      string
	Name      string
	Arguments string
}

func FunctionToolDefinition(name string, description string, parameters map[string]any, strict bool) map[string]any {
	parameters = normalizeFunctionParameters(parameters)
	function := map[string]any{
		"name":        strings.TrimSpace(name),
		"description": strings.TrimSpace(description),
		"parameters":  parameters,
	}
	if strict {
		function["strict"] = true
	}
	return map[string]any{
		"type":     "function",
		"function": function,
	}
}

func normalizeFunctionParameters(parameters map[string]any) map[string]any {
	result := make(map[string]any, len(parameters)+3)
	for key, value := range parameters {
		result[key] = value
	}
	if strings.TrimSpace(asText(result["type"])) == "" {
		result["type"] = "object"
	}
	if strings.EqualFold(strings.TrimSpace(asText(result["type"])), "object") {
		if _, exists := result["properties"].(map[string]any); !exists {
			result["properties"] = map[string]any{}
		}
		result["required"] = normalizeRequiredProperties(result["required"])
	}
	return result
}

func normalizeRequiredProperties(value any) []any {
	switch current := value.(type) {
	case []any:
		return append([]any(nil), current...)
	case []string:
		result := make([]any, 0, len(current))
		for _, item := range current {
			result = append(result, item)
		}
		return result
	default:
		return []any{}
	}
}

func ForcedFunctionToolChoice(name string) map[string]any {
	return map[string]any{
		"type": "function",
		"function": map[string]any{
			"name": strings.TrimSpace(name),
		},
	}
}

func ParseToolCalls(value any) []ToolCall {
	items := normalizeAnyList(value)
	result := make([]ToolCall, 0, len(items))
	for position, item := range items {
		mapped := normalizeMap(item)
		if mapped == nil {
			continue
		}
		function := normalizeMap(mapped["function"])
		call := ToolCall{
			Index:     toolCallIndex(mapped["index"], position),
			ID:        strings.TrimSpace(asText(mapped["id"])),
			Type:      strings.TrimSpace(asText(mapped["type"])),
			Name:      strings.TrimSpace(asText(function["name"])),
			Arguments: toolArgumentsText(function["arguments"]),
		}
		if call.Type == "" {
			call.Type = "function"
		}
		if call.ID == "" && call.Name == "" && call.Arguments == "" {
			continue
		}
		result = append(result, call)
	}
	return result
}

func ToolCallsValue(calls []ToolCall) []any {
	return toolCallsValue(calls, false)
}

func ToolCallFragmentsValue(calls []ToolCall) []any {
	return toolCallsValue(calls, true)
}

func toolCallsValue(calls []ToolCall, includeIndex bool) []any {
	if len(calls) == 0 {
		return nil
	}
	result := make([]any, 0, len(calls))
	for _, call := range calls {
		function := map[string]any{
			"name":      call.Name,
			"arguments": call.Arguments,
		}
		item := map[string]any{
			"id":       call.ID,
			"type":     firstText(call.Type, "function"),
			"function": function,
		}
		if includeIndex && call.Index >= 0 {
			item["index"] = call.Index
		}
		result = append(result, item)
	}
	return result
}

func MergeToolCalls(current []ToolCall, fragments []ToolCall) []ToolCall {
	result := append([]ToolCall(nil), current...)
	for _, fragment := range fragments {
		position := findToolCall(result, fragment)
		if position < 0 {
			result = append(result, fragment)
			continue
		}
		merged := result[position]
		if fragment.ID != "" {
			merged.ID = fragment.ID
		}
		if fragment.Type != "" {
			merged.Type = fragment.Type
		}
		merged.Name = mergeToolCallName(merged.Name, fragment.Name)
		merged.Arguments = mergeToolCallArguments(merged.Arguments, fragment.Arguments)
		result[position] = merged
	}
	return result
}

func mergeToolCallArguments(current string, fragment string) string {
	// Delta fragments are positional; repeated suffix text can be valid JSON closers.
	if fragment == "" || current == fragment {
		return current
	}
	if current == "" || strings.HasPrefix(fragment, current) {
		return fragment
	}
	return current + fragment
}

func ToolCallArguments(call ToolCall) (map[string]any, error) {
	arguments := strings.TrimSpace(call.Arguments)
	if arguments == "" {
		return map[string]any{}, nil
	}
	result := map[string]any{}
	if err := json.Unmarshal([]byte(arguments), &result); err != nil {
		return nil, fmt.Errorf("工具 %s 参数不是合法 JSON，可能是参数过长或返回不完整；请删除非必要参数并重新调用: %w", call.Name, err)
	}
	return result, nil
}

func hasToolCallIndex(value any) bool {
	for _, item := range normalizeAnyList(value) {
		if mapped := normalizeMap(item); mapped != nil {
			if _, exists := mapped["index"]; exists {
				return true
			}
		}
	}
	return false
}

func findToolCall(calls []ToolCall, target ToolCall) int {
	for index, call := range calls {
		if target.ID != "" && call.ID == target.ID {
			return index
		}
		if target.Index >= 0 && call.Index == target.Index {
			return index
		}
	}
	return -1
}

func mergeToolCallName(current string, fragment string) string {
	if fragment == "" || current == fragment || strings.HasSuffix(current, fragment) {
		return current
	}
	if current == "" || strings.HasPrefix(fragment, current) {
		return fragment
	}
	return current + fragment
}

func toolCallIndex(value any, fallback int) int {
	switch current := value.(type) {
	case int:
		return current
	case int64:
		return int(current)
	case float64:
		return int(current)
	case json.Number:
		if parsed, err := strconv.Atoi(current.String()); err == nil {
			return parsed
		}
	case string:
		if parsed, err := strconv.Atoi(strings.TrimSpace(current)); err == nil {
			return parsed
		}
	}
	return fallback
}

func toolArgumentsText(value any) string {
	if value == nil {
		return ""
	}
	if text, ok := value.(string); ok {
		return text
	}
	raw, err := json.Marshal(value)
	if err != nil {
		return ""
	}
	return string(raw)
}
