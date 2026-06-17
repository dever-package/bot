package action

import (
	"encoding/json"
	"strings"

	frontstream "my/package/front/service/stream"
)

type Action struct {
	Type           string
	Power          string
	Tool           string
	Skill          string
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
	switch actionType {
	case "power":
		actionType = "call_power"
	case "tool":
		actionType = "call_tool"
	}
	if actionType != "call_power" && actionType != "call_tool" {
		return Action{}, false
	}

	input := normalizeMap(raw["input"])
	if len(input) == 0 {
		input = normalizeMap(raw["params"])
	}
	if len(input) == 0 {
		input = normalizeMap(raw["arguments"])
	}
	if actionType == "call_tool" {
		input = mergeTopLevelToolInput(input, raw)
	}

	action := Action{
		Type:           actionType,
		Input:          input,
		Options:        normalizeMap(raw["options"]),
		Suggestions:    NormalizeSuggestions(raw["suggestions"]),
		Protocol:       strings.TrimSpace(firstText(raw["protocol"])),
		Kind:           strings.TrimSpace(firstText(raw["kind"])),
		SourceTargetID: uint64(frontstream.InputInt64(firstPresent(raw, "source_target_id", "sourceTargetId", "target_id", "targetId"), 0)),
	}
	switch actionType {
	case "call_power":
		action.Power = strings.TrimSpace(firstText(raw["power"], raw["name"]))
		if action.Power == "" {
			return Action{}, false
		}
	case "call_tool":
		action.Tool = strings.TrimSpace(firstText(raw["tool"], raw["name"]))
		action.Skill = strings.TrimSpace(firstText(raw["skill"], raw["skill_key"], raw["skillKey"]))
		if action.Tool == "" {
			return Action{}, false
		}
	}
	return action, true
}

func mergeTopLevelToolInput(input map[string]any, raw map[string]any) map[string]any {
	result := cloneMap(input)
	for _, key := range []string{
		"command", "curl", "text",
		"url", "uri", "endpoint", "method", "headers", "query", "body", "data", "payload", "json",
		"script", "path", "file", "dir", "directory", "args", "arguments",
		"route", "api", "server", "timeout_seconds", "timeoutSeconds",
		"knowledge_base_id", "knowledgeBaseId", "base_id", "baseId",
		"agent_id", "agentId",
		"node_id", "nodeId", "parent_id", "parentId",
		"edge_types", "edgeTypes", "edge_type", "edgeType",
		"limit", "depth",
	} {
		if _, exists := result[key]; exists {
			continue
		}
		if value, exists := raw[key]; exists {
			result[key] = value
		}
	}
	return result
}

func ActionSignature(action Action) string {
	payload := map[string]any{
		"type":             strings.TrimSpace(action.Type),
		"power":            strings.TrimSpace(action.Power),
		"tool":             strings.TrimSpace(action.Tool),
		"skill":            strings.TrimSpace(action.Skill),
		"input":            action.Input,
		"options":          action.Options,
		"protocol":         strings.TrimSpace(action.Protocol),
		"kind":             strings.TrimSpace(action.Kind),
		"source_target_id": action.SourceTargetID,
	}
	raw, err := json.Marshal(payload)
	if err != nil {
		return ""
	}
	return string(raw)
}
