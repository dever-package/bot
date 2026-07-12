package loop

import (
	"strings"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func (state *runState) RecordToolActivity(output map[string]any) {
	if len(output) == 0 {
		return
	}
	activity := cloneActivityOutput(output)
	activity["anchor_text"] = strings.TrimSpace(state.lastText)
	activityID := toolActivityID(activity)
	for index, current := range state.activities {
		if activityID != "" && toolActivityID(current) == activityID {
			state.activities[index] = activity
			return
		}
	}
	state.activities = append(state.activities, activity)
}

func cloneActivityOutput(output map[string]any) map[string]any {
	result := make(map[string]any, len(output)+1)
	for key, value := range output {
		result[key] = value
	}
	return result
}

func toolActivityID(output map[string]any) string {
	meta, _ := output["meta"].(map[string]any)
	return strings.TrimSpace(botprotocol.AsText(meta["tool_call_id"]))
}
