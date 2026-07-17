package loop

import (
	"encoding/json"
	"strings"
	"unicode/utf8"
)

const (
	modelRequestRuneBudget          = 48000
	emergencyModelRequestRuneBudget = 24000
	modelOutputReserveRunes         = 8000
	historyStringRuneLimit          = 6000
	emergencyHistoryStringRuneLimit = 2400
	inputStringRuneLimit            = 16000
	emergencyInputStringRuneLimit   = 8000
)

func compactModelInput(input map[string]any, emergency bool) map[string]any {
	if len(input) == 0 {
		return map[string]any{}
	}
	limit := inputStringRuneLimit
	if emergency {
		limit = emergencyInputStringRuneLimit
	}
	stringLimit := limit
	compacted, _ := compactModelValue(input, stringLimit).(map[string]any)
	for jsonRuneCount(compacted) > limit && stringLimit > 256 {
		stringLimit /= 2
		compacted, _ = compactModelValue(input, stringLimit).(map[string]any)
	}
	return compacted
}

func compactModelHistory(role string, input map[string]any, history []any, tools []any, emergency bool) []any {
	if len(history) == 0 {
		return []any{}
	}
	totalBudget := modelRequestRuneBudget
	stringLimit := historyStringRuneLimit
	if emergency {
		totalBudget = emergencyModelRequestRuneBudget
		stringLimit = emergencyHistoryStringRuneLimit
	}
	available := totalBudget - jsonRuneCount(role) - jsonRuneCount(input) - jsonRuneCount(tools) - modelOutputReserveRunes
	if available <= 0 {
		return []any{}
	}
	groups := historyMessageGroups(history, stringLimit)
	selected := make([][]any, 0, len(groups))
	used := 0
	for index := len(groups) - 1; index >= 0; index-- {
		current := groups[index]
		currentSize := jsonRuneCount(current)
		if used == 0 && currentSize > available {
			current = compactHistoryGroup(current, maxInt(64, available/maxInt(1, len(current)*2)))
			currentSize = jsonRuneCount(current)
		}
		if used+currentSize > available {
			break
		}
		selected = append(selected, current)
		used += currentSize
	}
	result := make([]any, 0, len(history))
	for index := len(selected) - 1; index >= 0; index-- {
		result = append(result, selected[index]...)
	}
	return result
}

func compactHistoryGroup(group []any, stringLimit int) []any {
	result := make([]any, 0, len(group))
	for _, message := range group {
		result = append(result, compactModelValue(message, stringLimit))
	}
	return result
}

func historyMessageGroups(history []any, stringLimit int) [][]any {
	groups := make([][]any, 0, len(history))
	for index := 0; index < len(history); {
		message := compactModelValue(history[index], stringLimit)
		group := []any{message}
		index++
		if !historyMessageHasToolCalls(message) {
			groups = append(groups, group)
			continue
		}
		for index < len(history) {
			toolMessage := compactModelValue(history[index], stringLimit)
			if historyMessageRole(toolMessage) != "tool" {
				break
			}
			group = append(group, toolMessage)
			index++
		}
		groups = append(groups, group)
	}
	return groups
}

func historyMessageHasToolCalls(value any) bool {
	message, ok := value.(map[string]any)
	if !ok {
		return false
	}
	switch calls := message["tool_calls"].(type) {
	case []any:
		return len(calls) > 0
	case []map[string]any:
		return len(calls) > 0
	default:
		return calls != nil
	}
}

func historyMessageRole(value any) string {
	message, ok := value.(map[string]any)
	if !ok {
		return ""
	}
	role, _ := message["role"].(string)
	return strings.ToLower(strings.TrimSpace(role))
}

func compactModelValue(value any, stringLimit int) any {
	switch current := value.(type) {
	case map[string]any:
		result := make(map[string]any, len(current))
		for key, item := range current {
			if strings.EqualFold(strings.TrimSpace(key), "arguments") {
				result[key] = compactToolArguments(item, stringLimit)
				continue
			}
			if preserveModelHistoryField(key) {
				result[key] = item
				continue
			}
			result[key] = compactModelValue(item, stringLimit)
		}
		return result
	case []any:
		result := make([]any, 0, len(current))
		for _, item := range current {
			result = append(result, compactModelValue(item, stringLimit))
		}
		return result
	case []map[string]any:
		result := make([]map[string]any, 0, len(current))
		for _, item := range current {
			compacted, _ := compactModelValue(item, stringLimit).(map[string]any)
			result = append(result, compacted)
		}
		return result
	case string:
		return compactModelString(current, stringLimit)
	default:
		return current
	}
}

func preserveModelHistoryField(key string) bool {
	switch strings.ToLower(strings.TrimSpace(key)) {
	case "tool_call_id", "role", "name", "id":
		return true
	default:
		return false
	}
}

func compactModelString(value string, limit int) string {
	value = strings.TrimSpace(value)
	if limit <= 0 || utf8.RuneCountInString(value) <= limit {
		return value
	}
	head := limit * 2 / 3
	return strings.TrimSpace(firstRunes(value, head)) + "\n...[内容已压缩]...\n" +
		strings.TrimSpace(lastRunes(value, limit-head))
}

func compactToolArguments(value any, limit int) any {
	text, ok := value.(string)
	if !ok {
		return compactModelValue(value, limit)
	}
	text = strings.TrimSpace(text)
	if limit <= 0 || utf8.RuneCountInString(text) <= limit {
		return text
	}
	var parsed any
	if json.Unmarshal([]byte(text), &parsed) == nil {
		encoded, err := json.Marshal(compactModelValue(parsed, maxInt(256, limit/3)))
		if err == nil && utf8.RuneCount(encoded) <= limit {
			return string(encoded)
		}
	}
	return `{"truncated":true,"reason":"历史工具参数超过上下文预算"}`
}

func firstRunes(value string, maximum int) string {
	if maximum <= 0 {
		return ""
	}
	count := 0
	for index := range value {
		if count == maximum {
			return value[:index]
		}
		count++
	}
	return value
}

func lastRunes(value string, maximum int) string {
	if maximum <= 0 {
		return ""
	}
	skip := utf8.RuneCountInString(value) - maximum
	if skip <= 0 {
		return value
	}
	count := 0
	for index := range value {
		if count == skip {
			return value[index:]
		}
		count++
	}
	return value
}

func maxInt(left int, right int) int {
	if left > right {
		return left
	}
	return right
}

func jsonRuneCount(value any) int {
	encoded, err := json.Marshal(value)
	if err != nil {
		return 0
	}
	return utf8.RuneCount(encoded)
}
