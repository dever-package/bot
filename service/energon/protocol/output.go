package protocol

import (
	"strings"
)

type Output map[string]any

func StripOutputProgress(output Output) {
	if output == nil {
		return
	}
	delete(output, "progress")
	if meta := normalizeMap(output["meta"]); meta != nil {
		delete(meta, "progress")
		delete(meta, "percent")
	}
}

var (
	scalarOutputKeys  = []string{"event", "title", "text", "reasoning", "progress", "error", "json"}
	mediaOutputFields = []struct {
		Target  string
		Sources []string
	}{
		{Target: "images", Sources: []string{"images", "image"}},
		{Target: "videos", Sources: []string{"videos", "video"}},
		{Target: "audios", Sources: []string{"audios", "audio"}},
		{Target: "files", Sources: []string{"files", "file"}},
	}
)

func ExtractOutput(value any) Output {
	if value == nil {
		return Output{}
	}

	mapped, ok := value.(map[string]any)
	if !ok {
		return normalizeOutputValue(value)
	}
	if outputValue, exists := mapped["output"]; exists {
		return normalizeOutputValue(outputValue)
	}

	if dataValue, exists := mapped["data"]; exists {
		if dataMap, ok := dataValue.(map[string]any); ok {
			if outputValue, hasOutput := dataMap["output"]; hasOutput {
				return normalizeOutputValue(outputValue)
			}
		}
	}
	if content, exists := extractOpenAIContentValue(mapped); exists {
		return normalizeOutputValue(map[string]any{"text": content})
	}

	return normalizeOutputValue(mapped)
}

func normalizeOutputValue(value any) Output {
	switch current := value.(type) {
	case nil:
		return Output{}
	case Output:
		return normalizeOutput(current)
	case map[string]any:
		return normalizeOutput(current)
	case string:
		text := strings.TrimSpace(current)
		if text == "" {
			return Output{}
		}
		return Output{"text": text}
	default:
		return Output{"json": current}
	}
}

func normalizeOutput(output map[string]any) Output {
	if len(output) == 0 {
		return Output{}
	}
	if !hasOutputField(output) {
		return Output{"json": output}
	}

	result := Output{}
	for _, key := range scalarOutputKeys {
		copyOutputValue(result, output, key)
	}
	if meta := normalizeMap(output["meta"]); len(meta) > 0 {
		result["meta"] = meta
	}
	for _, field := range mediaOutputFields {
		values := make([]any, 0, len(field.Sources))
		for _, source := range field.Sources {
			values = append(values, output[source])
		}
		appendOutputList(result, field.Target, values...)
	}
	return result
}

func hasOutputField(output map[string]any) bool {
	for _, key := range scalarOutputKeys {
		if _, exists := output[key]; exists {
			return true
		}
	}
	if _, exists := output["meta"]; exists {
		return true
	}
	for _, field := range mediaOutputFields {
		for _, key := range field.Sources {
			if _, exists := output[key]; exists {
				return true
			}
		}
	}
	return false
}

func copyOutputValue(target Output, source map[string]any, key string) {
	value, exists := source[key]
	if !exists || isEmptyProtocolValue(value) {
		return
	}
	target[key] = value
}

func copyFirstOutputValue(target Output, source Output, key string) {
	if _, exists := target[key]; exists {
		return
	}
	copyOutputValue(target, source, key)
}

func appendOutputList(target Output, key string, values ...any) {
	result := normalizeStringList(target[key])
	for _, value := range values {
		result = append(result, normalizeStringList(value)...)
	}
	if len(result) > 0 {
		target[key] = result
	}
}

func isEmptyProtocolValue(value any) bool {
	switch current := value.(type) {
	case nil:
		return true
	case string:
		return strings.TrimSpace(current) == ""
	case []any:
		return len(current) == 0
	case []string:
		return len(current) == 0
	default:
		return false
	}
}

func IsEmptyProtocolValue(value any) bool {
	return isEmptyProtocolValue(value)
}
