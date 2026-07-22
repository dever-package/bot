package loop

import (
	"encoding/json"
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimecontext "github.com/dever-package/bot/service/agent/runtime/context"
	energonservice "github.com/dever-package/bot/service/energon"
)

const (
	modelProtocolReserveTokens        = 256
	emergencyProtocolReserveTokens    = 1024
	historyStringMaxTokens            = 16000
	emergencyHistoryStringMaxTokens   = 4000
	skillHistoryStringMaxTokens       = 24000
	minimumHistoryMessageStringTokens = 512
)

type modelRequestBudget struct {
	runtimecontext.TokenBudget
	EstimatedInputTokens int
	Compacted            bool
	CompactionCount      int
	LimitsSource         string
	ServiceIDs           []uint64
}

func (budget modelRequestBudget) metadata() map[string]any {
	return map[string]any{
		"context_window_tokens":  budget.HardContextTokens,
		"working_context_tokens": budget.WorkingContextTokens,
		"max_output_tokens":      budget.MaxOutputTokens,
		"max_input_tokens":       budget.MaxInputTokens,
		"estimated_input_tokens": budget.EstimatedInputTokens,
		"safety_tokens":          budget.SafetyTokens,
		"limits_source":          budget.LimitsSource,
		"service_ids":            append([]uint64(nil), budget.ServiceIDs...),
		"context_expanded":       budget.Expanded,
		"compacted":              budget.Compacted,
		"compaction_count":       budget.CompactionCount,
	}
}

func prepareModelRequest(
	execution execution,
	role string,
	input map[string]any,
	history []any,
	tools []any,
	emergency bool,
) (map[string]any, []any, modelRequestBudget, error) {
	preparedInput := cloneMap(input)
	if preparedInput == nil {
		preparedInput = map[string]any{}
	}
	protocolReserve := modelProtocolReserveTokens
	if emergency {
		protocolReserve = emergencyProtocolReserveTokens
	}
	baseRequiredInput := runtimecontext.EstimateTokens(role) +
		runtimecontext.EstimateTokens(preparedInput) +
		runtimecontext.EstimateTokens(tools) + protocolReserve
	priorHistory, currentRunHistory := splitCurrentRunHistory(execution, history)
	preparedCurrentHistory := compactCurrentRunHistory(currentRunHistory, emergency)
	currentHistoryTokens := runtimecontext.EstimateTokens(preparedCurrentHistory)
	requiredInput := baseRequiredInput + currentHistoryTokens
	limits := normalizedExecutionModelLimits(execution.modelLimits)
	outputTokens := effectiveModelOutputTokens(execution.agent.MaxOutputTokens, limits.MaxOutputTokens)
	workingContextTokens := execution.workingContextTokens
	if workingContextTokens <= 0 {
		workingContextTokens = agentmodel.DefaultRuntimeWorkingContextTokens
	}
	tokenBudget, err := runtimecontext.ResolveTokenBudget(
		limits.ContextWindowTokens,
		workingContextTokens,
		outputTokens,
		requiredInput,
	)
	if err != nil {
		return nil, nil, modelRequestBudget{}, err
	}
	budget := modelRequestBudget{
		TokenBudget:     tokenBudget,
		LimitsSource:    limits.Source(),
		ServiceIDs:      append([]uint64(nil), limits.ServiceIDs...),
		CompactionCount: boolInt(emergency),
	}
	preparedHistory := compactModelHistory(
		role,
		preparedInput,
		priorHistory,
		tools,
		budget,
		emergency,
		currentHistoryTokens,
	)
	preparedHistory = append(preparedHistory, preparedCurrentHistory...)
	budget.EstimatedInputTokens = baseRequiredInput + runtimecontext.EstimateTokens(preparedHistory)
	budget.Compacted = len(preparedHistory) < len(history) ||
		runtimecontext.EstimateTokens(preparedHistory) < runtimecontext.EstimateTokens(history)
	return preparedInput, preparedHistory, budget, nil
}

func prepareModelRequestWithFallback(
	execution execution,
	role string,
	input map[string]any,
	history []any,
	tools []any,
) (map[string]any, []any, modelRequestBudget, error) {
	preparedInput, preparedHistory, budget, err := prepareModelRequest(
		execution, role, input, history, tools, false,
	)
	if err == nil {
		return preparedInput, preparedHistory, budget, nil
	}
	return prepareModelRequest(execution, role, input, history, tools, true)
}

func normalizedExecutionModelLimits(limits energonservice.ModelLimits) energonservice.ModelLimits {
	if limits.ContextWindowTokens <= 0 {
		limits.ContextWindowTokens = energonservice.DefaultModelContextWindowTokens
		limits.UsedFallback = true
	}
	if limits.MaxOutputTokens <= 0 {
		limits.MaxOutputTokens = energonservice.DefaultModelMaxOutputTokens
		limits.UsedFallback = true
	}
	return limits
}

func effectiveModelOutputTokens(agentPreference int, sourceMaximum int) int {
	desired := agentPreference
	if desired <= 0 {
		desired = energonservice.DefaultModelMaxOutputTokens
	}
	if sourceMaximum > 0 && desired > sourceMaximum {
		return sourceMaximum
	}
	return desired
}

