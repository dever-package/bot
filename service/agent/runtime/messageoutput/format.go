package messageoutput

import (
	"encoding/json"
	"fmt"
	"strings"

	runtimeartifact "github.com/dever-package/bot/service/agent/runtime/artifact"
)

func Format(output any, artifacts []map[string]any) map[string]any {
	result := Merge(output, nil)
	if len(artifacts) > 0 {
		result["artifacts"] = artifacts
		hydrateActivityArtifacts(result, artifacts)
	}
	sanitizeActivityErrors(result)
	return result
}

func Merge(base any, extras map[string]any) map[string]any {
	result := outputMap(base)
	for key, value := range extras {
		result[key] = value
	}
	return result
}

func outputMap(value any) map[string]any {
	if raw, ok := value.(string); ok {
		value = decodeJSON(raw)
	}
	if values, ok := value.(map[string]any); ok {
		result := make(map[string]any, len(values))
		for key, current := range values {
			result[key] = current
		}
		return result
	}
	encoded, err := json.Marshal(value)
	if err != nil {
		return map[string]any{}
	}
	decoded := decodeJSON(string(encoded))
	if values, ok := decoded.(map[string]any); ok {
		return values
	}
	return map[string]any{}
}

func decodeJSON(value string) any {
	value = strings.TrimSpace(value)
	if value == "" {
		return map[string]any{}
	}
	var result any
	if err := json.Unmarshal([]byte(value), &result); err != nil {
		return value
	}
	return result
}

func hydrateActivityArtifacts(output map[string]any, artifacts []map[string]any) {
	activities, ok := output["activities"].([]any)
	if !ok {
		return
	}
	byBatch := make(map[string][]map[string]any)
	for _, artifact := range artifacts {
		batchKey := strings.TrimSpace(fmt.Sprint(artifact["batch_key"]))
		if batchKey != "" {
			byBatch[batchKey] = append(byBatch[batchKey], artifact)
		}
	}
	for _, value := range activities {
		activity, currentOK := value.(map[string]any)
		if !currentOK {
			continue
		}
		meta, _ := activity["meta"].(map[string]any)
		callID := strings.TrimSpace(fmt.Sprint(meta["tool_call_id"]))
		if current := byBatch[callID]; len(current) > 0 {
			activity["artifacts"] = current
		}
	}
}

func sanitizeActivityErrors(output map[string]any) {
	activities, ok := output["activities"].([]any)
	if !ok {
		return
	}
	for _, value := range activities {
		activity, currentOK := value.(map[string]any)
		if !currentOK {
			continue
		}
		meta, _ := activity["meta"].(map[string]any)
		if !strings.EqualFold(strings.TrimSpace(fmt.Sprint(meta["tool_status"])), "failed") {
			continue
		}
		message := runtimeartifact.FailureText(fmt.Sprint(meta["tool_kind"]))
		if message != "" {
			activity["text"] = message
			activity["error"] = message
		}
	}
}
