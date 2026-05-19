package action

import (
	"fmt"
	"strings"

	frontstream "my/package/front/service/stream"
)

const (
	TaskExecutionAsync = "async"
	TaskExecutionSync  = "sync"
)

type AbilityTask struct {
	ID            string
	Title         string
	Kind          string
	Execution     string
	PlaceholderID string
	Sort          int
	Action        Action
}

func ExtractAbilityTasks(output map[string]any) []AbilityTask {
	if len(output) == 0 {
		return nil
	}
	content := normalizeMap(output["content"])
	values := firstPresent(output, "tasks", "ability_tasks", "abilityTasks")
	if values == nil && len(content) > 0 {
		values = firstPresent(content, "tasks", "ability_tasks", "abilityTasks")
	}
	rows := normalizeTaskRows(values)
	if len(rows) == 0 {
		return nil
	}

	tasks := make([]AbilityTask, 0, len(rows))
	for index, row := range rows {
		task, ok := normalizeAbilityTask(row, index)
		if ok {
			tasks = append(tasks, task)
		}
	}
	return tasks
}

func StripAbilityTasks(output map[string]any) map[string]any {
	if len(output) == 0 {
		return output
	}
	next := cloneMap(output)
	delete(next, "tasks")
	delete(next, "ability_tasks")
	delete(next, "abilityTasks")
	content := cloneMap(normalizeMap(next["content"]))
	if len(content) > 0 {
		delete(content, "tasks")
		delete(content, "ability_tasks")
		delete(content, "abilityTasks")
		next["content"] = content
	}
	return next
}

func normalizeTaskRows(value any) []map[string]any {
	switch current := value.(type) {
	case []map[string]any:
		rows := make([]map[string]any, 0, len(current))
		for _, item := range current {
			if len(item) > 0 {
				rows = append(rows, item)
			}
		}
		return rows
	case []any:
		rows := make([]map[string]any, 0, len(current))
		for _, item := range current {
			if row := normalizeMap(item); len(row) > 0 {
				rows = append(rows, row)
			}
		}
		return rows
	default:
		if row := normalizeMap(value); len(row) > 0 {
			return []map[string]any{row}
		}
		return nil
	}
}

func normalizeAbilityTask(raw map[string]any, index int) (AbilityTask, bool) {
	actionRaw := cloneMap(normalizeMap(raw["action"]))
	if len(actionRaw) == 0 {
		actionRaw = cloneMap(raw)
	}
	action, ok := normalizeAgentAction(actionRaw)
	if !ok || strings.TrimSpace(action.Type) != "call_power" {
		return AbilityTask{}, false
	}
	if action.SourceTargetID == 0 {
		action.SourceTargetID = uint64(frontstream.InputInt64(firstPresent(raw, "source_target_id", "sourceTargetId", "target_id", "targetId"), 0))
	}

	placeholderID := strings.TrimSpace(firstText(raw["placeholder_id"], raw["placeholderId"], raw["target_id"], raw["targetId"]))
	id := strings.TrimSpace(firstText(raw["id"], raw["task_id"], raw["taskId"], placeholderID))
	if id == "" {
		id = fmt.Sprintf("task-%d", index+1)
	}
	title := strings.TrimSpace(firstText(raw["title"], raw["name"], raw["label"], action.Power))
	execution := normalizeTaskExecution(firstText(raw["execution"], raw["mode"], raw["run_mode"], raw["runMode"]))
	return AbilityTask{
		ID:            id,
		Title:         title,
		Kind:          strings.TrimSpace(firstText(raw["kind"], raw["media_type"], raw["mediaType"], action.Kind)),
		Execution:     execution,
		PlaceholderID: placeholderID,
		Sort:          int(frontstream.InputInt64(raw["sort"], int64(index+1))),
		Action:        action,
	}, true
}

func normalizeTaskExecution(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case TaskExecutionSync, "blocking", "sequential":
		return TaskExecutionSync
	default:
		return TaskExecutionAsync
	}
}
