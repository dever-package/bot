package tokenbudget

import (
	"encoding/json"
	"fmt"
	"strings"
)

const contextSafetyPercent = 5

type Budget struct {
	HardContextTokens    int  `json:"hard_context_tokens"`
	WorkingContextTokens int  `json:"working_context_tokens"`
	MaxOutputTokens      int  `json:"max_output_tokens"`
	SafetyTokens         int  `json:"safety_tokens"`
	MaxInputTokens       int  `json:"max_input_tokens"`
	Expanded             bool `json:"context_expanded,omitempty"`
}

func Resolve(hardContext int, workingContext int, maxOutput int, requiredInput int) (Budget, error) {
	if hardContext <= 0 {
		return Budget{}, fmt.Errorf("模型上下文窗口必须大于 0")
	}
	if workingContext <= 0 || workingContext > hardContext {
		workingContext = hardContext
	}
	if maxOutput <= 0 {
		return Budget{}, fmt.Errorf("模型输出预算必须大于 0")
	}
	if maxOutput >= usableContextTokens(hardContext) {
		return Budget{}, fmt.Errorf("模型输出预算必须小于可用上下文窗口")
	}

	budget := resolveBudget(hardContext, workingContext, maxOutput)
	if requiredInput <= budget.MaxInputTokens {
		return budget, nil
	}
	requiredWorking := ceilDivide((requiredInput+maxOutput)*100, 100-contextSafetyPercent)
	if requiredWorking > hardContext {
		return Budget{}, fmt.Errorf(
			"当前必要输入约 %d Token，超过来源服务可用输入上限 %d Token",
			requiredInput,
			usableContextTokens(hardContext)-maxOutput,
		)
	}
	budget = resolveBudget(hardContext, requiredWorking, maxOutput)
	budget.Expanded = true
	return budget, nil
}

func Estimate(value any) int {
	if value == nil {
		return 0
	}
	if text, ok := value.(string); ok {
		return EstimateText(text)
	}
	encoded, err := json.Marshal(value)
	if err != nil {
		return EstimateText(fmt.Sprint(value))
	}
	return EstimateText(string(encoded))
}

func EstimateText(value string) int {
	value = strings.TrimSpace(value)
	if value == "" {
		return 0
	}
	ascii := 0
	nonASCII := 0
	for _, current := range value {
		if current <= 0x7f {
			ascii++
		} else {
			nonASCII++
		}
	}
	base := ceilDivide(ascii, 4) + nonASCII
	return base + ceilDivide(base, 20) + 8
}

// FitHistory keeps the newest complete message groups within maxTokens.
// Function Calling requests and their tool results remain atomic.
func FitHistory(history []any, maxTokens int) ([]any, error) {
	if len(history) == 0 || maxTokens <= 0 {
		return nil, nil
	}
	groups := completeHistoryGroups(history)
	selected := make([][]any, 0, len(groups))
	usedTokens := 0
	for index := len(groups) - 1; index >= 0; index-- {
		group := groups[index]
		groupTokens := Estimate(group)
		if usedTokens == 0 && groupTokens > maxTokens {
			group = fitHistoryGroup(group, maxTokens)
			groupTokens = Estimate(group)
			if len(group) == 0 || groupTokens > maxTokens {
				return nil, fmt.Errorf(
					"当前对话最近一轮上下文约 %d Token，超过文本工具可用历史预算 %d Token",
					Estimate(groups[index]),
					maxTokens,
				)
			}
		}
		if usedTokens+groupTokens > maxTokens {
			break
		}
		selected = append(selected, group)
		usedTokens += groupTokens
	}
	result := make([]any, 0, len(history))
	for index := len(selected) - 1; index >= 0; index-- {
		result = append(result, selected[index]...)
	}
	return result, nil
}

// CompactValue limits free-form strings while preserving protocol identifiers
// and valid JSON tool arguments.
func CompactValue(value any, stringLimit int) any {
	switch current := value.(type) {
	case map[string]any:
		result := make(map[string]any, len(current))
		for key, item := range current {
			if strings.EqualFold(strings.TrimSpace(key), "arguments") {
				result[key] = compactToolArguments(item, stringLimit)
				continue
			}
			if preserveField(key) {
				result[key] = item
				continue
			}
			result[key] = CompactValue(item, stringLimit)
		}
		return result
	case []any:
		result := make([]any, 0, len(current))
		for _, item := range current {
			result = append(result, CompactValue(item, stringLimit))
		}
		return result
	case []map[string]any:
		result := make([]map[string]any, 0, len(current))
		for _, item := range current {
			compacted, _ := CompactValue(item, stringLimit).(map[string]any)
			result = append(result, compacted)
		}
		return result
	case string:
		return CompactText(current, stringLimit)
	default:
		return current
	}
}

