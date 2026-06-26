package agent

import (
	"fmt"
	"strings"

	"github.com/google/uuid"

	agentskill "github.com/dever-package/bot/service/agent/skill"
	frontstream "github.com/dever-package/front/service/stream"
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
	assistantSessionID := uint64(frontstream.InputInt64(firstPresent(
		body["assistant_session_id"],
		body["assistantSessionId"],
		input["assistant_session_id"],
		input["assistantSessionId"],
	), 0))
	memoryEnabled := inputBool(firstPresent(
		body["memory_enabled"],
		body["memoryEnabled"],
		input["memory_enabled"],
		input["memoryEnabled"],
	), true)
	delete(input, "assistant_session_id")
	delete(input, "assistantSessionId")
	delete(input, "memory_enabled")
	delete(input, "memoryEnabled")

	return parsedRunRequest{
		AgentIdentity:      agentIdentity,
		Input:              input,
		History:            history,
		Options:            normalizeMap(body["options"]),
		SourceTargetID:     uint64(frontstream.InputInt64(body["source_target_id"], 0)),
		AssistantSessionID: assistantSessionID,
		MemoryEnabled:      memoryEnabled,
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
	return agentskill.NormalizeInput(raw)
}

func normalizeMap(raw any) map[string]any {
	return agentskill.NormalizeMap(raw)
}

func firstText(values ...any) string {
	return agentskill.FirstText(values...)
}

func firstPresent(values ...any) any {
	for _, value := range values {
		if value != nil {
			return value
		}
	}
	return nil
}

func inputBool(value any, fallback bool) bool {
	if value == nil {
		return fallback
	}
	if current, ok := value.(bool); ok {
		return current
	}
	switch strings.ToLower(strings.TrimSpace(frontstream.InputText(value))) {
	case "1", "true", "yes", "y", "on":
		return true
	case "0", "false", "no", "n", "off":
		return false
	default:
		return fallback
	}
}

func errorText(err error) string {
	if err == nil {
		return ""
	}
	return strings.TrimSpace(err.Error())
}

func primaryInputText(input map[string]any) string {
	return agentskill.PrimaryInputText(input)
}

func cloneMap(source map[string]any) map[string]any {
	return agentskill.CloneMap(source)
}

func jsonText(raw any) string {
	return agentskill.JSONText(raw)
}

func normalizeHistory(raw any) []any {
	if rows, ok := raw.([]any); ok {
		return rows
	}
	return []any{}
}

func headerValue(headers map[string]string, key string) string {
	return agentskill.HeaderValue(headers, key)
}
