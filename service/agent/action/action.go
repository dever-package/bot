package action

import (
	"strings"

	frontstream "my/package/front/service/stream"
)

type Action struct {
	Type           string
	Power          string
	Input          map[string]any
	Options        map[string]any
	Suggestions    []map[string]any
	Protocol       string
	Kind           string
	SourceTargetID uint64
}

func ExtractAgentAction(text string) (string, Action, bool) {
	clean, raw, ok := extractJSONFence(text, []string{"agent-action"}, validAgentAction)
	if !ok {
		return text, Action{}, false
	}
	action, ok := normalizeAgentAction(raw)
	if !ok {
		return text, Action{}, false
	}
	return clean, action, true
}

func validAgentAction(raw map[string]any) bool {
	_, ok := normalizeAgentAction(raw)
	return ok
}

func normalizeAgentAction(raw map[string]any) (Action, bool) {
	if len(raw) == 0 {
		return Action{}, false
	}
	actionType := strings.ToLower(strings.TrimSpace(firstText(raw["type"], raw["action"])))
	if actionType != "call_power" && actionType != "power" {
		return Action{}, false
	}
	power := strings.TrimSpace(firstText(raw["power"], raw["name"]))
	if power == "" {
		return Action{}, false
	}

	input := normalizeMap(raw["input"])
	if len(input) == 0 {
		input = normalizeMap(raw["params"])
	}
	if len(input) == 0 {
		input = normalizeMap(raw["arguments"])
	}

	return Action{
		Type:           "call_power",
		Power:          power,
		Input:          input,
		Options:        normalizeMap(raw["options"]),
		Suggestions:    NormalizeSuggestions(raw["suggestions"]),
		Protocol:       strings.TrimSpace(firstText(raw["protocol"])),
		Kind:           strings.TrimSpace(firstText(raw["kind"])),
		SourceTargetID: uint64(frontstream.InputInt64(firstPresent(raw, "source_target_id", "sourceTargetId", "target_id", "targetId"), 0)),
	}, true
}
