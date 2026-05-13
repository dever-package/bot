package agent

import (
	"encoding/json"
	"strings"
)

func extractJSONFence(text string, languages []string, accept func(map[string]any) bool) (string, map[string]any, bool) {
	for _, lang := range languages {
		clean, payload, ok := extractJSONFenceByLang(text, lang, accept)
		if ok {
			return clean, payload, true
		}
	}
	return text, nil, false
}

func extractJSONFenceByLang(text string, lang string, accept func(map[string]any) bool) (string, map[string]any, bool) {
	open := "```" + lang
	start := strings.Index(text, open)
	if start < 0 {
		return text, nil, false
	}

	bodyStart := start + len(open)
	for bodyStart < len(text) && isFenceWhitespace(text[bodyStart]) {
		bodyStart++
	}

	endOffset := strings.Index(text[bodyStart:], "```")
	if endOffset < 0 {
		return text, nil, false
	}
	end := bodyStart + endOffset

	var payload map[string]any
	if err := json.Unmarshal([]byte(strings.TrimSpace(text[bodyStart:end])), &payload); err != nil {
		return text, nil, false
	}
	if !accept(payload) {
		return text, nil, false
	}

	clean := strings.TrimSpace(text[:start] + text[end+3:])
	return clean, payload, true
}

func isFenceWhitespace(value byte) bool {
	return value == ' ' || value == '\t' || value == '\r' || value == '\n'
}
