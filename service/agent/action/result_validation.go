package action

import (
	"fmt"
	"strings"
)

type ResultValidation struct {
	Warnings []string `json:"warnings,omitempty"`
	Repaired bool     `json:"repaired"`
}

func RepairAgentResultOutput(output map[string]any) (map[string]any, ResultValidation) {
	if len(output) == 0 {
		return output, ResultValidation{}
	}
	next := cloneMap(output)
	validation := ResultValidation{}

	if !isStructuredResultOutput(next) {
		return next, validation
	}
	if strings.TrimSpace(firstText(next["kind"], next["type"])) == "" {
		next["kind"] = KindFinal
		validation.addRepair("缺少 kind，已补为 final_result。")
	}
	if strings.TrimSpace(firstText(next["event"])) == "" {
		next["event"] = "final"
		validation.addRepair("缺少 event，已补为 final。")
	}

	content := cloneMap(normalizeMap(next["content"]))
	content = repairAgentResultContent(content, next, &validation)
	if len(content) > 0 {
		next["content"] = content
	}
	repairAgentResultTasks(next, content, &validation)
	if suggestions := NormalizeSuggestions(next["suggestions"]); len(suggestions) > 0 {
		if len(suggestions) > 5 {
			suggestions = suggestions[:5]
			validation.addRepair("suggestions 超过 5 个，已截断。")
		}
		next["suggestions"] = suggestions
	}
	return next, validation
}

func (v *ResultValidation) addRepair(message string) {
	if v == nil || strings.TrimSpace(message) == "" {
		return
	}
	v.Repaired = true
	v.Warnings = append(v.Warnings, strings.TrimSpace(message))
}

func isStructuredResultOutput(output map[string]any) bool {
	if len(output) == 0 {
		return false
	}
	if normalizeResultKind(firstText(output["kind"], output["type"])) == KindFinal {
		return true
	}
	if hasAbilityTaskField(output) || hasArtifactOutputField(output) {
		return true
	}
	content := normalizeMap(output["content"])
	return len(content) > 0 && (hasAbilityTaskField(content) || hasArtifactOutputField(content) || firstText(content["format"]) != "")
}

func repairAgentResultContent(content map[string]any, output map[string]any, validation *ResultValidation) map[string]any {
	if len(content) == 0 {
		text := strings.TrimSpace(firstText(output["text"]))
		if text == "" {
			return content
		}
		content = map[string]any{
			"format": "markdown",
			"text":   text,
		}
		validation.addRepair("缺少 content，已用 text 补 markdown content。")
	}

	format := strings.ToLower(strings.TrimSpace(firstText(content["format"], output["format"])))
	rich := normalizeMap(firstPresent(content, "rich"))
	if len(rich) == 0 {
		rich = normalizeMap(output["rich"])
	}
	if needsRichJSON(output, content, rich) {
		format = "rich_json"
		if len(rich) == 0 {
			rich = buildRichDoc(firstText(output["text"], content["text"]), collectRichMedia(output, content, firstText(output["text"], content["text"])))
			validation.addRepair("rich_json 结果缺少 rich，已根据 text/media 生成 Tiptap doc。")
		}
		if len(rich) == 0 {
			rich = map[string]any{
				"type":    "doc",
				"content": []any{richTextNode("paragraph", nil, firstText(output["text"], content["text"]))},
			}
		}
		rich = normalizeRichDoc(rich)
		if firstText(rich["type"]) != "doc" {
			rich = map[string]any{"type": "doc", "content": normalizeRichNodeContent(rich)}
			validation.addRepair("rich 不是 Tiptap doc，已包装为 doc。")
		}
		if len(richContent(rich)) == 0 {
			rich["content"] = []any{richTextNode("paragraph", nil, firstText(output["text"], content["text"]))}
			validation.addRepair("rich.content 为空，已补入文本段落。")
		}
		content["rich"] = rich
	}
	if format == "" {
		format = "markdown"
		validation.addRepair("content.format 为空，已补为 markdown。")
	}
	content["format"] = format
	if text := strings.TrimSpace(firstText(output["text"], content["text"])); text != "" {
		content["text"] = text
	}
	return content
}

