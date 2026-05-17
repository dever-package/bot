package protocol

import (
	"encoding/json"
	"strings"
)

func ExtractStreamOutput(raw string) Output {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return nil
	}
	if strings.EqualFold(raw, "[DONE]") {
		return Output{"event": "end"}
	}

	var payload any
	if err := json.Unmarshal([]byte(raw), &payload); err != nil {
		return Output{"event": "delta", "text": raw}
	}
	return extractStreamPayload(payload)
}

func MergeStreamResult(outputs []Output) Output {
	textParts := make([]string, 0)
	reasoningParts := make([]string, 0)
	result := Output{}

	for _, output := range outputs {
		if output == nil {
			continue
		}
		event := strings.ToLower(strings.TrimSpace(asText(output["event"])))
		if text := strings.TrimSpace(asText(output["text"])); text != "" {
			switch event {
			case "reasoning":
				reasoningParts = append(reasoningParts, text)
			case "start", "progress", "status", "control", "warning", "end":
			default:
				textParts = append(textParts, text)
			}
		}
		if text := strings.TrimSpace(asText(output["reasoning"])); text != "" {
			reasoningParts = append(reasoningParts, text)
		}
		copyFirstOutputValue(result, output, "title")
		copyFirstOutputValue(result, output, "rich")
		appendOutputList(result, "images", output["images"], output["image"])
		appendOutputList(result, "videos", output["videos"], output["video"])
		appendOutputList(result, "audios", output["audios"], output["audio"])
		appendOutputList(result, "files", output["files"], output["file"])
	}
	if len(textParts) > 0 {
		result["text"] = strings.Join(textParts, "")
	}
	if len(reasoningParts) > 0 {
		result["reasoning"] = strings.Join(reasoningParts, "")
	}
	return result
}

func extractStreamPayload(payload any) Output {
	switch current := payload.(type) {
	case map[string]any:
		if output := extractOpenAIStreamOutput(current); len(output) > 0 {
			return output
		}
		if outputValue, exists := current["output"]; exists {
			return normalizeOutputValue(outputValue)
		}
		if hasOutputField(current) {
			return normalizeOutput(current)
		}
		return Output{"event": "delta", "json": current}
	default:
		return normalizeOutputValue(current)
	}
}

func extractOpenAIStreamOutput(mapped map[string]any) Output {
	choices := normalizeAnyList(mapped["choices"])
	if len(choices) == 0 {
		return nil
	}

	choice, _ := choices[0].(map[string]any)
	if choice == nil {
		return nil
	}

	output := Output{}
	if delta, ok := choice["delta"].(map[string]any); ok {
		if text := firstText(delta["reasoning_content"], delta["reasoning"], delta["reasoning_text"]); text != "" {
			output["event"] = "reasoning"
			output["reasoning"] = text
		}
		if text := strings.TrimSpace(asText(delta["content"])); text != "" {
			if output["event"] == nil {
				output["event"] = "delta"
			}
			output["text"] = text
		}
	}
	if text := strings.TrimSpace(asText(choice["text"])); text != "" {
		if output["event"] == nil {
			output["event"] = "delta"
		}
		output["text"] = text
	}
	if finishReason := strings.TrimSpace(asText(choice["finish_reason"])); finishReason != "" {
		output["event"] = "end"
		output["text"] = finishReason
	}
	return normalizeOutput(output)
}
