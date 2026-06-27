package agentcontext

import "fmt"

func BuildHistoryNotes(history []any, budget Budget) []ContextNote {
	if len(history) == 0 {
		return nil
	}
	if budget.HistoryRows <= 0 {
		budget.HistoryRows = DefaultBudget().HistoryRows
	}
	if budget.HistoryValueRunes <= 0 {
		budget.HistoryValueRunes = DefaultBudget().HistoryValueRunes
	}

	start := len(history) - budget.HistoryRows
	if start < 0 {
		start = 0
	}
	notes := make([]ContextNote, 0, len(history)-start)
	for index := start; index < len(history); index++ {
		note := compactHistoryValue(history[index], budget)
		if note.Text != "" {
			notes = append(notes, note)
		}
	}
	return notes
}

func BuildModelHistory(history []any, budget Budget) []any {
	// 旧对话已通过 ContextNotes/Baseline 进入 system prompt；body.history
	// 只保留本轮后续 tool observation，避免同一历史重复进入模型上下文。
	return []any{}
}

func compactHistoryValue(value any, budget Budget) ContextNote {
	mapped := normalizeMap(value)
	if len(mapped) == 0 {
		return ContextNote{Role: "entry", Text: truncateText(promptJSON(value), budget.HistoryValueRunes)}
	}

	role := firstText(mapped["role"], mapped["type"], mapped["kind"], mapped["event"])
	if role == "" {
		role = "entry"
	}
	if baseline := baselineFromCandidate(mapped, budget); baseline.Found {
		return ContextNote{Role: role, Text: baselineNoteText(baseline)}
	}

	text := firstText(
		mapped["text"],
		mapped["message"],
		mapped["prompt"],
		mapped["input"],
		mapped["content"],
		mapped["output"],
		mapped["data"],
	)
	if text == "" {
		text = promptJSON(mapped)
	}
	return ContextNote{Role: role, Text: truncateText(text, budget.HistoryValueRunes)}
}

func baselineNoteText(baseline Baseline) string {
	parts := make([]string, 0, 6)
	if baseline.Title != "" {
		parts = append(parts, "title="+truncateText(baseline.Title, 120))
	}
	if baseline.Format != "" {
		parts = append(parts, "format="+baseline.Format)
	}
	if baseline.TaskCount > 0 {
		parts = append(parts, fmt.Sprintf("tasks=%d", baseline.TaskCount))
	}
	if len(baseline.Placeholders) > 0 {
		parts = append(parts, "placeholders="+truncateText(joinText(baseline.Placeholders, ","), 180))
	}
	if baseline.Suggestions > 0 {
		parts = append(parts, fmt.Sprintf("suggestions=%d", baseline.Suggestions))
	}
	if baseline.Summary != "" {
		parts = append(parts, "summary="+truncateText(baseline.Summary, 260))
	}
	if len(parts) == 0 {
		return "final_result"
	}
	return "final_result: " + joinText(parts, ", ")
}

func joinText(values []string, sep string) string {
	if len(values) == 0 {
		return ""
	}
	result := values[0]
	for index := 1; index < len(values); index++ {
		result += sep + values[index]
	}
	return result
}
