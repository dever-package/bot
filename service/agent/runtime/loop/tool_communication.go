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

func lengthContinuationInput() map[string]any {
	return runtimeEventInput("output_truncated", nil)
}

func deliveryContinuationInput() map[string]any {
	return runtimeEventInput("delivery_required", nil)
}

func completionContinuationInput(nextAction string, nextTool string) map[string]any {
	values := map[string]any{}
	if nextAction = strings.TrimSpace(nextAction); nextAction != "" {
		values["next_action"] = nextAction
	}
	if nextTool = strings.TrimSpace(nextTool); nextTool != "" {
		values["next_tool"] = nextTool
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
