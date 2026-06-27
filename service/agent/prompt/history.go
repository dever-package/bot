package prompt

import (
	"encoding/json"
	"fmt"
	"strings"
)

const (
	historyPromptMaxRows       = 8
	historyPromptMaxValueRunes = 900
	historyPromptMaxTotalRunes = 5200
)

func historyPrompt(history []any) string {
	if len(history) == 0 {
		return ""
	}
	rows := compactHistoryRows(history)
	if len(rows) == 0 {
		return ""
	}
	lines := []string{
		"当前临时资料:",
		"来自本次运行弹窗内的多轮对话、交互表单、选项和工具结果；只用于当前运行，不代表长期记忆。",
	}
	lines = append(lines, rows...)
	return truncatePromptText(strings.Join(lines, "\n"), historyPromptMaxTotalRunes)
}

func compactHistoryRows(history []any) []string {
	start := len(history) - historyPromptMaxRows
	if start < 0 {
		start = 0
	}
	rows := make([]string, 0, len(history)-start)
	for index := start; index < len(history); index++ {
		text := compactHistoryValue(history[index])
		if text == "" {
			continue
		}
		rows = append(rows, fmt.Sprintf("- %s", text))
	}
	return rows
}

func compactHistoryValue(value any) string {
	mapped := promptMap(value)
	if len(mapped) == 0 {
		return truncatePromptText(promptJSON(value), historyPromptMaxValueRunes)
	}

	role := firstPromptText(mapped["role"], mapped["type"], mapped["kind"], mapped["event"])
	if role == "" {
		role = "entry"
	}

	if result := compactFinalResultHistory(mapped); result != "" {
		return role + ": " + result
	}

	text := firstPromptText(
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
	return role + ": " + truncatePromptText(text, historyPromptMaxValueRunes)
}

func compactFinalResultHistory(mapped map[string]any) string {
	candidates := []map[string]any{mapped}
	for _, key := range []string{"result", "final_result", "finalOutput", "output"} {
		if current := promptMap(mapped[key]); len(current) > 0 {
			candidates = append(candidates, current)
		}
	}
	for _, candidate := range candidates {
		kind := strings.ToLower(firstPromptText(candidate["kind"], candidate["type"], candidate["event"]))
		if kind != "final_result" && kind != "final" && kind != "result_card" {
			continue
		}
		parts := make([]string, 0, 5)
		if title := firstPromptText(candidate["title"], candidate["name"]); title != "" {
			parts = append(parts, "title="+truncatePromptText(title, 120))
		}
		content := promptMap(candidate["content"])
		if format := firstPromptText(content["format"], candidate["format"]); format != "" {
			parts = append(parts, "format="+format)
		}
		if tasks := promptSlice(candidate["tasks"]); len(tasks) > 0 {
			parts = append(parts, fmt.Sprintf("tasks=%d", len(tasks)))
		} else if tasks := promptSlice(content["tasks"]); len(tasks) > 0 {
			parts = append(parts, fmt.Sprintf("tasks=%d", len(tasks)))
		}
		if suggestions := promptSlice(candidate["suggestions"]); len(suggestions) > 0 {
			parts = append(parts, fmt.Sprintf("suggestions=%d", len(suggestions)))
		}
		if text := firstPromptText(candidate["text"], content["text"]); text != "" {
			parts = append(parts, "summary="+truncatePromptText(text, 260))
		}
		if len(parts) == 0 {
			return "final_result"
		}
		return strings.Join(parts, ", ")
	}
	return ""
}

func firstPromptText(values ...any) string {
	for _, value := range values {
		switch current := value.(type) {
		case nil:
			continue
		case string:
			if text := strings.TrimSpace(current); text != "" {
				return text
			}
		default:
			if text := strings.TrimSpace(promptJSON(current)); text != "" && text != "null" && text != "{}" && text != "[]" {
				return text
			}
		}
	}
	return ""
}

func promptMap(value any) map[string]any {
	switch current := value.(type) {
	case map[string]any:
		return current
	default:
		raw, err := json.Marshal(current)
		if err != nil {
			return nil
		}
		var result map[string]any
		if err := json.Unmarshal(raw, &result); err != nil {
			return nil
		}
		return result
	}
}

func promptSlice(value any) []any {
	switch current := value.(type) {
	case []any:
		return current
	default:
		raw, err := json.Marshal(current)
		if err != nil {
			return nil
		}
		var result []any
		if err := json.Unmarshal(raw, &result); err != nil {
			return nil
		}
		return result
	}
}

func promptJSON(value any) string {
	raw, err := json.Marshal(value)
	if err != nil {
		return strings.TrimSpace(fmt.Sprint(value))
	}
	return strings.TrimSpace(string(raw))
}

func truncatePromptText(text string, maxRunes int) string {
	text = strings.TrimSpace(text)
	if maxRunes <= 0 {
		return text
	}
	runes := []rune(text)
	if len(runes) <= maxRunes {
		return text
	}
	return strings.TrimSpace(string(runes[:maxRunes])) + "..."
}