func needsRichJSON(output map[string]any, content map[string]any, rich map[string]any) bool {
	if strings.EqualFold(firstText(content["format"], output["format"]), "rich_json") {
		return true
	}
	if len(rich) > 0 || len(normalizeMap(output["rich"])) > 0 {
		return true
	}
	return hasAbilityTaskField(output) || hasAbilityTaskField(content)
}

func repairAgentResultTasks(output map[string]any, content map[string]any, validation *ResultValidation) {
	tasks := ExtractAbilityTasks(output)
	if len(tasks) == 0 {
		return
	}
	rows := make([]map[string]any, 0, len(tasks))
	for _, task := range tasks {
		if task.PlaceholderID == "" {
			validation.addRepair(fmt.Sprintf("素材任务 %s 缺少 placeholder_id，无法绑定插入位置。", task.ID))
		}
		rows = append(rows, map[string]any{
			"id":             task.ID,
			"title":          task.Title,
			"kind":           task.Kind,
			"execution":      task.Execution,
			"placeholder_id": task.PlaceholderID,
			"sort":           task.Sort,
			"action": map[string]any{
				"type":             task.Action.Type,
				"power":            task.Action.Power,
				"input":            task.Action.Input,
				"options":          task.Action.Options,
				"protocol":         task.Action.Protocol,
				"kind":             task.Action.Kind,
				"source_target_id": task.Action.SourceTargetID,
			},
		})
	}
	output["tasks"] = rows
	if len(content) > 0 {
		content["tasks"] = rows
		output["content"] = content
	}
	ensureTaskPlaceholders(output, tasks, validation)
}

func ensureTaskPlaceholders(output map[string]any, tasks []AbilityTask, validation *ResultValidation) {
	content := cloneMap(normalizeMap(output["content"]))
	rich := normalizeMap(firstPresent(content, "rich"))
	if len(rich) == 0 {
		rich = normalizeMap(output["rich"])
	}
	if len(rich) == 0 {
		return
	}
	existing := placeholderIDSet(rich)
	nodes := richContent(rich)
	for _, task := range tasks {
		placeholderID := strings.TrimSpace(task.PlaceholderID)
		if placeholderID == "" {
			continue
		}
		if existing[placeholderID] {
			continue
		}
		nodes = append(nodes, map[string]any{
			"type": "agentAbilityPlaceholder",
			"attrs": map[string]any{
				"placeholder_id": placeholderID,
				"kind":           task.Kind,
				"title":          firstText(task.Title, task.Kind, task.Action.Power, "素材任务"),
			},
		})
		existing[placeholderID] = true
		validation.addRepair(fmt.Sprintf("rich 缺少素材占位 %s，已补入占位节点。", placeholderID))
	}
	rich["content"] = nodes
	output["rich"] = rich
	if len(content) > 0 {
		content["rich"] = rich
		content["format"] = "rich_json"
		output["content"] = content
	}
}

func placeholderIDSet(value any) map[string]bool {
	result := map[string]bool{}
	collectPlaceholderIDSet(value, result)
	return result
}

func collectPlaceholderIDSet(value any, result map[string]bool) {
	switch current := value.(type) {
	case map[string]any:
		nodeType := strings.TrimSpace(firstText(current["type"]))
		if nodeType == "agentAbilityPlaceholder" || nodeType == "agentTaskPlaceholder" {
			attrs := normalizeMap(current["attrs"])
			if id := strings.TrimSpace(firstText(attrs["placeholder_id"], attrs["placeholderId"], attrs["id"], current["id"])); id != "" {
				result[id] = true
			}
		}
		collectPlaceholderIDSet(current["content"], result)
	case []any:
		for _, item := range current {
			collectPlaceholderIDSet(item, result)
		}
	case []map[string]any:
		for _, item := range current {
			collectPlaceholderIDSet(item, result)
		}
	}
}
