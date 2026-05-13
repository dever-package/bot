package agent

import (
	"strings"

	frontstream "my/package/front/service/stream"
)

type agentAction struct {
	Type           string
	Power          string
	Input          map[string]any
	Options        map[string]any
	Suggestions    []map[string]any
	Protocol       string
	Kind           string
	SourceTargetID uint64
}

func extractAgentAction(text string) (string, agentAction, bool) {
	clean, raw, ok := extractJSONFence(text, []string{"agent-action", "json"}, validAgentAction)
	if !ok {
		return text, agentAction{}, false
	}
	action, ok := normalizeAgentAction(raw)
	if !ok {
		return text, agentAction{}, false
	}
	return clean, action, true
}

func validAgentAction(raw map[string]any) bool {
	_, ok := normalizeAgentAction(raw)
	return ok
}

func normalizeAgentAction(raw map[string]any) (agentAction, bool) {
	if len(raw) == 0 {
		return agentAction{}, false
	}
	actionType := strings.ToLower(strings.TrimSpace(firstText(raw["type"], raw["action"])))
	if actionType != "call_power" && actionType != "power" {
		return agentAction{}, false
	}
	power := strings.TrimSpace(firstText(raw["power"], raw["name"], raw["ability"]))
	if power == "" {
		return agentAction{}, false
	}

	input := normalizeMap(raw["input"])
	if len(input) == 0 {
		input = normalizeMap(raw["params"])
	}
	if len(input) == 0 {
		input = normalizeMap(raw["arguments"])
	}

	return agentAction{
		Type:           "call_power",
		Power:          power,
		Input:          input,
		Options:        normalizeMap(raw["options"]),
		Suggestions:    normalizeAgentSuggestions(raw["suggestions"]),
		Protocol:       strings.TrimSpace(firstText(raw["protocol"])),
		Kind:           strings.TrimSpace(firstText(raw["kind"])),
		SourceTargetID: uint64(frontstream.InputInt64(firstPresent(raw, "source_target_id", "sourceTargetId", "target_id", "targetId"), 0)),
	}, true
}

func firstPresent(source map[string]any, keys ...string) any {
	for _, key := range keys {
		if value, exists := source[key]; exists {
			return value
		}
	}
	return nil
}
