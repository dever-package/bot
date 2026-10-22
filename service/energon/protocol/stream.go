package protocol

import (
	"encoding/json"
	"strings"
)

func ExtractStreamOutput(raw string) Output {
	output, _ := DecodeStreamOutput(raw)
	return output
}

// DecodeStreamOutput shares the decoded payload with usage consumers.
func DecodeStreamOutput(raw string) (Output, any) {
	if raw == "" {
		return nil, nil
	}
	if strings.EqualFold(strings.TrimSpace(raw), "[DONE]") {
		return Output{"event": "end"}, nil
	}

	var payload any
	if err := json.Unmarshal([]byte(raw), &payload); err != nil {
		return Output{"event": "delta", "text": raw}, nil
	}
	return extractStreamPayload(payload), payload
}

// DecodeOpenAIStreamOutput 只接收 choices 中声明的正文、推理和工具字段。
// 非 JSON、未知对象和 usage/role 分片都不能被转成用户正文；usage 仍交给计费读取。
func DecodeOpenAIStreamOutput(raw string) (Output, any) {
	if strings.EqualFold(strings.TrimSpace(raw), "[DONE]") {
		return Output{"event": "end"}, nil
	}
	var payload any
	if err := json.Unmarshal([]byte(raw), &payload); err != nil {
		return nil, nil
	}
	return ExtractOpenAIStreamFinal(payload), payload
}

// ExtractOpenAIStreamFinal 将整块 JSON 响应限制在与 SSE 相同的字段合同内。
func ExtractOpenAIStreamFinal(value any) Output {
	mapped, ok := value.(map[string]any)
	if !ok {
		return nil
	}
	return extractOpenAIStreamOutput(mapped)
}

func MergeStreamResult(outputs []Output) Output {
	return mergeStreamResult(outputs, nil)
}

func mergeStreamResult(outputs []Output, accumulated *ToolCallAccumulator) Output {
	textParts := make([]string, 0)
	reasoningParts := make([]string, 0)
	result := Output{}
	toolCalls := accumulated
	if toolCalls == nil {
		toolCalls = &ToolCallAccumulator{}
	}

	for _, output := range outputs {
		if output == nil {
			continue
		}
		event := strings.ToLower(strings.TrimSpace(asText(output["event"])))
		if text := firstNonEmptyStreamText(output["text"]); text != "" {
			switch event {
			case "reasoning":
				reasoningParts = append(reasoningParts, text)
			case "start", "progress", "status", "control", "warning", "end":
			default:
				textParts = append(textParts, text)
			}
		}
		if text := firstNonEmptyStreamText(output["reasoning"]); text != "" {
			reasoningParts = append(reasoningParts, text)
		}
		copyFirstOutputValue(result, output, "title")
		copyFirstOutputValue(result, output, "rich")
		if lyrics := ExtractLyrics(output); lyrics != "" {
			result["lyrics"] = mergeStreamText(asText(result["lyrics"]), lyrics)
		}
		if reason := strings.TrimSpace(asText(output["finish_reason"])); reason != "" {
			result["finish_reason"] = reason
		}
		if accumulated == nil {
			toolCalls.Append(ParseToolCalls(output["tool_calls"]))
		}
		appendOutputList(result, "images", output["images"], output["image"])
		appendOutputList(result, "videos", output["videos"], output["video"])
		appendOutputList(result, "audios", output["audios"], output["audio"])
		appendOutputList(result, "files", output["files"], output["file"])
		appendOutputItems(result, "media_files", output["media_files"])
	}
	if len(textParts) > 0 {
		result["text"] = strings.Join(textParts, "")
	}
	if len(reasoningParts) > 0 {
		result["reasoning"] = strings.Join(reasoningParts, "")
	}
	if calls := toolCalls.Snapshot(); len(calls) > 0 {
		result["event"] = "tool_call"
		result["tool_calls"] = ToolCallsValue(calls)
		normalizeToolCallOutputText(result, calls)
	}
	return result
}

