package agent

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/google/uuid"

	frontstream "my/package/front/service/stream"
)

func parseRunRequest(body map[string]any) (parsedRunRequest, error) {
	if body == nil {
		body = map[string]any{}
	}
	agentIdentity := firstText(body["agent"], body["agent_id"], body["agentId"])
	input := normalizeInput(body["input"])
	if len(input) == 0 {
		input = normalizeInput(firstText(body["text"], body["message"], body["prompt"]))
	}
	if len(input) == 0 || strings.TrimSpace(primaryInputText(input)) == "" {
		return parsedRunRequest{}, fmt.Errorf("任务输入不能为空")
	}

	history := normalizeHistory(body["history"])
	if len(history) == 0 {
		history = normalizeHistory(body["messages"])
	}

	return parsedRunRequest{
		AgentIdentity:  agentIdentity,
		Input:          input,
		History:        history,
		Options:        normalizeMap(body["options"]),
		SourceTargetID: uint64(frontstream.InputInt64(body["source_target_id"], 0)),
	}, nil
}

func resolveRequestID(req RunRequest) string {
	for _, current := range []string{
		headerValue(req.Headers, "X-Request-Id"),
		headerValue(req.Headers, "X-Request-ID"),
	} {
		if strings.TrimSpace(current) != "" {
			return strings.TrimSpace(current)
		}
	}
	return uuid.NewString()
}

func normalizeInput(raw any) map[string]any {
	if mapped := normalizeMap(raw); len(mapped) > 0 {
		return mapped
	}
	text := strings.TrimSpace(frontstream.InputText(raw))
	if text == "" {
		return map[string]any{}
	}
	return map[string]any{"text": text}
}

func normalizeMap(raw any) map[string]any {
	mapped, ok := raw.(map[string]any)
	if !ok || mapped == nil {
		return map[string]any{}
	}
	return mapped
}

func firstText(values ...any) string {
	for _, value := range values {
		if text := strings.TrimSpace(frontstream.InputText(value)); text != "" {
			return text
		}
	}
	return ""
}

func primaryInputText(input map[string]any) string {
	if input == nil {
		return ""
	}
	if text := strings.TrimSpace(frontstream.InputText(input["text"])); text != "" {
		return text
	}
	if text := strings.TrimSpace(frontstream.InputText(input["prompt"])); text != "" {
		return text
	}
	if text := strings.TrimSpace(frontstream.InputText(input["message"])); text != "" {
		return text
	}
	return strings.TrimSpace(jsonText(input))
}

func cloneMap(source map[string]any) map[string]any {
	if source == nil {
		return map[string]any{}
	}
	cloned := make(map[string]any, len(source))
	for key, item := range source {
		cloned[key] = item
	}
	return cloned
}

func jsonText(raw any) string {
	content, err := json.Marshal(raw)
	if err != nil {
		return ""
	}
	return string(content)
}

func normalizeHistory(raw any) []any {
	if rows, ok := raw.([]any); ok {
		return rows
	}
	return []any{}
}

func headerValue(headers map[string]string, key string) string {
	if headers == nil {
		return ""
	}
	if value := strings.TrimSpace(headers[key]); value != "" {
		return value
	}
	for currentKey, value := range headers {
		if strings.EqualFold(currentKey, key) {
			return strings.TrimSpace(value)
		}
	}
	return ""
}