func compactModelHistory(
	role string,
	input map[string]any,
	history []any,
	tools []any,
	budget modelRequestBudget,
	emergency bool,
	reservedTokens int,
) []any {
	if len(history) == 0 {
		return []any{}
	}
	protocolReserve := modelProtocolReserveTokens
	stringLimit := historyStringMaxTokens
	if emergency {
		protocolReserve = emergencyProtocolReserveTokens
		stringLimit = emergencyHistoryStringMaxTokens
	}
	available := budget.MaxInputTokens - runtimecontext.EstimateTokens(role) -
		runtimecontext.EstimateTokens(input) - runtimecontext.EstimateTokens(tools) -
		protocolReserve - reservedTokens
	if available <= 0 {
		return []any{}
	}
	stringLimit = minPositiveInt(stringLimit, maxInt(minimumHistoryMessageStringTokens, available/2))
	groups := historyMessageGroups(history, stringLimit)
	selected := make([][]any, 0, len(groups))
	used := 0
	for index := len(groups) - 1; index >= 0; index-- {
		current := groups[index]
		currentSize := runtimecontext.EstimateTokens(current)
		if used == 0 && currentSize > available {
			current = compactHistoryGroupToBudget(current, available)
			currentSize = runtimecontext.EstimateTokens(current)
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

func splitCurrentRunHistory(execution execution, history []any) ([]any, []any) {
	start := execution.snapshotHistoryLen
	if start < 0 || start > len(history) {
		start = 0
	}
	return history[:start], history[start:]
}

func compactCurrentRunHistory(history []any, emergency bool) []any {
	if len(history) == 0 {
		return nil
	}
	stringLimit := historyStringMaxTokens
	if emergency {
		stringLimit = emergencyHistoryStringMaxTokens
	}
	result := make([]any, 0, len(history))
	for _, message := range history {
		result = append(result, compactHistoryMessage(message, stringLimit))
	}
	return result
}

func compactHistoryGroupToBudget(group []any, available int) []any {
	if len(group) == 0 || available <= 0 {
		return nil
	}
	stringLimit := maxInt(minimumHistoryMessageStringTokens, available/maxInt(1, len(group)*2))
	result := compactHistoryGroup(group, stringLimit)
	for runtimecontext.EstimateTokens(result) > available && stringLimit > 64 {
		stringLimit /= 2
		result = compactHistoryGroup(group, stringLimit)
	}
	return result
}

func compactHistoryGroup(group []any, stringLimit int) []any {
	result := make([]any, 0, len(group))
	for _, message := range group {
		result = append(result, compactHistoryMessage(message, stringLimit))
	}
	return result
}

func historyMessageGroups(history []any, stringLimit int) [][]any {
	groups := make([][]any, 0, len(history))
	for index := 0; index < len(history); {
		message := compactHistoryMessage(history[index], stringLimit)
		group := []any{message}
		index++
		if !historyMessageHasToolCalls(message) {
			groups = append(groups, group)
			continue
		}
		for index < len(history) {
			toolMessage := compactHistoryMessage(history[index], stringLimit)
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

func compactHistoryMessage(message any, defaultLimit int) any {
	limit := defaultLimit
	if isSkillContentHistoryMessage(message) && defaultLimit > emergencyHistoryStringMaxTokens {
		limit = maxInt(defaultLimit, skillHistoryStringMaxTokens)
	}
	return compactModelValue(message, limit)
}

func isSkillContentHistoryMessage(value any) bool {
	message, ok := value.(map[string]any)
	if !ok || historyMessageRole(message) != "tool" {
		return false
	}
	name, _ := message["name"].(string)
	switch strings.ToLower(strings.TrimSpace(name)) {
	case "load_skill", "read_skill_file":
		return true
	default:
		return false
	}
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
	if limit <= 0 || runtimecontext.EstimateTextTokens(value) <= limit {
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
		if runtimecontext.EstimateTextTokens(candidate) <= limit {
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

func compactToolArguments(value any, limit int) any {
	text, ok := value.(string)
	if !ok {
		return compactModelValue(value, limit)
	}
	text = strings.TrimSpace(text)
	if limit <= 0 || runtimecontext.EstimateTextTokens(text) <= limit {
		return text
	}
	var parsed any
	if json.Unmarshal([]byte(text), &parsed) == nil {
		encoded, err := json.Marshal(compactModelValue(parsed, maxInt(256, limit/3)))
		if err == nil && runtimecontext.EstimateTextTokens(string(encoded)) <= limit {
			return string(encoded)
		}
	}
	return `{"truncated":true,"reason":"历史工具参数超过上下文预算"}`
}

func minPositiveInt(left int, right int) int {
	if left <= 0 {
		return right
	}
	if right <= 0 || left < right {
		return left
	}
	return right
}

func maxInt(left int, right int) int {
	if left > right {
		return left
	}
	return right
}

func boolInt(value bool) int {
	if value {
		return 1
	}
	return 0
}

func modelBudgetError(err error) error {
	if err == nil {
		return nil
	}
	return fmt.Errorf("模型上下文预算无效: %w", err)
}