// MergeStreamFinal keeps accumulated deltas when a provider returns only a
// partial final frame, while still accepting a complete final result.
func MergeStreamFinal(outputs []Output, final Output) Output {
	return MergeStreamFinalWithTools(outputs, final, nil)
}

// MergeStreamFinalWithTools reuses the tools already accumulated for previews.
func MergeStreamFinalWithTools(outputs []Output, final Output, tools *ToolCallAccumulator) Output {
	result := mergeStreamResult(outputs, tools)
	for key, value := range final {
		if isEmptyProtocolValue(value) {
			continue
		}
		switch key {
		case "text", "reasoning":
			result[key] = mergeStreamText(asText(result[key]), asText(value))
		case "tool_calls":
			result[key] = ToolCallsValue(MergeToolCalls(
				ParseToolCalls(result[key]),
				ParseToolCalls(value),
			))
		default:
			result[key] = value
		}
	}
	if calls := ParseToolCalls(result["tool_calls"]); len(calls) > 0 {
		result["event"] = "tool_call"
		result["tool_calls"] = ToolCallsValue(calls)
		normalizeToolCallOutputText(result, calls)
	}
	return result
}

func mergeStreamText(streamed string, final string) string {
	if streamed == "" {
		return final
	}
	if final == "" || streamed == final {
		return streamed
	}
	if strings.Contains(final, streamed) {
		return final
	}
	if strings.Contains(streamed, final) {
		return streamed
	}
	if len([]rune(final)) > len([]rune(streamed)) {
		return final
	}
	return streamed
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

	// SSE 中也可能携带完整 message，复用普通响应解析以保留工具调用。
	if _, complete := choice["message"].(map[string]any); complete {
		if output, ok := extractOpenAIOutput(mapped); ok {
			// 一份完整 message 也可同时说明目的和调用工具，正文必须先投递。
			if firstNonEmptyStreamText(output["text"]) != "" {
				output["event"] = "delta"
			}
			return normalizeOutput(output)
		}
	}

	output := Output{}
	if delta, ok := choice["delta"].(map[string]any); ok {
		if text := firstNonEmptyStreamText(delta["reasoning_content"], delta["reasoning"], delta["reasoning_text"]); text != "" {
			output["event"] = "reasoning"
			output["reasoning"] = text
		}
		if text := firstNonEmptyStreamText(delta["content"]); text != "" {
			output["event"] = "delta"
			output["text"] = text
		}
		if calls := ParseToolCalls(delta["tool_calls"]); len(calls) > 0 {
			if firstNonEmptyStreamText(output["text"]) == "" {
				output["event"] = "tool_call_delta"
			}
			output["tool_calls"] = ToolCallFragmentsValue(calls)
		}
	}
	if text := firstNonEmptyStreamText(choice["text"]); text != "" {
		output["event"] = "delta"
		output["text"] = text
	}
	if finishReason := strings.TrimSpace(asText(choice["finish_reason"])); finishReason != "" {
		output["finish_reason"] = finishReason
		if strings.TrimSpace(asText(output["event"])) == "" {
			output["event"] = "end"
		}
	}
	return normalizeOutput(output)
}

func firstNonEmptyStreamText(values ...any) string {
	for _, value := range values {
		if text := contentText(value); text != "" {
			return text
		}
	}
	return ""
}

func contentText(value any) string {
	switch current := value.(type) {
	case string:
		return current
	case []any:
		parts := make([]string, 0, len(current))
		for _, item := range current {
			if text := strings.TrimSpace(contentText(item)); text != "" {
				parts = append(parts, text)
			}
		}
		return strings.Join(parts, "")
	case []map[string]any:
		parts := make([]string, 0, len(current))
		for _, item := range current {
			if text := strings.TrimSpace(contentText(item)); text != "" {
				parts = append(parts, text)
			}
		}
		return strings.Join(parts, "")
	case map[string]any:
		for _, key := range []string{"text", "output_text", "content"} {
			if text := contentText(current[key]); text != "" {
				return text
			}
		}
		return ""
	default:
		return asText(current)
	}
}
