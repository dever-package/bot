package protocol

import (
	"strings"
)

type RequestParts struct {
	Set     map[string]any
	Input   map[string]any
	History []any
	Options map[string]any
}

func NormalizeRequestParts(body map[string]any) RequestParts {
	return RequestParts{
		Set:     normalizeBodyMap(body, "set"),
		Input:   normalizeBodyMap(body, "input"),
		History: normalizeAnyList(body["history"]),
		Options: normalizeBodyMap(body, "options"),
	}
}

func normalizeRequestParts(body map[string]any) RequestParts {
	return NormalizeRequestParts(body)
}

func normalizeBodyMap(body map[string]any, key string) map[string]any {
	if body == nil {
		return map[string]any{}
	}
	if mapped := normalizeMap(body[key]); mapped != nil {
		return mapped
	}
	return map[string]any{}
}

func cloneBody(body map[string]any) map[string]any {
	result := make(map[string]any, len(body))
	for key, value := range body {
		result[key] = value
	}
	return result
}

func NormalizeRequestBody(body map[string]any) map[string]any {
	next := cloneBody(body)
	if next == nil {
		next = map[string]any{}
	}

	if strings.TrimSpace(asText(next["mode"])) == "" {
		next["mode"] = "normalize"
	}

	options := normalizeMap(next["options"])
	if options == nil {
		options = map[string]any{}
		next["options"] = options
	}
	if input := normalizeMap(next["input"]); input == nil {
		next["input"] = map[string]any{}
	}

	power := strings.TrimSpace(asText(next["power"]))
	if power != "" {
		next["power"] = power
	}

	protocol := strings.ToLower(strings.TrimSpace(asText(next["protocol"])))
	if protocol == "shemic" {
		if strings.TrimSpace(asText(next["name"])) == "" && power != "" {
			next["name"] = power
		}
		if strings.TrimSpace(asText(next["kind"])) == "" {
			next["kind"] = "llm.chat"
		}
		return next
	}

	if messages := BuildOpenAIMessages(next); len(messages) > 0 {
		next["messages"] = messages
	} else {
		delete(next, "messages")
	}
	for key, value := range options {
		if _, exists := next[key]; !exists {
			next[key] = value
		}
	}
	return next
}

func IsStreamEnabled(body map[string]any) bool {
	if body == nil {
		return false
	}
	options := normalizeMap(body["options"])
	return isTruthy(options["stream"])
}
