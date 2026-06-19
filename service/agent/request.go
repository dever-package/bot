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
	return agentskill.NormalizeInput(raw)
}

func normalizeMap(raw any) map[string]any {
	return agentskill.NormalizeMap(raw)
}

func firstText(values ...any) string {
	return agentskill.FirstText(values...)
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
