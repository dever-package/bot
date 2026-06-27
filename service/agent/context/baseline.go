package agentcontext

import (
	"fmt"
	"strings"
)

func BuildBaseline(history []any, budget Budget) Baseline {
	for index := len(history) - 1; index >= 0; index-- {
		if baseline := baselineFromHistoryValue(history[index], budget); baseline.Found {
			return baseline
		}
	}
	return Baseline{}
}

func baselineFromHistoryValue(value any, budget Budget) Baseline {
	mapped := normalizeMap(value)
	if len(mapped) == 0 {
		return Baseline{}
	}
	if baseline := baselineFromCandidate(mapped, budget); baseline.Found {
		return baseline
	}
	for _, key := range []string{"result", "final_result", "finalOutput", "output", "data"} {
		if candidate := baselineFromCandidate(normalizeMap(mapped[key]), budget); candidate.Found {
			return candidate
		}
	}
	return Baseline{}
}

func baselineFromCandidate(candidate map[string]any, budget Budget) Baseline {
	if len(candidate) == 0 || !isFinalResultCandidate(candidate) {
		return Baseline{}
	}
	if budget.BaselineSummaryRunes <= 0 {
		budget.BaselineSummaryRunes = DefaultBudget().BaselineSummaryRunes
	}
	content := normalizeMap(candidate["content"])
	baseline := Baseline{
		Found:       true,
		ResultID:    firstText(candidate["result_id"], candidate["resultId"], candidate["id"]),
		Title:       firstText(candidate["title"], candidate["name"], content["title"]),
		Format:      firstText(content["format"], candidate["format"]),
		Summary:     truncateText(resultSummaryText(candidate, content), budget.BaselineSummaryRunes),
		TaskCount:   len(firstTaskList(candidate, content)),
		Suggestions: len(normalizeSlice(candidate["suggestions"])),
		Output:      cloneMap(candidate),
	}
	if baseline.Format == "" && len(normalizeMap(content["rich"])) > 0 {
		baseline.Format = "rich_json"
	}
	baseline.Placeholders = uniqueNonEmpty(append(
		placeholderIDsFromValue(candidate["rich"]),
		placeholderIDsFromValue(content["rich"])...,
	))
	return baseline
}

func isFinalResultCandidate(candidate map[string]any) bool {
	kind := strings.ToLower(strings.TrimSpace(firstText(candidate["kind"], candidate["type"], candidate["event"])))
	if kind == "final_result" || kind == "final" || kind == "result_card" {
		return true
	}
	content := normalizeMap(candidate["content"])
	return len(content) > 0 && strings.EqualFold(firstText(content["format"]), "rich_json")
}

func resultSummaryText(candidate map[string]any, content map[string]any) string {
	if text := firstText(candidate["text"], content["text"], candidate["summary"], content["summary"]); text != "" {
		return text
	}
	if rich := normalizeMap(candidate["rich"]); len(rich) > 0 {
		return richTextSummary(rich)
	}
	if rich := normalizeMap(content["rich"]); len(rich) > 0 {
		return richTextSummary(rich)
	}
	return ""
}

func firstTaskList(candidate map[string]any, content map[string]any) []any {
	for _, source := range []map[string]any{candidate, content} {
		for _, key := range []string{"tasks", "ability_tasks", "abilityTasks"} {
			if rows := normalizeSlice(source[key]); len(rows) > 0 {
				return rows
			}
		}
	}
	return nil
}

func richTextSummary(node map[string]any) string {
	parts := make([]string, 0, 8)
	collectRichText(node, &parts)
	return truncateText(strings.Join(parts, "\n"), DefaultBudget().BaselineSummaryRunes)
}

func collectRichText(value any, parts *[]string) {
	switch current := value.(type) {
	case map[string]any:
		if text := strings.TrimSpace(firstText(current["text"])); text != "" {
			*parts = append(*parts, text)
		}
		if attrs := normalizeMap(current["attrs"]); len(attrs) > 0 {
			nodeType := strings.TrimSpace(firstText(current["type"]))
			if nodeType == "agentAbilityPlaceholder" || nodeType == "agentTaskPlaceholder" {
				title := firstText(attrs["title"], attrs["name"], attrs["placeholder_id"], attrs["placeholderId"])
				if title != "" {
					*parts = append(*parts, fmt.Sprintf("[素材占位: %s]", title))
				}
			}
		}
		for _, child := range normalizeSlice(current["content"]) {
			collectRichText(child, parts)
		}
	case []any:
		for _, child := range current {
			collectRichText(child, parts)
		}
	}
}

func placeholderIDsFromValue(value any) []string {
	ids := make([]string, 0)
	collectPlaceholderIDs(value, &ids)
	return ids
}

func collectPlaceholderIDs(value any, ids *[]string) {
	switch current := value.(type) {
	case map[string]any:
		nodeType := strings.TrimSpace(firstText(current["type"]))
		if nodeType == "agentAbilityPlaceholder" || nodeType == "agentTaskPlaceholder" {
			attrs := normalizeMap(current["attrs"])
			id := firstText(attrs["placeholder_id"], attrs["placeholderId"], attrs["id"], current["id"])
			if id != "" {
				*ids = append(*ids, id)
			}
		}
		for _, child := range normalizeSlice(current["content"]) {
			collectPlaceholderIDs(child, ids)
		}
	case []any:
		for _, child := range current {
			collectPlaceholderIDs(child, ids)
		}
	}
}

func baselinePrompt(baseline Baseline) string {
	if !baseline.Found {
		return ""
	}
	lines := []string{
		"上一版最终结果基准:",
		"用户要求基于上一版修改时，未明确要求修改的正文、结构、rich 节点、占位、tasks 和 suggestions 必须保持不变。",
	}
	if baseline.ResultID != "" {
		lines = append(lines, "- result_id: "+baseline.ResultID)
	}
	if baseline.Title != "" {
		lines = append(lines, "- title: "+baseline.Title)
	}
	if baseline.Format != "" {
		lines = append(lines, "- format: "+baseline.Format)
	}
	if baseline.TaskCount > 0 {
		lines = append(lines, fmt.Sprintf("- tasks: %d", baseline.TaskCount))
	}
	if len(baseline.Placeholders) > 0 {
		lines = append(lines, "- placeholders: "+strings.Join(baseline.Placeholders, ", "))
	}
	if baseline.Summary != "" {
		lines = append(lines, "- summary: "+baseline.Summary)
	}
	return strings.Join(lines, "\n")
}
