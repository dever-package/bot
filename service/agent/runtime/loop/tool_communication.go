package loop

import (
	"strings"

	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
)

func runtimeEventInput(eventType string, values map[string]any) map[string]any {
	event := map[string]any{"type": eventType}
	for key, value := range values {
		event[key] = value
	}
	return map[string]any{"runtime_event": event}
}

func nextModelInput() map[string]any {
	return runtimeEventInput("tool_results_available", nil)
}

func (state *runState) continuationInput(input map[string]any) map[string]any {
	if state == nil || !state.isDocumentWriter() {
		return input
	}
	result := cloneMap(input)
	if result == nil {
		result = map[string]any{}
	}
	event, _ := result["runtime_event"].(map[string]any)
	event = cloneMap(event)
	if event == nil {
		event = map[string]any{}
	}
	event["write_target"] = "document"
	event["output_contract"] = runtimeprovider.ComposeDocumentOutputContract
	result["runtime_event"] = event
	return result
}

func lengthContinuationInput() map[string]any {
	return runtimeEventInput("output_truncated", nil)
}

func deliveryContinuationInput() map[string]any {
	return runtimeEventInput("delivery_required", nil)
}

func completionContinuationInput(missing string, dependency string, followUp string) map[string]any {
	values := map[string]any{}
	if missing = strings.TrimSpace(missing); missing != "" {
		values["missing"] = missing
	}
	if dependency = strings.TrimSpace(dependency); dependency != "" && dependency != completionDependencyNone {
		values["dependency"] = dependency
	}
	if followUp = strings.TrimSpace(followUp); followUp != "" && followUp != completionFollowUpNone {
		values["follow_up"] = followUp
	}
	return runtimeEventInput("completion_required", values)
}

func documentRewriteContinuationInput(missing string) map[string]any {
	values := map[string]any{
		"document_revision_mode": "replace_current_step",
		"revision_rule":          "只替换上一轮被拒绝的正文块，不重复更早已经保存的正文块",
	}
	if missing = strings.TrimSpace(missing); missing != "" {
		values["missing"] = missing
	}
	return runtimeEventInput("completion_required", values)
}

func shouldStreamToolActivity(definition runtimeprovider.Definition) bool {
	switch strings.ToLower(strings.TrimSpace(definition.Kind)) {
	case "control", "interaction", "presentation", "document":
		return false
	default:
		return true
	}
}