// CompactText keeps the beginning and end of oversized free-form text within
// the requested token estimate.
func CompactText(value string, limit int) string {
	value = strings.TrimSpace(value)
	if limit <= 0 || EstimateText(value) <= limit {
		return value
	}
	runes := []rune(value)
	low, high := 1, len(runes)
	best := ""
	for low <= high {
		count := (low + high) / 2
		head := count * 2 / 3
		candidate := strings.TrimSpace(string(runes[:head])) + "\n...[内容已压缩]...\n" +
			strings.TrimSpace(string(runes[len(runes)-(count-head):]))
		if EstimateText(candidate) <= limit {
			best = candidate
			low = count + 1
		} else {
			high = count - 1
		}
	}
	if best != "" {
		return best
	}
	return "[内容已压缩]"
}

func resolveBudget(hardContext int, workingContext int, maxOutput int) Budget {
	usable := usableContextTokens(workingContext)
	return Budget{
		HardContextTokens:    hardContext,
		WorkingContextTokens: workingContext,
		MaxOutputTokens:      maxOutput,
		SafetyTokens:         workingContext - usable,
		MaxInputTokens:       usable - maxOutput,
	}
}

func usableContextTokens(contextTokens int) int {
	return contextTokens * (100 - contextSafetyPercent) / 100
}

func ceilDivide(value int, divisor int) int {
	if value <= 0 {
		return 0
	}
	return (value + divisor - 1) / divisor
}

func completeHistoryGroups(history []any) [][]any {
	groups := make([][]any, 0, len(history))
	for index := 0; index < len(history); {
		message := history[index]
		if messageRole(message) == "tool" {
			index++
			continue
		}
		group := []any{message}
		index++
		callIDs := toolCallIDs(message)
		if len(callIDs) == 0 {
			groups = append(groups, group)
			continue
		}
		matched := make(map[string]struct{}, len(callIDs))
		for index < len(history) && messageRole(history[index]) == "tool" {
			toolMessage, _ := history[index].(map[string]any)
			callID := textValue(toolMessage["tool_call_id"])
			if _, exists := callIDs[callID]; exists {
				matched[callID] = struct{}{}
				group = append(group, history[index])
			}
			index++
		}
		if len(matched) == len(callIDs) {
			groups = append(groups, group)
		}
	}
	return groups
}

func toolCallIDs(value any) map[string]struct{} {
	message, ok := value.(map[string]any)
	if !ok {
		return nil
	}
	result := map[string]struct{}{}
	switch calls := message["tool_calls"].(type) {
	case []any:
		for _, rawCall := range calls {
			if call, ok := rawCall.(map[string]any); ok {
				if callID := textValue(call["id"]); callID != "" {
					result[callID] = struct{}{}
				}
			}
		}
	case []map[string]any:
		for _, call := range calls {
			if callID := textValue(call["id"]); callID != "" {
				result[callID] = struct{}{}
			}
		}
	default:
		encoded, err := json.Marshal(calls)
		if err != nil {
			return result
		}
		var decoded []map[string]any
		if json.Unmarshal(encoded, &decoded) != nil {
			return result
		}
		for _, call := range decoded {
			if callID := textValue(call["id"]); callID != "" {
				result[callID] = struct{}{}
			}
		}
	}
	return result
}

func messageRole(value any) string {
	message, ok := value.(map[string]any)
	if !ok {
		return ""
	}
	return strings.ToLower(textValue(message["role"]))
}

func textValue(value any) string {
	if value == nil {
		return ""
	}
	return strings.TrimSpace(fmt.Sprint(value))
}

func fitHistoryGroup(group []any, maxTokens int) []any {
	if len(group) == 0 || maxTokens <= 0 {
		return nil
	}
	stringLimit := maxTokens / (len(group) * 2)
	if stringLimit < 64 {
		stringLimit = 64
	}
	result := compactHistoryGroup(group, stringLimit)
	for Estimate(result) > maxTokens && stringLimit > 64 {
		stringLimit /= 2
		if stringLimit < 64 {
			stringLimit = 64
		}
		result = compactHistoryGroup(group, stringLimit)
	}
	return result
}

func compactHistoryGroup(group []any, stringLimit int) []any {
	result := make([]any, 0, len(group))
	for _, message := range group {
		result = append(result, CompactValue(message, stringLimit))
	}
	return result
}

func preserveField(key string) bool {
	switch strings.ToLower(strings.TrimSpace(key)) {
	case "tool_call_id", "role", "name", "id":
		return true
	default:
		return false
	}
}

func compactToolArguments(value any, limit int) any {
	text, ok := value.(string)
	if !ok {
		return CompactValue(value, limit)
	}
	text = strings.TrimSpace(text)
	if limit <= 0 || EstimateText(text) <= limit {
		return text
	}
	var parsed any
	if json.Unmarshal([]byte(text), &parsed) == nil {
		encoded, err := json.Marshal(CompactValue(parsed, maxInt(256, limit/3)))
		if err == nil && EstimateText(string(encoded)) <= limit {
			return string(encoded)
		}
	}
	return `{"truncated":true,"reason":"历史工具参数超过上下文预算"}`
}

func maxInt(left int, right int) int {
	if left > right {
		return left
	}
	return right
}
